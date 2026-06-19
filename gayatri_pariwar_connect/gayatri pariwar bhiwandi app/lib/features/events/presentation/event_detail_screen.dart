import 'dart:ui';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:youtube_player_iframe/youtube_player_iframe.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:flutter/services.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/utils/ui_utils.dart';
import '../../../core/auth/user_roles.dart';
import '../../auth/presentation/providers/auth_provider.dart';
import '../data/event_repository.dart';
import '../domain/global_event.dart';
import '../../../core/widgets/contact_person_card.dart';
import 'event_photo_viewer.dart';
import '../../../core/l10n/app_localizations.dart';

class EventDetailScreen extends ConsumerWidget {
  final String eventId;
  final GlobalEvent? event;

  const EventDetailScreen({
    super.key,
    required this.eventId,
    this.event,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final eventAsync = ref.watch(eventParamsStreamProvider(eventId));

    return eventAsync.when(
      data: (liveEvent) {
        final displayEvent = liveEvent ?? event;
        // If event is null in both live stream and initial passed param, show error
        // But if liveEvent is explicitly null (deleted?), we should probably show that.
        // However, the stream returns null if doc doesn't exist.
        if (displayEvent == null) {
          final l10n = AppLocalizations.of(context)!;
          return Scaffold(
            appBar: const _ErrorAppBar(),
            body: Center(child: Text(l10n.eventNotFound)),
          );
        }
        return _EventDetailContent(event: displayEvent);
      },
      loading: () {
        if (event != null) return _EventDetailContent(event: event!);
        return const Scaffold(
          body: Center(
            child: CircularProgressIndicator(color: AppColors.primarySaffron),
          ),
        );
      },
      error: (e, st) => Scaffold(
        appBar: const _ErrorAppBar(),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48, color: Colors.red),
              const SizedBox(height: 16),
              Text(e.toString()),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => context.pop(),
                child: Text(AppLocalizations.of(context)!.back),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ErrorAppBar extends StatelessWidget implements PreferredSizeWidget {
  const _ErrorAppBar();

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return AppBar(
      title: Text(l10n.error),
      backgroundColor: AppColors.primarySaffron,
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}

class _EventDetailContent extends ConsumerStatefulWidget {
  final GlobalEvent event;

  const _EventDetailContent({required this.event});

  @override
  ConsumerState<_EventDetailContent> createState() => _EventDetailContentState();
}

class _EventDetailContentState extends ConsumerState<_EventDetailContent> {
  YoutubePlayerController? _youtubeController;

  @override
  void initState() {
    super.initState();
    if (widget.event.youtubeUrl != null && widget.event.youtubeUrl!.isNotEmpty) {
      final videoId = YoutubePlayerController.convertUrlToId(widget.event.youtubeUrl!);
      if (videoId != null) {
        _youtubeController = YoutubePlayerController.fromVideoId(
          videoId: videoId,
          autoPlay: false,
          params: const YoutubePlayerParams(
            showControls: true,
            showFullscreenButton: true,
            mute: false,
          ),
        );
      }
    }
  }

  @override
  void dispose() {
    _youtubeController?.close();
    super.dispose();
  }

  @override
  void didUpdateWidget(_EventDetailContent oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.event.youtubeUrl != widget.event.youtubeUrl) {
      if (widget.event.youtubeUrl == null || widget.event.youtubeUrl!.isEmpty) {
        _youtubeController?.close();
        setState(() => _youtubeController = null);
      } else {
        _resetYoutubeController();
      }
    }
  }

  void _resetYoutubeController() {
    if (widget.event.youtubeUrl != null && widget.event.youtubeUrl!.isNotEmpty) {
      final videoId = YoutubePlayerController.convertUrlToId(widget.event.youtubeUrl!);
      if (videoId != null) {
        final oldController = _youtubeController;
        setState(() {
          _youtubeController = YoutubePlayerController.fromVideoId(
            videoId: videoId,
            autoPlay: false,
            params: const YoutubePlayerParams(
              showControls: true,
              showFullscreenButton: true,
              mute: false,
            ),
          );
        });
        oldController?.close();
      }
    }
  }

  Widget _buildBody(BuildContext context, WidgetRef ref, Widget? playerWidget) {
    final event = widget.event;
    final user = ref.watch(currentUserDataProvider).valueOrNull;
    final isAdmin = user?.role == UserRole.admin;
    final isGuruji = user?.role == UserRole.guruji;
    final canEdit = isAdmin || isGuruji;
    final effectiveEndDate = (event.isMultiDay && event.endDate != null) ? event.endDate! : event.eventDate;
    final isPast = effectiveEndDate.isBefore(DateTime.now());
    final isUpcoming = event.eventDate.isAfter(DateTime.now());
    final isOngoing = !isPast && !isUpcoming;

    if (kDebugMode) {
      print('🎯 EventDetailScreen: Viewing event ${event.id}');
      print('   Title: ${event.title}');
      print('   Can Edit: $canEdit');
    }

    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.eventDetails),
        backgroundColor: AppColors.primarySaffron,
        actions: [
          if (canEdit) ...[
            IconButton(
              icon: const Icon(Icons.edit),
              onPressed: () {
                context.push('/events/edit/${event.id}');
              },
              tooltip: l10n.editEvent,
            ),
            IconButton(
              icon: const Icon(Icons.delete),
              onPressed: () {
                _showDeleteDialog(context, ref, event);
              },
              tooltip: l10n.deleteEvent,
            ),
          ],
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Photo Gallery Banner
            if (event.photos.isNotEmpty)
              _PhotoGallery(photos: event.photos, eventTitle: event.title),

            // Embedded Media Tabs
            _MediaTabsSection(
              event: event,
              youtubePlayerWidget: playerWidget,
              youtubeController: _youtubeController,
              onResetYoutube: _resetYoutubeController,
            ),

            // Status Badge (compact, below photo gallery or media)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              child: Row(
                children: [
                  if (isPast)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.grey,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        AppLocalizations.of(context)!.pastEvent,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    )
                  else if (isOngoing)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.green,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        l10n.ongoing,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    )
                  else
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.primarySaffron,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        AppLocalizations.of(context)!.upcoming,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                ],
              ),
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title
                  Text(
                    event.title,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: isPast ? Colors.grey : null,
                        ),
                  ),
                  const SizedBox(height: 24),

                  // Date
                  _InfoRow(
                    icon: Icons.calendar_today,
                    label: AppLocalizations.of(context)!.date,
                    value: (event.isMultiDay && event.endDate != null)
                        ? '${DateFormat('dd MMM').format(event.eventDate)} - ${DateFormat('dd MMM yyyy').format(event.endDate!)}'
                        : DateFormat('dd MMM yyyy').format(event.eventDate),
                    isPast: isPast,
                  ),
                  const SizedBox(height: 16),

                  // Time
                  _InfoRow(
                    icon: Icons.access_time,
                    label: AppLocalizations.of(context)!.time,
                    value: event.hasTime
                        ? ((event.isMultiDay && event.endDate != null)
                            ? '${DateFormat('h:mm a').format(event.eventDate)} - ${DateFormat('h:mm a').format(event.endDate!)}'
                            : DateFormat('h:mm a').format(event.eventDate))
                        : 'All Day',
                    isPast: isPast,
                  ),
                  const SizedBox(height: 16),

                  // Location (tappable - opens Google Maps)
                  GestureDetector(
                    onTap: () async {
                      final query = Uri.encodeComponent(event.location);
                      final url = Uri.parse('https://www.google.com/maps/search/?api=1&query=$query');
                      if (await canLaunchUrl(url)) {
                        await launchUrl(url, mode: LaunchMode.externalApplication);
                      }
                    },
                    child: Row(
                      children: [
                        Expanded(
                          child: _InfoRow(
                            icon: Icons.location_on,
                            label: l10n.location,
                            value: event.location,
                            isPast: isPast,
                          ),
                        ),
                        const Icon(Icons.open_in_new, size: 18, color: Colors.grey),
                      ],
                    ),
                  ),

                  // Linked Group Button
                  if (event.linkedGroupId != null && event.linkedGroupId!.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Card(
                      elevation: 0,
                      color: Colors.green.shade50,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(color: Colors.green.shade200),
                      ),
                      child: ListTile(
                        leading: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.green.shade100,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(Icons.group, color: Colors.green),
                        ),
                        title: Text(
                          AppLocalizations.of(context)!.eventGroup,
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text(AppLocalizations.of(context)!.joinDiscussionGroup),
                        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                        onTap: () => context.push('/groups/${event.linkedGroupId}'),
                      ),
                    ),
                  ],

                  // Description
                  if (event.description.isNotEmpty) ...[
                    const SizedBox(height: 24),
                    const Divider(),
                    const SizedBox(height: 16),
                    const SizedBox(height: 16),
                    Text(
                      AppLocalizations.of(context)!.eventDescription,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      event.description,
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            color: isPast ? Colors.grey : null,
                          ),
                    ),
                  ],
                  
                  // Media Folder Link
                  if (event.mediaFolderPath != null && event.mediaFolderPath!.isNotEmpty) ...[
                    const SizedBox(height: 24),
                    const Divider(),
                    const SizedBox(height: 16),
                    Card(
                      elevation: 0, // Remove shadow
                      color: AppColors.primarySaffron.withValues(alpha: 0.1),
                      child: ListTile(
                        leading: const Icon(Icons.photo_library, color: AppColors.primarySaffron),
                        title: Text(AppLocalizations.of(context)!.additionalMediaAvailable),
                        subtitle: Text(AppLocalizations.of(context)!.viewMoreMedia),
                        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                        onTap: () {
                          // Navigate to media folder
                          final path = event.mediaFolderPath!;
                          // Use go_router to navigate to the media path
                          context.push(path);
                        },
                      ),
                    ),
                  ],

                  // Responsible Contact
                  ContactPersonCard(
                    name: event.contactName,
                    role: event.contactRole,
                    phone: event.contactPhone,
                    photoUrl: event.contactPhotoUrl,
                  ),

                  // External Links Section
                  if (event.youtubeUrl != null || event.instagramUrl != null) ...[
                    const SizedBox(height: 24),
                    const Divider(),
                    const SizedBox(height: 16),
                    if (event.youtubeUrl != null)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: OutlinedButton.icon(
                          onPressed: () async {
                            final uri = Uri.parse(event.youtubeUrl!);
                            if (await canLaunchUrl(uri)) {
                              await launchUrl(uri, mode: LaunchMode.externalApplication);
                            }
                          },
                          icon: Icon(Icons.smart_display, color: Colors.red.shade600),
                          label: const Text('Watch on YouTube'),
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            side: BorderSide(color: Colors.red.shade200),
                          ),
                        ),
                      ),
                    if (event.instagramUrl != null)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: OutlinedButton.icon(
                          onPressed: () async {
                            final uri = Uri.parse(event.instagramUrl!);
                            if (await canLaunchUrl(uri)) {
                              await launchUrl(uri, mode: LaunchMode.externalApplication);
                            }
                          },
                          icon: Icon(Icons.camera_alt, color: Colors.purple.shade600),
                          label: const Text('View on Instagram'),
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            side: BorderSide(color: Colors.purple.shade200),
                          ),
                        ),
                      ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_youtubeController != null) {
      final isPortraitVideo = widget.event.youtubeUrl?.contains('/shorts/') == true;
      
      return YoutubePlayerScaffold(
        controller: _youtubeController!,
        defaultOrientations: [DeviceOrientation.portraitUp],
        fullscreenOrientations: isPortraitVideo
            ? [DeviceOrientation.portraitUp, DeviceOrientation.portraitDown]
            : [DeviceOrientation.landscapeLeft, DeviceOrientation.landscapeRight],
        builder: (context, player) {
          return _buildBody(context, ref, player);
        },
      );
    }
    return _buildBody(context, ref, null);
  }
}

Future<void> _showDeleteDialog(BuildContext context, WidgetRef ref, GlobalEvent event) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) {
        final l10n = AppLocalizations.of(context)!;
        return AlertDialog(
          title: Text(l10n.deleteEvent),
          content: Text(l10n.deleteEventConfirmMsg),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: Text(l10n.cancel),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pop(context, true),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
              ),
              child: Text(l10n.delete),
            ),
          ],
        );
      },
    );

    if (confirm == true && context.mounted) {
      if (kDebugMode) print('🗑️ EventDetailScreen: Deleting event ${event.id}');
      try {
        await ref.read(eventRepositoryProvider).deleteEvent(event.id);
        if (context.mounted) {
          Navigator.pop(context); // Return to events list
          UIUtils.showGradientSnackBar(context, AppLocalizations.of(context)!.eventDeletedSuccess);
        }
      } catch (e) {
        if (kDebugMode) print('❌ EventDetailScreen: Error deleting event: $e');
        if (context.mounted) {
          UIUtils.showGradientSnackBar(context, AppLocalizations.of(context)!.errorDeletingEvent(e.toString()));
        }
      }
    }
  }

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final bool isPast;

  const _InfoRow({
    required this.icon,
    required this.label,
    required this.value,
    this.isPast = false,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(
          icon,
          color: isPast ? Colors.grey : AppColors.primarySaffron,
          size: 24,
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Colors.grey,
                    ),
              ),
              const SizedBox(height: 4),
              Text(
                value,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      fontWeight: FontWeight.w500,
                      color: isPast ? Colors.grey : null,
                    ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}



/// Media Section specifically for YouTube and Instagram tabs
class _MediaTabsSection extends StatefulWidget {
  final GlobalEvent event;
  final Widget? youtubePlayerWidget;
  final YoutubePlayerController? youtubeController;
  final VoidCallback? onResetYoutube;
  
  const _MediaTabsSection({
    required this.event, 
    this.youtubePlayerWidget, 
    this.youtubeController,
    this.onResetYoutube,
  });
  
  @override
  State<_MediaTabsSection> createState() => _MediaTabsSectionState();
}

class _MediaTabsSectionState extends State<_MediaTabsSection> with TickerProviderStateMixin {
  late TabController _tabController;
  final List<String> _tabs = [];
  
  WebViewController? _webViewController;

  @override
  void initState() {
    super.initState();
    _initTabs();
  }

  @override
  void didUpdateWidget(_MediaTabsSection oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.event.youtubeUrl != widget.event.youtubeUrl || 
        oldWidget.event.instagramUrl != widget.event.instagramUrl ||
        oldWidget.youtubePlayerWidget != widget.youtubePlayerWidget) {
      // Re-init tabs if media changes
      _tabController.dispose();
      _tabs.clear();
      _initTabs();
      setState(() {});
    }
  }

  void _initTabs() {
    if (widget.youtubePlayerWidget != null) {
      _tabs.add('YouTube');
    }
    
    if (widget.event.instagramUrl != null && widget.event.instagramUrl!.isNotEmpty) {
      _tabs.add('Instagram');
      // For Instagram embeds, we construct an iframe URL or embed url
      String instaUrl = widget.event.instagramUrl!;
      // Remove query parameters to prevent ERR_BLOCKED_BY_RESPONSE on embeds
      if (instaUrl.contains('?')) {
        instaUrl = instaUrl.split('?').first;
      }
      if (!instaUrl.endsWith('/embed') && !instaUrl.endsWith('/embed/')) {
         if (instaUrl.endsWith('/')) {
           instaUrl += 'embed';
         } else {
           instaUrl += '/embed';
         }
      }
      _webViewController = WebViewController()
        ..setJavaScriptMode(JavaScriptMode.unrestricted)
        ..setNavigationDelegate(
          NavigationDelegate(
            onNavigationRequest: (request) {
              if (request.url.startsWith('intent://') || request.url.startsWith('instagram://')) {
                launchUrl(Uri.parse(widget.event.instagramUrl!), mode: LaunchMode.externalApplication)
                  .catchError((_) => false);
                return NavigationDecision.prevent;
              }
              return NavigationDecision.navigate;
            },
          ),
        )
        ..loadHtmlString('''
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
              <style>
                body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #FAFAFA; }
                iframe { width: 100%; height: 100%; border: none; }
              </style>
            </head>
            <body>
              <iframe src="$instaUrl" scrolling="no" allowtransparency="true"></iframe>
            </body>
          </html>
        ''');
    }
    
    _tabController = TabController(length: _tabs.length > 0 ? _tabs.length : 1, vsync: this);
    _tabController.addListener(() {
      if (!_tabController.indexIsChanging) {
        final activeTab = _tabs[_tabController.index];
        
        if (activeTab == 'YouTube') {
          // Re-initialize YouTube completely for a fresh session
          widget.onResetYoutube?.call();
        } else {
          // Pause YouTube so audio stops while it's hidden
          widget.youtubeController?.pauseVideo();
        }
        
        if (activeTab == 'Instagram') {
          // Reload Instagram webview to reset it completely and stop audio
          _webViewController?.reload();
        } else {
          // Pause Instagram audio
          _webViewController?.runJavaScript('document.querySelectorAll("video, audio").forEach(media => media.pause());');
        }
        
        setState(() {}); // Rebuild to switch content
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Widget _buildYoutubePlayer() {
    if (widget.youtubePlayerWidget != null) {
      return widget.youtubePlayerWidget!;
    }
    return const Center(child: Text('Invalid YouTube URL'));
  }

  Widget _buildInstagramPlayer() {
    if (_webViewController != null) {
      return SizedBox(
        height: 550,
        child: WebViewWidget(controller: _webViewController!),
      );
    }
    return const SizedBox(height: 550, child: Center(child: Text('Invalid Instagram URL')));
  }

  @override
  Widget build(BuildContext context) {
    if (_tabs.isEmpty) return const SizedBox.shrink();

    if (_tabs.length == 1) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Padding(
                padding: const EdgeInsets.only(left: 16),
                child: Text(_tabs.first, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primarySaffron)),
              ),
              IconButton(
                icon: const Icon(Icons.fullscreen, color: Colors.grey),
                tooltip: 'Maximize Video',
                onPressed: () {
                  if (_tabs.first == 'YouTube' && widget.event.youtubeUrl != null) {
                    launchUrl(Uri.parse(widget.event.youtubeUrl!), mode: LaunchMode.externalApplication);
                  } else if (widget.event.instagramUrl != null) {
                    launchUrl(Uri.parse(widget.event.instagramUrl!), mode: LaunchMode.externalApplication);
                  }
                },
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: _tabs.first == 'YouTube' ? _buildYoutubePlayer() : _buildInstagramPlayer(),
          ),
        ],
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          children: [
            Expanded(
              child: TabBar(
                controller: _tabController,
                labelColor: AppColors.primarySaffron,
                unselectedLabelColor: Colors.grey,
                indicatorColor: AppColors.primarySaffron,
                tabs: _tabs.map((t) => Tab(text: t)).toList(),
                onTap: (_) => setState(() {}),
              ),
            ),
            IconButton(
              icon: const Icon(Icons.fullscreen, color: Colors.grey),
              tooltip: 'Maximize Video',
              onPressed: () {
                if (_tabs[_tabController.index] == 'YouTube' && widget.event.youtubeUrl != null) {
                  launchUrl(Uri.parse(widget.event.youtubeUrl!), mode: LaunchMode.externalApplication);
                } else if (widget.event.instagramUrl != null) {
                  launchUrl(Uri.parse(widget.event.instagramUrl!), mode: LaunchMode.externalApplication);
                }
              },
            ),
            const SizedBox(width: 8),
          ],
        ),
        AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
          // Calculate YouTube 16:9 height dynamically based on screen width. Instagram is 550.
          height: _tabs[_tabController.index] == 'YouTube' ? (MediaQuery.of(context).size.width * 9 / 16) : 550,
          child: ClipRect(
            child: IndexedStack(
              index: _tabController.index,
              children: _tabs.map<Widget>((tab) {
                if (tab == 'YouTube') return _buildYoutubePlayer();
                if (tab == 'Instagram') return _buildInstagramPlayer();
                return const SizedBox.shrink();
              }).toList(),
            ),
          ),
        ),
      ],
    );
  }
}

class _PhotoGallery extends StatefulWidget {
  final List<String> photos;
  final String eventTitle;

  const _PhotoGallery({required this.photos, required this.eventTitle});

  @override
  State<_PhotoGallery> createState() => _PhotoGalleryState();
}

class _PhotoGalleryState extends State<_PhotoGallery> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _openFullScreen(int index) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => EventPhotoViewer(
          photos: widget.photos,
          initialIndex: index,
          eventTitle: widget.eventTitle,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 250,
      child: Column(
        children: [
        Expanded(
          child: PageView.builder(
            controller: _pageController,
            itemCount: widget.photos.length,
            onPageChanged: (index) {
              setState(() {
                _currentPage = index;
              });
            },
            itemBuilder: (context, index) {
              return GestureDetector(
                onTap: () => _openFullScreen(index),
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    CachedNetworkImage(
                      imageUrl: widget.photos[index],
                      fit: BoxFit.cover,
                      imageBuilder: (context, imageProvider) => Container(
                        decoration: BoxDecoration(
                          image: DecorationImage(image: imageProvider, fit: BoxFit.cover),
                        ),
                        child: BackdropFilter(
                          filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
                          child: Container(color: Colors.black.withValues(alpha: 0.3)),
                        ),
                      ),
                      errorWidget: (context, url, error) => Container(color: Colors.grey.shade300),
                    ),
                    CachedNetworkImage(
                      imageUrl: widget.photos[index],
                      fit: BoxFit.contain,
                      placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                      errorWidget: (context, url, error) => const Center(child: Icon(Icons.error, size: 48)),
                    ),
                    Positioned(
                      bottom: 12, right: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.black54, borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.fullscreen, color: Colors.white, size: 16),
                            const SizedBox(width: 4),
                            Text(AppLocalizations.of(context)!.tapToView, style: const TextStyle(color: Colors.white, fontSize: 12)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
        if (widget.photos.length > 1)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(widget.photos.length, (index) {
                return Container(
                  width: _currentPage == index ? 24 : 8,
                  height: 8,
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(4),
                    color: _currentPage == index ? AppColors.primarySaffron : Colors.grey.shade300,
                  ),
                );
              }),
            ),
          ),
      ],
    ),
    );
  }
}

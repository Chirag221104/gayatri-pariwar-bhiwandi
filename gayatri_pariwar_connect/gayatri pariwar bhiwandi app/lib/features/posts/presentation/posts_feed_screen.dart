import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:share_plus/share_plus.dart';
import 'package:http/http.dart' as http;
import 'package:gal/gal.dart';
import 'package:intl/intl.dart';
import 'dart:typed_data';
import '../../../core/constants/app_colors.dart';
import '../../../core/l10n/app_localizations.dart';
import '../../auth/presentation/providers/auth_provider.dart';
import '../data/post_repository.dart';
import '../domain/post.dart';
import 'create_post_screen.dart';
import 'comments_bottom_sheet.dart';
import 'full_feed_screen.dart';
import 'photo_viewer_screen.dart';

class PostsFeedScreen extends ConsumerWidget {
  const PostsFeedScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final postsAsync = ref.watch(postsStreamProvider);
    final user = ref.watch(currentUserDataProvider).valueOrNull;
    final isAdmin = user?.role.toString().contains('admin') ?? false;
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n?.feed ?? 'Feed'),
        backgroundColor: AppColors.primarySaffron,
        automaticallyImplyLeading: false,
      ),
      floatingActionButton: isAdmin
          ? FloatingActionButton(
              backgroundColor: AppColors.primarySaffron,
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                      builder: (context) => const CreatePostScreen()),
                );
              },
              child: const Icon(Icons.add_a_photo, color: Colors.white),
            )
          : null,
      body: postsAsync.when(
        loading: () => const Center(
            child: CircularProgressIndicator(color: AppColors.primarySaffron)),
        error: (error, stack) => Center(child: Text('Error: $error')),
        data: (posts) {
          if (posts.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.photo_library_outlined,
                      size: 80, color: Colors.grey[300]),
                  const SizedBox(height: 16),
                  Text('No posts yet',
                      style: TextStyle(
                          fontSize: 18, color: Colors.grey[500])),
                  if (isAdmin) ...[
                    const SizedBox(height: 8),
                    Text('Tap + to create the first post!',
                        style: TextStyle(
                            fontSize: 14, color: Colors.grey[400])),
                  ],
                ],
              ),
            );
          }

          final pinnedCount = posts.where((p) => p.pinned).length;

          return Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                padding: const EdgeInsets.fromLTRB(16, 24, 16, 24),
                decoration: BoxDecoration(
                  color: Colors.orange.shade50,
                  image: DecorationImage(
                    image: const AssetImage('assets/images/splash_bg.png'),
                    fit: BoxFit.cover,
                    colorFilter: ColorFilter.mode(
                      Colors.black.withOpacity(0.65), 
                      BlendMode.darken
                    ),
                  ),
                ),
                child: Column(
                  children: [
                    const Icon(Icons.info_outline, color: Colors.white, size: 28),
                    const SizedBox(height: 12),
                    Text(
                      l10n?.feedDescription ?? 'Here you will find all the latest activities, inspiring thoughts, and important posts from Gayatri Pariwar Bhiwandi.',
                      style: const TextStyle(
                        fontSize: 14,
                        color: Colors.white,
                        height: 1.4,
                        fontWeight: FontWeight.w600,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
              Expanded(
                child: GridView.builder(
                  padding: const EdgeInsets.all(2),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    crossAxisSpacing: 2,
                    mainAxisSpacing: 2,
                  ),
                  itemCount: posts.length,
                  itemBuilder: (context, index) {
                    final post = posts[index];
              return GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => FullFeedScreen(
                        posts: posts,
                        initialIndex: index,
                        currentUserId: user?.uid ?? '',
                        isAdmin: isAdmin,
                        pinnedCount: pinnedCount,
                      ),
                    ),
                  );
                },
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    CachedNetworkImage(
                      imageUrl: post.photoUrls.isNotEmpty ? post.photoUrls.first : '',
                      fit: BoxFit.cover,
                      placeholder: (context, url) => Container(color: Colors.grey[200]),
                      errorWidget: (context, url, error) => Container(color: Colors.grey[200], child: const Icon(Icons.error)),
                    ),
                    if (post.photoUrls.length > 1)
                      const Positioned(
                        top: 4,
                        right: 4,
                        child: Icon(Icons.collections, color: Colors.white, size: 16),
                      ),
                    if (post.pinned)
                      const Positioned(
                        top: 4,
                        left: 4,
                        child: Icon(Icons.push_pin, color: Colors.white, size: 16),
                      ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  },
),
    );
  }
}

class PostCard extends ConsumerStatefulWidget {
  final Post post;
  final String currentUserId;
  final bool isAdmin;
  final int pinnedCount;

  const PostCard({
    required this.post,
    required this.currentUserId,
    required this.isAdmin,
    required this.pinnedCount,
  });

  @override
  ConsumerState<PostCard> createState() => _PostCardState();
}

class _PostCardState extends ConsumerState<PostCard> {
  int _currentPhotoIndex = 0;

  bool get _isLiked => widget.post.likedBy.contains(widget.currentUserId);

  void _toggleLike() {
    ref
        .read(postRepositoryProvider)
        .toggleLike(widget.post.id, widget.currentUserId);
  }

  void _sharePost() async {
    final post = widget.post;
    final text = '${post.caption}\n\n${post.tags.map((t) => '#$t').join(' ')}';
    await ShareResult.unavailable;
    Share.share(text, subject: post.caption);
    ref.read(postRepositoryProvider).incrementShareCount(post.id);
  }

  void _downloadPhoto(String url) async {
    final l10n = AppLocalizations.of(context);
    try {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(l10n?.downloadingPhoto ?? 'Downloading photo...')),
      );
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        await Gal.putImageBytes(
          response.bodyBytes,
          name: 'post_${widget.post.id}_${DateTime.now().millisecondsSinceEpoch}',
        );
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
                content: Text(l10n?.photoSaved ?? '✅ Photo saved to gallery!'),
                backgroundColor: Colors.green),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(l10n?.errorDownloadingPhoto(e.toString()) ?? '❌ Failed to download: $e'),
              backgroundColor: Colors.red),
        );
      }
    }
  }

  void _showComments() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => CommentsBottomSheet(
        postId: widget.post.id,
        currentUserId: widget.currentUserId,
      ),
    );
  }

  void _confirmDelete() {
    final l10n = AppLocalizations.of(context);
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(l10n?.deletePost ?? 'Delete Post'),
        content: Text(l10n?.deletePostConfirm ?? 'Are you sure you want to delete this post?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(l10n?.cancel ?? 'Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context); // Close dialog first
              try {
                await ref.read(postRepositoryProvider).deletePost(widget.post.id);
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(l10n?.postDeleted ?? '✅ Post deleted successfully'),
                      backgroundColor: Colors.green,
                    ),
                  );
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(l10n?.deletePostFailed ?? '❌ Failed to delete post'),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              }
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: Text(l10n?.delete ?? 'Delete'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final post = widget.post;
    final dateStr = DateFormat('dd MMM yyyy, hh:mm a').format(post.createdAt);

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 0, vertical: 4),
      elevation: 0,
      shape: const RoundedRectangleBorder(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with Live User Data
          Consumer(
            builder: (context, ref, child) {
              final authorAsync = ref.watch(userByIdProvider(post.authorId));
              return Padding(
                padding: const EdgeInsets.fromLTRB(12, 12, 4, 8),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 18,
                      backgroundColor: AppColors.primarySaffron.withOpacity(0.2),
                      backgroundImage: authorAsync.valueOrNull?.photoUrl != null && authorAsync.valueOrNull!.photoUrl!.isNotEmpty
                          ? NetworkImage(authorAsync.valueOrNull!.photoUrl!)
                          : (post.authorPhotoUrl != null && post.authorPhotoUrl!.isNotEmpty ? NetworkImage(post.authorPhotoUrl!) : null),
                      child: (authorAsync.valueOrNull?.photoUrl == null || authorAsync.valueOrNull!.photoUrl!.isEmpty) && (post.authorPhotoUrl == null || post.authorPhotoUrl!.isEmpty)
                          ? Text(
                              (authorAsync.valueOrNull?.name.isNotEmpty == true ? authorAsync.valueOrNull!.name : post.authorName).isNotEmpty
                                  ? (authorAsync.valueOrNull?.name ?? post.authorName)[0].toUpperCase()
                                  : 'A',
                              style: const TextStyle(
                                color: AppColors.primarySaffron,
                                fontWeight: FontWeight.bold,
                              ),
                            )
                          : null,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            (authorAsync.valueOrNull?.name != null && authorAsync.valueOrNull!.name.isNotEmpty)
                                ? authorAsync.valueOrNull!.name
                                : post.authorName,
                            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                          ),
                          Row(
                            children: [
                              if (post.pinned)
                                const Padding(
                                  padding: EdgeInsets.only(right: 4),
                                  child: Icon(Icons.push_pin, size: 12, color: AppColors.primarySaffron),
                                ),
                              Text(
                                dateStr,
                                style: TextStyle(fontSize: 11, color: Colors.grey[500]),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    if (widget.isAdmin)
                      PopupMenuButton<String>(
                        onSelected: (value) async {
                          if (value == 'delete') {
                            _confirmDelete();
                          } else if (value == 'edit') {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) => CreatePostScreen(
                                  existingPost: post,
                                ),
                              ),
                            );
                          } else if (value == 'pin') {
                            if (!post.pinned && widget.pinnedCount >= 3) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(l10n?.maxPinWarning ?? '⚠️ Maximum 3 posts can be pinned.'),
                                  backgroundColor: Colors.orange,
                                ),
                              );
                              return;
                            }
                            await ref.read(postRepositoryProvider).togglePin(post.id, post.pinned);
                          }
                        },
                        itemBuilder: (context) => [
                          PopupMenuItem(
                            value: 'edit',
                            child: Row(
                              children: [
                                Icon(Icons.edit, size: 18, color: Colors.grey[700]),
                                const SizedBox(width: 8),
                                Text(l10n?.editPost ?? 'Edit Post'),
                              ],
                            ),
                          ),
                          PopupMenuItem(
                            value: 'pin',
                            child: Text(post.pinned ? (l10n?.unpinPost ?? 'Unpin Post') : (l10n?.pinPost ?? 'Pin Post')),
                          ),
                          PopupMenuItem(
                            value: 'delete',
                            child: Text(l10n?.delete ?? 'Delete', style: const TextStyle(color: Colors.red)),
                          ),
                        ],
                      ),
                  ],
                ),
              );
            },
          ),

          // Photo Carousel
          if (post.photoUrls.isNotEmpty)
            SizedBox(
              height: MediaQuery.of(context).size.width, // Square aspect
              child: Stack(
                children: [
                  Container(
                    color: Colors.black, // Dark background for the image to blend nicely
                    child: PageView.builder(
                      itemCount: post.photoUrls.length,
                      onPageChanged: (index) {
                        setState(() => _currentPhotoIndex = index);
                      },
                      itemBuilder: (context, index) {
                        return GestureDetector(
                          onTap: () {
                            Navigator.push(
                              context,
                              PageRouteBuilder(
                                opaque: false,
                                pageBuilder: (context, _, __) => PhotoViewerScreen(
                                  photoUrls: post.photoUrls,
                                  initialIndex: index,
                                ),
                              ),
                            );
                          },
                          child: CachedNetworkImage(
                            imageUrl: post.photoUrls[index],
                            fit: BoxFit.contain,
                            width: double.infinity,
                            placeholder: (context, url) => Container(
                              color: Colors.grey[200],
                              child: const Center(
                                  child: CircularProgressIndicator(
                                      color: AppColors.primarySaffron)),
                            ),
                            errorWidget: (context, url, error) => Container(
                              color: Colors.grey[200],
                              child: const Icon(Icons.broken_image,
                                  size: 60, color: Colors.grey),
                            ),
                          ),
                        );
                    },
                  ),
                  ),
                  // Photo count indicator
                  if (post.photoUrls.length > 1)
                    Positioned(
                      top: 12,
                      right: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.black54,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          '${_currentPhotoIndex + 1}/${post.photoUrls.length}',
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w500),
                        ),
                      ),
                    ),
                  // Download button on photo
                  Positioned(
                    bottom: 12,
                    right: 12,
                    child: GestureDetector(
                      onTap: () =>
                          _downloadPhoto(post.photoUrls[_currentPhotoIndex]),
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.black54,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Icon(Icons.download,
                            color: Colors.white, size: 20),
                      ),
                    ),
                  ),
                ],
              ),
            ),

          // Dots indicator for multiple photos
          if (post.photoUrls.length > 1)
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  post.photoUrls.length,
                  (index) => Container(
                    width: index == _currentPhotoIndex ? 8 : 6,
                    height: index == _currentPhotoIndex ? 8 : 6,
                    margin: const EdgeInsets.symmetric(horizontal: 3),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: index == _currentPhotoIndex
                          ? AppColors.primarySaffron
                          : Colors.grey[300],
                    ),
                  ),
                ),
              ),
            ),

          // Engagement Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            child: Row(
              children: [
                // Like
                IconButton(
                  onPressed: _toggleLike,
                  icon: Icon(
                    _isLiked ? Icons.favorite : Icons.favorite_border,
                    color: _isLiked ? Colors.red : Colors.grey[700],
                    size: 26,
                  ),
                ),
                Text('${post.likesCount}',
                    style: const TextStyle(fontWeight: FontWeight.w500)),
                const SizedBox(width: 12),
                // Comment
                IconButton(
                  onPressed: _showComments,
                  icon: Icon(Icons.chat_bubble_outline,
                      color: Colors.grey[700], size: 24),
                ),
                // Share
                const Spacer(),
                IconButton(
                  onPressed: _sharePost,
                  icon: Icon(Icons.share_outlined,
                      color: Colors.grey[700], size: 24),
                ),
                Text('${post.shareCount}',
                    style: TextStyle(
                        fontWeight: FontWeight.w500, color: Colors.grey[600])),
              ],
            ),
          ),

          // Caption
          if (post.caption.isNotEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                post.caption,
                style: const TextStyle(color: Colors.black87, fontSize: 14),
              ),
            ),

          // Tags
          if (post.tags.isNotEmpty)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 4, 16, 0),
              child: Wrap(
                spacing: 6,
                children: post.tags
                    .map((tag) => Text(
                          '#$tag',
                          style: const TextStyle(
                              color: Color(0xFF1565C0),
                              fontSize: 13,
                              fontWeight: FontWeight.w500),
                        ))
                    .toList(),
              ),
            ),

          // View comments link
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 6, 16, 12),
            child: GestureDetector(
              onTap: _showComments,
              child: Text(
                l10n?.viewComments ?? 'View comments',
                style: TextStyle(color: Colors.grey[500], fontSize: 13),
              ),
            ),
          ),

          const Divider(height: 1),
        ],
      ),
    );
  }
}

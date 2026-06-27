import 'package:flutter/material.dart';
import 'package:scrollable_positioned_list/scrollable_positioned_list.dart';
import '../../../core/l10n/app_localizations.dart';
import '../domain/post.dart';
import 'posts_feed_screen.dart';

class FullFeedScreen extends StatefulWidget {
  final List<Post> posts;
  final int initialIndex;
  final String currentUserId;
  final bool isAdmin;
  final int pinnedCount;

  const FullFeedScreen({
    super.key,
    required this.posts,
    required this.initialIndex,
    required this.currentUserId,
    required this.isAdmin,
    required this.pinnedCount,
  });

  @override
  State<FullFeedScreen> createState() => _FullFeedScreenState();
}

class _FullFeedScreenState extends State<FullFeedScreen> {
  final ItemScrollController itemScrollController = ItemScrollController();
  final ItemPositionsListener itemPositionsListener = ItemPositionsListener.create();

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n?.posts ?? 'Posts'),
        backgroundColor: const Color(0xFFFF9933),
      ),
      body: ScrollablePositionedList.builder(
        itemCount: widget.posts.length,
        itemBuilder: (context, index) {
          return PostCard(
            post: widget.posts[index],
            currentUserId: widget.currentUserId,
            isAdmin: widget.isAdmin,
            pinnedCount: widget.pinnedCount,
          );
        },
        itemScrollController: itemScrollController,
        itemPositionsListener: itemPositionsListener,
        initialScrollIndex: widget.initialIndex,
      ),
    );
  }
}

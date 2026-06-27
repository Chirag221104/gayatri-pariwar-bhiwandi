import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/l10n/app_localizations.dart';
import '../../auth/presentation/providers/auth_provider.dart';
import '../data/post_repository.dart';
import '../domain/post.dart';

class CommentsBottomSheet extends ConsumerStatefulWidget {
  final String postId;
  final String currentUserId;

  const CommentsBottomSheet({
    super.key,
    required this.postId,
    required this.currentUserId,
  });

  @override
  ConsumerState<CommentsBottomSheet> createState() =>
      _CommentsBottomSheetState();
}

class _CommentsBottomSheetState extends ConsumerState<CommentsBottomSheet> {
  final _commentController = TextEditingController();
  bool _isSending = false;

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  Future<void> _sendComment() async {
    final text = _commentController.text.trim();
    if (text.isEmpty) return;

    final user = ref.read(currentUserDataProvider).valueOrNull;
    if (user == null) return;

    setState(() => _isSending = true);

    final comment = PostComment(
      id: '',
      userId: user.uid,
      userName: user.name,
      text: text,
      createdAt: DateTime.now(),
    );

    await ref.read(postRepositoryProvider).addComment(widget.postId, comment);

    _commentController.clear();
    setState(() => _isSending = false);
  }

  @override
  Widget build(BuildContext context) {
    final commentsAsync = ref.watch(postCommentsProvider(widget.postId));
    final user = ref.watch(currentUserDataProvider).valueOrNull;
    final isAdmin = user?.role.toString().contains('admin') ?? false;
    final l10n = AppLocalizations.of(context);

    return DraggableScrollableSheet(
      initialChildSize: 0.6,
      minChildSize: 0.3,
      maxChildSize: 0.9,
      expand: false,
      builder: (context, scrollController) {
        return Column(
          children: [
            // Handle
            Container(
              margin: const EdgeInsets.only(top: 8),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            // Title
            Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                l10n?.comments ?? 'Comments',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
            const Divider(height: 1),

            // Comments List
            Expanded(
              child: commentsAsync.when(
                loading: () => const Center(
                    child: CircularProgressIndicator(
                        color: AppColors.primarySaffron)),
                error: (e, _) => Center(child: Text('Error: $e')),
                data: (comments) {
                  if (comments.isEmpty) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.chat_bubble_outline,
                              size: 48, color: Colors.grey[300]),
                          const SizedBox(height: 8),
                          Text(l10n?.noCommentsYet ?? 'No comments yet',
                              style: TextStyle(color: Colors.grey[500])),
                          const SizedBox(height: 4),
                          Text(l10n?.beFirstComment ?? 'Be the first to comment!',
                              style: TextStyle(
                                  color: Colors.grey[400], fontSize: 12)),
                        ],
                      ),
                    );
                  }

                  return ListView.builder(
                    controller: scrollController,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: comments.length,
                    itemBuilder: (context, index) {
                      final comment = comments[index];
                      final timeStr = DateFormat('dd MMM, hh:mm a')
                          .format(comment.createdAt);

                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            CircleAvatar(
                              radius: 16,
                              backgroundColor:
                                  AppColors.primarySaffron.withOpacity(0.15),
                              child: Text(
                                comment.userName.isNotEmpty
                                    ? comment.userName[0].toUpperCase()
                                    : '?',
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.primarySaffron,
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  RichText(
                                    text: TextSpan(
                                      style: const TextStyle(
                                          color: Colors.black87, fontSize: 14),
                                      children: [
                                        TextSpan(
                                          text: '${comment.userName} ',
                                          style: const TextStyle(
                                              fontWeight: FontWeight.w600),
                                        ),
                                        TextSpan(text: comment.text),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    timeStr,
                                    style: TextStyle(
                                        fontSize: 11, color: Colors.grey[500]),
                                  ),
                                ],
                              ),
                            ),
                            // Admin can delete any comment, user can delete their own
                            if (isAdmin ||
                                comment.userId == widget.currentUserId)
                              IconButton(
                                icon: Icon(Icons.close,
                                    size: 16, color: Colors.grey[400]),
                                onPressed: () {
                                  ref
                                      .read(postRepositoryProvider)
                                      .deleteComment(
                                          widget.postId, comment.id);
                                },
                              ),
                          ],
                        ),
                      );
                    },
                  );
                },
              ),
            ),

            // Comment Input
            const Divider(height: 1),
            SafeArea(
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 16,
                      backgroundColor:
                          AppColors.primarySaffron.withOpacity(0.15),
                      child: Text(
                        user?.name.isNotEmpty == true
                            ? user!.name[0].toUpperCase()
                            : '?',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primarySaffron,
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: TextField(
                        controller: _commentController,
                        decoration: InputDecoration(
                          hintText: l10n?.addComment ?? 'Add a comment...',
                          hintStyle: TextStyle(color: Colors.grey[400]),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: BorderSide(color: Colors.grey[300]!),
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                              horizontal: 16, vertical: 10),
                        ),
                        textInputAction: TextInputAction.send,
                        onSubmitted: (_) => _sendComment(),
                      ),
                    ),
                    const SizedBox(width: 8),
                    _isSending
                        ? const SizedBox(
                            width: 24,
                            height: 24,
                            child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: AppColors.primarySaffron),
                          )
                        : IconButton(
                            onPressed: _sendComment,
                            icon: const Icon(Icons.send,
                                color: AppColors.primarySaffron),
                          ),
                  ],
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}

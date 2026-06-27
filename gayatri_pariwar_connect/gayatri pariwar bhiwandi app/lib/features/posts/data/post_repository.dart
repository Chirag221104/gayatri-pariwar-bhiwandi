import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../domain/post.dart';
import '../../auth/presentation/providers/auth_provider.dart';

class PostRepository {
  final FirebaseFirestore _firestore;

  PostRepository(this._firestore);

  CollectionReference get _postsCollection => _firestore.collection('posts');

  Stream<List<Post>> getPosts() {
    return _postsCollection
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) {
          final posts = snapshot.docs.map((doc) => Post.fromFirestore(doc)).toList();
          posts.sort((a, b) {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return 0; // maintain original createdAt order
          });
          return posts;
        });
  }

  Future<void> createPost(Post post) async {
    if (kDebugMode) print('📝 PostRepository: Creating post "${post.caption}"');
    await _postsCollection.add(post.toFirestore());
    if (kDebugMode) print('✅ PostRepository: Post created successfully');
  }

  Future<void> deletePost(String postId) async {
    if (kDebugMode) print('🗑️ PostRepository: Deleting post $postId');
    // Delete all comments first
    final commentsSnap =
        await _postsCollection.doc(postId).collection('comments').get();
    for (final doc in commentsSnap.docs) {
      await doc.reference.delete();
    }
    await _postsCollection.doc(postId).delete();
    if (kDebugMode) print('✅ PostRepository: Post deleted successfully');
  }

  Future<void> toggleLike(String postId, String userId) async {
    final postRef = _postsCollection.doc(postId);
    await _firestore.runTransaction((transaction) async {
      final snapshot = await transaction.get(postRef);
      if (!snapshot.exists) return;

      final data = snapshot.data() as Map<String, dynamic>;
      final likedBy = List<String>.from(data['likedBy'] ?? []);

      if (likedBy.contains(userId)) {
        likedBy.remove(userId);
        transaction.update(postRef, {
          'likedBy': likedBy,
          'likesCount': FieldValue.increment(-1),
        });
      } else {
        likedBy.add(userId);
        transaction.update(postRef, {
          'likedBy': likedBy,
          'likesCount': FieldValue.increment(1),
        });
      }
    });
  }

  Future<void> togglePin(String postId, bool currentStatus) async {
    await _postsCollection.doc(postId).update({
      'pinned': !currentStatus,
    });
  }

  Future<void> incrementShareCount(String postId) async {
    await _postsCollection.doc(postId).update({
      'shareCount': FieldValue.increment(1),
    });
  }

  // Comments
  Stream<List<PostComment>> getComments(String postId) {
    return _postsCollection
        .doc(postId)
        .collection('comments')
        .orderBy('createdAt', descending: false)
        .snapshots()
        .map((snapshot) =>
            snapshot.docs.map((doc) => PostComment.fromFirestore(doc)).toList());
  }

  Future<void> addComment(String postId, PostComment comment) async {
    await _postsCollection
        .doc(postId)
        .collection('comments')
        .add(comment.toFirestore());
  }

  Future<void> deleteComment(String postId, String commentId) async {
    await _postsCollection
        .doc(postId)
        .collection('comments')
        .doc(commentId)
        .delete();
  }
}

final postRepositoryProvider = Provider<PostRepository>((ref) {
  return PostRepository(FirebaseFirestore.instance);
});

final postsStreamProvider = StreamProvider<List<Post>>((ref) {
  final user = ref.watch(currentUserDataProvider);
  if (user.value == null) return Stream.value([]);
  return ref.read(postRepositoryProvider).getPosts();
});

final postCommentsProvider =
    StreamProvider.family<List<PostComment>, String>((ref, postId) {
  return ref.read(postRepositoryProvider).getComments(postId);
});

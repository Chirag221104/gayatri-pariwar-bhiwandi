import 'package:cloud_firestore/cloud_firestore.dart';

class Post {
  final String id;
  final String caption;
  final List<String> photoUrls;
  final List<String> tags;
  final DateTime createdAt;
  final String authorId;
  final String authorName;
  final String? authorPhotoUrl;
  final int likesCount;
  final int shareCount;
  final List<String> likedBy; // User IDs who liked this post
  final bool pinned; // True if the post is pinned to the top

  Post({
    required this.id,
    required this.caption,
    required this.photoUrls,
    required this.tags,
    required this.createdAt,
    required this.authorId,
    required this.authorName,
    this.authorPhotoUrl,
    this.likesCount = 0,
    this.shareCount = 0,
    this.likedBy = const [],
    this.pinned = false,
  });

  factory Post.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return Post(
      id: doc.id,
      caption: data['caption'] ?? '',
      photoUrls: List<String>.from(data['photoUrls'] ?? []),
      tags: List<String>.from(data['tags'] ?? []),
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      authorId: data['authorId'] ?? '',
      authorName: data['authorName'] ?? 'Admin',
      authorPhotoUrl: data['authorPhotoUrl'],
      likesCount: data['likesCount'] ?? 0,
      shareCount: data['shareCount'] ?? 0,
      likedBy: List<String>.from(data['likedBy'] ?? []),
      pinned: data['pinned'] ?? false,
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'caption': caption,
      'photoUrls': photoUrls,
      'tags': tags,
      'createdAt': Timestamp.fromDate(createdAt),
      'authorId': authorId,
      'authorName': authorName,
      'authorPhotoUrl': authorPhotoUrl,
      'likesCount': likesCount,
      'shareCount': shareCount,
      'likedBy': likedBy,
      'pinned': pinned,
    };
  }

  Post copyWith({
    String? id,
    String? caption,
    List<String>? photoUrls,
    List<String>? tags,
    DateTime? createdAt,
    String? authorId,
    String? authorName,
    String? authorPhotoUrl,
    int? likesCount,
    int? shareCount,
    List<String>? likedBy,
    bool? pinned,
  }) {
    return Post(
      id: id ?? this.id,
      caption: caption ?? this.caption,
      photoUrls: photoUrls ?? this.photoUrls,
      tags: tags ?? this.tags,
      createdAt: createdAt ?? this.createdAt,
      authorId: authorId ?? this.authorId,
      authorName: authorName ?? this.authorName,
      authorPhotoUrl: authorPhotoUrl ?? this.authorPhotoUrl,
      likesCount: likesCount ?? this.likesCount,
      shareCount: shareCount ?? this.shareCount,
      likedBy: likedBy ?? this.likedBy,
      pinned: pinned ?? this.pinned,
    );
  }
}

class PostComment {
  final String id;
  final String userId;
  final String userName;
  final String text;
  final DateTime createdAt;

  PostComment({
    required this.id,
    required this.userId,
    required this.userName,
    required this.text,
    required this.createdAt,
  });

  factory PostComment.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return PostComment(
      id: doc.id,
      userId: data['userId'] ?? '',
      userName: data['userName'] ?? 'User',
      text: data['text'] ?? '',
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'userId': userId,
      'userName': userName,
      'text': text,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }
}

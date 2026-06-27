import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:cloud_functions/cloud_functions.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/l10n/app_localizations.dart';
import '../../auth/presentation/providers/auth_provider.dart';
import '../data/post_repository.dart';
import '../domain/post.dart';

class CreatePostScreen extends ConsumerStatefulWidget {
  const CreatePostScreen({super.key});

  @override
  ConsumerState<CreatePostScreen> createState() => _CreatePostScreenState();
}

class _CreatePostScreenState extends ConsumerState<CreatePostScreen> {
  final _captionController = TextEditingController();
  final _tagController = TextEditingController();
  final List<XFile> _selectedImages = [];
  final List<String> _tags = [];
  bool _isUploading = false;
  double _uploadProgress = 0;
  DateTime? _selectedDate;

  @override
  void dispose() {
    _captionController.dispose();
    _tagController.dispose();
    super.dispose();
  }

  Future<void> _pickImages() async {
    final picker = ImagePicker();
    final images = await picker.pickMultiImage(
      maxWidth: 1920,
      maxHeight: 1920,
      imageQuality: 85,
    );

    if (images.isNotEmpty) {
      setState(() {
        _selectedImages.addAll(images);
      });
    }
  }

  void _removeImage(int index) {
    setState(() {
      _selectedImages.removeAt(index);
    });
  }

  void _addTag() {
    final input = _tagController.text.trim();
    if (input.isEmpty) return;

    final parts = input.split(RegExp(r'[\s,]+'));
    final newTags = <String>[];
    
    for (var part in parts) {
      if (part.startsWith('#')) {
        part = part.substring(1);
      }
      part = part.trim();
      if (part.isNotEmpty && !_tags.contains(part) && !newTags.contains(part)) {
        newTags.add(part);
      }
    }

    if (newTags.isNotEmpty) {
      setState(() {
        _tags.addAll(newTags);
        _tagController.clear();
      });
    } else {
      _tagController.clear();
    }
  }

  void _removeTag(String tag) {
    setState(() {
      _tags.remove(tag);
    });
  }

  Future<String?> _uploadToCloudinary(XFile image) async {
    try {
      final bytes = await image.readAsBytes();
      final base64Image = 'data:image/jpeg;base64,${base64Encode(bytes)}';

      final callable =
          FirebaseFunctions.instanceFor(region: 'asia-south1')
              .httpsCallable('uploadImage');

      final result = await callable.call({
        'image': base64Image,
        'folder': 'posts',
      });

      return result.data['secure_url'] as String?;
    } catch (e) {
      debugPrint('❌ Upload error: $e');
      return null;
    }
  }

  Future<void> _selectDateTime() async {
    final DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: AppColors.primarySaffron,
              onPrimary: Colors.white,
              onSurface: Colors.black,
            ),
          ),
          child: child!,
        );
      },
    );

    if (pickedDate != null) {
      final TimeOfDay? pickedTime = await showTimePicker(
        context: context,
        initialTime: TimeOfDay.fromDateTime(_selectedDate ?? DateTime.now()),
        builder: (context, child) {
          return Theme(
            data: Theme.of(context).copyWith(
              colorScheme: const ColorScheme.light(
                primary: AppColors.primarySaffron,
                onPrimary: Colors.white,
                onSurface: Colors.black,
              ),
            ),
            child: child!,
          );
        },
      );

      if (pickedTime != null) {
        setState(() {
          _selectedDate = DateTime(
            pickedDate.year,
            pickedDate.month,
            pickedDate.day,
            pickedTime.hour,
            pickedTime.minute,
          );
        });
      }
    }
  }

  Future<void> _createPost() async {
    if (_selectedImages.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select at least one photo')),
      );
      return;
    }

    final caption = _captionController.text.trim();
    if (caption.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please add a caption')),
      );
      return;
    }

    final user = ref.read(currentUserDataProvider).valueOrNull;
    if (user == null) return;

    setState(() {
      _isUploading = true;
      _uploadProgress = 0;
    });

    try {
      // Upload all images
      final List<String> photoUrls = [];
      for (int i = 0; i < _selectedImages.length; i++) {
        final url = await _uploadToCloudinary(_selectedImages[i]);
        if (url != null) {
          photoUrls.add(url);
        }
        setState(() {
          _uploadProgress = (i + 1) / _selectedImages.length;
        });
      }

      if (photoUrls.isEmpty) {
        throw Exception('Failed to upload images');
      }

      final post = Post(
        id: '',
        caption: caption,
        photoUrls: photoUrls,
        tags: _tags,
        createdAt: _selectedDate ?? DateTime.now(),
        authorId: user.uid,
        authorName: user.name,
        authorPhotoUrl: user.photoUrl,
      );

      await ref.read(postRepositoryProvider).createPost(post);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ Post created successfully!'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('❌ Error: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isUploading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n?.createPost ?? 'Create Post'),
        backgroundColor: AppColors.primarySaffron,
        actions: [
          if (!_isUploading)
            TextButton(
              onPressed: _createPost,
              child: Text(l10n?.postBtn ?? 'Post',
                  style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16)),
            ),
        ],
      ),
      body: _isUploading
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(
                    value: _uploadProgress,
                    color: AppColors.primarySaffron,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    l10n?.uploadingProgress((_uploadProgress * 100).toInt()) ?? 'Uploading ${(_uploadProgress * 100).toInt()}%',
                    style: const TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    l10n?.pleaseWait ?? 'Please wait...',
                    style: TextStyle(color: Colors.grey[500]),
                  ),
                ],
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Photo Picker
                  Text(l10n?.photos ?? 'Photos',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 8),
                  SizedBox(
                    height: 120,
                    child: Row(
                      children: [
                        // Add Photo Button
                        GestureDetector(
                          onTap: _pickImages,
                          child: Container(
                            width: 100,
                            height: 100,
                            margin: const EdgeInsets.only(right: 8),
                            decoration: BoxDecoration(
                              border: Border.all(
                                  color: AppColors.primarySaffron, width: 2),
                              borderRadius: BorderRadius.circular(12),
                              color:
                                  AppColors.primarySaffron.withOpacity(0.05),
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.add_photo_alternate,
                                    color: AppColors.primarySaffron, size: 32),
                                const SizedBox(height: 4),
                                Text(l10n?.add ?? 'Add',
                                    style: const TextStyle(
                                        color: AppColors.primarySaffron,
                                        fontSize: 12)),
                              ],
                            ),
                          ),
                        ),
                        // Selected Images
                        Expanded(
                          child: ReorderableListView(
                            scrollDirection: Axis.horizontal,
                            onReorder: (oldIndex, newIndex) {
                              setState(() {
                                if (oldIndex < newIndex) {
                                  newIndex -= 1;
                                }
                                final item = _selectedImages.removeAt(oldIndex);
                                _selectedImages.insert(newIndex, item);
                              });
                            },
                            children: _selectedImages.asMap().entries.map((entry) {
                              return Stack(
                                key: ValueKey(entry.value.path + entry.key.toString()),
                                children: [
                                  Container(
                                    width: 100,
                                    height: 100,
                                    margin: const EdgeInsets.only(right: 8),
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(12),
                                      image: DecorationImage(
                                        image: FileImage(File(entry.value.path)),
                                        fit: BoxFit.cover,
                                      ),
                                    ),
                                  ),
                                  Positioned(
                                    top: 2,
                                    right: 10,
                                    child: GestureDetector(
                                      onTap: () => _removeImage(entry.key),
                                      child: Container(
                                        padding: const EdgeInsets.all(4),
                                        decoration: const BoxDecoration(
                                          color: Colors.red,
                                          shape: BoxShape.circle,
                                        ),
                                        child: const Icon(Icons.close,
                                            color: Colors.white, size: 14),
                                      ),
                                    ),
                                  ),
                                ],
                              );
                            }).toList(),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Caption
                  Text(l10n?.caption ?? 'Caption',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _captionController,
                    maxLines: 4,
                    decoration: InputDecoration(
                      hintText: l10n?.writeCaption ?? 'Write a caption...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide:
                            const BorderSide(color: AppColors.primarySaffron),
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Tags
                  Text(l10n?.tags ?? 'Tags',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _tagController,
                          decoration: InputDecoration(
                            hintText: l10n?.addTag ?? 'Add a tag...',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(
                                  color: AppColors.primarySaffron),
                            ),
                            contentPadding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 12),
                          ),
                          onSubmitted: (_) => _addTag(),
                        ),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton(
                        onPressed: _addTag,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primarySaffron,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 16, vertical: 14),
                        ),
                        child: Text(l10n?.add ?? 'Add'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 4,
                    children: _tags
                        .map((tag) => Chip(
                              label: Text('#$tag'),
                              deleteIcon:
                                  const Icon(Icons.close, size: 16),
                              onDeleted: () => _removeTag(tag),
                              backgroundColor:
                                  AppColors.primarySaffron.withOpacity(0.1),
                              labelStyle: const TextStyle(
                                  color: AppColors.primarySaffron),
                            ))
                        .toList(),
                  ),
                  const SizedBox(height: 24),

                  // Post Date & Time
                  Text(l10n?.postDateTime ?? 'Post Date & Time (Optional)',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 8),
                  InkWell(
                    onTap: _selectDateTime,
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey.shade400),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            _selectedDate != null
                                ? '${_selectedDate!.day}-${_selectedDate!.month}-${_selectedDate!.year} ${_selectedDate!.hour}:${_selectedDate!.minute.toString().padLeft(2, '0')}'
                                : (l10n?.currentTimeDefault ?? 'Current Time (Default)'),
                            style: TextStyle(
                              color: _selectedDate != null
                                  ? Colors.black
                                  : Colors.grey.shade600,
                              fontSize: 16,
                            ),
                          ),
                          const Icon(Icons.calendar_today,
                              color: Colors.grey),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 40), // extra padding at the bottom
                ],
              ),
            ),
    );
  }
}

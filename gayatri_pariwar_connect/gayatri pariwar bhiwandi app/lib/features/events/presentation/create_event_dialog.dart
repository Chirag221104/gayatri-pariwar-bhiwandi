import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:image_picker/image_picker.dart';
import 'package:cloud_functions/cloud_functions.dart';
import '../../../core/constants/app_colors.dart';
import '../../auth/presentation/providers/auth_provider.dart';
import '../../storage/presentation/providers/storage_provider.dart';
import '../../groups/data/group_repository.dart';
import '../../groups/domain/group_model.dart';
import '../data/event_repository.dart';
import '../domain/global_event.dart';
import '../../admin/presentation/widgets/user_search_field.dart';
import '../../admin/presentation/widgets/admin_form_dialog.dart';
import '../../../core/l10n/app_localizations.dart';

class CreateEventDialog extends ConsumerStatefulWidget {
  const CreateEventDialog({super.key});

  @override
  ConsumerState<CreateEventDialog> createState() => _CreateEventDialogState();
}

class _CreateEventDialogState extends ConsumerState<CreateEventDialog> {
  AppLocalizations get l10n => AppLocalizations.of(context)!;
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _locationController = TextEditingController();
  String? _selectedFolderId;
  String? _selectedGroupId;
  DateTime _selectedDate = DateTime.now().add(const Duration(days: 1));
  bool _isLoading = false;

  // Responsible Contact State
  bool _useManualContact = false;
  SimpleUser? _selectedContactUser;
  final _contactPhoneController = TextEditingController();
  final _contactNameController = TextEditingController();
  final _contactRoleController = TextEditingController();
  
  // Photo management
  final List<File> _selectedPhotos = [];
  final ImagePicker _picker = ImagePicker();
  String _uploadStatus = '';

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _locationController.dispose();
    _contactPhoneController.dispose();
    _contactNameController.dispose();
    _contactRoleController.dispose();

    super.dispose();
  }

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime.now().subtract(const Duration(days: 3650)),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );

    if (!mounted) return;

    if (picked != null) {
      final time = await showTimePicker(
        context: context,
        initialTime: TimeOfDay.fromDateTime(_selectedDate),
      );

      if (!mounted) return;

      if (time != null) {
        setState(() {
          _selectedDate = DateTime(
            picked.year,
            picked.month,
            picked.day,
            time.hour,
            time.minute,
          );
        });
      }
    }
  }

  Future<void> _pickPhotos() async {
    try {
      final pickedFiles = await _picker.pickMultiImage(
        maxWidth: 1920,
        maxHeight: 1920,
        imageQuality: 85,
      );
      
      if (pickedFiles.isNotEmpty) {
        setState(() {
          _selectedPhotos.addAll(pickedFiles.map((xf) => File(xf.path)));
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('${l10n.cameraError}: $e')),
        );
      }
    }
  }

  void _removePhoto(int index) {
    setState(() {
      _selectedPhotos.removeAt(index);
    });
  }

  Future<List<String>> _uploadPhotosToCloudinary() async {
    final uploadedUrls = <String>[];
    
    for (int i = 0; i < _selectedPhotos.length; i++) {
      setState(() {
        _uploadStatus = 'Uploading photo ${i + 1} of ${_selectedPhotos.length}...';
      });
      
      try {
        final bytes = await _selectedPhotos[i].readAsBytes();
        final base64Image = 'data:image/jpeg;base64,${base64Encode(bytes)}';
        
        final result = await FirebaseFunctions.instanceFor(region: 'asia-south1')
            .httpsCallable('uploadImage')
            .call({
          'image': base64Image,
          'folder': 'event_images',
        });
        
        final data = result.data as Map<dynamic, dynamic>;
        final url = data['secure_url'] as String?;
        if (url != null) {
          uploadedUrls.add(url);
        }
      } catch (e) {
        debugPrint('Error uploading photo $i: $e');
        // Continue with other photos even if one fails
      }
    }
    
    return uploadedUrls;
  }

  Future<void> _createEvent() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _uploadStatus = '${l10n.preparingUpload}...';
    });

    try {
      final user = ref.read(currentUserDataProvider).valueOrNull;
      if (user == null) throw Exception('User not logged in');

      // Upload photos if any
      List<String> photoUrls = [];
      if (_selectedPhotos.isNotEmpty) {
        photoUrls = await _uploadPhotosToCloudinary();
      }

      setState(() {
        _uploadStatus = '${l10n.creatingEventProgress}...';
      });

      final event = GlobalEvent(
        id: '',
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        location: _locationController.text.trim(),
        eventDate: _selectedDate,
        createdBy: user.uid,
        createdAt: DateTime.now(),
        photos: photoUrls,
        // Store folder ID for navigation - format as /storage/folder/{id}
        mediaFolderPath: _selectedFolderId != null 
            ? '/storage/folder/$_selectedFolderId' 
            : null,
        // Link to public group if selected
        linkedGroupId: _selectedGroupId,
        // Responsible Contact
        contactUserId: !_useManualContact ? _selectedContactUser?.uid : null,
        contactName: _useManualContact ? _contactNameController.text.trim() : _selectedContactUser?.name,
        contactRole: _contactRoleController.text.trim().isNotEmpty ? _contactRoleController.text.trim() : null,
        contactPhone: _contactPhoneController.text.trim().isNotEmpty ? _contactPhoneController.text.trim() : null,
        contactPhotoUrl: !_useManualContact ? _selectedContactUser?.photoUrl : null,
      );

      await ref.read(eventRepositoryProvider).createEvent(event);

      if (mounted) {
        Navigator.of(context).pop();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(photoUrls.isNotEmpty 
                ? 'Event created with ${photoUrls.length} photos!' 
                : l10n.eventCreatedSuccess),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('${l10n.createEventError}: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _uploadStatus = '';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return AdminFormDialog(
      title: l10n.createEvent,
      titleIcon: Icons.event_note,
      onClose: _isLoading ? null : () => Navigator.pop(context),
      footer: AdminDialogActions(
        onSave: _createEvent,
        onCancel: () => Navigator.pop(context),
        saveLabel: l10n.createEvent,
        isSaving: _isLoading,
      ),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Photo Section
              Text(
                l10n.eventPhotos,
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                  color: Colors.grey.shade700,
                ),
              ),
              const SizedBox(height: 10),
              
              // Photo grid
              if (_selectedPhotos.isNotEmpty)
                SizedBox(
                  height: 100,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: _selectedPhotos.length + 1,
                    itemBuilder: (context, index) {
                      if (index == _selectedPhotos.length) {
                        // Add more button
                        return GestureDetector(
                          onTap: _pickPhotos,
                          child: Container(
                            width: 100,
                            margin: const EdgeInsets.only(right: 8),
                            decoration: BoxDecoration(
                              color: AppColors.primarySaffron.withValues(alpha: 0.1),
                              border: Border.all(color: AppColors.primarySaffron.withValues(alpha: 0.3)),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.add_photo_alternate, size: 32, color: AppColors.primarySaffron),
                                const SizedBox(height: 4),
                                Text(l10n.addMorePhotos, style: TextStyle(fontSize: 11, color: AppColors.primarySaffron, fontWeight: FontWeight.w500)),
                              ],
                            ),
                          ),
                        );
                      }
                      return Stack(
                        children: [
                          Container(
                            width: 100,
                            height: 100,
                            margin: const EdgeInsets.only(right: 8),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(12),
                              image: DecorationImage(
                                image: FileImage(_selectedPhotos[index]),
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),
                          Positioned(
                            top: 4,
                            right: 12,
                            child: GestureDetector(
                              onTap: () => _removePhoto(index),
                              child: Container(
                                padding: const EdgeInsets.all(4),
                                decoration: BoxDecoration(
                                  color: Colors.red.shade400,
                                  shape: BoxShape.circle,
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withValues(alpha: 0.2),
                                      blurRadius: 4,
                                    ),
                                  ],
                                ),
                                child: const Icon(Icons.close, size: 14, color: Colors.white),
                              ),
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                )
              else
                GestureDetector(
                  onTap: _pickPhotos,
                  child: Container(
                    height: 100,
                    decoration: BoxDecoration(
                      color: AppColors.primarySaffron.withValues(alpha: 0.05),
                      border: Border.all(color: AppColors.primarySaffron.withValues(alpha: 0.3), style: BorderStyle.solid),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.add_photo_alternate, size: 36, color: AppColors.primarySaffron),
                          const SizedBox(height: 6),
                          Text(l10n.tapToAddPhotos, style: TextStyle(color: AppColors.primarySaffron, fontWeight: FontWeight.w500)),
                        ],
                      ),
                    ),
                  ),
                ),
              
              const SizedBox(height: 20),
              
              // Title field
              AdminTextField(
                controller: _titleController,
                label: l10n.eventTitleLabel,
                hint: l10n.eventTitleHint,
                icon: Icons.title,
                isRequired: true,
              ),
              const SizedBox(height: 14),
              
              // Description field
              AdminTextField(
                controller: _descriptionController,
                label: l10n.description,
                hint: l10n.eventDescriptionHint,
                icon: Icons.description_outlined,
                maxLines: 3,
              ),
              const SizedBox(height: 14),
              
              // Location field
              AdminTextField(
                controller: _locationController,
                label: l10n.eventLocationLabel,
                hint: l10n.eventLocationHint,
                icon: Icons.location_on_outlined,
                isRequired: true,
              ),
              const SizedBox(height: 14),
              
              // Date picker
              InkWell(
                onTap: _selectDate,
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppColors.primarySaffron.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.primarySaffron.withValues(alpha: 0.3)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppColors.primarySaffron.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.calendar_today, color: AppColors.primarySaffron, size: 22),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              l10n.eventDateTimeLabel,
                              style: const TextStyle(
                                fontWeight: FontWeight.w600,
                                fontSize: 13,
                              ),
                            ),
                            const SizedBox(height: 3),
                            Text(
                              DateFormat('EEEE, MMM dd, yyyy • h:mm a').format(_selectedDate),
                              style: TextStyle(
                                color: Colors.grey.shade600,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Icon(Icons.edit, color: AppColors.primarySaffron, size: 20),
                    ],
                  ),
                ),
              ),
              
              const SizedBox(height: 20),
              
              // Media folder section
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isDark ? Colors.grey.shade900 : Colors.grey.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: isDark ? Colors.grey.shade800 : Colors.grey.shade200),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.folder_outlined, color: AppColors.primarySaffron, size: 20),
                        const SizedBox(width: 8),
                        Flexible(
                          child: Text(
                            l10n.linkMediaFolder,
                            style: TextStyle(
                              fontWeight: FontWeight.w600, 
                              fontSize: 14,
                              color: isDark ? Colors.grey.shade100 : Colors.grey.shade900,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: isDark ? Colors.grey.shade800 : Colors.grey.shade200,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            l10n.optionalLabel,
                            style: TextStyle(fontSize: 10, color: isDark ? Colors.grey.shade300 : Colors.grey.shade600),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      l10n.mediaFolderDesc,
                      style: TextStyle(fontSize: 12, color: isDark ? Colors.grey.shade400 : Colors.grey.shade600),
                    ),
                    const SizedBox(height: 12),
                    Consumer(
                      builder: (context, ref, child) {
                        final foldersAsync = ref.watch(rootFoldersProvider);
                        return foldersAsync.when(
                          data: (folders) => DropdownButtonFormField<String?>(
                            value: _selectedFolderId,
                            isExpanded: true,
                            dropdownColor: isDark ? Colors.grey.shade800 : Colors.white,
                            decoration: InputDecoration(
                              hintText: l10n.selectFolderHint,
                              filled: true,
                              fillColor: isDark ? Colors.grey.shade800 : Colors.white,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: BorderSide(color: isDark ? Colors.grey.shade700 : Colors.grey.shade200),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: BorderSide(color: isDark ? Colors.grey.shade700 : Colors.grey.shade200),
                              ),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                            ),
                            items: [
                               DropdownMenuItem<String?>(
                                value: null,
                                child: Text(l10n.none, style: TextStyle(color: isDark ? Colors.grey.shade300 : Colors.black)),
                              ),
                              ...folders.map((folder) => DropdownMenuItem<String?>(
                                value: folder.id,
                                child: Text(
                                  folder.name,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(color: isDark ? Colors.white : Colors.black),
                                ),
                              )),
                            ],
                            onChanged: (value) {
                              setState(() {
                                _selectedFolderId = value;
                              });
                            },
                          ),
                          loading: () => const LinearProgressIndicator(),
                          error: (e, _) => Text('Error: $e'),
                        );
                      },
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 14),
              
              // Link to Public Group section
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isDark ? Colors.green.withValues(alpha: 0.1) : Colors.green.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: isDark ? Colors.green.withValues(alpha: 0.3) : Colors.green.shade200),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.group, color: isDark ? Colors.green.shade300 : Colors.green, size: 20),
                        const SizedBox(width: 8),
                        Flexible(
                          child: Text(
                            l10n.linkPublicGroup,
                            style: TextStyle(
                              fontWeight: FontWeight.w600, 
                              fontSize: 14,
                              color: isDark ? Colors.green.shade100 : Colors.green.shade900,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: isDark ? Colors.green.withValues(alpha: 0.2) : Colors.green.shade100,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            l10n.optionalLabel,
                            style: TextStyle(fontSize: 10, color: isDark ? Colors.green.shade200 : Colors.green.shade700),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isDark ? Colors.green.withValues(alpha: 0.05) : Colors.green.shade50,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: isDark ? Colors.green.withValues(alpha: 0.1) : Colors.green.shade100),
                      ),
                      child: Text(
                        l10n.publicGroupDesc,
                        style: TextStyle(fontSize: 13, color: isDark ? Colors.green.shade200 : Colors.green.shade900),
                        softWrap: true,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Consumer(
                      builder: (context, ref, child) {
                        final groupsAsync = ref.watch(groupRepositoryProvider).getPublicGroups();
                        return StreamBuilder<List<GroupModel>>(
                          stream: groupsAsync,
                          builder: (context, snapshot) {
                            if (snapshot.connectionState == ConnectionState.waiting) {
                              return const LinearProgressIndicator();
                            }
                            if (snapshot.hasError) {
                              return Text('Error: ${snapshot.error}');
                            }
                            final groups = snapshot.data ?? [];
                            // Filter only approved groups
                            final approvedGroups = groups.where((g) => 
                                g.status == GroupStatus.approved && !g.pendingApproval).toList();
                            return DropdownButtonFormField<String?>(
                              value: _selectedGroupId,
                              isExpanded: true,
                              dropdownColor: isDark ? Colors.grey.shade800 : Colors.white,
                              decoration: InputDecoration(
                                hintText: l10n.selectGroupHint,
                                filled: true,
                                fillColor: Colors.white,
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(10),
                                  borderSide: BorderSide(color: Colors.grey.shade200),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(10),
                                  borderSide: BorderSide(color: Colors.grey.shade200),
                                ),
                                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                              ),
                              items: [
                                 DropdownMenuItem<String?>(
                                  value: null,
                                  child: Text(l10n.none),
                                ),
                                ...approvedGroups.map((group) => DropdownMenuItem<String?>(
                                  value: group.id,
                                  child: Text(
                                    group.name,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                )),
                              ],
                              onChanged: (value) {
                                setState(() {
                                  _selectedGroupId = value;
                                });
                              },
                            );
                          },
                        );
                      },
                    ),
                  ],
                ),
              ),

              // Upload status
              if (_uploadStatus.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 16),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.primarySaffron.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      children: [
                        SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: AppColors.primarySaffron,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            _uploadStatus,
                            style: TextStyle(color: Colors.grey.shade700, fontSize: 13),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

              // Responsible Contact Section
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isDark ? Colors.blue.withValues(alpha: 0.1) : Colors.blue.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isDark ? Colors.blue.withValues(alpha: 0.3) : Colors.blue.shade100
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.person_pin_circle_outlined, 
                          color: isDark ? Colors.blue.shade200 : Colors.blue.shade700, 
                          size: 22
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            l10n.responsibleContact,
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                              color: isDark ? Colors.blue.shade100 : Colors.blue.shade900,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    
                    // Toggle
                    Container(
                      decoration: BoxDecoration(
                        color: isDark ? Colors.grey.shade800 : Colors.white,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: isDark ? Colors.blue.withValues(alpha: 0.3) : Colors.blue.shade100
                        ),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: InkWell(
                              onTap: () => setState(() => _useManualContact = false),
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 10),
                                decoration: const BoxDecoration(
                                  color: Colors.transparent, 
                                ),
                                alignment: Alignment.center,
                                child: Text(
                                  l10n.selectUser,
                                  style: TextStyle(
                                    fontWeight: !_useManualContact ? FontWeight.bold : FontWeight.normal,
                                    color: !_useManualContact 
                                        ? (isDark ? Colors.blue.shade200 : Colors.blue.shade900) 
                                        : (isDark ? Colors.grey.shade400 : Colors.grey.shade600),
                                  ),
                                ),
                              ),
                            ),
                          ),
                          Expanded(
                            child: InkWell(
                              onTap: () => setState(() => _useManualContact = true),
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 10),
                                decoration: const BoxDecoration(
                                  color: Colors.transparent,
                                ),
                                alignment: Alignment.center,
                                child: Text(
                                  l10n.enterManually,
                                  style: TextStyle(
                                    fontWeight: _useManualContact ? FontWeight.bold : FontWeight.normal,
                                    color: _useManualContact 
                                        ? (isDark ? Colors.blue.shade200 : Colors.blue.shade900) 
                                        : (isDark ? Colors.grey.shade400 : Colors.grey.shade600),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    if (!_useManualContact) ...[
                      UserSearchField(
                        label: l10n.findResponsiblePerson,
                        initialValue: _selectedContactUser,
                        isRequired: false,
                        filled: true,
                        fillColor: isDark ? Colors.grey.shade800 : Colors.white,
                        onSelected: (user) {
                          setState(() {
                            _selectedContactUser = user;
                          });
                        },
                      ),
                      const SizedBox(height: 16),
                    ] else ...[
                        AdminTextField(
                          controller: _contactNameController,
                          label: l10n.contactName,
                          hint: l10n.fullName,
                          icon: Icons.person,
                          isRequired: false,
                          fillColor: isDark ? Colors.grey.shade800 : Colors.white,
                        ),
                    ],
                    
                    if (!_useManualContact)
                      Container()
                    else ...[
                      // Manual fields
                    ],

                    AdminTextField(
                      controller: _contactRoleController,
                      label: l10n.contactRole,
                      hint: l10n.contactRoleHint,
                      icon: Icons.badge,
                      isRequired: false,
                      fillColor: isDark ? Colors.grey.shade800 : Colors.white,
                    ),
                    AdminTextField(
                      controller: _contactPhoneController,
                      label: l10n.contactPhone,
                      hint: l10n.phoneHint,
                      icon: Icons.phone,
                      isRequired: false,
                      fillColor: isDark ? Colors.grey.shade800 : Colors.white,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

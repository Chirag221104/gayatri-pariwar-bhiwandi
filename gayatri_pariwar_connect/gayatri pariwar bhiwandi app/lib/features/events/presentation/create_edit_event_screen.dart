import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:image_picker/image_picker.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/utils/ui_utils.dart';
import '../../auth/presentation/providers/auth_provider.dart';
import '../../storage/presentation/providers/storage_provider.dart';
import '../../groups/data/group_repository.dart';
import '../../groups/domain/group_model.dart';
import '../data/event_repository.dart';
import '../domain/global_event.dart';
import '../../admin/presentation/widgets/user_search_field.dart';
import '../../admin/presentation/widgets/admin_form_dialog.dart';
import '../../../core/l10n/app_localizations.dart';

class CreateEditEventScreen extends ConsumerStatefulWidget {
  final String? eventId;
  final String? initialGroupId;

  const CreateEditEventScreen({
    super.key, 
    this.eventId,
    this.initialGroupId,
  });

  @override
  ConsumerState<CreateEditEventScreen> createState() => _CreateEditEventScreenState();
}

class _CreateEditEventScreenState extends ConsumerState<CreateEditEventScreen> {
  AppLocalizations get l10n => AppLocalizations.of(context)!;
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _locationController = TextEditingController();
  String? _selectedFolderId;
  String? _selectedGroupId;
  DateTime _selectedDate = DateTime.now().add(const Duration(days: 1));
  bool _isMultiDay = false;
  bool _hasTime = true;
  DateTime? _endDate;
  bool _isLoading = false;

  // Responsible Contact State
  bool _useManualContact = false;
  SimpleUser? _selectedContactUser;
  final _contactPhoneController = TextEditingController();
  final _contactNameController = TextEditingController();
  final _contactRoleController = TextEditingController();
  
  // Photo management
  final List<File> _selectedPhotos = [];
  final List<String> _existingPhotos = [];
  final ImagePicker _picker = ImagePicker();
  String _uploadStatus = '';

  @override
  void initState() {
    super.initState();
    _selectedGroupId = widget.initialGroupId;
    if (widget.eventId != null) {
      _loadEvent();
    }
  }

  Future<void> _loadEvent() async {
    setState(() => _isLoading = true);
    try {
      final event = await ref.read(eventRepositoryProvider).getEvent(widget.eventId!);
      if (event != null && mounted) {
        setState(() {
          _titleController.text = event.title;
          _descriptionController.text = event.description;
          _locationController.text = event.location;
          _selectedDate = event.eventDate;
          _isMultiDay = event.isMultiDay;
          _hasTime = event.hasTime;
          _endDate = event.endDate;
          _existingPhotos.addAll(event.photos);
          _selectedGroupId = event.linkedGroupId;
          
          // Media folder check - support both legacy path and new ID
          if (event.linkedMediaFolderId != null) {
            _selectedFolderId = event.linkedMediaFolderId;
          } else if (event.mediaFolderPath != null && event.mediaFolderPath!.startsWith('/storage/folder/')) {
            _selectedFolderId = event.mediaFolderPath!.replaceFirst('/storage/folder/', '');
          }

          // Responsible Person Loading (Check new fields first, then legacy)
          if (event.responsiblePersonId != null) {
            _useManualContact = false;
            _selectedContactUser = SimpleUser(
              uid: event.responsiblePersonId!,
              name: event.responsiblePersonName ?? 'User',
              email: '',
              photoUrl: null, // We don't store photoUrl in responsiblePerson fields, standard is to fetch handling elsewhere or just use null here as SimpleUser might not strictly need it if just for display ID
            );
            // Try to use legacy contactPhotoUrl if it matches
            if (event.contactUserId == event.responsiblePersonId) {
               _selectedContactUser = _selectedContactUser?.copyWith(photoUrl: event.contactPhotoUrl);
            }
          } else if (event.contactUserId != null) {
            // Legacy fallback
            _useManualContact = false;
            _selectedContactUser = SimpleUser(
              uid: event.contactUserId!,
              name: event.contactName ?? 'User',
              email: '',
              photoUrl: event.contactPhotoUrl,
            );
          } else if (event.responsiblePersonName != null && event.responsiblePersonId == null) {
            // Manual entry (new)
            _useManualContact = true;
            _contactNameController.text = event.responsiblePersonName!;
          } else if (event.contactName != null) {
            // Manual entry (legacy)
            _useManualContact = true;
            _contactNameController.text = event.contactName!;
          }
          
          // Role and Phone loading
          _contactRoleController.text = event.responsiblePersonRole ?? event.contactRole ?? '';
          _contactPhoneController.text = event.responsiblePersonPhone ?? event.contactPhone ?? '';
        });
      }
    } catch (e) {
      debugPrint('Error loading event: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

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
      if (_hasTime) {
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
      } else {
        setState(() {
          _selectedDate = DateTime(picked.year, picked.month, picked.day, _selectedDate.hour, _selectedDate.minute);
        });
      }
    }
  }

  Future<void> _selectEndDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _endDate ?? _selectedDate,
      firstDate: _selectedDate,
      lastDate: DateTime.now().add(const Duration(days: 3650)),
    );

    if (!mounted) return;

    if (picked != null) {
      if (_hasTime) {
        final time = await showTimePicker(
          context: context,
          initialTime: _endDate != null ? TimeOfDay.fromDateTime(_endDate!) : const TimeOfDay(hour: 23, minute: 59),
        );

        if (!mounted) return;

        if (time != null) {
          setState(() {
            _endDate = DateTime(
              picked.year,
              picked.month,
              picked.day,
              time.hour,
              time.minute,
            );
          });
        }
      } else {
        setState(() {
          _endDate = DateTime(picked.year, picked.month, picked.day, 23, 59, 59);
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

  void _removeExistingPhoto(int index) {
    setState(() {
      _existingPhotos.removeAt(index);
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
      }
    }
    
    return uploadedUrls;
  }

  Future<void> _saveEvent() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _uploadStatus = '${l10n.preparingUpload}...';
    });

    try {
      final user = ref.read(currentUserDataProvider).valueOrNull;
      if (user == null) throw Exception('User not logged in');

      // Upload new photos if any
      List<String> newPhotoUrls = [];
      if (_selectedPhotos.isNotEmpty) {
        newPhotoUrls = await _uploadPhotosToCloudinary();
      }

      setState(() {
        _uploadStatus = widget.eventId == null ? '${l10n.creatingEventProgress}...' : 'Updating event...';
      });

      final event = GlobalEvent(
        id: widget.eventId ?? '',
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        location: _locationController.text.trim(),
        eventDate: _selectedDate,
        endDate: _isMultiDay ? (_endDate ?? _selectedDate) : _selectedDate,
        isMultiDay: _isMultiDay,
        hasTime: _hasTime,
        startTime: _hasTime ? DateFormat('HH:mm').format(_selectedDate) : null,
        endTime: (_hasTime && _isMultiDay && _endDate != null) ? DateFormat('HH:mm').format(_endDate!) : null,
        createdBy: user.uid,
        createdAt: DateTime.now(),
        photos: [..._existingPhotos, ...newPhotoUrls],
        mediaFolderPath: _selectedFolderId != null 
            ? '/storage/folder/$_selectedFolderId' 
            : null,
        linkedMediaFolderId: _selectedFolderId, // New field
        linkedGroupId: _selectedGroupId,
        
        // Legacy Fields (Maintain for backward compatibility)
        contactUserId: !_useManualContact ? _selectedContactUser?.uid : null,
        contactName: _useManualContact ? _contactNameController.text.trim() : _selectedContactUser?.name,
        contactRole: _contactRoleController.text.trim().isNotEmpty ? _contactRoleController.text.trim() : null,
        contactPhone: _contactPhoneController.text.trim().isNotEmpty ? _contactPhoneController.text.trim() : null,
        contactPhotoUrl: !_useManualContact ? _selectedContactUser?.photoUrl : null,

        // New Responsible Person Fields
        responsiblePersonId: !_useManualContact ? _selectedContactUser?.uid : null,
        responsiblePersonName: _useManualContact ? _contactNameController.text.trim() : (_selectedContactUser?.name),
        responsiblePersonRole: _contactRoleController.text.trim().isNotEmpty ? _contactRoleController.text.trim() : null,
        responsiblePersonPhone: _contactPhoneController.text.trim().isNotEmpty ? _contactPhoneController.text.trim() : null,
      );

      if (widget.eventId == null) {
        await ref.read(eventRepositoryProvider).createEvent(event);
      } else {
        await ref.read(eventRepositoryProvider).updateEvent(event);
      }

      if (mounted) {
        context.pop();
        UIUtils.showGradientSnackBar(
          context, 
          widget.eventId == null ? l10n.eventCreatedSuccess : 'Event updated successfully!'
        );
      }
    } catch (e) {
      if (mounted) {
        UIUtils.showGradientSnackBar(context, '${l10n.error}: $e');
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
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final l10n = AppLocalizations.of(context)!;
    final inputFillColor = isDark ? Colors.grey.shade800 : Colors.grey.shade50;
    
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.eventId == null ? l10n.createEvent : 'Edit Event'),
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [AppColors.primarySaffron, AppColors.primarySaffron],
            ),
          ),
        ),
        foregroundColor: Colors.white,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: _isLoading && widget.eventId != null
          ? const Center(child: CircularProgressIndicator())
          : Form(
              key: _formKey,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                   // Photos Section
                  Text(
                    l10n.eventPhotos,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  const SizedBox(height: 12),
                  
                  SizedBox(
                    height: 120,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      children: [
                        // New photo picker button
                        GestureDetector(
                          onTap: _pickPhotos,
                          child: Container(
                            width: 120,
                            margin: const EdgeInsets.only(right: 8),
                            decoration: BoxDecoration(
                              color: AppColors.primarySaffron.withValues(alpha: 0.1),
                              border: Border.all(color: AppColors.primarySaffron.withValues(alpha: 0.3)),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.add_a_photo, color: AppColors.primarySaffron),
                                const SizedBox(height: 4),
                                Text('Add Photos', style: const TextStyle(fontSize: 12, color: AppColors.primarySaffron)),
                              ],
                            ),
                          ),
                        ),
                        
                        // Existing photos
                        ..._existingPhotos.asMap().entries.map((entry) => _ImageCard(
                          imageUrl: entry.value,
                          onRemove: () => _removeExistingPhoto(entry.key),
                        )),
                        
                        // Newly selected photos
                        ..._selectedPhotos.asMap().entries.map((entry) => _ImageCard(
                          file: entry.value,
                          onRemove: () => _removePhoto(entry.key),
                        )),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 24),

                  // Basic details
                  AdminTextField(
                    controller: _titleController,
                    label: l10n.eventTitleLabel,
                    hint: l10n.eventTitleHint,
                    icon: Icons.title,
                    isRequired: true,
                    fillColor: inputFillColor,
                  ),
                  
                  AdminTextField(
                    controller: _descriptionController,
                    label: l10n.description,
                    hint: l10n.eventDescriptionHint,
                    icon: Icons.description_outlined,
                    maxLines: 4,
                    fillColor: inputFillColor,
                  ),
                  
                  AdminTextField(
                    controller: _locationController,
                    label: l10n.eventLocationLabel,
                    hint: l10n.eventLocationHint,
                    icon: Icons.location_on_outlined,
                    isRequired: true,
                    fillColor: inputFillColor,
                  ),
                  
                  // Date and Time toggles
                  Row(
                    children: [
                      Expanded(
                        child: CheckboxListTile(
                          title: const Text("Multi-day", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                          value: _isMultiDay,
                          onChanged: (val) => setState(() => _isMultiDay = val ?? false),
                          contentPadding: EdgeInsets.zero,
                          controlAffinity: ListTileControlAffinity.leading,
                        ),
                      ),
                      Expanded(
                        child: CheckboxListTile(
                          title: const Text("Include Time", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                          value: _hasTime,
                          onChanged: (val) => setState(() => _hasTime = val ?? true),
                          contentPadding: EdgeInsets.zero,
                          controlAffinity: ListTileControlAffinity.leading,
                        ),
                      ),
                    ],
                  ),
                  
                  // Date Picker
                  Row(
                    children: [
                      Expanded(
                        child: InkWell(
                          onTap: _selectDate,
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: AppColors.primarySaffron.withValues(alpha: 0.05),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppColors.primarySaffron.withValues(alpha: 0.2)),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.calendar_today, color: AppColors.primarySaffron),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(_isMultiDay ? "Start Date" : l10n.eventDateTimeLabel, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                      Text(_hasTime ? DateFormat('MMM dd, yyyy • h:mm a').format(_selectedDate) : DateFormat('MMM dd, yyyy').format(_selectedDate)),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      if (_isMultiDay) ...[
                        const SizedBox(width: 10),
                        Expanded(
                          child: InkWell(
                            onTap: _selectEndDate,
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: AppColors.primarySaffron.withValues(alpha: 0.05),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: AppColors.primarySaffron.withValues(alpha: 0.2)),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.event, color: AppColors.primarySaffron),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        const Text("End Date", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                        Text(_endDate == null 
                                          ? "Select Date" 
                                          : (_hasTime ? DateFormat('MMM dd • h:mm a').format(_endDate!) : DateFormat('MMM dd, yyyy').format(_endDate!))),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  if (_isMultiDay && _endDate != null && _endDate!.isAfter(_selectedDate)) ...[
                    const SizedBox(height: 8),
                    Text(
                      "Event spans ${_endDate!.difference(_selectedDate).inDays.abs() + 1} day(s)",
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.orange.shade800),
                    ),
                  ],
                  
                  const SizedBox(height: 24),

                  // Optional Links Section
                  _SectionHeader(title: 'Integrations & Links', icon: Icons.link),
                  const SizedBox(height: 12),
                  
                  // Media Folder
                  _LinkCard(
                    title: l10n.linkMediaFolder,
                    description: l10n.mediaFolderDesc,
                    icon: Icons.folder_outlined,
                    child: Consumer(
                      builder: (context, ref, _) {
                        final foldersAsync = ref.watch(rootFoldersProvider);
                        return foldersAsync.when(
                          data: (folders) => DropdownButtonFormField<String?>(
                            value: _selectedFolderId,
                            isExpanded: true,
                            decoration: InputDecoration(
                              hintText: l10n.selectFolderHint,
                              filled: true,
                              fillColor: inputFillColor,
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
                            ),
                            items: [
                              DropdownMenuItem<String?>(value: null, child: Text(l10n.none)),
                              ...folders.map((f) => DropdownMenuItem(value: f.id, child: Text(f.name, overflow: TextOverflow.ellipsis))),
                            ],
                            onChanged: (v) => setState(() => _selectedFolderId = v),
                          ),
                          loading: () => const LinearProgressIndicator(),
                          error: (e, _) => Text('Error: $e'),
                        );
                      },
                    ),
                  ),
                  
                  const SizedBox(height: 12),
                  
                  // Public Group
                  _LinkCard(
                    title: l10n.linkPublicGroup,
                    description: l10n.publicGroupDesc,
                    icon: Icons.groups_outlined,
                    color: Colors.green,
                    backgroundColor: isDark ? null : Colors.green.shade50,
                    child: Consumer(
                      builder: (context, ref, _) {
                        final groupsAsync = ref.watch(groupRepositoryProvider).getPublicGroups();
                        return StreamBuilder<List<GroupModel>>(
                          stream: groupsAsync,
                          builder: (context, snapshot) {
                            if (!snapshot.hasData) return const LinearProgressIndicator();
                            final groups = snapshot.data!.where((g) => g.status == GroupStatus.approved).toList();
                            return DropdownButtonFormField<String?>(
                              value: _selectedGroupId,
                              isExpanded: true,
                              decoration: InputDecoration(
                                hintText: l10n.selectGroupHint,
                                filled: true,
                                fillColor: inputFillColor,
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
                              ),
                              items: [
                                DropdownMenuItem<String?>(value: null, child: Text(l10n.none)),
                                ...groups.map((g) => DropdownMenuItem(value: g.id, child: Text(g.name, overflow: TextOverflow.ellipsis))),
                              ],
                              onChanged: (v) => setState(() => _selectedGroupId = v),
                            );
                          },
                        );
                      },
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Responsible Contact section
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
                            filled: true,
                            fillColor: isDark ? Colors.grey.shade800 : Colors.white,
                            onSelected: (u) => setState(() => _selectedContactUser = u),
                            isRequired: false,
                          ),
                          const SizedBox(height: 14),
                        ] else ...[
                          AdminTextField(
                            controller: _contactNameController,
                            label: l10n.contactName,
                            hint: l10n.fullName,
                            icon: Icons.person,
                            filled: true,
                            fillColor: isDark ? Colors.grey.shade800 : Colors.white,
                            isRequired: false,
                          ),
                          const SizedBox(height: 14),
                        ],
                        
                        Row(
                          children: [
                            Expanded(
                              child: AdminTextField(
                                controller: _contactRoleController,
                                label: l10n.contactRole,
                                hint: 'e.g. Organizer',
                                filled: true,
                                fillColor: isDark ? Colors.grey.shade800 : Colors.white,
                                isRequired: false,
                              ),
                            ),
                            if (_useManualContact) ...[
                              const SizedBox(width: 12),
                              Expanded(
                                child: AdminTextField(
                                  controller: _contactPhoneController,
                                  label: l10n.contactPhone,
                                  hint: l10n.phoneHint,
                                  keyboardType: TextInputType.phone,
                                  filled: true,
                                  fillColor: isDark ? Colors.grey.shade800 : Colors.white,
                                  isRequired: false,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),
                  
                  if (_uploadStatus.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: Row(
                        children: [
                          const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)),
                          const SizedBox(width: 12),
                          Text(_uploadStatus, style: TextStyle(color: Colors.grey.shade600)),
                        ],
                      ),
                    ),

                  ElevatedButton(
                    onPressed: _isLoading ? null : _saveEvent,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primarySaffron,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: _isLoading 
                        ? const CircularProgressIndicator(color: Colors.white) 
                        : Text(widget.eventId == null ? l10n.createEvent : 'Update Event', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  ),
                  
                  const SizedBox(height: 48),
                ],
              ),
            ),
    );
  }
}

class _ImageCard extends StatelessWidget {
  final String? imageUrl;
  final File? file;
  final VoidCallback onRemove;

  const _ImageCard({this.imageUrl, this.file, required this.onRemove});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 120,
      margin: const EdgeInsets.only(right: 8),
      child: Stack(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: file != null
                ? Image.file(file!, width: 120, height: 120, fit: BoxFit.cover)
                : Image.network(imageUrl!, width: 120, height: 120, fit: BoxFit.cover),
          ),
          Positioned(
            top: 4,
            right: 4,
            child: GestureDetector(
              onTap: onRemove,
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                child: const Icon(Icons.close, size: 14, color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final IconData icon;

  const _SectionHeader({required this.title, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 20, color: AppColors.primarySaffron),
        const SizedBox(width: 8),
        Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
      ],
    );
  }
}

class _LinkCard extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final Widget child;
  final Color color;
  final Color? backgroundColor;

  const _LinkCard({
    required this.title,
    required this.description,
    required this.icon,
    required this.child,
    this.color = AppColors.primarySaffron,
    this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: backgroundColor ?? (isDark ? color.withValues(alpha: 0.1) : Colors.white),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 18, color: color),
              const SizedBox(width: 8),
              Flexible(child: Text(title, style: const TextStyle(fontWeight: FontWeight.bold))),
            ],
          ),
          const SizedBox(height: 4),
          Text(description, style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/l10n/app_localizations.dart';
import '../../auth/presentation/providers/auth_provider.dart';
import '../data/group_repository.dart';
import '../domain/group_event.dart';
import '../../admin/presentation/widgets/user_search_field.dart';
import '../../admin/presentation/widgets/admin_form_dialog.dart';

class CreateGroupEventDialog extends ConsumerStatefulWidget {
  final String groupId;

  const CreateGroupEventDialog({
    super.key,
    required this.groupId,
  });

  @override
  ConsumerState<CreateGroupEventDialog> createState() => _CreateGroupEventDialogState();
}

class _CreateGroupEventDialogState extends ConsumerState<CreateGroupEventDialog> {
  AppLocalizations get l10n => AppLocalizations.of(context)!;
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _locationController = TextEditingController();
  
  DateTime _selectedDate = DateTime.now().add(const Duration(days: 1));
  bool _isLoading = false;

  // Responsible Contact State
  bool _useManualContact = false;
  SimpleUser? _selectedContactUser;
  final _contactPhoneController = TextEditingController();
  final _contactNameController = TextEditingController();
  final _contactRoleController = TextEditingController();

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

  Future<void> _createEvent() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final user = ref.read(currentUserDataProvider).valueOrNull;
      if (user == null) throw Exception('User not logged in');

      final event = GroupEvent(
        id: '',
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        location: _locationController.text.trim().isEmpty ? null : _locationController.text.trim(),
        eventDate: _selectedDate,
        createdAt: DateTime.now(),
        groupId: widget.groupId,
        createdBy: user.uid,
        contactUserId: !_useManualContact ? _selectedContactUser?.uid : null,
        contactName: _useManualContact ? _contactNameController.text.trim() : _selectedContactUser?.name,
        contactRole: _contactRoleController.text.trim().isNotEmpty ? _contactRoleController.text.trim() : null,
        contactPhone: _contactPhoneController.text.trim().isNotEmpty ? _contactPhoneController.text.trim() : null,
        contactPhotoUrl: !_useManualContact ? _selectedContactUser?.photoUrl : null,
      );

      await ref.read(groupRepositoryProvider).createEvent(widget.groupId, event);

      if (mounted) {
        Navigator.of(context).pop();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(l10n.eventCreatedSuccess)),
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
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    // Styles matching CreateEventDialog
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final inputFillColor = isDark ? Colors.grey.shade800 : Colors.white;

    return AdminFormDialog(
      title: l10n.createEvent,
      titleIcon: Icons.event,
      onClose: _isLoading ? null : () => Navigator.pop(context),
      footer: AdminDialogActions(
        onSave: _createEvent,
        onCancel: () => Navigator.pop(context),
        saveLabel: l10n.create,
        cancelLabel: l10n.cancel,
        isSaving: _isLoading,
      ),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Title field
              AdminTextField(
                controller: _titleController,
                label: l10n.eventTitleLabel,
                hint: l10n.eventTitleHint,
                icon: Icons.title,
                isRequired: true,
                fillColor: inputFillColor,
              ),
              const SizedBox(height: 14),
              
              // Description field
              AdminTextField(
                controller: _descriptionController,
                label: l10n.description,
                hint: l10n.eventDescriptionHint,
                icon: Icons.description_outlined,
                maxLines: 3,
                fillColor: inputFillColor,
              ),
              const SizedBox(height: 14),
              
              // Location field
              AdminTextField(
                controller: _locationController,
                label: l10n.eventLocationLabel,
                hint: l10n.eventLocationHint,
                icon: Icons.location_on_outlined,
                isRequired: false,
                fillColor: inputFillColor,
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

              const SizedBox(height: 24),

              // Responsible Contact Section (Matching CreateEventDialog style)
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

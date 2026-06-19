import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

part 'global_event.freezed.dart';
part 'global_event.g.dart';

@freezed
class GlobalEvent with _$GlobalEvent {
  const GlobalEvent._();

  const factory GlobalEvent({
    required String id,
    required String title,
    @Default('') String description,
    required String location,
    @JsonKey(fromJson: _dateFromJson, toJson: _dateToJson) required DateTime eventDate,
    @JsonKey(fromJson: _optionalDateFromJson, toJson: _optionalDateToJson) DateTime? endDate,
    String? startTime,
    String? endTime,
    @Default(false) bool hasTime,
    @Default(false) bool isMultiDay,
    required String createdBy,
    @JsonKey(fromJson: _dateFromJson, toJson: _dateToJson) required DateTime createdAt,
    // Photo URLs for event gallery
    @Default([]) List<String> photos,
    // Optional link to media folder path (e.g., /media/diwali2025/)
    String? mediaFolderPath,
    // ID of the linked media folder (newer alternative to mediaFolderPath)
    String? linkedMediaFolderId,
    // Optional link to a public group for this event
    String? linkedGroupId,
    // Legacy Contact Person (Manual)
    String? contactUserId,
    String? contactName,
    String? contactRole,
    String? contactPhone,
    String? contactPhotoUrl,
    // Responsible Contact Person (New Standard)
    String? responsiblePersonId,
    String? responsiblePersonName,
    String? responsiblePersonRole,
    String? responsiblePersonPhone,
    // Event Media Links (Optional)
    String? youtubeUrl,
    String? instagramUrl,
  }) = _GlobalEvent;

  factory GlobalEvent.fromJson(Map<String, dynamic> json) =>
      _$GlobalEventFromJson(json);

  factory GlobalEvent.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return GlobalEvent.fromJson({
      ...data,
      'id': doc.id,
    });
  }

  Map<String, dynamic> toFirestore() {
    return {
      'title': title,
      'description': description,
      'location': location,
      'eventDate': Timestamp.fromDate(eventDate),
      'createdBy': createdBy,
      'createdAt': Timestamp.fromDate(createdAt),
      'photos': photos,
      if (mediaFolderPath != null) 'mediaFolderPath': mediaFolderPath,
      if (linkedMediaFolderId != null) 'linkedMediaFolderId': linkedMediaFolderId,
      if (linkedGroupId != null) 'linkedGroupId': linkedGroupId,
      if (contactUserId != null) 'contactUserId': contactUserId,
      if (contactName != null) 'contactName': contactName,
      if (contactRole != null) 'contactRole': contactRole,
      if (contactPhone != null) 'contactPhone': contactPhone,
      if (contactPhotoUrl != null) 'contactPhotoUrl': contactPhotoUrl,
      if (responsiblePersonId != null) 'responsiblePersonId': responsiblePersonId,
      if (responsiblePersonName != null) 'responsiblePersonName': responsiblePersonName,
      if (responsiblePersonRole != null) 'responsiblePersonRole': responsiblePersonRole,
      if (responsiblePersonPhone != null) 'responsiblePersonPhone': responsiblePersonPhone,
      if (youtubeUrl != null) 'youtubeUrl': youtubeUrl,
      if (instagramUrl != null) 'instagramUrl': instagramUrl,
      if (endDate != null) 'endDate': Timestamp.fromDate(endDate!),
      if (startTime != null) 'startTime': startTime,
      if (endTime != null) 'endTime': endTime,
      'hasTime': hasTime,
      'isMultiDay': isMultiDay,
    };
  }
}

DateTime _dateFromJson(dynamic timestamp) {
  if (timestamp is Timestamp) {
    return timestamp.toDate();
  }
  return DateTime.now();
}

dynamic _dateToJson(DateTime date) => Timestamp.fromDate(date);

DateTime? _optionalDateFromJson(dynamic timestamp) {
  if (timestamp is Timestamp) {
    return timestamp.toDate();
  }
  return null;
}

dynamic _optionalDateToJson(DateTime? date) => date != null ? Timestamp.fromDate(date) : null;

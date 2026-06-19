// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'global_event.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$GlobalEventImpl _$$GlobalEventImplFromJson(Map<String, dynamic> json) =>
    _$GlobalEventImpl(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String? ?? '',
      location: json['location'] as String,
      eventDate: _dateFromJson(json['eventDate']),
      endDate: _optionalDateFromJson(json['endDate']),
      startTime: json['startTime'] as String?,
      endTime: json['endTime'] as String?,
      hasTime: json['hasTime'] as bool? ?? false,
      isMultiDay: json['isMultiDay'] as bool? ?? false,
      createdBy: json['createdBy'] as String,
      createdAt: _dateFromJson(json['createdAt']),
      photos: (json['photos'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      mediaFolderPath: json['mediaFolderPath'] as String?,
      linkedMediaFolderId: json['linkedMediaFolderId'] as String?,
      linkedGroupId: json['linkedGroupId'] as String?,
      contactUserId: json['contactUserId'] as String?,
      contactName: json['contactName'] as String?,
      contactRole: json['contactRole'] as String?,
      contactPhone: json['contactPhone'] as String?,
      contactPhotoUrl: json['contactPhotoUrl'] as String?,
      responsiblePersonId: json['responsiblePersonId'] as String?,
      responsiblePersonName: json['responsiblePersonName'] as String?,
      responsiblePersonRole: json['responsiblePersonRole'] as String?,
      responsiblePersonPhone: json['responsiblePersonPhone'] as String?,
      youtubeUrl: json['youtubeUrl'] as String?,
      instagramUrl: json['instagramUrl'] as String?,
    );

Map<String, dynamic> _$$GlobalEventImplToJson(_$GlobalEventImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'location': instance.location,
      'eventDate': _dateToJson(instance.eventDate),
      'endDate': _optionalDateToJson(instance.endDate),
      'startTime': instance.startTime,
      'endTime': instance.endTime,
      'hasTime': instance.hasTime,
      'isMultiDay': instance.isMultiDay,
      'createdBy': instance.createdBy,
      'createdAt': _dateToJson(instance.createdAt),
      'photos': instance.photos,
      'mediaFolderPath': instance.mediaFolderPath,
      'linkedMediaFolderId': instance.linkedMediaFolderId,
      'linkedGroupId': instance.linkedGroupId,
      'contactUserId': instance.contactUserId,
      'contactName': instance.contactName,
      'contactRole': instance.contactRole,
      'contactPhone': instance.contactPhone,
      'contactPhotoUrl': instance.contactPhotoUrl,
      'responsiblePersonId': instance.responsiblePersonId,
      'responsiblePersonName': instance.responsiblePersonName,
      'responsiblePersonRole': instance.responsiblePersonRole,
      'responsiblePersonPhone': instance.responsiblePersonPhone,
      'youtubeUrl': instance.youtubeUrl,
      'instagramUrl': instance.instagramUrl,
    };

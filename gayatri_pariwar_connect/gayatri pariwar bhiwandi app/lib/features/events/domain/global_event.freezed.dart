// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'global_event.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

GlobalEvent _$GlobalEventFromJson(Map<String, dynamic> json) {
  return _GlobalEvent.fromJson(json);
}

/// @nodoc
mixin _$GlobalEvent {
  String get id => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  String get location => throw _privateConstructorUsedError;
  @JsonKey(fromJson: _dateFromJson, toJson: _dateToJson)
  DateTime get eventDate => throw _privateConstructorUsedError;
  @JsonKey(fromJson: _optionalDateFromJson, toJson: _optionalDateToJson)
  DateTime? get endDate => throw _privateConstructorUsedError;
  String? get startTime => throw _privateConstructorUsedError;
  String? get endTime => throw _privateConstructorUsedError;
  bool get hasTime => throw _privateConstructorUsedError;
  bool get isMultiDay => throw _privateConstructorUsedError;
  String get createdBy => throw _privateConstructorUsedError;
  @JsonKey(fromJson: _dateFromJson, toJson: _dateToJson)
  DateTime get createdAt =>
      throw _privateConstructorUsedError; // Photo URLs for event gallery
  List<String> get photos =>
      throw _privateConstructorUsedError; // Optional link to media folder path (e.g., /media/diwali2025/)
  String? get mediaFolderPath =>
      throw _privateConstructorUsedError; // ID of the linked media folder (newer alternative to mediaFolderPath)
  String? get linkedMediaFolderId =>
      throw _privateConstructorUsedError; // Optional link to a public group for this event
  String? get linkedGroupId =>
      throw _privateConstructorUsedError; // Legacy Contact Person (Manual)
  String? get contactUserId => throw _privateConstructorUsedError;
  String? get contactName => throw _privateConstructorUsedError;
  String? get contactRole => throw _privateConstructorUsedError;
  String? get contactPhone => throw _privateConstructorUsedError;
  String? get contactPhotoUrl =>
      throw _privateConstructorUsedError; // Responsible Contact Person (New Standard)
  String? get responsiblePersonId => throw _privateConstructorUsedError;
  String? get responsiblePersonName => throw _privateConstructorUsedError;
  String? get responsiblePersonRole => throw _privateConstructorUsedError;
  String? get responsiblePersonPhone =>
      throw _privateConstructorUsedError; // Event Media Links (Optional)
  String? get youtubeUrl => throw _privateConstructorUsedError;
  String? get instagramUrl => throw _privateConstructorUsedError;

  /// Serializes this GlobalEvent to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GlobalEvent
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GlobalEventCopyWith<GlobalEvent> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GlobalEventCopyWith<$Res> {
  factory $GlobalEventCopyWith(
          GlobalEvent value, $Res Function(GlobalEvent) then) =
      _$GlobalEventCopyWithImpl<$Res, GlobalEvent>;
  @useResult
  $Res call(
      {String id,
      String title,
      String description,
      String location,
      @JsonKey(fromJson: _dateFromJson, toJson: _dateToJson) DateTime eventDate,
      @JsonKey(fromJson: _optionalDateFromJson, toJson: _optionalDateToJson)
      DateTime? endDate,
      String? startTime,
      String? endTime,
      bool hasTime,
      bool isMultiDay,
      String createdBy,
      @JsonKey(fromJson: _dateFromJson, toJson: _dateToJson) DateTime createdAt,
      List<String> photos,
      String? mediaFolderPath,
      String? linkedMediaFolderId,
      String? linkedGroupId,
      String? contactUserId,
      String? contactName,
      String? contactRole,
      String? contactPhone,
      String? contactPhotoUrl,
      String? responsiblePersonId,
      String? responsiblePersonName,
      String? responsiblePersonRole,
      String? responsiblePersonPhone,
      String? youtubeUrl,
      String? instagramUrl});
}

/// @nodoc
class _$GlobalEventCopyWithImpl<$Res, $Val extends GlobalEvent>
    implements $GlobalEventCopyWith<$Res> {
  _$GlobalEventCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GlobalEvent
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? description = null,
    Object? location = null,
    Object? eventDate = null,
    Object? endDate = freezed,
    Object? startTime = freezed,
    Object? endTime = freezed,
    Object? hasTime = null,
    Object? isMultiDay = null,
    Object? createdBy = null,
    Object? createdAt = null,
    Object? photos = null,
    Object? mediaFolderPath = freezed,
    Object? linkedMediaFolderId = freezed,
    Object? linkedGroupId = freezed,
    Object? contactUserId = freezed,
    Object? contactName = freezed,
    Object? contactRole = freezed,
    Object? contactPhone = freezed,
    Object? contactPhotoUrl = freezed,
    Object? responsiblePersonId = freezed,
    Object? responsiblePersonName = freezed,
    Object? responsiblePersonRole = freezed,
    Object? responsiblePersonPhone = freezed,
    Object? youtubeUrl = freezed,
    Object? instagramUrl = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      location: null == location
          ? _value.location
          : location // ignore: cast_nullable_to_non_nullable
              as String,
      eventDate: null == eventDate
          ? _value.eventDate
          : eventDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
      endDate: freezed == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      startTime: freezed == startTime
          ? _value.startTime
          : startTime // ignore: cast_nullable_to_non_nullable
              as String?,
      endTime: freezed == endTime
          ? _value.endTime
          : endTime // ignore: cast_nullable_to_non_nullable
              as String?,
      hasTime: null == hasTime
          ? _value.hasTime
          : hasTime // ignore: cast_nullable_to_non_nullable
              as bool,
      isMultiDay: null == isMultiDay
          ? _value.isMultiDay
          : isMultiDay // ignore: cast_nullable_to_non_nullable
              as bool,
      createdBy: null == createdBy
          ? _value.createdBy
          : createdBy // ignore: cast_nullable_to_non_nullable
              as String,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      photos: null == photos
          ? _value.photos
          : photos // ignore: cast_nullable_to_non_nullable
              as List<String>,
      mediaFolderPath: freezed == mediaFolderPath
          ? _value.mediaFolderPath
          : mediaFolderPath // ignore: cast_nullable_to_non_nullable
              as String?,
      linkedMediaFolderId: freezed == linkedMediaFolderId
          ? _value.linkedMediaFolderId
          : linkedMediaFolderId // ignore: cast_nullable_to_non_nullable
              as String?,
      linkedGroupId: freezed == linkedGroupId
          ? _value.linkedGroupId
          : linkedGroupId // ignore: cast_nullable_to_non_nullable
              as String?,
      contactUserId: freezed == contactUserId
          ? _value.contactUserId
          : contactUserId // ignore: cast_nullable_to_non_nullable
              as String?,
      contactName: freezed == contactName
          ? _value.contactName
          : contactName // ignore: cast_nullable_to_non_nullable
              as String?,
      contactRole: freezed == contactRole
          ? _value.contactRole
          : contactRole // ignore: cast_nullable_to_non_nullable
              as String?,
      contactPhone: freezed == contactPhone
          ? _value.contactPhone
          : contactPhone // ignore: cast_nullable_to_non_nullable
              as String?,
      contactPhotoUrl: freezed == contactPhotoUrl
          ? _value.contactPhotoUrl
          : contactPhotoUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      responsiblePersonId: freezed == responsiblePersonId
          ? _value.responsiblePersonId
          : responsiblePersonId // ignore: cast_nullable_to_non_nullable
              as String?,
      responsiblePersonName: freezed == responsiblePersonName
          ? _value.responsiblePersonName
          : responsiblePersonName // ignore: cast_nullable_to_non_nullable
              as String?,
      responsiblePersonRole: freezed == responsiblePersonRole
          ? _value.responsiblePersonRole
          : responsiblePersonRole // ignore: cast_nullable_to_non_nullable
              as String?,
      responsiblePersonPhone: freezed == responsiblePersonPhone
          ? _value.responsiblePersonPhone
          : responsiblePersonPhone // ignore: cast_nullable_to_non_nullable
              as String?,
      youtubeUrl: freezed == youtubeUrl
          ? _value.youtubeUrl
          : youtubeUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      instagramUrl: freezed == instagramUrl
          ? _value.instagramUrl
          : instagramUrl // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$GlobalEventImplCopyWith<$Res>
    implements $GlobalEventCopyWith<$Res> {
  factory _$$GlobalEventImplCopyWith(
          _$GlobalEventImpl value, $Res Function(_$GlobalEventImpl) then) =
      __$$GlobalEventImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String title,
      String description,
      String location,
      @JsonKey(fromJson: _dateFromJson, toJson: _dateToJson) DateTime eventDate,
      @JsonKey(fromJson: _optionalDateFromJson, toJson: _optionalDateToJson)
      DateTime? endDate,
      String? startTime,
      String? endTime,
      bool hasTime,
      bool isMultiDay,
      String createdBy,
      @JsonKey(fromJson: _dateFromJson, toJson: _dateToJson) DateTime createdAt,
      List<String> photos,
      String? mediaFolderPath,
      String? linkedMediaFolderId,
      String? linkedGroupId,
      String? contactUserId,
      String? contactName,
      String? contactRole,
      String? contactPhone,
      String? contactPhotoUrl,
      String? responsiblePersonId,
      String? responsiblePersonName,
      String? responsiblePersonRole,
      String? responsiblePersonPhone,
      String? youtubeUrl,
      String? instagramUrl});
}

/// @nodoc
class __$$GlobalEventImplCopyWithImpl<$Res>
    extends _$GlobalEventCopyWithImpl<$Res, _$GlobalEventImpl>
    implements _$$GlobalEventImplCopyWith<$Res> {
  __$$GlobalEventImplCopyWithImpl(
      _$GlobalEventImpl _value, $Res Function(_$GlobalEventImpl) _then)
      : super(_value, _then);

  /// Create a copy of GlobalEvent
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? description = null,
    Object? location = null,
    Object? eventDate = null,
    Object? endDate = freezed,
    Object? startTime = freezed,
    Object? endTime = freezed,
    Object? hasTime = null,
    Object? isMultiDay = null,
    Object? createdBy = null,
    Object? createdAt = null,
    Object? photos = null,
    Object? mediaFolderPath = freezed,
    Object? linkedMediaFolderId = freezed,
    Object? linkedGroupId = freezed,
    Object? contactUserId = freezed,
    Object? contactName = freezed,
    Object? contactRole = freezed,
    Object? contactPhone = freezed,
    Object? contactPhotoUrl = freezed,
    Object? responsiblePersonId = freezed,
    Object? responsiblePersonName = freezed,
    Object? responsiblePersonRole = freezed,
    Object? responsiblePersonPhone = freezed,
    Object? youtubeUrl = freezed,
    Object? instagramUrl = freezed,
  }) {
    return _then(_$GlobalEventImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      location: null == location
          ? _value.location
          : location // ignore: cast_nullable_to_non_nullable
              as String,
      eventDate: null == eventDate
          ? _value.eventDate
          : eventDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
      endDate: freezed == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      startTime: freezed == startTime
          ? _value.startTime
          : startTime // ignore: cast_nullable_to_non_nullable
              as String?,
      endTime: freezed == endTime
          ? _value.endTime
          : endTime // ignore: cast_nullable_to_non_nullable
              as String?,
      hasTime: null == hasTime
          ? _value.hasTime
          : hasTime // ignore: cast_nullable_to_non_nullable
              as bool,
      isMultiDay: null == isMultiDay
          ? _value.isMultiDay
          : isMultiDay // ignore: cast_nullable_to_non_nullable
              as bool,
      createdBy: null == createdBy
          ? _value.createdBy
          : createdBy // ignore: cast_nullable_to_non_nullable
              as String,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      photos: null == photos
          ? _value._photos
          : photos // ignore: cast_nullable_to_non_nullable
              as List<String>,
      mediaFolderPath: freezed == mediaFolderPath
          ? _value.mediaFolderPath
          : mediaFolderPath // ignore: cast_nullable_to_non_nullable
              as String?,
      linkedMediaFolderId: freezed == linkedMediaFolderId
          ? _value.linkedMediaFolderId
          : linkedMediaFolderId // ignore: cast_nullable_to_non_nullable
              as String?,
      linkedGroupId: freezed == linkedGroupId
          ? _value.linkedGroupId
          : linkedGroupId // ignore: cast_nullable_to_non_nullable
              as String?,
      contactUserId: freezed == contactUserId
          ? _value.contactUserId
          : contactUserId // ignore: cast_nullable_to_non_nullable
              as String?,
      contactName: freezed == contactName
          ? _value.contactName
          : contactName // ignore: cast_nullable_to_non_nullable
              as String?,
      contactRole: freezed == contactRole
          ? _value.contactRole
          : contactRole // ignore: cast_nullable_to_non_nullable
              as String?,
      contactPhone: freezed == contactPhone
          ? _value.contactPhone
          : contactPhone // ignore: cast_nullable_to_non_nullable
              as String?,
      contactPhotoUrl: freezed == contactPhotoUrl
          ? _value.contactPhotoUrl
          : contactPhotoUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      responsiblePersonId: freezed == responsiblePersonId
          ? _value.responsiblePersonId
          : responsiblePersonId // ignore: cast_nullable_to_non_nullable
              as String?,
      responsiblePersonName: freezed == responsiblePersonName
          ? _value.responsiblePersonName
          : responsiblePersonName // ignore: cast_nullable_to_non_nullable
              as String?,
      responsiblePersonRole: freezed == responsiblePersonRole
          ? _value.responsiblePersonRole
          : responsiblePersonRole // ignore: cast_nullable_to_non_nullable
              as String?,
      responsiblePersonPhone: freezed == responsiblePersonPhone
          ? _value.responsiblePersonPhone
          : responsiblePersonPhone // ignore: cast_nullable_to_non_nullable
              as String?,
      youtubeUrl: freezed == youtubeUrl
          ? _value.youtubeUrl
          : youtubeUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      instagramUrl: freezed == instagramUrl
          ? _value.instagramUrl
          : instagramUrl // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GlobalEventImpl extends _GlobalEvent {
  const _$GlobalEventImpl(
      {required this.id,
      required this.title,
      this.description = '',
      required this.location,
      @JsonKey(fromJson: _dateFromJson, toJson: _dateToJson)
      required this.eventDate,
      @JsonKey(fromJson: _optionalDateFromJson, toJson: _optionalDateToJson)
      this.endDate,
      this.startTime,
      this.endTime,
      this.hasTime = false,
      this.isMultiDay = false,
      required this.createdBy,
      @JsonKey(fromJson: _dateFromJson, toJson: _dateToJson)
      required this.createdAt,
      final List<String> photos = const [],
      this.mediaFolderPath,
      this.linkedMediaFolderId,
      this.linkedGroupId,
      this.contactUserId,
      this.contactName,
      this.contactRole,
      this.contactPhone,
      this.contactPhotoUrl,
      this.responsiblePersonId,
      this.responsiblePersonName,
      this.responsiblePersonRole,
      this.responsiblePersonPhone,
      this.youtubeUrl,
      this.instagramUrl})
      : _photos = photos,
        super._();

  factory _$GlobalEventImpl.fromJson(Map<String, dynamic> json) =>
      _$$GlobalEventImplFromJson(json);

  @override
  final String id;
  @override
  final String title;
  @override
  @JsonKey()
  final String description;
  @override
  final String location;
  @override
  @JsonKey(fromJson: _dateFromJson, toJson: _dateToJson)
  final DateTime eventDate;
  @override
  @JsonKey(fromJson: _optionalDateFromJson, toJson: _optionalDateToJson)
  final DateTime? endDate;
  @override
  final String? startTime;
  @override
  final String? endTime;
  @override
  @JsonKey()
  final bool hasTime;
  @override
  @JsonKey()
  final bool isMultiDay;
  @override
  final String createdBy;
  @override
  @JsonKey(fromJson: _dateFromJson, toJson: _dateToJson)
  final DateTime createdAt;
// Photo URLs for event gallery
  final List<String> _photos;
// Photo URLs for event gallery
  @override
  @JsonKey()
  List<String> get photos {
    if (_photos is EqualUnmodifiableListView) return _photos;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_photos);
  }

// Optional link to media folder path (e.g., /media/diwali2025/)
  @override
  final String? mediaFolderPath;
// ID of the linked media folder (newer alternative to mediaFolderPath)
  @override
  final String? linkedMediaFolderId;
// Optional link to a public group for this event
  @override
  final String? linkedGroupId;
// Legacy Contact Person (Manual)
  @override
  final String? contactUserId;
  @override
  final String? contactName;
  @override
  final String? contactRole;
  @override
  final String? contactPhone;
  @override
  final String? contactPhotoUrl;
// Responsible Contact Person (New Standard)
  @override
  final String? responsiblePersonId;
  @override
  final String? responsiblePersonName;
  @override
  final String? responsiblePersonRole;
  @override
  final String? responsiblePersonPhone;
// Event Media Links (Optional)
  @override
  final String? youtubeUrl;
  @override
  final String? instagramUrl;

  @override
  String toString() {
    return 'GlobalEvent(id: $id, title: $title, description: $description, location: $location, eventDate: $eventDate, endDate: $endDate, startTime: $startTime, endTime: $endTime, hasTime: $hasTime, isMultiDay: $isMultiDay, createdBy: $createdBy, createdAt: $createdAt, photos: $photos, mediaFolderPath: $mediaFolderPath, linkedMediaFolderId: $linkedMediaFolderId, linkedGroupId: $linkedGroupId, contactUserId: $contactUserId, contactName: $contactName, contactRole: $contactRole, contactPhone: $contactPhone, contactPhotoUrl: $contactPhotoUrl, responsiblePersonId: $responsiblePersonId, responsiblePersonName: $responsiblePersonName, responsiblePersonRole: $responsiblePersonRole, responsiblePersonPhone: $responsiblePersonPhone, youtubeUrl: $youtubeUrl, instagramUrl: $instagramUrl)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GlobalEventImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.location, location) ||
                other.location == location) &&
            (identical(other.eventDate, eventDate) ||
                other.eventDate == eventDate) &&
            (identical(other.endDate, endDate) || other.endDate == endDate) &&
            (identical(other.startTime, startTime) ||
                other.startTime == startTime) &&
            (identical(other.endTime, endTime) || other.endTime == endTime) &&
            (identical(other.hasTime, hasTime) || other.hasTime == hasTime) &&
            (identical(other.isMultiDay, isMultiDay) ||
                other.isMultiDay == isMultiDay) &&
            (identical(other.createdBy, createdBy) ||
                other.createdBy == createdBy) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            const DeepCollectionEquality().equals(other._photos, _photos) &&
            (identical(other.mediaFolderPath, mediaFolderPath) ||
                other.mediaFolderPath == mediaFolderPath) &&
            (identical(other.linkedMediaFolderId, linkedMediaFolderId) ||
                other.linkedMediaFolderId == linkedMediaFolderId) &&
            (identical(other.linkedGroupId, linkedGroupId) ||
                other.linkedGroupId == linkedGroupId) &&
            (identical(other.contactUserId, contactUserId) ||
                other.contactUserId == contactUserId) &&
            (identical(other.contactName, contactName) ||
                other.contactName == contactName) &&
            (identical(other.contactRole, contactRole) ||
                other.contactRole == contactRole) &&
            (identical(other.contactPhone, contactPhone) ||
                other.contactPhone == contactPhone) &&
            (identical(other.contactPhotoUrl, contactPhotoUrl) ||
                other.contactPhotoUrl == contactPhotoUrl) &&
            (identical(other.responsiblePersonId, responsiblePersonId) ||
                other.responsiblePersonId == responsiblePersonId) &&
            (identical(other.responsiblePersonName, responsiblePersonName) ||
                other.responsiblePersonName == responsiblePersonName) &&
            (identical(other.responsiblePersonRole, responsiblePersonRole) ||
                other.responsiblePersonRole == responsiblePersonRole) &&
            (identical(other.responsiblePersonPhone, responsiblePersonPhone) ||
                other.responsiblePersonPhone == responsiblePersonPhone) &&
            (identical(other.youtubeUrl, youtubeUrl) ||
                other.youtubeUrl == youtubeUrl) &&
            (identical(other.instagramUrl, instagramUrl) ||
                other.instagramUrl == instagramUrl));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hashAll([
        runtimeType,
        id,
        title,
        description,
        location,
        eventDate,
        endDate,
        startTime,
        endTime,
        hasTime,
        isMultiDay,
        createdBy,
        createdAt,
        const DeepCollectionEquality().hash(_photos),
        mediaFolderPath,
        linkedMediaFolderId,
        linkedGroupId,
        contactUserId,
        contactName,
        contactRole,
        contactPhone,
        contactPhotoUrl,
        responsiblePersonId,
        responsiblePersonName,
        responsiblePersonRole,
        responsiblePersonPhone,
        youtubeUrl,
        instagramUrl
      ]);

  /// Create a copy of GlobalEvent
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GlobalEventImplCopyWith<_$GlobalEventImpl> get copyWith =>
      __$$GlobalEventImplCopyWithImpl<_$GlobalEventImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GlobalEventImplToJson(
      this,
    );
  }
}

abstract class _GlobalEvent extends GlobalEvent {
  const factory _GlobalEvent(
      {required final String id,
      required final String title,
      final String description,
      required final String location,
      @JsonKey(fromJson: _dateFromJson, toJson: _dateToJson)
      required final DateTime eventDate,
      @JsonKey(fromJson: _optionalDateFromJson, toJson: _optionalDateToJson)
      final DateTime? endDate,
      final String? startTime,
      final String? endTime,
      final bool hasTime,
      final bool isMultiDay,
      required final String createdBy,
      @JsonKey(fromJson: _dateFromJson, toJson: _dateToJson)
      required final DateTime createdAt,
      final List<String> photos,
      final String? mediaFolderPath,
      final String? linkedMediaFolderId,
      final String? linkedGroupId,
      final String? contactUserId,
      final String? contactName,
      final String? contactRole,
      final String? contactPhone,
      final String? contactPhotoUrl,
      final String? responsiblePersonId,
      final String? responsiblePersonName,
      final String? responsiblePersonRole,
      final String? responsiblePersonPhone,
      final String? youtubeUrl,
      final String? instagramUrl}) = _$GlobalEventImpl;
  const _GlobalEvent._() : super._();

  factory _GlobalEvent.fromJson(Map<String, dynamic> json) =
      _$GlobalEventImpl.fromJson;

  @override
  String get id;
  @override
  String get title;
  @override
  String get description;
  @override
  String get location;
  @override
  @JsonKey(fromJson: _dateFromJson, toJson: _dateToJson)
  DateTime get eventDate;
  @override
  @JsonKey(fromJson: _optionalDateFromJson, toJson: _optionalDateToJson)
  DateTime? get endDate;
  @override
  String? get startTime;
  @override
  String? get endTime;
  @override
  bool get hasTime;
  @override
  bool get isMultiDay;
  @override
  String get createdBy;
  @override
  @JsonKey(fromJson: _dateFromJson, toJson: _dateToJson)
  DateTime get createdAt; // Photo URLs for event gallery
  @override
  List<String>
      get photos; // Optional link to media folder path (e.g., /media/diwali2025/)
  @override
  String?
      get mediaFolderPath; // ID of the linked media folder (newer alternative to mediaFolderPath)
  @override
  String?
      get linkedMediaFolderId; // Optional link to a public group for this event
  @override
  String? get linkedGroupId; // Legacy Contact Person (Manual)
  @override
  String? get contactUserId;
  @override
  String? get contactName;
  @override
  String? get contactRole;
  @override
  String? get contactPhone;
  @override
  String? get contactPhotoUrl; // Responsible Contact Person (New Standard)
  @override
  String? get responsiblePersonId;
  @override
  String? get responsiblePersonName;
  @override
  String? get responsiblePersonRole;
  @override
  String? get responsiblePersonPhone; // Event Media Links (Optional)
  @override
  String? get youtubeUrl;
  @override
  String? get instagramUrl;

  /// Create a copy of GlobalEvent
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GlobalEventImplCopyWith<_$GlobalEventImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

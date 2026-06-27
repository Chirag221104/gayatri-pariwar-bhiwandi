import 'package:flutter/material.dart';

/// App localizations for multi-language support
class AppLocalizations {
  final Locale locale;
  
  AppLocalizations(this.locale);
  
  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }
  
  static const LocalizationsDelegate<AppLocalizations> delegate = _AppLocalizationsDelegate();

  /// Translates a key using a specific language code (english, hindi, marathi, gujarati)
  /// This is used for tutorial when user selects a specific language
  static String translateFor(String key, String? language) {
    final langCode = _languageToCode(language);
    return _localizedValues[langCode]?[key] ?? _localizedValues['en']?[key] ?? key;
  }
  
  /// Converts language name to locale code
  static String _languageToCode(String? language) {
    switch (language?.toLowerCase()) {
      case 'hindi':
        return 'hi';
      case 'marathi':
        return 'mr';
      case 'gujarati':
        return 'gu';
      case 'english':
      default:
        return 'en';
    }
  }

  // Getters & Logic
  String translate(String key, {Map<String, String>? params}) {
    final langCode = locale.languageCode;
    String value = _localizedValues[langCode]?[key] ??
                  _localizedValues['en']?[key] ?? key;
    
    if (params != null) {
      params.forEach((paramKey, paramValue) {
        value = value.replaceAll('{$paramKey}', paramValue);
      });
    }
    
    return value;
  }
  
    // Convenience getters for common strings
    // Feed and Posts
    String get feed => translate('feed');
    String get posts => translate('posts');
    String get feedDescription => translate('feed_description');
    String get viewComments => translate('view_comments');
    String get deletePost => translate('delete_post');
    String get deletePostConfirm => translate('delete_post_confirm');
    String get pinPost => translate('pin_post');
    String get unpinPost => translate('unpin_post');
    String get maxPinWarning => translate('max_pin_warning');
    String get downloadingPhoto => translate('downloading_photo');
    String get photoSaved => translate('photo_saved');
    String errorDownloadingPhoto(String error) => translate('download_failed').replaceAll('{error}', error);
    String get postDeleted => translate('post_deleted');
    String get deletePostFailed => translate('delete_post_failed');
    String get comments => translate('comments');
    String get noCommentsYet => translate('no_comments_yet');
    String get beFirstComment => translate('be_first_comment');
    String get addComment => translate('add_comment');
    String get createPost => translate('create_post');
    String get postBtn => translate('post_btn');
    String get photos => translate('photos');
    String get caption => translate('caption');
    String get writeCaption => translate('write_caption');
    String get postDateTime => translate('post_date_time');
    String get currentTimeDefault => translate('current_time_default');
    String uploadingProgress(int percent) => translate('uploading_progress').replaceAll('{percent}', percent.toString());
    String get pleaseWait => translate('please_wait');
    String get appName => translate('app_name');
    String get ok => translate('ok');
    String get cancel => translate('cancel');
    
    // Social Media
    String get socialYoutube => translate('social_youtube');
    String get socialFacebook => translate('social_facebook');
    String get socialInstagram => translate('social_instagram');
    String get followUs => translate('follow_us');
    String get save => translate('save');
    String get delete => translate('delete');
    String get edit => translate('edit');
    String get submit => translate('submit');
    String get loading => translate('loading');
    String get error => translate('error');
    String get success => translate('success');
    String get search => translate('search');
    String get noData => translate('no_data');
    String get retry => translate('retry');
    String get close => translate('close');
    String get yes => translate('yes');
    String get no => translate('no');
    String get back => translate('back');
    String get logPracticeSuccess => translate('log_practice_success');
    String get next => translate('next');
    String get done => translate('done');
    String get syncSuccess => translate('sync_success');
    String get noDataToSync => translate('no_data_to_sync');
    String get syncFailed => translate('sync_failed');
    
    // Relative Time
    String get justNow => translate('just_now');
    String minutesAgo(int count) => translate('minutes_ago').replaceAll('{count}', count.toString());
    String hoursAgo(int count) => translate('hours_ago').replaceAll('{count}', count.toString());
    String get yesterday => translate('yesterday');
    String daysAgo(int count) => translate('days_ago').replaceAll('{count}', count.toString());
    String nFiles(int count) => translate('n_files').replaceAll('{count}', count.toString());
    
    String get select => translate('select');
    String get add => translate('add');
    String get remove => translate('remove');
    String get update => translate('update');
    String get create => translate('create');
    String get view => translate('view');
    String get details => translate('details');
    String get title => translate('title');
    String get date => translate('date');
    String get time => translate('time');
    String get status => translate('status');

    String get pending => translate('pending');
    String get approved => translate('approved');
    String get rejected => translate('rejected');
    String get completed => translate('completed');
    String get ongoing => translate('ongoing');
    String get noOngoingEvents => translate('no_ongoing_events');
    String get all => translate('all');
    String get filter => translate('filter');
    String get sort => translate('sort');
    String get share => translate('share');
    String get download => translate('download');
    String get upload => translate('upload');
    String get refresh => translate('refresh');
  
    // Auth
    String get login => translate('login');
    String get signup => translate('signup');
    String get logout => translate('logout');
    String get email => translate('email');
    String get password => translate('password');
    String get confirmPassword => translate('confirm_password');
    String get forgotPassword => translate('forgot_password');
    String get welcomeBack => translate('welcome_back');
    String get signInContinue => translate('sign_in_continue');
    String get resetPassword => translate('reset_password');
    String get sendResetLink => translate('send_reset_link');
    String get createAccount => translate('create_account');
    String get alreadyHaveAccount => translate('already_have_account');
    String get dontHaveAccount => translate('dont_have_account');
    String get enterEmail => translate('enter_email');
    String get enterPassword => translate('enter_password');
    String get joinGayatri => translate('join_gayatri');
    String get continueWithGoogle => translate('continue_with_google');
  
    // Navigation
    String get home => translate('home');
    String get groups => translate('groups');
    String get events => translate('events');
    String get spiritual => translate('spiritual');
    String get profile => translate('profile');
    String get settings => translate('settings');
    String get news => translate('news');
    String get chat => translate('chat');
    String get members => translate('members');
    String get pastEvent => translate('past_event');
    String get joinDiscussionGroup => translate('join_discussion_group');
    String get additionalMediaAvailable => translate('additional_media_available');
    String get viewMoreMedia => translate('view_more_media');
    String get deleteEvent => translate('delete_event');
    String get deleteEventConfirmMsg => translate('delete_event_confirm');
    String get deleteEventConfirmWithTitleMsg => translate('delete_event_confirm_with_title');
    String get eventDeletedSuccess => translate('event_deleted_success');
    String get eventNotFound => translate('event_not_found');
    String get tapToView => translate('tap_to_view');
    String errorDeletingEvent(String error) => translate('error_deleting_event', params: {'error': error});

  
    // Settings
    String get notifications => translate('notifications');
    String get appearance => translate('appearance');
    String get theme => translate('theme');
    String get fontSize => translate('font_size');
    String get language => translate('language');
    String get privacySecurity => translate('privacy_security');
    String get changePassword => translate('change_password');
    String get about => translate('about');
    String get appVersion => translate('app_version');
    String get termsConditions => translate('terms_conditions');
    String get privacyPolicy => translate('privacy_policy');
    String get contactSupport => translate('contact_support');
    String get clearCache => translate('clear_cache');
    String get rateApp => translate('rate_app');
    String get changeUsername => translate('change_username');
    String get twoFactorAuth => translate('two_factor_auth');
    String get comingSoon => translate('coming_soon');
    String get freeUpStorage => translate('free_up_storage');
    String get clearCacheMessage => translate('clear_cache_message');
    String get clearCacheSuccess => translate('clear_cache_success');
    String get cannotChangeUntil => translate('cannot_change_until');
    String get pendingInvitations => translate('pending_invitations');
    String get messageDeleted => translate('message_deleted');
    String get messageDeletedAdmin => translate('message_deleted_admin');
    String get messageDeletedGuruji => translate('message_deleted_guruji');
    String get practiceCalendar => translate('practice_calendar');
    String get allowGurujiView => translate('allow_guruji_view');
    String get gurujiViewDesc => translate('guruji_view_desc');
    String get certTitle => translate('cert_title');
    String get certSubtitle => translate('cert_subtitle');
    String get certBody => translate('cert_body');
    String get certBlessing => translate('cert_blessing');
    String get issueDate => translate('issue_date');
    String get certId => translate('cert_id');
    String get digitallyIssuedBy => translate('digitally_issued_by');
    String get certDisclaimer => translate('cert_disclaimer');
    String get noPendingInvitations => translate('no_pending_invitations');
    String get invitationsHint => translate('invitations_hint');
    String get pranaamGreeting => translate('pranaam_greeting');
    String get celebrations => translate('celebrations');
    String get calendarText => translate('calendar');
    String get latestNews => translate('latest_news');
    String get upcomingEvents => translate('upcoming_events');
    String get myGroups => translate('my_groups');
    String get mediaLibrary => translate('media_library');
    String get quickAccess => translate('quick_access');
    String get paramDrishtiTitle => translate('param_drishti_title');
    String get paramDrishtiSubtitle => translate('param_drishti_subtitle');
    String get paramDrishtiCardDesc => translate('param_drishti_card_desc');
  
    // Theme options
    String get light => translate('light');
    String get dark => translate('dark');
    String get systemDefault => translate('system_default');
  
    // Font size options
    String get small => translate('small');
    String get medium => translate('medium');
    String get large => translate('large');
  
    String get attendanceMissingMsg => translate('attendance_missing_msg');
    String get zeroStudentsPresent => translate('zero_students_present');
    String presentStudentsCount(int count) => translate('present_students_count').replaceAll('{count}', count.toString());
    String selectedRole(String role) => translate('selected_role').replaceAll('{role}', role);
    String get fairnessFallbackTooltip => translate('fairness_fallback_tooltip');
    String get processing => translate('processing');
    String get todayRandomRole => translate('today_random_role');
    String get pickRandomStudent => translate('pick_random_student');

    // Profile
    String get editProfile => translate('edit_profile');
    String get fullName => translate('full_name');
    String get phoneNumber => translate('phone_number');
    String get location => translate('location');
    String get city => translate('city');
    String get branch => translate('branch');
    String get selectBranch => translate('select_branch');
    String get selectGuruji => translate('select_guruji');
    String get interests => translate('interests');
    String get completeSetup => translate('complete_setup');
    String get profileSetup => translate('profile_setup');
    String get personalInfo => translate('personal_info');
    String get contactInfo => translate('contact_info');
    String get username => translate('username');
    String get bio => translate('bio');
    String get dateOfBirth => translate('date_of_birth');
    String get gender => translate('gender');
    String get male => translate('male');
    String get female => translate('female');
  
    // Services
    String get requestService => translate('request_service');
    String get myRequests => translate('my_requests');
    String get serviceType => translate('service_type');
    String get address => translate('address');
    String get preferredDate => translate('preferred_date');
    String get preferredTime => translate('preferred_time');
    String get additionalNotes => translate('additional_notes');
    String get selectService => translate('select_service');
    String get serviceDetails => translate('service_details');
    String get requestStatus => translate('request_status');
    String get newRequest => translate('new_request');
  
    // Notifications
    String get newsNotifications => translate('news_notifications');
    String get eventNotifications => translate('event_notifications');
    String get groupNotifications => translate('group_notifications');
    String get announcementNotifications => translate('announcement_notifications');
    String get satsangNotifications => translate('satsang_notifications');
    String get newsNotificationsDesc => translate('news_notifications_desc');
    String get eventNotificationsDesc => translate('event_notifications_desc');
    String get groupNotificationsDesc => translate('group_notifications_desc');
    String get announcementNotificationsDesc => translate('announcement_notifications_desc');
    String get satsangNotificationsDesc => translate('satsang_notifications_desc');
  
    // Home Dashboard
    String get pranaam => translate('pranaam');
    String get welcomeToGayatri => translate('welcome_to_gayatri');
    String get viewAll => translate('view_all');
    String get noNews => translate('no_news');
    String get noEvents => translate('no_events');
  
    // Groups
    String get createGroup => translate('create_group');
    String get joinGroup => translate('join_group');
    String get leaveGroup => translate('leave_group');
    String get groupName => translate('group_name');
    String get groupDescription => translate('group_description');
    String get groupType => translate('group_type');
    String get groupMembers => translate('group_members');
    String get reasonForCreatingGroup => translate('reason_for_creating_group');
    String get reasonForCreatingGroupHint => translate('reason_for_creating_group_hint');
    String get reasonForCreatingGroupHelper => translate('reason_for_creating_group_helper');
    String get reasonMinLengthError => translate('reason_min_length_error');
    String get noBranchesAvailable => translate('no_branches_available');
    String get noGurujisAvailable => translate('no_gurujis_available');
    String get noMediaFolders => translate('no_media_folders');
    String get noMediaAvailableDesc => translate('no_media_available_desc');
    String get thisFolderIsEmpty => translate('this_folder_is_empty');
    String get downloadComplete => translate('download_complete');
    String get downloadFailed => translate('download_failed');
    String get addMembers => translate('add_members');
    String get removeMember => translate('remove_member');
    String get makeAdmin => translate('make_admin');
    String get groupChat => translate('group_chat');
    String get groupSettings => translate('group_settings');
    String get homework => translate('homework');
    String get editGroup => translate('edit_group');
    String get deleteGroup => translate('delete_group');
    String get noGroups => translate('no_groups');
    String get noInterestsAvailable => translate('no_interests_available');
    String get interestsTopics => translate('interests_topics') ?? translate('interests') ?? 'Interests / Topics';
    String get groupInterestsTitle => translate('group_interests_title') ?? translate('interests') ?? 'Group Interests';
    String get searchGroups => translate('search_groups');
    String get invitations => translate('invitations');
  
    String get accept => translate('accept');
    String get decline => translate('decline');
    String get inviteMembers => translate('invite_members');
    String get bssGroup => translate('bss_group');
    String get sssGroup => translate('sss_group');
    String get yssGroup => translate('yss_group');
    String get otherGroup => translate('other_group');
    String get browseGroups => translate('browse_groups');
    String get noPublicGroups => translate('no_public_groups');
    String get noResults => translate('no_results');
    String get publicGroup => translate('public_group');
    String get privateGroup => translate('private_group');
    String get requestToJoin => translate('request_to_join');
    String get joinRequestSent => translate('join_request_sent');
    String get pendingApproval => translate('pending_approval');
  
  
    // Events
    String get createEvent => translate('create_event');
    String get editEvent => translate('edit_event');
    String get eventDetails => translate('event_details');
    String get eventDate => translate('event_date');
    String get eventTime => translate('event_time');
    String get eventLocation => translate('event_location');
    String get eventDescription => translate('event_description');
    String get noEventsScheduled => translate('no_events_scheduled');
    String get register => translate('register');
    String get registered => translate('registered');
    String get attendees => translate('attendees');
    String get eventPhotos => translate('event_photos');
    String get tapToAddPhotos => translate('tap_to_add_photos');
    String get addMorePhotos => translate('add_more_photos');
    String get eventTitleLabel => translate('event_title_label');
    String get eventTitleHint => translate('event_title_hint');
    String get eventDescriptionHint => translate('event_description_hint');
    String get eventLocationLabel => translate('event_location_label');
    String get eventLocationHint => translate('event_location_hint');
    String get eventDateTimeLabel => translate('event_date_time_label');
    String get linkMediaFolder => translate('link_media_folder');
    String get linkPublicGroup => translate('link_public_group');
    String get optionalLabel => translate('optional_label');
    String get mediaFolderDesc => translate('media_folder_desc');
    String get selectFolderHint => translate('select_folder_hint');
    String get selectGroupHint => translate('select_group_hint');
    String get preparingUpload => translate('preparing_upload');
    String get uploadingPhotoProgress => translate('uploading_photo_progress');
    String get creatingEventProgress => translate('creating_event_progress');
    String get eventCreatedSuccess => translate('event_created_success');
    String get responsibleContact => translate('responsible_contact');
    String get selectUser => translate('select_user');
    String get enterManually => translate('enter_manually');
    String get findResponsiblePerson => translate('find_responsible_person');
    String get contactName => translate('contact_name');
    String get contactRole => translate('contact_role');
    String get contactPhone => translate('contact_phone');
    String get none => translate('none');
    String get cameraError => translate('camera_error');
    String get createEventError => translate('create_event_error');
    String get contactRoleHint => translate('contact_role_hint');
    String get phoneHint => translate('phone_hint');
    String get publicGroupDesc => translate('public_group_desc');
  
    // Spiritual
    String get dailyQuote => translate('daily_quote');
    String get meditation => translate('meditation');
    String get resources => translate('resources');
    String get spiritualTips => translate('spiritual_tips');
    String get gayatriMantra => translate('gayatri_mantra');
    String get books => translate('books');
    String get audio => translate('audio');
    String get videos => translate('videos');
    String get pictures => translate('pictures');
    String get bhajans => translate('bhajans');
    String get noBooksAvailable => translate('no_books_available');
    String get noAudioAvailable => translate('no_audio_available');
    String get noVideosAvailable => translate('no_videos_available');
    String get noPicturesAvailable => translate('no_pictures_available');
    String get noBhajansAvailable => translate('no_bhajans_available');
    String get checkBackLater => translate('check_back_later');
    String get open => translate('open');
    String get checkOutResource => translate('check_out_resource');
    String get errorUrlEmpty => translate('error_url_empty');
    String get cannotDownloadVideo => translate('cannot_download_video');

    String get noDescription => translate('no_description');
    String get errorCannotLaunch => translate('error_cannot_launch');
    String get emergencySummary => translate('emergency_summary');
    String get resolutionNote => translate('resolution_note');
    String get callRequired => translate('call_required');
    String get callLogged => translate('call_logged');
    String get sosCreated => translate('sos_created');
    String get viewHistory => translate('view_history');
    String get mySosHistory => translate('my_sos_history');
    String get callNow => translate('call_now');
    String get statusOpen => translate('status_open');
    String get statusAcknowledged => translate('status_acknowledged');
    String get statusResolved => translate('status_resolved');
    String get statusCancelled => translate('status_cancelled');
    String get acknowledged => translate('acknowledged');
    String get waiting => translate('waiting');
    String get resolved => translate('resolved');
    String managedBy(String name) => translate('managed_by').replaceFirst('{name}', name);
    String by(String name) => translate('by').replaceFirst('{name}', name);
    String get roleAdmin => translate('role_admin');
    String get roleParent => translate('role_parent');
    String get roleGuruji => translate('role_guruji');
    String get roleUnknown => translate('role_unknown');


  
    // Service Requests
    String get requestServiceTitle => translate('request_service_title');
    String get editRequestTitle => translate('edit_request_title');
    String get addExtraItem => translate('add_extra_item');
    String get submitRequest => translate('submit_request');
    String get attachmentsOptional => translate('attachments_optional');
    String get clientLabel => translate('client_label');
    String get yagyaKarmkaandRituals => translate('yagya_karmkaand_rituals');
    String get selected => translate('selected');
    String get pleaseSelectServiceType => translate('please_select_service_type');
    String get viewMyRequests => translate('view_my_requests');
    String get serviceLocation => translate('service_location');
    String get house => translate('house');
    String get buildingApt => translate('building_apt');
    String get flatFloor => translate('flat_floor');
    String get buildingSocietyName => translate('building_society_name');
    String get streetRoadName => translate('street_road_name');
    String get landmarkOptional => translate('landmark_optional');
    String get searchByDescription => translate('search_by_description');
    String get allStatus => translate('all_status');
    String get cityHint => translate('city_hint');
    String get selectServiceTypeError => translate('select_service_type_error');
    String get userRequestedItems => translate('user_requested_items');
    String get preferred => translate('preferred');
    String get selectDateTimeError => translate('select_date_time_error');
    String get requestUpdated => translate('request_updated');
    String get requestSubmitted => translate('request_submitted');
    String get notesHint => translate('notes_hint');
  
    // Guruji Dashboard Tabs
    String get tabToday => translate('tab_today');
    String get tabNewRequests => translate('tab_new_requests');
    String get tabMyAssigned => translate('tab_my_assigned');
    String get tabCalendar => translate('tab_calendar');
    String get noServicesToday => translate('no_services_today');
    String get enjoyDay => translate('enjoy_day');
    String get noNewRequests => translate('no_new_requests');
    String get checkBackLaterRequests => translate('check_back_later_requests');
    String get availableRequests => translate('available_requests_title');
    String get confirmAssignment => translate('confirm_assignment');
    String get unableToAttend => translate('unable_to_attend');
    String get markCompleted => translate('mark_completed');
    String get openDirections => translate('open_directions');
    String get approveAll => translate('approve_all');
    String get requestRevision => translate('request_revision');
    String get saveNotes => translate('save_notes');
    String get yourNotesToAdmin => translate('your_notes_to_admin');
    String get addNotesHint => translate('add_notes_hint');
    String get samagriActions => translate('samagri_actions');
    String get samagriApprovedLocked => translate('samagri_approved_locked');
    String get requiredSamagriAdmin => translate('required_samagri_admin');
  
    // Storage/Media
    String get root => translate('root');
    String get folders => translate('folders');
    String get files => translate('files');
    String get noFiles => translate('no_files');
    String get downloading => translate('downloading');
    String get shareFile => translate('share_file');
    String get openFile => translate('open_file');
    String get storageManager => translate('storage_manager');
  
    // Tutorial/Onboarding
    String get tutorialProfileTitle => translate('tutorial_profile_title');
    String get tutorialProfileDesc => translate('tutorial_profile_desc');
    String get tutorialDailyInspirationTitle => translate('tutorial_daily_inspiration_title');
    String get tutorialDailyInspirationDesc => translate('tutorial_daily_inspiration_desc');
    String get tutorialCelebrationsTitle => translate('tutorial_celebrations_title');
    String get tutorialCelebrationsDesc => translate('tutorial_celebrations_desc');
    String get tutorialCalendarDesc => translate('tutorial_calendar_desc');
    String get tutorialNewsDesc => translate('tutorial_news_desc');
    String get tutorialEventsTitle => translate('tutorial_events_title');
    String get tutorialEventsDesc => translate('tutorial_events_desc');
    String get tutorialGroupsTitle => translate('tutorial_groups_title');
    String get tutorialGroupsDesc => translate('tutorial_groups_desc');
    String get tutorialSpiritualDesc => translate('tutorial_spiritual_desc');
    String get tutorialRequestServiceTitle => translate('tutorial_request_service_title');
    String get tutorialRequestServiceDesc => translate('tutorial_request_service_desc');
    String get tutorialSevaTitle => translate('tutorial_seva_title');
    String get tutorialSevaDesc => translate('tutorial_seva_desc');
    String get tutorialMediaTitle => translate('tutorial_media_title');
    String get tutorialMediaDesc => translate('tutorial_media_desc');
    String get tutorialBottomNavTitle => translate('tutorial_bottom_nav_title');
    String get tutorialBottomNavDesc => translate('tutorial_bottom_nav_desc');
    String get tutorialGurujiTodayTitle => translate('tutorial_guruji_today_title');
    String get tutorialGurujiTodayDesc => translate('tutorial_guruji_today_desc');
    String get tutorialGurujiNewReqTitle => translate('tutorial_guruji_new_req_title');
    String get tutorialGurujiNewReqDesc => translate('tutorial_guruji_new_req_desc');
    String get tutorialGurujiAssignedTitle => translate('tutorial_guruji_assigned_title');
    String get tutorialGurujiAssignedDesc => translate('tutorial_guruji_assigned_desc');
    String get tutorialGurujiSevaTitle => translate('tutorial_guruji_seva_title');
    String get tutorialGurujiSevaDesc => translate('tutorial_guruji_seva_desc');
    String get tutorialGurujiCalendarTitle => translate('tutorial_guruji_calendar_title');
    String get tutorialGurujiCalendarDesc => translate('tutorial_guruji_calendar_desc');
    String get tutorialEmergencySosTitle => translate('tutorial_emergency_sos_title');
    String get tutorialEmergencySosDesc => translate('tutorial_emergency_sos_desc');
    String get tutorialMandirScheduleTitle => translate('tutorial_mandir_schedule_title');
    String get tutorialMandirScheduleDesc => translate('tutorial_mandir_schedule_desc');
    String get tutorialUpcomingEventsTitle => translate('tutorial_upcoming_events_title');
    String get tutorialUpcomingEventsDesc => translate('tutorial_upcoming_events_desc');
    String get tutorialLatestNewsTitle => translate('tutorial_latest_news_title');
    String get tutorialLatestNewsDesc => translate('tutorial_latest_news_desc');
    String get tutorialGurujiSosTitle => translate('tutorial_guruji_sos_title');
    String get tutorialGurujiSosDesc => translate('tutorial_guruji_sos_desc');
  
    // Volunteers/Seva
    String get assignVolunteers => translate('assign_volunteers');
    String get volunteerInvitations => translate('volunteer_invitations');
    String get groupInvitations => translate('group_invitations');
    String get noVolunteerInvitations => translate('no_volunteer_invitations');
    String get volunteerInvitationSHint => translate('volunteer_invitations_hint');
    String get volunteerInvitation => translate('volunteer_invitation');
    String get volunteerRole => translate('volunteer_role');
    String get selectMember => translate('select_member');
    String get chooseMember => translate('choose_member');
  
    // Chat
    String get typeMessage => translate('type_message');
    String get send => translate('send');
    String get noMessages => translate('no_messages');
    String get startConversation => translate('start_conversation');
  
    // Admin
    String get adminDashboard => translate('admin_dashboard');
    String get manageUsers => translate('manage_users');
    String get manageGroups => translate('manage_groups');
    String get manageEvents => translate('manage_events');
    String get manageNews => translate('manage_news');
    String get manageServices => translate('manage_services');
    String get manageBranches => translate('manage_branches');
    String get manageGurujis => translate('manage_gurujis');
  
    // Guruji
    String get gurujiDashboard => translate('guruji_dashboard');
    String get myGroupsGuruji => translate('my_groups_guruji');
    String get serviceRequests => translate('service_requests');
  
    // Guruji Feature Extended
    String get sevaTab => translate('seva_tab');
    String get calendarTab => translate('calendar_tab');
    String get sevaCoordinatorDashboard => translate('seva_coordinator_dashboard');
    String get yajmanLabel => translate('yajman_label');
    String get contactLabel => translate('contact_label');
    String get dateLabel => translate('date_label');
    String get timeLabel => translate('time_label');
    String get addressLabel => translate('address_label');
    String get gurujisInterested => translate('gurujis_interested');
    String get iCanTakeRequest => translate('i_can_take_request');
    String get waitingAdminAssign => translate('waiting_admin_assign');
    String get volunteeredSuccess => translate('volunteered_success');
    String get userRequestedItemsTitle => translate('user_requested_items_title');
    String get notePrefix => translate('note_prefix');
    String get editReason => translate('edit_reason');
    String get notPossible => translate('not_possible');
    String get confirmBtn => translate('confirm_btn');
    String get userAttachments => translate('user_attachments');
    String get requiredSamagriChecklist => translate('required_samagri_checklist');
    String get gallery => translate('gallery');
    String get completeAction => translate('complete_action');
    String get completingService => translate('completing_service');
    String get serviceCompletedSuccess => translate('service_completed_success');
    String get markUnavailable => translate('mark_unavailable');
    String get markUnavailableConfirm => translate('mark_unavailable_confirm');
    String get reasonOptional => translate('reason_optional');
  
    // Auth Feature Extended
    String get loginFailed => translate('login_failed');
    String get resetPasswordDesc => translate('reset_password_desc');
    String get enterEmailError => translate('enter_email_error');
    String get enterValidEmailError => translate('enter_valid_email_error');
    String get resetLinkSent => translate('reset_link_sent');
    String get enterEmailOrPhone => translate('enter_email_or_phone');
    String get enterPasswordError => translate('enter_password_error');
    String get signupFailed => translate('signup_failed');
    String get termsErrorMsg => translate('terms_error_msg');
    String get enterNameError => translate('enter_name_error');
    String get otpTitle => translate('otp_title');
    String get otpDesc => translate('otp_desc');
    String get resendOtpTimer => translate('resend_otp_timer');
    String get didntReceiveCode => translate('didnt_receive_code');
    String get resendOtpAction => translate('resend_otp_action');
    String get verifyContinue => translate('verify_continue');
    String get otpSentSuccess => translate('otp_sent_success');
    String get otpResentSuccess => translate('otp_resent_success');
    String get setUsernameTitle => translate('set_username_title');
    String get changeUsernameTitle => translate('change_username_title');
    String get usernameDesc => translate('username_desc');
    String get usernameLabel => translate('username_label');
    String get usernameHint => translate('username_hint');
    String get usernameAvailable => translate('username_available');
    String get usernameTaken => translate('username_taken');
    String get checkAvailabilityError => translate('check_availability_error');
    String get usernameRequired => translate('username_required');
    String get usernameTooShort => translate('username_too_short');
    String get usernameTooLong => translate('username_too_long');
    String get usernameNoSpaces => translate('username_no_spaces');
    String get usernameInvalidChars => translate('username_invalid_chars');
    String get usernameSetSuccess => translate('username_set_success');
    String get usernameSetError => translate('username_set_error');
    String get usernameChangeLimitMsg => translate('username_change_limit_msg');
    String get canChangeInDays => translate('can_change_in_days');
    String get canChangeNow => translate('can_change_now');
    String get notSetYet => translate('not_set_yet');
    String get setUsernameBtn => translate('set_username_btn');
    String get updateBtn => translate('update_btn');
  
    // Errors and Messages
    String get somethingWentWrong => translate('something_went_wrong');
    String get pleaseTryAgain => translate('please_try_again');
    String get noInternet => translate('no_internet');
    String get sessionExpired => translate('session_expired');
    String get invalidEmail => translate('invalid_email');
    String get passwordTooShort => translate('password_too_short');
    String get passwordsDontMatch => translate('passwords_dont_match');
    String get fieldRequired => translate('field_required');
    String get savedSuccessfully => translate('saved_successfully');
    String get deletedSuccessfully => translate('deleted_successfully');
    String get updatedSuccessfully => translate('updated_successfully');
    String get areYouSure => translate('are_you_sure');
    String get thisActionCannotBeUndone => translate('this_action_cannot_be_undone');
  
    // Welcome/Onboarding
    String get welcome => translate('welcome');
    String get getStarted => translate('get_started');
    String get skip => translate('skip');
    String get continueText => translate('continue_text');
    
    // Onboarding Screen Titles & Descriptions
    String get onboardingTitle1 => translate('onboarding_title_1');
    String get onboardingDesc1 => translate('onboarding_desc_1');
    String get onboardingTitle2 => translate('onboarding_title_2');
    String get onboardingDesc2 => translate('onboarding_desc_2');
    String get onboardingTitle3 => translate('onboarding_title_3');
    String get onboardingDesc3 => translate('onboarding_desc_3');
  
    // Change Password
    String get changePasswordDesc => translate('change_password_desc');
    String get currentPassword => translate('current_password');
    String get newPassword => translate('new_password');
    String get passwordTips => translate('password_tips');
    String get passwordTip1 => translate('password_tip_1');
    String get passwordTip2 => translate('password_tip_2');
    String get passwordTip3 => translate('password_tip_3');
    String get passwordTip4 => translate('password_tip_4');
  
    // Profile Setup & Edit
    String get saveChanges => translate('save_changes');
    String get takePhoto => translate('take_photo');
    String get chooseFromGallery => translate('choose_from_gallery');
    String get verifyPassword => translate('verify_password');
    String get verifyPasswordDesc => translate('verify_password_desc');
  
    String get verify => translate('verify');
    String get incorrectPassword => translate('incorrect_password');
    String get profileUpdated => translate('profile_updated');
    String get failedSave => translate('failed_save');
    String get selectInterestError => translate('select_interest_error');
    String get cityLocation => translate('city_location');
    String get selectLocation => translate('select_location');
    String get selectLocationError => translate('select_location_error');
  
    String get enterPhoneError => translate('enter_phone_error');
    String get invalidPhoneError => translate('invalid_phone_error');
    String get enterDobError => translate('enter_dob_error');
    String get maritalStatus => translate('marital_status');
    String get marriageAnniversary => translate('marriage_anniversary');
    String get engagementDate => translate('engagement_date');
    String get single => translate('single');
    String get engagedLabel => translate('engaged');
    String get marriedLabel => translate('married');
    String get widowWidower => translate('widow_widower');
    String get selectYourInterests => translate('select_your_interests');
    String get usernameHelperText => translate('username_helper_text');
    String get usernameMinLength => translate('username_min_length');
    String get usernameMaxLength => translate('username_max_length');
  
    String get usernameCooldownMsg => translate('username_cooldown_msg');
    String get usernameLockedMsg => translate('username_locked_msg');
    String get daysLabel => translate('days');


    String get enterFullName => translate('enter_full_name');
    String get enterPhone => translate('enter_phone');
    String get enterValidPhone => translate('enter_valid_phone');
    String get selectDob => translate('select_dob');
    String get selectGender => translate('select_gender');
    String get selectGenderError => translate('select_gender_error');
    
    String get interestMusic => translate('interest_music');
    String get interestTeaching => translate('interest_teaching');
    String get interestSocialService => translate('interest_social_service');
    String get interestYouthActivities => translate('interest_youth_activities');
    String get interestEventOrganization => translate('interest_event_organization');
    String get interestContentCreation => translate('interest_content_creation');
    String get interestTechnicalSupport => translate('interest_technical_support');

    String get emergencySosAlert => translate('emergency_sos_alert');

  
    // Terms & Conditions
    String get termsUpdateDate => translate('terms_update_date');
    String get terms1Title => translate('terms_1_title');
    String get terms1Content => translate('terms_1_content');
    String get terms2Title => translate('terms_2_title');
    String get terms2Content => translate('terms_2_content');
    String get terms3Title => translate('terms_3_title');
    String get terms3Content => translate('terms_3_content');
    String get terms4Title => translate('terms_4_title');
    String get terms4Content => translate('terms_4_content');
    String get terms5Title => translate('terms_5_title');
    String get terms5Content => translate('terms_5_content');
    String get terms6Title => translate('terms_6_title');
    String get terms6Content => translate('terms_6_content');
    String get terms7Title => translate('terms_7_title');
    String get terms7Content => translate('terms_7_content');
    String get terms8Title => translate('terms_8_title');
    String get terms8Content => translate('terms_8_content');
    String get terms9Title => translate('terms_9_title');
    String get terms9Content => translate('terms_9_content');
    String get terms10Title => translate('terms_10_title');
    String get terms10Content => translate('terms_10_content');
    String get terms11Title => translate('terms_11_title');
    String get terms11Content => translate('terms_11_content');
  
    // Privacy Policy
    String get privacyUpdateDate => translate('privacy_update_date');
    String get privacy1Title => translate('privacy_1_title');
    String get privacy1Content => translate('privacy_1_content');
    String get privacy2Title => translate('privacy_2_title');
    String get privacy2Content => translate('privacy_2_content');
    String get privacy3Title => translate('privacy_3_title');
    String get privacy3Content => translate('privacy_3_content');
    String get privacy4Title => translate('privacy_4_title');
    String get privacy4Content => translate('privacy_4_content');
    String get privacy5Title => translate('privacy_5_title');
    String get privacy5Content => translate('privacy_5_content');
    String get privacy6Title => translate('privacy_6_title');
    String get privacy6Content => translate('privacy_6_content');
    String get privacy7Title => translate('privacy_7_title');
    String get privacy7Content => translate('privacy_7_content');
    String get privacy8Title => translate('privacy_8_title');
    String get privacy8Content => translate('privacy_8_content');
    String get privacy9Title => translate('privacy_9_title');
    String get privacy9Content => translate('privacy_9_content');
    String get privacy10Title => translate('privacy_10_title');
    String get privacy10Content => translate('privacy_10_content');
    String get privacy11Title => translate('privacy_11_title');
    String get privacy11Content => translate('privacy_11_content');
    String get privacy12Title => translate('privacy_12_title');
    String get privacy12Content => translate('privacy_12_content');
  
    // Celebrations
    String get celebrationsPageTitle => translate('celebrations_page_title');
    String get noCelebrationsToday => translate('no_celebrations_today');
    String get specialNote => translate('special_note');
    String get chantMantra => translate('chant_mantra');
    String get yagyaAhuti => translate('yagya_ahuti');
    String get sendBlessings => translate('send_blessings');
    String get birthdays => translate('birthdays');
    String get anniversaries => translate('anniversaries');
    String get turningAgePrefix => translate('turning_age_prefix');
    String get turningAgeSuffix => translate('turning_age_suffix');
    String get blessingsMsg => translate('blessings_msg');
    String get celebratingYearsPrefix => translate('celebrating_years_prefix');
    String get celebratingYearsSuffix => translate('celebrating_years_suffix');
    String get festivalCalendar => translate('festival_calendar');
    String get noEventsDay => translate('no_events_day');
  
    // Festivals
    String get makarSankranti => translate('makar_sankranti');
    String get vasantPanchami => translate('vasant_panchami');
    String get mahaShivaratri => translate('maha_shivaratri');
    String get holi => translate('holi');
    String get ramNavami => translate('ram_navami');
    String get rakshaBandhan => translate('raksha_bandhan');
    String get janmashtami => translate('janmashtami');
    String get ganeshChaturthi => translate('ganesh_chaturthi');
    String get dussehra => translate('dussehra');
    String get diwali => translate('diwali');
  
    // Service Request Messages
    String get cancelRequestTitle => translate('cancel_request_title');
    String get cancelRequestContent => translate('cancel_request_content');
    String get yesCancel => translate('yes_cancel');
    String get requestCancelled => translate('request_cancelled');
    String get confirmed => translate('confirmed');
    String get tbd => translate('tbd');
    String get gurujiLabel => translate('guruji_label');
    String get temporarilyUnavailable => translate('temporarily_unavailable');
    String get cancellationReason => translate('cancellation_reason');
    String get cancelledBy => translate('cancelled_by');
    String get onDate => translate('on_date');
    String get requestNotFound => translate('request_not_found');
    String get confirmedDate => translate('confirmed_date');
    String get confirmedTime => translate('confirmed_time');
    String get assignedGuruji => translate('assigned_guruji');
    String get adminNotesLabel => translate('admin_notes_label');
    String get cancellationDetails => translate('cancellation_details');
    String get samagriApprovedMsg => translate('samagri_approved_msg');
    String get requestOnHold => translate('request_on_hold');
    String get reasonLabel => translate('reason_label');
    String get revisionRequired => translate('revision_required');
    String get revisionRequiredContent => translate('revision_required_content');
    String get gurujisNote => translate('gurujis_note');
    String get gurujiAskedTitle => translate('guruji_asked_title');
    String get requirementsChecklist => translate('requirements_checklist');
    String get noRequirementsAvailable => translate('no_requirements');
    String get optionalSuffix => translate('optional_suffix');
    String get addItem => translate('add_item');
    String get yourRequestedItems => translate('your_requested_items');
    String get notAvailable => translate('not_available');
  
    // Spiritual Feature
    String get sadhanaTracker => translate('sadhana_tracker');
    String get mantra => translate('mantra');
    String get dailyTarget => translate('daily_target');
    String get malas => translate('malas');
    String get completion => translate('completion');
    String get quotes => translate('quotes');
    String get achievements => translate('achievements');
    String get lifetimeProgress => translate('lifetime_progress');
    String get calendarHeatmap => translate('calendar_heatmap');
    String get personalRecords => translate('personal_records');
    String get bestDay => translate('best_day');
    String get bestStreak => translate('best_streak');
    String get locked => translate('locked');
    String get unlocked => translate('unlocked');
    String get reminderSettings => translate('reminder_settings');
    String get dailyReminder => translate('daily_reminder');
    String get setReminderTime => translate('set_reminder_time');
    String get resetCount => translate('reset_count');
    String get resetCountConfirm => translate('reset_count_confirm');
    String get totalMalas => translate('total_malas');
    String get activeDays => translate('active_days');
    String get thisWeek => translate('this_week');
    String get thisMonth => translate('this_month');
    String get mantraDistribution => translate('mantra_distribution');
    String get startSadhanaAnalytics => translate('start_sadhana_analytics');
    String get pleaseLoginAnalytics => translate('please_login_analytics');
    String get selectMantra => translate('select_mantra');
    String get tapCount => translate('tap_count');
    String get counting => translate('counting');
    String get malasDone => translate('malas_done');
    String get target => translate('target');
    String get totalCount => translate('total_count');
    String get dailyProgress => translate('daily_progress');
    String get targetMet => translate('target_met');
    String get addFullMala => translate('add_full_mala');
    String get completeMalaBtn => translate('complete_mala_btn');
    String get completeMalaTitle => translate('complete_mala_title');
    String get confirmCompleteMala => translate('confirm_complete_mala');
    String get malaCompletedTitle => translate('mala_completed_title');
    String get unlockedPrefix => translate('unlocked_prefix');
    
    // Sadhana View (Guruji)
    String get viewSadhana => translate('view_sadhana');
    String get sadhanaProgress => translate('sadhana_progress');
    String get noStudentsInGroup => translate('no_students_in_group');

    String get privateNotShared => translate('private_not_shared');
  
    // Sadhana Settings
    String get hapticFeedback => translate('haptic_feedback');
    String get vibrationOnTap => translate('vibration_on_tap');
    String get clearProgress => translate('clear_progress');
    String get scheduledFor => translate('scheduled_for');
    String get dailyNudge => translate('daily_nudge');
    String get reminderTimeLabel => translate('reminder_time_label');
    String get selectDailyTarget => translate('select_daily_target');
    String get vibrationOn => translate('vibration_on');
    String get vibrationOff => translate('vibration_off');
    String get analytics => translate('analytics');
    String get history => translate('history');
  
    // General & Missing
    String get reset => translate('reset');
  
    String get daily => translate('daily');
  
    // Groups Feature Extended
    String get createNewGroup => translate('create_new_group');
    String get groupTypeLabel => translate('group_type_label');
    String get eventGroup => translate('event_group');
    String get bssGroupTitle => translate('bss_group_title');
    String get meetingGroup => translate('meeting_group');
    String get customGroup => translate('custom_group');
    String get onlyAdminCreateBSS => translate('only_admin_create_bss');
    String get selectBranchError => translate('select_branch_error');
    String get selectGurujiError => translate('select_guruji_error');
    String get enableAttendance => translate('enable_attendance');
    String get allowMarkingAttendance => translate('allow_marking_attendance');
    String get publicGroupLabel => translate('public_group_label');
    String get privateGroupLabel => translate('private_group_label');
    // publicGroupDesc removed (duplicate)
    String get privateGroupDesc => translate('private_group_desc');
    String get publicGroupApprovalNote => translate('public_group_approval_note');
    String get groupCreatedApproval => translate('group_created_approval');
    String get groupCreatedSuccess => translate('group_created_success');
    String get editGroupTitle => translate('edit_group_title');
    String get deleteGroupTitle => translate('delete_group_title');
    String get deleteGroupConfirm => translate('delete_group_confirm');
    String get groupNameEmptyError => translate('group_name_empty_error');
    String get groupUpdatedSuccess => translate('group_updated_success');
    String get groupDeletedSuccess => translate('group_deleted_success');
    String get joinRequestSuccessWaiting => translate('join_request_success_waiting');
    String get checkBackLaterGroups => translate('check_back_later_groups');
    String get tryDifferentSearch => translate('try_different_search');
    String get noPublicGroupsAvail => translate('no_public_groups_avail');
    String get searchGroupsHint => translate('search_groups_hint');
    String get resendCodeIn => translate('resend_code_in');
    String get resendOtp => translate('resend_otp');
  
    // Browse Groups Extended
    String get availableToJoin => translate('available_to_join');
    String get yourPublicGroups => translate('your_public_groups');
    String get noPublicGroupsJoined => translate('no_public_groups_joined');
    String get groupsYouJoinAppearHere => translate('groups_you_join_appear_here');
    String get noGroupsCreated => translate('no_groups_created');
    String get publicGroupsYouCreateAppearHere => translate('public_groups_you_create_appear_here');
    String get noGroupsWithStatus => translate('no_groups_with_status');
    String get yourGroupRequests => translate('your_group_requests');
    String get allGroupsJoinedOrNone => translate('all_groups_joined_or_none');
    String get explore => translate('explore');
    String get joined => translate('joined');
    String get publicGroupsTitle => translate('public_groups_title');
  
    // Spiritual
    String get dailyInspiration => translate('daily_inspiration');
    String get spiritualPractice => translate('spiritual_practice');
    String get sadhana => translate('sadhana');
    String get swadhyay => translate('swadhyay');
    String get mantraJapa => translate('mantra_japa');
    String get digitalLibrary => translate('digital_library');
    String get dailyThoughts => translate('daily_thoughts');
  
    // Important Info
    String get importantLocations => translate('important_locations');
    String get searchLocationsHint => translate('search_locations_hint');
    String get importantContacts => translate('important_contacts');
    String get searchContactsHint => translate('search_contacts_hint');
    String get openGoogleMaps => translate('open_google_maps');
    String get allTags => translate('all_tags');
    String get allRoles => translate('all_roles');
    String get noLocationsFound => translate('no_locations_found');
    String get noContactsFound => translate('no_contacts_found');
    String get callAction => translate('call_action');
    String get saveContactShare => translate('save_contact_share');
  
    // Sadhana Settings
    String get malaQuarter => translate('mala_quarter') == 'mala_quarter' ? '¼ Mala' : translate('mala_quarter');
    String get malaHalf => translate('mala_half') == 'mala_half' ? '½ Mala' : translate('mala_half');
    String get malaOne => translate('mala_1') == 'mala_1' ? '1 Mala' : translate('mala_1');
    String get descBeginners => translate('desc_beginners') == 'desc_beginners' ? 'Beginners / Busy days' : translate('desc_beginners');
    String get descMorningEvening => translate('desc_morning_evening') == 'desc_morning_evening' ? 'Morning/Evening' : translate('desc_morning_evening');
    String get descStandard => translate('desc_standard') == 'desc_standard' ? 'Standard daily' : translate('desc_standard');
    String get descRegular => translate('desc_regular') == 'desc_regular' ? 'Regular sādhaks' : translate('desc_regular');
    String get descIntermediate => translate('desc_intermediate') == 'desc_intermediate' ? 'Intermediate' : translate('desc_intermediate');
    String get descAdvanced => translate('desc_advanced') == 'desc_advanced' ? 'Advanced' : translate('desc_advanced');
    String get descIntensive => translate('desc_intensive') == 'desc_intensive' ? 'Intensive' : translate('desc_intensive');
    String get descAnushthana => translate('desc_anushthana') == 'desc_anushthana' ? 'Anushthāna level' : translate('desc_anushthana');
    String get descDeepPractice => translate('desc_deep_practice') == 'desc_deep_practice' ? 'Deep practice' : translate('desc_deep_practice');
    String get descTraditional => translate('desc_traditional') == 'desc_traditional' ? 'Traditional goal' : translate('desc_traditional');

    // Sync Status
    String get notBackedUpYet => translate('not_backed_up_yet') == 'not_backed_up_yet' ? 'Not backed up yet' : translate('not_backed_up_yet');
    String get syncing => translate('syncing') == 'syncing' ? 'Syncing...' : translate('syncing');
    String get dataSynced => translate('data_synced') == 'data_synced' ? 'Data synced' : translate('data_synced');
    String get dataNotSynced => translate('data_not_synced') == 'data_not_synced' ? 'Data not synced, saved on device' : translate('data_not_synced');
    String get backingUpData => translate('backing_up_data') == 'backing_up_data' ? 'Backing up data to cloud...' : translate('backing_up_data');
    String get dataSyncedCloud => translate('data_synced_cloud') == 'data_synced_cloud' ? 'Data synced, saved on cloud' : translate('data_synced_cloud');

    // Add Mantra Dialog
    String get addMantraTitle => translate('add_mantra_title');
    String get mantraNameLabel => translate('mantra_name_label');
    String get mantraDescLabel => translate('mantra_desc_label');
    String get mantraDescHint => translate('mantra_desc_hint') == 'mantra_desc_hint' ? 'Enter mantra text...' : translate('mantra_desc_hint');
    String get enterMantraNameError => translate('enter_mantra_name_error');
    String get addBtn => translate('add_btn') == 'add_btn' ? 'Add' : translate('add_btn');
    String get cancelBtn => translate('cancel_btn') == 'cancel_btn' ? 'Cancel' : translate('cancel_btn');
  
    // Seva Appreciation
    String get completeWithGratitude => translate('complete_with_gratitude');
    String get shareYourGratitude => translate('share_your_gratitude');
    String get selectBadgeType => translate('select_badge_type');
    String get dedicatedSeva => translate('dedicated_seva');
    String get timeSeva => translate('time_seva');
    String get teamSeva => translate('team_seva');
    String get impactfulSeva => translate('impactful_seva');
    String get sevaContributions => translate('seva_contributions');
    String get appreciationsReceived => translate('appreciations_received');
    String get noAppreciationsYet => translate('no_appreciations_yet');
    String get appreciationSent => translate('appreciation_sent');
    String get characterCount => translate('character_count');
    String get pleaseShareGratitude => translate('please_share_gratitude');
    String get writeAtLeast50Chars => translate('write_at_least_50_chars');
    String get keepUnder200Chars => translate('keep_under_200_chars');
    String get pleaseSelectBadge => translate('please_select_badge');
    String get alreadyAppreciated => translate('already_appreciated');
    String get gratitudeForSeva => translate('gratitude_for_seva');
    String sevaAppreciatedMsg(String title) => translate('seva_appreciated_msg').replaceAll('{title}', title);
    String get sevaContributionsRecognized => translate('seva_contributions_recognized');
    String get sendingGratitude => translate('sending_gratitude');
    String get sendGratitude => translate('send_gratitude');
  
    // Family Connections Getters
    String get familyConnections => translate('family_connections');
    String get familyConnectionsSubtitle => translate('family_connections_subtitle');
    String get sendFamilyLinkRequest => translate('send_family_link_request');
    String get manageFamilyLinks => translate('manage_family_links');
    String get myConnections => translate('my_connections');
    String get pendingRequests => translate('pending_requests');
    String get noFamilyConnections => translate('no_family_connections');
    String get noPendingFamilyRequests => translate('no_pending_family_requests');
    String get familyRequestsAppearHere => translate('family_requests_appear_here');
    String get sendLinkRequest => translate('send_link_request');
    String get emailUsername => translate('email_username');
    String get enterEmailOrUsername => translate('enter_email_or_username');
    String get emailOrUsernameRequired => translate('email_or_username_required');
    String get userNotFound => translate('user_not_found');
    String get searching => translate('searching');
    String get youWillBeSupporterOf => translate('you_will_be_supporter_of');
    String get relationshipType => translate('relationship_type');
    String get parentToChild => translate('parent_to_child');
    String get parentChildDesc => translate('parent_child_desc');
    String get caregiverToElder => translate('caregiver_to_elder');
    String get caregiverElderDesc => translate('caregiver_elder_desc');
    String get supporterHelperText => translate('supporter_helper_text');
    String get messageOptional => translate('message_optional');
    String get addPersonalMessage => translate('add_personal_message');
    String get sendRequest => translate('send_request');
    String get sending => translate('sending');
    String get linkRequestSent => translate('link_request_sent');
    String get familyLinkAccepted => translate('family_link_accepted');
    String get child => translate('child');
    String get parent => translate('parent');
    String get elder => translate('elder');
    String get caregiver => translate('caregiver');
    String get noAttendanceRecords => translate('no_attendance_records');
    String get appPreferences => translate('app_preferences');
    String get resetTutorial => translate('reset_tutorial');
    String get resetTutorialSubtitle => translate('reset_tutorial_subtitle');

    // Service & Seva Enhancements
    String get linkedStorageFolder => translate('linked_storage_folder');
    String get noFolderLinked => translate('no_folder_linked');
    String get linkFolder => translate('link_folder');
    String get change => translate('change');
    String get filterOptions => translate('filter_options');
    String get noDateSet => translate('no_date_set');
    String get searchByName => translate('search_by_name');
    String get noUsersFound => translate('no_users_found');
    String get selectFolder => translate('select_folder');
    String get clearSelection => translate('clear_selection');
    String get selectCurrent => translate('select_current');
    String get filterByUser => translate('filter_by_user');
    String get filteredCheck => translate('filtered_check');
    String get userFiltered => translate('user_filtered');
    String get clearFilter => translate('clear_filter');
    String xRequests(int count) => translate('x_requests').replaceFirst('{count}', count.toString());

    // Activity Log Actions
    String get activityRequestCreated => translate('activity_request_created');
    String get activityItemSelected => translate('activity_item_selected');
    String get activityItemDeselected => translate('activity_item_deselected');
    String get activitySpecialItemAdded => translate('activity_special_item_added');
    String get activitySpecialItemRemoved => translate('activity_special_item_removed');
    String get activityRequestRevised => translate('activity_request_revised');
    String get activityItemApproved => translate('activity_item_approved');
    String get activityItemRejected => translate('activity_item_rejected');
    String get activityApprovedAll => translate('activity_approved_all');
    String get activityRevisionRequested => translate('activity_revision_requested');
    String get activityGurujiVolunteered => translate('activity_guruji_volunteered');
    String get activityGurujiNote => translate('activity_guruji_note');
    String get activityGurujiAssigned => translate('activity_guruji_assigned');
    String get activityAdminNotes => translate('activity_admin_notes');
    String get activityAdminNote => translate('activity_admin_note');
    String get activityStatusChanged => translate('activity_status_changed');

    // Activity Detail Templates
    String activityGurujiApprovedItemDetail(String item) => translate('activity_guruji_approved_item_detail').replaceFirst('{item}', item);
    String activityGurujiRejectedItemDetail(String item, String reason) => translate('activity_guruji_rejected_item_detail').replaceFirst('{item}', item).replaceFirst('{reason}', reason);
    String get activityApprovedAllDetail => translate('activity_approved_all_detail');
    String activityRevisionRequestedDetail(String reason) => translate('activity_revision_requested_detail').replaceFirst('{reason}', reason);
    String get activityUserRevisedDetail => translate('activity_user_revised_detail');
    String activityUserSelectedItemDetail(String item) => translate('activity_user_selected_item_detail').replaceFirst('{item}', item);
    String activityUserDeselectedItemDetail(String item) => translate('activity_user_deselected_item_detail').replaceFirst('{item}', item);
    String activityGurujiVolunteeredDetail(String name) => translate('activity_guruji_volunteered_detail').replaceFirst('{name}', name);
    String get activityGurujiLeftNoteDetail => translate('activity_guruji_left_note_detail');
    String get activityAdminLeftNoteDetail => translate('activity_admin_left_note_detail');

    String get mandirServices => translate('mandir_services');
    String get sevaVolunteer => translate('seva_volunteer');
    String get startAnushthanSubtitle => translate('start_anushthan_subtitle');
    String get offlineBackupMessage => translate('offline_backup_message');
    String get sadhanaHistory => translate('sadhana_history');
    String get noRecordsYet => translate('no_records_yet');
    String get dayStreak => translate('day_streak');
    String get keepFlameAlive => translate('keep_flame_alive');
    String get completeMalaStart => translate('complete_mala_start');
    String get malasLabel => translate('malas_label');
    String get pleaseLogin => translate('please_login');
    String get noEmergencyContacts => translate('no_emergency_contacts');
    String get noPendingRequests => translate('no_pending_requests');
    String malasFormat(int count) => translate('malas_format').replaceFirst('{count}', count.toString());
    String get sevaOpportunities => translate('seva_opportunities');
    String get noSevaOpportunities => translate('no_seva_opportunities');
    String get manageSevaOpportunities => translate('manage_seva_opportunities');
    String get requestDeclined => translate('request_declined');
    String get unlink => translate('unlink');
    String get unlinkConfirm => translate('unlink_confirm');
    String get familyLinking => translate('family_linking');

    // Logout
    String get logoutConfirmation => translate('logout_confirmation');
    String get confirmLogout => translate('confirm_logout');
    String get parentChildLinkRequest => translate('parent_child_link_request');
    String get elderCaregiverLinkRequest => translate('elder_caregiver_link_request');
    String get from => translate('from');
    String get requested => translate('requested');
    String get aboutFamilyConnections => translate('about_family_connections');
    String get familyConnectionsDesc => translate('family_connections_desc');
  
    String get viewPractice => translate('view_practice');
    String get requestedOn => translate('requested_on');
    String get connectedSince => translate('connected_since');
    String get confirmUnlinkTitle => translate('confirm_unlink_title');
    String get confirmUnlinkMessage => translate('confirm_unlink_message');
  
    String get practiceAndHomework => translate('practice_and_homework');
    String get supportLearning => translate('support_learning');
    String get noPracticeData => translate('no_practice_data');
    String get notTrackingPractice => translate('not_tracking_practice');
    String get practiceSummary => translate('practice_summary');
  
  
    // Recently Added
  
  
    // Missing Getters
  
    String get duration => translate('duration');
    String get bssAttendance => translate('bss_attendance');
    String get present => translate('present');
    String get absent => translate('absent');
    String get deadline => translate('deadline');
    String get attachment => translate('attachment');
    String get submission => translate('submission');
    String get late => translate('late');
    String get onTime => translate('on_time');
    String get submittedOn => translate('submitted_on');
    String get viewSubmittedWork => translate('view_submitted_work');
    String get homeworkAccepted => translate('homework_accepted');
    String get needsRevision => translate('needs_revision');
    String get remarkBy => translate('remark_by');
    String get statusPending => translate('status_pending');
    String get statusSubmitted => translate('status_submitted');
    String get statusChecked => translate('status_checked');
    String get minutesShort => translate('minutes_short');
    String get hoursShort => translate('hours_short');
  
    // Emergency Help
    String get emergencyHelp => translate('emergency_help');
    String get emergencyHelpSubtitle => translate('emergency_help_subtitle');
    String get needHelpBtn => translate('need_help_btn');
    String get alertFamilyAdmin => translate('alert_family_admin');
    String get waitMessage => translate('wait_message');
    String get orCallDirectly => translate('or_call_directly');
    String get helpRequestedNote => translate('help_requested_note');
    String get alertSentSuccess => translate('alert_sent_success');
    String get emergencyError => translate('emergency_error');
  
    // Anushthan & Gamification Getters
    String get startAnushthan => translate('start_anushthan');
    String get activeAnushthan => translate('active_anushthan');
    String get anushthanHistory => translate('anushthan_history');
    String dayXofY(Object day, Object total) => translate('day_x_of_y')
        .replaceAll('{day}', day.toString())
        .replaceAll('{total}', total.toString());
    String durationDays(int days) => translate('duration_days').replaceAll('{days}', days.toString());
    String get startDate => translate('start_date');
    String get endDate => translate('end_date');
    String get malasCompleted => translate('malas_completed');
    String get dailyTargetMalas => translate('daily_target_malas');
    String get noCompletedAnushthans => translate('no_completed_anushthans');
    String get startFirstAnushthan => translate('start_first_anushthan');
    String get totalDays => translate('total_days');
    String get logTodaysPractice => translate('log_todays_practice');
    String get viewCertificate => translate('view_certificate');
    String get sadhanaRecord => translate('sadhana_record');
    String get anushthanCompletion => translate('anushthan_completion');
    String get shareBlessings => translate('share_blessings');
    
    // Anushthan Status & UI
    String get restingStatus => translate('resting_status');
    String get completedStatus => translate('completed_status');
    String get pausedStatus => translate('paused_status');
    String get dayLabel => translate('day_label');
    String get remainingLabel => translate('remaining_label');
    String get todaysPracticePending => translate('todays_practice_pending');
    String get todaysPracticeComplete => translate('todays_practice_complete');
    String get anushthanInProgress => translate('anushthan_in_progress');
    String get totalMalasToday => translate('total_malas_today');
    String xOfYMalas(Object x, Object y) => translate('x_of_y_malas')
        .replaceAll('{x}', x.toString())
        .replaceAll('{y}', y.toString());

    String get saveCertificate => translate('save_certificate');
    String get mySpiritualJourney => translate('my_spiritual_journey');
    String get milestones => translate('milestones');
    String get markerFirstStepsTitle => translate('marker_first_steps_title');
    String get markerFirstStepsDesc => translate('marker_first_steps_desc');
    String get markerConsistentYogiTitle => translate('marker_consistent_yogi_title');
    String get markerConsistentYogiDesc => translate('marker_consistent_yogi_desc');
    String get markerDedicatedDiscipleTitle => translate('marker_dedicated_disciple_title');
    String get markerDedicatedDiscipleDesc => translate('marker_dedicated_disciple_desc');
    String get markerCenturyClubTitle => translate('marker_century_club_title');
    String get markerCenturyClubDesc => translate('marker_century_club_desc');
    String get markerMantraMasterTitle => translate('marker_mantra_master_title');
    String get markerMantraMasterDesc => translate('marker_mantra_master_desc');
    String get markerAnushthanAdeptTitle => translate('marker_anushthan_adept_title');
    String get markerAnushthanAdeptDesc => translate('marker_anushthan_adept_desc');
    String get markerEarlyRiserTitle => translate('marker_early_riser_title');
    String get markerEarlyRiserDesc => translate('marker_early_riser_desc');
    String get markerDigitalMonkTitle => translate('marker_digital_monk_title');
    String get markerDigitalMonkDesc => translate('marker_digital_monk_desc');
    String get markerFirstSevaTitle => translate('marker_first_seva_title');
    String get markerFirstSevaDesc => translate('marker_first_seva_desc');
  
    String daysLeft(int count) => translate('days_left').replaceAll('{count}', count.toString());
    String get pauseAnushthan => translate('pause_anushthan');
    String get resumeAnushthan => translate('resume_anushthan');
    String get gurujiVisibility => translate('guruji_visibility');
    String get expectedEndDate => translate('expected_end_date');
  
    String get committedPracticeDesc => translate('committed_practice_desc');
    String get activeAnushthanWarning => translate('active_anushthan_warning');
    String get chooseMantraHint => translate('choose_mantra_hint');
    
    // Missing Getters (Restored)
    String get todayCelebrationsTitle => translate('today_celebrations_title');
    String get gurujiCannotArrange => translate('guruji_cannot_arrange');
    String get notPossibleReason => translate('not_possible_reason');
    String get daysSuffix => translate('days_suffix');
    String mantrasPerDay(int count) => translate('mantras_per_day').replaceAll('{count}', count.toString());
    String get beginAnushthan => translate('begin_anushthan');
    String get anushthanStartedSuccess => translate('anushthan_started_success');
  
    String malasDailyFormat(int count) => translate('malas_daily_format').replaceAll('{count}', count.toString());
    String get durationShort => translate('duration_short');
    String get durationMedium => translate('duration_medium');
    String get durationLong => translate('duration_long');
    String get durationExtended => translate('duration_extended');
  
    String get certificateBlessing => translate('certificate_blessing');
    String certificateSavedTo(String path) => translate('certificate_saved_to').replaceAll('{path}', path);
    String get errorSharingPdf => translate('error_sharing_pdf');
    String get errorSavingPdf => translate('error_saving_pdf');
  
    String get anushthan => translate('anushthan');
  
    // Parent Monitoring Tabbed View
    // sadhana, malasDone already exist
    String get noHomeworkYet => translate('no_homework_yet');
    String get noSubmittedHomework => translate('no_submitted_homework');
    String get noAttendanceData => translate('no_attendance_data');
    String get allIsWell => translate('all_is_well');
  
  
    // Child Guidance
    String get tapMembersViewDetails => translate('tap_members_view_details');
    String get noGroupsJoinedGuidance => translate('no_groups_joined_guidance');
    String get joinGroupGuidance => translate('join_group_guidance');
    String get batch => translate('batch');
    // Family Linking Extended
    // Duplicate 'viewPractice' removed (defined at L5116)
    String get receivedRequests => translate('received_requests');
    String get sentRequests => translate('sent_requests');
    String get requestSentLabel => translate('request_sent_label');
    String get requestReceivedLabel => translate('request_received_label');
    String get cancelRequest => translate('cancel_request');

    // Group Homework
    String get viewSubmissions => translate('view_submissions');
    String get assignHomework => translate('assign_homework');
    String get editHomework => translate('edit_homework');
    String get updateHomework => translate('update_homework');
    String get deleteHomeworkTitle => translate('delete_homework_title');
    String get deleteHomeworkConfirm => translate('delete_homework_confirm');
    String get dueDateLabel => translate('due_date_label');
    String assignedByLabel(String name) => translate('assigned_by_label').replaceAll('{name}', name);
    String get overdue => translate('overdue');
    String get noHomeworkAssigned => translate('no_homework_assigned');
    String get homeworkTitle => translate('homework_title');
    String get descriptionRequired => translate('description_required');
    String get noAttachments => translate('no_attachments');
    String get attachmentCount => translate('attachment_count');
    String get submissionsTitle => translate('submissions_title');
    String get noSubmissionsYet => translate('no_submissions_yet');
    String get yourSubmittedPdf => translate('your_submitted_pdf');
    String get viewSubmissionPdf => translate('view_submission_pdf');
    String get updateStatusReview => translate('update_status_review');
    String get redoNeeded => translate('redo_needed');
    String get markChecked => translate('mark_checked');
    String get requestRedo => translate('request_redo');
    String get commentOptional => translate('comment_optional');
    String get addFeedbackHint => translate('add_feedback_hint');
    String get submissionsClosedMsg => translate('submissions_closed_msg');
    String get homeworkAssignedSuccess => translate('homework_assigned_success');
    String get homeworkUpdatedSuccess => translate('homework_updated_success');
    String get homeworkSubmittedSuccess => translate('homework_submitted_success');
    String get stopReceivingSubmissions => translate('stop_receiving_submissions');
    String get stopSubmissionsSubtitle => translate('stop_submissions_subtitle');
    String get uploadSubmission => translate('upload_submission');
    String get submitHomework => translate('submit_homework');
    String get resubmitHomework => translate('resubmit_homework');
    String get uploadPdfHelper => translate('upload_pdf_helper');
    String get uploading => translate('uploading');
    String get selectPdfFile => translate('select_pdf_file');
    String get submissionStatusSubmitted => translate('submission_status_submitted');
    String get submissionStatusRedo => translate('submission_status_redo');
    String get submissionStatusChecked => translate('submission_status_checked');
    String get submissionStatusNotDone => translate('submission_status_not_done');
    String get attachmentLabel => translate('attachment_label');
    String get saving => translate('saving');
    String get confirm => translate('confirm');

    // Seva Lifecycle Extended
    String sevaPostponedTo(String date) => translate('seva_postponed_to').replaceFirst('{date}', date);
    String get selectNewDate => translate('select_new_date');
    String get reasonRequired => translate('reason_required');
    String get confirmPostpone => translate('confirm_postpone');
    String get confirmPostponeMsg => translate('confirm_postpone_msg');
    String get cannotSelectPastDate => translate('cannot_select_past_date');
    String get uploadPhotos => translate('upload_photos');
    String get createNewFolder => translate('create_new_folder');
    String get selectExistingFolder => translate('select_existing_folder');
    String get photosRequired => translate('photos_required');
    String get activityLog => translate('activity_log');
    String get logCreated => translate('log_created');
    String get logPostponed => translate('log_postponed');
    String get logResumed => translate('log_resumed');
    String get logCompleted => translate('log_completed');
    String get logPhotosUploaded => translate('log_photos_uploaded');
    String get logCancelled => translate('log_cancelled');
    String get logStatusChanged => translate('log_status_changed');
    String byUser(String name) => translate('by_user').replaceFirst('{name}', name);
    String sevaAutoResumedMsg(String date) => translate('seva_auto_resumed_msg').replaceFirst('{date}', date);
    String get unknownUser => translate('unknown_user');
    String get alreadyConnectedMsg => translate('already_connected_msg');
    String get requestPendingMsg => translate('request_pending_msg');
    // Duplicate 'requestedOn' removed (defined at L5117)
    // Duplicate 'requestCancelled' removed (defined at L4868)
  
    // Seva Assignment Workflow
    String get sevaAssignments => translate('seva_assignments');
    String get noAssignments => translate('no_assignments');
    String get willBeNotified => translate('will_be_notified');
    String get pendingResponse => translate('pending_response');
    String get adminNotes => translate('admin_notes');
    String get acceptAssignment => translate('accept_assignment');
    String get rejectAssignment => translate('reject_assignment');
    String get assignmentAccepted => translate('assignment_accepted');
    String get assignmentRejected => translate('assignment_rejected');
    String get assignmentPending => translate('assignment_pending');
    String get confirmAcceptTitle => translate('confirm_accept_title');
    String get confirmAcceptMsg => translate('confirm_accept_msg');
    String get youWillBeResponsible => translate('you_will_be_responsible');
    String get managingAttendance => translate('managing_attendance');
    String get givingAppreciation => translate('giving_appreciation');
    String get confirmAcceptBtn => translate('confirm_accept_btn');
    String get rejectionReasonTitle => translate('rejection_reason_title');
    String get rejectionReasonHint => translate('rejection_reason_hint');
    String get rejectionReasonMin => translate('rejection_reason_min');
    String get submitRejection => translate('submit_rejection');
    String get willNotifyAdmin => translate('will_notify_admin');
    String get reassign => translate('reassign');
    String get removeAssignment => translate('remove_assignment');
    String get adminMessageOptional => translate('admin_message_optional');
    String get adminMessageHint => translate('admin_message_hint');
    String get assignGuruji => translate('assign_guruji');
    String get selectGurujis => translate('select_gurujis');
    String get searchGurujis => translate('search_gurujis');
    String get gurujisAssigned => translate('gurujis_assigned');
    String get noGurujisSelected => translate('no_gurujis_selected');
    String get assignmentStatus => translate('assignment_status');
    String get rejectionReason => translate('rejection_reason');
    String get onlyAssignedGurujis => translate('only_assigned_gurujis');

    // Emergency Workflow - specific
    String get resolveEmergencyTitle => translate('resolve_emergency_title');
    String get minChars10 => translate('min_chars_10');
    String get minChars20 => translate('min_chars_20');
    String get acceptedOn => translate('accepted_on');
    String get rejectedOn => translate('rejected_on');
    String get assignedOn => translate('assigned_on');
  
    // String get notBackedUpYet => translate('not_backed_up_yet'); // DUPLICATE - Removed
    // String get syncing => translate('syncing'); // DUPLICATE - Removed
    // String get dataSynced => translate('data_synced'); // DUPLICATE - Removed
    String get syncData => translate('sync_data');
    String get sunShort => translate('sun_short');
    String get monShort => translate('mon_short');
    String get tueShort => translate('tue_short');
    String get wedShort => translate('wed_short');
    String get thuShort => translate('thu_short');
    String get friShort => translate('fri_short');
    String get satShort => translate('sat_short');
  
    // Guruji Dashboard Getters (Additional)
    String get notPossibleBtn => translate('not_possible_btn');
  
    // Admin Dashboard Getters
    String get adminDashboardTitle => translate('admin_dashboard_title');
    String get accessDeniedAdmin => translate('access_denied_admin');
    String get quickActions => translate('quick_actions');
  

    String get awaitingAdminAssignment => translate('awaiting_admin_assignment');
    String get volunteered => translate('volunteered');
  
  
  


    // Missing Getters Added
    String get noEligibleMembers => translate('no_eligible_members');
    String get invitationSent => translate('invitation_sent');
    String get accepted => translate('accepted');
    String get declined => translate('declined');
    String get assign => translate('assign');
    String get endDateOptional => translate('end_date_optional');
    String get assignedBy => translate('assigned_by');
    String get volunteers => translate('volunteers');
    String get manageVolunteers => translate('manage_volunteers');
    String get mandirSchedule => translate('mandir_schedule');
    String get templeSchedule => translate('temple_schedule');
    String get aarti => translate('aarti');
    String get pooja => translate('pooja');
    String get camp => translate('camp');
    String get event => translate('event');
    String get otherSchedule => translate('other_schedule');
    String get addSchedule => translate('add_schedule');
    String get editSchedule => translate('edit_schedule');
    String get scheduleTitle => translate('schedule_title');
    String get scheduleTime => translate('schedule_time');
    String get scheduleDescription => translate('schedule_description');
    String get permanentSchedule => translate('permanent_schedule');
    String get isActive => translate('is_active');
    String get importantContactsSubtitle => translate('important_contacts_subtitle');
    String get importantLocationsSubtitle => translate('important_locations_subtitle');
    String get importantBadge => translate('important_badge');
    String get noSchedulesAvailable => translate('no_schedules_available');
    String get checkBackLaterTimings => translate('check_back_later_timings');
    String get gayatriMandirTitle => translate('gayatri_mandir_title');
    String get dailySchedule => translate('daily_schedule');
    String get items => translate('items');
    String get startTime => translate('start_time');
    String get endTime => translate('end_time');
    String get repeatsDaily => translate('repeats_daily');
    String get havan => translate('havan');
    String get childDashboard => translate('child_dashboard');
    String get viewAlerts => translate('view_alerts');
    String get emergencyAlerts => translate('emergency_alerts');
    String get noEmergencyAlerts => translate('no_emergency_alerts');
    String get resolvedOn => translate('resolved_on');
    String get noResolvedRequests => translate('no_resolved_requests');
    // Achievements
    String get achvFirstMalaTitle => translate('achv_first_mala_title');
    String get achvFirstMalaDesc => translate('achv_first_mala_desc');
    String get achvStreak7Title => translate('achv_streak_7_title');
    String get achvStreak7Desc => translate('achv_streak_7_desc');
    String get achvStreak30Title => translate('achv_streak_30_title');
    String get achvStreak30Desc => translate('achv_streak_30_desc');
    String get achvMalas108Title => translate('achv_malas_108_title');
    String get achvMalas108Desc => translate('achv_malas_108_desc');
    String get achvMalas1008Title => translate('achv_malas_1008_title');
    String get achvMalas1008Desc => translate('achv_malas_1008_desc');

    // Quotes
    String get quote1 => translate('quote_1');
    String get quote2 => translate('quote_2');
    String get quote3 => translate('quote_3');
    String get quote4 => translate('quote_4');
    String get quote5 => translate('quote_5');
    String get quote6 => translate('quote_6');
    String get quote7 => translate('quote_7');
    String get quote8 => translate('quote_8');
    String get quote9 => translate('quote_9');
    String get quote10 => translate('quote_10');

    
    // Emergency
    String get noActiveEmergencyRequests => translate('no_active_emergency_requests');
    String get urgent => translate('urgent');
    String get requestAcknowledged => translate('request_acknowledged');
    String get requestResolved => translate('request_resolved');
    String get noPhoneAvailable => translate('no_phone_available');
    String get couldNotLaunchDialer => translate('could_not_launch_dialer');

    // Group Details
    String get markAttendanceTitle => translate('mark_attendance_title');
    String get noParticipantsJoined => translate('no_participants_joined');
    String get unmarked => translate('unmarked');
    String get confirmAttendanceLabel => translate('confirm_attendance_label');
    String get markAllToContinue => translate('mark_all_to_continue');
    String get backupVolunteer => translate('backup_volunteer');
    String get primaryVolunteer => translate('primary_volunteer');
    String get finalizeAttendance => translate('finalize_attendance');
    String presentWithCount(int count) => translate('present_with_count').replaceAll('{count}', count.toString());
    String absentWithCount(int count) => translate('absent_with_count').replaceAll('{count}', count.toString());
    String get sendGratitudeFinalize => translate('send_gratitude_finalize');
    String get noVolunteersMarkedPresent => translate('no_volunteers_marked_present');
    String get appreciationOnlyPresent => translate('appreciation_only_present');
    String get selectVolunteersToAppreciate => translate('select_volunteers_to_appreciate');
    String get deselectAll => translate('deselect_all');
    String get selectAll => translate('select_all');
    String get selectAppreciationBadge => translate('select_appreciation_badge');
    String get addPersonalNoteHint => translate('add_personal_note_hint');
    String get recordedAsAbsent => translate('recorded_as_absent');
    String get partialAppreciationTitle => translate('partial_appreciation_title');
    String partialAppreciationMsg(int count, int total) => translate('partial_appreciation_msg').replaceAll('{count}', count.toString()).replaceAll('{total}', total.toString());
    String get pleaseSelectBadgeError => translate('please_select_badge_error');
    String get pleaseWriteLongerMsgError => translate('please_write_longer_msg_error');
    String get attendanceFinalizedGratitudeSent => translate('attendance_finalized_gratitude_sent');
    String get attendanceFinalizedMsg => translate('attendance_finalized_msg');
    String get dedicatedSevaMsg => translate('dedicated_seva_msg');
    String get timeSevaMsg => translate('time_seva_msg');
    String get teamSevaMsg => translate('team_seva_msg');
    String get impactfulSevaMsg => translate('impactful_seva_msg');
    String get personalNoteOptional => translate('personal_note_optional');
    String get resumeSeva => translate('resume_seva');
    String get withdrawFromSeva => translate('withdraw_from_seva');
    String get participateInSeva => translate('participate_in_seva');
    String get eventNotStarted => translate('event_not_started');
    String get joinedSuccess => translate('joined_success');
    String get backupVolunteers => translate('backup_volunteers');
    String get noVolunteersYet => translate('no_volunteers_yet');
    String get errorLoadingParticipants => translate('error_loading_participants');
    String get errorLoadingAppreciation => translate('error_loading_appreciation');
    String get viewOwnAppreciationOnly => translate('view_own_appreciation_only');
    String get statusUpdated => translate('status_updated');
    String get reasonForStatus => translate('reason_for_status');
    String get reason => translate('reason');
    String get enterReasonOptional => translate('enter_reason_optional');
    String get cantMarkAttendanceEarly => translate('cant_mark_attendance_early');
    String get availableAfter => translate('available_after');
    String get adminActionsErrorEarlyStart => translate('admin_actions_error_early_start');
    String get adminActionsErrorNotStarted => translate('admin_actions_error_not_started');
    String get adminActionsErrorEarlyEnd => translate('admin_actions_error_early_end');
    String get errorWithdrawing => translate('error_withdrawing');

    String get aboutLabel => translate('about_label');
    String get chatLabel => translate('chat_label');
    String get cameraLabel => translate('camera_label');
    String get videoLabel => translate('video_label');
    String get audioLabel => translate('audio_label');
    String get documentLabel => translate('document_label');
    String get homeworkLabel => translate('homework_label');
    String get searchMessages => translate('search_messages');
    String get filterByDate => translate('filter_by_date');
    String get fromLabel => translate('from_label');
    String get toLabel => translate('to_label');
    String get notSet => translate('not_set');
    String get clear => translate('clear');
    String get apply => translate('apply');
    String get noResultsFound => translate('no_results_found');
    String get noMessagesYet => translate('no_messages');
    String get leaveGroupTitle => translate('leave_group_title');
    String get requestLeaveTitle => translate('request_leave_title');
    String leaveGroupConfirmMsg(String name) => translate('leave_group_confirm_msg').replaceAll('{name}', name);
    String get requestLeaveMsg => translate('request_leave_msg');
    String get onlyGurujiLeaveError => translate('only_guruji_leave_error');
    String get leaveRequestSent => translate('leave_request_sent');
    String get leftGroupSuccess => translate('left_group_success');
    String get pendingApprovalTitle => translate('pending_approval_title');
    String get pendingApprovalMsg => translate('pending_approval_msg');
    String pendingJoinRequests(int count) => translate('pending_join_requests').replaceAll('{count}', count.toString());

    String get noPhoneLinked => translate('no_phone_linked');
    String get loadingContactInfo => translate('loading_contact_info');
    String get acknowledge => translate('acknowledge');
    String get resolve => translate('resolve');
    String get call => translate('call');
    
    // Contacts
    String get noSosContactsYet => translate('no_sos_contacts_yet');
    String get tapToAddOne => translate('tap_to_add_one');
    String get deleteContact => translate('delete_contact');
    String get deleteContactConfirm => translate('delete_contact_confirm');
    String get selectRole => translate('select_role');
    
    // Family
    String get familyLinkRequestsEmpty => translate('family_link_requests_empty');
    String get familyConnectionRemoved => translate('family_connection_removed');
    String get searchByEmailOrUsername => translate('search_by_email_or_username');
    String get searchingForUser => translate('searching_for_user');
    String get alreadyLinked => translate('already_linked');
    String get pendingRequestExists => translate('pending_request_exists');
    String get cannotLinkToSelf => translate('cannot_link_to_self');
    String get requestSentSuccess => translate('request_sent_success');
    String get acceptRequest => translate('accept_request');
    String get declineRequest => translate('decline_request');
    String get unlinkFamily => translate('unlink_family');
    
    // Admin Service Types
    String get manageServiceTypes => translate('manage_service_types');
    String get noServiceTypes => translate('no_service_types');
    String get addServiceTypesPrompt => translate('add_service_types_prompt');
    String get addServiceType => translate('add_service_type');
    String get editServiceType => translate('edit_service_type');
    String get serviceTypeAdded => translate('service_type_added');
    String get serviceTypeUpdated => translate('service_type_updated');
    String get requirementsSamagri => translate('requirements_samagri');
    String get noRequirementsAdded => translate('no_requirements_added');
    String get addRequirement => translate('add_requirement');
    String get itemName => translate('item_name');
    String get itemNameHint => translate('item_name_hint');
    String get quantity => translate('quantity');
    String get quantityHint => translate('quantity_hint');
    String get unit => translate('unit');
    String get unitHint => translate('unit_hint');
    String get optionalGoodToHave => translate('optional_good_to_have');
    String get usersCanSeeService => translate('users_can_see_service');
    String get hiddenFromUsers => translate('hidden_from_users');
    String get optional => translate('optional');
    String get restoreAvailability => translate('restore_availability');
    String get available => translate('available');
    String get unavailable => translate('unavailable');
    String get noFoldersYet => translate('no_folders_yet');
    String get uploadSuccess => translate('upload_success');
    String get createFolder => translate('create_folder');
    String get statusSummary => translate('status_summary');
    String get statTotal => translate('stat_total');
    String get statPending => translate('stat_pending');
    String get statAccepted => translate('stat_accepted');
    String get statCompleted => translate('stat_completed');
    String get statCancelled => translate('stat_cancelled');
    String get serviceTypes => translate('service_types');
    String get topRequesters => translate('top_requesters');
    String get clearAll => translate('clear_all');
    String get filterByStatus => translate('filter_by_status');
    String get filterByType => translate('filter_by_type');
    String get noServiceRequestsYet => translate('no_service_requests_yet');
    String get noRequestsMatchFilters => translate('no_requests_match_filters');
    String preferredLabel(String value) => translate('preferred_label').replaceFirst('{value}', value);
    String assignedLabel(String value) => translate('assigned_label').replaceFirst('{value}', value);
    String get requestedBy => translate('requested_by');
    String get altContact => translate('alt_contact');
    String get defaultSamagriFromType => translate('default_samagri_from_type');

    // Group Member Management
    String manageRolesTitle(String name) => translate('manage_roles_title').replaceFirst('{name}', name);
    String get roles => translate('roles');
    String get adminRole => translate('admin_role');
    String get onlySystemAdminsManage => translate('only_system_admins_manage');
    String get adminRoleDesc => translate('admin_role_desc');
    String get errorUpdatingRole => translate('error_updating_role');
    String get gurujiRole => translate('guruji_role');
    String get gurujiRoleDesc => translate('guruji_role_desc');
    String get permittedRole => translate('permitted_role');
    String get permittedRoleDesc => translate('permitted_role_desc');
    String get memberRole => translate('member_role');

    String get removeFromGroup => translate('remove_from_group');

    String removeMemberConfirm(String name) => translate('remove_member_confirm').replaceFirst('{name}', name);

    String get memberRemovedSuccess => translate('member_removed_success');
    String get volunteerRemoved => translate('volunteer_removed');
    String get removeVolunteer => translate('remove_volunteer');
    String removeVolunteerConfirm(String name) => translate('remove_volunteer_confirm').replaceFirst('{name}', name);
    
    // Assign Volunteer & Common
    String get volunteerRoleHint => translate('volunteer_role_hint');
    String get volunteerDescHint => translate('volunteer_desc_hint');











    String get selectMemberError => translate('select_member_error');








    // Group Details & Permissions


    String get everyone => translate('everyone');
    String get adminsOnly => translate('admins_only');
    String get adminsAndGurujis => translate('admins_and_gurujis');

    // Generic missing keys
    String get member => translate('member');
    String get errorSearchingUser => translate('error_searching_user');
    String get adminsGurujisPermitted => translate('admins_gurujis_permitted');
    String get whoCanSendMessages => translate('who_can_send_messages');
    String get messagePermissionUpdated => translate('message_permission_updated');
    String get whoCanPinMessages => translate('who_can_pin_messages');
    String get pinPermissionUpdated => translate('pin_permission_updated');
    String get messageSendPermission => translate('message_send_permission');
    String get pinMessagePermission => translate('pin_message_permission');

    String notPossibleWithReason(String reason) => translate('not_possible_with_reason').replaceFirst('{reason}', reason);
    String get noReasonGiven => translate('no_reason_given');

    // Invite User & Volunteer Dialogs


    String get invitationAlreadySent => translate('invitation_already_sent');
    String get cannotInviteSelf => translate('cannot_invite_self');
    String get userAlreadyMember => translate('user_already_member');
    String get errorSendingInvitation => translate('error_sending_invitation');
    String invitationSentTo(String name) => translate('invitation_sent_to').replaceFirst('{name}', name);
    String volunteerInvitationSentTo(String name) => translate('volunteer_invitation_sent_to').replaceFirst('{name}', name);
    String loadingMembersError(String error) => translate('error_loading_members').replaceFirst('{error}', error);
    String get enterRole => translate('enter_role');
    String get loadingDetails => translate('loading_details');
    String get currentlyAssigned => translate('currently_assigned');
    String get notesFromGuruji => translate('notes_from_guruji');
    String get completionPhotosLabel => translate('completion_photos_label');
    String unavailableByLabel(String name) => translate('unavailable_by_label').replaceFirst('{name}', name);
    String cancelledByLabel(String name) => translate('cancelled_by_label').replaceFirst('{name}', name);
    String get cannotCompleteRequest => translate('cannot_complete_request');
    String get pendingItemsApprovalError => translate('pending_items_approval_error');
    String get markedUnavailableSuccess => translate('marked_unavailable_success');
    String get restoreToPending => translate('restore_to_pending');
    String get requestRestoredSuccess => translate('request_restored_success');
    String get cancellationReasonLabel => translate('cancellation_reason_label');
    String get cancellationReasonHint => translate('cancellation_reason_hint');
    String get pleaseEnterReason => translate('please_enter_reason');
    String get requestMarkedUnavailable => translate('request_marked_unavailable');
    String get requestCancelledSuccess => translate('request_cancelled_success');
    String get requestDetails => translate('request_details');
    String get notes => translate('notes');
    String get attachments => translate('attachments');
    String get assignment => translate('assignment');
    String get finalDate => translate('final_date');
    String get requestMarkedCompleted => translate('request_marked_completed');
    String get description => translate('description');
    String get folderName => translate('folder_name');
    String get folder => translate('folder');
    String get folderDescription => translate('folder_description');
    String get addDescription => translate('add_description');
    String get descriptionOptional => translate('description_optional');
    String get editFolder => translate('edit_folder');
    String get deleteFolderTitle => translate('delete_folder_title');
    String get rename => translate('rename');
    String get deleteFolderConfirm => translate('delete_folder_confirm');
    String get editItem => translate('edit_item');
    String get file => translate('file');
    String get deleteFileTitle => translate('delete_file_title');
    String deleteFileConfirm(String name) => translate('delete_file_confirm').replaceAll('{name}', name);
    String get renameFile => translate('rename_file');
    String get newName => translate('new_name');
    String get fileRenamed => translate('file_renamed');
    String get fileUploaded => translate('file_uploaded');
    String get cannotOpenFileType => translate('cannot_open_file_type');
    String get renameFailed => translate('rename_failed');
    String get preparingShare => translate('preparing_share');
    String get sharedFromApp => translate('shared_from_app');
    String get name => translate('name');
    String get phone => translate('phone');
    
    // Admin Important Info & Emergency
    String get importantInfoEmergency => translate('important_info_emergency');
    String get contacts => translate('contacts');
    String get locations => translate('locations');
    String get sosContacts => translate('sos_contacts');
    String get alerts => translate('alerts');
    String get noContactsYet => translate('no_contacts_yet');
    String get tapToAddContact => translate('tap_to_add_contact');
    String get noLocationsYet => translate('no_locations_yet');
    String get tapToAddLocation => translate('tap_to_add_location');
    String get addTag => translate('add_tag');
    String get tagName => translate('tag_name');
    String get deleteTag => translate('delete_tag');
    String deleteTagConfirm(String tag) => translate('delete_tag_confirm').replaceFirst('{tag}', tag);
    String get addRole => translate('add_role');
    String get roleName => translate('role_name');
    String get deleteRole => translate('delete_role');
    String deleteRoleConfirm(String role) => translate('delete_role_confirm').replaceFirst('{role}', role);
    String get editContact => translate('edit_contact');
    String get addContact => translate('add_contact');
    String get sortOrder => translate('sort_order');
    String get tags => translate('tags');
    String get noTagsAvailable => translate('no_tags_available');
    String get editLocation => translate('edit_location');
    String get deleteLocation => translate('delete_location');
    String get addLocation => translate('add_location');
    String get locationName => translate('location_name');
    String get googleMapsLink => translate('google_maps_link');
    String get latitude => translate('latitude');
    String get longitude => translate('longitude');
    String get addEmergencyContact => translate('add_emergency_contact');
    String get role => translate('role');
    String get noRolesAvailable => translate('no_roles_available');
    String get displayedAsTag => translate('displayed_as_tag');
    String get resolvedRequests => translate('resolved_requests');
    String get activeRequests => translate('active_requests');
    String get showActive => translate('show_active');
    String get showHistory => translate('show_history');

    // Manage Resources
    String get manageResources => translate('manage_resources');
    String get searchByTitle => translate('search_by_title');
    String get allTypes => translate('all_types');
    String get noMatchingResources => translate('no_matching_resources');
    String get tapToAddResource => translate('tap_to_add_resource');
    String get resourceTypeBook => translate('resource_type_book');
    String get resourceTypeAudio => translate('resource_type_audio');
    String get resourceTypeBhajan => translate('resource_type_bhajan');
    String get resourceTypeVideo => translate('resource_type_video');
    String get resourceTypePicture => translate('resource_type_picture');
    String get addResource => translate('add_resource');
    String get editResource => translate('edit_resource');
    String get titleHint => translate('title_hint');
    String get titleRequired => translate('title_required');
    String get descriptionHint => translate('description_hint');
    String get selectType => translate('select_type');
    String get categoryLabel => translate('category_label');
    String get noCategoryLabel => translate('no_category_label');
    String get thumbnailUrl => translate('thumbnail_url');
    String get activeStatus => translate('active_status');
    String get resourceVisible => translate('resource_visible');
    String get resourceDraft => translate('resource_draft');
    String get active => translate('active');
    String get inactive => translate('inactive');
    String get activate => translate('activate');
    String get deactivate => translate('deactivate');
    String get draft => translate('draft');
    String get confirmDeleteResource => translate('confirm_delete_resource');
    String get deleteResourceMsg => translate('delete_resource_msg');
    String get uploadFailedPrefix => translate('upload_failed_prefix');
    String get thumbnailUploadFailedPrefix => translate('thumbnail_upload_failed_prefix');

    // Resource Categories
    String get categoryGayatri => translate('category_gayatri');
    String get categoryHealth => translate('category_health');
    String get categoryLifeLessons => translate('category_life_lessons');
    String get categoryDevotional => translate('category_devotional');
    String get categoryYoga => translate('category_yoga');
    String get mantras => translate('mantras');
    String get teachings => translate('teachings');
    String get other => translate('other');
    String get interestMeditation => translate('interest_meditation');

    // Seva Dialogs
    String get newDateLabel => translate('new_date_label');

    // New keys for complete seva dialog
    String get optionalFolderSelectionHint => translate('optional_folder_selection_hint');
    String get searchFolderHint => translate('search_folder_hint');

    // Spiritual Content Management
    String get manageSpiritualContent => translate('manage_spiritual_content');
    String get dailyQuotes => translate('daily_quotes');
    String get meditationTips => translate('meditation_tips');
    String itemsCount(int count) => translate('items_count').replaceFirst('{count}', count.toString());
    String get manageDailyQuotes => translate('manage_daily_quotes');
    String get manageMeditationTips => translate('manage_meditation_tips');
    String get addQuote => translate('add_quote');
    String get editQuote => translate('edit_quote');
    String get quoteText => translate('quote_text');
    String get enterQuote => translate('enter_quote');
    String get author => translate('author');
    String get authorHint => translate('author_hint');
    String get imageUrlDarshan => translate('image_url_darshan');
    String get tithiOccasion => translate('tithi_occasion');
    String get tithiHint => translate('tithi_hint');
    String get scheduleDate => translate('schedule_date');
    String get quoteVisible => translate('quote_visible');
    String get quoteDraft => translate('quote_draft');
    String get deleteQuote => translate('delete_quote');
    String get noQuotesYet => translate('no_quotes_yet');
    String get tapAddFirstQuote => translate('tap_add_first_quote');
    String get addTip => translate('add_tip');
    String get editTip => translate('edit_tip');
    String get tipTitle => translate('tip_title');
    String get tipTitleHint => translate('tip_title_hint');
    String get explainTip => translate('explain_tip');
    String get tipVisible => translate('tip_visible');
    String get tipDraft => translate('tip_draft');
    String get deleteTip => translate('delete_tip');
    String get noTipsYet => translate('no_tips_yet');
    String get tapAddFirstTip => translate('tap_add_first_tip');
    String get saveOrder => translate('save_order');
    String get reorder => translate('reorder');
    String get urlLabel => translate('url_label');
    String get accessDenied => translate('access_denied');
    String get onlyAdminGuruji => translate('only_admin_guruji');
    String get urlHint => translate('url_hint');

    // Manage Calendar Getters
    String get manageCalendarEvents => translate('manage_calendar_events');
    String get loadHolidays => translate('load_holidays');
    String get loadPublicHolidays => translate('load_public_holidays');
    String get selectYearLoadHolidays => translate('select_year_load_holidays');
    String yearLabel(int year) => translate('year_label').replaceFirst('{year}', year.toString());
    String get addNewEvent => translate('add_new_event');
    String get addEvent => translate('add_event');
    String get eventTitle => translate('event_title');
    String get selectTime => translate('select_time');
    String get eventCategory => translate('event_category');
    String get eventIcon => translate('event_icon');
    String get eventIconHint => translate('event_icon_hint');
    String get festivalSettings => translate('festival_settings');
    String get primaryFestivalDate => translate('primary_festival_date');
    String get primaryFestivalDesc => translate('primary_festival_desc');
    String get themeColorHex => translate('theme_color_hex');
    String get pickColor => translate('pick_color');
    String get bannerImage => translate('banner_image');
    String get uploadLabel => translate('upload_label');
    String get pickBannerImage => translate('pick_banner_image');
    String get bannerUrl => translate('banner_url');
    String get suggestedMantraId => translate('suggested_mantra_id');
    String get suggestedMantraHint => translate('suggested_mantra_hint');
    String get festivalDescriptionLocalized => translate('festival_description_localized');
    String get primaryFestivalIndicator => translate('primary_festival_indicator');
    String holidaysLoadedSuccess(int year) => translate('holidays_loaded_success').replaceFirst('{year}', year.toString());
    String holidaysLoaded(int year) => translate('holidays_loaded').replaceFirst('{year}', year.toString()); // Added for UI compatibility
    String errorOccurred(String error) => translate('error_occurred').replaceFirst('{error}', error); // Added for UI compatibility
    String get deleteEventTitle => translate('delete_event_title');
    String deleteEventConfirmWithTitle(String title) => translate('delete_event_confirm_with_title').replaceFirst('{title}', title);
    String get noEventsFound => translate('no_events_found');
    String get pickThemeColor => translate('pick_theme_color');
    String get selectBtn => translate('select_btn');
    String get primary => translate('primary');
    String get eventCategoryFestival => translate('event_category_festival');
    String get eventCategoryTithi => translate('event_category_tithi');
    String get eventCategoryMandirEvent => translate('event_category_mandir_event');
    String get iconEmojiLabel => translate('event_icon');
    String get timeOptionalLabel => translate('event_time');
    
    // Branch & Guruji Management
    String get locationLabel => translate('location_label');
    String get loadLabel => translate('load_label');
    String get noBranchesFound => translate('no_branches_found');
    String get addBranch => translate('add_branch');
    String get editBranch => translate('edit_branch');
    String get branchName => translate('branch_name');
    String get branchNameHint => translate('branch_name_hint');
    String get cityLocationHint => translate('city_location_hint');
    String get deleteBranchTitle => translate('delete_branch_title');
    String get deleteBranchConfirm => translate('delete_branch_confirm');
    String get noGurujisFound => translate('no_gurujis_found');
    String get assignGurujiRole => translate('assign_guruji_role');
    String get assignRole => translate('assign_role');
    String promoteConfirmMsg(String name) => translate('promote_confirm_msg').replaceFirst('{name}', name);
    String promoteSuccessMsg(String name) => translate('promote_success_msg').replaceFirst('{name}', name);
    String get promoteInstruction => translate('promote_instruction');
    String get searchUserHint => translate('search_user_hint');
    String get removeGurujiRoleTitle => translate('remove_guruji_role_title');
    String get removeRoleConfirmMsg => translate('remove_role_confirm_msg');

    // --- Missing Getters Added (Final Cleanup) ---
    String get malasFirstMalaTitle => translate('marker_first_steps_title'); // Mapping to existing key title
    String get malasFirstMalaDesc => translate('marker_first_steps_desc');
    
    // Note: Some keys in audit might be dynamic or mapped differently. 
    // Adding direct mappings for the reported missing getters:
    String get unlinkConfirmTitle => translate('unlink_confirm_title');
    String get unlinkConfirmBody => translate('unlink_confirm_body');
    String get relationTypeParent => translate('relation_type_parent');
    String get relationTypeChild => translate('relation_type_child');
    String get relationTypeSpouse => translate('relation_type_spouse');
    String get relationTypeSibling => translate('relation_type_sibling');
    String get relationTypeOther => translate('relation_type_other');
    String get enterDescription => translate('enter_description');
    String get selectDate => translate('select_date');
    String get flatFloorHint => translate('flat_floor_hint');
    String get buildingHint => translate('building_hint');
    String get streetHint => translate('street_hint');
    String get landmarkHint => translate('landmark_hint');
    
    // Sadhana Tracker Specific
    String get lastSynced => translate('last_synced') == 'last_synced' ? 'Last synced: ' : translate('last_synced');
    
    String get searchByDescriptionAddress => translate('search_by_description_address');
    String get statusAccepted => translate('status_accepted');
    String get statusUnavailable => translate('status_unavailable');
    String get statusCompleted => translate('status_completed');
    String get eventUpdatedSuccess => translate('event_updated_success');
    String get bannerUploadSuccess => translate('banner_upload_success');
    String get newsAndUpdates => translate('news_and_updates');
    String get newsCategoryAll => translate('news_category_all');
    String get newsCategorySpiritual => translate('news_category_spiritual');
    String get newsCategoryEvents => translate('news_category_events');
    String get newsCategorySeva => translate('news_category_seva');
    String get newsCategoryYouth => translate('news_category_youth');
    String get newsCategoryNotices => translate('news_category_notices');
    String get newsCategoryMagazine => translate('news_category_magazine');
    String get houseNoHint => translate('house_no_hint');
    String get expired => translate('expired');
    String get newsManagement => translate('news_management');
    String get createNews => translate('create_news');
    String get editNews => translate('edit_news');
    String get noNewsCreated => translate('no_news_created');
    String get deleteNewsTitle => translate('delete_news_title');
    String get deleteNewsConfirm => translate('delete_news_confirm');
    String get tapToPickImage => translate('tap_to_pick_image');
    String get imageUrlOptional => translate('image_url_optional');
    String get imageUrlHint => translate('image_url_hint');
    String get enterNewsTitle => translate('enter_news_title');
    String get shortDescriptionHint => translate('short_description_hint');
    String get fullArticleContent => translate('full_article_content');
    String get markAsImportant => translate('mark_as_important');
    String get highPriorityNotify => translate('high_priority_notify');
    String get schedulePublishing => translate('schedule_publishing');
    String get pickDateTime => translate('pick_date_time');
    String get changeDateTime => translate('change_date_time');
    String get leaveEmptyImmediate => translate('leave_empty_immediate');
    String get responsibleContactPerson => translate('responsible_contact_person');
    String get roleTitle => translate('role_title');
    String get roleTitleHint => translate('role_title_hint');
    String get contactPhoneHint => translate('contact_phone_hint');
    String get saveDraft => translate('save_draft');
    String get publishNews => translate('publish_news');
    String get draftSaved => translate('draft_saved');
    String get newsPublished => translate('news_published');
    String get selectImageOrUrl => translate('select_image_or_url');
    String get published => translate('published');
    String get scheduled => translate('scheduled');
    String get important => translate('important');
    String get shortDescription => translate('short_description');
    String get category => translate('category');
    String get noAuditLogs => translate('no_audit_logs');
    String get isRequiredMsg => translate('is_required');
    String get contactNumber => translate('contact_number');
    String get alternateContactHint => translate('alternate_contact_hint');
    String get landmark => translate('landmark');
    String get newsUpdates => translate('news_updates');
    String get youth => translate('youth');
    String get searchDescriptionAddress => translate('search_description_address');
    String get menuCalendar => translate('menu_calendar');
    String get menuBranches => translate('menu_branches');
    String get menuGurujis => translate('menu_gurujis');
    String get menuNews => translate('menu_news');
    String get menuAttendance => translate('menu_attendance');
    String get menuServices => translate('menu_services');
    String get menuSpiritual => translate('menu_spiritual');
    String get menuRequests => translate('menu_requests');
    String get menuSevaOps => translate('menu_seva_ops');
    String get menuMedia => translate('menu_media');
    String get menuImportantInfo => translate('menu_important_info');
    String get menuPublicGroups => translate('menu_public_groups');
    String get selectDaySchedule => translate('select_day_schedule');
    String get dashboardStatTotal => translate('dashboard_stat_total');
    String get dashboardStatUpcoming => translate('dashboard_stat_upcoming');
    String get dashboardStatCompleted => translate('dashboard_stat_completed');
    String get noSevaAssignments => translate('no_seva_assignments');
    String get organization => translate('organization');
    String get familyLinks => translate('family_links');
    String get createFamilyLink => translate('create_family_link');
    String get selectParent => translate('select_parent');
    String get selectChild => translate('select_child');
    String get selectBothUsers => translate('select_both_users');
    String get cannotLinkSelf => translate('cannot_link_self');
    String get linkCreated => translate('link_created');

    // Admin Family Links
    String get familyLinksAdmin => translate('family_links_admin');
    String get searchUsers => translate('search_users');
    String get filterStatus => translate('filter_status');
    String get allLinks => translate('all_links');
    String get auditTrail => translate('audit_trail');
    String get addLink => translate('add_link');
    String get linksFound => translate('links_found');
    String get noFamilyLinks => translate('no_family_links');
    String get parentChild => translate('parent_child');
    String get elderCaregiver => translate('elder_caregiver');
    String get relationship => translate('relationship');
    String get created => translate('created');
    String get actions => translate('actions');
    String get importFailed => translate('import_failed');
    String get fileSaved => translate('file_saved');
    String get exporting => translate('exporting');
    String get exportSuccess => translate('export_success');
    String get exportFailed => translate('export_failed');
    String get importing => translate('importing');
    String get links => translate('links');
    String get importComplete => translate('import_complete');
    String get failed => translate('failed');
    String get addFirstLink => translate('add_first_link');
    String get editFamilyLink => translate('edit_family_link');
    String get currentLink => translate('current_link');
    String get type => translate('type');
    String get permissions => translate('permissions');
    String get manageRoles => translate('manage_roles');
    String get defaultRoles => translate('default_roles');
    String get customRoles => translate('custom_roles');
    String get enterRoleName => translate('enter_role_name');
    String get roleAdded => translate('role_added');
    String get roleUpdated => translate('role_updated');
    String get roleDeleted => translate('role_deleted');
    String get cannotEditGlobalRole => translate('cannot_edit_global_role');
    String get viewActivity => translate('view_activity');
    String get viewActivityDesc => translate('view_activity_desc');
    String get receiveSos => translate('receive_sos');
    String get receiveSosDesc => translate('receive_sos_desc');
    String get restrictContent => translate('restrict_content');
    String get restrictContentDesc => translate('restrict_content_desc');
    String get expirationDate => translate('expiration_date');
    String get noExpiration => translate('no_expiration');
    String get lastModifiedBy => translate('last_modified_by');
    String get linkUpdated => translate('link_updated');
    String get noLinksToExport => translate('no_links_to_export');
    String get noAssignedRequests => translate('no_assigned_requests');
    String get attendanceMarked => translate('attendance_marked');
    
    // More Actions Menu
    String get moreActions => translate('more_actions');
    String get markAttendance => translate('mark_attendance');
    String get attendance => translate('attendance');
    String get attendanceAnalytics => translate('attendance_analytics');
    String get attendanceTrend => translate('attendance_trend');
    String get memberPerformance => translate('member_performance');
    String get highestPercent => translate('highest_percent');
    String get lowestPercent => translate('lowest_percent');
    String get alphabetical => translate('alphabetical');
    String get markAllPresent => translate('mark_all_present');
    String get markAllAbsent => translate('mark_all_absent');
    String get sessions => translate('sessions');
    String get noAttendanceForDate => translate('no_attendance_for_date');
    String get addAttendanceDate => translate('add_attendance_date');
    String get cannotViewFutureDates => translate('cannot_view_future_dates');
    String get noDataForChart => translate('no_data_for_chart');
    String get noAttendanceGroupsFound => translate('no_attendance_groups_found');
    String get manageMembers => translate('manage_members');
    String get viewMembers => translate('view_members');
    String get groupEvents => translate('group_events');

    String get celebrationSingleMsg => translate('celebration_single_msg');
    String get celebrationMultipleMsg => translate('celebration_multiple_msg');
    String get festivalDefaultDesc => translate('festival_default_desc');
    String get primaryFestivalBadge => translate('primary_festival_badge');
    String get swipeToDismiss => translate('swipe_to_dismiss');

    // Seva Management
    String get errorLoadingSevas => translate('error_loading_sevas');
    String get createSeva => translate('create_seva');
    String get newSeva => translate('new_seva');
    String get editSeva => translate('edit_seva');
    String get searchSevaPlaceholder => translate('search_seva_placeholder');
    String get sevaCreatedSuccess => translate('seva_created_success');
    String get sevaUpdatedSuccess => translate('seva_updated_success');
    String get assignSelected => translate('assign_selected');
    String get internalNotesOptional => translate('internal_notes_optional');
    String get internalNotesHint => translate('internal_notes_hint');
    String get deleteSeva => translate('delete_seva');
    String get deleteSevaConfirm => translate('delete_seva_confirm');
    String get cannotUndo => translate('cannot_undo');
    String get noGurujisMatch => translate('no_gurujis_match');
    String get maleNeeded => translate('male_needed');
    String get femaleNeeded => translate('female_needed');
    String get selectDateTime => translate('select_date_time');
    String get cannotEditCompletedSeva => translate('cannot_edit_completed_seva');
    String get couldNotOpenMap => translate('could_not_open_map');
    String get eventWillStart => translate('event_will_start');
    String get eventIsLive => translate('event_is_live');
    String get eventPaused => translate('event_paused');
    String get eventPostponed => translate('event_postponed');
    String get eventRescheduled => translate('event_rescheduled');
    String get eventCompleted => translate('event_completed');
    String get eventCancelled => translate('event_cancelled');
    String get manageSevaOp => translate('manage_seva_op');
    String get upcoming => translate('upcoming');
    String get live => translate('live');
    String get full => translate('full');
    String get past => translate('past');
    String get paused => translate('paused');
    String get assigned => translate('assigned');
    String get start => translate('start');
    String get postpone => translate('postpone');
    String get googleMapsLinkOptional => translate('google_maps_link_optional');
    String get filledStatus => translate('filled_status');
    String get volunteersFilled => translate('volunteers_filled');
    String get becomeFirstVolunteer => translate('become_first_volunteer');
    String get required => translate('required');
    String get pause => translate('pause');
    String get markComplete => translate('mark_complete');
    String get filled => translate('filled');
    String get rescheduled => translate('rescheduled');
    String get postponed => translate('postponed');
    String get pullToRefresh => translate('pull_to_refresh');
    String get backup => translate('backup');
    String get withdrawnSuccess => translate('withdrawn_success');
    String get migrateLegacyData => translate('migrate_legacy_data');
    
    // Public Groups Management
    String get publicGroups => translate('public_groups');
    String get allPublicGroupRequestsReviewed => translate('all_public_group_requests_reviewed');
    String get createdBy => translate('created_by');
    String get reasonForCreating => translate('reason_for_creating');
    String get reject => translate('reject');
    String get approve => translate('approve');
    String get rejectPublicGroupTitle => translate('reject_public_group_title');
    String get rejectPublicGroupContent => translate('reject_public_group_content');
    String get enterRejectionReason => translate('enter_rejection_reason');
    String get approvedAsPublicGroup => translate('approved_as_public_group');
    String get hasBeenRejected => translate('has_been_rejected');
    String get errorApproving => translate('error_approving');
    String get errorRejecting => translate('error_rejecting');
    String get today => translate('today');
    String get familyLinkRequest => translate('family_link_request');
    String get requestAccepted => translate('request_accepted');
    
    // Parameterized Methods


  // Localized Values Map
static final Map<String, Map<String, String>> _localizedValues = {
    'en': {
      'preparing_upload': 'Preparing to upload',
      'today_random_role': "Today's Random Role",
      'pick_random_student': 'Select Random Student',
      'attendance_missing_msg': 'Attendance must be marked for today (IST) before selection.',
      'zero_students_present': 'No students are marked present today.',
      'present_students_count': '{count} students present today. Pick one randomly for a role.',
      'selected_role': 'Role: {role}',
      'fairness_fallback_tooltip': 'Selected from full pool (Fairness Fallback)',
      'processing': 'Processing...',
      'manage_roles': 'Manage Roles',
      'default_roles': 'Default Roles',
      'custom_roles': 'Group Roles',
      'add_role': 'Add New Role',
      'role_name': 'Role Name',
      'enter_role_name': 'Enter role name (e.g. Class Monitor)',
      'role_added': 'Role added successfully',
      'role_updated': 'Role updated successfully',
      'role_deleted': 'Role deleted successfully',
      'cannot_edit_global_role': 'Default roles cannot be edited',

            'feed': 'Feed',
      'posts': 'Posts',
      'feed_description': 'This is your feed. Stay updated with the latest posts and community news.',
      'view_comments': 'View comments',
      'delete_post': 'Delete Post',
      'delete_post_confirm': 'Are you sure you want to delete this post?',
      'pin_post': 'Pin Post',
      'unpin_post': 'Unpin Post',
      'max_pin_warning': '?? Maximum 3 posts can be pinned.',
      'downloading_photo': 'Downloading photo...',
      'photo_saved': '? Photo saved to gallery!',
      'download_failed': '? Failed to download: {error}',
      'post_deleted': '? Post deleted successfully',
      'delete_post_failed': '? Failed to delete post',
      'comments': 'Comments',
      'no_comments_yet': 'No comments yet',
      'be_first_comment': 'Be the first to comment!',
      'add_comment': 'Add a comment...',
      'create_post': 'Create Post',
      'post_btn': 'Post',
      'photos': 'Photos',
      'caption': 'Caption',
      'write_caption': 'Write a caption...',
      'tags': 'Tags',
      'add_tag': 'Add a tag (e.g. event, news)',
      'post_date_time': 'Post Date & Time (Optional)',
      'current_time_default': 'Current time will be used if not set',
      'uploading_progress': 'Uploading... {percent}%',
      'please_wait': 'Please wait...',

      'app_name': 'Gayatri Pariwar',
      // ... existing keys ...
      
      // Param Drishti Content
      'vision_title': 'Awakening Divinity Within Humanity and Establishing Heaven on Earth',
      'vision_description': '''
The vision of All World Gayatri Pariwar is that human life should not remain confined to material achievements alone, but should awaken the divine consciousness hidden within.

We aspire to build a society where:
• Every individual is virtuous and morally upright
• Every family becomes a center of values and संस्कार (cultural refinement)
• Society is founded upon cooperation and compassion
• The nation stands as a symbol of ideals and discipline
• The world functions in the spirit of “Vasudhaiva Kutumbakam” — The Whole World is One Family

Our goal is not merely reform, but transformation of consciousness —
From individual to family, from family to society, from society to nation, and from nation to the world.
''',
      'mission_title': 'Individual Transformation – Family Upliftment – Social Reform – Nation Building',
      'mission_description': '''
The mission of Gayatri Pariwar includes:

🔹 1. Spiritual Awakening
Strengthening inner power through:
• Gayatri mantra chanting
• Meditation and contemplation
• Yagya practices

🔹 2. Restoration of Cultural Values
Developing moral and cultural values among:
• Children
• Youth
• Families

🔹 3. Addiction-Free & Evil-Free Society
Eliminating:
• Substance abuse
• Superstitions
• Harmful social practices

🔹 4. Spirit of Service & Cooperation
Expanding service activities for the weaker and underprivileged sections of society.

🔹 5. Harmonizing Spirituality and Science
Establishing religion not as ritualistic display, but as a scientific way of living.
''',
      'yagya_title': 'Benefits of Yagya',
      'yagya_description': '''
🟢 Spiritual Benefits
• Purification of the mind
• Infusion of positive energy
• Reduction of mental stress
• Inner peace

🟢 Physical Benefits
• Atmospheric purification
• Strengthening of immunity
• Reduction of harmful microbes

🟢 Social Benefits
• Unity within families
• Development of collective spirit
• Strengthening of cultural values

🟢 Environmental Benefits
• Air purification
• Ecological balance
• Enhancement of natural energy
''',
      // Param Drishti Menu & Home Card
      'param_drishti_title': 'Param Drishti',
      'param_drishti_subtitle': 'Our Vision, Mission & Spiritual Movement',
      'param_drishti_card_desc': 'Adhyatmik Kranti - Vision, Mission & Movements',
      'menu_vision': 'Vision',
      'vision_short_desc': 'Awakening Divinity',
      'menu_mission': 'Mission',
      'mission_short_desc': 'From Individual to Nation Building',
      'menu_sapt_aandolan': 'Sapt Aandolan',
      'sapt_aandolan_short_desc': '7 Spiritual Movements',
      'menu_yagya_benefits': 'Benefits of Yagya',
      'yagya_short_desc': 'Scientific & Spiritual Benefits',
      'sapt_aandolan_title': 'Seven Movements (Sapt Aandolan)',
      'gayatri_mandir_title': 'Gayatri Mandir',
      
      'aandolan_sadhana_title': 'Sadhana Movement',
      'aandolan_sadhana_purpose': 'Inner purification and strengthening of self-discipline.',
      'aandolan_sadhana_description': '''
This movement includes:
• Gayatri mantra chanting
• Meditation and pranayama
• Tapasya (self-discipline) and self-study
• Character building

It empowers individuals mentally, morally, and spiritually.
''',

      'aandolan_shiksha_title': 'Education Movement',
      'aandolan_shiksha_purpose': 'Promotion of moral, cultural, and life-oriented education.',
      'aandolan_shiksha_description': '''
Value-based education
• Sanskar schools
• Youth awakening programs
• Personality development camps

Education is not merely about degrees — it is about life-building.
''',

      'aandolan_swasthya_title': 'Health Movement',
      'aandolan_swasthya_purpose': 'Holistic physical, mental, and spiritual well-being.',
      'aandolan_swasthya_description': '''
Yoga and pranayama
• Natural therapies
• De-addiction campaigns
• Sattvic (pure) lifestyle

This movement promotes balanced and energetic living.
''',

      'aandolan_swavalamban_title': 'Self-Reliance Movement',
      'aandolan_swavalamban_purpose': 'Economic independence and dignity of labor.',
      'aandolan_swavalamban_description': '''
Promotion of small industries
• Skill development
• Awareness of self-respect and work culture
• Self-reliant family systems

Self-reliance builds confidence and social respect.
''',

      'aandolan_paryavaran_title': 'Environmental Movement',
      'aandolan_paryavaran_purpose': 'Nature conservation and environmental cleanliness.',
      'aandolan_paryavaran_description': '''
Tree plantation drives
• Atmospheric purification through Yagya
• Water conservation
• Plastic-free campaigns

This movement restores balance between humanity and nature.
''',

      'aandolan_mahila_jagran_title': 'Women Empowerment Movement',
      'aandolan_mahila_jagran_purpose': 'Respect and empowerment of women.',
      'aandolan_mahila_jagran_description': '''
Women’s education
• Value development
• Strengthening families
• Leadership development

A society awakens when its women awaken.
''',

      'aandolan_vyasan_mukti_title': 'De-addiction & Social Reform Movement',
      'aandolan_vyasan_mukti_purpose': 'Freeing society from harmful practices.',
      'aandolan_vyasan_mukti_description': '''
Anti-addiction drives
• Opposition to dowry, superstition, and female foeticide
• Social awareness programs
• Public rallies and campaigns

This movement purifies and enlightens society.
''',
      // Group Member Management
      'manage_roles_title': 'Manage Roles for {name}',
      'roles': 'Roles',
      'admin_role': 'Admin',
      'only_system_admins_manage': 'Only system admins can manage this role',
      'admin_role_desc': 'Can manage members and settings',
      'error_updating_role': 'Error updating role',
      'guruji_role': 'Guruji',
      'guruji_role_desc': 'Can teach and manage content',
      'permitted_role': 'Permitted User',
      'permitted_role_desc': 'Special permissions for messaging/pinning',
      'member_role': 'Member',
      'done': 'Done',
      'remove_from_group': 'Remove from Group',
      'remove_member': 'Remove Member?',
      'remove_member_confirm': 'Are you sure you want to remove {name} from this group?',
      'remove': 'Remove',
      'member_removed_success': 'Member removed successfully',
      'volunteer_removed': 'Volunteer removed',
      'remove_volunteer': 'Remove Volunteer?',
      'remove_volunteer_confirm': 'Are you sure you want to remove {name}?',
      
      // Assign Volunteer
      'assign_volunteers': 'Assign Volunteers',
      'select_member': 'Select Member',
      'choose_member': 'Choose a member',
      'role': 'Volunteer Role',
      'volunteer_role_hint': 'e.g., Carpet Spreader, Chair Arranger',
      'volunteer_desc_hint': 'Describe the volunteer responsibilities...',
      'description_optional': 'Description (Optional)',
      'description': 'Description',
      'end_date': 'End Date',
      'end_date_optional': 'End Date (Optional)',
      'sending': 'Sending',
      'assign': 'Assign',
      'invitation_sent': 'Volunteer invitation sent',
      'select_member_error': 'Please select a member',
      'reason': 'Reason',
      'assigned_by': 'Assigned by',
      'accepted': 'Accepted',
      'pending': 'Pending',
      'declined': 'Declined',
      'unknown_user': 'Unknown User',
      'no_eligible_members': 'No eligible members in this group',

      // Group Details & Permissions
      'invite_members': 'Invite Members',
      'search': 'Search',
      'everyone': 'Everyone',
      'admins_only': 'Admins Only',
      'admins_and_gurujis': 'Admins & Gurujis',
      'admins_gurujis_permitted': 'Admins, Gurujis & Permitted',
      'who_can_send_messages': 'Who can send messages?',
      'message_permission_updated': 'Message permission updated',
      'who_can_pin_messages': 'Who can pin messages?',
      'pin_permission_updated': 'Pin permission updated',
      'message_send_permission': 'Message Send Permission',
      'pin_message_permission': 'Pin Message Permission',
      'group_settings': 'Group Permissions',
      'default_samagri_from_type': 'Default Samagri from {type}',

      // Invite User & Volunteer Dialogs
      'invitation_already_sent': 'Invitation already sent to this user',
      'cannot_invite_self': 'You cannot invite yourself to the group',
      'user_already_member': 'User is already a member of this group',
      'error_sending_invitation': 'Error sending invitation',
      'invitation_sent_to': 'Invitation sent to {name}',
      'volunteer_invitation_sent_to': 'Volunteer invitation sent to {name}',
      'error_loading_members': 'Error loading members: {error}',
      'enter_role': 'Please enter a role',
      'email': 'Email',
      'error': 'Error',
      'member': 'Member',
      'enter_email': 'Please enter an email or username',
      'error_searching_user': 'Error searching user',
      'user_not_found': 'User not found',

      // Seva Management
      'manage_seva_opportunities': 'Manage Seva Opportunities',
      // Public Groups
      'public_groups': 'Public Groups',
      'no_pending_requests': 'No Pending Requests',
      'all_public_group_requests_reviewed': 'All public group requests have been reviewed',
      'created_by': 'Created by',
      'unknown_user': 'Unknown User',
      'reason_for_creating': 'Reason for Creating',
      'reject': 'Reject',
      'approve': 'Approve',
      'reject_public_group_title': 'Reject Public Group?',
      'reject_public_group_content': 'Rejecting "{name}" will mark it as rejected and the creator will see the reason.',
      'rejection_reason': 'Rejection Reason',
      'rejection_reason_hint': 'e.g., Does not meet guidelines',
      'enter_rejection_reason': 'Please enter a rejection reason',
      'approved_as_public_group': '"{name}" approved as public group',
      'has_been_rejected': '"{name}" has been rejected',
      'error_approving': 'Error approving "{name}": {error}',
      'error_rejecting': 'Error rejecting "{name}": {error}',
      'pending_approval': 'Pending Approval',
      'error_loading_sevas': 'Error loading sevas',
      'create_seva': 'Create Seva',
      'new_seva': 'New Seva',
      'edit_seva': 'Edit Seva',
      'search_seva_placeholder': 'Search seva by name...',
      'no_seva_opportunities': 'No Seva opportunities yet',
      'seva_created_success': 'Seva created successfully',
      'seva_updated_success': 'Seva updated successfully',
      'assign_selected': 'Assign Selected',
      'internal_notes_optional': 'Internal Notes (Optional)',
      'internal_notes_hint': 'Notes for these assignments...',
      'delete_seva': 'Delete Seva',
      'delete_seva_confirm': 'Are you sure you want to delete "{title}"?',
      'cannot_undo': 'This action cannot be undone.',
      'no_gurujis_match': 'No matching Gurujis found',
      'male_needed': 'Male Needed',
      'female_needed': 'Female Needed',
      'select_date_time': 'Select Date & Time',
      'enter_manually': 'Enter Manually',
      'find_responsible_person': 'Find Responsible Person',
      'contact_name': 'Contact Name',
      'contact_role': 'Role / Title',
      'contact_phone': 'Contact Phone',
      'cannot_edit_completed_seva': 'Cannot edit completed Seva',
      'could_not_open_map': 'Could not open map',
      'resume_seva': 'Resume Seva',
      'volunteers': 'Volunteers',
      'backup_volunteers': 'Backup Volunteers',
      'no_volunteers_yet': 'No volunteers yet. Be the first!',
      'participate_in_seva': 'Participate in Seva',
      'withdraw_from_seva': 'Withdraw from Seva',
      'no_interests_available': 'No interests available',
      'interests_topics': 'Interests / Topics',
      'group_interests_title': 'Group Interests',
      'joined': 'Joined',
      'event_will_start': 'Event will start soon',
      'event_is_live': 'Event is live',
      'event_paused': 'Event is paused',
      'event_postponed': 'Event postponed. Await update',
      'event_rescheduled': 'Event rescheduled',
      'event_completed': 'Event completed',
      'event_cancelled': 'Event cancelled',
      'manage_seva_op': 'Manage Seva',
      'gurujis_assigned': 'Gurujis Assigned',
      'no_gurujis_selected': 'No Gurujis selected',
      'assign_guruji': 'Assign Guruji',
      'reassign': 'Reassign',
      'remove_assignment': 'Remove Assignment',
      'show_active': 'Show Active',
      'show_history': 'Show History',
      'male': 'Male',
      'female': 'Female',
      'upcoming': 'Upcoming',
      'live': 'Live',
      'full': 'Full',
      'past': 'Past',
      'paused': 'Paused',
      'assigned': 'Assigned',
      'start': 'Start',
      'postpone': 'Postpone',
      'google_maps_link_optional': 'Google Maps Link (Optional)',
      'filled_status': 'Filled',
      'assigned_guruji': 'Assigned Guruji',
      'accepted': 'Accepted',
      'volunteers_filled': 'Volunteers Filled',
      'become_first_volunteer': 'Become the first volunteer',
      'required': 'Required',
      'pause': 'Pause',
      'mark_complete': 'Mark Complete',
      'filled': 'Filled',
      'status_cancelled': 'Cancelled',
      'rescheduled': 'Rescheduled',
      'postponed': 'Postponed',
      
      // Seva Lifecycle Extended
      'seva_postponed_to': 'Seva postponed to {date}',
      'new_date_label': 'New Date',
      'reason': 'Reason',
      'select_new_date': 'Select New Date',
      'reason_required': 'Reason (Required)',
      'confirm_postpone': 'Confirm Postpone',
      'confirm_postpone_msg': 'Are you sure you want to postpone this Seva? It will be automatically resumed on the new date.',
      'cannot_select_past_date': 'Cannot select a past date',
      'upload_photos': 'Upload Photos',
      'link_folder': 'Link Folder',
      'optional_folder_selection_hint': 'Optionally select a folder to organize these photos.',
      'search_folder_hint': 'Search by folder name...',
      'create_new_folder': 'Create New Folder',
      'select_existing_folder': 'Select Existing Folder',
      'photos_required': 'At least one photo is required to complete Seva',
      'activity_log': 'Activity Log',
      'log_created': 'Seva Created',
      'log_postponed': 'Postponed',
      'log_resumed': 'Resumed',
      'log_completed': 'Completed',
      'log_photos_uploaded': 'Photos Uploaded',
      'log_cancelled': 'Cancelled',
      'log_status_changed': 'Status Changed',
      'by_user': 'by {name}',
      'seva_auto_resumed_msg': 'Seva will resume automatically on {date}',
      'pull_to_refresh': 'Pull down to refresh',
      'primary': 'Primary',
      'backup': 'Backup',
      'mark_attendance': 'Mark Attendance',
      'present': 'Present',
      'absent': 'Absent',
      'attendance_marked': 'Attendance Marked (Cannot Withdraw)',
      'withdrawn_success': 'You have withdrawn from seva',
      'joined_success': 'Joined Seva successfully!',
      'mark_attendance_title': 'Mark Attendance',
      'no_participants_joined': 'No participants joined yet.',
      'unmarked': 'Unmarked',
      'confirm_attendance_label': 'Confirm Attendance',
      'mark_all_to_continue': 'Mark All to Continue',
      'backup_volunteer': 'Backup Volunteer',
      'primary_volunteer': 'Primary Volunteer',
      'finalize_attendance': 'Finalize Attendance',
      'present_with_count': 'Present ({count})',
      'absent_with_count': 'Absent ({count})',
      'send_gratitude_finalize': 'Send Gratitude & Finalize',
      'no_volunteers_marked_present': 'No volunteers marked as present',
      'appreciation_only_present': 'Appreciation is only for present volunteers',
      'select_volunteers_to_appreciate': 'Select Volunteers to Appreciate',
      'deselect_all': 'Deselect All',
      'select_all': 'Select All',
      'select_appreciation_badge': 'Select Appreciation Badge',
      'personal_note_optional': 'Personal Note (Optional)',
      'add_personal_note_hint': 'Add a personal note...',
      'recorded_as_absent': 'Recorded as Absent',
      'partial_appreciation_title': 'Partial Appreciation?',
      'partial_appreciation_msg': 'You are appreciating only {count} out of {total} present volunteers. Continue?',
      'please_select_badge_error': 'Please select an appreciation badge',
      'please_write_longer_msg_error': 'Please write a slightly longer message',
      'attendance_finalized_gratitude_sent': 'Attendance Finalized & Gratitude Sent!',
      'attendance_finalized_msg': 'Attendance Finalized!',
      'dedicated_seva_msg': 'Your dedication and sincerity in this seva are deeply appreciated. Thank you for serving with commitment.',
      'time_seva_msg': 'Thank you for generously giving your time and being present for the seva.',
      'team_seva_msg': 'Your teamwork and coordination made this seva successful. Grateful for your support.',
      'impactful_seva_msg': 'Your contribution created a meaningful impact. Thank you for your inspiring seva.',
      'event_not_started': 'Event hasn\'t started yet. Please wait until {time}',
      'cant_mark_attendance_early': 'Cannot mark attendance before the event has begun',
      'available_after': 'Available after {time}',
      'admin_actions_error_early_start': 'Cannot start event before {time}',
      'admin_actions_error_not_started': 'Event must be STARTED before marking as OVER',
      'admin_actions_error_early_end': 'Cannot mark event as OVER before scheduled time ({time})',
      'status_updated': 'Status updated to {status}',
      'reason_for_status': 'Reason for {status}',
      'enter_reason_optional': 'Enter reason (optional)',
      'confirm': 'Confirm',

      // Interests
      'interest_music': 'Music',
      'interest_teaching': 'Teaching',
      'interest_social_service': 'Social Service',
      'interest_meditation': 'Meditation',
      'interest_youth_activities': 'Youth Activities',
      'interest_event_organization': 'Event Organization',
      'interest_content_creation': 'Content Creation',
      'interest_technical_support': 'Technical Support',
      'select_gender': 'Select Gender',
      'enter_full_name': 'Please enter your name',
      'enter_valid_phone': 'Please enter a valid 10-digit phone number',
      'enter_phone': 'Please enter your phone number',
      'select_dob': 'Please select your Date of Birth',
      'select_gender_error': 'Please select your gender',
      // General
      'app_name': 'Gayatri Pariwar Bhiwandi',
      'ok': 'OK',
      'cancel': 'Cancel',
      'save': 'Save',
      'delete': 'Delete',
      'edit': 'Edit',
      'submit': 'Submit',
      'loading': 'Loading...',
      'error': 'Error',
      'success': 'Success',
      'organization': 'Organization',
      'search': 'Search',
      'emergency_summary': 'Emergency Summary',
      'resolution_note': 'Resolution Note',
      'resolve_emergency_title': 'Resolve Emergency',
      'no_data': 'No data available',
      'all_is_well': 'All is well!',
      'retry': 'Retry',
      'close': 'Close',
      'yes': 'Yes',
      'no': 'No',
      'back': 'Back',
      'next': 'Next',
      'done': 'Done',
      'last_synced': 'Last synced: ',
      'sync_success': 'Synced {count} entries successfully',
      'no_data_to_sync': 'No pending data to sync',
      'sync_failed': 'Sync failed',
      'just_now': 'Just now',
      'minutes_ago': '{count} minute(s) ago',
      'hours_ago': '{count} hour(s) ago',
      'yesterday': 'Yesterday',
      'days_ago': '{count} days ago',
      'reset': 'Reset',
      'select': 'Select',
      'add': 'Add',
      'remove': 'Remove',
      'update': 'Update',
      'create': 'Create',
      'view': 'View',
      'view_history': 'View History',
      'my_sos_history': 'My SOS History',
      'call_now': 'Call Now',
      'status_open': 'OPEN',
      'status_acknowledged': 'ACKNOWLEDGED',
      'status_resolved': 'RESOLVED',
      'acknowledged': 'Acknowledged',
      'waiting': 'Waiting...',
      'managed_by': 'Managed by {name}',
      'by': 'by {name}',
      'description': 'Description',
      'resolved': 'Resolved',
      'role_admin': 'Admin',
      'role_parent': 'Parent',
      'role_guruji': 'Guruji',
      'role_unknown': 'Unknown',
      'details': 'Details',
      'title': 'Title',
      'date': 'Date',
      'time': 'Time',
      'status': 'Status',
      'pending': 'Pending',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'completed': 'Completed',
      'ongoing': 'Ongoing',
      'no_ongoing_events': 'No ongoing events',
      'all': 'All',
      'filter': 'Filter',
      'sort': 'Sort',
      'share': 'Share',
      'download': 'Download',
      'upload': 'Upload',
      'refresh': 'Refresh',
      
      // Admin Family Links
      'family_links_admin': 'Family Links',
      'family_links': 'Family Links',
      'create_family_link': 'Create Family Link',
      'select_parent': 'Select Parent',
      'select_child': 'Select Child',
      'select_both_users': 'Please select both users',
      'cannot_link_self': 'Cannot link user to themselves',
      'link_created': 'Family link created successfully',
      'search_users': 'Search Users...',
      'filter_status': 'Status',
      'all_links': 'All Links',
      'audit_trail': 'Audit Trail',
      'add_link': 'Add Link',
      'links_found': 'links found',
      'no_family_links': 'No family links found',
      'no_audit_logs': 'No audit logs found',
      'parent_child': 'Parent-Child',
      'elder_caregiver': 'Elder-Caregiver',
      'relationship': 'Relationship',
      'created': 'Created',
      'actions': 'Actions',
      'import_failed': 'Import failed',
      'file_saved': 'File saved',
      'export_success': 'Export successful',
      'export_failed': 'Export failed',
      'importing': 'Importing...',
      'processing': 'Processing',
      'links': 'links',
      'import_complete': 'Import complete',
      'failed': 'Failed',
      'add_first_link': 'Add your first family link using the + button',
      'parent': 'Parent',
      'child': 'Child',
      'no_links_to_export': 'No links to export',
      
      // Edit Link Dialog
      'edit_family_link': 'Edit Family Link',
      'current_link': 'Current Link',
      'type': 'Type',
      'permissions': 'Permissions',
      'view_activity': 'View Activity',
      'view_activity_desc': 'Parent can see child\'s app usage',
      'receive_sos': 'Receive SOS Alerts',
      'receive_sos_desc': 'Forward emergency alerts',
      'restrict_content': 'Restrict Content',
      'restrict_content_desc': 'Limit child access',
      'expiration_date': 'Expiration Date',
      'no_expiration': 'No expiration',
      'last_modified_by': 'Last modified by',
      'link_updated': 'Family link updated successfully',
      // Auth
      'login': 'Login',
      'signup': 'Sign Up',
      'logout': 'Logout',
      'email': 'Email',
      'password': 'Password',
      'confirm_password': 'Confirm Password',
      'forgot_password': 'Forgot Password?',
      'welcome_back': 'Welcome Back',
      'sign_in_continue': 'Sign in to continue',
      'reset_password': 'Reset Password',
      'send_reset_link': 'Send Reset Link',
      'create_account': 'Create Account',
      'already_have_account': 'Already have an account?',
      'dont_have_account': "Don't have an account?",
      'enter_email': 'Enter your email',
      'enter_password': 'Enter your password',
      'join_gayatri': 'Join Gayatri Pariwar',
      'continue_with_google': 'Continue with Google',
      // Navigation
      'home': 'Home',
      'groups': 'Groups',
      'events': 'Events',
      'group_events': 'Group Events',
      'more_actions': 'More Actions',
      'attendance': 'Attendance',
      'manage_members': 'Manage Members',
      'view_members': 'View Members',
      'assign_volunteers': 'Assign Volunteers',
      'invite_members': 'Invite Members',
      'view_sadhana': 'View Sadhana',
      'spiritual': 'Spiritual',
      'profile': 'Profile',
      'settings': 'Settings',
      'news': 'News',
      'chat': 'Chat',
      'members': 'Members',
      // Settings
      'notifications': 'Notifications',
      'appearance': 'Appearance',
      'theme': 'Theme',
      'font_size': 'Font Size',
      'language': 'Language',
      'privacy_security': 'Privacy & Security',
      'change_password': 'Change Password',
      'about': 'About',
      'app_version': 'App Version',
      'terms_conditions': 'Terms & Conditions',
      'privacy_policy': 'Privacy Policy',
      'contact_support': 'Contact Support',
      'clear_cache': 'Clear Cache',
      'rate_app': 'Rate the App',
      'change_username': 'Change Username',
      'two_factor_auth': 'Two-Factor Authentication',
      'coming_soon': 'Coming soon',
      'free_up_storage': 'Free up storage space',
      'clear_cache_message': 'This will clear all cached images and free up storage space. Continue?',
      'clear_cache_success': 'Cache cleared successfully',
      'cannot_change_until': 'Cannot change until',
      'pending_invitations': 'Pending Invitations',
      'no_pending_invitations': 'No pending invitations',
      'invitations_hint': "You'll see group invitations here",
      'pranaam_greeting': 'Pranaam',
      'quick_access': 'Quick Access',
      'celebrations': 'Celebrations',
      'calendar': 'Calendar',
      'latest_news': 'Latest News',
      'upcoming_events': 'Upcoming Events',
      'my_groups': 'My Groups',
      'media_library': 'Media Library',
      'mandir_services': 'Mandir Services',
      'seva_volunteer': 'Seva (Volunteer)',
      'start_anushthan': 'Start an Anushthan',
      'start_anushthan_subtitle': 'Commit to 7, 11, 21, or 40 days of practice',
      'offline_backup_message': '📱 Your counts are safely saved on this device.\nThey\'ll be backed up automatically when you\'re online.',
      'history': 'History',
      'sadhana_history': 'Sadhana History',
      'no_records_yet': 'No records yet',
      'day_streak': 'Day Streak!',
      'keep_flame_alive': 'Keep the flame alive!',
      'complete_mala_start': 'Complete a mala to start',

      'please_login': 'Please login',
      'sadhana_progress': 'Sadhana Progress',
      'no_students_in_group': 'No students in this group yet',
      'private_not_shared': 'Private / Not Shared',
      'no_emergency_contacts': 'No official emergency contacts listed.',
      'select_folder': 'Select Folder',
      'clear_selection': 'Clear Selection',
      'select_current': 'Select Current',
      'filter_by_user': 'Filter by User',
      'filtered_check': 'Filtered ✓',
      'user_filtered': 'User Filtered',
      'clear_filter': 'Clear Filter',
      'x_requests': '{count} requests',
      'activity_request_created': 'Request Created',
      'activity_item_selected': 'Item Selected',
      'activity_item_deselected': 'Item Deselected',
      'activity_special_item_added': 'Special Item Added',
      'activity_special_item_removed': 'Special Item Removed',
      'activity_request_revised': 'Request Revised',
      'activity_item_approved': 'Item Approved',
      'activity_item_rejected': 'Item Rejected',
      'activity_approved_all': 'All Samagri Approved',
      'activity_revision_requested': 'Revision Requested',
      'activity_guruji_volunteered': 'Guruji Volunteered',
      'activity_guruji_note': 'Guruji Note',
      'activity_guruji_assigned': 'Guruji Assigned',
      'activity_admin_notes': 'Admin Notes',
      'activity_admin_note': 'Admin Note',
      'activity_status_changed': 'Status Changed',
      'activity_guruji_approved_item_detail': 'Guruji approved {item}',
      'activity_guruji_rejected_item_detail': 'Guruji rejected {item} — reason: {reason}',
      'activity_approved_all_detail': 'Guruji approved all samagri — editing locked',
      'activity_revision_requested_detail': 'Guruji requested revision: {reason}',
      'activity_user_revised_detail': 'User revised request.',
      'activity_user_selected_item_detail': 'User selected: {item} ✓',
      'activity_user_deselected_item_detail': 'User deselected: {item}',
      'activity_guruji_volunteered_detail': '{name} volunteered for this request',
      'activity_guruji_left_note_detail': 'Guruji left a note',
      'activity_admin_left_note_detail': 'Admin replied',
      'seva_opportunities': 'Seva Opportunities',
      // Seva Assignment Workflow
      'seva_assignments': 'Your Assigned Sevas',
      'no_assignments': 'No Seva assignments yet',
      'will_be_notified': 'You\'ll be notified when Admin assigns you to manage a Seva',
      'pending_response': 'Pending Your Response',
      'admin_notes': 'Admin Notes',
      'accept_assignment': 'Accept',
      'reject_assignment': 'Reject',
      'assignment_accepted': 'Accepted',
      'assignment_rejected': 'Rejected',
      'assignment_pending': 'Pending',
      'confirm_accept_title': 'Confirm Acceptance',
      'confirm_accept_msg': 'Are you sure you want to accept this Seva assignment?',
      'you_will_be_responsible': 'You will be responsible for',
      'managing_attendance': 'Managing participant attendance',
      'giving_appreciation': 'Giving appreciation to volunteers',
      'confirm_accept_btn': 'Confirm Accept',
      'rejection_reason_title': 'Reason for Rejection',
      'rejection_reason_min': 'Please provide a reason (at least 10 characters)',
      'submit_rejection': 'Submit Rejection',
      'will_notify_admin': 'This will notify the Admin',
      'admin_message_optional': 'Optional Message for Guruji',
      'admin_message_hint': 'e.g., Please arrive 30 mins early',
      'select_gurujis': 'Select Guruji(s)',
      'search_gurujis': 'Search Gurujis...',
      'assignment_status': 'Assignment Status',
      'only_assigned_gurujis': 'Only assigned Gurujis can manage this Seva',
      'accepted_on': 'Accepted on',
      'rejected_on': 'Rejected on',
      'assigned_on': 'Assigned on',
      // Change Password
      'change_password_desc': 'Enter your current password and choose a new one',
      'current_password': 'Current Password',
      'new_password': 'New Password',
      'password_tips': 'Password Tips',
      'password_tip_1': 'Use at least 8 characters',
      'password_tip_2': 'Include uppercase and lowercase letters',
      'password_tip_3': 'Add numbers and special characters',
      'password_tip_4': 'Avoid common words or patterns',
      // Profile Setup & Edit
      'save_changes': 'Save Changes',
      'take_photo': 'Take Photo',
      'choose_from_gallery': 'Choose from Gallery',
      'verify_password': 'Verify Password',
      'verify_password_desc': 'For security, please enter your password to change your phone number.',
      'verify': 'Verify',
      'incorrect_password': 'Incorrect password. Please try again.',
      'profile_updated': 'Profile updated successfully',
      'failed_save': 'Failed to save profile',
      'select_interest_error': 'Please select at least one interest',
      'city_location': 'City/Location',
      'select_location': 'Select your location',
      'select_location_error': 'Please select your location',
      'enter_name_error': 'Please enter your name',
      'enter_full_name': 'Please enter your full name',
      'enter_phone': 'Please enter your phone number',
      'enter_phone_error': 'Please enter your phone number',
      'enter_valid_phone': 'Please enter a valid 10-digit phone number',
      'invalid_phone_error': 'Please enter a valid 10-digit phone number',
      'select_dob': 'Please select your Date of Birth',
      'enter_dob_error': 'Please select your Date of Birth',
      'select_gender': 'Select Gender',
      'select_gender_error': 'Please select your gender',
      'select_location_error': 'Please select your location',
      'marital_status': 'Marital Status',
      'marriage_anniversary': 'Marriage Anniversary',
      'engagement_date': 'Engagement Date',
      'single': 'Single',
      'engaged': 'Engaged',
      'married': 'Married',
      'widow_widower': 'Widow/Widower',
      'select_your_interests': 'Select Your Interests',
      'username_available': 'Username is available',
      'username_taken': 'Username is already taken',
      'logout_confirmation': 'Are you sure you want to logout?',
      'confirm_logout': 'Logout',
      'cancel': 'Cancel',
      'social_youtube': 'YouTube',
      'social_facebook': 'Facebook',
      'social_instagram': 'Instagram',
      'follow_us': 'Follow Us',
      // Terms & Conditions
      'terms_update_date': 'Last updated: 06 December 2025',
      'terms_1_title': '1. Acceptance of Terms',
      'terms_1_content': 'By downloading, installing, or using the Gayatri Pariwar Bhiwandi app, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the app.',
      'terms_2_title': '2. Description of Service',
      'terms_2_content': 'Gayatri Pariwar Bhiwandi is a community app designed to connect members of the Gayatri Pariwar spiritual community. The app provides features including:\n\n• Group communication and messaging\n• Event management and notifications\n• Spiritual resources and content\n• Community news and announcements\n• Profile management',
      'terms_3_title': '3. User Accounts',
      'terms_3_content': '• You must provide accurate information when creating an account\n• You are responsible for maintaining the confidentiality of your account credentials\n• You must be at least 13 years old to use this app\n• One person may not maintain multiple accounts',
      'terms_4_title': '4. User Conduct',
      'terms_4_content': 'You agree not to:\n\n• Post offensive, abusive, or inappropriate content\n• Harass or intimidate other users\n• Share false or misleading information\n• Use the app for commercial purposes without permission\n• Attempt to gain unauthorized access to other accounts\n• Violate any applicable laws or regulations',
      'terms_5_title': '5. Content Guidelines',
      'terms_5_content': '• All content shared should align with the spiritual values of Gayatri Pariwar\n• Respect the religious and cultural sentiments of all community members\n• Do not share copyrighted material without permission\n• The app administrators reserve the right to remove inappropriate content',
      'terms_6_title': '6. Privacy',
      'terms_6_content': 'Your privacy is important to us. Please refer to our Privacy Policy for information on how we collect, use, and protect your personal information.',
      'terms_7_title': '7. Intellectual Property',
      'terms_7_content': '• The app and its content are protected by copyright and other intellectual property laws\n• Gayatri Pariwar logo, name, and associated materials are trademarks\n• Users retain ownership of their own content but grant the app license to display it',
      'terms_8_title': '8. Termination',
      'terms_8_content': 'We reserve the right to suspend or terminate your account if:\n\n• You violate these Terms and Conditions\n• You engage in harmful behavior toward the community\n• Your account remains inactive for an extended period\n• Required by law or community guidelines',
      'terms_9_title': '9. Disclaimer',
      'terms_9_content': '• The app is provided "as is" without warranties of any kind\n• We do not guarantee uninterrupted or error-free service\n• We are not responsible for user-generated content\n• Use of the app is at your own risk',
      'terms_10_title': '10. Changes to Terms',
      'terms_10_content': 'We may update these Terms and Conditions from time to time. Continued use of the app after changes constitutes acceptance of the new terms.',
      'terms_11_title': '11. Contact',
      'terms_11_content': 'For questions about these Terms and Conditions, please contact us through the app\'s support feature or at:\n\nEmail: gayatripragyapeethbhiwandi@gmail.com',
      // Privacy Policy
      'privacy_update_date': 'Last updated: 06 December 2025',
      'privacy_1_title': '1. Introduction',
      'privacy_1_content': 'Gayatri Pariwar Bhiwandi ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.',
      'privacy_2_title': '2. Information We Collect',
      'privacy_2_content': 'We collect information that you provide directly to us:\n\n• Personal Information: Name, email address, phone number, profile photo\n• Location Data: City and state for community grouping\n• Account Information: Username, password (encrypted)\n• Spiritual Preferences: Branch, Guruji/Bhagat Ji preference\n• User Content: Messages, posts, and uploads you share',
      'privacy_3_title': '3. How We Use Your Information',
      'privacy_3_content': 'We use the collected information to:\n\n• Provide and maintain the app functionality\n• Connect you with community members\n• Send you notifications about events and updates\n• Personalize your experience\n• Improve our services\n• Communicate with you about app changes\n• Ensure community safety and guidelines compliance',
      'privacy_4_title': '4. Information Sharing',
      'privacy_4_content': 'We may share your information:\n\n• With other community members (as per your privacy settings)\n• With group administrators for group management\n• With service providers who assist our operations\n• When required by law or legal process\n• To protect rights, property, or safety of users\n\nWe do NOT sell your personal information to third parties.',
      'privacy_5_title': '5. Data Storage and Security',
      'privacy_5_content': '• Your data is stored securely on Firebase servers\n• We use encryption for sensitive data transmission\n• Password data is hashed and never stored in plain text\n• Profile photos are stored on secure cloud services\n• We implement appropriate security measures to protect your data',
      'privacy_6_title': '6. Your Privacy Rights',
      'privacy_6_content': 'You have the right to:\n\n• Access your personal information\n• Correct inaccurate data\n• Delete your account and associated data\n• Opt-out of marketing communications\n• Control notification preferences\n• Request a copy of your data',
      'privacy_7_title': '7. Children\'s Privacy',
      'privacy_7_content': 'Our app is not intended for children under 10 years of age. We do not knowingly collect personal information from children under 10. If you believe we have collected such information, please contact us immediately.',
      'privacy_8_title': '8. Push Notifications',
      'privacy_8_content': '• We send push notifications for events, messages, and announcements\n• You can control notification preferences in the app settings\n• You can disable all notifications through your device settings\n• We do not share your device token with third parties',
      'privacy_9_title': '9. Third-Party Services',
      'privacy_9_content': 'Our app uses third-party services:\n\n• Firebase (Google) - Authentication and data storage\n• Cloudinary - Image storage\n• Firebase Cloud Messaging - Push notifications\n\nThese services have their own privacy policies governing the use of your information.',
      'privacy_10_title': '10. Data Retention',
      'privacy_10_content': '• We retain your data while your account is active\n• Upon account deletion, your personal data is removed within 30 days\n• Some anonymized data may be retained for analytics\n• Message history in groups may be retained for group continuity',
      'privacy_11_title': '11. Changes to Privacy Policy',
      'privacy_11_content': 'We may update this Privacy Policy periodically. We will notify you of significant changes through the app or via email. Continued use after changes indicates acceptance of the updated policy.',
      'privacy_12_title': '12. Contact Us',
      'privacy_12_content': 'For questions or concerns about this Privacy Policy or your data, please contact us:\n\nEmail: gayatripragyapeethbhiwandi@gmail.com\n\nYou may also use the in-app feedback feature to reach us.',
      // Theme options
      'light': 'Light',
      'dark': 'Dark',
      'system_default': 'System Default',
      // Font size options
      'small': 'Small',
      'medium': 'Medium',
      'large': 'Large',
      // Profile
      'edit_profile': 'Edit Profile',
      'full_name': 'Full Name',
      'phone_number': 'Phone Number',
      'location': 'Location',
      'city': 'City',
      'branch': 'Branch',
      'select_branch': 'Select Branch',
      'select_guruji': 'Select Guruji',
      'interests': 'Interests',
      'complete_setup': 'Complete Setup',
      'profile_setup': 'Profile Setup',
      'personal_info': 'Personal Information',
      'contact_info': 'Contact Information',
      'username': 'Username',
      'bio': 'Bio',
      'date_of_birth': 'Date of Birth',
      'gender': 'Gender',
      'other': 'Other',
      // Services
      'request_service': 'Request Service',
      'request_service_title': 'Request Service',
      'edit_request_title': 'Edit Request',
      'my_requests': 'My Requests',
      'service_type': 'Service Type',
      'address': 'Address',
      'preferred_date': 'Preferred Date',
      'preferred_time': 'Preferred Time',
      'additional_notes': 'Additional Notes',
      'select_service': 'Select Service',
      'service_details': 'Service Details',
      'request_status': 'Request Status',
      'new_request': 'New Request',
      'add_extra_item': 'Add Extra Item',
      'submit_request': 'Submit Request',
      // Notifications
      'news_notifications': 'News Notifications',
      'event_notifications': 'Event Notifications',
      'group_notifications': 'Group Notifications',
      'announcement_notifications': 'Announcements',
      'satsang_notifications': 'Daily Satsang Messages',
      // Home Dashboard
      'pranaam': 'Pranaam 🙏',
      'welcome_to_gayatri': 'Welcome back to Gayatri Pariwar',
      'view_all': 'View All',
      'no_news': 'No news available.',
      'no_events': 'No upcoming events.',
      // Groups
      'create_group': 'Create Group',
      'join_group': 'Join Group',
      'leave_group': 'Leave Group',
      'group_name': 'Group Name',
      'group_description': 'Group Description',
      'group_type': 'Group Type',
      'group_members': 'Group Members',
      'add_members': 'Add Members',
      'remove_member': 'Remove Member',
      'make_admin': 'Make Admin',
      'group_chat': 'Group Chat',
      'group_settings': 'Group Settings',
      'homework': 'Homework',
      'delete_group': 'Delete Group',
      'private_group': 'Private Group',
      'no_groups': 'No groups found.',
      'search_groups': 'Search groups...',
      'invitations': 'Invitations',
      'accept': 'Accept',
      'decline': 'Decline',
      'bss_group': 'BSS Group',
      'sss_group': 'SSS Group',
      'yss_group': 'YSS Group',
      'other_group': 'Other Group',
      // Events
      'event_details': 'Event Details',
      'past_event': 'PAST EVENT',
      'upcoming': 'UPCOMING',
      'event_group': 'Event Group',
      'join_discussion_group': 'Join the discussion group',
      'event_description': 'Description',
      'additional_media_available': 'Additional Media Available',
      'view_more_media': 'View more photos/videos',
      'delete_event': 'Delete Event',
      'delete_event_confirm': 'Are you sure you want to delete this event?',
      'event_deleted_success': 'Event deleted successfully',
      'event_not_found': 'Event not found',
      'error_deleting_event': 'Error deleting event: {error}',
      'tap_to_view': 'Tap to view',
      'create_event': 'Create Event',
      'edit_event': 'Edit Event',
      'event_date': 'Event Date',
      'event_time': 'Event Time',
      'event_location': 'Event Location',
      'event_description': 'Event Description',
      'no_events_scheduled': 'No events scheduled.',
      'event_photos': 'Event Photos',
      'tap_to_add_photos': 'Tap to add photos',
      'add_more_photos': 'Add More',
      'event_title_label': 'Event Title',
      'event_title_hint': 'Enter event title',
      'event_description_hint': 'What is this event about?',
      'event_location_label': 'Location',
      'event_location_hint': 'Where will the event be held?',
      'event_date_time_label': 'Event Date & Time',
      'link_media_folder': 'Link to Media Folder',
      'link_public_group': 'Link to Public Group',
      'optional_label': 'Optional',
      'media_folder_desc': 'Link this event to a Media folder for additional photos/videos.',
      'select_folder_hint': 'Select folder',
      'select_group_hint': 'Select public group',
      'uploading_photo_progress': 'Uploading photo {current} of {total}...',
      'creating_event_progress': 'Creating event...',
      'event_created_success': 'Event created successfully!',
      'responsible_contact': 'Responsible Contact Person',
      'select_user': 'Select User',
      'none': 'None',
      'camera_error': 'Error picking photos',
      'create_event_error': 'Error creating event',
      'contact_role_hint': 'e.g. Event Coordinator',
      'phone_hint': '+91 XXXXX XXXXX',
      'register': 'Register',
      'registered': 'Registered',
      'attendees': 'Attendees',
      // Spiritual
      'daily_quote': 'Daily Quote',
      'meditation': 'Meditation',
      'mantras': 'Mantras',
      'teachings': 'Teachings',
      'resources': 'Resources',
      'spiritual_tips': 'Spiritual Tips',
      'gayatri_mantra': 'Gayatri Mantra',
      'books': 'Books',
      'audio': 'Audio',
      'videos': 'Videos',
      'pictures': 'Pictures',
      'bhajans': 'Bhajans',
      'no_books_available': 'No Books available',
      'no_audio_available': 'No Audio available',
      'no_videos_available': 'No Videos available',
      'no_pictures_available': 'No Pictures available',
      'no_bhajans_available': 'No Bhajans available',
      'check_back_later': 'Check back later!',
      'open': 'Open',
      'check_out_resource': 'Check out this resource',
      'error_url_empty': 'Error: URL is empty',
      'cannot_download_video': 'Videos cannot be downloaded directly. Please open to watch.',
      'no_description': 'No description available.',
      'error_cannot_launch': 'Could not launch',
      // Chat
      'type_message': 'Type a message...',
      'send': 'Send',
      'no_messages': 'No messages yet.',
      'start_conversation': 'Start a conversation',
      // Admin
      'admin_dashboard': 'Admin Dashboard',
      'manage_users': 'Manage Users',
      'manage_groups': 'Manage Groups',
      'manage_events': 'Manage Events',
      'manage_news': 'Manage News',
      'manage_services': 'Manage Services',
      // Guruji
      'guruji_dashboard': 'Guruji Dashboard',
      'my_groups_guruji': 'My Groups',
      'service_requests': 'Service Requests',
      // Guruji Feature Extended
      'elder': 'Elder',
      'caregiver': 'Caregiver',
      'seva_tab': 'Seva',
      'calendar_tab': 'Calendar',
      'seva_coordinator_dashboard': 'Seva Coordinator Dashboard',
      'client_label': 'Client',
      'date_label': 'Date',
      'time_label': 'Time',
      'address_label': 'Address',
      'gurujis_interested': 'Guruji(s) interested',
      'i_can_take_request': 'I Can Take This Request',
      'waiting_admin_assign': 'Waiting for Admin to assign you',
      'volunteered_success': 'You have volunteered for this request! Admin will be notified.',
      'user_requested_items_title': 'User Requested Items & Adjustments',
      'note_prefix': 'Note:',
      'edit_reason': 'Edit Reason',
      'not_possible': 'Not Possible',
      'confirm_btn': 'Confirm',
      'user_attachments': 'User Attachments:',
      'required_samagri_checklist': 'Required Samagri Checklist:',
      'gallery': 'Gallery',
      'complete_action': 'Complete',
      'completing_service': 'Completing service...',
      'service_completed_success': 'Service marked as completed!',
      'mark_unavailable': 'Mark Unavailable',
      'mark_unavailable_confirm': 'Are you sure you cannot attend this service?',
      'reason_optional': 'Reason (Optional)',
      // Auth Feature Extended
      'login_failed': 'Login failed',
      'reset_password_desc': 'Enter your email address and we\'ll send you a link to reset your password.',
      'enter_email_error': 'Please enter your email',
      'enter_valid_email_error': 'Please enter a valid email',
      'reset_link_sent': 'Password reset link sent! Check your email.',
      'enter_email_or_phone': 'Please enter your email or phone',
      'enter_password_error': 'Please enter your password',
      'signup_failed': 'Signup failed',
      'terms_error_msg': 'Please agree to Terms & Conditions',
      'otp_title': 'Verify OTP',
      'otp_desc':' Enter the 6-digit OTP sent to',
      'resend_otp': 'Resend OTP',
      'resend_code_in': 'Resend code in',
      'resend_otp_action': 'Resend OTP',
      'verify_continue': 'Verify & Continue',
      'otp_sent_success': 'OTP sent successfully',
      'otp_resent_success': 'OTP resent successfully',
      'set_username_title': 'Set Your Username',
      'change_username_title': 'Change Username',
      'username_desc': 'Choose a unique username that others can use to find and invite you.',
      'username_label': 'Username',
      'username_hint': 'e.g., john_doe',
      'username_available': '✓ Username is available',
      'username_taken': '✗ Username is already taken',
      'check_availability_error': 'Error checking availability',
      'username_required': 'Username is required',
      'username_too_short': 'Username must be at least 3 characters',
      'username_too_long': 'Username must be less than 20 characters',
      'username_no_spaces': 'Spaces are not allowed in username',
      'username_invalid_chars': 'Only letters, numbers, and underscores allowed',
      'username_set_success': 'Username set successfully!',
      'username_set_error': 'Error setting username',
      'username_change_limit_msg': 'Username can be changed only once a month',
      'can_change_in_days': 'Can change in {days} days',
      'can_change_now': 'Can change now',
      'not_set_yet': 'Not set yet',
      'set_username_btn': 'Set Username',
      'update_btn': 'Update',
      // Errors and Messages
      'something_went_wrong': 'Something went wrong',
      'please_try_again': 'Please try again',
      'no_internet': 'No internet connection',
      'session_expired': 'Session expired. Please login again.',
      'invalid_email': 'Please enter a valid email',
      'password_too_short': 'Password must be at least 6 characters',
      'passwords_dont_match': 'Passwords do not match',
      'field_required': 'This field is required',
      'saved_successfully': 'Saved successfully',
      'deleted_successfully': 'Deleted successfully',
      'updated_successfully': 'Updated successfully',
      'are_you_sure': 'Are you sure?',
      'this_action_cannot_be_undone': 'This action cannot be undone.',
      // Welcome/Onboarding
      'welcome': 'Welcome',
      'get_started': 'Get Started',
      'skip': 'Skip',
      'continue_text': 'Continue',
      'onboarding_title_1': 'Connect with Community',
      'onboarding_desc_1': 'Join your local Gayatri Pariwar Bhiwandi and connect with like-minded spiritual seekers',
      'onboarding_title_2': 'Learn & Grow',
      'onboarding_desc_2': 'Access spiritual courses, mantras, and teachings to enhance your spiritual journey',
      'onboarding_title_3': 'Serve Through Seva',
      'onboarding_desc_3': 'Contribute to society through various seva opportunities and make a difference',
      // Media Browser
      'root': 'Root',
      'folders': 'Folders',
      'files': 'Files',
      'this_folder_is_empty': 'This folder is empty',
      'no_files': 'No files',
      'downloading': 'Downloading...',
      'download_complete': 'Download complete',
      'download_failed': 'Download failed',
      'share_file': 'Share File',
      'open_file': 'Open File',
      // Service Request Extended
      'yagya_karmkaand_rituals': 'Yagya, Karmkaand, Rituals & more',
      'selected': 'Selected',
      'please_select_service_type': 'Please select a service type above to continue',
      'view_my_requests': 'View My Requests',
      'service_location': 'Service Location',
      'house': 'House',
      'building_apt': 'Building/Apt',
      'flat_floor': 'Flat No. & Floor',
      'building_society_name': 'Building / Society Name',
      'street_road_name': 'Street / Road Name',
      'landmark_optional': 'Landmark (Optional)',
      'search_by_description': 'Search by description or address...',
      'all_status': 'All Status',
      'city_hint': 'e.g., Bhiwandi',
      'edit_item': 'Edit Item',
      'select_service_type_error': 'Please select a service type',
      'user_requested_items': 'User Requested Items',
      'manage_service_types': 'Manage Service Types',
      // General Actions
      'rename': 'Rename',
      'file': 'File',
      'delete_file_title': 'Delete File?',
      'delete_file_confirm': 'Are you sure you want to delete "{name}"?',
      'rename_file': 'Rename File',
      'new_name': 'New Name',
      'file_renamed': 'File renamed',
      'file_uploaded': 'File uploaded successfully',
      'cannot_open_file_type': 'Cannot open this file type',
      'rename_failed': 'Rename failed: {error}',
      'preparing_share': 'Preparing file for sharing...',
      'shared_from_app': 'Shared from Gayatri Pariwar Bhiwandi',

      // Notification Descriptions
      'news_notifications_desc': 'Get notified about latest news',
      'event_notifications_desc': 'Reminders for upcoming events',
      'group_notifications_desc': 'Notifications for group invites',
      'announcement_notifications_desc': 'Important announcements',
      'satsang_notifications_desc': 'Morning spiritual messages',

      // Public Group Creation
      'reason_for_creating_group': 'Reason for creating this group',
      'reason_for_creating_group_hint': 'Explain the purpose or intention of this group...',
      'reason_for_creating_group_helper': 'This helps admin understand why this group should be approved',
      'reason_min_length_error': 'Please provide a reason (at least 10 characters)',
      'n_files': '{count} files',
      'no_branches_available': 'No branches available. Please add a branch first.',
      'no_gurujis_available': 'No Gurujis available. Please add a Guruji first.',
      'no_media_folders': 'No media folders yet',
      'no_media_available_desc': 'No media available at the moment',

      // Service Types
      'no_service_types': 'No service types yet',
      'add_service_types_prompt': 'Add service types for users to request',
      'add_service_type': 'Add Service Type',
      'edit_service_type': 'Edit Service Type',
      'service_type_added': 'Service type added',
      'service_type_updated': 'Service type updated',
      'requirements_samagri': 'Requirements (Samagri)',
      'no_requirements_added': 'No requirements added yet.',
      'add_requirement': 'Add Requirement',
      'item_name': 'Item Name',
      'item_name_hint': 'e.g. Rice, Ghee',
      'quantity': 'Quantity',
      'quantity_hint': 'e.g. 1',
      'unit': 'Unit',
      'unit_hint': 'e.g. kg, pc, litre',
      'optional_good_to_have': 'Optional / Good to have',
      'users_can_see_service': 'Users can see this service',
      'hidden_from_users': 'Hidden from users',
      'optional': 'Optional',
      'storage_manager': 'Storage Manager',
      'folder': 'Folder',
      'no_folders_yet': 'No folders yet',
      'restore_availability': 'Restore Availability',
      'available': 'Available',
      'unavailable': 'Unavailable',
      'uploading': 'Uploading...',
      'upload_success': 'File uploaded successfully',
      'create_folder': 'Create Folder',
      'folder_name': 'Folder Name',
      'description_optional': 'Description (Optional)',
      'folder_description': 'Folder Description',
      'add_description': 'Add Description',
      'edit_folder': 'Edit Folder',
      'delete_folder_title': 'Delete Folder?',
      'delete_folder_confirm': 'Are you sure you want to delete this folder and all its contents? This action cannot be undone.',
      'active': 'Active',
      'inactive': 'Inactive',
      'activate': 'Activate',
      'deactivate': 'Deactivate',
      'not_backed_up_yet': 'Not backed up yet',
      'syncing': 'Syncing...',
      'data_synced': 'Data synced',
      'data_not_synced': 'Data not synced, saved on device',
      'data_synced_cloud': 'Data synced, saved on cloud',
      'sync_data': 'Sync Data',
      'backing_up_data': 'Backing up data to cloud...',
      'sun_short': 'Sun',
      'mon_short': 'Mon',
      'tue_short': 'Tue',
      'wed_short': 'Wed',
      'thu_short': 'Thu',
      'fri_short': 'Fri',
      'sat_short': 'Sat',
      'preferred': 'Preferred',
      // Guruji Dashboard Tabs
      'tab_today': 'Today',
      'tab_new_requests': 'New Requests',
      'tab_my_assigned': 'My Assigned',
      'tab_calendar': 'Calendar',
      'no_services_today': 'No services scheduled for today',
      'enjoy_day': 'Enjoy your day! 🙏',
      'no_new_requests': 'No new requests available',
      'awaiting_admin_assignment': 'Awaiting Admin Assignment',
      'volunteered': 'Volunteered',
      'unable_to_attend': 'Unable to Attend',
      'mark_completed': 'Mark as Completed',
      'open_directions': 'Open Directions',
      'approve_all': 'Approve All',
      'request_revision': 'Request Revision',
      'save_notes': 'Save Notes',
      'saving': 'Saving...',
      'your_notes_to_admin': 'Your Notes to Admin:',
      'add_notes_hint': 'Add notes (e.g., "Reached location")',
      'samagri_actions': 'Samagri Actions:',
      'samagri_approved_locked': 'Samagri approved - locked',
      'required_samagri_admin': 'Required Samagri (Admin)',
      'select_date_time_error': 'Please select preferred date and time',
      'request_updated': 'Service request updated successfully!',
      'request_submitted': 'Service request submitted successfully!',
      'notes_hint': 'Any special requirements...',
      'cancel_request_title': 'Cancel Request?',
      'cancel_request_content': 'Are you sure you want to cancel this service request? This action cannot be undone.',
      'yes_cancel': 'Yes, Cancel',
      'request_cancelled': 'Request cancelled',
      'confirmed': 'Confirmed',
      'tbd': 'TBD',
      'name': 'Name',
      'phone': 'Phone',
      'important_info_emergency': 'Important Info & Emergency',
      'contacts': 'Contacts',
      'locations': 'Locations',
      'sos_contacts': 'SOS Contacts',
      'alerts': 'Alerts',
      'no_contacts_yet': 'No contacts yet',
      'tap_to_add_contact': 'Tap + to add a contact',
      'no_locations_yet': 'No locations yet',
      'tap_to_add_location': 'Tap + to add a location',
      'add_tag': 'Add Tag',
      'tag_name': 'Tag Name',
      'delete_tag': 'Delete Tag',
      'delete_tag_confirm': 'Are you sure you want to delete tag "{tag}"?',
      'add_role': 'Add Role',
      'role_name': 'Role Name',
      'delete_role': 'Delete Role',
      'delete_role_confirm': 'Are you sure you want to delete role "{role}"?',
      'edit_contact': 'Edit Contact',
      'add_contact': 'Add Contact',
      'sort_order': 'Sort Order',
      'tags': 'Tags',
      'no_tags_available': 'No tags available. Add them in Settings tab.',
      'edit_location': 'Edit Location',
      'delete_location': 'Delete Location',
      'add_location': 'Add Location',
      'location_name': 'Location Name',
      'google_maps_link': 'Google Maps Link',
      'latitude': 'Latitude',
      'longitude': 'Longitude',
      'add_emergency_contact': 'Add Emergency Contact',
      'role': 'Role',
      'no_roles_available': 'No roles available. Add them in Settings tab.',
      'displayed_as_tag': 'Displayed as a tag in the widget',
      'resolved_requests': 'Resolved Requests',
      'active_requests': 'Active Requests',
      'guruji_label': 'Guruji',
      'temporarily_unavailable': 'Temporarily Unavailable',
      'cancellation_reason': 'Cancellation Reason',
      'cancelled_by': 'Cancelled by',
      'on_date': 'On',
      'request_not_found': 'Request not found',
      'status_summary': 'Status Summary',
      'stat_total': 'Total',
      'stat_pending': 'Pending',
      'stat_accepted': 'Accepted',
      'stat_completed': 'Completed',
      'stat_cancelled': 'Cancelled',
      'service_types': 'Service Types',
      'top_requesters': 'Top Requesters',
      'clear_all': 'Clear All',
      'filter_by_status': 'Filter by Status',
      'filter_by_type': 'Filter by Type',
      'no_service_requests_yet': 'No service requests yet',
      'preferred_label': 'Preferred: {value}',
      'assigned_label': 'Assigned: {value}',
      'requested_by': 'Requested By',
      'alt_contact': 'Alt. Contact',
      'default_samagri_from_type': 'Default Samagri (from Service Type):',
      'not_possible_with_reason': 'Not Possible: {reason}',
      'no_reason_given': 'No reason given',
      'loading_details': 'Loading details...',
      'currently_assigned': 'Currently assigned',
      'notes_from_guruji': 'Notes from Guruji:',
      'completion_photos_label': 'Completion Photos:',
      'unavailable_by_label': 'By: {name}',
      'cancelled_by_label': 'By: {name}',
      'cannot_complete_request': 'Cannot Complete Request',
      'pending_items_approval_error': 'There are pending User Requested Items that need Guruji approval/rejection before this request can be marked as completed.',
      'marked_unavailable_success': 'Request marked unavailable',
      'restore_to_pending': 'Restore to Pending',
      'request_restored_success': 'Request restored to pending',
      'cancellation_reason_label': 'Cancellation Reason',
      'cancellation_reason_hint': 'Why is this request being cancelled?',
      'please_enter_reason': 'Please enter a reason',
      'request_marked_unavailable': 'Request marked unavailable',
      'request_cancelled_success': 'Request cancelled',
      'confirmed_date': 'Confirmed Date',
      'confirmed_time': 'Confirmed Time',
      'cancel_request': 'Cancel Request',
      'request_marked_completed': 'Request marked completed',
      'request_details': 'Request Details',
      'notes': 'Notes',
      'attachments': 'Attachments',
      'assignment': 'Assignment',
      'final_date': 'Final Date',

      // Manage Resources
      'manage_resources': 'Manage Resources',
      'search_by_title': 'Search by title...',
      'all_types': 'All Types',
      'no_matching_resources': 'No matching resources',
      'tap_to_add_resource': 'Tap + to add your first resource',
      'resource_type_book': 'Books',
      'resource_type_audio': 'Audio',
      'resource_type_bhajan': 'Bhajans',
      'resource_type_video': 'Videos',
      'resource_type_picture': 'Pictures',
      'add_resource': 'Add Resource',
      'edit_resource': 'Edit Resource',
      'title_hint': 'e.g., Gayatri Chalisa',
      'title_required': 'Title is required',
      'description_hint': 'Brief description...',
      'select_type': 'Select Type',
      'category_label': 'Category',
      'no_category_label': 'No Category',
      'thumbnail_url': 'Thumbnail URL',
      'resource_visible': 'Resource is visible to users',
      'resource_draft': 'Resource is in draft mode',
      'draft': 'Draft',
      'confirm_delete_resource': 'Delete Resource?',
      'delete_resource_msg': 'Are you sure? This cannot be undone.',
      'upload_failed_prefix': 'Upload failed: ',
      'thumbnail_upload_failed_prefix': 'Thumbnail upload failed: ',
      
      // Resource Categories
      'category_gayatri': 'Gayatri',
      'category_health': 'Health',
      'category_life_lessons': 'Life Lessons',
      'category_devotional': 'Devotional',
      'category_yoga': 'Yoga',
      
      // Spiritual Content Management
      'manage_spiritual_content': 'Manage Spiritual Content',
      'daily_quotes': 'Daily Quotes',
      'meditation_tips': 'Meditation Tips',
      'items_count': '{count} items',
      'manage_daily_quotes': 'Manage Daily Quotes',
      'manage_meditation_tips': 'Manage Meditation Tips',
      'add_quote': 'Add Quote',
      'edit_quote': 'Edit Quote',
      'quote_text': 'Quote Text',
      'enter_quote': 'Enter the quote...',
      'author': 'Author',
      'author_hint': 'e.g., Pt. Shriram Sharma Acharya',
      'image_url_darshan': 'Image URL (For Darshan)',
      'tithi_occasion': 'Tithi / Occasion',
      'tithi_hint': 'e.g., Ekadashi, Special Day',
      'schedule_date': 'Schedule Date',
      'no_date_set': 'No date set (Optional)',
      'quote_visible': 'Quote is visible to users',
      'quote_draft': 'Quote is in draft mode',
      'delete_quote': 'Delete Quote?',
      'no_quotes_yet': 'No quotes yet',
      'tap_add_first_quote': 'Tap + to add your first quote',
      'add_tip': 'Add Tip',
      'edit_tip': 'Edit Tip',
      'tip_title': 'Tip Title',
      'tip_title_hint': 'e.g., Find a quiet place',
      'explain_tip': 'Explain the tip...',
      'tip_visible': 'Tip is visible to users',
      'tip_draft': 'Tip is in draft mode',
      'delete_tip': 'Delete Tip?',
      'no_tips_yet': 'No meditation tips yet',
      'tap_add_first_tip': 'Tap + to add your first tip',
      'save_order': 'Save Order',
      'reorder': 'Reorder',
      'url_label': 'URL',
      'url_hint': 'Enter URL (https://...)',
      'access_denied': 'Access Denied',
      'only_admin_guruji': 'Only Admin or Guruji can access this page.',
      
      // Manage Calendar
      'manage_calendar_events': 'Manage Calendar Events',
      'load_holidays': 'Load Holidays',
      'load_public_holidays': 'Load Public Holidays',
      'select_year_load_holidays': 'Select a year to load Indian public holidays.',
      'year_label': 'Year {year}',
      'add_new_event': 'Add New Event',
      'add_event': 'Add Event',
      'event_title': 'Event Title',
      'select_time': 'Select time',
      'event_category': 'Category',
      'event_icon': 'Icon (Emoji)',
      'event_icon_hint': 'e.g. 🕉️',
      'festival_settings': 'Festival Settings',
      'primary_festival_date': 'Primary Festival for this date',
      'primary_festival_desc': 'Drives app-wide UI theme',
      'theme_color_hex': 'Theme Color (Hex)',
      'pick_color': 'Pick Color',
      'banner_image': 'Banner Image',
      'upload_label': 'Upload',
      'pick_banner_image': 'Pick Banner Image',
      'banner_url': 'Banner URL',
      'suggested_mantra_id': 'Suggested Mantra ID (Optional)',
      'suggested_mantra_hint': 'e.g., gayatri, devi',
      'festival_description_localized': 'Festival Description (Localized)',
      'primary_festival_indicator': 'PRIMARY',
      'holidays_loaded_success': 'Holidays for {year} loaded!',
      'delete_event_title': 'Delete Event',
      'delete_event_confirm_with_title': 'Are you sure you want to delete "{title}"?',
      'no_events_found': 'No events found. Add one!',
      'pick_theme_color': 'Pick Theme Color',
      'select_btn': 'Select',
      'holidays_loaded': 'Holidays for {year} loaded!',
      'error_occurred': 'Error: {error}',
      'event_category_festival': 'Festival',
      'event_category_tithi': 'Tithi',
      'event_category_mandir_event': 'Mandir Event',
      'event_updated_success': 'Event updated successfully!',
      'banner_upload_success': 'Banner image uploaded successfully!',
      'expired': 'Expired',
      'news_management': 'News Management',
      'create_news': 'Create News',
      'edit_news': 'Edit News',
      'no_news_created': 'No news created yet.',
      'delete_news_title': 'Delete News',
      'delete_news_confirm': 'Are you sure you want to delete this news?',
      'tap_to_pick_image': 'Tap to pick image',
      'image_url_optional': 'Image URL (Optional)',
      'image_url_hint': 'Or paste image link here',
      'enter_news_title': 'Enter news title',
      'short_description_hint': 'Brief summary for the card',
      'full_article_content': 'Full Article Content',
      'mark_as_important': 'Mark as Important',
      'high_priority_notify': 'Sends high priority notification',
      'schedule_publishing': 'Schedule Publishing',
      'scheduled_for': 'Scheduled for:',
      'pick_date_time': 'Pick Date & Time',
      'change_date_time': 'Change Date & Time',
      'leave_empty_immediate': 'Leave empty to publish immediately',
      'responsible_contact_person': 'Responsible Contact Person',
      'role_title': 'Role / Title',
      'role_title_hint': 'e.g. Editor',
      'contact_phone_hint': '+91 XXXXX XXXXX',
      'save_draft': 'Save Draft',
      'publish_news': 'Publish News',
      'draft_saved': 'Draft saved',
      'news_published': 'News published',
      'select_image_or_url': 'Please select an image or enter a URL',
      'published': 'Published',
      'scheduled': 'Scheduled',
      'important': 'Important',
      'short_description': 'Short Description',
      'category': 'Category',
      'is_required': 'is required',
      'attendance_analytics': 'Attendance Analytics',
      'attendance_trend': 'Attendance Trend',
      'member_performance': 'Member Performance',
      'highest_percent': 'Highest %',
      'lowest_percent': 'Lowest %',
      'alphabetical': 'Alphabetical',
      'mark_all_present': 'Mark All Present',
      'mark_all_absent': 'Mark All Absent',
      'sessions': 'Sessions',
      'no_attendance_for_date': 'No attendance set for this date',
      'add_attendance_date': 'Add Attendance Date',
      'cannot_view_future_dates': 'Cannot view future dates',
      'no_data_for_chart': 'No data for chart',
      'today': 'Today',
      'no_attendance_groups_found': 'No groups with attendance enabled found.',

      // Branch & Guruji Management
      'manage_branches': 'Manage Branches',
      'no_branches_found': 'No branches found. Add one!',
      'add_branch': 'Add Branch',
      'edit_branch': 'Edit Branch',
      'branch_name': 'Branch Name',
      'branch_name_hint': 'Enter branch name',
      'city_location_hint': 'Enter city or location',
      'delete_branch_title': 'Delete Branch?',
      'delete_branch_confirm': 'Are you sure you want to delete this branch? This action cannot be undone.',
      'manage_gurujis': 'Manage Gurujis',
      'no_gurujis_found': 'No Gurujis assigned yet.',
      'assign_guruji_role': 'Assign Guruji Role',
      'assign_role': 'Assign Role',
      'promote_confirm_msg': 'Are you sure you want to promote {name} to Guruji?',
      'promote_success_msg': '{name} is now a Guruji',
      'promote_instruction': 'Search for a user to promote to Guruji.',
      'search_user_hint': 'Search User by Name or Email',
      'remove_guruji_role_title': 'Remove Guruji Role?',
      'remove_role_confirm_msg': 'This user will become a regular member.',
      'location_label': 'Location',
      'load_label': 'Load',
      
      'admin_notes_label': 'Admin Notes',
      'cancellation_details': 'Cancellation Details',
      'samagri_approved_msg': 'Samagri approved by Guruji - No changes allowed',
      'request_on_hold': 'Your request is on hold. You will be notified when service resumes.',
      'reason_label': 'Reason',
      'revision_required': 'Revision Required',
      'revision_required_content': 'Some requested items are not available. Please remove or modify the rejected items and resubmit your request.',
      'gurujis_note': 'Guruji\'s Note',
      'guruji_asked_title': 'Guruji asked you to add:',
      'requirements_checklist': 'Requirements Checklist',
      'no_requirements': 'No requirements list available.',
      'optional_suffix': ' (Optional)',
      'add_item': 'Add Item',
      'your_requested_items': 'Your Requested Items',
      'not_available': 'Not Available',
      // Celebrations
      'celebrations_page_title': '🎉 Today\'s Celebrations',
      'no_celebrations_today': 'No celebrations today',
      'special_note': 'Today we offer āhutis and chant mantras for these devotees. Please keep them in your blessings.',
      'chant_mantra': 'Chant Mantra',
      'yagya_ahuti': 'Yagya Ahuti',
      'send_blessings': 'Send Blessings',
      'birthdays': '🎂 Birthdays',
      'anniversaries': '💍 Anniversaries',
      'turning_age_prefix': 'Turning',
      'turning_age_suffix': 'today!',
      'blessings_msg': 'Blessings for a long, healthy life!',
      'celebrating_years_prefix': 'Celebrating',
      'celebrating_years_suffix': 'years of togetherness!',
      'festival_calendar': 'Festival Calendar',
      'no_events_day': 'No events for this day',
      // Festivals
      'makar_sankranti': 'Makar Sankranti',
      'vasant_panchami': 'Vasant Panchami',
      'maha_shivaratri': 'Maha Shivaratri',
      'holi': 'Holi',
      'ram_navami': 'Ram Navami',
      'raksha_bandhan': 'Raksha Bandhan',
      'janmashtami': 'Janmashtami',
      'ganesh_chaturthi': 'Ganesh Chaturthi',
      'dussehra': 'Dussehra',
      'diwali': 'Diwali',
      // Tutorial
      'tutorial_profile_title': 'Your Profile',
      'tutorial_profile_desc': 'Tap here to view and edit your profile. You can change your photo, name, and other details.',
      'tutorial_daily_inspiration_title': 'Daily Inspiration',
      'tutorial_daily_inspiration_desc': 'Start your day with spiritual thoughts and quotes.',
      'tutorial_celebrations_title': 'Celebrations',
      'tutorial_celebrations_desc': 'See who is celebrating birthdays and anniversaries today!',
      'tutorial_calendar_desc': 'View upcoming festivals, events, and important dates.',
      'tutorial_news_desc': 'Stay updated with the latest news and announcements.',
      'tutorial_events_title': 'Events',
      'tutorial_events_desc': 'Discover and join upcoming events in your community.',
      'tutorial_groups_title': 'Groups',
      'tutorial_groups_desc': 'Join groups and connect with like-minded members.',
      'tutorial_spiritual_desc': 'Access spiritual resources, quotes, and tips.',
      'tutorial_request_service_title': 'Request Service',
      'tutorial_request_service_desc': 'Request ceremonies like Yagya, Sanskar, etc.',
      'tutorial_seva_title': 'Seva Opportunities',
      'tutorial_seva_desc': 'Volunteer for selfless service activities.',
      'tutorial_media_title': 'Media Library',
      'tutorial_media_desc': 'Browse photos, videos, and other media from events.',
      'tutorial_lms_title': 'Sanskar Courses',
      'tutorial_lms_desc': 'Enroll in spiritual courses and track your learning progress.',
      'tutorial_bottom_nav_title': 'Navigation',
      'tutorial_bottom_nav_desc': 'Use these tabs to switch between Home, Groups, Events, Spiritual, and Profile.',
      'tutorial_guruji_today_title': 'Today\'s Schedule',
      'tutorial_guruji_today_desc': 'View your assigned services for today.',
      'tutorial_guruji_new_req_title': 'New Requests',
      'tutorial_guruji_new_req_desc': 'Browse and volunteer for new service requests.',
      'tutorial_guruji_assigned_title': 'My Assigned',
      'tutorial_guruji_assigned_desc': 'Manage services you have volunteered for.',
      'tutorial_guruji_seva_title': 'Seva Opportunities',
      'tutorial_guruji_seva_desc': 'View and manage general seva activities.',
      'tutorial_guruji_calendar_title': 'Calendar',
      'tutorial_guruji_calendar_desc': 'View upcoming service schedule.',
      // Volunteer Management

      'volunteer_invitations': 'Volunteer',
      'group_invitations': 'Groups',
      'no_volunteer_invitations': 'No volunteer invitations',
      'volunteer_invitations_hint': 'Volunteer assignments will appear here',
      'volunteer_invitation': 'Volunteer Invitation',
      'volunteer_role': 'Volunteer Role',
      'select_member': 'Select Member',
      'choose_member': 'Choose a member',
      'no_eligible_members': 'No eligible members in this group',
      'invitation_sent': 'Volunteer invitation sent',
      'declined': 'Declined',
      'assign': 'Assign',
      'end_date_optional': 'End Date (Optional)',
      'assigned_by': 'Assigned by',
      'manage_volunteers': 'Manage Volunteers',
      // Mandir Schedule
      'mandir_schedule': 'Mandir Schedule',
      'temple_schedule': 'Temple Schedule',
      'aarti': 'Aarti',
      'pooja': 'Pooja',
      'camp': 'Camp',
      'event': 'Event',
      'other_schedule': 'Other',
      'add_schedule': 'Add Schedule',
      'edit_schedule': 'Edit Schedule',
      'schedule_title': 'Title',
      'schedule_time': 'Time',
      'schedule_description': 'Description',
      'permanent_schedule': 'Permanent Schedule',
      'is_active': 'Active',
      // Important Info
      'important_contacts': 'Important Contacts',
      'important_contacts_subtitle': 'View emergency & important contacts',
      'important_locations': 'Important Locations',
      'important_locations_subtitle': 'View important places & directions',
      'important_badge': 'IMPORTANT',
      'no_schedules_available': 'No schedules available',
      'check_back_later_timings': 'Check back later for temple timings',
      'gayatri_mandir_title': 'Gayatri Mandir',
      'daily_schedule': 'Daily Schedule',
      'daily': 'Daily',
      'items': 'items',
      'start_time': 'Start Time',
      'end_time': 'End Time',
      'repeats_daily': 'Repeats daily',
      'havan': 'Havan',
      // Family Connections
      'family_connections': 'Family Connections',
      'family_connections_subtitle': 'Link with family to support their practice',
      'no_attendance_records': 'No attendance records yet',
      'app_preferences': 'App Preferences',
      'reset_tutorial': 'Reset User Tutorial',
      'reset_tutorial_subtitle': 'Go through the app tour again',
      'linked_storage_folder': 'Linked Storage Folder',
      'no_folder_linked': 'No folder linked',
      'change': 'Change',
      'filter_options': 'Filter Options',
      'search_by_name': 'Search by name...',
      'no_users_found': 'No users found',
      'send_family_link_request': 'Send Family Link Request',
      'manage_family_links': 'Manage Family Links',
      'my_connections': 'My Connections',
      'pending_requests': 'Pending Requests',
      'no_family_connections': 'No family connections yet',
      'no_pending_family_requests': 'No family link requests',
      'family_requests_appear_here': 'Family link requests will appear here',
      'send_link_request': 'Send Link Request',
      'email_username': 'Email / Username',
      'enter_email_or_username': 'Enter email or @username',
      'email_or_username_required': 'Email or username is required',
      'user_not_found': 'User not found',
      'searching': 'Searching...',
      'you_will_be_supporter_of': 'You will be the supporter of',
      'relationship_type': 'Relationship Type',
      'parent_to_child': 'Parent → Child',
      'parent_child_desc': 'You are a parent or guardian supporting a child\'s practice and homework.',
      'caregiver_to_elder': 'Caregiver → Elder',
      'caregiver_elder_desc': 'You are helping an elder family member with guidance and support.',
      'supporter_helper_text': 'You will be the supporter. The selected user will be the one you support.',
      'message_optional': 'Message (Optional)',
      'add_personal_message': 'Add a personal message...',
      'send_request': 'Send Request',
      'sending': 'Sending...',
      'link_request_sent': 'Link request sent successfully!',
      'family_link_accepted': 'Family link accepted!',
      'request_declined': 'Request declined',
      'unlink': 'Unlink',
      'unlink_confirm': 'Are you sure you want to unlink this connection?',
      'family_linking': 'Family',
      'parent_child_link_request': 'Parent-Child Link Request',
      'elder_caregiver_link_request': 'Elder-Caregiver Link Request',
      'from': 'From',
      'requested': 'Requested',
      'about_family_connections': 'About Family Connections',
      'family_connections_desc': 'You can link with a family member to view their spiritual practice and homework progress in a supportive, guidance-oriented way.',
      'view_practice': 'View Progress',
      'child_dashboard': 'Child Dashboard',
      'view_alerts': 'View Alerts',
      'emergency_alerts': 'Emergency Alerts',
      'no_emergency_alerts': 'No Emergency Alerts',
      'resolved_on': 'Resolved on',
      'no_resolved_requests': 'No resolved requests',
      
      // Audit Fixes 2.5 - Missing English Keys
      'malas_format': '{count} Malas',
      'unlink_confirm_title': 'Unlink Connection?',
      'unlink_confirm_body': 'Are you sure you want to unlink this connection? This action cannot be undone.',
      'relation_type_parent': 'Parent',
      'relation_type_child': 'Child',
      'relation_type_spouse': 'Spouse',
      'relation_type_sibling': 'Sibling',
      'relation_type_other': 'Other',
      'duration_days': '{days} Days',
      'days_left': '{count} days left',
      'mantras_per_day': '{count} mantras/day',
      'malas_daily_format': '{count} malas daily',
      'certificate_saved_to': 'Certificate saved to {path}',
      'enter_description': 'Enter service description',
      'select_date': 'Select Date',
      'flat_floor_hint': 'e.g. 201, 2nd Floor',
      'building_hint': 'e.g., Gayatri Apt',
      'street_hint': 'e.g., MG Road',
      'landmark_hint': 'e.g., Near City Hospital',
      'search_by_description_address': 'Search by description or address...',
      'status_accepted': 'Accepted',
      'status_unavailable': 'Unavailable',
      'status_completed': 'Completed',
      'news_and_updates': 'News & Updates',
      'news_category_all': 'All',
      'news_category_spiritual': 'Spiritual',
      'news_category_events': 'Events',
      'news_category_seva': 'Seva',
      'news_category_youth': 'Youth',
      'news_category_notices': 'Notices',
      'news_category_magazine': 'Magazine',
      'house_no_hint': 'House No',
      'contact_number': 'Contact Number',
      'alternate_contact_hint': 'Alternate Contact (Optional)',
      'landmark': 'Landmark',
      'news_updates': 'News & Updates',
      'youth': 'Youth',
      'search_description_address': 'Search by description or address',
      'menu_calendar': 'Calendar',
      'menu_branches': 'Branches',
      'menu_gurujis': 'Gurujis',
      'menu_news': 'News',
      'menu_attendance': 'Attendance',
      'menu_services': 'Services',
      'menu_spiritual': 'Spiritual',
      'menu_requests': 'Requests',
      'menu_seva_ops': 'Seva Ops',
      'menu_media': 'Media',
      'menu_important_info': 'Important Info',
      'menu_public_groups': 'Public Groups',
      'select_day_schedule': 'Select a day to view schedule',
      'dashboard_stat_total': 'Total',
      'dashboard_stat_upcoming': 'Upcoming',
      'dashboard_stat_completed': 'Completed',
      'no_seva_assignments': 'No Seva Assignments',
      'no_assigned_requests': 'No Assigned Requests',
      
      // Marker Descriptions
      'marker_first_steps_title': 'First Steps',
      'marker_first_steps_desc': 'Complete your first mala (108 mantras)',
      'marker_consistent_yogi_title': 'Consistent Yogi',
      'marker_consistent_yogi_desc': 'Complete sadhana for 3 consecutive days',
      'marker_dedicated_disciple_title': 'Dedicated Disciple',
      'marker_dedicated_disciple_desc': 'Maintain a 7-day streak',
      'marker_century_club_title': 'Century Club',
      'marker_century_club_desc': 'Complete 100 malas total',
      'marker_mantra_master_title': 'Mantra Master',
      'marker_mantra_master_desc': 'Chant 1,000 mantras total',
      'marker_anushthan_adept_title': 'Anushthan Adept',
      'marker_anushthan_adept_desc': 'Complete your first Anushthan',
      'marker_early_riser_title': 'Early Riser',
      'marker_early_riser_desc': 'Complete a mala before 6 AM',
      'marker_digital_monk_title': 'Digital Monk',
      'marker_digital_monk_desc': 'Use the Sadhana Tracker for 30 days',
      'marker_first_seva_title': 'First Seva',
      'marker_first_seva_desc': 'Complete your first Seva activity',
      'requested_on': 'Requested on',
      'connected_since': 'Connected since',
      'confirm_unlink_title': 'Unlink Family Connection?',
      'confirm_unlink_message': 'This will remove the family connection and stop sharing practice information. This action cannot be undone.',
      'family_link_request': 'Family Link Request',
      'practice_and_homework': 'Practice & Homework',
      'support_learning': 'Support Learning',
      'no_practice_data': 'No practice data yet',
      'not_tracking_practice': 'hasn\'t started tracking practice',
      'practice_summary': 'Practice Summary',
      'malas_done': 'Malas Done',
      'duration': 'Duration',
      'bss_attendance': 'BSS Attendance',
      'deadline': 'Deadline',
      'attachment': 'Attachment',
      'submission': 'Submission',
      'late': 'LATE',
      'on_time': 'ON TIME',
      'submitted_on': 'Submitted',
      'view_submitted_work': 'View Submitted Work (PDF)',
      'homework_accepted': 'Homework Accepted',
      'needs_revision': 'Needs Revision',
      'remark_by': 'By',
      'status_pending': 'Pending',
      'status_submitted': 'Submitted',
      'status_checked': 'Checked',
      'minutes_short': 'min',
      'hours_short': 'h',
      'request_accepted': 'Request accepted!',
      // Emergency Help
      'emergency_help': 'Emergency Help',
      'emergency_help_subtitle': 'Get help when you need it',
      'need_help_btn': 'NEED HELP',
      'alert_family_admin': 'Alert Family & Admins',
      'wait_message': 'Please wait 15 minutes between help requests',
      'or_call_directly': 'OR CALL DIRECTLY',
      'help_requested_note': 'Help requested via app',
      'alert_sent_success': '✅ Alert sent! Help is on the way.',
      'emergency_error': 'Error',
      'emergency_sos_alert': 'Emergency SOS Alert',
      // Public Groups
      'browse_groups': 'Browse Public Groups',
      'no_public_groups': 'No public groups available',
      'no_results': 'No results found',
      'public_group': 'Public Group',
      'request_to_join': 'Request to Join',
      'join_request_sent': 'Join request sent',
      // Spiritual Feature
      'sadhana_tracker': 'Sadhana Tracker',
      'mantra': 'Mantra',
      'daily_target': 'Daily Target',
      'malas': 'Malas',
      'completion': 'Completion',
      'quotes': 'Spiritual Quotes',
      'achievements': 'Achievements',
      'lifetime_progress': 'Lifetime Progress',
      'calendar_heatmap': 'Last 30 Days',
      'personal_records': 'Personal Records',
      'best_day': 'Best Day',
      'best_streak': 'Best Streak',
      'locked': 'Locked',
      'unlocked': 'Unlocked',
      'reminder_settings': 'Reminder Settings',
      'daily_reminder': 'Daily Reminder',
      'set_reminder_time': 'Set Reminder Time',
      'reset_count': 'Reset Count',
      'reset_count_confirm': 'Are you sure you want to reset today\'s count?',
      'total_malas': 'Total Malas',
      'active_days': 'Active Days',
      'this_week': 'This Week',
      'this_month': 'This Month',
      'mantra_distribution': 'Mantra Distribution',
      'start_sadhana_analytics': 'Start your sadhana to see analytics!',
      'please_login_analytics': 'Please login to view analytics',
      'select_mantra': 'Select Mantra',
      'tap_count': 'Tap or hold circle to count',
      'counting': 'Counting...',
      'target': 'Target',
      'total_count': 'Total Count',
      'daily_progress': 'Daily Progress',
      'target_met': 'Target Met!',
      'add_full_mala': 'Add Full Mala (+108)',
      'complete_mala_btn': 'Complete Mala',
      'complete_mala_title': 'Complete Mala?',
      'confirm_complete_mala': 'You are about to complete this mala.',
      'mala_completed_title': 'Mala Completed!',
      'unlocked_prefix': 'Unlocked:',
      // Sadhana Settings
      'haptic_feedback': 'Haptic Feedback',
      'vibration_on_tap': 'Vibration on tap',
      'clear_progress': 'Clear all progress for today',
      'daily_nudge': 'Get a daily nudge for sadhana',
      'reminder_time_label': 'Reminder Time',
      'select_daily_target': 'Select Daily Target',
      'vibration_on': 'Vibration On',
      'vibration_off': 'Vibration Off',
      'analytics': 'Analytics',
      // Achievements Data
      'achv_first_mala_title': 'Om Shanti',
      'achv_first_mala_desc': 'Complete your first mala of 108 mantras.',
      'achv_streak_7_title': 'Sadhak',
      'achv_streak_7_desc': 'Maintain a sadhana streak for 7 consecutive days.',
      'achv_streak_30_title': 'Yogi',
      'achv_streak_30_desc': 'Maintain a sadhana streak for 30 consecutive days.',
      'achv_malas_108_title': 'Devotee',
      'achv_malas_108_desc': 'Complete 108 total malas.',
      'achv_malas_1008_title': 'Mantra Master',
      'achv_malas_1008_desc': 'Complete 1008 total malas. A true accomplishment.',
      // Groups Feature Extended
      'create_new_group': 'Create New Group',
      'group_type_label': 'Group Type',
      'event_group': 'Event',
      'bss_group_title': 'BSS',
      'meeting_group': 'Meeting',
      'custom_group': 'Custom',
      'only_admin_create_bss': 'Only Admin and Guruji can create BSS groups',
      'select_branch_error': 'Please select a branch',
      'select_guruji_error': 'Please select a Guruji',
      'enable_attendance': 'Enable Attendance Tracking',
      'allow_marking_attendance': 'Allow marking attendance for this meeting',
      'public_group_label': 'Public Group',
      'private_group_label': 'Private Group',
      'public_group_desc': 'Anyone can discover and request to join this group',
      'private_group_desc': 'Only invited members can see and join this group',
      'public_group_approval_note': 'Public groups require admin approval before they become visible to everyone.',
      'group_created_approval': 'Group created! Awaiting admin approval to be made public.',
      'group_created_success': 'Group created successfully!',
      'edit_group_title': 'Edit Group',
      'delete_group_title': 'Delete Group?',
      'delete_group_confirm': 'Are you sure you want to delete "{groupName}"? This action cannot be undone.', 
      'group_name_empty_error': 'Group name cannot be empty',
      'group_updated_success': 'Group updated successfully',
      'group_deleted_success': 'Group deleted successfully',
      'join_request_success_waiting': 'Join request sent! Waiting for admin approval.',
      'check_back_later_groups': 'Check back later for new groups to join',
      'try_different_search': 'Try a different search term',
      'no_public_groups_avail': 'No public groups available',
      'search_groups_hint': 'Search groups...',
      // Browse Groups Extended
      'available_to_join': 'Available to Join',
      'your_public_groups': 'Your Public Groups',
      'no_public_groups_joined': 'No public groups joined',
      'groups_you_join_appear_here': 'Groups you join will appear here',
      'no_groups_created': 'No groups created',
      'public_groups_you_create_appear_here': 'Public groups you create will appear here',
      'no_groups_with_status': 'No groups with this status',
      'your_group_requests': 'Your Group Requests',
      'all_groups_joined_or_none': 'All public groups have been joined or none available',
      'explore': 'Explore',
      'public_groups_title': 'Public Groups',
      'daily_inspiration': 'Daily Inspiration',
      'spiritual_practice': 'Spiritual Practice',
      'sadhana': 'Sadhana',
      'swadhyay': 'Swadhyay',
      'mantra_japa': 'Mantra Japa',
      'digital_library': 'Digital Library',
      'daily_thoughts': 'Daily Thoughts',
      // Important Info
      'search_locations_hint': 'Search locations...',
      'search_contacts_hint': 'Search contacts...',
      'open_google_maps': 'Open in Google Maps',
      'all_tags': 'All Tags',
      'all_roles': 'All Roles',
      'no_locations_found': 'No locations found',
      'no_contacts_found': 'No contacts found',
      'call_action': 'Call',
      'save_contact_share': 'Save contact: ',
      // Sadhana Settings
      'mala_quarter': '¼ Mala',
      'mala_half': '½ Mala',
      'mala_1': '1 Mala',
      'desc_beginners': 'Beginners / Busy days',
      'add_mantra_title': 'Add New Mantra',
      'mantra_name_label': 'Mantra Name',
      'mantra_desc_label': 'Description / Meaning',
      'mantra_desc_hint': 'Enter mantra text or meaning...',
      'enter_mantra_name_error': 'Please enter mantra name',
      'add_btn': 'Add',
      'cancel_btn': 'Cancel',
      'desc_morning_evening': 'Morning/Evening',
      'desc_standard': 'Standard daily',
      'desc_regular': 'Regular sādhaks',
      'desc_intermediate': 'Intermediate',
      'desc_advanced': 'Advanced',
      'desc_intensive': 'Intensive',
      'desc_anushthana': 'Anushthāna level',
      'desc_deep_practice': 'Deep practice',
      'desc_traditional': 'Traditional goal',
      // Quotes
      'quote_1': 'We become what we think.',
      'quote_2': 'The mind is everything. What you think you become.',
      'quote_3': 'Change your thoughts and you change your world.',
      'quote_4': 'Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.',
      'quote_5': 'Peace comes from within. Do not seek it without.',
      'quote_6': 'The soul is dyed the color of its thoughts.',
      'quote_7': 'You are the master of your destiny.',
      'quote_8': 'Be the change that you wish to see in the world.',
      'quote_9': 'Happiness depends on what you can give, not on what you can get.',
      'quote_10': 'Love is the only reality.',
      // Seva Appreciation (Tickets 5-6)
      'complete_with_gratitude': 'Complete with Gratitude',
      'share_your_gratitude': 'Share your gratitude',
      'select_badge_type': 'Select Badge Type',
      'dedicated_seva': 'Dedicated Seva',
      'time_seva': 'Time Seva',
      'team_seva': 'Team Seva',
      'impactful_seva': 'Impactful Seva',
      'seva_contributions': 'Seva Contributions',
      'appreciations_received': 'appreciations received',
      'no_appreciations_yet': 'Your seva contributions will be recognized here',
      'appreciation_sent': 'Gratitude sent to',
      'character_count': 'characters',
      'please_share_gratitude': 'Please share your gratitude',
      'write_at_least_50_chars': 'Please write at least 50 characters to make it personal',
      'keep_under_200_chars': 'Please keep your message under 200 characters',
      'please_select_badge': 'Please select a badge type',
      'already_appreciated': 'This volunteer has already been appreciated for this seva.',
      'gratitude_for_seva': 'Gratitude for Your Seva',
      'seva_appreciated_msg': 'Your seva "{title}" has been appreciated with gratitude.',
      'seva_contributions_recognized': 'Your seva has been appreciated',
      'sending_gratitude': 'Sending...',
      'send_gratitude': 'Send Gratitude',
      // Admin Emergency Requests
      'no_active_emergency_requests': 'No active emergency requests',

      'min_chars_10': 'Min 10 chars required',
      'min_chars_20': 'Min 20 chars required',
      'sos_created': 'SOS Created',
      'call_logged': 'Call Logged',
      'urgent': 'URGENT',
      'request_acknowledged': 'Request Acknowledged',
      'request_resolved': 'Request Resolved',
      'no_phone_available': 'No phone number available',
      'could_not_launch_dialer': 'Could not launch dialer',
      'no_phone_linked': 'No phone number linked to account',
      'loading_contact_info': 'Loading contact info...',
      'acknowledge': 'Acknowledge',
      'resolve': 'Resolve',
      'call': 'Call',
      // Admin Emergency Contacts
      'no_sos_contacts_yet': 'No SOS contacts yet',
      'tap_to_add_one': 'Tap + to add one',
      'delete_contact': 'Delete Contact',
      'delete_contact_confirm': 'Are you sure you want to delete this contact?',
      'select_role': 'Select a role',
      // Family Linking
      'family_link_requests_empty': 'Family link requests will appear here',
      'family_connection_removed': 'Family connection removed',
      'search_by_email_or_username': 'Search by email or @username',
      'searching_for_user': 'Searching...',
      'already_linked': 'You are already linked with this user',
      'pending_request_exists': 'A pending request already exists',
      'cannot_link_to_self': 'You cannot link to yourself',
      'request_sent_success': 'Request sent successfully!',
      'accept_request': 'Accept',
      'decline_request': 'Decline',
      'sent_requests': 'Sent Requests',
      'received_requests': 'Received Requests',
      'unlink_family': 'Unlink',
      // Anushthan & Gamification
      'active_anushthan': 'Active Anushthan',
      'anushthan_history': 'Anushthan History',
      'start_date': 'Start Date',
      'end_date': 'End Date',
      'expected_end_date': 'End Date',
      'malas_completed': 'Malas Completed',
      'daily_target_malas': 'Daily Target',
      'no_completed_anushthans': 'No completed Anushthans yet',
      'start_first_anushthan': 'Start your first Anushthan to begin your spiritual journey!',
      'total_days': 'Total Days',
      'log_todays_practice': 'Log Today\'s Practice',
      'view_certificate': 'View Certificate',
      'sadhana_record': 'Sadhana Record',
      'anushthan_completion': 'Anushthan Completion',
      'pause_anushthan': 'Pause Anushthan',
      'resume_anushthan': 'Resume Anushthan',
      'guruji_visibility': 'Guruji Visibility',
      'anushthan': 'Anushthan',
      'committed_practice_desc': 'Committed spiritual practice',
      'active_anushthan_warning': 'You already have an active Anushthan. Complete or pause it first.',
      'choose_mantra_hint': 'Choose a mantra',
      'days_suffix': 'days',
      'begin_anushthan': 'Begin Anushthan',
      'anushthan_started_success': '🙏 Anushthan started! May your practice be blessed.',
      'duration_short': 'Short',
      'day_x_of_y': 'Day {day} of {total}',
      'duration_medium': 'Medium',
      'duration_long': 'Long',
      'duration_extended': 'Extended',
      'share_blessings': 'Share Blessings',
      'save_certificate': 'Save Certificate',
      'certificate_blessing': '🙏 May your devotion bring you peace and blessings 🙏',
      'error_sharing_pdf': 'Error sharing PDF',
      'error_saving_pdf': 'Error saving PDF',
      
      // Anushthan Status & UI
      'active_status': 'ACTIVE',
      'resting_status': 'RESTING',
      'completed_status': 'COMPLETE',
      'paused_status': 'PAUSED',
      'day_label': 'Day',
      'malas_label': 'Malas',
      'remaining_label': 'Remaining',
      'todays_practice_pending': "Today's practice pending",
      'todays_practice_complete': "Today's practice complete ✓",
      'anushthan_in_progress': 'Anushthan in Progress',
      'total_malas_today': 'Total: {count} malas today',
      'x_of_y_malas': '{x} of {y} malas',
      
      // Service Request Fields
      // My Requests
      // Service Status Labels
      // News Categories
      'my_spiritual_journey': 'My Spiritual Journey',
      'milestones': 'Milestones',
      // Parent Monitoring Tabbed View
      'no_homework_yet': 'No Homework Yet',
      'no_submitted_homework': 'has not submitted any homework yet',
      'no_attendance_data': 'has no attendance data yet',
      'tap_members_view_details': 'Tap members to view details',
      'no_groups_joined_guidance': "You haven't joined any groups yet",
      'join_group_guidance': 'Join a group to see guidance',
      'batch': 'Batch',
      'request_sent_label': 'Request Sent',
      'request_received_label': 'Request Received',
      'already_connected_msg': 'You are already connected with this user.',
      'request_pending_msg': 'A request is already pending between you and this user.',
      
      // Group Homework
      'view_submissions': 'View Submissions',
      'assign_homework': 'Assign Homework',
      'edit_homework': 'Edit Homework',
      'update_homework': 'Update Homework',
      'delete_homework_title': 'Delete Homework',
      'delete_homework_confirm': 'Are you sure you want to delete this homework? This cannot be undone.',
      'due_date_label': 'Due',
      'assigned_by_label': 'By: {name}',
      'overdue': 'Overdue',
      'no_homework_assigned': 'No homework assigned yet',
      'homework_title': 'Homework Title',
      'description_required': 'Description is required',
      'attachments_optional': 'Attachments (Optional)',
      'no_attachments': 'No attachments',
      'attachment_count': '{count} file(s)',
      'submissions_title': 'Submissions',
      'no_submissions_yet': 'No submissions yet',
      'your_submitted_pdf': 'Your Submitted PDF',
      'view_submission_pdf': 'View Submission PDF',
      'update_status_review': 'Update Status / Review',
      'redo_needed': 'Redo Needed',
      'mark_checked': 'Mark Checked',
      'request_redo': 'Request Redo',
      'comment_optional': 'Comment (Optional)',
      'add_feedback_hint': 'Add feedback for the student...',
      'submissions_closed_msg': 'Submissions are closed for this homework.',
      'homework_assigned_success': 'Homework assigned successfully!',
      'homework_updated_success': 'Homework updated successfully!',
      'homework_submitted_success': 'Homework submitted successfully!',
      'stop_receiving_submissions': 'Stop Receiving Submissions',
      'stop_submissions_subtitle': 'Manually close submissions even if due date is in future',
      'upload_submission': 'Upload Submission',
      'submit_homework': 'Submit Homework',
      'resubmit_homework': 'Resubmit Homework',
      'upload_pdf_helper': 'Upload a single PDF file of your work',
      'select_pdf_file': 'Select PDF File',
      'submission_status_submitted': 'Submitted',
      'submission_status_redo': 'Redo',
      'submission_status_checked': 'Checked',
      'submission_status_not_done': 'Not Done',
      'attachment_label': 'Attachment',

      // Anushthan & Gamification
      // Additional Service Request Keys
      // Admin & Guruji Dashboard
      'admin_dashboard_title': 'Admin Dashboard',
      'access_denied_admin': 'Access Denied. Admins only.',
      'quick_actions': 'Quick Actions',
      'available_requests_title': 'Available Requests',
      'yajman_label': 'Yajman',
      'contact_label': 'Contact',
      'not_possible_btn': 'Not Possible',
      // Home Screen & Festival
      'today_celebrations_title': "Today's Celebrations 🎉",
      'celebration_single_msg': "It's {name}'s special day! Send your blessings.",
      'celebration_multiple_msg': "There are {count} celebrations today! Send your blessings.",
      'festival_default_desc': "Special festival today!",
      'primary_festival_badge': "PRIMARY FESTIVAL",
      'swipe_to_dismiss': "Swipe to dismiss →",

      // Missing Keys (Restored)
      'call_required': 'Call Required',
      'guruji_cannot_arrange': 'Guruji cannot arrange',
      'not_possible_reason': 'Reason not possible',
      'username_helper_text': 'Username can contain a-z, 0-9, and underscores',
      'username_min_length': 'Username must be at least 3 characters',
      'username_max_length': 'Username must be at most 20 characters',
      'username_cooldown_msg': 'Please wait before changing username again',
      'username_locked_msg': 'Username is locked',
      'days': 'Days',
      'resend_otp_timer': 'Resend OTP in {timer}',
      'didnt_receive_code': "Didn't receive code?",
      'check_back_later_requests': 'Check back later for requests',

      // Tutorial/Onboarding - Home Screen Features
      'tutorial_emergency_sos_title': 'Emergency Help',
      'tutorial_emergency_sos_desc': 'Get help when you need it with our SOS feature',
      'tutorial_mandir_schedule_title': 'Mandir Schedule',
      'tutorial_mandir_schedule_desc': 'View daily aarti and havan timings at your local Mandir',
      'tutorial_upcoming_events_title': 'Upcoming Events',
      'tutorial_upcoming_events_desc': 'Stay updated with upcoming satsangs, yagyas, and community events',
      'tutorial_latest_news_title': 'Latest News',
      'tutorial_latest_news_desc': 'Read the latest news and updates from Gayatri Pariwar',
      'tutorial_guruji_sos_title': 'Guruji SOS',
      'tutorial_guruji_sos_desc': 'Get help from Guruji for emergency requests',
      
      // Group Details (Added)
      'about_label': 'About',
      'chat_label': 'Chat',
      'camera_label': 'Camera',
      'video_label': 'Video',
      'audio_label': 'Audio',
      'document_label': 'Document',
      'homework_label': 'Homework',
      'search_messages': 'Search messages...',
      'filter_by_date': 'Filter by Date',
      'from_label': 'From',
      'to_label': 'To',
      'not_set': 'Not set',
      'clear': 'Clear',
      'message_deleted': 'This message was deleted',
      'message_deleted_admin': 'This message was deleted by Admin',
      'message_deleted_guruji': 'This message was deleted by Guruji',
      'practice_calendar': 'Practice Calendar',
      'allow_guruji_view': 'Allow Guruji to view',
      'guruji_view_desc': 'Your Guruji can see your progress',
      'cert_title': 'CERTIFICATE OF\nANUSHTAN COMPLETION',
      'cert_subtitle': 'This is to certify that',
      'cert_body': 'has successfully completed the',
      'cert_blessing': '“May your sincere sadhana illuminate your intellect,\npurify your thoughts, and guide you toward righteous living.”',
      'issue_date': 'Issue Date',
      'cert_id': 'Certificate ID',
      'digitally_issued_by': 'Digitally Issued by',
      'cert_disclaimer': 'This is a digitally generated certificate and\ndoes not require a physical signature.',
      'apply': 'Apply',
      'no_results_found': 'No results found',
      'leave_group_title': 'Leave Group?',
      'request_leave_title': 'Request to Leave?',
      'leave_group_confirm_msg': 'Are you sure you want to leave "{name}"?',
      'request_leave_msg': 'Your leave request will be sent to the Guruji/Admin for approval.',
      'only_guruji_leave_error': 'You are the only Guruji. Add another Guruji before leaving.',
      'leave_request_sent': 'Leave request sent. Awaiting approval.',
      'left_group_success': 'You have left the group',
      'pending_approval_title': 'Awaiting Admin Approval',
      'pending_approval_msg': 'Chat, events, and member management will be available after approval.',
      'pending_join_requests': 'Pending Join Requests ({count})',
    },

    'hi': {
      'feed': 'फ़ीड',
      'posts': 'पोस्ट',
      'feed_description': 'यह आपका फ़ीड है। नवीनतम पोस्ट और सामुदायिक समाचारों के साथ अपडेट रहें।',
      'view_comments': 'टिप्पणियाँ देखें',
      'delete_post': 'पोस्ट हटाएँ',
      'delete_post_confirm': 'क्या आप वाकई इस पोस्ट को हटाना चाहते हैं?',
      'pin_post': 'पिन करें',
      'unpin_post': 'अनपिन करें',
      'max_pin_warning': '⚠️ अधिकतम 3 पोस्ट पिन किए जा सकते हैं।',
      'downloading_photo': 'तस्वीर डाउनलोड हो रही है...',
      'photo_saved': '✅ तस्वीर गैलरी में सेव हो गई!',
      'download_failed': '❌ डाउनलोड विफल: {error}',
      'post_deleted': '✅ पोस्ट सफलतापूर्वक हटाई गई',
      'delete_post_failed': '❌ पोस्ट हटाने में विफल',
      'comments': 'टिप्पणियाँ',
      'no_comments_yet': 'अभी कोई टिप्पणी नहीं',
      'be_first_comment': 'पहली टिप्पणी करें!',
      'add_comment': 'टिप्पणी लिखें...',
      'create_post': 'पोस्ट बनाएँ',
      'post_btn': 'पोस्ट करें',
      'photos': 'तस्वीरें',
      'caption': 'कैप्शन',
      'write_caption': 'कैप्शन लिखें...',
      'tags': 'टैग्स',
      'add_tag': 'टैग जोड़ें (उदा. event, news)',
      'post_date_time': 'पोस्ट दिनांक और समय (वैकल्पिक)',
      'current_time_default': 'सेट न होने पर वर्तमान समय का उपयोग किया जाएगा',
      'uploading_progress': 'अपलोड हो रहा है... {percent}%',
      'please_wait': 'कृपया प्रतीक्षा करें...',
      'preparing_upload': 'अपलोड करने की तैयारी',
      'today_random_role': 'आज की यादृच्छिक भूमिका',
      'pick_random_student': 'छात्र का चयन करें',
      'attendance_missing_msg': 'चयन से पहले आज की उपस्थिति (IST) दर्ज की जानी चाहिए।',
      'zero_students_present': 'आज कोई भी छात्र उपस्थित नहीं है।',
      'present_students_count': 'आज {count} छात्र उपस्थित हैं। किसी एक को यादृच्छिक रूप से चुनें।',
      'selected_role': 'भूमिका: {role}',
      'fairness_fallback_tooltip': 'पूर्ण समूह से चुना गया (फेयरनेस फ़ालबैक)',
      'processing': 'प्रक्रिया जारी है...',

      // Seva Management
      'manage_seva_opportunities': 'सेवा अवसरों का प्रबंधन करें',
      // General Actions
      'edit': 'संपादित करें',
      'rename': 'नाम बदलें',
      'download': 'डाउनलोड करें',
      'share': 'साझा करें',
      'view': 'देखें',
      'file': 'फ़ाइल',
      'files': '{count} फ़ाइलें',
      'delete_file_title': 'फ़ाइल हटाएं?',
      'delete_file_confirm': 'क्या आप वाकई "{name}" को हटाना चाहते हैं?',
      'rename_file': 'फ़ाइल का नाम बदलें',
      'new_name': 'नया नाम',
      'file_renamed': 'फ़ाइल का नाम बदला गया',
      'file_uploaded': 'फ़ाइल सफलतापूर्वक अपलोड की गई',
      'cannot_open_file_type': 'इस फ़ाइल प्रकार को खोला नहीं जा सकता',
      'downloading': 'डाउनलोड हो रहा है...',
      'download_failed': 'डाउनलोड विफल: {error}',
      'rename_failed': 'नाम बदलना विफल: {error}',
      'preparing_share': 'साझा करने के लिए फ़ाइल तैयार की जा रही है...',
      'shared_from_app': 'गायत्री परिवार कनेक्ट से साझा किया गया',

      // Notification Descriptions
      'news_notifications_desc': 'नवीनतम समाचारों के बारे में सूचित हों',
      'event_notifications_desc': 'आगामी कार्यक्रमों के लिए अनुस्मारक',
      'group_notifications_desc': 'समूह आमंत्रण की सूचनाएं',
      'announcement_notifications_desc': 'महत्वपूर्ण घोषणाएं',
      'satsang_notifications_desc': 'प्रातःकालीन आध्यात्मिक संदेश',

      // Public Group Creation
      'reason_for_creating_group': 'इस समूह को बनाने का कारण',
      'reason_for_creating_group_hint': 'इस समूह का उद्देश्य या इरादा बताएं...',
      'reason_for_creating_group_helper': 'इससे एडमिन को समझने में मदद मिलती है कि इस समूह को क्यों स्वीकृत किया जाना चाहिए',
      'reason_min_length_error': 'कृपया कारण दें (कम से कम 10 अक्षर)',
      'n_files': '{count} फ़ाइलें',
      'no_branches_available': 'कोई शाखा उपलब्ध नहीं है। कृपया पहले एक शाखा जोड़ें।',
      'no_gurujis_available': 'कोई गुरुजी उपलब्ध नहीं हैं। कृपया पहले एक गुरुजी जोड़ें।',
      'no_media_folders': 'अभी तक कोई मीडिया फोल्डर नहीं है',
      'no_media_available_desc': 'फिलहाल कोई मीडिया उपलब्ध नहीं है',

      // Service Types
      'no_service_types': 'अभी तक कोई सेवा प्रकार नहीं',
      'add_service_types_prompt': 'उपयोगकर्ताओं द्वारा अनुरोध करने के लिए सेवा प्रकार जोड़ें',
      'add_service_type': 'सेवा प्रकार जोड़ें',
      'edit_service_type': 'सेवा प्रकार संपादित करें',
      'service_type_added': 'सेवा प्रकार जोड़ा गया',
      'service_type_updated': 'सेवा प्रकार अपडेट किया गया',
      'requirements_samagri': 'आवश्यकताएं (सामग्री)',
      'no_requirements_added': 'अभी तक कोई आवश्यकता नहीं जोड़ी गई।',
      'add_requirement': 'आवश्यकता जोड़ें',
      'item_name': 'वस्तु का नाम',
      'item_name_hint': 'जैसे चावल, घी',
      'quantity': 'मात्रा',
      'quantity_hint': 'जैसे 1',
      'unit': 'इकाई',
      'unit_hint': 'जैसे- किलो, नग, लीटर',
      'optional_good_to_have': 'वैकल्पिक / होना अच्छा है',
      'users_can_see_service': 'उपयोगकर्ता इस सेवा को देख सकते हैं',
      'hidden_from_users': 'उपयोगकर्ताओं से छिपा हुआ',
      'restore_availability': 'उपलब्धता बहाल करें',
      'available': 'उपलब्ध',
      'unavailable': 'अनुपलब्ध',

      // Storage Manager
      'storage_manager': 'स्टोरेज मैनेजर',
      'folder': 'फ़ोल्डर',
      'no_folders_yet': 'अभी तक कोई फ़ोल्डर नहीं',
      'this_folder_is_empty': 'यह फ़ोल्डर खाली है',
      'create_folder': 'फ़ोल्डर बनाएँ',
      'folder_name': 'फ़ोल्डर का नाम',
      'description_optional': 'विवरण (वैकल्पिक)',
      'folder_description': 'फ़ोल्डर विवरण',
      'add_description': 'विवरण जोड़ें',
      'edit_folder': 'फ़ोल्डर संपादित करें',
      'delete_folder_title': 'फ़ोल्डर हटाएं?',
      'delete_folder_confirm': 'क्या आप वाकई इस फ़ोल्डर और इसकी सभी सामग्री को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।',
      'create': 'बनाएँ',
      'save': 'सहेजें',
      'upload_success': 'फ़ाइल सफलतापूर्वक अपलोड की गई',

      // Seva Management
      'error_loading_sevas': 'सेवाएँ लोड करने में त्रुटि',
      'delete_location': 'स्थान हटाएँ',

      // Public Groups
      'public_groups': 'सार्वजनिक समूह',
      'user_requested_items': 'उपयोगकर्ता द्वारा अनुरोधित वस्तुएं:',
      'no_pending_requests': 'कोई लंबित अनुरोध नहीं',
      'all_public_group_requests_reviewed': 'सभी सार्वजनिक समूह अनुरोधों की समीक्षा कर ली गई है',
      'created_by': 'द्वारा निर्मित',
      'unknown_user': 'अज्ञात उपयोगकर्ता',
      'reason_for_creating': 'बनाने का कारण',
      'reject': 'अस्वीकार करें',
      'approve': 'स्वीकार करें',
      'reject_public_group_title': 'सार्वजनिक समूह अस्वीकार करें?',
      'reject_public_group_content': '"{name}" को अस्वीकार करने से यह अस्वीकृत के रूप में चिह्नित हो जाएगा और निर्माता कारण देखेगा।',
      'rejection_reason': 'अस्वीकृति का कारण',
      'rejection_reason_hint': 'जैसे, दिशानिर्देशों को पूरा नहीं करता',
      'enter_rejection_reason': 'कृपया अस्वीकृति का कारण दर्ज करें',
      'approved_as_public_group': '"{name}" को सार्वजनिक समूह के रूप में स्वीकृत किया गया',
      'has_been_rejected': '"{name}" को अस्वीकार कर दिया गया है',
      'error_approving': '"{name}" को स्वीकृत करने में त्रुटि: {error}',
      'error_rejecting': '"{name}" को अस्वीकार करने में त्रुटि: {error}',
      'pending_approval': 'अनुमोदन लंबित',
      'migrate_legacy_data': 'विरासत डेटा माइग्रेट करें (एक बार)',
      'create_seva': 'नई सेवा बनाएँ',
      'new_seva': 'नई सेवा',
      'edit_seva': 'सेवा अपडेट करें',
      'search_seva_placeholder': 'सेवा का नाम खोजें...',
      'no_seva_opportunities': 'अभी तक कोई सेवा अवसर नहीं है',
      'seva_created_success': 'सेवा सफलतापूर्वक बनाई गई',
      'seva_updated_success': 'सेवा सफलतापूर्वक अपडेट की गई',
      'assign_selected': 'चयनित असाइन करें',
      'internal_notes_optional': 'आंतरिक नोट (वैकल्पिक)',
      'internal_notes_hint': 'इन असाइनमेंट के लिए नोट...',
      'delete_seva': 'सेवा हटाएँ',
      'delete_seva_confirm': 'क्या आप वाकई "{title}" को हटाना चाहते हैं?',
      'cannot_undo': 'यह क्रिया पूर्ववत नहीं की जा सकती।',
      'no_gurujis_match': 'कोई मेल खाता गुरुजी नहीं मिला',
      'male_needed': 'पुरुष की आवश्यकता',
      'female_needed': 'महिला की आवश्यकता',
      'select_date_time': 'तारीख और समय चुनें',
      'enter_manually': 'मैन्युअल रूप से दर्ज करें',
      'find_responsible_person': 'जिम्मेदार व्यक्ति खोजें',
      'contact_name': 'संपर्क नाम',
      'contact_role': 'भूमिका / पद',
      'contact_phone': 'संपर्क फोन',
      'cannot_edit_completed_seva': 'पूर्ण सेवा को संपादित नहीं किया जा सकता',
      'could_not_open_map': 'नक्शा नहीं खोल सका',
      'resume_seva': 'सेवा पुनः आरंभ करें',
      'volunteers': 'स्वयंसेवक',
      'backup_volunteers': 'बैकअप स्वयंसेवक',
      'no_volunteers_yet': 'अभी तक कोई स्वयंसेवक नहीं जुड़े हैं',
      'participate_in_seva': 'सेवा में भाग लें',
      'withdraw_from_seva': 'सेवा से हटें',
      'joined': 'जुड़े हुए',
      'event_will_start': 'कार्यक्रम जल्द शुरू होगा',
      'event_is_live': 'कार्यक्रम लाइव है',
      'event_paused': 'कार्यक्रम रुका हुआ है',
      'event_postponed': 'कार्यक्रम स्थगित। अपडेट की प्रतीक्षा करें',
      'event_rescheduled': 'कार्यक्रम पुनर्निर्धारित किया गया है',
      'event_completed': 'कार्यक्रम समपन',
      'event_cancelled': 'कार्यक्रम रद्द',
      'manage_seva_op': 'सेवा प्रबंधन',
      'gurujis_assigned': 'गुरुजी नियुक्त',
      'no_gurujis_selected': 'कोई गुरुजी नहीं चुने गए',
      'assign_guruji': 'गुरुजी असाइन करें',
      'reassign': 'पुनः असाइन करें',
      'remove_assignment': 'असाइनमेंट हटाएं',
      'show_active': 'सक्रिय दिखाएं',
      'show_history': 'इतिहास दिखाएं',
      'male': 'पुरुष',
      'female': 'महिला',
      'upcoming': 'आगामी',
      'live': 'लाइव',
      'full': 'पूर्ण',
      'past': 'बीत गया',
      'paused': 'रुका हुआ',
      'assigned': 'नियुक्त',
      'start': 'शुरू करें',
      'postpone': 'स्थगित करें',
      'google_maps_link_optional': 'गूगल मैप्स लिंक (वैकल्पिक)',
      'filled_status': 'भरे गए',
      'assigned_guruji': 'गुरुजी सौंपे गए',
      'accepted': 'स्वीकृत',
      'volunteers_filled': 'स्वयंसेवक भरे गए',
      'become_first_volunteer': 'पहले स्वयंसेवक बनें',
      'required': 'आवश्यक',
      'pause': 'रोकें',
      'mark_complete': 'संपन्न करें',
      'filled': 'भरे गए',
      'status_cancelled': 'रद्द',
      'rescheduled': 'पुनर्निर्धारित',
      'postponed': 'स्थगित',
      
      // Seva Lifecycle Extended
      'seva_postponed_to': 'सेवा {date} तक स्थगित',
      'new_date_label': 'नई तारीख',
      'reason': 'कारण',
      'select_new_date': 'नई तारीख चुनें',
      'reason_required': 'कारण (अनिवार्य)',
      'confirm_postpone': 'स्थगन की पुष्टि करें',
      'confirm_postpone_msg': 'क्या आप वाकई इस सेवा को स्थगित करना चाहते हैं? यह नई तारीख पर स्वचालित रूप से फिर से शुरू हो जाएगी।',
      'cannot_select_past_date': 'बीती हुई तारीख नहीं चुन सकते',
      'upload_photos': 'फ़ोटो अपलोड करें',
      'link_folder': 'फोल्डर लिंक करें',
      'optional_folder_selection_hint': 'फ़ोटो व्यवस्थित करने के लिए वैकल्पिक रूप से एक फ़ोल्डर चुनें',
      'search_folder_hint': 'फ़ोल्डर नाम से खोजें...',
      'create_new_folder': 'नया फोल्डर बनाएँ',
      'select_existing_folder': 'मौजूदा फोल्डर चुनें',
      'photos_required': 'सेवा पूरी करने के लिए कम से कम एक फोटो आवश्यक है',
      'activity_log': 'गतिविधि लॉग',
      'log_created': 'सेवा बनाई गई',
      'log_postponed': 'स्थगित कर दिया',
      'log_resumed': 'फिर से शुरू',
      'log_completed': 'पूरा हुआ',
      'log_photos_uploaded': 'फोटो अपलोड किए गए',
      'log_cancelled': 'रद्द किया गया',
      'log_status_changed': 'स्थिति बदली गई',
      'by_user': '{name} द्वारा',
      'seva_auto_resumed_msg': 'सेवा {date} को स्वचालित रूप से फिर से शुरू होगी',
      'pull_to_refresh': 'रिफ्रेश करने के लिए नीचे खींचें',
      'primary': 'प्राथमिक',
      'backup': 'बैकअप',
      'mark_attendance': 'उपस्थिति दर्ज करें',
      'present': 'उपस्थित',
      'absent': 'अनुपस्थित',
      'attendance_marked': 'उपस्थिति दर्ज की गई (वापस नहीं लिया जा सकता)',
      'withdrawn_success': 'आपने सेवा से नाम वापस ले लिया है',
      'joined_success': 'सेवा में सफलतापूर्वक शामिल हो गए!',
      'mark_attendance_title': 'उपस्थिति दर्ज करें',
      'no_participants_joined': 'अभी तक कोई प्रतिभागी शामिल नहीं हुआ है।',
      'unmarked': 'अचिह्नित',
      'confirm_attendance_label': 'उपस्थिति की पुष्टि करें',
      'mark_all_to_continue': 'जारी रखने के लिए सभी को चिह्नित करें',
      'backup_volunteer': 'बैकअप स्वयंसेवक',
      'primary_volunteer': 'मुख्य स्वयंसेवक',
      'event_not_started': 'कार्यक्रम अभी शुरू नहीं हुआ है. कृपया {time} तक प्रतीक्षा करें',
      'cant_mark_attendance_early': 'कार्यक्रम शुरू होने से पहले उपस्थिति दर्ज नहीं की जा सकती',
      'available_after': '{time} के बाद उपलब्ध',
      'admin_actions_error_early_start': '{time} से पहले कार्यक्रम शुरू नहीं किया जा सकता',
      'admin_actions_error_not_started': 'समाप्त चिह्नित करने से पहले कार्यक्रम शुरू होना चाहिए',
      'admin_actions_error_early_end': 'निर्धारित समय ({time}) से पहले कार्यक्रम को समाप्त चिह्नित नहीं किया जा सकता',
      'status_updated': 'स्थिति को {status} में अपडेट किया गया',
      'reason_for_status': '{status} का कारण',
      'enter_reason_optional': 'कारण दर्ज करें (वैकल्पिक)',
      'confirm': 'पुष्टि करें',
      'dedicated_seva': 'समर्पित सेवा',
      'time_seva': 'समय सेवा',
      'team_seva': 'टीम सेवा',
      'impactful_seva': 'प्रभावशाली सेवा',
      'finalize_attendance': 'उपस्थिति फाइनल करें',
      'present_with_count': 'उपस्थित ({count})',
      'absent_with_count': 'अनुपस्थित ({count})',
      'send_gratitude_finalize': 'आभार भेजें और फाइनल करें',
      'no_volunteers_marked_present': 'कोई स्वयंसेवक उपस्थित नहीं चिह्नित है',
      'appreciation_only_present': 'आभार पत्र केवल उपस्थित स्वयंसेवकों के लिए है',
      'select_volunteers_to_appreciate': 'आभार के लिए स्वयंसेवक चुनें',
      'deselect_all': 'सभी का चयन रद्द करें',
      'select_all': 'सभी का चयन करें',
      'select_appreciation_badge': 'प्रशंसा बैज चुनें',
      'personal_note_optional': 'व्यक्तिगत नोट (वैकल्पिक)',
      'add_personal_note_hint': 'एक व्यक्तिगत नोट जोड़ें...',
      'recorded_as_absent': 'अनुपस्थित के रूप में दर्ज',
      'partial_appreciation_title': 'आंशिक प्रशंसा?',
      'partial_appreciation_msg': 'आप {total} उपस्थित स्वयंसेवकों में से केवल {count} की सराहना कर रहे हैं। जारी रखें?',
      'please_select_badge_error': 'कृपया एक प्रशंसा बैज चुनें',
      'please_write_longer_msg_error': 'कृपया थोड़ा लंबा संदेश लिखें',
      'attendance_finalized_gratitude_sent': 'उपस्थिति फाइनल हुई और आभार भेजा गया!',
      'attendance_finalized_msg': 'उपस्थिति फाइनल हुई!',
      'dedicated_seva_msg': 'इस सेवा में आपके समर्पण और ईमानदारी की गहरी सराहना की जाती है। प्रतिबद्धता के साथ सेवा करने के लिए धन्यवाद।',
      'time_seva_msg': 'अपना समय उदारतापूर्वक देने और सेवा के लिए उपस्थित रहने के लिए धन्यवाद।',
      'team_seva_msg': 'आपके टीम वर्क और समन्वय ने इस सेवा को सफल बनाया। आपके समर्थन के लिए आभार।',
      'impactful_seva_msg': 'आपके योगदान ने एक सार्थक प्रभाव पैदा किया। आपकी प्रेरक सेवा के लिए धन्यवाद।',

      // General
      'app_name': 'गायत्री परिवार कनेक्ट',
      'ok': 'ठीक है',
      'cancel': 'रद्द करें',
      'delete': 'हटाएं',
      'submit': 'जमा करें',
      'loading': 'लोड हो रहा है...',
      'error': 'त्रुटि',
      'success': 'सफल',
      'search': 'खोजें',
      'emergency_summary': 'आपातकालीन सारांश', // Hindi
      'resolution_note': 'समाधान नोट',
      'call_required': 'कॉल आवश्यक',
      'call_logged': 'कॉल किया गया',
      'sos_created': 'SOS बनाया गया',
      'resolve_emergency_title': 'आपातकाल का समाधान करें',
      'min_chars_10': 'कम से कम 10 अक्षर आवश्यक',
      'min_chars_20': 'कम से कम 20 अक्षर आवश्यक',
      'no_data': 'कोई डेटा उपलब्ध नहीं',
      'all_is_well': 'सब कुशल मंगल!',
      'retry': 'पुनः प्रयास करें',
      'close': 'बंद करें',
      'yes': 'हां',
      'no': 'नहीं',
      'back': 'वापस',
      'next': 'आगे',
      'done': 'हो गया',
      'select': 'चुनें',
      'add': 'जोड़ें',
      'remove': 'हटाएं',
      'update': 'अपडेट करें',
      'view_history': 'इतिहास देखें',
      'my_sos_history': 'मेरा SOS इतिहास',
      'call_now': 'अभी कॉल करें',
      'status_open': 'खुला है',
      'status_acknowledged': 'स्वीकृत',
      'status_resolved': 'समाधान',
      'acknowledged': 'स्वीकार किया गया',
      'waiting': 'प्रतीक्षा कर रहा है...',
      'managed_by': '{name} द्वारा प्रबंधित',
      'by': '{name} द्वारा',
      'description': 'विवरण',
      'resolved': 'समाधान',
      'role_admin': 'व्यवस्थापक',
      'role_parent': 'अभिभावक',
      'role_guruji': 'गुरूजी',
      'role_unknown': 'अज्ञात',
      'details': 'विवरण',
      'title': 'शीर्षक',
      'date': 'तिथि',
      'time': 'समय',
      'status': 'स्थिति',
      'pending': 'लंबित',
      'approved': 'स्वीकृत',
      'rejected': 'अस्वीकृत',
      'completed': 'पूर्ण',
      'ongoing': 'चल रहे',
      'no_ongoing_events': 'कोई चल रहे कार्यक्रम नहीं',
      'all': 'सभी',
      'filter': 'फ़िल्टर',
      'sort': 'क्रमबद्ध करें',
      'upload': 'अपलोड',
      'refresh': 'रिफ्रेश',
      'daily_inspiration': 'दैनिक प्रेरणा',
      'spiritual_practice': 'आध्यात्मिक साधना',
      'sadhana': 'साधना',
      'swadhyay': 'स्वाध्याय',
      'mantra_japa': 'मंत्र जप',
      'digital_library': 'डिजिटल पुस्तकालय',
      'daily_thoughts': 'दैनिक विचार',
      // Important Info
      'important_locations': 'महत्वपूर्ण स्थान',
      'search_locations_hint': 'स्थान खोजें...',
      'important_contacts': 'महत्वपूर्ण संपर्क',
      'search_contacts_hint': 'संपर्क खोजें...',
      'open_google_maps': 'गूगल मैप्स में खोलें',
      'all_tags': 'सभी टैग',
      'all_roles': 'सभी भूमिकाएँ',
      'no_locations_found': 'कोई स्थान नहीं मिला',
      'no_contacts_found': 'कोई संपर्क नहीं मिला',
      'call_action': 'कॉल करें',
      'save_contact_share': 'संपर्क सहेजें: ',
      // Sadhana Settings
      'select_daily_target': 'दैनिक लक्ष्य चुनें',
      'mala_quarter': '¼ माला',
      'mala_half': '½ माला',
      'mala_1': '१ माला',
      'malas_format': '{count} मालाएं',
      'desc_beginners': 'शुरुआती / व्यस्त दिन',
      'desc_morning_evening': 'सुबह/शाम',
      'desc_standard': 'मानक दैनिक',
      'desc_regular': 'नियमित साधक',
      'desc_intermediate': 'मध्यम',
      'desc_advanced': 'उन्नत',
      'desc_intensive': 'गहन',
      'desc_anushthana': 'अनुष्ठान स्तर',
      'desc_deep_practice': 'गहरी साधना',
      'desc_traditional': 'पारंपरिक लक्ष्य',
      'view_sadhana': 'साधना देखें',
      'sadhana_progress': 'साधना प्रगति',
      'no_students_in_group': 'इस समूह में अभी तक कोई छात्र नहीं है',
      'private_not_shared': 'निजी / साझा नहीं किया गया',
      // Auth
      'login': 'लॉगिन',
      'signup': 'साइन अप',
      'logout': 'लॉगआउट',
      'email': 'ईमेल',
      'password': 'पासवर्ड',
      'confirm_password': 'पासवर्ड पुष्टि करें',
      'forgot_password': 'पासवर्ड भूल गए?',
      'welcome_back': 'वापसी पर स्वागत',
      'sign_in_continue': 'जारी रखने के लिए साइन इन करें',
      'reset_password': 'पासवर्ड रीसेट करें',
      'send_reset_link': 'रीसेट लिंक भेजें',
      'create_account': 'खाता बनाएं',
      'already_have_account': 'पहले से खाता है?',
      'dont_have_account': 'खाता नहीं है?',
      'enter_email': 'अपना ईमेल दर्ज करें',
      'enter_password': 'अपना पासवर्ड दर्ज करें',
      'join_gayatri': 'गायत्री परिवार से जुड़ें',
      // Navigation
      'home': 'होम',
      'groups': 'समूह',
      'events': 'कार्यक्रम',
      'group_events': 'समूह कार्यक्रम',
      'more_actions': 'अन्य विकल्प',
      'attendance': 'उपस्थिति',
      'manage_members': 'सदस्य प्रबंधन',
      'view_members': 'सदस्य देखें',
      'assign_volunteers': 'स्वयंसेवक नियुक्त करें',
      'invite_members': 'सदस्यों को आमंत्रित करें',
      'spiritual': 'आध्यात्मिक',
      'profile': 'प्रोफ़ाइल',
      'settings': 'सेटिंग्स',
      'news': 'समाचार',
      'chat': 'चैट',
      'members': 'सदस्य',
      // Settings
      'notifications': 'सूचनाएं',
      'appearance': 'दिखावट',
      'theme': 'थीम',
      'font_size': 'फ़ॉन्ट आकार',
      'language': 'भाषा',
      'privacy_security': 'गोपनीयता और सुरक्षा',
      'change_password': 'पासवर्ड बदलें',
      'about': 'के बारे में',
      'app_version': 'ऐप संस्करण',
      'terms_conditions': 'नियम और शर्तें',
      'privacy_policy': 'गोपनीयता नीति',
      'contact_support': 'सहायता से संपर्क करें',
      'clear_cache': 'कैश साफ़ करें',
      'rate_app': 'ऐप को रेट करें',
      'change_username': 'उपयोगकर्ता नाम बदलें',
      'two_factor_auth': 'दो-चरण प्रमाणीकरण',
      'coming_soon': 'जल्द आ रहा है',
      'free_up_storage': 'स्टोरेज खाली करें',
      'clear_cache_message': 'यह सभी कैश्ड छवियों को साफ़ करेगा और स्टोरेज स्पेस खाली करेगा। जारी रखें?',
      'clear_cache_success': 'कैश सफलतापूर्वक साफ़ किया गया',
      'cannot_change_until': 'इस तिथि तक बदल नहीं सकते',
      'pending_invitations': 'लंबित आमंत्रण',
      'no_pending_invitations': 'कोई लंबित आमंत्रण नहीं',
      'invitations_hint': 'समूह के आमंत्रण यहां दिखाई देंगे',
      'pranaam_greeting': 'प्रणाम',
      'celebrations': 'उत्सव',
      'calendar': 'कैलेंडर',
      // Theme options
      'light': 'लाइट',
      'dark': 'डार्क',
      'system_default': 'सिस्टम डिफ़ॉल्ट',
      // Font size options
      'small': 'छोटा',
      'medium': 'मध्यम',
      'large': 'बड़ा',
      // Profile
      'edit_profile': 'प्रोफ़ाइल संपादित करें',
      'full_name': 'पूरा नाम',
      'phone_number': 'फ़ोन नंबर',
      'location': 'स्थान',
      'city': 'शहर',
      'branch': 'शाखा',
      'select_branch': 'शाखा चुनें',
      'select_guruji': 'गुरुजी चुनें',
      'interests': 'रुचियां',
      'complete_setup': 'सेटअप पूरा करें',
      'profile_setup': 'प्रोफ़ाइल सेटअप',
      'personal_info': 'व्यक्तिगत जानकारी',
      'contact_info': 'संपर्क जानकारी',
      'username': 'उपयोगकर्ता नाम',
      'bio': 'परिचय',
      'date_of_birth': 'जन्म तिथि',
      'gender': 'लिंग',
      'other': 'अन्य',
      // Services
      'request_service': 'सेवा का अनुरोध करें',
      'request_service_title': 'सेवा का अनुरोध करें',
      'edit_request_title': 'अनुरोध संपादित करें',
      'my_requests': 'मेरे अनुरोध',
      'service_type': 'सेवा प्रकार',
      'address': 'पता',
      'preferred_date': 'पसंदीदा तिथि',
      'preferred_time': 'पसंदीदा समय',
      'additional_notes': 'अतिरिक्त नोट्स',
      'select_service': 'सेवा चुनें',
      'service_details': 'सेवा विवरण',
      'request_status': 'अनुरोध स्थिति',
      'new_request': 'नया अनुरोध',
      'add_extra_item': 'अतिरिक्त वस्तु जोड़ें',
      'submit_request': 'अनुरोध जमा करें',
      'city_hint': 'उदा. भिवंडी',
      'building_apt': 'इमारत/फ्लैट',
      'flat_floor': 'फ्लैट नं. और तल',
      'building_society_name': 'इमारत / सोसाइटी का नाम',
      'street_road_name': 'सड़क / रोड का नाम',
      'landmark_optional': 'लैंडमार्क (वैकल्पिक)',
      'city_location': 'शहर / स्थान',
      'required_samagri_admin': 'आवश्यक सामग्री (व्यवस्थापक)',
      'guruji_cannot_arrange': 'गुरुजी व्यवस्था नहीं कर सकते',
      'not_possible_reason': 'कारण: ',
      'organization': 'संगठन',
      
      // Admin Family Links
      'family_links_admin': 'पारिवारिक लिंक',
      'family_links': 'पारिवारिक लिंक',
      'create_family_link': 'पारिवारिक लिंक बनाएं',
      'select_parent': 'माता-पिता चुनें',
      'select_child': 'बच्चा चुनें',
      'select_both_users': 'कृपया दोनों उपयोगकर्ताओं को चुनें',
      'cannot_link_self': 'उपयोगकर्ता को खुद से लिंक नहीं कर सकते',
      'link_created': 'पारिवारिक लिंक सफलतापूर्वक बनाया गया',
      'search_users': 'उपयोगकर्ता खोजें...',
      'filter_status': 'स्थिति',
      'all_links': 'सभी लिंक',
      'audit_trail': 'ऑडिट ट्रेल',
      'add_link': 'लिंक जोड़ें',
      'links_found': 'लिंक मिले',
      'no_family_links': 'कोई पारिवारिक लिंक नहीं मिला',
      'no_audit_logs': 'कोई ऑडिट लॉग नहीं मिला',
      'parent_child': 'माता-पिता/बच्चे',
      'elder_caregiver': 'बुजुर्ग/देखभालकर्ता',
      'relationship': 'संबंध',
      'created': 'बनाया गया',
      'actions': 'कार्रवाई',
      'import_failed': 'आयात विफल',
      'file_saved': 'फ़ाइल सहेजी गई',
      'export_success': 'निर्यात सफल',
      'export_failed': 'निर्यात विफल',
      'importing': 'आयात किया जा रहा है...',
      'processing': 'संसाधित किया जा रहा है',
      'links': 'लिंक',
      'import_complete': 'आयात पूर्ण',
      'failed': 'विफल',
      'add_first_link': '+ बटन का उपयोग करके अपना पहला पारिवारिक लिंक जोड़ें',
      'parent': 'माता-पिता',
      'child': 'बच्चा',
      'no_links_to_export': 'निर्यात के लिए कोई लिंक नहीं',

      // Edit Link Dialog
      'edit_family_link': 'पारिवारिक लिंक संपादित करें',
      'current_link': 'वर्तमान लिंक',
      'type': 'प्रकार',
      'permissions': 'अनुमतियाँ',
      'view_activity': 'गतिविधि देखें',
      'view_activity_desc': 'माता-पिता बच्चे के ऐप उपयोग को देख सकते हैं',
      'receive_sos': 'SOS अलर्ट प्राप्त करें',
      'receive_sos_desc': 'आपातकालीन अलर्ट आगे बढ़ाएं',
      'restrict_content': 'सामग्री प्रतिबंधित करें',
      'restrict_content_desc': 'बच्चे की पहुँच सीमित करें',
      'expiration_date': 'समाप्ति तिथि',
      'no_expiration': 'कोई समाप्ति नहीं',
      'last_modified_by': 'अंतिम संशोधनकर्ता',
      'link_updated': 'पारिवारिक लिंक सफलतापूर्वक अपडेट किया गया',

      'edit_item': 'संपादित करें',
      'select_service_type_error': 'कृपया सेवा का प्रकार चुनें',
      'not_backed_up_yet': 'अभी तक बैकअप नहीं लिया गया',
      'syncing': 'सिंक हो रहा है...',
      'data_synced': 'डेटा सिंक हो गया',
      'data_not_synced': 'डेटा सिंक नहीं हुआ, डिवाइस पर सहेजा गया',
      'data_synced_cloud': 'डेटा सिंक हुआ, क्लाउड पर सहेजा गया',
      'sync_data': 'डेटा सिंक करें',
      'backing_up_data': 'डेटा क्लाउड पर बैकअप हो रहा है...',
      'sun_short': 'रवि',
      'mon_short': 'सोम',
      'tue_short': 'मंगल',
      'wed_short': 'बुध',
      'thu_short': 'गुरु',
      'fri_short': 'शुक्र',
      'sat_short': 'शनि',
      // Notifications
      'news_notifications': 'समाचार सूचनाएं',
      'event_notifications': 'कार्यक्रम सूचनाएं',
      'group_notifications': 'समूह सूचनाएं',
      'announcement_notifications': 'घोषणाएं',
      'satsang_notifications': 'दैनिक सत्संग संदेश',
      // Home Dashboard
      'pranaam': 'प्रणाम 🙏',
      'welcome_to_gayatri': 'गायत्री परिवार में वापसी पर स्वागत',
      'quick_access': 'त्वरित पहुँच',
      'latest_news': 'ताज़ा समाचार',
      'upcoming_events': 'आगामी कार्यक्रम',
      'my_groups': 'मेरे समूह',
      'media_library': 'मीडिया लाइब्रेरी',
      // Change Password
      'change_password_desc': 'अपना वर्तमान पासवर्ड दर्ज करें और एक नया चुनें',
      'current_password': 'वर्तमान पासवर्ड',
      'new_password': 'नया पासवर्ड',
      'password_tips': 'पासवर्ड सुझाव',
      'password_tip_1': 'कम से कम 8 अक्षर का प्रयोग करें',
      'password_tip_2': 'बड़े और छोटे अक्षरों को शामिल करें',
      'password_tip_3': 'संख्याएं और विशेष वर्ण जोड़ें',
      'password_tip_4': 'सामान्य शब्दों या पैटर्न से बचें',
      // Profile Setup & Edit
      'save_changes': 'परिवर्तन सहेजें',
      'take_photo': 'फोटो लें',
      'choose_from_gallery': 'गैलरी से चुनें',
      'invalid_phone_error': 'कृपया एक मान्य 10-अंकीय फ़ोन नंबर दर्ज करें',
      'enter_dob_error': 'कृपया अपनी जन्म तिथि चुनें',
      'enter_full_name': 'कृपया अपना नाम दर्ज करें',
      'enter_phone': 'कृपया अपना फोन नंबर दर्ज करें',
      'enter_valid_phone': 'कृपया एक मान्य 10-अंकीय फोन नंबर दर्ज करें',
      'select_dob': 'कृपया अपनी जन्म तिथि चुनें',
      'select_gender': 'लिंग चुनें',
      'select_gender_error': 'कृपया अपना लिंग चुनें',
      'select_location_error': 'कृपया अपना स्थान चुनें',
      'username_available': 'उपयोगकर्ता नाम उपलब्ध है',
      'username_taken': 'यह उपयोगकर्ता नाम पहले से ही लिया गया है',
      'logout_confirmation': 'क्या आप लॉग आउट करना चाहते हैं?',
      'confirm_logout': 'लॉग आउट',
      'cancel': 'रद्द करें',
      'social_youtube': 'यूट्यूब',
      'social_facebook': 'फेसबुक',
      'social_instagram': 'इंस्टाग्राम',
      'follow_us': 'हमसे जुड़ें',
      // Tutorial
      'tutorial_profile_title': 'आपकी प्रोफ़ाइल',
      'tutorial_profile_desc': 'अपनी प्रोफ़ाइल देखने और संपादित करने के लिए यहाँ टैप करें। आप अपनी फ़ोटो, नाम और अन्य विवरण बदल सकते हैं।',
      'tutorial_daily_inspiration_title': 'दैनिक प्रेरणा',
      'tutorial_daily_inspiration_desc': 'अपने दिन की शुरुआत आध्यात्मिक विचारों और सुविचारों के साथ करें।',
      'tutorial_celebrations_title': 'उत्सव',
      'tutorial_celebrations_desc': 'देखें कि आज किसका जन्मदिन और सालगिरह है!',
      'tutorial_calendar_desc': 'आगामी त्योहारों, कार्यक्रमों और महत्वपूर्ण तिथियों को देखें।',
      'tutorial_news_desc': 'नवीनतम समाचारों और घोषणाओं से अपडेट रहें।',
      'tutorial_events_title': 'कार्यक्रम',
      'tutorial_events_desc': 'अपने समुदाय में आगामी कार्यक्रमों को खोजें और शामिल हों।',
      'tutorial_groups_title': 'समूह',
      'tutorial_groups_desc': 'समूहों में शामिल हों और समान विचारधारा वाले सदस्यों से जुड़ें।',
      'tutorial_spiritual_desc': 'आध्यात्मिक संसाधनों, सुविचारों और सुझावों तक पहुँचें।',
      'tutorial_request_service_title': 'सेवा अनुरोध',
      'tutorial_request_service_desc': 'यज्ञ, संस्कार आदि जैसे समारोहों के लिए अनुरोध करें।',
      'tutorial_seva_title': 'सेवा के अवसर',
      'tutorial_seva_desc': 'निस्वार्थ सेवा कार्यों के लिए स्वयंसेवा करें।',
      'tutorial_media_title': 'मीडिया लाइब्रेरी',
      'tutorial_media_desc': 'समारोहों की तस्वीरें, वीडियो और अन्य मीडिया ब्राउज़ करें।',
      'tutorial_bottom_nav_title': 'नेविगेशन',
      'tutorial_bottom_nav_desc': 'होम, समूह, कार्यक्रम, आध्यात्मिक और प्रोफ़ाइल के बीच स्विच करने के लिए इन टैब का उपयोग करें।',
      'tutorial_emergency_sos_title': 'आपातकालीन सहायता',
      'tutorial_emergency_sos_desc': 'आपातकाल में त्वरित सहायता के लिए इस बटन का उपयोग करें।',
      'tutorial_mandir_schedule_title': 'मंदिर समयसारणी',
      'tutorial_mandir_schedule_desc': 'आरती, दर्शन और अन्य गतिविधियों का समय देखें।',
      'tutorial_upcoming_events_title': 'आगामी कार्यक्रम',
      'tutorial_upcoming_events_desc': 'जल्द होने वाले महत्वपूर्ण कार्यक्रमों की सूची देखें।',
      'tutorial_latest_news_title': 'ताज़ा समाचार',
      'tutorial_latest_news_desc': 'गायत्री परिवार की नवीनतम गतिविधियाँ और सूचनाएं।',
      'marital_status': 'वैवाहिक स्थिति',
      'marriage_anniversary': 'विवाह वर्षगांठ',
      'engagement_date': 'सगाई की तारीख',
      'single': 'अविवाहित',
      'engaged': 'सगाई हो चुकी',
      'married': 'विवाहित',
      'widow_widower': 'विधवा/विधुर',
      'select_your_interests': 'अपनी रुचियां चुनें',
      'username_helper_text': 'हर 30 दिनों में केवल एक बार बदला जा सकता है',
      'username_min_length': 'उपयोगकर्ता नाम कम से कम 3 अक्षर का होना चाहिए',
      'username_max_length': 'उपयोगकर्ता नाम 20 अक्षरों से कम होना चाहिए',
      'username_invalid_chars': 'केवल अक्षर, संख्याएं और अंडरस्कोर की अनुमति है',
      'username_cooldown_msg': 'उपयोगकर्ता नाम इतने दिनों में बदला जा सकता है',
      'username_locked_msg': 'उपयोगकर्ता नाम इस तारीख तक नहीं बदला जा सकता',
      'days': 'दिन',
      // Terms & Conditions
      'terms_update_date': 'अंतिम अपडेट: 06 दिसंबर 2025',
      'terms_1_title': '1. शर्तों की स्वीकृति',
      'terms_1_content': 'गायत्री परिवार कनेक्ट ऐप डाउनलोड, इंस्टॉल या उपयोग करके, आप इन नियमों और शर्तों से बंधे होने के लिए सहमत हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया ऐप का उपयोग न करें।',
      'terms_2_title': '2. सेवा का विवरण',
      'terms_2_content': 'गायत्री परिवार कनेक्ट एक सामुदायिक ऐप है जिसे गायत्री परिवार आध्यात्मिक समुदाय के सदस्यों को जोड़ने के लिए डिज़ाइन किया गया है। ऐप निम्नलिखित सुविधाएं प्रदान करता है:\n\n• समूह संचार और मैसेजिंग\n• कार्यक्रम प्रबंधन और सूचनाएं\n• आध्यात्मिक संसाधन और सामग्री\n• सामुदायिक समाचार और घोषणाएं\n• प्रोफ़ाइल प्रबंधन',
      'terms_3_title': '3. उपयोगकर्ता खाते',
      'terms_3_content': '• खाता बनाते समय आपको सटीक जानकारी प्रदान करनी होगी\n• आप अपनी खाता साख (credentials) की गोपनीयता बनाए रखने के लिए जिम्मेदार हैं\n• इस ऐप का उपयोग करने के लिए आपकी आयु कम से कम 13 वर्ष होनी चाहिए\n• एक व्यक्ति एक से अधिक खाते नहीं रख सकता है',
      'terms_4_title': '4. उपयोगकर्ता आचरण',
      'terms_4_content': 'आप सहमत हैं कि आप:\n\n• अपमानजनक, अभद्र या अनुचित सामग्री पोस्ट नहीं करेंगे\n• अन्य उपयोगकर्ताओं को परेशान या धमकाएंगे नहीं\n• झूठी या भ्रामक जानकारी साझा नहीं करेंगे\n• अनुमति के बिना व्यावसायिक उद्देश्यों के लिए ऐप का उपयोग नहीं करेंगे\n• अन्य खातों तक अनधिकृत पहुंच प्राप्त करने का प्रयास नहीं करेंगे\n• किसी भी लागू कानून या विनियम का उल्लंघन नहीं करेंगे',
      'terms_5_title': '5. सामग्री दिशानिर्देश',
      'terms_5_content': '• साझा की गई सभी सामग्री गायत्री परिवार के आध्यात्मिक मूल्यों के अनुरूप होनी चाहिए\n• सभी समुदाय के सदस्यों की धार्मिक और सांस्कृतिक भावनाओं का सम्मान करें\n• अनुमति के बिना कॉपीराइट सामग्री साझा न करें\n• ऐप व्यवस्थापकों को अनुचित सामग्री हटाने का अधिकार है',
      'terms_6_title': '6. गोपनीयता',
      'terms_6_content': 'आपकी गोपनीयता हमारे लिए महत्वपूर्ण है। हम आपकी व्यक्तिगत जानकारी कैसे एकत्र करते हैं, उपयोग करते हैं और सुरक्षित रखते हैं, इस बारे में जानकारी के लिए कृपया हमारी गोपनीयता नीति देखें।',
      'terms_7_title': '7. बौद्धिक संपदा',
      'terms_7_content': '• ऐप और इसकी सामग्री कॉपीराइट और अन्य बौद्धिक संपदा कानूनों द्वारा सुरक्षित हैं\n• गायत्री परिवार का लोगो, नाम और संबंधित सामग्री ट्रेडमार्क हैं\n• उपयोगकर्ता अपनी सामग्री का स्वामित्व रखते हैं लेकिन ऐप को इसे प्रदर्शित करने का लाइसेंस देते हैं',
      'terms_8_title': '8. समाप्ति',
      'terms_8_content': 'हम आपके खाते को निलंबित या समाप्त करने का अधिकार सुरक्षित रखते हैं यदि:\n\n• आप इन नियमों और शर्तों का उल्लंघन करते हैं\n• आप समुदाय के प्रति हानिकारक व्यवहार में संलग्न हैं\n• आपका खाता लंबी अवधि तक निष्क्रिय रहता है\n• कानून या सामुदायिक दिशानिर्देशों द्वारा आवश्यक हो',
      'terms_9_title': '9. अस्वीकरण',
      'terms_9_content': '• ऐप "जैसा है" के आधार पर प्रदान किया जाता है, बिना किसी वारंटी के\n• हम निर्बाध या त्रुटि-मुक्त सेवा की गारंटी नहीं देते हैं\n• हम उपयोगकर्ता-जनित सामग्री के लिए जिम्मेदार नहीं हैं\n• ऐप का उपयोग आपके अपने जोखिम पर है',
      'terms_10_title': '10. शर्तों में बदलाव',
      'terms_10_content': 'हम समय-समय पर इन नियमों और शर्तों को अपडेट कर सकते हैं। परिवर्तनों के बाद ऐप का निरंतर उपयोग नई शर्तों की स्वीकृति माना जाता है।',
      'terms_11_title': '11. संपर्क',
      'terms_11_content': 'इन नियमों और शर्तों के बारे में प्रश्नों के लिए, कृपया ऐप की सहायता सुविधा या इस ईमेल पर संपर्क करें:\n\nईमेल: gayatripragyapeethbhiwandi@gmail.com',
      // Privacy Policy
      'privacy_update_date': 'अंतिम अपडेट: 06 दिसंबर 2025',
      'privacy_1_title': '1. परिचय',
      'privacy_1_content': 'गायत्री परिवार कनेक्ट ("हम", "हमारा") आपकी गोपनीयता की रक्षा के लिए प्रतिबद्ध है। यह गोपनीयता नीति बताती है कि जब आप हमारे मोबाइल एप्लिकेशन का उपयोग करते हैं तो हम आपकी जानकारी कैसे एकत्र करते हैं, उपयोग करते हैं, प्रकट करते हैं और सुरक्षित रखते हैं।',
      'privacy_2_title': '2. जानकारी जो हम एकत्र करते हैं',
      'privacy_2_content': 'हम वह जानकारी एकत्र करते हैं जो आप हमें सीधे प्रदान करते हैं:\n\n• व्यक्तिगत जानकारी: नाम, ईमेल पता, फोन नंबर, प्रोफ़ाइल फोटो\n• स्थान डेटा: सामुदायिक समूहन के लिए शहर और राज्य\n• खाता जानकारी: उपयोगकर्ता नाम, पासवर्ड (एन्क्रिप्टेड)\n• आध्यात्मिक प्राथमिकताएं: शाखा, गुरुजी/भगत जी प्राथमिकता\n• उपयोगकर्ता सामग्री: संदेश, पोस्ट और अपलोड जो आप साझा करते हैं',
      'privacy_3_title': '3. हम आपकी जानकारी का उपयोग कैसे करते हैं',
      'privacy_3_content': 'हम एकत्र की गई जानकारी का उपयोग निम्नलिखित के लिए करते हैं:\n\n• ऐप की कार्यक्षमता प्रदान और बनाए रखने के लिए\n• आपको समुदाय के सदस्यों के साथ जोड़ने के लिए\n• आपको घटनाओं और अपडेट के बारे में सूचनाएं भेजने के लिए\n• आपके अनुभव को निजीकृत करने के लिए\n• हमारी सेवाओं में सुधार करने के लिए\n• ऐप परिवर्तनों के बारे में आपसे संवाद करने के लिए\n• सामुदायिक सुरक्षा और दिशानिर्देशों का अनुपालन सुनिश्चित करने के लिए',
      'privacy_4_title': '4. जानकारी साझा करना',
      'privacy_4_content': 'हम आपकी जानकारी साझा कर सकते हैं:\n\n• अन्य समुदाय के सदस्यों के साथ (आपकी गोपनीयता सेटिंग्स के अनुसार)\n• समूह प्रबंधन के लिए समूह व्यवस्थापकों के साथ\n• सेवा प्रदाताओं के साथ जो हमारे संचालन में सहायता करते हैं\n• जब कानून या कानूनी प्रक्रिया द्वारा आवश्यक हो\n• उपयोगकर्ताओं के अधिकारों, संपत्ति या सुरक्षा की रक्षा के लिए\n\nहम आपकी व्यक्तिगत जानकारी तीसरे पक्ष को नहीं बेचते हैं।',
      'privacy_5_title': '5. डेटा भंडारण और सुरक्षा',
      'privacy_5_content': '• आपका डेटा फायरबेस सर्वर पर सुरक्षित रूप से संग्रहीत है\n• हम संवेदनशील डेटा संचरण के लिए एन्क्रिप्शन का उपयोग करते हैं\n• पासवर्ड डेटा हैश किया जाता है और कभी भी सादे पाठ में संग्रहीत नहीं किया जाता है\n• प्रोफ़ाइल फोटो सुरक्षित क्लाउड सेवाओं पर संग्रहीत की जाती हैं\n• हम आपके डेटा की सुरक्षा के लिए उचित सुरक्षा उपाय लागू करते हैं',
      'privacy_6_title': '6. आपके गोपनीयता अधिकार',
      'privacy_6_content': 'आपको निम्नलिखित का अधिकार है:\n\n• अपनी व्यक्तिगत जानकारी तक पहुंचना\n• गलत डेटा को सही करना\n• अपना खाता और उससे जुड़ा डेटा हटाना\n• मार्केटिंग संचार से बाहर निकलना\n• अधिसूचना प्राथमिकताओं को नियंत्रित करना\n• अपने डेटा की एक प्रति का अनुरोध करना',
      'privacy_7_title': '7. बच्चों की गोपनीयता',
      'privacy_7_content': 'हमारा ऐप 10 वर्ष से कम उम्र के बच्चों के लिए नहीं है। हम जानबूझकर 10 वर्ष से कम उम्र के बच्चों से व्यक्तिगत जानकारी एकत्र नहीं करते हैं। यदि आपको लगता है कि हमने ऐसी जानकारी एकत्र की है, तो कृपया हमसे तुरंत संपर्क करें।',
      'privacy_8_title': '8. पुश सूचनाएं',
      'privacy_8_content': '• हम घटनाओं, संदेशों और घोषणाओं के लिए पुश सूचनाएं भेजते हैं\n• आप ऐप सेटिंग्स में अधिसूचना प्राथमिकताओं को नियंत्रित कर सकते हैं\n• आप अपनी डिवाइस सेटिंग्स के माध्यम से सभी सूचनाओं को अक्षम कर सकते हैं\n• हम आपके डिवाइस टोकन को तीसरे पक्ष के साथ साझा नहीं करते हैं',
      'privacy_9_title': '9. तृतीय-पक्ष सेवाएं',
      'privacy_9_content': 'हमारा ऐप तृतीय-पक्ष सेवाओं का उपयोग करता है:\n\n• फायरबेस (Google) - प्रमाणीकरण और डेटा भंडारण\n• क्लाउडिनरी - छवि भंडारण\n• फायरबेस क्लाउड मैसेजिंग - पुश सूचनाएं\n\nइन सेवाओं की अपनी गोपनीयता नीतियां हैं जो आपकी जानकारी के उपयोग को नियंत्रित करती हैं।',
      'privacy_10_title': '10. डेटा प्रतिधारण',
      'privacy_10_content': '• जब तक आपका खाता सक्रिय है, हम आपका डेटा बनाए रखते हैं\n• खाता हटाने पर, आपका व्यक्तिगत डेटा 30 दिनों के भीतर हटा दिया जाता है\n• एनालिटिक्स के लिए कुछ अज्ञात डेटा बनाए रखा जा सकता है\n• समूह निरंतरता के लिए समूहों में संदेश इतिहास बनाए रखा जा सकता है',
      'privacy_11_title': '11. गोपनीयता नीति में परिवर्तन',
      'privacy_11_content': 'हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। हम ऐप के माध्यम से या ईमेल द्वारा महत्वपूर्ण परिवर्तनों के बारे में आपको सूचित करेंगे। परिवर्तनों के बाद निरंतर उपयोग अपडेट की गई नीति की स्वीकृति को इंगित करता है।',
      'privacy_12_title': '12. हमसे संपर्क करें',
      'privacy_12_content': 'इस गोपनीयता नीति या आपके डेटा के बारे में प्रश्नों या चिंताओं के लिए, कृपया हमसे संपर्क करें:\n\nईमेल: gayatripragyapeethbhiwandi@gmail.com\n\nआप हम तक पहुंचने के लिए इन-ऐप फीडबैक सुविधा का भी उपयोग कर सकते हैं।',
      'view_all': 'सभी देखें',
      'no_news': 'कोई समाचार उपलब्ध नहीं।',
      'no_events': 'कोई आगामी कार्यक्रम नहीं।',
      // Groups
      'create_group': 'समूह बनाएं',
      'join_group': 'समूह में शामिल हों',
      'leave_group': 'समूह छोड़ें',
      'group_name': 'समूह का नाम',
      'group_description': 'समूह विवरण',
      'group_type': 'समूह प्रकार',
      'group_members': 'समूह सदस्य',
      'add_members': 'सदस्य जोड़ें',
      'remove_member': 'सदस्य हटाएं',
      'make_admin': 'व्यवस्थापक बनाएं',
      'group_chat': 'समूह चैट',
      'group_settings': 'समूह सेटिंग्स',
      'homework': 'होमवर्क',
      'edit_group': 'समूह संपादित करें',
      'delete_group': 'समूह हटाएं',
      'private_group': 'निजी समूह',
      'no_groups': 'कोई समूह नहीं मिला।',
      'no_interests_available': 'कोई रुचि उपलब्ध नहीं है',
      'interests_topics': 'रुचियाँ / विषय',
      'group_interests_title': 'समूह की रुचियाँ',
      'search_groups': 'समूह खोजें...',
      'invitations': 'निमंत्रण',
      'accept': 'स्वीकार करें',
      'decline': 'अस्वीकार करें',
      'bss_group': 'बीएसएस समूह',
      'sss_group': 'एसएसएस समूह',
      'yss_group': 'वाईएसएस समूह',
      'other_group': 'अन्य समूह',
      'email': 'ईमेल',
      'error': 'त्रुटि',
      'member': 'सदस्य',
      'enter_email': 'कृपया ईमेल या उपयोगकर्ता नाम दर्ज करें',
      'error_searching_user': 'उपयोगकर्ता खोजने में त्रुटि',
      'user_not_found': 'उपयोगकर्ता नहीं मिला',
      // Events
            'past_event': 'पिछला कार्यक्रम',

      'event_details': 'कार्यक्रम विवरण',
      'past_event': 'पिछला कार्यक्रम',
      'upcoming': 'आगामी',
      'event_group': 'कार्यक्रम समूह',
      'join_discussion_group': 'चर्चा समूह में शामिल हों',
      'event_description': 'कार्यक्रम विवरण',
      'additional_media_available': 'अतिरिक्त मीडिया उपलब्ध',
      'view_more_media': 'और मीडिया देखें',
      'delete_event': 'कार्यक्रम हटाएं',
      'delete_event_confirm': 'क्या आप वाकई इस कार्यक्रम को हटाना चाहते हैं?',
      'event_deleted_success': 'कार्यक्रम सफलतापूर्वक हटाया गया',
      'event_not_found': 'कार्यक्रम नहीं मिला',
      'error_deleting_event': 'कार्यक्रम हटाने में त्रुटि: {error}',
      'tap_to_view': 'देखने के लिए टैप करें',
      'create_event': 'कार्यक्रम बनाएं',
      'edit_event': 'कार्यक्रम संपादित करें',
      'event_details': 'कार्यक्रम विवरण',
      'event_date': 'कार्यक्रम तिथि',
      'event_time': 'कार्यक्रम समय',
      'event_location': 'कार्यक्रम स्थान',
      'event_photos': 'कार्यक्रम फोटो',
      'tap_to_add_photos': 'फोटो जोड़ने के लिए टैप करें',
      'add_more_photos': 'और जोड़ें',
      'event_title_label': 'कार्यक्रम शीर्षक',
      'event_title_hint': 'कार्यक्रम शीर्षक दर्ज करें',
      'event_description_hint': 'यह कार्यक्रम किस बारे में है?',
      'event_location_label': 'स्थान',
      'event_location_hint': 'कार्यक्रम कहाँ आयोजित किया जाएगा?',
      'event_date_time_label': 'कार्यक्रम तिथि और समय',
      'link_media_folder': 'मीडिया फ़ोल्डर से लिंक करें',
      'link_public_group': 'सार्वजनिक समूह से लिंक करें',
      'optional_label': 'वैकल्पिक',
      'media_folder_desc': 'अतिरिक्त फोटो/वीडियो के लिए इस कार्यक्रम को मीडिया फ़ोल्डर से लिंक करें।',
      'select_folder_hint': 'फ़ोल्डर चुनें',
      'select_group_hint': 'सार्वजनिक समूह चुनें',
      'uploading_photo_progress': 'फोटो {current} / {total} अपलोड हो रहा है...',
      'creating_event_progress': 'कार्यक्रम बना रहा है...',
      'event_created_success': 'कार्यक्रम सफलतापूर्वक बनाया गया!',
      'responsible_contact': 'जिम्मेदार संपर्क व्यक्ति',
      'select_user': 'उपयोगकर्ता चुनें',
      'event_description': 'कार्यक्रम विवरण',
      'no_events_scheduled': 'कोई कार्यक्रम निर्धारित नहीं।',
      'register': 'पंजीकरण करें',
      'registered': 'पंजीकृत',
      'attendees': 'उपस्थित लोग',
      'none': 'कोई नहीं',
      'camera_error': 'फोटो चुनने में त्रुटि',
      'create_event_error': 'कार्यक्रम बनाने में त्रुटि',
      'contact_role_hint': 'उदा. कार्यक्रम समन्वयक',
      'phone_hint': '+91 XXXXX XXXXX',

      // Quotes
      'quote_1': 'हम वो बन जाते हैं जो हम सोचते हैं।',
      'quote_2': 'मन ही सब कुछ है। आप जो सोचते हैं वही बन जाते हैं।',
      'quote_3': 'अपने विचार बदलो और अपनी दुनिया बदलो।',
      'quote_4': 'भूतकाल में मत उलझो, भविष्य के सपने मत देखो, वर्तमान क्षण पर ध्यान केंद्रित करो।',
      'quote_5': 'शांति भीतर से आती है। इसे बाहर मत खोजो।',
      'quote_6': 'आत्मा अपने विचारों के रंग में रंग जाती है।',
      'quote_7': 'आप अपने भाग्य के निर्माता हैं।',
      'quote_8': 'वह बदलाव बनो जो तुम दुनिया में देखना चाहते हो।',
      'quote_9': 'खुशी इस पर निर्भर करती है कि आप क्या दे सकते हैं, न कि इस पर कि आप क्या पा सकते हैं।',
      'quote_10': 'प्रेम ही एकमात्र वास्तविकता है।',

      // Interests
      'interest_music': 'संगीत',
      'interest_teaching': 'शिक्षण',
      'interest_social_service': 'समाज सेवा',
      'interest_meditation': 'ध्यान',
      'interest_youth_activities': 'युवा गतिविधियां',
      'interest_event_organization': 'कार्यक्रम आयोजन',
      'interest_content_creation': 'सामग्री निर्माण',
      'interest_technical_support': 'तकनीकी सहायता',
      'select_gender': 'लिंग चुनें',
      'enter_full_name': 'कृपया अपना नाम दर्ज करें',
      'enter_valid_phone': 'कृपया मान्य 10-अंकीय फ़ोन नंबर दर्ज करें',
      'enter_phone': 'कृपया अपना फ़ोन नंबर दर्ज करें',
      'select_dob': 'कृपया अपनी जन्म तिथि चुनें',
      'select_gender_error': 'कृपया अपना लिंग चुनें',

      // Spiritual
      'daily_quote': 'दैनिक उद्धरण',
      'meditation': 'ध्यान',
      'mantras': 'मंत्र',
      'teachings': 'शिक्षाएं',
      'resources': 'संसाधन',
      'spiritual_tips': 'आध्यात्मिक सुझाव',
      'gayatri_mantra': 'गायत्री मंत्र',
      'books': 'पुस्तकें',
      'audio': 'ऑडियो',
      'videos': 'वीडियो',
      'pictures': 'चित्र',
      'bhajans': 'भजन',
      'no_books_available': 'कोई पुस्तक उपलब्ध नहीं',
      'no_audio_available': 'कोई ऑडियो उपलब्ध नहीं',
      'no_videos_available': 'कोई वीडियो उपलब्ध नहीं',
      'no_pictures_available': 'कोई चित्र उपलब्ध नहीं',
      'no_bhajans_available': 'कोई भजन उपलब्ध नहीं',
      'check_back_later': 'बाद में देखें!',
      // Chat
      'type_message': 'संदेश लिखें...',
      'send': 'भेजें',
      'no_messages': 'अभी कोई संदेश नहीं।',
      'start_conversation': 'बातचीत शुरू करें',
      // Celebrations
      'celebrations_page_title': '🎉 आज के उत्सव',
      'no_celebrations_today': 'आज कोई उत्सव नहीं है',
      'special_note': 'आज हम इन भक्तों के लिए आहुतियां और मंत्र जाप करते हैं। कृपया उन्हें अपने आशीर्वाद में रखें।',
      'chant_mantra': 'मंत्र जाप',
      'yagya_ahuti': 'यज्ञ आहुति',
      'send_blessings': 'आशीर्वाद भेजें',
      'birthdays': '🎂 जन्मदिन',
      'anniversaries': '💍 वर्षगांठ',
      'turning_age_prefix': 'आज',
      'turning_age_suffix': 'वर्ष के हो रहे हैं!',
      'blessings_msg': 'दीर्घायु और स्वस्थ जीवन के लिए शुभकामनाएं!',
      'celebrating_years_prefix': 'साथ के',
      'celebrating_years_suffix': 'वर्ष मना रहे हैं!',
      'festival_calendar': 'त्योहार कैलेंडर',
      'no_events_day': 'इस दिन कोई कार्यक्रम नहीं है',
      // Festivals
      'makar_sankranti': 'मकर संक्रांति',
      'vasant_panchami': 'वसंत पंचमी',
      'maha_shivaratri': 'महा शिवरात्रि',
      'holi': 'होली',
      'ram_navami': 'राम नवमी',
      'raksha_bandhan': 'रक्षाबंधन',
      'janmashtami': 'जन्माष्टमी',
      'ganesh_chaturthi': 'गणेश चतुर्थी',
      'dussehra': 'दशहरा',
      'diwali': 'दिवाली',
      // Admin
      'admin_dashboard': 'व्यवस्थापक डैशबोर्ड',
      'manage_users': 'उपयोगकर्ता प्रबंधित करें',
      'manage_groups': 'समूह प्रबंधित करें',
      'manage_events': 'कार्यक्रम प्रबंधित करें',
      'manage_news': 'समाचार प्रबंधित करें',
      'manage_services': 'सेवाएं प्रबंधित करें',
      'manage_branches': 'शाखाएं प्रबंधित करें',
      // Guruji
      'guruji_dashboard': 'गुरुजी डैशबोर्ड',
      'my_groups_guruji': 'मेरे समूह',
      'service_requests': 'सेवा अनुरोध',
      // Guruji Feature Extended

      'elder': 'बुजुर्ग',
      'caregiver': 'देखभालकर्ता',
      'seva_tab': 'सेवा',
      'calendar_tab': 'कैलेंडर',
      'seva_coordinator_dashboard': 'सेवा समन्वयक डैशबोर्ड',
      'client_label': 'क्लाइंट',
      'date_label': 'तारीख',
      'time_label': 'समय',
      'address_label': 'पता',
      'gurujis_interested': 'गुरुजी इच्छुक',
      'i_can_take_request': 'मैं यह अनुरोध ले सकता हूँ',
      'waiting_admin_assign': 'एडमिन द्वारा असाइनमेंट की प्रतीक्षा',
      'volunteered_success': 'आपने स्वेच्छा से भाग लिया है! एडमिन को सूचित किया जाएगा।',
      'user_requested_items_title': 'उपयोगकर्ता अनुरोधित आइटम',
      'note_prefix': 'नोट:',
      'edit_reason': 'कारण संपादित करें',
      'not_possible': 'संभव नहीं',
      'confirm_btn': 'पुष्टि करें',
      'last_synced': 'अंतिम सिंक: ',
      'sync_success': '{count} प्रविष्टियां सफलतापूर्वक सिंक की गईं',
      'no_data_to_sync': 'सिंक करने के लिए कोई डेटा नहीं है',
      'sync_failed': 'सिंक विफल',
      'just_now': 'अभी',
      'minutes_ago': '{count} मिनट पहले',
      'hours_ago': '{count} घंटे पहले',
      'yesterday': 'कल',
      'days_ago': '{count} दिन पहले',
      'user_attachments': 'संलग्नक:',
      'required_samagri_checklist': 'आवश्यक सामग्री:',
      'gallery': 'गैलरी',
      'complete_action': 'पूर्ण करें',
      'completing_service': 'सेवा पूरी की जा रही है...',
      'service_completed_success': 'सेवा पूर्ण चिह्नित की गई!',
      'mark_unavailable': 'अनुप्लब्ध चिह्नित करें',
      'mark_unavailable_confirm': 'क्या आप वाकई शामिल नहीं हो सकते?',
      'reason_optional': 'कारण (वैकल्पिक)',
      // Auth Feature Extended
      'login_failed': 'लॉगिन विफल',
      'reset_password_desc': 'अपना ईमेल दर्ज करें, हम आपको पासवर्ड रीसेट लिंक भेजेंगे।',
      'enter_email_error': 'कृपया अपना ईमेल दर्ज करें',
      'enter_valid_email_error': 'कृपया एक मान्य ईमेल दर्ज करें',
      'reset_link_sent': 'पासवर्ड रीसेट लिंक भेजा गया! अपना ईमेल चेक करें।',
      'enter_email_or_phone': 'कृपया अपना ईमेल या फ़ोन दर्ज करें',
      'enter_password_error': 'कृपया अपना पासवर्ड दर्ज करें',
      'signup_failed': 'साइनअप विफल',
      'terms_error_msg': 'कृपया नियम और शर्तों से सहमत हों',
      'enter_name_error': 'कृपया अपना नाम दर्ज करें',
      'otp_title': 'ओटीपी सत्यापित करें',
      'otp_desc': 'अपने फोन/ईमेल पर भेजा गया 6-अंकीय कोड दर्ज करें',
      'resend_otp_timer': '{seconds} सेकंड में ओटीपी पुनः भेजें',
      'didnt_receive_code': 'कोड नहीं मिला?',
      'resend_otp_action': 'ओटीपी पुनः भेजें',
      'verify_continue': 'सत्यापित करें और जारी रखें',
      'otp_resent_success': 'ओटीपी सफलतापूर्वक पुनः भेजा गया',
      'set_username_title': 'अपना उपयोगकर्ता नाम सेट करें',
      'change_username_title': 'उपयोगकर्ता नाम बदलें',
      'username_desc': 'एक अद्वितीय उपयोगकर्ता नाम चुनें जिसे अन्य लोग आपको खोजने के लिए उपयोग कर सकें।',
      'username_label': 'उपयोगकर्ता नाम',
      'username_hint': 'जैसे, john_doe',
      'username_available': '✓ उपयोगकर्ता नाम उपलब्ध है',
      'username_taken': '✗ उपयोगकर्ता नाम पहले से ही लिया गया है',
      'check_availability_error': 'उपलब्धता की जाँच में त्रुटि',
      'username_required': 'उपयोगकर्ता नाम आवश्यक है',
      'username_too_short': 'उपयोगकर्ता नाम कम से कम 3 वर्णों का होना चाहिए',
      'username_too_long': 'उपयोगकर्ता नाम 20 वर्णों से कम होना चाहिए',
      'username_no_spaces': 'उपयोगकर्ता नाम में रिक्त स्थान की अनुमति नहीं है',
      'username_set_success': 'उपयोगकर्ता नाम सफलतापूर्वक सेट किया गया!',
      'username_set_error': 'उपयोगकर्ता नाम सेट करने में त्रुटि',
      'username_change_limit_msg': 'उपयोगकर्ता नाम महीने में केवल एक बार बदला जा सकता है',
      'can_change_in_days': '{days} दिनों में बदल सकते हैं',
      'can_change_now': 'अब बदल सकते हैं',
      'not_set_yet': 'अभी तक सेट नहीं',
      'set_username_btn': 'उपयोगकर्ता नाम सेट करें',
      'update_btn': 'अपडेट करें',
      // Errors and Messages
      'something_went_wrong': 'कुछ गलत हो गया',
      'please_try_again': 'कृपया पुनः प्रयास करें',
      'no_internet': 'इंटरनेट कनेक्शन नहीं',
      'session_expired': 'सत्र समाप्त। कृपया पुनः लॉगिन करें।',
      'invalid_email': 'कृपया वैध ईमेल दर्ज करें',
      'password_too_short': 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए',
      'passwords_dont_match': 'पासवर्ड मेल नहीं खाते',
      'field_required': 'यह फ़ील्ड आवश्यक है',
      'saved_successfully': 'सफलतापूर्वक सहेजा गया',
      'deleted_successfully': 'सफलतापूर्वक हटाया गया',
      'updated_successfully': 'सफलतापूर्वक अपडेट किया गया',
      'are_you_sure': 'क्या आप निश्चित हैं?',
      'this_action_cannot_be_undone': 'यह क्रिया पूर्ववत नहीं की जा सकती।',
      // Welcome/Onboarding
      'welcome': 'स्वागत है',
      'get_started': 'शुरू करें',
      'skip': 'छोड़ें',
      'continue_text': 'जारी रखें',
      'onboarding_title_1': 'समुदाय से जुड़ें',
      'onboarding_desc_1': 'अपने स्थानीय गायत्री परिवार भिवंडी से जुड़ें और समान विचारधारा वाले आध्यात्मिक साधकों से मिलें',
      'onboarding_title_2': 'सीखें और बढ़ें',
      'onboarding_desc_2': 'अपनी आध्यात्मिक यात्रा को बढ़ाने के लिए आध्यात्मिक पाठ्यक्रम, मंत्र और शिक्षाएं प्राप्त करें',
      'onboarding_title_3': 'सेवा के माध्यम से योगदान दें',
      'onboarding_desc_3': 'विभिन्न सेवा अवसरों के माध्यम से समाज में योगदान दें और बदलाव लाएं',
      // Media Browser
      'root': 'रूट',
      'folders': 'फोल्डर',
      'no_files': 'कोई फाइल नहीं',
      'download_complete': 'डाउनलोड पूरा हुआ',
      'share_file': 'फाइल शेयर करें',
      'open_file': 'फाइल खोलें',
      // Service Request Extended
      'yagya_karmkaand_rituals': 'यज्ञ, कर्मकांड, अनुष्ठान और अधिक',
      'selected': 'चयनित',
      'please_select_service_type': 'जारी रखने के लिए कृपया ऊपर से सेवा का प्रकार चुनें',
      'view_my_requests': 'मेरे अनुरोध देखें',
      'service_location': 'सेवा स्थान',
      'house': 'मकान',
      'cancel_request_title': 'अनुरोध रद्द करें?',
      'cancel_request_content': 'क्या आप वाकई इस सेवा अनुरोध को रद्द करना चाहते हैं? इस कार्रवाई को पूर्ववत नहीं किया जा सकता है।',
      'yes_cancel': 'हाँ, रद्द करें',
      'request_cancelled': 'अनुरोध रद्द कर दिया गया',
      'confirmed': 'पुष्टि की गई',
      'tbd': 'तय होना बाकी',
      'guruji_label': 'गुरुजी',
      'name': 'नाम',
      'phone': 'फ़ोन',
      'important_info_emergency': 'महत्वपूर्ण जानकारी और आपातकालीन',
      'contacts': 'संपर्क',
      'locations': 'स्थान',
      'sos_contacts': 'SOS संपर्क',
      'alerts': 'चेतावनी',
      'no_contacts_yet': 'अभी तक कोई संपर्क नहीं',
      'tap_to_add_contact': 'संपर्क जोड़ने के लिए + टैप करें',
      'no_locations_yet': 'अभी तक कोई स्थान नहीं',
      'tap_to_add_location': 'स्थान जोड़ने के लिए + टैप करें',
      'add_tag': 'टैग जोड़ें',
      'tag_name': 'टैग का नाम',
      'delete_tag': 'टैग हटाएं',
      'delete_tag_confirm': 'क्या आप वाकई टैग "{tag}" हटाना चाहते हैं?',
      'add_role': 'भूमिका जोड़ें',
      'role_name': 'भूमिका का नाम',
      'delete_role': 'भूमिका हटाएं',
      'delete_role_confirm': 'क्या आप वाकई भूमिका "{role}" हटाना चाहते हैं?',
      'edit_contact': 'संपर्क संपादित करें',
      'add_contact': 'संपर्क जोड़ें',
      'sort_order': 'क्रम',
      'tags': 'टैग',
      'no_tags_available': 'कोई टैग उपलब्ध नहीं है। उन्हें सेटिंग्स टैब में जोड़ें।',
      'edit_location': 'स्थान संपादित करें',
      'add_location': 'स्थान जोड़ें',
      'location_name': 'स्थान का नाम',
      'google_maps_link': 'गूगल मैप्स लिंक',
      'latitude': 'अक्षांश',
      'longitude': 'देशांतर',
      'add_emergency_contact': 'आपातकालीन संपर्क जोड़ें',
      'role': 'भूमिका',
      'no_roles_available': 'कोई भूमिका उपलब्ध नहीं है। उन्हें सेटिंग्स टैब में जोड़ें।',
      'displayed_as_tag': 'विजेट में टैग के रूप में प्रदर्शित',
      'resolved_requests': 'हल किए गए अनुरोध',
      'active_requests': 'सक्रिय अनुरोध',
      'temporarily_unavailable': 'अस्थायी रूप से अनुपलब्ध',
      'cancellation_reason': 'रद्द करने का कारण',
      'cancelled_by': 'द्वारा रद्द',
      'status_summary': 'स्थिति सारांश',
      'stat_total': 'कुल',
      'stat_pending': 'लंबित',
      'stat_accepted': 'स्वीकृत',
      'stat_completed': 'पूर्ण',
      'stat_cancelled': 'रद्द',
      'service_types': 'सेवा के प्रकार',
      'top_requesters': 'प्रमुख अनुरोधकर्ता',
      'filter_by_user': 'उपयोगकर्ता द्वारा फ़िल्टर करें',
      'clear_all': 'सभी साफ़ करें',
      'user_filtered': 'उपयोगकर्ता फ़िल्टर किया गया',
      'filter_by_status': 'स्थिति द्वारा फ़िल्टर करें',
      'filter_by_type': 'प्रकार द्वारा फ़िल्टर करें',
      'clear_filter': 'फ़िल्टर साफ़ करें',
      'x_requests': '{count} अनुरोध',
      'filtered_check': 'फ़िल्टर किया गया ✓',
      'no_service_requests_yet': 'अभी तक कोई सेवा अनुरोध नहीं है',
      'preferred_label': 'पसंदीदा: {value}',
      'assigned_label': 'सौंपा गया: {value}',
      'requested_by': 'अनुरोधकर्ता',
      'alt_contact': 'वैकल्पिक संपर्क',
      'default_samagri_from_type': 'डिफ़ॉल्ट सामग्री (सेवा प्रकार से):',
      'not_possible_with_reason': 'संभव नहीं: {reason}',
      'no_reason_given': 'कोई कारण नहीं दिया गया',
      'loading_details': 'विवरण लोड हो रहा है...',
      'currently_assigned': 'वर्तमान में सौंपा गया',
      'notes_from_guruji': 'गुरुजी की ओर से नोट:',
      'completion_photos_label': 'पूर्णता फोटो:',
      'unavailable_by_label': 'द्वारा: {name}',
      'cancelled_by_label': 'द्वारा: {name}',
      'cannot_complete_request': 'अनुरोध पूरा नहीं किया जा सकता',
      'pending_items_approval_error': 'कुछ लंबित उपयोगकर्ता अनुरोधित आइटम हैं जिन्हें अनुरोध पूरा चिन्हित करने से पहले गुरुजी की मंजूरी/अस्वीकृति की आवश्यकता है।',
      'marked_unavailable_success': 'अनुरोध अनुपलब्ध चिन्हित किया गया',
      'restore_to_pending': 'लंबित पर पुनर्स्थापित करें',
      'request_restored_success': 'अनुरोध लंबित पर पुनर्स्थापित किया गया',
      'cancellation_reason_label': 'रद्द करने का कारण',
      'cancellation_reason_hint': 'यह अनुरोध क्यों रद्द किया जा रहा है?',
      'please_enter_reason': 'कृपया कारण दर्ज करें',
      'request_marked_unavailable': 'अनुरोध अनुपलब्ध चिन्हित किया गया',
      'request_cancelled_success': 'अनुरोध रद्द किया गया',
      'mark_completed': 'पूर्ण चिन्हित करें',
      'cancel_request': 'अनुरोध रद्द करें',
      'request_marked_completed': 'अनुरोध पूर्ण चिन्हित किया गया',
      'request_details': 'अनुरोध विवरण',
      'notes': 'नोट्स',
      'attachments': 'अनुलग्नक',
      'assignment': 'कार्यभार',
      'final_date': 'अंतिम तिथि',
      'activity_request_created': 'अनुरोध बनाया गया',
      'activity_item_selected': 'आइटम चुना गया',
      'activity_item_deselected': 'आइटम का चयन हटाया गया',
      'activity_special_item_added': 'विशेष आइटम जोड़ा गया',
      'activity_special_item_removed': 'विशेष आइटम हटाया गया',
      'activity_request_revised': 'अनुरोध संशोधित किया गया',
      'activity_item_approved': 'आइटम स्वीकृत',
      'activity_item_rejected': 'आइटम अस्वीकृत',
      'activity_approved_all': 'सभी सामग्री स्वीकृत',
      'activity_revision_requested': 'संशोधन का अनुरोध किया गया',
      'activity_guruji_volunteered': 'गुरुजी ने स्वेच्छा से काम किया',
      'activity_guruji_note': 'गुरुजी का नोट',
      'activity_guruji_assigned': 'गुरुजी आवंटित',
      'activity_admin_notes': 'एडमिन नोट्स',
      'activity_admin_note': 'एडमिन नोट',
      'activity_status_changed': 'स्थिति बदली गई',
      'on_date': 'पर',
      'request_not_found': 'अनुरोध नहीं मिला',
      'confirmed_date': 'पुष्टि की गई तिथि',
      'confirmed_time': 'पुष्टि की गई समय',
      'admin_notes_label': 'व्यवस्थापक नोट्स',
      'cancellation_details': 'रद्द करने का विवरण',
      'samagri_approved_msg': 'गुरुजी द्वारा सामग्री स्वीकृत - कोई बदलाव की अनुमति नहीं',
      'request_on_hold': 'आपका अनुरोध होल्ड पर है। सेवा शुरू होने पर आपको सूचित किया जाएगा।',
      'reason_label': 'कारण',
      'revision_required': 'संशोधन आवश्यक',
      'revision_required_content': 'कुछ अनुरोधित वस्तुएं उपलब्ध नहीं हैं। कृपया अस्वीकृत वस्तुओं को हटा दें या संशोधित करें और अपना अनुरोध पुनः जमा करें।',
      'gurujis_note': 'गुरुजी का नोट',
      'guruji_asked_title': 'गुरुजी ने आपसे जोड़ने के लिए कहा:',
      'requirements_checklist': 'आवश्यकता जांच सूची',
      'no_requirements': 'कोई आवश्यकता सूची उपलब्ध नहीं है।',
      'optional_suffix': ' (वैकल्पिक)',
      'add_item': 'वस्तु जोड़ें',
      'your_requested_items': 'आपकी अनुरोधित वस्तुएं',
      'not_available': 'अनुपलब्ध',
      // Tutorial
      'tutorial_profile_title': 'आपकी प्रोफ़ाइल',
      'tutorial_profile_desc': 'अपनी प्रोफ़ाइल देखने और संपादित करने के लिए यहां टैप करें।',
      'tutorial_daily_inspiration_title': 'दैनिक प्रेरणा',
      'tutorial_daily_inspiration_desc': 'अपने दिन की शुरुआत आध्यात्मिक विचारों और सुविचारों के साथ करें।',
      'tutorial_celebrations_title': 'उत्सव',
      'tutorial_celebrations_desc': 'देखें कि आज किसका जन्मदिन या सालगिरह है!',
      'tutorial_calendar_desc': 'आगामी त्योहार, कार्यक्रम और महत्वपूर्ण तिथियां देखें।',
      'tutorial_news_desc': 'नवीनतम समाचार और घोषणाओं से अपडेट रहें।',
      'tutorial_events_title': 'कार्यक्रम',
      'tutorial_events_desc': 'अपने समुदाय के आगामी कार्यक्रमों को खोजें और उनमें शामिल हों।',
      'tutorial_groups_title': 'समूह',
      'tutorial_groups_desc': 'समूहों में शामिल हों और समान विचारधारा वाले सदस्यों से जुड़ें।',
      'tutorial_spiritual_desc': 'आध्यात्मिक संसाधन, उद्धरण और सुझाव देखें।',
      'tutorial_request_service_title': 'सेवा अनुरोध',
      'tutorial_request_service_desc': 'यज्ञ, संस्कार आदि जैसे समारोहों का अनुरोध करें।',
      'tutorial_seva_title': 'सेवा के अवसर',
      'tutorial_seva_desc': 'निस्वार्थ सेवा गतिविधियों के लिए स्वयंसेवा करें।',
      'tutorial_media_title': 'मीडिया लाइब्रेरी',
      'tutorial_media_desc': 'कार्यक्रमों की तस्वीरें, वीडियो और अन्य मीडिया ब्राउज़ करें।',
      'tutorial_lms_title': 'संस्कार पाठ्यक्रम',
      'tutorial_lms_desc': 'आध्यात्मिक पाठ्यक्रमों में नामांकित हों और अपनी सीखने की प्रगति को ट्रैक करें।',
      'tutorial_bottom_nav_title': 'नेविगेशन',
      'tutorial_bottom_nav_desc': 'होम, समूह, कार्यक्रम, आध्यात्मिक और प्रोफ़ाइल के बीच स्विच करने के लिए इन टैब का उपयोग करें।',
      'tutorial_guruji_today_title': 'आज का कार्यक्रम',
      'tutorial_guruji_today_desc': 'आज के लिए अपनी निर्धारित सेवाएं देखें।',
      'tutorial_guruji_new_req_title': 'नए अनुरोध',
      'tutorial_guruji_new_req_desc': 'नए सेवा अनुरोध देखें और स्वयंसेवा के लिए चुनें।',
      'tutorial_guruji_assigned_title': 'मेरी सेवाएं',
      'tutorial_guruji_assigned_desc': 'उन सेवाओं का प्रबंधन करें जिनके लिए आपने स्वयंसेवा की है।',
      'tutorial_guruji_seva_title': 'सेवा के अवसर',
      'tutorial_guruji_seva_desc': 'सामान्य सेवा गतिविधियों को देखें और प्रबंधित करें।',
      'tutorial_guruji_calendar_title': 'कैलेंडर',
      'tutorial_guruji_calendar_desc': 'आगामी सेवा कार्यक्रम देखें।',
      'tutorial_emergency_sos_title': 'आपातकालीन सहायता',
      'tutorial_emergency_sos_desc': 'जरूरत पड़ने पर SOS सुविधा से मदद प्राप्त करें',
      'tutorial_mandir_schedule_title': 'मंदिर समय सारणी',
      'tutorial_mandir_schedule_desc': 'अपने स्थानीय मंदिर में दैनिक आरती और हवन का समय देखें',
      'tutorial_upcoming_events_title': 'आगामी कार्यक्रम',
      'tutorial_upcoming_events_desc': 'आगामी सत्संग, यज्ञ और सामुदायिक कार्यक्रमों से अपडेट रहें',
      'tutorial_latest_news_title': 'ताज़ा समाचार',
      'tutorial_latest_news_desc': 'गायत्री परिवार की नवीनतम समाचार और अपडेट पढ़ें',
      // Assign Volunteer
      'assign_volunteers': 'स्वयंसेवक नियुक्त करें',
      'select_member': 'सदस्य चुनें',
      'choose_member': 'एक सदस्य चुनें',
      'role': 'स्वयंसेवक भूमिका',
      'volunteer_role_hint': 'उदाहरण: दरी बिछाने वाला, कुर्सी लगाने वाला',
      'volunteer_desc_hint': 'स्वयंसेवक की जिम्मेदारियों का वर्णन करें...',
      'description_optional': 'विवरण (वैकल्पिक)',
      'description': 'विवरण',
      'end_date': 'समाप्ति तिथि',
      'end_date_optional': 'समाप्ति तिथि (वैकल्पिक)',
      'sending': 'भेज रहे हैं',
      'assign': 'नियुक्त करें',
      'invitation_sent': 'स्वयंसेवक आमंत्रण भेजा गया',
      'select_member_error': 'कृपया सदस्य चुनें',
      'volunteer_invitations': 'स्वयंसेवक',
      'group_invitations': 'समूह',
      'no_volunteer_invitations': 'कोई स्वयंसेवक आमंत्रण नहीं',
      'volunteer_invitations_hint': 'स्वयंसेवक कार्य यहां दिखाई देंगे',
      'volunteer_invitation': 'स्वयंसेवक आमंत्रण',
      'declined': 'अस्वीकृत',
      'assigned_by': 'द्वारा नियुक्त',
      'manage_volunteers': 'स्वयंसेवकों का प्रबंधन',
      // Mandir Schedule
      'mandir_schedule': 'मंदिर कार्यक्रम',
      'temple_schedule': 'मंदिर समय सारिणी',
      'aarti': 'आरती',
      'pooja': 'पूजा',
      'camp': 'शिविर',
      'event': 'कार्यक्रम',
      'other_schedule': 'अन्य',
      'add_schedule': 'कार्यक्रम जोड़ें',
      'edit_schedule': 'कार्यक्रम संपादित करें',
      'schedule_title': 'शीर्षक',
      'schedule_time': 'समय',
      'schedule_description': 'विवरण',
      'permanent_schedule': 'स्थायी कार्यक्रम',
      'is_active': 'सक्रिय',
      // Important Info
      'important_contacts_subtitle': 'आपातकालीन और महत्वपूर्ण संपर्क देखें',
      'important_locations_subtitle': 'महत्वपूर्ण स्थान और दिशाएं देखें',
      'important_badge': 'महत्वपूर्ण',
      'no_schedules_available': 'कोई कार्यक्रम उपलब्ध नहीं',
      'check_back_later_timings': 'मंदिर के समय के लिए बाद में देखें',
      'gayatri_mandir_title': 'गायत्री मंदिर',
      'daily_schedule': 'दैनिक कार्यक्रम',
      'daily': 'दैनिक',
      'items': 'आइटम',
      'start_time': 'शुरू का समय',
      'end_time': 'समाप्ति का समय',
      'repeats_daily': 'रोजाना दोहराता है',
      'havan': 'हवन',
      // Family Connections
      'family_connections': 'पारिवारिक कनेक्शन',
      'family_connections_subtitle': 'उनकी साधना का समर्थन करने के लिए परिवार के साथ लिंक करें',
      'send_family_link_request': 'पारिवारिक लिंक अनुरोध भेजें',
      'manage_family_links': 'पारिवारिक लिंक प्रबंधित करें',
      'my_connections': 'मेरे कनेक्शन',
      'pending_requests': 'लंबित अनुरोध',
      'no_family_connections': 'अभी तक कोई पारिवारिक कनेक्शन नहीं',
      'no_pending_family_requests': 'कोई पारिवारिक लिंक अनुरोध नहीं',
      'family_requests_appear_here': 'पारिवारिक लिंक अनुरोध यहां दिखाई देंगे',
      'send_link_request': 'लिंक अनुरोध भेजें',
      'email_username': 'ईमेल / उपयोगकर्ता नाम',
      'enter_email_or_username': 'ईमेल या @उपयोगकर्ता नाम दर्ज करें',
      'email_or_username_required': 'ईमेल या उपयोगकर्ता नाम आवश्यक है',
      'user_not_found': 'उपयोगकर्ता नहीं मिला',
      'searching': 'खोज रहे हैं...',
      'you_will_be_supporter_of': 'आप समर्थक होंगे',
      'relationship_type': 'संबंध प्रकार',
      'parent_to_child': 'माता-पिता → बच्चा',
      'parent_child_desc': 'आप माता-पिता या अभिभावक हैं जो बच्चे की साधना और होमवर्क का समर्थन कर रहे हैं।',
      'caregiver_to_elder': 'देखभालकर्ता → बुजुर्ग',
      'caregiver_elder_desc': 'आप बुजुर्ग परिवार के सदस्य को मार्गदर्शन और समर्थन के साथ मदद कर रहे हैं।',
      'supporter_helper_text': 'आप समर्थक होंगे। चयनित उपयोगकर्ता वह होगा जिसका आप समर्थन करेंगे।',
      'message_optional': 'संदेश (वैकल्पिक)',
      'add_personal_message': 'व्यक्तिगत संदेश जोड़ें...',
      'send_request': 'अनुरोध भेजें',
      'sending': 'भेज रहे हैं...',
      'link_request_sent': 'लिंक अनुरोध सफलतापूर्वक भेजा गया!',
      'family_link_accepted': 'पारिवारिक लिंक स्वीकार किया गया!',
      'request_declined': 'अनुरोध अस्वीकार किया गया',
      'unlink': 'लिंक हटाएं',
      'unlink_confirm': 'क्या आप वाकई इस कनेक्शन को अनलिंक करना चाहते हैं?',
      'family_linking': 'परिवार',
      'parent_child_link_request': 'माता-पिता-बच्चा लिंक अनुरोध',
      'elder_caregiver_link_request': 'बुजुर्ग-देखभालकर्ता लिंक अनुरोध',
      'from': 'से',
      'requested': 'अनुरोध किया',
      'about_family_connections': 'पारिवारिक कनेक्शन के बारे में',
      'family_connections_desc': 'आप परिवार के सदस्य के साथ लिंक कर सकते हैं ताकि समर्थन-उन्मुख तरीके से उनकी आध्यात्मिक साधना और होमवर्क की प्रगति देख सकें।',
      'active': 'सक्रिय',
      'view_practice': 'प्रगति देखें',
      'child_dashboard': 'बाल डैशबोर्ड',
      'view_alerts': 'अलर्ट देखें',
      'emergency_alerts': 'आपातकालीन अलर्ट',
      'no_emergency_alerts': 'कोई आपातकालीन अलर्ट नहीं',
      'emergency_sos_alert': 'आपातकालीन SOS अलर्ट',
      'resolved_on': 'हल किया गया',
      'no_resolved_requests': 'कोई हल किया गया अनुरोध नहीं',
      'requested_on': 'अनुरोधित तिथि',
      'connected_since': 'कनेक्शन तिथि',
      'confirm_unlink_title': 'पारिवारिक संबंध हटाएं?',
      'confirm_unlink_message': 'यह एक्शन आपके पारिवारिक संबंध को हटा देगा और साधना जानकारी साझा करना बंद कर देगा। इसे पूर्ववत नहीं किया जा सकता।',
      'family_link_request': 'पारिवारिक लिंक अनुरोध',
      'practice_and_homework': 'साधना और गृहकार्य',
      'support_learning': 'सीखने में सहायता',
      'no_practice_data': 'कोई साधना डेटा नहीं',
      'not_tracking_practice': 'ने साधना ट्रैकिंग शुरू नहीं की है',
      'practice_summary': 'साधना सारांश',
      'malas_done': 'माला पूर्ण',
      'duration': 'अवधि',
      'bss_attendance': 'बीएसएस उपस्थिति',
      'deadline': 'अंतिम तिथि',
      'attachment': 'संलग्नक',
      'submission': 'प्रस्तुति',
      'late': 'देर से',
      'on_time': 'समय पर',
      'submitted_on': 'प्रस्तुत किया',
      'view_submitted_work': 'प्रस्तुत कार्य देखें (PDF)',
      'homework_accepted': 'गृहकार्य स्वीकार किया गया',
      'needs_revision': 'संशोधन की आवश्यकता',
      'remark_by': 'द्वारा',
      'status_pending': 'लंबित',
      'status_submitted': 'प्रस्तुत',
      'status_checked': 'जांचा गया',
      'minutes_short': 'मिनट',
      'hours_short': 'घं',
      'request_accepted': 'अनुरोध स्वीकार किया गया!',
      // Emergency Help
      'emergency_help': 'आपातकालीन सहायता',
      'emergency_help_subtitle': 'जरूरत पड़ने पर मदद पाएं',
      'need_help_btn': 'मदद चाहिए',
      'alert_family_admin': 'परिवार और व्यवस्थापक को सचेत करें',
      'wait_message': 'कृपया सहायता अनुरोधों के बीच 15 मिनट प्रतीक्षा करें',
      'or_call_directly': 'या सीधे कॉल करें',
      'help_requested_note': 'ऐप के माध्यम से मदद मांगी गई',
      'alert_sent_success': '✅ अलर्ट भेजा गया! मदद रास्ते में है।',
      'emergency_error': 'त्रुटि',
      // Public Groups
      'browse_groups': 'सार्वजनिक समूह देखें',
      'no_public_groups': 'कोई सार्वजनिक समूह उपलब्ध नहीं',
      'no_results': 'कोई परिणाम नहीं मिला',
      'public_group': 'सार्वजनिक समूह',
      'request_to_join': 'शामिल होने का अनुरोध',
      'join_request_sent': 'शामिल होने का अनुरोध भेजा गया',
      // Spiritual Feature
      'sadhana_tracker': 'साधना ट्रैकर',
      'mantra': 'मंत्र',
      'daily_target': 'दैनिक लक्ष्य',
      'malas': 'मालाएं',
      'completion': 'पूर्णता',
      'quotes': 'आध्यात्मिक विचार',
      'achievements': 'उपलब्धियां',
      'lifetime_progress': 'जीवन भर की प्रगति',
      'calendar_heatmap': 'पिछले 30 दिन',
      'personal_records': 'व्यक्तिगत रिकॉर्ड',
      'best_day': 'सर्वश्रेष्ठ दिन',
      'best_streak': 'सर्वश्रेष्ठ क्रम',
      'locked': 'लॉक है',
      'unlocked': 'अनलॉक',
      'reminder_settings': 'रिमाइंडर सेटिंग्स',
      'daily_reminder': 'दैनिक रिमाइंडर',
      'set_reminder_time': 'रिमाइंडर समय सेट करें',
      'reset_count': 'गणना रीसेट करें',
      'reset_count_confirm': 'क्या आप आज की गणना रीसेट करना चाहते हैं?',
      'total_malas': 'कुल मालाएं',
      'active_days': 'सक्रिय दिन',
      'this_week': 'इस सप्ताह',
      'this_month': 'इस महीने',
      'mantra_distribution': 'मंत्र वितरण',
      'start_sadhana_analytics': 'एनालिटिक्स देखने के लिए साधना शुरू करें!',
      'please_login_analytics': 'एनालिटिक्स देखने के लिए कृपया लॉगिन करें',
      'select_mantra': 'मंत्र चुनें',
      'tap_count': 'गिनने के लिए टैप करें या दबाए रखें',
      'counting': 'गिन रहे हैं...',
      'target': 'लक्ष्य',
      'total_count': 'कुल जाप',
      'daily_progress': 'दैनिक प्रगति',
      'target_met': 'लक्ष्य पूरा हुआ!',
      'add_full_mala': 'पूर्ण माला जोड़ें (+108)',
      'complete_mala_btn': 'माला पूरी करें',
      'complete_mala_title': 'माला पूरी करें?',
      'confirm_complete_mala': 'आप यह माला पूरी करने वाले हैं।',
      'mala_completed_title': 'माला पूरी हुई!',
      'unlocked_prefix': 'अनलॉक:',
      // Achievements Data
      'achv_first_mala_title': 'ओम शांति',
      'achv_first_mala_desc': '108 मंत्रों की अपनी पहली माला पूरी करें।',
      'achv_streak_7_title': 'साधक',
      'achv_streak_7_desc': 'लगातार 7 दिनों तक साधना बनाए रखें।',
      'achv_streak_30_title': 'योगी',
      'achv_streak_30_desc': 'लगातार 30 दिनों तक साधना बनाए रखें।',
      'achv_malas_108_title': 'भक्त',
      'achv_malas_108_desc': 'कुल 108 मालाएं पूरी करें।',
      'achv_malas_1008_title': 'मंत्र विशेषज्ञ',
      'achv_malas_1008_desc': 'कुल 1008 मालाएं पूरी करें। एक सच्ची उपलब्धि।',
      // Groups Feature Extended
      'create_new_group': 'नया समूह बनाएं',
      'group_type_label': 'समूह प्रकार',
      'event_group': 'इवेंट',
      'bss_group_title': 'बाल संस्कार शाला',
      'meeting_group': 'बैठक',
      'custom_group': 'कस्टम',
      'only_admin_create_bss': 'केवल एडमिन और गुरुजी बीएसएस समूह बना सकते हैं',
      'select_branch_error': 'कृपया एक शाखा चुनें',
      'select_guruji_error': 'कृपया गुरुजी चुनें',
      'enable_attendance': 'उपस्थिति ट्रैकिंग सक्षम करें',
      'allow_marking_attendance': 'इस बैठक के लिए उपस्थिति चिह्नित करने की अनुमति दें',
      'public_group_label': 'सार्वजनिक समूह',
      'private_group_label': 'निजी समूह',
      'public_group_desc': 'कोई भी इस समूह को खोज सकता है और शामिल होने का अनुरोध कर सकता है',
      'private_group_desc': 'केवल आमंत्रित सदस्य ही इस समूह को देख और शामिल हो सकते हैं',
      'public_group_approval_note': 'सार्वजनिक समूहों को सभी के लिए दृश्यमान होने से पहले एडमिन की मंजूरी की आवश्यकता होती है।',
      'group_created_approval': 'समूह बनाया गया! सार्वजनिक होने के लिए एडमिन की मंजूरी की प्रतीक्षा है।',
      'group_created_success': 'समूह सफलतापूर्वक बनाया गया!',
      'edit_group_title': 'समूह संपादित करें',
      'delete_group_title': 'समूह हटाएं?',
      'delete_group_confirm': 'क्या आप वाकई "{groupName}" को हटाना चाहते हैं? इसे पूर्ववत नहीं किया जा सकता।',
      'group_name_empty_error': 'समूह का नाम खाली नहीं हो सकता',
      'group_updated_success': 'समूह सफलतापूर्वक अपडेट किया गया',
      'group_deleted_success': 'समूह सफलतापूर्वक हटाया गया',
      'join_request_success_waiting': 'शामिल होने का अनुरोध भेजा गया! एडमिन की मंजूरी की प्रतीक्षा है।',
      'check_back_later_groups': 'शामिल होने के लिए नए समूहों के लिए बाद में देखें',
      'try_different_search': 'एक अलग खोज शब्द का प्रयास करें',
      'no_public_groups_avail': 'कोई सार्वजनिक समूह उपलब्ध नहीं',
      'search_groups_hint': 'समूह खोजें...',
      // Browse Groups Extended
      'available_to_join': 'जुड़ने के लिए उपलब्ध',
      'your_public_groups': 'आपके सार्वजनिक समूह',
      'no_public_groups_joined': 'कसी भी सार्वजनिक समूह में शामिल नहीं हैं',
      'groups_you_join_appear_here': 'जिन समूहों में आप शामिल होंगे वे यहाँ दिखाई देंगे',
      'no_groups_created': 'कोई समूह नहीं बनाया गया',
      'public_groups_you_create_appear_here': 'आपके द्वारा बनाए गए सार्वजनिक समूह यहाँ दिखाई देंगे',
      'no_groups_with_status': 'इस स्थिति वाला कोई समूह नहीं',
      'your_group_requests': 'आपके समूह अनुरोध',
      'all_groups_joined_or_none': 'सभी सार्वजनिक समूह शामिल हो चुके हैं या कोई उपलब्ध नहीं है',
      'explore': 'एक्सप्लोर',
      'public_groups_title': 'सार्वजनिक समूह',
      // Admin Emergency Requests (Hindi)
      'no_active_emergency_requests': 'कोई सक्रिय आपातकालीन अनुरोध नहीं',
      'urgent': 'अत्यावश्यक',
      'request_acknowledged': 'अनुरोध स्वीकृत हुआ',
      'request_resolved': 'अनुरोध हल हुआ',
      'no_phone_available': 'कोई फोन नंबर उपलब्ध नहीं',
      'could_not_launch_dialer': 'डायलर नहीं खुल सका',
      'no_phone_linked': 'खाते से कोई फोन नंबर जुड़ा नहीं है',
      'loading_contact_info': 'संपर्क जानकारी लोड हो रही है...',
      'acknowledge': 'स्वीकार करें',
      'resolve': 'हल करें',
      'call': 'कॉल करें',
      // Admin Emergency Contacts (Hindi)
      'no_sos_contacts_yet': 'अभी तक कोई SOS संपर्क नहीं',
      'tap_to_add_one': 'जोड़ने के लिए + टैप करें',
      'delete_contact': 'संपर्क हटाएं',
      'delete_contact_confirm': 'क्या आप इस संपर्क को हटाना चाहते हैं?',
      'select_role': 'भूमिका चुनें',
      // Family Linking (Hindi)
      'family_link_requests_empty': 'परिवार लिंक अनुरोध यहां दिखाई देंगे',
      'family_connection_removed': 'परिवार कनेक्शन हटाया गया',
      'search_by_email_or_username': 'ईमेल या @यूजरनेम से खोजें',
      'searching_for_user': 'खोज रहे हैं...',
      'already_linked': 'आप इस उपयोगकर्ता से पहले से जुड़े हैं',
      'pending_request_exists': 'एक लंबित अनुरोध पहले से मौजूद है',
      'cannot_link_to_self': 'आप खुद से लिंक नहीं कर सकते',
      'request_sent_success': 'अनुरोध सफलतापूर्वक भेजा गया!',
      'accept_request': 'स्वीकार करें',
      'decline_request': 'अस्वीकार करें',
      'sent_requests': 'भेजे गए अनुरोध',
      'received_requests': 'प्राप्त अनुरोध',
      'unlink_family': 'अनलिंक करें',
      'unlink_confirm_title': 'परिवार सदस्य को अनलिंक करें',
      'unlink_confirm_body': 'क्या आप इस परिवार सदस्य को अनलिंक करना चाहते हैं?',
      'relation_type_parent': 'माता-पिता',
      'relation_type_child': 'बच्चा',
      'relation_type_spouse': 'पति/पत्नी',
      'relation_type_sibling': 'भाई-बहन',
      'relation_type_other': 'अन्य',
      // Anushthan & Gamification
      'start_anushthan': 'अनुष्ठान प्रारंभ करें',
      'active_anushthan': 'सक्रिय अनुष्ठान',
      'active_anushthan_warning': 'आपका एक अनुष्ठान पहले से सक्रिय है। कृपया पहले उसे पूरा करें या रोकें।',
      'anushthan_history': 'अनुष्ठान इतिहास',
      'duration_days': '{days} दिन',
      'start_date': 'प्रारंभ तिथि',
      'end_date': 'समाप्ति तिथि',
      'expected_end_date': 'अपेक्षित समाप्ति',
      'malas_completed': 'माला पूर्ण',
      'daily_target_malas': 'दैनिक लक्ष्य (माला)',
      'no_completed_anushthans': 'अभी तक कोई अनुष्ठान पूर्ण नहीं हुआ',
      'start_first_anushthan': 'अपनी आध्यात्मिक यात्रा शुरू करने के लिए पहला अनुष्ठान शुरू करें!',
      'total_days': 'कुल दिन',
      'days_left': '{count} दिन शेष',
      'log_todays_practice': 'आज की साधना दर्ज करें',
      'view_certificate': 'प्रमाण पत्र देखें',
      'sadhana_record': 'साधना रिकॉर्ड',
      'anushthan_completion': 'अनुष्ठान पूर्णता',
      'share_blessings': 'आशीर्वाद साझा करें',
      'certificate_saved_to': 'प्रमाण पत्र {path} पर सहेजा गया',
      'error_sharing_pdf': 'PDF साझा करने में त्रुटि',
      'error_saving_pdf': 'PDF सहेजने में त्रुटि',
      'my_spiritual_journey': 'मेरी आध्यात्मिक यात्रा',
      'milestones': 'मील के पत्थर',
      'pause_anushthan': 'अनुष्ठान रोकें',
      'resume_anushthan': 'अनुष्ठान फिर से शुरू करें',
      'guruji_visibility': 'गुरुजी दृश्यता',
      'committed_practice_desc': 'प्रतिबद्ध आध्यात्मिक अभ्यास',
      'choose_mantra_hint': 'मंत्र चुनें',
      'days_suffix': 'दिन',
      'mantras_per_day': '{count} मंत्र प्रतिदिन',
      'begin_anushthan': 'अनुष्ठान शुरू करें',
      'anushthan_started_success': '🙏 अनुष्ठान शुरू हुआ! आपकी साधना सफल हो।',
      'malas_daily_format': '{count} माला / दिन',
      'duration_short': 'लघु',
      'duration_medium': 'मध्यम',
      'duration_long': 'दीर्घ',
      'duration_extended': 'विस्तृत',
      
      // Anushthan Status & UI
      'active_status': 'सक्रिय',
      'resting_status': 'विश्राम',
      'completed_status': 'पूर्ण',
      'paused_status': 'रुका हुआ',
      'day_label': 'दिन',
      'remaining_label': 'शेष',
      'todays_practice_pending': 'आज की साधना शेष है',
      'todays_practice_complete': 'आज की साधना पूर्ण ✓',
      'anushthan_in_progress': 'अनुष्ठान प्रगति पर है',
      'start_anushthan_subtitle': '7, 11, 21 या 40 दिनों की साधना का संकल्प लें',
      'total_malas_today': 'कुल: आज {count} माला',
      'x_of_y_malas': '{x} / {y} माला',

      // Group Homework
      'view_submissions': 'सबमिशन देखें',
      'assign_homework': 'होमवर्क सौंपें',
      'edit_homework': 'होमवर्क संपादित करें',
      'update_homework': 'होमवर्क अपडेट करें',
      'delete_homework_title': 'होमवर्क हटाएं',
      'delete_homework_confirm': 'क्या आप वाकई इस होमवर्क को हटाना चाहते हैं? इसे पूर्ववत नहीं किया जा सकता।',
      'due_date_label': 'नियत तिथि',
      'assigned_by_label': 'द्वारा: {name}',
      'overdue': 'अदेय',
      'no_homework_assigned': 'अभी तक कोई होमवर्क नहीं सौंपा गया',
      'homework_title': 'होमवर्क शीर्षक',
      'title_required': 'शीर्षक आवश्यक है',
      'description_required': 'विवरण आवश्यक है',
      'attachments_optional': 'संलग्नक (वैकल्पिक)',
      'no_attachments': 'कोई संलग्नक नहीं',
      'attachment_count': '{count} फ़ाइलें',
      'submissions_title': 'सबमिशन',
      'no_submissions_yet': 'अभी तक कोई सबमिशन नहीं',
      'your_submitted_pdf': 'आपका सबमिट किया गया PDF',
      'view_submission_pdf': 'सबमिशन PDF देखें',
      'update_status_review': 'स्थिति / समीक्षा अपडेट करें',
      'redo_needed': 'पुनः करने की आवश्यकता है',
      'mark_checked': 'जांचा गया चिह्नित करें',
      'request_redo': 'पुनः करने का अनुरोध करें',
      'comment_optional': 'टिप्पणी (वैकल्पिक)',
      'add_feedback_hint': 'छात्र के लिए प्रतिक्रिया जोड़ें...',
      'submissions_closed_msg': 'इस होमवर्क के लिए सबमिशन बंद हैं।',
      'homework_assigned_success': 'होमवर्क सफलतापूर्वक सौंपा गया!',
      'homework_updated_success': 'होमवर्क सफलतापूर्वक अपडेट किया गया!',
      'homework_submitted_success': 'होमवर्क सफलतापूर्वक सबमिट किया गया!',
      'stop_receiving_submissions': 'सबमिशन प्राप्त करना बंद करें',
      'stop_submissions_subtitle': 'भविष्य में नियत तिथि होने पर भी मैन्युअल रूप से सबमिशन बंद करें',
      'upload_submission': 'सबमिशन अपलोड करें',
      'submit_homework': 'होमवर्क सबमिट करें',
      'resubmit_homework': 'होमवर्क फिर से सबमिट करें',
      'upload_pdf_helper': 'अपने काम की एक पीडीएफ फाइल अपलोड करें',
      'uploading': 'अपलोड हो रहा है...',
      'select_pdf_file': 'PDF फ़ाइल चुनें',
      'submission_status_submitted': 'जमा किया',
      'submission_status_redo': 'फिर से करें',
      'submission_status_checked': 'जांचा गया',
      'submission_status_not_done': 'नहीं किया',
      'attachment_label': 'संलग्नक',
      
      'certificate_blessing': '🙏 आपकी भक्ति आपको शांति और आशीर्वाद प्रदान करे 🙏',
      'marker_first_steps_title': 'पहला कदम',
      'marker_first_steps_desc': 'अपनी पहली माला पूरी करें (108 मंत्र)',
      'marker_consistent_yogi_title': 'निरंतर योगी',
      'marker_consistent_yogi_desc': 'लगातार 3 दिनों तक अभ्यास करें',
      'marker_dedicated_disciple_title': 'समर्पित शिष्य',
      'marker_dedicated_disciple_desc': '7 दिनों का क्रम बनाए रखें',
      'marker_century_club_title': 'शतक क्लब',
      'marker_century_club_desc': 'कुल 100 माला पूरी करें',
      'marker_mantra_master_title': 'मंत्र मास्टर',
      'marker_mantra_master_desc': 'कुल 1,000 मंत्रों का जाप करें',
      'marker_anushthan_adept_title': 'अनुष्ठान निपुण',
      'marker_anushthan_adept_desc': 'अपना पहला अनुष्ठान पूरा करें',
      'marker_early_riser_title': 'प्रातःकाल साधक',
      'marker_early_riser_desc': 'सुबह 6 बजे से पहले एक माला पूरी करें',
      'marker_digital_monk_title': 'डिजिटल साधक',
      'marker_digital_monk_desc': '30 दिनों तक साधना ट्रैकर का उपयोग करें',
      'marker_first_seva_title': 'पहली सेवा',
      'marker_first_seva_desc': 'अपनी पहली सेवा गतिविधि पूरी करें',
      'tap_members_view_details': 'विवरण देखने के लिए सदस्यों पर टैप करें',
      'no_groups_joined_guidance': 'आप अभी तक किसी भी समूह में शामिल नहीं हुए हैं',
      'join_group_guidance': 'मार्गदर्शन देखने के लिए समूह में शामिल हों',
      'batch': 'बैच',
      'request_sent_label': 'अनुरोध भेजा गया',
      'request_received_label': 'अनुरोध प्राप्त',
      'already_connected_msg': 'आप पहले से ही इस उपयोगकर्ता से जुड़े हुए हैं।',
      'request_pending_msg': 'आपके और इस उपयोगकर्ता के बीच एक अनुरोध पहले से लंबित है।',
      'no_attendance_records': 'अभी तक कोई उपस्थिति रिकॉर्ड नहीं',
      'app_preferences': 'ऐप प्राथमिकताएँ',
      'reset_tutorial': 'ट्यूटोरियल रीसेट करें',
      'reset_tutorial_subtitle': 'ऐप टूर फिर से देखें',
      'linked_storage_folder': 'लिंक्ड स्टोरेज फोल्डर',
      'no_folder_linked': 'कोई फोल्डर लिंक नहीं है',
      'change': 'बदलें',
      'filter_options': 'फ़िल्टर विकल्प',
      'no_date_set': 'कोई तारीख सेट नहीं',
      'search_by_name': 'नाम से खोजें...',
      'no_users_found': 'कोई उपयोगकर्ता नहीं मिला',
      'mandir_services': 'मंदिर सेवाएं',
      'seva_volunteer': 'सेवा (स्वयंसेवी)',
      'offline_backup_message': '📱 आपकी गिनतियाँ इस डिवाइस पर सुरक्षित रूप से सहेजी गई हैं।\nजब आप ऑनलाइन होंगे तो वे स्वचालित रूप से बैकअप हो जाएंगी।',
      'history': 'इतिहास',
      'sadhana_history': 'साधना इतिहास',
      'no_records_yet': 'अभी तक कोई रिकॉर्ड नहीं',
      'day_streak': 'दिन की लगातार साधना!',
      'keep_flame_alive': 'ज्योति जलाए रखें!',
      'complete_mala_start': 'शुरू करने के लिए एक माला पूरी करें',
      'malas_label': 'माला',
      'please_login': 'कृपया लॉगिन करें',
      'no_emergency_contacts': 'कोई आधिकारिक आपातकालीन संपर्क सूचीबद्ध नहीं हैं।',
      'select_folder': 'फ़ोल्डर चुनें',
      'clear_selection': 'चयन हटाएँ',
      'select_current': 'वर्तमान चुनें',
      'activity_guruji_approved_item_detail': 'गुरुजी ने {item} स्वीकृत किया',
      'activity_guruji_rejected_item_detail': 'गुरुजी ने {item} अस्वीकार किया — कारण: {reason}',
      'activity_approved_all_detail': 'गुरुजी ने सभी सामग्री स्वीकृत की — संपादन लॉक है',
      'activity_revision_requested_detail': 'गुरुजी ने संशोधन का अनुरोध किया: {reason}',
      'activity_user_revised_detail': 'उपयोगकर्ता ने अनुरोध संशोधित किया।',
      'activity_user_selected_item_detail': 'उपयोगकर्ता ने चुना: {item} ✓',
      'activity_user_deselected_item_detail': 'उपयोगकर्ता ने हटाया: {item}',
      'activity_guruji_volunteered_detail': '{name} ने इस अनुरोध के लिए स्वयंसेवा की',
      'activity_guruji_left_note_detail': 'गुरुजी ने एक नोट छोड़ा',
      'activity_admin_left_note_detail': 'एडमिन ने उत्तर दिया',
      'manage_roles': 'भूमिकाएं प्रबंधित करें',
      'default_roles': 'डिफ़ॉल्ट भूमिकाएं',
      'custom_roles': 'समूह भूमिकाएं',
      'add_role': 'नई भूमिका जोड़ें',
      'role_name': 'भूमिका का नाम',
      'enter_role_name': 'भूमिका का नाम दर्ज करें (जैसे क्लास मॉनिटर)',
      'role_added': 'भूमिका सफलतापूर्वक जोड़ी गई',
      'role_updated': 'भूमिका सफलतापूर्वक अपडेट की गई',
      'role_deleted': 'भूमिका सफलतापूर्वक हटा दी गई',
      'cannot_edit_global_role': 'डिफ़ॉल्ट भूमिकाओं को संपादित नहीं किया जा सकता',
      'seva_opportunities': 'सेवा के अवसर',
      // Seva Assignment Workflow
      'seva_assignments': 'आपकी सौंपी गई सेवाएं',
      'no_assignments': 'अभी तक कोई सेवा सौंपी नहीं गई',
      'will_be_notified': 'जब Admin आपको सेवा प्रबंधन के लिए सौंपेंगे तो सूचित किया जाएगा',
      'pending_response': 'आपकी प्रतिक्रिया की प्रतीक्षा में',
      'admin_notes': 'Admin की टिप्पणी',
      'accept_assignment': 'स्वीकार करें',
      'reject_assignment': 'अस्वीकार करें',
      'assignment_accepted': 'स्वीकृत',
      'assignment_rejected': 'अस्वीकृत',
      'assignment_pending': 'लंबित',
      'confirm_accept_title': 'स्वीकृति की पुष्टि करें',
      'confirm_accept_msg': 'क्या आप निश्चित हैं कि आप यह सेवा सौंपना स्वीकार करना चाहते हैं?',
      'you_will_be_responsible': 'आप जिम्मेदार होंगे',
      'managing_attendance': 'प्रतिभागियों की उपस्थिति प्रबंधित करने के लिए',
      'giving_appreciation': 'स्वयंसेवकों को सराहना देने के लिए',
      'confirm_accept_btn': 'स्वीकार करें पुष्टि करें',
      'rejection_reason_title': 'अस्वीकृति का कारण',
      'rejection_reason_min': 'कृपया एक कारण दें (कम से कम 10 अक्षर)',
      'submit_rejection': 'अस्वीकृति सबमिट करें',
      'will_notify_admin': 'यह Admin को सूचित करेगा',
      'admin_message_optional': 'गुरुजी के लिए वैकल्पिक संदेश',
      'admin_message_hint': 'उदा., कृपया 30 मिनट पहले पहुंचें',
      'day_x_of_y': 'दिन {day} / {total}',
      'select_gurujis': 'गुरुजी चुनें',
      'search_gurujis': 'गुरुजी खोजें...',
      'assignment_status': 'सौंपने की स्थिति',
      'only_assigned_gurujis': 'केवल सौंपे गए गुरुजी ही इस सेवा का प्रबंधन कर सकते हैं',
      'accepted_on': 'स्वीकार किया गया',
      'rejected_on': 'अस्वीकार किया गया',
      'assigned_on': 'सौंपा गया',
      // Service Request Fields
      'enter_description': 'सेवा विवरण दर्ज करें',
      'select_date': 'तिथि चुनें',
      'select_time': 'समय चुनें',
      'flat_floor_hint': 'उदा. 201, दूसरी मंजिल',
      'building_hint': 'उदा., गायत्री अपार्टमेंट',
      'street_hint': 'उदा., एमजी रोड',
      'landmark_hint': 'उदा., सिटी हॉस्पिटल के पास',
      // My Requests
      'search_by_description_address': 'विवरण या पते से खोजें...',
      'all_status': 'सभी स्थिति',
      // Service Status Labels
      'status_accepted': 'स्वीकृत',
      'status_unavailable': 'अनुपलब्ध',
      'status_completed': 'पूर्ण',
      // News Categories
      'news_and_updates': 'समाचार और अपडेट',
      'news_category_all': 'सभी',
      'news_category_spiritual': 'आध्यात्मिक',
      'news_category_events': 'कार्यक्रम',
      'news_category_seva': 'सेवा',
      'news_category_youth': 'युवा',
      'news_category_notices': 'सूचनाएं',
      'news_category_magazine': 'पत्रिका',
      // Additional Service Request Keys
      'house_no_hint': 'मकान नं',
      'contact_number': 'संपर्क नंबर',
      'alternate_contact_hint': 'वैकल्पिक संपर्क (वैकल्पिक)',
      'landmark': 'लैंडमार्क',
      'news_updates': 'समाचार और अपडेट',
      'youth': 'युवा',
      'search_description_address': 'विवरण या पते से खोजें',
      // Admin & Guruji Dashboard
      'admin_dashboard_title': 'प्रशासक डैशबोर्ड',
      'access_denied_admin': 'पहुंच अस्वीकृत। केवल प्रशासकों के लिए।',
      'menu_calendar': 'कैलेंडर',
      'menu_branches': 'शाखाएं',
      'menu_gurujis': 'गुरुजी',
      'menu_news': 'समाचार',
      'menu_attendance': 'उपस्थिति',
      'menu_services': 'सेवाएं',
      'menu_spiritual': 'आध्यात्मिक',
      'menu_requests': 'अनुरोध',
      'menu_seva_ops': 'सेवा ऑब्स',
      'menu_media': 'मीडिया',
      'menu_important_info': 'महत्वपूर्ण जानकारी',
      'menu_public_groups': 'सार्वजनिक समूह',
      'quick_actions': 'त्वरित कार्रवाई',
      'available_requests_title': 'उपलब्ध अनुरोध',
      'awaiting_admin_assignment': 'प्रशासक असाइनमेंट की प्रतीक्षा है',
      'yajman_label': 'यजमान',
      'contact_label': 'संपर्क',
      'select_day_schedule': 'अनुसूची देखने के लिए एक दिन चुनें',
      'not_possible_btn': 'संभव नहीं',
      'volunteered': 'स्वयंसेवा की',
      'no_services_today': 'आज कोई सेवा निर्धारित नहीं है',
      'enjoy_day': 'आपका दिन शुभ हो!',
      'no_new_requests': 'कोई नया अनुरोध नहीं',
      'check_back_later_requests': 'नए अनुरोधों के लिए बाद में देखें',
      'tab_today': 'आज',
      'tab_new_requests': 'नए अनुरोध',
      'tab_my_assigned': 'सौंपा गया',
      // Home Screen & Festival
      'today_celebrations_title': "आज के उत्सव 🎉",
      'celebration_single_msg': "आज {name} का विशेष दिन है! अपना आशीर्वाद भेजें।",
      'celebration_multiple_msg': "आज {count} उत्सव हैं! अपना आशीर्वाद भेजें।",
      'festival_default_desc': "आज का विशेष त्यौहार!",
      'primary_festival_badge': "मुख्य त्यौहार",
      'swipe_to_dismiss': "हटाने के लिए स्वाइप करें →",
      'dashboard_stat_total': 'कुल',
      'dashboard_stat_upcoming': 'आगामी',
      'dashboard_stat_completed': 'पूर्ण',
      'no_seva_assignments': 'कोई सेवा कार्य नहीं',
      'no_assigned_requests': 'कोई अनुरोध नहीं सौंपा गया',

      // Common Missing Keys
      'reset': 'रीसेट',
      'continue_with_google': 'Google के साथ जारी रखें',
      'verify_password': 'पासवर्ड सत्यापित करें',
      'verify_password_desc': 'कृपया अपनी पहचान सत्यापित करने के लिए अपना पासवर्ड दर्ज करें',
      'verify': 'सत्यापित करें',
      'incorrect_password': 'गलत पासवर्ड',
      'profile_updated': 'प्रोफ़ाइल अपडेट की गई',
      'failed_save': 'सहेजने में विफल',
      'select_interest_error': 'कृपया एक रुचि चुनें',
      'select_location': 'स्थान चुनें',
      'select_location_error': 'कृपया स्थान चुनें',
      'enter_phone_error': 'फ़ोन नंबर दर्ज करें',
      'open': 'खोलें',
      'check_out_resource': 'इस संसाधन को देखें',
      'error_url_empty': 'URL खाली है',
      'cannot_download_video': 'वीडियो डाउनलोड नहीं किया जा सकता',
      'no_description': 'कोई विवरण नहीं',
      'error_cannot_launch': 'लॉन्च नहीं किया जा सका',
      'resend_otp': 'OTP पुनः भेजें',
      'resend_code_in': 'कोड पुनः भेजें',
      'otp_sent_success': 'OTP भेजा गया',
      'search_by_description': 'विवरण से खोजें',
      'preferred': 'पसंदीदा',
      'tab_calendar': 'कैलेंडर',
      'confirm_assignment': 'असाइनमेंट की पुष्टि करें',
      'unable_to_attend': 'उपस्थित नहीं हो सकते',
      'open_directions': 'दिशाएं खोलें',
      'approve_all': 'सभी स्वीकृत करें',
      'request_revision': 'संशोधन अनुरोध',
      'save_notes': 'नोट्स सहेजें',
      'saving': 'सहेज रहा है...',
      'your_notes_to_admin': 'व्यवस्थापक को आपके नोट्स',
      'add_notes_hint': 'नोट्स जोड़ें...',
      'samagri_actions': 'सामग्री क्रियाएं',
      'samagri_approved_locked': 'सामग्री स्वीकृत और लॉक',
      // Audit Fixes 2.5 - Remaining Missing Keys
      'select_date_time_error': 'कृपया पसंतीची तारीख आणि वेळ निवडा',
      'request_updated': 'विनंती यशस्वीरित्या अपडेट केली',
      'request_submitted': 'विनंती यशस्वीरित्या सबमिट केली',
      'notes_hint': 'कोणत्याही विशेष गरजा...',
      'haptic_feedback': 'हॅप्टिक फीडबॅक',
      'vibration_on_tap': 'टॅपवर व्हायब्रेशन',
      'clear_progress': 'प्रगती पुसा',
      'scheduled_for': 'साठी नियोजित',
      'daily_nudge': 'दैनिक आठवण',
      'reminder_time_label': 'रिमाइंडर वेळ',
      'vibration_on': 'चालू',
      'vibration_off': 'बंद',
      'analytics': 'अॅनालिटिक्स',
      'add_mantra_title': 'मंत्र जोडा',
      'mantra_name_label': 'मंत्राचे नाव',
      'mantra_desc_label': 'वर्णन',
      'mantra_desc_hint': 'महत्व किंवा अर्थ',
      'enter_mantra_name_error': 'मंत्राचे नाव प्रविष्ट करा',
      'add_btn': 'जोडा',
      'cancel_btn': 'रद्द करा',
      'complete_with_gratitude': 'कृतज्ञतेसह पूर्ण करा',
      'share_your_gratitude': 'आपली कृतज्ञता सामायिक करा',
      'select_badge_type': 'बॅज प्रकार निवडा',
      'seva_contributions': 'सेवा योगदान',
      'appreciations_received': 'प्रशंसा प्राप्त झाल्या',
      'no_appreciations_yet': 'अद्याप कोणतीही प्रशंसा नाही',
      'appreciation_sent': 'प्रशंसा पाठविली',
      'character_count': 'अक्षरे',
      'please_share_gratitude': 'कृपया आपली कृतज्ञता सामायिक करा',
      'write_at_least_50_chars': 'किमान 50 अक्षरे लिहा',
      'keep_under_200_chars': '200 अक्षरांच्या खाली ठेवा',
      'please_select_badge': 'कृपया बॅज निवडा',
      'already_appreciated': 'आधीच सराहले आहे',
      'gratitude_for_seva': 'सेवेबद्दल कृतज्ञता',
      'seva_appreciated_msg': 'सेवा सराही गई',
      'seva_contributions_recognized': 'सेवा मान्यता प्राप्त',
      'sending_gratitude': 'भेज रहा है...',
      'send_gratitude': 'कृतज्ञता व्यक्त करें',
      'anushthan': 'अनुष्ठान',
      'save_certificate': 'प्रमाणपत्र जतन करा',
      'no_homework_yet': 'अद्याप कोणताही गृहपाठ नाही',
      'no_submitted_homework': 'अद्याप कोणताही गृहपाठ सबमिट केलेला नाही',
      'no_attendance_data': 'उपस्थिती डेटा नाही',
      'tutorial_guruji_sos_title': 'गुरुजी SOS',
      'tutorial_guruji_sos_desc': 'आपातकालीन अनुरोधों के लिए गुरुजी से सहायता प्राप्त करें',


      
      // Group Details (Added)
      'about_label': 'बारे में',
      'chat_label': 'चैट',
      'camera_label': 'कैमरा',
      'video_label': 'वीडियो',
      'audio_label': 'ऑडियो',
      'document_label': 'दस्तावेज़',
      'homework_label': 'होमवर्क',
      'search_messages': 'संदेश खोजें...',
      'filter_by_date': 'तिथि अनुसार फ़िल्टर करें',
      'from_label': 'से',
      'to_label': 'तक',
      'not_set': 'सेट नहीं',
      'clear': 'साफ़ करें',
      'message_deleted': 'यह संदेश हटा दिया गया था',
      'message_deleted_admin': 'यह संदेश एडमिन द्वारा हटाया गया था',
      'message_deleted_guruji': 'यह संदेश गुरुजी द्वारा हटाया गया था',
      'practice_calendar': 'साधना कैलेंडर',
      'allow_guruji_view': 'गुरुजी को देखने की अनुमति दें',
      'guruji_view_desc': 'आपके गुरुजी आपकी प्रगति देख सकते हैं',
      'cert_title': 'अनुष्ठान पूर्णता\nप्रमाणपत्र',
      'cert_subtitle': 'यह प्रमाणित किया जाता है कि',
      'cert_body': 'ने सफलतापूर्वक पूर्ण किया है',
      'cert_blessing': '“आपकी सच्ची साधना आपकी बुद्धि को प्रकाशित करे,\nआपके विचारों को शुद्ध करे और आपको धार्मिक जीवन की ओर ले जाए।”',
      'issue_date': 'जारी करने की तिथि',
      'cert_id': 'प्रमाणपत्र आईडी',
      'digitally_issued_by': 'डिजिटल रूप से जारीकर्ता',
      'cert_disclaimer': 'यह एक डिजिटल रूप से उत्पन्न प्रमाणपत्र है और\nइसमें भौतिक हस्ताक्षर की आवश्यकता नहीं है।',
      'apply': 'लागू करें',
      'no_results_found': 'कोई परिणाम नहीं मिला',
      'leave_group_title': 'समूह छोड़ें?',
      'request_leave_title': 'छोड़ने का अनुरोध?',
      'leave_group_confirm_msg': 'क्या आप वास्तव में "{name}" छोड़ना चाहते हैं?',
      'request_leave_msg': 'आपका अनुरोध गुरुजी/एडमिन को भेजा जाएगा।',
      'only_guruji_leave_error': 'आप एकमात्र गुरुजी हैं। छोड़ने से पहले दूसरे गुरुजी जोड़ें।',
      'leave_request_sent': 'अनुरोध भेजा गया। स्वीकृति की प्रतीक्षा है।',
      'left_group_success': 'आपने समूह छोड़ दिया है',
      'pending_approval_title': 'एडमिन स्वीकृति की प्रतीक्षा',
      'pending_approval_msg': 'स्वीकृति के बाद चैट, कार्यक्रम और सदस्य प्रबंधन उपलब्ध होंगे।',
      'pending_join_requests': 'लंबित अनुरोध ({count})',
      
      // Manage Resources (Hindi)
      'manage_resources': 'संसाधन प्रबंधित करें',
      'search_by_title': 'शीर्षक से खोजें...',
      'all_types': 'सभी प्रकार',
      'no_matching_resources': 'कोई मेल खाते संसाधन नहीं',
      'tap_to_add_resource': 'अपना पहला संसाधन जोड़ने के लिए + टैप करें',
      'resource_type_book': 'पुस्तकें',
      'resource_type_audio': 'ऑडियो',
      'resource_type_bhajan': 'भजन',
      'resource_type_video': 'वीडियो',
      'resource_type_picture': 'चित्र',
      'add_resource': 'संसाधन जोड़ें',
      'edit_resource': 'संसाधन संपादित करें',
      'title_hint': 'जैसे, गायत्री चालीसा',
      'description_hint': 'संक्षिप्त विवरण...',
      'select_type': 'प्रकार चुनें',
      'category_label': 'श्रेणी',
      'no_category_label': 'कोई श्रेणी नहीं',
      'thumbnail_url': 'थंबनेल URL',
      'resource_visible': 'संसाधन उपयोगकर्ताओं को दिखाई दे रहा है',
      'resource_draft': 'संसाधन ड्राफ्ट मोड में है',
      'draft': 'ड्राफ्ट',
      'confirm_delete_resource': 'संसाधन हटाएं?',
      'delete_resource_msg': 'क्या आप सुनिश्चित हैं? इसे पूर्ववत नहीं किया जा सकता।',
      'upload_failed_prefix': 'अपलोड विफल रहा: ',
      'thumbnail_upload_failed_prefix': 'थंबनेल अपलोड विफल रहा: ',
      
      // Resource Categories
      'category_gayatri': 'गायत्री',
      'category_health': 'स्वास्थ्य',
      'category_life_lessons': 'जीवन की सीख',
      'category_devotional': 'भक्ति',
      'category_yoga': 'योग',
      
      // Spiritual Content Management (Hindi)
      'manage_spiritual_content': 'आध्यात्मिक सामग्री प्रबंधित करें',
      'daily_quotes': 'दैनिक सुविचार',
      'meditation_tips': 'ध्यान सुझाव',
      'items_count': '{count} आइटम',
      'manage_daily_quotes': 'दैनिक सुविचार प्रबंधित करें',
      'manage_meditation_tips': 'ध्यान सुझाव प्रबंधित करें',
      'add_quote': 'सुविचार जोड़ें',
      'edit_quote': 'सुविचार संपादित करें',
      'quote_text': 'सुविचार पाठ',
      'enter_quote': 'सुविचार दर्ज करें...',
      'author': 'लेखक',
      'author_hint': 'जैसे, पं. श्रीराम शर्मा आचार्य',
      'image_url_darshan': 'छवि URL (दर्शन के लिए)',
      'tithi_occasion': 'तिथि / अवसर',
      'tithi_hint': 'जैसे, एकादशी, विशेष दिन',
      'schedule_date': 'निर्धारित तिथि',
      'quote_visible': 'सुविचार उपयोगकर्ताओं को दिखाई दे रहा है',
      'quote_draft': 'सुविचार ड्राफ्ट मोड में है',
      'delete_quote': 'सुविचार हटाएं?',
      'no_quotes_yet': 'अभी तक कोई सुविचार नहीं',
      'tap_add_first_quote': 'अपना पहला सुविचार जोड़ने के लिए + टैप करें',
      'add_tip': 'सुझाव जोड़ें',
      'edit_tip': 'सुझाव संपादित करें',
      'tip_title': 'सुझाव शीर्षक',
      'tip_title_hint': 'जैसे, शांत जगह खोजें',
      'explain_tip': 'सुझाव समझाएं...',
      'tip_visible': 'सुझाव उपयोगकर्ताओं को दिखाई दे रहा है',
      'tip_draft': 'सुझाव ड्राफ्ट मोड में है',
      'delete_tip': 'सुझाव हटाएं?',
      'no_tips_yet': 'अभी तक कोई ध्यान सुझाव नहीं',
      'tap_add_first_tip': 'अपना पहला सुझाव जोड़ने के लिए + टैप करें',
      'save_order': 'क्रम सहेजें',
      'reorder': 'पुनः क्रमित करें',
      'url_label': 'लिंक (URL)',
      'url_hint': 'URL दर्ज करें (https://...)',
      'access_denied': 'पहुंच अस्वीकृत',
      'only_admin_guruji': 'केवल एडमिन या गुरुजी ही इस पृष्ठ तक पहुंच सकते हैं।',
      
      // Manage Calendar (Hindi)
      'manage_calendar_events': 'कैलेंडर कार्यक्रम प्रबंधित करें',
      'load_holidays': 'छुट्टियां लोड करें',
      'load_public_holidays': 'सार्वजनिक छुट्टियां लोड करें',
      'select_year_load_holidays': 'भारतीय सार्वजनिक छुट्टियां लोड करने के लिए एक वर्ष चुनें।',
      'year_label': 'वर्ष {year}',
      'add_new_event': 'नया कार्यक्रम जोड़ें',
      'add_event': 'कार्यक्रम जोड़ें',
      'event_title': 'कार्यक्रम का शीर्षक',
      'event_category': 'श्रेणी',
      'event_icon': 'आइकन (इमोजी)',
      'event_icon_hint': 'जैसे 🕉️',
      'festival_settings': 'त्योहार सेटिंग्स',
      'primary_festival_date': 'इस तिथि के लिए प्राथमिक त्योहार',
      'primary_festival_desc': 'पूरे ऐप की थीम को नियंत्रित करता है',
      'theme_color_hex': 'थीम रंग (Hex)',
      'pick_color': 'रंग चुनें',
      'banner_image': 'बैनर छवि',
      'upload_label': 'अपलोड',
      'pick_banner_image': 'बैनर छवि चुनें',
      'banner_url': 'बैनर URL',
      'suggested_mantra_id': 'सुझाया गया मंत्र आईडी (वैकल्पिक)',
      'suggested_mantra_hint': 'जैसे, gayatri, devi',
      'festival_description_localized': 'त्योहार का विवरण (स्थानीयकृत)',
      'primary_festival_indicator': 'प्राथमिक',
      'holidays_loaded_success': '{year} के लिए छुट्टियां लोड की गईं!',
      'delete_event_title': 'कार्यक्रम हटाएं?',
      'delete_event_confirm_with_title': 'क्या आप निश्चित हैं कि आप "{title}" हटाना चाहते हैं?',
      'no_events_found': 'कोई कार्यक्रम नहीं मिला। एक जोड़ें!',
      'pick_theme_color': 'थीम रंग चुनें',
      'select_btn': 'चुनें',
      'holidays_loaded': '{year} के लिए छुट्टियां लोड की गईं!',
      'error_occurred': 'त्रुटि: {error}',
      'event_category_festival': 'त्योहार',
      'event_category_tithi': 'तिथि',
      'event_category_mandir_event': 'मंदिर कार्यक्रम',
      'event_updated_success': 'कार्यक्रम सफलतापूर्वक अपडेट किया गया!',
      'banner_upload_success': 'बैनर छवि सफलतापूर्वक अपलोड की गई!',
      'expired': 'समाप्त',
      'news_management': 'समाचार प्रबंधन',
      'create_news': 'समाचार बनाएं',
      'edit_news': 'समाचार संपादित करें',
      'no_news_created': 'अभी तक कोई समाचार नहीं बनाया गया।',
      'delete_news_title': 'समाचार हटाएं',
      'delete_news_confirm': 'क्या आप वाकई इस समाचार को हटाना चाहते हैं?',
      'tap_to_pick_image': 'छवि चुनने के लिए टैप करें',
      'image_url_optional': 'छवि URL (वैकल्पिक)',
      'image_url_hint': 'या यहां छवि लिंक पेस्ट करें',
      'enter_news_title': 'समाचार का शीर्षक दर्ज करें',
      'short_description_hint': 'कार्ड के लिए संक्षिप्त सारांश',
      'full_article_content': 'पूरा लेख सामग्री',
      'mark_as_important': 'महत्वपूर्ण के रूप में चिह्नित करें',
      'high_priority_notify': 'उच्च प्राथमिकता अधिसूचना भेजता है',
      'schedule_publishing': 'प्रकाशन शेड्यूल करें',
      'pick_date_time': 'दिनांक और समय चुनें',
      'change_date_time': 'दिनांक और समय बदलें',
      'leave_empty_immediate': 'तुरंत प्रकाशित करने के लिए खाली छोड़ दें',
      'responsible_contact_person': 'जिम्मेदार संपर्क व्यक्ति',
      'role_title': 'भूमिका / शीर्षक',
      'role_title_hint': 'जैसे: संपादक',
      'contact_phone_hint': '+91 XXXXX XXXXX',
      'save_draft': 'ड्राफ्ट सहेजें',
      'publish_news': 'समाचार प्रकाशित करें',
      'draft_saved': 'ड्राफ्ट सहेजा गया',
      'news_published': 'समाचार प्रकाशित हुआ',
      'select_image_or_url': 'कृपया एक छवि चुनें या एक URL दर्ज करें',
      'published': 'प्रकाशित',
      'scheduled': 'शेड्यूल्ड',
      'important': 'महत्वपूर्ण',
      'short_description': 'संक्षिप्त विवरण',
      'category': 'श्रेणी',
      'is_required': 'आवश्यक है',
      'attendance_analytics': 'उपस्थिति विश्लेषण',
      'attendance_trend': 'उपस्थिति रुझान',
      'member_performance': 'सदस्य प्रदर्शन',
      'highest_percent': 'उच्चतम %',
      'lowest_percent': 'न्यूनतम %',
      'alphabetical': 'वर्णानुक्रम',
      'mark_all_present': 'सभी को उपस्थित चिह्नित करें',
      'mark_all_absent': 'सभी को अनुपस्थित चिह्नित करें',
      'sessions': 'सत्र',
      'no_attendance_for_date': 'इस तिथि के लिए कोई उपस्थिति निर्धारित नहीं है',
      'add_attendance_date': 'उपस्थिति तिथि जोड़ें',
      'cannot_view_future_dates': 'भविष्य की तिथियां नहीं देख सकते',
      'no_data_for_chart': 'चार्ट के लिए कोई डेटा नहीं है',
      'today': 'आज',
      'no_attendance_groups_found': 'उपस्थिति सक्षम वाला कोई समूह नहीं मिला।',

      // Branch & Guruji Management
      'no_branches_found': 'कोई शाखा नहीं मिली। एक जोड़ें!',
      'add_branch': 'शाखा जोड़ें',
      'edit_branch': 'शाखा संपादित करें',
      'branch_name': 'शाखा का नाम',
      'branch_name_hint': 'शाखा का नाम दर्ज करें',
      'city_location_hint': 'शहर या स्थान दर्ज करें',
      'delete_branch_title': 'शाखा हटाएं?',
      'delete_branch_confirm': 'क्या आप वाकई इस शाखा को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।',
      'manage_gurujis': 'गुरुजी प्रबंधित करें',
      'no_gurujis_found': 'अभी तक कोई गुरुजी नहीं हैं।',
      'assign_guruji_role': 'गुरुजी की भूमिका सौपें',
      'assign_role': 'भूमिका सौपें',
      'promote_confirm_msg': 'क्या आप वाकई {name} को गुरुजी के रूप में पदोन्नत करना चाहते हैं?',
      'promote_success_msg': '{name} अब एक गुरुजी हैं',
      'promote_instruction': 'गुरुजी के रूप में पदोन्नत करने के लिए उपयोगकर्ता खोजें।',
      'search_user_hint': 'नाम या ईमेल द्वारा उपयोगकर्ता खोजें',
      'remove_guruji_role_title': 'गुरुजी की भूमिका हटाएं?',
      'remove_role_confirm_msg': 'यह उपयोगकर्ता एक नियमित सदस्य बन जाएगा।',
      'location_label': 'स्थान',
      'load_label': 'लोड करें',
      'deactivate': 'निष्क्रिय करें',
      'activate': 'सक्रिय करें',
      'manage_service_types': 'सेवा प्रकार प्रबंधित करें',
      'optional': 'वैकल्पिक',
      'inactive': 'निष्क्रिय',
      // Group Member Management
      'manage_roles_title': '{name} के लिए भूमिकाएँ प्रबंधित करें',
      'roles': 'भूमिकाएँ',
      'admin_role': 'व्यवस्थापक',
      'only_system_admins_manage': 'केवल सिस्टम व्यवस्थापक इस भूमिका को प्रबंधित कर सकते हैं',
      'admin_role_desc': 'सदस्यों और सेटिंग्स का प्रबंधन कर सकते हैं',
      'error_updating_role': 'भूमिका अपडेट करने में त्रुटि',
      'guruji_role': 'गुरुजी',
      'guruji_role_desc': 'पढ़ा सकते हैं और सामग्री प्रबंधित कर सकते हैं',
      'permitted_role': 'अनुमत उपयोगकर्ता',
      'permitted_role_desc': 'मैसेजिंग/पिनिंग के लिए विशेष अनुमतियां',
      'member_role': 'सदस्य',
      'done': 'संपन्न',
      'remove_from_group': 'समूह से हटाएं',
      'remove_member': 'सदस्य हटाएं?',
      'remove_member_confirm': 'क्या आप वाकई {name} को इस समूह से हटाना चाहते हैं?',
      'remove': 'हटाएं',
      'member_removed_success': 'सदस्य सफलतापूर्वक हटाया गया',
      'volunteer_removed': 'स्वयंसेवक हटाया गया',
      'remove_volunteer': 'स्वयंसेवक हटाएं?',
      'remove_volunteer_confirm': 'क्या आप वाकई {name} को हटाना चाहते हैं?',
      
      // Assign Volunteer
      'select_member': 'सदस्य चुनें',
      'choose_member': 'एक सदस्य चुनें',
      'role': 'भूमिका',
      'description_optional': 'वर्णन (वैकल्पिक)',
      'description': 'स्वयंसेवक की जिम्मेदारियों का वर्णन करें...',
      'end_date': 'अंतिम तिथि',
      'end_date_optional': 'अंतिम तिथि (वैकल्पिक)',
      'sending': 'भेज रहा है',
      'assign': 'नियुक्त करें',
      'invitation_sent': 'स्वयंसेवक आमंत्रण भेजा गया',
      'select_member_error': 'कृपया एक सदस्य चुनें',
      'reason': 'कारण',
      'assigned_by': 'द्वारा नियुक्त',
      'accepted': 'स्वीकृत',
      'pending': 'लंबित',
      'declined': 'अस्वीकृत',
      'unknown_user': 'अज्ञात उपयोगकर्ता',
      'no_eligible_members': 'इस समूह में कोई योग्य सदस्य नहीं',

      // Group Details & Permissions
      'invite_members': 'सदस्यों को आमंत्रित करें',
      'search': 'खोजें',
      'everyone': 'हर कोई',
      'admins_only': 'केवल व्यवस्थापक',
      'admins_and_gurujis': 'व्यवस्थापक और गुरुजी',
      'admins_gurujis_permitted': 'व्यवस्थापक, गुरुजी और अनुमत',
      'who_can_send_messages': 'संदेश कौन भेज सकता है?',
      'message_permission_updated': 'संदेश अनुमति अधतन की गई',
      'who_can_pin_messages': 'संदेश कौन पिन कर सकता है?',
      'pin_permission_updated': 'पिन अनुमति अधतन की गई',
      'message_send_permission': 'संदेश भेजने की अनुमति',
      'pin_message_permission': 'संदेश पिन करने की अनुमति',
      'group_settings': 'समूह अनुमतियां',
      'default_samagri_from_type': '{type} से डिफ़ॉल्ट सामग्री',

      // Invite User & Volunteer Dialogs
      'invitation_already_sent': 'इस उपयोगकर्ता को आमंत्रण पहले ही भेजा जा चुका है',
      'cannot_invite_self': 'आप स्वयं को समूह में आमंत्रित नहीं कर सकते',
      'user_already_member': 'उपयोगकर्ता पहले से ही इस समूह का सदस्य है',
      'error_sending_invitation': 'आमंत्रण भेजने में त्रुटि',
      'invitation_sent_to': '{name} को आमंत्रण भेजा गया',
      'volunteer_invitation_sent_to': '{name} को स्वयंसेवक आमंत्रण भेजा गया',
      'error_loading_members': 'सदस्य लोड करने में त्रुटि: {error}',
      'enter_role': 'कृपया एक भूमिका दर्ज करें',
      
      // Param Drishti Content
      'vision_title': 'मनुष्य में देवत्व का उदय और धरती पर स्वर्ग का अवतरण',
      'vision_description': '''
अखिल विश्व गायत्री परिवार की दृष्टि है कि मानव जीवन केवल भौतिक उपलब्धियों तक सीमित न रहे, बल्कि वह अपने भीतर छिपी दिव्य चेतना को जागृत करे।

हम एक ऐसे समाज का निर्माण चाहते हैं जहाँ:
• प्रत्येक व्यक्ति चरित्रवान और नैतिक हो
• परिवार संस्कारों का केन्द्र बने
• समाज सहयोग और करुणा पर आधारित हो
• राष्ट्र आदर्श और अनुशासन का प्रतीक बने
• विश्व “वसुधैव कुटुम्बकम्” की भावना से संचालित हो

हमारा लक्ष्य केवल सुधार नहीं, बल्कि चेतना-परिवर्तन है — व्यक्ति से परिवार, परिवार से समाज, समाज से राष्ट्र, और राष्ट्र से विश्व तक।
''',
      'mission_title': 'व्यक्ति निर्माण – परिवार निर्माण – समाज निर्माण – राष्ट्र निर्माण',
      'mission_description': '''
गायत्री परिवार का मिशन है:

🔹 1. आत्मिक जागरण
गायत्री साधना, जप, ध्यान एवं यज्ञ के माध्यम से आत्मबल बढ़ाना।

🔹 2. संस्कारों की पुनर्स्थापना
बच्चों, युवाओं और परिवारों में नैतिक एवं सांस्कृतिक मूल्यों का विकास।

🔹 3. नशामुक्त एवं कुरीतिमुक्त समाज
व्यसन, अंधविश्वास और सामाजिक बुराइयों का उन्मूलन।

🔹 4. सेवा एवं सहयोग की भावना
समाज के कमजोर वर्गों के लिए सेवा कार्यों का विस्तार।

🔹 5. आध्यात्मिकता और विज्ञान का समन्वय
धर्म को आडंबर नहीं, बल्कि जीवन-विज्ञान के रूप में स्थापित करना।
''',
      'yagya_title': 'यज्ञ के फायदे (Yagya Ke Faayde)',
      'yagya_description': '''
🟢 आध्यात्मिक लाभ
• मन की शुद्धि
• सकारात्मक ऊर्जा का संचार
• मानसिक तनाव में कमी
• आत्मिक शांति

🟢 शारीरिक लाभ
• वातावरण की शुद्धि
• रोग प्रतिरोधक क्षमता में वृद्धि
• सूक्ष्म जीवाणुओं का नाश

🟢 सामाजिक लाभ
• परिवार में एकता
• सामूहिक भावना का विकास
• संस्कारों का प्रसार

🟢 पर्यावरणीय लाभ
• वायु शुद्धिकरण
• पर्यावरण संतुलन
• प्राकृतिक ऊर्जा का संवर्धन
''',
      // Param Drishti Menu & Home Card
      'param_drishti_title': 'परम दृष्टि',
      'param_drishti_subtitle': 'हमारी दृष्टि, मिशन और आध्यात्मिक आंदोलन',
      'param_drishti_card_desc': 'आध्यात्मिक क्रांति - दृष्टि, मिशन और आंदोलन',
      'menu_vision': 'दृष्टि (Vision)',
      'vision_short_desc': 'मनुष्य में देवत्व का उदय',
      'menu_mission': 'मिशन (Mission)',
      'mission_short_desc': 'व्यक्ति निर्माण से राष्ट्र निर्माण',
      'menu_sapt_aandolan': 'सप्त आंदोलन',
      'sapt_aandolan_short_desc': '7 आध्यात्मिक आंदोलन',
      'menu_yagya_benefits': 'यज्ञ के लाभ',
      'yagya_short_desc': 'वैज्ञानिक और आध्यात्मिक लाभ',
      'sapt_aandolan_title': 'सप्त आंदोलन (Sapt Aandolan)',
      
      'aandolan_sadhana_title': 'साधना आंदोलन',
      'aandolan_sadhana_purpose': 'व्यक्ति के आंतरिक शुद्धिकरण और आत्मबल वृद्धि।',
      'aandolan_sadhana_description': '''
साधना आंदोलन के अंतर्गत:
• गायत्री मंत्र जप
• ध्यान और प्राणायाम
• तप एवं स्वाध्याय
• चरित्र निर्माण

यह आंदोलन व्यक्ति को मानसिक, नैतिक और आध्यात्मिक रूप से सशक्त बनाता है।
''',

      'aandolan_shiksha_title': 'शिक्षा आंदोलन',
      'aandolan_shiksha_purpose': 'नैतिक, सांस्कृतिक और जीवनोपयोगी शिक्षा का प्रसार।',
      'aandolan_shiksha_description': '''
मूल्य आधारित शिक्षा
• संस्कार शालाएँ
• युवा जागरण कार्यक्रम
• व्यक्तित्व विकास शिविर

शिक्षा केवल डिग्री नहीं, बल्कि जीवन निर्माण का माध्यम है।
''',

      'aandolan_swasthya_title': 'स्वास्थ्य आंदोलन',
      'aandolan_swasthya_purpose': 'शारीरिक, मानसिक और आध्यात्मिक स्वास्थ्य।',
      'aandolan_swasthya_description': '''
योग और प्राणायाम
• प्राकृतिक चिकित्सा
• नशामुक्ति अभियान
• सात्विक जीवन शैली

स्वास्थ्य आंदोलन जीवन को संतुलित और ऊर्जावान बनाता है।
''',

      'aandolan_swavalamban_title': 'स्वावलम्बन आंदोलन',
      'aandolan_swavalamban_purpose': 'आर्थिक आत्मनिर्भरता और श्रम संस्कृति।',
      'aandolan_swavalamban_description': '''
लघु उद्योग प्रोत्साहन
• कौशल विकास
• श्रम एवं स्वाभिमान जागरण
• आत्मनिर्भर परिवार निर्माण

स्वावलम्बन से आत्मविश्वास और सामाजिक सम्मान बढ़ता है।
''',

      'aandolan_paryavaran_title': 'पर्यावरण आंदोलन',
      'aandolan_paryavaran_purpose': 'प्रकृति संरक्षण और स्वच्छ वातावरण।',
      'aandolan_paryavaran_description': '''
वृक्षारोपण अभियान
• यज्ञ द्वारा वायुमंडल शुद्धिकरण
• जल संरक्षण
• प्लास्टिक मुक्त अभियान

यह आंदोलन प्रकृति और मानव के बीच संतुलन स्थापित करता है।
''',

      'aandolan_mahila_jagran_title': 'महिला जागरण आंदोलन',
      'aandolan_mahila_jagran_purpose': 'नारी शक्ति का सम्मान और सशक्तिकरण।',
      'aandolan_mahila_jagran_description': '''
महिला शिक्षा
• संस्कार निर्माण
• परिवार सशक्तिकरण
• नेतृत्व विकास

नारी समाज की धुरी है — जागृत नारी से जागृत समाज बनता है।
''',

      'aandolan_vyasan_mukti_title': 'व्यसन-मुक्ति एवं कुरीति उन्मूलन आंदोलन',
      'aandolan_vyasan_mukti_purpose': 'समाज को बुराइयों से मुक्त करना।',
      'aandolan_vyasan_mukti_description': '''
नशामुक्ति अभियान
• दहेज, अंधविश्वास, भ्रूण हत्या जैसी कुरीतियों का विरोध
• सामाजिक जागरूकता कार्यक्रम
• जनजागरण रैली एवं सभाएँ

यह आंदोलन समाज को शुद्ध और जागरूक बनाता है।
''',
    },

    'mr': {
      'feed': 'फीड',
      'posts': 'पोस्ट',
      'feed_description': 'हे तुमचे फीड आहे. नवीनतम पोस्ट आणि समुदाय बातम्यांसह अद्ययावत रहा.',
      'view_comments': 'टिप्पण्या पहा',
      'delete_post': 'पोस्ट हटवा',
      'delete_post_confirm': 'तुम्हाला नक्की ही पोस्ट हटवायची आहे का?',
      'pin_post': 'पिन करा',
      'unpin_post': 'अनपिन करा',
      'max_pin_warning': '⚠️ जास्तीत जास्त 3 पोस्ट पिन केल्या जाऊ शकतात.',
      'downloading_photo': 'फोटो डाउनलोड होत आहे...',
      'photo_saved': '✅ फोटो गॅलरीमध्ये सेव्ह झाला!',
      'download_failed': '❌ डाउनलोड अयशस्वी: {error}',
      'post_deleted': '✅ पोस्ट यशस्वीरित्या हटवली',
      'delete_post_failed': '❌ पोस्ट हटविण्यात अयशस्वी',
      'comments': 'टिप्पण्या',
      'no_comments_yet': 'अद्याप कोणतीही टिप्पणी नाही',
      'be_first_comment': 'पहिली टिप्पणी करा!',
      'add_comment': 'टिप्पणी लिहा...',
      'create_post': 'पोस्ट तयार करा',
      'post_btn': 'पोस्ट करा',
      'photos': 'फोटो',
      'caption': 'कॅप्शन',
      'write_caption': 'कॅप्शन लिहा...',
      'tags': 'टॅग्स',
      'add_tag': 'टॅग जोडा (उदा. event, news)',
      'post_date_time': 'पोस्ट दिनांक आणि वेळ (पर्यायी)',
      'current_time_default': 'सेट न केल्यास सद्य वेळ वापरली जाईल',
      'uploading_progress': 'अपलोड होत आहे... {percent}%',
      'please_wait': 'कृपया प्रतीक्षा करा...',
      'preparing_upload': 'अपलोड करण्याची तयारी करत आहे',
      'today_random_role': 'आजची यादृच्छिक भूमिका',
      'pick_random_student': 'विद्यार्थी निवडा',
      'attendance_missing_msg': 'निवડ करण्यापूर्वी आजची उपस्थिती (IST) नोंदवणे आवश्यक आहे.',
      'zero_students_present': 'आज कोणताही विद्यार्थी उपस्थित नाही.',
      'present_students_count': 'आज {count} विद्यार्थी उपस्थित आहेत. एकाची यादृચ્છિકपणे निवड करा.',
      'selected_role': 'भूमिका: {role}',
      'fairness_fallback_tooltip': 'पूर्ण पूल मधून निवडले (फेअरनेस फॉलबॅक)',
      'processing': 'प्रक्रिया चालू आहे...',
      'manage_roles': 'भूमिका व्यवस्थापित करा',
      'default_roles': 'डिफ़ॉल्ट भूमिका',
      'custom_roles': 'गट भूमिका',
      'add_role': 'नवीन भूमिका जोडा',
      'role_name': 'भूमिकेचे नाव',
      'enter_role_name': 'भूमिकेचे नाव प्रविष्ट करा (उदा. क्लास मॉनिटर)',
      'role_added': 'भूमिका यशस्वीरित्या जोडली',
      'role_updated': 'भूमिका यशस्वीरित्या अद्यतनित केली',
      'role_deleted': 'भूमिका यशस्वीरित्या हटविली',
      'cannot_edit_global_role': 'डिफॉल्ट भूमिका संपादित केल्या जाऊ शकत नाहीत',

      'gayatri_mandir_title': 'गायत्री मंदिर',
      // Seva Management
      "manage_seva_opportunities": "सेवा संधींचे व्यवस्थापन करा",
      // General Actions
      'edit': 'संपादित करा',
      'rename': 'नाव बदला',
      'download': 'डाउनलोड करा',
      'share': 'शेअर करा',
      'view': 'पहा',
      'file': 'फाईल',
      'files': '{count} फाईल्स',
      'delete_file_title': 'फाईल हटवायची?',
      'delete_file_confirm': 'तुम्ही खरोखर "{name}" हटवू इच्छिता?',
      'rename_file': 'फाईलचे नाव बदला',
      'new_name': 'नवीन नाव',
      'file_renamed': 'फाईलचे नाव बदलले',
      'file_uploaded': 'फाईल यशस्वीरित्या अपलोड केली',
      'cannot_open_file_type': 'ही फाईल प्रकार उघडता येत नाही',
      'downloading': 'डाउनलोड होत आहे...',
      'download_failed': 'डाउनलोड अयशस्वी: {error}',
      'rename_failed': 'नाव बदलणे अयशस्वी: {error}',
      'preparing_share': 'शेअर करण्यासाठी फाईल तयार करत आहे...',
      'shared_from_app': 'गायत्री परिवार कनेक्ट वरून शेअर केले',

      // Notification Descriptions
      'news_notifications_desc': 'नवीनतम बातम्यांविषयी सूचित व्हा',
      'event_notifications_desc': 'आगामी कार्यक्रमांसाठी स्मरणपत्रे',
      'group_notifications_desc': 'गट आमंत्रणांसाठी सूचना',
      'announcement_notifications_desc': 'महत्वाच्या घोषणा',
      'satsang_notifications_desc': 'सकाळचे आध्यात्मिक संदेश',

      // Public Group Creation
      'reason_for_creating_group': 'हा गट तयार करण्याचे कारण',
      'reason_for_creating_group_hint': 'या गटाचा उद्देश किंवा हेतू स्पष्ट करा...',
      'reason_for_creating_group_helper': 'यामुळे अॅडमिनला हा गट का मंजूर केला पाहिजे हे समजण्यास मदत होते',
      'reason_min_length_error': 'कृपया कारण द्या (किमान 10 अक्षरे)',
      'n_files': '{count} फाईल्स',
      'no_branches_available': 'कोणत्याही शाखा उपलब्ध नाहीत. कृपया आधी एक शाखा जोडा.',
      'no_gurujis_available': 'कोणतेही गुरुजी उपलब्ध नाहीत. कृपया आधी एक गुरुजी जोडा.',
      'no_media_folders': 'अद्याप कोणतेही मीडिया फोल्डर नाहीत',
      'no_media_available_desc': 'सध्या कोणतेही मीडिया उपलब्ध नाही',

      // Service Types
      'no_service_types': 'अद्याप कोणतेही सेवा प्रकार नाहीत',
      'add_service_types_prompt': 'वापरकर्त्यांना विनंती करण्यासाठी सेवा प्रकार जोडा',
      'add_service_type': 'सेवा प्रकार जोडा',
      'edit_service_type': 'सेवा प्रकार संपादित करा',
      'service_type_added': 'सेवा प्रकार जोडला',
      'service_type_updated': 'सेवा प्रकार अपडेट केला',
      'requirements_samagri': 'आवश्यकताएँ (सामग्री)',
      'no_requirements_added': 'अद्याप कोणतीही आवश्यकता जोडलेली नाही.',
      'add_requirement': 'आवश्यकता जोडा',
      'item_name': 'वस्तूचे नाव',
      'item_name_hint': 'उदा. तांदूळ, तूप',
      'quantity': 'प्रमाण',
      'quantity_hint': 'उदा. १',
      'unit': 'एकक',
      'unit_hint': 'उदा. किलो, नग, लिटर',
      'optional_good_to_have': 'वैकल्पिक / असणे चांगले',
      'users_can_see_service': 'वापरकर्ते ही सेवा पाहू शकतात',
      'hidden_from_users': 'वापरकर्त्यांपासून लपलेले',
      'optional': 'वैकल्पिक',
      'restore_availability': 'उपलब्धता पुनर्संचयित करा',

      // Storage Manager
      'storage_manager': 'स्टोरेज मॅनेजर',
      'folder': 'फोल्डर',
      'no_folders_yet': 'अद्याप कोणतेही फोल्डर नाहीत',
      'this_folder_is_empty': 'हे फोल्डर रिकामे आहे',
      'create_folder': 'फोल्डर तयार करा',
      'folder_name': 'फोल्डरचे नाव',
      'description_optional': 'वर्णन (पर्यायी)',
      'edit_folder': 'फोल्डर संपादित करा',
      'delete_folder_title': 'फोल्डर हटवायचे?',
      'folder_description': 'फोल्डर वर्णन',
      'add_description': 'वर्णन जोडा',
      'delete_folder_confirm': 'तुम्ही खरोखर हे फोल्डर आणि त्यातील सर्व सामग्री हटवू इच्छिता? ही कृती पूर्ववत करता येत नाही.',
      'create': 'तयार करा',
      'save': 'जतन करा',
      'upload_success': 'फाईल यशस्वीरित्या अपलोड झाली',

      // Seva Management
      'manage_seva_opportunities': 'सेवा संधींचे व्यवस्थापन करा',
      'error_loading_sevas': 'सेवा लोड करण्यात त्रुटी',
      'start': 'सुरू करा',
      'postpone': 'पुढे ढकला',
      'google_maps_link_optional': 'गुगल मॅप्स लिंक (पर्यायी)',
      'filled_status': 'भरले',
      'rescheduled': 'पुन्हा शेड्यूल केले',
      'postponed': 'पुढे ढकलले',
      
      // Seva Lifecycle Extended
      'seva_postponed_to': 'सेवा {date} पर्यंत पुढे ढकलली',
      'new_date_label': 'नवीन तारीख',
      'reason': 'कारण',
      'select_new_date': 'नवीन तारीख निवडा',
      'reason_required': 'कारण (आवश्यक)',
      'confirm_postpone': 'पुष्टी करा',
      'confirm_postpone_msg': 'तुम्ही खरोखर ही सेवा पुढे ढकलू इच्छिता?',
      'cannot_select_past_date': 'मागील तारीख निवडू शकत नाही',
      'upload_photos': 'फोटो अपलोड करा',
      'link_folder': 'फोल्डर लिंक करा',
      'optional_folder_selection_hint': 'हे फोटो आयोजित करण्यासाठी वैकल्पिकरित्या फोल्डर निवडा',
      'search_folder_hint': 'फोल्डर नावाने शोधा...',
      'create_new_folder': 'नवीन फोल्डर तयार करा',
      'select_existing_folder': 'विद्यमान फोल्डर निवडा',
      'photos_required': 'फोटो आवश्यक आहे',
      'activity_log': 'ॲक्टिव्हिटी लॉग',
      'log_created': 'सेवा तयार केली',
      'log_postponed': 'पुढे ढकलले',
      'log_resumed': 'पुन्हा सुरू',
      'log_completed': 'पूर्ण झाले',
      'log_photos_uploaded': 'फोटो अपलोड केले',
      'log_cancelled': 'रद्द केले',
      'log_status_changed': 'स्थिती बदलली',
      'by_user': '{name} द्वारे',
      'seva_auto_resumed_msg': 'सेवा {date} ला आपोआप सुरू होईल',
      'pull_to_refresh': 'रीफ्रेश करण्यासाठी ओढा',
      'backup': 'बॅकअप',
      'withdrawn_success': 'यशस्वीरित्या मागे घेतले',
      'joined_success': 'यशस्वीरित्या सामील झाले',
      'resume_seva': 'सेवा पुन्हा सुरू करा',
      'withdraw_from_seva': 'सेवेतून माघार घ्या',
      'participate_in_seva': 'सेवेत सहभागी व्हा',
      'volunteers': 'स्वयंसेवक',
      'backup_volunteers': 'बॅकअप स्वयंसेवक',
      'no_volunteers_yet': 'अद्याप कोणतेही स्वयंसेवक नाहीत',
      'error_loading_participants': 'सहभागी लोड करण्यात त्रुटी',
      'view_own_appreciation_only': 'तुम्ही फक्त तुमची स्वतःची प्रशंसा पाहू शकता',
      'error_withdrawing': 'माघार घेताना त्रुटी: {error}',
      'error_loading_appreciation': 'प्रशंसा लोड करण्यात त्रुटी',
      'event_not_started': 'कार्यक्रम अद्याप सुरू झालेला नाही. कृपया {time} पर्यंत प्रतीक्षा करा',
      'status_updated': 'स्थिती {status} वर अपडेट केली',
      'reason_for_status': '{status} चे कारण',
      'enter_reason_optional': 'कारण प्रविष्ट करा (पर्यायी)',
      'cant_mark_attendance_early': 'कार्यक्रम सुरू होण्यापूर्वी उपस्थिती दर्शवता येणार नाही',
      'available_after': '{time} नंतर उपलब्ध',
      'admin_actions_error_early_start': '{time} च्या आधी कार्यक्रम सुरू करता येणार नाही',
      'admin_actions_error_not_started': 'पूर्ण नियुक्त करण्यापूर्वी कार्यक्रम सुरू असणे आवश्यक आहे',
      'admin_actions_error_early_end': 'निर्धारित वेळेपूर्वी ({time}) कार्यक्रम पूर्ण चिन्हांकित करता येणार नाही',
      'dedicated_seva': 'समर्पित सेवा',
      'time_seva': 'वेळ सेवा',
      'team_seva': 'टीम सेवा',
      'impactful_seva': 'प्रभावी सेवा',
      'dedicated_seva_msg': 'या सेवेतील तुमची निष्ठा आणि प्रामाणिकपणाचे मनापासून कौतुक आहे. वचनबद्धतेने सेवा केल्याबद्दल धन्यवाद.',
      'time_seva_msg': 'तुमचा वेळ उदारपणे दिल्याबद्दल आणि सेवेसाठी उपस्थित राहिल्याबद्दल धन्यवाद.',
      'team_seva_msg': 'तुमच्या टीमवर्क आणि समन्वयामुळे ही सेवा यशस्वी झाली. तुमच्या समर्थनाबद्दल कृतज्ञ आहोत.',
      'impactful_seva_msg': 'तुमच्या योगदानाने अर्थपूर्ण प्रभाव पडला. तुमच्या प्रेरणादायी सेवेबद्दल धन्यवाद.',
      'attendance_finalized_gratitude_sent': 'उपस्थिती अंतिम केली आणि कृतज्ञता पाठविली!',
      'attendance_finalized_msg': 'उपस्थिती अंतिम केली!',
      'partial_appreciation_title': 'अर्धवट प्रशंसा?',
      'partial_appreciation_msg': 'तुम्ही {total} पैकी फक्त {count} उपस्थित स्वयंसेवकांचे कौतुक करत आहात. सुरू ठेवायचे?',
      'please_select_badge_error': 'कृपया प्रशंसा बॅज निवडा',
      'please_write_longer_msg_error': 'कृपया थोडा मोठा संदेश लिहा',
      'personal_note_optional': 'वैयक्तिक नोंद (पर्यायी)',
      'add_personal_note_hint': 'वैयक्तिक नोंद जोडा...',
      'recorded_as_absent': 'अनुपस्थित म्हणून नोंदवले',
      'present_with_count': 'उपस्थित ({count})',
      'absent_with_count': 'अनुपस्थित ({count})',
      'inactive': 'निष्क्रिय',
      'activate': 'सक्रिय करा',
      'deactivate': 'निष्क्रिय करा',
      'delete_location': 'स्थान हटवा',
      'status_summary': 'स्थिती सारांश',
      'stat_total': 'एकूण',
      'stat_pending': 'प्रलंबित',
      'stat_accepted': 'स्वीकारले',
      'stat_completed': 'पूर्ण झाले',
      'stat_cancelled': 'रद्द केले',
      'service_types': 'सेवा प्रकार',
      'top_requesters': 'शीर्ष विनंतीकर्ते',
      'filter_by_user': 'वापरकर्त्यानुसार फिल्टर करा',
      'clear_all': 'सर्व साफ करा',
      'user_filtered': 'वापरकर्ता फिल्टर केला',
      'filter_by_status': 'स्थितिनुसार फिल्टर करा',
      'filter_by_type': 'प्रकारानुसार फिल्टर करा',
      'clear_filter': 'फिल्टर साफ करा',
      'x_requests': '{count} विनंत्या',
      'filtered_check': 'फिल्टर केले ✓',
      'no_service_requests_yet': 'अद्याप कोणतेही सेवा विनंत्या नाहीत',
      'preferred_label': 'पसंतीचे: {value}',
      'assigned_label': 'नियुक्त: {value}',
      'requested_by': 'विनंतीकर्ते',
      'alt_contact': 'पर्यायी संपर्क',
      'default_samagri_from_type': 'मुलभूत सामग्री (सेवा प्रकारानुसार):',
      'not_possible_with_reason': 'शक्य नाही: {reason}',
      'no_reason_given': 'कोणतेही कारण दिलेले नाही',
      'loading_details': 'तपशील लोड होत आहेत...',
      'currently_assigned': 'सध्या नियुक्त',
      'notes_from_guruji': 'गुरुजींच्या नोट्स:',
      'completion_photos_label': 'पूर्णतेचे फोटो:',
      'unavailable_by_label': '{name} द्वारे',
      'cancelled_by_label': '{name} द्वारे',
      'cannot_complete_request': 'विनंती पूर्ण होऊ शकत नाही',
      'pending_items_approval_error': 'काही प्रलंबित वापरकर्ता विनंती केलेल्या वस्तू आहेत ज्यांना ही विनंती पूर्ण चिन्हांकित करण्यापूर्वी गुरुजींची मान्यता/नकार आवश्यक आहे।',
      'marked_unavailable_success': 'विनंती अनुपलब्ध म्हणून चिन्हांकित केली',
      'restore_to_pending': 'प्रलंबित वर पुनर्संचयित करा',
      'request_restored_success': 'विनंती प्रलंबित वर पुनर्संचयित केली',
      'cancellation_reason_label': 'रद्द करण्याचे कारण',
      'cancellation_reason_hint': 'ही विनंती का रद्द केली जात आहे?',
      'please_enter_reason': 'कृपया एक कारण प्रविष्ट करा',
      'request_marked_unavailable': 'विनंती अनुपलब्ध म्हणून चिन्हांकित केली',
      'request_cancelled_success': 'विनंती यशस्वीरित्या रद्द केली',
      'accept': 'स्वीकार करा',
      'mark_completed': 'पूर्ण झाले म्हणून चिन्हांकित करा',
      'mark_unavailable': 'अनुपलब्ध म्हणून चिन्हांकित करा',
      'cancel': 'रद्द करा',
      'cancel_request': 'विनंती रद्द करा',
      'request_marked_completed': 'विनंती पूर्ण झाली',
      'something_went_wrong': 'काहीतरी चुकीचे घडले',
      'ok': 'ठीक आहे',
      'back': 'मागे',
      'address': 'पत्ता',
      'description': 'वर्णन',
      'preferred_date': 'पसंतीची तारीख',
      'preferred_time': 'पसंतीची वेळ',
      'request_details': 'विनंती तपशील',
      'notes': 'टीपा',
      'attachments': 'जोडलेले दस्तऐवज',
      'assignment': 'नेमणूक',
      'final_date': 'अंतिम तारीख',
      'activity_request_created': 'विनंती तयार केली',
      'activity_item_selected': 'आयटम निवडला',
      'activity_item_deselected': 'आयटमची निवड रद्द केली',
      'activity_special_item_added': 'विशेष आयटम जोडला',
      'activity_special_item_removed': 'विशेष आयटम काढला',
      'activity_request_revised': 'विनंती सुधारित केली',
      'activity_item_approved': 'आयटम मंजूर',
      'activity_item_rejected': 'आयटम नाकारला',
      'activity_approved_all': 'सर्व सामग्री मंजूर',
      'activity_revision_requested': 'सुधारणेची विनंती केली',
      'activity_guruji_volunteered': 'गुरुजींनी स्वेच्छेने सहभाग घेतला',
      'activity_guruji_note': 'गुरुजींची नोंद',
      'activity_guruji_assigned': 'गुरुजी नियुक्त केले',
      'activity_admin_notes': 'एडमिन नोट्स',
      'activity_admin_note': 'एडमिन नोट',
      'activity_status_changed': 'स्थिती बदलली',

      // Public Groups
      'public_groups': 'सार्वजनिक गट',
      'no_pending_requests': 'कोणतीही प्रलंबित विनंती नाही',
      'all_public_group_requests_reviewed': 'सर्व सार्वजनिक गट विनंत्यांचे पुनरावलोकन केले आहे',
      'created_by': 'यांनी तयार केले',
      'unknown_user': 'अज्ञात वापरकर्ता',
      'reason_for_creating': 'तयार करण्याचे कारण',
      'reject': 'नाकारा',
      'approve': 'मंजूर करा',
      'reject_public_group_title': 'सार्वजनिक गट नाकारायचा?',
      'reject_public_group_content': '"{name}" नाकारल्यास तो नाकारलेला म्हणून चिन्हांकित केला जाईल आणि निर्मात्याला कारण दिसेल.',
      'rejection_reason': 'नाकारण्याचे कारण',
      'rejection_reason_hint': 'उदा. मार्गदर्शक तत्त्वांची पूर्तता करत नाही',
      'enter_rejection_reason': 'कृपया नाकारण्याचे कारण प्रविष्ट करा',
      'approved_as_public_group': '"{name}" ला सार्वजनिक गट म्हणून मंजूर केले',
      'has_been_rejected': '"{name}" नाकारण्यात आले आहे',
      'error_approving': '"{name}" मंजूर करण्यात त्रुटी: {error}',
      'error_rejecting': '"{name}" नाकारण्यात त्रुटी: {error}',
      'pending_approval': 'मंजूरी प्रलंबित',
      'migrate_legacy_data': 'जुना डेटा स्थलांतरित करा (एकदाच)',
      'create_seva': 'नवीन सेवा तयार करा',
      'new_seva': 'नवीन सेवा',
      'edit_seva': 'सेवा संपादित करा',
      'search_seva_placeholder': 'सेवा नावाने शोधा...',
      'no_seva_opportunities': 'अद्याप कोणतीही सेवा संधी नाही',
      'seva_created_success': 'सेवा यशस्वीरित्या तयार केली',
      'seva_updated_success': 'सेवा यशस्वीरित्या अपडेट केली',
      'assign_selected': 'निवडलेल्यांना नियुक्त करा',
      'internal_notes_optional': 'अंतर्गत नोट्स (पर्यायी)',
      'internal_notes_hint': 'या असाइनमेंट्ससाठी नोट्स...',
      'delete_seva': 'सेवा हटवा',
      'delete_seva_confirm': 'तुम्ही खरोखर "{title}" हटवू इच्छिता?',
      'cannot_undo': 'ही कृती पूर्ववत करता येत नाही.',
      'no_gurujis_match': 'कोणतेही जुळणारे गुरुजी आढळले नाहीत',
      'male_needed': 'पुरुष आवश्यक',
      'female_needed': 'स्त्री आवश्यक',
      'select_date_time': 'तारीख आणि वेळ निवडा',
      'enter_manually': 'मॅन्युअली प्रविष्ट करा',
      'find_responsible_person': 'जबाबदार व्यक्ती शोधा',
      'contact_name': 'संपर्क नाव',
      'contact_role': 'भूमिका / पद',
      'contact_phone': 'संपर्क फोन',
      'cannot_edit_completed_seva': 'पूर्ण झालेली सेवा संपादित करू शकत नाही',
      'could_not_open_map': 'नकाशा उघडू शकलो नाही',
      'joined': 'सामील',
      'event_will_start': 'कार्यक्रम लवकरच सुरू होईल',
      'event_is_live': 'कार्यक्रम चालू आहे',
      'event_paused': 'कार्यक्रम थांबवला आहे',
      'event_postponed': 'कार्यक्रम पुढे ढकलला. अपडेटची वाट पहा',
      'event_rescheduled': 'कार्यक्रम पुन्हा शेड्यूल केला',
      'event_completed': 'कार्यक्रम पूर्ण झाला',
      'event_cancelled': 'कार्यक्रम रद्द केला',
      'manage_seva_op': 'सेवा व्यवस्थापन',
      'gurujis_assigned': 'गुरुजी नियुक्त',
      'no_gurujis_selected': 'कोणतेही गुरुजी निवडले नाहीत',
      'assign_guruji': 'गुरुजी नियुक्त करा',
      'reassign': 'पुन्हा नियुक्त करा',
      'remove_assignment': 'असाइनमेंट काढा',
      'show_active': 'सक्रिय दाखवा',
      'show_history': 'इतिहास दाखवा',
      'male': 'पुरुष',
      'female': 'स्त्री',
      'upcoming': 'आगामी',
      'live': 'थेट',
      'full': 'पूर्ण',
      'past': 'मागील',
      'paused': 'थांबलेले',
      'assigned': 'नियुक्त',

      // General
      'app_name': 'गायत्री परिवार कनेक्ट',
      'delete': 'हटवा',
      'submit': 'सबमिट करा',
      'loading': 'लोड होत आहे...',
      'error': 'त्रुटी',
      'success': 'यशस्वी',
      'search': 'शोधा',
      'emergency_summary': 'आणीबाणी सारांश', // Marathi
      'resolution_note': 'निराकरण टीप',
      'resolve_emergency_title': 'आणीबाणी सोडवा',
      'min_chars_10': 'किमान 10 अक्षरे आवश्यक',
      'min_chars_20': 'किमान 20 अक्षरे आवश्यक',
      'no_data': 'कोणताही डेटा उपलब्ध नाही',
      'all_is_well': 'सर्व काही ठीक आहे!',
      'retry': 'पुन्हा प्रयत्न करा',
      'close': 'बंद करा',
      'yes': 'होय',
      'no': 'नाही',
      'next': 'पुढे',
      'done': 'झाले',
      'select': 'निवडा',
      'add': 'जोडा',
      'remove': 'काढा',
      'update': 'अपडेट करा',
      'details': 'तपशील',
      'title': 'शीर्षक',
      'date': 'तारीख',
      'time': 'वेळ',
      'status': 'स्थिती',
      'pending': 'प्रलंबित',
      'approved': 'मंजूर',
      'rejected': 'नाकारले',
      'completed': 'पूर्ण',
      'ongoing': 'सुरू आहे',
      'no_ongoing_events': 'सुरू असलेले कार्यक्रम नाहीत',
      'all': 'सर्व',
      'filter': 'फिल्टर',
      'sort': 'क्रमवारी',
      'upload': 'अपलोड',
      'refresh': 'रिफ्रेश',
      'organization': 'संघटना',

      // Admin Family Links
      'family_links_admin': 'कौटुंबिक लिंक',
      'family_links': 'कौटुंबिक लिंक',
      'create_family_link': 'कौटुंबिक लिंक तयार करा',
      'select_parent': 'पालक निवडा',
      'select_child': 'मूल निवडा',
      'select_both_users': 'कृपया दोन्ही वापरकर्ते निवडा',
      'cannot_link_self': 'वापरकर्त्याला स्वतःशी लिंक करता येत नाही',
      'link_created': 'कौटुंबिक लिंक यशस्वीरित्या तयार केले',
      'search_users': 'वापरकर्ते शोधा...',
      'filter_status': 'स्थिती',
      'all_links': 'सर्व लिंक',
      'audit_trail': 'ऑडिट ट्रेल',
      'add_link': 'लिंक जोडा',
      'links_found': 'लिंक सापडले',
      'no_family_links': 'कोणतेही कौटुंबिक लिंक सापडले नाही',
      'no_audit_logs': 'कोणतेही ऑडिट लॉग सापडले नाही',
      'parent_child': 'पालक/मूल',
      'elder_caregiver': 'ज्येष्ठ/काळजीवाहू',
      'relationship': 'संबंध',
      'created': 'तयार केले',
      'actions': 'क्रिया',
      'import_failed': 'आयात अयशस्वी',
      'file_saved': 'फाइल जतन केली',
      'export_success': 'निर्यात यशस्वी',
      'export_failed': 'निर्यात अयशस्वी',
      'importing': 'आयात करत आहे...',
      'processing': 'प्रक्रिया करत आहे',
      'links': 'लिंक',
      'import_complete': 'आयात पूर्ण',
      'failed': 'अयशस्वी',
      'add_first_link': '+ बटणाचा वापर करून तुमचे पहिले कौटुंबिक लिंक जोडा',
      'parent': 'पालक',
      'child': 'मूल',
      'no_links_to_export': 'निर्यात करण्यासाठी कोणतेही लिंक नाही',

      // Edit Link Dialog
      'edit_family_link': 'कौटुंबिक लिंक संपादित करा',
      'current_link': 'वर्तमान लिंक',
      'type': 'प्रकार',
      'permissions': 'परवानग्या',
      'view_activity': 'क्रियाकलाप पहा',
      'view_activity_desc': 'पालक मुलाच्या ॲप वापराचे निरीक्षण करू शकतात',
      'receive_sos': 'SOS अलर्ट प्राप्त करा',
      'receive_sos_desc': 'आपत्कालीन अलर्ट फॉरवर्ड करा',
      'restrict_content': 'सामग्री प्रतिबंधित करा',
      'restrict_content_desc': 'मुलाच्या प्रवेशावर मर्यादा घाला',
      'expiration_date': 'समाप्तीची तारीख',
      'no_expiration': 'कोणतीही समाप्ती नाही',
      'last_modified_by': 'शेवटचे सुधारित',
      'link_updated': 'कौटुंबिक लिंक यशस्वीरित्या अद्यतनित केले',

      // Quotes
      'daily_inspiration': 'दैनिक प्रेरणा',
      'spiritual_practice': 'साधना',
      'sadhana': 'साधना',
      'swadhyay': 'स्वाध्याय',
      'mantra_japa': 'मंत्र जप',
      'digital_library': 'डिजिटल पुस्तकालय',
      'daily_thoughts': 'दैनिक विचार',
      // Important Info
      'important_locations': 'महत्त्वाची ठिकाणे',
      'search_locations_hint': 'ठिकाणे शोधा...',
      'important_contacts': 'महत्त्वाचे संपर्क',
      'search_contacts_hint': 'संपर्क शोधा...',
      'open_google_maps': 'गुगल मॅप्समध्ये उघडा',
      'all_tags': 'सर्व टॅग',
      'all_roles': 'सर्व भूमिका',
      'no_locations_found': 'कोणतीही ठिकाणे सापडली नाहीत',
      'no_contacts_found': 'कोणतेही संपर्क सापडले नाहीत',
      'call_action': 'कॉल करा',
      'save_contact_share': 'संपर्क जतन करा: ',
      // Sadhana Settings
      'select_daily_target': 'दैनिक लक्ष्य निवडा',
      'mala_quarter': '¼ माळ',
      'mala_half': '½ माळ',
      'mala_1': '१ माळ',
      'malas_format': '{count} माळा',
      'desc_beginners': 'नवशिक्या / व्यस्त दिवस',
      'desc_morning_evening': 'सकाळ/संध्याकाळ',
      'desc_standard': 'मानक दैनिक',
      'desc_regular': 'नियमित साधक',
      'desc_intermediate': 'मध्यम',
      'desc_advanced': 'प्रगत',
      'desc_intensive': 'गहन',
      'desc_anushthana': 'अनुष्ठान स्तर',
      'desc_deep_practice': 'सखोल सराव',
      'desc_traditional': 'पारंपरिक ध्येय',
      // Seva Appreciation (Tickets 5-6)
      'complete_with_gratitude': 'कृतज्ञतेसह पूर्ण करा',
      'share_your_gratitude': 'आपली कृतज्ञता सामायिक करा',
      'select_badge_type': 'बॅज प्रकार निवडा',
      'seva_contributions': 'सेवा योगदान',
      'appreciations_received': 'प्रशंसा प्राप्त झाल्या',
      'no_appreciations_yet': 'तुमच्या सेवा योगदानाला येथे मान्यता दिली जाईल',
      'appreciation_sent': 'कृतज्ञता पाठवली',
      'character_count': 'अक्षरे',
      'please_share_gratitude': 'कृपया आपली कृतज्ञता सामायिक करा',
      'write_at_least_50_chars': 'याला वैयक्तिक बनवण्यासाठी कृपया किमान 50 अक्षरे लिहा',
      'keep_under_200_chars': 'कृपया आपला संदेश 200 अक्षरांच्या आत ठेवा',
      'please_select_badge': 'कृपया एक बॅज प्रकार निवडा',
      'already_appreciated': 'या स्वयंसेवकाला या सेवेसाठी आधीच सराहले आहे.',
      'gratitude_for_seva': 'आपल्या सेवेसाठी कृतज्ञता',
      'seva_appreciated_msg': 'आपल्या सेवा "{title}" ची कृतज्ञतेसह सराहना केली आहे.',
      'seva_contributions_recognized': 'आपल्या सेवेची सराहना केली आहे',
      'sending_gratitude': 'पाठवत आहे...',
      'send_gratitude': 'कृतज्ञता व्यक्त करा',
      'view_history': 'इतिहास पहा',
      'my_sos_history': 'माझा SOS इतिहास',
      'call_now': 'आता कॉल करा',
      'status_open': 'उघडे',
      'status_acknowledged': 'मान्य',
      'status_resolved': 'निकाली',
      'status_cancelled': 'रद्द',
      'acknowledged': 'मान्य केले',
      'waiting': 'प्रतीक्षा करत आहे...',
      'managed_by': '{name} द्वारे व्यवस्थापित',
      'by': '{name} द्वारे',
      'resolved': 'निकाली',
      'role_admin': 'प्रशासक',
      'role_parent': 'पालक',
      'role_guruji': 'गुरुजी',
      'role_unknown': 'अज्ञात',
      'confirm': 'पुष्टी करा',
      // Auth
      'login': 'लॉगिन',
      'signup': 'साइन अप',
      'logout': 'लॉगआउट',
      'email': 'ईमेल',
      'password': 'पासवर्ड',
      'confirm_password': 'पासवर्ड निश्चित करा',
      'forgot_password': 'पासवर्ड विसरलात?',
      'welcome_back': 'परत स्वागत',
      'sign_in_continue': 'सुरू ठेवण्यासाठी साइन इन करा',
      'reset_password': 'पासवर्ड रीसेट करा',
      'send_reset_link': 'रीसेट लिंक पाठवा',
      'create_account': 'खाते तयार करा',
      'already_have_account': 'आधीच खाते आहे?',
      'dont_have_account': 'खाते नाही?',
      'enter_email': 'तुमचा ईमेल प्रविष्ट करा',
      'enter_password': 'तुमचा पासवर्ड प्रविष्ट करा',
      'join_gayatri': 'गायत्री परिवारात सामील व्हा',
      // Navigation
      'home': 'होम',
      'groups': 'गट',
      'events': 'कार्यक्रम',
      'group_events': 'गट कार्यक्रम',
      'more_actions': 'इतर पर्याय',
      'mark_attendance': 'उपस्थित चिन्हांकित करा',
      'attendance': 'उपस्थित',
      'manage_members': 'सदस्य व्यवस्थापन',
      'view_members': 'सदस्य पहा',
      'assign_volunteers': 'स्वयंसेवक नियुक्त करा',
      'invite_members': 'सदस्यांना आमंत्रित करा',
      'view_sadhana': 'साधना पहा',
      'spiritual': 'आध्यात्मिक',
      'profile': 'प्रोफाइल',
      'settings': 'सेटिंग्ज',
      'news': 'बातम्या',
      'chat': 'चॅट',
      'members': 'सदस्य',
      // Settings
      'notifications': 'सूचना',
      'appearance': 'देखावा',
      'theme': 'थीम',
      'font_size': 'फॉन्ट आकार',
      'language': 'भाषा',
      'privacy_security': 'गोपनीयता आणि सुरक्षा',
      'change_password': 'पासवर्ड बदला',
      'about': 'बद्दल',
      'app_version': 'अ‍ॅप आवृत्ती',
      'terms_conditions': 'अटी आणि शर्ती',
      'privacy_policy': 'गोपनीयता धोरण',
      'contact_support': 'समर्थनाशी संपर्क साधा',
      'clear_cache': 'कॅशे साफ करा',
      'rate_app': 'अ‍ॅपला रेट करा',
      'change_username': 'वापरकर्ता नाव बदला',
      'two_factor_auth': 'दोन-चरण प्रमाणीकरण',
      'coming_soon': 'लवकरच येत आहे',
      'free_up_storage': 'स्टोरेज मोकळी करा',
      'clear_cache_message': 'हे सर्व कॅशे केलेल्या प्रतिमा साफ करेल आणि स्टोरेज जागा मोकळी करेल. पुढे चालू ठेवायचे?',
      'clear_cache_success': 'कॅशे यशस्वीरित्या साफ केले',
      'cannot_change_until': 'या तारखेपर्यंत बदलता येणार नाही',
      'pending_invitations': 'प्रलंबित आमंत्रणे',
      'no_pending_invitations': 'प्रलंबित आमंत्रणे नाहीत',
      'invitations_hint': 'गट आमंत्रणे येथे दिसतील',
      'pranaam_greeting': 'प्रणाम',
      'celebrations': 'उत्सव',
      'calendar': 'कॅलेंडर',
      'continue_with_google': 'Google सह सुरू ठेवा',
      // Celebrations
      'celebrations_page_title': '🎉 आजचे उत्सव',
      'no_celebrations_today': 'आज कोणतेही उत्सव नाहीत',
      'special_note': 'आज आम्ही या भक्तांसाठी आहुती देतो आणि मंत्र जपतो. कृपया त्यांना आपल्या आशीर्वादात ठेवा.',
      'chant_mantra': 'मंत्र जप',
      'yagya_ahuti': 'यज्ञ आहुति',
      'send_blessings': 'आशीर्वाद पाठवा',
      'birthdays': '🎂 वाढदिवस',
      'anniversaries': '💍 वर्धापन दिन',
      'turning_age_prefix': 'आज',
      'turning_age_suffix': 'वर्षांचे होत आहेत!',
      'blessings_msg': 'दीर्घायुष्यासाठी आणि निरोगी जीवनासाठी शुभेच्छा!',
      'celebrating_years_prefix': 'सहवासाची',
      'celebrating_years_suffix': 'वर्षे साजरी करत आहेत!',
      'festival_calendar': 'सण कॅलेंडर',
      'no_events_day': 'या दिवशी कोणतेही कार्यक्रम नाहीत',
      // Festivals
      'makar_sankranti': 'मकर संक्रांती',
      'vasant_panchami': 'वसंत पंचमी',
      'maha_shivaratri': 'महा शिवरात्री',
      'holi': 'होळी',
      'ram_navami': 'राम नवमी',
      'raksha_bandhan': 'रक्षाबंधन',
      'janmashtami': 'जन्माष्टमी',
      'ganesh_chaturthi': 'गणेश चतुर्थी',
      'dussehra': 'दसरा',
      'diwali': 'दिवाळी',
      // Theme options
      'light': 'लाइट',
      'dark': 'डार्क',
      'system_default': 'सिस्टम डीफॉल्ट',
      // Font size options
      'small': 'लहान',
      'medium': 'मध्यम',
      'large': 'मोठे',
      // Profile
      'edit_profile': 'प्रोफाइल संपादित करा',
      'full_name': 'पूर्ण नाव',
      'phone_number': 'फोन नंबर',
      'location': 'स्थान',
      'city': 'शहर',
      'branch': 'शाखा',
      'select_branch': 'शाखा निवडा',
      'select_guruji': 'गुरुजी निवडा',
      'interests': 'आवडी',
      'complete_setup': 'सेटअप पूर्ण करा',
      'profile_setup': 'प्रोफाइल सेटअप',
      'personal_info': 'वैयक्तिक माहिती',
      'contact_info': 'संपर्क माहिती',
      'username': 'वापरकर्तानाव',
      'bio': 'परिचय',
      'date_of_birth': 'जन्मतारीख',
      'gender': 'लिंग',
      'other': 'इतर',
      // Profile Validation Messages
      'enter_full_name': 'कृपया तुमचे नाव प्रविष्ट करा',
      'enter_phone': 'कृपया तुमचा फोन नंबर प्रविष्ट करा',
      'enter_valid_phone': 'कृपया वैध 10-अंकी फोन नंबर प्रविष्ट करा',
      'select_dob': 'कृपया तुमची जन्मतारीख निवडा',
      'select_gender': 'लिंग निवडा',
      'select_gender_error': 'कृपया तुमचे लिंग निवडा',
      'select_location_error': 'कृपया तुमचे स्थान निवडा',
      'username_available': 'वापरकर्तानाव उपलब्ध आहे',
      'username_taken': 'हे वापरकर्तानाव आधीच घेतले आहे',
      'logout_confirmation': 'तुम्हाला लॉग आउट करायचे आहे का?',
      'confirm_logout': 'लॉग आउट',
      'cancel': 'रद्द करा',
      'social_youtube': 'यूट्यूब',
      'social_facebook': 'फेसबुक',
      'social_instagram': 'इंस्टाग्राम',
      'follow_us': 'आमच्याशी जोडा',
      // Tutorial
      'tutorial_profile_title': 'तुमची प्रोफाइल',
      'tutorial_profile_desc': 'तुमची प्रोफाइल पाहण्यासाठी आणि संपादित करण्यासाठी येथे टॅप करा.',
      'tutorial_daily_inspiration_title': 'दैनिक प्रेरणा',
      'tutorial_daily_inspiration_desc': 'तुमची दिवसाची सुरुवात आध्यात्मिक विचारांनी करा.',
      'tutorial_celebrations_title': 'उत्सव',
      'tutorial_celebrations_desc': 'आज कोणाचा वाढदिवस आणि वर्धापन दिन आहे ते पहा!',
      'tutorial_calendar_desc': 'आगामी सण, कार्यक्रम आणि महत्त्वाच्या तारखा पहा.',
      'tutorial_news_desc': 'ताज्या बातम्या आणि घोषणांसह अपडेट रहा.',
      'tutorial_events_title': 'कार्यक्रम',
      'tutorial_events_desc': 'तुमच्या समाजातील आगामी कार्यक्रम शोधा आणि सामील व्हा.',
      'tutorial_groups_title': 'समूह',
      'tutorial_groups_desc': 'समूहांमध्ये सामील व्हा आणि समविचारी सदस्यांशी जोडा.',
      'tutorial_spiritual_desc': 'आध्यात्मिक संसाधने आणि सुविचार मिळवा.',
      'tutorial_request_service_title': 'सेवा विनंती',
      'tutorial_request_service_desc': 'यज्ञ, संस्कार यांसारख्या समारंभांसाठी विनंती करा.',
      'tutorial_seva_title': 'सेवेच्या संधी',
      'tutorial_seva_desc': 'निस्वार्थ सेवेसाठी स्वयंसेवक व्हा.',
      'tutorial_media_title': 'मीडिया लायब्ररी',
      'tutorial_media_desc': 'कार्यक्रमांचे फोटो आणि व्हिडिओ पहा.',
      'tutorial_bottom_nav_title': 'नेव्हिगेशन',
      'tutorial_bottom_nav_desc': 'होम, समूह, कार्यक्रम आणि प्रोफाइल दरम्यान स्विच करण्यासाठी वापरा.',
      'tutorial_emergency_sos_title': 'आणीबाणी मदत',
      'tutorial_emergency_sos_desc': 'आणीबाणीत त्वरित मदतीसाठी हे बटण वापरा.',
      'tutorial_mandir_schedule_title': 'मंदिर वेळापत्रक',
      'tutorial_mandir_schedule_desc': 'आरती, दर्शन आणि इतर उपक्रमांची वेळ पहा.',
      'tutorial_upcoming_events_title': 'आगामी कार्यक्रम',
      'tutorial_upcoming_events_desc': 'लवकरच होणाऱ्या महत्त्वाच्या कार्यक्रमांची यादी पहा.',
      'tutorial_latest_news_title': 'ताज्या बातम्या',
      'tutorial_latest_news_desc': 'गायत्री परिवाराच्या नवीनतम घडामोडी आणि सूचना.',
      // Services
      'request_service': 'सेवेची विनंती करा',
      'request_service_title': 'सेवेची विनंती करा',
      'edit_request_title': 'विनंती संपादित करा',
      'my_requests': 'माझ्या विनंत्या',
      'service_type': 'सेवा प्रकार',
      'additional_notes': 'अतिरिक्त नोट्स',
      'select_service': 'सेवा निवडा',
      'service_details': 'सेवा तपशील',
      'request_status': 'विनंती स्थिती',
      'new_request': 'नवीन विनंती',
      'city_hint': 'उदा. भिवंडी',
      'building_apt': 'इमारत/फ्लैट',
      'flat_floor': 'फ्लैट क्रमांक आणि मजला',
      'building_society_name': 'इमारत / सोसायटीचे नाव',
      'street_road_name': 'रस्ता / रोडचे नाव',
      'landmark_optional': 'लँडमार्क (वैकल्पिक)',
      'city_location': 'शहर / ठिकाण',
      'user_requested_items': 'वापरकर्त्याने विनंती केलेल्या वस्तू',
      'required_samagri_admin': 'आवश्यक सामग्री (प्रशासक)',
      'guruji_cannot_arrange': 'गुरुजी व्यवस्था करू शकत नाहीत',
      'not_possible_reason': 'कारण: ', 
      'edit_item': 'संपादित करा',
      'select_service_type_error': 'कृपया सेवेचा प्रकार निवडा',
      'not_backed_up_yet': 'अद्याप बॅकअप घेतला नाही',
      'syncing': 'सिंक होत आहे...',
      'data_synced': 'डेटा सिंक झाला',
      'data_not_synced': 'डेटा सिंक झाला नाही, डिव्हाइसवर सेव्ह आहे',
      'data_synced_cloud': 'डेटा सिंक झाला, क्लाउडवर सेव्ह आहे',
      'sync_data': 'डेटा सिंक करा',
      'backing_up_data': 'डेटा क्लाउडवर बॅकअप होत आहे...',
      'sun_short': 'रवि',
      'mon_short': 'सोम',
      'tue_short': 'मंगळ',
      'wed_short': 'बुध',
      'thu_short': 'गुरु',
      'fri_short': 'शुक्र',
      'sat_short': 'शनि',
      'add_extra_item': 'अतिरिक्त वस्तू जोडा',
      'submit_request': 'विनंती सबमिट करा',
      'attachments_optional': 'जोडणी (पर्यायी)',
      // Notifications
      'news_notifications': 'बातम्या सूचना',
      'event_notifications': 'कार्यक्रम सूचना',
      'group_notifications': 'गट सूचना',
      'announcement_notifications': 'घोषणा',
      'satsang_notifications': 'दैनिक सत्संग संदेश',
      // Home Dashboard
      'pranaam': 'प्रणाम 🙏',
      'welcome_to_gayatri': 'गायत्री परिवारात परत स्वागत',
      'quick_access': 'जलद प्रवेश',
      'latest_news': 'ताज्या बातम्या',
      'upcoming_events': 'आगामी कार्यक्रम',
      'my_groups': 'माझे गट',
      'media_library': 'मीडिया लायब्ररी',
      // Change Password
      'change_password_desc': 'तुमचा वर्तमान पासवर्ड प्रविष्ट करा आणि नवीन निवडा',
      'current_password': 'वर्तमान पासवर्ड',
      'new_password': 'नवीन पासवर्ड',
      'password_tips': 'पासवर्ड टिपा',
      'password_tip_1': 'किमान 8 अक्षरे वापरा',
      'password_tip_2': 'अप्परकेस आणि लोअरकेस अक्षरांचा समावेश करा',
      'password_tip_3': 'अंक आणि विशेष वर्ण जोडा',
      'password_tip_4': 'सामान्य शब्द किंवा पॅटर्न टाळा',
      // Profile Setup & Edit
      'save_changes': 'बदल जतन करा',
      'take_photo': 'फोटो घ्या',
      'choose_from_gallery': 'गॅलरीतून निवडा',
      'verify_password': 'पासवर्ड सत्यापित करा',
      'verify_password_desc': 'सुरक्षेसाठी, तुमचा फोन नंबर बदलण्यासाठी कृपया तुमचा पासवर्ड प्रविष्ट करा.',
      'verify': 'सत्यापित करा',
      'incorrect_password': 'चुकीचा पासवर्ड. कृपया पुन्हा प्रयत्न करा.',
      'profile_updated': 'प्रोफाइल यशस्वीरित्या अपडेट केले',
      'failed_save': 'प्रोफाइल जतन करण्यात अयशस्वी',
      'select_interest_error': 'कृपया किमान एक आवड निवडा',
      'select_location': 'तुमचे स्थान निवडा',
      'select_location_error': 'कृपया तुमचे स्थान निवडा',
      'enter_name_error': 'कृपया तुमचे नाव प्रविष्ट करा',
      'enter_phone_error': 'कृपया तुमचा फोन नंबर प्रविष्ट करा',
      'invalid_phone_error': 'कृपया वैध 10-अंकी फोन नंबर प्रविष्ट करा',
      'enter_dob_error': 'कृपया तुमची जन्मतारीख निवडा',
      'marital_status': 'वैवाहिक स्थिती',
      'marriage_anniversary': 'लग्नाचा वाढदिवस',
      'engagement_date': 'साखरपुडा तारीख',
      'single': 'अविवाहित',
      'engaged': 'साखरपुडा झालेला',
      'married': 'विवाहित',
      'widow_widower': 'विधवा/विधुर',
      'select_your_interests': 'तुमच्या आवडी निवडा',
      'username_helper_text': 'दर 30 दिवसांत फक्त एकदाच बदलला जाऊ शकतो',
      'username_min_length': 'वापरकर्तानाव किमान 3 अक्षरांचे असणे आवश्यक आहे',
      'username_max_length': 'वापरकर्तानाव 20 अक्षरांपेक्षा कमी असणे आवश्यक आहे',
      'username_invalid_chars': 'फक्त अक्षरे, अंक आणि अंडरस्कोरला परवानगी आहे',
      'username_cooldown_msg': 'वापरकर्तानाव इतक्या दिवसांत बदलता येईल',
      'username_locked_msg': 'वापरकर्तानाव या तारखेपर्यंत बदलता येणार नाही',
      'days': 'दिवस',
      // Terms & Conditions
      'terms_update_date': 'अंतिम अपडेट: 06 डिसेंबर 2025',
      'terms_1_title': '1. अटींची स्वीकृती',
      'terms_1_content': 'गायत्री परिवार कनेक्ट ॲप डाउनलोड, इंस्टॉल किंवा वापरून, तुम्ही या नियम आणि अटींशी बांधील राहण्यास सहमती दर्शवता. जर तुम्ही या अटींशी सहमत नसाल, तर कृपया ॲप वापरू नका.',
      'terms_2_title': '2. सेवेचे वर्णन',
      'terms_2_content': 'गायत्री परिवार कनेक्ट हे एक सामुदायिक ॲप आहे जे गायत्री परिवार आध्यात्मिक समुदायाच्या सदस्यांना जोडण्यासाठी डिझाइन केलेले आहे. ॲप खालील वैशिष्ट्ये प्रदान करते:\n\n• गट संवाद आणि मेसेजिंग\n• कार्यक्रम व्यवस्थापन आणि सूचना\n• आध्यात्मिक संसाधने आणि सामग्री\n• सामुदायिक बातम्या आणि घोषणा\n• प्रोफाइल व्यवस्थापन',
      'terms_3_title': '3. वापरकर्ता खाती',
      'terms_3_content': '• खाते तयार करताना तुम्हाला अचूक माहिती प्रदान करणे आवश्यक आहे\n• तुमच्या खात्याच्या क्रेडेन्शियल्सची गोपनीयता राखण्यासाठी तुम्ही जबाबदार आहात\n• हे ॲप वापरण्यासाठी तुमचे वय किमान 13 वर्षे असणे आवश्यक आहे\n• एक व्यक्ती एकापेक्षा जास्त खाती ठेवू शकत नाही',
      'terms_4_title': '4. वापरकर्ता वर्तन',
      'terms_4_content': 'तुम्ही मान्य करता की तुम्ही:\n\n• आक्षेपार्ह, अपमानास्पद किंवा अनुचित सामग्री पोस्ट करणार नाही\n• इतर वापरकर्त्यांना त्रास देणार नाही किंवा धमकावणार नाही\n• खोटी किंवा दिशाभूल करणारी माहिती सामायिक करणार नाही\n• परवानगीशिवाय व्यावसायिक उद्देशांसाठी ॲप वापरणार नाही\n• इतर खात्यांमध्ये अनधिकृत प्रवेश मिळवण्याचा प्रयत्न करणार नाही\n• कोणत्याही लागू कायद्याचे किंवा नियमाचे उल्लंघन करणार नाही',
      'terms_5_title': '5. सामग्री मार्गदर्शक तत्त्वे',
      'terms_5_content': '• सामायिक केलेली सर्व सामग्री गायत्री परिवाराच्या आध्यात्मिक मूल्यांशी सुसंगत असावी\n• सर्व समुदाय सदस्यांच्या धार्मिक आणि सांस्कृतिक भावनांचा आदर करा\n• परवानगीशिवाय कॉपीराइट सामग्री सामायिक करू नका\n• ॲप प्रशासकांना अनुचित सामग्री काढून टाकण्याचा अधिकार आहे',
      'terms_6_title': '6. गोपनीयता',
      'terms_6_content': 'तुमची गोपनीयता आमच्यासाठी महत्त्वाची आहे. आम्ही तुमची वैयक्तिक माहिती कशी गोळा करतो, वापरतो आणि तिचे संरक्षण करतो याबद्दल माहितीसाठी कृपया आमचे गोपनीयता धोरण पहा.',
      'terms_7_title': '7. बौद्धिक संपदा',
      'terms_7_content': '• ॲप आणि त्याची सामग्री कॉपीराइट आणि इतर बौद्धिक संपदा कायद्यांद्वारे संरक्षित आहे\n• गायत्री परिवार बोधचिन्ह, नाव आणि संबंधित साहित्य हे ट्रेडमार्क आहेत\n• वापरकर्ते त्यांच्या स्वतःच्या सामग्रीचे मालकी हक्क ठेवतात परंतु ॲपला ते प्रदर्शित करण्यासाठी परवाना देतात',
      'terms_8_title': '8. समाप्ती',
      'terms_8_content': 'आम्ही तुमचे खाते निलंबित किंवा समाप्त करण्याचा अधिकार राखून ठेवतो जर:\n\n• तुम्ही या नियम आणि अटींचे उल्लंघन केले\n• तुम्ही समुदायासाठी हानिकारक वर्तनात सहभागी झालात\n• तुमचे खाते दीर्घकाळ निष्क्रिय राहिले\n• कायदा किंवा समुदाय मार्गदर्शक तत्त्वांद्वारे आवश्यक असल्यास',
      'terms_9_title': '9. अस्वीकरण',
      'terms_9_content': '• ॲप "जसे आहे" आधारावर प्रदान केले जाते, कोणत्याही वॉरंटीशिवाय\n• आम्ही अखंड किंवा त्रुटी-मुक्त सेवेची हमी देत नाही\n• आम्ही वापरकर्ता-निर्मित सामग्रीसाठी जबाबदार नाही\n• ॲपचा वापर तुमच्या स्वतःच्या जोखमीवर आहे',
      'terms_10_title': '10. अटींमधील बदल',
      'terms_10_content': 'आम्ही वेळोवेळी हे नियम आणि अटी अद्यतनित करू शकतो. बदलांनंतर ॲपचा सतत वापर म्हणजे नवीन अटींची स्वीकृती होय.',
      'terms_11_title': '11. संपर्क',
      'terms_11_content': 'या नियम आणि अटींबद्दल प्रश्नांसाठी, कृपया ॲपच्या समर्थन वैशिष्ट्याद्वारे किंवा या ईमेलवर आमच्याशी संपर्क साधा:\n\nईमेल: gayatripragyapeethbhiwandi@gmail.com',
      // Privacy Policy
      'privacy_update_date': 'अंतिम अपडेट: 06 डिसेंबर 2025',
      'privacy_1_title': '1. परिचय',
      'privacy_1_content': 'गायत्री परिवार कनेक्ट ("आम्ही", "आमचे") तुमच्या गोपनीयतेचे रक्षण करण्यास वचनबद्ध आहे. हे गोपनीयता धोरण स्पष्ट करते की तुम्ही आमचे मोबाइल ॲप्लिकेशन वापरता तेव्हा आम्ही तुमची माहिती कशी गोळा करतो, वापरतो, उघड करतो आणि सुरक्षित ठेवतो.',
      'privacy_2_title': '2. माहिती जी आम्ही गोळा करतो',
      'privacy_2_content': 'आम्ही तुम्ही आम्हाला थेट प्रदान केलेली माहिती गोळा करतो:\n\n• वैयक्तिक माहिती: नाव, ईमेल पत्ता, फोन नंबर, प्रोफाइल फोटो\n• स्थान डेटा: समुदाय गट करण्यासाठी शहर आणि राज्य\n• खाते माहिती: वापरकर्तानाव, पासवर्ड (एन्क्रिप्टेड)\n• आध्यात्मिक प्राधान्ये: शाखा, गुरुजी/भगत जी पसंती\n• वापरकर्ता सामग्री: संदेश, पोस्ट आणि अपलोड जे तुम्ही सामायिक करता',
      'privacy_3_title': '3. आम्ही तुमची माहिती कशी वापरतो',
      'privacy_3_content': 'आम्ही गोळा केलेली माहिती खालीलसाठी वापरतो:\n\n• ॲपची कार्यक्षमता प्रदान आणि राखण्यासाठी\n• तुम्हाला समुदाय सदस्यांशी जोडण्यासाठी\n• तुम्हाला कार्यक्रम आणि अद्यतनांबद्दल सूचना पाठवण्यासाठी\n• तुमचा अनुभव वैयक्तिकृत करण्यासाठी\n• आमच्या सेवा सुधारण्यासाठी\n• ॲप बदलांबद्दल तुमच्याशी संवाद साधण्यासाठी\n• समुदाय सुरक्षा आणि मार्गदर्शक तत्त्वांचे पालन सुनिश्चित करण्यासाठी',
      'privacy_4_title': '4. माहिती सामायिक करणे',
      'privacy_4_content': 'आम्ही तुमची माहिती सामायिक करू शकतो:\n\n• इतर समुदाय सदस्यांसह (तुमच्या गोपनीयता सेटिंग्जनुसार)\n• गट व्यवस्थापनासाठी गट प्रशासकांसह\n• सेवा प्रदात्यांसह जे आमच्या ऑपरेशन्समध्ये मदत करतात\n• जेव्हा कायदा किंवा कायदेशीर प्रक्रियेद्वारे आवश्यक असते\n• वापरकर्त्यांचे हक्क, मालमत्ता किंवा सुरक्षितता सुरक्षित करण्यासाठी\n\nआम्ही तुमची वैयक्तिक माहिती तृतीय पक्षांना विकत नाही.',
      'privacy_5_title': '5. डेटा स्टोरेज आणि सुरक्षा',
      'privacy_5_content': '• तुमचा डेटा फायरबेस सर्व्हरवर सुरक्षितपणे संग्रहीत केला जातो\n• आम्ही संवेदनशील डेटा प्रसारणासाठी एन्क्रिप्शन वापरतो\n• पासवर्ड डेटा हॅश केला जातो आणि कधीही साध्या मजकुरात संग्रहीत केला जात नाही\n• प्रोफाइल फोटो सुरक्षित क्लाउड सेवांवर संग्रहीत केले जातात\n• आम्ही तुमच्या डेटाचे संरक्षण करण्यासाठी योग्य सुरक्षा उपाय लागू करतो',
      'privacy_6_title': '6. तुमचे गोपनीयता अधिकार',
      'privacy_6_content': 'तुम्हाला खालील अधिकार आहेत:\n\n• तुमच्या वैयक्तिक माहितीत प्रवेश करणे\n• चुकीचा डेटा दुरुस्त करणे\n• तुमचे खाते आणि संबंधित डेटा हटवणे\n• मार्केटिंग संवादातून बाहेर पडणे\n• सूचना प्राधान्ये नियंत्रित करणे\n• तुमच्या डेटाची प्रत विनंती करणे',
      'privacy_7_title': '7. मुलांची गोपनीयता',
      'privacy_7_content': 'आमचे ॲप 10 वर्षांपेक्षा कमी वयाच्या मुलांसाठी नाही. आम्ही 10 वर्षांपेक्षा कमी वयाच्या मुलांकडून जाणूनबुजून वैयक्तिक माहिती गोळा करत नाही. जर तुम्हाला वाटत असेल की आम्ही अशी माहिती गोळा केली आहे, तर कृपया आमच्याशी त्वरित संपर्क साधा.',
      'privacy_8_title': '8. पुश सूचना',
      'privacy_8_content': '• आम्ही कार्यक्रम, संदेश आणि घोषणांसाठी पुश सूचना पाठवतो\n• तुम्ही ॲप सेटिंग्जमध्ये सूचना प्राधान्ये नियंत्रित करू शकता\n• तुम्ही तुमच्या डिव्हाइस सेटिंग्जद्वारे सर्व सूचना अक्षम करू शकता\n• आम्ही तुमचे डिव्हाइस टोकन तृतीय पक्षांशी सामायिक करत नाही',
      'privacy_9_title': '9. तृतीय-पक्ष सेवा',
      'privacy_9_content': 'आमचे ॲप तृतीय-पक्ष सेवा वापरते:\n\n• फायरबेस (Google) - प्रमाणीकरण आणि डेटा स्टोरेज\n• क्लाउडिनरी - इमेज स्टोरेज\n• फायरबेस क्लाउड मेसेजिंग - पुश सूचना\n\nया सेवांची स्वतःची गोपनीयता धोरणे आहेत जी तुमच्या माहितीच्या वापराचे नियमन करतात.',
      'privacy_10_title': '10. डेटा धारण',
      'privacy_10_content': '• जोपर्यंत तुमचे खाते सक्रिय आहे तोपर्यंत आम्ही तुमचा डेटा राखून ठेवतो\n• खाते हटवल्यावर, तुमचा वैयक्तिक डेटा 30 दिवसांच्या आत काढून टाकला जातो\n• विश्लेषणासाठी काही निनावी डेटा ठेवला जाऊ शकतो\n• गटांमध्ये संदेश इतिहास गट अखंडतेसाठी ठेवला जाऊ शकतो',
      'privacy_11_title': '11. गोपनीयता धोरणात बदल',
      'privacy_11_content': 'आम्ही वेळोवेळी हे गोपनीयता धोरण अद्यतनित करू शकतो. आम्ही ॲपद्वारे किंवा ईमेलद्वारे महत्त्वपूर्ण बदलांबद्दल तुम्हाला सूचित करू. बदलांनंतर सतत वापर अद्यतनित धोरणाची स्वीकृती दर्शवतो.',
      'privacy_12_title': '12. आमच्याशी संपर्क साधा',
      'privacy_12_content': 'या गोपनीयता धोरणाबद्दल किंवा तुमच्या डेटाबद्दल प्रश्न किंवा समस्यांसाठी, कृपया आमच्याशी संपर्क साधा:\n\nईमेल: gayatripragyapeethbhiwandi@gmail.com\n\nतुम्ही आमच्यापर्यंत पोहोचण्यासाठी इन-ॲप फीडबॅक वैशिष्ट्य देखील वापरू शकता.',
      'view_all': 'सर्व पहा',
      'no_news': 'कोणत्याही बातम्या उपलब्ध नाहीत.',
      'no_events': 'कोणताही आगामी कार्यक्रम नाही.',
      // Groups
      'create_group': 'गट तयार करा',
      'join_group': 'गटात सामील व्हा',
      'leave_group': 'गट सोडा',
      'group_name': 'गटाचे नाव',
      'group_description': 'गट वर्णन',
      'group_type': 'गट प्रकार',
      'group_members': 'गट सदस्य',
      'add_members': 'सदस्य जोडा',
      'remove_member': 'सदस्य काढा',
      'make_admin': 'प्रशासक बनवा',
      'group_chat': 'गट चॅट',
      'group_settings': 'गट सेटिंग्ज',
      'homework': 'गृहपाठ',
      'edit_group': 'गट संपादित करा',
      'delete_group': 'गट हटवा',
      'private_group': 'खाजगी गट',
      'no_groups': 'कोणताही गट सापडला नाही.',
      'search_groups': 'गट शोधा...',
      'invitations': 'आमंत्रणे',
      'decline': 'नाकारा',
      'bss_group': 'बीएसएस गट',
      'sss_group': 'एसएसएस गट',
      'yss_group': 'वायएसएस गट',
      'other_group': 'इतर गट',
      // Events
      'event_details': 'कार्यक्रम तपशील',
      'past_event': 'मागील कार्यक्रम',
      'upcoming': 'आगामी',
      'event_group': 'कार्यक्रम गट',
      'join_discussion_group': 'चर्चा गटात सामील व्हा',
      'event_description': 'वर्णन',
      'additional_media_available': 'अतिरिक्त मीडिया उपलब्ध',
      'view_more_media': 'अधिक मीडिया पहा',
      'delete_event': 'कार्यक्रम हटवा',
      'delete_event_confirm': 'आपण नक्कीच हा कार्यक्रम हटवू इच्छिता?',
      'event_deleted_success': 'कार्यक्रम यशस्वीरित्या हटविला गेला',
      'event_not_found': 'कार्यक्रम सापडला नाही',
      'error_deleting_event': 'कार्यक्रम हटवताना त्रुटी: {error}',
      'tap_to_view': 'पाहण्यासाठी टॅप करा',
      'create_event': 'कार्यक्रम तयार करा',
      'edit_event': 'कार्यक्रम संपादित करा',
      'event_details': 'कार्यक्रम तपशील',
      'event_date': 'कार्यक्रम तारीख',
      'event_time': 'कार्यक्रम वेळ',
      'event_location': 'कार्यक्रम स्थान',
      'event_description': 'कार्यक्रम वर्णन',
      'none': 'काहीही नाही',
      'camera_error': 'फोटो निवडताना त्रुटी',
      'create_event_error': 'कार्यक्रम तयार करताना त्रुटी',
      'contact_role_hint': 'उदा. कार्यक्रम समन्वयक',
      'phone_hint': '+91 XXXXX XXXXX',
      'no_events_scheduled': 'कोणताही कार्यक्रम नियोजित नाही.',
      'register': 'नोंदणी करा',
      'registered': 'नोंदणीकृत',
      'attendees': 'उपस्थित',
      'event_photos': 'कार्यक्रम फोटो',
      'tap_to_add_photos': 'फोटो जोडण्यासाठी टॅप करा',
      'add_more_photos': 'आणखी जोडा',
      'event_title_label': 'कार्यक्रम शीर्षक',
      'event_title_hint': 'कार्यक्रम शीर्षक प्रविष्ट करा',
      'event_description_hint': 'हा कार्यक्रम कशाबद्दल आहे?',
      'event_location_label': 'स्थान',
      'event_location_hint': 'कार्यक्रम कुठे आयोजित केला जाईल?',
      'event_date_time_label': 'कार्यक्रम तारीख आणि वेळ',
      'link_media_folder': 'मीडिया फोल्डर लिंक करा',
      'link_public_group': 'सार्वजनिक गटाशी लिंक करा',
      'optional_label': 'पर्यायी',
      'media_folder_desc': 'अतिरिक्त फोटो/व्हिडिओसाठी हा कार्यक्रम मीडिया फोल्डरशी लिंक करा.',
      'select_folder_hint': 'फोल्डर निवडा',
      'select_group_hint': 'सार्वजनिक गट निवडा',
      'uploading_photo_progress': 'फोटो {current} / {total} अपलोड करत आहे...',
      'creating_event_progress': 'कार्यक्रम तयार करत आहे...',
      'event_created_success': 'कार्यक्रम यशस्वीरित्या तयार केला!',
      'responsible_contact': 'जबाबदार संपर्क व्यक्ती',
      'select_user': 'वापरकर्ता निवडा',
      'client_label': 'क्लायंट',
      'date_label': 'तारीख',
      'time_label': 'वेळ',
      'address_label': 'पत्ता',
      'manage_service_types': 'सेवा प्रकार व्यवस्थापित करा',
      'available': 'उपलब्ध',
      'unavailable': 'अनुपलब्ध',
      'service_requests': 'सेवा विनंत्या',
      'uploading': 'अपलोड होत आहे...',

      // Quotes
      'quote_1': 'आपण जे विचार करतो तेच आपण बनतो.',
      'quote_2': 'मन हेच सर्वस्व आहे. तुम्ही जे विचार करता तेच तुम्ही बनता.',
      'quote_3': 'आपले विचार बदला आणि आपली दुनिया बदला.',
      'quote_4': 'भूतकाळात अडकू नका, भविष्‍याच्या स्वप्नात रमू नका, वर्तमान क्षणावर मन एकाग्र करा.',
      'quote_5': 'शांती आतून येते. तिला बाहेर शोधू नका.',
      'quote_6': 'आत्मा आपल्या विचारांच्या रंगात रंगली जाते.',
      'quote_7': 'तुम्ही स्वतःच्या नशिबाचे स्वामी आहात.',
      'quote_8': 'जगात जो बदल तुम्हाला बघायचा आहे, तो बदल स्वतः बना.',
      'quote_9': 'आनंद तुम्ही काय देऊ शकता यावर अवलंबून आहे, तुम्हाला काय मिळू शकते यावर नाही.',
      'quote_10': 'प्रेम हीच एकमेव वास्तविकता आहे.',

      // Interests
      'interest_music': 'संगीत',
      'interest_teaching': 'शिक्षण',
      'interest_social_service': 'समाज सेवा',
      'interest_meditation': 'ध्यान',
      'interest_youth_activities': 'युवा उपक्रम',
      'interest_event_organization': 'कार्यक्रम आयोजन',
      'interest_content_creation': 'सामग्री निर्मिती',
      'interest_technical_support': 'तांत्रिक साहाय्य',
      'select_gender': 'लिंग निवडा',
      'enter_full_name': 'कृपया तुमचे नाव प्रविष्ट करा',
      'enter_valid_phone': 'कृपया वैध 10-अंकी फोन नंबर प्रविष्ट करा',
      'enter_phone': 'कृपया तुमचा फोन नंबर प्रविष्ट करा',
      'select_dob': 'कृपया तुमची जन्मतारीख निवडा',
      'select_gender_error': 'कृपया तुमचे लिंग निवडा',
      
      // Spiritual
      'daily_quote': 'दैनिक उद्धरण',
      'meditation': 'ध्यान',
      'mantras': 'मंत्र',
      'teachings': 'शिकवण',
      'resources': 'संसाधने',
      'spiritual_tips': 'आध्यात्मिक टिप्स',
      'gayatri_mantra': 'गायत्री मंत्र',
      'books': 'पुस्तके',
      'audio': 'ऑडिओ',
      'videos': 'व्हिडिओ',
      'pictures': 'चित्रे',
      'bhajans': 'भजन',
      'no_books_available': 'कोणतीही पुस्तके उपलब्ध नाहीत',
      'no_audio_available': 'कोणताही ऑडिओ उपलब्ध नाही',
      'no_videos_available': 'कोणताही व्हिडिओ उपलब्ध नाही',
      'no_pictures_available': 'कोणतीही चित्रे उपलब्ध नाहीत',
      'no_bhajans_available': 'कोणतेही भजन उपलब्ध नाही',
      'check_back_later': 'नंतर पुन्हा तपासा!',
      // Chat
      'type_message': 'संदेश लिहा...',
      'send': 'पाठवा',
      'no_messages': 'अद्याप कोणताही संदेश नाही.',
      'start_conversation': 'संभाषण सुरू करा',
      // Admin
      'admin_dashboard': 'प्रशासक डॅशबोर्ड',
      'manage_users': 'वापरकर्ते व्यवस्थापित करा',
      'manage_groups': 'गट व्यवस्थापित करा',
      'manage_events': 'कार्यक्रम व्यवस्थापित करा',
      'manage_news': 'बातम्या व्यवस्थापित करा',
      'manage_services': 'सेवा व्यवस्थापित करा',
      'manage_branches': 'शाखा व्यवस्थापित करा',
      // Guruji
      'guruji_dashboard': 'गुरुजी डॅशबोर्ड',
      'my_groups_guruji': 'माझे गट',
      // Guruji Feature Extended
      'elder': 'वयोवृद्ध',
      'caregiver': 'काळजी घेणारा',
      'seva_tab': 'सेवा',
      'calendar_tab': 'दिनदर्शिका',
      'seva_coordinator_dashboard': 'सेवा समन्वयक डॅशबोर्ड',
      'gurujis_interested': 'गुरुजी इच्छुक',
      'i_can_take_request': 'मी ही विनंती स्वीकारू शकतो',
      'waiting_admin_assign': 'प्रशासकाच्या नियुक्तीची प्रतीक्षा',
      'volunteered_success': 'तुम्ही स्वेच्छेने भाग घेतला आहे! प्रशासकाला कळवले जाईल.',
      'user_requested_items_title': 'वापरकर्ता विनंती केलेल्या वस्तू',
      'note_prefix': 'टीप:',
      'edit_reason': 'कारण बदला',
      'not_possible': 'शक्य नाही',
      'confirm_btn': 'निश्चित करा',
      'user_attachments': 'जोडलेले:',
      'required_samagri_checklist': 'आवश्यक सामग्री:',
      'gallery': 'गॅलरी',
      'complete_action': 'पूर्ण करा',
      'completing_service': 'सेवा पूर्ण होत आहे...',
      'service_completed_success': 'सेवा पूर्ण झाल्याचे चिन्हांकित केले!',
      'mark_unavailable_confirm': 'तुम्ही नक्की उपस्थित राहू शकत नाही का?',
      'reason_optional': 'कारण (पर्यायी)',
      'sadhana_progress': 'साधना प्रगती',
      'no_students_in_group': 'या गटामध्ये अद्याप विद्यार्थी नाहीत',
      'private_not_shared': 'खाजगी / सामायिक केलेले नाही',
      // Auth Feature Extended
      'login_failed': 'लॉगिन अयशस्वी',
      'reset_password_desc': 'तुमचा ईमेल प्रविष्ट करा, आम्ही तुम्हाला पासवर्ड रिसेट लिंक पाठवू.',
      'enter_email_error': 'कृपया तुमचा ईमेल प्रविष्ट करा',
      'enter_valid_email_error': 'कृपया वैध ईमेल प्रविष्ट करा',
      'reset_link_sent': 'पासवर्ड रिसेट लिंक पाठवली! तुमचा ईमेल तपासा.',
      'enter_email_or_phone': 'कृपया तुमचा ईमेल किंवा फोन प्रविष्ट करा',
      'enter_password_error': 'कृपया तुमचा पासवर्ड प्रविष्ट करा',
      'signup_failed': 'साइनअप अयशस्वी',
      'terms_error_msg': 'कृपया नियम आणि अटी मान्य करा',
      'otp_title': 'ओटीपी सत्यापित करा',
      'otp_desc': 'तुमच्या फोन/ईमेलवर पाठवलेला 6-अंकी कोड प्रविष्ट करा',
      'resend_otp_timer': '{seconds} सेकंदात ओटीपी पुन्हा पाठवा',
      'didnt_receive_code': 'कोड मिळाला नाही?',
      'resend_otp_action': 'ओटीपी पुन्हा पाठवा',
      'verify_continue': 'सत्यापित करा आणि पुढे जा',
      'otp_resent_success': 'ओटीपी यशस्वीरित्या पुन्हा पाठवला',
      'set_username_title': 'तुमचे वापरकर्तानाव सेट करा',
      'change_username_title': 'वापरकर्तानाव बदला',
      'username_desc': 'एक अद्वितीय वापरकर्तानाव निवडा जे इतर तुम्हाला शोधण्यासाठी वापरू शकतील.',
      'username_label': 'वापरकर्तानाव',
      'username_hint': 'उदा., john_doe',
      'username_available': '✓ वापरकर्तानाव उपलब्ध आहे',
      'username_taken': '✗ वापरकर्तानाव आधीच घेतले आहे',
      'check_availability_error': 'उपलब्धता तपासण्यात त्रुटी',
      'username_required': 'वापरकर्तानाव आवश्यक आहे',
      'username_too_short': 'वापरकर्तानाव किमान 3 वर्णांचे असावे',
      'username_too_long': 'वापरकर्तानाव 20 वर्णांपेक्षा कमी असावे',
      'username_no_spaces': 'वापरकर्तानाव मध्ये स्पेस परवानगी नाही',
      'username_set_success': 'वापरकर्तानाव यशस्वीरित्या सेट केले!',
      'username_set_error': 'वापरकर्तानाव सेट करण्यात त्रुटी',
      'username_change_limit_msg': 'वापरकर्तानाव महिन्यातून फक्त एकदाच बदलले जाऊ शकते',
      'can_change_in_days': '{days} दिवसांत बदलू शकता',
      'can_change_now': 'आता बदलू शकता',
      'not_set_yet': 'अद्याप सेट नाही',
      'set_username_btn': 'वापरकर्तानाव सेट करा',
      'update_btn': 'अपडेट करा',
      // Errors and Messages
      'please_try_again': 'कृपया पुन्हा प्रयत्न करा',
      'no_internet': 'इंटरनेट कनेक्शन नाही',
      'session_expired': 'सत्र संपले. कृपया पुन्हा लॉगिन करा.',
      'invalid_email': 'कृपया वैध ईमेल प्रविष्ट करा',
      'password_too_short': 'पासवर्ड किमान 6 अक्षरांचा असावा',
      'passwords_dont_match': 'पासवर्ड जुळत नाहीत',
      'field_required': 'हे फील्ड आवश्यक आहे',
      'saved_successfully': 'यशस्वीरित्या जतन केले',
      'deleted_successfully': 'यशस्वीरित्या हटवले',
      'updated_successfully': 'यशस्वीरित्या अपडेट केले',
      'are_you_sure': 'तुम्हाला खात्री आहे का?',
      'this_action_cannot_be_undone': 'ही क्रिया पूर्ववत केली जाऊ शकत नाही.',
      // Welcome/Onboarding
      'welcome': 'स्वागत आहे',
      'get_started': 'सुरू करा',
      'skip': 'वगळा',
      'continue_text': 'सुरु ठेवा',
      'onboarding_title_1': 'समुदायाशी जोडले जा',
      'onboarding_desc_1': 'तुमच्या स्थानिक गायत्री परिवार भिवंडीशी जोडले जा आणि समान विचारांच्या आध्यात्मिक साधकांना भेटा',
      'onboarding_title_2': 'शिका आणि वाढा',
      'onboarding_desc_2': 'तुमच्या आध्यात्मिक प्रवासाला समृद्ध करण्यासाठी आध्यात्मिक अभ्यासक्रम, मंत्र आणि शिकवणी मिळवा',
      'onboarding_title_3': 'सेवेद्वारे योगदान द्या',
      'onboarding_desc_3': 'विविध सेवा संधींद्वारे समाजात योगदान द्या आणि बदल घडवा',
      // Tutorials
      'tutorial_request_service_title': 'सेवा विनंती',
      'tutorial_request_service_desc': 'यज्ञ, संस्कार इत्यादी समारंभांसाठी विनंती करा.',
      'tutorial_seva_title': 'सेवा संधी',
      'tutorial_seva_desc': 'निस्वार्थ सेवा उपक्रमांसाठी स्वयंसेवा करा.',
      'tutorial_groups_title': 'BSS गट',
      'tutorial_groups_desc': 'गटात सामील व्हा आणि चर्चा करा.',
      'tutorial_events_title': 'कार्यक्रम',
      'tutorial_events_desc': 'आगामी कार्यक्रम आणि योजनांबद्दल अद्ययावत रहा.',
      'tutorial_media_title': 'मीडिया लायब्ररी',
      'tutorial_media_desc': 'आध्यात्मिक संसाधने, PDF आणि व्हिडिओ पहा.',
      'tutorial_lms_title': 'संस्कार अभ्यासक्रम',
      'tutorial_lms_desc': 'आध्यात्मिक अभ्यासक्रमांसाठी नाव नोंदवा आणि तुमच्या शिकण्याच्या प्रगतीचा मागोवा घ्या.',
      'tutorial_celebrations_title': 'दैनिक उत्सव',
      'tutorial_celebrations_desc': 'आज कोणाचा वाढदिवस किंवा वर्धापनदिन आहे ते पहा.',
      'tutorial_profile_title': 'तुमची प्रोफाइल',
      'tutorial_profile_desc': 'तुमची सेटिंग्ज, भाषा आणि वैयक्तिक तपशील व्यवस्थापित करा.',
      'name': 'नाव',
      'phone': 'फोन',
      'important_info_emergency': 'महत्त्वाची माहिती आणि आपत्कालीन',
      'contacts': 'संपर्क',
      'locations': 'ठिकाणे',
      'sos_contacts': 'SOS संपर्क',
      'alerts': 'सूचना',
      'no_contacts_yet': 'अद्याप कोणतेही संपर्क नाहीत',
      'tap_to_add_contact': 'संपर्क जोडण्यासाठी + वर टॅप करा',
      'no_locations_yet': 'अद्याप कोणतीही ठिकाणे नाहीत',
      'tap_to_add_location': 'ठिकाण जोडण्यासाठी + वर टॅप करा',
      'add_tag': 'टॅग जोडा',
      'tag_name': 'टॅगचे नाव',
      'delete_tag': 'टॅग हटवा',
      'delete_tag_confirm': 'तुम्हाला नक्की टॅग "{tag}" हटवायचा आहे का?',
      'add_role': 'भूमिका जोडा',
      'role_name': 'भूमिकेचे नाव',
      'delete_role': 'भूमिका हटवा',
      'delete_role_confirm': 'तुम्हाला नक्की भूमिका "{role}" हटवायची आहे का?',
      'edit_contact': 'संपर्क संपादित करा',
      'add_contact': 'संपर्क जोडा',
      'sort_order': 'क्रमवारी',
      'tags': 'टॅग',
      'no_tags_available': 'कोणतेही टॅग उपलब्ध नाहीत. त्यांना सेटिंग्ज टॅबमध्ये जोडा.',
      'edit_location': 'ठिकाण संपादित करा',
      'add_location': 'ठिकाण जोडा',
      'location_name': 'ठिकाणाचे नाव',
      'google_maps_link': 'गुगल मॅप्स लिंक',
      'latitude': 'अक्षांश',
      'longitude': 'रेखांश',
      'add_emergency_contact': 'आपत्कालीन संपर्क जोडा',
      'role': 'भूमिका',
      'no_roles_available': 'कोणत्याही भूमिका उपलब्ध नाहीत. त्यांना सेटिंग्ज टॅबमध्ये जोडा.',
      'displayed_as_tag': 'विजेटमध्ये टॅग म्हणून प्रदर्शित',
      'resolved_requests': 'सोडवलेल्या विनंत्या',
      'active_requests': 'सक्रिय विनंत्या',
      'tutorial_calendar_desc': 'आगामी सण, कार्यक्रम आणि महत्त्वाच्या तारखा पहा.',
      'tutorial_news_desc': 'नवीनतम बातम्या आणि घोषणांसह अद्ययावत रहा.',
      'tutorial_spiritual_desc': 'आध्यात्मिक संसाधने, उद्धरण आणि टिप्स पहा.',
      'tutorial_bottom_nav_title': 'नेव्हिगेशन',
      'tutorial_bottom_nav_desc': 'होम, गट, कार्यक्रम, आध्यात्मिक आणि प्रोफाइल दरम्यान स्विच करण्यासाठी हे टॅब वापरा.',
      'tutorial_guruji_today_title': 'आजचे वेळापत्रक',
      'tutorial_guruji_today_desc': 'आजसाठी तुमच्या सेवा पहा.',
      'tutorial_guruji_new_req_title': 'नवीन विनंत्या',
      'tutorial_guruji_new_req_desc': 'नवीन सेवा विनंत्या ब्राउझ करा आणि स्वयंसेवा करा.',
      'tutorial_guruji_assigned_title': 'माझ्या सेवा',
      'tutorial_guruji_assigned_desc': 'तुम्ही स्वयंसेवा केलेल्या सेवांचे व्यवस्थापन करा.',
      'tutorial_guruji_seva_title': 'सेवा संधी',
      'tutorial_guruji_seva_desc': 'सामान्य सेवा क्रियाकलाप पहा आणि व्यवस्थापित करा.',
      'tutorial_guruji_calendar_title': 'कॅलेंडर',
      'tutorial_guruji_calendar_desc': 'आगामी सेवा वेळापत्रक पहा.',
      // Important Info
      'important_contacts_subtitle': 'आणीबाणी आणि महत्त्वाचे संपर्क पहा',
      'important_locations_subtitle': 'महत्त्वाची ठिकाणे आणि दिशानिर्देश पहा',
      'important_badge': 'महत्त्वाचे',
      'no_schedules_available': 'कोणतेही वेळापत्रक उपलब्ध नाही',
      'check_back_later_timings': 'मंदिराच्या वेळेसाठी नंतर पहा',
      'gayatri_mandir_title': 'गायत्री मंदिर',
      'daily_schedule': 'दैनिक वेळापत्रक',
      'daily': 'दैनिक',
      'items': 'आयटम',
      'start_time': 'सुरूवातीची वेळ',
      'end_time': 'समाप्तीची वेळ',
      'repeats_daily': 'दररोज पुनरावृत्ती होते',
      'havan': 'हवन',
      // Public Groups
      'browse_groups': 'सार्वजनिक गट पहा',
      'no_public_groups': 'कोणताही सार्वजनिक गट उपलब्ध नाही',
      'no_results': 'कोणतेही परिणाम सापडले नाहीत',
      'public_group': 'सार्वजनिक गट',
      'request_to_join': 'सामील होण्याची विनंती',
      'join_request_sent': 'सामील होण्याची विनंती पाठवली',
      // Spiritual Feature
      'sadhana_tracker': 'साधना ट्रॅकर',
      'mantra': 'मंत्र',
      'daily_target': 'दैनिक ध्येय',
      'malas': 'माला',
      'completion': 'पूर्तता',
      'quotes': 'आध्यात्मिक सुविचार',
      'achievements': 'उपलब्धी',
      'lifetime_progress': 'जीवनभराची प्रगती',
      'calendar_heatmap': 'मागील 30 दिवस',
      'personal_records': 'वैयक्तिक विक्रम',
      'best_day': 'सर्वोत्तम दिवस',
      'best_streak': 'सर्वोत्तम सातत्य',
      'locked': 'लॉक',
      'unlocked': 'अनलॉक',
      'reminder_settings': 'रिमाइंडर सेटिंग्ज',
      'daily_reminder': 'दैनिक रिमाइंडर',
      'set_reminder_time': 'रिमाइंडर वेळ सेट करा',
      'reset_count': 'मोजणी रीसेट करा',
      'reset_count_confirm': 'तुम्हाला आजची मोजणी रीसेट करायची आहे का?',
      'total_malas': 'एकूण माला',
      'active_days': 'सक्रिय दिवस',
      'this_week': 'हा आठवडा',
      'this_month': 'हा महिना',
      'mantra_distribution': 'मंत्र वितरण',
      'start_sadhana_analytics': 'अॅनालिटिक्स पाहण्यासाठी साधना सुरू करा!',
      'please_login_analytics': 'अॅनालिटिक्स पाहण्यासाठी कृपया लॉगिन करा',
      'select_mantra': 'मंत्र निवडा',
      'tap_count': 'मोजण्यासाठी टॅप करा किंवा दाबून ठेवा',
      'counting': 'मोजत आहे...',
      'malas_done': 'माला पूर्ण',
      'target': 'लक्ष्य',
      'total_count': 'एकूण जाप',
      'daily_progress': 'दैनिक प्रगती',
      'target_met': 'लक्ष्य पूर्ण झाले!',
      'add_full_mala': 'पूर्ण माला जोडा (+108)',
      'complete_mala_btn': 'माला पूर्ण करा',
      'complete_mala_title': 'माला पूर्ण करायची?',
      'confirm_complete_mala': 'तुम्ही ही माला पूर्ण करणार आहात.',
      'mala_completed_title': 'माला पूर्ण झाली!',
      'unlocked_prefix': 'अनलॉक:',
      // Achievements Data
      'achv_first_mala_title': 'ओम शांती',
      'achv_first_mala_desc': '108 मंत्रांची आपली पहिली माला पूर्ण करा.',
      'achv_streak_7_title': 'साधक',
      'achv_streak_7_desc': 'सलग 7 दिवस साधना चालू ठेवा.',
      'achv_streak_30_title': 'योगी',
      'achv_streak_30_desc': 'सलग 30 दिवस साधना चालू ठेवा.',
      'achv_malas_108_title': 'भक्त',
      'achv_malas_108_desc': 'एकूण 108 माला पूर्ण करा.',
      'achv_malas_1008_title': 'मंत्र तज्ञ',
      'achv_malas_1008_desc': 'एकूण 1008 माला पूर्ण करा.',
      // Family Connections
      'family_connections': 'कौटुंबिक कनेक्शन',
      'family_connections_subtitle': 'त्यांच्या साधनेला पाठिंबा देण्यासाठी कुटुंबाशी जोडा',
      'send_family_link_request': 'कौटुंबिक लिंक विनंती पाठवा',
      'manage_family_links': 'कौटुंबिक लिंक व्यवस्थापित करा',
      'my_connections': 'माझे कनेक्शन',
      'pending_requests': 'प्रलंबित विनंत्या',
      'no_family_connections': 'अद्याप कोणतेही कौटुंबिक कनेक्शन नाही',
      'no_pending_family_requests': 'कोणत्याही कौटुंबिक लिंक विनंत्या नाहीत',
      'family_requests_appear_here': 'कौटुंबिक लिंक विनंत्या येथे दिसतील',
      'send_link_request': 'लिंक विनंती पाठवा',
      'email_username': 'ईमेल / वापरकर्तानाव',
      'enter_email_or_username': 'ईमेल किंवा @वापरकर्तानाव प्रविष्ट करा',
      'email_or_username_required': 'ईमेल किंवा वापरकर्तानाव आवश्यक आहे',
      'user_not_found': 'वापरकर्ता सापडला नाही',
      'searching': 'शोधत आहे...',
      'you_will_be_supporter_of': 'तुम्ही समर्थक असाल',
      'relationship_type': 'नातेसंबंध प्रकार',
      'parent_to_child': 'पालक → मूल',
      'parent_child_desc': 'तुम्ही पालक किंवा अभिभावक आहात जे मुलाच्या साधनेला आणि गृहपाठाला पाठिंबा देत आहात.',
      'caregiver_to_elder': 'काळजीवाहू → ज्येष्ठ',
      'caregiver_elder_desc': 'तुम्ही ज्येष्ठ कुटुंबातील सदस्याला मार्गदर्शन आणि पाठिंब्यासह मदत करत आहात.',
      'supporter_helper_text': 'तुम्ही समर्थक असाल. निवडलेला वापरकर्ता तो असेल ज्याला तुम्ही पाठिंबा द्याल.',
      'message_optional': 'संदेश (पर्यायी)',
      'add_personal_message': 'वैयक्तिक संदेश जोडा...',
      'send_request': 'विनंती पाठवा',
      'sending': 'पाठवत आहे...',
      'link_request_sent': 'लिंक विनंती यशस्वीरित्या पाठविली!',
      'family_link_accepted': 'कौटुंबिक लिंक स्वीकारली!',
      'request_declined': 'विनंती नाकारली',
      'unlink': 'लिंक काढा',
      'unlink_confirm': 'तुम्हाला नक्की हे कनेक्शन अनलिंक करायचे आहे का?',
      'family_linking': 'कुटुंब',
      'parent_child_link_request': 'पालक-मूल लिंक विनंती',
      'elder_caregiver_link_request': 'ज्येष्ठ-काळजीवाहू लिंक विनंती',
      'from': 'कडून',
      'requested': 'विनंती केली',
      'about_family_connections': 'कौटुंबिक कनेक्शनबद्दल',
      'family_connections_desc': 'तुम्ही कुटुंबातील सदस्यासोबत लिंक करू शकता जेणेकरून समर्थन-देणाऱ्या मार्गाने त्यांची आध्यात्मिक साधना आणि गृहपाठ प्रगती पाहू शकाल.',
      'active': 'सक्रिय',
      'view_practice': 'प्रगती पहा',
      'child_dashboard': 'बाल डॅशबोर्ड',
      'view_alerts': 'अलर्ट पहा',
      'emergency_alerts': 'आणीबाणी अलर्ट',
      'no_emergency_alerts': 'कोणतेही आणीबाणी अलर्ट नाहीत',
      'emergency_sos_alert': 'आणीबाणी SOS अलर्ट',
      'resolved_on': 'निराकरण केले',
      'no_resolved_requests': 'कोणतीही विनंती निराकरण केली नाही',
      'requested_on': 'विनंती केली',
      'connected_since': 'पासून जोडलेले',
      'confirm_unlink_title': 'कौटुंबिक कनेक्शन काढावे?',
      'confirm_unlink_message': 'हे आपल्या कौटुंबिक कनेक्शनला काढून टाकेल आणि साधना माहिती सामायिक करणे थांबवेल. ही क्रिया पूर्ववत केली जाऊ शकत नाही.',
      'family_link_request': 'कौटुंबिक लिंक विनंती',
      'practice_and_homework': 'साधना आणि गृहपाठ',
      'support_learning': 'शिक्षणास समर्थन',
      'no_practice_data': 'अद्याप साधना डेटा नाही',
      'not_tracking_practice': 'ने साधना ट्रॅकिंग सुरू केले नाही',
      'practice_summary': 'साधना सारांश',
      'duration': 'कालावधी',
      'bss_attendance': 'बीएसएस उपस्थिती',
      'present': 'उपस्थित',
      'absent': 'अनुपस्थित',
      'deadline': 'अंतिम मुदत',
      'attachment': 'संलग्नक',
      'submission': 'सादरीकरण',
      'late': 'उशीर',
      'on_time': 'वेळेवर',
      'submitted_on': 'सादर केले',
      'view_submitted_work': 'सादर केलेले कार्य पहा (PDF)',
      'homework_accepted': 'गृहपाठ स्वीकारला',
      'needs_revision': 'सुधारणा आवश्यक',
      'remark_by': 'द्वारा',
      'status_pending': 'प्रलंबित',
      'status_submitted': 'सादर केले',
      'status_checked': 'तपासले',
      'minutes_short': 'मिनि',
      'hours_short': 'तास',
      'request_accepted': 'विनंती स्वीकारली!',
      // Emergency Help
      'emergency_help': 'आपत्कालीन मदत',
      'emergency_help_subtitle': 'गरज असताना मदत मिळवा',
      'need_help_btn': 'मदत हवी आहे',
      'alert_family_admin': 'कुटुंब आणि ॲडमिनला सतर्क करा',
      'wait_message': 'कृपया मदत विनंत्यांमध्ये 15 मिनिटे प्रतीक्षा करा',
      'or_call_directly': 'किंवा थेट कॉल करा',
      'help_requested_note': 'ॲपद्वारे मदतीची विनंती केली',
      'alert_sent_success': '✅ अलर्ट पाठवला! मदत येत आहे.',
      'emergency_error': 'त्रुटी',
      // Groups Feature Extended
      'create_new_group': 'नवीन गट तयार करा',
      'group_type_label': 'गट प्रकार',
      'event_group': 'इव्हेंट',
      'bss_group_title': 'बाल संस्कार शाळा',
      'meeting_group': 'बैठक',
      'custom_group': 'कस्टम',
      'only_admin_create_bss': 'फक्त प्रशासक आणि गुरुजी बीएसएस गट तयार करू शकतात',
      'select_branch_error': 'कृपया शाखा निवडा',
      'select_guruji_error': 'कृपया गुरुजी निवडा',
      'enable_attendance': 'हजेरी ट्रॅकिंग सक्षम करा',
      'allow_marking_attendance': 'या बैठकीसाठी हजेरी चिन्हांकित करण्यास अनुमती द्या',
      'public_group_label': 'सार्वजनिक गट',
      'private_group_label': 'खाजगी गट',
      'public_group_desc': 'कोणीही हा गट शोधू शकतो आणि सामील होण्याची विनंती करू शकतो',
      'private_group_desc': 'फक्त आमंत्रित सदस्य हा गट पाहू शकतात आणि सामील होऊ शकतात',
      'public_group_approval_note': 'सार्वजनिक गट प्रत्येकासाठी दृश्यमान होण्यापूर्वी प्रशासकाच्या मंजूरीची आवश्यकता असते.',
      'group_created_approval': 'गट तयार झाला! सार्वजनिक होण्यासाठी प्रशासकाच्या मंजूरीची प्रतीक्षा आहे.',
      'group_created_success': 'गट यशस्वीरित्या तयार झाला!',
      'edit_group_title': 'गट संपादित करा',
      'delete_group_title': 'गट हटवा?',
      'delete_group_confirm': 'तुम्ही नक्की "{groupName}" हटवू इच्छिता? ही कृती पूर्ववत केली जाऊ शकत नाही.',
      'group_name_empty_error': 'गटाचे नाव रिकामे असू शकत नाही',
      'group_updated_success': 'गट यशस्वीरित्या अद्यतनित केला',
      'group_deleted_success': 'गट यशस्वीरित्या हटविला',
      'join_request_success_waiting': 'सामील होण्याची विनंती पाठविली! प्रशासकाच्या मंजूरीची प्रतीक्षा आहे.',
      'check_back_later_groups': 'सामील होण्यासाठी नवीन गटांसाठी नंतर तपासा',
      'try_different_search': 'वेगळ्या शोध शब्दाचा प्रयत्न करा',
      'no_public_groups_avail': 'कोणताही सार्वजनिक गट उपलब्ध नाही',
      'search_groups_hint': 'गट शोधा...',
      // Browse Groups Extended
      'available_to_join': 'सामील होण्यासाठी उपलब्ध',
      'your_public_groups': 'चे सार्वजनिक गट',
      'no_public_groups_joined': 'कोणताही सार्वजनिक गट सामील झाला नाही',
      'groups_you_join_appear_here': 'तुम्ही सामील झालेले गट येथे दिसतील',
      'no_groups_created': 'कोणताही गट तयार केला नाही',
      'public_groups_you_create_appear_here': 'तुम्ही तयार केलेले सार्वजनिक गट येथे दिसतील',
      'no_groups_with_status': 'या स्थितीसह कोणतेही गट नाहीत',
      'your_group_requests': 'तुमच्या गट विनंत्या',
      'all_groups_joined_or_none': 'सर्व सार्वजनिक गट सामील झाले आहेत किंवा कोणीही उपलब्ध नाही',
      'explore': 'अन्वेषण',
      'public_groups_title': 'सार्वजनिक गट',
      // Admin Emergency Requests (Marathi)
      'no_active_emergency_requests': 'कोणतीही सक्रिय आपत्कालीन विनंती नाही',
      'urgent': 'तातडीचे',
      'request_acknowledged': 'विनंती स्वीकृत झाली',
      'request_resolved': 'विनंती सोडवली',
      'no_phone_available': 'फोन नंबर उपलब्ध नाही',
      'could_not_launch_dialer': 'डायलर उघडता आला नाही',
      'no_phone_linked': 'खात्याशी कोणताही फोन नंबर जोडलेला नाही',
      'loading_contact_info': 'संपर्क माहिती लोड होत आहे...',
      'acknowledge': 'स्वीकार करा',
      'resolve': 'सोडवा',
      'call': 'कॉल करा',
      // Admin Emergency Contacts (Marathi)
      'no_sos_contacts_yet': 'अद्याप कोणतेही SOS संपर्क नाहीत',
      'tap_to_add_one': 'जोडण्यासाठी + टॅप करा',
      'delete_contact': 'संपर्क हटवा',
      'delete_contact_confirm': 'तुम्हाला हा संपर्क हटवायचा आहे का?',
      'select_role': 'भूमिका निवडा',
      // Family Linking (Marathi)
      'family_link_requests_empty': 'कुटुंब लिंक विनंत्या येथे दिसतील',
      'family_connection_removed': 'कुटुंब कनेक्शन काढले',
      'search_by_email_or_username': 'ईमेल किंवा @यूजरनेमने शोधा',
      'searching_for_user': 'शोधत आहे...',
      'already_linked': 'तुम्ही या वापरकर्त्याशी आधीच जोडलेले आहात',
      'pending_request_exists': 'प्रलंबित विनंती आधीच अस्तित्वात आहे',
      'cannot_link_to_self': 'तुम्ही स्वतःशी लिंक करू शकत नाही',
      'request_sent_success': 'विनंती यशस्वीरित्या पाठवली!',
      'accept_request': 'स्वीकारा',
      'decline_request': 'नकार द्या',
      'sent_requests': 'पाठवलेल्या विनंत्या',
      'received_requests': 'प्राप्त विनंत्या',
      'unlink_family': 'अनलिंक करा',
      'unlink_confirm_title': 'कुटुंब सदस्य अनलिंक करा',
      'unlink_confirm_body': 'तुम्हाला या कुटुंब सदस्याला अनलिंक करायचे आहे का?',
      'relation_type_parent': 'पालक',
      'relation_type_child': 'मूल',
      'relation_type_spouse': 'जोडीदार',
      'relation_type_sibling': 'भाऊ-बहीण',
      'relation_type_other': 'इतर',
      // Anushthan & Gamification
      'start_anushthan': 'अनुष्ठान प्रारंभ करा',
      'active_anushthan': 'सक्रिय अनुष्ठान',
      'active_anushthan_warning': 'तुमचे एक अनुष्ठान आधीच सक्रिय आहे. कृपया आधी ते पूर्ण करा किंवा थांबवा.',
      'anushthan_history': 'अनुष्ठान इतिहास',
      'duration_days': '{days} दिवस',
      'start_date': 'प्रारंभ तारीख',
      'end_date': 'समाप्ती तारीख',
      'expected_end_date': 'अपेक्षित समाप्ती',
      'malas_completed': 'माळा पूर्ण',
      'daily_target_malas': 'दैनिक लक्ष्य (माळा)',
      'no_completed_anushthans': 'अद्याप कोणतेही अनुष्ठान पूर्ण झाले नाही',
      'start_first_anushthan': 'तुमचा आध्यात्मिक प्रवास सुरू करण्यासाठी पहिले अनुष्ठान सुरू करा!',
      'total_days': 'एकूण दिवस',
      'days_left': '{count} दिवस बाकी',
      'log_todays_practice': 'आजची साधना नोंदवा',
      'view_certificate': 'प्रमाणपत्र पहा',
      'sadhana_record': 'साधना रेकॉर्ड',
      'anushthan_completion': 'अनुष्ठान पूर्णता',
      'open': 'उघडा',
      'share_blessings': 'आशीर्वाद शेअर करा',
      'certificate_saved_to': 'प्रमाणपत्र {path} वर जतन केले',
      'error_sharing_pdf': 'PDF शेअर करण्यात त्रुटी',
      'error_saving_pdf': 'PDF जतन करण्यात त्रुटी',
      'my_spiritual_journey': 'माझा आध्यात्मिक प्रवास',
      'milestones': 'मैलाचे दगड',
      'pause_anushthan': 'अनुष्ठान थांबवा',
      'resume_anushthan': 'अनुष्ठान पुन्हा सुरू करा',
      'guruji_visibility': 'गुरुजी दृश्यता',
      'committed_practice_desc': 'वचनबद्ध आध्यात्मिक सराव',
      'choose_mantra_hint': 'मंत्र निवडा',
      'days_suffix': 'दिवस',
      'mantras_per_day': '{count} मंत्र प्रति दिवस',
      'begin_anushthan': 'अनुष्ठान सुरू करा',
      'anushthan_started_success': '🙏 अनुष्ठान सुरू झाले! तुमची साधना आशीर्वादित होवो.',
      
      // Anushthan Status & UI
      'active_status': 'सक्रिय',
      'resting_status': 'विश्राम',
      'completed_status': 'पूर्ण',
      'paused_status': 'विराम',
      'day_label': 'दिवस',
      'remaining_label': 'शिल्लक',
      'todays_practice_pending': 'आजची साधना बाकी',
      'todays_practice_complete': 'आजची साधना पूर्ण ✓',
      'anushthan_in_progress': 'अनुष्ठान चालू आहे',
      'start_anushthan_subtitle': '7, 11, 21 किंवा 40 दिवसांच्या साधनेचा संकल्प घ्या',
      'total_malas_today': 'एकूण: आज {count} माळा',
      'x_of_y_malas': '{x} / {y} माळा',
      
      'malas_daily_format': '{count} माळा / दिवस',
      'duration_short': 'लघु',
      'last_synced': 'शेवटचे सिंक: ',
      'sync_success': '{count} नोंदी यशस्वीरित्या सिंक झाल्या',
      'no_data_to_sync': 'सिंक करण्यासाठी कोणताही डेटा नाही',
      'sync_failed': 'सिंक अयशस्वी',
      'just_now': 'आत्ताच',
      'minutes_ago': '{count} मिनिटांपूर्वी',
      'hours_ago': '{count} तासांपूर्वी',
      'yesterday': 'काल',
      'days_ago': '{count} दिवसांपूर्वी',
      'duration_medium': 'मध्यम',
      'duration_long': 'दीर्घ',
      'duration_extended': 'विस्तृत',
      'certificate_blessing': '🙏 तुमची भक्ती तुम्हाला शांती आणि आशीर्वाद देवो 🙏',

      // Group Homework
      'view_submissions': 'सबमिशन पहा',
      'assign_homework': 'गृहपाठ द्या',
      'edit_homework': 'गृहपाठ संपादित करा',
      'update_homework': 'गृहपाठ अपडेट करा',
      'delete_homework_title': 'गृहपाठ हटवा',
      'delete_homework_confirm': 'तुम्हाला नक्की हा गृहपाठ हटवायचा आहे का? ही क्रिया पूर्ववत केली जाऊ शकत नाही.',
      'due_date_label': 'अंतिम मुदत',
      'assigned_by_label': '{name} द्वारे',
      'overdue': 'मुदत संपली',
      'no_homework_assigned': 'अद्याप कोणताही गृहपाठ दिलेला नाही',
      'homework_title': 'गृहपाठ शीर्षक',
      'title_required': 'शीर्षक आवश्यक आहे',
      'description_required': 'वर्णन आवश्यक आहे',
      'no_attachments': 'कोणतीही जोडणी नाही',
      'attachment_count': '{count} फाइल',
      'submissions_title': 'सबमिशन',
      'no_submissions_yet': 'अद्याप कोणतेही सबमिशन नाहीत',
      'your_submitted_pdf': 'तुमचे सबमिट केलेले PDF',
      'view_submission_pdf': 'सबमिशन PDF पहा',
      'update_status_review': 'स्थिती / पुनरावलोकन अपडेट करा',
      'redo_needed': 'पुन्हा करणे आवश्यक',
      'mark_checked': 'तपासलेले म्हणून चिन्हांकित करा',
      'request_redo': 'पुन्हा करण्याची विनंती करा',
      'comment_optional': 'टिप्पणी (वैकल्पिक)',
      'add_feedback_hint': 'विद्यार्थ्यासाठी अभिप्राय जोडा...',
      'submissions_closed_msg': 'या गृहपाठासाठी सबमिशन बंद आहेत.',
      'homework_assigned_success': 'गृहपाठ यशस्वीरित्या दिला!',
      'homework_updated_success': 'गृहपाठ यशस्वीरित्या अपडेट केला!',
      'homework_submitted_success': 'गृहपाठ यशस्वीरित्या सबमिट केला!',
      'stop_receiving_submissions': 'सबमिशन स्वीकारणे थांबवा',
      'stop_submissions_subtitle': 'मुदत भविष्यात असली तरीही व्यक्तिचलितपणे सबमिशन बंद करा',
      'upload_submission': 'सबमिशन अपलोड करा',
      'submit_homework': 'गृहपाठ सबमिट करा',
      'resubmit_homework': 'गृहपाठ पुन्हा सबमिट करा',
      'upload_pdf_helper': 'तुमच्या कामाची एक PDF फाइल अपलोड करा',
      'select_pdf_file': 'PDF फाइल निवडा',
      'submission_status_submitted': 'सबमिट केले',
      'submission_status_redo': 'पुन्हा करा',
      'submission_status_checked': 'तपासले',
      'submission_status_not_done': 'झाले नाही',
      'attachment_label': 'जोडणी',
      'saving': 'जतन करत आहे...',
      'marker_first_steps_title': 'पहिली पावले',
      'marker_first_steps_desc': 'तुमची पहिली माळ (108 मंत्र) पूर्ण करा',
      'marker_consistent_yogi_title': 'सातत्यपूर्ण योगी',
      'marker_consistent_yogi_desc': 'सलग 3 दिवस साधना करा',
      'marker_dedicated_disciple_title': 'समर्पित शिष्य',
      'marker_dedicated_disciple_desc': '7 दिवसांचे सातत्य राखा',
      'marker_century_club_title': 'शतक क्लब',
      'marker_century_club_desc': 'एकूण 100 माळा पूर्ण करा',
      'marker_mantra_master_title': 'मंत्र तज्ञ',
      'marker_mantra_master_desc': 'एकूण 1,000 मंत्रांचा जप करा',
      'marker_anushthan_adept_title': 'अनुष्ठान निपुण',
      'marker_anushthan_adept_desc': 'तुमचे पहिले अनुष्ठान पूर्ण करा',
      'marker_early_riser_title': 'प्रात:काल साधक',
      'marker_early_riser_desc': 'सकाळी 6 वाजण्यापूर्वी एक माळ पूर्ण करा',
      'marker_digital_monk_title': 'डिजिटल साधक',
      'marker_digital_monk_desc': '30 दिवस साधना ट्रॅकर वापरा',
      'marker_first_seva_title': 'पहिली सेवा',
      'marker_first_seva_desc': 'तुमची पहिली सेवा उपक्रम पूर्ण करा',
      'tap_members_view_details': 'तपशील पाहण्यासाठी सदस्यांवर टॅप करा',
      'no_groups_joined_guidance': 'तुम्ही अद्याप कोणत्याही गटात सामील झाले नाही',
      'join_group_guidance': 'मार्गदर्शन पाहण्यासाठी गटात सामील व्हा',
      'batch': 'बॅच',
      'request_sent_label': 'विनंती पाठवली',
      'request_received_label': 'विनंती प्राप्त',
      'already_connected_msg': 'तुमची आधीच या वापरकर्त्याशी जोडलेले आहात.',
      'request_pending_msg': 'तुमच्या आणि या वापरकर्त्यामध्ये एक विनंती आधीच प्रलंबित आहे.',
      'request_cancelled': 'विनंती रद्द केली',
      'no_attendance_records': 'अद्याप कोणतीही उपस्थिती रेकॉर्ड नाही',
      'app_preferences': 'अॅप प्राधान्ये',
      'reset_tutorial': 'ट्यूटोरियल रीसेट करा',
      'reset_tutorial_subtitle': 'अॅप टूर पुन्हा पहा',
      'linked_storage_folder': 'लिंक्ड स्टोरेज फोल्डर',
      'no_folder_linked': 'कोणतेही फोल्डर लिंक केलेले नाही',
      'change': 'बदला',
      'filter_options': 'फिल्टर पर्याय',
      'no_date_set': 'कोणतीही तारीख सेट नाही',
      'search_by_name': 'नावाने शोधा...',
      'no_users_found': 'कोणताही वापरकर्ता आढळला नाही',
      'mandir_services': 'मंदिर सेवा',
      'seva_volunteer': 'सेवा (स्वयंसेवक)',
      'offline_backup_message': '📱 तुमचे मोजणी या डिव्हाइसवर सुरक्षितपणे जतन केली आहेत.\nतुम्ही ऑनलाइन असाल तेव्हा आपोआप बॅकअप होतील.',
      'history': 'इतिहास',
      'sadhana_history': 'साधना इतिहास',
      'no_records_yet': 'अद्याप कोणतेही रेकॉर्ड नाही',
      'day_streak': 'दिवसांची सलग साधना!',
      'keep_flame_alive': 'ज्योत जलत ठेवा!',
      'complete_mala_start': 'सुरू करण्यासाठी एक माला पूर्ण करा',
      'malas_label': 'माला',
      'please_login': 'कृपया लॉगिन करा',
      'no_emergency_contacts': 'कोणतीही अधिकृत आपत्कालीन संपर्क सूचीबद्ध नाहीत.',
      'select_folder': 'फोल्डर निवडा',
      'clear_selection': 'निवड रद्द करा',
      'select_current': 'वर्तमान निवडा',
      'activity_guruji_approved_item_detail': 'गुरुजींनी {item} मंजूर केले',
      'activity_guruji_rejected_item_detail': 'गुरुजींनी {item} नाकारले — कारण: {reason}',
      'activity_approved_all_detail': 'गुरुजींनी सर्व साहित्य मंजूर केले — संपादन लॉक केले',
      'activity_revision_requested_detail': 'गुरुजींनी सुधारणा करण्याची विनंती केली: {reason}',
      'activity_user_revised_detail': 'वापरकर्त्याने विनंती सुधारली.',
      'activity_user_selected_item_detail': 'वापरकर्त्याने निवडले: {item} ✓',
      'activity_user_deselected_item_detail': 'वापरकर्त्याने निवड रद्द केली: {item}',
      'activity_guruji_volunteered_detail': '{name} यांनी या विनंतीसाठी स्वयंसेवा दिली',
      'activity_guruji_left_note_detail': 'गुरुजींनी एक टीप सोडली',
      'activity_admin_left_note_detail': 'अ‍ॅडमिनने उत्तर दिले',
      'seva_opportunities': 'सेवा संधी',
      // Seva Assignment Workflow
      'seva_assignments': 'तुमच्या सोपवलेल्या सेवा',
      'no_assignments': 'अजून कोणतीही सेवा सोपवलेली नाही',
      'will_be_notified': 'Admin जेव्हा तुम्हाला सेवा व्यवस्थापनासाठी नियुक्त करतील तेव्हा सूचित करण्यात येईल',
      'pending_response': 'तुमच्या प्रतिसादाची प्रतीक्षा आहे',
      'admin_notes': 'Admin च्या टिप्पण्या',
      'accept_assignment': 'स्वीकारा',
      'reject_assignment': 'नाकारा',
      'assignment_accepted': 'स्वीकारले',
      'assignment_rejected': 'नाकारले',
      'assignment_pending': 'प्रलंबित',
      'confirm_accept_title': 'स्वीकृतीची पुष्टी करा',
      'confirm_accept_msg': 'तुम्ही निश्चित आहात की तुम्ही ही सेवा नियुक्ती स्वीकारू इच्छिता?',
      'you_will_be_responsible': 'तुम्ही जबाबदार असाल',
      'managing_attendance': 'सहभागींची उपस्थिती व्यवस्थापित करण्यासाठी',
      'giving_appreciation': 'स्वयंसेवकांना प्रशंसा देण्यासाठी',
      'confirm_accept_btn': 'स्वीकार पुष्टी करा',
      'rejection_reason_title': 'नाकारण्याचे कारण',
      'rejection_reason_min': 'कृपया कारण द्या (किमान 10 अक्षरे)',
      'submit_rejection': 'नाकार सबमिट करा',
      'will_notify_admin': 'यामुळे Admin ला सूचित केले जाईल',
      'admin_message_optional': 'गुरुजींसाठी ऐच्छिक संदेश',
      'admin_message_hint': 'उदा., कृपया 30 मिनिटे लवकर या',
      'select_gurujis': 'गुरुजी निवडा',
      'search_gurujis': 'गुरुजी शोधा...',
      'assignment_status': 'नियुक्तीची स्थिती',
      'only_assigned_gurujis': 'फक्त नियुक्त केलेले गुरुजी या सेवेचे व्यवस्थापन करू शकतात',
      'accepted_on': 'स्वीकारले',
      'rejected_on': 'नाकारले',
      'assigned_on': 'नियुक्त केले',
      // Service Request Fields
      'enter_description': 'सेवा वर्णन प्रविष्ट करा',
      'select_date': 'तारीख निवडा',
      'select_time': 'वेळ निवडा',
      'flat_floor_hint': 'उदा. 201, 2रा मजला',
      'building_hint': 'उदा., गायत्री अपार्टमेंट',
      'street_hint': 'उदा., एमजी रोड',
      'landmark_hint': 'उदा., सिटी हॉस्पिटलजवळ',
      // My Requests
      'search_by_description_address': 'वर्णन किंवा पत्त्यावरून शोधा...',
      'all_status': 'सर्व स्थिती',
      // Service Status Labels
      'status_accepted': 'स्वीकृत',
      'status_unavailable': 'अनुपलब्ध',
      'status_completed': 'पूर्ण',
      // News Categories
      'news_and_updates': 'बातम्या आणि अपडेट',
      'news_category_all': 'सर्व',
      'news_category_spiritual': 'आध्यात्मिक',
      'news_category_events': 'कार्यक्रम',
      'news_category_seva': 'सेवा',
      'news_category_youth': 'युवा',
      'news_category_notices': 'सूचना',
      'news_category_magazine': 'मासिक',
      // Additional Service Request Keys
      'house_no_hint': 'घर क्र',
      'contact_number': 'संपर्क क्रमांक',
      'alternate_contact_hint': 'वैकल्पिक संपर्क (ऐच्छिक)',
      'landmark': 'लँडमार्क',
      'news_updates': 'बातम्या आणि अद्यतने',
      'youth': 'युवा',
      'search_description_address': 'वर्णन किंवा पत्त्याद्वारे शोधा',
      'not_available': 'उपलब्ध नाही',
      'no_interests_available': 'कोणतीही आवड उपलब्ध नाही',
      'interests_topics': 'आवड / विषय',
      'group_interests_title': 'गटाच्या आवडी',
      // Admin & Guruji Dashboard
      'admin_dashboard_title': 'प्रशासक डॅशबोर्ड',
      'access_denied_admin': 'प्रवेश नाकारला. फक्त प्रशासकांसाठी.',
      'menu_calendar': 'कॅलेंडर',
      'menu_branches': 'शाखा',
      'menu_gurujis': 'गुरुजी',
      'menu_news': 'बातम्या',
      'menu_attendance': 'उपस्थिती',
      'menu_services': 'सेवा',
      'menu_spiritual': 'आध्यात्मिक',
      'menu_requests': 'विनंत्या',
      'menu_seva_ops': 'सेवा ऑप्स',
      'menu_media': 'मीडिया',
      'menu_important_info': 'महत्वाची माहिती',
      'menu_public_groups': 'सार्वजनिक गट',
      'quick_actions': 'जलद क्रिया',
      'available_requests_title': 'उपलब्ध विनंत्या',
      'awaiting_admin_assignment': 'प्रशासक असाइनमेंटची प्रतीक्षा',
      'yajman_label': 'यजमान',
      'contact_label': 'संपर्क',
      'select_day_schedule': 'वेळापत्रक पाहण्यासाठी दिवस निवडा',
      'optional_suffix': ' (वैकल्पिक)',
      'not_possible_btn': 'शक्य नाही',
      'volunteered': 'स्वयंसेवा',
      'no_services_today': 'आज कोणतीही सेवा नियोजित नाही',
      'enjoy_day': 'तुमचा दिवस आनंदात जावो!',
      'no_new_requests': 'कोणत्याही नवीन विनंत्या नाहीत',
      'check_back_later_requests': 'नवीन विनंत्यांसाठी नंतर तपासा',
      'tab_today': 'आज',
      'tab_new_requests': 'नवीन विनंत्या',
      'tab_my_assigned': 'सोपविलेले',
      // Home Screen & Festival
      'today_celebrations_title': "आजचे उत्सव 🎉",
      'celebration_single_msg': "आज {name} चा विशेष दिवस आहे! आपले आशीर्वाद पाठवा.",
      'celebration_multiple_msg': "आज {count} उत्सव आहेत! आपले आशीर्वाद पाठवा.",
      'festival_default_desc': "आजचा विशेष सण!",
      'primary_festival_badge': "मुख्य सण",
      'swipe_to_dismiss': "काढून टाकण्यासाठी સ્વાइપ करा →",
      'dashboard_stat_total': 'एकूण',
      'dashboard_stat_upcoming': 'आगामी',
      'dashboard_stat_completed': 'पूर्ण',
      'no_seva_assignments': 'कोणतीही सेवा कार्ये नाहीत',
      'no_assigned_requests': 'कोणतीही विनंती सोपवलेली नाही',
      'attendance_marked': 'उपस्थिती चिन्हांकित',
      // Service Requests (Extended)

      'error_cannot_launch': 'लॉन्च करू शकलो नाही',
      'resend_otp': 'OTP पुन्हा पाठवा',
      'resend_code_in': 'कोड पुन्हा पाठवा',
      'otp_sent_success': 'OTP पाठवला',
      // Common Missing Keys
      'reset': 'रीसेट',
      'check_out_resource': 'हे संसाधन पहा',
      'error_url_empty': 'URL रिकामे आहे',
      'cannot_download_video': 'व्हिडिओ डाउनलोड करू शकत नाही',
      'no_description': 'कोणतेही वर्णन नाही',
      'search_by_description': 'वर्णनानुसार शोधा',
      'preferred': 'पसंतीचे',
      'tab_calendar': 'कॅलेंडर',
      'confirm_assignment': 'असाइनमेंटची पुष्टी करा',
      'unable_to_attend': 'उपस्थित राहण्यास असमर्थ',
      'open_directions': 'दिशानिर्देश उघडा',
      'approve_all': 'सर्व मंजूर करा',
      'request_revision': 'सुधारणेची विनंती करा',
      'save_notes': 'नोट्स जतन करा',
      'your_notes_to_admin': 'प्रशासकासाठी तुमच्या नोट्स',
      'add_notes_hint': 'नोट्स जोडा...',
      'samagri_actions': 'Samagri Actions',
      'samagri_approved_locked': 'सामग्री मंजूर आणि लॉक',
      'day_x_of_y': 'दिवस {day} / {total}',
      // Audit Fixes 2.5 - Remaining Missing Keys
      'root': 'रूट',
      'folders': 'फोल्डर',
      'no_files': 'कोणत्याही फाईल्स नाहीत',
      'download_complete': 'डाउनलोड पूर्ण',
      'share_file': 'फाईल शेअर करा',
      'open_file': 'फाईल उघडा',
      'yagya_karmkaand_rituals': 'यज्ञ आणि विधी',
      'selected': 'निवडलेले',
      'please_select_service_type': 'कृपया सेवा प्रकार निवडा',
      'view_my_requests': 'माझ्या विनंत्या पहा',
      'service_location': 'सेवा स्थान',
      'house': 'घर',
      'select_date_time_error': 'तारीख आणि वेळ निवडा',
      'request_updated': 'विनंती अद्यतनित केली',
      'request_submitted': 'विनंती सादर केली',
      'notes_hint': 'टीपा...',
      'cancel_request_title': 'विनंती रद्द करायची?',
      'cancel_request_content': 'तुम्ही नक्की आहात का?',
      'yes_cancel': 'होय, रद्द करा',
      'confirmed': 'निश्चित',
      'tbd': 'ठरायचे आहे',
      'guruji_label': 'गुरुजी',
      'temporarily_unavailable': 'तात्पुरते अनुपलब्ध',
      'cancellation_reason': 'रद्द करण्याचे कारण',
      'cancelled_by': 'तर्फे रद्द',
      'on_date': 'दिनांकावर',
      'request_not_found': 'विनंती सापडली नाही',
      'confirmed_date': 'निश्चित तारीख',
      'confirmed_time': 'निश्चित वेळ',
      'assigned_guruji': 'नियुक्त गुरुजी',
      'admin_notes_label': 'प्रशासक टीपा',
      'cancellation_details': 'रद्द तपशील',
      'samagri_approved_msg': 'सामग्री मंजूर',
      'request_on_hold': 'विनंती होल्डवर आहे',
      'reason_label': 'कारण',
      'revision_required': 'सुधारणा आवश्यक',
      'revision_required_content': 'कृपया विनंती सुधारा',
      'gurujis_note': 'गुरुजींची टीप',
      'guruji_asked_title': 'गुरुजींनी विचारले',
      'requirements_checklist': 'आवश्यकता',
      'no_requirements': 'कोणतीही आवश्यकता नाही',
      'add_item': 'वस्तू जोडा',
      'your_requested_items': 'तुमच्या वस्तू',
      'tutorial_daily_inspiration_title': 'दैनिक प्रेरणा',
      'tutorial_daily_inspiration_desc': 'आपल्या दिवसाची सुरुवात आध्यात्मिक विचारांनी करा',
      'tutorial_emergency_sos_title': 'आपत्कालीन मदत',
      'tutorial_emergency_sos_desc': 'जेव्हा गरज असेल तेव्हा SOS सुविधेने मदत मिळवा',
      'tutorial_mandir_schedule_title': 'मंदिर वेळापत्रक',
      'tutorial_mandir_schedule_desc': 'तुमच्या स्थानिक मंदिरात दैनिक आरती आणि हवन वेळ पहा',
      'tutorial_upcoming_events_title': 'आगामी कार्यक्रम',
      'tutorial_upcoming_events_desc': 'आगामी सत्संग, यज्ञ आणि सामुदायिक कार्यक्रमांबद्दल अपडेट राहा',
      'tutorial_latest_news_title': 'ताज्या बातम्या',
      'tutorial_latest_news_desc': 'गायत्री परिवारातील नवीनतम बातम्या आणि अपडेट्स वाचा',
      'volunteer_invitations': 'स्वयंसेवक आमंत्रणे',
      'group_invitations': 'गट आमंत्रणे',
      'no_volunteer_invitations': 'कोणतेही स्वयंसेवक आमंत्रण नाही',
      'volunteer_invitations_hint': 'स्वयंसेवक आमंत्रणे येथे दिसतील',
      'volunteer_invitation': 'स्वयंसेवक आमंत्रण',
      'volunteer_role': 'स्वयंसेवक भूमिका',
      'select_member': 'सदस्य निवडा',
      'choose_member': 'सदस्य निवडा',
      'no_eligible_members': 'पात्र सदस्य नाहीत',
      'invitation_sent': 'आमंत्रण पाठवले',
      'accepted': 'स्वीकारले',
      'declined': 'नाकारले',
      'assign': 'नेमणूक करा',
      'end_date_optional': 'अंतिम तारीख (वैकल्पिक)',
      'assigned_by': 'यांनी नियुक्त केले',
      'manage_volunteers': 'स्वयंसेवक व्यवस्थापन',
      'mandir_schedule': 'मंदिर वेळापत्रक',
      'temple_schedule': 'मंदिर वेळापत्रक',
      'aarti': 'आरती',
      'pooja': 'पूजा',
      'camp': 'शिबीर',
      'event': 'कार्यक्रम',
      'other_schedule': 'इतर',
      'add_schedule': 'वेळापत्रक जोडा',
      'edit_schedule': 'वेळापत्रक संपादित करा',
      'schedule_title': 'वेळापत्रक शीर्षक',
      'schedule_time': 'वेळापत्रक वेळ',
      'schedule_description': 'वेळापत्रक वर्णन',
      'permanent_schedule': 'कायमस्वरूपी वेळापत्रक',
      'is_active': 'सक्रिय आहे',
      'haptic_feedback': 'हॅप्टिक फीडबॅक',
      'vibration_on_tap': 'टॅपवर व्हायब्रेशन',
      'clear_progress': 'प्रगती पुसा',
      'scheduled_for': 'साठी नियोजित',
      'daily_nudge': 'दैनिक आठवण',
      'reminder_time_label': 'रिमाइंडर वेळ',
      'vibration_on': 'व्हायब्रेशन चालू',
      'vibration_off': 'व्हायब्रेशन बंद',
      'analytics': 'अॅनालिटिक्स',
      'add_mantra_title': 'मंत्र जोडा',
      'mantra_name_label': 'मंत्राचे नाव',
      'mantra_desc_label': 'वर्णन',
      'mantra_desc_hint': 'वर्णन जोडा',
      'enter_mantra_name_error': 'कृपया मंत्राचे नाव द्या',
      'add_btn': 'जोडा',
      'cancel_btn': 'रद्द करा',
      'anushthan': 'अनुष्ठान',
      'save_certificate': 'प्रमाणपत्र जतन करा',
      'no_homework_yet': 'अद्याप गृहपाठ नाही',
      'no_submitted_homework': 'तयार केलेला कोणताही गृहपाठ नाही',
      'no_attendance_data': 'उपस्थिती डेटा नाही',
      'sos_created': 'SOS तयार केले',
      'call_logged': 'कॉल नोंदवला',
      'call_required': 'कॉल आवश्यक',
      'tutorial_guruji_sos_title': 'गुरुजी SOS',
      'tutorial_guruji_sos_desc': 'आणीबाणीच्या विनंत्यांसाठी गुरुजींकडून मदत मिळवा',
      
      // Group Details (Added)
      'about_label': 'माहिती',
      'chat_label': 'चॅट',
      'camera_label': 'कॅमेरा',
      'video_label': 'व्हिडिओ',
      'document_label': 'दस्तऐवज',
      'homework_label': 'गृहपाठ',
      'search_messages': 'संदेश शोधा...',
      'filter_by_date': 'तारखेनुसार फिल्टर करा',
      'from_label': 'पासून',
      'to_label': 'पर्यंत',
      'not_set': 'सेट नाही',
      'clear': 'साफ करा',
      'message_deleted': 'तो संदेश हटवला गेला',
      'message_deleted_admin': 'हा संदेश ॲडमिनने हटवला आहे',
      'message_deleted_guruji': 'हा संदेश गुरुजींनी हटवला आहे',
      'practice_calendar': 'साधना कॅलेंडर',
      'allow_guruji_view': 'गुरुजींना पाहण्याची परवानगी द्या',
      'guruji_view_desc': 'तुमचे गुरुजी तुमची प्रगती पाहू शकतात',
      'cert_title': 'अनुष्ठान पूर्णता\nप्रमाणपत्र',
      'cert_subtitle': 'हे प्रमाणित केले जाते की',
      'cert_body': 'यांनी यशस्वीरित्या पूर्ण केले आहे',
      'cert_blessing': '“तुमची सच्ची साधना तुमच्या बुद्धीला प्रकाशित करो,\nतुमचे विचार शुद्ध करो आणि तुम्हाला धार्मिक जीवनाकडे घेऊन जावो.”',
      'issue_date': 'जारी केल्याची तारीख',
      'cert_id': 'प्रमाणपत्र आयडी',
      'digitally_issued_by': 'डिजिटल स्वरूपात जारी केले',
      'cert_disclaimer': 'हे डिजिटल पद्धतीने तयार केलेले प्रमाणपत्र आहे आणि\nत्यासाठी भौतिक स्वाक्षरीची आवश्यकता नाही.',
      'apply': 'लागू करा',
      'no_results_found': 'काहीही सापडले नाही',
      'leave_group_title': 'गट सोडायचा?',
      'request_leave_title': 'सोडण्याची विनंती?',
      'leave_group_confirm_msg': 'तुम्हाला खात्री आहे की तुम्ही "{name}" सोडू इच्छिता?',
      'request_leave_msg': 'तुमची विनंती गुरुजी/अॅडमिनकडे मंजुरीसाठी पाठवली जाईल.',
      'only_guruji_leave_error': 'तुम्ही एकमेव गुरुजी आहात. सोडण्यापूर्वी दुसरे गुरुजी जोडा.',
      'leave_request_sent': 'विनंती पाठवली. मंजुरीची प्रतीक्षा आहे.',
      'left_group_success': 'तुम्ही गट सोडला आहे',
      'pending_approval_title': 'अॅडमिन मंजुरीच्या प्रतीक्षेत',
      'pending_approval_msg': 'मंजुरीनंतर चॅट, कार्यक्रम आणि सदस्य व्यवस्थापन उपलब्ध होईल.',
      'pending_join_requests': 'लंबित विनंत्या ({count})',
      'audio_label': 'ऑडिओ',

      // Manage Resources (Marathi)
      'manage_resources': 'संसाधने व्यवस्थापित करा',
      'search_by_title': 'शीर्षकानुसार शोधा...',
      'all_types': 'सर्व प्रकार',
      'no_matching_resources': 'कोणतीही जुळणारी संसाधने नाहीत',
      'tap_to_add_resource': 'तुमचे पहिले संसाधन जोडण्यासाठी + टॅप करा',
      'resource_type_book': 'पुस्तके',
      'resource_type_audio': 'ऑडिओ',
      'resource_type_bhajan': 'भजन',
      'resource_type_video': 'व्हिडिओ',
      'resource_type_picture': 'चित्रे',
      'add_resource': 'संसाधन जोडा',
      'edit_resource': 'संसाधन संपादित करा',
      'title_hint': 'उदा., गायत्री चालीसा',
      'description_hint': 'थोडक्यात वर्णन...',
      'select_type': 'प्रकार निवडा',
      'category_label': 'श्रेणी',
      'no_category_label': 'कोणतीही श्रेणी नाही',
      'thumbnail_url': 'थंबनेल URL',
      'resource_visible': 'संसाधन वापरकर्त्यांना दृश्यमान आहे',
      'resource_draft': 'संसाधन ड्राफ्ट मोडमध्ये आहे',
      'draft': 'ड्राफ्ट',
      'confirm_delete_resource': 'संसाधन हटवायचे?',
      'delete_resource_msg': 'तुम्ही खात्री बाळगता का? हे पूर्ववत केले जाऊ शकत नाही.',
      'upload_failed_prefix': 'अपलोड अयशस्वी: ',
      'thumbnail_upload_failed_prefix': 'थंबनेल अपलोड अयशस्वी: ',
      
      // Resource Categories
      'category_gayatri': 'गायत्री',
      'category_health': 'आरोग्य',
      'category_life_lessons': 'जीवनाचे धडे',
      'category_devotional': 'भक्ती',
      'category_yoga': 'योग',
      
      // Spiritual Content Management (Marathi)
      'manage_spiritual_content': 'आध्यात्मिक सामग्री व्यवस्थापित करा',
      'daily_quotes': 'दैनिक सुविचार',
      'meditation_tips': 'ध्यान टिप्स',
      'items_count': '{count} आयटम',
      'manage_daily_quotes': 'दैनिक सुविचार व्यवस्थापित करा',
      'manage_meditation_tips': 'ध्यान टिप्स व्यवस्थापित करा',
      'add_quote': 'सुविचार जोडा',
      'edit_quote': 'सुविचार संपादित करा',
      'quote_text': 'सुविचार मजकूर',
      'enter_quote': 'सुविचार प्रविष्ट करा...',
      'author': 'लेखक',
      'author_hint': 'उदा., पं. श्रीराम शर्मा आचार्य',
      'image_url_darshan': 'प्रतिमा URL (दर्शनासाठी)',
      'tithi_occasion': 'तिथी / प्रसंग',
      'tithi_hint': 'उदा., एकादशी, विशेष दिवस',
      'schedule_date': 'निर्धारित तारीख',
      'quote_visible': 'सुविचार वापरकर्त्यांना दृश्यमान आहे',
      'quote_draft': 'सुविचार ड्राफ्ट मोडमध्ये आहे',
      'delete_quote': 'सुविचार हटवायचा?',
      'no_quotes_yet': 'अद्याप कोणतेही सुविचार नाहीत',
      'tap_add_first_quote': 'तुमचा पहिला सुविचार जोडण्यासाठी + टॅप करा',
      'add_tip': 'टिप जोडा',
      'edit_tip': 'टिप संपादित करा',
      'tip_title': 'टिप शीर्षक',
      'tip_title_hint': 'उदा., शांत जागा शोधा',
      'explain_tip': 'टिप समजावून सांगा...',
      'tip_visible': 'टिप वापरकर्त्यांना दृश्यमान आहे',
      'tip_draft': 'टिप ड्राफ्ट मोडमध्ये आहे',
      'delete_tip': 'टिप हटवायची?',
      'no_tips_yet': 'अद्याप कोणत्याही ध्यान टिप्स नाहीत',
      'tap_add_first_tip': 'तुमची पहिली टिप जोडण्यासाठी + टॅप करा',
      'save_order': 'क्रम जतन करा',
      'reorder': 'पुन्हा क्रमबद्ध करा',
      'url_label': 'लिंक (URL)',
      'url_hint': 'URL प्रविष्ट करा (https://...)',
      'access_denied': 'प्रवेश नाकारला',
      'only_admin_guruji': 'फक्त अॅडमिन किंवा गुरुजी हे पृष्ठ पाहू शकतात.',
      
      // Manage Calendar (Marathi)
      'manage_calendar_events': 'कॅलेंडर कार्यक्रम व्यवस्थापित करा',
      'load_holidays': 'सुट्ट्या लोड करा',
      'load_public_holidays': 'सार्वजनिक सुट्ट्या लोड करा',
      'select_year_load_holidays': 'भारतीय सार्वजनिक सुट्ट्या लोड करण्यासाठी वर्ष निवडा.',
      'year_label': 'वर्ष {year}',
      'add_new_event': 'नवीन कार्यक्रम जोडा',
      'add_event': 'कार्यक्रम जोडा',
      'event_title': 'कार्यक्रमाचे शीर्षक',
      'event_category': 'श्रेणी',
      'event_icon': 'आइकन (इमोजी)',
      'event_icon_hint': 'उदा. 🕉️',
      'festival_settings': 'सण सेटिंग्ज',
      'primary_festival_date': 'या तारखेसाठी प्राथमिक सण',
      'primary_festival_desc': 'संपूर्ण अॅपची थीम नियंत्रित करते',
      'theme_color_hex': 'थीम रंग (Hex)',
      'pick_color': 'रंग निवडा',
      'banner_image': 'बॅनर प्रतिमा',
      'upload_label': 'अपलोड',
      'pick_banner_image': 'बॅनर प्रतिमा निवडा',
      'banner_url': 'बॅनर URL',
      'suggested_mantra_id': 'सुचवलेला मंत्र आयडी (वैकल्पिक)',
      'suggested_mantra_hint': 'उदा. gayatri, devi',
      'festival_description_localized': 'सण वर्णन (स्थानिक)',
      'primary_festival_indicator': 'प्राथमिक',
      'holidays_loaded_success': '{year} साठी सुट्ट्या लोड केल्या!',
      'delete_event_title': 'कार्यक्रम हटवायचा?',
      'delete_event_confirm_with_title': 'तुम्हाला खात्री आहे की तुम्ही "{title}" हटवू इच्छिता?',
      'no_events_found': 'कोणतेही कार्यक्रम आढळले नाहीत. एक जोडा!',
      'pick_theme_color': 'थीम रंग निवडा',
      'select_btn': 'निवडा',
      'primary': 'प्राथमिक',
      'holidays_loaded': '{year} साठी सुट्ट्या लोड केल्या!',
      'error_occurred': 'त्रुटी: {error}',
      'event_category_festival': 'सण',
      'event_category_tithi': 'तिथी',
      'event_category_mandir_event': 'मंदिर कार्यक्रम',
      'event_updated_success': 'कार्यक्रम यशस्वीरित्या अपडेट झाला!',
      'banner_upload_success': 'बॅनर प्रतिमा यशस्वीरित्या अपलोड झाली!',
      'expired': 'कालबाह्य',
      'news_management': 'बातमी व्यवस्थापन',
      'create_news': 'बातमी तयार करा',
      'edit_news': 'बातमी संपादित करा',
      'no_news_created': 'अद्याप कोणतीही बातमी तयार केलेली नाही.',
      'delete_news_title': 'बातमी हटवा',
      'delete_news_confirm': 'तुम्हाला खात्री आहे की तुम्हाला ही बातमी हटवायची आहे?',
      'tap_to_pick_image': 'प्रतिमा निवडण्यासाठी टॅप करा',
      'image_url_optional': 'प्रतिमा URL (पर्यायी)',
      'image_url_hint': 'किंवा येथे प्रतिमा लिंक पेस्ट करा',
      'enter_news_title': 'बातमीचे शीर्षक प्रविष्ट करा',
      'short_description_hint': 'कार्डसाठी संक्षिप्त सारांश',
      'full_article_content': 'संपूर्ण लेख सामग्री',
      'mark_as_important': 'महत्वाचे म्हणून चिन्हांकित करा',
      'high_priority_notify': 'उच्च प्राथमिकता अधिसूचना पाठवते',
      'schedule_publishing': 'प्रकाशन शेड्यूल करा',
      'pick_date_time': 'दिनांक आणि वेळ निवडा',
      'change_date_time': 'दिनांक आणि वेळ बदला',
      'leave_empty_immediate': 'त्वरीत प्रकाशित करण्यासाठी रिकामे सोडा',
      'responsible_contact_person': 'जबाबदार संपर्क व्यक्ती',
      'role_title': 'भूमिका / शीर्षक',
      'role_title_hint': 'उदा. संपादक',
      'contact_phone_hint': '+91 XXXXX XXXXX',
      'save_draft': 'ड्राफ्ट जतन करा',
      'publish_news': 'बातमी प्रकाशित करा',
      'draft_saved': 'ड्राफ्ट जतन झाला',
      'news_published': 'बातमी प्रकाशित झाली',
      'select_image_or_url': 'कृपया प्रतिमा निवडा किंवा URL प्रविष्ट करा',
      'published': 'प्रकाशित',
      'scheduled': 'शेड्यूल्ड',
      'important': 'महत्वाचे',
      'short_description': 'संक्षिप्त वर्णन',
      'category': 'श्रेणी',
      'is_required': 'आवश्यक आहे',
      'attendance_analytics': 'उपस्थिती विश्लेषण',
      'attendance_trend': 'उपस्थिती कल',
      'member_performance': 'सदस्य कामगिरी',
      'highest_percent': 'सर्वात जास्त %',
      'lowest_percent': 'सर्वात कमी %',
      'alphabetical': 'वर्णक्रमानुसार',
      'mark_all_present': 'सर्वांना हजर चिन्हांकित करा',
      'mark_all_absent': 'सर्वांना गैरहजर चिन्हांकित करा',
      'sessions': 'सत्र',
      'no_attendance_for_date': 'या तारखेसाठी कोणतीही उपस्थिती सेट केलेली नाही',
      'add_attendance_date': 'उपस्थिती तारीख जोडा',
      'cannot_view_future_dates': 'भविष्यातील तारखा पाहता येत नाहीत',
      'no_data_for_chart': 'चार्टसाठी कोणताही डेटा नाही',
      'today': 'आज',
      'no_attendance_groups_found': 'उपस्थिती सक्षम असलेले कोणतेही गट आढळले नाहीत.',

      // Branch & Guruji Management
      'no_branches_found': 'कोणतीही शाखा आढळली नाही. एक जोडा!',
      'add_branch': 'शाखा जोडा',
      'edit_branch': 'शाखा संपादित करा',
      'branch_name': 'शाखेचे नाव',
      'branch_name_hint': 'शाखेचे नाव प्रविष्ट करा',
      'city_location_hint': 'शहर किंवा स्थान प्रविष्ट करा',
      'delete_branch_title': 'शाखा हटवायची?',
      'delete_branch_confirm': 'तुम्हाला खात्री आहे की तुम्ही ही शाखा हटवू इच्छिता? ही कृती पूर्ववत केली जाऊ शकत नाही.',
      'manage_gurujis': 'गुरुजी व्यवस्थापित करा',
      'no_gurujis_found': 'अद्याप कोणतेही गुरुजी नियुक्त केलेले नाहीत.',
      'assign_guruji_role': 'गुरुजी भूमिका सोपवा',
      'assign_role': 'भूमिका सोपवा',
      'promote_confirm_msg': 'तुम्हाला खात्री आहे की तुम्ही {name} यांना गुरुजी म्हणून बढती देऊ इच्छिता?',
      'promote_success_msg': '{name} आता गुरुजी आहेत',
      'promote_instruction': 'गुरुजी म्हणून बढती देण्यासाठी वापरकर्ता शोधा.',
      'search_user_hint': 'नाव किंवा ईमेलद्वारे वापरकर्ता शोधा',
      'remove_guruji_role_title': 'गुरुजी भूमिका काढायची?',
      'remove_role_confirm_msg': 'हा वापरकर्ता नियमित सदस्य होईल.',
      'location_label': 'स्थान',
      'load_label': 'लोड करा',
      'mark_attendance_title': 'उपस्थिती नोंदवा',
      'no_participants_joined': 'अद्याप कोणीही सहभागी झाले नाही.',
      'unmarked': 'अचिन्हांकित',
      'confirm_attendance_label': 'उपस्थितिची पुष्टी करा',
      'mark_all_to_continue': 'सुरू ठेवण्यासाठी सर्वांना चिन्हांकित करा',
      'backup_volunteer': 'बॅकअप स्वयंसेवक',
      'primary_volunteer': 'मुख्य स्वयंसेवक',
      'finalize_attendance': 'उपस्थिती अंतिम करा',
      'send_gratitude_finalize': 'आभार पाठवा आणि अंतिम करा',
      'no_volunteers_marked_present': 'कोणतेही स्वयंसेवक हजर म्हणून चिन्हांकित नाहीत',
      'appreciation_only_present': 'प्रशंसा केवळ हजर स्वयंसेवकांसाठी आहे',
      'select_volunteers_to_appreciate': 'प्रशंसेसाठी स्वयंसेवक निवडा',
      'deselect_all': 'सर्व निवड रद्द करा',
      'select_all': 'सर्व निवडा',
      'select_appreciation_badge': 'प्रशंसा बॅज निवडा',
      'pause': 'थांबवा',
      'mark_complete': 'पूर्ण चिन्हांकित करा',
      'filled': 'भरलेले',
      'required': 'आवश्यक',
      'volunteers_filled': 'स्वयंसेवक पूर्ण',
      'become_first_volunteer': 'पहिले स्वयंसेवक व्हा',

      // Group Member Management
      'manage_roles_title': '{name} साठी भूमिका व्यवस्थापित करा',
      'roles': 'भूमिका',
      'admin_role': 'प्रशासक',
      'only_system_admins_manage': 'केवळ सिस्टम प्रशासक ही भूमिका व्यवस्थापित करू शकतात',
      'admin_role_desc': 'सदस्य आणि सेटिंग्ज व्यवस्थापित करू शकतात',
      'error_updating_role': 'भूमिका अपडेट करण्यात त्रुटी',
      'guruji_role': 'गुरुजी',
      'guruji_role_desc': 'शिकवू शकतात आणि सामग्री व्यवस्थापित करू शकतात',
      'permitted_role': 'परवानगी प्राप्त वापरकर्ता',
      'permitted_role_desc': 'मेसेजिंग/पिनिंगसाठी विशेष परवानग्या',
      'member_role': 'सदस्य',
      'done': 'पूर्ण',
      'remove_from_group': 'गटातून काढा',
      'remove_member': 'सदस्य काढायचे?',
      'remove_member_confirm': 'तुम्हाला नक्की {name} ला या गटातून काढायचे आहे का?',
      'remove': 'काढा',
      'member_removed_success': 'सदस्य यशस्वीरित्या काढले',
      'volunteer_removed': 'स्वयंसेवक काढले',
      'remove_volunteer': 'स्वयंसेवक काढायचे?',
      'remove_volunteer_confirm': 'तुम्हाला नक्की {name} ला काढायचे आहे का?',
      
      // Assign Volunteer
      'assign_volunteers': 'स्वयंसेवक नियुक्त करा',
      'select_member': 'सदस्य निवडा',
      'choose_member': 'एक सदस्य निवडा',
      'role': 'स्वयंसेवक भूमिका',
      'volunteer_role_hint': 'उदा. सतरंजी अंथरणारा, खुर्ची लावणारा',
      'volunteer_desc_hint': 'स्वयंसेवकाच्या जबाबदाऱ्यांचे वर्णन करा...',
      'description_optional': 'वर्णन (पर्यायी)',
      'description': 'वर्णन',
      'end_date': 'समाप्ती तारीख',
      'end_date_optional': 'समाप्ती तारीख (पर्यायी)',
      'sending': 'पाठवत आहे',
      'assign': 'नियुक्त करा',
      'invitation_sent': 'स्वयंसेवक आमंत्रण पाठवले',
      'select_member_error': 'कृपया सदस्य निवडा',
      'no_eligible_members': 'या गटात पात्र सदस्य नाहीत',

      // Group Details & Permissions
      'everyone': 'सर्वजण',
      'admins_only': 'फक्त प्रशासक',
      'admins_and_gurujis': 'प्रशासक आणि गुरुजी',
      'admins_gurujis_permitted': 'प्रशासक, गुरुजी आणि परवानगी प्राप्त',
      'who_can_send_messages': 'संदेश कोण पाठवू शकते?',
      'message_permission_updated': 'संदेश परवानगी अपडेट केली',
      'who_can_pin_messages': 'संदेश कोण पिन करू शकते?',
      'pin_permission_updated': 'पिन परवानगी अपडेट केली',
      'message_send_permission': 'संदेश पाठवण्याची परवानगी',
      'pin_message_permission': 'संदेश पिन करण्याची परवानगी',
      'group_settings': 'गट परवानग्या',
      'default_samagri_from_type': '{type} कडून डीफॉल्ट सामग्री',

      // Invite User & Volunteer Dialogs
      'invitation_already_sent': 'या वापरकर्त्याला आधीच आमंत्रण पाठवले आहे',
      'cannot_invite_self': 'तुम्ही स्वतःला गटात आमंत्रित करू शकत नाही',
      'user_already_member': 'वापरकर्ता आधीपासूनच या गटाचा सदस्य आहे',
      'error_sending_invitation': 'आमंत्रण पाठवण्यात त्रुटी',
      'invitation_sent_to': '{name} ला आमंत्रण पाठवले',
      'volunteer_invitation_sent_to': '{name} ला स्वयंसेवक आमंत्रण पाठवले',
      'error_loading_members': 'सदस्य लोड करण्यात त्रुटी: {error}',
      'enter_role': 'कृपया भूमिका प्रविष्ट करा',
      'email': 'ईमेल',
      'error': 'त्रुटी',
      'member': 'सदस्य',
      'enter_email': 'कृपया ईमेल किंवा वापरकर्तानाव प्रविष्ट करा',
      'error_searching_user': 'वापरकर्ता शोधण्यात त्रुटी',
      'user_not_found': 'वापरकर्ता सापडला नाही',
      
      // Param Drishti Content
      'vision_title': 'मनुष्यामध्ये देवत्वाचा उदय आणि पृथ्वीवर स्वर्गाचे अवतरण',
      'vision_description': '''
अखिल विश्व गायत्री परिवाराची दृष्टि अशी आहे की मानव जीवन केवळ भौतिक यशापर्यंत मर्यादित न राहता त्यामध्ये दडलेली दिव्य चेतना जागृत व्हावी.

आम्ही असा समाज घडवू इच्छितो जिथे:
• प्रत्येक व्यक्ती चारित्र्यवान आणि नैतिक असेल
• प्रत्येक कुटुंब संस्कारांचे केंद्र बनेल
• समाज सहकार्य आणि करुणेवर आधारित असेल
• राष्ट्र आदर्श आणि शिस्तीचे प्रतीक बनेल
• संपूर्ण विश्व “वसुधैव कुटुंबकम्” या भावनेने चालेल

आमचे ध्येय केवळ सुधारणा नाही, तर चेतनेचा परिवर्तन आहे —
व्यक्तीपासून कुटुंब, कुटुंबापासून समाज, समाजापासून राष्ट्र आणि राष्ट्रापासून संपूर्ण विश्वापर्यंत.
''',
      'mission_title': 'व्यक्ती निर्माण – कुटुंब निर्माण – समाज निर्माण – राष्ट्र निर्माण',
      'mission_description': '''
गायत्री परिवाराचे मिशन खालीलप्रमाणे आहे:

🔹 1. आध्यात्मिक जागरण
• गायत्री मंत्र जप
• ध्यान आणि मनन
• यज्ञ साधना
यांच्या माध्यमातून आत्मबल वाढविणे.

🔹 2. संस्कारांची पुनर्स्थापना
• मुलांमध्ये नैतिक मूल्यांची रुजवण
• युवकांमध्ये संस्कार जागरण
• कुटुंबामध्ये सांस्कृतिक परंपरांचा विकास

🔹 3. व्यसनमुक्त आणि कुरीतीमुक्त समाज
• व्यसनांचे निर्मूलन
• अंधश्रद्धा आणि सामाजिक वाईट प्रथांचा विरोध

🔹 4. सेवा आणि सहकार्याची भावना
समाजातील दुर्बल घटकांसाठी सेवा कार्यांचा विस्तार.

🔹 5. अध्यात्म आणि विज्ञान यांचा समन्वय
धर्माला केवळ आडंबर न ठेवता जीवनशास्त्र म्हणून स्थापित करणे.
''',
      'yagya_title': 'यज्ञाचे फायदे (Benefits of Yagya)',
      'yagya_description': '''
🟢 आध्यात्मिक फायदे
• मनाची शुद्धी
• सकारात्मक ऊर्जा वाढ
• मानसिक ताण कमी होणे
• आत्मिक शांतता

🟢 शारीरिक फायदे
• वातावरण शुद्धीकरण
• रोगप्रतिकारक शक्ती वाढ
• सूक्ष्म जंतूंचा नाश

🟢 सामाजिक फायदे
• कुटुंबात एकता
• सामूहिक भावना वाढ
• संस्कारांचा विकास

🟢 पर्यावरणीय फायदे
• वायुप्रदूषण कमी होणे
• पर्यावरण संतुलन
• नैसर्गिक ऊर्जा संवर्धन
''',
      'param_drishti_title': 'परम दृष्टी',
      'param_drishti_subtitle': 'आमची दृष्टी, मिशन आणि आध्यात्मिक चळवळ',
      'param_drishti_card_desc': 'आद्यात्मिक क्रांती - दृष्टी, मिशन आणि चळवळ',
      'menu_vision': 'दृष्टी (Vision)',
      'vision_short_desc': 'मनुष्यामध्ये देवत्वाचा उदय',
      'menu_mission': 'मिशन (Mission)',
      'mission_short_desc': 'व्यक्ती निर्माण ते राष्ट्र निर्माण',
      'menu_sapt_aandolan': 'सप्त आंदोलन',
      'sapt_aandolan_short_desc': '7 आध्यात्मिक चळવळी',
      'menu_yagya_benefits': 'यज्ञाचे फायदे',
      'yagya_short_desc': 'वैज्ञानिक आणि आध्यात्मिक फायदे',
      'sapt_aandolan_title': 'सप्त आंदोलन (Seven Movements)',
      
      'aandolan_sadhana_title': 'साधना आंदोलन',
      'aandolan_sadhana_purpose': 'आंतरिक शुद्धीकरण आणि आत्मबल वाढविणे।',
      'aandolan_sadhana_description': '''
वर्णन:
• गायत्री मंत्र जप
• ध्यान आणि प्राणायाम
• तप आणि स्वाध्याय
• चारित्र्य निर्माण

हे आंदोलन व्यक्तीला मानसिक, नैतिक आणि आध्यात्मिक दृष्ट्या सक्षम बनवते.
''',

      'aandolan_shiksha_title': 'शिक्षण आंदोलन',
      'aandolan_shiksha_purpose': 'नैतिक, सांस्कृतिक आणि जीवनोपयोगी शिक्षणाचा प्रसार।',
      'aandolan_shiksha_description': '''
वर्णन:
• मूल्याधारित शिक्षण
• संस्कार वर्ग
• युवक जागरण कार्यक्रम
• व्यक्तिमत्व विकास शिबिरे

शिक्षण हे केवळ पदवी नसून जीवन घडविण्याचे साधन आहे.
''',

      'aandolan_swasthya_title': 'आरोग्य आंदोलन',
      'aandolan_swasthya_purpose': 'शारीरिक, मानसिक आणि आध्यात्मिक आरोग्य।',
      'aandolan_swasthya_description': '''
वर्णन:
• योग आणि प्राणायाम
• नैसर्गिक चिकित्सा
• व्यसनमुक्ती अभियान
• सात्विक जीवनशैली

हे आंदोलन संतुलित आणि ऊर्जावान जीवन घडवते.
''',

      'aandolan_swavalamban_title': 'स्वावलंबन आंदोलन',
      'aandolan_swavalamban_purpose': 'आर्थिक आत्मनिर्भरता आणि श्रम संस्कृती।',
      'aandolan_swavalamban_description': '''
वर्णन:
• लघुउद्योग प्रोत्साहन
• कौशल्य विकास
• श्रम व स्वाभिमान जागरण
• आत्मनिर्भर कुटुंब निर्माण

स्वावलंबनामुळे आत्मविश्वास आणि सामाजिक सन्मान वाढतो.
''',

      'aandolan_paryavaran_title': 'पर्यावरण आंदोलन',
      'aandolan_paryavaran_purpose': 'निसर्ग संरक्षण आणि स्वच्छ पर्यावरण।',
      'aandolan_paryavaran_description': '''
वर्णन:
• वृक्षारोपण अभियान
• यज्ञाद्वारे वातावरण शुद्धीकरण
• जलसंवर्धन
• प्लास्टिकमुक्त अभियान

हे आंदोलन मानव आणि निसर्ग यांच्यात संतुलन निर्माण करते.
''',

      'aandolan_mahila_jagran_title': 'महिला जागरण आंदोलन',
      'aandolan_mahila_jagran_purpose': 'स्त्रीशक्तीचा सन्मान and सशक्तीकरण।',
      'aandolan_mahila_jagran_description': '''
वर्णन:
• महिला शिक्षण
• संस्कार विकास
• कुटुंब सशक्तीकरण
• नेतृत्व विकास

जागृत स्त्री म्हणजे जागृत समाज.
''',

      'aandolan_vyasan_mukti_title': 'व्यसनमुक्ती आणि कुरीती निर्मूलन आंदोलन',
      'aandolan_vyasan_mukti_purpose': 'समाजातील वाईट प्रथांचे उच्चाटन।',
      'aandolan_vyasan_mukti_description': '''
वर्णन:
• व्यसनमुक्ती अभियान
• हुंडाबंदी, अंधश्रद्धा, स्त्रीभ्रूणहत्या यांचा विरोध
• सामाजिक जागृती कार्यक्रम
• जनजागृती रॅली आणि सभा

हे आंदोलन समाजाला शुद्ध आणि सजग बनवते.
''',
    },

    'gu': {
      'feed': 'ફીડ',
      'posts': 'પોસ્ટ્સ',
      'feed_description': 'આ તમારું ફીડ છે. નવીનતમ પોસ્ટ્સ અને સમુદાયના સમાચાર સાથે અપડેટ રહો.',
      'view_comments': 'ટિપ્પણીઓ જુઓ',
      'delete_post': 'પોસ્ટ કાઢી નાખો',
      'delete_post_confirm': 'શું તમે ખરેખર આ પોસ્ટ કાઢી નાખવા માંગો છો?',
      'pin_post': 'પિન કરો',
      'unpin_post': 'અનપિન કરો',
      'max_pin_warning': '⚠️ મહત્તમ 3 પોસ્ટ પિન કરી શકાય છે.',
      'downloading_photo': 'ફોટો ડાઉનલોડ થઈ રહ્યો છે...',
      'photo_saved': '✅ ફોટો ગેલેરીમાં સાચવાયો!',
      'download_failed': '❌ ડાઉનલોડ નિષ્ફળ: {error}',
      'post_deleted': '✅ પોસ્ટ સફળતાપૂર્વક કાઢી નખાઈ',
      'delete_post_failed': '❌ પોસ્ટ કાઢી નાખવામાં નિષ્ફળ',
      'comments': 'ટિપ્પણીઓ',
      'no_comments_yet': 'હજી કોઈ ટિપ્પણી નથી',
      'be_first_comment': 'પ્રથમ ટિપ્પણી કરો!',
      'add_comment': 'ટિપ્પણી લખો...',
      'create_post': 'પોસ્ટ બનાવો',
      'post_btn': 'પોસ્ટ કરો',
      'photos': 'ફોટા',
      'caption': 'કૅપ્શન',
      'write_caption': 'કૅપ્શન લખો...',
      'tags': 'ટૅગ્સ',
      'add_tag': 'ટૅગ ઉમેરો (દા.ત. event, news)',
      'post_date_time': 'પોસ્ટ તારીખ અને સમય (વૈકલ્પિક)',
      'current_time_default': 'જો સેટ ન હોય તો વર્તમાન સમયનો ઉપયોગ થશે',
      'uploading_progress': 'અપલોડ થઈ રહ્યું છે... {percent}%',
      'please_wait': 'કૃપા કરીને રાહ જુઓ...',
      'preparing_upload': 'અપલોડ કરવાની તૈયારી કરી રહ્યાં છે',
      'today_random_role': 'આજની યાદૃચ્છિક ભૂમિકા',
      'pick_random_student': 'વિદ્યાર્થી પસંદ કરો',
      'attendance_missing_msg': 'પસંદગી કરતા પહેલા આજની હાજરી (IST) નોંધવી આવશ્યક છે.',
      'zero_students_present': 'આજે કોઈ વિદ્યાર્થી હાજર નથી.',
      'present_students_count': 'આજે {count} વિદ્યાર્થીઓ હાજર છે. એકને યાદૃચ્છિક રીતે પસંદ કરો.',
      'selected_role': 'ભૂમિકા: {role}',
      'fairness_fallback_tooltip': 'પૂર્ણ પૂલમાંથી પસંદ કરેલ (ફેરનેસ ફોલબેક)',
      'processing': 'પ્રક્રિયા ચાલુ છે...',

      'gayatri_mandir_title': 'ગાયત્રી મંદિર',
      // Seva Management
      'manage_seva_opportunities': 'સેવા તકોનું સંચાલન કરો',
      // General Actions
      'edit': 'સંપાદિત કરો',
      'rename': 'નામ બદલો',
      'download': 'ડાઉનલોડ કરો',
      'share': 'શેર કરો',
      'view': 'જુઓ',
      'file': 'ફાઇલ',
      'files': '{count} ફાઇલો',
      'delete_file_title': 'ફાઇલ કાઢી નાખવી?',
      'delete_file_confirm': 'શું તમે ખરેખર "{name}" કાઢી નાખવા માંગો છો?',
      'rename_file': 'ફાઇલનું નામ બદલો',
      'new_name': 'નવું નામ',
      'file_renamed': 'ફાઇલનું નામ બદલ્યું',
      'file_uploaded': 'ફાઇલ સફળતાપૂર્વક અપલોડ થઈ',
      'cannot_open_file_type': 'આ ફાઇલ પ્રકાર ખોલી શકાતો નથી',
      'downloading': 'ડાઉનલોડ થઈ રહ્યું છે...',
      'download_failed': 'ડાઉનલોડ નિષ્ફળ: {error}',
      'rename_failed': 'નામ બદલવું નિષ્ફળ: {error}',
      'preparing_share': 'શેર કરવા માટે ફાઇલ તૈયાર કરી રહ્યું છે...',
      'shared_from_app': 'ગાયત્રી પરિવાર કનેક્ટ દ્વારા શેર કરેલ',

      // Notification Descriptions
      'news_notifications_desc': 'નવીનતમ સમાચાર વિશે સૂચિત રહો',
      'event_notifications_desc': 'આગામી કાર્યક્રમો માટે રીમાઇન્ડર્સ',
      'group_notifications_desc': 'જૂથ આમંત્રણો માટે સૂચનાઓ',
      'announcement_notifications_desc': 'મહત્વપૂર્ણ જાહેરાતો',
      'satsang_notifications_desc': 'સવારના આધ્યાત્મિક સંદેશાઓ',

      // Public Group Creation
      'reason_for_creating_group': 'આ જૂથ બનાવવાનું કારણ',
      'reason_for_creating_group_hint': 'આ જૂથનો હેતુ અથવા ઉદ્દેશ સમજાવો...',
      'reason_for_creating_group_helper': 'આ એડમિનને સમજવામાં મદદ કરે છે કે આ જૂથને કેમ મંજૂર કરવું જોઈએ',
      'reason_min_length_error': 'કૃપા કરી કારણ આપો (ઓછામાં ઓછા 10 અક્ષરો)',
      'n_files': '{count} ફાઇલો',
      'no_branches_available': 'કોઈ શાખાઓ ઉપલબ્ધ નથી. કૃપા કરીને પ્રથમ શાખા ઉમેરો.',
      'no_gurujis_available': 'કોઈ ગુરુજી ઉપલબ્ધ નથી. કૃપા કરીને પ્રથમ ગુરુજી ઉમેરો.',
      'no_media_folders': 'હજુ સુધી કોઈ મીડિયા ફોલ્ડર્સ નથી',
      'no_media_available_desc': 'આ ક્ષણે કોઈ મીડિયા ઉપલબ્ધ નથી',

      // Service Types
      'no_service_types': 'હજુ સુધી કોઈ સેવા પ્રકાર નથી',
      'add_service_types_prompt': 'વપરાશકર્તાઓ વિનંતી કરી શકે તે માટે સેવા પ્રકારો ઉમેરો',
      'add_service_type': 'સેવા પ્રકાર ઉમેરો',
      'edit_service_type': 'સેવા પ્રકાર સંપાદિત કરો',
      'service_type_added': 'સેવા પ્રકાર ઉમેરાયો',
      'service_type_updated': 'સેવા પ્રકાર અપડેટ થયો',
      'requirements_samagri': 'જરૂરિયાતો (સામગ્રી)',
      'no_requirements_added': 'હજુ સુધી કોઈ જરૂરિયાતો ઉમેરવામાં આવી નથી.',
      'add_requirement': 'જરૂરિયાત ઉમેરો',
      'item_name': 'વસ્તુનું નામ',
      'item_name_hint': 'દા.ત. ચોખા, ઘી',
      'quantity': 'જથ્થો',
      'quantity_hint': 'દા.ત. ૧',
      'unit': 'એકમ',
      'unit_hint': 'દા.ત. કિલો, નંગ, લિટર',
      'optional_good_to_have': 'વૈકલ્પિક / હોવું સારું',
      'users_can_see_service': 'વપરાશકર્તાઓ આ સેવા જોઈ શકે છે',
      'hidden_from_users': 'વપરાશકર્તાઓથી છુપાયેલ',
      'optional': 'વૈકલ્પિક',
      'restore_availability': 'ઉપલબ્ધતા પુનઃસ્થાપિત કરો',
      'available': 'ઉપલબ્ધ',
      'unavailable': 'અનુપલબ્ધ',

      // Storage Manager
      'storage_manager': 'સ્ટોરેજ મેનેજર',
      'folder': 'ફોલ્ડર',
      'no_folders_yet': 'હજુ સુધી કોઈ ફોલ્ડર્સ નથી',
      'this_folder_is_empty': 'આ ફોલ્ડર ખાલી છે',
      'create_folder': 'ફોલ્ડર બનાવો',
      'folder_name': 'ફોલ્ડરનું નામ',
      'description_optional': 'વર્ણન (વૈકલ્પિક)',
      'edit_folder': 'ફોલ્ડર સંપાદિત કરો',
      'folder_description': 'ફોલ્ડર વર્ણન',
      'add_description': 'વર્ણન ઉમેરો',
      'delete_folder_title': 'ફોલ્ડર કાઢી નાખવું?',
      'delete_folder_confirm': 'શું તમે ખરેખર આ ફોલ્ડર અને તેની તમામ સામગ્રી કાઢી નાખવા માંગો છો? આ ક્રિયા ઉલટાવી શકાતી નથી.',
      'create': 'બનાવો',
      'save': 'સાચવો',
      'upload_success': 'ફાઇલ સફળતાપૂર્વક અપલોડ થઈ',

      // Seva Management
      'error_loading_sevas': 'સેવાઓ લોડ કરવામાં ભૂલ',
      'start': 'શરૂ',
      'postpone': 'મુલતવી રાખો',
      'google_maps_link_optional': 'ગૂગલ મેપ્સ લિંક (વૈકલ્પિક)',
      'filled_status': 'ભરાયેલ',
      'rescheduled': 'ફરીથી નિર્ધારિત',
      'postponed': 'મુલતવી',
      'resume_seva': 'સેવા ફરી શરૂ કરો',
      'withdraw_from_seva': 'સેવામાંથી નામ પાછું ખેંચો',
      'participate_in_seva': 'સેવામાં ભાગ લો',
      'volunteers': 'સ્વયંસેવકો',
      'backup_volunteers': 'બેકઅપ સ્વયંસેવકો',
      'no_volunteers_yet': 'હજુ સુધી કોઈ સ્વયંસેવકો નથી',
      'error_loading_participants': 'સહભાગીઓને લોડ કરવામાં ભૂલ',
      'view_own_appreciation_only': 'તમે ફક્ત તમારી પોતાની પ્રશંસા જોઈ શકો છો',
      'error_withdrawing': 'નામ પાછું ખેંચવામાં ભૂલ: {error}',
      'error_loading_appreciation': 'પ્રશંસા લોડ કરવામાં ભૂલ',
      'event_not_started': 'કાર્યક્રમ હજુ શરૂ થયો નથી. કૃપા કરીને {time} સુધી રાહ જુઓ',
      'status_updated': 'સ્થિતિ {status} પર અપડેટ કરવામાં આવી',
      'reason_for_status': '{status} નું કારણ',
      'enter_reason_optional': 'કારણ દાખલ કરો (વૈકલ્પિક)',
      'cant_mark_attendance_early': 'કાર્યક્રમ શરૂ થાય તે પહેલા હાજરી નોંધી શકાતી નથી',
      'available_after': '{time} પછી ઉપલબ્ધ',
      'admin_actions_error_early_start': '{time} પહેલા કાર્યક્રમ શરૂ કરી શકાતો નથી',
      'admin_actions_error_not_started': 'સંપન્ન તરીકે ચિહ્નિત કરતા પહેલા કાર્યક્રમ શરૂ થવો જોઈએ',
      'admin_actions_error_early_end': 'નિર્ધારિત સમય ({time}) પહેલા કાર્યક્રમને સંપન્ન તરીકે ચિહ્નિત કરી શકાતો નથી',
      
      // Seva Lifecycle Extended
      'seva_postponed_to': 'સેવા {date} સુધી મુલતવી',
      'new_date_label': 'નવી તારીખ',
      'reason': 'કારણ',
      'select_new_date': 'નવી તારીખ પસંદ કરો',
      'reason_required': ' કારણ (જરૂરી)',
      'confirm_postpone': 'પુષ્ટિ કરો',
      'confirm_postpone_msg': 'શું તમે ખરેખર આ સેવા મુલતવી રાખવા માંગો છો?',
      'cannot_select_past_date': 'ભૂતકાળની તારીખ પસંદ કરી શકાતી નથી',
      'upload_photos': 'ફોટા અપલોડ કરો',
      'link_folder': 'ફોલ્ડર લિંક કરો',
      'optional_folder_selection_hint': 'આ ફોટાઓ ગોઠવવા માટે વૈકલ્પિક રીતે ફોલ્ડર પસંદ કરો',
      'search_folder_hint': 'ફોલ્ડર નામ દ્વારા શોધો...',
      'create_new_folder': 'નવું ફોલ્ડર બનાવો',
      'select_existing_folder': 'હાલનું ફોલ્ડર પસંદ કરો',
      'photos_required': 'ફોટો જરૂરી છે',
      'activity_log': 'પ્રવૃત્તિ લોગ',
      'log_created': 'સેવા બનાવી',
      'log_postponed': 'મુલતવી રાખ્યું',
      'log_resumed': 'ફરી શરૂ',
      'log_completed': 'પૂર્ણ',
      'log_photos_uploaded': 'ફોટા અપલોડ કર્યા',
      'log_cancelled': 'રદ કર્યું',
      'log_status_changed': 'સ્થિતિ બદલાઈ',
      'by_user': '{name} દ્વારા',
      'seva_auto_resumed_msg': 'સેવા {date} ના રોજ આપમેળે ફરી શરૂ થશે',
      'pull_to_refresh': 'રીફ્રેશ કરવા માટે ખેંચો',
      'backup': 'બેકઅપ',
      'withdrawn_success': 'સફળતાપૂર્વક પાછું ખેંચ્યું',
      'joined_success': 'સફળતાપૂર્વક જોડાયા',
      'delete_location': 'સ્થાન કાઢી નાખો',

      // Public Groups
      'public_groups': 'જાહેર જૂથો',
      'no_pending_requests': 'કોઈ બાકી વિનંતીઓ નથી',
      'all_public_group_requests_reviewed': 'બધી જાહેર જૂથ વિનંતીઓની સમીક્ષા કરવામાં આવી છે',
      'created_by': 'દ્વારા બનાવેલ',
      'unknown_user': 'અજાણ્યો વપરાશકર્તા',
      'reason_for_creating': 'બનાવવાનું કારણ',
      'reject': 'નકારો',
      'approve': 'મંજૂર કરો',
      'reject_public_group_title': 'જાહેર જૂથ નકારવું છે?',
      'reject_public_group_content': '"{name}" ને નકારવાથી તે નકારાયેલ તરીકે ચિહ્નિત થશે અને બનાવનારને કારણ દેખાશે.',
      'rejection_reason': 'નકારવાનું કારણ',
      'rejection_reason_hint': 'દા.ત. માર્ગદર્શિકાને પૂર્ણ કરતું નથી',
      'enter_rejection_reason': 'કૃપા કરીને નકારવાનું કારણ દાખલ કરો',
      'approved_as_public_group': '"{name}" ને જાહેર જૂથ તરીકે મંજૂર કરવામાં આવ્યું',
      'has_been_rejected': '"{name}" નકારવામાં આવ્યું છે',
      'error_approving': '"{name}" મંજૂર કરવામાં ભૂલ: {error}',
      'error_rejecting': '"{name}" નકારવામાં ભૂલ: {error}',
      'pending_approval': 'મંજૂરી બાકી',
      'create_seva': 'નવી સેવા બનાવો',
      'new_seva': 'નવી સેવા',
      'edit_seva': 'સેવા સંપાદિત કરો',
      'search_seva_placeholder': 'સેવા ના નામ દ્વારા શોધો...',
      'no_seva_opportunities': 'હજી કોઈ સેવા તકો ઉપલબ્ધ નથી',
      'seva_created_success': 'સેવા સફળતાપૂર્વક બનાવવામાં આવી',
      'seva_updated_success': 'સેવા સફળતાપૂર્વક અપડેટ કરવામાં આવી',
      'assign_selected': 'પસંદ કરેલાને સોંપો',
      'internal_notes_optional': 'આંતરિક નોંધો (વૈકલ્પિક)',
      'internal_notes_hint': 'આ સોંપણીઓ માટે નોંધો...',
      'delete_seva': 'સેવા કાઢી નાખો',
      'delete_seva_confirm': 'શું તમે ખરેખર "{title}" ને કાઢી નાખવા માંગો છો?',
      'cannot_undo': 'આ ક્રિયા પૂર્વવત્ કરી શકાતી નથી.',
      'no_gurujis_match': 'કોઈ મેળ ખાતા ગુરુજી મળ્યા નથી',
      'male_needed': 'પુરુષો જરૂરી',
      'female_needed': 'સ્ત્રીઓ જરૂરી',
      'select_date_time': 'તારીખ અને સમય પસંદ કરો',
      'enter_manually': 'મેન્યુઅલી દાખલ કરો',
      'find_responsible_person': 'જવાબદાર વ્યક્તિ શોધો',
      'contact_name': 'સંપર્ક નામ',
      'contact_role': 'ભૂમિકા / પદ',
      'contact_phone': 'સંપર્ક ફોન',
      'cannot_edit_completed_seva': 'પૂર્ણ થયેલ સેવા સંપાદિત કરી શકાતી નથી',
      'could_not_open_map': 'નકશો ખોલી શક્યો નહીં',
      'joined': 'જોડાયેલ',
      'event_will_start': 'કાર્યક્રમ ટૂંક સમયમાં શરૂ થશે',
      'event_is_live': 'કાર્યક્રમ ચાલુ છે',
      'event_paused': 'કાર્યક્રમ થોભાવવામાં આવ્યો છે',
      'event_postponed': 'કાર્યક્રમ મુલતવી રાખવામાં આવ્યો છે. અપડેટની રાહ જુઓ',
      'event_rescheduled': 'કાર્યક્રમ ફરીથી સુનિશ્ચિત થયો છે',
      'event_completed': 'કાર્યક્રમ પૂર્ણ',
      'event_cancelled': 'કાર્યક્રમ રદ',
      'manage_seva_op': 'સેવા સંચાલન',
      'gurujis_assigned': 'ગુરુજી સોંપાયેલ',
      'no_gurujis_selected': 'કોઈ ગુરુજી પસંદ નથી',
      'assign_guruji': 'ગુરુજી સોંપો',
      'reassign': 'ફરીથી સોંપો',
      'remove_assignment': 'સોંપણી દૂર કરો',
      'show_active': 'સક્રિય બતાવો',
      'show_history': 'ઇતિહાસ બતાવો',
      'male': 'પુરુષ',
      'female': 'સ્ત્રી',
      'upcoming': 'આગામી',
      'live': 'લાઇવ',
      'full': 'પૂર્ણ',
      'past': 'ભૂતકાળ',
      'paused': 'થોભાવેલું',
      'assigned': 'સોંપેલ',
      'dedicated_seva': 'સમર્પિત સેવા',
      'time_seva': 'સમય સેવા',
      'team_seva': 'ટીમ સેવા',
      'impactful_seva': 'પ્રભાવશાળી સેવા',
      'finalize_attendance': 'હાજરી ફાઇનલ કરો',
      'present_with_count': 'હાજર ({count})',
      'absent_with_count': 'ગેરહાજર ({count})',
      'send_gratitude_finalize': 'આભાર મોકલો અને ફાઇનલ કરો',
      'no_volunteers_marked_present': 'કોઈ સ્વયંસેવક હાજર ચિહ્નિત નથી',
      'appreciation_only_present': 'આભાર પત્ર ફક્ત હાજર સ્વયંસેવકો માટે છે',
      'select_volunteers_to_appreciate': 'આભાર માટે સ્વયંસેવકો પસંદ કરો',
      'deselect_all': 'બધા અસિલેક્ટ કરો',
      'select_all': 'બધા પસંદ કરો',
      'select_appreciation_badge': 'પ્રશંસા બેજ પસંદ કરો',
      'personal_note_optional': 'વ્યક્તિગત નોંધ (વૈકલ્પિક)',
      'add_personal_note_hint': 'વ્યક્તિગત નોંધ ઉમેરો...',
      'recorded_as_absent': 'ગેરહાજર તરીકે નોંધાયેલ',
      'partial_appreciation_title': 'આંશિક પ્રશંસા?',
      'partial_appreciation_msg': 'તમે {total} હાજર સ્વયંસેવકોમાંથી માત્ર {count} ની પ્રશંસા કરી રહ્યા છો. ચાલુ રાખવું?',
      'please_select_badge_error': 'કૃપા કરીને પ્રશંસા બેજ પસંદ કરો',
      'please_write_longer_msg_error': 'કૃપા કરીને થોડો લાંબો સંદેશ લખો',
      'attendance_finalized_gratitude_sent': 'હાજરી ફાઇનલ થઈ અને આભાર મોકલવામાં આવ્યો!',
      'attendance_finalized_msg': 'હાજરી ફાઇનલ થઈ!',
      'dedicated_seva_msg': 'આ સેવામાં તમારા સમર્પણ અને પ્રામાણિકતાની ઊંડી પ્રશંસા કરવામાં આવે છે. પ્રતિબદ્ધતા સાથે સેવા આપવા બદલ આભાર.',
      'time_seva_msg': 'ઉદારતાથી તમારો સમય આપવા અને સેવા માટે હાજર રહેવા બદલ આભાર.',
      'team_seva_msg': 'તમારા ટીમવર્ક અને સંકલનને કારણે આ સેવા સફળ થઈ. તમારા સમર્થન માટે આભાર.',
      'impactful_seva_msg': 'તમારા યોગદાનથી સાર્થક પ્રભાવ પડ્યો. તમારી પ્રેરણાદાયી સેવા બદલ આભાર.',

      // General
      'ok': 'બરાબર',
      'cancel': 'રદ કરો',
      'delete': 'કાઢી નાખો',
      'loading': 'લોડ થઈ રહ્યું છે...',
      'error': 'ભૂલ',
      'success': 'સફળ',
      'search': 'શોધો',

      // Admin & Guruji Dashboard (Gujarati)
      'admin_dashboard_title': 'એડમિન ડેશબોર્ડ',
      'access_denied_admin': 'પ્રવેશ નકાર્યો. ફક્ત એડમિન માટે.',
      'menu_calendar': 'કેલેન્ડર',
      'menu_branches': 'શાખાઓ',
      'menu_gurujis': 'ગુરુજીઓ',
      'menu_news': 'સમાચાર',
      'menu_attendance': 'હાજરી',
      'menu_services': 'સેવાઓ',
      'menu_spiritual': 'આધ્યાત્મિક',
      'menu_requests': 'વિનંતીઓ',
      'menu_seva_ops': 'સેવા ઓપ્સ',
      'menu_media': 'મીડિયા',
      'menu_important_info': 'મહત્વપૂર્ણ માહિતી',
      'menu_public_groups': 'જાહેર જૂથો',
      'migrate_legacy_data': 'વારસાગત માહિતી સ્થાનાંતરિત કરો (એક-વખત)',
      'welcome_back': 'પાછા સ્વાગત છે,',
      'quick_actions': 'ઝડપી ક્રિયાઓ',
      'available_requests_title': 'ઉપલબ્ધ વિનંતીઓ',
      'awaiting_admin_assignment': 'એડમિન સોંપણીની રાહ જોઈ રહ્યા છે',
      'client_label': 'ગ્રાહક',
      'contact_label': 'સંપર્ક',
      'date_label': 'તારીખ',
      'time_label': 'સમય',
      'address_label': 'સરનામું',
      'gurujis_interested': 'ગુરુજીઓને રસ છે',
      'i_can_take_request': 'હું આ વિનંતી લઈ શકું છું',
      'waiting_admin_assign': 'એડમિન નિમણૂકની રાહ જોઈ રહ્યા છે',
      'volunteered_success': 'તમે સ્વયંસેવા કરી છે! એડમિનને જાણ કરવામાં આવી.',
      'required_samagri_checklist': 'જરૂરી સામગ્રી:',
      'optional_suffix': ' (વૈકલ્પિક)',
      'user_requested_items_title': 'વપરાશકર્તા વિનંતીઓ',
      'note_prefix': 'નોંધ:',
      'edit_reason': 'કારણ સંપાદિત કરો',
      'not_possible_btn': 'શક્ય નથી',
      'confirm_btn': 'પુષ્ટિ કરો',
      'user_attachments': 'જોડાણો:',
      'volunteered': 'સ્વયંસેવા',
      'guruji_dashboard': 'ગુરુજી ડેશબોર્ડ',
      'no_services_today': 'આજે કોઈ સેવા નિર્ધારિત નથી',
      'enjoy_day': 'તમારો દિવસ શુભ રહે!',
      'no_new_requests': 'કોઈ નવી વિનંતીઓ નથી',
      'check_back_later_requests': 'નવી વિનંતીઓ માટે પછીથી તપાસો',
      'tab_today': 'આજે',
      'tab_new_requests': 'નવી વિનંતીઓ',
      'tab_my_assigned': 'સોંપેલ',
      'seva_coordinator_dashboard': 'સેવા સંયોજક ડેશબોર્ડ',
      // Home Screen & Festival
      'today_celebrations_title': "આજના ઉત્સવો 🎉",
      'celebration_single_msg': "આજે {name} નો વિશેષ દિવસ છે! તમારા આશીર્વાદ મોકલો.",
      'celebration_multiple_msg': "આજે {count} ઉત્સવો છે! તમારા આશીર્વાદ મોકલો.",
      'festival_default_desc': "આજનો ખાસ તહેવાર!",
      'primary_festival_badge': "મુખ્ય તહેવાર",
      'swipe_to_dismiss': "દૂર કરવા માટે સ્વાઇપ કરો →",
      'app_name': 'ગાયત્રી પરિવાર કનેક્ટ',
      'submit': 'સબમિટ કરો',

      'emergency_summary': 'કટોકટી સારાંશ', // Gujarati
      'resolution_note': 'સમાધાન નોંધ',
      'call_required': 'કોલ આવશ્યક',
      'call_logged': 'કોલ કર્યો',
      'sos_created': 'SOS બનાવ્યું',
      'resolve_emergency_title': 'કટોકટી ઉકેલો',
      'min_chars_10': 'ઓછામાં ઓછા 10 અક્ષરો જરૂરી',
      'min_chars_20': 'ઓછામાં ઓછા 20 અક્ષરો જરૂરી',
      'no_data': 'કોઈ ડેટા ઉપલબ્ધ નથી',
      'all_is_well': 'બધું બરાબર છે!',
      'retry': 'ફરી પ્રયાસ કરો',
      'close': 'બંધ કરો',
      'confirm': 'પુષ્ટિ કરો',
      'no_interests_available': 'કોઈ રુચિ ઉપલબ્ધ નથી',
      'interests_topics': 'રુચિઓ / વિષયો',
      'group_interests_title': 'સમૂહની રુચિઓ',
      'yes': 'હા',
      'no': 'ના',
      'back': 'પાછા',
      'next': 'આગળ',
      'done': 'થઈ ગયું',
      'select': 'પસંદ કરો',
      'add': 'ઉમેરો',
      'remove': 'દૂર કરો',
      'update': 'અપડેટ કરો',
      'view_history': 'ઇતિહાસ જુઓ',
      'my_sos_history': 'મારો SOS ઇતિહાસ',
      'call_now': 'હમણાં કૉલ કરો',
      'status_open': 'ખુલ્લું',
      'status_acknowledged': 'સ્વીકૃત',
      'status_resolved': 'ઉકેલાયેલ',
      'status_cancelled': 'રદ કરેલ',
      'acknowledged': 'સ્વીકારવામાં આવ્યું',
      'waiting': 'રાહ જુઓ...',
      'managed_by': '{name} દ્વારા સંચાલિત',
      'by': '{name} દ્વારા',
      'description': 'વર્ણન',
      'resolved': 'ઉકેલાયેલ',
      'role_admin': 'એડમિન',
      'role_parent': 'વાલી',
      'role_guruji': 'ગુરુજી',
      'role_unknown': 'અજ્ઞાત',
      'details': 'વિગતો',
      'title': 'શીર્ષક',
      'date': 'તારીખ',
      'time': 'સમય',
      'status': 'સ્થિતિ',
      'pending': 'બાકી',
      'approved': 'મંજૂર',
      'rejected': 'નકારેલ',
      'completed': 'પૂર્ણ',
      'ongoing': 'ચાલુ',
      'no_ongoing_events': 'કોઈ ચાલુ કાર્યક્રમ નથી',
      'all': 'બધા',
      'filter': 'ફિલ્ટર',
      'sort': 'ક્રમબદ્ધ',
      'upload': 'અપલોડ',
      'refresh': 'લોડ કરો',

       // Admin Family Links
      'family_links_admin': 'પારિવારિક લિંક્સ',
      'search_users': 'વપરાશકર્તા શોધો...',
      'filter_status': 'સ્થિતિ',
      'all_links': 'બધી લિંક્સ',
      'audit_trail': 'ઓડિટ ટ્રેલ',
      'add_link': 'લિંક ઉમેરો',
      'links_found': 'લિંક્સ મળી',
      'no_family_links': 'કોઈ પારિવારિક લિંક મળી નથી',
      'no_audit_logs': 'કોઈ ઓડિટ લોગ મળ્યા નથી',
      'parent_child': 'માતા-પિતા/બાળક',
      'relationship': 'સંબંધ',
      'created': 'બનાવ્યું',
      'actions': 'ક્રિયાઓ',
      'import_failed': 'આયાત નિષ્ફળ',
      'file_saved': 'ફાઇલ સાચવી',
      'export_success': 'નિકાસ સફળ',
      'export_failed': 'નિકાસ નિષ્ફળ',
      'importing': 'આયાત કરી રહ્યું છે...',
      'processing': 'પ્રક્રિયા કરી રહ્યું છે',
      'links': 'લિંક્સ',
      'import_complete': 'આયાત પૂર્ણ',
      'failed': 'નિષ્ફળ',
      'add_first_link': '+ બટનનો ઉપયોગ કરીને તમારી પ્રથમ પારિવારિક લિંક ઉમેરો',
      'parent': 'માતા-પિતા',
      'child': 'બાળક',
      'no_links_to_export': 'નિકાસ માટે કોઈ લિંક નથી',

      // Edit Link Dialog
      'current_link': 'વર્તમાન લિંક',
      'type': 'પ્રકાર',
      'permissions': 'પરવાનગીઓ',
      'view_activity': 'પ્રવૃત્તિ જુઓ',
      'receive_sos': 'SOS ચેતવણીઓ મેળવો',
      'restrict_content': 'સામગ્રી પ્રતિબંધિત કરો',
      'restrict_content_desc': 'બાળકની પહોંચ મર્યાદિત કરો',
      'expiration_date': 'સમાપ્તિ તારીખ',
      'no_expiration': 'કોઈ સમાપ્તિ નથી',
      'last_modified_by': 'દ્વારા છેલ્લે સુધારેલ',
      'link_updated': 'પારિવારિક લિંક સફળતાપૂર્વક અપડેટ થઈ',

      // Auth
      'login': 'લૉગિન',
      'signup': 'સાઇન અપ',
      'logout': 'લૉગઆઉટ',
      'email': 'ઈમેઇલ',
      'password': 'પાસવર્ડ',
      'confirm_password': 'પાસવર્ડ પુષ્ટિ કરો',
      'forgot_password': 'પાસવર્ડ ભૂલી ગયા?',
      'sign_in_continue': 'ચાલુ રાખવા સાઇન ઇન કરો',
      'reset_password': 'પાસવર્ડ રીસેટ કરો',
      'send_reset_link': 'રીસેટ લિંક મોકલો',
      'create_account': 'ખાતું બનાવો',
      'already_have_account': 'પહેલેથી ખાતું છે?',
      'dont_have_account': 'ખાતું નથી?',
      'enter_email': 'તમારો ઈમેઇલ દાખલ કરો',
      'enter_password': 'તમારો પાસવર્ડ દાખલ કરો',
      'join_gayatri': 'ગાયત્રી પરિવારમાં જોડાઓ',
      // Navigation
      'home': 'હોમ',
      'groups': 'જૂથો',
      'events': 'કાર્યક્રમો',
      'group_events': 'જૂથ કાર્યક્રમો',
      'more_actions': 'વધુ વિકલ્પો',
      'mark_attendance': 'હાજરી પૂરો',
      'attendance': 'હાજરી',
      'manage_members': 'સભ્યોનું સંચાલન',
      'view_members': 'સભ્યો જુઓ',
      'view_sadhana': 'સાધના જુઓ',
      'spiritual': 'આધ્યાત્મિક',
      'profile': 'પ્રોફાઇલ',
      'settings': 'સેટિંગ્સ',
      'news': 'સમાચાર',
      'chat': 'ચેટ',
      'members': 'સભ્યો',
      // Settings
      'notifications': 'સૂચનાઓ',
      'appearance': 'દેખાવ',
      'theme': 'થીમ',
      'font_size': 'ફોન્ટ કદ',
      'language': 'ભાષા',
      'privacy_security': 'ગોપનીયતા અને સુરક્ષા',
      'change_password': 'પાસવર્ડ બદલો',
      'about': 'વિશે',
      'app_version': 'એપ આવૃત્તિ',
      'terms_conditions': 'નિયમો અને શરતો',
      'privacy_policy': 'ગોપનીયતા નીતિ',
      'contact_support': 'સપોર્ટનો સંપર્ક કરો',
      'clear_cache': 'કેશ સાફ કરો',
      'rate_app': 'એપને રેટ કરો',
      'change_username': 'વપરાશકર્તા નામ બદલો',
      'two_factor_auth': 'બે-પગલાં પ્રમાણીકરણ',
      'coming_soon': 'ટૂંક સમયમાં આવી રહ્યું છે',
      'free_up_storage': 'સ્ટોરેજ ખાલી કરો',
      'clear_cache_message': 'આ બધી કેશ કરેલી છબીઓને સાફ કરશે અને સ્ટોરેજ સ્પેસ મુક્ત કરશે. ચાલુ રાખવું?',
      'clear_cache_success': 'કેશ સફળતાપૂર્વક સાફ કરવામાં આવ્યું',
      'cannot_change_until': 'આ તારીખ સુધી બદલી શકાશે નહીં',
      'pending_invitations': 'બાકી આમંત્રણો',
      'no_pending_invitations': 'કોઈ બાકી આમંત્રણો નથી',
      'invitations_hint': 'જૂથના આમંત્રણો અહીં દેખાશે',
      'pranaam_greeting': 'પ્રણામ',
      'celebrations': 'ઉજવણીઓ',
      'calendar': 'કેલેન્ડર',
      'continue_with_google': 'Google સાથે ચાલુ રાખો',
      // Celebrations
      'celebrations_page_title': '🎉 આજના ઉત્સવો',
      'no_celebrations_today': 'આજે કોઈ ઉત્સવ નથી',
      'special_note': 'આજે અમે આ ભક્તો માટે આહુતિ આપીએ છીએ અને મંત્ર જાપ કરીએ છીએ. કૃપા કરીને તેમને તમારા આશીર્વાદમાં રાખો.',
      'chant_mantra': 'મંત્ર જાપ',
      'yagya_ahuti': 'યજ્ઞ આહુતિ',
      'send_blessings': 'આશીર્વાદ મોકલો',
      'birthdays': '🎂 જન્મદિવસ',
      'anniversaries': '💍 વર્ષગાંઠ',
      'turning_age_prefix': 'આજે',
      'turning_age_suffix': 'વર્ષ પૂરા કરી રહ્યા છીએ!',
      'blessings_msg': 'લાંબા અને સ્વસ્થ જીવન માટે આશીર્વાદ!',
      'celebrating_years_prefix': 'સાથના',
      'celebrating_years_suffix': 'વર્ષ ઉજવી રહ્યા છીએ!',
      'festival_calendar': 'તહેવાર કેલેન્ડર',
      'no_events_day': 'આ દિવસે કોઈ કાર્યક્રમ નથી',
      // Festivals
      'makar_sankranti': 'મકરસંક્રાંતિ',
      'vasant_panchami': 'વસંત પંચમી',
      'maha_shivaratri': 'મહાશિવરાત્રી',
      'holi': 'હોળી',
      'ram_navami': 'રામ નવમી',
      'raksha_bandhan': 'રક્ષાબંધન',
      'janmashtami': 'જન્માષ્ટમી',
      'ganesh_chaturthi': 'ગણેશ ચતુર્થી',
      'dussehra': 'દશેરા',
      'diwali': 'દિવાળી',
      // Theme options
      'light': 'લાઇટ',
      'dark': 'ડાર્ક',
      'system_default': 'સિસ્ટમ ડિફોલ્ટ',
      // Font size options
      'small': 'નાનું',
      'medium': 'મધ્યમ',
      'large': 'મોટું',
      // Profile
      'edit_profile': 'પ્રોફાઇલ સંપાદિત કરો',
      'full_name': 'પૂરું નામ',
      'phone_number': 'ફોન નંબર',
      'location': 'સ્થાન',
      'city': 'શહેર',
      'branch': 'શાખા',
      'select_branch': 'શાખા પસંદ કરો',
      'select_guruji': 'ગુરુજી પસંદ કરો',
      'interests': 'રુચિઓ',
      'complete_setup': 'સેટઅપ પૂર્ણ કરો',
      'profile_setup': 'પ્રોફાઇલ સેટઅપ',
      'personal_info': 'વ્યક્તિગત માહિતી',
      'contact_info': 'સંપર્ક માહિતી',
      'username': 'યૂઝરનેમ',
      'bio': 'પરિચય',
      'date_of_birth': 'જન્મ તારીખ',
      'gender': 'લિંગ',
      // Services
      'request_service': 'સેવાની વિનંતી કરો',
      'my_requests': 'મારી વિનંતીઓ',
      'service_type': 'સેવા પ્રકાર',
      'address': 'સરનામું',
      'preferred_date': 'પસંદની તારીખ',
      'preferred_time': 'પસંદનો સમય',
      'additional_notes': 'વધારાની નોંધો',
      'select_service': 'સેવા પસંદ કરો',
      'service_details': 'સેવા વિગતો',
      'request_status': 'વિનંતી સ્થિતિ',
      'new_request': 'નવી વિનંતી',
      'city_hint': 'જેમ કે, ભિવંડી',
      'building_apt': 'બિલ્ડિંગ/ફ્લેટ',
      'flat_floor': 'ફ્લેટ નં. અને માળ',
      'building_society_name': 'બિલ્ડિંગ / સોસાયટીનું નામ',
      'street_road_name': 'શેરી / રોડનું નામ',
      'landmark_optional': 'લેન્ડમાર્ક (વૈકલ્પિક)',
      'city_location': 'શહેર / સ્થળ',
      'user_requested_items': 'વપરાશકર્તા વિનંતી કરેલી વસ્તુઓ',
      'required_samagri_admin': 'જરૂરી સામગ્રી (એડમિન)',
      'guruji_cannot_arrange': 'ગુરુજી વ્યવસ્થા કરી શકતા નથી',
      'not_possible_reason': 'કારણ: ',
      'edit_item': 'ફેરફાર કરો',
      'select_service_type_error': 'કૃપા કરીને સેવા પ્રકાર પસંદ કરો',
      'not_backed_up_yet': 'હજુ સુધી બેકઅપ લીધું નથી',
      'syncing': 'સિંક થઈ રહ્યું છે...',
      'data_synced': 'ડેટા સિંક થઈ ગયો',
      'data_not_synced': 'ડેટા સિંક થયો નથી, ઉપકરણ પર સાચવ્યો છે',
      'data_synced_cloud': 'ડેટા સિંક થયો, ક્લાઉડ પર સાચવ્યો છે',
      'sync_data': 'ડેટા સિંક કરો',
      'backing_up_data': 'ડેટા ક્લાઉડ પર બેકઅપ થઈ રહ્યો છે...',
      'sun_short': 'રવિ',
      'mon_short': 'સોમ',
      'tue_short': 'મંગળ',
      'wed_short': 'બુધ',
      'thu_short': 'ગુરુ',
      'fri_short': 'શુક્ર',
      'sat_short': 'શનિ',
      // Notifications
      'news_notifications': 'સમાચાર સૂચનાઓ',
      'event_notifications': 'કાર્યક્રમ સૂચનાઓ',
      'group_notifications': 'જૂથ સૂચનાઓ',
      'announcement_notifications': 'ઘોષણાઓ',
      'satsang_notifications': 'દૈનિક સત્સંગ સંદેશા',
      // Home Dashboard
      'pranaam': 'પ્રણામ 🙏',
      'welcome_to_gayatri': 'ગાયત્રી પરિવારમાં પાછા આવ્યા તે આવકાર્ય',
      'quick_access': 'ઝડપી ઍક્સેસ',
      'latest_news': 'તાજા સમાચાર',
      'upcoming_events': 'આગામી કાર્યક્રમો',
      'my_groups': 'મારા જૂથો',
      'media_library': 'મીડિયા લાઇબ્રેરી',
      // Change Password
      'change_password_desc': 'તમારો હાલનો પાસવર્ડ દાખલ કરો અને નવો પસંદ કરો',
      'current_password': 'વર્તમાન પાસવર્ડ',
      'new_password': 'નવો પાસવર્ડ',
      'password_tips': 'પાસવર્ડ ટિપ્સ',
      'password_tip_1': 'ઓછામાં ઓછા 8 અક્ષરોનો ઉપયોગ કરો',
      'password_tip_2': 'અપરકેસ અને લોઅરકેસ અક્ષરો શામેલ કરો',
      'password_tip_3': 'નંબર અને વિશિષ્ટ અક્ષરો ઉમેરો',
      'password_tip_4': 'સામાન્ય શબ્દો અથવા પેટર્ન ટાળો',
      // Profile Setup & Edit
      'save_changes': 'ફેરફારો સાચવો',
      'take_photo': 'ફોટો લો',
      'choose_from_gallery': 'ગેલેરીમાંથી પસંદ કરો',
      'verify_password': 'પાસવર્ડ ચકાસો',
      'verify_password_desc': 'સુરક્ષા માટે, કૃપા કરીને તમારો ફોન નંબર બદલવા માટે તમારો પાસવર્ડ દાખલ કરો.',
      'verify': 'ચકાસો',
      'incorrect_password': 'ખોટો પાસવર્ડ. કૃપા કરીને ફરી પ્રયાસ કરો.',
      'profile_updated': 'પ્રોફાઇલ સફળતાપૂર્વક અપડેટ થઈ',
      'failed_save': 'પ્રોફાઇલ સાચવવામાં નિષ્ફળ',
      'select_interest_error': 'કૃપા કરીને ઓછામાં ઓછી એક રુચિ પસંદ કરો',
      'select_location': 'તમારું સ્થાન પસંદ કરો',
      'select_location_error': 'કૃપા કરીને તમારું સ્થાન પસંદ કરો',
      'enter_name_error': 'કૃપા કરીને તમારું નામ દાખલ કરો',
      'enter_phone_error': 'કૃપા કરીને તમારો ફોન નંબર દાખલ કરો',
      'invalid_phone_error': 'કૃપા કરીને માન્ય 10-અંકનો ફોન નંબર દાખલ કરો',
      'enter_dob_error': 'કૃપા કરીને તમારી જન્મ તારીખ પસંદ કરો',
      'enter_full_name': 'કૃપા કરીને તમારું પૂરું નામ દાખલ કરો',
      'enter_phone': 'કૃપા કરીને તમારો ફોન નંબર દાખલ કરો',
      'enter_valid_phone': 'કૃપા કરીને માન્ય 10-અંકનો ફોન નંબર દાખલ કરો',
      'select_dob': 'કૃપા કરીને તમારી જન્મ તારીખ પસંદ કરો',
      'select_gender': 'લિંગ પસંદ કરો',
      'select_gender_error': 'કૃપા કરીને તમારું લિંગ પસંદ કરો',
      'select_location_error': 'કૃપા કરીને તમારું સ્થાન પસંદ કરો',
      'username_available': 'યૂઝરનેમ ઉપલબ્ધ છે',
      'username_taken': 'આ યૂઝરનેમ પહેલાથી જ લેવામાં આવ્યું છે',
      'logout_confirmation': 'શું તમે લોગ આઉટ કરવા માંગો છો?',
      'confirm_logout': 'લોગ આઉટ',
      'cancel': 'રદ કરો',
      'social_youtube': 'યુટ્યુબ',
      'social_facebook': 'ફેસબુક',
      'social_instagram': 'ઇન્સ્ટાગ્રામ',
      'follow_us': 'અમારી સાથે જોડાઓ',
      // Tutorial
      'tutorial_profile_title': 'તમારી પ્રોફાઇલ',
      'tutorial_profile_desc': 'તમારી પ્રોફાઇલ જોવા અને ફેરફાર કરવા અહીં ટેપ કરો.',
      'tutorial_daily_inspiration_title': 'દૈનિક પ્રેરણા',
      'tutorial_daily_inspiration_desc': 'તમારા દિવસની શરૂઆત આધ્યાત્મિક વિચારોથી કરો.',
      'tutorial_celebrations_title': 'ઉજવણી',
      'tutorial_celebrations_desc': 'આજે કોનો જન્મદિવસ અને વર્ષગાંઠ છે તે જુઓ!',
      'tutorial_calendar_desc': 'આગામી તહેવારો અને કાર્યક્રમો જુઓ.',
      'tutorial_news_desc': 'નવીનતમ સમાચાર અને જાહેરાતો સાથે અપડેટ રહો.',
      'tutorial_events_title': 'કાર્યક્રમો',
      'tutorial_events_desc': 'તમારા સમુદાયના કાર્યક્રમોમાં જોડાઓ.',
      'tutorial_groups_title': 'જૂથો',
      'tutorial_groups_desc': 'જૂથોમાં જોડાઓ અને સભ્યો સાથે જોડાઓ.',
      'tutorial_spiritual_desc': 'આધ્યાત્મિક સંસાધનો અને સુવિચાર મેળવો.',
      'tutorial_request_service_title': 'સેવા વિનંતી',
      'tutorial_request_service_desc': 'યજ્ઞ, સંસ્કાર વગેરે માટે વિનંતી કરો.',
      'tutorial_seva_title': 'સેવાની તકો',
      'tutorial_seva_desc': 'નિઃસ્વાર્થ સેવા માટે સ્વયંસેવક બનો.',
      'tutorial_media_title': 'મીડિયા લાઇબ્રેરી',
      'tutorial_media_desc': 'કાર્યક્રમોના ફોટો અને વિડિયો જુઓ.',
      'tutorial_bottom_nav_title': 'નેવિગેશન',
      'tutorial_bottom_nav_desc': 'હોમ, જૂથો, કાર્યક્રમો અને પ્રોફાઇલ વચ્ચે સ્વિચ કરવા માટે ઉપયોગ કરો.',
      'tutorial_emergency_sos_title': 'ઈમરજન્સી મદદ',
      'tutorial_emergency_sos_desc': 'ઈમરજન્સીમાં ત્વરિત મદદ માટે આ બટનનો ઉપયોગ કરો.',
      'tutorial_mandir_schedule_title': 'મંદિર સમયપત્રક',
      'tutorial_mandir_schedule_desc': 'આરતી, દર્શન અને અન્ય પ્રવૃત્તિઓનો સમય જુઓ.',
      'tutorial_upcoming_events_title': 'આગામી કાર્યક્રમો',
      'tutorial_upcoming_events_desc': 'ટૂંક સમયમાં યોજાનાર મહત્વપૂર્ણ કાર્યક્રમોની યાદી જુઓ.',
      'tutorial_latest_news_title': 'તાજા સમાચાર',
      'tutorial_latest_news_desc': 'ગાયત્રી પરિવારની નવીનતમ પ્રવૃત્તિઓ અને સૂચનાઓ.',
      'marital_status': 'વૈવાહિક સ્થિતિ',
      'marriage_anniversary': 'લગ્નની વર્ષગાંઠ',
      'engagement_date': 'સગાઈની તારીખ',
      'single': 'અવિવાહિત',
      'engaged': 'સગાઈ થયેલ',
      'married': 'પરિણીત',
      'widow_widower': 'વિધવા/વિધુર',
      'select_your_interests': 'તમારી રુચિઓ પસંદ કરો',
      'username_helper_text': 'દર 30 દિવસે માત્ર એક વાર બદલી શકાય છે',
      'username_min_length': 'યૂઝરનેમ ઓછામાં ઓછા 3 અક્ષરોનું હોવું જોઈએ',
      'username_max_length': 'યૂઝરનેમ 20 અક્ષરો કરતા ઓછું હોવું જોઈએ',
      'username_invalid_chars': 'માત્ર અક્ષરો, નંબરો અને અંડરસ્કોરની મંજૂરી છે',
      'username_cooldown_msg': 'યૂઝરનેમ આટલા દિવસોમાં બદલી શકાશે',
      'username_locked_msg': 'યૂઝરનેમ આ તારીખ સુધી બદલી શકાશે નહીં',
      // Seva Appreciation (Tickets 5-6)
      'complete_with_gratitude': 'કૃતજ્ઞતાસાથે પૂર્ણ કરો',
      'share_your_gratitude': 'તમારી કૃતજ્ઞતા શેર કરો',
      'select_badge_type': 'બેજ પ્રકાર પસંદ કરો',
      'seva_contributions': 'સેવા યોગદાન',
      'appreciations_received': 'પ્રશંસાઓ પ્રાપ્ત',
      'no_appreciations_yet': 'તમારા સેવા યોગદાનને અહીં માન્યતા આપવામાં આવશે',
      'appreciation_sent': 'કૃતજ્ઞતા મોકલી',
      'character_count': 'અક્ષરો',
      'please_share_gratitude': 'કૃપા કરીને તમારી કૃતજ્ઞતા શેર કરો',
      'write_at_least_50_chars': 'વ્યક્તિગત બનાવવા માટે કૃપા કરીને ઓછામાં ઓછા 50 અક્ષરો લખો',
      'keep_under_200_chars': 'કૃપા કરીને તમારો સંદેશ 200 અક્ષરોની અંદર રાખો',
      'please_select_badge': 'કૃપા કરીને બેજ પ્રકાર પસંદ કરો',
      'already_appreciated': 'આ સ્વયંસેવકની આ સેવા માટે પહેલેથી જ પ્રશંસા કરવામાં આવી છે।',
      'gratitude_for_seva': 'તમારી સેવા માટે કૃતજ્ઞતા',
      'seva_appreciated_msg': 'તમારી સેવા "{title}" ને કૃતજ્ઞતાથી પ્રશંસા કરવામાં આવી છે।',
      'seva_contributions_recognized': 'તમારી સેવાની પ્રશંસા કરવામાં આવી છે',
      'sending_gratitude': 'મોકલી રહ્યા છીએ...',
      'send_gratitude': 'કૃતજ્ઞતા મોકલો',
      'days': 'દિવસો',
      // Terms & Conditions
      'terms_update_date': 'છેલ્લું અપડેટ: 06 ડિસેમ્બર 2025',
      'terms_1_title': '1. શરતોની સ્વીકૃતિ',
      'terms_1_content': 'ગાયત્રી પરિવાર કનેક્ટ એપ ડાઉનલોડ, ઇન્સ્ટોલ અથવા ઉપયોગ કરીને, તમે આ નિયમો અને શરતોથી બંધાયેલા રહેવા માટે સંમત થાઓ છો. જો તમે આ શરતો સાથે સંમત નથી, તો કૃપા કરીને એપનો ઉપયોગ કરશો નહીં.',
      'terms_2_title': '2. સેવાનું વર્ણન',
      'terms_2_content': 'ગાયત્રી પરિવાર કનેક્ટ એક સામુદાયિક એપ છે જે ગાયત્રી પરિવાર આધ્યાત્મિક સમુદાયના સભ્યોને જોડવા માટે ડિઝાઇન કરવામાં આવી છે. એપ નીચે મુજબની સુવિધાઓ પ્રદાન કરે છે:\n\n• જૂથ સંચાર અને મેસેજિંગ\n• કાર્યક્રમ વ્યવસ્થાપન અને સૂચનાઓ\n• આધ્યાત્મિક સંસાધનો અને સામગ્રી\n• સામુદાયિક સમાચાર અને ઘોષણાઓ\n• પ્રોફાઇલ વ્યવસ્થાપન',
      'terms_3_title': '3. વપરાશકર્તા ખાતા',
      'terms_3_content': '• ખાતું બનાવતી વખતે તમારે સચોટ માહિતી પ્રદાન કરવી આવશ્યક છે\n• તમારા ખાતાના ક્રેડેન્શિયલ્સની ગુપ્તતા જાળવવા માટે તમે જવાબદાર છો\n• આ એપનો ઉપયોગ કરવા માટે તમારી ઉંમર ઓછામાં ઓછી 13 વર્ષ હોવી જોઈએ\n• એક વ્યક્તિ એકથી વધુ ખાતા રાખી શકતી નથી',
      'terms_4_title': '4. વપરાશકર્તા વર્તન',
      'terms_4_content': 'તમે સંમત થાઓ છો કે તમે:\n\n• અપમાનજનક, અભદ્ર અથવા અયોગ્ય સામગ્રી પોસ્ટ કરશો નહીં\n• અન્ય વપરાશકર્તાઓને હેરાન કરશો નહીં અથવા ધમકાવશો નહીં\n• ખોટી અથવા ભ્રામક માહિતી શેર કરશો નહીં\n• પરવાનગી વિના વ્યાપારી હેતુઓ માટે એપનો ઉપયોગ કરશો નહીં\n• અન્ય ખાતાઓમાં અનધિકૃત પ્રવેશ મેળવવાનો પ્રયાસ કરશો નહીં\n• કોઈપણ લાગુ કાયદા અથવા નિયમોનું ઉલ્લંઘન કરશો નહીં',
      'terms_5_title': '5. સામગ્રી માર્ગદર્શિકા',
      'terms_5_content': '• શેર કરવામાં આવેલી તમામ સામગ્રી ગાયત્રી પરિવારના આધ્યાત્મિક મૂલ્યો સાથે સુસંગત હોવી જોઈએ\n• તમામ સમુદાયના સભ્યોની ધાર્મિક અને સાંસ્કૃતિક ભાવનાઓનો આદર કરો\n• પરવાનગી વિના કોપીરાઇટ સામગ્રી શેર કરશો નહીં\n• એપ સંચાલકોને અયોગ્ય સામગ્રી દૂર કરવાનો અધિકાર છે',
      'terms_6_title': '6. ગોપનીયતા',
      'terms_6_content': 'તમારી ગોપનીયતા અમારા માટે મહત્વપૂર્ણ છે. અમે તમારી વ્યક્તિગત માહિતી કેવી રીતે એકત્રિત કરીએ છીએ, ઉપયોગ કરીએ છીએ અને સુરક્ષિત કરીએ છીએ તે વિશેની માહિતી માટે કૃપા કરીને અમારી ગોપનીયતા નીતિ જુઓ.',
      'terms_7_title': '7. બૌદ્ધિક સંપત્તિ',
      'terms_7_content': '• એપ અને તેની સામગ્રી કોપીરાઇટ અને અન્ય બૌદ્ધિક સંપત્તિ કાયદાઓ દ્વારા સુરક્ષિત છે\n• ગાયત્રી પરિવાર લોગો, નામ અને સંબંધિત સાહિત્ય ટ્રેડમાર્ક છે\n• વપરાશકર્તાઓ તેમની પોતાની સામગ્રીની માલિકી ધરાવે છે પરંતુ એપને તે પ્રદર્શિત કરવા માટે લાયસન્સ આપે છે',
      'terms_8_title': '8. સમાપ્તિ',
      'terms_8_content': 'અમે તમારું ખાતું સ્થગિત અથવા સમાપ્ત કરવાનો અધિકાર અનામત રાખીએ છીએ જો:\n\n• તમે આ નિયમો અને શરતોનું ઉલ્લંઘન કરો\n• તમે સમુદાય માટે હાનિકારક વર્તનમાં સામેલ થાઓ\n• તમારું ખાતું લાંબા સમય સુધી નિષ્ક્રિય રહે\n• કાયદા અથવા સમુદાય માર્ગદર્શિકા દ્વારા જરૂરી હોય',
      'terms_9_title': '9. અસ્વીકરણ',
      'terms_9_content': '• એપ "જેમ છે" ના ધોરણે પ્રદાન કરવામાં આવે છે, કોઈપણ વોરંટી વિના\n• અમે અવિરત અથવા ક્ષતિયુક્ત સેવા મુક્ત હોવાની ખાતરી આપતા નથી\n• અમે વપરાશકર્તા-જનિત સામગ્રી માટે જવાબદાર નથી\n• એપનો ઉપયોગ તમારા પોતાના જોખમે છે',
      'terms_10_title': '10. શરતોમાં ફેરફાર',
      'terms_10_content': 'અમે સમયાંતરે આ નિયમો અને શરતો અપડેટ કરી શકીએ છીએ. ફેરફારો પછી એપનો સતત ઉપયોગ નવી શરતોની સ્વીકૃતિ સૂચવે છે.',
      'terms_11_title': '11. સંપર્ક',
      'terms_11_content': 'આ નિયમો અને શરતો વિશેના પ્રશ્નો માટે, કૃપા કરીને એપની સહાય સુવિધા દ્વારા અથવા આ ઇમેઇલ પર અમારો સંપર્ક કરો:\n\nઇમેઇલ: gayatripragyapeethbhiwandi@gmail.com',
      // Privacy Policy
      'privacy_update_date': 'છેલ્લું અપડેટ: 06 ડિસેમ્બર 2025',
      'privacy_1_title': '1. પરિચય',
      'privacy_1_content': 'ગાયત્રી પરિવાર કનેક્ટ ("અમે", "અમારું") તમારી ગોપનીયતાનું રક્ષણ કરવા માટે પ્રતિબદ્ધ છે. આ ગોપનીયતા નીતિ સમજાવે છે કે જ્યારે તમે અમારી મોબાઇલ એપ્લિકેશનનો ઉપયોગ કરો છો ત્યારે અમે તમારી માહિતી કેવી રીતે એકત્રિત કરીએ છીએ, ઉપયોગ કરીએ છીએ, જાહેર કરીએ છીએ અને સુરક્ષિત કરીએ છીએ.',
      'privacy_2_title': '2. માહિતી જે અમે એકત્રિત કરીએ છીએ',
      'privacy_2_content': 'અમે તમે અમને સીધી પ્રદાન કરેલી માહિતી એકત્રિત કરીએ છીએ:\n\n• વ્યક્તિગત માહિતી: નામ, ઇમેઇલ સરનામું, ફોન નંબર, પ્રોફાઇલ ફોટો\n• સ્થાન ડેટા: સમુદાય જૂથ બનાવવા માટે શહેર અને રાજ્ય\n• ખાતાની માહિતી: વપરાશકર્તા નામ, પાસવર્ડ (એન્ક્રિપ્ટેડ)\n• આધ્યાત્મિક પસંદગીઓ: શાખા, ગુરુજી/ભગત જી પસંદગી\n• વપરાશકર્તા સામગ્રી: સંદેશાઓ, પોસ્ટ્સ અને અપલોડ જે તમે શેર કરો છો',
      'privacy_3_title': '3. અમે તમારી માહિતીનો ઉપયોગ કેવી રીતે કરીએ છીએ',
      'privacy_3_content': 'અમે એકત્રિત કરેલી માહિતીનો ઉપયોગ નીચે મુજબ કરીએ છીએ:\n\n• એપની કાર્યક્ષમતા પ્રદાન કરવા અને જાળવવા માટે\n• તમને સમુદાયના સભ્યો સાથે જોડવા માટે\n• તમને કાર્યક્રમો અને અપડેટ્સ વિશે સૂચનાઓ મોકલવા માટે\n• તમારા અનુભવને વ્યક્તિગત કરવા માટે\n• અમારી સેવાઓ સુધારવા માટે\n• એપ ફેરફારો વિશે તમારી સાથે વાતચીત કરવા માટે\n• સમુદાય સુરક્ષા અને માર્ગદર્શિકાનું પાલન સુનિશ્ચિત કરવા માટે',
      'privacy_4_title': '4. માહિતી શેર કરવી',
      'privacy_4_content': 'અમે તમારી માહિતી શેર કરી શકીએ છીએ:\n\n• અન્ય સમુદાયના સભ્યો સાથે (તમારી ગોપનીયતા સેટિંગ્સ મુજબ)\n• જૂથ વ્યવસ્થાપન માટે જૂથ સંચાલકો સાથે\n• સેવા પ્રદાતાઓ સાથે જે અમારા સંચાલનમાં મદદ કરે છે\n• જ્યારે કાયદા અથવા કાયદાકીય પ્રક્રિયા દ્વારા જરૂરી હોય\n• વપરાશકર્તાઓના અધિકારો, સંપત્તિ અથવા સુરક્ષાનું રક્ષણ કરવા માટે\n\nઅમે તમારી વ્યક્તિગત માહિતી તૃતીય પક્ષોને વેચતા નથી.',
      'privacy_5_title': '5. ડેટા સ્ટોરેજ અને સુરક્ષા',
      'privacy_5_content': '• તમારો ડેટા ફાયરબેઝ સર્વર પર સુરક્ષિત રીતે સંગ્રહિત છે\n• અમે સંવેદનશીલ ડેટા ટ્રાન્સમિશન માટે એન્ક્રિપ્શનનો ઉપયોગ કરીએ છીએ\n• પાસવર્ડ ડેટા હેશ કરવામાં આવે છે અને ક્યારેય સાદા ટેક્સ્ટમાં સંગ્રહિત કરવામાં આવતો નથી\n• પ્રોફાઇલ ફોટા સુરક્ષિત ક્લાઉડ સેવાઓ પર સંગ્રહિત કરવામાં આવે છે\n• અમે તમારા ડેટાને સુરક્ષિત કરવા માટે યોગ્ય સુરક્ષા પગલાં અમલમાં મૂકીએ છીએ',
      'privacy_6_title': '6. તમારા ગોપનીયતા અધિકારો',
      'privacy_6_content': 'તમને નીચેના અધિકારો છે:\n\n• તમારી વ્યક્તિગત માહિતીને ઍક્સેસ કરવી\n• ખોટો ડેટા સુધારવો\n• તમારું ખાતું અને સંબંધિત ડેટા કાઢી નાખવો\n• માર્કેટિંગ સંચારમાંથી બહાર નીકળવું\n• સૂચના પસંદગીઓને નિયંત્રિત કરવી\n• તમારા ડેટાની નકલની વિનંતી કરવી',
      'privacy_7_title': '7. બાળકોની ગોપનીયતા',
      'privacy_7_content': 'અમારી એપ 10 વર્ષથી ઓછી ઉંમરના બાળકો માટે નથી. અમે જાણીજોઈને 10 વર્ષથી ઓછી ઉંમરના બાળકો પાસેથી વ્યક્તિગત માહિતી એકત્રિત કરતા નથી. જો તમને લાગે કે અમે આવી માહિતી એકત્રિત કરી છે, તો કૃપા કરીને અમારો તરત જ સંપર્ક કરો.',
      'privacy_8_title': '8. પુશ સૂચનાઓ',
      'privacy_8_content': '• અમે કાર્યક્રમો, સંદેશાઓ અને ઘોષણાઓ માટે પુશ સૂચનાઓ મોકલીએ છીએ\n• તમે એપ સેટિંગ્સમાં સૂચના પસંદગીઓને નિયંત્રિત કરી શકો છો\n• તમે તમારી ઉપકરણ સેટિંગ્સ દ્વારા બધી સૂચનાઓને અક્ષમ કરી શકો છો\n• અમે તમારા ઉપકરણ ટોકનને તૃતીય પક્ષો સાથે શેર કરતા નથી',
      'privacy_9_title': '9. તૃતીય-પક્ષ સેવાઓ',
      'privacy_9_content': 'અમારી એપ તૃતીય-પક્ષ સેવાઓનો ઉપયોગ કરે છે:\n\n• ફાયરબેઝ (Google) - પ્રમાણીકરણ અને ડેટા સ્ટોરેજ\n• ક્લાઉડિનરી - ઇમેજ સ્ટોરેજ\n• ફાયરબેઝ ક્લાઉડ મેસેજિંગ - પુશ સૂચનાઓ\n\nઆ સેવાઓની પોતાની ગોપનીયતા નીતિઓ છે જે તમારી માહિતીના ઉપયોગને નિયંત્રિત કરે છે.',
      'privacy_10_title': '10. ડેટા જાળવણી',
      'privacy_10_content': '• જ્યાં સુધી તમારું ખાતું સક્રિય છે ત્યાં સુધી અમે તમારો ડેટા જાળવી રાખીએ છીએ\n• ખાતું કાઢી નાખવા પર, તમારો વ્યક્તિગત ડેટા 30 દિવસની અંદર દૂર કરવામાં આવે છે\n• એનાલિટિક્સ માટે અમુક અનામી ડેટા જાળવી રાખવામાં આવી શકે છે\n• જૂથ સાતત્ય માટે જૂથોમાં સંદેશ ઇતિહાસ જાળવી રાખવામાં આવી શકે છે',
      'privacy_11_title': '11. ગોપનીયતા નીતિમાં ફેરફાર',
      'privacy_11_content': 'અમે સમયાંતરે આ ગોપનીયતા નીતિ અપડેટ કરી શકીએ છીએ. અમે એપ દ્વારા અથવા ઇમેઇલ દ્વારા મહત્વપૂર્ણ ફેરફારો વિશે તમને સૂચિત કરીશું. ફેરફારો પછી સતત ઉપયોગ અપડેટ કરેલી નીતિની સ્વીકૃતિ સૂચવે છે.',
      'privacy_12_title': '12. અમારો સંપર્ક કરો',
      'privacy_12_content': 'આ ગોપનીયતા નીતિ અથવા તમારા ડેટા વિશેના પ્રશ્નો અથવા ચિંતાઓ માટે, કૃપા કરીને અમારો સંપર્ક કરો:\n\nઇમેઇલ: gayatripragyapeethbhiwandi@gmail.com\n\nતમે અમારા સુધી પહોંચવા માટે ઇન-એપ ફીડબેક સુવિધાનો પણ ઉપયોગ કરી શકો છો.',
      'view_all': 'બધા જુઓ',
      'no_news': 'કોઈ સમાચાર ઉપલબ્ધ નથી.',
      'no_events': 'કોઈ આગામી કાર્યક્રમ નથી.',
      // Family Connections
      'family_connections': 'પારિવારિક કનેક્શન',
      'family_connections_subtitle': 'તેમની સાધનાને ટેકો આપવા માટે પરિવાર સાથે લિંક કરો',
      'send_family_link_request': 'પારિવારિક લિંક વિનંતી મોકલો',
      'manage_family_links': 'પારિવારિક લિંક મેનેજ કરો',
      'my_connections': 'મારા કનેક્શન',
      'pending_requests': 'બાકી વિનંતીઓ',
      'no_family_connections': 'હજુ સુધી કોઈ પારિવારિક કનેક્શન નથી',
      'no_pending_family_requests': 'કોઈ પારિવારિક લિંક વિનંતીઓ નથી',
      'family_requests_appear_here': 'પારિવારિક લિંક વિનંતીઓ અહીં દેખાશે',
      'send_link_request': 'લિંક વિનંતી મોકલો',
      'email_username': 'ઈમેલ / વપરાશકર્તા નામ',
      'enter_email_or_username': 'ઈમેલ અથવા @વપરાશકર્તા નામ દાખલ કરો',
      'email_or_username_required': 'ઈમેલ અથવા વપરાશકર્તા નામ જરૂરી છે',
      'user_not_found': 'વપરાશકર્તા મળ્યા નથી',
      'searching': 'શોધી રહ્યું છે...',
      'you_will_be_supporter_of': 'તમે સમર્થક હશો',
      'relationship_type': 'સંબંધ પ્રકાર',
      'parent_to_child': 'માતા-પિતા → બાળક',
      'parent_child_desc': 'તમે માતા-પિતા અથવા વાલી છો જે બાળકની સાધના અને હોમવર્કને ટેકો આપી રહ્યા છો.',
      'caregiver_to_elder': 'કેરગીવર → વડીલ',
      'caregiver_elder_desc': 'તમે વડીલ પરિવારના સભ્યને માર્ગદર્શન અને ટેકો આપી રહ્યા છો.',
      'supporter_helper_text': 'તમે સમર્થક હશો. પસંદ કરેલ વપરાશકર્તા તે હશે જેનો તમે ટેકો કરશો.',
      'message_optional': 'સંદેશ (વૈકલ્પિક)',
      'add_personal_message': 'વ્યક્તિગત સંદેશ ઉમેરો...',
      'send_request': 'વિનંતી મોકલો',
      'sending': 'મોકલી રહ્યું છે...',
      'link_request_sent': 'લિંક વિનંતી સફળતાપૂર્વક મોકલવામાં આવી!',
      'family_link_accepted': 'પારિવારિક લિંક સ્વીકારવામાં આવી!',
      'request_declined': 'વિનંતી નકારી',
      'unlink': 'લિંક દૂર કરો',
      'unlink_confirm': 'શું તમે ખાતરી કરો છો કે તમે આ કનેક્શનને અનલિંક કરવા માંગો છો?',
      'family_linking': 'પરિવાર',
      'parent_child_link_request': 'માતા-પિતા-બાળક લિંક વિનંતી',
      'elder_caregiver_link_request': 'વડીલ-કેરગીવર લિંક વિનંતી',
      'from': 'તરફથી',
      'requested': 'વિનંતી કરી',
      'about_family_connections': 'પારિવારિક કનેક્શન વિશે',
      'family_connections_desc': 'તમે પરિવારના સભ્ય સાથે લિંક કરી શકો છો જેથી સમર્થન-લક્ષી રીતે તેમની આધ્યાત્મિક સાધના અને હોમવર્ક પ્રગતિ જોઈ શકો.',
      'accept': 'સ્વીકારો',
      'decline': 'નકારો',
      'requested_on': 'વિનંતી કરી',
      'connected_since': 'થી જોડાયેલ',
      'confirm_unlink_title': 'પારિવારિક લિંક દૂર કરવી છે?',
      'confirm_unlink_message': 'આ તમારા પારિવારિક જોડાણને દૂર કરશે અને સાધના માહિતી શેર કરવાનું બંધ કરશે. આ ક્રિયા રદ કરી શકાતી નથી.',
      'family_link_request': 'પારિવારિક લિંક વિનંતી',
      'practice_and_homework': 'સાધના અને હોમવર્ક',
      'support_learning': 'શિક્ષણ માટે સહાય',
      'no_practice_data': 'હજુ સુધી કોઈ સાધના ડેટા નથી',
      'not_tracking_practice': 'એ સાધના ટ્રેકિંગ શરૂ કર્યું નથી',
      'practice_summary': 'સાધના સારાંશ',
      'malas_done': 'માળા પૂર્ણ',
      'duration': 'સમયગાળો',
      'bss_attendance': 'બીએસએસ હાજરી',
      'present': 'હાજર',
      'absent': 'ગેરહાજર',
      'homework': 'હોમવર્ક',
      'deadline': 'અંતિમ તારીખ',
      'attachment': 'જોડાણ',
      'submission': 'સબમિશન',
      'late': 'મોડું',
      'on_time': 'સમયસર',
      'submitted_on': 'સબમિટ કર્યું',
      'view_submitted_work': 'સબમિટ કરેલું કાર્ય જુઓ (PDF)',
      'homework_accepted': 'હોમવર્ક સ્વીકાર્યું',
      'needs_revision': 'સુધારણા જરૂરી',
      'remark_by': 'દ્વારા',
      'status_pending': 'બાકી',
      'status_submitted': 'સબમિટ કર્યું',
      'status_checked': 'તપાસ્યું',
      'minutes_short': 'મિનિટ',
      'hours_short': 'કલાક',
      'request_accepted': 'વિનંતી સ્વીકારવામાં આવી!',
      // Emergency Help
      'emergency_help': 'ઇમરજન્સી મદદ',
      'emergency_help_subtitle': 'જરૂર હોય ત્યારે મદદ મેળવો',
      'need_help_btn': 'મદદ જોઈએ છે',
      'alert_family_admin': 'પરિવાર અને એડમિનને ચેતવણી આપો',
      'wait_message': 'કૃપા કરીને મદદ વિનંતીઓ વચ્ચે 15 મિનિટ રાહ જુઓ',
      'or_call_directly': 'અથવા સીધો કૉલ કરો',
      'help_requested_note': 'એપ્લિકેશન દ્વારા મદદની વિનંતી કરી',
      'alert_sent_success': '✅ ચેતવણી મોકલી! મદદ રસ્તામાં છે.',
      'emergency_error': 'ભૂલ',
      // Groups
      'create_group': 'જૂથ બનાવો',
      'join_group': 'જૂથમાં જોડાઓ',
      'leave_group': 'જૂથ છોડો',
      'group_name': 'જૂથનું નામ',
      'group_description': 'જૂથ વર્ણન',
      'group_type': 'જૂથ પ્રકાર',
      'group_members': 'જૂથ સભ્યો',
      'group_settings': 'સમૂહ સેટિંગ્સ',
      'add_members': 'સભ્યો ઉમેરો',


      // Guruji
      'my_groups_guruji': 'મારા જૂથો',
      'service_requests': 'સેવા વિનંતીઓ',
      // Groups (Restored)
      'remove_member': 'સભ્ય દૂર કરો',
      'make_admin': 'એડમિન બનાવો',
      'group_chat': 'જૂથ ચેટ',
      'edit_group': 'જૂથ સંપાદિત કરો',
      'delete_group': 'જૂથ કાઢી નાખો',
      'private_group': 'ખાનગી જૂથ',
      'no_groups': 'કોઈ જૂથ મળ્યું નથી.',
      'search_groups': 'જૂથો શોધો...',
      'invitations': 'આમંત્રણો',
      'invite_members': 'સભ્યોને આમંત્રિત કરો',
      'bss_group': 'બીએસએસ જૂથ',
      'sss_group': 'એસએસએસ જૂથ',
      'yss_group': 'વાયએસએસ જૂથ',
      'other_group': 'અન્ય જૂથ',
      // Events (Restored + New)
      'event_details': 'કાર્યક્રમ વિગતો',
      'past_event': 'ભૂતકાળનો કાર્યક્રમ',
      'upcoming': 'આગામી',
      'event_group': 'કાર્યક્રમ જૂથ',
      'join_discussion_group': 'ચર્ચા જૂથમાં જોડાઓ',
      'event_description': 'કાર્યક્રમ વર્ણન',
      'additional_media_available': 'વધારાનું મીડિયા ઉપલબ્ધ',
      'view_more_media': 'વધુ મીડિયા જુઓ',
      'delete_event': 'કાર્યક્રમ કાઢી નાખો',
      'delete_event_confirm': 'શું તમે ખરેખર આ કાર્યક્રમ કાઢી નાખવા માંગો છો?',
      'event_deleted_success': 'કાર્યક્રમ સફળતાપૂર્વક કાઢી નાખ્યો',
      'event_not_found': 'કાર્યક્રમ મળ્યો નથી',
      'error_deleting_event': 'કાર્યક્રમ કાઢી નાખવામાં ભૂલ: {error}',
      'tap_to_view': 'જોવા માટે ટેપ કરો',
      'create_event': 'કાર્યક્રમ બનાવો',
      'edit_event': 'કાર્યક્રમ સંપાદિત કરો',
      'event_details': 'કાર્યક્રમ વિગતો',
      'event_date': 'કાર્યક્રમ તારીખ',
      'event_time': 'કાર્યક્રમ સમય',
      'event_location': 'કાર્યક્રમ સ્થાન',
      'event_description': 'કાર્યક્રમ વર્ણન',
      'no_events_scheduled': 'કોઈ કાર્યક્રમ સુનિશ્ચિત નથી.',
      'register': 'નોંધણી કરો',
      'registered': 'નોંધાયેલ',
      'attendees': 'હાજર',
      'none': 'કોઈ નહીં',
      'camera_error': 'ફોટા પસંદ કરવામાં ભૂલ',
      'create_event_error': 'કાર્યક્રમ બનાવવામાં ભૂલ',
      'contact_role_hint': 'દા.ત. કાર્યક્રમ સંયોજક',
      'phone_hint': '+91 XXXXX XXXXX',
      'event_photos': 'કાર્યક્રમ ફોટા',
      'tap_to_add_photos': 'ફોટા ઉમેરવા માટે ટેપ કરો',
      'add_more_photos': 'વધુ ઉમેરો',
      'event_title_label': 'કાર્યક્રમ શીર્ષક',
      'event_title_hint': 'કાર્યક્રમ શીર્ષક દાખલ કરો',
      'event_description_hint': 'આ કાર્યક્રમ શેના વિશે છે?',
      'event_location_label': 'સ્થાન',
      'event_location_hint': 'કાર્યક્રમ ક્યાં યોજાશે?',
      'event_date_time_label': 'કાર્યક્રમ તારીખ અને સમય',
      'link_media_folder': 'મીડિયા ફોલ્ડર સાથે લિંક કરો',
      'link_public_group': 'સાર્વજનિક જૂથ સાથે લિંક કરો',
      'optional_label': 'વૈકલ્પિક',
      'media_folder_desc': 'વધારાના ફોટા/વિડિઓઝ માટે આ કાર્યક્રમને મીડિયા ફોલ્ડર સાથે લિંક કરો.',
      'select_folder_hint': 'ફોલ્ડર પસંદ કરો',
      'select_group_hint': 'સાર્વજનિક જૂથ પસંદ કરો',
      'uploading_photo_progress': 'ફોટો {current} / {total} અપલોડ થઈ રહ્યો છે...',
      'creating_event_progress': 'કાર્યક્રમ બનાવી રહ્યું છે...',
      'event_created_success': 'કાર્યક્રમ સફળતાપૂર્વક બનાવ્યો!',
      'responsible_contact': 'જવાબદાર સંપર્ક વ્યક્તિ',
      'select_user': 'વપરાશકર્તા પસંદ કરો',
      // Spiritual (Restored)
      'daily_quote': 'દૈનિક ઉદ્ધરણ',
      'meditation': 'ધ્યાન',
      'resources': 'સંસાધનો',
      'spiritual_tips': 'આધ્યાત્મિક ટિપ્સ',
      'gayatri_mantra': 'ગાયત્રી મંત્ર',
      'books': 'પુસ્તકો',
      'audio': 'ઓડિયો',
      'videos': 'વીડિયો',
      'pictures': 'ચિત્રો',
      'bhajans': 'ભજનો',
      'no_books_available': 'કોઈ પુસ્તકો ઉપલબ્ધ નથી',
      'no_audio_available': 'કોઈ ઓડિયો ઉપલબ્ધ નથી',
      'no_videos_available': 'કોઈ વીડિયો ઉપલબ્ધ નથી',
      'no_pictures_available': 'કોઈ ચિત્રો ઉપલબ્ધ નથી',
      'no_bhajans_available': 'કોઈ ભજનો ઉપલબ્ધ નથી',
      'check_back_later': 'પછીથી તપાસો!',
      'sadhana_progress': 'સાધના પ્રગતિ',
      'no_students_in_group': 'આ જૂથમાં હજુ સુધી કોઈ વિદ્યાર્થીઓ નથી',
      'private_not_shared': 'ખાનગી / શેર કરેલ નથી',
      // Chat (Restored)
      'type_message': 'સંદેશ લખો...',
      'send': 'મોકલો',
      'no_messages': 'હજુ સુધી કોઈ સંદેશ નથી.',
      'start_conversation': 'વાતચીત શરૂ કરો',
      // Admin (Restored)
      'admin_dashboard': 'એડમિન ડેશબોર્ડ',
      'manage_users': 'વપરાશકર્તાઓ સંચાલિત કરો',
      'manage_groups': 'જૂથો સંચાલિત કરો',
      'manage_events': 'કાર્યક્રમો સંચાલિત કરો',
      'manage_news': 'સમાચાર સંચાલિત કરો',
      'manage_services': 'સેવાઓ સંચાલિત કરો',
      'manage_branches': 'શાખાઓ સંચાલિત કરો',
      'organization': 'સંસ્થા',

      // Admin Family Links
      'family_links': 'પારિવારિક લિંક્સ',
      'create_family_link': 'પારિવારિક લિંક બનાવો',
      'select_parent': 'માતા-પિતા પસંદ કરો',
      'select_child': 'બાળક પસંદ કરો',
      'select_both_users': 'કૃપા કરીને બંને વપરાશકર્તાઓને પસંદ કરો',
      'cannot_link_self': 'વપરાશકર્તાને પોતાની સાથે લિંક કરી શકાતું નથી',
      'link_created': 'પારિવારિક લિંક સફળતાપૂર્વક બનાવવામાં આવી',
      'elder_caregiver': 'વડીલ/સંભાળકર્તા',
      'edit_family_link': 'પારિવારિક લિંક સંપાદિત કરો',
      'view_activity_desc': 'માતા-પિતા બાળકની એપ્લિકેશન વપરાશ જોઈ શકે છે',
      'receive_sos_desc': 'માતા-પિતાને કટોકટી ચેતવણીઓ ફોરવર્ડ કરો',

      // Guruji Feature Extended

      'elder': 'વૃદ્ધ',
      'caregiver': 'સંભાળકર્તા',
      'seva_tab': 'સેવા',
      'calendar_tab': 'કેલેન્ડર',
      'yajman_label': 'યજમાન',
      'select_day_schedule': 'શેડ્યૂલ જોવા માટે એક દિવસ પસંદ કરો',
      'not_possible': 'શક્ય નથી',
      'gallery': 'ગેલેરી',
      'complete_action': 'પૂર્ણ કરો',
      'completing_service': 'સેવા પૂર્ણ થઈ રહી છે...',
      'service_completed_success': 'સેવા પૂર્ણ તરીકે ચિહ્નિત થઈ!',
      'mark_unavailable': 'અનુપલબ્ધ ચિહ્નિત કરો',
      'mark_unavailable_confirm': 'શું તમે ખાતરી કરો છો કે તમે હાજર રહી શકતા નથી?',
      'reason_optional': 'કારણ (વૈકલ્પિક)',
      // Auth Feature Extended
      'login_failed': 'લોગિન નિષ્ફળ',
      'reset_password_desc': 'તમારું ઇમેઇલ દાખલ કરો, અમે તમને પાસવર્ડ રીસેટ લિંક મોકલીશું.',
      'enter_email_error': 'કૃપા કરીને તમારું ઇમેઇલ દાખલ કરો',
      'enter_valid_email_error': 'કૃપા કરીને માન્ય ઇમેઇલ દાખલ કરો',
      'reset_link_sent': 'પાસવર્ડ રીસેટ લિંક મોકલવામાં આવી! તમારું ઇમેઇલ તપાસો.',
      'enter_email_or_phone': 'કૃપા કરીને તમારું ઇમેઇલ અથવા ફોન દાખલ કરો',
      'enter_password_error': 'કૃપા કરીને તમારો પાસવર્ડ દાખલ કરો',
      'signup_failed': 'સાઇનઅપ નિષ્ફળ',
      'terms_error_msg': 'કૃપા કરીને નિયમો અને શરતો સાથે સંમત થાઓ',
      'otp_title': 'OTP ચકાસો',
      'otp_desc': 'તમારા ફોન/ઇમેઇલ પર મોકલેલ 6-અંકનો કોડ દાખલ કરો',
      'resend_otp_timer': '{seconds} સેકન્ડમાં OTP ફરી મોકલો',
      'didnt_receive_code': 'કોડ નથી મળ્યો?',
      'resend_otp_action': 'OTP ફરી મોકલો',
      'verify_continue': 'ચકાસો અને આગળ વધો',
      'otp_resent_success': 'OTP સફળતાપૂર્વક ફરી મોકલવામાં આવ્યો',
      'set_username_title': 'તમારું વપરાશકર્તા નામ સેટ કરો',
      'change_username_title': 'વપરાશકર્તા નામ બદલો',
      'username_desc': 'એક અનન્ય વપરાશકર્તા નામ પસંદ કરો જેનો ઉપયોગ અન્ય લોકો તમને શોધવા માટે કરી શકે.',
      'username_label': 'વપરાશકર્તા નામ',
      'username_hint': 'દા.ત., john_doe',
      'username_available': '✓ વપરાશકર્તા નામ ઉપલબ્ધ છે',
      'username_taken': '✗ વપરાશકર્તા નામ પહેલેથી જ લેવામાં આવ્યું છે',
      'check_availability_error': 'ઉપલબ્ધતા તપાસવામાં ભૂલ',
      'username_required': 'વપરાશકર્તા નામ જરૂરી છે',
      'username_too_short': 'વપરાશકર્તા નામ ઓછામાં ઓછા 3 અક્ષરો હોવા જોઈએ',
      'username_too_long': 'વપરાશકર્તા નામ 20 અક્ષરો કરતા ઓછું હોવું જોઈએ',
      'username_no_spaces': 'વપરાશકર્તા નામાં જગ્યા મંજૂર નથી',
      'username_set_success': 'વપરાશકર્તા નામ સફળતાપૂર્વક સેટ થયું!',
      'username_set_error': 'વપરાશકર્તા નામ સેટ કરવામાં ભૂલ',
      'username_change_limit_msg': 'વપરાશકર્તા નામ મહિનામાં ફક્ત એકવાર બદલી શકાય છે',
      'can_change_in_days': '{days} દિવસમાં બદલી શકો છો',
      'can_change_now': 'હવે બદલી શકો છો',
      'not_set_yet': 'હજી સુધી સેટ નથી',
      'set_username_btn': 'વપરાશકર્તા નામ સેટ કરો',
      'update_btn': 'અપડેટ કરો',
      // Errors and Messages
      'something_went_wrong': 'કંઈક ખોટું થયું',
      'please_try_again': 'કૃપા કરીને ફરી પ્રયાસ કરો',
      'no_internet': 'ઇન્ટરનેટ કનેક્શન નથી',
      'session_expired': 'સત્ર સમાપ્ત થયું. કૃપા કરીને ફરી લૉગિન કરો.',
      'invalid_email': 'કૃપા કરીને માન્ય ઈમેઇલ દાખલ કરો',
      'password_too_short': 'પાસવર્ડ ઓછામાં ઓછો 6 અક્ષરોનો હોવો જોઈએ',
      'passwords_dont_match': 'પાસવર્ડ મેળ ખાતા નથી',
      'field_required': 'આ ફીલ્ડ જરૂરી છે',
      'saved_successfully': 'સફળતાપૂર્વક સાચવ્યું',
      'view_practice': 'પ્રગતિ જુઓ',
      'child_dashboard': 'બાળ ડેશબોર્ડ',
      'view_alerts': 'ચેતવણીઓ જુઓ',
      'emergency_alerts': 'આપાતકાલીન ચેતવણીઓ',
      'no_emergency_alerts': 'કોઈ આપાતકાલીન ચેતવણી નથી',
      'emergency_sos_alert': 'આપાતકાલીન SOS ચેતવણી',
      'resolved_on': 'ઉકેલ્યું',
      'no_resolved_requests': 'કોઈ ઉકેલાયેલ વિનંતીઓ નથી',
      'updated_successfully': 'સફળતાપૂર્વક અપડેટ કર્યું',
      'are_you_sure': 'શું તમને ખાતરી છે?',
      'this_action_cannot_be_undone': 'આ ક્રિયા પૂર્વવત કરી શકાતી નથી.',
      // Welcome/Onboarding
      'welcome': 'સ્વાગત છે',
      'get_started': 'શરૂ કરો',
      'skip': 'છોડો',
      'continue_text': 'ચાલુ રાખો',
      'onboarding_title_1': 'સમુદાય સાથે જોડાઓ',
      'onboarding_desc_1': 'તમારા સ્થાનિક ગાયત્રી પરિવાર ભિવંડી સાથે જોડાઓ અને સમાન વિચારધારા ધરાવતા આધ્યાત્મિક સાધકોને મળો',
      'onboarding_title_2': 'શીખો અને વિકસો',
      'onboarding_desc_2': 'તમારી આધ્યાત્મિક યાત્રાને સમૃદ્ધ બનાવવા માટે આધ્યાત્મિક અભ્યાસક્રમો, મંત્રો અને શિક્ષણ મેળવો',
      'onboarding_title_3': 'સેવા દ્વારા યોગદાન આપો',
      'onboarding_desc_3': 'વિવિધ સેવા તકો દ્વારા સમાજમાં યોગદાન આપો અને ફરક લાવો',
      // Tutorials
      'tutorial_request_service_title': 'સેવા વિનંતી',
      'tutorial_request_service_desc': 'યજ્ઞ, સંસ્કાર વગેરે જેવા સમારંભો માટે વિનંતી કરો.',
      'tutorial_seva_title': 'સેવાની તકો',
      'tutorial_seva_desc': 'નિસ્વાર્થ સેવા પ્રવૃત્તિઓ માટે સ્વયંસેવક.',
      'tutorial_groups_title': 'BSS જૂથો',
      'tutorial_groups_desc': 'જૂથોમાં જોડાઓ, સભ્યો સાથે ચેટ કરો અને ચર્ચાઓમાં ભાગ લો.',
      'tutorial_events_title': 'કાર્યક્રમો',
      'tutorial_events_desc': 'આગામી કાર્યક્રમો અને યોજનાઓ સાથે અપડેટ રહો.',
      'tutorial_media_title': 'મીડિયા લાઇબ્રેરી',
      'tutorial_media_desc': 'આધ્યાત્મિક સંસાધનો, PDF અને વિડિઓ જુઓ.',
      'tutorial_celebrations_title': 'રોજિંદી ઉજવણી',
      'tutorial_celebrations_desc': 'આજે કોનો જન્મદિવસ કે વર્ષગાંઠ છે તે જુઓ.',
      'tutorial_profile_title': 'તમારી પ્રોફાઇલ',
      'tutorial_profile_desc': 'તમારી પ્રોફાઇલ જોવા અને સંપાદિત કરવા માટે અહીં ટેપ કરો.',
      'tutorial_daily_inspiration_title': 'દૈનિક પ્રેરણા',
      'tutorial_daily_inspiration_desc': 'તમારા દિવસની શરૂઆત આધ્યાત્મિક વિચારો અને સુવિચારો સાથે કરો.',
      'tutorial_calendar_desc': 'આગામી તહેવારો, કાર્યક્રમો અને મહત્વપૂર્ણ તારીખો જુઓ.',
      'tutorial_news_desc': 'નવીનતમ સમાચાર અને ઘોષણાઓથી અપડેટ રહો.',
      'tutorial_spiritual_desc': 'આધ્યાત્મિક સંસાધનો, ક્વોટ્સ અને ટીપ્સ જુઓ.',
      'tutorial_bottom_nav_title': 'નેવિગેશન',
      'tutorial_bottom_nav_desc': 'હોમ, જૂથો, કાર્યક્રમો, આધ્યાત્મિક અને પ્રોફાઇલ વચ્ચે સ્વિચ કરવા માટે આ ટેબ્સનો ઉપયોગ કરો.',
      'tutorial_guruji_today_title': 'આજનું શેડ્યૂલ',
      'tutorial_guruji_today_desc': 'આજ માટે તમારી સોંપેલી સેવાઓ જુઓ.',
      'tutorial_guruji_new_req_title': 'નવી વિનંતીઓ',
      'tutorial_guruji_new_req_desc': 'નવી સેવા વિનંતીઓ બ્રાઉઝ કરો અને સ્વયંસેવા કરો.',
      'tutorial_guruji_assigned_title': 'મારી સેવાઓ',
      'tutorial_guruji_assigned_desc': 'તમે જે સેવાઓ માટે સ્વયંસેવા કરી છે તેનું સંચાલન કરો.',
      'tutorial_guruji_seva_title': 'સેવાની તકો',
      'tutorial_guruji_seva_desc': 'સામાન્ય સેવા પ્રવૃત્તિઓ જુઓ અને સંચાલિત કરો.',
      'tutorial_guruji_calendar_title': 'કૅલેન્ડર',
      'tutorial_guruji_calendar_desc': 'આગામી સેવા શેડ્યૂલ જુઓ.',
      'tutorial_emergency_sos_title': 'કટોકટીની મદદ',
      'tutorial_emergency_sos_desc': 'જ્યારે જરૂર હોય ત્યારે SOS સુવિધાથી મદદ મેળવો',
      'tutorial_mandir_schedule_title': 'મંદિર સમયપત્રક',
      'tutorial_mandir_schedule_desc': 'તમારા સ્થાનિક મંદિરમાં દૈનિક આરતી અને હવન સમય જુઓ',
      'tutorial_upcoming_events_title': 'આગામી કાર્યક્રમો',
      'tutorial_upcoming_events_desc': 'આગામી સત્સંગ, યજ્ઞ અને સામુદાયિક કાર્યક્રમોથી અપડેટ રહો',
      'tutorial_latest_news_title': 'તાજા સમાચાર',
      'tutorial_latest_news_desc': 'ગાયત્રી પરિવારના નવીનતમ સમાચાર અને અપડેટ્સ વાંચો',
      // Important Info
      'important_contacts': 'મહત્વપૂર્ણ સંપર્કો',
      'important_contacts_subtitle': 'આપાતકાલીન અને મહત્વપૂર્ણ સંપર્કો જુઓ',
      'important_locations': 'મહત્વપૂર્ણ સ્થળો',
      'important_locations_subtitle': 'મહત્વપૂર્ણ સ્થળો અને દિશાઓ જુઓ',
      'important_badge': 'મહત્વપૂર્ણ',
      'no_schedules_available': 'કોઈ શેડ્યૂલ ઉપલબ્ધ નથી',
      'check_back_later_timings': 'મંદિરના સમય માટે પછી તપાસો',
      'gayatri_mandir_title': 'ગાયત્રી મંદિર',
      'daily_schedule': 'દૈનિક શેડ્યૂલ',
      'daily': 'દૈનિક',
      'items': 'આઇટમ',
      'start_time': 'શરૂઆતનો સમય',
      'end_time': 'સમાપ્તિ સમય',
      'repeats_daily': 'દરરોજ પુનરાવર્તન થાય છે',
      'havan': 'હવન',
      // Public Groups
      'browse_groups': 'સાર્વજનિક જૂથો જુઓ',
      'no_public_groups': 'કોઈ સાર્વજનિક જૂથ ઉપલબ્ધ નથી',
      'no_results': 'કોઈ પરિણામ મળ્યા નથી',
      'public_group': 'સાર્વજનિક જૂથ',
      'request_to_join': 'જોડાવાની વિનંતી',
      'join_request_sent': 'જોડાવાની વિનંતી મોકલવામાં આવી',
      // Spiritual Feature
      'sadhana_tracker': 'સાધના ટ્રેકર',
      'mantra': 'મંત્ર',
      'daily_target': 'દૈનિક લક્ષ્ય',
      'malas': 'માળાઓ',
      'completion': 'પૂર્ણતા',
      'quotes': 'આધ્યાત્મિક સુવિચાર',

      // Interests
      'interest_music': 'સંગીત',
      'interest_teaching': 'શિક્ષણ',
      'interest_social_service': 'સમાજ સેવા',
      'interest_meditation': 'ધ્યાન',
      'interest_youth_activities': 'યુવા પ્રવૃત્તિઓ',
      'interest_event_organization': 'કાર્યક્રમ આયોજન',
      'interest_content_creation': 'કન્ટેન્ટ ક્રિએશન',
      'interest_technical_support': 'ટેકનિકલ સપોર્ટ',
      'select_gender': 'લિંગ પસંદ કરો',
      'enter_full_name': 'કૃપા કરીને તમારું નામ દાખલ કરો',
      'enter_valid_phone': 'કૃપા કરીને માન્ય 10-અંકનો ફોન નંબર દાખલ કરો',
      'enter_phone': 'કૃપા કરીને તમારો ફોન નંબર દાખલ કરો',
      'select_dob': 'કૃપા કરીને તમારી જન્મ તારીખ પસંદ કરો',
      'select_gender_error': 'કૃપા કરીને તમારું લિંગ પસંદ કરો',
      'achievements': 'સિદ્ધિઓ',
      'lifetime_progress': 'જીવનભરની પ્રગતિ',
      'calendar_heatmap': 'છેલ્લા 30 દિવસ',
      'personal_records': 'વ્યક્તિગત રેકોર્ડ',
      'best_day': 'શ્રેષ્ઠ દિવસ',
      'best_streak': 'શ્રેષ્ઠ સાતત્ય',
      'locked': 'લૉક છે',
      'unlocked': 'અનલૉક',
      'reminder_settings': 'રિમાઇન્ડર સેટિંગ્સ',
      'daily_reminder': 'દૈનિક રિમાઇન્ડર',
      'set_reminder_time': 'રિમાઇન્ડર સમય સેટ કરો',
      'reset_count': 'ગણતરી રીસેટ કરો',
      'reset_count_confirm': 'શું તમે આજની ગણતરી રીસેટ કરવા માંગો છો?',
      'total_malas': 'કુલ માળાઓ',
      'active_days': 'સક્રિય દિવસો',
      'this_week': 'આ અઠવાડિયે',
      'this_month': 'આ મહિને',
      'mantra_distribution': 'મંત્ર વિતરણ',
      'start_sadhana_analytics': 'એનાલિટિક્સ જોવા માટે સાધના શરૂ કરો!',
      'please_login_analytics': 'એનાલિટિક્સ જોવા માટે કૃપા કરીને લોગિન કરો',
      'select_mantra': 'મંત્ર પસંદ કરો',
      'tap_count': 'ગણવા માટે ટેપ કરો અથવા દબાવી રાખો',
      'counting': 'ગણી રહ્યા છે...',
      'target': 'લક્ષ્ય',
      'total_count': 'કુલ જાપ',
      'daily_progress': 'દૈનિક પ્રગતિ',
      'target_met': 'લક્ષ્ય પ્રાપ્ત થયું!',
      'add_full_mala': 'આખી માળા ઉમેરો (+108)',
      'complete_mala_btn': 'માળા પૂર્ણ કરો',
      'complete_mala_title': 'માળા પૂર્ણ કરવી?',
      'confirm_complete_mala': 'તમે આ માળા પૂર્ણ કરવા જઈ રહ્યા છો.',
      'mala_completed_title': 'માળા પૂર્ણ થઈ!',
      'unlocked_prefix': 'અનલૉક:',
      // Achievements Data
      'achv_first_mala_title': 'ઓમ શાંતિ',
      'achv_first_mala_desc': '108 મંત્રોની તમારી પ્રથમ માળા પૂર્ણ કરો.',
      'achv_streak_7_title': 'સાધક',
      'achv_streak_7_desc': 'સતત 7 દિવસ સાધના જાળવી રાખો.',
      'achv_streak_30_title': 'યોગી',
      'achv_streak_30_desc': 'સતત 30 દિવસ સાધના જાળવી રાખો.',
      'achv_malas_108_title': 'ભક્ત',
      'achv_malas_108_desc': 'કુલ 108 માળાઓ પૂર્ણ કરો.',
      'achv_malas_1008_title': 'મંત્ર નિષ્ણાત',
      'achv_malas_1008_desc': 'કુલ 1008 માળાઓ પૂર્ણ કરો. એક સાચી સિદ્ધિ.',
      'day_x_of_y': 'દિવસ {day} / {total}',
      'manage_roles': 'ભૂમિકાઓ મેનેજ કરો',
      'default_roles': 'ડિફોલ્ટ ભૂમિકાઓ',
      'custom_roles': 'સમૂહ ભૂમિકાઓ',
      'add_role': 'નવી ભૂમિકા ઉમેરો',
      'role_name': 'ભૂમિકાનું નામ',
      'enter_role_name': 'ભૂમિકાનું નામ લખો (દા.ત. ક્લાસ મોનિટર)',
      'role_added': 'ભૂમિકા સફળતાપૂર્વક ઉમેરવામાં આવી',
      'role_updated': 'ભૂમિકા સફળતાપૂર્વક અપડેટ કરવામાં આવી',
      'role_deleted': 'ભૂમિકા સફળતાપૂર્વક દૂર કરવામાં આવી',
      'cannot_edit_global_role': 'ડિફોલ્ટ ભૂમિકાઓમાં ફેરફાર કરી શકાતો નથી',
      // Groups Feature Extended
      'create_new_group': 'નવું જૂથ બનાવો',
      'group_type_label': 'જૂથ પ્રકાર',
      'event_group': 'ઇવેન્ટ',
      'bss_group_title': 'બાલ સંસ્કાર શાળા',
      'meeting_group': 'મીટિંગ',
      'custom_group': 'કસ્ટમ',
      'only_admin_create_bss': 'ફક્ત એડમિન અને ગુરુજી બીએસએસ જૂથો બનાવી શકે છે',
      'select_branch_error': 'કૃપા કરીને શાખા પસંદ કરો',
      'select_guruji_error': 'કૃપા કરીને ગુરુજી પસંદ કરો',
      'enable_attendance': 'હાજરી ટ્રેકિંગ સક્ષમ કરો',
      'allow_marking_attendance': 'આ મીટિંગ માટે હાજરી ચિહ્નિત કરવાની મંજૂરી આપો',
      'public_group_label': 'સાર્વજનિક જૂથ',
      'private_group_label': 'ખાનગી જૂથ',
      'public_group_desc': 'કોઈપણ આ જૂથ શોધી શકે છે અને જોડાવા માટે વિનંતી કરી શકે છે',
      'private_group_desc': 'ફક્ત આમંત્રિત સભ્યો જ આ જૂથ જોઈ શકે છે અને જોડાઈ શકે છે',
      'public_group_approval_note': 'સાર્વજનિક જૂથો દરેક માટે દૃશ્યમાન થતાં પહેલાં એડમિનની મંજૂરી આવશ્યક છે.',
      'group_created_approval': 'જૂથ બનાવ્યું! સાર્વજનિક થવા માટે એડમિનની મંજૂરીની રાહ જોઈ રહ્યું છે.',
      'group_created_success': 'જૂથ સફળતાપૂર્વક બનાવ્યું!',
      'edit_group_title': 'જૂથ સંપાદિત કરો',
      'delete_group_title': 'જૂથ કાઢી નાખો?',
      'delete_group_confirm': 'શું તમે ખાતરી કરો છો કે તમે "{groupName}" કાઢી નાખવા માંગો છો? આ ક્રિયાને પૂર્વવત કરી શકાતી નથી.',
      'group_name_empty_error': 'જૂથનું નામ ખાલી હોઈ શકતું નથી',
      'group_updated_success': 'જૂથ સફળતાપૂર્વક અપડેટ થયું',
      'group_deleted_success': 'જૂથ સફળતાપૂર્વક કાઢી નાખ્યું',
      'join_request_success_waiting': 'જોડાવા માટેની વિનંતી મોકલી! એડમિનની મંજૂરીની રાહ જોઈ રહ્યું છે.',
      'check_back_later_groups': 'જોડાવા માટે નવા જૂથો માટે પછીથી તપાસો',
      'try_different_search': 'વિવિધ શોધ શબ્દનો પ્રયાસ કરો',
      'no_public_groups_avail': 'કોઈ સાર્વજનિક જૂથ ઉપલબ્ધ નથી',
      'search_groups_hint': 'જૂથો શોધો...',
      // Browse Groups Extended
      'available_to_join': 'જોડાવા માટે ઉપલબ્ધ',
      'your_public_groups': 'તમારા સાર્વજનિક જૂથો',
      'no_public_groups_joined': 'કોઈ સાર્વજનિક જૂથ જોડાયું નથી',
      'groups_you_join_appear_here': 'તમે જે જૂથોમાં જોડાશો તે અહીં દેખાશે',
      'no_groups_created': 'કોઈ જૂથ બનાવ્યું નથી',
      'public_groups_you_create_appear_here': 'તમે બનાવેલા સાર્વજનિક જૂથો અહીં દેખાશે',
      'no_groups_with_status': 'આ સ્થિતિ સાથે કોઈ જૂથો નથી',
      'your_group_requests': 'તમારી જૂથ વિનંતીઓ',
      'all_groups_joined_or_none': 'બધા સાર્વજનિક જૂથો જોડાયા છે અથવા કોઈ ઉપલબ્ધ નથી',
      'explore': 'અન્વેષણ',
      'public_groups_title': 'સાર્વજનિક જૂથો',
      'daily_inspiration': 'દૈનિક પ્રેરણા',
      'spiritual_practice': 'આધ્યાત્મિક સાધના',
      'sadhana': 'સાધના',
      'swadhyay': 'સ્વાધ્યાય',
      'mantra_japa': 'મંત્ર જાપ',
      'digital_library': 'ડિજિટલ લાઈબ્રેરી',
      'daily_thoughts': 'દૈનિક વિચારો',
      // Important Info
      'search_locations_hint': 'સ્થળો શોધો...',
      'search_contacts_hint': 'સંપર્કો શોધો...',
      'open_google_maps': 'ગૂગલ મેપ્સમાં જુઓ',
      'all_tags': 'બધા ટૅગ્સ',
      'all_roles': 'બધી ભૂમિકાઓ',
      'no_locations_found': 'કોઈ સ્થળો મળ્યા નથી',
      'no_contacts_found': 'કોઈ સંપર્કો મળ્યા નથી',
      'call_action': 'કૉલ કરો',
      'save_contact_share': 'સંપર્ક સાચવો: ',
      // Sadhana Settings
      'select_daily_target': 'દૈનિક લક્ષ્ય પસંદ કરો',
      'mala_quarter': '¼ માળા',
      'mala_half': '½ માળા',
      'mala_1': '૧ માળા',
      'malas_format': '{count} માળાઓ',
      'desc_beginners': 'શરૂઆત કરનાર / વ્યસ્ત દિવસો',
      'desc_morning_evening': 'સવાર/સાંજ',
      'desc_standard': 'પ્રમાણભૂત દૈનિક',
      'desc_regular': 'નિયમિત સાધક',
      'desc_intermediate': 'મધ્યવર્તી',
      'desc_advanced': 'અદ્યતન',
      'desc_intensive': 'સઘન',
      'desc_anushthana': 'અનુષ્ઠાન સ્તર',
      'desc_deep_practice': 'ઊંડા અભ્યાસ',
      'desc_traditional': 'પરંપરાગત ધ્યેય',
      // Quotes
      'quote_1': 'આપણે જે વિચારીએ છીએ તે બનીએ છીએ.',
      'quote_2': 'મન જ બધું છે. તમે જે વિચારો છો તે તમે બનો છો.',
      'quote_3': 'તમારા વિચારો બદલો અને તમે તમારી દુનિયા બદલી નાખશો.',
      'quote_4': 'ભૂતકાળમાં રહેશો નહીં, ભવિષ્યના સપના જોશો નહીં, વર્તમાન ક્ષણ પર મન કેન્દ્રિત કરો.',
      'quote_5': 'શાંતિ અંદરથી આવે છે. તેને બહાર શોધશો નહીં.',
      'quote_6': 'આત્મા તેના વિચારોના રંગમાં રંગાયેલી છે.',
      'quote_7': 'તમે તમારા ભાગ્યના માલિક છો.',
      'quote_8': 'તમે દુનિયામાં જે બદલાવ જોવા માંગો છો તે બનો.',
      'quote_9': 'સુખ તમે શું આપી શકો છો તેના પર નિર્ભર છે, તમે શું મેળવી શકો છો તેના પર નહીં.',
      'quote_10': 'પ્રેમ જ એકમાત્ર વાસ્તવિકતા છે.',
      // Admin Emergency Requests (Gujarati)
      'no_active_emergency_requests': 'કોઈ સક્રિય કટોકટી વિનંતીઓ નથી',
      'urgent': 'તાકીદનું',
      'request_acknowledged': 'વિનંતી સ્વીકૃત થઈ',
      'request_resolved': 'વિનંતી ઉકેલાઈ',
      'no_phone_available': 'ફોન નંબર ઉપલબ્ધ નથી',
      'could_not_launch_dialer': 'ડાયલર ખોલી શકાયું નથી',
      'no_phone_linked': 'ખાતા સાથે કોઈ ફોન નંબર જોડાયેલ નથી',
      'loading_contact_info': 'સંપર્ક માહિતી લોડ થઈ રહી છે...',
      'acknowledge': 'સ્વીકારો',
      'resolve': 'ઉકેલો',
      'call': 'કૉલ કરો',
      // Admin Emergency Contacts (Gujarati)
      'no_sos_contacts_yet': 'હજુ સુધી કોઈ SOS સંપર્કો નથી',
      'tap_to_add_one': 'ઉમેરવા માટે + ટેપ કરો',
      'delete_contact': 'સંપર્ક કાઢી નાખો',
      'delete_contact_confirm': 'શું તમે આ સંપર્કને કાઢી નાખવા માંગો છો?',
      'add_contact': 'સંપર્ક ઉમેરો',
      'edit_contact': 'સંપર્ક સંપાદિત કરો',
      'sort_order': 'ક્રમ નંબર',
      'tags': 'ટેગ્સ',
      'select_role': 'ભૂમિકા પસંદ કરો',
      'no_roles_available': 'કોઈ ભૂમિકા ઉપલબ્ધ નથી. સેટિંગ્સ ટેબમાં ઉમેરો.',
      'no_tags_available': 'કોઈ ટેગ ઉપલબ્ધ નથી. સેટિંગ્સ ટેબમાં ઉમેરો.',
      // Family Linking (Gujarati)
      'family_link_requests_empty': 'પરિવાર લિંક વિનંતીઓ અહીં દેખાશે',
      'family_connection_removed': 'પરિવાર કનેક્શન દૂર થયું',
      'search_by_email_or_username': 'ઈમેઇલ અથવા @યૂઝરનેમથી શોધો',
      'searching_for_user': 'શોધી રહ્યા છીએ...',
      'already_linked': 'તમે આ વપરાશકર્તા સાથે પહેલેથી જોડાયેલા છો',
      'pending_request_exists': 'બાકી વિનંતી પહેલેથી અસ્તિત્વમાં છે',
      'cannot_link_to_self': 'તમે તમારી જાત સાથે લિંક કરી શકતા નથી',
      'request_sent_success': 'વિનંતી સફળતાપૂર્વક મોકલાઈ!',
      'accept_request': 'સ્વીકારો',
      'decline_request': 'નકારો',
      'sent_requests': 'મોકલેલ વિનંતીઓ',
      'received_requests': 'પ્રાપ્ત વિનંતીઓ',
      'unlink_family': 'અનલિંક કરો',
      'unlink_confirm_title': 'પરિવાર સભ્યને અનલિંક કરો',
      'unlink_confirm_body': 'શું તમે આ પરિવાર સભ્યને અનલિંક કરવા માંગો છો?',
      'relation_type_parent': 'માતા-પિતા',
      'relation_type_child': 'બાળક',
      'relation_type_spouse': 'જીવનસાથી',
      'relation_type_sibling': 'ભાઈ-બહેન',
      'relation_type_other': 'અન્ય',
      // Anushthan & Gamification
      'start_anushthan': 'અનુષ્ઠાન પ્રારંભ કરો',
      'active_anushthan': 'સક્રિય અનુષ્ઠાન',
      'active_anushthan_warning': 'તમારું એક અનુષ્ઠાન પહેલેથી સક્રિય છે. કૃપા કરીને પહેલા તેને પૂર્ણ કરો અથવા થોભાવો.',
      'anushthan_history': 'અનુષ્ઠાન ઇતિહાસ',
      'duration_days': '{days} દિવસ',
      'start_date': 'પ્રારંભ તારીખ',
      'end_date': 'સમાપ્તિ તારીખ',
      'expected_end_date': 'અપેક્ષિત સમાપ્તિ',
      'malas_completed': 'માળા પૂર્ણ',
      'daily_target_malas': 'દૈનિક લક્ષ્ય (માળા)',
      'no_completed_anushthans': 'હજુ સુધી કોઈ અનુષ્ઠાન પૂર્ણ થયું નથી',
      'start_first_anushthan': 'તમારી આધ્યાત્મિક યાત્રા શરૂ કરવા માટે પ્રથમ અનુષ્ઠાન શરૂ કરો!',
      'total_days': 'કુલ દિવસ',
      'days_left': '{count} દિવસ બાકી',
      'log_todays_practice': 'આજની સાધના નોંધો',
      'view_certificate': 'પ્રમાણપત્ર જુઓ',
      'sadhana_record': 'સાધના રેકોર્ડ',
      'anushthan_completion': 'અનુષ્ઠાન પૂર્ણતા',
      'open': 'ખોલો',
      'share_blessings': 'આશીર્વાદ શેર કરો',
      'certificate_saved_to': 'પ્રમાણપત્ર {path} પર સાચવવામાં આવ્યું',
      'error_sharing_pdf': 'PDF શેર કરવામાં ભૂલ',
      'error_saving_pdf': 'PDF સાચવવામાં ભૂલ',
      'my_spiritual_journey': 'મારી આધ્યાત્મિક યાત્રા',
      'milestones': 'માઈલસ્ટોન્સ',
      'pause_anushthan': 'અનુષ્ઠાન થોભાવો',
      'resume_anushthan': 'અનુષ્ઠાન ફરી શરૂ કરો',
      'guruji_visibility': 'ગુરુજી દૃશ્યતા',
      'committed_practice_desc': 'પ્રતિબદ્ધ આધ્યાત્મિક અભ્યાસ',
      'choose_mantra_hint': 'મંત્ર પસંદ કરો',
      'days_suffix': 'દિવસ',
      'mantras_per_day': '{count} મંત્રો પ્રતિ દિવસ',
      'begin_anushthan': 'અનુષ્ઠાન પ્રારંભ કરો',
      'anushthan_started_success': '🙏 અનુષ્ઠાન શરૂ થયું! તમારી સાધના સફળ થાય.',
      'malas_daily_format': '{count} માળા / દિવસ',
      'duration_short': 'લઘુ',
      'duration_medium': 'મધ્યમ',
      'duration_long': 'દીર્ઘ',
      'duration_extended': 'વિસ્તૃત',
      
      // Anushthan Status & UI
      'active_status': 'સક્રિય',
      'resting_status': 'વિશ્રામ',
      'completed_status': 'પૂર્ણ',
      'paused_status': 'થંભી ગયેલ',
      'day_label': 'દિવસ',
      'malas_label': 'માળા',
      'remaining_label': 'બાકી',
      'todays_practice_pending': 'આજની સાધના બાકી',
      'todays_practice_complete': 'આજની સાધના પૂર્ણ ✓',
      'anushthan_in_progress': 'અનુષ્ઠાન ચાલુ છે',
      'start_anushthan_subtitle': '7, 11, 21 અથવા 40 દિવસની સાધનાનો સંકલ્પ લો',
      'total_malas_today': 'કુલ: આજે {count} માળા',
      'x_of_y_malas': '{x} / {y} માળા',
      
      'certificate_blessing': '🙏 તમારી ભક્તિ તમને શાંતિ અને આશીર્વાદ આપે 🙏',

      // Group Homework
      'view_submissions': 'સબમિશન જુઓ',
      'assign_homework': 'ગૃહકાર્ય સોંપો',
      'edit_homework': 'ગૃહકાર્ય સંપાદિત કરો',
      'update_homework': 'ગૃહકાર્ય અપડેટ કરો',
      'delete_homework_title': 'ગૃહકાર્ય કાઢી નાખો',
      'delete_homework_confirm': 'શું તમે ખરેખર આ ગૃહકાર્ય કાઢી નાખવા માંગો છો? આ પૂર્વવત્ કરી શકાતું નથી.',
      'due_date_label': 'નિયત તારીખ',
      'assigned_by_label': '{name} દ્વારા',
      'overdue': 'મુદત વીતી ગઈ',
      'no_homework_assigned': 'હજુ સુધી કોઈ ગૃહકાર્ય સોંપાયેલ નથી',
      'homework_title': 'ગૃહકાર્ય શીર્ષક',
      'description_required': 'વર્ણન જરૂરી છે',
      'attachments_optional': 'જોડાણો (વૈકલ્પિક)',
      'no_attachments': 'કોઈ જોડાણો નથી',
      'attachment_count': '{count} ફાઇલ(ઓ)',
      'submissions_title': 'સબમિશન',
      'no_submissions_yet': 'હજુ સુધી કોઈ સબમિશન નથી',
      'your_submitted_pdf': 'તમારું સબમિટ કરેલું PDF',
      'view_submission_pdf': 'સબમિશન PDF જુઓ',
      'update_status_review': 'સ્થિતિ / સમીક્ષા અપડેટ કરો',
      'redo_needed': 'ફરીથી કરવાની જરૂર છે',
      'mark_checked': 'તપાસેલ ચિહ્નિત કરો',
      'request_redo': 'ફરીથી વિનંતી કરો',
      'comment_optional': 'ટિપ્પણી (વૈકલ્પિક)',
      'add_feedback_hint': 'વિદ્યાર્થી માટે પ્રતિસાદ ઉમેરો...',
      'submissions_closed_msg': 'આ ગૃહકાર્ય માટે સબમિશન બંધ છે.',
      'homework_assigned_success': 'ગૃહકાર્ય સફળતાપૂર્વક સોંપાયું!',
      'homework_updated_success': 'ગૃહકાર્ય સફળતાપૂર્વક અપડેટ થયું!',
      'homework_submitted_success': 'ગૃહકાર્ય સફળતાપૂર્વક સબમિટ થયું!',
      'stop_receiving_submissions': 'સબમિશન સ્વીકારવાનું બંધ કરો',
      'stop_submissions_subtitle': 'ભવિષ્યમાં મુદત હોય તો પણ મેન્યુઅલી સબમિશન બંધ કરો',
      'upload_submission': 'સબમિશન અપલોડ કરો',
      'submit_homework': 'ગૃહકાર્ય સબમિટ કરો',
      'resubmit_homework': 'ગૃહકાર્ય ફરીથી સબમિટ કરો',
      'upload_pdf_helper': 'તમારા કામની એક PDF ફાઇલ અપલોડ કરો',
      'select_pdf_file': 'PDF ફાઇલ પસંદ કરો',
      'submission_status_submitted': 'સબમિટ કર્યું',
      'submission_status_redo': 'ફરીથી કરો',
      'submission_status_checked': 'તપાસેલ',
      'submission_status_not_done': 'થયું નથી',
      'attachment_label': 'જોડાણ',
      'saving': 'સાચવી રહ્યું છે...',
      'marker_first_steps_title': 'પ્રથમ પગલાં',
      'marker_first_steps_desc': 'તમારી પ્રથમ માળા પૂર્ણ કરો (108 મંત્રો)',
      'marker_consistent_yogi_title': 'સાતત્યપૂર્ણ યોગી',
      'marker_consistent_yogi_desc': 'સતત 3 દિવસ અભ્યાસ કરો',
      'marker_dedicated_disciple_title': 'સમર્પિત શિષ્ય',
      'marker_dedicated_disciple_desc': '7 દિવસનો ક્રમ જાળવી રાખો',
      'marker_century_club_title': 'શતક ક્લબ',
      'marker_century_club_desc': 'કુલ 100 માળા પૂર્ણ કરો',
      'marker_mantra_master_title': 'મંત્ર માસ્ટર',
      'marker_mantra_master_desc': 'કુલ 1,000 મંત્રોનો જાપ કરો',
      'marker_anushthan_adept_title': 'અનુષ્ઠાન નિપુણ',
      'marker_anushthan_adept_desc': 'તમારું પ્રથમ અનુષ્ઠાન પૂર્ણ કરો',
      'marker_early_riser_title': 'પ્રાતઃકાળ સાધક',
      'marker_early_riser_desc': 'સવારે 6 વાગ્યા પહેલાં એક માળા પૂર્ણ કરો',
      'marker_digital_monk_title': 'ડિજિટલ સાધક',
      'marker_digital_monk_desc': '30 દિવસ સુધી સાધના ટ્રેકરનો ઉપયોગ કરો',
      'marker_first_seva_title': 'પ્રથમ સેવા',
      'marker_first_seva_desc': 'તમારી પ્રથમ સેવા પ્રવૃત્તિ પૂર્ણ કરો',
      'tap_members_view_details': 'વિગતો જોવા માટે સભ્યો પર ટૅપ કરો',
      'no_groups_joined_guidance': 'તમે હજુ સુધી કોઈ જૂથમાં જોડાયા નથી',
      'join_group_guidance': 'માર્ગદર્શન જોવા માટે જૂથમાં જોડાઓ',
      'batch': 'બેચ',
      'request_sent_label': 'વિનંતી મોકલી',
      'request_received_label': 'વિનંતી મળી',
      'cancel_request': 'વિનંતી રદ કરો',
      'already_connected_msg': 'તમે આ વપરાશકર્તા સાથે પહેલેથી જ જોડાયેલા છો.',
      'request_pending_msg': 'તમારા અને આ વપરાશકર્તા વચ્ચે પહેલેથી એક વિનંતી બાકી છે.',
      'request_cancelled': 'વિનંતી રદ કરવામાં આવી',
      'no_attendance_records': 'હજુ સુધી કોઈ હાજરી રેકોર્ડ નથી',
      'app_preferences': 'એપ પસંદગીઓ',
      'reset_tutorial': 'ટ્યુટોરિયલ રીસેટ કરો',
      'reset_tutorial_subtitle': 'એપ ટૂર ફરીથી જુઓ',
      'linked_storage_folder': 'લિંક્ડ સ્ટોરેજ ફોલ્ડર',
      'no_folder_linked': 'કોઈ ફોલ્ડર લિંક કરેલ નથી',
      'change': 'બદલો',
      'filter_options': 'ફિલ્ટર વિકલ્પો',
      'no_date_set': 'કોઈ તારીખ સેટ નથી',
      'search_by_name': 'નામ દ્વારા શોધો...',
      'no_users_found': 'કોઈ વપરાશકર્તા મળ્યા નથી',
      'mandir_services': 'મંદિર સેવાઓ',
      'seva_volunteer': 'સેવા (સ્વયંસેવક)',
      'offline_backup_message': '📱 તમારી ગણતરી આ ડિવાઇસ પર સુરક્ષિત રીતે સાચવાઇ ગઈ છે.\nજ્યારે તમે ઑનલાઇન હો ત્યારે આપોઆપ બૅકઅપ થઈ જશે.',
      'history': 'ઇતિહાસ',
      'sadhana_history': 'સાધના ઇતિહાસ',
      'no_records_yet': 'અજુ સુધી કોઈ રેકોર્ડ નથી',
      'day_streak': 'દિવસની સતત સાધના!',
      'keep_flame_alive': 'જ્યોત જળતી રાખો!',
      'complete_mala_start': 'શરૂ કરવા માટે એક માલા પૂરી કરો',
      'please_login': 'કૃપા કરીને લૉગિન કરો',
      'no_emergency_contacts': 'કોઈ અધિકૃત એમર્જન્સી સંપર્કો સૂચીબદ્ધ નથી.',
      'select_folder': 'ફોલ્ડર પસંદ કરો',
      'clear_selection': 'પસંદગી દૂર કરો',
      'select_current': 'વર્તમાન પસંદ કરો',
      'filter_by_user': 'વપરાશકર્તા દ્વારા ફિલ્ટર કરો',
      'filtered_check': 'ફિલ્ટર કરેલ ✓',
      'user_filtered': 'વપરાશકર્તા ફિલ્ટર કરેલ',
      'clear_filter': 'ફિલ્ટર સાફ કરો',
      'x_requests': '{count} વિનંતીઓ',
      'activity_request_created': 'વિનંતી બનાવી',
      'activity_item_selected': 'વસ્તુ પસંદ કરી',
      'activity_item_deselected': 'વસ્તુ નાપસંદ કરી',
      'activity_special_item_added': 'વિશેષ વસ્તુ ઉમેરી',
      'activity_special_item_removed': 'વિશેષ વસ્તુ દૂર કરી',
      'activity_request_revised': 'વિનંતી સુધારી',
      'activity_item_approved': 'વસ્તુ મંજૂર',
      'activity_item_rejected': 'વસ્તુ નકારી',
      'activity_approved_all': 'બધી સામગ્રી મંજૂર',
      'activity_revision_requested': 'સુધારાની વિનંતી કરી',
      'activity_guruji_volunteered': 'ગુરુજીએ સ્વયંસેવા આપી',
      'activity_guruji_note': 'ગુરુજીની નોંધ',
      'activity_guruji_assigned': 'ગુરુજી સોંપાયેલ',
      'activity_admin_notes': 'એડમિન નોંધો',
      'activity_admin_note': 'એડમિન નોંધ',
      'activity_status_changed': 'સ્થિતિ બદલાઈ',
      'activity_guruji_approved_item_detail': 'ગુરુજીએ {item} મંજૂર કર્યું',
      'activity_guruji_rejected_item_detail': 'ગુરુજીએ {item} નકાર્યું — કારણ: {reason}',
      'activity_approved_all_detail': 'ગુરુજીએ તમામ સામગ્રી મંજૂર કરી — સંપાદન લોક છે',
      'activity_revision_requested_detail': 'ગુરુજીએ સુધારાની વિનંતી કરી: {reason}',
      'activity_user_revised_detail': 'વપરાશકર્તાએ વિનંતી સુધારી.',
      'activity_user_selected_item_detail': 'વપરાશકર્તાએ પસંદ કર્યું: {item} ✓',
      'activity_user_deselected_item_detail': 'વપરાશકર્તાએ પસંદગી રદ કરી: {item}',
      'activity_guruji_volunteered_detail': '{name} એ આ વિનંતી માટે સ્વયંસેવા આપી',
      'activity_guruji_left_note_detail': 'ગુરુજીએ એક નોંધ મૂકી',
      'activity_admin_left_note_detail': 'એડમિન દ્વારા પ્રત્યુત્તર',
      'seva_opportunities': 'સેવાની તકો',
      // Seva Assignment Workflow  
      'seva_assignments': 'તમારી સોંપવામાં આવેલી સેવાઓ',
      'no_assignments': 'હજુ સુધી કોઈ સેવા સોંપવામાં આવી નથી',
      'will_be_notified': 'જ્યારે Admin તમને સેવા વ્યવસ્થાપન માટે સોંપશે ત્યારે સૂચના મળશે',
      'pending_response': 'તમારા પ્રતિભાવની રાહ જોવાઈ રહી છે',
      'admin_notes': 'Admin ની નોંધ',
      'accept_assignment': 'સ્વીકારો',
      'reject_assignment': 'નકારો',
      'assignment_accepted': 'સ્વીકાર્યું',
      'assignment_rejected': 'નકાર્યું',
      'assignment_pending': 'બાકી',
      'confirm_accept_title': 'સ્વીકૃતિની પુષ્ટિ કરો',
      'confirm_accept_msg': 'શું તમે આ સેવા સોંપણી સ્વીકારવા માંગો છો?',
      'you_will_be_responsible': 'તમે જવાબદાર હશો',
      'managing_attendance': 'સહભાગીઓની હાજરી વ્યવસ્થાપન',
      'giving_appreciation': 'સ્વયંસેવકોને પ્રશંસા આપવી',
      'confirm_accept_btn': 'સ્વીકાર પુષ્ટિ કરો',
      'rejection_reason_title': 'નકારનું કારણ',
      'rejection_reason_min': 'કૃપા કરીને કારણ આપો (ઓછામાં ઓછા 10 અક્ષરો)',
      'submit_rejection': 'નકાર સબમિટ કરો',
      'will_notify_admin': 'આ Admin ને સૂચિત કરશે',
      'admin_message_optional': 'ગુરુજી માટે વૈકલ્પિક સંદેશ',
      'admin_message_hint': 'ઉદા., કૃપા કરીને 30 મિનિટ પહેલાં પહોંચો',
      'select_gurujis': 'ગુરુજી પસંદ કરો',
      'search_gurujis': 'ગુરુજી શોધો...',
      'assignment_status': 'સોંપણીની સ્થિતિ',
      'only_assigned_gurujis': 'ફક્ત સોંપેલા ગુરુજી જ આ સેવાનું વ્યવસ્થાપન કરી શકે છે',
      'accepted_on': 'સ્વીકાર્યું',
      'rejected_on': 'નકાર્યું',
      'assigned_on': 'સોંપવામાં આવ્યું',
      // Service Request Fields
      'enter_description': 'સેવા વર્ણન દાખલ કરો',
      'select_date': 'તારીખ પસંદ કરો',
      'flat_floor_hint': 'જેમ કે, 201, 2જો માળ',
      'building_hint': 'જેમ કે, ગાયત્રી એપાર્ટમેન્ટ',
      'street_hint': 'જેમ કે, એમજી રોડ',
      'landmark_hint': 'જેમ કે, સિટી હોસ્પિટલ પાસે',
      // My Requests
      'search_by_description_address': 'વર્ણન અથવા સરનામાંથી શોધો...',
      'all_status': 'તમામ સ્થિતિ',
      // Service Status Labels
      'status_accepted': 'સ્વીકૃત',
      'status_unavailable': 'અનુપલબ્ધ',
      'status_completed': 'પૂર્ણ',
      // News Categories
      'news_and_updates': 'સમાચાર અને અપડેટ્સ',
      'news_category_all': 'બધા',
      'news_category_spiritual': 'આધ્યાત્મિક',
      'news_category_events': 'કાર્યક્રમો',
      'news_category_seva': 'સેવા',
      'news_category_youth': 'યુવા',
      'news_category_notices': 'નોટિસો',
      'news_category_magazine': 'મેગેઝિન',
      'dashboard_stat_total': 'કુલ',
      'dashboard_stat_upcoming': 'આગામી',
      'dashboard_stat_completed': 'પૂર્ણ',
      'no_seva_assignments': 'કોઈ સેવા સોંપણી નથી',
      'no_assigned_requests': 'કોઈ વિનંતી સોંપવામાં આવી નથી',
      'attendance_marked': 'હાજરી ચિહ્નિત',
      // Service Requests (Extended)
      'request_service_title': 'સેવા વિનંતી',
      'edit_request_title': 'વિનંતી સંપાદિત કરો',
      'add_extra_item': 'વધારાની વસ્તુ ઉમેરો',
      'submit_request': 'વિનંતી સબમિટ કરો',

      'yagya_karmkaand_rituals': 'યજ્ઞ, કર્મકાંડ, સંસ્કાર અને વધુ',
      'selected': 'પસંદ કરેલ',
      'please_select_service_type': 'ચાલુ રાખવા માટે કૃપા કરીને ઉપર સેવા પ્રકાર પસંદ કરો',
      'view_my_requests': 'મારી વિનંતીઓ જુઓ',
      'service_location': 'સેવા સ્થળ',
      'house': 'ઘર',


      'preferred': 'પસંદગી',
      'select_date_time_error': 'કૃપા કરીને પસંદગીની તારીખ અને સમય પસંદ કરો',
      'request_updated': 'સેવા વિનંતી સફળતાપૂર્વક અપડેટ થઈ!',
      'request_submitted': 'સેવા વિનંતી સફળતાપૂર્વક સબમિટ થઈ!',
      'notes_hint': 'કોઈ ખાસ જરૂરિયાત...',

      // Storage/Media
      'root': 'રૂટ',
      'folders': 'ફોલ્ડર્સ',
      'no_files': 'કોઈ ફાઇલો નથી',
      'share_file': 'ફાઇલ શેર કરો',
      'open_file': 'ફાઇલ ખોલો',

      // Volunteers/Seva
      'assign_volunteers': 'સ્વયંસેવકો સોંપો',
      'volunteer_invitations': 'સ્વયંસેવક આમંત્રણો',
      'group_invitations': 'જૂથ આમંત્રણો',
      'no_volunteer_invitations': 'કોઈ સ્વયંસેવક આમંત્રણો નથી',
      'volunteer_invitations_hint': 'સ્વયંસેવક આમંત્રણો અહીં દેખાશે',
      'volunteer_invitation': 'સ્વયંસેવક આમંત્રણ',
      'volunteer_role': 'સ્વયંસેવક ભૂમિકા',
      'select_member': 'સભ્ય પસંદ કરો',
      'choose_member': 'સભ્ય પસંદ કરો',


      // Common Missing Keys (Restored)
      'reset': 'રીસેટ',
      'check_out_resource': 'આ સંસાધન તપાસો',
      'error_url_empty': 'URL ખાલી છે',
      'cannot_download_video': 'વિડિઓ ડાઉનલોડ કરી શકાતો નથી',
      'no_description': 'કોઈ વર્ણન નથી',
      'error_cannot_launch': 'લોન્ચ કરી શકાયું નથી',
      'resend_otp': 'OTP ફરીથી મોકલો',
      'resend_code_in': 'કોડ ફરીથી મોકલો',
      'otp_sent_success': 'OTP મોકલ્યો',
      'search_by_description': 'વર્ણન દ્વારા શોધો',
      'tab_calendar': 'કેલેન્ડર',
      'unable_to_attend': 'હાજર રહી શકતા નથી',
      'mark_completed': 'પૂર્ણ તરીકે ચિહ્નિત કરો',
      'open_directions': 'દિશા નિર્દેશો ખોલો',
      'approve_all': 'બધા મંજૂર કરો',
      'request_revision': 'સુધારણાની વિનંતી કરો',
      'save_notes': 'નોંધો સાચવો',
      'your_notes_to_admin': 'એડમિન માટે તમારી નોંધો',
      'add_notes_hint': 'નોંધ ઉમેરો...',
      'samagri_actions': 'સામગ્રી ક્રિયાઓ',
      'samagri_approved_locked': 'સામગ્રી મંજૂર અને લોક',
      // Audit Fixes 2.5 - Remaining Missing Keys
      'deleted_successfully': 'સફળતાપૂર્વક કાઢી નાખ્યું',
      'download_complete': 'ડાઉનલોડ પૂર્ણ',
      'cancel_request_title': 'વિનંતી રદ કરવી?',
      'cancel_request_content': 'શું તમે ચોક્કસ છો?',
      'yes_cancel': 'હા, રદ કરો',
      'confirmed': 'પુષ્ટિ થયેલ',
      'tbd': 'નક્કી કરવાનું બાકી',
      'guruji_label': 'ગુરુજી',
      'name': 'નામ',
      'phone': 'ફોન',
      'important_info_emergency': 'મહત્વપૂર્ણ માહિતી અને કટોકટી',
      'contacts': 'સંપર્કો',
      'locations': 'સ્થળો',
      'sos_contacts': 'SOS સંપર્કો',
      'alerts': 'ચેતવણીઓ',
      'no_contacts_yet': 'હજુ સુધી કોઈ સંપર્કો નથી',
      'tap_to_add_contact': 'સંપર્ક ઉમેરવા માટે + ટેપ કરો',
      'no_locations_yet': 'હજુ સુધી કોઈ સ્થળો નથી',
      'tap_to_add_location': 'સ્થળ ઉમેરવા માટે + ટેપ કરો',
      'add_tag': 'ટેગ ઉમેરો',
      'tag_name': 'ટેગ નામ',
      'delete_tag': 'ટેગ કાઢી નાખો',
      'delete_tag_confirm': 'શું તમે ખરેખર ટેગ "{tag}" કાઢી નાખવા માંગો છો?',
      'add_role': 'ભૂમિકા ઉમેરો',
      'role_name': 'ભૂમિકા નામ',
      'delete_role': 'ભૂમિકા કાઢી નાખો',
      'delete_role_confirm': 'શું તમે ખરેખર ભૂમિકા "{role}" કાઢી નાખવા માંગો છો?',
      'edit_location': 'સ્થળ સંપાદિત કરો',
      'add_location': 'સ્થળ ઉમેરો',
      'location_name': 'સ્થળનું નામ',
      'google_maps_link': 'ગૂગલ મેપ્સ લિંક',
      'latitude': 'અક્ષાંશ',
      'longitude': 'રેખાંશ',
      'add_emergency_contact': 'કટોકટી સંપર્ક ઉમેરો',
      'role': 'ભૂમિકા',
      'displayed_as_tag': 'વિજેટમાં ટેગ તરીકે દર્શાવેલ છે',
      'resolved_requests': 'ઉકેલાયેલ વિનંતીઓ',
      'active_requests': 'સક્રિય વિનંતીઓ',
      'temporarily_unavailable': 'કામચલાઉ અનુપલબ્ધ',
      'cancellation_reason': 'રદ કરવાનું કારણ',
      'cancelled_by': 'દ્વારા રદ',
      'status_summary': 'સ્થિતિ સારાંશ',
      'stat_total': 'કુલ',
      'stat_pending': 'બાકી',
      'stat_accepted': 'સ્વીકાર્યું',
      'stat_completed': 'પૂર્ણ',
      'stat_cancelled': 'રદ',
      'service_types': 'સેવાના પ્રકારો',
      'top_requesters': 'ટોચના વિનંતીકર્તાઓ',
      'clear_all': 'બધું સાફ કરો',
      'filter_by_status': 'સ્થિતિ દ્વારા ફિલ્ટર કરો',
      'filter_by_type': 'પ્રકાર દ્વારા ફિલ્ટર કરો',
      'no_requests_match_filters': 'ફિલ્ટર્સ સાથે કોઈ વિનંતીઓ મેળ ખાતી નથી',
      'no_service_requests_yet': 'હજુ સુધી કોઈ સેવા વિનંતીઓ નથી',
      'preferred_label': 'પસંદગીનું: {value}',
      'assigned_label': 'સોંપેલ: {value}',
      'requested_by': 'વિનંતીકર્તા',
      'alt_contact': 'વૈકલ્પિક સંપર્ક',
      'default_samagri_from_type': 'ડિફોલ્ટ સામગ્રી (સેવા પ્રકાર પરથી):',
      'not_possible_with_reason': 'શક્ય નથી: {reason}',
      'no_reason_given': 'કોઈ કારણ આપવામાં આવ્યું નથી',
      'loading_details': 'વિગતો લોડ થઈ રહી છે...',
      'currently_assigned': 'હાલમાં સોંપેલ',
      'notes_from_guruji': 'ગુરુજીની નોંધો:',
      'completion_photos_label': 'પૂર્ણતાના ફોટા:',
      'unavailable_by_label': '{name} દ્વારા',
      'cancelled_by_label': '{name} દ્વારા',
      'cannot_complete_request': 'વિનંતી પૂર્ણ કરી શકાતી નથી',
      'pending_items_approval_error': 'અમુક વિનંતી કરેલી વસ્તુઓ પેન્ડિંગ છે જેને વિનંતી પૂર્ણ કરવા માટે ગુરુજીની મંજૂરી/અસ્વીકારની જરૂર છે.',
      'marked_unavailable_success': 'વિનંતી અનુપલબ્ધ તરીકે ચિહ્નિત કરી',
      'restore_to_pending': 'પેન્ડિંગ પર પુનઃસ્થાપિત કરો',
      'request_restored_success': 'વિનંતી પેન્ડિંગ પર પુનઃસ્થાપિત કરી',
      'cancellation_reason_label': 'રદ કરવાનું કારણ',
      'cancellation_reason_hint': 'આ વિનંતી કેમ રદ કરવામાં આવી રહી છે?',
      'please_enter_reason': 'કૃપા કરીને કારણ દાખલ કરો',
      'request_marked_unavailable': 'વિનંતી અનુપલબ્ધ તરીકે ચિહ્નિત કરી',
      'request_cancelled_success': 'વિનંતી રદ કરી',
      'request_marked_completed': 'વિનંતી પૂર્ણ કરી',
      'request_details': 'વિનંતી વિગતો',
      'notes': 'નોંધો',
      'attachments': 'જોડાણો',
      'assignment': 'સોંપણી',
      'final_date': 'અંતિમ તારીખ',
      'on_date': 'તારીખ પર',
      'request_not_found': 'વિનંતી મળી નથી',
      'confirmed_date': 'પુષ્ટિ થયેલ તારીખ',
      'confirmed_time': 'પુષ્ટિ થયેલ સમય',
      'assigned_guruji': 'સોંપેલ ગુરુજી',
      'admin_notes_label': 'એડમિન નોંધો',
      'cancellation_details': 'રદ કરવાની વિગતો',
      'samagri_approved_msg': 'સામગ્રી મંજૂર',
      'request_on_hold': 'વિનંતી હોલ્ડ પર',
      'reason_label': 'કારણ',
      'revision_required': 'સુધારણા જરૂરી',
      'revision_required_content': 'કૃપા કરીને વિનંતી સુધારો',
      'gurujis_note': 'ગુરુજીની નોંધ',
      'guruji_asked_title': 'ગુરુજીએ પૂછ્યું',
      'requirements_checklist': 'આવશ્યકતાઓ',
      'no_requirements': 'કોઈ આવશ્યકતાઓ નથી',
      'add_item': 'વસ્તુ ઉમેરો',
      'your_requested_items': 'તમારી વસ્તુઓ',
      'not_available': 'ઉપલબ્ધ નથી',
      'no_eligible_members': 'કોઈ લાયક સભ્યો નથી',
      'invitation_sent': 'આમંત્રણ મોકલ્યું',
      'accepted': 'સ્વીકાર્યું',
      'declined': 'નકાર્યું',
      'assign': 'સોંપો',
      'end_date_optional': 'સમાપ્તિ તારીખ (વૈકલ્પિક)',
      'assigned_by': 'દ્વારા સોંપેલ',
      'manage_volunteers': 'સ્વયંસેવકોનું સંચાલન',
      'mandir_schedule': 'મંદિરનું સમયપત્રક',
      'temple_schedule': 'મંદિર સમયપત્રક',
      'aarti': 'આરતી',
      'pooja': 'પૂજા',
      'camp': 'શિબિર',
      'event': 'કાર્યક્રમ',
      'other_schedule': 'અન્ય',
      'add_schedule': 'સમયપત્રક ઉમેરો',
      'edit_schedule': 'સમયપત્રક સંપાદિત કરો',
      'schedule_title': 'સમયપત્રક શીર્ષક',
      'schedule_time': 'સમયપત્રક સમય',
      'schedule_description': 'સમયપત્રક વર્ણન',
      'permanent_schedule': 'કાયમી સમયપત્રક',
      'is_active': 'સક્રિય છે',
      'house_no_hint': 'ઘર નંબર',
      'contact_number': 'સંપર્ક નંબર',
      'alternate_contact_hint': 'વૈકલ્પિક સંપર્ક',
      'landmark': 'લેન્ડમાર્ક',
      'news_updates': 'સમાચાર અપડેટ્સ',
      'youth': 'યુવા',
      'search_description_address': 'વર્ણન અથવા સરનામું શોધો',
      'haptic_feedback': 'હેપ્ટિક ફીડબેક',
      'vibration_on_tap': 'ટેપ પર વાઇબ્રેશન',
      'clear_progress': 'પ્રગતિ સાફ કરો',
      'scheduled_for': 'માટે સુનિશ્ચિત',
      'daily_nudge': 'દૈનિક રિમાઇન્ડર',
      'reminder_time_label': 'રિમાઇન્ડર સમય',
      'vibration_on': 'વાઇબ્રેશન ચાલુ',
      'vibration_off': 'વાઇબ્રેશન બંધ',
      'analytics': 'એનાલિટિક્સ',
      'add_mantra_title': 'મંત્ર ઉમેરો',
      'mantra_name_label': 'મંત્રનું નામ',
      'mantra_desc_label': 'વર્ણન',
      'mantra_desc_hint': 'વર્ણન ઉમેરો',
      'enter_mantra_name_error': 'કૃપા કરીને મંત્રનું નામ દાખલ કરો',
      'add_btn': 'ઉમેરો',
      'cancel_btn': 'રદ કરો',
      'anushthan': 'અનુષ્ઠાન',
      'save_certificate': 'પ્રમાણપત્ર સાચવો',
      'no_homework_yet': 'હજુ સુધી કોઈ હોમવર્ક નથી',
      'no_submitted_homework': 'કોઈ સબમિટ કરેલું હોમવર્ક નથી',
      'no_attendance_data': 'કોઈ હાજરી ડેટા નથી',
      'tutorial_guruji_sos_title': 'ગુરુજી SOS',
      'tutorial_guruji_sos_desc': 'કટોકટીની વિનંતીઓ માટે ગુરુજી પાસેથી મદદ મેળવો',
      'tutorial_lms_title': 'સંસ્કાર અભ્યાસક્રમ',
      'tutorial_lms_desc': 'આધ્યાત્મિક અભ્યાસક્રમોમાં નોંધણી કરો અને તમારી શીખવાની પ્રગતિને ટ્રેક કરો.',
      
      // Group Details (Added)
      'about_label': 'વિશે',
      'chat_label': 'ચેટ',
      'camera_label': 'કેમેરા',
      'video_label': 'વિડિઓ',
      'document_label': 'દસ્તાવેજ',
      'homework_label': 'હોમવર્ક',
      'search_messages': 'સંદેશ શોધો...',
      'filter_by_date': 'તારીખ મુજબ ફિલ્ટર કરો',
      'from_label': 'તારીખ થી',
      'to_label': 'તારીખ સુધી',
      'not_set': 'સેટ નથી',
      'clear': 'કાઢી નાખો',
      'message_deleted': 'આ સંદેશ કાઢી નાખવામાં આવ્યો હતો',
      'message_deleted_admin': 'આ સંદેશ એડમિન દ્વારા કાઢી નાખવામાં આવ્યો હતો',
      'message_deleted_guruji': 'આ સંદેશ ગુરુજી દ્વારા કાઢી નાખવામાં આવ્યો હતો',
      'practice_calendar': 'સાધના કેલેન્ડર',
      'allow_guruji_view': 'ગુરુજીને જોવાની મંજૂરી આપો',
      'guruji_view_desc': 'તમારા ગુરુજી તમારી પ્રગતિ જોઈ શકે છે',
      'cert_title': 'અનુષ્ઠાન પૂર્ણતા\nપ્રમાણપત્ર',
      'cert_subtitle': 'આ પ્રમાણિત કરવામાં આવે છે કે',
      'cert_body': 'સફળતાપૂર્વક પૂર્ણ કર્યું છે',
      'cert_blessing': '“તમારી સાચી સાધના તમારી બુદ્ધિને પ્રકાશિત કરે,\nતમારા વિચારોને શુદ્ધ કરે અને તમને ધાર્મિક જીવન તરફ દોરી જાય.”',
      'issue_date': 'ઇશ્યૂ તારીખ',
      'cert_id': 'પ્રમાણપત્ર આઈડી',
      'digitally_issued_by': 'ડિજિટલ રીતે જારી કરનાર',
      'cert_disclaimer': 'આ ડિજિટલ રીતે જનરેટ થયેલ પ્રમાણપત્ર છે અને\nભૌતિક સહીની જરૂર નથી.',
      'apply': 'લાગુ કરો',
      'no_results_found': 'કોઈ પરિણામ મળ્યું નથી',
      'leave_group_title': 'જૂથ છોડવું છે?',
      'request_leave_title': 'છોડવાની વિનંતી?',
      'leave_group_confirm_msg': 'શું તમે ખરેખર "{name}" છોડવા માંગો છો?',
      'request_leave_msg': 'તમારી વિનંતી ગુરુજી/એડમિનને મંજૂરી માટે મોકલવામાં આવશે.',
      'only_guruji_leave_error': 'તમે એકમાત્ર ગુરુજી છો. છોડતા પહેલા બીજા ગુરુજી ઉમેરો.',
      'leave_request_sent': 'વિનંતી મોકલી. મંજૂરીની રાહ જોઈ રહ્યા છીએ.',
      'left_group_success': 'તમે જૂથ છોડી દીધું છે',
      'pending_approval_title': 'એડમિન મંજૂરીની રાહ જોઈ રહ્યા છે',
      'pending_approval_msg': 'મંજૂરી પછી ચેટ, ઇવેન્ટ્સ અને સભ્ય સંચાલન ઉપલબ્ધ થશે.',
      'mantras': 'મંત્રો',
      'teachings': 'શિક્ષણ',
      'other': 'અન્ય',
      'pending_join_requests': 'બાકી વિનંતીઓ ({count})',
      'audio_label': 'ઓડિયો',
      'last_synced': 'છેલ્લે સિન્ક કર્યું: ',
      'sync_success': '{count} એન્ટ્રી સફળતાપૂર્વક સિન્ક થઈ',
      'no_data_to_sync': 'સિન્ક કરવા માટે કોઈ ડેટા નથી',
      'sync_failed': 'સિન્ક નિષ્ફળ',
      'just_now': 'હમણાં જ',
      'minutes_ago': '{count} મિનિટ પહેલા',
      'hours_ago': '{count} કલાક પહેલા',
      'yesterday': 'ગઈકાલે',
      'days_ago': '{count} દિવસ પહેલા',

      // Manage Resources (Gujarati)
      'manage_resources': 'સંસાધનોનું સંચાલન કરો',
      'search_by_title': 'શીર્ષક દ્વારા શોધો...',
      'all_types': 'બધા પ્રકારો',
      'no_matching_resources': 'કોઈ મેળ ખાતા સંસાધનો નથી',
      'tap_to_add_resource': 'તમારું પ્રથમ સંસાધન ઉમેરવા માટે + ટેપ કરો',
      'resource_type_book': 'પુસ્તકો',
      'resource_type_audio': 'ઓડિયો',
      'resource_type_bhajan': 'ભજનો',
      'resource_type_video': 'વિડિઓઝ',
      'resource_type_picture': 'ચિત્રો',
      'add_resource': 'સંસાધન ઉમેરો',
      'edit_resource': 'સંસાધન સંપાદિત કરો',
      'title_hint': 'દા.ત., ગાયત્રી ચાલીસા',
      'title_required': 'શીર્ષક જરૂરી છે',
      'description_hint': 'ટૂંકું વર્ણન...',
      'select_type': 'પ્રકાર પસંદ કરો',
      'category_label': 'શ્રેણી',
      'no_category_label': 'કોઈ શ્રેણી નથી',
      'thumbnail_url': 'થંબનેલ URL',
      'resource_visible': 'સંસાધન વપરાશકર્તાઓ માટે દૃશ્યમાન છે',
      'resource_draft': 'સંસાધન ડ્રાફ્ટ મોડમાં છે',
      'active': 'સક્રિય',
      'draft': 'ડ્રાફ્ટ',
      'confirm_delete_resource': 'સંસાધન કાઢી નાખવું?',
      'delete_resource_msg': 'શું તમે ચોક્કસ છો? આને પૂર્વવત્ કરી શકાતું નથી.',
      'upload_failed_prefix': 'અપલોડ નિષ્ફળ: ',
      'thumbnail_upload_failed_prefix': 'થંબનેલ અપલોડ નિષ્ફળ: ',
      
      // Resource Categories
      'category_gayatri': 'ગાયત્રી',
      'category_health': 'આરોગ્ય',
      'category_life_lessons': 'જીવન પાઠ',
      'category_devotional': 'ભક્તિ',
      'category_yoga': 'યોગ',
      
      // Spiritual Content Management (Gujarati)
      'manage_spiritual_content': 'આધ્યાત્મિક સામગ્રીનું સંચાલન કરો',
      'daily_quotes': 'દૈનિક સુવિચાર',
      'meditation_tips': 'ધ્યાન ટિપ્સ',
      'items_count': '{count} આઇટમ્સ',
      'manage_daily_quotes': 'દૈનિક સુવિચારનું સંચાલન',
      'manage_meditation_tips': 'ધ્યાન ટિપ્સનું સંચાલન',
      'add_quote': 'સુવિચાર ઉમેરો',
      'edit_quote': 'સુવિચાર સંપાદિત કરો',
      'quote_text': 'સુવિચાર ટેક્સ્ટ',
      'enter_quote': 'સુવિચાર દાખલ કરો...',
      'author': 'લેખક',
      'author_hint': 'દા.ત., પં. શ્રીરામ શર્મા આચાર્ય',
      'image_url_darshan': 'ઇમેજ URL (દર્શન માટે)',
      'tithi_occasion': 'તિથિ / પ્રસંગ',
      'tithi_hint': 'દા.ત., એકાદશી, વિશેષ દિવસ',
      'schedule_date': 'નિર્ધારિત તારીખ',
      'quote_visible': 'સુવિચાર વપરાશકર્તાઓ માટે દૃશ્યમાન છે',
      'quote_draft': 'સુવિચાર ડ્રાફ્ટ મોડમાં છે',
      'delete_quote': 'સુવિચાર કાઢી નાખવો?',
      'no_quotes_yet': 'હજુ સુધી કોઈ સુવિચાર નથી',
      'tap_add_first_quote': 'તમારો પ્રથમ સુવિચાર ઉમેરવા માટે + ટેપ કરો',
      'add_tip': 'ટિપ ઉમેરો',
      'edit_tip': 'ટિપ સંપાદિત કરો',
      'tip_title': 'ટિપ શીર્ષક',
      'tip_title_hint': 'દા.ત., શાંત જગ્યા શોધો',
      'explain_tip': 'ટિપ સમજાવો...',
      'tip_visible': 'ટિપ વપરાશકર્તાઓ માટે દૃશ્યમાન છે',
      'tip_draft': 'ટિપ ડ્રાફ્ટ મોડમાં છે',
      'delete_tip': 'ટિપ કાઢી નાખવી?',
      'no_tips_yet': 'હજુ સુધી કોઈ ધ્યાન ટિપ્સ નથી',
      'tap_add_first_tip': 'તમારી પ્રથમ ટિપ ઉમેરવા માટે + ટેપ કરો',
      'save_order': 'ક્રમ સાચવો',
      'reorder': 'પુનઃક્રમ',
      'url_label': 'લિંક (URL)',
      'url_hint': 'URL દાખલ કરો (https://...)',
      'access_denied': 'પ્રવેશ નકાર્યો',
      'only_admin_guruji': 'ફક્ત એડમિન અથવા ગુરુજી આ પેજ જોઈ શકે છે.',
      
      // Manage Calendar (Gujarati)
      'manage_calendar_events': 'કેલેન્ડર કાર્યક્રમોનું સંચાલન કરો',
      'load_holidays': 'રજાઓ લોડ કરો',
      'load_public_holidays': 'જાહેર રજાઓ લોડ કરો',
      'select_year_load_holidays': 'ભારતીય જાહેર રજાઓ લોડ કરવા માટે વર્ષ પસંદ કરો.',
      'year_label': 'વર્ષ {year}',
      'add_new_event': 'નવો કાર્યક્રમ ઉમેરો',
      'add_event': 'કાર્યક્રમ ઉમેરો',
      'event_title': 'કાર્યક્રમ શીર્ષક',
      'select_time': 'સમય પસંદ કરો',
      'event_category': 'શ્રેણી',
      'event_icon': 'આઇકન (ઇમોજી)',
      'event_icon_hint': 'દા.ત. 🕉️',
      'festival_settings': 'તહેવાર સેટિંગ્સ',
      'primary_festival_date': 'આ તારીખ માટે પ્રાથમિક તહેવાર',
      'primary_festival_desc': 'સમગ્ર એપની થીમ નિયંત્રિત કરે છે',
      'theme_color_hex': 'થીમ કલર (Hex)',
      'pick_color': 'રંગ પસંદ કરો',
      'banner_image': 'બેનર છબી',
      'upload_label': 'અપલોડ',
      'pick_banner_image': 'બેનર ઇમેજ પસંદ કરો',
      'banner_url': 'બેનર URL',
      'suggested_mantra_id': 'સૂચવેલ મંત્ર ID (વૈકલ્પિક)',
      'suggested_mantra_hint': 'દા.ત., gayatri, devi',
      'festival_description_localized': 'તહેવારનું વર્ણન (સ્થાનિક)',
      'primary_festival_indicator': 'પ્રાથમિક',
      'holidays_loaded_success': '{year} માટે રજાઓ લોડ થઈ ગઈ!',
      'delete_event_title': 'કાર્યક્રમ કાઢી નાખો?',
      'delete_event_confirm_with_title': 'શું તમે ખરેખર "{title}" કાઢી નાખવા માંગો છો?',
      'no_events_found': 'કોઈ કાર્યક્રમો મળ્યા નથી. એક ઉમેરો!',
      'pick_theme_color': 'થીમ રન પસંદ કરો',
      'select_btn': 'પસંદ કરો',
      'primary': 'પ્રાથમિક',
      'holidays_loaded': '{year} માટે રજાઓ લોડ થઈ ગઈ!',
      'error_occurred': 'ભૂલ: {error}',

      // Branch & Guruji Management
      'no_branches_found': 'કોઈ શાખા મળી નથી. એક ઉમેરો!',
      'add_branch': 'શાખા ઉમેરો',
      'edit_branch': 'શાખા સંપાદિત કરો',
      'branch_name': 'શાખાનું નામ',
      'branch_name_hint': 'શાખાનું નામ દાખલ કરો',
      'city_location_hint': 'શહેર અથવા સ્થાન દાખલ કરો',
      'delete_branch_title': 'શાખા કાઢી નાખવી છે?',
      'delete_branch_confirm': 'શું તમે ખરેખર આ શાખા કાઢી નાખવા માંગો છો? આ ક્રિયા ઉલટાવી શકાતી નથી.',
      'manage_gurujis': 'ગુરુજીઓ મેનેજ કરો',
      'no_gurujis_found': 'હજી સુધી કોઈ ગુરુજી સોંપાયેલ નથી.',
      'assign_guruji_role': 'ગુરુજી ભૂમિકા સોંપો',
      'assign_role': 'ભૂમિકા સોંપો',
      'confirm_assignment': 'સોંપણીની પુષ્ટિ કરો',
      'promote_confirm_msg': 'શું તમે ખરેખર {name} ને ગુરુજી તરીકે પ્રોત્સાહિત કરવા માંગો છો?',
      'promote_success_msg': '{name} હવે ગુરુજી છે',
      'promote_instruction': 'ગુરુજી તરીકે પ્રોત્સાહિત કરવા માટે વપરાશકર્તા શોધો.',
      'search_user_hint': 'નામ અથવા ઇમેઇલ દ્વારા વપરાશકર્તા શોધો',
      'remove_guruji_role_title': 'ગુરુજી ભૂમિકા દૂર કરવી છે?',
      'remove_role_confirm_msg': 'આ વપરાશકર્તા સામાન્ય સભ્ય બનશે.',
      'location_label': 'સ્થાન',
      'load_label': 'લોડ કરો',
      'event_category_festival': 'તહેવાર',
      'event_category_tithi': 'તિથિ',
      'event_category_mandir_event': 'મંદિર કાર્યક્રમ',
      'event_updated_success': 'કાર્યક્રમ સફળતાપૂર્વક અપડેટ થયો!',
      'banner_upload_success': 'બેનર છબી સફળતાપૂર્વક અપલોડ થઈ!',
      'expired': 'સમાપ્ત',
      'news_management': 'સમાચાર સંચાલન',
      'create_news': 'સમાચાર બનાવો',
      'edit_news': 'સમાચાર સંપાદિત કરો',
      'no_news_created': 'હજુ સુધી કોઈ સમાચાર બનાવવામાં આવ્યા નથી.',
      'delete_news_title': 'સમાચાર કાઢી નાખો',
      'delete_news_confirm': 'શું તમે ખરેખર આ સમાચાર કાઢી નાખવા માંગો છો?',
      'tap_to_pick_image': 'છબી પસંદ કરવા માટે ટેપ કરો',
      'image_url_optional': 'છબી URL (વૈકલ્પિક)',
      'image_url_hint': 'અથવા અહીં છબી લિંક પેસ્ટ કરો',
      'enter_news_title': 'સમાચારનું શીર્ષક દાખલ કરો',
      'short_description_hint': 'કાર્ડ માટે સંક્ષિપ્ત સારાંશ',
      'full_article_content': 'સંપૂર્ણ લેખ સામગ્રી',
      'mark_as_important': 'મહત્વપૂર્ણ તરીકે ચિહ્નિત કરો',
      'high_priority_notify': 'ઉચ્ચ અગ્રતા સૂચના મોકલે છે',
      'schedule_publishing': 'પ્રકાશન શેડ્યૂલ કરો',
      'pick_date_time': 'તારીખ અને સમય પસંદ કરો',
      'change_date_time': 'તારીખ અને સમય બદલો',
      'leave_empty_immediate': 'તરત જ પ્રકાશિત કરવા માટે ખાલી છોડો',
      'responsible_contact_person': 'જવાબદાર સંપર્ક વ્યક્તિ',
      'role_title': 'ભૂમિકા / શીર્ષક',
      'role_title_hint': 'દા.ત. સંપાદક',
      'contact_phone_hint': '+91 XXXXX XXXXX',
      'save_draft': 'ડ્રાફ્ટ સાચવો',
      'publish_news': 'સમાચાર પ્રકાશિત કરો',
      'draft_saved': 'ડ્રાફ્ટ સાચવવામાં આવ્યો',
      'news_published': 'સમાચાર પ્રકાશિત થયા',
      'select_image_or_url': 'કૃપા કરીને છબી પસંદ કરો અથવા URL દાખલ કરો',
      'published': 'પ્રકાશિત',
      'scheduled': 'શેડ્યૂલ કરેલ',
      'important': 'મહત્વનું',
      'short_description': 'ટૂંકું વર્ણન',
      'category': 'શ્રેણી',
      'is_required': 'જરૂરી છે',
      'attendance_analytics': 'હાજરી એનાલિટિક્સ',
      'attendance_trend': 'હાજરી ટ્રેન્ડ',
      'member_performance': 'સભ્ય પ્રદર્શન',
      'highest_percent': 'સૌથી વધુ %',
      'lowest_percent': 'સૌથી ઓછું %',
      'alphabetical': 'વર્ણમાળા મુજબ',
      'mark_all_present': 'બધાને હાજર માર્ક કરો',
      'mark_all_absent': 'બધાને ગેરહાજર માર્ક કરો',
      'sessions': 'સત્ર',
      'no_attendance_for_date': 'આ તારીખ માટે કોઈ હાજરી સેટ નથી',
      'add_attendance_date': 'હાજરી તારીખ ઉમેરો',
      'cannot_view_future_dates': 'ભવિષ્યની તારીખો જોઈ શકાતી નથી',
      'no_data_for_chart': 'ચાર્ટ માટે કોઈ ડેટા નથી',
      'today': 'આજે',
      'no_attendance_groups_found': 'હાજરી સક્ષમ હોય તેવા કોઈ જૂથો મળ્યા નથી.',
      'manage_service_types': 'સેવા પ્રકારોનું સંચાલન કરો',
      'uploading': 'અપલોડ થઈ રહ્યું છે...',
      'inactive': 'નિષ્ક્રિય',
      'activate': 'સક્રિય કરો',
      'deactivate': 'નિષ્ક્રિય કરો',
      'mark_attendance_title': 'હાજરી પૂરો',
      'no_participants_joined': 'હજુ સુધી કોઈ સભ્યો જોડાયા નથી.',
      'unmarked': 'બાકી',
      'confirm_attendance_label': 'હાજરીની પુષ્ટિ કરો',
      'mark_all_to_continue': 'આગળ વધવા માટે બધા સભ્યોને માર્ક કરો',
      'backup_volunteer': 'બેકઅપ સ્વયંસેવક',
      'primary_volunteer': 'મુખ્ય સ્વયંસેવક',

      'pause': 'થોભો',
      'mark_complete': 'પૂર્ણ ચિહ્નિત કરો',
      'filled': 'ભરેલું',
      'required': 'જરૂરી',
      'volunteers_filled': 'સ્વયંસેવકો પૂર્ણ',
      'become_first_volunteer': 'પ્રથમ સ્વયંસેવક બનો',

      // Group Member Management
      'manage_roles_title': '{name} માટે ભૂમિકાઓનું સંચાલન કરો',
      'roles': 'ભૂમિકાઓ',
      'admin_role': 'એડમિન',
      'only_system_admins_manage': 'માત્ર સિસ્ટમ એડમિન આ ભૂમિકાનું સંચાલન કરી શકે છે',
      'admin_role_desc': 'સભ્યો અને સેટિંગ્સનું સંચાલન કરી શકે છે',
      'error_updating_role': 'ભૂમિકા અપડેટ કરવામાં ભૂલ',
      'guruji_role': 'ગુરુજી',
      'guruji_role_desc': 'શીખવી શકે છે અને સામગ્રીનું સંચાલન કરી શકે છે',
      'permitted_role': 'પરવાનગી પ્રાપ્ત વપરાશકર્તા',
      'permitted_role_desc': 'મેસેજિંગ/પિનિંગ માટે વિશેષ પરવાનગીઓ',
      'member_role': 'સભ્ય',
      'done': 'થઈ ગયું',
      'remove_from_group': 'જૂથમાંથી દૂર કરો',
      'remove_member': 'સભ્યને દૂર કરવા?',
      'remove_member_confirm': 'શું તમે ખરેખર {name} ને આ જૂથમાંથી દૂર કરવા માંગો છો?',
      'remove': 'દૂર કરો',
      'member_removed_success': 'સભ્ય સફળતાપૂર્વક દૂર થયા',
      'volunteer_removed': 'સ્વયંસેવક દૂર થયા',
      'remove_volunteer': 'સ્વયંસેવક દૂર કરવા?',
      'remove_volunteer_confirm': 'શું તમે ખરેખર {name} ને દૂર કરવા માંગો છો?',
      
      // Assign Volunteer
      'assign_volunteers': 'સ્વયંસેવક નિયુક્ત કરો',
      'select_member': 'સભ્ય પસંદ કરો',
      'choose_member': 'એક સભ્ય પસંદ કરો',
      'role': 'સ્વયંસેવક ભૂમિકા',
      'volunteer_role_hint': 'દા.ત., જાજમ પાથરનાર, ખુરશી ગોઠવનાર',
      'volunteer_desc_hint': 'સ્વયંસેવકની જવાબદારીઓનું વર્ણન કરો...',
      'description_optional': 'વર્ણન (વૈકલ્પિક)',
      'description': 'વર્ણન',
      'end_date': 'સમાપ્તિ તારીખ',
      'end_date_optional': 'સમાપ્તિ તારીખ (વૈકલ્પિક)',
      'sending': 'મોકલી રહ્યું છે',
      'assign': 'નિયુક્ત કરો',
      'invitation_sent': 'સ્વયંસેવક આમંત્રણ મોકલવામાં આવ્યું',
      'select_member_error': 'કૃપા કરીને સભ્ય પસંદ કરો',
      'no_eligible_members': 'આ જૂથમાં કોઈ પાત્ર સભ્યો નથી',

      // Group Details & Permissions
      'everyone': 'દરેક જણ',
      'admins_only': 'માત્ર એડમિન',
      'admins_and_gurujis': 'એડમિન અને ગુરુજી',
      'admins_gurujis_permitted': 'એડમિન, ગુરુજી અને પરવાનગી પ્રાપ્ત',
      'who_can_send_messages': 'સંદેશ કોણ મોકલી શકે?',
      'message_permission_updated': 'સંદેશ પરવાનગી અપડેટ થઈ',
      'who_can_pin_messages': 'સંદેશ કોણ પિન કરી શકે?',
      'pin_permission_updated': 'પિન પરવાનગી અપડેટ થઈ',
      'message_send_permission': 'સંદેશ મોકલવાની પરવાનગી',
      'pin_message_permission': 'સંદેશ પિન કરવાની પરવાનગી',
      'group_settings': 'જૂથ પરવાનગીઓ',
      'default_samagri_from_type': '{type} માંથી ડિફોલ્ટ સામગ્રી',
      
      // Invite User & Volunteer Dialogs
      'invitation_already_sent': 'આ વપરાશકર્તાને આમંત્રણ પહેલેથી જ મોકલવામાં આવ્યું છે',
      'cannot_invite_self': 'તમે તમારી જાતને જૂથમાં આમંત્રિત કરી શકતા નથી',
      'user_already_member': 'વપરાશકર્તા પહેલાથી જ આ જૂથના સભ્ય છે',
      'error_sending_invitation': 'આમંત્રણ મોકલવામાં ભૂલ',
      'invitation_sent_to': '{name} ને આમંત્રણ મોકલ્યું',
      'volunteer_invitation_sent_to': '{name} ને સ્વયંસેવક આમંત્રણ મોકલ્યું',
      'error_loading_members': 'સભ્યો લોડ કરવામાં ભૂલ: {error}',
      'enter_role': 'કૃપા કરીને ભૂમિકા દાખલ કરો',
      'email': 'ઇમેઇલ',
      'error': 'ભૂલ',
      'member': 'સભ્ય',
      'enter_email': 'કૃપા કરીને ઇમેઇલ અથવા વપરાશકર્તા નામ દાખલ કરો',
      'error_searching_user': 'વપરાશકર્તા શોધવામાં ભૂલ',
      'user_not_found': 'વપરાશકર્તા મળ્યો નથી',
      
      // Param Drishti Content
      'vision_title': 'મનુષ્યમાં દેવત્વનો ઉદય અને પૃથ્વી પર સ્વર્ગનું અવતરણ',
      'vision_description': '''
અખિલ વિશ્વ ગાયત્રી પરિવારની દૃષ્ટિ એ છે કે માનવ જીવન માત્ર ભૌતિક સિદ્ધિઓ સુધી મર્યાદિત ન રહે, પરંતુ તેના અંતરમાં રહેલી દિવ્ય ચેતનાનું જાગરણ થાય.

અમે એવો સમાજ નિર્માણ કરવા માંગીએ છીએ જ્યાં:
• દરેક વ્યક્તિ ચારિત્ર્યવાન અને નૈતિક હોય
• દરેક પરિવાર સંસ્કારોનું કેન્દ્ર બને
• સમાજ સહકાર અને કરુણાના આધાર પર ચાલે
• રાષ્ટ્ર આદર્શ અને શિસ્તનું પ્રતિક બને
• સમગ્ર વિશ્વ “વસુધૈવ કુટુંબકમ્”ની ભાવનાથી સંચાલિત થાય

અમારું લક્ષ્ય માત્ર સુધારણા નથી, પરંતુ ચેતનામાં પરિવર્તન છે —
व्यक्तिથી પરિવાર, પરિવારથી સમાજ, સમાજથી રાષ્ટ્ર અને રાષ્ટ્રથી સમગ્ર વિશ્વ સુધી.
''',
      'mission_title': 'વ્યક્તિ નિર્માણ – પરિવાર નિર્માણ – સમાજ નિર્માણ – રાષ્ટ્ર નિર્માણ',
      'mission_description': '''
ગાયત્રી પરિવારનું મિશન નીચે મુજબ છે:

🔹 1. આત્મિક જાગરણ
• ગાયત્રી મંત્ર જપ
• ધ્યાન અને મનન
• યજ્ઞ સાધના
આ દ્વારા આત્મબળ વધારવું.

🔹 2. સંસ્કારોની પુનઃસ્થાપના
• બાળકોમાં નૈતિક મૂલ્યોનો વિકાસ
• યુવાઓમાં સંસ્કાર જાગૃતિ
• પરિવારમાં સાંસ્કૃતિક પરંપરાનો વિકાસ

🔹 3. વ્યસનમુક્ત અને કુરિતિમુક્ત સમાજ
• વ્યસનોનો ઉચ્છેદ
• અંધશ્રદ્ધા અને સામાજિક બુરાઈઓનો વિરોધ

🔹 4. સેવા અને સહકારની ભાવના
સમાજના નબળા વર્ગો માટે સેવા કાર્યનો વિસ્તાર.

🔹 5. આધ્યાત્મ અને વિજ્ઞાનનો સમન્વય
ધર્મને માત્ર આડંબર નહીં પરંતુ જીવનવિજ્ઞાન તરીકે સ્થાપિત કરવું.
''',
      'yagya_title': 'યજ્ઞના લાભો (Benefits of Yagya)',
      'yagya_description': '''
🟢 આધ્યાત્મિક લાભો
• મનની શુદ્ધિ
• સકારાત્મક ઊર્જામાં વધારો
• માનસિક તણાવમાં ઘટાડો
• આંતરિક શાંતિ

🟢 શારીરિક લાભો
• વાતાવરણ શુદ્ધિકરણ
• રોગપ્રતિકારક શક્તિમાં વધારો
• સૂક્ષ્મ જીવાણુઓનો નાશ

🟢 સામાજિક લાભો
• પરિવારમાં એકતા
• સામૂહિક ભાવનાનો વિકાસ
• સંસ્કારોનો પ્રસાર

🟢 પર્યાવરણલક્ષી લાભો
• વાયુ શુદ્ધિકરણ
• પર્યાવરણ સંતુલન
• કુદરતી ઊર્જાનું સંવર્ધન
''',
      'param_drishti_title': 'પરમ દ્રષ્ટિ',
      'param_drishti_subtitle': 'અમારી દ્રષ્ટિ, મિશન અને આધ્યાત્મિક આંદોલન',
      'param_drishti_card_desc': 'આધ્યાત્મિક ક્રાંતિ - દ્રષ્ટિ, મિશન અને આંદોલન',
      'menu_vision': 'દ્રષ્ટિ (Vision)',
      'vision_short_desc': 'મનુષ્યમાં દેવત્વનો ઉદય',
      'menu_mission': 'મિશન (Mission)',
      'mission_short_desc': 'વ્યક્તિ નિર્માણથી રાષ્ટ્ર નિર્માણ',
      'menu_sapt_aandolan': 'સપ્ત આંદોલન',
      'sapt_aandolan_short_desc': '7 આધ્યાત્મિક આંદોલનો',
      'menu_yagya_benefits': 'યજ્ઞના લાભો',
      'yagya_short_desc': 'વૈજ્ઞાનિક અને આધ્યાત્મિક લાભો',
      'sapt_aandolan_title': 'સપ્ત આંદોલન (Seven Movements)',
      
      'aandolan_sadhana_title': 'સાધના આંદોલન',
      'aandolan_sadhana_purpose': 'આંતરિક શુદ્ધિકરણ અને આત્મબળ વૃદ્ધિ।',
      'aandolan_sadhana_description': '''
વર્ણન:
• ગાયત્રી મંત્ર જપ
• ધ્યાન અને પ્રાણાયામ
• તપ અને સ્વાધ્યાય
• ચારિત્ર્ય નિર્માણ

આ આંદોલન વ્યક્તિને માનસિક, નૈતિક અને આધ્યાત્મિક રીતે મજબૂત બનાવે છે.
''',

      'aandolan_shiksha_title': 'શિક્ષણ આંદોલન',
      'aandolan_shiksha_purpose': 'નૈતિક, સાંસ્કૃતિક અને જીવનોપયોગી શિક્ષણનો પ્રસાર।',
      'aandolan_shiksha_description': '''
વર્ણન:
• મૂલ્ય આધારિત શિક્ષણ
• સંસ્કાર શાળાઓ
• યુવા જાગરણ કાર્યક્રમો
• વ્યક્તિત્વ વિકાસ શિબિરો

શિક્ષણ માત્ર ડિગ્રી માટે નહીં પરંતુ જીવન નિર્માણ માટે છે.
''',

      'aandolan_swasthya_title': 'આરોગ્ય આંદોલન',
      'aandolan_swasthya_purpose': 'શારીરિક, માનસિક અને આધ્યાત્મિક આરોગ્ય।',
      'aandolan_swasthya_description': '''
વર્ણન:
• યોગ અને પ્રાણાયામ
• કુદરતી ઉપચાર
• વ્યસનમુક્તિ અભિયાન
• સાત્વિક જીવનશૈલી

આ આંદોલન સંતુલિત અને ઊર્જાવાન જીવન આપે છે.
''',

      'aandolan_swavalamban_title': 'સ્વાવલંબન આંદોલન',
      'aandolan_swavalamban_purpose': 'આર્થિક આત્મનિર્ભરતા અને શ્રમ સંસ્કૃતિ।',
      'aandolan_swavalamban_description': '''
વર્ણન:
• લઘુ ઉદ્યોગ પ્રોત્સાહન
• કુશળતા વિકાસ
• શ્રમ અને સ્વાભિમાન જાગૃતિ
• આત્મનિર્ભર પરિવારોનું નિર્માણ

સ્વાવલંબન આત્મવિશ્વાસ અને સામાજિક સન્માન વધારશે.
''',

      'aandolan_paryavaran_title': 'પર્યાવરણ આંદોલન',
      'aandolan_paryavaran_purpose': 'પ્રકૃતિ સંરક્ષણ અને સ્વચ્છ પર્યાવરણ।',
      'aandolan_paryavaran_description': '''
વર્ણન:
• વૃક્ષારોપણ અભિયાન
• યજ્ઞ દ્વારા વાયુમંડળ શુદ્ધિકરણ
• જળ સંરક્ષણ
• પ્લાસ્ટિકમુક્ત અભિયાન

આ આંદોલન માનવ અને પ્રકૃતિ વચ્ચે સંતુલન સ્થાપિત કરે છે.
''',

      'aandolan_mahila_jagran_title': 'મહિલા જાગરણ આંદોલન',
      'aandolan_mahila_jagran_purpose': 'નારી શક્તિનો સન્માન અને સશક્તિકરણ।',
      'aandolan_mahila_jagran_description': '''
વર્ણન:
• મહિલા શિક્ષણ
• સંસ્કાર વિકાસ
• પરિવાર સશક્તિકરણ
• નેતૃત્વ વિકાસ

જાગૃત નારી એટલે જાગૃત સમાજ.
''',

      'aandolan_vyasan_mukti_title': 'વ્યસનમુક્તિ અને કુરિતિ ઉચ્છેદ આંદોલન',
      'aandolan_vyasan_mukti_purpose': 'સમાજને બુરાઈઓથી મુક્ત કરવો।',
      'aandolan_vyasan_mukti_description': '''
વર્ણન:
• વ્યસનમુક્તિ અભિયાન
• દહેજ, અંધશ્રદ્ધા, સ્ત્રીભ્રૂણહત્યા જેવી કુરિતિઓનો વિરોધ
• સામાજિક જાગૃતિ કાર્યક્રમો
• જનજાગૃતિ રેલી અને સભાઓ

આ આંદોલન સમાજને શુદ્ધ અને જાગૃત બનાવે છે.
''',
    },
  };
}

class _AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
    const _AppLocalizationsDelegate();
  
    @override
    bool isSupported(Locale locale) {
      return ['en', 'hi', 'mr', 'gu'].contains(locale.languageCode);
    }
  
    @override
    Future<AppLocalizations> load(Locale locale) async {
      return AppLocalizations(locale);
    }
  
    @override
    bool shouldReload(_AppLocalizationsDelegate old) => false;

  // Multi-language Values
  
}



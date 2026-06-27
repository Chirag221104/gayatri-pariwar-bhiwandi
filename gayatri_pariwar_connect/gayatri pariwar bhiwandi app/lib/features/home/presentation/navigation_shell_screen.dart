import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/l10n/app_localizations.dart';

import 'dart:async';
import '../../../core/services/notification_service.dart';
import '../../../core/services/tutorial_service.dart';
import '../../groups/presentation/pending_invitations_screen.dart';

class NavigationShellScreen extends ConsumerStatefulWidget {
  final StatefulNavigationShell navigationShell;

  const NavigationShellScreen({
    required this.navigationShell,
    super.key,
  });

  @override
  ConsumerState<NavigationShellScreen> createState() => _NavigationShellScreenState();
}

class _NavigationShellScreenState extends ConsumerState<NavigationShellScreen> {
  StreamSubscription? _sub;
  final GlobalKey _bottomNavKey = GlobalKey();

  @override
  void initState() {
    super.initState();
    // Register the key with TutorialService
    TutorialService().registerBottomNavKey(_bottomNavKey);
    
    // Use addPostFrameCallback to ensure provider is ready and context is available
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _setupNotificationListener();
    });
  }

  void _setupNotificationListener() {
    final notificationService = ref.read(notificationServiceProvider);
    _sub = notificationService.onNotificationTap.listen((data) {
      _handleNotificationTap(data);
    });
  }

  void _handleNotificationTap(Map<String, dynamic> data) {
    if (!mounted) return;
    
    if (data['type'] == 'chat') {
      final groupId = data['groupId'];
      if (groupId != null) {
        context.go('/groups/$groupId/chat');
      }
    } else if (data['type'] == 'news') {
      final newsId = data['id'];
      if (newsId != null) {
        context.go('/news/$newsId');
      }
    } else if (data['type'] == 'family' || data['type'] == 'family_link_request') {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (context) => PendingInvitationsScreen(initialIndex: 2),
        ),
      );
    }
  }

  @override
  void dispose() {
    _sub?.cancel();
    super.dispose();
  }

  void _onTap(BuildContext context, int index) {
    debugPrint('\n🔵 [BottomNav] Tab tapped: index=$index');
    debugPrint('   Current tab index: ${widget.navigationShell.currentIndex}');
    
    // Get tab names for better logging
    final tabNames = ['Home', 'Groups', 'Feed', 'Spiritual', 'Profile'];
    debugPrint('   Tapped: ${tabNames[index]}');
    debugPrint('   Currently on: ${tabNames[widget.navigationShell.currentIndex]}');
    
    // CRITICAL: Use rootNavigator to dismiss all modal screens (homework, family links, etc.)
    // that were pushed with Navigator.push on top of the tab navigation
    final rootNavigator = Navigator.of(context, rootNavigator: true);
    
    debugPrint('   🔍 Checking for modal routes to dismiss...');
    int poppedCount = 0;
    while (rootNavigator.canPop()) {
      debugPrint('      Popping modal route #$poppedCount');
      rootNavigator.pop();
      poppedCount++;
    }
    debugPrint('   ✅ Dismissed $poppedCount modal route(s)');
    
    // CRITICAL FIX for Profile tab: Use context.go() to force navigation to root
    // This clears nested GoRouter routes like: /profile/family/practice/homework
    if (index == 4) {
      debugPrint('   🎯 PROFILE TAB: Force navigating to root /profile route');
      context.go('/profile');
      debugPrint('   ✅ Navigation to /profile completed\n');
      return; // Don't call goBranch, we already navigated
    }
    
    // For other tabs, use the normal branch navigation
    final shouldResetToRoot = index == widget.navigationShell.currentIndex;
    debugPrint('   📍 Calling goBranch(index=$index, initialLocation=$shouldResetToRoot)');
    
    widget.navigationShell.goBranch(
      index,
      initialLocation: shouldResetToRoot,
    );
    
    debugPrint('   ✅ Navigation command completed\n');
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    
    return Scaffold(
      body: widget.navigationShell,
      bottomNavigationBar: BottomNavigationBar(
        key: _bottomNavKey,
        currentIndex: widget.navigationShell.currentIndex,
        onTap: (index) => _onTap(context, index),
        type: BottomNavigationBarType.fixed,
        selectedItemColor: AppColors.primarySaffron,
        unselectedItemColor: AppColors.textSecondary,
        items: [
          BottomNavigationBarItem(
            icon: const Icon(Icons.home),
            label: l10n?.home ?? 'Home',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.groups),
            label: l10n?.groups ?? 'Groups',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.photo_library),
            label: l10n?.feed ?? 'Feed',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.self_improvement),
            label: l10n?.spiritual ?? 'Spiritual',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.person),
            label: l10n?.profile ?? 'Profile',
          ),
        ],
      ),
    );
  }
}


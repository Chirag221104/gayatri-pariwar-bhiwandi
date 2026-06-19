import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/l10n/app_localizations.dart';
import '../../auth/presentation/providers/auth_provider.dart';
import '../data/event_repository.dart';
import 'event_detail_screen.dart';
import '../../../core/auth/user_roles.dart';
import 'create_event_dialog.dart';

import 'dart:async';

enum EventFilter { all, upcoming, ongoing, past }

class EventsScreen extends ConsumerStatefulWidget {
  const EventsScreen({super.key});

  @override
  ConsumerState<EventsScreen> createState() => _EventsScreenState();
}

class _EventsScreenState extends ConsumerState<EventsScreen> {
  EventFilter _selectedFilter = EventFilter.upcoming;
  String _searchQuery = '';
  Timer? _refreshTimer;

  @override
  void initState() {
    super.initState();
    // Refresh UI every minute to update "Upcoming/Past" status
    _refreshTimer = Timer.periodic(const Duration(minutes: 1), (timer) {
      if (mounted) {
        setState(() {});
      }
    });
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final eventsAsync = ref.watch(eventsStreamProvider);
    final user = ref.watch(currentUserDataProvider).valueOrNull;
    final isAdmin = user?.role == UserRole.admin;
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n?.events ?? 'Events'),
        backgroundColor: AppColors.primarySaffron,
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
            child: TextField(
              decoration: InputDecoration(
                hintText: l10n?.search ?? 'Search...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
              onChanged: (value) => setState(() => _searchQuery = value),
            ),
          ),
          
          // Filter Chips
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _FilterChip(
                    label: l10n?.all ?? 'All',
                    isSelected: _selectedFilter == EventFilter.all,
                    onTap: () {
                      if (kDebugMode) print('🔍 EventsScreen: Filter changed to All');
                      setState(() => _selectedFilter = EventFilter.all);
                    },
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: l10n?.upcomingEvents ?? 'Upcoming',
                    isSelected: _selectedFilter == EventFilter.upcoming,
                    onTap: () {
                      if (kDebugMode) print('🔍 EventsScreen: Filter changed to Upcoming');
                      setState(() => _selectedFilter = EventFilter.upcoming);
                    },
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: l10n?.ongoing ?? 'Ongoing',
                    isSelected: _selectedFilter == EventFilter.ongoing,
                    onTap: () {
                      if (kDebugMode) print('🔍 EventsScreen: Filter changed to Ongoing');
                      setState(() => _selectedFilter = EventFilter.ongoing);
                    },
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: l10n?.completed ?? 'Past',
                    isSelected: _selectedFilter == EventFilter.past,
                    onTap: () {
                      if (kDebugMode) print('🔍 EventsScreen: Filter changed to Past');
                      setState(() => _selectedFilter = EventFilter.past);
                    },
                  ),
                ],
              ),
            ),
          ),
          
          // Events List
          Expanded(
            child: eventsAsync.when(
              data: (allEvents) {
                // Sort events by date
                final sortedEvents = List.from(allEvents)
                  ..sort((a, b) => b.eventDate.compareTo(a.eventDate));

                // Filter events based on selected filter
                final now = DateTime.now();
                final filteredEvents = sortedEvents.where((event) {
                  if (_searchQuery.isNotEmpty) {
                    final query = _searchQuery.toLowerCase();
                    if (!event.title.toLowerCase().contains(query) &&
                        !event.location.toLowerCase().contains(query)) {
                      return false;
                    }
                  }

                  final effectiveEndDate = (event.isMultiDay && event.endDate != null) ? event.endDate! : event.eventDate;
                  final isPast = effectiveEndDate.isBefore(now);
                  final isUpcoming = event.eventDate.isAfter(now);
                  final isOngoing = !isPast && !isUpcoming;
                  switch (_selectedFilter) {
                    case EventFilter.all:
                      return true;
                    case EventFilter.upcoming:
                      return isUpcoming;
                    case EventFilter.ongoing:
                      return isOngoing;
                    case EventFilter.past:
                      return isPast;
                  }
                }).toList();

                if (kDebugMode) {
                  print('📊 EventsScreen: Total events: ${allEvents.length}');
                  print('   Filtered events: ${filteredEvents.length}');
                  print('   Current filter: $_selectedFilter');
                }

                if (filteredEvents.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.event_busy, size: 80, color: Colors.grey),
                        const SizedBox(height: 16),
                        Text(
                          _getEmptyMessage(l10n),
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          isAdmin
                              ? (l10n?.createEvent ?? 'Create your first event to get started')
                              : (l10n?.noEventsScheduled ?? 'Check back later for events'),
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: Colors.grey,
                              ),
                        ),
                      ],
                    ),
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: filteredEvents.length,
                  itemBuilder: (context, index) {
                    final event = filteredEvents[index];
                    final effectiveEndDate = (event.isMultiDay && event.endDate != null) ? event.endDate! : event.eventDate;
                    final isPast = effectiveEndDate.isBefore(now);
                    
                    return Card(
                      margin: const EdgeInsets.only(bottom: 16),
                      child: InkWell(
                        onTap: () {
                          if (kDebugMode) print('👆 EventsScreen: Tapped on event "${event.title}"');
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => EventDetailScreen(eventId: event.id, event: event),
                            ),
                          );
                        },
                        borderRadius: BorderRadius.circular(12),
                        child: Padding(
                          padding: const EdgeInsets.all(12),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Date Badge
                              Container(
                                width: 60,
                                height: 60,
                                decoration: BoxDecoration(
                                  color: isPast
                                      ? Colors.grey.shade200
                                      : AppColors.primarySaffron.withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      DateFormat('MMM').format(event.eventDate),
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: isPast ? Colors.grey : AppColors.primarySaffron,
                                      ),
                                    ),
                                    Text(
                                      DateFormat('dd').format(event.eventDate),
                                      style: TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold,
                                        color: isPast ? Colors.grey : AppColors.primarySaffron,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 12),
                              
                              // Event Details
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    // Title - wrap instead of ellipsis
                                    Text(
                                      event.title,
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: isPast ? Colors.grey : null,
                                      ),
                                      softWrap: true,
                                    ),
                                    const SizedBox(height: 4),
                                    // Time
                                    Row(
                                      children: [
                                        Icon(Icons.access_time, size: 16, color: Colors.grey.shade600),
                                        const SizedBox(width: 4),
                                        Text(
                                          DateFormat('hh:mm a').format(event.eventDate),
                                          style: const TextStyle(fontWeight: FontWeight.bold),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 2),
                                    // Location - wrap instead of ellipsis
                                    Row(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Icon(Icons.location_on, size: 16, color: Colors.grey.shade600),
                                        const SizedBox(width: 4),
                                        Expanded(
                                          child: Text(
                                            event.location,
                                            softWrap: true,
                                          ),
                                        ),
                                      ],
                                    ),
                                    if (event.description.isNotEmpty) ...[
                                      const SizedBox(height: 4),
                                      Text(
                                        event.description,
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                        style: TextStyle(
                                          color: Colors.grey.shade600,
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                              
                              // Arrow Icon
                              Icon(
                                Icons.arrow_forward_ios,
                                size: 16,
                                color: Colors.grey.shade400,
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (error, stack) => Center(
                child: Text('${l10n?.error ?? "Error"}: $error'),
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: isAdmin
          ? FloatingActionButton(
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => const CreateEventDialog(),
                );
              },
              backgroundColor: AppColors.primarySaffron,
              child: const Icon(Icons.add),
            )
          : null,
    );
  }

  String _getEmptyMessage(AppLocalizations? l10n) {
    switch (_selectedFilter) {
      case EventFilter.all:
        return l10n?.noEventsScheduled ?? 'No events yet';
      case EventFilter.upcoming:
        return l10n?.noEvents ?? 'No upcoming events';
      case EventFilter.ongoing:
        return l10n?.noOngoingEvents ?? 'No ongoing events';
      case EventFilter.past:
        return l10n?.noEventsScheduled ?? 'No past events';
    }
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Chip(
        label: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : AppColors.primarySaffron,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
        backgroundColor: isSelected
            ? AppColors.primarySaffron
            : AppColors.primarySaffron.withValues(alpha: 0.1),
        side: BorderSide(
          color: isSelected ? AppColors.primarySaffron : Colors.transparent,
        ),
      ),
    );
  }
}

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../domain/global_event.dart';
import '../../auth/presentation/providers/auth_provider.dart';

abstract class EventRepository {
  Stream<List<GlobalEvent>> getEvents();
  Future<void> createEvent(GlobalEvent event);
  Future<void> updateEvent(GlobalEvent event);
  Future<void> deleteEvent(String eventId);
  Future<GlobalEvent?> getEvent(String eventId);
  Stream<GlobalEvent?> getEventStream(String eventId);
}

class FirebaseEventRepository implements EventRepository {
  final FirebaseFirestore _firestore;

  FirebaseEventRepository(this._firestore);

  @override
  Stream<List<GlobalEvent>> getEvents() {
    // Removed .orderBy to avoid Firestore index requirement
    // Sorting is done client-side in the UI layer instead
    return _firestore
        .collection('events')
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => GlobalEvent.fromFirestore(doc))
            .toList());
  }

  @override
  Future<void> createEvent(GlobalEvent event) async {
    if (kDebugMode) print('📝 EventRepository: Creating event "${event.title}"');
    await _firestore
        .collection('events')
        .add(event.toFirestore());
    if (kDebugMode) print('✅ EventRepository: Event created successfully');
  }

  @override
  Future<void> updateEvent(GlobalEvent event) async {
    if (kDebugMode) print('💾 EventRepository: Updating event ${event.id}');
    await _firestore
        .collection('events')
        .doc(event.id)
        .update(event.toFirestore());
    if (kDebugMode) print('✅ EventRepository: Event updated successfully');
  }

  @override
  Future<void> deleteEvent(String eventId) async {
    if (kDebugMode) print('🗑️ EventRepository: Deleting event $eventId');
    await _firestore
        .collection('events')
        .doc(eventId)
        .delete();
    if (kDebugMode) print('✅ EventRepository: Event deleted successfully');
  }

  @override
  Future<GlobalEvent?> getEvent(String eventId) async {
    try {
      final doc = await _firestore.collection('events').doc(eventId).get();
      if (doc.exists) {
        return GlobalEvent.fromFirestore(doc);
      }
      return null;
    } catch (e) {
      if (kDebugMode) print('❌ EventRepository: Error fetching event: $e');
      return null;
    }
  }

  @override
  Stream<GlobalEvent?> getEventStream(String eventId) {
    return _firestore
        .collection('events')
        .doc(eventId)
        .snapshots()
        .map((doc) {
          if (doc.exists) {
            return GlobalEvent.fromFirestore(doc);
          }
          return null;
        });
  }
}

final eventRepositoryProvider = Provider<EventRepository>((ref) {
  return FirebaseEventRepository(FirebaseFirestore.instance);
});

final eventsStreamProvider = StreamProvider<List<GlobalEvent>>((ref) {
  final user = ref.watch(currentUserDataProvider);
  
  // If user is not logged in, return empty list and don't listen to Firestore
  if (user.value == null) {
    return Stream.value([]);
  }

  return ref.read(eventRepositoryProvider).getEvents();
});

final eventParamsStreamProvider = StreamProvider.family<GlobalEvent?, String>((ref, eventId) {
  final user = ref.watch(currentUserDataProvider);
  if (user.value == null) return Stream.value(null);
  return ref.read(eventRepositoryProvider).getEventStream(eventId);
});

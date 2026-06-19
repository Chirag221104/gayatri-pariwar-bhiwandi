import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'dart:ui';

/// Full-screen photo viewer for event photos
/// Supports swipe between photos, pinch to zoom, and BoxFit.contain display
class EventPhotoViewer extends StatefulWidget {
  final List<String> photos;
  final int initialIndex;
  final String? eventTitle;

  const EventPhotoViewer({
    super.key,
    required this.photos,
    this.initialIndex = 0,
    this.eventTitle,
  });

  @override
  State<EventPhotoViewer> createState() => _EventPhotoViewerState();
}

class _EventPhotoViewerState extends State<EventPhotoViewer> {
  late PageController _pageController;
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _pageController = PageController(initialPage: _currentIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black.withValues(alpha: 0.7),
        foregroundColor: Colors.white,
        title: Text(
          widget.eventTitle ?? 'Event Photos',
          style: const TextStyle(color: Colors.white),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Center(
              child: Text(
                '${_currentIndex + 1} / ${widget.photos.length}',
                style: const TextStyle(color: Colors.white70),
              ),
            ),
          ),
        ],
      ),
      body: Stack(
        children: [
          // Blurred background for current image
          if (widget.photos.isNotEmpty)
            Positioned.fill(
              child: CachedNetworkImage(
                imageUrl: widget.photos[_currentIndex],
                fit: BoxFit.cover,
                imageBuilder: (context, imageProvider) => Container(
                  decoration: BoxDecoration(
                    image: DecorationImage(
                      image: imageProvider,
                      fit: BoxFit.cover,
                    ),
                  ),
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
                    child: Container(
                      color: Colors.black.withValues(alpha: 0.5),
                    ),
                  ),
                ),
                errorWidget: (context, url, error) => Container(color: Colors.black),
              ),
            ),
          
          // Photo PageView
          PageView.builder(
            controller: _pageController,
            itemCount: widget.photos.length,
            onPageChanged: (index) {
              setState(() {
                _currentIndex = index;
              });
            },
            itemBuilder: (context, index) {
              return InteractiveViewer(
                minScale: 0.5,
                maxScale: 4.0,
                child: Center(
                  child: CachedNetworkImage(
                    imageUrl: widget.photos[index],
                    fit: BoxFit.contain,
                    placeholder: (context, url) => const Center(
                      child: CircularProgressIndicator(color: Colors.white),
                    ),
                    errorWidget: (context, url, error) => const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.error, color: Colors.white, size: 48),
                          SizedBox(height: 8),
                          Text('Failed to load image', style: TextStyle(color: Colors.white)),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
          
          // Page indicator dots at bottom
          if (widget.photos.length > 1)
            Positioned(
              bottom: 20,
              left: 0,
              right: 0,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(widget.photos.length, (index) {
                  return Container(
                    width: 8,
                    height: 8,
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _currentIndex == index 
                          ? Colors.white 
                          : Colors.white.withValues(alpha: 0.4),
                    ),
                  );
                }),
              ),
            ),
        ],
      ),
    );
  }
}

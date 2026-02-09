'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import Image from 'next/image';

interface LightboxImage {
    src: string;
    alt?: string;
    caption?: string;
}

interface ImageLightboxProps {
    isOpen: boolean;
    currentIndex: number;
    images: LightboxImage[];
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

const variants = {
    enter: (direction: number) => {
        return {
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => {
        return {
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        };
    }
};

export default function ImageLightbox({
    isOpen,
    currentIndex,
    images,
    onClose,
    onNext,
    onPrev
}: ImageLightboxProps) {
    // Handle keyboard navigation
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!isOpen) return;

        switch (event.key) {
            case 'Escape':
                onClose();
                break;
            case 'ArrowLeft':
                onPrev();
                break;
            case 'ArrowRight':
                onNext();
                break;
        }
    }, [isOpen, onClose, onNext, onPrev]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Direction state for animation not strictly standard here without 'custom' prop tracking
    // For simplicity with AnimatePresence, we usually need a direction tracker.
    // However, since we are controlling props from outside, passing direction might be complex.
    // We'll stick to simple fade/scale or just x-axis if we can infer direction effectively,
    // but without direction state, it's hard to know which way to slide.
    // Let's settle for a nice zoom/fade which is layout-safe and feels premium.

    if (!isOpen || images.length === 0) return null;

    const currentImage = images[currentIndex];

    // Helper to download current image
    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Use local proxy API to bypass CORS and force download
        const downloadUrl = `/api/download?url=${encodeURIComponent(currentImage.src)}&name=${encodeURIComponent(currentImage.alt || 'image')}`;
        window.location.href = downloadUrl;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center"
                    onClick={onClose} // Backdrop click to close
                >
                    {/* Controls */}
                    <div className="absolute top-6 right-6 z-50 flex items-center gap-4">
                        <button
                            onClick={handleDownload}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                            title="Download"
                        >
                            <Download size={24} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <button
                                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-50 p-2 md:p-4 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-full transition-all hover:scale-110 active:scale-95"
                                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                            >
                                <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
                            </button>
                            <button
                                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-50 p-2 md:p-4 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-full transition-all hover:scale-110 active:scale-95"
                                onClick={(e) => { e.stopPropagation(); onNext(); }}
                            >
                                <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
                            </button>
                        </>
                    )}

                    {/* Main Image */}
                    <div
                        className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 md:p-10 flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image area
                    >
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="relative w-full h-full flex items-center justify-center"
                        >
                            {/* We use next/image but logic for 'fill' mode needs parent to have relative/size */}
                            <div className="relative w-full h-full">
                                <Image
                                    src={currentImage.src}
                                    alt={currentImage.alt || 'Gallery Image'}
                                    fill
                                    className="object-contain"
                                    sizes="100vw"
                                    priority
                                />
                            </div>
                        </motion.div>

                        {/* Caption */}
                        {(currentImage.caption || currentImage.alt) && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-10 left-0 right-0 text-center pointer-events-none"
                            >
                                <p className="bg-black/50 backdrop-blur-md text-white px-6 py-3 rounded-full inline-block max-w-3xl text-sm md:text-base border border-white/10">
                                    {currentImage.caption || currentImage.alt}
                                </p>
                            </motion.div>
                        )}

                        {/* Counter */}
                        {images.length > 1 && (
                            <div className="absolute top-6 left-6 z-50 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                <span className="text-white text-sm font-medium tracking-widest">
                                    {currentIndex + 1} / {images.length}
                                </span>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

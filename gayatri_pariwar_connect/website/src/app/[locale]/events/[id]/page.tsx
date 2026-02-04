'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

import ImageLightbox from '@/components/ImageLightbox';

interface EventDetail {
    id: string;
    title: string;
    description: string;
    eventDate: Timestamp;
    location: string;
    imageUrl?: string;
    photos?: string[];
    type: string;
}

export default function EventDetailPage() {
    const t = useTranslations('events');
    const locale = useLocale();
    const params = useParams();
    const id = params.id as string;
    const [event, setEvent] = useState<EventDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string | null>(null);

    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    useEffect(() => {
        async function fetchEventDetail() {
            if (!id) return;
            try {
                setLoading(true);
                const docRef = doc(db, 'events', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.id ? { id: docSnap.id, ...docSnap.data() } as EventDetail : null;
                    setEvent(data);
                    if (data?.imageUrl) setActiveImage(data.imageUrl);
                    else if (data?.photos && data.photos.length > 0) setActiveImage(data.photos[0]);
                }
            } catch (err) {
                console.error("Error fetching event detail:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchEventDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center py-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container mx-auto max-w-4xl py-20 text-center">
                <h1 className="text-3xl font-black mb-4 font-display text-foreground">{t('detail.not_found_title')}</h1>
                <p className="text-muted mb-8 font-medium">{t('detail.not_found_desc')}</p>
                <Link href={`/${locale}/events`} className="bg-saffron text-white font-black py-4 px-10 rounded-2xl shadow-lg hover:bg-saffron-dark transition">
                    {t('detail.back_to_events')}
                </Link>
            </div>
        );
    }

    const allPhotos = [
        ...(event.imageUrl ? [event.imageUrl] : []),
        ...(event.photos || [])
    ].filter((v, i, a) => a.indexOf(v) === i); // Unique photos

    const isPast = event.eventDate?.toMillis() < Date.now();

    return (
        <div className="bg-background min-h-screen pb-20 font-body">
            {/* Event Header Section */}
            <section className="bg-white/5 dark:bg-slate-900/40 border-b border-white/10 py-12">
                <div className="container mx-auto max-w-6xl px-4 flex flex-col md:flex-row gap-12 items-center">
                    {/* Image Box */}
                    <div className="md:w-1/2 w-full space-y-4">
                        <div
                            className="aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 relative bg-muted cursor-pointer group"
                            onClick={() => {
                                if (activeImage) {
                                    const index = allPhotos.indexOf(activeImage);
                                    if (index !== -1) {
                                        setLightboxIndex(index);
                                        setLightboxOpen(true);
                                    }
                                }
                            }}
                        >
                            {activeImage ? (
                                <>
                                    <img
                                        src={activeImage}
                                        alt={event.title}
                                        className={`w-full h-full object-cover transition-opacity duration-300 ${isPast ? 'grayscale-[20%]' : ''}`}
                                    />
                                    {/* Zoom Icon Overlay */}
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white border border-white/30">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-saffron/20 to-orange-50 dark:from-saffron/10 dark:to-slate-800 flex items-center justify-center text-8xl">
                                    {event.type === 'yagya' ? '🔥' : '🕉️'}
                                </div>
                            )}
                            <div className="absolute top-6 left-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-saffron-dark uppercase tracking-widest border border-white/50 dark:border-white/10 shadow-sm z-10">
                                {t(`categories.${event.type?.toLowerCase() || 'general'}`)}
                            </div>
                            {isPast && (
                                <div className="absolute top-6 right-6 bg-gray-900/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/20 z-10">
                                    {t('detail.past_badge')}
                                </div>
                            )}
                        </div>

                        {/* Gallery Thumbnails */}
                        {allPhotos.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {allPhotos.map((photo, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(photo)}
                                        className={`relative w-24 aspect-video rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === photo ? 'border-saffron ring-4 ring-saffron/20 shadow-md scale-95' : 'border-transparent hover:border-white/20'
                                            } ${isPast ? 'grayscale-[20%]' : ''}`}
                                    >
                                        <img src={photo} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="md:w-1/2 text-center md:text-left">
                        <time className="text-saffron-dark font-black text-sm uppercase tracking-[0.2em] mb-4 block">
                            {event.eventDate?.toDate().toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </time>
                        <h1 className="text-4xl md:text-5xl font-black text-foreground font-display mb-8 leading-[1.1]">
                            {event.title}
                        </h1>

                        <div className="flex flex-col gap-4 text-muted mb-10">
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <div className="w-10 h-10 bg-muted/10 rounded-full flex items-center justify-center text-saffron-dark">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                                </div>
                                <span className="font-black text-foreground">
                                    {event.eventDate?.toDate().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <div className="w-10 h-10 bg-muted/10 rounded-full flex items-center justify-center text-saffron-dark">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                                </div>
                                <span className="font-black text-foreground">{event.location}</span>
                            </div>
                        </div>

                        {!isPast ? (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="bg-saffron text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-saffron/20 hover:bg-saffron-dark transition transform hover:-translate-y-1 active:scale-95 text-[10px] uppercase tracking-widest">
                                    {t('detail.register_cta')}
                                </button>
                                <button className="border-2 border-muted/10 text-muted font-black py-4 px-10 rounded-2xl hover:bg-muted/5 transition text-[10px] uppercase tracking-widest active:scale-95">
                                    {t('detail.calendar_cta')}
                                </button>
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-3 px-8 py-4 bg-muted/5 text-muted rounded-2xl font-black text-[10px] uppercase tracking-widest border border-muted/10">
                                <svg className="w-5 h-5 text-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
                                {t('detail.concluded_msg')}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Description Section */}
            <section className="container mx-auto max-w-4xl px-4 py-16">
                <h2 className="text-2xl font-black font-display text-foreground mb-8 flex items-center gap-3">
                    <span className="w-8 h-1 bg-saffron rounded-full"></span>
                    {t('detail.desc_title')}
                </h2>
                <div className="glass p-10 rounded-[2.5rem] border-white/10 text-muted leading-relaxed text-lg whitespace-pre-wrap font-medium opacity-90">
                    {event.description}
                </div>

                <div className="mt-16 flex items-center justify-between">
                    <Link href={`/${locale}/events`} className="flex items-center gap-2 text-saffron-dark font-black hover:gap-4 transition-all uppercase text-[10px] tracking-widest group">
                        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16l-4-4m0 0l4-4m-4 4h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                        {t('detail.all_programs_link')}
                    </Link>
                </div>
            </section>

            <ImageLightbox
                isOpen={lightboxOpen}
                currentIndex={lightboxIndex}
                images={allPhotos.map(url => ({ src: url, alt: event.title, caption: event.title }))}
                onClose={() => setLightboxOpen(false)}
                onNext={() => setLightboxIndex(prev => (prev + 1) % allPhotos.length)}
                onPrev={() => setLightboxIndex(prev => (prev - 1 + allPhotos.length) % allPhotos.length)}
            />
        </div>
    );
}

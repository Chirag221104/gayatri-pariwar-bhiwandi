'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion, Variants } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Sparkles, Share2 } from 'lucide-react';

interface Event {
    id: string;
    title: string;
    description: string;
    eventDate: Timestamp;
    location: string;
    imageUrl?: string;
    photos?: string[];
    type: string;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

import ImageLightbox from '@/components/ImageLightbox';

export default function EventsPage() {
    const t = useTranslations('events');
    const locale = useLocale();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [now, setNow] = useState<number>(0);

    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        setNow(Date.now());
        async function fetchEvents() {
            try {
                setLoading(true);
                const q = query(collection(db, 'events'), orderBy('eventDate', 'desc'));
                const querySnapshot = await getDocs(q);

                const fetchedEvents: Event[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedEvents.push({ id: doc.id, ...doc.data() } as Event);
                });

                setEvents(fetchedEvents);
            } catch (err) {
                console.error("Error fetching events:", err);
                setError("Failed to load events");
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, []);

    const upcomingEvents = events.filter(e => e.eventDate.toMillis() >= now);
    const pastEvents = events.filter(e => e.eventDate.toMillis() < now);

    // Combine for lightbox navigation (Upcoming then Past)
    const allDisplayEvents = [...upcomingEvents, ...pastEvents];

    const openLightbox = (eventId: string) => {
        const index = allDisplayEvents.findIndex(e => e.id === eventId);
        if (index !== -1) {
            setCurrentImageIndex(index);
            setLightboxOpen(true);
        }
    };

    const handleShare = (event: Event) => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({
                title: event.title,
                text: event.description,
                url: `${window.location.origin}/${locale}/events/${event.id}`,
            }).catch(err => console.error("Error sharing:", err));
        } else if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(`${event.title} - ${window.location.origin}/${locale}/events/${event.id}`);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className="bg-background min-h-screen pb-32 font-body">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden mesh-gradient">
                <Image
                    src="/events-hero.png"
                    alt="Events Background"
                    fill
                    className="object-cover opacity-20 dark:opacity-10 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-black/[0.03] dark:bg-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative z-10 text-center container mx-auto px-6"
                >
                    <span className="text-saffron font-black text-[10px] md:text-xs uppercase tracking-[0.5em] block mb-6 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full w-fit mx-auto border border-white/20">
                        {t('header.badge')}
                    </span>
                    <h1 className="text-6xl md:text-9xl font-black !text-slate-950 dark:!text-white font-display leading-[1.1] tracking-[calc(-0.04em)] mb-8 title-shadow">
                        {t('header.title')}
                    </h1>
                    <p className="!text-[#B5550C] text-base md:text-xl font-bold max-w-2xl mx-auto leading-relaxed">
                        {t('header.desc')}
                    </p>
                </motion.div>
            </section>

            <div className="container mx-auto px-6 max-w-7xl -mt-16 relative z-20">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <div className="w-16 h-16 border-4 border-saffron/20 border-t-saffron rounded-full animate-spin"></div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted">Gathering Wisdom...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 glass dark:glass-dark rounded-[3rem] border-red-500/20 max-w-2xl mx-auto shadow-2xl">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                            <Sparkles size={40} />
                        </div>
                        <h2 className="text-2xl font-black mb-2">Pardon the Interruption</h2>
                        <p className="text-muted font-medium">{error}</p>
                    </div>
                ) : (
                    <div className="space-y-32">
                        {/* Upcoming Events */}
                        <motion.section
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 bg-saffron rounded-full"></div>
                                        <h2 className="text-3xl md:text-4xl font-black text-foreground font-display uppercase tracking-wider">
                                            {t('upcoming.title')}
                                        </h2>
                                    </div>
                                    <p className="text-muted text-sm font-medium opacity-70 ml-5">{t('upcoming.desc')}</p>
                                </div>
                                <div className="px-6 py-2 bg-saffron/10 text-saffron-dark rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-saffron/20 shadow-lg shadow-saffron/10">
                                    {upcomingEvents.length} {t('upcoming.active_count')}
                                </div>
                            </div>

                            {upcomingEvents.length === 0 ? (
                                <motion.div variants={itemVariants} className="text-center py-24 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[3rem] text-muted font-black tracking-widest uppercase text-xs italic border border-white/20 dark:border-white/5 shadow-xl">
                                    {t('upcoming.empty')}
                                </motion.div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {upcomingEvents.map((event) => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            now={now}
                                            onShare={() => handleShare(event)}
                                            onImageClick={() => openLightbox(event.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.section>

                        {/* Past Events */}
                        <motion.section
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-4 mb-16 px-4 md:px-0 opacity-60">
                                <div className="w-1.5 h-6 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                                <h2 className="text-2xl font-black text-foreground font-display uppercase tracking-widest">
                                    {t('past.title')}
                                </h2>
                            </div>

                            {pastEvents.length === 0 ? (
                                <motion.div variants={itemVariants} className="text-center py-20 px-10 bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm rounded-[3rem] text-muted opacity-60 font-bold italic border border-white/10 dark:border-white/5 shadow-inner">
                                    {t('past.empty')}
                                </motion.div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {pastEvents.map((event) => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            now={now}
                                            onShare={() => handleShare(event)}
                                            onImageClick={() => openLightbox(event.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.section>
                    </div>
                )}
            </div>

            <ImageLightbox
                isOpen={lightboxOpen}
                currentIndex={currentImageIndex}
                images={allDisplayEvents.map(e => ({
                    src: e.imageUrl || (e.photos && e.photos[0] ? e.photos[0] : '/logo.png'),
                    alt: e.title,
                    caption: e.title
                }))}
                onClose={() => setLightboxOpen(false)}
                onNext={() => setCurrentImageIndex(prev => (prev + 1) % allDisplayEvents.length)}
                onPrev={() => setCurrentImageIndex(prev => (prev - 1 + allDisplayEvents.length) % allDisplayEvents.length)}
            />
        </div>
    );
}

function EventCard({ event, now, onShare, onImageClick }: { event: Event, now: number, onShare: () => void, onImageClick: () => void }) {
    const t = useTranslations('events.card');
    const locale = useLocale();
    const isPast = event.eventDate.toMillis() < now;
    const displayImage = event.imageUrl || (event.photos && event.photos.length > 0 ? event.photos[0] : null);

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ y: -10 }}
            className={`flex flex-col h-full bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden group shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-2xl transition-all duration-500 ${isPast ? 'opacity-70 grayscale-[30%] hover:grayscale-0 hover:opacity-100' : ''}`}
        >
            {/* Image Container */}
            <div
                className="relative h-64 overflow-hidden bg-muted/20 cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    onImageClick();
                }}
            >
                {displayImage ? (
                    <Image
                        src={displayImage}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center p-16">
                        <Image src="/logo.png" alt="Placeholder" width={100} height={100} className="opacity-20 object-contain" />
                    </div>
                )}

                {/* Overlay Badges */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onShare();
                        }}
                        className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-saffron hover:text-white transition-all shadow-xl active:scale-90 border border-white/10"
                    >
                        <Share2 size={16} />
                    </button>
                </div>

                <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl backdrop-blur-md border border-white/20 ${isPast ? 'bg-slate-800/80 text-slate-300' : 'bg-saffron/90 text-white'}`}>
                    {event.type || t('default_type')}
                </div>

                {!isPast && (
                    <div className="absolute bottom-6 left-6 flex items-center gap-3">
                        <div className="bg-white/95 dark:bg-slate-900/95 p-3 rounded-2xl shadow-2xl border border-white/50 flex flex-col items-center justify-center min-w-[50px]">
                            <span className="text-[10px] font-black uppercase text-saffron leading-none mb-1" suppressHydrationWarning>
                                {event.eventDate.toDate().toLocaleDateString(locale, { month: 'short' })}
                            </span>
                            <span className="text-xl font-black text-foreground leading-none">
                                {event.eventDate.toDate().getDate()}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-10 flex-grow flex flex-col">
                <div className="flex items-center gap-6 mb-6">
                    {isPast && (
                        <div className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest" suppressHydrationWarning>
                            <Calendar size={12} className="text-saffron" />
                            {event.eventDate.toDate().toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    )}
                    {event.location && (
                        <div className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest truncate">
                            <MapPin size={12} className="text-saffron shrink-0" />
                            {event.location}
                        </div>
                    )}
                </div>

                <h3 className={`text-2xl font-black mb-4 font-display leading-tight tracking-tight transition-colors ${isPast ? 'text-muted' : 'text-foreground group-hover:text-saffron-dark'}`}>
                    {event.title}
                </h3>

                <p className="text-muted text-sm leading-relaxed mb-8 flex-grow line-clamp-3 font-medium opacity-80">
                    {event.description}
                </p>

                <Link
                    href={`/${locale}/events/${event.id}`}
                    className={`group/btn flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border-2 ${isPast ? 'border-muted/10 text-muted hover:bg-muted/5' : 'bg-saffron text-white border-saffron shadow-lg shadow-saffron/10 hover:shadow-saffron/30 hover:-translate-y-1 active:scale-95'}`}
                >
                    {isPast ? t('cta_past') : t('cta_upcoming')}
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
}


'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Newspaper, Calendar, ArrowRight, Tag, Sparkles, Share2 } from 'lucide-react';

interface NewsItem {
    id: string;
    title: string;
    shortDescription: string;
    imageUrl: string;
    category: string;
    isImportant: boolean;
    createdAt: Timestamp;
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

export default function NewsPage() {
    const t = useTranslations('news');
    const locale = useLocale();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const categories = ['All', 'General', 'Events', 'Sadhana', 'Social', 'Yagya', 'Spiritual', 'Youth'];

    useEffect(() => {
        async function fetchNews() {
            try {
                setLoading(true);
                const newsRef = collection(db, 'news');
                const q = query(
                    newsRef,
                    where('status', '==', 'published')
                );
                const snap = await getDocs(q);
                const fetchedNews = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));

                fetchedNews.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));

                setNews(fetchedNews);
            } catch (err) {
                console.error("Error fetching news:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchNews();
    }, []);

    const filteredNews = activeCategory === 'All'
        ? news
        : news.filter(item => item.category?.toLowerCase() === activeCategory.toLowerCase());

    const handleShare = (item: NewsItem) => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({
                title: item.title,
                text: item.shortDescription,
                url: `${window.location.origin}/${locale}/news/${item.id}`,
            }).catch(err => console.error("Error sharing:", err));
        } else if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(`${item.title} - ${window.location.origin}/${locale}/news/${item.id}`);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className="bg-background min-h-screen pb-32 font-body">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden mesh-gradient">
                <Image
                    src="/news-hero.png"
                    alt="News Background"
                    fill
                    className="object-cover opacity-20 dark:opacity-10 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-black/[0.03] dark:bg-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative z-10 text-center container mx-auto px-6"
                >
                    <span className="text-saffron font-black text-[10px] md:text-xs uppercase tracking-[0.5em] block mb-6 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full w-fit mx-auto border border-white/20">
                        {t('header.badge')}
                    </span>
                    <h1 className="text-6xl md:text-9xl font-black !text-slate-950 dark:!text-white font-display leading-[1.1] tracking-[calc(-0.04em)] mb-4 title-shadow">
                        {t('header.title')}
                    </h1>
                    <p className="!text-[#B5550C] text-base md:text-xl font-bold max-w-2xl mx-auto leading-relaxed">
                        {t('header.desc')}
                    </p>
                </motion.div>
            </section>

            {/* Category Filter Bar - Normal scrolling, between hero and content */}
            <div className="-mt-36 pb-16 flex justify-center relative z-30">
                <div className="container mx-auto px-6 max-w-7xl flex justify-center">
                    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl p-2 rounded-3xl border border-white dark:border-white/5 shadow-2xl flex md:flex-wrap items-center justify-start md:justify-center gap-1 mx-auto w-full md:w-fit overflow-x-auto md:overflow-hidden scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`relative px-5 md:px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 whitespace-nowrap ${activeCategory === cat
                                    ? 'text-white'
                                    : 'text-muted-foreground hover:text-saffron-dark hover:bg-saffron/5'
                                    }`}
                            >
                                {activeCategory === cat && (
                                    <motion.div
                                        layoutId="activeCategory"
                                        className="absolute inset-0 bg-saffron rounded-2xl z-0 shadow-lg shadow-saffron/20"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{cat === 'All' ? t('categories.all') : t(`categories.${cat.toLowerCase()}`)}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* News Content */}
            <div className="container mx-auto px-6 max-w-7xl relative z-20">

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <div className="w-16 h-16 border-4 border-saffron/20 border-t-saffron rounded-full animate-spin"></div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted">Reading the headlines...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, y: 20 }}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
                        >
                            {filteredNews.length === 0 ? (
                                <motion.div variants={itemVariants} className="col-span-full text-center py-32 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[3rem] border border-white/20 dark:border-white/5 shadow-xl">
                                    <div className="w-20 h-20 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-6 text-muted">
                                        <Newspaper size={40} />
                                    </div>
                                    <p className="text-muted font-black tracking-widest uppercase text-xs italic">
                                        {t('empty.desc', { category: activeCategory === 'All' ? t('categories.all') : t(`categories.${activeCategory.toLowerCase()}`) })}
                                    </p>
                                    <button onClick={() => setActiveCategory('All')} className="mt-8 bg-saffron/10 text-saffron-dark font-black text-[10px] uppercase tracking-[0.2em] px-10 py-4 rounded-2xl hover:bg-saffron hover:text-white transition-all">
                                        {t('empty.cta')}
                                    </button>
                                </motion.div>
                            ) : (
                                filteredNews.map((item, index) => (
                                    <NewsCard
                                        key={item.id}
                                        item={item}
                                        onShare={() => handleShare(item)}
                                        onImageClick={() => {
                                            setCurrentImageIndex(index);
                                            setLightboxOpen(true);
                                        }}
                                    />
                                ))
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            <ImageLightbox
                isOpen={lightboxOpen}
                currentIndex={currentImageIndex}
                images={filteredNews.map(item => ({ src: item.imageUrl, alt: item.title, caption: item.title }))}
                onClose={() => setLightboxOpen(false)}
                onNext={() => setCurrentImageIndex(prev => (prev + 1) % filteredNews.length)}
                onPrev={() => setCurrentImageIndex(prev => (prev - 1 + filteredNews.length) % filteredNews.length)}
            />
        </div>
    );
}

function NewsCard({ item, onShare, onImageClick }: { item: NewsItem, onShare: () => void, onImageClick: () => void }) {
    const t = useTranslations('news');
    const locale = useLocale();

    return (
        <motion.article
            variants={itemVariants}
            whileHover={{ y: -10 }}
            className="group bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-white/5 flex flex-col h-full shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)]"
        >
            <div
                className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-950/20 cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    onImageClick();
                }}
            >
                <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                <div className="absolute top-6 right-6 flex items-center gap-2">
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

                {item.isImportant && (
                    <div className="absolute top-6 left-6 bg-red-600/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-xl shadow-red-600/20 border border-white/20 flex items-center gap-2">
                        <Sparkles size={10} />
                        {t('article.important')}
                    </div>
                )}

                <div className="absolute bottom-6 left-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-saffron-dark text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl border border-white/50 shadow-sm flex items-center gap-2">
                    <Tag size={10} />
                    {t(`categories.${item.category?.toLowerCase() || 'general'}`)}
                </div>
            </div>

            <div className="p-10 flex flex-col flex-grow">
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-6 italic" suppressHydrationWarning>
                    <Calendar size={12} className="text-saffron" />
                    {item.createdAt?.toDate().toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>

                <h2 className="text-2xl font-black text-foreground mb-6 font-display group-hover:text-saffron-dark transition-colors leading-[1.3] tracking-tight">
                    {item.title}
                </h2>

                <p className="text-muted-foreground text-sm leading-relaxed mb-10 flex-grow line-clamp-3 font-medium opacity-80 italic">
                    {item.shortDescription}
                </p>

                <div className="pt-6 border-t border-muted/10">
                    <Link href={`/${locale}/news/${item.id}`} className="group/btn inline-flex items-center gap-3 text-saffron-dark dark:text-saffron font-black text-[10px] uppercase tracking-[0.3em] hover:text-saffron transition-colors">
                        <span className="border-b-2 border-saffron/20 group-hover/btn:border-saffron transition-all pb-1">{t('article.cta')}</span>
                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}

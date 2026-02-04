'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { BookOpen, Music, Video, Download, ExternalLink, Search, Sparkles, Filter } from 'lucide-react';

interface Resource {
    id: string;
    type: 'book' | 'audio' | 'bhajan' | 'video' | 'picture';
    title: string;
    category?: string;
    description?: string;
    url?: string;
    thumbnail?: string;
    createdAt?: Timestamp;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

export default function ResourcesPage() {
    const t = useTranslations('resources');
    const locale = useLocale();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'book' | 'audio' | 'video'>('all');

    const tabs = ['all', 'book', 'audio', 'video'];

    useEffect(() => {
        async function fetchResources() {
            try {
                setLoading(true);
                const ref = collection(db, 'spiritual_content', 'resources', 'items');
                const q = query(ref, where('status', '==', 'active'));
                const snap = await getDocs(q);
                const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));

                docs.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
                setResources(docs);
            } catch (err) {
                console.error("Error fetching resources:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchResources();
    }, []);

    const filtered = activeTab === 'all'
        ? resources
        : resources.filter(r => r.type === activeTab || (activeTab === 'audio' && r.type === 'bhajan'));

    return (
        <div className="bg-background min-h-screen pb-32 font-body">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden mesh-gradient">
                <Image
                    src="/resources-hero.png"
                    alt="Digital Library"
                    fill
                    className="object-cover opacity-20 dark:opacity-10 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-black/[0.03] dark:bg-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    className="relative z-10 text-center container mx-auto px-6"
                >
                    <span className="text-saffron font-black text-[10px] md:text-xs uppercase tracking-[0.5em] block mb-6 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full w-fit mx-auto border border-white/20">
                        {t('header.badge')}
                    </span>
                    <h1 className="text-6xl md:text-9xl font-black !text-slate-950 dark:!text-white font-display leading-tight tracking-[calc(-0.04em)] mb-6 title-shadow">
                        {t('header.title')}
                    </h1>
                    <p className="!text-[#B5550C] text-lg md:text-2xl font-bold max-w-2xl mx-auto leading-relaxed font-body mb-12">
                        {t('header.desc')}
                    </p>
                </motion.div>
            </section>

            <div className="container mx-auto px-6 max-w-7xl relative z-20">
                {/* Modern Filter Tabs */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20 -mt-10">
                    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl p-2 rounded-[2.5rem] border border-white dark:border-white/5 shadow-2xl flex flex-wrap gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`relative px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${activeTab === tab
                                    ? 'text-white'
                                    : 'text-muted-foreground hover:text-saffron-dark hover:bg-saffron/5'
                                    }`}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeResourceTab"
                                        className="absolute inset-0 bg-saffron rounded-2xl z-0 shadow-lg shadow-saffron/30"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    {tab === 'book' && <BookOpen size={14} />}
                                    {tab === 'audio' && <Music size={14} />}
                                    {tab === 'video' && <Video size={14} />}
                                    {tab === 'all' && <Filter size={14} />}
                                    {t(`tabs.${tab}`)}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 px-6 py-3 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/5 shadow-sm">
                        <Sparkles size={14} className="text-saffron" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                            {filtered.length} {t('header.results_found')}
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <div className="w-16 h-16 border-4 border-saffron/20 border-t-saffron rounded-full animate-spin"></div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground italic">Indexing Knowledge...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
                        >
                            {filtered.length === 0 ? (
                                <div className="col-span-full text-center py-32 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[3.5rem] border border-white/20 dark:border-white/5 shadow-inner">
                                    <div className="w-24 h-24 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-8 text-muted-foreground/30">
                                        <Search size={48} />
                                    </div>
                                    <p className="text-muted-foreground font-black tracking-widest uppercase text-[10px] italic">
                                        {t('empty.desc')}
                                    </p>
                                    <button onClick={() => setActiveTab('all')} className="mt-8 text-saffron-dark font-black text-[10px] uppercase tracking-widest hover:underline px-8 py-3">
                                        {t('empty.cta')}
                                    </button>
                                </div>
                            ) : (
                                filtered.map((resource) => (
                                    <ResourceCard key={resource.id} resource={resource} />
                                ))
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

function ResourceCard({ resource }: { resource: Resource }) {
    const t = useTranslations('resources');

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'book': return <BookOpen size={18} className="text-blue-500" />;
            case 'audio':
            case 'bhajan': return <Music size={18} className="text-purple-500" />;
            case 'video': return <Video size={18} className="text-red-500" />;
            default: return <Download size={18} className="text-saffron" />;
        }
    };

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ y: -12 }}
            className="group bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/20 dark:border-white/5 hover:border-saffron/30 hover:shadow-2xl transition-all duration-500 flex flex-col h-full shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)]"
        >
            <div className="aspect-[4/3] relative bg-slate-100 dark:bg-slate-950/20 overflow-hidden">

                {resource.thumbnail ? (
                    <Image
                        src={resource.thumbnail}
                        alt={resource.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-saffron/5 to-white/5 p-12">
                        <div className="w-20 h-20 bg-white/10 dark:bg-black/20 rounded-[2rem] flex items-center justify-center text-saffron/40 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-1000">
                            {getTypeIcon(resource.type)}
                        </div>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-saffron-dark shadow-xl border border-white/50 flex items-center gap-2">
                        {getTypeIcon(resource.type)}
                        {t(`types.${resource.type}`)}
                    </div>
                </div>
            </div>

            <div className="p-8 md:p-10 flex-grow flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    {resource.category && (
                        <span className="text-[9px] font-black text-saffron-dark uppercase tracking-[0.2em] px-3 py-1 bg-saffron/10 rounded-lg">
                            {resource.category}
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-black text-foreground font-display group-hover:text-saffron-dark transition-colors mb-4 leading-tight tracking-tight line-clamp-2">
                    {resource.title}
                </h3>

                <p className="text-muted-foreground text-[11px] leading-relaxed mb-10 flex-grow line-clamp-3 font-medium opacity-80 italic">
                    {resource.description || t('card.default_desc')}
                </p>

                <div className="pt-6 border-t border-muted/10">
                    <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 rounded-2xl bg-slate-900/5 dark:bg-black/20 hover:bg-saffron hover:text-white border border-slate-900/5 dark:border-white/10 hover:border-saffron transition-all duration-300 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-sm hover:shadow-saffron/20 active:scale-95 text-muted-foreground hover:text-white"
                    >
                        {t('card.cta')}
                        {resource.type === 'video' ? <ExternalLink size={14} /> : <Download size={14} />}
                    </a>
                </div>
            </div>
        </motion.div>
    );
}

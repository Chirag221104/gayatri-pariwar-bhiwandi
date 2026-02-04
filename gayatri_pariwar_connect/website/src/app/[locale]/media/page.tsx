'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion, Variants } from 'framer-motion';
import { Folder, Image as ImageIcon, ChevronRight, Loader2 } from 'lucide-react';

interface StorageFolder {
    id: string;
    name: string;
    fileCount: number;
    updatedAt?: Timestamp;
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

export default function MediaPage() {
    const t = useTranslations('media_page');
    const locale = useLocale();
    const [folders, setFolders] = useState<StorageFolder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFolders() {
            try {
                setLoading(true);
                const foldersRef = collection(db, 'storage_folders');
                const q = query(foldersRef, where('parentId', '==', null));
                const snap = await getDocs(q);
                const fetchedFolders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as StorageFolder));

                // Client-side sort by name as 'name' ordering might require composite index with parentId
                fetchedFolders.sort((a, b) => a.name.localeCompare(b.name));

                setFolders(fetchedFolders);
            } catch (err) {
                console.error("Error fetching folders:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchFolders();
    }, []);

    return (
        <div className="bg-background min-h-screen pb-32 font-body">
            {/* Hero Section */}
            <section className="relative h-[45vh] md:h-[60vh] flex items-center justify-center overflow-hidden mesh-gradient">
                <Image
                    src="/events-hero.png"
                    alt="Media Gallery"
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
                    <h1 className="text-6xl md:text-9xl font-black !text-slate-950 dark:!text-white font-display leading-[1.1] tracking-[calc(-0.04em)] mb-8 title-shadow">
                        {t('header.title')}
                    </h1>
                    <p className="text-[#B5550C] text-lg md:text-2xl font-bold max-w-2xl mx-auto leading-relaxed">
                        {t('header.desc')}
                    </p>
                </motion.div>
            </section>

            {/* Folder Grid */}
            <div className="container mx-auto px-6 max-w-7xl relative z-20 -mt-20">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-saffron animate-spin" />
                    </div>
                ) : folders.length === 0 ? (
                    <div className="text-center py-20 glass rounded-[2rem] p-12">
                        <p className="text-muted font-medium">{t('empty')}</p>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {folders.map((folder) => (
                            <motion.div key={folder.id} variants={itemVariants}>
                                <Link href={`/${locale}/media/${folder.id}`} className="block group h-full">
                                    <div className="glass hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.2)] transition-all duration-500 rounded-[2rem] p-8 h-full border-white/40 dark:border-white/10 relative overflow-hidden group-hover:-translate-y-2">
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="w-16 h-16 bg-saffron/10 dark:bg-saffron/20 text-saffron-dark dark:text-saffron-light rounded-[1.5rem] flex items-center justify-center group-hover:bg-saffron group-hover:text-white transition-all duration-500 group-hover:rotate-3 shadow-lg shadow-saffron/5">
                                                <Folder className="w-8 h-8" />
                                            </div>
                                            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-black text-muted uppercase tracking-widest border border-white/20 dark:border-white/5">
                                                {folder.fileCount || 0} {t('items')}
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black mb-2 font-display transition-colors line-clamp-2" style={{ color: 'var(--media-text)' }}>
                                            {folder.name}
                                        </h3>

                                        <div className="mt-8 flex items-center gap-2 !text-saffron-dark dark:!text-saffron font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                                            {t('open_folder')} <ChevronRight className="w-3 h-3" />
                                        </div>

                                        {/* Decorative gradient overlay */}
                                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br from-saffron/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

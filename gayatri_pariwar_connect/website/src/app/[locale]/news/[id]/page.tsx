'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

interface NewsDetail {
    id: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    imageUrl: string;
    category: string;
    createdAt: Timestamp;
}

import ImageLightbox from '@/components/ImageLightbox';

export default function NewsDetailPage() {
    const t = useTranslations('news');
    const locale = useLocale();
    const params = useParams();
    const id = params.id as string;
    const [item, setItem] = useState<NewsDetail | null>(null);
    const [loading, setLoading] = useState(true);

    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);

    useEffect(() => {
        async function fetchDetail() {
            if (!id) return;
            try {
                setLoading(true);
                const docRef = doc(db, 'news', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setItem({ id: docSnap.id, ...docSnap.data() } as NewsDetail);
                }
            } catch (err) {
                console.error("Error fetching news detail:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center py-40 bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="container mx-auto max-w-4xl py-20 text-center bg-background min-h-screen font-body">
                <h1 className="text-3xl font-black mb-4 text-foreground">{t('detail.not_found_title')}</h1>
                <Link href={`/${locale}/news`} className="text-saffron-dark font-black hover:underline uppercase text-[10px] tracking-widest">
                    {t('detail.back_to_news')}
                </Link>
            </div>
        );
    }

    return (
        <article className="bg-background min-h-screen pb-20 font-body">
            {/* Header with Image Background */}
            <div
                className="relative h-[400px] md:h-[500px] cursor-pointer group"
                onClick={() => setLightboxOpen(true)}
            >
                <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>

                {/* Visual Hint for Clickable Image */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/30 w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/20">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                    <div className="container mx-auto max-w-4xl">
                        <span className="inline-block bg-saffron text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 shadow-xl shadow-saffron/20 border border-white/20">
                            {t(`categories.${item.category?.toLowerCase() || 'general'}`)}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-foreground font-display leading-tight mb-4 drop-shadow-sm">
                            {item.title}
                        </h1>
                        <div className="flex items-center gap-4 text-muted text-sm font-black tracking-widest uppercase">
                            <span>{item.createdAt.toDate().toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            <span className="opacity-40">|</span>
                            <span>{t('article.author')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto max-w-4xl px-4 py-16">
                <div className="bg-muted/5 border-l-4 border-saffron p-10 rounded-r-[2.5rem] mb-12 shadow-sm glass border-white/10">
                    <p className="text-xl font-black text-foreground leading-relaxed italic opacity-90">
                        {item.shortDescription}
                    </p>
                </div>

                <div className="max-w-none text-muted leading-relaxed font-body space-y-8 text-lg opacity-80 font-medium">
                    {item.fullDescription.split('\n').filter(p => p.trim() !== '').map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                </div>

                <div className="mt-20 pt-12 border-t border-muted/10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <Link href={`/${locale}/news`} className="flex items-center gap-2 text-saffron-dark font-black hover:gap-4 transition-all uppercase text-[10px] tracking-widest group">
                        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16l-4-4m0 0l4-4m-4 4h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                        {t('detail.back_to_news')}
                    </Link>

                    <button className="bg-muted/5 border-2 border-muted/10 text-muted font-black px-10 py-4 rounded-2xl hover:bg-muted/10 transition uppercase text-[10px] tracking-widest shadow-sm active:scale-95">
                        {t('article.share')}
                    </button>
                </div>
            </div>

            <ImageLightbox
                isOpen={lightboxOpen}
                currentIndex={0}
                images={[{ src: item.imageUrl, alt: item.title, caption: item.title }]}
                onClose={() => setLightboxOpen(false)}
                onNext={() => { }}
                onPrev={() => { }}
            />
        </article>
    );
}

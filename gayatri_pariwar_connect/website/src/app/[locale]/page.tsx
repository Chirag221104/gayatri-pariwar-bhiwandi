'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Image as ImageIcon, Camera } from 'lucide-react';

export default function Home() {
  const t = useTranslations('home');
  const locale = useLocale();
  const [galleryImages, setGalleryImages] = useState<{ id: string; url: string }[]>([]);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const q = query(collection(db, 'storage_files'), orderBy('createdAt', 'desc'), limit(12));
        const snap = await getDocs(q);
        const images = snap.docs
          .map(doc => ({ id: doc.id, url: doc.data().downloadUrl, type: doc.data().contentType }))
          .filter(item => item.type?.startsWith('image/'))
          .slice(0, 4);
        setGalleryImages(images);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      }
    }
    fetchGallery();
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-body bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden mesh-gradient text-slate-950 dark:text-white pt-24 pb-16 md:pt-32 md:pb-20 lg:py-40 px-6">
        <div className="absolute inset-0 bg-black/[0.02] dark:bg-black/20"></div>
        {/* Floating Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-saffron/30 rounded-full blur-3xl opacity-50"></div>

        <div className="container mx-auto max-w-7xl relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-16">
          <div className="w-full lg:w-3/5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900/5 dark:bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-slate-900/10 dark:border-white/10">
              <span className="w-2 h-2 bg-saffron rounded-full animate-ping"></span>
              {t('hero.badge')}
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8 font-display tracking-tight leading-[1.1] md:leading-[1.15] title-shadow">
              {t('hero.title')} <br />
              <span className="text-slate-800/80 dark:text-slate-100/80 text-2xl sm:text-4xl md:text-6xl lg:text-7xl">{t('hero.subtitle')}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-2xl mb-8 md:mb-12 text-slate-950 dark:text-slate-200 leading-relaxed font-bold max-w-xl mx-auto lg:mx-0 px-4 md:px-0">
              {t('hero.quote')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 md:gap-6 px-4 md:px-0">
              <Link href={`/${locale}/events`}
                className="bg-saffron text-white font-black text-[10px] md:text-xs uppercase tracking-widest py-4 md:py-5 px-8 md:px-10 rounded-2xl shadow-2xl shadow-saffron/30 hover:bg-saffron-dark transition-all hover:-translate-y-1 active:scale-95 text-center">
                {t('hero.cta_programs')}
              </Link>
              <Link href={`/${locale}/about`}
                className="bg-white/40 backdrop-blur-md border border-slate-900/10 text-slate-900 font-black text-[10px] md:text-xs uppercase tracking-widest py-4 md:py-5 px-8 md:px-10 rounded-2xl hover:bg-white/60 transition-all active:scale-95 text-center">
                {t('hero.cta_mission')}
              </Link>
            </div>
          </div>

          <div className="lg:w-2/5 flex justify-center">
            <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] group/logo">
              <div className="absolute inset-0 bg-saffron/20 rounded-full blur-3xl opacity-60 group-hover/logo:opacity-80 transition-opacity"></div>
              <div className="relative w-full h-full flex items-center justify-center transform hover:scale-105 transition-transform duration-700">
                <img src="/logo.png" alt="Gayatri Pariwar Logo" className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(245,158,11,0.3)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-32 px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 md:mb-20 gap-8">
            <div className="max-w-2xl px-4 md:px-0">
              <span className="text-saffron-dark font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">{t('highlights.badge')}</span>
              <h2 className="text-3xl md:text-5xl font-black text-foreground font-display leading-[1.1] title-shadow">{t('highlights.title')}</h2>
            </div>
            <div className="w-20 h-1 bg-saffron rounded-full mb-4 hidden md:block"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Daily Darshan */}
            <Link href={`/${locale}/spiritual`} className="group">
              <div className="glass rounded-[2rem] p-8 md:p-12 h-full hover:shadow-[0_40px_80px_-15px_rgba(245,158,11,0.15)] transition-all duration-500 border-white/50 relative overflow-hidden group-hover:-translate-y-2">
                <div className="flex items-center justify-between mb-8 md:mb-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-saffron/10 text-saffron-dark rounded-[1.25rem] md:rounded-[1.5rem] flex items-center justify-center group-hover:bg-saffron group-hover:text-white transition-all duration-500 group-hover:rotate-6 shadow-sm">
                    <SunIcon className="w-10 h-10" />
                  </div>
                  <div className="text-saffron-dark font-black text-[10px] uppercase tracking-widest bg-saffron/10 px-3 py-1 rounded-full">
                    {t('highlights.darshan.cta')}
                  </div>
                </div>
                <h3 className="text-3xl font-black text-foreground mb-6 font-display">{t('highlights.darshan.title')}</h3>
                <p className="text-muted leading-relaxed font-medium opacity-80">{t('highlights.darshan.desc')}</p>
                <div className="mt-8 flex items-center gap-2 text-saffron-dark font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                  {t('highlights.darshan.cta')} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                </div>
              </div>
            </Link>

            {/* Card 2: Media Gallery */}
            <Link href={`/${locale}/media`} className="group">
              <div className="glass rounded-[2rem] p-8 md:p-12 h-full hover:shadow-[0_40px_80px_-15px_rgba(245,158,11,0.15)] transition-all duration-500 border-white/50 relative overflow-hidden group-hover:-translate-y-2 flex flex-col">
                <div className="flex items-center justify-between mb-8 md:mb-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-saffron/10 text-saffron-dark rounded-[1.25rem] md:rounded-[1.5rem] flex items-center justify-center group-hover:bg-saffron group-hover:text-white transition-all duration-500 group-hover:rotate-6 shadow-sm">
                    <Camera className="w-10 h-10" />
                  </div>
                  <div className="text-saffron-dark font-black text-[10px] uppercase tracking-widest bg-saffron/10 px-3 py-1 rounded-full">
                    {t('highlights.media.cta')}
                  </div>
                </div>

                <h3 className="text-3xl font-black text-foreground mb-4 font-display">{t('highlights.media.title')}</h3>
                <p className="text-muted leading-relaxed font-medium opacity-80 mb-8 line-clamp-2">{t('highlights.media.desc')}</p>

                {/* Mini Gallery Grid */}
                <div className="grid grid-cols-2 gap-3 mt-auto relative z-10 text-right justify-end">
                  {galleryImages.length > 0 && galleryImages.map((img, i) => (
                    <div key={img.id} className={`relative rounded-xl overflow-hidden aspect-square border border-white/20 shadow-sm ${i === 2 ? 'hidden sm:block' : ''} ${i === 3 ? 'hidden sm:block' : ''}`}>
                      <img
                        src={img.url}
                        alt="Gallery"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  ))
                  }
                  {galleryImages.length > 0 && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-xl"></div>}
                </div>
              </div>
            </Link>

            {/* Card 3: Literature */}
            <Link href={`/${locale}/resources`} className="group">
              <div className="glass rounded-[2rem] p-8 md:p-12 h-full hover:shadow-[0_40px_80px_-15px_rgba(245,158,11,0.15)] transition-all duration-500 border-white/50 relative overflow-hidden group-hover:-translate-y-2">
                <div className="flex items-center justify-between mb-8 md:mb-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-saffron/10 text-saffron-dark rounded-[1.25rem] md:rounded-[1.5rem] flex items-center justify-center group-hover:bg-saffron group-hover:text-white transition-all duration-500 group-hover:rotate-6 shadow-sm">
                    <BookIcon className="w-10 h-10" />
                  </div>
                  <div className="text-saffron-dark font-black text-[10px] uppercase tracking-widest bg-saffron/10 px-3 py-1 rounded-full">
                    {t('highlights.resources.cta')}
                  </div>
                </div>
                <h3 className="text-3xl font-black text-foreground mb-6 font-display">{t('highlights.resources.title')}</h3>
                <p className="text-muted leading-relaxed font-medium opacity-80">{t('highlights.resources.desc')}</p>
                <div className="mt-8 flex items-center gap-2 text-saffron-dark font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                  {t('highlights.resources.cta')} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-40 relative px-6 overflow-hidden bg-background">
        <div className="absolute inset-0 mesh-gradient opacity-5"></div>
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="scale-[2] md:scale-[3] text-saffron/20 font-serif mb-8 md:mb-12 select-none opacity-50 italic">“</div>
          <h2 className="text-2xl md:text-6xl font-black font-display text-foreground leading-[1.2] md:leading-[1.1] mb-10 md:mb-12 max-w-4xl mx-auto italic px-4">
            {t('founder_quote.text')}
          </h2>
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-12 h-[2px] bg-saffron/30"></div>
            <p className="text-sm font-black text-saffron-dark tracking-[0.4em] uppercase">{t('founder_quote.author')}</p>
            <div className="w-12 h-[2px] bg-saffron/30"></div>
          </div>
          <p className="text-muted text-xs font-bold uppercase tracking-widest">{t('founder_quote.role')}</p>
        </div>
      </section>
    </div>
  );
}

// Inline Icon Components for Highlights
const SunIcon = ({ className }: { className?: string }) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const BookIcon = ({ className }: { className?: string }) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

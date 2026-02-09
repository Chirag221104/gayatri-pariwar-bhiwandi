'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

interface LegalLayoutProps {
    title: string;
    lastUpdated: string;
    children: React.ReactNode;
}

export default function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
    const t = useTranslations('legal');

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-[#0B0D14] transition-colors duration-500 pt-32 pb-20">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-saffron/10 to-transparent pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-saffron/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
            <div className="absolute top-40 -left-20 w-72 h-72 bg-brand-red/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-saffron/10 border border-saffron/20 text-saffron text-xs font-bold tracking-wider uppercase">
                        {t('badge')}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight title-shadow">
                        {title}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        {t('last_updated')}: <span className="text-slate-700 dark:text-slate-300 font-medium">{lastUpdated}</span>
                    </p>
                </motion.header>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 md:p-16 shadow-2xl border border-white/20 dark:border-white/5 ring-1 ring-black/5"
                >
                    {/* 
            Replacing 'prose' with manual arbitrary variant styling 
            to ensure robustness without the typography plugin.
          */}
                    <article className="
            text-slate-700 dark:text-slate-300 leading-relaxed text-lg
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-slate-200 [&_h2]:dark:border-slate-800
            [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:dark:text-white [&_h3]:mt-8 [&_h3]:mb-3
            [&_p]:mb-6
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2
            [&_li]:marker:text-saffron
            [&_strong]:font-semibold [&_strong]:text-slate-900 [&_strong]:dark:text-white
            [&_a]:text-saffron [&_a]:dark:text-saffron [&_a]:font-medium [&_a]:underline [&_a]:decoration-transparent [&_a]:underline-offset-4 [&_a]:transition-all hover:[&_a]:decoration-saffron
          ">
                        {children}
                    </article>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 flex flex-col items-center justify-center gap-4 border-t border-slate-200 dark:border-slate-800 pt-10"
                >
                    <p className="text-slate-500 text-sm">
                        {t('questions_text')}
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-saffron text-white font-bold hover:bg-saffron-dark transition-all shadow-lg hover:shadow-orange-500/25 active:scale-95"
                    >
                        {t('contact_support')}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

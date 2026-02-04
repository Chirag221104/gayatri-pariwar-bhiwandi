'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, ExternalLink, Sparkles, MessageSquare, X } from 'lucide-react';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

export default function ContactPage() {
    const t = useTranslations('contact');
    const locale = useLocale();
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    const openGmail = () => {
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=gayatripariwarbhiwandi@gmail.com`, '_blank');
        setIsEmailModalOpen(false);
    };

    const openOutlook = () => {
        window.open(`https://outlook.live.com/default.aspx?rru=compose&to=gayatripariwarbhiwandi@gmail.com`, '_blank');
        setIsEmailModalOpen(false);
    };

    const openDefault = () => {
        window.location.href = `mailto:gayatripariwarbhiwandi@gmail.com`;
        setIsEmailModalOpen(false);
    };

    return (
        <div className="bg-background min-h-screen pb-32 font-body">
            {/* Hero Section */}
            <section className="relative h-[45vh] md:h-[60vh] flex items-center justify-center overflow-hidden mesh-gradient">
                <Image
                    src="/contact-hero.png"
                    alt="Contact Us"
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
                    <h1 className="text-6xl md:text-9xl font-black !text-slate-950 dark:!text-white font-display leading-[1.1] tracking-[calc(-0.04em)] mb-8 title-shadow">
                        {t('header.title')}
                    </h1>
                    <p className="!text-[#B5550C] text-lg md:text-2xl font-bold max-w-2xl mx-auto leading-relaxed">
                        {t('header.desc')}
                    </p>
                </motion.div>
            </section>

            <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-20">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid lg:grid-cols-2 gap-8 md:gap-16 items-stretch"
                >
                    {/* Left Side: Contact Information Cards */}
                    <div className="space-y-6 md:space-y-10">
                        <motion.div variants={itemVariants} className="glass p-6 md:p-12 lg:p-16 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-saffron/10 transition-colors duration-700"></div>

                            <h2
                                className="text-2xl md:text-3xl font-black mb-8 md:mb-12 font-display flex items-center gap-4"
                                style={{ color: 'var(--media-text)' }}
                            >
                                <span className="w-1.5 h-6 md:h-8 bg-saffron rounded-full"></span>
                                {t('branch_info.title')}
                            </h2>

                            <div className="space-y-8 md:space-y-10 relative z-10">
                                {/* Address */}
                                <div className="flex flex-col sm:flex-row gap-4 md:gap-8 group/item">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-saffron/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-saffron-dark shrink-0 group-hover/item:bg-saffron group-hover/item:text-white transition-all duration-500 shadow-lg shadow-saffron/5 group-hover/item:shadow-saffron/20 group-hover/item:-translate-y-1">
                                        <MapPin className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-[0.2em] text-[9px] md:text-[10px] opacity-70">{t('branch_info.center_label')}</h3>
                                        <a
                                            href="https://maps.app.goo.gl/gHYp4dX5NRLf1gWH7"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-base md:text-lg font-black leading-snug hover:text-saffron transition-colors duration-300 flex items-center gap-2 group/link"
                                            style={{ color: 'var(--media-text)' }}
                                        >
                                            {t('branch_info.center_name')}
                                            <ExternalLink size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
                                        </a>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex flex-col sm:flex-row gap-4 md:gap-8 group/item">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-saffron/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-saffron-dark shrink-0 group-hover/item:bg-saffron group-hover/item:text-white transition-all duration-500 shadow-lg shadow-saffron/5 group-hover/item:shadow-saffron/20 group-hover/item:-translate-y-1">
                                        <Mail className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-[0.2em] text-[9px] md:text-[10px] opacity-70">{t('branch_info.email_label')}</h3>
                                        <button
                                            onClick={() => setIsEmailModalOpen(true)}
                                            className="text-lg md:text-xl font-black tracking-tight hover:text-saffron transition-colors text-left break-all sm:break-normal"
                                            style={{ color: 'var(--media-text)' }}
                                        >
                                            gayatripariwarbhiwandi@gmail.com
                                        </button>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex flex-col sm:flex-row gap-4 md:gap-8 group/item">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-saffron/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-saffron-dark shrink-0 group-hover/item:bg-saffron group-hover/item:text-white transition-all duration-500 shadow-lg shadow-saffron/5 group-hover/item:shadow-saffron/20 group-hover/item:-translate-y-1">
                                        <Phone className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-[0.2em] text-[9px] md:text-[10px] opacity-70">{t('branch_info.phone_label')}</h3>
                                        <p className="text-xl md:text-2xl font-black tracking-tighter" style={{ color: 'var(--media-text)' }}>+91 9271733387</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-saffron text-white p-6 md:p-12 lg:p-16 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4 md:mb-8">
                                    <Globe className="w-8 h-8 md:w-10 md:h-10 text-white/40" />
                                    <h2 className="text-2xl md:text-3xl font-black font-display">{t('hq.title')}</h2>
                                </div>
                                <p className="text-white/80 leading-relaxed mb-8 md:mb-10 text-base md:text-lg font-medium max-w-md">
                                    {t('hq.desc')}
                                </p>
                                <a
                                    href="https://www.awgp.org"
                                    target="_blank"
                                    className="group/btn inline-flex items-center gap-4 font-black text-[10px] md:text-[12px] uppercase tracking-[0.2em] md:tracking-[0.3em] bg-white text-saffron-dark px-6 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl shadow-xl hover:shadow-white/20 transition-all hover:-translate-y-1 active:scale-95"
                                >
                                    {t('hq.cta')}
                                    <ArrowRight size={18} className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Map Integration */}
                    <motion.div variants={itemVariants} className="h-[400px] md:h-[600px] lg:h-auto lg:min-h-[700px] bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border border-black/5 dark:border-white/5 relative overflow-hidden group">
                        <iframe
                            src="https://www.google.com/maps?q=19.271918,73.051388&z=17&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0"
                            title="Gayatri PragyaPeeth Bhiwandi Location"
                        ></iframe>

                        {/* Map Overlays - Use pointer-events-none to ensure map stays interactive */}
                        <div className="absolute bottom-6 right-6 z-10 bg-white dark:bg-slate-900/90 shadow-2xl p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-black/10 dark:border-white/10 w-fit max-w-[calc(100%-3rem)] md:max-w-md pointer-events-none">
                            <div className="flex items-start gap-3 md:gap-5">
                                <div className="w-8 h-8 md:w-12 md:h-12 bg-saffron/10 rounded-xl md:rounded-2xl flex items-center justify-center text-saffron-dark shrink-0">
                                    <MessageSquare className="w-4 h-4 md:w-6 md:h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-slate-900 dark:text-slate-100 text-[10px] md:text-sm font-black italic mb-1 md:mb-2 leading-tight md:leading-relaxed font-display line-clamp-2 md:line-clamp-none">
                                        "{t('hq.quote')}"
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 md:w-4 h-px bg-saffron/40"></div>
                                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{t('hq.motto_label')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Sparkle Overlay */}
                        <div className="absolute top-6 right-6 z-10 bg-white/90 dark:bg-slate-900/95 p-3 md:p-5 rounded-full shadow-2xl border border-black/5 text-saffron animate-pulse pointer-events-none">
                            <Sparkles className="w-4 h-4 md:w-6 md:h-6" />
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Email Modal */}
            <AnimatePresence>
                {isEmailModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsEmailModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] max-w-sm w-full shadow-2xl border border-white/20 relative"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsEmailModalOpen(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} className="text-slate-500" />
                            </button>

                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 font-display text-center">
                                {t('email_options.title')}
                            </h3>

                            <div className="space-y-3">
                                <button onClick={openGmail} className="w-full flex items-center gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 font-bold transition-colors group">
                                    <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    {t('email_options.gmail')}
                                </button>
                                <button onClick={openOutlook} className="w-full flex items-center gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold transition-colors group">
                                    <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    {t('email_options.outlook')}
                                </button>
                                <button onClick={openDefault} className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-colors group">
                                    <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    {t('email_options.default')}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ArrowRight({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}

'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { Target, Users, Globe, Quote, Leaf, Sun, Heart } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    }
};

export default function AboutPage() {
    const t = useTranslations('about');

    const missionItems = [
        { title: t('mission.atma.title'), desc: t('mission.atma.desc'), icon: Leaf },
        { title: t('mission.parivar.title'), desc: t('mission.parivar.desc'), icon: Heart },
        { title: t('mission.samaj.title'), desc: t('mission.samaj.desc'), icon: Globe }
    ];

    return (
        <div className="bg-background min-h-screen pb-24 font-body">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden mesh-gradient">
                <Image
                    src="/about-hero.png"
                    alt="Spiritual Background"
                    fill
                    className="object-cover opacity-20 dark:opacity-10 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-black/[0.03] dark:bg-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background"></div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative z-10 text-center container mx-auto px-6"
                >
                    <span className="text-saffron font-black text-[10px] md:text-xs uppercase tracking-[0.5em] block mb-6 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full w-fit mx-auto border border-white/20">
                        {t('header.badge')}
                    </span>
                    <h1 className="text-6xl md:text-9xl font-black !text-slate-950 dark:!text-white font-display leading-[1.1] tracking-[calc(-0.04em)] mb-8 title-shadow">
                        {t('header.title')}
                    </h1>
                    <p className="!text-[#B5550C] text-lg md:text-2xl font-bold leading-relaxed max-w-3xl mx-auto mb-12">
                        {t('header.desc')}
                    </p>
                </motion.div>

                {/* Decorative floating elements */}
                <div className="absolute bottom-20 left-10 w-32 h-32 bg-saffron/10 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute top-20 right-10 w-40 h-40 bg-orange-400/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            </section>

            <div className="container mx-auto px-6 -mt-20 relative z-20">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-24"
                >
                    {/* Mission Section */}
                    <motion.section variants={itemVariants} className="py-32 relative">
                        <div className="container mx-auto max-w-7xl">
                            <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                                <div className="max-w-2xl text-left">
                                    <span className="text-saffron-dark font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                                        {t('mission.badge')}
                                    </span>
                                    <h2 className="text-5xl font-black text-foreground font-display leading-[1.1]">
                                        {t('mission.title')}
                                    </h2>
                                    <div className="w-20 h-1 bg-saffron rounded-full mt-8 md:hidden"></div>
                                    <p className="text-muted text-lg font-medium leading-relaxed opacity-80 mt-8">
                                        {t('mission.desc')}
                                    </p>
                                </div>
                                <div className="w-24 h-1 bg-saffron rounded-full mb-6 hidden md:block"></div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {missionItems.map((item, idx) => (
                                    <div key={idx} className="group">
                                        <div className="glass rounded-[2rem] p-12 h-full hover:shadow-[0_40px_80px_-15px_rgba(245,158,11,0.15)] transition-all duration-500 border-white/50 relative overflow-hidden group-hover:-translate-y-2 text-left">
                                            <div className="w-20 h-20 bg-saffron/10 text-saffron-dark rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:bg-saffron group-hover:text-white transition-all duration-500 group-hover:rotate-6 shadow-sm">
                                                <item.icon className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-3xl font-black text-foreground mb-6 font-display">{item.title}</h3>
                                            <p className="text-muted leading-relaxed font-medium opacity-80">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    {/* Founders Section */}
                    <motion.section variants={itemVariants} className="grid lg:grid-cols-2 gap-20 items-center py-10 px-4 md:px-0">
                        <div className="space-y-10 order-2 lg:order-1">
                            <div className="space-y-4">
                                <span className="text-saffron-dark dark:text-saffron font-black text-[10px] uppercase tracking-[0.5em] block">
                                    {t('founders.badge')}
                                </span>
                                <h2 className="text-4xl md:text-6xl font-black text-foreground font-display leading-[1] tracking-tight">
                                    {t('founders.title')}
                                </h2>
                            </div>
                            <div className="space-y-6">
                                <div className="relative pl-8 border-l-2 border-saffron/30">
                                    <p className="text-muted text-lg md:text-xl font-medium leading-relaxed opacity-80">
                                        {t('founders.desc1')}
                                    </p>
                                </div>
                                <div className="relative pl-8 border-l-2 border-saffron/30">
                                    <p className="text-muted text-lg md:text-xl font-medium leading-relaxed opacity-80">
                                        {t('founders.desc2')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 pt-6">
                                <div className="flex -space-x-4">
                                    <div className="w-16 h-16 rounded-full border-4 border-background bg-slate-200 overflow-hidden shadow-xl relative">
                                        <Image src="/gurudev.jpg" alt="Pt. Shriram Sharma Acharya" fill className="object-cover" />
                                    </div>
                                    <div className="w-16 h-16 rounded-full border-4 border-background bg-slate-200 overflow-hidden shadow-xl relative">
                                        <Image src="/mataji.jpg" alt="Mata Bhagwati Devi Sharma" fill className="object-cover" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-saffron">Our Guiding Light</p>
                                    <p className="text-sm font-bold text-muted">A Spiritual Legacy</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
                            <div className="w-full max-w-md aspect-square relative">
                                <div className="absolute inset-0 bg-saffron/20 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
                                <div className="relative bg-white/5 backdrop-blur-xl rounded-[3rem] p-12 border border-white/20 shadow-2xl overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-saffron/10 to-transparent"></div>
                                    <div className="relative flex items-center justify-center">
                                        <Image
                                            src="/logo.png"
                                            alt="Founders Mission Logo"
                                            width={350}
                                            height={350}
                                            className="object-contain drop-shadow-[0_20px_50px_rgba(249,115,22,0.3)] transition-all duration-700 group-hover:scale-105 group-hover:rotate-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Branch Section */}
                    <motion.section variants={itemVariants} className="py-24 relative">
                        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                            <div className="space-y-10">
                                <span className="text-saffron-dark font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                                    Community Center
                                </span>
                                <h2 className="text-4xl md:text-5xl font-black text-foreground font-display uppercase tracking-tight leading-none">
                                    {t('branch.title')}
                                </h2>
                                <p className="text-foreground/80 text-lg md:text-xl font-medium leading-relaxed border-l-4 border-saffron pl-8">
                                    {t('branch.quote')}
                                </p>
                            </div>

                            <div className="hidden md:flex flex-col items-center justify-center">
                                <div className="w-32 h-32 bg-saffron/10 dark:bg-saffron/20 rounded-full flex items-center justify-center text-saffron animate-bounce duration-[3s] shadow-lg shadow-saffron/10 border border-saffron/20">
                                    <Quote size={48} />
                                </div>
                            </div>
                        </div>
                    </motion.section>
                </motion.div>
            </div>
        </div>
    );
}

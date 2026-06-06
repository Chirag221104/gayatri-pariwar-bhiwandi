'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface PageHeaderProps {
    badge: string;
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
}

export default function PageHeader({ badge, title, description, imageSrc, imageAlt }: PageHeaderProps) {
    return (
        <section className="relative h-[45vh] md:h-[60vh] flex items-center justify-center overflow-hidden mesh-gradient">
            <Image
                src={imageSrc}
                alt={imageAlt}
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
                <span className="text-saffron font-black text-[10px] md:text-xs uppercase tracking-[0.5em] block mb-6 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full w-fit mx-auto border border-white/20 shadow-sm">
                    {badge}
                </span>
                <h1 className="text-6xl md:text-9xl font-black !text-slate-950 dark:!text-white font-display leading-[1.1] tracking-[calc(-0.04em)] mb-8 title-shadow">
                    {title}
                </h1>
                <p className="!text-[#B5550C] text-lg md:text-2xl font-bold max-w-2xl mx-auto leading-relaxed">
                    {description}
                </p>
            </motion.div>
        </section>
    );
}

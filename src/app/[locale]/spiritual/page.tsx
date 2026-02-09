'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Quote, Download, Share2, Sparkles, Calendar, Clock } from 'lucide-react';

interface DailyQuote {
    id: string;
    text: string;
    textHi?: string;
    author: string;
    date?: string;
    imageUrl?: string;
    tithi?: string;
    createdAt?: Timestamp;
}

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
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

export default function SpiritualPage() {
    const t = useTranslations('spiritual');
    const locale = useLocale();
    const [todayQuote, setTodayQuote] = useState<DailyQuote | null>(null);
    const [recentQuotes, setRecentQuotes] = useState<DailyQuote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const quotesRef = collection(db, 'spiritual_content', 'daily_quotes', 'items');

                const today = new Date().toISOString().split('T')[0];
                const todayQuery = query(
                    quotesRef,
                    where('status', '==', 'active'),
                    where('date', '==', today)
                );
                const todaySnap = await getDocs(todayQuery);

                let quote: DailyQuote | null = null;
                if (!todaySnap.empty) {
                    const d = todaySnap.docs[0];
                    quote = { id: d.id, ...d.data() } as DailyQuote;
                } else {
                    const latestSnap = await getDocs(query(quotesRef, where('status', '==', 'active'), orderBy('createdAt', 'desc')));
                    quote = latestSnap.empty ? null : { id: latestSnap.docs[0].id, ...latestSnap.docs[0].data() } as DailyQuote;
                }
                setTodayQuote(quote);

                const recentQuery = query(
                    quotesRef,
                    where('status', '==', 'active'),
                    orderBy('createdAt', 'desc')
                );
                const allSnap = await getDocs(recentQuery);
                const allDocs = allSnap.docs.map(d => ({ id: d.id, ...d.data() } as DailyQuote));
                setRecentQuotes(allDocs.filter(q => q.id !== quote?.id).slice(0, 6));

            } catch (err) {
                console.error("Error fetching spiritual content:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const generateDivineCard = async (quote: DailyQuote): Promise<Blob | null> => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        // Set dimensions (1080x1350 for social media)
        canvas.width = 1080;
        canvas.height = 1350;

        // 1. Draw Background
        if (quote.imageUrl) {
            try {
                const img = new (window.Image)();
                img.crossOrigin = "anonymous";
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = quote.imageUrl!;
                });

                // Cover behavior
                const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width - img.width * ratio) / 2;
                const y = (canvas.height - img.height * ratio) / 2;
                ctx.drawImage(img, x, y, img.width * ratio, img.height * ratio);
            } catch (err) {
                console.error("BG Image load failed:", err);
                const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
                grad.addColorStop(0, '#f97316'); // saffron
                grad.addColorStop(1, '#ea580c');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        } else {
            const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            grad.addColorStop(0, '#f97316');
            grad.addColorStop(1, '#ea580c');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 2. Add Overlay for text readability
        const overlay = ctx.createLinearGradient(0, canvas.height * 0.4, 0, canvas.height);
        overlay.addColorStop(0, 'rgba(0,0,0,0)');
        overlay.addColorStop(0.2, 'rgba(0,0,0,0.4)');
        overlay.addColorStop(1, 'rgba(0,0,0,0.85)');
        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 3. Draw Watermark Logo
        try {
            const logo = new (window.Image)();
            await new Promise((resolve) => {
                logo.onload = resolve;
                logo.src = '/logo.png';
            });
            ctx.globalAlpha = 0.15; // Set transparency
            const logoSize = 600;
            ctx.drawImage(logo, (canvas.width - logoSize) / 2, (canvas.height - logoSize) / 2, logoSize, logoSize);
            ctx.globalAlpha = 1.0; // Reset alpha
        } catch (e) { }

        // 4. Draw Quote Text
        const text = locale === 'hi' ? (quote.textHi || quote.text) : quote.text;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';

        // Font logic
        ctx.font = '900 64px "Outfit", sans-serif';
        const maxWidth = 900;
        const words = text.split(' ');
        let line = '';
        const lines = [];
        const lineHeight = 80;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        const totalTextHeight = lines.length * lineHeight;
        let startY = (canvas.height - totalTextHeight) / 2 + 50;

        lines.forEach(l => {
            ctx.fillText(l.trim(), canvas.width / 2, startY);
            startY += lineHeight;
        });

        // 5. Draw Author
        ctx.font = '700 40px "Outfit", sans-serif';
        ctx.fillStyle = '#fbbf24'; // amber-400
        ctx.fillText(`- ${quote.author}`, canvas.width / 2, startY + 60);

        // 6. Draw Footer
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '500 24px "Outfit", sans-serif';
        ctx.fillText(`Visit: ${window.location.origin}`, canvas.width / 2, canvas.height - 80);
        ctx.font = '900 20px "Outfit", sans-serif';
        ctx.fillText("GAYATRI PARIWAR BHIWANDI", canvas.width / 2, canvas.height - 50);

        return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
    };

    const handleShare = async (quote: DailyQuote) => {
        try {
            const blob = await generateDivineCard(quote);
            if (blob && typeof navigator !== 'undefined' && navigator.share) {
                const file = new File([blob], 'Darshan.jpg', { type: 'image/jpeg' });
                await navigator.share({
                    title: 'Daily Darshan - Gayatri Pariwar Bhiwandi',
                    text: `"${locale === 'hi' ? (quote.textHi || quote.text) : quote.text}" - ${quote.author}\n\nRead more at: ${window.location.origin}`,
                    files: [file],
                });
            } else if (typeof navigator !== 'undefined') {
                navigator.clipboard.writeText(`"${locale === 'hi' ? (quote.textHi || quote.text) : quote.text}" - ${quote.author} ${window.location.href}`);
                alert('Details copied to clipboard!');
            }
        } catch (err) {
            console.error("Error sharing special card:", err);
        }
    };

    const handleDownload = async (quote: DailyQuote) => {
        try {
            const blob = await generateDivineCard(quote);
            if (blob) {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${quote.author.replace(/\s+/g, '_')}_Darshan.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error("Error downloading special card:", err);
            // Fallback to simple image download
            const link = document.createElement('a');
            link.href = quote.imageUrl || '/logo.png';
            link.download = 'Darshan.jpg';
            link.click();
        }
    };

    return (
        <div className="bg-background min-h-screen pb-32 font-body">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden mesh-gradient">
                <Image
                    src="/spiritual-hero.png"
                    alt="Spiritual Wisdom"
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
                    className="relative z-10 text-center container mx-auto px-6 max-w-4xl"
                >
                    <span className="text-saffron font-black text-[10px] md:text-xs uppercase tracking-[0.5em] block mb-6 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full w-fit mx-auto border border-white/20">
                        {t('header.badge')}
                    </span>
                    <h1 className="text-6xl md:text-9xl font-black !text-slate-950 dark:!text-white font-display leading-[1.1] tracking-[calc(-0.04em)] mb-8 title-shadow">
                        {t('header.title')}
                    </h1>
                    <p className="!text-[#B5550C] text-lg md:text-2xl font-bold leading-relaxed max-w-2xl mx-auto mb-12">
                        {t('header.desc')}
                    </p>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent"></div>
            </section>

            <div className="container mx-auto px-6 max-w-7xl relative z-20">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <div className="w-16 h-16 border-4 border-saffron/20 border-t-saffron rounded-full animate-spin"></div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted">Seeking Enlightenment...</p>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-32"
                    >
                        {/* Featured Today's Darshan */}
                        {todayQuote && (
                            <motion.div variants={itemVariants} className="w-full">
                                <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-[3.5rem] overflow-hidden border border-white dark:border-white/5 flex flex-col lg:flex-row shadow-2xl group/featured">
                                    {/* Image Section */}
                                    <div className="lg:w-1/2 relative min-h-[500px] bg-muted/20 overflow-hidden">
                                        {todayQuote.imageUrl ? (
                                            <Image
                                                src={todayQuote.imageUrl}
                                                alt="Today's Darshan"
                                                fill
                                                className="object-cover group-hover/featured:scale-105 transition-transform duration-1000"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-[radial-gradient(circle_closest-side_at_center,rgba(245,158,11,0.15)_0%,#1C1F26_90%)] p-24">
                                                <Image
                                                    src="/logo.png"
                                                    alt="Gayatri Pariwar"
                                                    width={300}
                                                    height={300}
                                                    className="opacity-20 dark:opacity-50 object-contain group-hover/featured:scale-110 transition-transform duration-1000"
                                                />
                                            </div>
                                        )}

                                        {/* Overlays */}
                                        <div className="absolute top-10 left-10 flex flex-col gap-3">
                                            {todayQuote.date && (
                                                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-foreground border border-white/50 shadow-2xl" suppressHydrationWarning>
                                                    {new Date(todayQuote.date).toLocaleDateString(locale, { day: 'numeric', month: 'short' })}
                                                </div>
                                            )}
                                            {todayQuote.tithi && (
                                                <div className="bg-saffron/95 backdrop-blur-xl px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white border border-white/20 shadow-2xl shadow-saffron/20">
                                                    {todayQuote.tithi}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="lg:w-1/2 p-12 md:p-20 flex flex-col justify-center relative bg-white/60 dark:bg-[#1C1F26]/60 backdrop-blur-xl transition-colors duration-500">
                                        <div className="absolute top-12 right-12 text-[140px] font-serif text-saffron/5 leading-none select-none italic transform -rotate-12 group-hover/featured:rotate-0 transition-transform duration-700">“</div>

                                        <div className="relative z-10 space-y-12">
                                            <h2 className="text-3xl md:text-5xl font-black font-display text-[#1F2937] dark:text-[#E5E7EB] leading-[1.3] italic tracking-tight transition-colors duration-300">
                                                {locale === 'hi' ? (todayQuote.textHi || todayQuote.text) : todayQuote.text}
                                            </h2>

                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-1 bg-saffron rounded-full"></div>
                                                <div className="space-y-1">
                                                    <p className="text-xl font-black text-[#B45309] dark:text-[#F59E0B] tracking-tight leading-none uppercase transition-colors duration-300">
                                                        {todayQuote.author}
                                                    </p>
                                                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] opacity-60" suppressHydrationWarning>
                                                        {todayQuote.date ? new Date(todayQuote.date).toLocaleDateString(locale, { weekday: 'long', month: 'long', year: 'numeric' }) : t('cards.eternal_wisdom')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4 pt-4">
                                                <button
                                                    onClick={() => handleShare(todayQuote!)}
                                                    className="flex items-center gap-3 bg-saffron text-white font-black text-[10px] uppercase tracking-widest py-5 px-10 rounded-2xl shadow-xl shadow-saffron/20 hover:shadow-saffron/40 hover:-translate-y-1 transition-all active:scale-95 group/btn"
                                                >
                                                    <Share2 size={16} />
                                                    {t('cards.share')}
                                                    <ArrowRight size={14} className="opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(todayQuote!)}
                                                    className="flex items-center justify-center w-16 h-16 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-muted hover:text-foreground transition-all active:scale-90"
                                                >
                                                    <Download size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Recent Darshans */}
                        {recentQuotes.length > 0 && (
                            <section className="space-y-16">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-muted/10 pb-12">
                                    <div className="space-y-4">
                                        <h3 className="text-3xl md:text-5xl font-black font-display text-foreground uppercase tracking-tighter">
                                            {t('recent.title')}
                                        </h3>
                                        <p className="text-muted font-medium text-sm md:text-base opacity-70">Timeless wisdom from previous days.</p>
                                    </div>
                                    <div className="hidden md:block h-px flex-grow mx-12 bg-muted/10"></div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-muted/5 rounded-full border border-muted/10">
                                        <Sparkles size={14} className="text-saffron" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted">{recentQuotes.length} Quotes</span>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {recentQuotes.map((q) => (
                                        <motion.div
                                            key={q.id}
                                            variants={itemVariants}
                                            whileHover={{ y: -10 }}
                                            className="bg-[#F9F6F1] dark:bg-[#1C1F26] rounded-[2.5rem] overflow-hidden border border-black/5 dark:border-white/10 hover:border-saffron/30 hover:shadow-2xl transition-all duration-500 group/card flex flex-col h-full"
                                        >
                                            <div className="h-56 bg-muted/20 relative overflow-hidden">
                                                {q.imageUrl ? (
                                                    <Image
                                                        src={q.imageUrl}
                                                        alt="Darshan"
                                                        fill
                                                        className="object-cover group-hover/card:scale-110 transition-transform duration-1000 opacity-90 group-hover/card:opacity-100"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-background/50 flex items-center justify-center p-16">
                                                        <Image src="/logo.png" alt="Logo" width={100} height={100} className="opacity-15 object-contain" />
                                                    </div>
                                                )}

                                                <div className="absolute top-6 right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-muted border border-white/20 shadow-xl" suppressHydrationWarning>
                                                    {q.date ? new Date(q.date).toLocaleDateString(locale, { day: 'numeric', month: 'short' }) : t('cards.eternal_wisdom')}
                                                </div>
                                            </div>

                                            <div className="p-10 flex flex-col flex-grow relative">
                                                <div className="absolute top-6 left-6 text-6xl font-serif text-saffron/5 select-none transition-colors group-hover/card:text-saffron/10 leading-none">“</div>
                                                <p className="text-[#1F2937] dark:text-[#E5E7EB] text-lg mb-8 leading-relaxed font-black font-display italic line-clamp-4 relative z-10 pt-4 transition-colors duration-300">
                                                    {locale === 'hi' ? (q.textHi || q.text) : q.text}
                                                </p>
                                                <div className="mt-auto pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-px bg-saffron/50"></div>
                                                        <p className="text-[10px] font-black text-[#B45309] dark:text-[#F59E0B] uppercase tracking-widest transition-colors duration-300">{q.author}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleShare(q)}
                                                            className="w-10 h-10 rounded-2xl bg-muted/5 text-muted flex items-center justify-center hover:bg-saffron/10 hover:text-saffron transition-all active:scale-90"
                                                        >
                                                            <Share2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownload(q)}
                                                            className="w-10 h-10 rounded-2xl bg-saffron/10 text-saffron flex items-center justify-center hover:bg-saffron hover:text-white transition-all shadow-lg shadow-saffron/5 active:scale-90"
                                                        >
                                                            <Download size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </motion.div>
                )}
            </div>
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
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}

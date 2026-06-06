'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants: any = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, ease: "circOut" }
    }
};

export default function CartPage() {
    const t = useTranslations('cart');
    const { items, removeItem, updateQuantity, totalAmount, totalItems } = useCart();
    const { user } = useAuth();
    const { locale } = useParams();
    const router = useRouter();

    if (items.length === 0) {
        return (
            <div className="bg-background min-h-screen font-body flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-32 h-32 bg-saffron/10 rounded-[2.5rem] flex items-center justify-center mb-10 text-saffron shadow-inner shadow-saffron/20"
                >
                    <ShoppingBag size={56} />
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight mb-4">{t('empty_title')}</h1>
                <p className="text-lg text-muted-foreground/80 mb-10 max-w-lg leading-relaxed font-medium">
                    {t('empty_desc')}
                </p>
                <Link
                    href={`/${locale}/books`}
                    className="bg-saffron text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-saffron-dark transition-all shadow-xl shadow-saffron/20 hover:-translate-y-1 active:scale-95 flex items-center gap-3"
                >
                    {t('browse_books')}
                    <ArrowRight size={20} />
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen pb-32 font-body">
            <PageHeader
                badge={t('header.badge')}
                title={t('header.title')}
                description={t('header.desc')}
                imageSrc="/cart-hero.png"
                imageAlt="Sacred Selection"
            />

            <div className="container mx-auto px-6 -mt-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-6"
                        >
                            {items.map((item) => (
                                <motion.div
                                    key={item.bookId}
                                    variants={itemVariants}
                                    className="glass rounded-[2.5rem] p-6 md:p-10 border-white/40 flex flex-col md:flex-row gap-10 items-center shadow-2xl hover:shadow-saffron/10 transition-all duration-500 group relative overflow-hidden"
                                >
                                    {/* Subtle background glow */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/5 blur-[60px] rounded-full group-hover:bg-saffron/10 transition-all duration-700"></div>

                                    {/* Book Image - 3D Effect */}
                                    <div className="relative w-32 h-44 flex-shrink-0 bg-neutral-900 rounded-2xl overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] border border-white/10 group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-500">
                                        {item.coverUrl ? (
                                            <Image src={item.coverUrl} alt={item.title} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-20 text-saffron">
                                                <ShoppingBag size={48} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex flex-col flex-grow text-center md:text-left h-full justify-between py-2">
                                        <div>
                                            <h3 className="text-2xl font-bold font-display leading-tight mb-2 line-clamp-2 group-hover:text-saffron transition-colors">{item.title}</h3>
                                            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                                                <div className="w-1.5 h-1.5 rounded-full bg-saffron/60"></div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('unit_price')}: <span className="text-foreground">₹{item.unitPrice}</span></p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center md:justify-start gap-10 mt-auto">
                                            {/* Quantity Controls - Fluid Design */}
                                            <div className="flex items-center bg-foreground/5 dark:bg-white/5 rounded-2xl border border-white/5 p-1.5 shadow-inner backdrop-blur-xl">
                                                <button
                                                    onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                                                    className="w-12 h-12 flex items-center justify-center hover:bg-saffron hover:text-white rounded-xl transition-all active:scale-90"
                                                >
                                                    <Minus size={20} />
                                                </button>
                                                <span className="w-14 text-center font-black text-2xl font-display">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                                                    className="w-12 h-12 flex items-center justify-center hover:bg-saffron hover:text-white rounded-xl transition-all active:scale-90"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.bookId)}
                                                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-red-500/5 text-red-500/30 hover:text-white hover:bg-red-500 transition-all active:scale-90 shadow-lg shadow-transparent hover:shadow-red-500/20"
                                                title="Remove item"
                                            >
                                                <Trash2 size={24} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price Total per Item */}
                                    <div className="flex flex-col items-center md:items-end justify-center md:min-w-[150px] pt-6 md:pt-0 md:border-l border-white/10 md:pl-10">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">{t('item_total')}</span>
                                        <span className="text-3xl font-bold tracking-tight text-foreground group-hover:text-saffron transition-colors duration-500">₹{item.unitPrice * item.quantity}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="lg:sticky lg:top-36"
                        >
                            <div className="glass rounded-[3rem] p-10 md:p-12 border-white/50 shadow-2xl relative overflow-hidden group">
                                {/* Decorative gradient */}
                                <div className="absolute -top-32 -right-32 w-64 h-64 bg-saffron/5 blur-[100px] rounded-full group-hover:bg-saffron/10 transition-all duration-1000"></div>

                                <h2 className="text-2xl font-bold font-display tracking-tight mb-8">{t('summary_title')}</h2>

                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        <span>{t('total_items')}</span>
                                        <span className="text-foreground font-bold tracking-normal">{totalItems}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        <span>{t('subtotal')}</span>
                                        <span className="text-foreground font-bold tracking-normal">₹{totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        <span>{t('delivery')}</span>
                                        <span className="text-emerald-500 font-bold tracking-wider">FREE</span>
                                    </div>

                                    <div className="h-px bg-black/5 dark:bg-white/10 my-6"></div>

                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-bold uppercase tracking-wider text-saffron mb-1">{t('total')}</span>
                                        <span className="text-4xl font-bold tracking-tight">₹{totalAmount}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push(`/${locale}/checkout`)}
                                    className="w-full bg-saffron text-white hover:bg-saffron-dark py-5 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-wider transition-all shadow-xl shadow-saffron/20 hover:-translate-y-0.5 active:scale-[0.98]"
                                >
                                    {user ? t('checkout_btn') : t('login_checkout_btn')}
                                    <ArrowRight size={20} />
                                </button>

                                <p className="mt-10 text-center text-[10px] font-bold uppercase tracking-widest opacity-30 leading-relaxed px-4">
                                    {t('secure_note')}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

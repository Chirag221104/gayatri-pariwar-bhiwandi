'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X, User as UserIcon, LogOut, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const t = useTranslations('navbar');
    const common = useTranslations('common');
    const locale = useLocale();
    const pathname = usePathname();
    const { user, loginWithGoogle, logout, loading: authLoading } = useAuth();
    const { totalItems } = useCart();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Lock body scroll when menu is open to prevent "messy" underlying movement
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const navLinks = [
        { href: '/', label: t('home') },
        { href: '/events', label: t('events') },
        { href: '/spiritual', label: t('spiritual') },
        { href: '/books', label: t('buy_books') },
        { href: '/news', label: t('news') },
        { href: '/about', label: t('about') },
        { href: '/contact', label: t('contact') },
        ...(user ? [{ href: '/orders', label: t('my_orders') }] : []),
    ];

    // Check if a link is active
    const isActiveLink = (href: string) => {
        const localePath = `/${locale}${href === '/' ? '' : href}`;
        if (href === '/') {
            return pathname === `/${locale}` || pathname === `/${locale}/`;
        }
        return pathname.startsWith(localePath);
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-[100] glass border-b border-white/10 shadow-xl backdrop-blur-xl">
                <div className="w-full h-20 md:h-26 px-4 md:px-8 flex items-center justify-between">

                    {/* 1. Left: Hamburger + Logo Anchor */}
                    <div className="flex items-center gap-4">
                        {/* Global Hamburger Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-3 rounded-2xl bg-saffron/5 hover:bg-saffron/10 transition-all active:scale-90 flex items-center justify-center"
                            aria-label="Toggle Menu"
                        >
                            {isMenuOpen ? <X size={26} className="text-saffron-dark" /> : <Menu size={26} />}
                        </button>

                        <Link
                            href={`/${locale}`}
                            className="flex items-center gap-3 md:gap-4 group"
                            onDoubleClick={() => router.push(`/${locale}/admin/login`)}
                        >
                            <div className="relative w-10 h-10 md:w-16 md:h-16 transition-all duration-500 group-hover:scale-110 drop-shadow-2xl">
                                <Image
                                    src="/masall.jpg"
                                    alt="Gayatri Pariwar Logo"
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 40px, 64px"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base lg:text-lg xl:text-2xl font-black font-display tracking-tight leading-tight text-foreground group-hover:text-saffron-dark transition-colors">{common('brand')}</span>
                                <span className="text-[8px] xl:text-[10px] font-bold uppercase tracking-[0.3em] text-saffron-dark mt-0.5">{common('branch')}</span>
                            </div>
                        </Link>
                    </div>

                    {/* 2. Center: Empty or Search (Hidden or simplified) */}
                    <div className="hidden lg:flex items-center justify-center flex-grow px-2 xl:px-4">
                        {/* We can potentially add a search bar here later or keep it minimal as requested */}
                    </div>

                    {/* 3. Right: Utility Actions (Desktop & Mobile) */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Utility Actions */}
                        <div className="flex items-center gap-2 xl:gap-3">
                            {/* Shopping Cart Icon with Badge */}
                            <Link href={`/${locale}/cart`} className="relative p-3 rounded-2xl bg-white/5 hover:bg-saffron/10 transition-all group">
                                <ShoppingCart size={22} className="group-hover:text-saffron-dark transition-colors" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-saffron-dark text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>

                            <div className="hidden md:flex items-center gap-2">
                                <ThemeToggle />
                                <div className="hidden xl:block">
                                    <LanguageSwitcher side="bottom" />
                                </div>
                            </div>

                            {/* Unified Auth Section */}
                            <div className="hidden md:flex items-center gap-2 xl:gap-4 border-l border-white/10 pl-2 xl:pl-4 ml-2 xl:ml-4 h-10">
                                {authLoading ? (
                                    <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
                                ) : user ? (
                                    <div className="flex items-center gap-3 group/profile relative cursor-pointer">
                                        <div className="hidden xl:flex flex-col items-end">
                                            <span className="text-[9px] xl:text-[10px] font-black uppercase tracking-wider leading-none">{user.name}</span>
                                            <button
                                                onClick={() => logout()}
                                                className="text-[7px] xl:text-[8px] font-bold text-saffron uppercase tracking-[0.2em] mt-1 hover:text-white transition-colors"
                                            >
                                                {t('logout')}
                                            </button>
                                        </div>
                                        {user.photoUrl ? (
                                            <div className="w-10 h-10 rounded-full border-2 border-saffron/20 group-hover/profile:border-saffron transition-all overflow-hidden relative">
                                                <Image src={user.photoUrl} alt={user.name} fill className="object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center border-2 border-saffron/20 group-hover/profile:border-saffron transition-all">
                                                <UserIcon size={18} className="text-saffron" />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => loginWithGoogle()}
                                        className="flex items-center gap-2 group/login hover:text-saffron transition-all"
                                    >
                                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center group-hover/login:bg-saffron group-hover/login:text-white transition-all shadow-inner">
                                            <UserIcon size={16} />
                                        </div>
                                        <span className="hidden xl:inline text-[10px] font-black uppercase tracking-[0.2em]">{t('login')}</span>
                                    </button>
                                )}
                            </div>

                            <button className="bg-saffron-dark text-white px-3 xl:px-7 py-3 xl:py-4 rounded-xl text-[9px] xl:text-[10px] font-black uppercase tracking-[0.1em] xl:tracking-[0.2em] shadow-lg shadow-saffron/20 hover:shadow-saffron/40 hover:-translate-y-0.5 transition-all active:scale-95 whitespace-nowrap ml-1 xl:ml-2">
                                <span className="hidden xl:inline">{t('download_app')}</span>
                                <span className="xl:hidden">App</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Global Side Drawer Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 w-full max-w-[400px] h-[100dvh] bg-background border-r border-white/10 z-[200] flex flex-col p-8 shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="flex flex-col mb-12">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-12 h-12">
                                            <Image
                                                src="/masall.jpg"
                                                alt="Logo"
                                                fill
                                                className="object-contain"
                                                sizes="48px"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-xl font-display tracking-tight text-foreground leading-none">{common('brand')}</span>
                                            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-saffron mt-1">{common('branch')}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className="p-3 rounded-2xl bg-foreground/5 text-foreground hover:bg-saffron/10 hover:text-saffron transition-all"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="w-full h-px bg-gradient-to-r from-saffron/50 to-transparent"></div>
                            </div>

                            {/* Navigation Links - Scrollable area */}
                            <div className="flex flex-col gap-2 flex-grow overflow-y-auto scrollbar-hide py-4">
                                {navLinks.map((link) => {
                                    const isActive = isActiveLink(link.href);
                                    return (
                                        <Link
                                            key={link.href}
                                            href={`/${locale}${link.href === '/' ? '' : link.href}`}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`text-3xl font-black uppercase tracking-tighter transition-all py-3 flex items-center gap-4 group ${isActive ? 'text-saffron translate-x-4' : 'text-foreground/40 hover:text-foreground hover:translate-x-2'}`}
                                        >
                                            {isActive && <div className="w-2 h-8 bg-saffron rounded-full"></div>}
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* footer of drawer */}
                            <div className="mt-auto pt-10 border-t border-foreground/5 flex flex-col gap-8 relative">
                                {/* Mobile Auth & Profile (Responsive in drawer) */}
                                <div className="flex flex-col gap-6">
                                    {user ? (
                                        <div className="flex items-center justify-between bg-surface/50 p-5 rounded-3xl border border-white/5 shadow-inner">
                                            <div className="flex items-center gap-4">
                                                {user.photoUrl ? (
                                                    <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-saffron/20">
                                                        <Image src={user.photoUrl} alt={user.name} fill className="object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-saffron/10 flex items-center justify-center border-2 border-saffron/20 text-saffron">
                                                        <UserIcon size={20} />
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-black font-display tracking-tight leading-none mb-1">{user.name}</span>
                                                    <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest">{user.email}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => logout()}
                                                className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <LogOut size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => loginWithGoogle()}
                                            className="w-full flex items-center justify-between bg-surface/50 p-5 rounded-3xl border border-white/5 shadow-inner hover:bg-saffron/5 hover:border-saffron/20 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron group-hover:bg-saffron group-hover:text-white transition-all">
                                                    <UserIcon size={18} />
                                                </div>
                                                <span className="text-base font-black uppercase tracking-tight">{t('login')}</span>
                                            </div>
                                            <div className="text-[8px] font-black uppercase tracking-widest opacity-30 px-3 py-1 bg-foreground/5 rounded-full group-hover:opacity-100 transition-all">
                                                Google
                                            </div>
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-saffron">{t('settings_label')}</span>
                                        <span className="text-[10px] font-bold opacity-30 text-muted">{t('theme_lang_label')}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ThemeToggle />
                                        <LanguageSwitcher side="top" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

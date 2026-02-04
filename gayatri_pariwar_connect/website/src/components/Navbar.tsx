'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const t = useTranslations('navbar');
    const common = useTranslations('common');
    const locale = useLocale();
    const pathname = usePathname();
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
        { href: '/news', label: t('news') },
        { href: '/about', label: t('about') },
        { href: '/contact', label: t('contact') },
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
                <div className="w-full h-20 md:h-26 px-6 md:px-12 flex items-center justify-between">

                    {/* 1. Left: Logo Anchor */}
                    <div className="flex items-center">
                        <Link href={`/${locale}`} className="flex items-center gap-3 md:gap-4 group">
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
                                <span className="text-base md:text-2xl font-black font-display tracking-tight leading-tight text-foreground group-hover:text-saffron-dark transition-colors">{common('brand')}</span>
                                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-saffron-dark mt-0.5">{common('branch')}</span>
                            </div>
                        </Link>
                    </div>

                    {/* 2. Center: Navigation Links (Desktop Only - LG screen and up) */}
                    <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
                        <div className="flex items-center space-x-8 lg:space-x-12 text-[11px] font-black uppercase tracking-[0.2em] text-foreground/80">
                            {navLinks.map((link) => {
                                const isActive = isActiveLink(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={`/${locale}${link.href === '/' ? '' : link.href}`}
                                        className={`hover:text-saffron-dark transition-all relative group py-2 ${isActive ? 'text-saffron-dark' : ''}`}
                                    >
                                        {link.label}
                                        <span className={`absolute -bottom-1 left-0 h-1 bg-saffron rounded-full transition-all duration-500 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. Right: Utility Actions (Desktop) + Hamburger (Mobile) */}
                    <div className="flex items-center gap-3 md:gap-5">
                        {/* Desktop Utility Actions - Hidden strictly on everything below LG */}
                        <div className="hidden lg:flex items-center gap-4">
                            <ThemeToggle />
                            <LanguageSwitcher side="bottom" />
                            <button className="bg-saffron-dark text-white px-7 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-saffron/20 hover:shadow-saffron/40 hover:-translate-y-0.5 transition-all active:scale-95 whitespace-nowrap ml-2">
                                {t('download_app')}
                            </button>
                        </div>

                        {/* Mobile/Tablet Hamburger Toggle - Visible strictly on everything below LG */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-3 rounded-2xl bg-saffron/5 hover:bg-saffron/10 transition-all active:scale-90"
                            aria-label="Toggle Menu"
                        >
                            {isMenuOpen ? <X size={24} className="text-saffron-dark" /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay - TRUE 100% OPAQUE FULL SCREEN MODAL */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 w-full h-[100dvh] bg-background z-[200] flex flex-col p-6 animate-in fade-in slide-in-from-top duration-300">
                    {/* Modal Header */}
                    <div className="flex flex-col mb-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10">
                                    <Image
                                        src="/masall.jpg"
                                        alt="Logo"
                                        fill
                                        className="object-contain"
                                        sizes="40px"
                                    />
                                </div>
                                <span className="font-black text-lg font-display tracking-tight text-foreground">{common('brand')}</span>
                            </div>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-4 rounded-2xl bg-foreground/5 shadow-inner text-foreground"
                            >
                                <X size={28} />
                            </button>
                        </div>
                        {/* Uniform Golden Line (Top) - Increased Height */}
                        <div className="w-[95%] mx-auto h-1 bg-saffron/50 rounded-full"></div>
                    </div>

                    {/* Navigation Links - Scrollable area */}
                    <div className="flex flex-col gap-8 flex-grow overflow-y-auto scrollbar-hide py-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={`/${locale}${link.href === '/' ? '' : link.href}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-4xl font-black uppercase tracking-tighter text-foreground hover:text-saffron transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Uniform Golden Line (Bottom) - Below Contacts - Increased Height */}
                    <div className="w-[95%] mx-auto h-1 bg-saffron/50 rounded-full"></div>

                    {/* Preferences & Main Action Area */}
                    <div className="mt-auto pt-10 border-t border-foreground/5 flex flex-col gap-10 pb-8 relative">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-saffron">{t('settings_label')}</span>
                                <span className="text-xs font-bold opacity-50 text-muted">{t('theme_lang_label')}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <ThemeToggle />
                                <LanguageSwitcher side="top" />
                            </div>
                        </div>
                        <button className="w-full bg-saffron-dark text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-saffron/40 active:scale-95 transition-all">
                            {t('download_app')}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

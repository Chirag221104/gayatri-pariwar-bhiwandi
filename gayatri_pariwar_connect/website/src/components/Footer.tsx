'use client';

import { YouTubeIcon, FacebookIcon, InstagramIcon } from "./SocialIcons";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function Footer() {
    const t = useTranslations('footer');
    const common = useTranslations('common');
    const locale = useLocale();

    return (
        <footer className="bg-gradient-to-br from-gray-950 to-slate-900 text-white py-16 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-12">
                    {/* Column 1: Brand */}
                    <div className="md:col-span-1">
                        <h3 className="text-2xl font-bold mb-6 text-saffron tracking-tight leading-tight">{common('brand')}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            {t('brand_desc')}
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-saffron">{t('quick_access')}</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href={`/${locale}`} className="hover:text-white transition-all duration-300 flex items-center gap-2 group"><span className="w-1 h-1 bg-saffron rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>{t('links.upcoming_events')}</Link></li>
                            <li><Link href={`/${locale}/about`} className="hover:text-white transition-all duration-300 flex items-center gap-2 group"><span className="w-1 h-1 bg-saffron rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>{t('links.latest_news')}</Link></li>
                            <li><Link href={`/${locale}/events`} className="hover:text-white transition-all duration-300 flex items-center gap-2 group"><span className="w-1 h-1 bg-saffron rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>{t('links.daily_darshan')}</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Spiritual */}
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-saffron">{t('spiritual_links')}</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href={`/${locale}/spiritual`} className="hover:text-white transition-all duration-300 flex items-center gap-2 group"><span className="w-1 h-1 bg-saffron rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>{t('links.daily_darshan')}</Link></li>
                            <li><Link href={`/${locale}/resources`} className="hover:text-white transition-all duration-300 flex items-center gap-2 group"><span className="w-1 h-1 bg-saffron rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>{t('links.literature')}</Link></li>
                            <li><Link href={`/${locale}/resources`} className="hover:text-white transition-all duration-300 flex items-center gap-2 group"><span className="w-1 h-1 bg-saffron rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>{t('links.audio_mantras')}</Link></li>
                            <li><Link href={`/${locale}/spiritual`} className="hover:text-white transition-all duration-300 flex items-center gap-2 group"><span className="w-1 h-1 bg-saffron rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>{t('links.yagya_procedures')}</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Connect */}
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-saffron">{t('connect')}</h4>
                        <div className="flex space-x-5 mb-8">
                            <a href="https://youtube.com" className="bg-white/5 p-3 rounded-xl text-brand-red hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 shadow-sm" aria-label="YouTube">
                                <YouTubeIcon className="w-6 h-6" />
                            </a>
                            <a href="https://www.facebook.com/share/1AHvxWnZrT/" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-xl text-brand-facebook hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 shadow-sm" aria-label="Facebook">
                                <FacebookIcon className="w-6 h-6" />
                            </a>
                            <a href="https://www.instagram.com/gayatri_pragyapeeth_bhiwandi?igsh=MTFjdzA2bndmNGlnNQ==" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-xl text-brand-instagram hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 shadow-sm" aria-label="Instagram">
                                <InstagramIcon className="w-6 h-6" />
                            </a>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            {t('social_desc')}
                        </p>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>&copy; {new Intl.NumberFormat(locale, { useGrouping: false }).format(new Date().getFullYear())} {common('brand')} {common('branch')}. {t('copyright')}</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href={`/${locale}/privacy-policy`} className="hover:text-slate-300 transition">{t('privacy')}</Link>
                        <Link href={`/${locale}/terms-of-service`} className="hover:text-slate-300 transition">{t('terms')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

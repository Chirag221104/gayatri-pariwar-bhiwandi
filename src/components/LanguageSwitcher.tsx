'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useState } from 'react';

const languages = [
    { code: 'en', name: 'English', label: 'EN' },
    { code: 'hi', name: 'हिन्दी', label: 'HI' },
    { code: 'gu', name: 'ગુજરાતી', label: 'GU' },
    { code: 'mr', name: 'मराठी', label: 'MR' }
];

export default function LanguageSwitcher({ side = 'bottom' }: { side?: 'top' | 'bottom' }) {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const switchLanguage = (newLocale: string) => {
        const segments = pathname.split('/');
        segments[1] = newLocale;
        router.push(segments.join('/'));
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-saffron transition-all border border-slate-200 dark:border-slate-700 font-black text-xs"
            >
                <Globe size={18} />
                <span className="uppercase">{languages.find(l => l.code === locale)?.label}</span>
            </button>

            {isOpen && (
                <div className={`absolute right-0 ${side === 'top' ? 'bottom-full mb-3 slide-in-from-bottom-2' : 'top-full mt-3 slide-in-from-top-2'} w-40 glass dark:glass-dark rounded-2xl shadow-2xl overflow-hidden z-[300] animate-in fade-in duration-200 border border-slate-200 dark:border-white/10`}>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => switchLanguage(lang.code)}
                            className={`w-full text-left px-5 py-3.5 text-xs font-bold transition-colors flex items-center justify-between ${locale === lang.code
                                ? 'bg-saffron text-white'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                                }`}
                        >
                            <span>{lang.name}</span>
                            <span className="text-[10px] opacity-60 font-black uppercase tracking-widest">{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

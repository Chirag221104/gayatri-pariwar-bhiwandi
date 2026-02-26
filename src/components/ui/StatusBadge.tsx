'use client';

import React from 'react';

type BadgeVariant = 'pending' | 'approved' | 'active' | 'completed' | 'rejected' | 'cancelled' | 'draft' | 'published' | 'info' | 'warning' | 'accepted' | 'unavailable' | 'past' | 'beginner' | 'intermediate' | 'advanced';

interface StatusBadgeProps {
    variant: BadgeVariant;
    label?: string;
    size?: 'sm' | 'md';
    className?: string;
}

const lightModeStyles: Record<BadgeVariant, string> = {
    pending: 'bg-orange-100 text-orange-700 border-orange-200',
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    completed: 'bg-blue-100 text-blue-700 border-blue-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
    draft: 'bg-sky-100 text-sky-700 border-sky-200',
    published: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    info: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    accepted: 'bg-blue-100 text-blue-700 border-blue-200',
    unavailable: 'bg-slate-200 text-slate-700 border-slate-300',
    past: 'bg-violet-100 text-violet-700 border-violet-200',
    beginner: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    intermediate: 'bg-blue-100 text-blue-700 border-blue-200',
    advanced: 'bg-purple-100 text-purple-700 border-purple-200',
};

const darkModeStyles: Record<BadgeVariant, string> = {
    pending: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
    cancelled: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    draft: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    published: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    warning: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    accepted: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    unavailable: 'bg-zinc-800 text-zinc-500 border-zinc-700',
    past: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    beginner: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    intermediate: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    advanced: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
};

export default function StatusBadge({
    variant,
    label,
    size = 'sm',
    className = ''
}: StatusBadgeProps) {
    const [isDark, setIsDark] = React.useState(false);

    React.useEffect(() => {
        const checkDark = () => {
            const saved = localStorage.getItem('admin-theme');
            if (saved === 'dark') {
                setIsDark(true);
            } else if (saved === 'system') {
                setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
            } else {
                setIsDark(false);
            }
        };
        checkDark();
        const interval = setInterval(checkDark, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!variant) return null;

    const displayLabel = label || (variant.charAt(0).toUpperCase() + variant.slice(1));
    const activeStyles = isDark ? darkModeStyles[variant] : lightModeStyles[variant];

    return (
        <span className={`
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-semibold
            ${size === 'sm' ? 'text-[10px] tracking-wider uppercase' : 'text-xs'}
            ${activeStyles}
            ${className}
        `}>
            <span className={`w-1.5 h-1.5 rounded-full bg-current opacity-80`} />
            {displayLabel}
        </span>
    );
}

'use client';

import React from 'react';

type BadgeVariant = 'pending' | 'approved' | 'active' | 'completed' | 'rejected' | 'cancelled' | 'draft' | 'published' | 'info' | 'warning';

interface StatusBadgeProps {
    variant: BadgeVariant;
    label?: string;
    size?: 'sm' | 'md';
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
    cancelled: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    published: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    warning: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
};

export default function StatusBadge({
    variant,
    label,
    size = 'sm',
    className = ''
}: StatusBadgeProps) {
    const displayLabel = label || variant.charAt(0).toUpperCase() + variant.slice(1);

    return (
        <span className={`
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-semibold
            ${size === 'sm' ? 'text-[10px] tracking-wider uppercase' : 'text-xs'}
            ${variantStyles[variant]}
            ${className}
        `}>
            <span className={`w-1.5 h-1.5 rounded-full bg-current opacity-80`} />
            {displayLabel}
        </span>
    );
}

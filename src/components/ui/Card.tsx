'use client';

import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export default function Card({
    children,
    className = '',
    padding = 'md',
    hover = false
}: CardProps) {
    return (
        <div className={`
            bg-slate-900/50 border border-slate-800/80 rounded-2xl
            ${paddingStyles[padding]}
            ${hover ? 'transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-slate-950/50' : ''}
            ${className}
        `}>
            {children}
        </div>
    );
}

// Sub-components for structured cards
Card.Header = function CardHeader({
    children,
    className = ''
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`border-b border-slate-800/50 pb-4 mb-4 ${className}`}>
            {children}
        </div>
    );
};

Card.Title = function CardTitle({
    children,
    className = ''
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <h3 className={`text-sm font-semibold text-white ${className}`}>
            {children}
        </h3>
    );
};

Card.Content = function CardContent({
    children,
    className = ''
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`text-sm text-slate-400 ${className}`}>
            {children}
        </div>
    );
};

"use client";

import React, { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
    icon?: LucideIcon;
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    className?: string;
}

export default function SectionHeader({
    icon: Icon,
    title,
    subtitle,
    actions,
    className = ""
}: SectionHeaderProps) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
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
        const interval = setInterval(checkDark, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 ${className}`}>
            <div className="flex items-start gap-4">
                {Icon && (
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg ${isDark
                            ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/20 text-orange-500 shadow-orange-500/5'
                            : 'bg-white border-orange-100 text-orange-600 shadow-orange-500/10'
                        }`}>
                        <Icon className="w-6 h-6" />
                    </div>
                )}
                <div>
                    <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {title}
                    </h1>
                    {subtitle && (
                        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
            {actions && (
                <div className="flex items-center gap-3">
                    {actions}
                </div>
            )}
        </div>
    );
}

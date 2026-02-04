'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    resolvedTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('system');
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Load saved preference
        const saved = localStorage.getItem('admin-theme') as Theme | null;
        if (saved) {
            setTheme(saved);
        }
    }, []);

    useEffect(() => {
        const updateResolvedTheme = () => {
            if (theme === 'system') {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setResolvedTheme(isDark ? 'dark' : 'light');
            } else {
                setResolvedTheme(theme);
            }
        };

        updateResolvedTheme();

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => updateResolvedTheme();
        mediaQuery.addEventListener('change', handler);

        return () => mediaQuery.removeEventListener('change', handler);
    }, [theme]);

    useEffect(() => {
        // Apply theme to document
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(resolvedTheme);
        localStorage.setItem('admin-theme', theme);
    }, [theme, resolvedTheme]);

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useAdminTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useAdminTheme must be used within AdminThemeProvider');
    }
    return context;
}

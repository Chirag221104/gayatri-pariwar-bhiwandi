"use client";

import { useState, useEffect } from "react";

export function useAdminTheme() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkTheme = () => {
            if (typeof window === "undefined") return;

            const saved = localStorage.getItem('admin-theme');
            if (saved === 'dark') {
                setIsDark(true);
            } else if (saved === 'system') {
                setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
            } else {
                setIsDark(false);
            }
        };

        checkTheme();

        // Watch for local storage changes (from other tabs or same tab updates)
        window.addEventListener('storage', checkTheme);

        // Watch for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', checkTheme);

        // Polling as a fallback for same-page updates that don't trigger 'storage' event
        const interval = setInterval(checkTheme, 500);

        return () => {
            window.removeEventListener('storage', checkTheme);
            mediaQuery.removeEventListener('change', checkTheme);
            clearInterval(interval);
        };
    }, []);

    return { isDark };
}

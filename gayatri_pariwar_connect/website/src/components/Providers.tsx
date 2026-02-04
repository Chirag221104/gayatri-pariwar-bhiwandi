'use client';

import { ThemeProvider } from 'next-themes';
import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

interface ProvidersProps {
    children: ReactNode;
    locale: string;
    messages: any;
}

import { ToastProvider } from './ui/Toast';

export function Providers({ children, locale, messages }: ProvidersProps) {
    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </ThemeProvider>
        </NextIntlClientProvider>
    );
}

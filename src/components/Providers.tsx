'use client';

import { ThemeProvider } from 'next-themes';
import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

interface ProvidersProps {
    children: ReactNode;
    locale: string;
    messages: any;
}

import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from './ui/Toast';

export function Providers({ children, locale, messages }: ProvidersProps) {
    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
                <AuthProvider>
                    <CartProvider>
                        <ToastProvider>
                            {children}
                        </ToastProvider>
                    </CartProvider>
                </AuthProvider>
            </ThemeProvider>
        </NextIntlClientProvider>
    );
}

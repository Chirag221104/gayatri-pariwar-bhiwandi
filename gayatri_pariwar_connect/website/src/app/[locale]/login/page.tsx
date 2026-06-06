'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { LogIn, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
    const { user, loginWithGoogle, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { locale } = useParams();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const redirectPath = searchParams.get('redirect') || '';

    useEffect(() => {
        if (user && !isRedirecting) {
            setIsRedirecting(true);
            const path = redirectPath ? `/${locale}/${redirectPath}` : `/${locale}`;
            router.replace(path);
        }
    }, [user, router, redirectPath, locale, isRedirecting]);

    const handleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    if (loading || isRedirecting) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-12 h-12 rounded-full border-4 border-saffron border-t-transparent animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-background relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-saffron/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="bg-surface rounded-[40px] p-8 md:p-12 border border-white/5 shadow-2xl backdrop-blur-3xl text-center">
                    {/* Logo Section */}
                    <div className="relative w-24 h-24 mx-auto mb-8 group">
                        <div className="absolute inset-0 bg-saffron/20 blur-2xl rounded-full group-hover:bg-saffron/40 transition-colors"></div>
                        <div className="relative w-full h-full rounded-full border-2 border-saffron/20 overflow-hidden flex items-center justify-center p-2 bg-background shadow-inner">
                            <Image
                                src="/masall.jpg"
                                alt="Gayatri Pariwar"
                                width={80}
                                height={80}
                                className="object-contain"
                            />
                        </div>
                    </div>

                    <h1 className="text-3xl font-black font-display tracking-tight mb-4 leading-tight">
                        Begin Your <br />
                        <span className="text-saffron">Spiritual Journey</span>
                    </h1>

                    <p className="text-muted-foreground text-sm font-medium mb-12 max-w-[280px] mx-auto leading-relaxed">
                        Sign in to access book store, track your orders, and join your spiritual group.
                    </p>

                    <button
                        onClick={handleLogin}
                        className="w-full bg-foreground text-background hover:bg-saffron hover:text-white py-5 rounded-2xl flex items-center justify-center gap-4 text-sm font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.98] group"
                    >
                        <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <Image src="/google.png" alt="Google" width={18} height={18} />
                        </div>
                        Sign in with Google
                        <ArrowRight size={18} className="ml-auto opacity-40 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-left">
                            <div className="w-10 h-10 rounded-xl bg-saffron/5 flex items-center justify-center text-saffron">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Safe & Secure</p>
                                <p className="text-[10px] opacity-40 leading-relaxed mt-1">Your data is linked to your mobile app account.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-left">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/5 flex items-center justify-center text-emerald-500">
                                <Heart size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Spiritual Growth</p>
                                <p className="text-[10px] opacity-40 leading-relaxed mt-1">Access Sahitya on any device, anytime.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest opacity-30">
                    By continuing, you agree to our <br />
                    <a href="#" className="underline hover:text-white">Terms of Service</a> and <a href="#" className="underline hover:text-white">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}

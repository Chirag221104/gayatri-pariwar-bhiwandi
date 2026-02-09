'use client';

import React from 'react';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderSuccessPage() {
    const { locale } = useParams();

    return (
        <div className="pt-40 px-6 min-h-[80vh] flex flex-col items-center justify-center text-center">
            <div className="relative mb-10">
                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse"></div>
                <div className="relative w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl animate-in zoom-in duration-500">
                    <CheckCircle size={48} />
                </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight mb-4">
                Jai Shree Ram!<br />
                <span className="text-saffron">Order Placed Successfully</span>
            </h1>

            <p className="text-muted-foreground mb-12 max-w-md mx-auto text-lg">
                Your spiritual journey continues. We've received your order and our team is preparing your books for delivery.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                <Link
                    href={`/${locale}/books`}
                    className="bg-surface border border-white/10 hover:border-saffron/50 px-8 py-5 rounded-3xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all group"
                >
                    <ShoppingBag size={20} className="text-saffron group-hover:scale-110 transition-transform" />
                    Keep Shopping
                </Link>

                <Link
                    href={`/${locale}/books`}
                    className="bg-foreground text-background hover:bg-saffron hover:text-white px-8 py-5 rounded-3xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95"
                >
                    View My Orders
                    <ArrowRight size={20} />
                </Link>
            </div>

            <div className="mt-16 p-8 bg-surface rounded-[40px] border border-white/5 max-w-md w-full">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-saffron/10 flex items-center justify-center text-saffron">
                        <Package size={24} />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-black uppercase tracking-widest">Delivery Status</p>
                        <p className="text-xs opacity-60">Preparing for dispatch</p>
                    </div>
                </div>
                <p className="text-[10px] items-center text-left font-bold uppercase tracking-widest opacity-40 leading-relaxed italic">
                    You can track all your orders and delivery status in the mobile app using the same login.
                </p>
            </div>
        </div>
    );
}

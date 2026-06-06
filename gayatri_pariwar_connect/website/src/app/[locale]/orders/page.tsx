'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { Package, Truck, CheckCircle, Clock, ChevronRight, ShoppingBag, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import Link from 'next/link';

interface OrderItem {
    // ... existing interface ...
    bookId: string;
    title: string;
    unitPrice: number;
    quantity: number;
}

interface Order {
    id: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    deliveryStatus: string;
    createdAt: Timestamp;
    payment: {
        type: string;
        status: string;
        transactionId?: string;
    };
    deliveryAddress: {
        flat: string;
        society: string;
        area: string;
        city: string;
        pincode: string;
        state: string;
    };
    deliveryOtp?: string;
}

const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "circOut" }
    }
};

export default function OrdersPage() {
    const t = useTranslations('orders');
    const common = useTranslations('common');
    const locale = useLocale();
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            try {
                const q = query(
                    collection(db, 'granthalaya_app', 'orders_module', 'orders'),
                    where('userId', '==', user.uid),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const fetchedOrders: Order[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedOrders.push({ id: doc.id, ...doc.data() } as Order);
                });
                setOrders(fetchedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchOrders();
        }
    }, [user, authLoading]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'placed': return <Clock className="text-blue-500" />;
            case 'packed': return <Package className="text-yellow-500" />;
            case 'shipped': return <Truck className="text-orange-500" />;
            case 'delivered': return <CheckCircle className="text-emerald-500" />;
            default: return <Clock className="text-gray-500" />;
        }
    };

    const statuses = ['placed', 'packed', 'shipped', 'delivered'];

    if (authLoading || loading) {
        return <div className="bg-background min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-saffron animate-pulse">Loading Your Journey...</div>;
    }

    if (!user) {
        return (
            <div className="bg-background min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 rounded-[2rem] bg-saffron/10 flex items-center justify-center text-saffron mb-8">
                    <ShoppingBag size={48} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-white mb-4">{t('header.title')}</h1>
                <p className="text-lg text-white/70 max-w-xl mx-auto leading-relaxed font-medium">
                    {t('header.desc')}
                </p>
                <Link href={`/${locale}/login`} className="bg-saffron text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-saffron/30 hover:-translate-y-1 transition-all">Sign In Now</Link>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen pb-32">
            <PageHeader
                badge={t('header.badge')}
                title={t('header.title')}
                description={t('header.desc')}
                imageSrc="/orders-hero.png"
                imageAlt="Orders History"
            />

            <div className="container mx-auto px-6 -mt-24 relative z-20">
                <AnimatePresence mode="wait">
                    {orders.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass rounded-[3rem] p-20 text-center border-white/50 shadow-2xl flex flex-col items-center"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-muted-foreground mb-8">
                                <ShoppingBag size={40} />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">{t('empty.title')}</h2>
                            <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t('empty.desc')}</p>
                            <Link
                                href={`/${locale}/books`}
                                className="bg-saffron text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider hover:bg-saffron-dark transition-all flex items-center gap-2 mx-auto w-fit"
                            >
                                {t('empty.cta')} <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="orders-list"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-12"
                        >
                            {orders.map((order) => (
                                <motion.div
                                    key={order.id}
                                    variants={itemVariants}
                                    className="glass rounded-[3.5rem] overflow-hidden border-white/40 shadow-2xl hover:shadow-saffron/10 transition-all duration-700 group"
                                >
                                    {/* Order Header */}
                                    <div className="p-8 md:p-12 border-b border-white/10 bg-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 blur-[80px] rounded-full group-hover:bg-saffron/10 transition-all duration-1000"></div>

                                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                                            <div className="w-20 h-20 rounded-3xl bg-saffron/10 flex items-center justify-center text-saffron shadow-xl shadow-saffron/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                                <Package size={36} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-saffron/80 mb-1">{t('order.id_label')}</p>
                                                <h3 className="text-xl font-bold font-display tracking-tight uppercase">#{order.id.slice(-8)}</h3>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="flex flex-col">
                                                        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">{t('order.date_label')}</p>
                                                        <p className="text-xs font-bold text-foreground/80">
                                                            {order.createdAt?.toDate().toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative z-10 flex flex-wrap gap-6 items-end justify-end">
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">{t('order.total_label')}</p>
                                                <p className="text-2xl font-bold tracking-tight text-foreground">₹{order.totalAmount}</p>
                                            </div>
                                            <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${order.payment?.status === 'success' ? 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10' : 'bg-yellow-500/10 text-yellow-500 shadow-yellow-500/10'}`}>
                                                {order.payment?.type === 'online' ? t('order.paid') : t('order.pay_pending')}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Tracking Timeline - Redesigned */}
                                    <div className="p-10 md:p-16 bg-background/20 backdrop-blur-md relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-saffron/5 to-transparent"></div>
                                        <div className="relative max-w-5xl mx-auto py-10">
                                            {/* Connecting Line */}
                                            <div className="absolute top-1/2 left-0 w-full h-1.5 bg-foreground/5 dark:bg-white/5 -translate-y-1/2 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(statuses.indexOf(order.status) / (statuses.length - 1)) * 100}%` }}
                                                    transition={{ duration: 1.5, ease: "circOut" }}
                                                    className="h-full bg-gradient-to-r from-saffron to-saffron-dark shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                                                />
                                            </div>

                                            <div className="relative flex justify-between">
                                                {statuses.map((status, index) => {
                                                    const isCompleted = statuses.indexOf(order.status) >= index;
                                                    const isCurrent = order.status === status;

                                                    return (
                                                        <div key={status} className="flex flex-col items-center gap-6 relative">
                                                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 z-10 ${isCompleted
                                                                ? 'bg-saffron text-white shadow-xl shadow-saffron/30 scale-110'
                                                                : 'bg-surface text-muted-foreground/30 border-2 border-white/5'
                                                                } ${isCurrent ? 'ring-4 ring-saffron/20 animate-pulse' : ''}`}>
                                                                {getStatusIcon(status)}
                                                            </div>
                                                            <div className="absolute -bottom-10 whitespace-nowrap text-center">
                                                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${isCompleted ? 'text-foreground' : 'text-muted-foreground/20'}`}>
                                                                    {t(`status.${status}`)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Details Grid */}
                                    <div className="p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-white/5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('order.items_label')}</h4>
                                                <div className="space-y-3">
                                                    {order.items.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-white/5">
                                                            <div>
                                                                <p className="text-xs font-bold leading-snug uppercase tracking-tight">{item.title}</p>
                                                                <p className="text-[10px] font-semibold text-muted-foreground uppercase mt-1">
                                                                    {item.quantity} × ₹{item.unitPrice}
                                                                </p>
                                                            </div>
                                                            <p className="text-sm font-bold">₹{item.quantity * item.unitPrice}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('order.delivery_label')}</h4>
                                                <div className="p-4 rounded-xl bg-saffron/5 border border-saffron/10">
                                                    <p className="text-xs font-bold leading-relaxed">
                                                        {order.deliveryAddress.flat}, {order.deliveryAddress.society},<br />
                                                        {order.deliveryAddress?.area}, {order.deliveryAddress?.city},<br />
                                                        {order.deliveryAddress?.pincode}
                                                    </p>
                                                </div>

                                                {order.deliveryOtp && order.status !== 'delivered' && (
                                                    <div className="mt-8 p-6 rounded-2xl bg-saffron/10 border-2 border-dashed border-saffron/30 text-center">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-saffron mb-3">Delivery Verification Code</p>
                                                        <div className="text-4xl font-black tracking-[0.4em] text-foreground">{order.deliveryOtp}</div>
                                                        <p className="mt-4 text-[9px] font-bold text-muted-foreground/60 leading-relaxed max-w-[200px] mx-auto uppercase">
                                                            Share this code with the rider only after you verify your package identity
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

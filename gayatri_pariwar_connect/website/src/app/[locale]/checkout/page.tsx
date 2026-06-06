'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, serverTimestamp } from 'firebase/firestore';
import { MapPin, Plus, Check, ChevronRight, CreditCard, ShoppingBag, Truck, ArrowRight, Minus } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';

interface Address {
    id: string;
    flat: string;
    society: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    isDefault: boolean;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants: any = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "circOut" }
    }
};

export default function CheckoutPage() {
    const t = useTranslations('checkout');
    const { items, totalAmount, clearCart } = useCart();
    const { user, loading: authLoading } = useAuth();
    const { locale } = useParams();
    const router = useRouter();
    const { showToast } = useToast();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [newAddress, setNewAddress] = useState({
        flat: '',
        society: '',
        area: '',
        city: 'Bhiwandi',
        pincode: '',
        state: 'Maharashtra',
        landmark: ''
    });

    // Load addresses on mount
    useEffect(() => {
        const fetchAddresses = async () => {
            if (!user) return;
            try {
                const q = query(collection(db, 'users', user.uid, 'addresses'));
                const querySnapshot = await getDocs(q);
                const fetchedAddresses: Address[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedAddresses.push({
                        id: doc.id,
                        ...data
                    } as Address);
                });
                setAddresses(fetchedAddresses);

                // Select default or first address
                const defaultAddr = fetchedAddresses.find(a => a.isDefault);
                if (defaultAddr) setSelectedAddressId(defaultAddr.id);
                else if (fetchedAddresses.length > 0) setSelectedAddressId(fetchedAddresses[0].id);
            } catch (error) {
                console.error("Error fetching addresses:", error);
            }
        };

        fetchAddresses();
    }, [user]);

    // Redirect if no items or not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push(`/${locale}/login?redirect=checkout`);
        } else if (!authLoading && items.length === 0) {
            router.push(`/${locale}/books`);
        }
    }, [user, items, authLoading, locale, router]);

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsProcessing(true);
        try {
            const addrData = {
                ...newAddress,
                isDefault: addresses.length === 0,
                createdAt: serverTimestamp()
            };
            const docRef = await addDoc(collection(db, 'users', user.uid, 'addresses'), addrData);
            const addedAddr = { id: docRef.id, ...addrData } as Address;

            setAddresses([...addresses, addedAddr]);
            setSelectedAddressId(docRef.id);
            setIsAddingAddress(false);
            showToast(t('toasts.addr_success'), "success");
        } catch (error) {
            console.error("Error adding address:", error);
            showToast(t('toasts.addr_fail'), "error");
        } finally {
            setIsProcessing(false);
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCheckout = async () => {
        if (!selectedAddressId) {
            showToast(t('toasts.select_addr'), "info");
            return;
        }

        const res = await loadRazorpay();
        if (!res) {
            showToast(t('toasts.razorpay_fail'), "error");
            return;
        }

        const selectedAddress = addresses.find(a => a.id === selectedAddressId);
        if (!selectedAddress) return;

        setIsProcessing(true);

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: totalAmount * 100,
            currency: 'INR',
            name: 'Gayatri Granthalaya',
            description: 'Online Order Payment',
            image: '/logo.png',
            modal: {
                ondismiss: function () {
                    setIsProcessing(false);
                    showToast(t('toasts.pay_cancel'), "info");
                }
            },
            handler: async function (response: any) {
                setIsProcessing(true);
                try {
                    const orderData = {
                        userId: user!.uid,
                        customerName: user!.name,
                        customerPhone: user!.phone || '',
                        items: items.map(item => ({
                            bookId: item.bookId,
                            title: item.title,
                            unitPrice: item.unitPrice,
                            quantity: item.quantity
                        })),
                        totalAmount: totalAmount,
                        status: 'placed',
                        deliveryStatus: 'pending',
                        deliveryMode: 'internal',
                        payment: {
                            type: 'online',
                            status: 'success',
                            transactionId: response.razorpay_payment_id,
                            timestamp: serverTimestamp()
                        },
                        deliveryAddress: {
                            flat: selectedAddress.flat,
                            society: selectedAddress.society,
                            area: selectedAddress.area,
                            city: selectedAddress.city,
                            pincode: selectedAddress.pincode,
                            state: selectedAddress.state,
                            landmark: selectedAddress.landmark || ''
                        },
                        deliveryTimeline: [
                            {
                                status: 'placed',
                                at: new Date(),
                                by: user!.uid
                            }
                        ],
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp()
                    };

                    await addDoc(collection(db, 'granthalaya_app', 'orders_module', 'orders'), orderData);
                    showToast(t('toasts.order_success'), "success");
                    clearCart();
                    router.push(`/${locale}/orders/success`);
                } catch (error) {
                    console.error("Order creation failed:", error);
                    showToast(t('toasts.order_partial_fail'), "error");
                } finally {
                    setIsProcessing(false);
                }
            },
            prefill: {
                name: user!.name,
                email: user!.email,
                contact: user!.phone || ''
            },
            theme: {
                color: '#FF9933'
            }
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.on('payment.failed', function (response: any) {
            setIsProcessing(false);
            showToast(`Error: ${response.error.description || "Payment failed"}`, "error");
        });
        paymentObject.open();
    };

    const handleManualOrder = async () => {
        if (!selectedAddressId) {
            showToast(t('toasts.select_addr'), "info");
            return;
        }

        const selectedAddress = addresses.find(a => a.id === selectedAddressId);
        if (!selectedAddress) return;

        if (!confirm(t('payment.manual_confirm'))) return;

        setIsProcessing(true);
        try {
            const orderData = {
                userId: user!.uid,
                customerName: user!.name,
                customerPhone: user!.phone || '',
                items: items.map(item => ({
                    bookId: item.bookId,
                    title: item.title,
                    unitPrice: item.unitPrice,
                    quantity: item.quantity
                })),
                totalAmount: totalAmount,
                status: 'placed',
                deliveryStatus: 'pending',
                deliveryMode: 'internal',
                payment: {
                    type: 'cash',
                    status: 'pending',
                    timestamp: serverTimestamp()
                },
                deliveryAddress: {
                    flat: selectedAddress.flat,
                    society: selectedAddress.society,
                    area: selectedAddress.area,
                    city: selectedAddress.city,
                    pincode: selectedAddress.pincode,
                    state: selectedAddress.state,
                    landmark: selectedAddress.landmark || ''
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            await addDoc(collection(db, 'granthalaya_app', 'orders_module', 'orders'), orderData);
            showToast(t('toasts.manual_success'), "success");
            clearCart();
            router.push(`/${locale}/orders/success`);
        } catch (error) {
            console.error("Manual order failed:", error);
            showToast(t('toasts.manual_fail'), "error");
        } finally {
            setIsProcessing(false);
        }
    };

    if (authLoading) return <div className="bg-background min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-saffron animate-pulse">Loading...</div>;

    return (
        <div className="bg-background min-h-screen pb-32 font-body">
            <PageHeader
                badge={t('header.badge')}
                title={t('header.title')}
                description={t('header.desc')}
                imageSrc="/checkout-hero.png"
                imageAlt="Sacred Gateway"
            />

            <div className="container mx-auto px-6 -mt-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Checkout Process */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Section 1: Address Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass rounded-[3rem] p-8 md:p-12 border-white/50 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-2xl font-bold font-display tracking-tight flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron">
                                        <MapPin size={20} />
                                    </div>
                                    {t('sections.address')}
                                </h2>
                                {!isAddingAddress && (
                                    <button
                                        onClick={() => setIsAddingAddress(true)}
                                        className="px-5 py-3 rounded-xl bg-saffron/10 text-saffron text-[10px] font-bold uppercase tracking-wider hover:bg-saffron hover:text-white transition-all shadow-lg shadow-saffron/5 flex items-center gap-2"
                                    >
                                        <Plus size={14} /> {t('address.add_new')}
                                    </button>
                                )}
                            </div>

                            <AnimatePresence mode="wait">
                                {isAddingAddress ? (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        onSubmit={handleAddAddress}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">{t('address.form.flat')}</label>
                                            <input
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-5 text-sm outline-none focus:border-saffron focus:ring-4 focus:ring-saffron/5 transition-all"
                                                placeholder="e.g. A-101"
                                                required
                                                value={newAddress.flat}
                                                onChange={e => setNewAddress({ ...newAddress, flat: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">{t('address.form.society')}</label>
                                            <input
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-5 text-sm outline-none focus:border-saffron focus:ring-4 focus:ring-saffron/5 transition-all"
                                                placeholder="e.g. Shanti Sadan"
                                                required
                                                value={newAddress.society}
                                                onChange={e => setNewAddress({ ...newAddress, society: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">{t('address.form.area')}</label>
                                            <input
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-5 text-sm outline-none focus:border-saffron focus:ring-4 focus:ring-saffron/5 transition-all"
                                                placeholder="e.g. Kalyan Naka"
                                                required
                                                value={newAddress.area}
                                                onChange={e => setNewAddress({ ...newAddress, area: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">{t('address.form.landmark')}</label>
                                            <input
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-5 text-sm outline-none focus:border-saffron focus:ring-4 focus:ring-saffron/5 transition-all"
                                                placeholder="e.g. Near Shiv Mandir"
                                                value={newAddress.landmark}
                                                onChange={e => setNewAddress({ ...newAddress, landmark: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">{t('address.form.pincode')}</label>
                                            <input
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-5 text-sm outline-none focus:border-saffron focus:ring-4 focus:ring-saffron/5 transition-all"
                                                placeholder="421302"
                                                required
                                                maxLength={6}
                                                value={newAddress.pincode}
                                                onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex gap-4 mt-6 md:col-span-2">
                                            <button
                                                type="submit"
                                                disabled={isProcessing}
                                                className="bg-saffron text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex-grow shadow-2xl shadow-saffron/20 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
                                            >
                                                {isProcessing ? t('address.adding') : t('address.save_select')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsAddingAddress(false)}
                                                className="px-10 py-5 rounded-2xl bg-black/5 dark:bg-white/5 font-black uppercase tracking-widest text-xs hover:bg-black/10 transition-all"
                                            >
                                                {t('address.cancel')}
                                            </button>
                                        </div>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        key="list"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                    >
                                        {addresses.map(addr => (
                                            <motion.div
                                                key={addr.id}
                                                variants={itemVariants}
                                                onClick={() => setSelectedAddressId(addr.id)}
                                                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex justify-between items-start group relative overflow-hidden ${selectedAddressId === addr.id
                                                    ? 'border-saffron bg-saffron/5 shadow-xl shadow-saffron/10'
                                                    : 'border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:border-saffron/30 hover:bg-saffron/[0.02]'
                                                    }`}
                                            >
                                                <div className="space-y-1 relative z-10">
                                                    <p className="font-bold text-base font-display">{addr.flat}, {addr.society}</p>
                                                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{addr.area}, {addr.city}</p>
                                                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{addr.pincode}, {addr.state}</p>
                                                </div>
                                                {selectedAddressId === addr.id && (
                                                    <div className="w-10 h-10 rounded-full bg-saffron text-white flex items-center justify-center shadow-lg shadow-saffron/30">
                                                        <Check size={20} />
                                                    </div>
                                                )}
                                                {/* Decorative background circle */}
                                                <div className={`absolute -bottom-10 -right-10 w-24 h-24 rounded-full transition-all duration-700 ${selectedAddressId === addr.id ? 'bg-saffron/10' : 'bg-transparent'}`}></div>
                                            </motion.div>
                                        ))}
                                        {addresses.length === 0 && (
                                            <div className="col-span-2 text-center py-16 opacity-30 flex flex-col items-center gap-4">
                                                <MapPin size={48} className="text-muted-foreground" />
                                                <p className="font-bold uppercase tracking-widest text-sm">{t('address.no_addresses')}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Section 2: Payment Method */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass rounded-[3rem] p-8 md:p-12 border-white/50 shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold font-display tracking-tight flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron">
                                    <CreditCard size={20} />
                                </div>
                                {t('sections.payment')}
                            </h2>

                            <div className="space-y-6">
                                <div className="p-8 rounded-[2.5rem] border-2 border-saffron bg-saffron/5 flex items-center justify-between cursor-pointer shadow-xl shadow-saffron/10 relative overflow-hidden group">
                                    <div className="flex items-center gap-8 relative z-10">
                                        <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-3xl flex items-center justify-center text-saffron shadow-lg">
                                            <CreditCard size={32} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg mb-0.5">{t('payment.online_title')}</p>
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{t('payment.online_desc')}</p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-saffron text-white flex items-center justify-center shadow-lg shadow-saffron/30">
                                        <Check size={20} />
                                    </div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/10 blur-[50px] rounded-full"></div>
                                </div>

                                <div
                                    onClick={handleManualOrder}
                                    className="p-8 rounded-[2.5rem] border-2 border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] transition-all flex items-center justify-between group cursor-pointer"
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform duration-500">
                                            <ShoppingBag size={32} />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-lg mb-0.5 group-hover:text-emerald-500 transition-colors">{t('payment.manual_title')}</p>
                                            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider whitespace-nowrap">{t('payment.manual_desc')}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all" size={24} />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Order Summary Sticky */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="lg:sticky lg:top-36"
                        >
                            <div className="glass rounded-[3rem] p-10 md:p-12 border-white/50 shadow-2xl relative overflow-hidden group">
                                <h2 className="text-2xl font-bold font-display tracking-tight mb-8">{t('summary.title')}</h2>

                                <div className="max-h-[300px] overflow-y-auto mb-10 space-y-4 pr-3 scrollbar-thin custom-scrollbar">
                                    {items.map(item => (
                                        <div key={item.bookId} className="flex justify-between items-start gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/5 group/item">
                                            <div className="flex-grow">
                                                <p className="text-xs font-bold line-clamp-2 leading-snug mb-2 uppercase tracking-tight group-hover/item:text-saffron transition-colors">{item.title}</p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground bg-white/10 px-2 py-1 rounded-md">{t('summary.qty')}: {item.quantity}</span>
                                                    <span className="text-[9px] font-bold uppercase tracking-wider text-saffron">₹{item.unitPrice}</span>
                                                </div>
                                            </div>
                                            <p className="text-base font-bold tracking-tight">₹{item.unitPrice * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-8 border-t border-black/10 dark:border-white/10 mb-8">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                        <span>{t('summary.subtotal')}</span>
                                        <span className="text-foreground text-sm font-medium tracking-normal">₹{totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                        <span>{t('summary.delivery')}</span>
                                        <span className="text-emerald-500 tracking-wider font-bold">FREE</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-4">
                                        <span className="text-xs font-bold uppercase tracking-widest text-saffron mb-1">{t('summary.grand_total')}</span>
                                        <span className="text-4xl font-bold tracking-tight">₹{totalAmount}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                    className="w-full bg-saffron text-white hover:bg-saffron-dark py-5 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-wider transition-all shadow-xl shadow-saffron/20 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isProcessing ? t('summary.processing') : t('summary.place_order')}
                                    <ArrowRight size={20} />
                                </button>

                                <div className="mt-12 grid grid-cols-2 gap-6 pb-2">
                                    <div className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-emerald-500/5 text-emerald-500/60 transition-colors group/icon">
                                        <Truck size={24} className="group-hover/icon:animate-bounce" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-center">{t('summary.fast_delivery')}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-blue-500/5 text-blue-500/60 transition-colors group/icon">
                                        <ShoppingBag size={24} className="group-hover/icon:scale-110 transition-transform" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-center">{t('summary.safe_shopping')}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

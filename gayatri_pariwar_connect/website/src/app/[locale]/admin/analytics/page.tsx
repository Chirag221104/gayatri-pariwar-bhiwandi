'use client';

import React, { useEffect, useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    ShoppingCart,
    Clock,
    BookOpen,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    DollarSign,
    Target
} from 'lucide-react';
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    doc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';

export default function AnalyticsDashboard() {
    const [dailyMetrics, setDailyMetrics] = useState<any[]>([]);
    const [todayMetrics, setTodayMetrics] = useState<any>(null);
    const [monthMetrics, setMonthMetrics] = useState<any>(null);
    const [skuMetrics, setSkuMetrics] = useState<any[]>([]);
    const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
    const [booksMap, setBooksMap] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Fetch Today's metrics (real-time)
        const todayId = new Date().toLocaleDateString('en-GB', {
            timeZone: 'Asia/Kolkata', // IST as per backend logic
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split('/').reverse().join('');

        const unsubToday = onSnapshot(
            doc(db, `granthalaya_app/analytics_module/dailyMetrics/${todayId}`),
            (snap) => {
                if (snap.exists()) setTodayMetrics(snap.data());
            },
            (err) => console.error("Today Metrics Error:", err)
        );

        // 1.1 Fetch Month metrics
        const monthId = todayId.substring(0, 6); // YYYYMM
        const unsubMonth = onSnapshot(
            doc(db, `granthalaya_app/analytics_module/monthlyMetrics/${monthId}`),
            (snap) => {
                if (snap.exists()) setMonthMetrics(snap.data());
            }
        );

        // 1.2 Fetch Pending Orders Count (Logistics)
        const qPending = query(
            collection(db, "granthalaya_app", "orders_module", "orders"),
            where("deliveryStatus", "in", ["pending", "packed", "shipped"])
        );
        const unsubPending = onSnapshot(qPending, (snap) => {
            setPendingOrdersCount(snap.size);
        });

        // 2. Fetch Last 30 Days (for trends)
        const qDaily = query(
            collection(db, 'granthalaya_app/analytics_module/dailyMetrics'),
            orderBy('__name__', 'desc'),
            limit(30)
        );

        const unsubDaily = onSnapshot(qDaily, (snap) => {
            const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setDailyMetrics(docs.reverse());
        }, (err) => console.error("Daily Metrics Error:", err));

        const qSkus = query(
            collection(db, 'granthalaya_app/analytics_module/skuMetrics'),
            orderBy('unitsSold', 'desc'),
            limit(10)
        );

        const unsubSkus = onSnapshot(qSkus, (snap) => {
            setSkuMetrics(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        }, (err) => {
            console.error("SKU Metrics Error:", err);
            setLoading(false); // Don't block UI if one feed fails
        });

        // 3. Fetch Books for Title Mapping
        const unsubBooks = onSnapshot(collection(db, "granthalaya_app", "inventory", "books"), (snap) => {
            const mapping: Record<string, any> = {};
            snap.docs.forEach(d => {
                mapping[d.id] = { id: d.id, ...d.data() };
            });
            setBooksMap(mapping);
        });

        return () => {
            unsubToday();
            unsubMonth();
            unsubPending();
            unsubDaily();
            unsubSkus();
            unsubBooks();
        };
    }, []);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Helper: Format Currency (INR)
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    // Calculate Averages
    const getAvgTime = (total: number, count: number) => {
        if (!count || count === 0) return '0m';
        const mins = Math.round((total / count) / 60000);
        return `${mins}m`;
    };

    const formatDate = (id: string) => {
        if (!id || id.length !== 8) return id;
        const y = id.substring(0, 4);
        const m = id.substring(4, 6);
        const d = id.substring(6, 8);
        const date = new Date(`${y}-${m}-${d}`);
        return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    };

    const reservationToPackAvg = getAvgTime(todayMetrics?.total_resToPack_Time || 0, todayMetrics?.resToPack_Count || 0);
    const packToDeliveryAvg = getAvgTime(todayMetrics?.total_packToDelivery_Time || 0, todayMetrics?.packToDelivery_Count || 0);

    // Calculate Conversion Rate
    const conversionRate = todayMetrics?.reservationsCreated
        ? Math.round((todayMetrics.ordersDelivered / todayMetrics.reservationsCreated) * 100)
        : 0;

    const maxOrders = Math.max(5, ...dailyMetrics.map(d => d.ordersPlaced || 0));

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-primary" />
                    Operational Intelligence
                </h1>
                <p className="mt-2 text-gray-500">
                    Real-time business performance and logistics analytics.
                </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard
                    title="Month Revenue"
                    value={formatCurrency(monthMetrics?.revenue || 0)}
                    subValue={`${monthMetrics?.ordersDelivered || 0} Delivered`}
                    icon={<DollarSign className="h-5 w-5" />}
                    trend="This Month"
                    color="green"
                />
                <StatCard
                    title="Today's Revenue"
                    value={formatCurrency(todayMetrics?.revenue || 0)}
                    subValue={`${todayMetrics?.ordersDelivered || 0} Deliveries`}
                    icon={<TrendingUp className="h-5 w-5" />}
                    trend="Real-time"
                    color="blue"
                />
                <StatCard
                    title="Logistics Queue"
                    value={pendingOrdersCount}
                    subValue="Orders Pending"
                    icon={<ShoppingCart className="h-5 w-5" />}
                    trend="Action Required"
                    color="orange"
                />
                <StatCard
                    title="New Reservations"
                    value={todayMetrics?.reservationsCreated || 0}
                    subValue="Active holds"
                    icon={<Activity className="h-5 w-5" />}
                    trend="Today"
                    color="purple"
                />
                <StatCard
                    title="Delivery Success"
                    value={`${conversionRate}%`}
                    subValue="Res → Delivered"
                    icon={<CheckCircle2 className="h-5 w-5" />}
                    trend="Overall"
                    color="blue"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Orders Trend Graph (Simple CSS Bar Chart) */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Order Volume Trend</h2>
                            <p className="text-sm text-gray-500">Last 30 days activity</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                <Activity className="h-3 w-3" /> Orders/Day
                            </span>
                        </div>
                    </div>

                    <div className="h-48 flex items-end justify-between gap-1 mt-4">
                        {dailyMetrics.map((day, i) => (
                            <div key={day.id} className="flex-1 flex flex-col items-center group relative">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.max(8, ((day.ordersPlaced || 0) / maxOrders) * 100)}%` }}
                                    className={`w-full rounded-t-md transition-all relative overflow-hidden ${i === dailyMetrics.length - 1
                                        ? 'bg-gradient-to-t from-primary to-orange-400'
                                        : 'bg-primary/20 hover:bg-primary/40'
                                        }`}
                                >
                                    {i === dailyMetrics.length - 1 && (
                                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                    )}
                                </motion.div>
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 hidden group-hover:block z-20">
                                    <div className="bg-gray-900 text-white text-[10px] px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-white/10 backdrop-blur-sm">
                                        <div className="font-bold border-b border-white/10 mb-1 pb-1">{formatDate(day.id)}</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                            {day.ordersPlaced} Orders Placed
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            {day.ordersDelivered || 0} Delivered
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider px-1">
                        <span>{formatDate(dailyMetrics[0]?.id)}</span>
                        <span>{formatDate(dailyMetrics[Math.floor(dailyMetrics.length / 2)]?.id)}</span>
                        <span className="text-primary font-black">Today</span>
                    </div>
                </div>

                {/* Operational Timing Card */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gray-400" />
                        Logistics Speed
                    </h2>

                    <div className="space-y-6">
                        <TimingMetric
                            label="Order Pick-up Speed"
                            value={reservationToPackAvg}
                            description="Res → Packing"
                        />
                        <TimingMetric
                            label="Final Delivery Speed"
                            value={packToDeliveryAvg}
                            description="Packing → Delivered"
                        />

                        <div className="pt-4 border-t border-gray-50">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-500">Shelf Velocity</span>
                                <span className="font-bold text-green-600">Optimal</span>
                            </div>
                            <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full w-[85%]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top SKUs Intelligence */}
                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="p-8 pb-4 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-500" />
                            Inventory Velocity
                        </h2>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Top Performers</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {skuMetrics.slice(0, 5).map((sku) => (
                            <div key={sku.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    {booksMap[sku.id]?.imageUrl || booksMap[sku.id]?.coverUrl ? (
                                        <img
                                            src={booksMap[sku.id]?.imageUrl || booksMap[sku.id]?.coverUrl}
                                            alt=""
                                            className="w-10 h-14 rounded shadow-sm object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                                            BK
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 truncate max-w-[200px]">
                                            {booksMap[sku.id]?.name || booksMap[sku.id]?.title || sku.id}
                                        </div>
                                        <div className="text-xs text-gray-500">Velocity Score: {sku.velocityScore || 'Pending'}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-gray-900">{sku.unitsSold || 0} Sold</div>
                                    <div className="text-[10px] text-green-600 font-bold uppercase tracking-wider flex items-center gap-1 justify-end">
                                        <ArrowUpRight className="h-3 w-3" /> High
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conversion Funnel */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-purple-500" />
                        Conversion Funnel
                    </h2>

                    <div className="space-y-4">
                        <FunnelStep
                            label="Reservations Created"
                            count={todayMetrics?.reservationsCreated || 0}
                            percent={100}
                            color="bg-blue-500"
                        />
                        <FunnelStep
                            label="Orders Packed"
                            count={todayMetrics?.resToPack_Count || 0}
                            percent={todayMetrics?.reservationsCreated ? Math.round((todayMetrics.resToPack_Count / todayMetrics.reservationsCreated) * 100) : 0}
                            color="bg-purple-500"
                        />
                        <FunnelStep
                            label="Successfully Delivered"
                            count={todayMetrics?.ordersDelivered || 0}
                            percent={conversionRate}
                            color="bg-green-500"
                        />

                        <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                            <p className="text-xs text-orange-800 font-medium leading-relaxed">
                                <b>Optimization Tip:</b> {100 - conversionRate}% of your traffic drops out between reservation and delivery. Review <b>abandoned holds</b> to improve fulfillment.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, subValue, icon, trend, color }: any) {
    const isUp = trend?.startsWith('+');
    const colorClasses: any = {
        green: 'bg-green-50 text-green-600 border-green-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        orange: 'bg-orange-50 text-orange-600 border-orange-100',
        red: 'bg-red-50 text-red-600 border-red-100'
    };

    return (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${colorClasses[color]}`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-0.5 text-xs font-bold ${isUp ? 'text-green-600' : trend === 'Stable' ? 'text-gray-400' : 'text-red-600'}`}>
                        {isUp ? <ArrowUpRight className="h-3 w-3" /> : !isUp && trend !== 'Stable' ? <ArrowDownRight className="h-3 w-3" /> : null}
                        {trend}
                    </div>
                )}
            </div>
            <div className="text-2xl font-black text-gray-900 tracking-tight">{value}</div>
            <div className="text-sm font-bold text-gray-900 mt-1">{title}</div>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">{subValue}</p>
        </div>
    );
}

function TimingMetric({ label, value, description }: any) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <div className="text-sm font-bold text-gray-900">{label}</div>
                <div className="text-[11px] text-gray-400">{description}</div>
            </div>
            <div className="text-right">
                <div className="text-lg font-black text-gray-900 tracking-tight">{value}</div>
            </div>
        </div>
    );
}

function FunnelStep({ label, count, percent, color }: any) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <span>{label}</span>
                <span>{count} ({percent}%)</span>
            </div>
            <div className="h-4 bg-gray-50 rounded-lg overflow-hidden flex">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    className={`${color} h-full rounded-lg`}
                />
            </div>
        </div>
    );
}

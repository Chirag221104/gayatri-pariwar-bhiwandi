"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, ShoppingBag, IndianRupee, Package, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy, limit, where, getDoc, doc } from "firebase/firestore";
import SectionHeader from "@/components/ui/SectionHeader";
import { motion } from "framer-motion";

interface Stats {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalBooks: number;
    revenueGrowth: number;
    orderGrowth: number;
    categoryData: { name: string; value: number; color: string }[];
    revenueHistory: { label: string; value: number }[];
    lowStockCount: number;
    pendingOrdersCount: number;
    activeRidersCount: number;
}

export default function AnalyticsPage() {
    const [stats, setStats] = useState<Stats>({
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalBooks: 0,
        revenueGrowth: 15.4,
        orderGrowth: 10.2,
        categoryData: [],
        revenueHistory: [],
        lowStockCount: 0,
        pendingOrdersCount: 0,
        activeRidersCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDark = () => {
            const saved = localStorage.getItem('admin-theme');
            if (saved === 'dark') setIsDark(true);
            else if (saved === 'system') setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
            else setIsDark(false);
        };
        checkDark();
        const interval = setInterval(checkDark, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch Orders
                const ordersSnap = await getDocs(collection(db, "granthalaya_app", "orders_module", "orders"));
                let revenue = 0;
                ordersSnap.forEach(doc => {
                    const data = doc.data();
                    revenue += data.totalAmount || 0;
                });

                // Fetch Users
                const usersSnap = await getDocs(collection(db, "users"));

                // Fetch Books
                const booksSnap = await getDocs(collection(db, "granthalaya_app", "inventory", "books"));

                // Categorize books for pie chart
                const categories: Record<string, number> = {};
                booksSnap.forEach(doc => {
                    const cat = doc.data().category || "Uncategorized";
                    categories[cat] = (categories[cat] || 0) + 1;
                });

                const colors = ["#F97316", "#3B82F6", "#8B5CF6", "#10B981", "#EC4899", "#6366F1"];
                const categoryData = Object.entries(categories).map(([name, value], i) => ({
                    name,
                    value,
                    color: colors[i % colors.length]
                })).sort((a, b) => b.value - a.value).slice(0, 6);

                // Calculate Health Metrics
                const configSnap = await getDoc(doc(db, "granthalaya_app", "config"));
                const lowStockThreshold = configSnap.exists() ? configSnap.data().lowStockThreshold : 5;

                let lowStockCount = 0;
                booksSnap.forEach(doc => {
                    const book = doc.data();
                    if ((book.stock || 0) <= lowStockThreshold) lowStockCount++;
                });

                let pendingOrdersCount = 0;
                ordersSnap.forEach(doc => {
                    if (doc.data().deliveryStatus === "pending") pendingOrdersCount++;
                });

                let activeRidersCount = 0;
                usersSnap.forEach(doc => {
                    if (doc.data().roles?.isRider) activeRidersCount++;
                });

                // Mock Revenue History for visualization
                const revenueHistory = [
                    { label: "Mon", value: 450 },
                    { label: "Tue", value: 890 },
                    { label: "Wed", value: 1200 },
                    { label: "Thu", value: 980 },
                    { label: "Fri", value: 1500 },
                    { label: "Sat", value: 2100 },
                    { label: "Sun", value: 1800 },
                ];

                setStats({
                    totalRevenue: revenue,
                    totalOrders: ordersSnap.size,
                    totalUsers: usersSnap.size,
                    totalBooks: booksSnap.size,
                    revenueGrowth: 15.4,
                    orderGrowth: 10.2,
                    categoryData,
                    revenueHistory,
                    lowStockCount,
                    pendingOrdersCount,
                    activeRidersCount
                });
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-500/10", growth: stats.revenueGrowth },
        { label: "Total Orders", value: stats.totalOrders.toString(), icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10", growth: stats.orderGrowth },
        { label: "Active Users", value: stats.totalUsers.toString(), icon: Users, color: "text-orange-500", bg: "bg-orange-500/10", growth: 4.5 },
        { label: "Book Inventory", value: stats.totalBooks.toString(), icon: Package, color: "text-purple-500", bg: "bg-purple-500/10", growth: 2.1 },
    ];

    if (loading) {
        return <div className="animate-pulse space-y-8">
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-3xl w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-[2rem]"></div>)}
            </div>
        </div>;
    }

    return (
        <div className="space-y-8">
            <SectionHeader
                icon={BarChart3}
                title="Business Analytics"
                subtitle="Real-time performance metrics and growth insights"
            />

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-6 rounded-[2.5rem] border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${card.bg}`}>
                                <card.icon className={`w-5 h-5 ${card.color}`} />
                            </div>
                            <div className={`flex items-center gap-0.5 text-[10px] font-bold ${card.growth >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {card.growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {Math.abs(card.growth)}%
                            </div>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-500 mb-1">{card.label}</h4>
                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{card.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Performance Chart */}
                <div className={`p-8 rounded-[3rem] border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold">Sales Performance</h3>
                            <p className="text-xs text-slate-500">Revenue trends over the last 7 days</p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-emerald-500 opacity-50" />
                    </div>

                    <div className="flex items-end justify-between h-64 gap-2 pt-4 px-2 overflow-hidden">
                        {stats.revenueHistory.map((item, i) => {
                            const maxVal = Math.max(...stats.revenueHistory.map(h => h.value));
                            const height = (item.value / maxVal) * 100;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                    <div className="w-full relative h-full flex items-end">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                            className={`w-full rounded-t-xl transition-all duration-300 group-hover:bg-orange-600 ${isDark ? 'bg-orange-500/20 shadow-[0_-4px_12px_rgba(249,115,22,0.1)]' : 'bg-orange-500'}`}
                                        />
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                            ₹{item.value}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{item.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Popular Categories Visualization */}
                <div className={`p-8 rounded-[3rem] border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold">Inventory Breakdown</h3>
                            <p className="text-xs text-slate-500">Stock distribution by top categories</p>
                        </div>
                        <Package className="w-5 h-5 text-purple-500 opacity-50" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-64">
                        <div className="relative aspect-square flex items-center justify-center">
                            {/* Simple Circular Visualization using layered circles or SVG */}
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                {stats.categoryData.reduce((acc, cat, idx) => {
                                    const total = stats.categoryData.reduce((sum, c) => sum + c.value, 0);
                                    const percentage = (cat.value / total) * 100;
                                    const offset = acc.totalOffset;

                                    const strokeDasharray = `${percentage} ${100 - percentage}`;
                                    const strokeDashoffset = -offset;

                                    acc.elements.push(
                                        <motion.circle
                                            key={idx}
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="transparent"
                                            stroke={cat.color}
                                            strokeWidth="12"
                                            strokeDasharray={strokeDasharray}
                                            strokeDashoffset={strokeDashoffset}
                                            pathLength="100"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 100 }}
                                            transition={{ duration: 1.5, delay: 0.2 }}
                                        />
                                    );
                                    acc.totalOffset += percentage;
                                    return acc;
                                }, { elements: [] as any, totalOffset: 0 }).elements}
                                <circle cx="50" cy="50" r="34" fill={isDark ? "#1e293b" : "white"} />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.totalBooks}</span>
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Books</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {stats.categoryData.map((cat, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors truncate max-w-[100px]">{cat.name}</span>
                                    </div>
                                    <span className={`text-xs font-black ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>{cat.value}</span>
                                </div>
                            ))}
                            {stats.categoryData.length === 0 && (
                                <div className="text-center py-4">
                                    <p className="text-xs text-slate-400">No inventory data available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity placeholder */}
            <div className={`p-8 rounded-[3rem] border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="font-bold text-lg">System Health</h3>
                        <p className="text-xs text-slate-500">Live indicators for inventory and logistics</p>
                    </div>
                    <Activity className="w-6 h-6 text-orange-500 animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1 block">Logistics Status</span>
                        <p className="text-sm font-bold">{stats.activeRidersCount} riders registered</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1 block">Inventory Alert</span>
                        <p className="text-sm font-bold">{stats.lowStockCount} books below threshold</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1 block">Orders Pending</span>
                        <p className="text-sm font-bold">{stats.pendingOrdersCount} orders awaiting pickup</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import {
    Users,
    Calendar,
    ClipboardList,
    HandHelping,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    BarChart3,
    PieChart,
    Clock,
    ChevronRight
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";

interface DashboardStats {
    totalUsers: number;
    totalEvents: number;
    pendingRequests: number;
    activeSeva: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale as string || "en";

    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalEvents: 0,
        pendingRequests: 0,
        activeSeva: 0
    });
    const [loading, setLoading] = useState(true);

    // Check if dark mode (passed from layout or detect from DOM)
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        const checkDark = () => {
            const saved = localStorage.getItem('admin-theme');
            if (saved === 'dark') {
                setIsDark(true);
            } else if (saved === 'system') {
                setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
            } else {
                setIsDark(false);
            }
        };
        checkDark();
        window.addEventListener('storage', checkDark);
        const interval = setInterval(checkDark, 500); // Poll for theme changes
        return () => {
            window.removeEventListener('storage', checkDark);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        async function fetchStats() {
            try {
                const fetchUsers = async () => {
                    try {
                        const snap = await getDocs(query(collection(db, "users"), limit(500)));
                        return snap.size;
                    } catch (e) {
                        console.warn("User stats limited:", e);
                        return 0;
                    }
                };

                const fetchEvents = async () => {
                    try {
                        const snap = await getDocs(collection(db, "events"));
                        return snap.size;
                    } catch (e) {
                        return 0;
                    }
                };

                const fetchRequests = async () => {
                    try {
                        const snap = await getDocs(collection(db, "service_requests"));
                        return snap.docs.filter(d => d.data().status === "pending" || d.data().status === "requested").length;
                    } catch (e) {
                        return 0;
                    }
                };

                const fetchSeva = async () => {
                    try {
                        const snap = await getDocs(collection(db, "seva_opportunities"));
                        return snap.docs.filter(d => d.data().status === "active" || d.data().status === "published").length;
                    } catch (e) {
                        return 0;
                    }
                };

                const [userCount, eventCount, requestCount, sevaCount] = await Promise.all([
                    fetchUsers(),
                    fetchEvents(),
                    fetchRequests(),
                    fetchSeva()
                ]);

                setStats({
                    totalUsers: userCount,
                    totalEvents: eventCount,
                    pendingRequests: requestCount,
                    activeSeva: sevaCount
                });
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    const handleAction = (href: string) => {
        router.push(`/${locale}${href}`);
    };

    const statCards = [
        {
            name: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            trend: "+12%",
            trendUp: true,
            primary: true,
            href: "/admin/dashboard"
        },
        {
            name: "Global Events",
            value: stats.totalEvents,
            icon: Calendar,
            trend: "Active",
            trendUp: true,
            primary: false,
            href: "/admin/events"
        },
        {
            name: "Pending Requests",
            value: stats.pendingRequests,
            icon: ClipboardList,
            trend: "Action Required",
            trendUp: false,
            primary: false,
            href: "/admin/services"
        },
        {
            name: "Seva Openings",
            value: stats.activeSeva,
            icon: HandHelping,
            trend: "Live",
            trendUp: true,
            primary: false,
            href: "/admin/services"
        },
    ];

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div>
                    <div className={`h-8 rounded-lg w-1/4 mb-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                    <div className={`h-4 rounded w-1/3 ${isDark ? 'bg-slate-700/50' : 'bg-slate-200/70'}`} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[1, 2, 3, 4].map(i => (
                        <div
                            key={i}
                            className={`h-32 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white shadow'}`}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Dashboard
                </h1>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Welcome back! Here's what's happening with your community.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((card, index) => (
                    <div
                        key={card.name}
                        onClick={() => handleAction(card.href)}
                        className={`
                            relative p-5 rounded-xl cursor-pointer transition-all duration-200 
                            ${card.primary
                                ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                                : isDark
                                    ? 'bg-slate-800 hover:bg-slate-750 border border-slate-700'
                                    : 'bg-white hover:shadow-md shadow-sm border border-slate-200'
                            }
                        `}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`p-2 rounded-lg ${card.primary
                                ? 'bg-white/20'
                                : isDark
                                    ? 'bg-slate-700'
                                    : 'bg-slate-100'
                                }`}>
                                <card.icon className={`w-5 h-5 ${card.primary
                                    ? 'text-white'
                                    : isDark
                                        ? 'text-slate-400'
                                        : 'text-slate-600'
                                    }`} />
                            </div>
                            <ArrowUpRight className={`w-4 h-4 ${card.primary
                                ? 'text-white/60'
                                : isDark
                                    ? 'text-slate-600'
                                    : 'text-slate-400'
                                }`} />
                        </div>

                        <div className={`text-sm font-medium mb-1 ${card.primary
                            ? 'text-white/80'
                            : isDark
                                ? 'text-slate-400'
                                : 'text-slate-500'
                            }`}>
                            {card.name}
                        </div>

                        <div className="flex items-end justify-between">
                            <span className={`text-2xl font-bold ${card.primary
                                ? 'text-white'
                                : isDark
                                    ? 'text-white'
                                    : 'text-slate-900'
                                }`}>
                                {card.value.toLocaleString()}
                            </span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${card.primary
                                ? 'bg-white/20 text-white'
                                : card.trendUp
                                    ? isDark
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-emerald-50 text-emerald-600'
                                    : isDark
                                        ? 'bg-amber-500/20 text-amber-400'
                                        : 'bg-amber-50 text-amber-600'
                                }`}>
                                {card.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {card.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Activity Chart */}
                <div className={`lg:col-span-2 p-6 rounded-xl ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-sm border border-slate-200'
                    }`}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                <BarChart3 className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                            </div>
                            <div>
                                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Activity Overview
                                </h3>
                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    Last 7 days
                                </p>
                            </div>
                        </div>
                        <select className={`text-sm px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${isDark
                            ? 'bg-slate-700 border-slate-600 text-slate-300'
                            : 'bg-white border-slate-200 text-slate-600'
                            }`}>
                            <option>This week</option>
                            <option>This month</option>
                        </select>
                    </div>

                    {/* Chart Placeholder */}
                    <div className={`h-48 rounded-lg flex items-center justify-center border-2 border-dashed ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-slate-50'
                        }`}>
                        <div className="text-center">
                            <BarChart3 className={`w-10 h-10 mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Chart integration coming soon
                            </p>
                        </div>
                    </div>
                </div>

                {/* Engagement Breakdown */}
                <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-sm border border-slate-200'
                    }`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                            <PieChart className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                        </div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Engagement
                        </h3>
                    </div>

                    {/* Pie Placeholder */}
                    <div className={`h-32 rounded-lg flex items-center justify-center border-2 border-dashed mb-4 ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-slate-50'
                        }`}>
                        <PieChart className={`w-8 h-8 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                    </div>

                    {/* Legend */}
                    <div className="space-y-2">
                        {[
                            { label: 'Events', color: 'bg-orange-500', value: '45%' },
                            { label: 'Seva', color: 'bg-blue-500', value: '30%' },
                            { label: 'Content', color: 'bg-purple-500', value: '25%' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{item.label}</span>
                                </div>
                                <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-sm border border-slate-200'
                }`}>
                <div className="flex items-center gap-3 mb-5">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        <Clock className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                    </div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Quick Actions
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        { label: 'Create Event', href: '/admin/events/new', icon: Calendar },
                        { label: 'Add News', href: '/admin/news', icon: ClipboardList },
                        { label: 'View Requests', href: '/admin/services', icon: HandHelping },
                        { label: 'Admin Logs', href: '/admin/logs', icon: Clock },
                    ].map((action) => (
                        <button
                            key={action.label}
                            onClick={() => handleAction(action.href)}
                            className={`flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all ${isDark
                                ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <action.icon className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                                {action.label}
                            </div>
                            <ChevronRight className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

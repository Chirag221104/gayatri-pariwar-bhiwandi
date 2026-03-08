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
    PieChart as LucidePieChart,
    Clock,
    ChevronRight,
    LayoutDashboard
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";
import SectionHeader from "@/components/ui/SectionHeader";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import {
    processUserGrowth,
    processRoleDistribution,
    processEventEngagement,
    processContentDistribution,
    processSevaFulfillment,
    processLMSCourseStats,
    GrowthDataPoint,
    ChartDataPoint
} from "@/lib/analytics";

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
    const [growthData, setGrowthData] = useState<GrowthDataPoint[]>([]);
    const [roleData, setRoleData] = useState<ChartDataPoint[]>([]);
    const [eventData, setEventData] = useState<ChartDataPoint[]>([]);
    const [contentData, setContentData] = useState<ChartDataPoint[]>([]);
    const [sevaFulfillmentData, setSevaFulfillmentData] = useState<ChartDataPoint[]>([]);
    const [lmsData, setLmsData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#f97316', '#3b82f6', '#a855f7', '#10b981', '#6366f1'];
    const CONTENT_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

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
        async function fetchDashboardData() {
            try {
                // Fetch Users for Stats and Growth
                const userSnap = await getDocs(query(
                    collection(db, "users"),
                    orderBy("createdAt", "desc"),
                    limit(1000)
                ));
                const allUsers = userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Fetch Events
                const eventSnap = await getDocs(collection(db, "events"));
                const allEvents = eventSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Fetch Requests & Seva
                const requestSnap = await getDocs(collection(db, "service_requests"));
                const sevaSnap = await getDocs(collection(db, "seva_opportunities"));
                const allSeva = sevaSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Fetch News & Media for content distribution
                const newsSnap = await getDocs(collection(db, "news"));
                const mediaSnap = await getDocs(collection(db, "media"));

                setStats({
                    totalUsers: userSnap.size,
                    totalEvents: eventSnap.size,
                    pendingRequests: requestSnap.docs.filter(d => d.data().status === "pending" || d.data().status === "requested").length,
                    activeSeva: sevaSnap.docs.filter(d => d.data().status === "active" || d.data().status === "published").length
                });

                setGrowthData(processUserGrowth(allUsers));
                setRoleData(processRoleDistribution(allUsers));
                setEventData(processEventEngagement(allEvents));

                setContentData(processContentDistribution({
                    events: eventSnap.size,
                    news: newsSnap.size,
                    media: mediaSnap.size,
                    seva: sevaSnap.size
                }));

                setSevaFulfillmentData(processSevaFulfillment(allSeva));
                setLmsData(processLMSCourseStats(allUsers));

            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
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
        <div className="space-y-8 flex flex-col h-[calc(100vh-8rem)]">
            <SectionHeader
                title="Dashboard"
                subtitle="Welcome back! Here's what's happening with your community."
                icon={LayoutDashboard}
            />

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
                                    ? 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800'
                                    : 'bg-white hover:shadow-md shadow-sm border border-slate-200'
                            }
                        `}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`p-2 rounded-lg ${card.primary
                                ? 'bg-white/20'
                                : isDark
                                    ? 'bg-zinc-800'
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
                                ? 'text-zinc-400'
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
                <div className={`lg:col-span-2 p-6 rounded-xl ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm border border-slate-200'
                    }`}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                                <TrendingUp className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                            </div>
                            <div>
                                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    User Growth Trend
                                </h3>
                                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    Last 15 registration days
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* User Growth Chart */}
                    <div className="h-72 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#333' : '#eee'} />
                                <XAxis
                                    dataKey="date"
                                    stroke={isDark ? '#666' : '#999'}
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke={isDark ? '#666' : '#999'}
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? '#18181b' : '#fff',
                                        border: `1px solid ${isDark ? '#3f3f46' : '#e2e8f0'}`,
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#f97316"
                                    strokeWidth={4}
                                    dot={{ fill: '#f97316', r: 5, strokeWidth: 2, stroke: isDark ? '#18181b' : '#fff' }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                    animationDuration={1500}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Engagement Breakdown */}
                <div className={`p-6 rounded-xl ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm border border-slate-200'
                    }`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                            <LucidePieChart className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                        </div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            User Distribution
                        </h3>
                    </div>

                    {/* Role Distribution Chart */}
                    <div className="h-48 mb-6 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={roleData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={75}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {roleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-2 mt-4">
                        {roleData.map((item, index) => (
                            <div key={item.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{item.name}</span>
                                </div>
                                <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {item.value} ({Math.round((item.value / stats.totalUsers) * 100)}%)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content & Seva Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Content Distribution */}
                <div className={`p-6 rounded-xl ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm border border-slate-200'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                            <ClipboardList className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Content Presence
                        </h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={contentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={85}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {contentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CONTENT_COLORS[index % CONTENT_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {contentData.map((item, index) => (
                            <div key={item.name} className="flex items-center justify-between text-xs p-2 rounded-lg bg-zinc-50/50 dark:bg-zinc-800/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CONTENT_COLORS[index % CONTENT_COLORS.length] }} />
                                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{item.name}</span>
                                </div>
                                <span className="font-bold">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Seva Performance */}
                <div className={`p-6 rounded-xl ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm border border-slate-200'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                            <HandHelping className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        </div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Seva Fulfillment
                        </h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sevaFulfillmentData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke={isDark ? '#666' : '#999'} fontSize={12} width={70} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: isDark ? '#18181b' : '#fff', borderRadius: '8px' }}
                                />
                                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl mt-4 border border-emerald-100 dark:border-emerald-800/30">
                        <p className="text-sm text-emerald-800 dark:text-emerald-400 font-medium text-center">
                            Volunteer conversion rate is healthy.
                            <br />
                            <span className="text-xs opacity-70">Focus on "Active" assignments to ensure completion.</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* LMS & Event Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Event Engagement */}
                <div className={`p-6 rounded-xl ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm border border-slate-200'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                            <Calendar className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                        </div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Event Participation
                        </h3>
                    </div>

                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={eventData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#333' : '#eee'} />
                                <XAxis dataKey="name" stroke={isDark ? '#666' : '#999'} fontSize={10} angle={-15} textAnchor="end" height={50} />
                                <YAxis stroke={isDark ? '#666' : '#999'} fontSize={11} />
                                <Tooltip contentStyle={{ backgroundColor: isDark ? '#18181b' : '#fff', borderRadius: '8px' }} />
                                <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* LMS Course Engagement */}
                <div className={`p-6 rounded-xl ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm border border-slate-200'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                            <BarChart3 className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                        </div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Sanskar Course Traffic
                        </h3>
                    </div>

                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lmsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#333' : '#eee'} />
                                <XAxis dataKey="name" stroke={isDark ? '#666' : '#999'} fontSize={11} />
                                <YAxis stroke={isDark ? '#666' : '#999'} fontSize={11} />
                                <Tooltip contentStyle={{ backgroundColor: isDark ? '#18181b' : '#fff', borderRadius: '8px' }} />
                                <Line type="step" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm border border-slate-200'
                }`}>
                <div className="flex items-center gap-3 mb-5">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
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
                                ? 'bg-zinc-800 hover:bg-zinc-750 text-zinc-200'
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

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import {
    LayoutDashboard,
    Calendar,
    Newspaper,
    Sprout,
    FileText,
    Users,
    ClipboardList,
    Info,
    LogOut,
    Menu,
    X,
    Settings,
    History,
    Sun,
    Moon,
    Monitor,
    BookOpen,
    ShoppingCart,
    MapPin,
    BarChart3
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

type Theme = 'light' | 'dark' | 'system';
type AdminSuite = 'app' | 'granthalaya';

interface NavItem {
    name: string;
    href: string;
    icon: any;
}

interface NavGroup {
    label: string;
    items: NavItem[];
    suites: AdminSuite[];
}

const navGroups: NavGroup[] = [
    {
        label: "Core",
        suites: ['app', 'granthalaya'],
        items: [
            { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
            { name: "Admin Logs", href: "/admin/logs", icon: History },
        ]
    },
    {
        label: "Content",
        suites: ['app'],
        items: [
            { name: "Events", href: "/admin/events", icon: Calendar },
            { name: "News & Activities", href: "/admin/news", icon: Newspaper },
            { name: "Spiritual Content", href: "/admin/spiritual", icon: Sprout },
            { name: "Media Library", href: "/admin/media", icon: FileText },
        ]
    },
    {
        label: "Management",
        suites: ['app'],
        items: [
            { name: "Public Groups", href: "/admin/groups", icon: Users },
            { name: "Service Management", href: "/admin/services", icon: ClipboardList },
            { name: "Important Info", href: "/admin/info", icon: Info },
            { name: "Festival Calendar", href: "/admin/calendar", icon: Settings },
        ]
    },
    {
        label: "Granthalaya",
        suites: ['granthalaya'],
        items: [
            { name: "Inventory", href: "/admin/books", icon: BookOpen },
            { name: "Fulfillment", href: "/admin/books/orders", icon: ShoppingCart },
            { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
            { name: "Advanced Config", href: "/admin/books/config", icon: Settings },
        ]
    },
    {
        label: "CRM",
        suites: ['granthalaya'],
        items: [
            { name: "Users", href: "/admin/users", icon: Users },
            { name: "Address Book", href: "/admin/users/addresses", icon: MapPin },
        ]
    }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [theme, setTheme] = useState<Theme>('light');
    const [activeSuite, setActiveSuite] = useState<AdminSuite>('app');
    const [showSuiteSwitcher, setShowSuiteSwitcher] = useState(false);
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
    const pathname = usePathname();
    const params = useParams();
    const locale = (params?.locale as string) || "en";

    // Auto-switch suite based on URL
    useEffect(() => {
        if (pathname.includes("/admin/books") || pathname.includes("/admin/analytics") || pathname.includes("/admin/users")) {
            setActiveSuite('granthalaya');
        } else if (pathname.includes("/admin/dashboard") || pathname.includes("/admin/logs")) {
            // Keep current suite for core pages or default to first visit
        } else {
            setActiveSuite('app');
        }
    }, [pathname]);

    // Theme management
    useEffect(() => {
        const saved = localStorage.getItem('admin-theme') as Theme | null;
        if (saved) setTheme(saved);
    }, []);

    useEffect(() => {
        const updateResolved = () => {
            if (theme === 'system') {
                setResolvedTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            } else {
                setResolvedTheme(theme);
            }
        };
        updateResolved();
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        mq.addEventListener('change', updateResolved);
        return () => mq.removeEventListener('change', updateResolved);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('admin-theme', theme);
    }, [theme]);

    const cycleTheme = () => {
        const next: Theme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
        setTheme(next);
    };

    const handleLogout = async () => {
        await signOut(auth);
    };

    const isLoginPage = pathname.includes("/admin/login");
    const isDark = resolvedTheme === 'dark';

    if (isLoginPage) {
        return <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>{children}</div>;
    }

    return (
        <AdminGuard>
            <div className={`min-h-screen flex overflow-hidden transition-colors duration-200 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-800'
                }`}>
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-300 ease-out lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } ${isDark
                            ? 'bg-slate-800 border-r border-slate-700'
                            : 'bg-white border-r border-slate-200 shadow-sm'
                        }`}
                >
                    <div className="flex flex-col h-full bg-surface/5">
                        {/* Sidebar Header */}
                        <div className={`p-5 flex items-center justify-between border-b ${isDark ? 'border-slate-700' : 'border-slate-200'
                            }`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 flex items-center justify-center font-bold text-white text-sm shadow-md rounded-lg bg-gradient-to-br ${activeSuite === 'app' ? 'from-orange-500 to-orange-600' : 'from-blue-500 to-blue-600'
                                    }`}>
                                    {activeSuite === 'app' ? 'A' : 'G'}
                                </div>
                                <div>
                                    <span className={`font-semibold text-sm block tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {activeSuite === 'app' ? 'Gayatri App' : 'Granthalaya'}
                                    </span>
                                    <span className={`text-[10px] font-medium opacity-60 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Admin Suite
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className={`lg:hidden p-1.5 rounded-md transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                                    }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
                            {navGroups.filter(g => g.suites.includes(activeSuite)).map((group) => (
                                <div key={group.label}>
                                    <div className="px-3 mb-2">
                                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'
                                            }`}>
                                            {group.label}
                                        </span>
                                    </div>
                                    <div className="space-y-0.5">
                                        {group.items.map((item) => {
                                            const itemPath = `/${locale}${item.href}`;
                                            const isExact = pathname === itemPath;
                                            const isSubPath = pathname.startsWith(`${itemPath}/`);

                                            const hasSpecificMatch = navGroups.some(g =>
                                                g.items.some(other => {
                                                    const otherPath = `/${locale}${other.href}`;
                                                    return other.href !== item.href &&
                                                        other.href.startsWith(item.href) &&
                                                        pathname.startsWith(otherPath);
                                                })
                                            );

                                            const isActive = isExact || (isSubPath && !hasSpecificMatch);

                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={`/${locale}${item.href}`}
                                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                                                        ${isActive
                                                            ? isDark
                                                                ? 'bg-orange-500/15 text-orange-400'
                                                                : 'bg-orange-50 text-orange-600'
                                                            : isDark
                                                                ? 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                                        }`}
                                                >
                                                    <item.icon className={`w-[18px] h-[18px] ${isActive
                                                        ? isDark ? 'text-orange-400' : 'text-orange-500'
                                                        : isDark ? 'text-slate-500' : 'text-slate-400'
                                                        }`} />
                                                    <span>{item.name}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </nav>

                        {/* Sidebar Footer */}
                        <div className={`p-3 border-t space-y-1 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                            {/* Theme Toggle */}
                            <button
                                onClick={cycleTheme}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark
                                    ? 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                            >
                                {theme === 'light' && <Sun className="w-[18px] h-[18px] text-amber-500" />}
                                {theme === 'dark' && <Moon className="w-[18px] h-[18px] text-blue-400" />}
                                {theme === 'system' && <Monitor className="w-[18px] h-[18px] text-slate-400" />}
                                <span className="capitalize">{theme} Mode</span>
                            </button>

                            {/* Sign Out */}
                            <button
                                onClick={handleLogout}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDark
                                    ? 'text-slate-400 hover:bg-red-500/10 hover:text-red-400'
                                    : 'text-slate-600 hover:bg-red-50 hover:text-red-600'
                                    }`}
                            >
                                <LogOut className="w-[18px] h-[18px]" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Top Bar */}
                    <header className={`flex items-center justify-between px-4 lg:px-8 h-14 shrink-0 border-b relative z-[60] ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                        }`}>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className={`p-2 rounded-lg transition-colors lg:hidden ${isDark
                                    ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                <Menu className="w-5 h-5" />
                            </button>

                            {/* Suite Switcher Trigger */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowSuiteSwitcher(!showSuiteSwitcher)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${isDark
                                        ? 'border-slate-700 hover:bg-slate-700 text-slate-300'
                                        : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                                        }`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${activeSuite === 'app' ? 'bg-orange-500 animate-pulse' : 'bg-blue-500 animate-pulse'}`} />
                                    {activeSuite === 'app' ? 'Gayatri App' : 'Granthalaya'}
                                    <Menu className="w-3 h-3 opacity-50" />
                                </button>

                                {showSuiteSwitcher && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowSuiteSwitcher(false)}
                                        />
                                        <div className={`absolute top-full left-0 mt-2 w-56 rounded-xl shadow-2xl border p-1 z-20 animate-in fade-in zoom-in duration-200 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                                            }`}>
                                            <button
                                                onClick={() => {
                                                    setActiveSuite('app');
                                                    setShowSuiteSwitcher(false);
                                                }}
                                                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${activeSuite === 'app'
                                                    ? isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-600'
                                                    : isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 rounded-md bg-orange-500 shadow-lg shadow-orange-500/20">
                                                        <Monitor className="w-4 h-4 text-white" />
                                                    </div>
                                                    <span>Gayatri App</span>
                                                </div>
                                                {activeSuite === 'app' && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setActiveSuite('granthalaya');
                                                    setShowSuiteSwitcher(false);
                                                }}
                                                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all mt-1 ${activeSuite === 'granthalaya'
                                                    ? isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                                                    : isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 rounded-md bg-blue-500 shadow-lg shadow-blue-500/20">
                                                        <BookOpen className="w-4 h-4 text-white" />
                                                    </div>
                                                    <span>Gayatri Granthalaya</span>
                                                </div>
                                                {activeSuite === 'granthalaya' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>
                    </header>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </AdminGuard >
    );
}

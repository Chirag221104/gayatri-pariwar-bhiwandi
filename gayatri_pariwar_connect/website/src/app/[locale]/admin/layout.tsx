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
    Monitor
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

type Theme = 'light' | 'dark' | 'system';

const navGroups = [
    {
        label: "Core",
        items: [
            { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
            { name: "Admin Logs", href: "/admin/logs", icon: History },
        ]
    },
    {
        label: "Content",
        items: [
            { name: "Events", href: "/admin/events", icon: Calendar },
            { name: "News & Activities", href: "/admin/news", icon: Newspaper },
            { name: "Spiritual Content", href: "/admin/spiritual", icon: Sprout },
            { name: "Media Library", href: "/admin/media", icon: FileText },
        ]
    },
    {
        label: "Management",
        items: [
            { name: "Public Groups", href: "/admin/groups", icon: Users },
            { name: "Service Management", href: "/admin/services", icon: ClipboardList },
            { name: "Important Info", href: "/admin/info", icon: Info },
            { name: "Festival Calendar", href: "/admin/calendar", icon: Settings },
        ]
    }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [theme, setTheme] = useState<Theme>('light');
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
    const pathname = usePathname();
    const params = useParams();
    const locale = (params?.locale as string) || "en";

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
                {!sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
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
                    <div className="flex flex-col h-full">
                        {/* Sidebar Header */}
                        <div className={`p-5 flex items-center justify-between border-b ${isDark ? 'border-slate-700' : 'border-slate-200'
                            }`}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-md">
                                    G
                                </div>
                                <div>
                                    <span className={`font-semibold text-sm block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        Admin Suite
                                    </span>
                                    <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Gayatri Pariwar
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
                            {navGroups.map((group) => (
                                <div key={group.label}>
                                    <div className="px-3 mb-2">
                                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'
                                            }`}>
                                            {group.label}
                                        </span>
                                    </div>
                                    <div className="space-y-0.5">
                                        {group.items.map((item) => {
                                            const isActive = pathname === `/${locale}${item.href}` || pathname.startsWith(`/${locale}${item.href}/`);
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
                    <header className={`flex items-center justify-between px-4 lg:px-8 h-14 shrink-0 border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                        }`}>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                                }`}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
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
        </AdminGuard>
    );
}

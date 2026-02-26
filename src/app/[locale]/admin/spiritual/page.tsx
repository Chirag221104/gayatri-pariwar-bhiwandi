"use client";

import { useState, useEffect } from "react";
import {
    Quote as QuoteIcon,
    Lightbulb,
    BookOpen,
    Settings,
    CheckCircle2
} from "lucide-react";
import QuotesList from "@/components/admin/spiritual/QuotesList";
import TipsList from "@/components/admin/spiritual/TipsList";
import ResourcesList from "@/components/admin/spiritual/ResourcesList";
import MantraManager from "@/components/admin/spiritual/MantraManager";
import SankalpManager from "@/components/admin/spiritual/SankalpManager";
import YagyaManager from "@/components/admin/spiritual/YagyaManager";
import SectionHeader from "@/components/ui/SectionHeader";
import { Flame } from "lucide-react";

type TabType = "quotes" | "tips" | "resources" | "mantras" | "sankalp" | "yagya";

export default function SpiritualContentPage() {
    const [activeTab, setActiveTab] = useState<TabType>("quotes");
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
        const interval = setInterval(checkDark, 500);
        return () => clearInterval(interval);
    }, []);

    const tabs = [
        { id: "quotes", label: "Daily Quotes", icon: QuoteIcon },
        { id: "tips", label: "Meditation Tips", icon: Lightbulb },
        { id: "resources", label: "Resources", icon: BookOpen },
        { id: "mantras", label: "Mantras", icon: Settings },
        { id: "sankalp", label: "Sankalp", icon: CheckCircle2 },
        { id: "yagya", label: "Yagya Guide", icon: Flame },
    ];

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
            <SectionHeader
                title="Spiritual Content"
                subtitle="Manage daily inspiration, guidance, and resources"
                icon={BookOpen}
            />

            {/* Tab Navigation */}
            <div className={`flex items-center gap-1 p-1 border rounded-2xl w-fit ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-gray-100 border-gray-200'}`}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${activeTab === tab.id
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                            : isDark
                                ? "text-zinc-400 hover:text-white hover:bg-zinc-800"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className={`flex-1 min-h-0 border rounded-2xl overflow-hidden shadow-sm ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
                {activeTab === "quotes" && <QuotesList />}
                {activeTab === "tips" && <TipsList />}
                {activeTab === "resources" && <ResourcesList />}
                {activeTab === "mantras" && <MantraManager />}
                {activeTab === "sankalp" && <SankalpManager />}
                {activeTab === "yagya" && <YagyaManager />}
            </div>
        </div>
    );
}

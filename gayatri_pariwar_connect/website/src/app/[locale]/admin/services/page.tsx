"use client";

import { useState, useEffect } from "react";
import {
    Activity,
    ClipboardList,
    HandHelping,
    Settings2
} from "lucide-react";
import ServiceTypesList from "@/components/admin/services/ServiceTypesList";
import ServiceRequestsList from "@/components/admin/services/ServiceRequestsList";
import SevaList from "@/components/admin/services/SevaList";

type TabType = "requests" | "types" | "seva";

export default function ServiceManagementPage() {
    const [activeTab, setActiveTab] = useState<TabType>("requests");
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
        { id: "requests", label: "Community Requests", icon: ClipboardList, description: "Manage incoming service bookings" },
        { id: "types", label: "Service Types", icon: Settings2, description: "Configure available spiritual services" },
        { id: "seva", label: "Seva Opportunities", icon: HandHelping, description: "Manage volunteer openings" },
    ];

    const activeTabInfo = tabs.find(t => t.id === activeTab);

    return (
        <div className="space-y-8 flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold flex items-center gap-4 ${isDark ? 'text-white' : 'text-black'}`}>
                        <Activity className="w-8 h-8 text-orange-500" />
                        Service Management
                    </h1>
                    <p className="text-slate-500 mt-1">{activeTabInfo?.description}</p>
                </div>

                {/* Tab Navigation */}
                <div className={`flex items-center gap-1 p-1 border rounded-2xl w-fit shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                : isDark
                                    ? "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className={`flex-1 min-h-0 border rounded-2xl overflow-hidden relative shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                {activeTab === "requests" && <ServiceRequestsList />}
                {activeTab === "types" && <ServiceTypesList />}
                {activeTab === "seva" && <SevaList />}
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Phone, MapPin, Tag, ShieldCheck } from "lucide-react";
import ContactsList from "@/components/admin/info/ContactsList";
import LocationsList from "@/components/admin/info/LocationsList";
import TagRoleManager from "@/components/admin/info/TagRoleManager";

const TABS = [
    { id: 'contacts', label: 'Contacts', icon: Phone },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'tags', label: 'Tags & Roles', icon: ShieldCheck },
];

export default function ImportantInfoPage() {
    const [activeTab, setActiveTab] = useState('contacts');
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

    return (
        <div className={`flex flex-col h-full rounded-3xl overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
            {/* Header with Tabs */}
            <div className={`px-8 pt-8 sticky top-0 z-30 border-b ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>Important Information</h1>
                        <p className="text-[#B56550] text-sm font-medium mt-1">Manage emergency contacts, mandir locations, and organizational roles</p>
                    </div>
                </div>

                <div className="flex gap-8">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative ${isActive
                                    ? 'text-[#B56550]'
                                    : isDark
                                        ? 'text-slate-500 hover:text-slate-300'
                                        : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-[#B56550]' : isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                                {tab.label}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#B56550] rounded-t-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {activeTab === 'contacts' && <ContactsList />}
                {activeTab === 'locations' && <LocationsList />}
                {activeTab === 'tags' && <TagRoleManager />}
            </div>
        </div>
    );
}


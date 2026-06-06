"use client";

import { useState, useEffect } from "react";
import { Settings, Tag, Truck, Package, Save, IndianRupee, Layout, Hash, ListFilter } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, serverTimestamp, getDoc, setDoc } from "firebase/firestore";
import SectionHeader from "@/components/ui/SectionHeader";
import { useToast } from "@/components/ui/Toast";
import CategoryCMSPage from "../cms/page";
import { logAdminAction } from "@/lib/admin-logger";
import GenericCMS from "@/components/admin/granthalaya/GenericCMS";
import ProductMigrationTool from "@/components/admin/granthalaya/ProductMigrationTool";

type ConfigTab = "taxonomy" | "sections" | "tags" | "delivery" | "inventory";

interface ConfigData {
    deliveryFee: number;
    freeDeliveryThreshold: number;
    lowStockThreshold: number;
    featuredTags: string[];
}

export default function GranthalayaConfigPage() {
    const [activeTab, setActiveTab] = useState<ConfigTab>("taxonomy");
    const [config, setConfig] = useState<ConfigData>({
        deliveryFee: 40,
        freeDeliveryThreshold: 500,
        lowStockThreshold: 5,
        featuredTags: []
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const { showToast } = useToast();

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
        const fetchConfig = async () => {
            try {
                const docSnap = await getDoc(doc(db, "granthalaya_app", "config"));
                if (docSnap.exists()) {
                    setConfig(docSnap.data() as ConfigData);
                } else {
                    await setDoc(doc(db, "granthalaya_app", "config"), config);
                }
            } catch (error) {
                console.error("Error fetching config:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleSaveConfig = async () => {
        setIsSaving(true);
        try {
            const configDocRef = doc(db, "granthalaya_app", "config");
            const previousConfig = await getDoc(configDocRef);

            await setDoc(configDocRef, {
                ...config,
                updatedAt: serverTimestamp()
            });

            await logAdminAction({
                action: "UPDATE",
                collectionName: "granthalaya_app",
                documentId: "config",
                details: "Updated Granthalaya system configuration",
                previousData: previousConfig.exists() ? previousConfig.data() : null,
                newData: config
            });

            showToast("Configuration saved successfully", "success");
        } catch (error) {
            console.error("Error saving config:", error);
            showToast("Failed to save configuration", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const inputClasses = `rounded-xl py-3 px-4 outline-none transition-all focus:ring-2 focus:ring-orange-500/50 ${isDark
        ? 'bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500'
        : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500'
        }`;

    const tabs = [
        { id: "taxonomy", label: "Categories", icon: Tag },
        { id: "sections", label: "Sections", icon: Layout },
        { id: "tags", label: "Tags", icon: Hash },
        { id: "delivery", label: "Delivery", icon: Truck },
        { id: "inventory", label: "Inventory", icon: Package },
    ];

    return (
        <div className="space-y-8">
            <SectionHeader
                icon={Settings}
                title="Granthalaya Settings"
                subtitle="Configure system-wide defaults, delivery rates, and taxonomies"
                actions={
                    <button
                        onClick={handleSaveConfig}
                        disabled={isSaving}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                        {!isSaving && <Save className="w-4 h-4" />}
                    </button>
                }
            />

            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as ConfigTab)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shrink-0 ${activeTab === tab.id
                            ? 'bg-white dark:bg-slate-700 text-orange-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="mt-8">
                {activeTab === "taxonomy" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-orange-50 dark:bg-orange-500/5 p-4 rounded-2xl border border-orange-100 dark:border-orange-500/10">
                            <div>
                                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-500">Quick Start: Spiritual Categories</h3>
                                <p className="text-[10px] text-orange-600/70 dark:text-orange-500/70 font-medium">Click to automatically populate Hawan Samagri, Gobar, Vastra, and Incense categories.</p>
                            </div>
                            <a
                                href="/admin/books/config/seed"
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-md shadow-orange-500/20"
                            >
                                Run Seeder
                            </a>
                        </div>
                        <CategoryCMSPage />
                    </div>
                )}

                {activeTab === "sections" && (
                    <GenericCMS
                        collectionPath="granthalaya_app/inventory/sections"
                        title="Storage Sections"
                        subtitle="Physical shelf locations or virtual clusters"
                        icon={Layout}
                        placeholder="e.g. Shelf A-1"
                        typeLabel="Section"
                    />
                )}

                {activeTab === "tags" && (
                    <GenericCMS
                        collectionPath="granthalaya_app/inventory/tags"
                        title="Book Tags"
                        subtitle="Searchable keywords for better discovery"
                        icon={Hash}
                        placeholder="e.g. New Release"
                        typeLabel="Tag"
                    />
                )}

                {activeTab === "delivery" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <h3 className="font-bold mb-6 flex items-center gap-2 text-orange-500">
                                <IndianRupee className="w-5 h-5" />
                                Delivery Rates
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Standard Delivery Fee (₹)</label>
                                    <input
                                        type="number"
                                        value={config.deliveryFee}
                                        onChange={(e) => setConfig({ ...config, deliveryFee: Number(e.target.value) })}
                                        className={`w-full ${inputClasses}`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Free Delivery Threshold (₹)</label>
                                    <input
                                        type="number"
                                        value={config.freeDeliveryThreshold}
                                        onChange={(e) => setConfig({ ...config, freeDeliveryThreshold: Number(e.target.value) })}
                                        className={`w-full ${inputClasses}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "inventory" && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                                <h3 className="font-bold mb-6 flex items-center gap-2 text-purple-500">
                                    <ListFilter className="w-5 h-5" />
                                    Inventory Thresholds
                                </h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Low Stock Alert Level</label>
                                        <input
                                            type="number"
                                            value={config.lowStockThreshold}
                                            onChange={(e) => setConfig({ ...config, lowStockThreshold: Number(e.target.value) })}
                                            className={`w-full ${inputClasses}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Migration Tool */}
                        <div className="max-w-2xl">
                            <ProductMigrationTool />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Plus, MapPin, Navigation, Tag as TagIcon, ShieldCheck } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import AdminTable from "@/components/admin/AdminTable";
import LocationForm from "@/components/admin/info/LocationForm";

interface ImportantLocation {
    id: string;
    name: string;
    description?: string;
    mapLink?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    tags: string[];
    role?: string;
    sortOrder: number;
}

export default function LocationsList() {
    const [locations, setLocations] = useState<ImportantLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<ImportantLocation | null>(null);
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

    useEffect(() => {
        const q = query(
            collection(db, "important_info", "main", "locations"),
            orderBy("sortOrder", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ImportantLocation[];
            setLocations(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching locations:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const columns = [
        {
            header: "Location",
            accessor: (item: ImportantLocation) => (
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-blue-500/10 text-blue-500' : 'bg-blue-50 text-blue-600'}`}>
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className={`font-bold truncate max-w-[200px] ${isDark ? 'text-white' : 'text-black'}`}>{item.name}</span>
                        <div className={`flex items-center gap-1.5 text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            <Navigation className="w-2.5 h-2.5" />
                            <span className="truncate max-w-[150px]">{item.address || "No address provided"}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: "Role",
            accessor: (item: ImportantLocation) => (
                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.role
                    ? isDark
                        ? "bg-purple-500/10 text-purple-500"
                        : "bg-purple-50 text-purple-600"
                    : isDark
                        ? "bg-slate-800 text-slate-600"
                        : "bg-slate-50 text-slate-400"
                    }`}>
                    <ShieldCheck className="w-3 h-3" />
                    {item.role || "No Role"}
                </div>
            )
        },
        {
            header: "Tags",
            accessor: (item: ImportantLocation) => (
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {item.tags?.length > 0 ? item.tags.map(tag => (
                        <span key={tag} className={`text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 border ${isDark ? 'bg-slate-800 text-slate-400 border-white/5' : 'bg-white text-slate-600 border-slate-200'}`}>
                            <TagIcon className="w-2.5 h-2.5" />
                            {tag}
                        </span>
                    )) : (
                        <span className={`text-[9px] italic ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>No tags</span>
                    )}
                </div>
            )
        },
        {
            header: "Sort",
            accessor: (item: ImportantLocation) => (
                <span className={`font-mono text-sm font-bold ${isDark ? 'text-orange-500' : 'text-slate-400'}`}>{item.sortOrder}</span>
            ),
            className: "w-16"
        }
    ];

    if (showForm) {
        return (
            <LocationForm
                initialData={selectedLocation || undefined}
                onCancel={() => { setShowForm(false); setSelectedLocation(null); }}
            />
        );
    }

    return (
        <div className={`flex flex-col h-full ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <div>
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Locations Directory</h2>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Mandirs, Shaktipeeths, and important spiritual centers</p>
                </div>
                <button
                    onClick={() => { setSelectedLocation(null); setShowForm(true); }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/10 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Add Location
                </button>
            </div>

            <div className="flex-1 min-h-0">
                <AdminTable
                    columns={columns}
                    data={locations}
                    loading={loading}
                    onRowClick={(item) => { setSelectedLocation(item); setShowForm(true); }}
                    emptyMessage="No locations registered. Start mapping the spiritual network!"
                />
            </div>
        </div>
    );
}

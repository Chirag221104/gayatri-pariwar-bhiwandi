"use client";

import { useState, useEffect } from "react";
import { Plus, Lightbulb, ListOrdered, CheckCircle2, Trash2, Search } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/ui/StatusBadge";
import TipForm from "@/components/admin/spiritual/TipForm";
import { logAdminAction } from "@/lib/admin-logger";

interface MeditationTip {
    id: string;
    order: number;
    title: string;
    description: string;
    status: string;
}

export default function TipsList() {
    const [tips, setTips] = useState<MeditationTip[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedTip, setSelectedTip] = useState<MeditationTip | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
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
        const q = query(
            collection(db, "spiritual_content", "meditation_tips", "items"),
            orderBy("order", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as MeditationTip[];
            setTips(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching tips:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredTips = tips.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            header: "Order",
            accessor: (item: MeditationTip) => (
                <div className="flex items-center gap-2">
                    <ListOrdered className="w-3 h-3 text-slate-500" />
                    <span className="font-mono text-orange-500 font-bold">{item.order}</span>
                </div>
            ),
            className: "w-20"
        },
        {
            header: "Tip Title",
            accessor: (item: MeditationTip) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 dark:text-white">{item.title}</span>
                    <span className="text-xs text-slate-500 line-clamp-1">{item.description}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessor: (item: MeditationTip) => (
                <StatusBadge
                    variant={item.status === 'active' ? 'active' : 'unavailable'}
                    label={item.status || 'Draft'}
                    className="shadow-sm"
                />
            )
        }
    ];

    if (showForm) {
        return (
            <TipForm
                initialData={selectedTip || undefined}
                onCancel={() => { setShowForm(false); setSelectedTip(null); }}
            />
        );
    }

    return (
        <div className={`flex flex-col h-full ${isDark ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'}`}>
            <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-20 ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-slate-200 bg-white'}`}>
                <div>
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Meditation Tips</h2>
                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Ordered guidance for the meditation section</p>
                </div>
                <button
                    onClick={() => { setSelectedTip(null); setShowForm(true); }}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Add Tip
                </button>
            </div>

            <div className="flex-1 min-h-0">
                <AdminTable
                    columns={columns}
                    data={filteredTips}
                    loading={loading}
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search meditation tips..."
                    onRowClick={(item) => { setSelectedTip(item); setShowForm(true); }}
                    emptyMessage="No meditation tips found. Start adding guided steps!"
                />
            </div>
        </div>
    );
}

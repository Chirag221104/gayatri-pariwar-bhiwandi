"use client";

import { useState, useEffect } from "react";
import { Plus, Lightbulb, ListOrdered, CheckCircle2, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import AdminTable from "@/components/admin/AdminTable";
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
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'active'
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500 border border-slate-200 dark:border-slate-700"
                    }`}>
                    {item.status || 'Draft'}
                </span>
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
        <div className="flex flex-col h-full bg-transparent">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-20">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Meditation Tips</h2>
                    <p className="text-xs text-slate-500">Step-by-step spiritual guidance for the community</p>
                </div>
                <button
                    onClick={() => { setSelectedTip(null); setShowForm(true); }}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    New Tip
                </button>
            </div>

            <div className="flex-1 min-h-0 bg-white dark:bg-slate-900">
                <AdminTable
                    columns={columns}
                    data={tips}
                    loading={loading}
                    onRowClick={(item) => { setSelectedTip(item); setShowForm(true); }}
                    emptyMessage="No meditation tips found. Start adding guided steps!"
                />
            </div>
        </div>
    );
}

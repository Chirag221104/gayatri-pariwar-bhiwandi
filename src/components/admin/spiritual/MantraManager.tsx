"use client";

import React, { useState, useEffect } from "react";
import { useWarnUnsavedChanges } from "@/hooks/useWarnUnsavedChanges";
import { Plus, Music, Shield, Palette, Settings2, Trash2, Edit, Save, X, Loader2, Sparkles, Search } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/ui/StatusBadge";
import MantraForm from "@/components/admin/spiritual/MantraForm";
import { logAdminAction } from "@/lib/admin-logger";

interface Mantra {
    id: string;
    name: string;
    description: string;
    colorValue: number;
    isCustom: boolean;
    beadsPerMala: number;
}

const DEFAULT_MANTRA_IDS = ['gayatri', 'mahamrityunjaya', 'guru'];

export default function MantraManager() {
    const [mantras, setMantras] = useState<Mantra[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingMantra, setEditingMantra] = useState<Partial<Mantra> | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDark, setIsDark] = useState(false);

    const [isDirty, setIsDirty] = useState(false);
    useWarnUnsavedChanges(isDirty);

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
        const q = query(collection(db, "mantras"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Mantra[];
            setMantras(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filteredMantras = mantras.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (mantra: Mantra) => {
        if (!confirm(`Are you sure you want to delete "${mantra.name}"? This will affect all users tracking this mantra.`)) return;
        try {
            await deleteDoc(doc(db, "mantras", mantra.id));
            await logAdminAction({
                action: "DELETE",
                collectionName: "mantras",
                documentId: mantra.id,
                details: `Deleted global mantra: ${mantra.name}`,
                previousData: mantra
            });
        } catch (error) {
            alert("Delete failed");
        }
    };

    const columns = [
        {
            header: "Mantra",
            accessor: (item: Mantra) => (
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/10 shadow-sm"
                        style={{ backgroundColor: `#${((item.colorValue || 0xFFFF6F00) & 0xFFFFFF).toString(16).padStart(6, '0')}` }}
                    >
                        <Music className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">{item.name}</span>
                        <span className="text-[10px] text-slate-500">{item.beadsPerMala} beads/mala</span>
                    </div>
                </div>
            )
        },
        {
            header: "Type",
            accessor: (item: Mantra) => {
                const isBuiltIn = DEFAULT_MANTRA_IDS.includes(item.id);
                return (
                    <StatusBadge
                        variant={isBuiltIn ? 'active' : 'info'}
                        label={isBuiltIn ? 'Built-in' : 'Global Custom'}
                        className="shadow-sm"
                    />
                );
            }
        },
        {
            header: "Actions",
            accessor: (item: Mantra) => {
                const isBuiltIn = DEFAULT_MANTRA_IDS.includes(item.id);
                return (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); setEditingMantra(item); setShowForm(true); }}
                            className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        {!isBuiltIn && (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                );
            }
        }
    ];

    if (showForm) {
        return (
            <MantraForm
                initialData={editingMantra as any}
                onCancel={() => { setShowForm(false); setEditingMantra(null); }}
            />
        );
    }

    return (
        <div className={`flex flex-col h-full ${isDark ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'}`}>
            <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-20 ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-slate-200 bg-white'}`}>
                <div>
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Mantra Management</h2>
                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Configure global mantras for the Sadhana Tracker</p>
                </div>
                <button
                    onClick={() => { setEditingMantra(null); setShowForm(true); }}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    New Global Mantra
                </button>
            </div>

            <div className="flex-1 min-h-0">
                <AdminTable
                    columns={columns}
                    data={filteredMantras}
                    loading={loading}
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search mantras by name or lyrics..."
                    onRowClick={(item) => { setEditingMantra(item); setShowForm(true); }}
                    emptyMessage="No mantras found. Please check your data or permissions."
                />
            </div>
        </div>
    );
}

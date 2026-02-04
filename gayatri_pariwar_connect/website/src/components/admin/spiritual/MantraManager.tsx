"use client";

import { useState, useEffect } from "react";
import { useWarnUnsavedChanges } from "@/hooks/useWarnUnsavedChanges";
import { Plus, Music, Shield, Palette, Settings2, Trash2, Edit, Save, X, Loader2, Sparkles } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import AdminTable from "@/components/admin/AdminTable";
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

    const [isDirty, setIsDirty] = useState(false);
    useWarnUnsavedChanges(isDirty);

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
                    <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit ${isBuiltIn
                        ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}>
                        {isBuiltIn ? <Shield className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                        {isBuiltIn ? "Built-in" : "Global Custom"}
                    </div>
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
        <div className="flex flex-col h-full bg-transparent">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-20">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Mantra Management</h2>
                    <p className="text-xs text-slate-500">Configure global mantras for the Sadhana Tracker</p>
                </div>
                <button
                    onClick={() => { setEditingMantra(null); setShowForm(true); }}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    New Global Mantra
                </button>
            </div>

            <div className="flex-1 min-h-0 bg-white dark:bg-slate-900">
                <AdminTable
                    columns={columns}
                    data={mantras}
                    loading={loading}
                    onRowClick={(item) => { setEditingMantra(item); setShowForm(true); }}
                    emptyMessage="No mantras found. Please check your data or permissions."
                />
            </div>
        </div>
    );
}

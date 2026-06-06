"use client";

import React, { useState, useEffect } from "react";
import { Plus, Flame, Music, Video, Search, ChevronRight, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/ui/StatusBadge";
import RitualForm from "@/components/admin/spiritual/RitualForm";
import { logAdminAction } from "@/lib/admin-logger";

interface Ritual {
    id: string;
    title: string;
    description: string;
    mediaUrl: string;
    mediaType: "audio" | "video";
    status: "draft" | "published";
    version: number;
    duration?: number;
}

export default function YagyaManager() {
    const [rituals, setRituals] = useState<Ritual[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDark, setIsDark] = useState(false);
    const [ritualToDelete, setRitualToDelete] = useState<string | null>(null);

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

    const deleteRitual = async (id: string) => {
        try {
            await deleteDoc(doc(db, "rituals", id));
            await logAdminAction({
                action: "DELETE",
                collectionName: "rituals",
                documentId: id,
                details: `Deleted ritual: ${id}`
            });
            setRitualToDelete(null);
        } catch (error) {
            console.error("Error deleting ritual:", error);
            alert("Failed to delete ritual.");
        }
    };

    useEffect(() => {
        const q = query(collection(db, "rituals"), orderBy("title", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Ritual[];
            setRituals(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching rituals:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredRituals = rituals.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            header: "Ritual Title",
            accessor: (item: Ritual) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                        <Flame className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-900 dark:text-white truncate">{item.title}</span>
                        <span className="text-xs text-slate-500 dark:text-zinc-500 truncate max-w-[200px]">{item.description}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Media Type",
            accessor: (item: Ritual) => (
                <div className="flex items-center gap-2">
                    {item.mediaType === 'audio' ? (
                        <Music className="w-4 h-4 text-blue-500" />
                    ) : (
                        <Video className="w-4 h-4 text-emerald-500" />
                    )}
                    <span className="text-sm text-slate-600 dark:text-zinc-400 capitalize">{item.mediaType}</span>
                </div>
            )
        },
        {
            header: "Version",
            accessor: (item: Ritual) => (
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-xs font-mono text-slate-600 dark:text-zinc-400">
                        v{item.version || 1}
                    </span>
                </div>
            )
        },
        {
            header: "Status",
            accessor: (item: Ritual) => (
                <div className="flex items-center justify-between gap-4">
                    <StatusBadge
                        variant={item.status === 'published' ? 'active' : 'unavailable'}
                        label={item.status || 'Draft'}
                    />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setRitualToDelete(item.id);
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete Ritual"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    if (showForm) {
        return (
            <RitualForm
                initialData={selectedRitual || undefined}
                onCancel={() => { setShowForm(false); setSelectedRitual(null); }}
            />
        );
    }

    return (
        <div className={`flex flex-col h-full ${isDark ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'}`}>
            <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-20 ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-slate-200 bg-white'
                }`}>
                <div>
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Yagya Guide Rituals</h2>
                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Manage high-fidelity timestamped ritual scripts</p>
                </div>
                <button
                    onClick={() => { setSelectedRitual(null); setShowForm(true); }}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    New Ritual
                </button>
            </div>

            <div className="flex-1 min-h-0 container mx-auto">
                <AdminTable
                    columns={columns}
                    data={filteredRituals}
                    loading={loading}
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search rituals..."
                    onRowClick={(item) => { setSelectedRitual(item); setShowForm(true); }}
                    emptyMessage="No rituals found. Start by creating a high-fidelity guide!"
                />
            </div>

            {/* Custom Delete Confirmation Modal */}
            {ritualToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRitualToDelete(null)} />
                    <div className={`relative w-full max-w-sm rounded-3xl shadow-2xl p-6 border animate-in zoom-in duration-200 ${isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}>
                        <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
                            <Trash2 className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Delete Ritual?</h3>
                        <p className={`text-sm mb-6 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                            This will permanently remove the ritual and all its timestamped segments. This action cannot be undone.
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setRitualToDelete(null)}
                                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteRitual(ritualToDelete)}
                                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all shadow-lg shadow-red-500/20 active:scale-95"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

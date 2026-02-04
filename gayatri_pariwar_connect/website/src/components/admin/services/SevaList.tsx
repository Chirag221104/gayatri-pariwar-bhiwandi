"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Edit,
    Trash2,
    HandHelping,
    Calendar,
    Users,
    MapPin,
    Loader2,
    Save,
    X,
    CheckCircle2,
    Clock
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "firebase/firestore";
import AdminTable from "@/components/admin/AdminTable";
import { logAdminAction } from "@/lib/admin-logger";
import { useWarnUnsavedChanges } from "@/hooks/useWarnUnsavedChanges";

interface SevaOpportunity {
    id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    time: string;
    volunteersNeededMale: number;
    volunteersNeededFemale: number;
    filledVolunteersMale?: number;
    filledVolunteersFemale?: number;
    category: string;
    status: "published" | "active" | "completed" | "cancelled";
    createdAt?: any;
    updatedAt?: any;
}

export default function SevaList() {
    const [sevaOps, setSevaOps] = useState<SevaOpportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSeva, setEditingSeva] = useState<Partial<SevaOpportunity> | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useWarnUnsavedChanges(isDirty);

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
        const q = query(collection(db, "seva_opportunities"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SevaOpportunity[];
            setSevaOps(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSeva?.title) return;

        setIsSaving(true);
        try {
            const data = {
                title: editingSeva.title || "",
                description: editingSeva.description || "",
                location: editingSeva.location || "",
                date: editingSeva.date || "",
                time: editingSeva.time || "",
                volunteersNeededMale: Number(editingSeva.volunteersNeededMale) || 0,
                volunteersNeededFemale: Number(editingSeva.volunteersNeededFemale) || 0,
                category: editingSeva.category || "General",
                status: editingSeva.status || "published",
                updatedAt: serverTimestamp()
            };

            if (editingSeva.id) {
                await updateDoc(doc(db, "seva_opportunities", editingSeva.id), data);
                await logAdminAction({
                    action: "UPDATE",
                    collectionName: "seva_opportunities",
                    documentId: editingSeva.id,
                    details: `Updated seva opportunity: ${data.title}`,
                    previousData: sevaOps.find(s => s.id === editingSeva.id),
                    newData: data
                });
            } else {
                const docRef = await addDoc(collection(db, "seva_opportunities"), {
                    ...data,
                    filledVolunteersMale: 0,
                    filledVolunteersFemale: 0,
                    createdAt: serverTimestamp()
                });
                await logAdminAction({
                    action: "CREATE",
                    collectionName: "seva_opportunities",
                    documentId: docRef.id,
                    details: `Created new seva opportunity: ${data.title}`
                });
            }
            setIsDirty(false);
            setEditingSeva(null);
        } catch (error) {
            console.error("Error saving seva:", error);
            alert("Failed to save seva opportunity");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (seva: SevaOpportunity) => {
        if (!confirm(`Are you sure you want to delete "${seva.title}"?`)) return;
        try {
            await deleteDoc(doc(db, "seva_opportunities", seva.id));
            await logAdminAction({
                action: "DELETE",
                collectionName: "seva_opportunities",
                documentId: seva.id,
                details: `Deleted seva opportunity: ${seva.title}`,
                previousData: seva
            });
        } catch (error) {
            alert("Delete failed");
        }
    };

    const formatFirestoreValue = (val: any) => {
        if (!val) return "";
        if (typeof val === "object" && val.seconds !== undefined) {
            return new Date(val.seconds * 1000).toLocaleDateString();
        }
        return String(val);
    };

    const inputClass = isDark
        ? 'bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500'
        : 'bg-white border border-slate-200 text-black placeholder:text-slate-400';

    const labelClass = isDark ? 'text-slate-400' : 'text-black';

    const columns = [
        {
            header: "Seva Opportunity",
            accessor: (item: SevaOpportunity) => (
                <div className="flex flex-col gap-1 min-w-[200px]">
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{formatFirestoreValue(item.title)}</span>
                    <div className={`flex items-center gap-2 text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        <MapPin className="w-3 h-3 opacity-70" />
                        <span>{formatFirestoreValue(item.location)}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Schedule",
            accessor: (item: SevaOpportunity) => (
                <div className="flex flex-col gap-1">
                    <div className={`flex items-center gap-2 text-[10px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        <Calendar className="w-3 h-3 opacity-70" />
                        <span>{formatFirestoreValue(item.date)}</span>
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        <Clock className="w-3 h-3 opacity-70" />
                        <span>{formatFirestoreValue(item.time)}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Capacity",
            accessor: (item: SevaOpportunity) => (
                <div className={`flex flex-col gap-1 text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-blue-500" />
                        <span className="font-bold">M: {item.filledVolunteersMale || 0} / {item.volunteersNeededMale || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-pink-500" />
                        <span className="font-bold">F: {item.filledVolunteersFemale || 0} / {item.volunteersNeededFemale || 0}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Status",
            accessor: (item: SevaOpportunity) => (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.status === 'published' || item.status === 'active'
                    ? isDark ? "bg-emerald-500/10 text-emerald-500" : "bg-emerald-50 text-emerald-600"
                    : item.status === 'completed'
                        ? isDark ? "bg-blue-500/10 text-blue-500" : "bg-blue-50 text-blue-600"
                        : isDark ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-500"
                    }`}>
                    {formatFirestoreValue(item.status)}
                </span>
            )
        },
        {
            header: "Actions",
            accessor: (item: SevaOpportunity) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); setEditingSeva(item); }}
                        className={`p-2 rounded-lg transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                        className={`p-2 rounded-lg transition-all ${isDark ? 'text-slate-400 hover:text-red-500 hover:bg-red-500/10' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className={`flex flex-col h-full relative ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <div>
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Seva Management</h2>
                    <p className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Organize community volunteer work and track participation</p>
                </div>
                <button
                    onClick={() => setEditingSeva({
                        title: "",
                        description: "",
                        location: "",
                        category: "General",
                        date: "",
                        time: "",
                        status: "published",
                        volunteersNeededMale: 0,
                        volunteersNeededFemale: 0
                    })}
                    className="flex items-center gap-2 bg-[#B56550] hover:bg-[#A05540] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#B56550]/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    New Seva Op
                </button>
            </div>

            <div className="flex-1 min-h-0">
                <AdminTable
                    columns={columns}
                    data={sevaOps}
                    loading={loading}
                    onRowClick={(item) => setEditingSeva(item)}
                    emptyMessage="No seva opportunities found. Create one to inspire volunteering!"
                />
            </div>

            {/* Editor Overlay */}
            {editingSeva && (
                <div className={`absolute inset-0 z-30 backdrop-blur-sm flex items-center justify-center p-6 ${isDark ? 'bg-slate-950/80' : 'bg-slate-900/20'}`}>
                    <form onSubmit={handleSave} className={`border rounded-3xl p-8 w-full max-w-2xl shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-full scrollbar-hide ${isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center justify-between">
                            <h3 className={`text-xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-black'}`}>
                                {editingSeva.id ? <Edit className="w-5 h-5 text-[#B56550]" /> : <Plus className="w-5 h-5 text-[#B56550]" />}
                                {editingSeva.id ? "Edit Seva Opportunity" : "New Seva Opportunity"}
                            </h3>
                            <button type="button" onClick={() => { setEditingSeva(null); setIsDirty(false); }} className={`p-2 rounded-full transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-black'}`}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${labelClass}`}>Title</label>
                                <input
                                    type="text"
                                    value={editingSeva.title || ""}
                                    onChange={(e) => { setEditingSeva({ ...editingSeva, title: e.target.value }); setIsDirty(true); }}
                                    required
                                    placeholder="e.g. Annadan Seva, Temple Cleaning, Prasad Distribution"
                                    className={`w-full rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#B56550]/20 focus:border-[#B56550] outline-none transition-all font-bold placeholder:font-normal ${inputClass}`}
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${labelClass}`}>Description</label>
                                <textarea
                                    value={editingSeva.description || ""}
                                    onChange={(e) => { setEditingSeva({ ...editingSeva, description: e.target.value }); setIsDirty(true); }}
                                    rows={3}
                                    placeholder="Describe the seva activity, what volunteers will do, and any requirements..."
                                    className={`w-full rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#B56550]/20 focus:border-[#B56550] outline-none resize-none transition-all font-medium placeholder:font-normal ${inputClass}`}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${labelClass}`}>Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={editingSeva.location || ""}
                                        onChange={(e) => { setEditingSeva({ ...editingSeva, location: e.target.value }); setIsDirty(true); }}
                                        placeholder="e.g. Gayatri Mandir, Bhiwandi"
                                        className={`w-full rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#B56550]/20 focus:border-[#B56550] outline-none transition-all font-bold placeholder:font-normal ${inputClass}`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${labelClass}`}>Category</label>
                                <input
                                    type="text"
                                    value={editingSeva.category || ""}
                                    onChange={(e) => { setEditingSeva({ ...editingSeva, category: e.target.value }); setIsDirty(true); }}
                                    placeholder="e.g. Temple, Event, Kitchen"
                                    className={`w-full rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#B56550]/20 focus:border-[#B56550] outline-none transition-all font-bold ${inputClass}`}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${labelClass}`}>Date</label>
                                <input
                                    type="text"
                                    value={editingSeva.date || ""}
                                    onChange={(e) => { setEditingSeva({ ...editingSeva, date: e.target.value }); setIsDirty(true); }}
                                    placeholder="e.g. 15th Aug 2024"
                                    className={`w-full rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#B56550]/20 focus:border-[#B56550] outline-none transition-all font-bold ${inputClass}`}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${labelClass}`}>Time</label>
                                <input
                                    type="text"
                                    value={editingSeva.time || ""}
                                    onChange={(e) => { setEditingSeva({ ...editingSeva, time: e.target.value }); setIsDirty(true); }}
                                    placeholder="e.g. 10:00 AM - 2:00 PM"
                                    className={`w-full rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#B56550]/20 focus:border-[#B56550] outline-none transition-all font-bold ${inputClass}`}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${labelClass}`}>Male Volunteers</label>
                                <input
                                    type="number"
                                    value={editingSeva.volunteersNeededMale ?? 0}
                                    onChange={(e) => { setEditingSeva({ ...editingSeva, volunteersNeededMale: Number(e.target.value) }); setIsDirty(true); }}
                                    className={`w-full rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#B56550]/20 focus:border-[#B56550] outline-none transition-all font-bold ${inputClass}`}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${labelClass}`}>Female Volunteers</label>
                                <input
                                    type="number"
                                    value={editingSeva.volunteersNeededFemale ?? 0}
                                    onChange={(e) => { setEditingSeva({ ...editingSeva, volunteersNeededFemale: Number(e.target.value) }); setIsDirty(true); }}
                                    className={`w-full rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#B56550]/20 focus:border-[#B56550] outline-none transition-all font-bold ${inputClass}`}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${labelClass}`}>Status</label>
                                <select
                                    value={editingSeva.status}
                                    onChange={(e) => { setEditingSeva({ ...editingSeva, status: e.target.value as any }); setIsDirty(true); }}
                                    className={`w-full rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#B56550]/20 focus:border-[#B56550] outline-none transition-all font-bold ${inputClass}`}
                                >
                                    <option value="published">Published (Recruiting)</option>
                                    <option value="active">Active (Ongoing)</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => { setEditingSeva(null); setIsDirty(false); }}
                                className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all border ${isDark
                                    ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400'
                                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex-[2] px-6 py-3 rounded-xl bg-[#B56550] hover:bg-[#A05540] text-white font-bold transition-all shadow-lg shadow-[#B56550]/20 flex items-center justify-center gap-2 active:scale-95"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {editingSeva.id ? "Update Seva" : "Create Seva"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

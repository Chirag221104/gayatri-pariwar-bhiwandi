"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Edit,
    Trash2,
    CheckCircle2,
    XCircle,
    Loader2,
    Save,
    X,
    LayoutGrid
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
    collection,
    query,
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

interface ServiceType {
    id: string;
    name: string;
    description: string;
    status: "active" | "inactive";
    createdAt?: any;
    updatedAt?: any;
}

export default function ServiceTypesList() {
    const [types, setTypes] = useState<ServiceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingType, setEditingType] = useState<Partial<ServiceType> | null>(null);
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
        const q = query(collection(db, "service_types"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ServiceType[];
            setTypes(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingType?.name) return;

        setIsSaving(true);
        try {
            const data = {
                name: editingType.name,
                description: editingType.description || "",
                status: editingType.status || "active",
                updatedAt: serverTimestamp()
            };

            if (editingType.id) {
                await updateDoc(doc(db, "service_types", editingType.id), data);
                await logAdminAction({
                    action: "UPDATE",
                    collectionName: "service_types",
                    documentId: editingType.id,
                    details: `Updated service type: ${data.name}`,
                    previousData: types.find(t => t.id === editingType.id),
                    newData: data
                });
            } else {
                const docRef = await addDoc(collection(db, "service_types"), {
                    ...data,
                    createdAt: serverTimestamp()
                });
                await logAdminAction({
                    action: "CREATE",
                    collectionName: "service_types",
                    documentId: docRef.id,
                    details: `Added new service type: ${data.name}`
                });
            }
            setIsDirty(false);
            setEditingType(null);
        } catch (error) {
            console.error("Error saving service type:", error);
            alert("Failed to save service type");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (type: ServiceType) => {
        if (!confirm(`Are you sure you want to delete "${type.name}"? This might affect existing requests.`)) return;
        try {
            await deleteDoc(doc(db, "service_types", type.id));
            await logAdminAction({
                action: "DELETE",
                collectionName: "service_types",
                documentId: type.id,
                details: `Deleted service type: ${type.name}`,
                previousData: type
            });
        } catch (error) {
            alert("Delete failed");
        }
    };

    const columns = [
        {
            header: "Service Name",
            accessor: (item: ServiceType) => (
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-orange-500/10 text-orange-500' : 'bg-[#B56550]/10 text-[#B56550]'}`}>
                        <LayoutGrid className="w-4 h-4" />
                    </div>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{item.name}</span>
                </div>
            )
        },
        {
            header: "Description",
            accessor: (item: ServiceType) => (
                <span className={`text-xs font-medium line-clamp-1 max-w-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.description}</span>
            )
        },
        {
            header: "Status",
            accessor: (item: ServiceType) => (
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit ${item.status === 'active'
                    ? isDark ? "bg-emerald-500/10 text-emerald-500" : "bg-emerald-50 text-emerald-600"
                    : isDark ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-500"
                    }`}>
                    {item.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {item.status || 'inactive'}
                </div>
            )
        },
        {
            header: "Actions",
            accessor: (item: ServiceType) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); setEditingType(item); }}
                        className={`p-2 rounded-lg transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                        className={`p-2 rounded-lg transition-all ${isDark ? 'text-slate-400 hover:text-red-500 hover:bg-red-500/10' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
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
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Service Types</h2>
                    <p className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Configure spiritual services available for community booking</p>
                </div>
                <button
                    onClick={() => setEditingType({ status: "active" })}
                    className="flex items-center gap-2 bg-[#B56550] hover:bg-[#A05540] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#B56550]/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    New Service Type
                </button>
            </div>

            <div className="flex-1 min-h-0">
                <AdminTable
                    columns={columns}
                    data={types}
                    loading={loading}
                    emptyMessage="No service types configured yet."
                />
            </div>

            {/* Editor Overlay */}
            {editingType && (
                <div className={`absolute inset-0 z-30 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200 ${isDark ? 'bg-slate-950/80' : 'bg-slate-900/20'}`}>
                    <form onSubmit={handleSave} className={`border rounded-3xl p-8 w-full max-w-xl shadow-2xl space-y-8 animate-in zoom-in-95 duration-200 ${isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center justify-between">
                            <h3 className={`text-xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-black'}`}>
                                {editingType.id ? <Edit className="w-5 h-5 text-[#B56550]" /> : <Plus className="w-5 h-5 text-[#B56550]" />}
                                {editingType.id ? "Edit Service Type" : "New Service Type"}
                            </h3>
                            <button type="button" onClick={() => { setEditingType(null); setIsDirty(false); }} className={`p-2 rounded-full transition-all ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-black'}`}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${isDark ? 'text-slate-400' : 'text-black'}`}>Service Name</label>
                                <input
                                    type="text"
                                    value={editingType.name || ""}
                                    onChange={(e) => { setEditingType({ ...editingType, name: e.target.value }); setIsDirty(true); }}
                                    required
                                    placeholder="e.g. Vastupujan, Grihapravesh"
                                    className={`w-full rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#B56550]/20 focus:border-[#B56550] outline-none transition-all font-bold placeholder:font-normal placeholder:text-slate-400 ${isDark
                                        ? 'bg-slate-900 border border-slate-800 text-white'
                                        : 'bg-white border border-slate-200 text-black'
                                        }`}
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${isDark ? 'text-slate-400' : 'text-black'}`}>Description</label>
                                <textarea
                                    value={editingType.description || ""}
                                    onChange={(e) => { setEditingType({ ...editingType, description: e.target.value }); setIsDirty(true); }}
                                    rows={4}
                                    placeholder="Briefly explain the service and its significance..."
                                    className={`w-full rounded-xl py-4 px-4 focus:ring-2 focus:ring-[#B56550]/20 focus:border-[#B56550] outline-none resize-none leading-relaxed font-medium placeholder:font-normal placeholder:text-slate-400 ${isDark
                                        ? 'bg-slate-900 border border-slate-800 text-white'
                                        : 'bg-white border border-slate-200 text-black'
                                        }`}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${isDark ? 'text-slate-400' : 'text-black'}`}>Status</label>
                                <div className="flex gap-4">
                                    {(["active", "inactive"] as const).map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => { setEditingType({ ...editingType, status: s }); setIsDirty(true); }}
                                            className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${editingType.status === s
                                                ? isDark
                                                    ? "bg-orange-500/10 border-orange-500 text-orange-500"
                                                    : "bg-[#B56550]/10 border-[#B56550] text-[#B56550]"
                                                : isDark
                                                    ? "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                                                    : "bg-white border-slate-200 text-slate-500 hover:text-black"
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => { setEditingType(null); setIsDirty(false); }}
                                className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all border ${isDark
                                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400'
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
                                {editingType.id ? "Update Type" : "Create Type"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import {
    X,
    Save,
    Calendar as CalendarIcon,
    Moon,
    Info,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";
import { logAdminAction } from "@/lib/admin-logger";
import { useWarnUnsavedChanges } from "@/hooks/useWarnUnsavedChanges";

interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    tithi?: string;
    significance?: string;
    status: "active" | "draft";
    createdAt?: any;
}

interface CalendarEventFormProps {
    initialData?: CalendarEvent;
    onCancel: () => void;
}

export default function CalendarEventForm({ initialData, onCancel }: CalendarEventFormProps) {
    const [isSaving, setIsSaving] = useState(false);
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

    const getInitialDate = (dateVal: any) => {
        if (!dateVal) return new Date().toISOString().split('T')[0];
        if (typeof dateVal === 'object' && dateVal.seconds !== undefined) {
            return new Date(dateVal.seconds * 1000).toISOString().split('T')[0];
        }
        try {
            return new Date(dateVal).toISOString().split('T')[0];
        } catch (e) {
            return new Date().toISOString().split('T')[0];
        }
    };

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        date: getInitialDate(initialData?.date),
        tithi: initialData?.tithi || "",
        significance: initialData?.significance || "",
        status: initialData?.status || "active"
    });

    const [isDirty, setIsDirty] = useState(false);
    useWarnUnsavedChanges(isDirty);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const data = {
                ...formData,
                updatedAt: serverTimestamp()
            };

            if (initialData) {
                await updateDoc(doc(db, "festival_calendar", initialData.id), data);
                await logAdminAction({
                    action: "UPDATE",
                    collectionName: "festival_calendar",
                    documentId: initialData.id,
                    details: `Updated festival: ${formData.title}`,
                    previousData: initialData,
                    newData: data
                });
            } else {
                const docRef = await addDoc(collection(db, "festival_calendar"), {
                    ...data,
                    createdAt: serverTimestamp()
                });
                await logAdminAction({
                    action: "CREATE",
                    collectionName: "festival_calendar",
                    documentId: docRef.id,
                    details: `Created new festival: ${formData.title}`
                });
            }
            setIsDirty(false);
            onCancel();
        } catch (error) {
            console.error("Error saving festival:", error);
            alert("Failed to save festival");
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = isDark
        ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
        : 'bg-white border-slate-200 text-black placeholder:text-slate-400';

    const labelClass = isDark ? 'text-slate-500' : 'text-black';
    const iconClass = isDark ? 'text-slate-500' : 'text-slate-400';

    return (
        <form onSubmit={handleSubmit} className={`flex flex-col h-full border-t animate-in fade-in slide-in-from-bottom-5 duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{initialData ? "Edit Festival" : "New Festival Config"}</h2>
                            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Configure recurring spiritual events and planetary highlights</p>
                        </div>
                        <button type="button" onClick={onCancel} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${labelClass}`}>Event Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => { setFormData({ ...formData, title: e.target.value }); setIsDirty(true); }}
                                required
                                placeholder="e.g. Guru Purnima"
                                className={`w-full border rounded-xl py-3 px-4 focus:ring-1 focus:ring-orange-500/50 outline-none ${inputClass}`}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${labelClass}`}>Date</label>
                                <div className="relative">
                                    <CalendarIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${iconClass}`} />
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => { setFormData({ ...formData, date: e.target.value }); setIsDirty(true); }}
                                        required
                                        className={`w-full border rounded-xl py-3 pl-10 pr-4 focus:ring-1 focus:ring-orange-500/50 outline-none ${inputClass}`}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${labelClass}`}>Tithi Info</label>
                                <div className="relative">
                                    <Moon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${iconClass}`} />
                                    <input
                                        type="text"
                                        value={formData.tithi}
                                        onChange={(e) => { setFormData({ ...formData, tithi: e.target.value }); setIsDirty(true); }}
                                        placeholder="e.g. Ashadha Purnima"
                                        className={`w-full border rounded-xl py-3 pl-10 pr-4 focus:ring-1 focus:ring-orange-500/50 outline-none ${inputClass}`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${labelClass}`}>Significance / Description</label>
                            <div className="relative">
                                <Info className={`absolute left-3 top-4 w-4 h-4 ${iconClass}`} />
                                <textarea
                                    value={formData.significance}
                                    onChange={(e) => { setFormData({ ...formData, significance: e.target.value }); setIsDirty(true); }}
                                    rows={4}
                                    placeholder="Spiritual importance of this day..."
                                    className={`w-full border rounded-xl py-3 pl-10 pr-4 focus:ring-1 focus:ring-orange-500/50 outline-none resize-none ${inputClass}`}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${labelClass}`}>System Status</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => { setFormData({ ...formData, status: "active" }); setIsDirty(true); }}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${formData.status === "active"
                                        ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                                        : isDark
                                            ? "bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300"
                                            : "bg-white border-slate-200 text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    Visible
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setFormData({ ...formData, status: "draft" }); setIsDirty(true); }}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${formData.status === "draft"
                                        ? isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-200 border-slate-300 text-black"
                                        : isDark
                                            ? "bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300"
                                            : "bg-white border-slate-200 text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    Internal Draft
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className={`p-6 backdrop-blur-md border-t ${isDark ? 'bg-slate-900/80 border-white/5' : 'bg-slate-50/80 border-slate-200'}`}>
                <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className={`px-8 py-3 rounded-xl font-bold transition-all ${isDark ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-200 text-slate-600'}`}
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving || !formData.title}
                        className={`px-12 py-3 rounded-xl text-white font-bold transition-all shadow-xl flex items-center gap-2 ${!formData.title
                            ? isDark ? "bg-slate-800 text-slate-600 shadow-none cursor-not-allowed" : "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
                            : "bg-orange-600 hover:bg-orange-500 shadow-orange-500/20"
                            }`}
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {initialData ? "Apply Changes" : "Confirm Festival"}
                    </button>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? '#1e293b' : '#e2e8f0'}; border-radius: 10px; }
            `}</style>
        </form>
    );
}

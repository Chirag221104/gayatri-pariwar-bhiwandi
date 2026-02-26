"use client";

import { useState, useEffect } from "react";
import { useWarnUnsavedChanges } from "@/hooks/useWarnUnsavedChanges";
import {
    Save,
    X,
    Calendar,
    Target,
    Type,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Activity,
    Hash
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { logAdminAction } from "@/lib/admin-logger";

interface CollectiveGoal {
    id: string;
    title: string;
    description: string;
    type: string;
    targetCount: number;
    currentCount: number;
    startDate: any;
    endDate: any;
    status: string;
    numShards?: number;
}

interface SankalpFormProps {
    initialData?: CollectiveGoal;
    onCancel: () => void;
}

export default function SankalpForm({ initialData, onCancel }: SankalpFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [type, setType] = useState(initialData?.type || "japa");
    const [targetCount, setTargetCount] = useState(initialData?.targetCount || 1000000);
    const [startDate, setStartDate] = useState(
        initialData?.startDate?.toDate
            ? new Date(initialData.startDate.toDate()).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
    );
    const [endDate, setEndDate] = useState(
        initialData?.endDate?.toDate
            ? new Date(initialData.endDate.toDate()).toISOString().split('T')[0]
            : ""
    );
    const [status, setStatus] = useState(initialData?.status || "active");
    const [numShards, setNumShards] = useState(initialData?.numShards || 10);

    const [isDirty, setIsDirty] = useState(false);
    useWarnUnsavedChanges(isDirty);

    useEffect(() => {
        const checkDark = () => {
            const saved = localStorage.getItem('admin-theme');
            setIsDark(saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));
        };
        checkDark();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !targetCount || !startDate) {
            alert("Please fill in all required fields.");
            return;
        }

        setIsSaving(true);
        try {
            const data: any = {
                title,
                description,
                type,
                targetCount: Number(targetCount),
                startDate: Timestamp.fromDate(new Date(startDate)),
                endDate: endDate ? Timestamp.fromDate(new Date(endDate)) : null,
                status,
                updatedAt: serverTimestamp()
            };

            if (initialData) {
                await updateDoc(doc(db, "collective_goals", initialData.id), data);
                await logAdminAction({
                    action: "UPDATE",
                    collectionName: "collective_goals",
                    documentId: initialData.id,
                    details: `Updated Sankalp: ${title}`,
                    previousData: initialData,
                    newData: data
                });
            } else {
                const docRef = await addDoc(collection(db, "collective_goals"), {
                    ...data,
                    currentCount: 0,
                    numShards: numShards,
                    createdAt: serverTimestamp()
                });
                await logAdminAction({
                    action: "CREATE",
                    collectionName: "collective_goals",
                    documentId: docRef.id,
                    details: `Created new Sankalp: ${title}`
                });
            }
            setIsDirty(false);
            onCancel();
        } catch (error) {
            console.error("Error saving Sankalp:", error);
            alert("Failed to save Sankalp");
        } finally {
            setIsSaving(false);
        }
    };

    const inputClasses = `w-full rounded-xl py-3 px-4 outline-none transition-all focus:ring-2 focus:ring-orange-500/50 ${isDark
        ? 'bg-zinc-900/50 border border-slate-700/50 text-white placeholder:text-slate-500'
        : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500'
        }`;

    return (
        <form onSubmit={handleSubmit} className={`flex flex-col h-full border-t animate-in fade-in slide-in-from-bottom-5 duration-300 ${isDark ? 'bg-zinc-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{initialData ? "Edit Sankalp" : "Create New Sankalp"}</h2>
                            <p className="text-slate-500 text-sm">Define a community goal for collective spiritual growth</p>
                        </div>
                        <button type="button" onClick={onCancel} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-zinc-900 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
                            }`}>
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase font-bold tracking-wider">Sankalp Title</label>
                                    <div className="relative">
                                        <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
                                            placeholder="e.g. 1 Million Gayatri Mantra Japa"
                                            className={`${inputClasses} pl-10`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase font-bold tracking-wider">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => { setDescription(e.target.value); setIsDirty(true); }}
                                        rows={4}
                                        className={inputClasses}
                                        placeholder="Explain the purpose and benefits of this community goal..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase font-bold tracking-wider">Goal Type</label>
                                    <div className="relative">
                                        <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <select
                                            value={type}
                                            onChange={(e) => { setType(e.target.value); setIsDirty(true); }}
                                            className={`${inputClasses} pl-10 appearance-none`}
                                        >
                                            <option value="japa">Mantra Japa</option>
                                            <option value="seva">Seva (Service)</option>
                                            <option value="lekhan">Mantra Lekhan</option>
                                            <option value="upvas">Upvas (Fasting)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase font-bold tracking-wider">Target Count</label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="number"
                                            value={targetCount}
                                            onChange={(e) => { setTargetCount(Number(e.target.value)); setIsDirty(true); }}
                                            className={`${inputClasses} pl-10`}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-zinc-900/30 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'
                                }`}>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 font-bold tracking-wider">
                                        <Calendar className="w-3 h-3" /> Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => { setStartDate(e.target.value); setIsDirty(true); }}
                                        className={inputClasses}
                                        style={{ colorScheme: isDark ? 'dark' : 'light' }}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 font-bold tracking-wider">
                                        <Calendar className="w-3 h-3" /> End Date (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => { setEndDate(e.target.value); setIsDirty(true); }}
                                        className={inputClasses}
                                        style={{ colorScheme: isDark ? 'dark' : 'light' }}
                                    />
                                </div>

                                {!initialData && (
                                    <div className="space-y-2 pt-2 border-t border-slate-200/50">
                                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 font-bold tracking-wider">
                                            Performance Shards
                                        </label>
                                        <input
                                            type="number"
                                            value={numShards}
                                            onChange={(e) => { setNumShards(Number(e.target.value)); setIsDirty(true); }}
                                            min={1}
                                            max={50}
                                            className={`${inputClasses} py-2 text-xs`}
                                        />
                                        <p className="text-[10px] text-slate-400">Controls how many parallel writes the goal can handle.</p>
                                    </div>
                                )}

                                <div className="space-y-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => { setStatus("active"); setIsDirty(true); }}
                                        className={`w-full py-3 rounded-xl text-sm font-bold transition-all border ${status === "active"
                                            ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                                            : isDark
                                                ? "bg-zinc-950 border-slate-700 text-slate-500 hover:text-slate-300"
                                                : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600"
                                            }`}
                                    >
                                        Active Goal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setStatus("draft"); setIsDirty(true); }}
                                        className={`w-full py-3 rounded-xl text-sm font-bold transition-all border ${status === "draft"
                                            ? isDark
                                                ? "bg-slate-700 border-slate-600 text-white"
                                                : "bg-zinc-900 text-white border-slate-700"
                                            : isDark
                                                ? "bg-zinc-950 border-slate-700 text-slate-500 hover:text-slate-300"
                                                : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600"
                                            }`}
                                    >
                                        Draft
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`p-6 backdrop-blur-md border-t z-30 ${isDark ? 'bg-zinc-950/80 border-white/5' : 'bg-white/80 border-slate-200'
                }`}>
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className={`px-8 py-3 rounded-xl font-bold transition-all ${isDark ? 'bg-zinc-900 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`px-12 py-3 rounded-xl text-white font-bold transition-all shadow-xl bg-orange-600 hover:bg-orange-500 flex items-center gap-2 shadow-orange-500/20`}
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {initialData ? "Save Changes" : "Create Sankalp"}
                    </button>
                </div>
            </div>

        </form>
    );
}

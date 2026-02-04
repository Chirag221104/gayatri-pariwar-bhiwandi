import { useState, useEffect } from "react";
import { useWarnUnsavedChanges } from "@/hooks/useWarnUnsavedChanges";
import {
    Save,
    X,
    Lightbulb,
    ListOrdered,
    Loader2,
    Trash2
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { logAdminAction } from "@/lib/admin-logger";

interface MeditationTip {
    id: string;
    order: number;
    title: string;
    description: string;
    status: string;
}

interface TipFormProps {
    initialData?: MeditationTip;
    onCancel: () => void;
}

export default function TipForm({ initialData, onCancel }: TipFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [order, setOrder] = useState(initialData?.order || 0);
    const [status, setStatus] = useState(initialData?.status || "active");

    const [isDirty, setIsDirty] = useState(false);
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
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const data = {
                title,
                description,
                order: Number(order),
                status,
                updatedAt: serverTimestamp()
            };

            if (initialData) {
                await updateDoc(doc(db, "spiritual_content", "meditation_tips", "items", initialData.id), data);
                await logAdminAction({
                    action: "UPDATE",
                    collectionName: "meditation_tips",
                    documentId: initialData.id,
                    details: `Updated meditation tip: ${title}`,
                    previousData: initialData,
                    newData: data
                });
            } else {
                const docRef = await addDoc(collection(db, "spiritual_content", "meditation_tips", "items"), {
                    ...data,
                    createdAt: serverTimestamp()
                });
                await logAdminAction({
                    action: "CREATE",
                    collectionName: "meditation_tips",
                    documentId: docRef.id,
                    details: `Created new meditation tip: ${title}`
                });
            }
            setIsDirty(false);
            onCancel();
        } catch (error) {
            console.error("Error saving tip:", error);
            alert("Failed to save tip");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!initialData || !confirm("Delete this tip?")) return;
        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, "spiritual_content", "meditation_tips", "items", initialData.id));
            await logAdminAction({
                action: "DELETE",
                collectionName: "meditation_tips",
                documentId: initialData.id,
                details: `Deleted meditation tip: ${initialData.title}`,
                previousData: initialData
            });
            onCancel();
        } catch (error) {
            alert("Delete failed");
        } finally {
            setIsDeleting(false);
        }
    };

    const inputClasses = `w-full rounded-xl py-3 px-4 outline-none transition-all focus:ring-2 focus:ring-orange-500/50 ${isDark
            ? 'bg-slate-900 border-none text-white placeholder:text-slate-500'
            : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500'
        }`;

    return (
        <form onSubmit={handleSubmit} className={`flex flex-col h-full border-t animate-in slide-in-from-right duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            <Lightbulb className="w-5 h-5 text-orange-500" />
                            {initialData ? "Edit Meditation Step" : "Add New Mediation Step"}
                        </h2>
                        <div className="flex items-center gap-2">
                            {initialData && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                                >
                                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                </button>
                            )}
                            <button type="button" onClick={onCancel} className={`p-2.5 rounded-xl transition-colors ${isDark ? 'text-slate-500 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-200'
                                }`}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className={`space-y-6 p-6 rounded-2xl border ${isDark ? 'bg-slate-800/20 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'
                        }`}>
                        <div className="grid grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order</label>
                                <div className="relative">
                                    <ListOrdered className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="number"
                                        value={order}
                                        onChange={(e) => { setOrder(Number(e.target.value)); setIsDirty(true); }}
                                        className={`${inputClasses} pl-10 font-mono`}
                                    />
                                </div>
                            </div>
                            <div className="col-span-3 space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Step Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
                                    required
                                    placeholder="e.g. Find a quiet space"
                                    className={inputClasses}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Detailed Guidance</label>
                            <textarea
                                value={description}
                                onChange={(e) => { setDescription(e.target.value); setIsDirty(true); }}
                                required
                                rows={8}
                                className={`w-full rounded-2xl py-4 px-4 resize-none leading-relaxed focus:ring-2 focus:ring-orange-500/50 outline-none transition-all ${isDark
                                        ? 'bg-slate-900 border-none text-white placeholder:text-slate-500'
                                        : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500'
                                    }`}
                                placeholder="Explain exactly how to perform this meditation step..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visibility</label>
                            <div className="flex gap-2">
                                {["active", "draft"].map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setStatus(s)}
                                        className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${status === s
                                                ? isDark
                                                    ? "bg-slate-700 border-slate-500 text-white"
                                                    : "bg-slate-800 text-white border-slate-700"
                                                : isDark
                                                    ? "bg-slate-900 border-slate-800 text-slate-600 hover:text-slate-400"
                                                    : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600"
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`p-6 border-t ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                <div className="max-w-2xl mx-auto flex gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-[2] px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Meditation Step
                    </button>
                </div>
            </div>
        </form>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, ArrowLeft, Palette, Settings2, Music } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { logAdminAction } from "@/lib/admin-logger";
import AdminTextField from "../AdminTextField";

interface MantraFormProps {
    initialData?: {
        id: string;
        name: string;
        description: string;
        colorValue: number;
        isCustom: boolean;
        beadsPerMala: number;
    };
    onCancel: () => void;
}

export default function MantraForm({ initialData, onCancel }: MantraFormProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        description: initialData?.description || "",
        colorValue: initialData?.colorValue || 0xFFFF6F00,
        beadsPerMala: initialData?.beadsPerMala || 108,
    });
    const [saving, setSaving] = useState(false);

    // If NO initial data (creation mode), clear defaults to force user entry as per request
    useEffect(() => {
        if (!initialData) {
            setFormData({
                name: "",
                description: "",
                colorValue: 0xFFFF6F00, // Keep color default valid
                beadsPerMala: 108, // Keep beads default valid
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const data = {
                ...formData,
                isCustom: true,
                updatedAt: serverTimestamp()
            };

            if (initialData?.id) {
                await updateDoc(doc(db, "mantras", initialData.id), data);
                await logAdminAction({
                    action: "UPDATE",
                    collectionName: "mantras",
                    documentId: initialData.id,
                    details: `Updated global mantra: ${data.name}`
                });
            } else {
                const docRef = await addDoc(collection(db, "mantras"), {
                    ...data,
                    createdAt: serverTimestamp()
                });
                await logAdminAction({
                    action: "CREATE",
                    collectionName: "mantras",
                    documentId: docRef.id,
                    details: `Added new global mantra: ${data.name}`
                });
            }
            onCancel();
        } catch (error) {
            console.error("Error saving mantra:", error);
            alert("Failed to save mantra");
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-center gap-4 sticky top-0 bg-white z-10">
                <button
                    onClick={onCancel}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        {initialData ? "Edit Global Mantra" : "New Global Mantra"}
                    </h2>
                    <p className="text-sm text-slate-500">Configure mantra details for global tracking</p>
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
                    {/* Basic Info Card */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                <Music className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">Mantra Details</h3>
                                <p className="text-xs text-slate-500">Essential information about the mantra</p>
                            </div>
                        </div>

                        <AdminTextField
                            label="Mantra Name"
                            value={formData.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Om Namah Shivaya"
                            required
                        />

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Description / Lyrics</label>
                            <textarea
                                value={formData.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none"
                                placeholder="Enter the mantra text or meaning..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AdminTextField
                                label="Color Value (Int32)"
                                value={formData.colorValue}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, colorValue: Number(e.target.value) })}
                                type="number"
                                icon={Palette}
                            />
                            <AdminTextField
                                label="Beads Per Mala"
                                value={formData.beadsPerMala}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, beadsPerMala: Number(e.target.value) })}
                                type="number"
                                icon={Settings2}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Save Mantra
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

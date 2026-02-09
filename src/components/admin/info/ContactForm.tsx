"use client";

import { useState, useEffect } from "react";
import { useWarnUnsavedChanges } from "@/hooks/useWarnUnsavedChanges";
import {
    Save,
    X,
    Phone,
    User,
    Tag as TagIcon,
    ArrowUpDown,
    Loader2,
    Trash2,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, onSnapshot, orderBy } from "firebase/firestore";
import { logAdminAction } from "@/lib/admin-logger";

interface ImportantContact {
    id: string;
    name: string;
    phone: string;
    description?: string;
    tags: string[];
    sortOrder: number;
}

interface ContactFormProps {
    initialData?: ImportantContact;
    onCancel: () => void;
}

export default function ContactForm({ initialData, onCancel }: ContactFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [isDark, setIsDark] = useState(false);

    const [name, setName] = useState(initialData?.name || "");
    const [phone, setPhone] = useState(initialData?.phone || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);
    const [sortOrder, setSortOrder] = useState(initialData?.sortOrder || 0);

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
        const interval = setInterval(checkDark, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const q = query(collection(db, "important_info", "main", "tags"), orderBy("name"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setAvailableTags(snapshot.docs.map(doc => doc.data().name));
        });
        return () => unsubscribe();
    }, []);

    const toggleTag = (tag: string) => {
        setIsDirty(true);
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const data = {
                name,
                phone,
                description,
                tags: selectedTags,
                sortOrder: Number(sortOrder),
                updatedAt: serverTimestamp()
            };

            const collectionRef = collection(db, "important_info", "main", "contacts");

            if (initialData) {
                await updateDoc(doc(collectionRef, initialData.id), data);
                await logAdminAction({
                    action: "UPDATE",
                    collectionName: "important_contacts",
                    documentId: initialData.id,
                    details: `Updated contact: ${name}`,
                    previousData: initialData,
                    newData: data
                });
            } else {
                const docRef = await addDoc(collectionRef, {
                    ...data,
                    createdAt: serverTimestamp()
                });
                await logAdminAction({
                    action: "CREATE",
                    collectionName: "important_contacts",
                    documentId: docRef.id,
                    details: `Created new contact: ${name}`
                });
            }
            setIsDirty(false);
            onCancel();
        } catch (error) {
            console.error("Error saving contact:", error);
            alert("Failed to save contact");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!initialData || !confirm("Delete this contact?")) return;
        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, "important_info", "main", "contacts", initialData.id));
            await logAdminAction({
                action: "DELETE",
                collectionName: "important_contacts",
                documentId: initialData.id,
                details: `Deleted contact: ${initialData.name}`,
                previousData: initialData
            });
            onCancel();
        } catch (error) {
            alert("Delete failed");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`flex flex-col h-full animate-in slide-in-from-right duration-300 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-2xl mx-auto space-y-10">
                    <div className="flex items-center justify-between">
                        <h2 className={`text-xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-black'}`}>
                            <User className="w-5 h-5 text-[#B56550]" />
                            {initialData ? "Edit Contact" : "Add New Contact"}
                        </h2>
                        <div className="flex items-center gap-2">
                            {initialData && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                                >
                                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                </button>
                            )}
                            <button type="button" onClick={onCancel} className={`p-3 rounded-2xl transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className={`space-y-8 p-8 rounded-3xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${isDark ? 'text-slate-400' : 'text-black'}`}>Full Name</label>
                                <div className="relative">
                                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => { setName(e.target.value); setIsDirty(true); }}
                                        required
                                        className={`w-full rounded-xl py-3 pl-10 pr-4 font-medium outline-none transition-all ${isDark
                                            ? 'bg-slate-900 border-none text-white'
                                            : 'bg-slate-50 border border-slate-200 text-black focus:ring-2 focus:ring-[#B56550]/20'
                                            }`}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${isDark ? 'text-slate-400' : 'text-black'}`}>Phone Number</label>
                                <div className="relative">
                                    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => { setPhone(e.target.value); setIsDirty(true); }}
                                        required
                                        placeholder="+91 00000 00000"
                                        className={`w-full rounded-xl py-3 pl-10 pr-4 font-mono font-semibold outline-none transition-all ${isDark
                                            ? 'bg-slate-900 border-none text-white placeholder:text-slate-600'
                                            : 'bg-slate-50 border border-slate-200 text-black placeholder:text-slate-400 focus:ring-2 focus:ring-[#B56550]/20'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${isDark ? 'text-slate-400' : 'text-black'}`}>Role / Description</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => { setDescription(e.target.value); setIsDirty(true); }}
                                placeholder="e.g. Area Coordinator, Emergency Contact..."
                                className={`w-full rounded-xl py-3 px-4 outline-none transition-all ${isDark
                                    ? 'bg-slate-900 border-none text-white placeholder:text-slate-600'
                                    : 'bg-slate-50 border border-slate-200 text-black placeholder:text-slate-400 focus:ring-2 focus:ring-[#B56550]/20'
                                    }`}
                            />
                        </div>

                        <div className="space-y-4">
                            <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-black'}`}>
                                <TagIcon className="w-3 h-3" /> Assign Tags
                            </label>
                            <div className={`flex flex-wrap gap-2 p-4 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                {availableTags.map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedTags.includes(tag)
                                            ? "bg-[#B56550] border-[#A05844] text-white"
                                            : isDark
                                                ? "bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300"
                                                : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                                {availableTags.length === 0 && (
                                    <span className={`text-xs italic px-2 ${isDark ? 'text-slate-600' : 'text-[#B56550]'}`}>No tags available. Add some in the Tags & Roles tab.</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 max-w-[150px]">
                            <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-black'}`}>
                                <ArrowUpDown className="w-3 h-3" /> Display Order
                            </label>
                            <input
                                type="number"
                                value={sortOrder}
                                onChange={(e) => { setSortOrder(Number(e.target.value)); setIsDirty(true); }}
                                className={`w-full rounded-xl py-3 px-4 font-mono font-bold outline-none ${isDark
                                    ? 'bg-slate-900 border-none text-white'
                                    : 'bg-slate-50 border border-slate-200 text-black focus:ring-2 focus:ring-[#B56550]/20'
                                    }`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={`p-8 border-t ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="max-w-2xl mx-auto flex gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className={`flex-1 px-8 py-4 rounded-2xl font-bold transition-all border ${isDark
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200'
                            }`}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-[2] px-8 py-4 rounded-2xl bg-[#B56550] hover:bg-[#A05844] text-white font-bold transition-all shadow-xl shadow-[#B56550]/10 flex items-center justify-center gap-2 active:scale-95"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {initialData ? "Save Changes" : "Save Contact"}
                    </button>
                </div>
            </div>
        </form>
    );
}

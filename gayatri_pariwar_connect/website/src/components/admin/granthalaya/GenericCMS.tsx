"use client";

import { useState, useEffect } from "react";
import { Plus, Tag, Archive, Trash2, Save, LucideIcon, GripVertical } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc, writeBatch, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/components/ui/Toast";
import { logAdminAction } from "@/lib/admin-logger";
import { Reorder } from "framer-motion";

interface CMSItem {
    id: string;
    name: string;
    order?: number;
    typeCode?: string;
}

interface GenericCMSProps {
    collectionPath: string; // e.g. "granthalaya_app/inventory/sections"
    title: string;
    subtitle: string;
    icon: LucideIcon;
    placeholder: string;
    typeLabel: string; // e.g. "Section" or "Tag"
    defaultTypeCode?: string; // Optional: default type for new items
}

export default function GenericCMS({ collectionPath, title, subtitle, icon: Icon, placeholder, typeLabel, defaultTypeCode }: GenericCMSProps) {
    const [items, setItems] = useState<CMSItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [newItem, setNewItem] = useState("");
    const [selectedType, setSelectedType] = useState(defaultTypeCode || "");
    const [isSaving, setIsSaving] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const { showToast } = useToast();

    const PRODUCT_TYPES = [
        { code: "BOOK", label: "Book" },
        { code: "SAMAGRI", label: "Hawan Samagri" },
        { code: "GOBAR", label: "Gobar Products" },
        { code: "VASTRA", label: "Vastra" },
        { code: "INCENSE", label: "Incense / Dhoop" },
        { code: "OTHER", label: "Other" }
    ];

    useEffect(() => {
        const checkDark = () => {
            const saved = localStorage.getItem('admin-theme');
            if (saved === 'dark') setIsDark(true);
            else if (saved === 'system') setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
        };
        checkDark();
    }, []);

    useEffect(() => {
        const pathParts = collectionPath.split('/');
        const q = query(
            collection(db, pathParts[0], ...pathParts.slice(1)),
            orderBy("order", "asc"),
            orderBy("name", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as CMSItem[];
            setItems(data);
            setLoading(false);
        }, (error) => {
            console.error(`Error fetching ${typeLabel}:`, error);
            // Fallback for missing order field
            const fallbackQ = query(
                collection(db, pathParts[0], ...pathParts.slice(1)),
                orderBy("name", "asc")
            );
            return onSnapshot(fallbackQ, (s) => {
                setItems(s.docs.map(d => ({ id: d.id, ...d.data() })) as CMSItem[]);
                setLoading(false);
            });
        });

        return () => unsubscribe();
    }, [collectionPath, typeLabel]);

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        setIsSaving(true);
        try {
            const id = newItem.trim().toLowerCase().replace(/\s+/g, '-');
            const pathParts = collectionPath.split('/');
            const docRef = doc(db, pathParts[0], ...pathParts.slice(1), id);

            const data: any = {
                name: newItem.trim(),
                order: items.length, // Add at end
                createdAt: serverTimestamp()
            };

            if (selectedType) {
                data.typeCode = selectedType;
            }

            await setDoc(docRef, data);

            await logAdminAction({
                action: "CREATE",
                collectionName: collectionPath,
                documentId: id,
                details: `Created ${typeLabel}: ${newItem.trim()} ${selectedType ? `(Type: ${selectedType})` : ""}`,
                newData: data
            });

            setNewItem("");
            showToast(`${typeLabel} added successfully`, "success");
        } catch (error) {
            console.error(`Error adding ${typeLabel}:`, error);
            showToast(`Failed to add ${typeLabel}`, "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleReorder = async (newOrder: CMSItem[]) => {
        setItems(newOrder);

        // Persist order in background
        try {
            const batch = writeBatch(db);
            const pathParts = collectionPath.split('/');

            newOrder.forEach((item, index) => {
                const docRef = doc(db, pathParts[0], ...pathParts.slice(1), item.id);
                batch.update(docRef, { order: index });
            });

            await batch.commit();
        } catch (error) {
            console.error(`Error updating order for ${typeLabel}:`, error);
            showToast("Failed to save new order", "error");
        }
    };

    const handleDeleteItem = async (item: CMSItem) => {
        if (!window.confirm(`Are you sure you want to delete this ${typeLabel}: "${item.name}"?`)) return;

        try {
            const pathParts = collectionPath.split('/');
            const docRef = doc(db, pathParts[0], ...pathParts.slice(1), item.id);
            await deleteDoc(docRef);

            await logAdminAction({
                action: "DELETE",
                collectionName: collectionPath,
                documentId: item.id,
                details: `Deleted ${typeLabel}: ${item.name}`,
                previousData: item
            });

            showToast(`${typeLabel} deleted`, "success");
        } catch (error) {
            console.error(`Error deleting ${typeLabel}:`, error);
            showToast(`Failed to delete ${typeLabel}`, "error");
        }
    };

    const inputClasses = `rounded-xl py-3 px-4 outline-none transition-all focus:ring-2 focus:ring-orange-500/50 ${isDark
        ? 'bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500'
        : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500'
        }`;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${isDark ? 'bg-slate-800 text-orange-500' : 'bg-orange-50 text-orange-600'}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold font-display tracking-tight">{title}</h2>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">{subtitle}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Form */}
                <div className={`p-6 rounded-[2rem] border h-fit space-y-6 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        New {typeLabel}
                    </h3>
                    <form onSubmit={handleAddItem} className="space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Name</label>
                                <input
                                    type="text"
                                    value={newItem}
                                    onChange={(e) => setNewItem(e.target.value)}
                                    className={`w-full ${inputClasses}`}
                                    placeholder={placeholder}
                                    required
                                />
                            </div>

                            {typeLabel.toLowerCase() === "category" && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Product Type (Optional)</label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className={`w-full ${inputClasses}`}
                                    >
                                        <option value="">Global (All Types)</option>
                                        {PRODUCT_TYPES.map(type => (
                                            <option key={type.code} value={type.code}>{type.label}</option>
                                        ))}
                                    </select>
                                    <p className="text-[9px] text-slate-500 pl-1 italic">Limits category to specific browsing screens.</p>
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isSaving || !newItem.trim()}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSaving ? "Saving..." : `Create ${typeLabel}`}
                            {!isSaving && <Save className="w-4 h-4" />}
                        </button>
                        <p className="text-[10px] text-slate-500 text-center italic">Drag items in the list to reorder them.</p>
                    </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`h-16 rounded-xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                                ))}
                            </div>
                        ) : items.length > 0 ? (
                            <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-3">
                                {items.map(item => (
                                    <Reorder.Item
                                        key={item.id}
                                        value={item}
                                        className={`group flex items-center justify-between p-4 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-sm'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="text-slate-400 group-hover:text-orange-500">
                                                <GripVertical className="w-4 h-4" />
                                            </div>
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-white shadow-sm'}`}>
                                                <Icon className="w-4 h-4 text-orange-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.name}</span>
                                                    {item.typeCode && (
                                                        <span className="px-1.5 py-0.5 rounded shadow-sm text-[8px] font-bold bg-orange-500 text-white uppercase tracking-tighter">
                                                            {PRODUCT_TYPES.find(t => t.code === item.typeCode)?.label || item.typeCode}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-slate-500 uppercase font-medium">ID: {item.id}</span>
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleDeleteItem(item)}
                                                className={`p-2 rounded-lg text-slate-400 hover:text-red-500 transition-colors ${isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        ) : (
                            <div className="py-12 text-center">
                                <Archive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-400 text-sm">No {typeLabel.toLowerCase()}s found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

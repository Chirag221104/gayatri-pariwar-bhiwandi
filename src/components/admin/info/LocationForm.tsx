"use client";

import { useState, useEffect } from "react";
import { useWarnUnsavedChanges } from "@/hooks/useWarnUnsavedChanges";
import {
    Save,
    X,
    MapPin,
    Navigation,
    Tag as TagIcon,
    Globe,
    Loader2,
    Trash2,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, onSnapshot, orderBy } from "firebase/firestore";
import { logAdminAction } from "@/lib/admin-logger";

interface ImportantLocation {
    id: string;
    name: string;
    description?: string;
    mapLink?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    tags: string[];
    role?: string;
    sortOrder: number;
}

interface LocationFormProps {
    initialData?: ImportantLocation;
    onCancel: () => void;
}

export default function LocationForm({ initialData, onCancel }: LocationFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [availableRoles, setAvailableRoles] = useState<string[]>([]);
    const [isDark, setIsDark] = useState(false);

    const [name, setName] = useState(initialData?.name || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [address, setAddress] = useState(initialData?.address || "");
    const [mapLink, setMapLink] = useState(initialData?.mapLink || "");
    const [latitude, setLatitude] = useState(initialData?.latitude?.toString() || "");
    const [longitude, setLongitude] = useState(initialData?.longitude?.toString() || "");
    const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);
    const [selectedRole, setSelectedRole] = useState(initialData?.role || "");
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
        // Fetch Tags
        const tagsQ = query(collection(db, "important_info", "main", "tags"), orderBy("name"));
        const unsubscribeTags = onSnapshot(tagsQ, (snapshot) => {
            setAvailableTags(snapshot.docs.map(doc => doc.data().name));
        });

        // Fetch Roles
        const rolesQ = query(collection(db, "important_info", "main", "roles"), orderBy("name"));
        const unsubscribeRoles = onSnapshot(rolesQ, (snapshot) => {
            setAvailableRoles(snapshot.docs.map(doc => doc.data().name));
        });

        return () => {
            unsubscribeTags();
            unsubscribeRoles();
        };
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
                description,
                address,
                mapLink,
                latitude: latitude ? Number(latitude) : null,
                longitude: longitude ? Number(longitude) : null,
                tags: selectedTags,
                role: selectedRole,
                sortOrder: Number(sortOrder),
                updatedAt: serverTimestamp()
            };

            const collectionRef = collection(db, "important_info", "main", "locations");

            if (initialData) {
                await updateDoc(doc(collectionRef, initialData.id), data);
                await logAdminAction({
                    action: "UPDATE",
                    collectionName: "important_locations",
                    documentId: initialData.id,
                    details: `Updated location: ${name}`,
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
                    collectionName: "important_locations",
                    documentId: docRef.id,
                    details: `Created new location: ${name}`
                });
            }
            setIsDirty(false);
            onCancel();
        } catch (error) {
            console.error("Error saving location:", error);
            alert("Failed to save location");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!initialData || !confirm("Delete this location?")) return;
        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, "important_info", "main", "locations", initialData.id));
            await logAdminAction({
                action: "DELETE",
                collectionName: "important_locations",
                documentId: initialData.id,
                details: `Deleted location: ${initialData.name}`,
                previousData: initialData
            });
            onCancel();
        } catch (error) {
            alert("Delete failed");
        } finally {
            setIsDeleting(false);
        }
    };

    const inputClass = isDark
        ? 'bg-slate-900 border-none text-white placeholder:text-slate-600'
        : 'bg-slate-50 border border-slate-200 text-black placeholder:text-slate-400 focus:ring-2 focus:ring-[#B56550]/20';

    const labelClass = isDark ? 'text-slate-400' : 'text-black';

    return (
        <form onSubmit={handleSubmit} className={`flex flex-col h-full animate-in slide-in-from-bottom-5 duration-300 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto space-y-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className={`text-2xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-black'}`}>
                                <MapPin className="w-6 h-6 text-[#B56550]" />
                                {initialData ? "Edit Location" : "Add New Location"}
                            </h2>
                            <p className="text-[#B56550] text-sm font-medium italic">Define spiritual coordinates for the community</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {initialData && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-colors"
                                >
                                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                </button>
                            )}
                            <button type="button" onClick={onCancel} className={`p-3 rounded-2xl transition-all ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-8">
                            <div className={`p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                                <div className="space-y-2">
                                    <label className={`text-xs font-bold uppercase tracking-widest pl-1 ${labelClass}`}>Location Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => { setName(e.target.value); setIsDirty(true); }}
                                        required
                                        placeholder="e.g. Gayatri Mandir, Bhiwandi"
                                        className={`w-full rounded-2xl py-4 px-5 text-lg font-bold outline-none ${inputClass}`}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${labelClass}`}>Role / Type</label>
                                        <select
                                            value={selectedRole}
                                            onChange={(e) => { setSelectedRole(e.target.value); setIsDirty(true); }}
                                            className={`w-full rounded-xl py-3 px-4 font-bold outline-none ${inputClass}`}
                                        >
                                            <option value="">Select a role...</option>
                                            {availableRoles.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${labelClass}`}>Sort Order</label>
                                        <input
                                            type="number"
                                            value={sortOrder}
                                            onChange={(e) => { setSortOrder(Number(e.target.value)); setIsDirty(true); }}
                                            className={`w-full rounded-xl py-3 px-4 font-mono font-bold outline-none ${inputClass}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={`p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                                <div className="space-y-2">
                                    <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 flex items-center gap-2 ${labelClass}`}>
                                        <Navigation className="w-3 h-3 text-[#B56550]" /> Full Address
                                    </label>
                                    <textarea
                                        value={address}
                                        onChange={(e) => { setAddress(e.target.value); setIsDirty(true); }}
                                        className={`w-full rounded-xl py-3 px-4 text-sm font-medium outline-none resize-none ${inputClass}`}
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 flex items-center gap-2 ${labelClass}`}>
                                        <Globe className="w-3 h-3 text-[#B56550]" /> Google Maps Link (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        value={mapLink}
                                        onChange={(e) => { setMapLink(e.target.value); setIsDirty(true); }}
                                        placeholder="https://maps.google.com/..."
                                        className={`w-full rounded-xl py-3 px-4 text-[10px] font-bold outline-none ${inputClass}`}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${labelClass}`}>Latitude</label>
                                        <input
                                            type="text"
                                            value={latitude}
                                            onChange={(e) => { setLatitude(e.target.value); setIsDirty(true); }}
                                            placeholder="19.0760"
                                            className={`w-full rounded-xl py-3 px-4 font-mono text-xs font-bold outline-none ${inputClass}`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${labelClass}`}>Longitude</label>
                                        <input
                                            type="text"
                                            value={longitude}
                                            onChange={(e) => { setLongitude(e.target.value); setIsDirty(true); }}
                                            placeholder="72.8777"
                                            className={`w-full rounded-xl py-3 px-4 font-mono text-xs font-bold outline-none ${inputClass}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className={`p-6 rounded-3xl border space-y-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                                <label className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${labelClass}`}>
                                    <TagIcon className="w-3 h-3 text-[#B56550]" /> Associated Tags
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {availableTags.map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => toggleTag(tag)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedTags.includes(tag)
                                                ? "bg-[#B56550] border-[#B56550] text-white"
                                                : isDark
                                                    ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-[#B56550]"
                                                    : "bg-slate-50 border-slate-200 text-slate-400 hover:text-[#B56550]"
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                                <div className={`pt-4 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                                    <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${labelClass}`}>Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => { setDescription(e.target.value); setIsDirty(true); }}
                                        rows={4}
                                        className={`w-full rounded-xl py-3 px-4 text-xs font-medium outline-none resize-none ${inputClass}`}
                                        placeholder="Internal notes or extra info..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`p-8 border-t ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="max-w-4xl mx-auto flex gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className={`flex-1 px-8 py-4 rounded-2xl font-bold transition-all border ${isDark
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-800'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200'
                            }`}
                    >
                        Discard Changes
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-[2] px-8 py-4 rounded-2xl bg-[#B56550] hover:bg-[#A05540] text-white font-bold transition-all shadow-xl shadow-[#B56550]/20 flex items-center justify-center gap-2 active:scale-95"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {initialData ? "Apply Update" : "Register Location"}
                    </button>
                </div>
            </div>
        </form>
    );
}

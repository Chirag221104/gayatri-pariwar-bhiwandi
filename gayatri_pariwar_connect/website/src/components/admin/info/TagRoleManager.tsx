"use client";

import { useState, useEffect } from "react";
import { Plus, Tag, ShieldCheck, Loader2, X } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { logAdminAction } from "@/lib/admin-logger";

export default function TagRoleManager() {
    const [tags, setTags] = useState<{ id: string, name: string }[]>([]);
    const [roles, setRoles] = useState<{ id: string, name: string }[]>([]);
    const [newTag, setNewTag] = useState("");
    const [newRole, setNewRole] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSavingTag, setIsSavingTag] = useState(false);
    const [isSavingRole, setIsSavingRole] = useState(false);
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

    useEffect(() => {
        const tagsQ = query(collection(db, "important_info", "main", "tags"), orderBy("name"));
        const unsubscribeTags = onSnapshot(tagsQ, (snapshot) => {
            setTags(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
        });

        const rolesQ = query(collection(db, "important_info", "main", "roles"), orderBy("name"));
        const unsubscribeRoles = onSnapshot(rolesQ, (snapshot) => {
            setRoles(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
            setLoading(false);
        });

        return () => {
            unsubscribeTags();
            unsubscribeRoles();
        };
    }, []);

    const handleAdd = async (type: 'tag' | 'role') => {
        const val = type === 'tag' ? newTag : newRole;
        if (!val.trim()) return;

        type === 'tag' ? setIsSavingTag(true) : setIsSavingRole(true);
        try {
            const col = collection(db, "important_info", "main", type === 'tag' ? "tags" : "roles");
            await addDoc(col, {
                name: val.trim(),
                createdAt: serverTimestamp()
            });
            await logAdminAction({
                action: "CREATE",
                collectionName: `important_${type}s`,
                documentId: "new",
                details: `Added new ${type}: ${val}`
            });
            type === 'tag' ? setNewTag("") : setNewRole("");
        } catch (error) {
            alert(`Failed to add ${type}`);
        } finally {
            type === 'tag' ? setIsSavingTag(false) : setIsSavingRole(false);
        }
    };

    const handleDelete = async (id: string, name: string, type: 'tag' | 'role') => {
        if (!confirm(`Delete ${type} "${name}"? Existing contacts using this will lose the reference.`)) return;
        try {
            await deleteDoc(doc(db, "important_info", "main", type === 'tag' ? "tags" : "roles", id));
            await logAdminAction({
                action: "DELETE",
                collectionName: `important_${type}s`,
                documentId: id,
                details: `Deleted ${type}: ${name}`
            });
        } catch (error) {
            alert(`Delete failed`);
        }
    };

    const inputClass = isDark
        ? 'bg-slate-800 border-none text-white placeholder:text-slate-500'
        : 'bg-white border border-slate-200 text-black placeholder:text-slate-400 shadow-sm';

    const labelClass = isDark ? 'text-slate-400' : 'text-slate-500';

    return (
        <div className={`flex flex-col h-full p-8 overflow-y-auto ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tags Section */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl ${isDark ? 'bg-purple-500/10 text-purple-500' : 'bg-purple-50 text-purple-600'}`}>
                            <Tag className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>Contact Tags</h3>
                            <p className={`text-xs font-medium ${labelClass}`}>Labels for grouping contacts</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Add new tag..."
                            className={`flex-1 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-purple-500/20 ${inputClass}`}
                        />
                        <button
                            onClick={() => handleAdd('tag')}
                            disabled={isSavingTag || !newTag}
                            className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all shadow-lg shadow-purple-500/10 disabled:opacity-50 active:scale-95"
                        >
                            {isSavingTag ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className={`rounded-3xl border overflow-hidden ${isDark ? 'bg-slate-800/20 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="p-3 flex flex-wrap gap-2">
                            {tags.map(tag => (
                                <div key={tag.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors group ${isDark ? 'bg-slate-800 hover:bg-slate-700 border-white/5' : 'bg-white hover:bg-slate-50 border-slate-100 shadow-sm'}`}>
                                    <span className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-purple-600'}`}>{tag.name}</span>
                                    <button
                                        onClick={() => handleDelete(tag.id, tag.name, 'tag')}
                                        className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                            {tags.length === 0 && !loading && (
                                <p className={`text-xs p-4 w-full text-center ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>No tags defined yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Roles Section */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl ${isDark ? 'bg-blue-500/10 text-blue-500' : 'bg-blue-50 text-blue-600'}`}>
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>Location Roles</h3>
                            <p className={`text-xs font-medium ${labelClass}`}>Classification for Shaktipeeths/Chetnas</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            placeholder="Add new role..."
                            className={`flex-1 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 ${inputClass}`}
                        />
                        <button
                            onClick={() => handleAdd('role')}
                            disabled={isSavingRole || !newRole}
                            className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-500/10 disabled:opacity-50 active:scale-95"
                        >
                            {isSavingRole ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className={`rounded-3xl border overflow-hidden ${isDark ? 'bg-slate-800/20 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="p-3 flex flex-wrap gap-2">
                            {roles.map(role => (
                                <div key={role.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors group ${isDark ? 'bg-slate-800 hover:bg-slate-700 border-white/5' : 'bg-white hover:bg-slate-50 border-slate-100 shadow-sm'}`}>
                                    <span className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-blue-600'}`}>{role.name}</span>
                                    <button
                                        onClick={() => handleDelete(role.id, role.name, 'role')}
                                        className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                            {roles.length === 0 && !loading && (
                                <p className={`text-xs p-4 w-full text-center ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>No roles defined yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

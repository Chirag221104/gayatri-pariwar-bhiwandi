"use client";

import { useState, useEffect } from "react";
import { Plus, Phone, User, Tag as TagIcon, ArrowUpDown } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import AdminTable from "@/components/admin/AdminTable";
import ContactForm from "@/components/admin/info/ContactForm";

interface ImportantContact {
    id: string;
    name: string;
    phone: string;
    description?: string;
    tags: string[];
    sortOrder: number;
}

export default function ContactsList() {
    const [contacts, setContacts] = useState<ImportantContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedContact, setSelectedContact] = useState<ImportantContact | null>(null);
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
        const q = query(
            collection(db, "important_info", "main", "contacts"),
            orderBy("sortOrder", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ImportantContact[];
            setContacts(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching contacts:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const columns = [
        {
            header: "Name & Info",
            accessor: (item: ImportantContact) => (
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-50 text-emerald-600'}`}>
                        <User className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className={`font-bold truncate ${isDark ? 'text-white' : 'text-black'}`}>{item.name}</span>
                        <span className={`text-[10px] line-clamp-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.description || "No description"}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Phone",
            accessor: (item: ImportantContact) => (
                <div className={`flex items-center gap-2 font-mono text-sm font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    <Phone className="w-3.5 h-3.5" />
                    {item.phone}
                </div>
            )
        },
        {
            header: "Tags",
            accessor: (item: ImportantContact) => (
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {item.tags?.length > 0 ? item.tags.map(tag => (
                        <span key={tag} className={`text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 border ${isDark ? 'bg-slate-800 text-slate-400 border-white/5' : 'bg-white text-slate-600 border-slate-200'}`}>
                            <TagIcon className="w-2.5 h-2.5" />
                            {tag}
                        </span>
                    )) : (
                        <span className={`text-[9px] italic ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>No tags</span>
                    )}
                </div>
            )
        },
        {
            header: "Sort",
            accessor: (item: ImportantContact) => (
                <div className={`flex items-center gap-2 font-mono text-xs font-bold ${isDark ? 'text-orange-500' : 'text-slate-400'}`}>
                    <ArrowUpDown className="w-3 h-3" />
                    {item.sortOrder}
                </div>
            ),
            className: "w-20"
        }
    ];

    if (showForm) {
        return (
            <ContactForm
                initialData={selectedContact || undefined}
                onCancel={() => { setShowForm(false); setSelectedContact(null); }}
            />
        );
    }

    return (
        <div className={`flex flex-col h-full ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <div>
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Contacts Directory</h2>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Global and local contacts for emergency and service</p>
                </div>
                <button
                    onClick={() => { setSelectedContact(null); setShowForm(true); }}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Add Contact
                </button>
            </div>

            <div className="flex-1 min-h-0">
                <AdminTable
                    columns={columns}
                    data={contacts}
                    loading={loading}
                    searchPlaceholder="Search by name or phone..."
                    onRowClick={(item) => { setSelectedContact(item); setShowForm(true); }}
                />
            </div>
        </div>
    );
}

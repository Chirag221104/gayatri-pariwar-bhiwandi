"use client";

import { useState, useEffect } from "react";
import { Plus, BookOpen, Video, FileText, Tag, Link as LinkIcon, Download, Music, Image as ImageIcon } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/ui/StatusBadge";
import ResourceForm from "@/components/admin/spiritual/ResourceForm";

interface SpiritualResource {
    id: string;
    title: string;
    description: string;
    type: string; // book, audio, bhajan, video, picture
    category: string;
    url: string;
    thumbnail?: string;
    status: string;
}

export default function ResourcesList() {
    const [resources, setResources] = useState<SpiritualResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedResource, setSelectedResource] = useState<SpiritualResource | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDark = () => {
            const saved = localStorage.getItem('admin-theme');
            if (saved === 'dark') setIsDark(true);
            else if (saved === 'system') setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
            else setIsDark(false);
        };
        checkDark();
        const interval = setInterval(checkDark, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const q = query(
            collection(db, "spiritual_content", "resources", "items"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SpiritualResource[];
            setResources(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching resources:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredResources = resources.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTypeIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'video': return <Video className="w-4 h-4 text-red-500" />;
            case 'book': return <BookOpen className="w-4 h-4 text-blue-500" />;
            case 'audio':
            case 'bhajan': return <Music className="w-4 h-4 text-orange-500" />;
            case 'picture': return <ImageIcon className="w-4 h-4 text-emerald-500" />;
            default: return <FileText className="w-4 h-4 text-slate-500" />;
        }
    };

    const columns = [
        {
            header: "Resource",
            accessor: (item: SpiritualResource) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden text-slate-500">
                        {item.thumbnail ? (
                            <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                            getTypeIcon(item.type)
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{item.title}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            {getTypeIcon(item.type)}
                            <span className="capitalize">{item.type}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: "Category",
            accessor: (item: SpiritualResource) => (
                <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3 text-slate-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.category}</span>
                </div>
            )
        },
        {
            header: "Link",
            accessor: (item: SpiritualResource) => (
                <div className="flex items-center gap-2 text-blue-500">
                    <LinkIcon className="w-3 h-3" />
                    <span className="text-[10px] truncate max-w-[150px]">{item.url}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessor: (item: SpiritualResource) => (
                <StatusBadge
                    variant={item.status === 'active' ? 'active' : 'unavailable'}
                    label={item.status || 'Draft'}
                    className="shadow-sm"
                />
            )
        }
    ];

    if (showForm) {
        return (
            <ResourceForm
                initialData={selectedResource || undefined}
                onCancel={() => { setShowForm(false); setSelectedResource(null); }}
            />
        );
    }

    return (
        <div className={`flex flex-col h-full ${isDark ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'}`}>
            <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-20 ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-slate-200 bg-white'}`}>
                <div>
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Spiritual Resources</h2>
                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Manage books, audio, video, and other media</p>
                </div>
                <button
                    onClick={() => { setSelectedResource(null); setShowForm(true); }}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Add Resource
                </button>
            </div>

            <div className="flex-1 min-h-0">
                <AdminTable
                    columns={columns}
                    data={filteredResources}
                    loading={loading}
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search by title, category, or type..."
                    onRowClick={(item) => { setSelectedResource(item); setShowForm(true); }}
                    emptyMessage="No resources found. Build the library!"
                />
            </div>
        </div>
    );
}

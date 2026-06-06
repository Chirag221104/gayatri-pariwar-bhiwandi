"use client";

import { useState, useEffect } from "react";
import { Plus, Library, FileText, Trash2, Edit3, Loader2, Archive, Globe, Globe2, ArrowLeft } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminTable from "@/components/admin/AdminTable";
import SectionHeader from "@/components/ui/SectionHeader";
import { useToast } from "@/components/ui/Toast";
import { logAdminAction } from "@/lib/admin-logger";

interface DigitalBook {
    id: string;
    title: string;
    author: string;
    pdfUrl: string;
    coverUrl?: string;
    category: string;
    isActive: boolean;
}

export default function DigitalLibraryPage() {
    const [books, setBooks] = useState<DigitalBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isDark, setIsDark] = useState(false);
    const params = useParams();
    const locale = (params?.locale as string) || "en";
    const { showToast } = useToast();

    useEffect(() => {
        const checkDark = () => {
            const saved = localStorage.getItem('admin-theme');
            if (saved === 'dark') setIsDark(true);
            else if (saved === 'system') setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
            else setIsDark(false);
        };
        checkDark();
    }, []);

    useEffect(() => {
        const q = query(collection(db, "granthalaya_app", "digital_library", "items"), orderBy("title", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as DigitalBook[];
            setBooks(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching digital books:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (book: DigitalBook) => {
        if (!window.confirm(`Delete "${book.title}" from Digital Library?`)) return;

        try {
            await deleteDoc(doc(db, "granthalaya_app", "digital_library", "items", book.id));

            await logAdminAction({
                action: "DELETE",
                collectionName: "digital_library",
                documentId: book.id,
                details: `Deleted digital book: ${book.title}`,
                previousData: book
            });

            showToast("Digital book removed", "success");
        } catch (error) {
            console.error("Error deleting book:", error);
            showToast("Failed to delete book", "error");
        }
    };

    const columns = [
        {
            header: "Resource",
            accessor: (item: DigitalBook) => (
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-16 rounded-lg overflow-hidden shrink-0 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                        {item.coverUrl ? (
                            <img src={item.coverUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <FileText className="w-6 h-6 opacity-10" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className={`font-semibold truncate max-w-[250px] ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</span>
                        <span className="text-xs text-slate-500">{item.author}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Category",
            accessor: (item: DigitalBook) => (
                <span className={`text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {item.category}
                </span>
            )
        },
        {
            header: "Status",
            accessor: (item: DigitalBook) => (
                <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">
                        {item.isActive ? 'Public' : 'Hidden'}
                    </span>
                </div>
            )
        },
        {
            header: "Actions",
            accessor: (item: DigitalBook) => (
                <div className="flex items-center gap-2">
                    <Link
                        href={`/${locale}/admin/books/digital-library/${item.id}`}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                    >
                        <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/10 text-slate-400 hover:text-red-500' : 'hover:bg-red-50 text-slate-500 hover:text-red-500'}`}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <a
                        href={item.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-blue-500/10 text-slate-400 hover:text-blue-500' : 'hover:bg-blue-50 text-slate-500 hover:text-blue-500'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Globe2 className="w-4 h-4" />
                    </a>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
            <SectionHeader
                icon={Library}
                title="Digital Library"
                subtitle="Manage free PDF resources and spiritual E-books"
                actions={
                    <Link
                        href={`/${locale}/admin/books/digital-library/new`}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Upload E-Book
                    </Link>
                }
            />

            <div className="flex-1 min-h-0">
                <AdminTable
                    columns={columns}
                    data={books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()))}
                    loading={loading}
                    searchPlaceholder="Search digital titles..."
                    searchValue={search}
                    onSearchChange={setSearch}
                    emptyMessage="Digital Library is empty."
                    emptySubtext="Upload your first free resource to share with users."
                    onRowClick={(item) => {
                        window.location.href = `/${locale}/admin/books/digital-library/${item.id}`;
                    }}
                />
            </div>
        </div>
    );
}

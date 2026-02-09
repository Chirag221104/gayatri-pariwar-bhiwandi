"use client";

import { useState, useEffect } from "react";
import { Plus, BookOpen, Tag, Archive, Edit3, Trash2, FileText, Images } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminTable from "@/components/admin/AdminTable";
import SectionHeader from "@/components/ui/SectionHeader";

interface Book {
    id: string;
    title: string;
    author: string;
    price: number;
    category: string;
    stockQuantity: number;
    coverUrl?: string;
    tags?: string[];
}

export default function BooksInventoryPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isDark, setIsDark] = useState(false);
    const params = useParams();
    const locale = (params?.locale as string) || "en";

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
        const q = query(collection(db, "granthalaya_app", "inventory", "books"), orderBy("title", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const booksData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Book[];
            setBooks(booksData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching books:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()) ||
        book.category.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        {
            header: "Book Details",
            accessor: (item: Book) => (
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-16 rounded-lg overflow-hidden shrink-0 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                        {item.coverUrl ? (
                            <img src={item.coverUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-6 h-6 opacity-10" />
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
            accessor: (item: Book) => (
                <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3 text-slate-500" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.category}</span>
                </div>
            )
        },
        {
            header: "Price",
            accessor: (item: Book) => (
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>₹{item.price}</span>
            )
        },
        {
            header: "Stock",
            accessor: (item: Book) => (
                <div className="flex items-center gap-2">
                    <Archive className={`w-3 h-3 ${item.stockQuantity < 5 ? 'text-red-500' : 'text-slate-500'}`} />
                    <span className={`text-sm font-medium ${item.stockQuantity < 5 ? 'text-red-500' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {item.stockQuantity} units
                    </span>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
            <SectionHeader
                icon={BookOpen}
                title="Books Inventory"
                subtitle="Manage your spiritual literature collection"
                actions={
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/${locale}/admin/books/image-sync`}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border ${isDark
                                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
                                }`}
                        >
                            <Images className="w-5 h-5 text-blue-500" />
                            Image Sync
                        </Link>
                        <Link
                            href={`/${locale}/admin/books/bulk-import`}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border ${isDark
                                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
                                }`}
                        >
                            <FileText className="w-5 h-5 text-orange-500" />
                            Bulk Import
                        </Link>
                        <Link
                            href={`/${locale}/admin/books/new`}
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        >
                            <Plus className="w-5 h-5" />
                            Add Book
                        </Link>
                    </div>
                }
            />

            <div className="flex-1 min-h-0">
                <AdminTable
                    columns={columns}
                    data={filteredBooks}
                    loading={loading}
                    searchPlaceholder="Search by title, author, or category..."
                    searchValue={search}
                    onSearchChange={setSearch}
                    emptyMessage="No books found in inventory."
                    emptySubtext="Add your first spiritual title to start selling."
                    onRowClick={(item) => {
                        window.location.href = `/${locale}/admin/books/${item.id}`;
                    }}
                />
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Archive, Edit3, FileText, Images, Package, Plus, Search, Tag, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminTable from "@/components/admin/AdminTable";
import SectionHeader from "@/components/ui/SectionHeader";
import { Product, PRODUCT_TYPES } from "@/lib/product-utils";
import { generateProductLabels } from "@/lib/label-generator";

interface Book extends Product {
    title?: string; // Support legacy title
    author?: string; // Support legacy author
    coverUrl?: string; // Support legacy coverUrl
}

export default function BooksInventoryPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isDark, setIsDark] = useState(false);
    const [selectedType, setSelectedType] = useState<string>("ALL");
    const params = useParams();
    const locale = (params?.locale as string) || "en";

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const PRODUCT_TYPE_TABS = [
        { id: "ALL", label: "All Items", icon: Package },
        { id: "BK", label: "Books", icon: Search },
        { id: "SM", label: "Samagri", icon: Tag },
        { id: "GB", label: "Gobar", icon: Tag },
        { id: "VS", label: "Vastra", icon: Tag },
        { id: "IN", label: "Incense", icon: Tag },
    ];

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

    const filteredBooks = books.filter(book => {
        const matchesSearch = (book.productCode || "").toLowerCase().includes(search.toLowerCase()) ||
            (book.name || book.title || "").toLowerCase().includes(search.toLowerCase()) ||
            (book.author || book.metadata?.author || "").toLowerCase().includes(search.toLowerCase()) ||
            book.category.toLowerCase().includes(search.toLowerCase());

        const matchesType = selectedType === "ALL" || book.type === selectedType;

        return matchesSearch && matchesType;
    });

    const handlePrintLabels = () => {
        const productsToPrint = selectedIds.size > 0
            ? books.filter(b => selectedIds.has(b.id))
            : filteredBooks;

        if (productsToPrint.length > 0) {
            generateProductLabels(productsToPrint);
        }
    };

    const columns = [
        {
            header: "Product Details",
            accessor: (item: Book) => (
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-16 rounded-lg overflow-hidden shrink-0 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                        {item.imageUrl || item.coverUrl ? (
                            <img src={item.imageUrl || item.coverUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 opacity-10" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className={`font-semibold truncate max-w-[250px] ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.name || item.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono bg-slate-500/10 px-1 rounded text-slate-500">{item.productCode || 'NO-CODE'}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400">{item.type || 'BK'}</span>
                        </div>
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
                icon={Package}
                title="Granthalaya Inventory"
                subtitle="Universal product management & literature collection"
                actions={
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrintLabels}
                            disabled={filteredBooks.length === 0}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border ${selectedIds.size > 0
                                ? 'bg-orange-500 border-orange-600 text-white shadow-lg shadow-orange-500/20'
                                : isDark
                                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
                                }`}
                        >
                            <Tag className={`w-5 h-5 ${selectedIds.size > 0 ? 'text-white' : 'text-orange-500'}`} />
                            {selectedIds.size > 0 ? `Print Labels (${selectedIds.size})` : 'Labels (Bulk)'}
                        </button>
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
                            Add Product
                        </Link>
                    </div>
                }
            />

            <div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide ${isDark ? 'border-b border-slate-700' : 'border-b border-slate-100'}`}>
                {PRODUCT_TYPE_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedType(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${selectedType === tab.id
                            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                            : isDark
                                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

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
                    selectable={true}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                />
            </div>
        </div>
    );
}

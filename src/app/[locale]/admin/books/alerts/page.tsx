"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, BookOpen, Tag, Archive, Edit3, Package, History, Info } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import AdminTable from "@/components/admin/AdminTable";
import SectionHeader from "@/components/ui/SectionHeader";
import { useAdminTheme } from "@/hooks/useAdminTheme";
import StockAdjustmentModal from "@/components/admin/granthalaya/StockAdjustmentModal";

interface Book {
    id: string;
    title: string;
    author: string;
    price: number;
    category: string;
    stockQuantity: number;
    coverUrl?: string;
}

export default function LowStockAlertsPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [threshold, setThreshold] = useState(5);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [showAdjustment, setShowAdjustment] = useState(false);
    const { isDark } = useAdminTheme();

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const configSnap = await getDoc(doc(db, "granthalaya_app", "config"));
                if (configSnap.exists()) {
                    setThreshold(configSnap.data().lowStockThreshold || 5);
                }
            } catch (error) {
                console.error("Error fetching config:", error);
            }
        };
        fetchConfig();
    }, []);

    useEffect(() => {
        const q = query(
            collection(db, "granthalaya_app", "inventory", "books"),
            orderBy("stockQuantity", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const booksData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Book[];

            // Filter locally for items below or equal to threshold
            const lowStock = booksData.filter(b => (b.stockQuantity || 0) <= threshold);
            setBooks(lowStock);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching books:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [threshold]);

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
            header: "Stock Status",
            accessor: (item: Book) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Archive className="w-3 h-3 text-red-500" />
                        <span className="text-sm font-bold text-red-500">
                            {item.stockQuantity} units remaining
                        </span>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                        Threshold: {threshold}
                    </span>
                </div>
            )
        },
        {
            header: "Quick Action",
            accessor: (item: Book) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBook(item);
                        setShowAdjustment(true);
                    }}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                >
                    <Package className="w-4 h-4" />
                    Adjust Stock
                </button>
            )
        }
    ];

    return (
        <div className="space-y-8 flex flex-col h-[calc(100vh-8rem)]">
            <SectionHeader
                icon={AlertTriangle}
                title="Low Stock Alerts"
                subtitle="Critical inventory markers requiring immediate restock"
            />

            {/* Info Card */}
            <div className={`p-6 rounded-[2rem] border flex items-center gap-6 ${isDark ? 'bg-orange-500/5 border-orange-500/10' : 'bg-orange-50 border-orange-100 text-orange-800'}`}>
                <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shrink-0">
                    <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="font-bold">Inventory Watchlist</h3>
                    <p className="text-xs opacity-80 mt-0.5">Showing all books with stock levels at or below the threshold of <strong>{threshold} units</strong>. High urgency items are prioritized.</p>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <AdminTable
                    columns={columns}
                    data={books}
                    loading={loading}
                    emptyMessage="No Low Stock Alerts"
                    emptySubtext="All your inventory levels are currently above the safety threshold."
                />
            </div>

            {selectedBook && (
                <StockAdjustmentModal
                    isOpen={showAdjustment}
                    onClose={() => setShowAdjustment(false)}
                    bookId={selectedBook.id}
                    bookTitle={selectedBook.title}
                    currentStock={selectedBook.stockQuantity}
                    onSuccess={(newStock) => {
                        // Table will auto-refresh due to onSnapshot
                        setSelectedBook(null);
                    }}
                />
            )}
        </div>
    );
}

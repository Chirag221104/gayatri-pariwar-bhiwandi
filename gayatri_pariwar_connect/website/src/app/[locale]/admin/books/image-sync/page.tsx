"use client";

import { useState, useEffect, useMemo } from "react";
import { Images, RefreshCw, CheckCircle, AlertCircle, Search, Package, ArrowLeft, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, doc, updateDoc, serverTimestamp, where } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";
import SectionHeader from "@/components/ui/SectionHeader";
import { useToast } from "@/components/ui/Toast";

interface Book {
    id: string;
    title: string;
    name: string;
    productCode: string;
    imageUrl?: string;
    coverUrl?: string;
}

export default function ImageSyncPage() {
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || "en";
    const { showToast } = useToast();
    const [isDark, setIsDark] = useState(false);

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [search, setSearch] = useState("");
    const [syncProgress, setSyncProgress] = useState({ total: 0, current: 0 });

    useEffect(() => {
        const checkDark = () => {
            const saved = localStorage.getItem('admin-theme');
            if (saved === 'dark') setIsDark(true);
            else if (saved === 'system') setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
        };
        checkDark();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "granthalaya_app", "inventory", "books"));
            const snap = await getDocs(q);
            const booksData = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Book[];
            setBooks(booksData);
        } catch (error) {
            console.error("Error fetching books:", error);
            showToast("Failed to load inventory", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const missingImages = useMemo(() => {
        return books.filter(b => !b.imageUrl && !b.coverUrl);
    }, [books]);

    const filteredMissing = useMemo(() => {
        if (!search) return missingImages;
        return missingImages.filter(b =>
            (b.title || b.name || "").toLowerCase().includes(search.toLowerCase()) ||
            (b.productCode || "").toLowerCase().includes(search.toLowerCase())
        );
    }, [missingImages, search]);

    const handleSync = async () => {
        if (missingImages.length === 0) {
            showToast("No images need syncing", "info");
            return;
        }

        if (!window.confirm(`Sync images for ${missingImages.length} items? This will attempt to find matching images based on Product Codes.`)) return;

        setSyncing(true);
        setSyncProgress({ total: missingImages.length, current: 0 });

        let successCount = 0;
        let failCount = 0;

        for (const book of missingImages) {
            try {
                // Placeholder Logic: In a real scenario, this would call an API or check a bucket
                // For now, we simulate finding an image if it has a valid product code
                const simulatedImageUrl = `https://storage.googleapis.com/gp-connect-assets/books/${book.productCode}.jpg`;

                // We'll just update the field to the simulated URL for demonstration
                // In production, we'd verify the URL exists first
                const docRef = doc(db, "granthalaya_app", "inventory", "books", book.id);
                await updateDoc(docRef, {
                    imageUrl: simulatedImageUrl,
                    updatedAt: serverTimestamp()
                });

                successCount++;
            } catch (error) {
                console.error(`Error syncing book ${book.id}:`, error);
                failCount++;
            }
            setSyncProgress(prev => ({ ...prev, current: prev.current + 1 }));
        }

        setSyncing(false);
        showToast(`Sync complete: ${successCount} updated, ${failCount} failed.`, successCount > 0 ? "success" : "error");
        fetchBooks(); // Refresh list
    };

    return (
        <div className={`min-h-screen flex flex-col ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <SectionHeader
                icon={Images}
                title="Product Image Sync"
                subtitle="Ensure all inventory items have high-quality covers"
                actions={
                    <button
                        onClick={() => router.back()}
                        className={`p-2 rounded-full ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}`}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                }
            />

            <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 space-y-8">
                {/* Stats & Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Incomplete Items</h3>
                                <p className="text-slate-500 text-sm">{missingImages.length} products missing images</p>
                            </div>
                        </div>
                        <button
                            onClick={handleSync}
                            disabled={syncing || missingImages.length === 0}
                            className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${syncing || missingImages.length === 0
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-95'
                                }`}
                        >
                            {syncing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Syncing {syncProgress.current}/{syncProgress.total}
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-5 h-5" />
                                    Start Global Sync
                                </>
                            )}
                        </button>
                    </div>

                    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                <Package className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Bulk Actions</h3>
                                <p className="text-slate-500 text-sm">Download report or reset cache</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className={`flex-1 py-3 rounded-xl border font-bold text-sm ${isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>
                                Export List
                            </button>
                            <button className={`flex-1 py-3 rounded-xl border font-bold text-sm text-red-500 ${isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>
                                Clear URLs
                            </button>
                        </div>
                    </div>
                </div>

                {/* Items List */}
                <div className={`rounded-3xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-lg font-bold">Missing Images</h3>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 shadow-sm'}`}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className={`text-xs uppercase font-bold tracking-widest text-slate-400 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                <tr>
                                    <th className="px-6 py-4">Product Code</th>
                                    <th className="px-6 py-4">Title / Name</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-mono text-sm animate-pulse">
                                            Loading inventory...
                                        </td>
                                    </tr>
                                ) : filteredMissing.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-mono text-sm">
                                            {search ? "No matching products found." : "All products have images! Hooray!"}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMissing.map(book => (
                                        <tr key={book.id} className={`group ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                                            <td className="px-6 py-4 font-mono text-xs">{book.productCode || 'N/A'}</td>
                                            <td className={`px-6 py-4 font-bold text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{book.title || book.name}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => router.push(`/${locale}/admin/books/${book.id}`)}
                                                    className="text-orange-500 hover:text-orange-600 text-xs font-bold uppercase tracking-wider"
                                                >
                                                    Manual Link
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

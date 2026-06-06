"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import BookForm from "@/components/admin/BookForm";
import { logAdminAction } from "@/lib/admin-logger";
import { ChevronLeft, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import StockAdjustmentModal from "@/components/admin/granthalaya/StockAdjustmentModal";
import BookStockHistory from "@/components/admin/granthalaya/BookStockHistory";
import { History as HistoryIcon, Package } from "lucide-react";
import { useAdminTheme } from "@/hooks/useAdminTheme";
import { useToast } from "@/components/ui/Toast";

export default function EditBookPage() {
    const { id, locale } = useParams();
    const router = useRouter();
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showAdjustment, setShowAdjustment] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isDark } = useAdminTheme();
    const { showToast } = useToast();



    useEffect(() => {
        const fetchBook = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "granthalaya_app", "inventory", "books", id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setBook({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError("Book details not found in database.");
                    showToast("Book not found", "error");
                }
            } catch (err: any) {
                console.error("Error fetching book:", err);
                if (err.code === 'permission-denied') {
                    setError("Permission Denied: You do not have access to this collection. Please check your Firestore Security Rules.");
                } else {
                    setError(err.message || "Failed to load book details.");
                }
                showToast("Permission Error", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id, locale, router]);

    const handleSave = async (data: any) => {
        setIsSaving(true);
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("No admin user found");

            const docRef = doc(db, "granthalaya_app", "inventory", "books", id as string);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp(),
            });

            // Log the action (General update)
            await logAdminAction({
                action: "UPDATE",
                collectionName: "books_inventory",
                documentId: id as string,
                details: `Updated book details for: ${data.title}`
            });

            router.push(`/${locale}/admin/books`);
        } catch (error) {
            console.error("Error updating book:", error);
            alert("Failed to update book. Please check console.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                <p className="text-slate-500 animate-pulse font-medium">Fetching book details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center max-w-md mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">Access Error</h2>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{error}</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all"
                    >
                        Retry
                    </button>
                    <Link
                        href={`/${locale}/admin/books`}
                        className="px-6 py-2 rounded-xl border border-slate-700 text-slate-400 font-bold hover:bg-slate-800 transition-all"
                    >
                        Go Back
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-3">
                    <Link
                        href={`/${locale}/admin/books`}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors w-fit"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Inventory
                    </Link>
                    <div className="flex items-end gap-3">
                        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground underline decoration-orange-500/30 underline-offset-8">
                            Edit Book
                        </h1>
                        <span className="text-sm font-mono text-slate-500 mb-1 opacity-50">#{id?.toString().slice(-6)}</span>
                    </div>
                </div>

                <button
                    onClick={() => setShowAdjustment(true)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-sm active:scale-95 border ${isDark
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-orange-500 hover:text-white hover:border-orange-500'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 shadow-orange-500/5'
                        }`}
                >
                    <Package className="w-5 h-5" />
                    Adjust Stock
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                <div className="xl:col-span-2">
                    <BookForm
                        initialData={book}
                        onSave={handleSave}
                        onCancel={() => router.push(`/${locale}/admin/books`)}
                        isSaving={isSaving}
                    />
                </div>

                <div className="space-y-8">
                    <div className="sticky top-24">
                        <BookStockHistory bookId={id as string} />
                    </div>
                </div>
            </div>

            <StockAdjustmentModal
                isOpen={showAdjustment}
                onClose={() => setShowAdjustment(false)}
                bookId={id as string}
                bookTitle={book.title}
                currentStock={book.stockQuantity}
                onSuccess={(newStock) => {
                    setBook({ ...book, stockQuantity: newStock });
                }}
            />
        </div>
    );
}

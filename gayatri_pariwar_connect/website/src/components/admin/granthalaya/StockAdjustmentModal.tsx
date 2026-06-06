"use client";

import { useState } from "react";
import { X, Save, Loader2, Minus, Plus, AlertTriangle } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { doc, runTransaction, serverTimestamp, collection } from "firebase/firestore";
import { useToast } from "@/components/ui/Toast";
import { useAdminTheme } from "@/hooks/useAdminTheme";
import { logAdminAction } from "@/lib/admin-logger";

interface StockAdjustmentModalProps {
    bookId: string;
    bookTitle: string;
    currentStock: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newStock: number) => void;
}

const REASONS = [
    "Restock / New Arrival",
    "Sale / Adjustment",
    "Damage / Loss",
    "Return to Publisher",
    "Inventory Correction",
    "Promotion / Sample"
];

export default function StockAdjustmentModal({ bookId, bookTitle, currentStock, isOpen, onClose, onSuccess }: StockAdjustmentModalProps) {
    const [adjustment, setAdjustment] = useState(0);
    const [reason, setReason] = useState(REASONS[0]);
    const [isSaving, setIsSaving] = useState(false);
    const { isDark } = useAdminTheme();
    const { showToast } = useToast();



    if (!isOpen) return null;

    const handleAdjust = async (e: React.FormEvent) => {
        e.preventDefault();
        if (adjustment === 0) {
            showToast("Adjustment cannot be zero", "error");
            return;
        }

        const newStock = currentStock + adjustment;
        if (newStock < 0) {
            showToast("Cannot reduce stock below zero", "error");
            return;
        }

        setIsSaving(true);
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("No admin user found");

            const bookRef = doc(db, "granthalaya_app", "inventory", "books", bookId);
            const logRef = doc(collection(db, "granthalaya_app", "inventory_logs", "items"));

            await runTransaction(db, async (transaction) => {
                const bookSnap = await transaction.get(bookRef);
                if (!bookSnap.exists()) throw new Error("Book not found");

                const actualCurrentStock = bookSnap.data().stockQuantity || 0;
                const finalStock = actualCurrentStock + adjustment;

                if (finalStock < 0) throw new Error("Insufficient stock during transaction");

                // Update Book Stock
                transaction.update(bookRef, {
                    stockQuantity: finalStock,
                    updatedAt: serverTimestamp()
                });

                // Write Log Entry
                transaction.set(logRef, {
                    id: logRef.id,
                    bookId,
                    bookTitle,
                    changeAmount: adjustment,
                    newStockLevel: finalStock,
                    reason,
                    userId: user.uid,
                    timestamp: serverTimestamp(),
                    platform: "website"
                });

                return finalStock;
            });

            // Log globally to Admin Logs
            await logAdminAction({
                action: "UPDATE",
                collectionName: "books_inventory",
                documentId: bookId,
                details: `Stock adjustment for "${bookTitle}": ${adjustment > 0 ? '+' : ''}${adjustment} units (New Total: ${newStock})`,
                newData: { stockQuantity: newStock, reason }
            });

            showToast("Stock adjusted successfully", "success");
            onSuccess(newStock);
            onClose();
        } catch (error: any) {
            // Enhanced logging to capture full error details in console
            console.group("Stock Adjustment Error Details");
            console.error("Error Code:", error.code);
            console.error("Error Message:", error.message);
            console.error("Full Error Object:", JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))));
            console.info("Attempted Path 1 (Update):", `granthalaya_app/inventory/books/${bookId}`);
            console.info("Attempted Path 2 (Set):", `granthalaya_app/inventory_logs/items/[newId]`);
            console.groupEnd();

            let errorMessage = "Failed to adjust stock.";
            if (error.code === 'permission-denied') {
                errorMessage = "Permission Denied: Your Firestore rules may not allow writing to 'granthalaya_app' subcollections. Check both 'inventory' and 'inventory_logs' paths.";
            } else if (error.message) {
                errorMessage = error.message;
            }

            showToast(errorMessage, "error");
        } finally {
            setIsSaving(false);
        }
    };

    const inputClasses = `w-full rounded-xl py-3 px-4 outline-none transition-all focus:ring-2 focus:ring-orange-500/50 ${isDark
        ? 'bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500'
        : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500'
        }`;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300 ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
                <div className="p-6 md:p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold font-display tracking-tight underline underline-offset-8 decoration-orange-500/30">
                            Adjust Stock
                        </h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Current Stock</p>
                        <p className="text-2xl font-black">{currentStock} units</p>
                    </div>

                    <form onSubmit={handleAdjust} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Adjustment Amount</label>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setAdjustment(prev => prev - 1)}
                                    className={`p-3 rounded-xl border flex items-center justify-center transition-all ${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <input
                                    type="number"
                                    value={adjustment}
                                    onChange={(e) => setAdjustment(Number(e.target.value))}
                                    className={`${inputClasses} text-center text-xl font-bold`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setAdjustment(prev => prev + 1)}
                                    className={`p-3 rounded-xl border flex items-center justify-center transition-all ${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <p className={`text-center font-bold text-sm ${adjustment > 0 ? 'text-emerald-500' : adjustment < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                                {adjustment > 0 ? `+${adjustment} units` : adjustment < 0 ? `${adjustment} units` : 'No change'}
                                {adjustment !== 0 && (
                                    <span className="text-slate-400 font-medium ml-2">→ New Stock: {currentStock + adjustment}</span>
                                )}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Reason for Change</label>
                            <select
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className={inputClasses}
                            >
                                {REASONS.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                                <option value="Other">Other (Please specify in details)</option>
                            </select>
                        </div>

                        {currentStock + adjustment < 5 && (
                            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600">
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                <p className="text-[10px] leading-relaxed font-bold uppercase tracking-tight">Warning: This will result in low stock status.</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSaving || adjustment === 0}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-orange-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            Confirm Adjustment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

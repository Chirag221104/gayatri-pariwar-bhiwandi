"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, writeBatch, serverTimestamp, getDoc, setDoc } from "firebase/firestore";
import { generateProductCode, PRODUCT_TYPES } from "@/lib/product-utils";
import { Play, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ProductMigrationTool() {
    const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");
    const [count, setCount] = useState(0);

    const runMigration = async () => {
        // Idempotency Check
        const lockRef = doc(db, "system_metadata", "granthalaya_migration_v1");
        const lockSnap = await getDoc(lockRef);

        if (lockSnap.exists() && lockSnap.data().completed) {
            setStatus('error');
            setMessage("Migration has already been completed successfully. No action taken.");
            return;
        }

        setStatus('running');
        setMessage("Fetching existing books...");

        try {
            const booksRef = collection(db, "granthalaya_app", "inventory", "books");
            const snapshot = await getDocs(booksRef);

            const batch = writeBatch(db);
            let processed = 0;

            snapshot.docs.forEach((bookDoc, index) => {
                const data = bookDoc.data();

                // If productCode doesn't exist, we assign one
                if (!data.productCode) {
                    const productCode = generateProductCode(PRODUCT_TYPES.BOOK, data.title, index + 101);

                    batch.update(bookDoc.ref, {
                        type: PRODUCT_TYPES.BOOK,
                        productCode: productCode,
                        updatedAt: serverTimestamp(),
                        // Add audit fields if missing
                        createdAt: data.createdAt || serverTimestamp(),
                        createdBy: data.createdBy || "system_migration"
                    });
                    processed++;
                }
            });

            if (processed > 0) {
                setMessage(`Applying changes to ${processed} books...`);
                await batch.commit();
            }

            // Lock the migration
            await setDoc(lockRef, {
                completed: true,
                completedAt: serverTimestamp(),
                processedCount: processed
            });

            setCount(processed);
            setStatus('success');
            setMessage(`Migration successful! ${processed} books expanded to universal product model.`);
        } catch (error: any) {
            console.error("Migration error:", error);
            setStatus('error');
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="p-8 rounded-[2rem] border bg-slate-900 border-slate-800 text-white space-y-6">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-orange-500/20 text-orange-500">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Data Migration: Books → Products</h3>
                    <p className="text-sm text-slate-400">Backfills existing books with immutable GG-codes and audit fields.</p>
                </div>
            </div>

            {status === 'idle' && (
                <button
                    onClick={runMigration}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20"
                >
                    <Play className="w-4 h-4" />
                    Start Migration
                </button>
            )}

            {status === 'running' && (
                <div className="flex items-center gap-3 text-orange-500 font-bold">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {message}
                </div>
            )}

            {status === 'success' && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5" />
                    <div>
                        <p className="font-bold">{message}</p>
                        <p className="text-xs opacity-70 mt-1">All inventory items are now ready for universal labeling.</p>
                    </div>
                </div>
            )}

            {status === 'error' && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5" />
                    <div>
                        <p className="font-bold">Migration Blocked</p>
                        <p className="text-xs opacity-70 mt-1">{message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

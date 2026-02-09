"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, X, Download, FileCheck } from "lucide-react";
import Papa from "papaparse";
import { db } from "@/lib/firebase";
import { collection, doc, writeBatch, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/components/ui/Toast";
import { logAdminAction } from "@/lib/admin-logger";

import { useAdminTheme } from "@/hooks/useAdminTheme";

interface BulkImportProps {
    onComplete?: () => void;
}

interface ImportResult {
    success: number;
    failures: number;
    errors: string[];
}

export default function BulkImport({ onComplete }: BulkImportProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<ImportResult | null>(null);
    const { isDark } = useAdminTheme();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const downloadTemplate = () => {
        const headers = ["Title", "Author", "Description", "Price", "Stock", "Category", "CoverUrl", "ISBN"];
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "granthalaya_import_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const processImport = async () => {
        if (!file) return;

        setIsProcessing(true);
        setResult(null);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const data = results.data as any[];
                let successCount = 0;
                let failureCount = 0;
                const errors: string[] = [];

                if (data.length === 0) {
                    setResult({ success: 0, failures: 1, errors: ["Empty CSV file"] });
                    setIsProcessing(false);
                    return;
                }

                try {
                    let batch = writeBatch(db);
                    const booksCollection = collection(db, "granthalaya_app", "inventory", "books");

                    for (let i = 0; i < data.length; i++) {
                        const row = data[i];
                        const title = row.Title?.trim();
                        const author = row.Author?.trim();

                        if (!title || !author) {
                            failureCount++;
                            errors.push(`Row ${i + 2}: Missing Title or Author`);
                            continue;
                        }

                        const price = parseFloat(row.Price) || 0;
                        const stock = parseInt(row.Stock) || 0;
                        const isbn = row.ISBN?.trim() || "";

                        const bookRef = doc(booksCollection);
                        const bookData = {
                            title,
                            author,
                            description: row.Description?.trim() || "",
                            price,
                            stockQuantity: stock,
                            category: row.Category?.trim() || "General",
                            coverUrl: row.CoverUrl?.trim() || null,
                            isbn,
                            isActive: true,
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp(),
                        };

                        batch.set(bookRef, bookData);
                        successCount++;

                        if (successCount % 450 === 0) {
                            await batch.commit();
                            batch = writeBatch(db);
                        }
                    }

                    if (successCount > 0) {
                        try {
                            await batch.commit();
                        } catch (e) {
                            // If commit fails (e.g. batch empty), ignore
                        }

                        await logAdminAction({
                            action: "CREATE",
                            collectionName: "books",
                            documentId: "bulk-import",
                            details: `Bulk imported ${successCount} books from ${file.name}`
                        });
                    }

                    setResult({ success: successCount, failures: failureCount, errors });
                    showToast(`Imported ${successCount} books successfully`, "success");
                    if (onComplete) onComplete();

                } catch (error: any) {
                    console.error("Import Error:", error);
                    setResult({ success: successCount, failures: failureCount + 1, errors: [...errors, `Critical Error: ${error.message}`] });
                    showToast("Failed to process bulk import", "error");
                } finally {
                    setIsProcessing(false);
                }
            },
            error: (error) => {
                setIsProcessing(false);
                setResult({ success: 0, failures: 1, errors: [`Parsing Error: ${error.message}`] });
            }
        });
    };

    return (
        <div className="space-y-8">
            <label
                className={`flex flex-col items-center justify-center gap-4 p-12 rounded-[2.5rem] border-2 border-dashed transition-all cursor-pointer group ${isDark
                    ? 'bg-slate-800/20 border-slate-700 hover:border-orange-500'
                    : 'bg-slate-50 border-slate-200 hover:border-orange-500 hover:bg-orange-50/30'
                    }`}
            >
                <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-orange-500 text-white shadow-orange-500/20'
                    }`}>
                    {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                </div>

                <div className="text-center">
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Select CSV File</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Upload your book inventory list to import in bulk</p>
                </div>

                {file && (
                    <div className={`mt-2 px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2 ${isDark ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-600'
                        }`}>
                        <FileCheck className="w-3 h-3" />
                        {file.name}
                        <button
                            onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                            className="ml-2 hover:opacity-70"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                )}
            </label>

            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-orange-500 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Download Template
                </button>

                <button
                    disabled={!file || isProcessing}
                    onClick={processImport}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:shadow-none"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            Start Import
                        </>
                    )}
                </button>
            </div>

            {result && (
                <div className={`p-6 rounded-3xl border ${result.failures === 0 ? "bg-emerald-500/5 border-emerald-500/20" : "bg-amber-500/5 border-amber-500/20"}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold flex items-center gap-2">
                            {result.failures === 0 ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-amber-500" />
                            )}
                            Import Summary
                        </h3>
                        <div className="flex gap-4">
                            <span className="text-sm font-bold text-emerald-600 font-display">{result.success} Success</span>
                            <span className="text-sm font-bold text-red-600 font-display">{result.failures} Failures</span>
                        </div>
                    </div>

                    {result.errors.length > 0 && (
                        <div className="mt-4 max-h-40 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                            {result.errors.map((err, i) => (
                                <p key={i} className="text-xs text-red-500 flex items-start gap-2 bg-red-500/5 p-2 rounded-lg">
                                    <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                                    {err}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
}

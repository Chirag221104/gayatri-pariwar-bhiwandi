"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2, X, Info, Settings2, FileText, Images, FileCheck } from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { collection, doc, updateDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useToast } from "@/components/ui/Toast";
import { logAdminAction } from "@/lib/admin-logger";
import { useAdminTheme } from "@/hooks/useAdminTheme";

interface ImageSyncProps {
    onComplete?: () => void;
}

interface SyncSummary {
    success: number;
    skipped: number;
    conflicts: number;
    unmatched: number;
    details: string[];
}

export default function ImageSync({ onComplete }: ImageSyncProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [summary, setSummary] = useState<SyncSummary | null>(null);
    const [overwrite, setOverwrite] = useState(false);
    const { isDark } = useAdminTheme();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
            setSummary(null);
        }
    };

    const normalize = (input: string) => {
        return input.toLowerCase().replace(/[\s\-_]/g, '');
    };

    const findMatches = async (normalizedSearch: string, allBooks: any[]) => {
        // Priority 1: ISBN Match
        const isbnMatches = allBooks.filter(book => {
            const isbn = normalize(book.isbn || "");
            return isbn === normalizedSearch && isbn.length > 0;
        });

        if (isbnMatches.length > 0) return isbnMatches;

        // Priority 2: Title Match
        return allBooks.filter(book => {
            const title = normalize(book.title || "");
            return title === normalizedSearch;
        });
    };

    const processSync = async () => {
        if (files.length === 0) return;

        setIsProcessing(true);
        setSummary(null);

        let success = 0;
        let skipped = 0;
        let conflicts = 0;
        let unmatched = 0;
        const details: string[] = [];

        try {
            // 1. Fetch all books for matching (efficient for < 500 books)
            const snapshot = await getDocs(collection(db, "granthalaya_app", "inventory", "books"));
            const allBooks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            for (const file of files) {
                try {
                    const rawFileName = file.name.split('.').slice(0, -1).join('.');
                    const normalized = normalize(rawFileName);

                    const matches = await findMatches(normalized, allBooks);

                    if (matches.length === 0) {
                        unmatched++;
                        details.push(`Unmatched: "${file.name}"`);
                        continue;
                    }

                    if (matches.length > 1) {
                        conflicts++;
                        details.push(`Conflict: "${file.name}" matches ${matches.length} books`);
                        continue;
                    }

                    const book = matches[0];
                    const hasExistingCover = book.coverUrl && book.coverUrl.length > 0;

                    if (hasExistingCover && !overwrite) {
                        skipped++;
                        details.push(`Skipped: "${book.title}" already has a cover`);
                        continue;
                    }

                    // 2. Upload to Storage
                    const ext = file.name.split('.').pop();
                    const storageRef = ref(storage, `granthalaya/covers/${book.id}.${ext}`);

                    await uploadBytes(storageRef, file);
                    const downloadUrl = await getDownloadURL(storageRef);

                    // 3. Link to Firestore
                    await updateDoc(doc(db, "granthalaya_app", "inventory", "books", book.id), {
                        coverUrl: downloadUrl,
                        updatedAt: serverTimestamp(),
                    });

                    success++;
                } catch (err: any) {
                    unmatched++;
                    details.push(`Error "${file.name}": ${err.message}`);
                }
            }

            if (success > 0) {
                await logAdminAction({
                    action: "UPDATE",
                    collectionName: "inventory/books",
                    documentId: "bulk-image-sync",
                    details: `Bulk synced ${success} images for books`
                });
            }

            setSummary({ success, skipped, conflicts, unmatched, details });
            showToast(`Synced ${success} images successfully`, "success");
            if (onComplete) onComplete();

        } catch (error: any) {
            console.error("Sync Error:", error);
            showToast("Critical Sync Error", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8">
            <label
                className={`flex flex-col items-center justify-center gap-4 p-12 rounded-[2.5rem] border-2 border-dashed transition-all cursor-pointer group ${isDark
                    ? 'bg-slate-800/20 border-slate-700 hover:border-blue-500'
                    : 'bg-slate-50 border-slate-200 hover:border-blue-500 hover:bg-blue-50/30'
                    }`}
            >
                <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-blue-600 text-white shadow-blue-600/20'
                    }`}>
                    {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Images className="w-8 h-8" />}
                </div>

                <div className="text-center">
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Select Cover Images</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Name files after ISBN or Title to link automatically</p>
                </div>

                {files.length > 0 && (
                    <div className={`mt-2 px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2 ${isDark ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'
                        }`}>
                        <FileCheck className="w-3 h-3" />
                        {files.length} images selected
                        <button
                            onClick={(e) => { e.stopPropagation(); setFiles([]); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                            className="ml-2 hover:opacity-70"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                )}
            </label>

            <div className={`p-6 rounded-3xl border transition-all ${overwrite
                ? 'bg-amber-500/10 border-amber-500/20 shadow-lg shadow-amber-500/5'
                : isDark
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${overwrite ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-400'}`}>
                            <Settings2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Overwrite Protection</p>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">Replace existing book covers if matched</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setOverwrite(!overwrite)}
                        className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none p-1 ${overwrite ? 'bg-amber-500' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${overwrite ? 'translate-x-7' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-end">
                <button
                    disabled={files.length === 0 || isProcessing}
                    onClick={processSync}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Syncing...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            Match & Sync Photos
                        </>
                    )}
                </button>
            </div>

            {summary && (
                <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'} space-y-6`}>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-1">
                            <p className="text-3xl font-black text-emerald-600 font-display">{summary.success}</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Synced</p>
                        </div>
                        <div className="space-y-1 text-right lg:text-left">
                            <p className={`text-3xl font-black font-display ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{summary.skipped}</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Skipped</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-black text-amber-600 font-display">{summary.conflicts}</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Conflicts</p>
                        </div>
                        <div className="space-y-1 text-right lg:text-left">
                            <p className={`text-3xl font-black font-display ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>{summary.unmatched}</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Unmatched</p>
                        </div>
                    </div>

                    {summary.details.length > 0 && (
                        <div className="border-t border-emerald-500/10 pt-6">
                            <div className="flex items-center gap-2 mb-4 text-slate-500 font-black text-xs uppercase tracking-widest">
                                <FileText className="w-4 h-4 text-emerald-500" />
                                Sync Logs
                            </div>
                            <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {summary.details.map((detail, i) => (
                                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${detail.startsWith('Unmatched') ? 'bg-slate-500/5 border-slate-500/10 text-slate-500' :
                                        detail.startsWith('Conflict') ? 'bg-amber-500/5 border-amber-500/10 text-amber-600' :
                                            detail.startsWith('Skipped') ? 'bg-slate-500/5 border-slate-500/10 text-slate-400' :
                                                'bg-emerald-500/5 border-emerald-500/10 text-emerald-600'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${detail.startsWith('Unmatched') ? 'bg-slate-300' :
                                            detail.startsWith('Conflict') ? 'bg-amber-500' :
                                                detail.startsWith('Skipped') ? 'bg-slate-400' : 'bg-emerald-500'
                                            }`} />
                                        <span className="text-xs font-bold leading-none">{detail}</span>
                                    </div>
                                ))}
                            </div>
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

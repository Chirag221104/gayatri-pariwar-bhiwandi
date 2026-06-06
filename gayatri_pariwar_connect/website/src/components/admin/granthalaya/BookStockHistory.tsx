"use client";

import { useState, useEffect } from "react";
import { History, ArrowUpRight, ArrowDownRight, User, Clock, AlertCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useAdminTheme } from "@/hooks/useAdminTheme";
import { useToast } from "@/components/ui/Toast";

interface StockLog {
    id: string;
    changeAmount: number;
    newStockLevel: number;
    reason: string;
    userId: string;
    timestamp: any;
    platform?: string;
}

interface BookStockHistoryProps {
    bookId: string;
}

export default function BookStockHistory({ bookId }: BookStockHistoryProps) {
    const [logs, setLogs] = useState<StockLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isDark } = useAdminTheme();

    const { showToast } = useToast();

    useEffect(() => {
        const q = query(
            collection(db, "granthalaya_app", "inventory_logs", "items"),
            where("bookId", "==", bookId),
            orderBy("timestamp", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const logsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as StockLog[];
            setLogs(logsData);
            setLoading(false);
        }, (err: any) => {
            console.error("Error fetching logs:", err);
            setError(err.message || "Failed to fetch logs");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [bookId]);

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-20 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className={`p-6 rounded-3xl border border-red-500/20 bg-red-500/5 text-center flex flex-col items-center gap-2`}>
                <AlertCircle className="w-8 h-8 text-red-500" />
                <p className="text-xs font-bold text-red-500">Query Failed</p>
                <p className={`text-[10px] leading-relaxed ${isDark ? 'text-red-400/70' : 'text-red-600/70'}`}>
                    {error.includes("index")
                        ? "This query requires a Firestore Index. Check your browser console for the setup link."
                        : error}
                </p>
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className={`p-8 rounded-3xl border border-dashed text-center flex flex-col items-center gap-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <History className="w-10 h-10 text-slate-300" />
                <div className="space-y-1">
                    <p className="font-bold text-slate-400">No History Found</p>
                    <p className="text-xs text-slate-400">Adjustments will appear here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500 mb-6 flex items-center gap-2">
                <History className="w-4 h-4" />
                Inventory Timeline
            </h3>

            <div className="space-y-3">
                {logs.map(log => (
                    <div
                        key={log.id}
                        className={`group relative p-4 rounded-2xl border transition-all ${isDark ? 'bg-slate-900/50 border-slate-800/50 hover:bg-slate-800 hover:border-slate-700' : 'bg-white border-slate-100 hover:bg-slate-50 hover:shadow-sm'}`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${log.changeAmount > 0
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : 'bg-red-500/10 text-red-500'
                                    }`}>
                                    {log.changeAmount > 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-black ${log.changeAmount > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount} units
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase py-0.5 px-1.5 rounded-md bg-slate-100 dark:bg-slate-800">
                                            Result: {log.newStockLevel}
                                        </span>
                                    </div>
                                    <p className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{log.reason}</p>
                                </div>
                            </div>

                            <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                    <Clock className="w-3 h-3" />
                                    {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : 'Just now'}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                    <User className="w-3 h-3" />
                                    {log.userId.slice(-6)}
                                    {log.platform === 'website' && <span className="ml-1 text-orange-500/50 border border-orange-500/20 px-1 rounded">Web</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
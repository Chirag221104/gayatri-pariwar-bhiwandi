"use client";

import { useState, useEffect } from "react";
import {
    History,
    Search,
    Filter,
    Calendar,
    User,
    Database,
    Eye,
    X,
    BookOpen,
    Package,
    Truck
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, limit, where } from "firebase/firestore";
import AdminTable from "@/components/admin/AdminTable";
import { useAdminTheme } from "@/hooks/useAdminTheme";

interface AdminLog {
    id: string;
    adminEmail: string;
    adminUid: string;
    action: "CREATE" | "UPDATE" | "DELETE";
    collection: string;
    documentId: string;
    details: string;
    timestamp: any;
    previousData?: any;
    newData?: any;
    platform: string;
    domain?: 'granthalaya' | 'app';
}

// Collections that belong to Granthalaya domain
const GRANTHALAYA_COLLECTIONS = [
    'granthalaya_app',
    'books',
    'books_inventory',
    'inventory',
    'inventory_logs',
    'orders',
    'sections',
    'tags',
    'categories',
    'digital_library'
];

export default function GranthalayaLogsPage() {
    const [logs, setLogs] = useState<AdminLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionFilter, setActionFilter] = useState("all");
    const [collectionFilter, setCollectionFilter] = useState("all");
    const [selectedLog, setSelectedLog] = useState<AdminLog | null>(null);
    const { isDark } = useAdminTheme();

    useEffect(() => {
        const q = query(
            collection(db, "admin_logs"),
            orderBy("timestamp", "desc"),
            limit(200)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const allData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as AdminLog[];

            // Filter to Granthalaya-related logs only
            const filtered = allData.filter(log => {
                // Check domain field first (future-proofing)
                if (log.domain === 'granthalaya') return true;
                if (log.domain === 'app') return false;

                // Fallback to collection name matching
                return GRANTHALAYA_COLLECTIONS.some(c =>
                    log.collection?.toLowerCase().includes(c.toLowerCase())
                );
            });

            setLogs(filtered);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching logs:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.adminEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAction = actionFilter === "all" || log.action === actionFilter;
        const matchesCollection = collectionFilter === "all" || log.collection === collectionFilter;
        return matchesSearch && matchesAction && matchesCollection;
    });

    const uniqueCollections = Array.from(new Set(logs.map(l => l.collection))).sort();

    const columns = [
        {
            header: "Admin / Activity",
            accessor: (item: AdminLog) => (
                <div className="flex flex-col gap-1 min-w-[200px]">
                    <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-slate-500" />
                        <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item.adminEmail}</span>
                    </div>
                    <span className={`text-[10px] font-medium italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.details}</span>
                </div>
            )
        },
        {
            header: "Action",
            accessor: (item: AdminLog) => (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.action === 'CREATE' ? "bg-emerald-500/10 text-emerald-500" :
                    item.action === 'UPDATE' ? "bg-blue-500/10 text-blue-500" :
                        "bg-red-500/10 text-red-500"
                    }`}>
                    {item.action}
                </span>
            )
        },
        {
            header: "Collection",
            accessor: (item: AdminLog) => (
                <div className="flex items-center gap-2">
                    <Database className="w-3 h-3 text-slate-500" />
                    <span className={`text-[10px] font-mono capitalize ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.collection?.replace(/_/g, ' ')}</span>
                </div>
            )
        },
        {
            header: "Time",
            accessor: (item: AdminLog) => (
                <div className={`flex items-center gap-2 text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <Calendar className="w-3 h-3" />
                    <span className="font-mono">
                        {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleString() : 'Recent'}
                    </span>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className={`text-3xl font-bold flex items-center gap-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <History className="w-8 h-8 text-blue-500" />
                        Granthalaya Logs
                    </h1>
                    <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Operational audit trail for books, inventory & orders</p>

                    {/* Scope Badge */}
                    <div className="flex items-center gap-2 mt-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Showing:</span>
                        <div className="flex items-center gap-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold">
                                <BookOpen className="w-3 h-3" /> Books
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold">
                                <Package className="w-3 h-3" /> Inventory
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold">
                                <Truck className="w-3 h-3" /> Orders
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search admin or activity..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 w-64 transition-all ${isDark
                                    ? 'bg-slate-900 border-slate-800 text-white'
                                    : 'bg-white border-slate-200 text-slate-900'
                                }`}
                        />
                    </div>

                    <div className={`flex items-center gap-2 border rounded-xl px-3 py-1.5 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                        }`}>
                        <Filter className="w-4 h-4 text-slate-500" />
                        <select
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value)}
                            className={`bg-transparent border-none text-xs focus:ring-0 outline-none cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-600'
                                }`}
                        >
                            <option value="all">All Actions</option>
                            <option value="CREATE">Create</option>
                            <option value="UPDATE">Update</option>
                            <option value="DELETE">Delete</option>
                        </select>
                    </div>

                    <div className={`flex items-center gap-2 border rounded-xl px-3 py-1.5 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                        }`}>
                        <Database className="w-4 h-4 text-slate-500" />
                        <select
                            value={collectionFilter}
                            onChange={(e) => setCollectionFilter(e.target.value)}
                            className={`bg-transparent border-none text-xs focus:ring-0 outline-none cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-600'
                                }`}
                        >
                            <option value="all">All Collections</option>
                            {uniqueCollections.map(c => (
                                <option key={c} value={c}>{c?.replace(/_/g, ' ')}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className={`flex-1 min-h-0 border rounded-2xl overflow-hidden relative ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                <AdminTable
                    columns={columns}
                    data={filteredLogs}
                    loading={loading}
                    onRowClick={(log) => setSelectedLog(log)}
                    emptyMessage="No Granthalaya logs found. Operations are quiet."
                />

                {/* Log Detail Modal */}
                {selectedLog && (
                    <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 lg:p-12 animate-in fade-in duration-200">
                        <div className={`border rounded-3xl w-full max-w-4xl max-h-full flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 ${isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
                            }`}>
                            {/* Modal Header */}
                            <div className={`p-6 border-b flex items-center justify-between shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${selectedLog.action === 'CREATE' ? "bg-emerald-500/10 text-emerald-500" :
                                        selectedLog.action === 'UPDATE' ? "bg-blue-500/10 text-blue-500" :
                                            "bg-red-500/10 text-red-500"
                                        }`}>
                                        <Eye className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Log Details</h3>
                                        <p className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{selectedLog.id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedLog(null)}
                                    className={`p-2 rounded-full transition-all ${isDark ? 'text-slate-500 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                                        }`}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <div className="space-y-1">
                                        <label className={`text-[10px] font-bold uppercase tracking-widest px-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Performed By</label>
                                        <div className={`p-3 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-200'
                                            }`}>
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">
                                                {selectedLog.adminEmail[0].toUpperCase()}
                                            </div>
                                            <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{selectedLog.adminEmail}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className={`text-[10px] font-bold uppercase tracking-widest px-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Context</label>
                                        <div className={`p-3 rounded-xl border flex items-center gap-3 ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-200'
                                            }`}>
                                            <Database className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm font-mono text-blue-400 capitalize">{selectedLog.collection}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className={`text-[10px] font-bold uppercase tracking-widest px-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Document ID</label>
                                        <div className={`p-3 rounded-xl border font-mono text-xs truncate ${isDark ? 'bg-slate-900/50 border-white/5 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                                            }`}>
                                            {selectedLog.documentId}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className={`text-sm font-bold flex items-center gap-2 border-b pb-2 ${isDark ? 'text-slate-400 border-slate-800' : 'text-slate-500 border-slate-200'
                                        }`}>
                                        <div className="w-1 h-4 bg-blue-500 rounded-full" />
                                        Data Transition
                                    </h4>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-red-500/70 uppercase tracking-widest pl-1">Previous State</label>
                                            <div className={`rounded-2xl p-4 border h-80 overflow-y-auto text-[10px] font-mono leading-relaxed custom-scrollbar ${isDark ? 'bg-slate-950 border-red-500/10' : 'bg-red-50 border-red-200'
                                                }`}>
                                                {selectedLog.previousData ? (
                                                    <pre className="text-red-400/80 whitespace-pre-wrap">{JSON.stringify(selectedLog.previousData, null, 2)}</pre>
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center text-slate-800 opacity-50 italic">
                                                        <History className="w-8 h-8 mb-2" />
                                                        <span>No previous state available</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest pl-1">New State</label>
                                            <div className={`rounded-2xl p-4 border h-80 overflow-y-auto text-[10px] font-mono leading-relaxed custom-scrollbar ${isDark ? 'bg-slate-950 border-emerald-500/10' : 'bg-emerald-50 border-emerald-200'
                                                }`}>
                                                {selectedLog.newData ? (
                                                    <pre className="text-emerald-400/80 whitespace-pre-wrap">{JSON.stringify(selectedLog.newData, null, 2)}</pre>
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center text-slate-800 opacity-50 italic">
                                                        <Eye className="w-8 h-8 mb-2" />
                                                        <span>No new state captured</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

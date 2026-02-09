"use client";

import { useState, useEffect } from "react";
import {
    Users,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Clock,
    X,
    Shield,
    Calendar,
    LayoutGrid,
    Loader2
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";
import AdminTable from "@/components/admin/AdminTable";
import { logAdminAction } from "@/lib/admin-logger";

interface GroupModel {
    id: string;
    name: string;
    description: string;
    type: "event" | "bal_sanskar" | "meeting" | "custom";
    isPublic: boolean;
    status: "pending" | "approved" | "rejected";
    createdBy: string;
    createdAt: any;
    photoUrl?: string;
    creationReason?: string;
    rejectionReason?: string;
}

export default function PublicGroupsPage() {
    const [groups, setGroups] = useState<GroupModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedGroup, setSelectedGroup] = useState<GroupModel | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDark, setIsDark] = useState(false);

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
        const q = query(
            collection(db, "groups"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as GroupModel[];
            setGroups(data.filter(g => g.isPublic));
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleUpdateStatus = async (groupId: string, status: "approved" | "rejected", reason?: string) => {
        setIsProcessing(true);
        try {
            const groupRef = doc(db, "groups", groupId);
            const updateData: any = {
                status,
                updatedAt: serverTimestamp()
            };
            if (reason) updateData.rejectionReason = reason;

            await updateDoc(groupRef, updateData);

            await logAdminAction({
                action: "UPDATE",
                collectionName: "groups",
                documentId: groupId,
                details: `${status === 'approved' ? 'Approved' : 'Rejected'} public group discovery: ${groups.find(g => g.id === groupId)?.name}`,
                newData: updateData
            });

            setSelectedGroup(null);
        } catch (error) {
            console.error("Error updating group status:", error);
            alert("Action failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredGroups = groups.filter(g => {
        const matchesStatus = statusFilter === "all" || g.status === statusFilter;
        const matchesSearch = g.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const columns = [
        {
            header: "Group Info",
            accessor: (item: GroupModel) => (
                <div className="flex items-center gap-3 min-w-[200px]">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center overflow-hidden shrink-0 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                        {item.photoUrl ? (
                            <img src={item.photoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <Users className={`w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className={`font-bold leading-tight ${isDark ? 'text-white' : 'text-black'}`}>{item.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {item.id.slice(0, 8)}...</span>
                    </div>
                </div>
            )
        },
        {
            header: "Category",
            accessor: (item: GroupModel) => (
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider capitalize ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                        {item.type.replace(/_/g, ' ')}
                    </span>
                </div>
            )
        },
        {
            header: "Created",
            accessor: (item: GroupModel) => (
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>{item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'Recent'}</span>
                </div>
            )
        },
        {
            header: "Visibility Status",
            accessor: (item: GroupModel) => (
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit ${item.status === 'approved'
                    ? isDark ? "bg-emerald-500/10 text-emerald-500" : "bg-emerald-50 text-emerald-600"
                    : item.status === 'pending'
                        ? isDark ? "bg-orange-500/10 text-orange-500" : "bg-orange-50 text-orange-600"
                        : isDark ? "bg-red-500/10 text-red-500" : "bg-red-50 text-red-600"
                    }`}>
                    {item.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> :
                        item.status === 'pending' ? <Clock className="w-3 h-3" /> :
                            <XCircle className="w-3 h-3" />}
                    {item.status}
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col h-full bg-transparent space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className={`text-3xl font-bold flex items-center gap-4 ${isDark ? 'text-white' : 'text-black'}`}>
                        <Shield className="w-8 h-8 text-orange-500" />
                        Public Group Moderation
                    </h1>
                    <p className="text-slate-500 mt-2">Approve or reject community group discovery requests</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-orange-500' : 'text-slate-400 group-focus-within:text-orange-500'}`} />
                        <input
                            type="text"
                            placeholder="Search groups..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 w-64 transition-all placeholder:text-slate-400 shadow-sm ${isDark
                                ? 'bg-slate-900 border border-slate-800 text-white'
                                : 'bg-white border border-slate-200 text-black'
                                }`}
                        />
                    </div>

                    <div className={`flex items-center gap-2 rounded-xl px-3 py-1.5 shadow-sm ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                        <Filter className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={`bg-transparent border-none text-xs focus:ring-0 outline-none cursor-pointer font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
                        >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="all">All Groups</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={`flex-1 min-h-0 rounded-2xl overflow-hidden relative shadow-sm ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                <AdminTable
                    columns={columns}
                    data={filteredGroups}
                    loading={loading}
                    onRowClick={(item) => setSelectedGroup(item)}
                    emptyMessage="No public groups awaiting moderation."
                />

                {/* Group Details Modal */}
                {selectedGroup && (
                    <div className={`absolute inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200 ${isDark ? 'bg-slate-950/80' : 'bg-slate-900/20'}`}>
                        <div className={`border rounded-3xl w-full max-w-2xl max-h-full flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 ${isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                            {/* Modal Header */}
                            <div className={`p-6 border-b flex items-center justify-between shrink-0 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center overflow-hidden shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                        {selectedGroup.photoUrl ? (
                                            <img src={selectedGroup.photoUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <Users className={`w-6 h-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{selectedGroup.name}</h3>
                                        <p className="text-xs text-slate-500 capitalize">{selectedGroup.type.replace(/_/g, ' ')} Group</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedGroup(null)}
                                    className={`p-2 rounded-full transition-all ${isDark ? 'text-slate-500 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                                <div className="space-y-4">
                                    <h4 className={`text-[10px] font-bold uppercase tracking-widest px-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>About this Group</h4>
                                    <p className={`text-sm leading-relaxed p-4 rounded-2xl border ${isDark ? 'text-slate-300 bg-slate-900/50 border-white/5' : 'text-slate-600 bg-slate-50 border-slate-100'}`}>
                                        {selectedGroup.description || "No description provided."}
                                    </p>
                                </div>

                                {selectedGroup.creationReason && (
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest px-1">Reason for Discovery</h4>
                                        <div className={`p-4 rounded-2xl flex gap-3 italic ${isDark ? 'bg-orange-500/5 border border-orange-500/10' : 'bg-orange-50 border border-orange-100'}`}>
                                            <LayoutGrid className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                                            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{selectedGroup.creationReason}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className={`text-[10px] font-bold uppercase tracking-widest px-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Created By</label>
                                        <div className={`p-3 rounded-xl border font-mono text-xs truncate ${isDark ? 'bg-slate-900/50 border-white/5 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                                            {selectedGroup.createdBy}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className={`text-[10px] font-bold uppercase tracking-widest px-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Created On</label>
                                        <div className={`p-3 rounded-xl border text-xs ${isDark ? 'bg-slate-900/50 border-white/5 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                                            {selectedGroup.createdAt?.toDate ? selectedGroup.createdAt.toDate().toLocaleString() : 'Recent'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer - Actions */}
                            <div className={`p-8 border-t shrink-0 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}>
                                {selectedGroup.status === 'pending' ? (
                                    <div className="flex gap-4">
                                        <button
                                            disabled={isProcessing}
                                            onClick={() => {
                                                const reason = prompt("Optional: Provide a reason for rejection");
                                                handleUpdateStatus(selectedGroup.id, "rejected", reason || undefined);
                                            }}
                                            className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all border active:scale-95 ${isDark
                                                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20'
                                                : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
                                                }`}
                                        >
                                            Reject Discovery
                                        </button>
                                        <button
                                            disabled={isProcessing}
                                            onClick={() => handleUpdateStatus(selectedGroup.id, "approved")}
                                            className="flex-[2] py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                            Approve Public Listing
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm ${selectedGroup.status === 'approved'
                                            ? isDark ? "bg-emerald-500/10 text-emerald-500" : "bg-emerald-50 text-emerald-600"
                                            : isDark ? "bg-red-500/10 text-red-500" : "bg-red-50 text-red-600"
                                            }`}>
                                            {selectedGroup.status === 'approved' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                            Moderation Complete: {selectedGroup.status.toUpperCase()}
                                        </div>
                                        <button
                                            onClick={() => setSelectedGroup(null)}
                                            className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            Dismiss View
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

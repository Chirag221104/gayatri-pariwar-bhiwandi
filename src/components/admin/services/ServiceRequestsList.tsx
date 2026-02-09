"use client";

import { useState, useEffect } from "react";
import {
    ClipboardList,
    UserPlus,
    Calendar,
    MapPin,
    Phone,
    MessageSquare,
    CheckCircle2,
    Clock,
    X,
    Loader2,
    ChevronRight,
    Search,
    Filter,
    UserCircle,
    Check,
    AlertCircle
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    getDocs,
    where,
    serverTimestamp
} from "firebase/firestore";
import AdminTable from "@/components/admin/AdminTable";
import { logAdminAction } from "@/lib/admin-logger";
import { useToast } from "@/components/ui/Toast";

interface StatusHistoryEntry {
    status: string;
    updatedBy: string;
    updatedByName: string;
    timestamp: any;
    notes?: string;
}

interface ServiceRequest {
    id: string;
    userId: string;
    userName: string;
    userPhone: string;
    serviceTypeName: string;
    description: string;
    address: string;
    preferredDate: string;
    preferredTime: string;
    status: "pending" | "accepted" | "completed" | "cancelled" | "unavailable";
    assignedGurujiId?: string;
    assignedGurujiName?: string;
    createdAt?: any;
    statusHistory: StatusHistoryEntry[];
}

interface Guruji {
    uid: string;
    name: string;
    email: string;
}

export default function ServiceRequestsList() {
    const { showToast } = useToast();
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [gurujis, setGurujis] = useState<Guruji[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [isAssigning, setIsAssigning] = useState(false);
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
        const q = query(collection(db, "service_requests"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ServiceRequest[];
            setRequests(data);
            setLoading(false);
        });

        const fetchGurujis = async () => {
            const gq = query(collection(db, "users"), where("role", "==", "guruji"));
            const snap = await getDocs(gq);
            const gList = snap.docs.map(doc => ({
                uid: doc.id,
                name: doc.data().name || "Unknown Guruji",
                email: doc.data().email || ""
            }));
            setGurujis(gList);
        };

        fetchGurujis();
        return () => unsubscribe();
    }, []);

    const handleAssignGuruji = async (requestId: string, guruji: Guruji) => {
        setIsAssigning(true);
        try {
            const requestRef = doc(db, "service_requests", requestId);
            const request = requests.find(r => r.id === requestId);

            const newHistory: StatusHistoryEntry = {
                status: "accepted",
                updatedBy: "admin_website",
                updatedByName: "Admin",
                timestamp: new Date(),
                notes: `Assigned to Guruji: ${guruji.name}`
            };

            await updateDoc(requestRef, {
                status: "accepted",
                assignedGurujiId: guruji.uid,
                assignedGurujiName: guruji.name,
                statusHistory: [...(request?.statusHistory || []), newHistory],
                updatedAt: serverTimestamp()
            });

            await logAdminAction({
                action: "UPDATE",
                collectionName: "service_requests",
                documentId: requestId,
                details: `Assigned Guruji ${guruji.name} to request ${request?.serviceTypeName}`,
                newData: { assignedGurujiId: guruji.uid, status: "accepted" }
            });

            setSelectedRequest(null);
        } catch (error) {
            console.error("Assignment failed:", error);
            showToast("Failed to assign Guruji", "error");
        } finally {
            setIsAssigning(false);
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesStatus = statusFilter === "all" || req.status === statusFilter;
        const matchesSearch = req.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.serviceTypeName?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const columns = [
        {
            header: "Request Details",
            accessor: (item: ServiceRequest) => (
                <div className="flex flex-col gap-1 min-w-[200px]">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-orange-500' : 'text-[#B56550]'}`}>{item.serviceTypeName}</span>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{item.userName}</span>
                    <div className={`flex items-center gap-2 text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        <Phone className="w-3 h-3" />
                        <span>{item.userPhone}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Schedule",
            accessor: (item: ServiceRequest) => (
                <div className="flex flex-col gap-1">
                    <div className={`flex items-center gap-2 text-[10px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        <Calendar className="w-3 h-3" />
                        <span>{item.preferredDate}</span>
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        <Clock className="w-3 h-3" />
                        <span>{item.preferredTime}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Assignment",
            accessor: (item: ServiceRequest) => (
                <div className="flex items-center gap-2">
                    {item.assignedGurujiName ? (
                        <div className={`flex items-center gap-2 px-2 py-1 rounded-lg border ${isDark
                            ? 'bg-emerald-500/5 border-emerald-500/10'
                            : 'bg-[#B56550]/5 border-[#B56550]/10'
                            }`}>
                            <UserCircle className={`w-3 h-3 ${isDark ? 'text-emerald-500' : 'text-[#B56550]'}`} />
                            <span className={`text-[10px] font-bold ${isDark ? 'text-emerald-500' : 'text-[#B56550]'}`}>{item.assignedGurujiName}</span>
                        </div>
                    ) : (
                        <div className={`flex items-center gap-2 px-2 py-1 rounded-lg border ${isDark
                            ? 'bg-orange-500/5 border-orange-500/10'
                            : 'bg-slate-50 border-slate-200'
                            }`}>
                            <AlertCircle className={`w-3 h-3 ${isDark ? 'text-orange-500' : 'text-slate-400'}`} />
                            <span className={`text-[10px] font-bold italic ${isDark ? 'text-orange-500' : 'text-slate-500'}`}>Unassigned</span>
                        </div>
                    )}
                </div>
            )
        },
        {
            header: "Status",
            accessor: (item: ServiceRequest) => (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.status === 'pending'
                    ? isDark ? "bg-orange-500/10 text-orange-500" : "bg-orange-50 text-orange-600"
                    : item.status === 'accepted'
                        ? isDark ? "bg-blue-500/10 text-blue-500" : "bg-blue-50 text-blue-600"
                        : item.status === 'completed'
                            ? isDark ? "bg-emerald-500/10 text-emerald-500" : "bg-emerald-50 text-emerald-600"
                            : isDark ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-500"
                    }`}>
                    {item.status}
                </span>
            )
        }
    ];

    return (
        <div className={`flex flex-col h-full relative ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            {/* Toolbar */}
            <div className={`p-6 border-b flex flex-wrap items-center justify-between gap-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-[#B56550]' : 'text-slate-400 group-focus-within:text-[#B56550]'}`} />
                        <input
                            type="text"
                            placeholder="Search user or service..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#B56550]/20 focus:border-[#B56550] w-64 transition-all placeholder:text-slate-400 ${isDark
                                ? 'bg-slate-950 border border-slate-800 text-white'
                                : 'bg-white border border-slate-200 text-black'
                                }`}
                        />
                    </div>
                    <div className={`flex items-center gap-2 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#B56550]/20 transition-all ${isDark
                        ? 'bg-slate-950 border border-slate-800'
                        : 'bg-white border border-slate-200'
                        }`}>
                        <Filter className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={`bg-transparent border-none text-xs focus:ring-0 outline-none cursor-pointer font-medium ${isDark ? 'text-slate-300' : 'text-black'}`}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="flex-1 min-h-0">
                <AdminTable
                    columns={columns}
                    data={filteredRequests}
                    loading={loading}
                    onRowClick={(item) => setSelectedRequest(item)}
                    emptyMessage="No service requests found."
                />
            </div>

            {/* Side Detail Panel / Modal */}
            {selectedRequest && (
                <div className={`absolute inset-0 z-40 backdrop-blur-sm flex justify-end animate-in fade-in duration-300 ${isDark ? 'bg-slate-950/80' : 'bg-slate-900/20'}`}>
                    <div className={`w-full max-w-2xl border-l h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ${isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}>
                        {/* Header */}
                        <div className={`p-8 border-b flex items-center justify-between shrink-0 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-orange-500/10 text-orange-500' : 'bg-[#B56550]/10 text-[#B56550]'}`}>
                                    <ClipboardList className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{selectedRequest.serviceTypeName}</h3>
                                    <p className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Requested by {selectedRequest.userName}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className={`p-2 rounded-full transition-all ${isDark ? 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200'}`}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                            {/* User Info Section */}
                            <section className="space-y-4">
                                <h4 className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-slate-500' : 'text-black'}`}>
                                    <div className="w-1 h-3 bg-[#B56550] rounded-full" />
                                    Requester Details
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-2xl border space-y-1 ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'}`}>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Contact Number</span>
                                        <div className={`flex items-center gap-2 text-sm font-bold ${isDark ? 'text-slate-200' : 'text-black'}`}>
                                            <Phone className="w-3 h-3 text-slate-400" />
                                            {selectedRequest.userPhone}
                                        </div>
                                    </div>
                                    <div className={`p-4 rounded-2xl border space-y-1 ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'}`}>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Preferred Schedule</span>
                                        <div className={`flex items-center gap-2 text-sm font-bold ${isDark ? 'text-slate-200' : 'text-black'}`}>
                                            <Calendar className="w-3 h-3 text-slate-400" />
                                            {selectedRequest.preferredDate} at {selectedRequest.preferredTime}
                                        </div>
                                    </div>
                                    <div className={`p-4 rounded-2xl border col-span-2 space-y-1 ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'}`}>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Service Address</span>
                                        <div className={`flex items-start gap-2 text-sm leading-relaxed font-bold ${isDark ? 'text-slate-200' : 'text-black'}`}>
                                            <MapPin className="w-3 h-3 text-slate-400 mt-1 shrink-0" />
                                            {selectedRequest.address}
                                        </div>
                                    </div>
                                    <div className={`p-4 rounded-2xl border col-span-2 space-y-1 ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'}`}>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Requirement Description</span>
                                        <div className={`flex items-start gap-2 text-sm italic leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            <MessageSquare className="w-3 h-3 text-slate-400 mt-1 shrink-0" />
                                            {selectedRequest.description || "No specific details provided."}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Assignment Section */}
                            <section className="space-y-4">
                                <h4 className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-slate-500' : 'text-black'}`}>
                                    <div className="w-1 h-3 bg-[#B56550] rounded-full" />
                                    Guruji Assignment
                                </h4>

                                {selectedRequest.assignedGurujiName ? (
                                    <div className={`p-6 rounded-2xl flex items-center justify-between group ${isDark
                                        ? 'bg-emerald-500/5 border border-emerald-500/20'
                                        : 'bg-[#B56550]/5 border border-[#B56550]/20'
                                        }`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${isDark
                                                ? 'bg-emerald-500/20 text-emerald-500'
                                                : 'bg-[#B56550]/10 text-[#B56550]'
                                                }`}>
                                                {selectedRequest.assignedGurujiName[0]}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>{selectedRequest.assignedGurujiName}</p>
                                                <p className={`text-xs font-bold italic uppercase tracking-wider ${isDark ? 'text-emerald-500/60' : 'text-[#B56550]'}`}>Assigned and Ready</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedRequest({ ...selectedRequest, assignedGurujiName: undefined, assignedGurujiId: undefined })}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${isDark
                                                ? 'bg-emerald-500/10 text-emerald-500 hover:bg-red-500/10 hover:text-red-500'
                                                : 'bg-[#B56550]/10 text-[#B56550] hover:bg-red-50 hover:text-red-600'
                                                }`}
                                        >
                                            Reassign
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-sm italic ${isDark
                                            ? 'bg-slate-900/50 border-white/5 text-slate-400'
                                            : 'bg-slate-50 border-slate-100 text-slate-500'
                                            }`}>
                                            <AlertCircle className="w-4 h-4 text-orange-500" />
                                            No Guruji assigned yet. Select from available Gurujis below.
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            {gurujis.map((guruji) => (
                                                <button
                                                    key={guruji.uid}
                                                    onClick={() => handleAssignGuruji(selectedRequest.id, guruji)}
                                                    disabled={isAssigning}
                                                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all group active:scale-[0.98] shadow-sm hover:shadow-md ${isDark
                                                        ? 'bg-slate-950 hover:bg-orange-500/10 border-slate-800 hover:border-orange-500/20'
                                                        : 'bg-white hover:bg-[#B56550]/5 border-slate-200 hover:border-[#B56550]/20'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${isDark
                                                            ? 'bg-slate-800 text-slate-500 group-hover:bg-orange-500/20 group-hover:text-orange-500'
                                                            : 'bg-slate-100 text-slate-500 group-hover:bg-[#B56550]/10 group-hover:text-[#B56550]'
                                                            }`}>
                                                            {guruji.name[0]}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className={`text-sm font-bold transition-colors ${isDark
                                                                ? 'text-slate-300 group-hover:text-white'
                                                                : 'text-black group-hover:text-[#B56550]'
                                                                }`}>{guruji.name}</p>
                                                            <p className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>{guruji.email}</p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className={`w-4 h-4 transition-all ${isDark ? 'text-slate-700 group-hover:text-[#B56550]' : 'text-slate-300 group-hover:text-[#B56550]'}`} />
                                                </button>
                                            ))}
                                            {gurujis.length === 0 && (
                                                <div className={`text-center py-8 text-sm font-medium ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>
                                                    No gurujis found in system.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Status History Section */}
                            <section className="space-y-4">
                                <h4 className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-slate-500' : 'text-black'}`}>
                                    <div className={`w-1 h-3 rounded-full ${isDark ? 'bg-slate-500' : 'bg-black'}`} />
                                    Workflow History
                                </h4>
                                <div className={`space-y-3 pl-2 border-l ml-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                                    {(selectedRequest.statusHistory || []).map((entry, idx) => (
                                        <div key={idx} className="relative pl-6 pb-4 group">
                                            <div className={`absolute left-[-9px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${isDark
                                                ? 'bg-slate-900 border-slate-700 group-hover:border-[#B56550]'
                                                : 'bg-white border-slate-200 group-hover:border-[#B56550]'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isDark
                                                    ? 'bg-slate-700 group-hover:bg-[#B56550]'
                                                    : 'bg-slate-400 group-hover:bg-[#B56550]'
                                                    }`} />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest leading-none ${isDark ? 'text-slate-200' : 'text-[#B56550]'}`}>{entry.status}</span>
                                                    <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{entry.timestamp?.toDate ? entry.timestamp.toDate().toLocaleString() : 'Recent'}</span>
                                                </div>
                                                <p className={`text-xs font-bold italic ${isDark ? 'text-slate-400' : 'text-black/70'}`}>By {entry.updatedByName}</p>
                                                {entry.notes && <p className={`text-[10px] mt-1 leading-relaxed font-medium ${isDark ? 'text-slate-500' : 'text-[#B56550]'}`}>{entry.notes}</p>}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="relative pl-6 pb-4">
                                        <div className={`absolute left-[-9px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                                            <Check className={`w-2.5 h-2.5 ${isDark ? 'text-slate-700' : 'text-slate-400'}`} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>REQUEST CREATED</span>
                                            <span className={`text-[10px] font-mono ${isDark ? 'text-slate-700' : 'text-slate-400'}`}>
                                                {selectedRequest.createdAt?.toDate ? selectedRequest.createdAt.toDate().toLocaleString() : 'Initial'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Footer Actions */}
                        <div className={`p-8 border-t space-y-4 shrink-0 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50/50'}`}>
                            <div className="flex gap-4">
                                <button
                                    className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all shadow-sm ${isDark
                                        ? 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                        }`}
                                    onClick={() => setSelectedRequest(null)}
                                >
                                    Close Dashboard
                                </button>
                                <button className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-widest opacity-50 cursor-not-allowed ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-red-50 border-red-100 text-red-500'}`}>
                                    Cancel Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import React, { useState, useEffect } from "react";
import { Plus, CheckCircle2, Calendar, Target, Trash2, Edit, TrendingUp } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/ui/StatusBadge";
import SankalpForm from "@/components/admin/spiritual/SankalpForm";
import { logAdminAction } from "@/lib/admin-logger";

interface CollectiveGoal {
    id: string;
    title: string;
    description: string;
    type: string;
    targetCount: number;
    currentCount: number;
    startDate: any;
    endDate: any;
    status: string;
}

export default function SankalpManager() {
    const [goals, setGoals] = useState<CollectiveGoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<CollectiveGoal | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDark = () => {
            const saved = localStorage.getItem('admin-theme');
            if (saved === 'dark') setIsDark(true);
            else if (saved === 'system') setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
            else setIsDark(false);
        };
        checkDark();
        const interval = setInterval(checkDark, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const q = query(
            collection(db, "collective_goals"),
            orderBy("startDate", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => {
                const d = doc.data();
                return {
                    id: doc.id,
                    ...d,
                    // Ensure dates are formatted correctly for the table
                };
            }) as CollectiveGoal[];
            setGoals(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching goals:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredGoals = goals.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = async (goal: CollectiveGoal) => {
        if (!confirm("Are you sure you want to delete this Sankalp? All progress and shards will be lost.")) return;
        try {
            await deleteDoc(doc(db, "collective_goals", goal.id));
            await logAdminAction({
                action: "DELETE",
                collectionName: "collective_goals",
                documentId: goal.id,
                details: `Deleted Sankalp: ${goal.title}`,
                previousData: goal
            });
        } catch (error) {
            alert("Failed to delete Sankalp");
        }
    };

    const columns = [
        {
            header: "Sankalp Goal",
            accessor: (item: CollectiveGoal) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                        <Target className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-medium line-clamp-1 text-[#B56550]">{item.title}</span>
                        <span className="text-xs text-slate-500 capitalize">{item.type}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Progress",
            accessor: (item: CollectiveGoal) => {
                const progress = Math.min(100, (item.currentCount / item.targetCount) * 100);
                return (
                    <div className="flex flex-col gap-1 min-w-[150px]">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500">
                            <span>{item.currentCount.toLocaleString()} / {item.targetCount.toLocaleString()}</span>
                            <span>{progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-orange-500 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                );
            }
        },
        {
            header: "Duration",
            accessor: (item: CollectiveGoal) => (
                <div className="flex flex-col text-xs text-slate-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{item.startDate?.toDate ? new Date(item.startDate.toDate()).toLocaleDateString() : "Starting..."}</span>
                    </div>
                    {item.endDate && (
                        <div className="flex items-center gap-1 opacity-60">
                            <div className="w-3" />
                            <span>to {item.endDate?.toDate ? new Date(item.endDate.toDate()).toLocaleDateString() : ""}</span>
                        </div>
                    )}
                </div>
            )
        },
        {
            header: "Status",
            accessor: (item: CollectiveGoal) => (
                <StatusBadge
                    variant={item.status === 'expired' ? 'unavailable' : item.status as any}
                    className="shadow-sm"
                />
            )
        }
    ];

    if (showForm) {
        return (
            <SankalpForm
                initialData={selectedGoal || undefined}
                onCancel={() => { setShowForm(false); setSelectedGoal(null); }}
            />
        );
    }

    return (
        <div className={`flex flex-col h-full ${isDark ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'}`}>
            <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-20 ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-slate-200 bg-white'}`}>
                <div>
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Sankalp Management</h2>
                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Track and manage spiritual goals and resolutions</p>
                </div>
                <button
                    onClick={() => { setSelectedGoal(null); setShowForm(true); }}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    New Sankalp
                </button>
            </div>

            <div className={`flex items-center justify-between gap-4 p-6 border-b ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find a goal..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
                        <TrendingUp className="w-4 h-4 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent border-none text-xs focus:ring-0 outline-none cursor-pointer font-medium text-slate-600 dark:text-zinc-400"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <AdminTable
                    columns={columns}
                    data={filteredGoals}
                    loading={loading}
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    hideControls={true}
                    onRowClick={(item) => { setSelectedGoal(item); setShowForm(true); }}
                />
            </div>
        </div>
    );
}

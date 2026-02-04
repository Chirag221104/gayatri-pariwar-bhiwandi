"use client";

import { useState, useEffect } from "react";
import { Settings, Plus, Calendar as CalendarIcon, Moon, Trash2, Edit } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import AdminTable from "@/components/admin/AdminTable";
import CalendarEventForm from "@/components/admin/calendar/CalendarEventForm";
import { logAdminAction } from "@/lib/admin-logger";

interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    tithi?: string;
    significance?: string;
    status: "active" | "draft";
    createdAt?: any;
}

export default function FestivalCalendarPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
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
        const q = query(collection(db, "festival_calendar"), orderBy("date", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as CalendarEvent[];
            setEvents(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching calendar:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (event: CalendarEvent) => {
        if (!confirm(`Are you sure you want to delete "${event.title}"?`)) return;
        try {
            await deleteDoc(doc(db, "festival_calendar", event.id));
            await logAdminAction({
                action: "DELETE",
                collectionName: "festival_calendar",
                documentId: event.id,
                details: `Deleted festival: ${event.title}`,
                previousData: event
            });
        } catch (error) {
            alert("Delete failed");
        }
    };

    const formatDate = (dateValue: any) => {
        if (!dateValue) return "No Date";

        let date: Date;
        if (typeof dateValue === "object" && dateValue.seconds !== undefined) {
            date = new Date(dateValue.seconds * 1000);
        } else {
            date = new Date(dateValue);
        }

        if (isNaN(date.getTime())) return "Invalid Date";

        return date.toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const columns = [
        {
            header: "Festival / Event",
            accessor: (item: CalendarEvent) => (
                <div className="flex flex-col gap-1">
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{item.title}</span>
                    <div className={`flex items-center gap-2 text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        <Moon className="w-3 h-3" />
                        <span>{item.tithi || "Tithi not specified"}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Date",
            accessor: (item: CalendarEvent) => (
                <div className="flex items-center gap-2 text-orange-500 font-bold text-sm">
                    <CalendarIcon className="w-4 h-4" />
                    {formatDate(item.date)}
                </div>
            )
        },
        {
            header: "Status",
            accessor: (item: CalendarEvent) => (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.status === 'active'
                    ? isDark ? "bg-emerald-500/10 text-emerald-500" : "bg-emerald-50 text-emerald-600"
                    : isDark ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-500"
                    }`}>
                    {item.status}
                </span>
            )
        },
        {
            header: "Actions",
            accessor: (item: CalendarEvent) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); setSelectedEvent(item); setShowForm(true); }}
                        className={`p-2 rounded-lg transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                        className={`p-2 rounded-lg transition-all ${isDark ? 'text-slate-600 hover:text-red-500 hover:bg-red-500/10' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    if (showForm) {
        return (
            <CalendarEventForm
                initialData={selectedEvent || undefined}
                onCancel={() => { setShowForm(false); setSelectedEvent(null); }}
            />
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold flex items-center gap-4 ${isDark ? 'text-white' : 'text-black'}`}>
                        <Settings className="w-8 h-8 text-orange-500" />
                        Festival Calendar
                    </h1>
                    <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Configure recurring spiritual festivals and tithis.</p>
                </div>
                <button
                    onClick={() => { setSelectedEvent(null); setShowForm(true); }}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Add Festival Config
                </button>
            </div>

            <div className="flex-1 min-h-0">
                <AdminTable
                    columns={columns}
                    data={events}
                    loading={loading}
                    emptyMessage="No festivals configured yet. Start by adding an important spiritual date."
                    onRowClick={(item) => { setSelectedEvent(item); setShowForm(true); }}
                />
            </div>
        </div>
    );
}

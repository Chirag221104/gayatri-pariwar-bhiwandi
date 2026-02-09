"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, MapPin } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminTable from "@/components/admin/AdminTable";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";

interface GlobalEvent {
    id: string;
    title: string;
    description: string;
    location: string;
    eventDate: any; // Firestore Timestamp
    createdBy: string;
    createdAt: any;
}

export default function EventsManagementPage() {
    const [events, setEvents] = useState<GlobalEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isDark, setIsDark] = useState(false);
    const params = useParams();
    const locale = (params?.locale as string) || "en";

    // Theme detection
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
        const q = query(collection(db, "events"), orderBy("eventDate", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as GlobalEvent[];
            setEvents(eventsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching events:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        {
            header: "Event Title",
            accessor: (event: GlobalEvent) => (
                <div className="flex flex-col">
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{event.title}</span>
                    <span className={`text-xs line-clamp-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{event.description}</span>
                </div>
            )
        },
        {
            header: "Date",
            accessor: (event: GlobalEvent) => {
                const date = event.eventDate instanceof Timestamp
                    ? event.eventDate.toDate()
                    : new Date(event.eventDate);
                return (
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                            {date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                );
            }
        },
        {
            header: "Location",
            accessor: (event: GlobalEvent) => (
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{event.location}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessor: (event: GlobalEvent) => {
                const date = event.eventDate instanceof Timestamp
                    ? event.eventDate.toDate()
                    : new Date(event.eventDate);
                const isPast = date < new Date();
                return (
                    <StatusBadge
                        variant={isPast ? "cancelled" : "active"}
                        label={isPast ? "Past" : "Upcoming"}
                    />
                );
            }
        }
    ];

    return (
        <div className="space-y-8 flex flex-col h-[calc(100vh-8rem)]">
            <SectionHeader
                icon={Calendar}
                title="Global Events"
                subtitle="Manage all spiritual and community events"
                actions={
                    <Link
                        href={`/${locale}/admin/events/new`}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 shadow-lg shadow-orange-500/20 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
                    >
                        <Plus className="w-4 h-4" />
                        Create Event
                    </Link>
                }
            />

            <div className="flex-1 min-h-0">
                <AdminTable
                    columns={columns}
                    data={filteredEvents}
                    loading={loading}
                    searchPlaceholder="Search events or locations..."
                    searchValue={search}
                    onSearchChange={setSearch}
                    emptyMessage="No events found. Start by creating one!"
                    onRowClick={(event) => {
                        window.location.href = `/${locale}/admin/events/${event.id}`;
                    }}
                />
            </div>
        </div>
    );
}

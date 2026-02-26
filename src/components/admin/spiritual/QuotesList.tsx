"use client";

import { useState, useEffect } from "react";
import { Plus, Quote as QuoteIcon, Calendar, Languages, Image as ImageIcon, Trash2, Edit } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/ui/StatusBadge";
import QuoteForm from "@/components/admin/spiritual/QuoteForm";
import { logAdminAction } from "@/lib/admin-logger";

interface DailyQuote {
    id: string;
    text: string;
    textHi?: string;
    textMr?: string;
    textGu?: string;
    author: string;
    date: string;
    imageUrl?: string;
    tithi?: string;
    status: string;
}

export default function QuotesList() {
    const [quotes, setQuotes] = useState<DailyQuote[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState<DailyQuote | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
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
            collection(db, "spiritual_content", "daily_quotes", "items"),
            orderBy("date", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as DailyQuote[];
            setQuotes(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching quotes:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredQuotes = quotes.filter(q =>
        q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (quote: DailyQuote) => {
        if (!confirm("Are you sure you want to delete this quote?")) return;
        try {
            await deleteDoc(doc(db, "spiritual_content", "daily_quotes", "items", quote.id));
            await logAdminAction({
                action: "DELETE",
                collectionName: "daily_quotes",
                documentId: quote.id,
                details: `Deleted quote for date: ${quote.date}`,
                previousData: quote
            });
        } catch (error) {
            alert("Failed to delete quote");
        }
    };

    const columns = [
        {
            header: "Quote & Author",
            accessor: (item: DailyQuote) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                        {item.imageUrl ? (
                            <img src={item.imageUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <QuoteIcon className="w-5 h-5 text-orange-500" />
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-medium line-clamp-1 text-[#B56550]">{item.text}</span>
                        <span className="text-xs text-slate-500">— {item.author}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Scheduled Date",
            accessor: (item: DailyQuote) => (
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-700 dark:text-zinc-300">{item.date}</span>
                </div>
            )
        },
        {
            header: "Languages",
            accessor: (item: DailyQuote) => {
                const locales = [
                    {
                        id: "En",
                        color: isDark ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" : "bg-orange-50 text-orange-600 border-orange-100"
                    },
                    {
                        id: "Hi",
                        color: isDark ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-blue-50 text-blue-600 border-blue-100",
                        exists: !!item.textHi
                    },
                    {
                        id: "Mr",
                        color: isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border-emerald-100",
                        exists: !!item.textMr
                    },
                    {
                        id: "Gu",
                        color: isDark ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-indigo-50 text-indigo-600 border-indigo-100",
                        exists: !!item.textGu
                    },
                ];
                const activeLocales = locales.filter(l => l.id === "En" || l.exists);
                const allDone = activeLocales.length === 4;
                return (
                    <div className="flex items-center gap-1.5">
                        {activeLocales.map(l => (
                            <span key={l.id} className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase shadow-sm ${l.color}`}>
                                {l.id}
                            </span>
                        ))}
                        {!allDone && <Languages className="w-3.5 h-3.5 text-orange-400 ml-1 animate-pulse" />}
                    </div>
                );
            }
        },
        {
            header: "Status",
            accessor: (item: DailyQuote) => {
                const itemDate = new Date(item.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isToday = item.date === today.toISOString().split('T')[0];
                const isPast = itemDate < today;

                let variant: any = "active";
                let label = "Upcoming";

                if (isToday) {
                    variant = "warning";
                    label = "Today";
                } else if (isPast) {
                    variant = "past";
                    label = "Previous";
                }

                return (
                    <StatusBadge
                        variant={variant}
                        label={label}
                        className="font-black"
                    />
                );
            }
        }
    ];

    if (showForm) {
        return (
            <QuoteForm
                initialData={selectedQuote || undefined}
                onCancel={() => { setShowForm(false); setSelectedQuote(null); }}
            />
        );
    }

    return (
        <div className={`flex flex-col h-full ${isDark ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'}`}>
            <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-20 ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-slate-200 bg-white'}`}>
                <div>
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Daily Quotes</h2>
                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Scheduled inspiration for the mobile app home screen</p>
                </div>
                <button
                    onClick={() => { setSelectedQuote(null); setShowForm(true); }}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Add Quote
                </button>
            </div>

            <div className="flex-1 min-h-0">
                <AdminTable
                    columns={columns}
                    data={filteredQuotes}
                    loading={loading}
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search by author or text..."
                    onRowClick={(item) => { setSelectedQuote(item); setShowForm(true); }}
                />
            </div>
        </div>
    );
}

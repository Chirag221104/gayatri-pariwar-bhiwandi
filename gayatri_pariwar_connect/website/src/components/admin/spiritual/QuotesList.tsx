"use client";

import { useState, useEffect } from "react";
import { Plus, Quote as QuoteIcon, Calendar, Languages, Image as ImageIcon, Trash2, Edit } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import AdminTable from "@/components/admin/AdminTable";
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
                    <span className="text-sm text-slate-700 dark:text-slate-300">{item.date}</span>
                </div>
            )
        },
        {
            header: "Languages",
            accessor: (item: DailyQuote) => {
                const locales = ["En"];
                if (item.textHi) locales.push("Hi");
                if (item.textMr) locales.push("Mr");
                if (item.textGu) locales.push("Gu");
                const allDone = locales.length === 4;
                return (
                    <div className="flex items-center gap-1">
                        {locales.map(l => (
                            <span key={l} className="text-[10px] px-1.5 py-0.5 rounded capitalize bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">{l}</span>
                        ))}
                        {!allDone && <Languages className="w-3 h-3 text-orange-500 ml-1 animate-pulse" />}
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

                return (
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isToday ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
                        isPast ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500" : "bg-emerald-500/10 text-emerald-500"
                        }`}>
                        {isToday ? "Today" : isPast ? "Previous" : "Upcoming"}
                    </span>
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
        <div className="flex flex-col h-full bg-transparent">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-20">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Daily Quotes</h2>
                    <p className="text-xs text-slate-500">Scheduled inspiration for the mobile app home screen</p>
                </div>
                <button
                    onClick={() => { setSelectedQuote(null); setShowForm(true); }}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Add Quote
                </button>
            </div>

            <div className="flex-1 min-h-0 bg-white dark:bg-slate-900">
                <AdminTable
                    columns={columns}
                    data={quotes}
                    loading={loading}
                    searchPlaceholder="Search by author or text..."
                    onRowClick={(item) => { setSelectedQuote(item); setShowForm(true); }}
                />
            </div>
        </div>
    );
}

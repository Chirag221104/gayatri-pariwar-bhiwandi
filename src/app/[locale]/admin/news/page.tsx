"use client";

import { useState, useEffect } from "react";
import { Plus, Newspaper, Tag, Eye, Clock } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminTable from "@/components/admin/AdminTable";
import SectionHeader from "@/components/ui/SectionHeader";

interface NewsItem {
    id: string;
    title: string;
    shortDescription: string;
    category: string;
    status: string;
    views: number;
    createdAt: any;
    scheduledAt?: any;
    imageUrl: string;
}

export default function NewsManagementPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isDark, setIsDark] = useState(false);
    const params = useParams();
    const locale = (params?.locale as string) || "en";

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
        const q = query(collection(db, "news"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as NewsItem[];
            setNews(newsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching news:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredNews = news.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusStyles = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'published': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'draft': return isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200';
            case 'scheduled': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500';
        }
    };

    const columns = [
        {
            header: "News Update",
            accessor: (item: NewsItem) => (
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                        {item.imageUrl && <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className={`font-semibold truncate max-w-[300px] ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</span>
                        <span className="text-xs text-slate-500 line-clamp-1">{item.shortDescription}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Category",
            accessor: (item: NewsItem) => (
                <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3 text-slate-500" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.category}</span>
                </div>
            )
        },
        {
            header: "Stats",
            accessor: (item: NewsItem) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-slate-400">
                        <Eye className="w-3 h-3" />
                        <span className="text-[10px]">{item.views || 0} views</span>
                    </div>
                    {item.status === 'scheduled' && item.scheduledAt && (
                        <div className="flex items-center gap-1 text-blue-400">
                            <Clock className="w-3 h-3" />
                            <span className="text-[10px]">
                                {item.scheduledAt instanceof Timestamp
                                    ? item.scheduledAt.toDate().toLocaleDateString()
                                    : new Date(item.scheduledAt).toLocaleDateString()}
                            </span>
                        </div>
                    )}
                </div>
            )
        },
        {
            header: "Status",
            accessor: (item: NewsItem) => (
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(item.status)}`}>
                    {item.status || 'Draft'}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
            <SectionHeader
                icon={Newspaper}
                title="News & Activities"
                subtitle="Announcements, blogs, and magazine updates"
                actions={
                    <Link
                        href={`/${locale}/admin/news/new`}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    >
                        <Plus className="w-5 h-5" />
                        New Post
                    </Link>
                }
            />

            <div className="flex-1 min-h-0">
                <AdminTable
                    columns={columns}
                    data={filteredNews}
                    loading={loading}
                    searchPlaceholder="Search news title or category..."
                    searchValue={search}
                    onSearchChange={setSearch}
                    emptyMessage="No news items found. Share something new!"
                    onRowClick={(item) => {
                        window.location.href = `/${locale}/admin/news/${item.id}`;
                    }}
                />
            </div>
        </div>
    );
}

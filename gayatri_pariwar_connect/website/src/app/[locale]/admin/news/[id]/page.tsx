"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import NewsForm from "@/components/admin/NewsForm";
import { logAdminAction } from "@/lib/admin-logger";
import { ChevronLeft, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditNewsPage() {
    const [newsItem, setNewsItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const locale = (params?.locale as string) || "en";

    useEffect(() => {
        async function fetchNewsItem() {
            if (!id) return;
            try {
                const docRef = doc(db, "news", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setNewsItem({ id: docSnap.id, ...docSnap.data() });
                } else {
                    router.push(`/${locale}/admin/news`);
                }
            } catch (error) {
                console.error("Error fetching news item:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchNewsItem();
    }, [id, router, locale]);

    const handleSave = async (data: any) => {
        setIsSaving(true);
        try {
            const docRef = doc(db, "news", id);

            // Log the action with previous data
            await logAdminAction({
                action: "UPDATE",
                collectionName: "news",
                documentId: id,
                details: `Updated news update: ${data.title}`,
                previousData: newsItem,
                newData: data
            });

            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp()
            });

            router.push(`/${locale}/admin/news`);
        } catch (error) {
            console.error("Error updating news item:", error);
            alert("Failed to update news. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this news update? This action cannot be undone.")) return;

        setIsDeleting(true);
        try {
            const docRef = doc(db, "news", id);

            await logAdminAction({
                action: "DELETE",
                collectionName: "news",
                documentId: id,
                details: `Deleted news update: ${newsItem.title}`,
                previousData: newsItem
            });

            await deleteDoc(docRef);
            router.push(`/${locale}/admin/news`);
        } catch (error) {
            console.error("Error deleting news:", error);
            alert("Failed to delete news article.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-4">
                    <Link
                        href={`/${locale}/admin/news`}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors w-fit"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to News
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Edit Update</h1>
                </div>

                <button
                    onClick={handleDelete}
                    disabled={isDeleting || isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all border border-red-500/20 active:scale-95 disabled:opacity-50"
                >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Delete Post
                </button>
            </div>

            <NewsForm
                initialData={newsItem}
                onSave={handleSave}
                onCancel={() => router.push(`/${locale}/admin/news`)}
                isSaving={isSaving}
            />
        </div>
    );
}

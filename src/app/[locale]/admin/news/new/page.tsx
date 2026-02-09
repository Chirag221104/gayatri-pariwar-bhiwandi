"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import NewsForm from "@/components/admin/NewsForm";
import { logAdminAction } from "@/lib/admin-logger";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CreateNewsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || "en";

    const handleSave = async (data: any) => {
        setIsSaving(true);
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("No admin user found");

            const finalData = {
                ...data,
                views: 0,
                createdBy: user.uid,
                createdAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, "news"), finalData);

            // Log the action
            await logAdminAction({
                action: "CREATE",
                collectionName: "news",
                documentId: docRef.id,
                details: `Created new news update: ${data.title}`
            });

            router.push(`/${locale}/admin/news`);
        } catch (error) {
            console.error("Error creating news:", error);
            alert("Failed to create news update. Please check console for details.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <Link
                    href={`/${locale}/admin/news`}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors w-fit"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to News
                </Link>
                <h1 className="text-3xl font-bold text-white">Share News Update</h1>
            </div>

            <NewsForm
                onSave={handleSave}
                onCancel={() => router.push(`/${locale}/admin/news`)}
                isSaving={isSaving}
            />
        </div>
    );
}

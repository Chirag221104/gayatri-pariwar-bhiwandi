"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import BookForm from "@/components/admin/BookForm";
import { logAdminAction } from "@/lib/admin-logger";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CreateBookPage() {
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
                createdBy: user.uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, "granthalaya_app", "inventory", "books"), finalData);

            // Log the action
            await logAdminAction({
                action: "CREATE",
                collectionName: "books_inventory",
                documentId: docRef.id,
                details: `Added new book to inventory: ${data.title} by ${data.author}`
            });

            router.push(`/${locale}/admin/books`);
        } catch (error) {
            console.error("Error adding book:", error);
            alert("Failed to add book to inventory. Please check console.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <Link
                    href={`/${locale}/admin/books`}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors w-fit"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Inventory
                </Link>
                <h1 className="text-3xl font-bold font-display tracking-tight text-foreground underline decoration-orange-500/30 underline-offset-8">
                    Add New Book
                </h1>
            </div>

            <BookForm
                onSave={handleSave}
                onCancel={() => router.push(`/${locale}/admin/books`)}
                isSaving={isSaving}
            />
        </div>
    );
}

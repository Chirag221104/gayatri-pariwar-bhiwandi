"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import EventForm from "@/components/admin/EventForm";
import { logAdminAction } from "@/lib/admin-logger";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CreateEventPage() {
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
                updatedAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, "events"), finalData);

            // Log the action
            await logAdminAction({
                action: "CREATE",
                collectionName: "events",
                documentId: docRef.id,
                details: `Created new event: ${data.title}`
            });

            router.push(`/${locale}/admin/events`);
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Failed to create event. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <Link
                    href={`/${locale}/admin/events`}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors w-fit"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Events
                </Link>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Create New Event
                </h1>
            </div>

            <EventForm
                onSave={handleSave}
                onCancel={() => router.push(`/${locale}/admin/events`)}
                isSaving={isSaving}
            />
        </div>
    );
}

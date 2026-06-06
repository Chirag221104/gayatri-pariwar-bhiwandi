"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import SectionHeader from "@/components/ui/SectionHeader";
import { Library, ArrowLeft } from "lucide-react";
import Link from "next/link";
import DigitalLibraryForm from "@/components/admin/granthalaya/DigitalLibraryForm";
import { logAdminAction } from "@/lib/admin-logger";
import { useToast } from "@/components/ui/Toast";

export default function NewDigitalResourcePage() {
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || "en";
    const [isSaving, setIsSaving] = useState(false);
    const { showToast } = useToast();

    const handleSave = async (data: any) => {
        setIsSaving(true);
        try {
            const docRef = await addDoc(collection(db, "granthalaya_app", "digital_library", "items"), {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            await logAdminAction({
                action: "CREATE",
                collectionName: "digital_library",
                documentId: docRef.id,
                details: `Published new digital resource: ${data.title}`
            });

            showToast("Resource published successfully", "success");
            router.push(`/${locale}/admin/books/digital-library`);
        } catch (error) {
            console.error("Error publishing resource:", error);
            showToast("Failed to publish resource", "error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col gap-3">
                <Link
                    href={`/${locale}/admin/books/digital-library`}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors w-fit"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Library
                </Link>
                <h1 className="text-3xl font-bold font-display tracking-tight text-foreground underline decoration-blue-500/30 underline-offset-8">
                    Publish Digital Resource
                </h1>
            </div>

            <DigitalLibraryForm
                onSave={handleSave}
                onCancel={() => router.push(`/${locale}/admin/books/digital-library`)}
                isSaving={isSaving}
            />
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import SectionHeader from "@/components/ui/SectionHeader";
import { Library, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import DigitalLibraryForm from "@/components/admin/granthalaya/DigitalLibraryForm";
import { logAdminAction } from "@/lib/admin-logger";
import { useToast } from "@/components/ui/Toast";

export default function EditDigitalResourcePage() {
    const router = useRouter();
    const { id, locale } = useParams();
    const [resource, setResource] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchResource = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "granthalaya_app", "digital_library", "items", id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setResource({ id: docSnap.id, ...docSnap.data() });
                } else {
                    showToast("Resource not found", "error");
                    router.push(`/${locale}/admin/books/digital-library`);
                }
            } catch (error) {
                console.error("Error fetching resource:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResource();
    }, [id, locale, router]);

    const handleSave = async (data: any) => {
        setIsSaving(true);
        try {
            const docRef = doc(db, "granthalaya_app", "digital_library", "items", id as string);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp(),
            });

            await logAdminAction({
                action: "UPDATE",
                collectionName: "digital_library",
                documentId: id as string,
                details: `Updated digital resource: ${data.title}`
            });

            showToast("Resource updated successfully", "success");
            router.push(`/${locale}/admin/books/digital-library`);
        } catch (error) {
            console.error("Error updating resource:", error);
            showToast("Failed to update resource", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p className="text-slate-500 animate-pulse font-medium">Fetching resource details...</p>
            </div>
        );
    }

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
                    Edit Resource
                </h1>
            </div>

            <DigitalLibraryForm
                initialData={resource}
                onSave={handleSave}
                onCancel={() => router.push(`/${locale}/admin/books/digital-library`)}
                isSaving={isSaving}
            />
        </div>
    );
}

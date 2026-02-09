"use client";

import { useState } from "react";
import { BookOpen, ChevronLeft, Info, Images } from "lucide-react";
import { useAdminTheme } from "@/hooks/useAdminTheme";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import SectionHeader from "@/components/ui/SectionHeader";
import ImageSync from "@/components/admin/granthalaya/ImageSync";

export default function ImageSyncPage() {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "en";
    const { isDark } = useAdminTheme();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col gap-3">
                <Link
                    href={`/${locale}/admin/books`}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors w-fit"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Inventory
                </Link>
                <div className="flex items-end gap-3">
                    <SectionHeader
                        icon={Images}
                        title="Bulk Image Sync"
                        subtitle="Automatically link book covers using filename magic"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className={`p-8 rounded-[3rem] border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <ImageSync onComplete={() => {
                            // Option to refresh or navigate
                        }} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className={`p-6 rounded-3xl border border-blue-500/20 bg-blue-500/5 ${isDark ? '' : 'shadow-sm'}`}>
                        <h3 className="font-bold flex items-center gap-2 mb-4 text-blue-600">
                            <Info className="w-4 h-4" />
                            How it works
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500/60">Step 1</p>
                                <p className="text-sm font-medium">Name your images after the book's **ISBN** or **Exact Title**.</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500/60">Step 2</p>
                                <p className="text-sm font-medium">Select multiple images at once to start matching.</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500/60">Step 3</p>
                                <p className="text-sm font-medium">We'll upload and link them to the correct books in Firestore.</p>
                            </div>
                        </div>
                    </div>

                    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <h3 className="font-bold text-sm mb-2">💡 Naming Tips</h3>
                        <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4">
                            <li>Spaces and dashes are ignored during matching.</li>
                            <li>Case doesn't matter (Books.jpg = books.jpg).</li>
                            <li>ISBN matches are prioritized over title matches.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

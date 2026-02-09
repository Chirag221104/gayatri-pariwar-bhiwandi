"use client";

import { useState, useEffect } from "react";
import { BookOpen, ChevronLeft, Info, FileSpreadsheet } from "lucide-react";
import { useAdminTheme } from "@/hooks/useAdminTheme";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import SectionHeader from "@/components/ui/SectionHeader";
import BulkImport from "@/components/admin/granthalaya/BulkImport";

export default function BulkImportPage() {
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
                        icon={FileSpreadsheet}
                        title="Bulk CSV Import"
                        subtitle="Upload hundreds of books instantly via spreadsheet"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <BulkImport onComplete={() => {
                            // Option to auto-navigate back after some delay or show success state
                        }} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <h3 className="font-bold flex items-center gap-2 mb-4">
                            <Info className="w-4 h-4 text-orange-500" />
                            Import Guide
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Required Columns</p>
                                <p className="text-sm">Title, Author, Price, Stock</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Optional Columns</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Description, Category, CoverUrl, ISBN</p>
                            </div>
                            <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/10">
                                <p className="text-xs text-orange-600 leading-relaxed uppercase font-bold tracking-tight">
                                    💡 Tip: Use the CSV template to ensure column names are exact.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`p-6 rounded-3xl border border-blue-500/20 bg-blue-500/5 ${isDark ? '' : 'shadow-sm'}`}>
                        <h3 className="font-bold flex items-center gap-2 mb-2 text-blue-600">
                            <BookOpen className="w-4 h-4" />
                            Matching Logic
                        </h3>
                        <p className="text-xs text-blue-600/80 leading-relaxed">
                            Currently, this tool creates NEW records for every row. To avoid duplicates, check your inventory before importing.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

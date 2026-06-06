"use client";

import React, { useState, useEffect } from "react";
import {
    Save,
    X,
    Video,
    FileText,
    ChevronDown,
    Loader2,
    Clock,
    Eye,
    Monitor,
    Hash
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { logAdminAction } from "@/lib/admin-logger";

interface Lesson {
    id: string;
    title: string;
    description: string;
    type: string;
    videoUrl?: string;
    pdfUrl?: string;
    duration: number;
    isFree: boolean;
    order: number;
}

interface LessonFormProps {
    courseId: string;
    initialData?: Lesson;
    onCancel: () => void;
    nextOrder: number;
}

export default function LessonForm({ courseId, initialData, onCancel, nextOrder }: LessonFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [type, setType] = useState(initialData?.type || "video");
    const [contentUrl, setContentUrl] = useState(initialData?.videoUrl || initialData?.pdfUrl || "");
    const [duration, setDuration] = useState(initialData?.duration || 10);
    const [isFree, setIsFree] = useState(initialData?.isFree || false);
    const [order, setOrder] = useState(initialData?.order || nextOrder);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !contentUrl) {
            alert("Title and Content URL are required.");
            return;
        }

        setIsSaving(true);
        try {
            const data: any = {
                title,
                description,
                type,
                duration: Number(duration),
                isFree,
                order: Number(order),
                courseId,
                updatedAt: serverTimestamp()
            };

            if (type === "video") data.videoUrl = contentUrl;
            else data.pdfUrl = contentUrl;

            if (initialData) {
                await updateDoc(doc(db, "lessons", initialData.id), data);
                await logAdminAction({
                    action: "UPDATE",
                    collectionName: "lessons",
                    documentId: initialData.id,
                    details: `Updated lesson: ${title}`,
                    previousData: initialData,
                    newData: data
                });
            } else {
                const docRef = await addDoc(collection(db, "lessons"), {
                    ...data,
                    createdAt: serverTimestamp()
                });
                await logAdminAction({
                    action: "CREATE",
                    collectionName: "lessons",
                    documentId: docRef.id,
                    details: `Created new lesson: ${title}`
                });
            }
            onCancel();
        } catch (error) {
            console.error("Error saving lesson:", error);
            alert("Failed to save lesson");
        } finally {
            setIsSaving(false);
        }
    };

    const inputClasses = "w-full rounded-xl py-3 px-4 bg-slate-50 border border-slate-200 outline-none transition-all focus:ring-2 focus:ring-orange-500/20 focus:bg-white text-sm font-medium";

    return (
        <form onSubmit={handleSubmit} className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-10 animate-in slide-in-from-right-10 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{initialData ? "Refine Module" : "New Learning Module"}</h3>
                    <p className="text-xs text-slate-500 font-medium">Configure the content and metadata for this lesson</p>
                </div>
                <button type="button" onClick={onCancel} className="p-2.5 hover:bg-slate-50 text-slate-400 rounded-full transition-colors">
                    <X className="w-5 h-6 text-slate-300" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Module Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Introduction to Gayatri Mahavigyan"
                            className={inputClasses}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Content Summary</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Briefly describe what this module covers..."
                            rows={4}
                            className={inputClasses}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Module Order</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input
                                    type="number"
                                    value={order}
                                    onChange={(e) => setOrder(Number(e.target.value))}
                                    className={`${inputClasses} pl-10`}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Duration (Min)</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className={`${inputClasses} pl-10`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Delivery Format</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setType("video")}
                                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${type === "video" ? "bg-orange-500 border-orange-400 text-white shadow-lg" : "bg-white text-slate-400 border-slate-200 hover:text-slate-600"}`}
                            >
                                <Video className="w-4 h-4" />
                                Video
                            </button>
                            <button
                                type="button"
                                onClick={() => setType("pdf")}
                                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${type === "pdf" ? "bg-orange-500 border-orange-400 text-white shadow-lg" : "bg-white text-slate-400 border-slate-200 hover:text-slate-600"}`}
                            >
                                <FileText className="w-4 h-4" />
                                Document
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                            {type === "video" ? "Video URL (YouTube/Vimeo)" : "PDF Document URL"}
                        </label>
                        <div className="relative">
                            <Monitor className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input
                                type="url"
                                value={contentUrl}
                                onChange={(e) => setContentUrl(e.target.value)}
                                placeholder="https://..."
                                className={`${inputClasses} pl-10`}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider">Free Preview</span>
                            <span className="text-[9px] text-slate-400 font-bold">Allow students to view without enrolling</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsFree(!isFree)}
                            className={`w-12 h-6 rounded-full p-1 transition-all flex ${isFree ? "bg-emerald-500 justify-end shadow-inner" : "bg-slate-200 justify-start"}`}
                        >
                            <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                >
                    Discard
                </button>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-orange-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {initialData ? "Update Module" : "Append Module"}
                </button>
            </div>
        </form>
    );
}

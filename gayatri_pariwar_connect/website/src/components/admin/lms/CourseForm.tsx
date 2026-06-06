"use client";

import { useState, useEffect } from "react";
import { useWarnUnsavedChanges } from "@/hooks/useWarnUnsavedChanges";
import {
    Save,
    X,
    Image as ImageIcon,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Globe,
    User,
    Trophy,
    LayoutPanelTop,
    ChevronRight,
    Tag,
    BookOpen
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { logAdminAction } from "@/lib/admin-logger";
import LessonManager from "@/components/admin/lms/LessonManager";

interface Course {
    id: string;
    title: string;
    titleHi?: string;
    titleMr?: string;
    titleGu?: string;
    description: string;
    descriptionHi?: string;
    descriptionMr?: string;
    descriptionGu?: string;
    instructorName: string;
    difficulty: string;
    status: string;
    thumbnailUrl: string;
}

interface CourseFormProps {
    initialData?: Course;
    onCancel: () => void;
}

type LangTab = "en" | "hi" | "mr" | "gu";

export default function CourseForm({ initialData, onCancel }: CourseFormProps) {
    const [activeLang, setActiveLang] = useState<LangTab>("en");
    const [activeSection, setActiveSection] = useState<"details" | "lessons">("details");
    const [isSaving, setIsSaving] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const [title, setTitle] = useState(initialData?.title || "");
    const [titleHi, setTitleHi] = useState(initialData?.titleHi || "");
    const [titleMr, setTitleMr] = useState(initialData?.titleMr || "");
    const [titleGu, setTitleGu] = useState(initialData?.titleGu || "");

    const [description, setDescription] = useState(initialData?.description || "");
    const [descriptionHi, setDescriptionHi] = useState(initialData?.descriptionHi || "");
    const [descriptionMr, setDescriptionMr] = useState(initialData?.descriptionMr || "");
    const [descriptionGu, setDescriptionGu] = useState(initialData?.descriptionGu || "");

    const [instructorName, setInstructorName] = useState(initialData?.instructorName || "");
    const [difficulty, setDifficulty] = useState(initialData?.difficulty || "beginner");
    const [status, setStatus] = useState(initialData?.status || "draft");
    const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnailUrl || "");

    const [isDirty, setIsDirty] = useState(false);
    useWarnUnsavedChanges(isDirty);

    useEffect(() => {
        const checkDark = () => {
            const saved = localStorage.getItem('admin-theme');
            setIsDark(saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));
        };
        checkDark();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !instructorName) {
            alert("Title and Instructor are required.");
            return;
        }

        setIsSaving(true);
        try {
            const data = {
                title, titleHi, titleMr, titleGu,
                description, descriptionHi, descriptionMr, descriptionGu,
                instructorName,
                difficulty,
                status,
                thumbnailUrl,
                updatedAt: serverTimestamp()
            };

            if (initialData) {
                await updateDoc(doc(db, "courses", initialData.id), data);
                await logAdminAction({
                    action: "UPDATE",
                    collectionName: "courses",
                    documentId: initialData.id,
                    details: `Updated course: ${title}`,
                    previousData: initialData,
                    newData: data
                });
            } else {
                const docRef = await addDoc(collection(db, "courses"), {
                    ...data,
                    enrolledCount: 0,
                    averageRating: 0.0,
                    createdAt: serverTimestamp()
                });
                await logAdminAction({
                    action: "CREATE",
                    collectionName: "courses",
                    documentId: docRef.id,
                    details: `Created new course: ${title}`
                });
            }
            setIsDirty(false);
            if (!initialData) onCancel();
        } catch (error) {
            console.error("Error saving course:", error);
            alert("Failed to save course");
        } finally {
            setIsSaving(false);
        }
    };

    const inputClasses = `w-full rounded-xl py-3 px-4 outline-none transition-all focus:ring-2 focus:ring-orange-500/50 ${isDark
        ? 'bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500'
        : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500'
        }`;

    const langTabs: { id: LangTab; label: string }[] = [
        { id: "en", label: "English" },
        { id: "hi", label: "Hindi" },
        { id: "mr", label: "Marathi" },
        { id: "gu", label: "Gujarati" },
    ];

    return (
        <div className={`flex flex-col h-full border-t animate-in fade-in slide-in-from-bottom-5 duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="px-8 py-4 flex items-center justify-between border-b border-slate-200 bg-white sticky top-0 z-40">
                <div className="flex items-center gap-8">
                    <button
                        onClick={() => setActiveSection("details")}
                        className={`text-sm font-black uppercase tracking-wider transition-all border-b-2 py-4 px-1 ${activeSection === "details" ? "border-orange-500 text-orange-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                    >
                        General Info
                    </button>
                    {initialData && (
                        <button
                            onClick={() => setActiveSection("lessons")}
                            className={`text-sm font-black uppercase tracking-wider transition-all border-b-2 py-4 px-1 ${activeSection === "lessons" ? "border-orange-500 text-orange-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                        >
                            Lessons & Quizzes
                        </button>
                    )}
                </div>
                <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-5xl mx-auto">
                    {activeSection === "details" ? (
                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                            <Tag className="w-4 h-4" /> Localization
                                        </h3>

                                        <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-xl w-fit">
                                            {langTabs.map(tab => (
                                                <button
                                                    key={tab.id}
                                                    type="button"
                                                    onClick={() => setActiveLang(tab.id)}
                                                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${activeLang === tab.id ? "bg-white text-orange-600 shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-900"}`}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="space-y-6 pt-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                                                    Course Title ({activeLang.toUpperCase()})
                                                </label>
                                                <input
                                                    type="text"
                                                    value={activeLang === "en" ? title : activeLang === "hi" ? titleHi : activeLang === "mr" ? titleMr : titleGu}
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        if (activeLang === "en") setTitle(v);
                                                        else if (activeLang === "hi") setTitleHi(v);
                                                        else if (activeLang === "mr") setTitleMr(v);
                                                        else setTitleGu(v);
                                                        setIsDirty(true);
                                                    }}
                                                    placeholder={`Enter course title in ${activeLang}...`}
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                                                    Overview ({activeLang.toUpperCase()})
                                                </label>
                                                <textarea
                                                    value={activeLang === "en" ? description : activeLang === "hi" ? descriptionHi : activeLang === "mr" ? descriptionMr : descriptionGu}
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        if (activeLang === "en") setDescription(v);
                                                        else if (activeLang === "hi") setDescriptionHi(v);
                                                        else if (activeLang === "mr") setDescriptionMr(v);
                                                        else setDescriptionGu(v);
                                                        setIsDirty(true);
                                                    }}
                                                    rows={6}
                                                    className={inputClasses}
                                                    placeholder="Provide a detailed description of the learning path..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Lead Instructor</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={instructorName}
                                                    onChange={(e) => { setInstructorName(e.target.value); setIsDirty(true); }}
                                                    className={`${inputClasses} pl-10`}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Difficulty</label>
                                            <div className="relative">
                                                <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <select
                                                    value={difficulty}
                                                    onChange={(e) => { setDifficulty(e.target.value); setIsDirty(true); }}
                                                    className={`${inputClasses} pl-10 appearance-none bg-no-repeat bg-[right_1rem_center]`}
                                                >
                                                    <option value="beginner">Beginner</option>
                                                    <option value="intermediate">Intermediate</option>
                                                    <option value="advanced">Advanced</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4" /> Thumbnail
                                            </label>
                                            {thumbnailUrl ? (
                                                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-100 group shadow-lg">
                                                    <img src={thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => { setThumbnailUrl(""); setIsDirty(true); }}
                                                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white"
                                                    >
                                                        <X className="w-8 h-8" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <ImageUpload
                                                    onUpload={(url) => { setThumbnailUrl(url); setIsDirty(true); }}
                                                    folder="course_thumbnails"
                                                    description="Upload Course Artwork"
                                                    className="h-40"
                                                />
                                            )}
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-slate-100">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Visibility</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => { setStatus("published"); setIsDirty(true); }}
                                                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${status === "published" ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-50 text-slate-400 hover:text-slate-600"}`}
                                                >
                                                    Live
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { setStatus("draft"); setIsDirty(true); }}
                                                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${status === "draft" ? "bg-slate-900 border-slate-800 text-white shadow-lg" : "bg-slate-50 text-slate-400 hover:text-slate-600"}`}
                                                >
                                                    Draft
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-orange-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                                    >
                                        {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                                        {initialData ? "Save Global Changes" : "Register Course"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <LessonManager courseId={initialData!.id} />
                    )}
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            `}</style>
        </div>
    );
}

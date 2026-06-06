"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Video,
    FileText,
    MoreVertical,
    GripVertical,
    Trash2,
    Edit,
    PlayCircle,
    CheckCircle2,
    HelpCircle,
    Clock,
    Lock,
    BookOpen
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import LessonForm from "@/components/admin/lms/LessonForm";
import QuizManager from "@/components/admin/lms/QuizManager";

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

export default function LessonManager({ courseId }: { courseId: string }) {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<"list" | "lesson-form" | "quiz-manager">("list");
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

    useEffect(() => {
        const q = query(
            collection(db, "lessons"),
            where("courseId", "==", courseId),
            orderBy("order", "asc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setLessons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Lesson[]);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [courseId]);

    const handleDelete = async (lesson: Lesson) => {
        if (!confirm(`Are you sure you want to delete lesson "${lesson.title}"?`)) return;
        try {
            await deleteDoc(doc(db, "lessons", lesson.id));
        } catch (error) {
            alert("Delete failed");
        }
    };

    if (activeView === "lesson-form") {
        return (
            <LessonForm
                courseId={courseId}
                initialData={selectedLesson || undefined}
                onCancel={() => { setActiveView("list"); setSelectedLesson(null); }}
                nextOrder={lessons.length + 1}
            />
        );
    }

    if (activeView === "quiz-manager" && selectedLesson) {
        return (
            <QuizManager
                courseId={courseId}
                lessonId={selectedLesson.id}
                onBack={() => { setActiveView("list"); setSelectedLesson(null); }}
            />
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Curriculum Roadmap</h3>
                    <p className="text-xs text-slate-500 font-medium">Design the sequence of spiritual modules for this course</p>
                </div>
                <button
                    onClick={() => { setSelectedLesson(null); setActiveView("lesson-form"); }}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Add Module
                </button>
            </div>

            <div className="space-y-4">
                {lessons.map((lesson, idx) => (
                    <div
                        key={lesson.id}
                        className="group flex items-center gap-6 bg-white p-5 rounded-3xl border border-slate-100 hover:border-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <GripVertical className="w-5 h-5 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" />
                            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100 shadow-sm">
                                {String(idx + 1).padStart(2, '0')}
                            </div>
                        </div>

                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${lesson.type === "video" ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"}`}>
                            {lesson.type === "video" ? <Video className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-black text-slate-900 text-base tracking-tight truncate">{lesson.title}</h4>
                                {lesson.isFree ? (
                                    <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border border-emerald-100">
                                        Free Preview
                                    </span>
                                ) : (
                                    <Lock className="w-3 h-3 text-slate-300" />
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {lesson.duration} Minutes</span>
                                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                <span className="text-slate-300">{lesson.type} module</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                            <button
                                onClick={() => { setSelectedLesson(lesson); setActiveView("quiz-manager"); }}
                                className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-wider shadow-sm"
                            >
                                <HelpCircle className="w-4 h-4" />
                                Quizzes
                            </button>
                            <button
                                onClick={() => { setSelectedLesson(lesson); setActiveView("lesson-form"); }}
                                className="p-2.5 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all"
                            >
                                <Edit className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleDelete(lesson)}
                                className="p-2.5 hover:bg-red-50 text-slate-300 hover:text-red-600 rounded-xl transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {lessons.length === 0 && !loading && (
                    <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50">
                            <BookOpen className="w-10 h-10 text-slate-200" />
                        </div>
                        <h5 className="font-black text-slate-400 text-lg">Curriculum empty</h5>
                        <p className="text-sm text-slate-400 mt-2 font-medium">Add modules to begin building the learning path</p>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    HelpCircle,
    ChevronLeft,
    Trash2,
    Edit,
    CheckSquare,
    Circle,
    Save,
    Loader2,
    X,
    GripVertical,
    BarChart3
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import QuizForm from "@/components/admin/lms/QuizForm";

interface Quiz {
    id: string;
    title: string;
    description: string;
    questions: any[];
    passingScore: number;
    timeLimit?: number;
}

export default function QuizManager({ courseId, lessonId, onBack }: { courseId: string, lessonId: string, onBack: () => void }) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const q = query(
            collection(db, "quizzes"),
            where("lessonId", "==", lessonId)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                setQuiz({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Quiz);
            } else {
                setQuiz(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [lessonId]);

    if (showForm) {
        return (
            <QuizForm
                courseId={courseId}
                lessonId={lessonId}
                initialData={quiz || undefined}
                onCancel={() => setShowForm(false)}
            />
        );
    }

    return (
        <div className="space-y-10 animate-in slide-in-from-left-5 duration-500">
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-xs font-black uppercase tracking-widest group"
                >
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    Roadmap
                </button>
                <div className="text-center">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Assessment Engine</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5 flex items-center justify-center gap-2">
                        <BarChart3 className="w-3 h-3" /> Secure Server-Side Validation
                    </p>
                </div>
                <div className="w-20" />
            </div>

            {quiz ? (
                <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div className="w-20 h-20 rounded-[2rem] bg-orange-600/10 flex items-center justify-center text-orange-600 border border-orange-500/10 shadow-inner">
                                <HelpCircle className="w-10 h-10" />
                            </div>
                            <div>
                                <h4 className="font-black text-2xl text-slate-900 tracking-tight">{quiz.title}</h4>
                                <div className="flex items-center gap-5 mt-2 text-xs font-black uppercase tracking-widest text-slate-400">
                                    <span className="flex items-center gap-2"><HelpCircle className="w-3.5 h-3.5" /> {quiz.questions.length} Questions</span>
                                    <span className="w-1.5 h-1.5 bg-slate-100 rounded-full" />
                                    <span className="flex items-center gap-2"><BarChart3 className="w-3.5 h-3.5" /> {quiz.passingScore}% Passing Score</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-8 py-4 bg-slate-900 text-white rounded-[1.25rem] text-[11px] font-black uppercase tracking-[0.1em] hover:bg-black transition-all shadow-2xl shadow-slate-900/20 active:scale-95 flex items-center gap-3"
                        >
                            <Edit className="w-4 h-4" />
                            Refine Quiz
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 px-6">
                            <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Live Assessment Preview</h5>
                            <div className="flex-1 h-px bg-slate-100" />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {quiz.questions.map((q: any, idx: number) => (
                                <div key={idx} className="group bg-white p-8 rounded-[2.5rem] border border-slate-50 hover:border-slate-200 transition-all duration-300 shadow-sm flex gap-8">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-[10px] font-black text-slate-400 shadow-inner shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                                        {String(idx + 1).padStart(2, '0')}
                                    </div>
                                    <div className="flex-1 space-y-6">
                                        <p className="font-black text-slate-800 text-lg leading-relaxed tracking-tight">{q.text}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {q.options.map((opt: string, optIdx: number) => {
                                                const isCorrect = q.correctOptionIndices.includes(optIdx);
                                                return (
                                                    <div
                                                        key={optIdx}
                                                        className={`px-5 py-3.5 rounded-2xl text-[13px] font-bold border flex items-center justify-between transition-all ${isCorrect ? "bg-emerald-50 border-emerald-100 text-emerald-800 shadow-sm" : "bg-slate-50/30 border-slate-100 text-slate-500"}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {isCorrect ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Circle className="w-4 h-4 text-slate-200" />}
                                                            {opt}
                                                        </div>
                                                        {isCorrect && <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Correct</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[4rem] bg-white/50 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="w-24 h-24 rounded-[2.5rem] bg-white flex items-center justify-center mb-8 shadow-2xl shadow-slate-200/50 border border-slate-50 group-hover:scale-110 transition-transform duration-500 z-10">
                        <HelpCircle className="w-12 h-12 text-slate-200" />
                    </div>
                    <h5 className="font-black text-slate-300 text-2xl tracking-tight z-10">No Assessment Configured</h5>
                    <p className="text-sm text-slate-400 mt-2 font-medium mb-10 text-center max-w-sm z-10">Define a series of questions to validate student knowledge and unlock the next module.</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-orange-500/30 transition-all active:scale-95 flex items-center gap-3 z-10"
                    >
                        <Plus className="w-4 h-4" />
                        Initialize Quiz
                    </button>
                </div>
            )}
        </div>
    );
}

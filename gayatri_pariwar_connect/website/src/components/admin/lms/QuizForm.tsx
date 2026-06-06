"use client";

import React, { useState, useEffect } from "react";
import { useWarnUnsavedChanges } from "@/hooks/useWarnUnsavedChanges";
import {
    Save,
    X,
    Plus,
    HelpCircle,
    Trash2,
    CheckSquare,
    Circle,
    Loader2,
    Settings,
    Type,
    BarChart3,
    Hash
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { logAdminAction } from "@/lib/admin-logger";

interface Question {
    text: string;
    type: "singleChoice" | "multipleChoice" | "trueFalse";
    options: string[];
    correctOptionIndices: number[];
}

interface Quiz {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    passingScore: number;
    timeLimit?: number;
}

interface QuizFormProps {
    courseId: string;
    lessonId: string;
    initialData?: Quiz;
    onCancel: () => void;
}

export default function QuizForm({ courseId, lessonId, initialData, onCancel }: QuizFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [title, setTitle] = useState(initialData?.title || "Module Assessment");
    const [passingScore, setPassingScore] = useState(initialData?.passingScore || 70);
    const [questions, setQuestions] = useState<Question[]>(initialData?.questions || []);

    const [isDirty, setIsDirty] = useState(false);
    useWarnUnsavedChanges(isDirty);

    const addQuestion = () => {
        const newQuestion: Question = {
            text: "",
            type: "singleChoice",
            options: ["", ""],
            correctOptionIndices: [0]
        };
        setQuestions([...questions, newQuestion]);
        setIsDirty(true);
    };

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
        setIsDirty(true);
    };

    const updateQuestion = (index: number, updates: Partial<Question>) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], ...updates };
        setQuestions(newQuestions);
        setIsDirty(true);
    };

    const handleTypeChange = (index: number, type: Question["type"]) => {
        const q = questions[index];
        let options = q.options;
        let correctIndices = q.correctOptionIndices;

        if (type === "trueFalse") {
            options = ["True", "False"];
            correctIndices = [0];
        } else if (q.type === "trueFalse") {
            options = ["", ""];
            correctIndices = [0];
        }

        updateQuestion(index, { type, options, correctOptionIndices: correctIndices });
    };

    const toggleCorrectOption = (qIndex: number, optIndex: number) => {
        const q = questions[qIndex];
        let newIndices = [...q.correctOptionIndices];

        if (q.type === "singleChoice" || q.type === "trueFalse") {
            newIndices = [optIndex];
        } else {
            if (newIndices.includes(optIndex)) {
                newIndices = newIndices.filter(i => i !== optIndex);
            } else {
                newIndices.push(optIndex);
            }
        }
        updateQuestion(qIndex, { correctOptionIndices: newIndices });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (questions.length === 0) {
            alert("Please add at least one question.");
            return;
        }

        // Validate all questions have text and options
        for (const q of questions) {
            if (!q.text) { alert("All questions must have text."); return; }
            if (q.options.some(opt => !opt)) { alert("All options must have text."); return; }
            if (q.correctOptionIndices.length === 0) { alert(`Question "${q.text}" needs a correct answer.`); return; }
        }

        setIsSaving(true);
        try {
            const data = {
                title,
                passingScore,
                questions,
                lessonId,
                courseId,
                updatedAt: serverTimestamp()
            };

            if (initialData) {
                await updateDoc(doc(db, "quizzes", initialData.id), data);
                await logAdminAction({
                    action: "UPDATE",
                    collectionName: "quizzes",
                    documentId: initialData.id,
                    details: `Updated quiz: ${title}`,
                    previousData: initialData,
                    newData: data
                });
            } else {
                const docRef = doc(collection(db, "quizzes"));
                await setDoc(docRef, { ...data, createdAt: serverTimestamp() });
                await logAdminAction({
                    action: "CREATE",
                    collectionName: "quizzes",
                    documentId: docRef.id,
                    details: `Created new quiz: ${title}`
                });
            }
            setIsDirty(false);
            onCancel();
        } catch (error) {
            console.error("Error saving quiz:", error);
            alert("Failed to compile and save assessment.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12 animate-in slide-in-from-right-10 duration-500 pb-20">
            <div className="flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl py-4 z-50 border-b border-slate-100 px-2">
                <div className="flex items-center gap-6">
                    <button type="button" onClick={onCancel} className="p-3 hover:bg-slate-50 text-slate-300 hover:text-slate-600 rounded-2xl transition-all">
                        <X className="w-6 h-6" />
                    </button>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{initialData ? "Refine Assessment" : "Initialize Assessment"}</h3>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Engineering {questions.length} Question Modules</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4 bg-slate-50/50 px-6 py-3 rounded-2xl border border-slate-100 shadow-inner">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-orange-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passing Threshold</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <input
                                type="number"
                                value={passingScore}
                                onChange={(e) => { setPassingScore(Number(e.target.value)); setIsDirty(true); }}
                                className="w-12 bg-transparent text-lg font-black text-slate-900 outline-none text-right"
                            />
                            <span className="text-lg font-black text-slate-800">%</span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-orange-500/20 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Commit Changes
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
                <div className="space-y-3 bg-slate-50/30 p-8 rounded-[2.5rem] border border-slate-100">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Assessment Identifier (Internal)</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
                        className="w-full bg-white border border-slate-200 rounded-[1.25rem] py-5 px-8 text-xl font-black tracking-tight outline-none focus:ring-4 focus:ring-orange-500/5 shadow-sm transition-all"
                    />
                </div>

                <div className="space-y-8">
                    {questions.map((q, idx) => (
                        <div key={idx} className="group relative bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/30 p-12 space-y-10 animate-in zoom-in-95 duration-300">
                            <button
                                type="button"
                                onClick={() => removeQuestion(idx)}
                                className="absolute top-10 right-10 p-3 text-slate-100 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-6 h-6" />
                            </button>

                            <div className="flex items-start gap-8">
                                <div className="w-16 h-16 rounded-3xl bg-slate-900 text-white flex items-center justify-center text-lg font-black shadow-2xl shadow-slate-900/10 shrink-0">
                                    {String(idx + 1).padStart(2, '0')}
                                </div>
                                <div className="flex-1 pt-2">
                                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Question Prompt</h4>
                                    <textarea
                                        value={q.text}
                                        onChange={(e) => updateQuestion(idx, { text: e.target.value })}
                                        placeholder="Formulate the inquiry..."
                                        className="w-full text-2xl font-black text-slate-900 bg-transparent border-none outline-none placeholder:text-slate-100 resize-none min-h-[60px]"
                                        rows={2}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                        <Settings className="w-4 h-4 text-slate-300" /> Structure
                                    </h5>
                                    <div className="grid grid-cols-1 gap-2.5">
                                        {(["singleChoice", "multipleChoice", "trueFalse"] as const).map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => handleTypeChange(idx, type)}
                                                className={`py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-left border transition-all ${q.type === type ? "bg-slate-900 border-slate-800 text-white shadow-2xl shadow-slate-900/10" : "bg-slate-50/50 text-slate-400 border-slate-100 hover:bg-white hover:text-slate-600 hover:border-slate-200"}`}
                                            >
                                                {type.replace(/([A-Z])/g, ' $1').trim()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                            <Type className="w-4 h-4 text-slate-300" /> Responses
                                        </h5>
                                        {q.type !== "trueFalse" && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    updateQuestion(idx, { options: [...q.options, ""] });
                                                }}
                                                className="text-[9px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition-all"
                                            >
                                                + Add Response
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        {q.options.map((opt, optIdx) => {
                                            const isCorrect = q.correctOptionIndices.includes(optIdx);
                                            return (
                                                <div key={optIdx} className="group/opt flex items-center gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleCorrectOption(idx, optIdx)}
                                                        className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all shrink-0 ${isCorrect ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20" : "bg-white border-slate-100 group-hover/opt:border-orange-200"}`}
                                                    >
                                                        {isCorrect ? <CheckSquare className="w-5 h-5" /> : <Circle className="w-5 h-5 text-slate-100" />}
                                                    </button>
                                                    <div className="flex-1 relative">
                                                        <input
                                                            type="text"
                                                            value={opt}
                                                            onChange={(e) => {
                                                                const newOpts = [...q.options];
                                                                newOpts[optIdx] = e.target.value;
                                                                updateQuestion(idx, { options: newOpts });
                                                            }}
                                                            disabled={q.type === "trueFalse"}
                                                            placeholder={`Response Option ${optIdx + 1}`}
                                                            className={`w-full bg-slate-50/50 border border-slate-50 rounded-2xl px-5 py-3.5 text-xs font-bold transition-all focus:ring-4 focus:ring-orange-500/5 focus:bg-white focus:border-orange-100 outline-none ${isCorrect ? "text-emerald-700 font-black pr-20" : "text-slate-600"}`}
                                                        />
                                                        {isCorrect && (
                                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-100/50 px-2 py-1 rounded">Correct</span>
                                                        )}
                                                    </div>
                                                    {q.type !== "trueFalse" && q.options.length > 2 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newOpts = q.options.filter((_, i) => i !== optIdx);
                                                                const newCorrectIndices = q.correctOptionIndices.filter(i => i !== optIdx).map(i => i > optIdx ? i - 1 : i);
                                                                updateQuestion(idx, { options: newOpts, correctOptionIndices: newCorrectIndices });
                                                            }}
                                                            className="p-2 text-slate-200 hover:text-red-500 opacity-0 group-hover/opt:opacity-100 transition-all rounded-lg hover:bg-red-50"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addQuestion}
                        className="w-full py-16 border-2 border-dashed border-slate-200 rounded-[4rem] hover:border-orange-500/30 hover:bg-orange-50/10 transition-all group flex flex-col items-center justify-center gap-4 bg-white/30 backdrop-blur-sm"
                    >
                        <div className="w-16 h-16 rounded-[2rem] bg-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-orange-500 group-hover:text-white group-hover:rotate-90 group-hover:shadow-2xl group-hover:shadow-orange-500/20 transition-all duration-500">
                            <Plus className="w-8 h-8" />
                        </div>
                        <div className="text-center">
                            <span className="text-xs font-black text-slate-400 group-hover:text-orange-600 uppercase tracking-[0.2em] transition-colors">Append Assessment Module</span>
                            <p className="text-[10px] text-slate-300 font-bold mt-1 group-hover:text-orange-400 transition-colors">Multiple choice or True/False format</p>
                        </div>
                    </button>
                </div>
            </div>
        </form>
    );
}

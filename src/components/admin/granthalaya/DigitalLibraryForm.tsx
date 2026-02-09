"use client";

import { useState, useRef, useEffect } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Save, FileText, ImageIcon, Loader2, BookOpen, CheckCircle2, X, FileMinus, FileCheck } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface DigitalBook {
    id?: string;
    title: string;
    author: string;
    category: string;
    description: string;
    coverUrl?: string;
    pdfUrl: string;
    isActive: boolean;
}

interface DigitalLibraryFormProps {
    initialData?: Partial<DigitalBook>;
    onSave: (data: Partial<DigitalBook>) => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
}

const CATEGORIES = ["General", "E-Books", "Audio Books", "Magazines", "Guidelines", "Youth Content"];

export default function DigitalLibraryForm({ initialData, onSave, onCancel, isSaving }: DigitalLibraryFormProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [author, setAuthor] = useState(initialData?.author || "");
    const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
    const [description, setDescription] = useState(initialData?.description || "");
    const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl || "");
    const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl || "");
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

    const [uploadingFile, setUploadingFile] = useState<"cover" | "pdf" | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDark, setIsDark] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const saved = localStorage.getItem('admin-theme');
        if (saved === 'dark') setIsDark(true);
        else if (saved === 'system') setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "cover" | "pdf") => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (type === "cover" && !file.type.startsWith("image/")) {
            showToast("Please select an image for the cover", "error");
            return;
        }
        if (type === "pdf" && file.type !== "application/pdf") {
            showToast("Please select a PDF file", "error");
            return;
        }

        setUploadingFile(type);
        setUploadProgress(0);

        try {
            const timestamp = Date.now();
            const path = type === "cover" ? `granthalaya/digital/covers/${timestamp}_${file.name}` : `granthalaya/digital/pdfs/${timestamp}_${file.name}`;
            const storageRef = ref(storage, path);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on("state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error("Upload error:", error);
                    showToast(`Failed to upload ${type}`, "error");
                    setUploadingFile(null);
                },
                async () => {
                    const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                    if (type === "cover") setCoverUrl(downloadUrl);
                    else setPdfUrl(downloadUrl);
                    setUploadingFile(null);
                    showToast(`${type === 'pdf' ? 'PDF' : 'Cover'} uploaded successfully`, "success");
                }
            );
        } catch (error) {
            console.error("Upload error:", error);
            showToast("Critical upload error", "error");
            setUploadingFile(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pdfUrl) {
            showToast("PDF file is required", "error");
            return;
        }
        await onSave({ title, author, category, description, coverUrl, pdfUrl, isActive });
    };

    const inputClasses = `w-full rounded-xl py-3 px-4 outline-none transition-all focus:ring-2 focus:ring-blue-500/50 ${isDark
        ? 'bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500'
        : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500'
        }`;

    const labelClasses = `text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`;
    const cardClasses = `p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-6`;

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-32 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Metadata */}
                <div className="lg:col-span-2 space-y-6">
                    <div className={cardClasses}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label className={labelClasses}>Title *</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={`${inputClasses} text-lg font-bold`}
                                    placeholder="Enter digital resource title..."
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Author / Contributor</label>
                                <input
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    className={inputClasses}
                                    placeholder="Author name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className={inputClasses}
                                >
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className={labelClasses}>Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={5}
                                    className={`${inputClasses} resize-none`}
                                    placeholder="Tell users about this resource..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className={cardClasses}>
                        <h3 className="text-sm font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            PDF Content
                        </h3>
                        <div className="space-y-4">
                            {pdfUrl ? (
                                <div className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                                            <FileCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-blue-600">PDF Linked Successfully</p>
                                            <p className="text-[10px] text-blue-500 uppercase tracking-widest font-bold">Ready to publish</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setPdfUrl("")}
                                        className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <label className={`flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${uploadingFile === 'pdf' ? 'opacity-50 pointer-events-none' : isDark ? 'bg-slate-800/20 border-slate-700 hover:border-blue-500' : 'bg-slate-50 border-slate-200 hover:border-blue-500 hover:bg-blue-50/30'
                                    }`}>
                                    <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(e, "pdf")} />
                                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                        <FileMinus className="w-8 h-8" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold">Upload PDF File</p>
                                        <p className="text-xs text-slate-500 mt-1">Maximum size: 50MB</p>
                                    </div>
                                </label>
                            )}

                            {uploadingFile === "pdf" && (
                                <div className="space-y-2">
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                    </div>
                                    <p className="text-[10px] font-bold text-center text-slate-500 uppercase">Uploading PDF... {Math.round(uploadProgress)}%</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Imagery & Status */}
                <div className="space-y-6">
                    <div className={cardClasses}>
                        <h3 className={labelClasses}>Cover Preview</h3>
                        <div className={`aspect-[3/4] rounded-2xl border-2 border-dashed overflow-hidden flex flex-col items-center justify-center transition-all ${isDark ? 'bg-slate-800/20 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                            {coverUrl ? (
                                <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="w-12 h-12 text-slate-300" />
                            )}
                        </div>
                        <input type="file" accept="image/*" className="hidden" id="cover-input" onChange={(e) => handleFileUpload(e, "cover")} />
                        <label
                            htmlFor="cover-input"
                            className={`w-full py-3 rounded-xl border font-bold text-sm text-center cursor-pointer transition-all ${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 shadow-sm hover:bg-slate-50'}`}
                        >
                            {coverUrl ? 'Change Cover' : 'Upload Cover'}
                        </label>
                    </div>

                    <div className={cardClasses}>
                        <h3 className={labelClasses}>Visibility</h3>
                        <button
                            type="button"
                            onClick={() => setIsActive(!isActive)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${isActive
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                                : isDark
                                    ? "bg-slate-800 border-slate-700 text-slate-500"
                                    : "bg-slate-50 border-slate-200 text-slate-500"
                                }`}
                        >
                            <div className="flex flex-col items-start">
                                <span className="text-xs font-bold uppercase">Public Access</span>
                                <span className="text-[10px] opacity-60">{isActive ? 'Available to App Users' : 'Restricted / Hidden'}</span>
                            </div>
                            {isActive && <CheckCircle2 className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Sticky Actions */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-8 z-50">
                <div className={`backdrop-blur-xl border p-4 rounded-[2rem] shadow-2xl flex items-center gap-4 ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white/90 border-slate-200'}`}>
                    <button type="button" onClick={onCancel} className="flex-1 py-4 rounded-2xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">Cancel</button>
                    <button
                        type="submit"
                        disabled={isSaving || !!uploadingFile}
                        className="flex-[2] py-4 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {initialData?.id ? 'Update Resource' : 'Publish Resource'}
                    </button>
                </div>
            </div>
        </form>
    );
}

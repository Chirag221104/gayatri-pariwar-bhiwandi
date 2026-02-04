"use client";

import { useState, useRef } from "react";
import {
    X,
    Upload,
    FileText,
    ImageIcon,
    AlertCircle,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { storage, db, auth } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore";
import { logAdminAction } from "@/lib/admin-logger";

interface MediaUploadProps {
    isOpen: boolean;
    onClose: () => void;
    currentFolderId: string | null;
}

interface UploadTask {
    file: File;
    progress: number;
    status: "waiting" | "uploading" | "completed" | "error";
    id: string;
}

export default function MediaUpload({ isOpen, onClose, currentFolderId }: MediaUploadProps) {
    const [tasks, setTasks] = useState<UploadTask[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return;

        const newTasks: UploadTask[] = Array.from(selectedFiles).map((file) => ({
            file,
            progress: 0,
            status: "waiting",
            id: Math.random().toString(36).substring(7),
        }));

        setTasks((prev) => [...prev, ...newTasks]);
    };

    const startUploads = async () => {
        const pendingTasks = tasks.filter(t => t.status === "waiting");

        for (const task of pendingTasks) {
            updateTaskStatus(task.id, "uploading");

            const storagePath = `media_library/${Date.now()}_${task.file.name}`;
            const storageRef = ref(storage, storagePath);
            const uploadTask = uploadBytesResumable(storageRef, task.file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    updateTaskProgress(task.id, progress);
                },
                (error) => {
                    console.error("Upload error detailed:", error);
                    updateTaskStatus(task.id, "error");
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                        // Save metadata to Firestore
                        const fileType = task.file.type.startsWith('image/') ? 'image' :
                            task.file.type.startsWith('video/') ? 'video' :
                                task.file.type.startsWith('audio/') ? 'audio' : 'document';

                        const fileData = {
                            name: task.file.name,
                            url: downloadURL,
                            type: fileType,
                            mimeType: task.file.type,
                            sizeBytes: task.file.size,
                            storagePath,
                            folderId: currentFolderId,
                            uploadedBy: auth.currentUser?.email,
                            uploadedAt: serverTimestamp(),
                        };

                        const docRef = await addDoc(collection(db, "storage_files"), fileData);

                        // Update folder file count if in a folder
                        if (currentFolderId) {
                            await updateDoc(doc(db, "storage_folders", currentFolderId), {
                                fileCount: increment(1),
                                updatedAt: serverTimestamp()
                            });
                        }

                        await logAdminAction({
                            action: "CREATE",
                            collectionName: "storage_files",
                            documentId: docRef.id,
                            details: `Uploaded media: ${task.file.name}`,
                        });

                        updateTaskStatus(task.id, "completed");
                    } catch (e) {
                        console.error("Metadata save error:", e);
                        updateTaskStatus(task.id, "error");
                    }
                }
            );
        }
    };

    const updateTaskProgress = (id: string, progress: number) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, progress } : t));
    };

    const updateTaskStatus = (id: string, status: UploadTask["status"]) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    };

    const removeTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    if (!isOpen) return null;

    const isUploading = tasks.some(t => t.status === "uploading");
    const allDone = tasks.length > 0 && tasks.every(t => t.status === "completed" || t.status === "error");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => !isUploading && onClose()}></div>

            {/* Modal */}
            <div className="relative bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <Upload className="w-5 h-5 text-orange-500" />
                            Upload Media
                        </h2>
                        <p className="text-xs text-slate-500">Add images and documents to your library</p>
                    </div>
                    {!isUploading && (
                        <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full transition-all">
                            <X className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                    {/* Drop Zone */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${isDragging
                            ? "border-orange-500 bg-orange-500/5 scale-[0.99]"
                            : "border-slate-800 hover:border-slate-700 bg-slate-900/50"
                            }`}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => handleFiles(e.target.files)}
                            className="hidden"
                            multiple
                            accept="image/*,application/pdf"
                        />
                        <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Upload className={`w-8 h-8 ${isDragging ? "text-orange-500" : "text-slate-600"}`} />
                        </div>
                        <h3 className="text-white font-bold mb-1">Click or drag files here</h3>
                        <p className="text-slate-500 text-xs">Support for JPG, PNG, WEBP, and PDF (Max 10MB per file)</p>
                    </div>

                    {/* Task List */}
                    {tasks.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Upload Queue</h4>
                                <button
                                    onClick={() => setTasks([])}
                                    disabled={isUploading}
                                    className="text-[10px] text-orange-500 font-bold hover:underline disabled:opacity-50"
                                >
                                    Clear All
                                </button>
                            </div>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {tasks.map((task) => (
                                    <div key={task.id} className="bg-slate-900 border border-slate-800/50 p-3 rounded-xl flex items-center gap-4 transition-all">
                                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                            {task.file.type.startsWith("image/") ? <ImageIcon className="w-5 h-5 text-blue-400" /> : <FileText className="w-5 h-5 text-emerald-400" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-white font-medium truncate">{task.file.name}</span>
                                                <span className="text-[10px] text-slate-500">{(task.file.size / (1024 * 1024)).toFixed(2)} MB</span>
                                            </div>
                                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${task.status === "error" ? "bg-red-500" :
                                                        task.status === "completed" ? "bg-emerald-500" : "bg-orange-500"
                                                        }`}
                                                    style={{ width: `${task.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="shrink-0 flex items-center gap-2">
                                            {task.status === "completed" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                            {task.status === "error" && <AlertCircle className="w-4 h-4 text-red-500" />}
                                            {task.status === "uploading" && <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />}
                                            {(task.status === "waiting" || task.status === "error") && (
                                                <button onClick={() => removeTask(task.id)} className="p-1 hover:bg-slate-800 rounded">
                                                    <X className="w-3.5 h-3.5 text-slate-500 hover:text-white" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/30 flex items-center justify-between gap-4">
                    <button
                        disabled={isUploading}
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-slate-800 text-slate-400 font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                        {allDone ? "Close" : "Cancel"}
                    </button>
                    {!allDone && (
                        <button
                            onClick={startUploads}
                            disabled={tasks.length === 0 || isUploading}
                            className={`px-8 py-2.5 rounded-xl text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg ${tasks.length === 0 || isUploading
                                ? "bg-slate-800 text-slate-600 shadow-none cursor-not-allowed"
                                : "bg-orange-500 hover:bg-orange-400 shadow-orange-500/20 active:scale-95"
                                }`}
                        >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            Start Upload ({tasks.filter(t => t.status === "waiting").length})
                        </button>
                    )}
                    {allDone && (
                        <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold animate-in fade-in slide-in-from-right-2">
                            <CheckCircle2 className="w-5 h-5" />
                            Upload Session Complete
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
            `}</style>
        </div>
    );
}

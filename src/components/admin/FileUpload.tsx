"use client";

import { useState, useRef } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Loader2, Upload, FileText, Music, Video, Image as ImageIcon, File, X } from "lucide-react";

interface FileUploadProps {
    onUpload: (url: string) => void;
    folder?: string;
    className?: string;
    label?: string;
    accept?: string;
    description?: string;
    isDark?: boolean;
    currentValue?: string;
}

export default function FileUpload({
    onUpload,
    folder = "uploads",
    className = "",
    label = "Upload File",
    accept = "*/*",
    description = "Drag & drop or click to upload",
    isDark = false,
    currentValue
}: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getFileIcon = () => {
        if (accept.includes("image")) return <ImageIcon className={`w-8 h-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />;
        if (accept.includes("audio")) return <Music className={`w-8 h-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />;
        if (accept.includes("video")) return <Video className={`w-8 h-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />;
        if (accept.includes("pdf")) return <FileText className={`w-8 h-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />;
        return <File className={`w-8 h-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />;
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setProgress(0);

        try {
            // Create a unique filename
            const timestamp = Date.now();
            const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const storageRef = ref(storage, `${folder}/${filename}`);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progress);
                },
                (error) => {
                    console.error("Upload error:", error);
                    alert("Failed to upload file.");
                    setUploading(false);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    onUpload(downloadURL);
                    setUploading(false);
                    // Reset input
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                }
            );
        } catch (error) {
            console.error("Error starting upload:", error);
            setUploading(false);
        }
    };

    return (
        <div className={`space-y-3 ${className}`}>
            <label className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                {label}
            </label>

            {currentValue ? (
                <div className={`relative flex items-center gap-4 p-4 rounded-xl border group ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}>
                    <div className="p-3 bg-orange-500/10 rounded-lg">
                        {getFileIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            File Uploaded
                        </p>
                        <a
                            href={currentValue}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-orange-500 hover:text-orange-400 truncate block mt-0.5"
                        >
                            {currentValue}
                        </a>
                    </div>
                    <button
                        type="button"
                        onClick={() => onUpload("")}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
                            }`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className={`cursor-pointer group relative overflow-hidden transition-all border-2 border-dashed rounded-xl ${isDark
                            ? 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept={accept}
                        className="hidden"
                    />

                    <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
                        {uploading ? (
                            <div className="space-y-3 w-full max-w-[120px]">
                                <div className="flex justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                                </div>
                                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-orange-500 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {Math.round(progress)}%
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className={`p-4 rounded-full transition-colors ${isDark ? 'bg-slate-800 group-hover:bg-slate-700' : 'bg-slate-100 group-hover:bg-slate-200'
                                    }`}>
                                    <Upload className={`w-6 h-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                                <div className="space-y-1">
                                    <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        {description}
                                    </p>
                                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {accept === '*/*' ? 'All files supported' : `${accept.replace('/*', '').toUpperCase()} files supported`}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

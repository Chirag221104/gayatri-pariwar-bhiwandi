"use client";

import { useState, useRef } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Loader2, Upload, Image as ImageIcon, X } from "lucide-react";

interface ImageUploadProps {
    onUpload: (url: string) => void;
    folder?: string;
    className?: string;
    description?: string;
    isDark?: boolean;
}

export default function ImageUpload({ onUpload, folder = "uploads", className = "", description = "Click to upload image", isDark = false }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                    alert("Failed to upload image.");
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
        <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`cursor-pointer group relative overflow-hidden transition-all border-2 border-dashed rounded-xl ${isDark
                    ? 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                } ${className}`}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
            />

            <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
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
                        <div className={`p-3 rounded-full transition-colors ${isDark ? 'bg-slate-800 group-hover:bg-slate-700' : 'bg-slate-100 group-hover:bg-slate-200'
                            }`}>
                            <Upload className={`w-6 h-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                        </div>
                        <div className="space-y-1">
                            <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                {description}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                JPG, PNG, WEBP up to 5MB
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

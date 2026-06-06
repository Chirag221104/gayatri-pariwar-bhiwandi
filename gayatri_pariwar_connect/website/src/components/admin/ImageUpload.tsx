"use client";

import { useState, useRef } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Loader2, Upload, Image as ImageIcon, X } from "lucide-react";

interface ImageUploadProps {
    onUpload?: (url: string) => void;
    onUploadMultiple?: (urls: string[]) => void;
    folder?: string;
    className?: string;
    description?: string;
    isDark?: boolean;
    multiple?: boolean;
}

export default function ImageUpload({ 
    onUpload, 
    onUploadMultiple,
    folder = "uploads", 
    className = "", 
    description = "Click or drag & drop to upload", 
    isDark = false,
    multiple = false
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFiles = async (files: FileList | File[]) => {
        if (!files || files.length === 0) return;

        setUploading(true);
        setProgress(0);

        try {
            const filesArray = Array.from(files);
            const urls: string[] = [];
            
            let completed = 0;

            for (const file of filesArray) {
                const timestamp = Date.now();
                const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
                const storageRef = ref(storage, `${folder}/${filename}`);

                const uploadTask = uploadBytesResumable(storageRef, file);

                await new Promise<void>((resolve, reject) => {
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            // Calculate total progress across all files
                            setProgress(((completed * 100) + p) / filesArray.length);
                        },
                        (error) => {
                            console.error("Upload error:", error);
                            reject(error);
                        },
                        async () => {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            urls.push(downloadURL);
                            if (onUpload && !multiple) {
                                onUpload(downloadURL);
                            }
                            completed++;
                            resolve();
                        }
                    );
                });
            }

            if (multiple && onUploadMultiple) {
                onUploadMultiple(urls);
            }

            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error("Error starting upload:", error);
            alert("Failed to upload image(s).");
            setUploading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(e.target.files);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!uploading) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        if (uploading) return;
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
            if (files.length > 0) {
                processFiles(multiple ? files : [files[0]]);
            }
        }
    };

    return (
        <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`cursor-pointer group relative overflow-hidden transition-all border-2 border-dashed rounded-xl ${
                isDragging 
                    ? 'border-orange-500 bg-orange-500/10' 
                    : isDark
                        ? 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                } ${className}`}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                multiple={multiple}
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
                        <div className={`p-3 rounded-full transition-colors ${isDragging ? 'bg-orange-500/20' : isDark ? 'bg-slate-800 group-hover:bg-slate-700' : 'bg-slate-100 group-hover:bg-slate-200'
                            }`}>
                            <Upload className={`w-6 h-6 ${isDragging ? 'text-orange-500' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                        </div>
                        <div className="space-y-1">
                            <p className={`text-sm font-medium ${isDragging ? 'text-orange-500' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>
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

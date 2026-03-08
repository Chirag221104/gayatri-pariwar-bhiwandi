"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    X, Save, Plus, Trash2, GripVertical,
    Music, Video, Play, Pause, ChevronDown,
    ChevronRight, Languages, Clock, AlertCircle,
    Flame, ArrowUp, ArrowDown, Upload, Loader2
} from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { doc, setDoc, addDoc, collection, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { logAdminAction } from "@/lib/admin-logger";

interface RitualSegment {
    id: string;
    start: number;
    end: number;
    text: {
        sanskrit: string;
        hindi: string;
        translit: string;
        meaning: string;
    };
}

interface RitualStep {
    id: string;
    order: number;
    instruction: string;
    repeatCount: number;
    isManualOnly: boolean;
    segments: RitualSegment[];
}

interface RitualStage {
    id: string;
    order: number;
    title: string;
    steps: RitualStep[];
}

interface RitualData {
    id?: string;
    title: string;
    description: string;
    mediaUrl: string;
    mediaType: "audio" | "video";
    status: "draft" | "published";
    version: number;
    duration: number;
    stages: RitualStage[];
}

const GAYATRI_YAGYA_TEMPLATE: Partial<RitualData> = {
    title: "Gayatri Yagya (1 Kundi)",
    description: "Standard 1 Kundi Yagya procedure following Gayatri Pariwar traditions. Precision mapping required.",
    stages: [
        {
            id: "stage-purification",
            title: "Preparatory (Atma-Shodhan)",
            order: 1,
            steps: [
                { id: "step-pavitri", order: 1, instruction: "Pavitrikaran (External Purification)", repeatCount: 1, isManualOnly: false, segments: [] },
                { id: "step-achaman", order: 2, instruction: "Achamana (Internal Purification)", repeatCount: 3, isManualOnly: false, segments: [] },
                { id: "step-shikha", order: 3, instruction: "Shikha Vandan", repeatCount: 1, isManualOnly: false, segments: [] },
                { id: "step-pranayama", order: 4, instruction: "Pranayama (Mental Balance)", repeatCount: 3, isManualOnly: false, segments: [] },
                { id: "step-nyasa", order: 5, instruction: "Nyasa (Sense Charging)", repeatCount: 1, isManualOnly: false, segments: [] }
            ]
        },
        {
            id: "stage-invocation",
            title: "Invocation (Deva-Avahanam)",
            order: 2,
            steps: [
                { id: "step-guru", order: 1, instruction: "Guru Avahanam", repeatCount: 1, isManualOnly: false, segments: [] },
                { id: "step-gayatri", order: 2, instruction: "Gayatri Avahanam", repeatCount: 1, isManualOnly: false, segments: [] }
            ]
        },
        {
            id: "stage-fire",
            title: "Agni-Sthapana (Fire Ritual)",
            order: 3,
            steps: [
                { id: "step-agni-praj", order: 1, instruction: "Agni Prajvalanam (Lighting)", repeatCount: 1, isManualOnly: false, segments: [] },
                { id: "step-samidha", order: 2, instruction: "Samidhadhanam (Offering Wood)", repeatCount: 1, isManualOnly: false, segments: [] }
            ]
        },
        {
            id: "stage-main",
            title: "Main Offering (Gayatri Mantra Ahuti)",
            order: 4,
            steps: [
                { id: "step-mantra", order: 1, instruction: "Main Gayatri Mantra Chanting", repeatCount: 24, isManualOnly: false, segments: [] }
            ]
        },
        {
            id: "stage-conclusion",
            title: "Conclusion (Purnahuti)",
            order: 5,
            steps: [
                { id: "step-purna", order: 1, instruction: "Purnahuti Ahuti", repeatCount: 1, isManualOnly: false, segments: [] },
                { id: "step-aarti", order: 2, instruction: "Aarti & Shanti Path", repeatCount: 1, isManualOnly: false, segments: [] }
            ]
        }
    ]
};

interface RitualFormProps {
    initialData?: any;
    onCancel: () => void;
}

export default function RitualForm({ initialData, onCancel }: RitualFormProps) {
    const [formData, setFormData] = useState<RitualData>({
        title: initialData?.title || "",
        description: initialData?.description || "",
        mediaUrl: initialData?.mediaUrl || "",
        mediaType: initialData?.mediaType || "audio",
        status: initialData?.status || "draft",
        version: initialData?.version || 1,
        duration: initialData?.duration || 0,
        stages: initialData?.stages || []
    });

    const [loading, setLoading] = useState(false);
    const [activeStageId, setActiveStageId] = useState<string | null>(null);
    const [isDark, setIsDark] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hoverTime, setHoverTime] = useState<number | null>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const mediaInputRef = useRef<HTMLInputElement>(null);
    const [showDeleteMedia, setShowDeleteMedia] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [localPreviewUrl, setLocalPreviewUrl] = useState<string>('');

    // Cleanup object URL on unmount or when file changes
    useEffect(() => {
        return () => {
            if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
        };
    }, [localPreviewUrl]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Revoke previous preview URL
        if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
        const previewUrl = URL.createObjectURL(file);
        setPendingFile(file);
        setLocalPreviewUrl(previewUrl);
        // Clear the existing firebase URL since we have a new local file
        setFormData(p => ({ ...p, mediaUrl: '' }));
        if (mediaInputRef.current) mediaInputRef.current.value = '';
    };

    const handleDeleteMedia = async () => {
        setDeleting(true);
        try {
            // If there's a Firebase URL, delete from storage
            if (formData.mediaUrl && formData.mediaUrl.includes('firebasestorage')) {
                const url = new URL(formData.mediaUrl);
                const pathMatch = url.pathname.match(/\/o\/(.+?)(?:\?|$)/);
                if (pathMatch) {
                    const storagePath = decodeURIComponent(pathMatch[1]);
                    const fileRef = ref(storage, storagePath);
                    await deleteObject(fileRef);
                }
            }
        } catch (error) {
            console.error('Error deleting media file:', error);
        } finally {
            // Clear everything
            setFormData(p => ({ ...p, mediaUrl: '', duration: 0 }));
            if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
            setLocalPreviewUrl('');
            setPendingFile(null);
            if (mediaInputRef.current) mediaInputRef.current.value = '';
            if (audioRef.current) {
                audioRef.current.pause();
                setIsPlaying(false);
                setCurrentTime(0);
            }
            setDeleting(false);
            setShowDeleteMedia(false);
        }
    };

    useEffect(() => {
        const checkDark = () => {
            const saved = localStorage.getItem('admin-theme');
            if (saved === 'dark') {
                setIsDark(true);
            } else if (saved === 'system') {
                setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
            } else {
                setIsDark(false);
            }
        };
        checkDark();
        const interval = setInterval(checkDark, 500);
        return () => clearInterval(interval);
    }, []);

    // Form logic, validation, and hierarchical CRUD will go here...

    const handleSave = async () => {
        setLoading(true);
        try {
            let mediaUrl = formData.mediaUrl;

            // Upload pending file to Firebase Storage first
            if (pendingFile) {
                setUploading(true);
                setUploadProgress(0);
                const folder = formData.mediaType === 'video' ? 'rituals/videos' : 'rituals/audios';
                const timestamp = Date.now();
                const filename = `${timestamp}_${pendingFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
                const storageRef = ref(storage, `${folder}/${filename}`);

                const uploadTask = uploadBytesResumable(storageRef, pendingFile);

                mediaUrl = await new Promise<string>((resolve, reject) => {
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setUploadProgress(progress);
                        },
                        (error) => reject(error),
                        async () => {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve(downloadURL);
                        }
                    );
                });
                setUploading(false);
                setPendingFile(null);
                if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
                setLocalPreviewUrl('');
            }

            const dataToSave = {
                ...formData,
                mediaUrl,
                updatedAt: serverTimestamp(),
                createdAt: initialData?.id ? initialData.createdAt : serverTimestamp()
            };

            if (initialData?.id) {
                await setDoc(doc(db, "rituals", initialData.id), dataToSave);
                await logAdminAction({
                    action: "UPDATE",
                    collectionName: "rituals",
                    documentId: initialData.id,
                    details: `Updated ritual: ${formData.title}`
                });
            } else {
                const docRef = await addDoc(collection(db, "rituals"), dataToSave);
                await logAdminAction({
                    action: "CREATE",
                    collectionName: "rituals",
                    documentId: docRef.id,
                    details: `Created ritual: ${formData.title}`
                });
            }
            onCancel();
        } catch (error) {
            console.error("Error saving ritual:", error);
            setUploading(false);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 10);
        return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
    };

    const grabTiming = (sIdx: number, stIdx: number, segIdx: number, type: 'start' | 'end') => {
        if (!audioRef.current) return;
        const time = parseFloat(audioRef.current.currentTime.toFixed(1));
        const newStages = [...formData.stages];
        newStages[sIdx].steps[stIdx].segments[segIdx][type] = time;
        setFormData({ ...formData, stages: newStages });
    };

    const validateRitual = () => {
        const errors: string[] = [];
        formData.stages.forEach(stage => {
            stage.steps.forEach(step => {
                step.segments.forEach((seg, idx) => {
                    if (seg.start >= seg.end) {
                        errors.push(`Segment in ${stage.title} has start time >= end time.`);
                    }
                    if (idx > 0) {
                        const prev = step.segments[idx - 1];
                        if (seg.start < prev.end) {
                            errors.push(`Overlap detected in ${stage.title}: Segment starts before previous ends.`);
                        }
                    }
                });
            });
        });
        return errors;
    };

    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    useEffect(() => {
        setValidationErrors(validateRitual());
    }, [formData.stages]);

    const moveStage = (idx: number, dir: 'up' | 'down') => {
        const newStages = [...formData.stages];
        const newIdx = dir === 'up' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= newStages.length) return;
        [newStages[idx], newStages[newIdx]] = [newStages[newIdx], newStages[idx]];
        setFormData({ ...formData, stages: newStages });
    };

    const moveStep = (sIdx: number, stIdx: number, dir: 'up' | 'down') => {
        const newStages = [...formData.stages];
        const steps = [...newStages[sIdx].steps];
        const newIdx = dir === 'up' ? stIdx - 1 : stIdx + 1;
        if (newIdx < 0 || newIdx >= steps.length) return;
        [steps[stIdx], steps[newIdx]] = [steps[newIdx], steps[stIdx]];
        newStages[sIdx].steps = steps;
        setFormData({ ...formData, stages: newStages });
    };

    return (
        <div className={`flex flex-col h-full overflow-hidden ${isDark ? 'bg-zinc-950' : 'bg-slate-50'}`}>
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between z-30 shadow-sm ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
                }`}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onCancel}
                        className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-slate-100 text-slate-500'}`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {initialData?.id ? "Edit Ritual" : "New Ritual"}
                        </h2>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {!initialData?.id && (
                        <button
                            onClick={() => setFormData({ ...formData, ...GAYATRI_YAGYA_TEMPLATE })}
                            className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-4 py-2.5 rounded-xl font-bold transition-all"
                        >
                            <Flame className="w-4 h-4" />
                            Load 1 Kundi Template
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? "Saving..." : "Save Ritual"}
                    </button>
                </div>
            </div>

            {/* Sticky Player Bar */}
            <div className={`p-4 flex items-center justify-between sticky top-[80px] z-20 shadow-xl border-y ${isDark ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-white text-slate-900 border-slate-200'
                }`}>
                <div className="flex items-center gap-6 flex-1 max-w-4xl mx-auto">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                if (!audioRef.current) return;
                                if (audioRef.current.paused) {
                                    audioRef.current.play();
                                } else {
                                    audioRef.current.pause();
                                }
                            }}
                            className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-all shrink-0 active:scale-90 text-white"
                        >
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        </button>
                        <div className="flex flex-col">
                            <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Live Preview</span>
                            <span className="text-sm font-mono text-orange-500">{formatTime(currentTime)}</span>
                        </div>
                    </div>

                    <div
                        ref={progressBarRef}
                        className={`flex-1 h-2 rounded-full relative group cursor-pointer overflow-visible ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`}
                        onClick={(e) => {
                            if (!audioRef.current || !progressBarRef.current) return;
                            const rect = progressBarRef.current.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const pct = Math.max(0, Math.min(1, x / rect.width));
                            audioRef.current.currentTime = pct * (formData.duration || 0);
                            setCurrentTime(audioRef.current.currentTime);
                        }}
                        onMouseMove={(e) => {
                            if (!progressBarRef.current) return;
                            const rect = progressBarRef.current.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const pct = Math.max(0, Math.min(1, x / rect.width));
                            setHoverTime(pct * (formData.duration || 0));
                        }}
                        onMouseLeave={() => setHoverTime(null)}
                    >
                        <div
                            className="absolute inset-y-0 left-0 bg-orange-500 rounded-full transition-all duration-100"
                            style={{ width: `${(currentTime / (formData.duration || 1)) * 100}%` }}
                        />
                        {/* Hover tooltip */}
                        {hoverTime !== null && (
                            <div
                                className={`absolute -top-8 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap pointer-events-none z-30 ${isDark ? 'bg-zinc-700 text-white' : 'bg-slate-700 text-white'}`}
                                style={{ left: `${(hoverTime / (formData.duration || 1)) * 100}%` }}
                            >
                                {formatTime(hoverTime)}
                            </div>
                        )}
                        {/* Hover indicator line */}
                        {hoverTime !== null && (
                            <div
                                className="absolute inset-y-0 w-0.5 bg-white/50 pointer-events-none"
                                style={{ left: `${(hoverTime / (formData.duration || 1)) * 100}%` }}
                            />
                        )}
                    </div>

                    <span className={`text-sm font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{formatTime(formData.duration)}</span>

                    {(formData.mediaUrl || localPreviewUrl) && (
                        formData.mediaType === 'audio' ? (
                            <audio
                                ref={audioRef}
                                src={localPreviewUrl || formData.mediaUrl}
                                onTimeUpdate={(e) => { const t = e.currentTarget?.currentTime ?? 0; setCurrentTime(t); }}
                                onLoadedMetadata={(e) => { const d = e.currentTarget?.duration ?? 0; setFormData(p => ({ ...p, duration: d })); }}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onEnded={() => setIsPlaying(false)}
                                className="hidden"
                            />
                        ) : (
                            <video
                                ref={audioRef as any}
                                src={localPreviewUrl || formData.mediaUrl}
                                onTimeUpdate={(e) => { const t = e.currentTarget?.currentTime ?? 0; setCurrentTime(t); }}
                                onLoadedMetadata={(e) => { const d = e.currentTarget?.duration ?? 0; setFormData(p => ({ ...p, duration: d })); }}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onEnded={() => setIsPlaying(false)}
                                className="hidden"
                            />
                        )
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6 lg:p-8 space-y-8 scrollbar-hide">
                {/* Basic Metadata Section */}
                <section className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className={`text-sm font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Ritual Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Gayatri Yagya (Standard)"
                                className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className={`text-sm font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Media Type</label>
                            <div className={`flex p-1 rounded-xl w-fit ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                                <button
                                    onClick={() => setFormData({ ...formData, mediaType: "audio", mediaUrl: '' })}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${formData.mediaType === "audio" ? (isDark ? "bg-zinc-700 shadow-sm text-orange-500" : "bg-white shadow-sm text-orange-500") : "text-slate-500"}`}
                                >
                                    <Music className="w-4 h-4" /> Audio
                                </button>
                                <button
                                    onClick={() => setFormData({ ...formData, mediaType: "video", mediaUrl: '' })}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${formData.mediaType === "video" ? (isDark ? "bg-zinc-700 shadow-sm text-emerald-500" : "bg-white shadow-sm text-emerald-500") : "text-slate-500"}`}
                                >
                                    <Video className="w-4 h-4" /> Video
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className={`text-sm font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>Status</label>
                            <div className={`flex p-1 rounded-xl w-fit ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                                <button
                                    onClick={() => setFormData({ ...formData, status: "draft" })}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${formData.status === "draft" ? (isDark ? "bg-zinc-700 shadow-sm text-amber-500" : "bg-white shadow-sm text-amber-500") : "text-slate-500"}`}
                                >
                                    Draft
                                </button>
                                <button
                                    onClick={() => setFormData({ ...formData, status: "published" })}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${formData.status === "published" ? (isDark ? "bg-zinc-700 shadow-sm text-emerald-500" : "bg-white shadow-sm text-emerald-500") : "text-slate-500"}`}
                                >
                                    Published
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`text-sm font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                            {formData.mediaType === 'audio' ? 'Upload Audio' : 'Upload Video'}
                        </label>
                        <input
                            type="file"
                            ref={mediaInputRef}
                            onChange={handleFileSelect}
                            accept={formData.mediaType === 'audio' ? 'audio/*' : 'video/*'}
                            className="hidden"
                        />

                        {(formData.mediaUrl || pendingFile) ? (
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-slate-50 border-slate-200'}`}>
                                <div className={`p-2 rounded-lg ${formData.mediaType === 'audio' ? 'bg-orange-500/10 text-orange-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                    {formData.mediaType === 'audio' ? <Music className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {pendingFile ? pendingFile.name : (formData.mediaType === 'audio' ? 'Audio file uploaded' : 'Video file uploaded')}
                                    </p>
                                    <p className={`text-xs truncate font-mono ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                                        {pendingFile
                                            ? `${(pendingFile.size / (1024 * 1024)).toFixed(1)} MB · Will upload on save`
                                            : formData.mediaUrl.split('/').pop()?.split('?')[0]
                                        }
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteMedia(true)}
                                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => mediaInputRef.current?.click()}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-orange-500 hover:bg-orange-500/10 transition-colors"
                                >
                                    Replace
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => mediaInputRef.current?.click()}
                                className={`p-6 rounded-xl border-2 border-dashed cursor-pointer group transition-all ${isDark
                                    ? 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/50'
                                    : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <div className={`p-3 rounded-full transition-colors ${isDark ? 'bg-zinc-900 group-hover:bg-zinc-800' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                                        <Upload className={`w-6 h-6 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`} />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                                            Click to upload {formData.mediaType === 'audio' ? 'audio' : 'video'}
                                        </p>
                                        <p className={`text-xs mt-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                                            {formData.mediaType === 'audio' ? 'MP3, WAV, OGG up to 50MB' : 'MP4, WEBM up to 200MB'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <hr className="border-slate-100 dark:border-zinc-800" />

                {/* Hierarchical Script Editor */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Ritual Hierarchy</h3>
                            <p className="text-sm text-slate-500">Stages → Steps → Timed Segments</p>
                        </div>
                        <button
                            onClick={() => {
                                const newStage: RitualStage = {
                                    id: Math.random().toString(36).substr(2, 9),
                                    order: formData.stages.length + 1,
                                    title: "New Stage",
                                    steps: []
                                };
                                setFormData({ ...formData, stages: [...formData.stages, newStage] });
                            }}
                            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-bold text-sm transition-all"
                        >
                            <Plus className="w-4 h-4" /> Add Stage
                        </button>
                    </div>

                    {/* Placeholder for stages list - will be implemented in detail next */}
                    <div className="space-y-4">
                        {formData.stages.length === 0 ? (
                            <div className="p-12 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-center">
                                <AlertCircle className="w-10 h-10 text-slate-300 mb-4" />
                                <p className="text-slate-500 dark:text-zinc-500">No ritual stages defined yet.</p>
                                <p className="text-xs text-slate-400">Add a stage like "Pavatrikaran" or "Agnihotra" to start.</p>
                            </div>
                        ) : (
                            formData.stages.map((stage, sIdx) => (
                                <div key={stage.id} className="border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                                    <div className="p-4 bg-slate-50 dark:bg-zinc-800/50 flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col gap-1 mr-2">
                                                <button
                                                    onClick={() => moveStage(sIdx, 'up')}
                                                    disabled={sIdx === 0}
                                                    className="p-1 text-slate-400 hover:text-orange-500 disabled:opacity-30"
                                                >
                                                    <ArrowUp className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={() => moveStage(sIdx, 'down')}
                                                    disabled={sIdx === formData.stages.length - 1}
                                                    className="p-1 text-slate-400 hover:text-orange-500 disabled:opacity-30"
                                                >
                                                    <ArrowDown className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <input
                                                value={stage.title}
                                                onChange={(e) => {
                                                    const newStages = [...formData.stages];
                                                    newStages[sIdx].title = e.target.value;
                                                    setFormData({ ...formData, stages: newStages });
                                                }}
                                                className="bg-transparent font-bold text-slate-700 dark:text-white outline-none focus:ring-1 focus:ring-orange-500/20 rounded px-1"
                                            />
                                        </div>
                                        <button
                                            onClick={() => {
                                                const newStages = formData.stages.filter(s => s.id !== stage.id);
                                                setFormData({ ...formData, stages: newStages });
                                            }}
                                            className="p-2 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {/* Step Management inside stage */}
                                    <div className="p-4 space-y-4 bg-white dark:bg-zinc-900">
                                        {stage.steps.map((step, stIdx) => (
                                            <div key={step.id} className="border border-slate-100 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                                                <div className="p-3 bg-slate-50/50 dark:bg-zinc-800/30 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col mr-1">
                                                            <button
                                                                onClick={() => moveStep(sIdx, stIdx, 'up')}
                                                                disabled={stIdx === 0}
                                                                className="text-slate-400 hover:text-orange-500 disabled:opacity-30"
                                                            >
                                                                <ArrowUp className="w-2.5 h-2.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => moveStep(sIdx, stIdx, 'down')}
                                                                disabled={stIdx === stage.steps.length - 1}
                                                                className="text-slate-400 hover:text-orange-500 disabled:opacity-30"
                                                            >
                                                                <ArrowDown className="w-2.5 h-2.5" />
                                                            </button>
                                                        </div>
                                                        <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-zinc-700 text-[10px] font-bold flex items-center justify-center text-slate-600 dark:text-zinc-400">
                                                            {stIdx + 1}
                                                        </span>
                                                        <input
                                                            value={step.instruction}
                                                            onChange={(e) => {
                                                                const newStages = [...formData.stages];
                                                                newStages[sIdx].steps[stIdx].instruction = e.target.value;
                                                                setFormData({ ...formData, stages: newStages });
                                                            }}
                                                            placeholder="Step instruction (e.g. Sip water 3 times)"
                                                            className="bg-transparent text-sm font-semibold text-slate-600 dark:text-zinc-200 placeholder:text-slate-400 outline-none w-[300px]"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Manual Only</span>
                                                            <input
                                                                type="checkbox"
                                                                checked={step.isManualOnly}
                                                                onChange={(e) => {
                                                                    const newStages = [...formData.stages];
                                                                    newStages[sIdx].steps[stIdx].isManualOnly = e.target.checked;
                                                                    setFormData({ ...formData, stages: newStages });
                                                                }}
                                                                className="w-4 h-4 rounded-md border-slate-300 text-orange-500 focus:ring-orange-500/20 transition-all"
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Repeats</span>
                                                            <input
                                                                type="number"
                                                                value={step.repeatCount}
                                                                onChange={(e) => {
                                                                    const newStages = [...formData.stages];
                                                                    newStages[sIdx].steps[stIdx].repeatCount = parseInt(e.target.value);
                                                                    setFormData({ ...formData, stages: newStages });
                                                                }}
                                                                className="w-12 px-2 py-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded text-xs font-bold"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const newStages = [...formData.stages];
                                                                newStages[sIdx].steps = newStages[sIdx].steps.filter(s => s.id !== step.id);
                                                                setFormData({ ...formData, stages: newStages });
                                                            }}
                                                            className="text-slate-300 hover:text-red-500 transition-all"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Segments (The timed mantras) */}
                                                <div className="p-4 space-y-3 bg-white dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800/50">
                                                    {step.segments.map((segment, segIdx) => {
                                                        const isLive = currentTime >= segment.start && currentTime <= segment.end;
                                                        return (
                                                            <div
                                                                key={segment.id}
                                                                className={`grid grid-cols-12 gap-4 p-4 rounded-2xl transition-all duration-300 ${isLive
                                                                    ? 'bg-orange-500/10 border-orange-500/30 ring-1 ring-orange-500/20'
                                                                    : 'bg-slate-50 dark:bg-zinc-800/30 border-transparent'
                                                                    } border`}
                                                            >
                                                                <div className="col-span-3 flex flex-col gap-3 pt-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2">
                                                                            <Clock className={`w-3 h-3 ${isLive ? 'text-orange-500' : 'text-slate-400'}`} />
                                                                            <span className={`text-[10px] font-bold uppercase ${isLive ? 'text-orange-500' : 'text-slate-500'}`}>
                                                                                {isLive ? 'LIVE' : 'Timing'}
                                                                            </span>
                                                                        </div>
                                                                        {isLive && <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />}
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <input
                                                                                type="number"
                                                                                step="0.1"
                                                                                value={segment.start}
                                                                                onChange={(e) => {
                                                                                    const newStages = [...formData.stages];
                                                                                    newStages[sIdx].steps[stIdx].segments[segIdx].start = parseFloat(e.target.value);
                                                                                    setFormData({ ...formData, stages: newStages });
                                                                                }}
                                                                                className="w-full px-2 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-mono"
                                                                            />
                                                                            <button
                                                                                onClick={() => grabTiming(sIdx, stIdx, segIdx, 'start')}
                                                                                className="p-2 bg-slate-200 dark:bg-zinc-700 hover:bg-orange-500 hover:text-white rounded-lg transition-all"
                                                                                title="Set Current Time"
                                                                            >
                                                                                <Plus className="w-3.5 h-3.5" />
                                                                            </button>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <input
                                                                                type="number"
                                                                                step="0.1"
                                                                                value={segment.end}
                                                                                onChange={(e) => {
                                                                                    const newStages = [...formData.stages];
                                                                                    newStages[sIdx].steps[stIdx].segments[segIdx].end = parseFloat(e.target.value);
                                                                                    setFormData({ ...formData, stages: newStages });
                                                                                }}
                                                                                className="w-full px-2 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-mono"
                                                                            />
                                                                            <button
                                                                                onClick={() => grabTiming(sIdx, stIdx, segIdx, 'end')}
                                                                                className="p-2 bg-slate-200 dark:bg-zinc-700 hover:bg-orange-500 hover:text-white rounded-lg transition-all"
                                                                                title="Set Current Time"
                                                                            >
                                                                                <Plus className="w-3.5 h-3.5" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-span-8 space-y-4">
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div className="space-y-1">
                                                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Sanskrit</label>
                                                                            <textarea
                                                                                value={segment.text.sanskrit}
                                                                                onChange={(e) => {
                                                                                    const newStages = [...formData.stages];
                                                                                    newStages[sIdx].steps[stIdx].segments[segIdx].text.sanskrit = e.target.value;
                                                                                    setFormData({ ...formData, stages: newStages });
                                                                                }}
                                                                                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                                                                                rows={1}
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Transliteration</label>
                                                                            <textarea
                                                                                value={segment.text.translit}
                                                                                onChange={(e) => {
                                                                                    const newStages = [...formData.stages];
                                                                                    newStages[sIdx].steps[stIdx].segments[segIdx].text.translit = e.target.value;
                                                                                    setFormData({ ...formData, stages: newStages });
                                                                                }}
                                                                                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                                                                                rows={1}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div className="space-y-1">
                                                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Hindi</label>
                                                                            <textarea
                                                                                value={segment.text.hindi}
                                                                                onChange={(e) => {
                                                                                    const newStages = [...formData.stages];
                                                                                    newStages[sIdx].steps[stIdx].segments[segIdx].text.hindi = e.target.value;
                                                                                    setFormData({ ...formData, stages: newStages });
                                                                                }}
                                                                                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                                                                                rows={1}
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Meaning</label>
                                                                            <textarea
                                                                                value={segment.text.meaning}
                                                                                onChange={(e) => {
                                                                                    const newStages = [...formData.stages];
                                                                                    newStages[sIdx].steps[stIdx].segments[segIdx].text.meaning = e.target.value;
                                                                                    setFormData({ ...formData, stages: newStages });
                                                                                }}
                                                                                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                                                                                rows={1}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-span-1 flex items-center justify-center pt-6">
                                                                    <button
                                                                        onClick={() => {
                                                                            const newStages = [...formData.stages];
                                                                            newStages[sIdx].steps[stIdx].segments = newStages[sIdx].steps[stIdx].segments.filter(s => s.id !== segment.id);
                                                                            setFormData({ ...formData, stages: newStages });
                                                                        }}
                                                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}

                                                    <button
                                                        onClick={() => {
                                                            const newStages = [...formData.stages];
                                                            const lastSeg = step.segments[step.segments.length - 1];
                                                            const nextStart = lastSeg ? lastSeg.end : 0;

                                                            const newSegment: RitualSegment = {
                                                                id: Math.random().toString(36).substr(2, 9),
                                                                start: nextStart,
                                                                end: nextStart + 5.0,
                                                                text: { sanskrit: "", hindi: "", translit: "", meaning: "" }
                                                            };
                                                            newStages[sIdx].steps[stIdx].segments.push(newSegment);
                                                            setFormData({ ...formData, stages: newStages });
                                                        }}
                                                        className="w-full py-2 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-400 hover:text-orange-500 hover:border-orange-500/30 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Languages className="w-3 h-3" /> Add Timed Mantra Segment
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={() => {
                                                const newStages = [...formData.stages];
                                                const newStep: RitualStep = {
                                                    id: Math.random().toString(36).substr(2, 9),
                                                    order: stage.steps.length + 1,
                                                    instruction: "New Step",
                                                    repeatCount: 1,
                                                    isManualOnly: false,
                                                    segments: []
                                                };
                                                newStages[sIdx].steps.push(newStep);
                                                setFormData({ ...formData, stages: newStages });
                                            }}
                                            className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-emerald-500 transition-all uppercase tracking-widest pl-4"
                                        >
                                            <Plus className="w-3 h-3" /> Add Step to Stage
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>

            {/* Upload Progress Overlay */}
            {uploading && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className={`p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                            <div className="w-full">
                                <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`}>
                                    <div
                                        className="h-full bg-orange-500 transition-all duration-300 rounded-full"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Uploading {formData.mediaType}... {Math.round(uploadProgress)}%
                            </p>
                            <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Please wait, saving ritual...</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteMedia && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className={`p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                                <Trash2 className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Remove Media?</h3>
                                <p className={`text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                                    {formData.mediaUrl
                                        ? 'This will permanently delete the file from storage.'
                                        : 'This will remove the selected file.'}
                                </p>
                            </div>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setShowDeleteMedia(false)}
                                    className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteMedia}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    {deleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}

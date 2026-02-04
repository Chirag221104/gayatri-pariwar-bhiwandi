import { useState, useEffect } from "react";
import { useWarnUnsavedChanges } from "@/hooks/useWarnUnsavedChanges";
import {
    Save,
    X,
    BookOpen,
    Video,
    FileText,
    Link as LinkIcon,
    Image as ImageIcon,
    Loader2,
    Trash2,
    Tag,
    Music
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import FileUpload from "@/components/admin/FileUpload";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { logAdminAction } from "@/lib/admin-logger";

interface SpiritualResource {
    id: string;
    title: string;
    description: string;
    type: string;
    category: string;
    url: string;
    thumbnail?: string;
    status: string;
}

interface ResourceFormProps {
    initialData?: SpiritualResource;
    onCancel: () => void;
}

const RESOURCE_TYPES = ["book", "audio", "bhajan", "video", "picture"];
const CATEGORIES = ["Philosophy", "Meditation", "Sadhana", "Life Management", "Social Service", "Scientific Spirituality"];

export default function ResourceForm({ initialData, onCancel }: ResourceFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [type, setType] = useState(initialData?.type || "book");
    const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
    const [url, setUrl] = useState(initialData?.url || "");
    const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");
    const [status, setStatus] = useState(initialData?.status || "active");

    const [isDirty, setIsDirty] = useState(false);
    useWarnUnsavedChanges(isDirty);

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
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const data = {
                title,
                description,
                type,
                category,
                url,
                thumbnail,
                status,
                updatedAt: serverTimestamp()
            };

            if (initialData) {
                await updateDoc(doc(db, "spiritual_content", "resources", "items", initialData.id), data);
                await logAdminAction({
                    action: "UPDATE",
                    collectionName: "resources",
                    documentId: initialData.id,
                    details: `Updated resource: ${title}`,
                    previousData: initialData,
                    newData: data
                });
            } else {
                const docRef = await addDoc(collection(db, "spiritual_content", "resources", "items"), {
                    ...data,
                    createdAt: serverTimestamp()
                });
                await logAdminAction({
                    action: "CREATE",
                    collectionName: "resources",
                    documentId: docRef.id,
                    details: `Created new resource: ${title}`
                });
            }
            setIsDirty(false);
            onCancel();
        } catch (error) {
            console.error("Error saving resource:", error);
            alert("Failed to save resource");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!initialData || !confirm("Delete this resource?")) return;
        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, "spiritual_content", "resources", "items", initialData.id));
            await logAdminAction({
                action: "DELETE",
                collectionName: "resources",
                documentId: initialData.id,
                details: `Deleted resource: ${initialData.title}`,
                previousData: initialData
            });
            onCancel();
        } catch (error) {
            alert("Delete failed");
        } finally {
            setIsDeleting(false);
        }
    };

    const getFileAcceptType = () => {
        switch (type) {
            case 'book': return '.pdf';
            case 'audio':
            case 'bhajan': return 'audio/*';
            case 'video': return 'video/*';
            case 'picture': return 'image/*';
            default: return '*/*';
        }
    };

    const inputClasses = `w-full rounded-2xl py-4 px-5 outline-none transition-all focus:ring-2 focus:ring-orange-500/50 ${isDark
            ? 'bg-slate-900 border-none text-white placeholder:text-slate-500'
            : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500'
        }`;

    return (
        <form onSubmit={handleSubmit} className={`flex flex-col h-full border-t animate-in slide-in-from-bottom-5 duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto space-y-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className={`text-2xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                <BookOpen className="w-6 h-6 text-orange-500" />
                                {initialData ? "Edit Resource" : "Create New Resource"}
                            </h2>
                            <p className="text-slate-500 text-sm">Expand the digital library for spiritual seekers</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {initialData && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-colors"
                                >
                                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                </button>
                            )}
                            <button type="button" onClick={onCancel} className={`p-3 rounded-2xl transition-colors ${isDark ? 'text-slate-500 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-200'
                                }`}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-6">
                            <div className={`p-6 rounded-3xl border space-y-6 ${isDark ? 'bg-slate-800/20 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'
                                }`}>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Knowledge Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
                                        required
                                        placeholder="Title of the book, video, or article..."
                                        className={inputClasses}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => { setDescription(e.target.value); setIsDirty(true); }}
                                        required
                                        rows={6}
                                        className={`${inputClasses} resize-none leading-relaxed`}
                                        placeholder="Briefly explain what this resource covers..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className={`p-6 rounded-3xl border space-y-4 ${isDark ? 'bg-slate-800/20 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'
                                    }`}>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <LinkIcon className="w-3 h-3 text-blue-500" /> Resource Content
                                    </label>

                                    <FileUpload
                                        onUpload={(uploadedUrl) => {
                                            setUrl(uploadedUrl);
                                            setIsDirty(true);
                                        }}
                                        label="Upload File"
                                        accept={getFileAcceptType()}
                                        folder="resources"
                                        isDark={isDark}
                                        currentValue={url}
                                        description={`Upload ${type} file`}
                                    />

                                    <div className="pt-2">
                                        <input
                                            type="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="Or paste external URL..."
                                            className={`w-full bg-transparent border-none text-xs outline-none ${isDark ? 'text-slate-500 placeholder:text-slate-600' : 'text-slate-600 placeholder:text-slate-400'
                                                }`}
                                        />
                                    </div>
                                </div>

                                <div className={`p-6 rounded-3xl border space-y-4 ${isDark ? 'bg-slate-800/20 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'
                                    }`}>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <ImageIcon className="w-3 h-3 text-emerald-500" /> Thumbnail
                                    </label>

                                    {thumbnail ? (
                                        <div className={`relative aspect-video rounded-xl overflow-hidden border group ${isDark ? 'border-slate-700' : 'border-slate-200'
                                            }`}>
                                            <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => { setThumbnail(""); setIsDirty(true); }}
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                            >
                                                <X className="w-6 h-6 text-white" />
                                            </button>
                                        </div>
                                    ) : (
                                        <ImageUpload
                                            onUpload={(url) => {
                                                setThumbnail(url);
                                                setIsDirty(true);
                                            }}
                                            folder="resources"
                                            isDark={isDark}
                                            description="Cover Image"
                                            className="h-32"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className={`p-6 rounded-3xl border space-y-6 ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'
                                }`}>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Type</label>
                                    <div className="flex flex-col gap-2">
                                        {RESOURCE_TYPES.map(t => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setType(t)}
                                                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all border ${type === t
                                                        ? "bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/20"
                                                        : isDark
                                                            ? "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                                                            : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                                                    }`}
                                            >
                                                {t === 'book' && <BookOpen className="w-4 h-4" />}
                                                {t === 'audio' && <Music className="w-4 h-4" />}
                                                {t === 'bhajan' && <Music className="w-4 h-4" />}
                                                {t === 'video' && <Video className="w-4 h-4" />}
                                                {t === 'picture' && <ImageIcon className="w-4 h-4" />}
                                                <span className="capitalize">{t}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Tag className="w-3 h-3" /> Category
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className={`w-full rounded-xl py-3 px-4 outline-none appearance-none cursor-pointer ${isDark
                                                ? 'bg-slate-900 border-none text-slate-200'
                                                : 'bg-white border border-slate-200 text-slate-900'
                                            }`}
                                    >
                                        {CATEGORIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Visibility</label>
                                    <div className="flex gap-2">
                                        {["active", "draft"].map(s => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setStatus(s)}
                                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${status === s
                                                        ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                                                        : isDark
                                                            ? "bg-slate-900 border-slate-800 text-slate-600 hover:text-slate-400"
                                                            : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600"
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`p-8 backdrop-blur-xl border-t z-30 ${isDark ? 'bg-slate-900/90 border-white/5' : 'bg-white/90 border-slate-200'
                }`}>
                <div className="max-w-4xl mx-auto flex gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className={`flex-1 px-10 py-4 rounded-2xl font-bold transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                    >
                        Back to Library
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-[2] px-10 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white font-bold transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {initialData ? "Save Global Update" : "Publish to Resource Library"}
                    </button>
                </div>
            </div>
        </form>
    );
}

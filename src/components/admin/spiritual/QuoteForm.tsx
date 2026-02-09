import { useState, useEffect } from "react";
import { useWarnUnsavedChanges } from "@/hooks/useWarnUnsavedChanges";
import {
    Save,
    X,
    Calendar,
    User,
    Image as ImageIcon,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Globe
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { logAdminAction } from "@/lib/admin-logger";

interface DailyQuote {
    id: string;
    text: string;
    textHi?: string;
    textMr?: string;
    textGu?: string;
    author: string;
    date: string;
    imageUrl?: string;
    tithi?: string;
    status: string;
}

interface QuoteFormProps {
    initialData?: DailyQuote;
    onCancel: () => void;
}

type LangTab = "en" | "hi" | "mr" | "gu";

export default function QuoteForm({ initialData, onCancel }: QuoteFormProps) {
    const [activeLang, setActiveLang] = useState<LangTab>("en");
    const [isSaving, setIsSaving] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const [text, setText] = useState(initialData?.text || "");
    const [textHi, setTextHi] = useState(initialData?.textHi || "");
    const [textMr, setTextMr] = useState(initialData?.textMr || "");
    const [textGu, setTextGu] = useState(initialData?.textGu || "");
    const [author, setAuthor] = useState(initialData?.author || "Pt. Shriram Sharma Acharya");
    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
    const [tithi, setTithi] = useState(initialData?.tithi || "");
    const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
    const [status, setStatus] = useState(initialData?.status || "draft");

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

    // Validation
    const isLocaleComplete = text && textHi && textMr && textGu;
    const canPublish = isLocaleComplete && author && date;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === "active" && !canPublish) {
            alert("Please provide all 4 translations before publishing.");
            return;
        }

        setIsSaving(true);
        try {
            const data = {
                text,
                textHi,
                textMr,
                textGu,
                author,
                date,
                tithi,
                imageUrl,
                status,
                updatedAt: serverTimestamp()
            };

            if (initialData) {
                await updateDoc(doc(db, "spiritual_content", "daily_quotes", "items", initialData.id), data);
                await logAdminAction({
                    action: "UPDATE",
                    collectionName: "daily_quotes",
                    documentId: initialData.id,
                    details: `Updated quote for ${date}`,
                    previousData: initialData,
                    newData: data
                });
            } else {
                const docRef = await addDoc(collection(db, "spiritual_content", "daily_quotes", "items"), {
                    ...data,
                    createdAt: serverTimestamp()
                });
                await logAdminAction({
                    action: "CREATE",
                    collectionName: "daily_quotes",
                    documentId: docRef.id,
                    details: `Created new quote for ${date}`
                });
            }
            setIsDirty(false);
            onCancel();
        } catch (error) {
            console.error("Error saving quote:", error);
            alert("Failed to save quote");
        } finally {
            setIsSaving(false);
        }
    };

    const langTabs: { id: LangTab; label: string; val: string }[] = [
        { id: "en", label: "English", val: text },
        { id: "hi", label: "Hindi", val: textHi },
        { id: "mr", label: "Marathi", val: textMr },
        { id: "gu", label: "Gujarati", val: textGu },
    ];

    const inputClasses = `w-full rounded-xl py-3 px-4 outline-none transition-all focus:ring-2 focus:ring-orange-500/50 ${isDark
            ? 'bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500'
            : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500'
        }`;

    return (
        <form onSubmit={handleSubmit} className={`flex flex-col h-full border-t animate-in fade-in slide-in-from-bottom-5 duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-10">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{initialData ? "Edit Quote" : "New Daily Quote"}</h2>
                            <p className="text-slate-500 text-sm">Draft or schedule divine inspiration for the Global Sangha</p>
                        </div>
                        <button type="button" onClick={onCancel} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
                            }`}>
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Main Multi-locale Text Section */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'
                                }`}>
                                <div className={`flex border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                                    }`}>
                                    {langTabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveLang(tab.id)}
                                            className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeLang === tab.id
                                                    ? isDark
                                                        ? "bg-slate-900 text-orange-500 border-b-2 border-orange-500"
                                                        : "bg-white text-orange-600 border-b-2 border-orange-500 shadow-sm"
                                                    : "text-slate-500 hover:text-slate-400"
                                                }`}
                                        >
                                            <Globe className="w-3 h-3" />
                                            {tab.label}
                                            {tab.val && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                                        </button>
                                    ))}
                                </div>
                                <div className="p-6">
                                    <textarea
                                        value={activeLang === "en" ? text : activeLang === "hi" ? textHi : activeLang === "mr" ? textMr : textGu}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setIsDirty(true);
                                            if (activeLang === "en") setText(v);
                                            else if (activeLang === "hi") setTextHi(v);
                                            else if (activeLang === "mr") setTextMr(v);
                                            else setTextGu(v);
                                        }}
                                        rows={6}
                                        className={`w-full bg-transparent border-none text-xl md:text-2xl focus:ring-0 outline-none font-serif leading-relaxed italic ${isDark ? 'text-white placeholder:text-slate-700' : 'text-slate-900 placeholder:text-slate-300'
                                            }`}
                                        placeholder={`Enter quote in ${activeLang === 'en' ? 'English' : activeLang === 'hi' ? 'Hindi' : activeLang === 'mr' ? 'Marathi' : 'Gujarati'}...`}
                                        dir="ltr"
                                    />
                                </div>
                                {!isLocaleComplete && (
                                    <div className="px-6 py-3 bg-orange-500/5 border-t border-orange-500/10 flex items-center gap-2">
                                        <AlertCircle className="w-3 h-3 text-orange-500" />
                                        <span className="text-[10px] text-orange-500/80 uppercase font-black tracking-widest">Localization incomplete. Required for status: active.</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Author / Attribution</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="text"
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                            className={`${inputClasses} pl-10`}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Tithi / Calendar Note</label>
                                    <input
                                        type="text"
                                        value={tithi}
                                        onChange={(e) => setTithi(e.target.value)}
                                        placeholder="e.g. Shukla Paksha Ekadashi"
                                        className={inputClasses}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'
                                }`}>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                        <Calendar className="w-3 h-3" /> Scheduled Date
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className={inputClasses}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                        <ImageIcon className="w-3 h-3" /> Image (Darshan)
                                    </label>

                                    {imageUrl ? (
                                        <div className={`relative aspect-video rounded-xl overflow-hidden border group ${isDark ? 'border-slate-700' : 'border-slate-200'
                                            }`}>
                                            <img src={imageUrl} alt="Darshan" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => { setImageUrl(""); setIsDirty(true); }}
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                            >
                                                <X className="w-6 h-6 text-white" />
                                            </button>
                                        </div>
                                    ) : (
                                        <ImageUpload
                                            onUpload={(url) => {
                                                setImageUrl(url);
                                                setIsDirty(true);
                                            }}
                                            folder="daily_quotes"
                                            isDark={isDark}
                                            description="Upload Darshan"
                                            className="h-32"
                                        />
                                    )}

                                    {imageUrl && (
                                        <input
                                            type="url"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            placeholder="Or paste URL..."
                                            className={`w-full bg-transparent border-none text-xs outline-none ${isDark ? 'text-slate-500' : 'text-slate-400'
                                                }`}
                                        />
                                    )}
                                </div>

                                <div className="space-y-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setStatus("active")}
                                        className={`w-full py-3 rounded-xl text-sm font-bold transition-all border ${status === "active"
                                                ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                                                : isDark
                                                    ? "bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300"
                                                    : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600"
                                            }`}
                                    >
                                        Live Status
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStatus("draft")}
                                        className={`w-full py-3 rounded-xl text-sm font-bold transition-all border ${status === "draft"
                                                ? isDark
                                                    ? "bg-slate-700 border-slate-600 text-white"
                                                    : "bg-slate-800 text-white border-slate-700"
                                                : isDark
                                                    ? "bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300"
                                                    : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600"
                                            }`}
                                    >
                                        Draft
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className={`p-6 backdrop-blur-md border-t z-30 ${isDark ? 'bg-slate-900/80 border-white/5' : 'bg-white/80 border-slate-200'
                }`}>
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className={`px-8 py-3 rounded-xl font-bold transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                    >
                        Discard Changes
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving || (status === 'active' && !canPublish)}
                        className={`px-12 py-3 rounded-xl text-white font-bold transition-all shadow-xl flex items-center gap-2 ${canPublish
                                ? "bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 shadow-orange-500/20"
                                : status === 'active'
                                    ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500"
                                    : "bg-orange-600/50"
                            }`}
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {initialData ? "Save Global Update" : "Publish Daily Quote"}
                    </button>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                @media (prefers-color-scheme: dark) {
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
                }
            `}</style>
        </form>
    );
}

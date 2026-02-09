"use client";

import { useState, useEffect } from "react";
import { useWarnUnsavedChanges } from "@/hooks/useWarnUnsavedChanges";
import {
    Save,
    X,
    Tag,
    Image as ImageIcon,
    Loader2,
    Trash2,
    Clock,
    CheckCircle2,
    Star,
    Search,
    User,
    Phone
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { Timestamp, collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface NewsItem {
    id: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    imageUrl: string;
    category: string;
    isImportant: boolean;
    status: string;
    scheduledAt?: any;
    contactName?: string;
    contactPhone?: string;
    responsiblePersonId?: string | null;
    responsiblePersonName?: string;
    responsiblePersonPhone?: string;
    responsiblePersonRole?: string;
}

interface UserProfile {
    uid: string;
    name: string;
    phone?: string;
    email?: string;
    photoUrl?: string;
}

interface NewsFormProps {
    initialData?: NewsItem;
    onSave: (data: Partial<NewsItem>) => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
}

const CATEGORIES = [
    'Spiritual',
    'Events',
    'Seva',
    'Youth',
    'Notices',
    'Magazine'
];

export default function NewsForm({ initialData, onSave, onCancel, isSaving }: NewsFormProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
    const [fullDescription, setFullDescription] = useState(initialData?.fullDescription || "");
    const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
    const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
    const [isImportant, setIsImportant] = useState(initialData?.isImportant || false);
    const [status, setStatus] = useState(initialData?.status || "published");

    const initialScheduleDate = initialData?.scheduledAt
        ? (initialData.scheduledAt instanceof Timestamp ? initialData.scheduledAt.toDate() : new Date(initialData.scheduledAt))
        : new Date(Date.now() + 86400000); // Default to tomorrow

    const [scheduledDate, setScheduledDate] = useState(initialScheduleDate.toISOString().split('T')[0]);
    const [scheduledTime, setScheduledTime] = useState(initialScheduleDate.toTimeString().slice(0, 5));

    // Responsible Person State
    const [responsiblePersonMode, setResponsiblePersonMode] = useState<'select' | 'manual'>('select');
    const [responsiblePersonId, setResponsiblePersonId] = useState<string | null>(initialData?.responsiblePersonId || null);
    const [responsiblePersonName, setResponsiblePersonName] = useState(initialData?.responsiblePersonName || "");
    const [responsiblePersonPhone, setResponsiblePersonPhone] = useState(initialData?.responsiblePersonPhone || "");
    const [responsiblePersonRole, setResponsiblePersonRole] = useState(initialData?.responsiblePersonRole || "");
    const [userSearchQuery, setUserSearchQuery] = useState("");

    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const [isDirty, setIsDirty] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useWarnUnsavedChanges(isDirty);

    // Theme detection
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

    // Fetch users for responsible person selection
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const q = query(collection(db, "users"));
                const snap = await getDocs(q);
                const usersList = snap.docs.map(doc => ({
                    uid: doc.id,
                    name: doc.data().name || "Unknown",
                    phone: doc.data().phoneNumber || doc.data().phone || "",
                    email: doc.data().email || "",
                    photoUrl: doc.data().photoUrl || doc.data().photoURL || doc.data().profilePhotoUrl || ""
                }));
                setUsers(usersList);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let finalScheduledAt = null;
        if (status === "scheduled") {
            finalScheduledAt = Timestamp.fromDate(new Date(`${scheduledDate}T${scheduledTime}`));
        }

        setIsDirty(false);
        await onSave({
            title,
            shortDescription,
            fullDescription,
            imageUrl,
            category,
            isImportant,
            status,
            scheduledAt: finalScheduledAt,
            responsiblePersonId: responsiblePersonMode === 'select' ? responsiblePersonId : null,
            responsiblePersonName: responsiblePersonMode === 'manual' ? responsiblePersonName : (users.find(u => u.uid === responsiblePersonId)?.name || ""),
            responsiblePersonPhone: responsiblePersonMode === 'manual' ? responsiblePersonPhone : (users.find(u => u.uid === responsiblePersonId)?.phone || ""),
            responsiblePersonRole
        });
    };

    const selectResponsiblePerson = (user: UserProfile) => {
        setResponsiblePersonId(user.uid);
        setResponsiblePersonName(user.name);
        setResponsiblePersonPhone(user.phone || "");
        setUserSearchQuery("");
        setIsDirty(true);
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        u.phone?.includes(userSearchQuery) ||
        u.email?.toLowerCase().includes(userSearchQuery.toLowerCase())
    ).slice(0, 5);

    const inputClasses = `w-full rounded-xl py-3 px-4 outline-none transition-all focus:ring-2 focus:ring-orange-500/50 ${isDark
        ? 'bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500'
        : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500'
        }`;

    const labelClasses = `text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'
        }`;

    const cardClasses = `p-6 rounded-2xl space-y-6 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`;

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className={cardClasses}>
                        <div className="space-y-2">
                            <label className={labelClasses}>Headline *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
                                required
                                className={`${inputClasses} text-lg font-bold`}
                                placeholder="Enter powerful headline..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className={labelClasses}>Short Summary *</label>
                            <textarea
                                value={shortDescription}
                                onChange={(e) => { setShortDescription(e.target.value); setIsDirty(true); }}
                                required
                                rows={2}
                                className={`${inputClasses} resize-none`}
                                placeholder="Brief summary for the list view..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className={labelClasses}>Full Article Content *</label>
                            <textarea
                                value={fullDescription}
                                onChange={(e) => { setFullDescription(e.target.value); setIsDirty(true); }}
                                required
                                rows={12}
                                className={`${inputClasses} resize-none font-serif leading-relaxed`}
                                placeholder="Write the full story here..."
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    {/* Status & Publication */}
                    <div className={cardClasses}>
                        <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Publication
                        </h2>

                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() => { setStatus("published"); setIsDirty(true); }}
                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${status === "published"
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                                    : isDark
                                        ? "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200"
                                        : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                                    }`}
                            >
                                <span className="text-sm font-semibold">Published</span>
                                {status === "published" && <CheckCircle2 className="w-4 h-4" />}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setStatus("draft"); setIsDirty(true); }}
                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${status === "draft"
                                    ? isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-200 border-slate-300 text-slate-800"
                                    : isDark
                                        ? "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200"
                                        : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                                    }`}
                            >
                                <span className="text-sm font-semibold">Draft</span>
                                {status === "draft" && <CheckCircle2 className="w-4 h-4" />}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setStatus("scheduled"); setIsDirty(true); }}
                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${status === "scheduled"
                                    ? "bg-blue-500/10 border-blue-500/30 text-blue-500"
                                    : isDark
                                        ? "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200"
                                        : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                                    }`}
                            >
                                <span className="text-sm font-semibold">Scheduled</span>
                                {status === "scheduled" && <Clock className="w-4 h-4" />}
                            </button>
                        </div>

                        {status === "scheduled" && (
                            <div className="space-y-4 pt-2 animate-in slide-in-from-top-2 duration-300">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Release Date</label>
                                    <input
                                        type="date"
                                        value={scheduledDate}
                                        onChange={(e) => { setScheduledDate(e.target.value); setIsDirty(true); }}
                                        className={inputClasses}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Release Time</label>
                                    <input
                                        type="time"
                                        value={scheduledTime}
                                        onChange={(e) => { setScheduledTime(e.target.value); setIsDirty(true); }}
                                        className={inputClasses}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Responsible Contact Person */}
                    <div className={cardClasses}>
                        <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            Responsible Person
                        </h2>

                        {/* Toggle Tabs */}
                        <div className={`flex rounded-xl p-1 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <button
                                type="button"
                                onClick={() => { setResponsiblePersonMode('select'); setIsDirty(true); }}
                                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${responsiblePersonMode === 'select'
                                    ? 'bg-orange-500 text-white'
                                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Select User
                            </button>
                            <button
                                type="button"
                                onClick={() => { setResponsiblePersonMode('manual'); setIsDirty(true); }}
                                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${responsiblePersonMode === 'manual'
                                    ? 'bg-orange-500 text-white'
                                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Enter Manually
                            </button>
                        </div>

                        {responsiblePersonMode === 'select' ? (
                            <div className="space-y-3">
                                <div className="relative">
                                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                    <input
                                        type="text"
                                        value={userSearchQuery}
                                        onChange={(e) => setUserSearchQuery(e.target.value)}
                                        className={`${inputClasses} pl-10`}
                                        placeholder="Find Person"
                                    />
                                </div>

                                {responsiblePersonId && !userSearchQuery && (
                                    <>
                                        <div className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'}`}>
                                            <div className="flex items-center gap-3">
                                                {users.find(u => u.uid === responsiblePersonId)?.photoUrl ? (
                                                    <img
                                                        src={users.find(u => u.uid === responsiblePersonId)?.photoUrl}
                                                        alt=""
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-500 text-white'}`}>
                                                        {responsiblePersonName[0]}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{responsiblePersonName}</p>
                                                    <p className={`text-[10px] ${isDark ? 'text-orange-500/70' : 'text-orange-600'}`}>{users.find(u => u.uid === responsiblePersonId)?.phone || users.find(u => u.uid === responsiblePersonId)?.email}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => { setResponsiblePersonId(null); setResponsiblePersonName(""); setResponsiblePersonPhone(""); setResponsiblePersonRole(""); }}
                                                className={`p-1.5 rounded-lg transition-all ${isDark ? 'hover:bg-orange-500/20 text-orange-500' : 'hover:bg-orange-200 text-orange-600'}`}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {/* Role field for selected user */}
                                        <div className="space-y-2">
                                            <label className={labelClasses}>Role / Title</label>
                                            <input
                                                type="text"
                                                value={responsiblePersonRole}
                                                onChange={(e) => { setResponsiblePersonRole(e.target.value); setIsDirty(true); }}
                                                className={inputClasses}
                                                placeholder="e.g. Coordinator"
                                            />
                                        </div>
                                    </>
                                )}

                                {userSearchQuery && (
                                    <div className={`rounded-xl overflow-hidden border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                        {loadingUsers ? (
                                            <div className="p-4 text-center">
                                                <Loader2 className="w-5 h-5 animate-spin mx-auto text-orange-500" />
                                            </div>
                                        ) : filteredUsers.length > 0 ? (
                                            filteredUsers.map(user => (
                                                <button
                                                    key={user.uid}
                                                    type="button"
                                                    onClick={() => selectResponsiblePerson(user)}
                                                    className={`w-full flex items-center gap-3 p-3 transition-all ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                                                >
                                                    {user.photoUrl ? (
                                                        <img
                                                            src={user.photoUrl}
                                                            alt=""
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                                            {user.name[0]}
                                                        </div>
                                                    )}
                                                    <div className="text-left">
                                                        <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{user.name}</p>
                                                        <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{user.phone || user.email}</p>
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className={`p-4 text-center text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                No users found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className={labelClasses}>Contact Name</label>
                                    <input
                                        type="text"
                                        value={responsiblePersonName}
                                        onChange={(e) => { setResponsiblePersonName(e.target.value); setIsDirty(true); }}
                                        className={inputClasses}
                                        placeholder="Enter name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClasses}>Role / Title</label>
                                    <input
                                        type="text"
                                        value={responsiblePersonRole}
                                        onChange={(e) => { setResponsiblePersonRole(e.target.value); setIsDirty(true); }}
                                        className={inputClasses}
                                        placeholder="e.g. Coordinator"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={labelClasses}>Contact Phone</label>
                                    <input
                                        type="tel"
                                        value={responsiblePersonPhone}
                                        onChange={(e) => { setResponsiblePersonPhone(e.target.value); setIsDirty(true); }}
                                        className={inputClasses}
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className={cardClasses}>
                        <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Metadata
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className={labelClasses}>Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => { setCategory(e.target.value); setIsDirty(true); }}
                                    className={inputClasses}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'
                                }`}>
                                <div className="flex items-center gap-2">
                                    <Star className={`w-4 h-4 ${isImportant ? "text-yellow-500 fill-yellow-500" : "text-slate-500"}`} />
                                    <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Mark as Important</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={isImportant}
                                    onChange={(e) => { setIsImportant(e.target.checked); setIsDirty(true); }}
                                    className="w-5 h-5 rounded-md border-slate-300 text-orange-500 focus:ring-orange-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className={cardClasses}>
                        <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Featured Image
                        </h2>

                        <div className="space-y-4">
                            {imageUrl ? (
                                <div className={`relative aspect-video rounded-xl overflow-hidden border group ${isDark ? 'border-slate-800' : 'border-slate-200'
                                    }`}>
                                    <img src={imageUrl} alt="Featured" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setImageUrl(""); setIsDirty(true); }}
                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                    >
                                        <Trash2 className="w-6 h-6 text-white" />
                                    </button>
                                </div>
                            ) : (
                                <ImageUpload
                                    onUpload={(url) => {
                                        setImageUrl(url);
                                        setIsDirty(true);
                                    }}
                                    folder="news"
                                    isDark={isDark}
                                    description="Upload Featured Image"
                                />
                            )}

                            {imageUrl && (
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => { setImageUrl(e.target.value); setIsDirty(true); }}
                                    className={inputClasses}
                                    placeholder="Or paste image URL..."
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Actions Bar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-8 z-30">
                <div className={`backdrop-blur-xl border rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4 ${isDark
                    ? 'bg-[#0f172a]/80 border-white/10'
                    : 'bg-white/90 border-slate-200'
                    }`}>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSaving}
                        className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${isDark
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-[2] px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white font-bold transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Publish Update
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}

"use client";

import { useState, useEffect } from "react";
import {
    Save,
    X,
    Calendar as CalendarIcon,
    MapPin,
    User,
    Phone,
    Image as ImageIcon,
    Loader2,
    Trash2,
    Folder,
    Users,
    Search,
    ChevronDown
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, where, orderBy } from "firebase/firestore";

interface GlobalEvent {
    id: string;
    title: string;
    description: string;
    location: string;
    eventDate: any;
    photos: string[];
    contactName?: string;
    contactPhone?: string;
    contactRole?: string;
    linkedMediaFolderId?: string | null;
    linkedGroupId?: string | null;
    responsiblePersonId?: string | null;
    responsiblePersonName?: string;
    responsiblePersonPhone?: string;
    responsiblePersonRole?: string;
}

interface MediaFolder {
    id: string;
    name: string;
}

interface PublicGroup {
    id: string;
    name: string;
    description?: string;
}

interface UserProfile {
    uid: string;
    name: string;
    phone?: string;
    email?: string;
    photoUrl?: string;
}

interface EventFormProps {
    initialData?: GlobalEvent;
    onSave: (data: Partial<GlobalEvent>) => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
}

export default function EventForm({ initialData, onSave, onCancel, isSaving }: EventFormProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [location, setLocation] = useState(initialData?.location || "");

    // Initialize date from Timestamp or Date string
    const initialDate = initialData?.eventDate
        ? (initialData.eventDate instanceof Timestamp ? initialData.eventDate.toDate() : new Date(initialData.eventDate))
        : new Date();

    const [eventDate, setEventDate] = useState(initialDate.toISOString().split('T')[0]);
    const [eventTime, setEventTime] = useState(initialDate.toTimeString().slice(0, 5));

    const [contactName, setContactName] = useState(initialData?.contactName || "");
    const [contactPhone, setContactPhone] = useState(initialData?.contactPhone || "");
    const [contactRole, setContactRole] = useState(initialData?.contactRole || "");

    const [photos, setPhotos] = useState<string[]>(initialData?.photos || []);
    const [isDirty, setIsDirty] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // New fields for missing sections
    const [linkedMediaFolderId, setLinkedMediaFolderId] = useState<string | null>(initialData?.linkedMediaFolderId || null);
    const [linkedGroupId, setLinkedGroupId] = useState<string | null>(initialData?.linkedGroupId || null);
    const [responsiblePersonMode, setResponsiblePersonMode] = useState<'select' | 'manual'>('select');
    const [responsiblePersonId, setResponsiblePersonId] = useState<string | null>(initialData?.responsiblePersonId || null);
    const [responsiblePersonName, setResponsiblePersonName] = useState(initialData?.responsiblePersonName || "");
    const [responsiblePersonPhone, setResponsiblePersonPhone] = useState(initialData?.responsiblePersonPhone || "");
    const [responsiblePersonRole, setResponsiblePersonRole] = useState(initialData?.responsiblePersonRole || "");
    const [userSearchQuery, setUserSearchQuery] = useState("");

    // Data for dropdowns
    const [mediaFolders, setMediaFolders] = useState<MediaFolder[]>([]);
    const [publicGroups, setPublicGroups] = useState<PublicGroup[]>([]);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loadingFolders, setLoadingFolders] = useState(true);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);

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

    // Fetch media folders - using storage_folders collection
    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const q = query(collection(db, "storage_folders"), orderBy("name"));
                const snap = await getDocs(q);
                const folders = snap.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name
                }));
                setMediaFolders(folders);
            } catch (error) {
                console.error("Error fetching folders:", error);
            } finally {
                setLoadingFolders(false);
            }
        };
        fetchFolders();
    }, []);

    // Fetch public groups - all groups (not filtering by discoveryStatus)
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const q = query(collection(db, "groups"), orderBy("name"));
                const snap = await getDocs(q);
                const groups = snap.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    description: doc.data().description
                }));
                setPublicGroups(groups);
            } catch (error) {
                console.error("Error fetching groups:", error);
            } finally {
                setLoadingGroups(false);
            }
        };
        fetchGroups();
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

        const combinedDate = new Date(`${eventDate}T${eventTime}`);

        await onSave({
            title,
            description,
            location,
            eventDate: Timestamp.fromDate(combinedDate),
            photos,
            contactName,
            contactPhone,
            contactRole,
            linkedMediaFolderId,
            linkedGroupId,
            responsiblePersonId: responsiblePersonMode === 'select' ? responsiblePersonId : null,
            responsiblePersonName: responsiblePersonMode === 'manual' ? responsiblePersonName : (users.find(u => u.uid === responsiblePersonId)?.name || ""),
            responsiblePersonPhone: responsiblePersonMode === 'manual' ? responsiblePersonPhone : (users.find(u => u.uid === responsiblePersonId)?.phone || ""),
            responsiblePersonRole
        });
    };

    const removePhoto = (index: number) => {
        setPhotos(photos.filter((_, i) => i !== index));
        setIsDirty(true);
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

    const cardClasses = `p-6 rounded-2xl space-y-4 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`;

    const selectClasses = `w-full rounded-xl py-3 px-4 outline-none transition-all focus:ring-2 focus:ring-orange-500/50 appearance-none cursor-pointer ${isDark
        ? 'bg-slate-800/50 border border-slate-700/50 text-white'
        : 'bg-white border border-slate-200 text-slate-900 focus:border-orange-500'
        }`;

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-6">
                    <div className={cardClasses}>
                        <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            Basic Info
                        </h2>

                        <div className="space-y-2">
                            <label className={labelClasses}>Event Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
                                required
                                className={inputClasses}
                                placeholder="e.g. Maha Shivaratri Celebration"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className={labelClasses}>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => { setDescription(e.target.value); setIsDirty(true); }}
                                rows={4}
                                className={`${inputClasses} resize-none`}
                                placeholder="Tell us about the event..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className={labelClasses}>Location *</label>
                            <div className="relative">
                                <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => { setLocation(e.target.value); setIsDirty(true); }}
                                    required
                                    className={`${inputClasses} pl-10`}
                                    placeholder="e.g. Gayatri Mandir Hall"
                                />
                            </div>
                        </div>
                    </div>

                    <div className={cardClasses}>
                        <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            Date & Time
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className={labelClasses}>Date</label>
                                <div className="relative">
                                    <CalendarIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                    <input
                                        type="date"
                                        value={eventDate}
                                        onChange={(e) => { setEventDate(e.target.value); setIsDirty(true); }}
                                        required
                                        className={`${inputClasses} pl-10`}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Time</label>
                                <input
                                    type="time"
                                    value={eventTime}
                                    onChange={(e) => { setEventTime(e.target.value); setIsDirty(true); }}
                                    required
                                    className={inputClasses}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Link to Media Folder - WHITE CARD */}
                    <div className={cardClasses}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                Link to Media Folder
                            </h2>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-500'}`}>Optional</span>
                        </div>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            Link this event to a Media folder for additional photos/videos.
                        </p>
                        <div className="relative">
                            <Folder className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                            <select
                                value={linkedMediaFolderId || ""}
                                onChange={(e) => { setLinkedMediaFolderId(e.target.value || null); setIsDirty(true); }}
                                className={`${selectClasses} pl-10`}
                            >
                                <option value="">None</option>
                                {loadingFolders ? (
                                    <option disabled>Loading...</option>
                                ) : (
                                    mediaFolders.map(folder => (
                                        <option key={folder.id} value={folder.id}>{folder.name}</option>
                                    ))
                                )}
                            </select>
                            <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        </div>
                    </div>

                    {/* Link to Public Group - WHITE CARD */}
                    <div className={cardClasses}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                Link to Public Group
                            </h2>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-500'}`}>Optional</span>
                        </div>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            Anyone can discover and request to join this group
                        </p>
                        <div className="relative">
                            <Users className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                            <select
                                value={linkedGroupId || ""}
                                onChange={(e) => { setLinkedGroupId(e.target.value || null); setIsDirty(true); }}
                                className={`${selectClasses} pl-10`}
                            >
                                <option value="">None</option>
                                {loadingGroups ? (
                                    <option disabled>Loading...</option>
                                ) : (
                                    publicGroups.map(group => (
                                        <option key={group.id} value={group.id}>{group.name}</option>
                                    ))
                                )}
                            </select>
                            <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        </div>
                    </div>
                </div>

                {/* Contact & Media */}
                <div className="space-y-6">
                    <div className={cardClasses}>
                        <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            Contact Person
                        </h2>

                        <div className="space-y-2">
                            <label className={labelClasses}>Full Name</label>
                            <div className="relative">
                                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                <input
                                    type="text"
                                    value={contactName}
                                    onChange={(e) => { setContactName(e.target.value); setIsDirty(true); }}
                                    className={`${inputClasses} pl-10`}
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className={labelClasses}>Phone</label>
                                <div className="relative">
                                    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                    <input
                                        type="tel"
                                        value={contactPhone}
                                        onChange={(e) => { setContactPhone(e.target.value); setIsDirty(true); }}
                                        className={`${inputClasses} pl-10`}
                                        placeholder="9876543210"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Role</label>
                                <input
                                    type="text"
                                    value={contactRole}
                                    onChange={(e) => { setContactRole(e.target.value); setIsDirty(true); }}
                                    className={inputClasses}
                                    placeholder="Coordinator"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Responsible Contact Person - WHITE CARD */}
                    <div className={cardClasses}>
                        <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            Responsible Contact Person
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
                                        placeholder="Find Responsible Person"
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
                                                placeholder="e.g. Event Coordinator"
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
                                        placeholder="e.g. Event Coordinator"
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

                    <div className={cardClasses}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                Photo Gallery
                            </h2>
                            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {photos.length} photos
                            </span>
                        </div>

                        <div className="space-y-4">
                            <ImageUpload
                                onUpload={(url) => {
                                    setPhotos([...photos, url]);
                                    setIsDirty(true);
                                }}
                                folder="events"
                                isDark={isDark}
                                description="Add Event Photo"
                                className="h-32"
                            />

                            {photos.length > 0 && (
                                <div className="grid grid-cols-3 gap-3 animate-in fade-in duration-500">
                                    {photos.map((url, idx) => (
                                        <div key={idx} className={`relative aspect-square rounded-xl overflow-hidden border group ${isDark ? 'border-slate-800' : 'border-slate-200'
                                            }`}>
                                            <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(idx)}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
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
                                Save Event
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}

"use client";

import { useState, useEffect } from "react";
import {
    FileText,
    ImageIcon,
    MoreVertical,
    Copy,
    ExternalLink,
    Trash2,
    Search,
    Loader2,
    Calendar,
    CheckCircle2,
    FolderPlus,
    Folder,
    ChevronLeft,
    ChevronRight,
    Edit2,
    X,
    Check
} from "lucide-react";
import { storage, db } from "@/lib/firebase";
import { ref, deleteObject } from "firebase/storage";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    deleteDoc,
    addDoc,
    updateDoc,
    serverTimestamp,
    where,
    increment,
    getDocs,
    writeBatch
} from "firebase/firestore";
import { logAdminAction } from "@/lib/admin-logger";
import { useToast } from "@/components/ui/Toast";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

interface MediaFile {
    id: string;
    name: string;
    url: string;
    type: string;
    mimeType?: string;
    sizeBytes: number;
    uploadedAt: any;
    folderId?: string | null;
    uploadedBy?: string;
}

interface MediaFolder {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: any;
}

interface MediaGridProps {
    currentFolderId: string | null;
    onFolderChange: (folderId: string | null) => void;
}

export default function MediaGrid({ currentFolderId, onFolderChange }: MediaGridProps) {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [folders, setFolders] = useState<MediaFolder[]>([]);
    const [navigationPath, setNavigationPath] = useState<{ id: string, name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"all" | "image" | "document">("all");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [editingItem, setEditingItem] = useState<{ id: string, name: string, type: 'file' | 'folder' } | null>(null);
    const { showToast } = useToast();
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        isDestructive?: boolean;
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
    });

    // Fetch Folders and Files in current directory
    useEffect(() => {
        setLoading(true);

        // Query Folders
        const fq = query(
            collection(db, "storage_folders"),
            where("parentId", "==", currentFolderId),
            orderBy("name", "asc")
        );

        const unsubscribeFolders = onSnapshot(fq, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as MediaFolder[];
            setFolders(data);
        });

        // Query Files
        const flq = query(
            collection(db, "storage_files"),
            where("folderId", "==", currentFolderId || null),
            orderBy("uploadedAt", "desc")
        );

        const unsubscribeFiles = onSnapshot(flq, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as MediaFile[];
            setFiles(data);
            setLoading(false);
        });

        return () => {
            unsubscribeFolders();
            unsubscribeFiles();
        };
    }, [currentFolderId]);

    const [currentFolderName, setCurrentFolderName] = useState<string | null>(null);

    // Fetch Current Folder Name
    useEffect(() => {
        if (!currentFolderId) {
            setCurrentFolderName(null);
            return;
        }

        const fetchFolder = async () => {
            const folderDoc = await getDocs(query(collection(db, "storage_folders"), where("__name__", "==", currentFolderId)));
            if (!folderDoc.empty) {
                setCurrentFolderName(folderDoc.docs[0].data().name);
            }
        };
        fetchFolder();
    }, [currentFolderId]);

    // Fetch Folders and Files in current directory

    const handleCreateFolder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;

        try {
            const docRef = await addDoc(collection(db, "storage_folders"), {
                name: newFolderName,
                parentId: currentFolderId,
                createdAt: serverTimestamp()
            });

            await logAdminAction({
                action: "CREATE",
                collectionName: "storage_folders",
                documentId: docRef.id,
                details: `Created folder: ${newFolderName}`
            });

            setNewFolderName("");
            setIsCreatingFolder(false);
            showToast("Folder created successfully", "success");
        } catch (error) {
            showToast("Failed to create folder", "error");
        }
    };

    const handleRename = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem || !editingItem.name.trim()) return;

        try {
            const collectionName = editingItem.type === 'file' ? "storage_files" : "storage_folders";
            await updateDoc(doc(db, collectionName, editingItem.id), {
                name: editingItem.name,
                updatedAt: serverTimestamp()
            });

            await logAdminAction({
                action: "UPDATE",
                collectionName,
                documentId: editingItem.id,
                details: `Renamed ${editingItem.type}: ${editingItem.name}`
            });

            setEditingItem(null);
            showToast("Item renamed successfully", "success");
        } catch (error) {
            showToast("Rename failed", "error");
        }
    };

    const deleteFolderRecursively = async (folderId: string) => {
        // 1. Get all files in this folder
        const filesQuery = query(collection(db, "storage_files"), where("folderId", "==", folderId));
        const filesSnap = await getDocs(filesQuery);

        for (const fileDoc of filesSnap.docs) {
            const data = fileDoc.data();
            // Delete from storage if path exists
            if (data.storagePath) {
                try {
                    await deleteObject(ref(storage, data.storagePath));
                } catch (e) {
                    console.error("Error deleting storage object:", e);
                }
            }
            // Delete metadata
            await deleteDoc(fileDoc.ref);
        }

        // 2. Get all subfolders and delete them recursively
        const subfoldersQuery = query(collection(db, "storage_folders"), where("parentId", "==", folderId));
        const subfoldersSnap = await getDocs(subfoldersQuery);

        for (const subfolderDoc of subfoldersSnap.docs) {
            await deleteFolderRecursively(subfolderDoc.id);
        }

        // 3. Delete the folder itself
        await deleteDoc(doc(db, "storage_folders", folderId));
    };

    const handleDelete = (item: MediaFile | MediaFolder, type: 'file' | 'folder') => {
        setConfirmModal({
            isOpen: true,
            title: `Delete ${type === 'folder' ? 'Folder' : 'File'}`,
            message: `Are you sure you want to delete "${item.name}"? ${type === 'folder' ? 'This will permanently delete all contents inside.' : 'This action cannot be undone.'}`,
            isDestructive: true,
            onConfirm: async () => {
                try {
                    if (type === 'folder') {
                        await deleteFolderRecursively(item.id);
                    } else {
                        // Delete file accurately
                        const fileItem = item as MediaFile;
                        // Delete from Storage
                        const docSnap = await getDocs(query(collection(db, "storage_files"), where("__name__", "==", item.id)));
                        if (!docSnap.empty) {
                            const data = docSnap.docs[0].data();
                            if (data.storagePath) {
                                try { await deleteObject(ref(storage, data.storagePath)); } catch (e) { }
                            }
                        }

                        await deleteDoc(doc(db, "storage_files", item.id));

                        // Decrement folder count if a file was deleted and it belonged to a folder
                        if ((item as MediaFile).folderId) {
                            await updateDoc(doc(db, "storage_folders", (item as MediaFile).folderId!), {
                                fileCount: increment(-1),
                                updatedAt: serverTimestamp()
                            });
                        }
                    }

                    await logAdminAction({
                        action: "DELETE",
                        collectionName: type === 'file' ? "storage_files" : "storage_folders",
                        documentId: item.id,
                        details: `Deleted ${type}: ${item.name}`,
                        previousData: item
                    });
                    showToast(`${type === 'folder' ? 'Folder' : 'File'} deleted successfully`, "success");
                } catch (error) {
                    console.error("Delete error:", error);
                    showToast("Failed to delete item", "error");
                }
            }
        });
    };

    const copyToClipboard = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        showToast("Link copied to clipboard", "success");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredFiles = files.filter((f: MediaFile) => {
        const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
        const isImage = f.type === 'image' || f.type?.startsWith("image/") || f.mimeType?.startsWith("image/");
        const matchesType = filterType === "all" ||
            (filterType === "image" && isImage) ||
            (filterType === "document" && !isImage);
        return matchesSearch && matchesType;
    });

    const [previewIndex, setPreviewIndex] = useState<number | null>(null);

    // Keyboard navigation for preview
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (previewIndex === null) return;
            if (e.key === "ArrowRight") {
                setPreviewIndex((prev) => (prev !== null && prev < filteredFiles.length - 1 ? prev + 1 : prev));
            } else if (e.key === "ArrowLeft") {
                setPreviewIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
            } else if (e.key === "Escape") {
                setPreviewIndex(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [previewIndex, filteredFiles.length]);

    const formatSize = (bytes?: number) => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (loading && !isCreatingFolder && !editingItem) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                    <button
                        onClick={() => onFolderChange(null)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${!currentFolderId ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
                    >
                        <Folder className="w-4 h-4" />
                        Media Library
                    </button>
                    {currentFolderId && (
                        <>
                            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg border border-orange-100">
                                <span className="text-sm font-bold whitespace-nowrap">{currentFolderName || 'Loading...'}</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setIsCreatingFolder(true)}
                        className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl transition-all border border-slate-200 shadow-sm"
                        title="New Folder"
                    >
                        <FolderPlus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Creation/Edit Overlay */}
            {(isCreatingFolder || editingItem) && (
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top duration-200 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                        {isCreatingFolder ? <FolderPlus className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                    </div>
                    <form
                        onSubmit={isCreatingFolder ? handleCreateFolder : handleRename}
                        className="flex-1 flex items-center gap-2"
                    >
                        <input
                            autoFocus
                            type="text"
                            value={isCreatingFolder ? newFolderName : editingItem?.name}
                            onChange={(e) => isCreatingFolder ? setNewFolderName(e.target.value) : setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
                            placeholder={isCreatingFolder ? "Folder Name..." : "New Name..."}
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 outline-none"
                        />
                        <button type="submit" className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all">
                            <Check className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsCreatingFolder(false); setEditingItem(null); }}
                            className="p-2 bg-white text-slate-400 rounded-lg hover:text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6 space-y-8">
                {/* Folders Section */}
                {folders.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
                            Folders
                            <span className="h-px flex-1 bg-slate-200"></span>
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {folders.map((folder: MediaFolder) => (
                                <div
                                    key={folder.id}
                                    className="group relative bg-white border border-slate-200 rounded-xl p-3 hover:border-orange-500 hover:shadow-md transition-all cursor-pointer overflow-hidden"
                                    onClick={() => onFolderChange(folder.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                                            <Folder className="w-4 h-4 fill-current" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-700 truncate group-hover:text-slate-900">{folder.name}</p>
                                        </div>

                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setEditingItem({ id: folder.id, name: folder.name, type: 'folder' }); }}
                                                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(folder, 'folder'); }}
                                                className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Files Section */}
                <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
                        Files
                        <span className="h-px flex-1 bg-slate-200"></span>
                    </h4>

                    {filteredFiles.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                            {filteredFiles.map((file: MediaFile, index: number) => (
                                <div
                                    key={file.id}
                                    className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer"
                                    onClick={() => setPreviewIndex(index)}
                                >
                                    <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center overflow-hidden relative">
                                        {(file.type === 'image' || file.type?.startsWith("image/") || file.mimeType?.startsWith("image/")) ? (
                                            <img
                                                src={file.url}
                                                alt={file.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <FileText className="w-8 h-8 text-slate-400" />
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                    {file.mimeType?.split('/')[1] || file.type?.split('/')[1] || 'FILE'}
                                                </span>
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); copyToClipboard(file.url, file.id); }}
                                                className="p-1.5 bg-white text-slate-700 hover:text-orange-500 rounded-lg shadow-sm transition-colors"
                                                title="Copy URL"
                                            >
                                                {copiedId === file.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setEditingItem({ id: file.id, name: file.name, type: 'file' }); }}
                                                className="p-1.5 bg-white text-slate-700 hover:text-blue-500 rounded-lg shadow-sm transition-colors"
                                                title="Rename"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(file, 'file'); }}
                                                className="p-1.5 bg-white text-slate-700 hover:text-red-500 rounded-lg shadow-sm transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-3">
                                        <p className="text-[11px] font-bold text-slate-700 truncate w-full mb-1 group-hover:text-orange-600 transition-colors">{file.name}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] text-slate-400 font-bold">{formatSize(file.sizeBytes)}</span>
                                            <div className="h-0.5 w-0.5 rounded-full bg-slate-300"></div>
                                            <span className="text-[9px] text-slate-400 lowercase">
                                                {file.mimeType?.split('/')[1] || (file.type?.includes('/') ? file.type.split('/')[1] : file.type) || 'file'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                            <ImageIcon className="w-10 h-10 text-slate-300 mb-4" />
                            <p className="text-slate-500 text-sm font-medium">No files in this folder</p>
                        </div>
                    )}
                </div>

                {filteredFiles.length === 0 && folders.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                        <Folder className="w-12 h-12 text-slate-300 mb-4" />
                        <h3 className="text-slate-900 font-bold text-lg">Empty directory</h3>
                        <p className="text-slate-500 text-sm max-w-xs mt-1">Upload files or create folders to get started.</p>
                    </div>
                )}
            </div>

            {/* Preview Overlay */}
            {previewIndex !== null && filteredFiles[previewIndex] && (
                <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center animate-in fade-in duration-300">
                    {/* Top Header - Navigation Back & Actions */}
                    <div className="w-full flex items-center justify-between p-6 z-50">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setPreviewIndex(null)}
                                className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all hover:scale-105"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="flex flex-col">
                                <h4 className="text-sm font-bold text-white truncate max-w-[200px] md:max-w-md">
                                    {filteredFiles[previewIndex].name}
                                </h4>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                                    {previewIndex + 1} / {filteredFiles.length}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    const file = filteredFiles[previewIndex];
                                    setPreviewIndex(null);
                                    setEditingItem({ id: file.id, name: file.name, type: 'file' });
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold transition-all"
                            >
                                <Edit2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Rename</span>
                            </button>
                            <button
                                onClick={() => copyToClipboard(filteredFiles[previewIndex].url, filteredFiles[previewIndex].id)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold transition-all"
                            >
                                {copiedId === filteredFiles[previewIndex].id ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                <span className="hidden sm:inline">Share</span>
                            </button>
                            <button
                                onClick={() => {
                                    const file = filteredFiles[previewIndex];
                                    setPreviewIndex(null);
                                    handleDelete(file, 'file');
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Delete</span>
                            </button>
                            <a
                                href={filteredFiles[previewIndex].url}
                                target="_blank"
                                download
                                className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/20"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span className="hidden sm:inline">Download</span>
                            </a>
                        </div>
                    </div>

                    {/* Main View Area */}
                    <div className="flex-1 w-full flex items-center justify-between px-4 sm:px-10 relative overflow-hidden group/view">
                        {/* Prev Button */}
                        <button
                            disabled={previewIndex === 0}
                            onClick={() => setPreviewIndex(previewIndex - 1)}
                            className={`p-3 md:p-5 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all hover:scale-110 active:scale-95 disabled:opacity-0 disabled:pointer-events-none z-50`}
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>

                        <div className="flex-1 h-full flex items-center justify-center p-4 md:p-20">
                            {(filteredFiles[previewIndex].type === 'image' || filteredFiles[previewIndex].type?.startsWith("image/") || filteredFiles[previewIndex].mimeType?.startsWith("image/")) ? (
                                <img
                                    src={filteredFiles[previewIndex].url}
                                    alt={filteredFiles[previewIndex].name}
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-6 p-20 bg-slate-800/50 rounded-3xl border border-white/5">
                                    <FileText className="w-24 h-24 text-slate-600" />
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-white mb-2">{filteredFiles[previewIndex].name}</p>
                                        <p className="text-sm text-slate-500 uppercase tracking-widest">{filteredFiles[previewIndex].type || 'Binary File'}</p>
                                    </div>
                                    <button
                                        onClick={() => window.open(filteredFiles[previewIndex].url, '_blank')}
                                        className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all"
                                    >
                                        Open in New Tab
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Next Button */}
                        <button
                            disabled={previewIndex === filteredFiles.length - 1}
                            onClick={() => setPreviewIndex(previewIndex + 1)}
                            className={`p-3 md:p-5 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all hover:scale-110 active:scale-95 disabled:opacity-0 disabled:pointer-events-none z-50`}
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>
                    </div>

                    {/* Meta/Bottom area */}
                    <div className="w-full p-10 flex flex-col items-center gap-4">
                        <div className="flex items-center gap-8 py-4 px-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Size</span>
                                <span className="text-sm font-bold text-white">{formatSize(filteredFiles[previewIndex].sizeBytes)}</span>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Format</span>
                                <span className="text-sm font-bold text-white uppercase">{filteredFiles[previewIndex].mimeType?.split('/')[1] || filteredFiles[previewIndex].type?.split('/')[1] || 'FILE'}</span>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Uploaded</span>
                                <span className="text-sm font-bold text-white">{filteredFiles[previewIndex].uploadedAt?.toDate ? filteredFiles[previewIndex].uploadedAt.toDate().toLocaleDateString() : 'Recent'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                isDestructive={confirmModal.isDestructive}
                confirmLabel="Delete"
            />
        </div>
    );
}

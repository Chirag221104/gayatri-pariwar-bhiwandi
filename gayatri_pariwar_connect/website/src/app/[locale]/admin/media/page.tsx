"use client";

import { useState } from "react";
import { FileText, Upload, FolderOpen } from "lucide-react"; // Added FolderOpen
import MediaGrid from "@/components/admin/media/MediaGrid";
import MediaUpload from "@/components/admin/media/MediaUpload";

export default function MediaPage() { // Renamed from MediaLibraryPage
    const [showUpload, setShowUpload] = useState(false); // Renamed from isUploadOpen
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null); // Added new state

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-4">
                        <FolderOpen className="w-8 h-8 text-orange-500" /> {/* Changed icon from FileText to FolderOpen */}
                        Media Library
                    </h1>
                    <p className="text-slate-500 mt-1">Manage your images, videos and documents.</p> {/* Updated description */}
                </div>
                <button
                    onClick={() => setShowUpload(true)} // Updated state setter
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                >
                    <Upload className="w-5 h-5" />
                    Upload Files {/* Updated button text */}
                </button>
            </div>

            <div className="flex-1 min-h-0"> {/* Removed background/border/padding classes */}
                <MediaGrid
                    currentFolderId={currentFolderId}
                    onFolderChange={setCurrentFolderId}
                />
            </div>

            <MediaUpload
                isOpen={showUpload} // Updated prop name
                onClose={() => setShowUpload(false)} // Updated state setter
                currentFolderId={currentFolderId} // Added new prop
            />
        </div>
    );
}

"use client";

import { useState } from "react";
import { FileText, Upload, FolderOpen } from "lucide-react"; // Added FolderOpen
import MediaGrid from "@/components/admin/media/MediaGrid";
import MediaUpload from "@/components/admin/media/MediaUpload";
import SectionHeader from "@/components/ui/SectionHeader";

export default function MediaPage() { // Renamed from MediaLibraryPage
    const [showUpload, setShowUpload] = useState(false); // Renamed from isUploadOpen
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null); // Added new state

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-8">
            <SectionHeader
                title="Media Library"
                subtitle="Manage your images, videos and documents."
                icon={FolderOpen}
                actions={
                    <button
                        onClick={() => setShowUpload(true)}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                    >
                        <Upload className="w-4 h-4" />
                        Upload Files
                    </button>
                }
            />

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

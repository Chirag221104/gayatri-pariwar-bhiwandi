"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";
import { Heart, MessageCircle, Share2, Download, Trash2, Plus, X, Upload, Image as ImageIcon, GripVertical, Edit2, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Pin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PostImageCarousel = ({ urls, onImageClick }: { urls: string[], onImageClick: (idx: number) => void }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + urls.length) % urls.length);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % urls.length);
    };

    if (!urls || urls.length === 0) return null;

    return (
        <div className="relative bg-slate-100 dark:bg-zinc-950 w-full flex-none flex flex-col items-center justify-center overflow-hidden group">
            <img 
                src={urls[currentIndex]} 
                alt={`Post ${currentIndex + 1}`} 
                className="w-full h-auto max-h-[80vh] object-contain cursor-pointer"
                onClick={() => onImageClick(currentIndex)}
            />
            
            {urls.length > 1 && (
                <>
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg z-10">
                        {currentIndex + 1} / {urls.length}
                    </div>

                    <button
                        onClick={handlePrevious}
                        className="absolute left-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="absolute bottom-4 flex gap-1.5 z-10">
                        {urls.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedPostImages, setSelectedPostImages] = useState<{urls: string[], index: number} | null>(null);
    const [caption, setCaption] = useState("");
    const [createdAtDate, setCreatedAtDate] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragOver, setIsDragOver] = useState(false);
    const [draggedCreateImageIndex, setDraggedCreateImageIndex] = useState<number | null>(null);
    const params = useParams();
    const locale = (params?.locale as string) || "en";
    const { user } = useAuth();

    // --- Edit Post Logic ---
    type EditPhoto = { id: string, type: 'existing' | 'new', url: string, file?: File };
    const [editingPost, setEditingPost] = useState<any>(null);
    const [editCaption, setEditCaption] = useState("");
    const [editTags, setEditTags] = useState<string[]>([]);
    const [editTagInput, setEditTagInput] = useState("");
    const [editCreatedAtDate, setEditCreatedAtDate] = useState("");
    const [editPhotos, setEditPhotos] = useState<EditPhoto[]>([]);
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [isEditDragOver, setIsEditDragOver] = useState(false);
    const [draggedEditImageIndex, setDraggedEditImageIndex] = useState<number | null>(null);

    // Listen to posts
    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const postsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                // Sort by pinned
                postsData.sort((a: any, b: any) => {
                    if (a.pinned && !b.pinned) return -1;
                    if (!a.pinned && b.pinned) return 1;
                    return 0; 
                });
                setPosts(postsData);
            },
            (error) => {
                console.error("Error fetching posts:", error);
            }
        );
        return () => unsubscribe();
    }, []);

    // Keyboard navigation for image carousel
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedPostImages) return;
            if (e.key === "ArrowLeft") {
                setSelectedPostImages(prev => prev ? { ...prev, index: (prev.index - 1 + prev.urls.length) % prev.urls.length } : null);
            } else if (e.key === "ArrowRight") {
                setSelectedPostImages(prev => prev ? { ...prev, index: (prev.index + 1) % prev.urls.length } : null);
            } else if (e.key === "Escape") {
                setSelectedPostImages(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedPostImages]);

    // Handle file selection
    const handleFilesSelected = useCallback((files: File[]) => {
        const imageFiles = files.filter((f) => f.type.startsWith("image/"));
        setSelectedFiles((prev) => [...prev, ...imageFiles]);

        // Generate previews
        imageFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews((prev) => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    }, []);

    // Drag and Drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);
            const files = Array.from(e.dataTransfer.files);
            handleFilesSelected(files);
        },
        [handleFilesSelected]
    );

    const handleCreateDragStart = (e: React.DragEvent, index: number) => {
        setDraggedCreateImageIndex(index);
        e.dataTransfer.effectAllowed = "move";
        // Optionally set drag image or data here
    };

    const handleCreateDragEnter = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        if (draggedCreateImageIndex === null || draggedCreateImageIndex === targetIndex) return;

        // Reorder
        setPreviews((prev) => {
            const newPreviews = [...prev];
            const draggedItem = newPreviews[draggedCreateImageIndex];
            newPreviews.splice(draggedCreateImageIndex, 1);
            newPreviews.splice(targetIndex, 0, draggedItem);
            return newPreviews;
        });

        setSelectedFiles((prev) => {
            const newFiles = [...prev];
            const draggedItem = newFiles[draggedCreateImageIndex];
            newFiles.splice(draggedCreateImageIndex, 1);
            newFiles.splice(targetIndex, 0, draggedItem);
            return newFiles;
        });

        setDraggedCreateImageIndex(targetIndex);
    };

    const handleCreateDragEnd = () => {
        setDraggedCreateImageIndex(null);
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const addTag = () => {
        const input = tagInput.trim();
        if (!input) return;

        // Split by spaces, commas, or newlines and remove leading '#'
        const newTags = input
            .split(/[\s,]+/)
            .map((t) => t.replace(/^#/, "").trim())
            .filter((t) => t.length > 0 && !tags.includes(t));

        if (newTags.length > 0) {
            setTags((prev) => [...prev, ...newTags]);
        }
        setTagInput("");
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    // Upload to Firebase Storage
    const uploadFile = async (file: File, index: number): Promise<string> => {
        const fileName = `posts/${Date.now()}_${index}_${file.name}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(Math.round(progress));
                },
                (error) => reject(error),
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(url);
                }
            );
        });
    };

    const handleCreatePost = async () => {
        if (selectedFiles.length === 0 || !caption.trim()) {
            alert("Please add at least one photo and a caption.");
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            // Upload all files
            const photoUrls: string[] = [];
            for (let i = 0; i < selectedFiles.length; i++) {
                const url = await uploadFile(selectedFiles[i], i);
                photoUrls.push(url);
                setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
            }

            let postCreatedAt: any = serverTimestamp();
            if (createdAtDate) {
                postCreatedAt = Timestamp.fromDate(new Date(createdAtDate));
            }

            // Fetch user profile from Firestore to get in-app name and photo
            let authorName = user?.name || "Admin";
            let authorPhotoUrl = user?.photoUrl || null;
            
            if (user?.uid) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        if (userData.name) {
                            authorName = userData.name;
                        } else if (userData.username) {
                            authorName = userData.username;
                        }
                        
                        if (userData.profilePicture || userData.photoUrl) {
                            authorPhotoUrl = userData.profilePicture || userData.photoUrl;
                        }
                    }
                } catch (e) {
                    console.error("Error fetching user profile for post:", e);
                }
            }

            // Create post document
            await addDoc(collection(db, "posts"), {
                caption: caption.trim(),
                photoUrls,
                tags,
                createdAt: postCreatedAt,
                authorId: user?.uid || "",
                authorName,
                authorPhotoUrl,
                likesCount: 0,
                shareCount: 0,
                likedBy: [],
            });

            // Reset form
            setCaption("");
            setCreatedAtDate("");
            setTags([]);
            setSelectedFiles([]);
            setPreviews([]);
            setShowCreateForm(false);
            setUploadProgress(0);
        } catch (error: any) {
            console.error("Error creating post:", error);
            
            // Provide more descriptive error messages based on common Firebase errors
            if (error.code === 'storage/unauthorized') {
                alert("Permission Denied: Cannot upload images. Please update your Firebase Storage Rules to allow uploads to the 'posts' folder.");
            } else if (error.code === 'permission-denied') {
                alert("Permission Denied: Cannot write to database. Please update your Firestore Rules to allow writes to the 'posts' collection.");
            } else {
                alert(`Failed to create post: ${error.message || "An unknown error occurred while uploading."}`);
            }
        } finally {
            setUploading(false);
        }
    };


    const openEditModal = (post: any) => {
        setEditingPost(post);
        setEditCaption(post.caption || "");
        setEditTags(post.tags || []);
        
        if (post.createdAt) {
            const date = post.createdAt.toDate ? post.createdAt.toDate() : new Date(post.createdAt);
            // format to YYYY-MM-DDThh:mm
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            setEditCreatedAtDate(date.toISOString().slice(0, 16));
        } else {
            setEditCreatedAtDate("");
        }

        const initialPhotos: EditPhoto[] = (post.photoUrls || []).map((url: string, index: number) => ({
            id: `existing_${index}_${Date.now()}`,
            type: 'existing',
            url
        }));
        setEditPhotos(initialPhotos);
        setEditTagInput("");
    };

    const handleEditFilesSelected = (files: File[]) => {
        const imageFiles = files.filter((f) => f.type.startsWith("image/"));
        
        imageFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setEditPhotos((prev) => [...prev, {
                    id: `new_${index}_${Date.now()}_${Math.random()}`,
                    type: 'new',
                    url: e.target?.result as string,
                    file
                }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleEditDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsEditDragOver(true);
    }, []);

    const handleEditDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsEditDragOver(false);
    }, []);

    const handleEditDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsEditDragOver(false);
            if (e.dataTransfer.files) {
                handleEditFilesSelected(Array.from(e.dataTransfer.files));
            }
        },
        [handleEditFilesSelected]
    );

    const handleEditDragStart = (e: React.DragEvent, index: number) => {
        setDraggedEditImageIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleEditDragEnter = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        if (draggedEditImageIndex === null || draggedEditImageIndex === targetIndex) return;

        setEditPhotos((prev) => {
            const newPhotos = [...prev];
            const draggedItem = newPhotos[draggedEditImageIndex];
            newPhotos.splice(draggedEditImageIndex, 1);
            newPhotos.splice(targetIndex, 0, draggedItem);
            return newPhotos;
        });

        setDraggedEditImageIndex(targetIndex);
    };

    const handleEditDragEnd = () => {
        setDraggedEditImageIndex(null);
    };

    const removeEditPhoto = (id: string) => {
        setEditPhotos(prev => prev.filter(p => p.id !== id));
    };

    const moveEditPhoto = (index: number, direction: 'left' | 'right') => {
        setEditPhotos(prev => {
            const newPhotos = [...prev];
            if (direction === 'left' && index > 0) {
                [newPhotos[index - 1], newPhotos[index]] = [newPhotos[index], newPhotos[index - 1]];
            } else if (direction === 'right' && index < newPhotos.length - 1) {
                [newPhotos[index + 1], newPhotos[index]] = [newPhotos[index], newPhotos[index + 1]];
            }
            return newPhotos;
        });
    };

    const addEditTag = () => {
        const input = editTagInput.trim();
        if (!input) return;
        const newTags = input.split(/[\s,]+/).map(t => t.replace(/^#/, "").trim()).filter(t => t.length > 0 && !editTags.includes(t));
        if (newTags.length > 0) setEditTags(prev => [...prev, ...newTags]);
        setEditTagInput("");
    };

    const removeEditTag = (tag: string) => {
        setEditTags(editTags.filter(t => t !== tag));
    };

    const handleSaveEdit = async () => {
        if (!editingPost) return;
        if (editPhotos.length === 0) {
            alert("A post must have at least one photo.");
            return;
        }

        setIsSavingEdit(true);
        setUploadProgress(0);

        try {
            const finalPhotoUrls: string[] = [];
            for (let i = 0; i < editPhotos.length; i++) {
                const photo = editPhotos[i];
                if (photo.type === 'existing') {
                    finalPhotoUrls.push(photo.url);
                } else if (photo.type === 'new' && photo.file) {
                    const url = await uploadFile(photo.file, i);
                    finalPhotoUrls.push(url);
                }
                setUploadProgress(Math.round(((i + 1) / editPhotos.length) * 100));
            }
            
            let postCreatedAt: any = editingPost.createdAt;
            if (editCreatedAtDate) {
                postCreatedAt = Timestamp.fromDate(new Date(editCreatedAtDate));
            }

            await updateDoc(doc(db, "posts", editingPost.id), {
                caption: editCaption.trim(),
                tags: editTags,
                photoUrls: finalPhotoUrls,
                createdAt: postCreatedAt
            });

            showToast("✅ Post updated successfully!");
            setEditingPost(null);
        } catch (error: any) {
            console.error("Error updating post:", error);
            showToast("❌ Failed to update post.", "error");
        } finally {
            setIsSavingEdit(false);
        }
    };
    // -------------------------

    const [toastMessage, setToastMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    const showToast = (text: string, type: 'success' | 'error' = 'success') => {
        setToastMessage({ text, type });
        setTimeout(() => setToastMessage(null), 3000);
    };

    const togglePin = async (postId: string, currentPinned: boolean) => {
        try {
            // Check if we already have 3 pinned posts
            if (!currentPinned) {
                const pinnedCount = posts.filter(p => p.pinned).length;
                if (pinnedCount >= 3) {
                    showToast("❌ Maximum 3 posts can be pinned.", "error");
                    return;
                }
            }
            await updateDoc(doc(db, "posts", postId), {
                pinned: !currentPinned
            });
            showToast(`✅ Post ${currentPinned ? 'unpinned' : 'pinned'} successfully!`);
        } catch (error) {
            console.error("Error toggling pin:", error);
            showToast("❌ Failed to update post pin status.", "error");
        }
    };

    const confirmDelete = (postId: string) => {
        setPostToDelete(postId);
    };

    const handleDeletePost = async () => {
        if (!postToDelete) return;
        try {
            await deleteDoc(doc(db, "posts", postToDelete));
            showToast("✅ Post deleted successfully!");
        } catch (error) {
            console.error("Error deleting post:", error);
            showToast("❌ Failed to delete post.", "error");
        } finally {
            setPostToDelete(null);
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "";
        const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date).replace(',', '');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Community Posts</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage photo posts for the community feed</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
                >
                    {showCreateForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {showCreateForm ? "Cancel" : "Create Post"}
                </button>
            </div>

            {/* Create Post Form */}
            {showCreateForm && (
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 space-y-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">New Post</h2>

                    {/* Drag and Drop Zone */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                            isDragOver
                                ? "border-orange-400 bg-orange-50/50 dark:bg-orange-500/10"
                                : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-800/30"
                        }`}
                        onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.multiple = true;
                            input.onchange = (e) => {
                                const files = Array.from((e.target as HTMLInputElement).files || []);
                                handleFilesSelected(files);
                            };
                            input.click();
                        }}
                    >
                        <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragOver ? "text-orange-500 dark:text-orange-400" : "text-slate-400 dark:text-slate-500"}`} />
                        <p className={`text-lg font-medium ${isDragOver ? "text-orange-600 dark:text-orange-300" : "text-slate-600 dark:text-slate-300"}`}>
                            {isDragOver ? "Drop photos here!" : "Drag & drop photos here"}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">or click to browse files</p>
                    </div>

                    {/* Image Previews */}
                    {previews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {previews.map((preview, index) => (
                                <div 
                                    key={index} 
                                    className={`relative group rounded-lg overflow-hidden aspect-square cursor-move transition-transform ${draggedCreateImageIndex === index ? 'opacity-50 scale-95 border-2 border-orange-500' : ''}`}
                                    draggable
                                    onDragStart={(e) => handleCreateDragStart(e, index)}
                                    onDragEnter={(e) => handleCreateDragEnter(e, index)}
                                    onDragEnd={handleCreateDragEnd}
                                    onDragOver={(e) => e.preventDefault()}
                                >
                                    <img 
                                        src={preview} 
                                        alt={`Preview ${index + 1}`} 
                                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                                        onClick={() => setSelectedPostImages({ urls: previews, index })}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(index);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                        {index + 1}/{previews.length}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Caption */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Caption</label>
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            rows={3}
                            className="w-full bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
                            placeholder="Write a caption for your post..."
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tags</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                className="flex-1 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors"
                                placeholder="Add a tag..."
                            />
                            <button onClick={addTag} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                                Add
                            </button>
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {tags.map((tag) => (
                                    <span key={tag} className="flex items-center gap-1 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300 px-3 py-1 rounded-full text-sm">
                                        #{tag}
                                        <button onClick={() => removeTag(tag)}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Custom Date (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Post Date & Time <span className="text-slate-400 font-normal">(Optional - Leave empty for current time)</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={createdAtDate}
                            onChange={(e) => setCreatedAtDate(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors dark:[color-scheme:dark]"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleCreatePost}
                        disabled={uploading || selectedFiles.length === 0 || !caption.trim()}
                        className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 text-white rounded-lg font-semibold transition-colors shadow-sm"
                    >
                        {uploading ? `Uploading... ${uploadProgress}%` : `Create Post (${selectedFiles.length} photos)`}
                    </button>
                </div>
            )}

            {/* Posts Grid */}
            {posts.length === 0 ? (
                <div className="text-center py-20">
                    <ImageIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No posts yet</p>
                    <p className="text-slate-500 text-sm mt-1">Create your first community post!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-orange-200 dark:hover:border-zinc-700 transition-colors shadow-sm">
                            {/* Post Images */}
                            <PostImageCarousel 
                                urls={post.photoUrls} 
                                onImageClick={(idx) => setSelectedPostImages({ urls: post.photoUrls, index: idx })} 
                            />

                            {/* Post Info */}
                            <div className="p-4 space-y-3">
                                <p className="text-slate-700 dark:text-zinc-300 text-sm line-clamp-2">{post.caption}</p>

                                {/* Tags */}
                                {post.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {post.tags.map((tag: string) => (
                                            <span key={tag} className="text-xs text-orange-400">#{tag}</span>
                                        ))}
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="flex items-center justify-between text-slate-500 dark:text-zinc-500 text-sm">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <Heart className="w-4 h-4" /> {post.likesCount || 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Share2 className="w-4 h-4" /> {post.shareCount || 0}
                                        </span>
                                    </div>
                                    <span className="text-xs">{formatDate(post.createdAt)}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => togglePin(post.id, !!post.pinned)}
                                        className={`flex items-center gap-1 text-sm transition-colors ${post.pinned ? 'text-orange-500 hover:text-orange-600' : 'text-slate-500 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400'}`}
                                    >
                                        <Pin className={`w-4 h-4 ${post.pinned ? 'fill-orange-500' : ''}`} /> {post.pinned ? 'Unpin' : 'Pin'}
                                    </button>
                                    <button
                                        onClick={() => openEditModal(post)}
                                        className="flex items-center gap-1 text-slate-500 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400 text-sm transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" /> Edit
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(post.id)}
                                        className="flex items-center gap-1 text-red-400 hover:text-red-500 text-sm transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {/* Edit Modal */}
                {editingPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 overflow-y-auto"
                        onClick={() => setEditingPost(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-zinc-800">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Post</h3>
                                <button
                                    onClick={() => setEditingPost(null)}
                                    className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto space-y-6">
                                {/* Caption */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Caption</label>
                                    <textarea
                                        value={editCaption}
                                        onChange={(e) => setEditCaption(e.target.value)}
                                        className="w-full h-32 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-xl p-4 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none resize-none transition-colors"
                                        placeholder="What's on your mind?"
                                    />
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tags</label>
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={editTagInput}
                                            onChange={(e) => setEditTagInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && addEditTag()}
                                            className="flex-1 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:border-orange-500 outline-none transition-colors"
                                            placeholder="Add a tag..."
                                        />
                                        <button
                                            onClick={addEditTag}
                                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {editTags.map((tag) => (
                                            <span key={tag} className="flex items-center gap-1 bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300 px-3 py-1 rounded-full text-sm">
                                                #{tag}
                                                <button onClick={() => removeEditTag(tag)} className="hover:text-orange-950 dark:hover:text-orange-100"><X className="w-3 h-3" /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Post Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        value={editCreatedAtDate}
                                        onChange={(e) => setEditCreatedAtDate(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors dark:[color-scheme:dark]"
                                    />
                                </div>

                                {/* Photos (Unified) */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Photos (Drag to add, use arrows to reorder)</label>
                                    </div>
                                    
                                    <label 
                                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-colors cursor-pointer mb-4 ${isEditDragOver ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800/50'}`}
                                        onDragOver={handleEditDragOver}
                                        onDragLeave={handleEditDragLeave}
                                        onDrop={handleEditDrop}
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                            <p className="text-sm text-slate-500 dark:text-zinc-400">Click or drag photos here to add more</p>
                                        </div>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files) handleEditFilesSelected(Array.from(e.target.files));
                                            }}
                                        />
                                    </label>

                                    {editPhotos.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {editPhotos.map((photo, i) => (
                                                <div 
                                                    key={photo.id} 
                                                    className={`relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-700 group cursor-move transition-transform ${draggedEditImageIndex === i ? 'opacity-50 scale-95 border-2 border-orange-500' : ''}`}
                                                    draggable
                                                    onDragStart={(e) => handleEditDragStart(e, i)}
                                                    onDragEnter={(e) => handleEditDragEnter(e, i)}
                                                    onDragEnd={handleEditDragEnd}
                                                    onDragOver={(e) => e.preventDefault()}
                                                >
                                                    <img src={photo.url} alt={`Photo ${i}`} className="w-full h-full object-cover" />
                                                    
                                                    {/* Overlays */}
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 pb-3">
                                                        <div className="flex justify-center w-full">
                                                            <button
                                                                onClick={(e) => { e.preventDefault(); removeEditPhoto(photo.id); }}
                                                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                                                                title="Remove Photo"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-500">No photos.</p>
                                    )}
                                </div>

                                {isSavingEdit && (
                                    <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setEditingPost(null)}
                                    disabled={isSavingEdit}
                                    className="px-6 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors font-medium disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={isSavingEdit || editPhotos.length === 0}
                                    className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 dark:disabled:bg-orange-900 text-white rounded-xl transition-colors font-medium shadow-sm flex items-center gap-2"
                                >
                                    {isSavingEdit ? `Saving... ${uploadProgress}%` : "Save Changes"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
                {postToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4"
                        onClick={() => setPostToDelete(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-zinc-800"
                        >
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Post</h3>
                            <p className="text-slate-500 dark:text-zinc-400 mb-6">
                                Are you absolutely sure you want to delete this post? This action cannot be undone.
                            </p>
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setPostToDelete(null)}
                                    className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeletePost}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {selectedPostImages && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4"
                        onClick={() => setSelectedPostImages(null)}
                    >
                        <button 
                            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPostImages(null);
                            }}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        
                        <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center">
                            {selectedPostImages.urls.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPostImages(prev => prev ? { ...prev, index: (prev.index - 1 + prev.urls.length) % prev.urls.length } : null);
                                    }}
                                    className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                            )}

                            <motion.img 
                                key={selectedPostImages.index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                src={selectedPostImages.urls[selectedPostImages.index]}
                                alt="Full preview"
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />

                            {selectedPostImages.urls.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPostImages(prev => prev ? { ...prev, index: (prev.index + 1) % prev.urls.length } : null);
                                    }}
                                    className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            )}
                        </div>

                        {selectedPostImages.urls.length > 1 && (
                            <div className="absolute bottom-6 flex gap-2 z-50">
                                {selectedPostImages.urls.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPostImages(prev => prev ? { ...prev, index: idx } : null);
                                        }}
                                        className={`w-3 h-3 rounded-full transition-colors ${idx === selectedPostImages.index ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, updateDoc, doc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Heart, MessageCircle, Share2, Download, Image as ImageIcon, X, ChevronLeft, ChevronRight, Pin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
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

const AuthorProfile = ({ authorId, fallbackName, fallbackPhotoUrl, createdAt }: { authorId: string, fallbackName: string, fallbackPhotoUrl?: string, createdAt: any }) => {
    const [name, setName] = useState(fallbackName);
    const [photo, setPhoto] = useState(fallbackPhotoUrl);

    useEffect(() => {
        if (!authorId) return;
        let isMounted = true;
        const fetchProfile = async () => {
            try {
                const userDoc = await getDoc(doc(db, "users", authorId));
                if (userDoc.exists() && isMounted) {
                    const data = userDoc.data();
                    if (data.name) setName(data.name);
                    else if (data.username) setName(data.username);
                    
                    if (data.photoUrl) setPhoto(data.photoUrl);
                    else if (data.profilePicture) setPhoto(data.profilePicture);
                }
            } catch (error: any) {
                // Ignore permission errors for public users viewing the feed
                if (error?.code !== 'permission-denied') {
                    console.error("Error fetching author profile:", error);
                }
            }
        };
        fetchProfile();
        return () => { isMounted = false; };
    }, [authorId]);

    return (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-inner overflow-hidden">
                {photo ? (
                    <img src={photo} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    name?.[0]?.toUpperCase() || 'A'
                )}
            </div>
            <div>
                <p className="font-bold text-slate-900 dark:text-white leading-tight">
                    {name}
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    {formatDate(createdAt)}
                </p>
            </div>
        </div>
    );
};

const PostImageCarousel = ({ urls, onImageClick, isModal = false }: { urls: string[], onImageClick: (idx: number) => void, isModal?: boolean }) => {
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
        <div className={`relative w-full flex-none flex flex-col items-center justify-center overflow-hidden group ${isModal ? 'bg-black h-full' : 'bg-slate-100 dark:bg-zinc-950'}`}>
            <img 
                src={urls[currentIndex]} 
                alt={`Post ${currentIndex + 1}`} 
                className={`w-full object-contain cursor-pointer ${isModal ? 'h-full max-h-[85vh]' : 'h-auto max-h-[80vh]'}`}
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

export default function PublicPostsPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPostImages, setSelectedPostImages] = useState<{urls: string[], index: number} | null>(null);
    const [selectedPost, setSelectedPost] = useState<any | null>(null);
    const { user } = useAuth();

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
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching posts:", error);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

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

    const handleLike = async (postId: string, likedBy: string[]) => {
        if (!user) {
            alert("Please login to like posts.");
            return;
        }

        const isLiked = likedBy.includes(user.uid);
        const postRef = doc(db, "posts", postId);

        try {
            if (isLiked) {
                await updateDoc(postRef, {
                    likedBy: arrayRemove(user.uid),
                    likesCount: Math.max(0, (likedBy.length || 1) - 1)
                });
            } else {
                await updateDoc(postRef, {
                    likedBy: arrayUnion(user.uid),
                    likesCount: (likedBy.length || 0) + 1
                });
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const handleShare = async (post: any) => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Community Post',
                    text: post.caption,
                    url: window.location.href,
                });
                
                // Increment share count
                await updateDoc(doc(db, "posts", post.id), {
                    shareCount: (post.shareCount || 0) + 1
                });
            } else {
                navigator.clipboard.writeText(`${post.caption}\n${window.location.href}`);
                alert("Link copied to clipboard!");
            }
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    const handleDownload = async (imageUrl: string, postId: string) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `post_${postId}.jpg`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error downloading image:", error);
            alert("Failed to download image");
        }
    };


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">
                        Community Feed
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Stay connected with the latest updates and divine moments from our community.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">Loading feed...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                        <ImageIcon className="w-16 h-16 text-slate-400 dark:text-zinc-600 mx-auto mb-4 opacity-50" />
                        <p className="text-slate-500 dark:text-zinc-400 text-lg font-medium">No posts yet</p>
                        <p className="text-slate-400 dark:text-zinc-500 text-sm mt-2">Check back later for community updates!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-1 md:gap-4 w-full">
                        {posts.map((post) => (
                            <div 
                                key={post.id} 
                                className="relative aspect-square cursor-pointer group bg-zinc-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800"
                                onClick={() => setSelectedPost(post)}
                            >
                                {post.photoUrls?.[0] ? (
                                    <img 
                                        src={post.photoUrls[0]} 
                                        alt="Post" 
                                        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-white dark:bg-zinc-900">
                                        <p className="text-xs md:text-sm text-slate-800 dark:text-zinc-200 line-clamp-4 leading-relaxed font-medium">
                                            {post.caption}
                                        </p>
                                    </div>
                                )}
                                
                                {/* Overlay icons */}
                                {post.photoUrls?.length > 1 && (
                                    <div className="absolute top-2 right-2 text-white/90 drop-shadow-md z-10">
                                        <ImageIcon className="w-5 h-5 fill-black/20" />
                                    </div>
                                )}
                                {post.pinned && (
                                    <div className="absolute top-2 left-2 text-white bg-orange-500/90 rounded-full p-1.5 shadow-md z-10">
                                        <Pin className="w-4 h-4 fill-white" />
                                    </div>
                                )}

                                {/* Hover overlay for likes/comments (Instagram style) */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-sm md:text-base z-20">
                                    <span className="flex items-center gap-1">
                                        <Heart className="w-5 h-5 fill-white" /> {post.likesCount || 0}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
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

                {selectedPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 md:p-8"
                        onClick={() => setSelectedPost(null)}
                    >
                        {/* Close button (outside modal on desktop) */}
                        <button 
                            className="hidden md:flex absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
                            onClick={() => setSelectedPost(null)}
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div 
                            className="bg-white dark:bg-zinc-900 md:bg-black md:dark:bg-black rounded-none md:rounded-xl w-full max-w-[1200px] h-full md:h-[85vh] flex flex-col md:flex-row relative shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Mobile Close Button */}
                            <button 
                                className="md:hidden absolute top-3 right-3 p-2 bg-slate-100/80 dark:bg-zinc-800/80 rounded-full text-slate-600 dark:text-zinc-300 z-50"
                                onClick={() => setSelectedPost(null)}
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Left Panel: Image Carousel */}
                            <div className="flex-1 bg-black flex items-center justify-center relative min-h-[350px] md:min-h-0 border-b md:border-b-0 border-slate-200 dark:border-zinc-800">
                                <PostImageCarousel 
                                    urls={selectedPost.photoUrls} 
                                    onImageClick={(idx) => setSelectedPostImages({ urls: selectedPost.photoUrls, index: idx })} 
                                    isModal={true}
                                />
                            </div>

                            {/* Right Panel: Content Sidebar */}
                            <div className="w-full md:w-[400px] lg:w-[450px] flex flex-col bg-white dark:bg-zinc-900 h-full flex-shrink-0">
                                {/* Header */}
                                <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 flex-shrink-0">
                                    <AuthorProfile 
                                        authorId={selectedPost.authorId}
                                        fallbackName={selectedPost.authorName || 'Admin'}
                                        fallbackPhotoUrl={selectedPost.authorPhotoUrl}
                                        createdAt={selectedPost.createdAt}
                                    />
                                </div>

                                {/* Caption (Scrollable) */}
                                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                    <p className="text-slate-800 dark:text-zinc-200 leading-relaxed text-sm whitespace-pre-wrap">
                                        {selectedPost.caption}
                                    </p>
                                    
                                    {selectedPost.tags && selectedPost.tags.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {selectedPost.tags.map((tag: string) => (
                                                <span 
                                                    key={tag} 
                                                    className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline cursor-pointer"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Actions & Stats (Fixed at bottom) */}
                                <div className="p-4 border-t border-slate-100 dark:border-zinc-800 flex-shrink-0 bg-white dark:bg-zinc-900">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-1 -ml-2">
                                            <button 
                                                onClick={() => handleLike(selectedPost.id, selectedPost.likedBy || [])}
                                                className="p-3 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-full transition-colors flex items-center gap-2 group"
                                            >
                                                <Heart 
                                                    className={`w-6 h-6 transition-all ${(user && selectedPost.likedBy?.includes(user.uid)) ? 'fill-red-500 text-red-500 scale-110' : 'text-slate-600 dark:text-zinc-400 group-hover:text-red-500 group-hover:scale-105'}`} 
                                                />
                                            </button>
                                            
                                            <button className="p-3 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-full transition-colors flex items-center gap-2 group">
                                                <MessageCircle className="w-6 h-6 text-slate-600 dark:text-zinc-400 group-hover:text-blue-500 transition-all group-hover:scale-105" />
                                            </button>

                                            <button 
                                                onClick={() => handleShare(selectedPost)}
                                                className="p-3 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-full transition-colors flex items-center gap-2 group"
                                            >
                                                <Share2 className="w-6 h-6 text-slate-600 dark:text-zinc-400 group-hover:text-emerald-500 transition-all group-hover:scale-105" />
                                            </button>
                                        </div>

                                        {selectedPost.photoUrls?.[0] && (
                                            <button 
                                                onClick={() => handleDownload(selectedPost.photoUrls[0], selectedPost.id)}
                                                className="p-3 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-full transition-colors group"
                                                title="Download Image"
                                            >
                                                <Download className="w-6 h-6 text-slate-600 dark:text-zinc-400 group-hover:text-orange-500 transition-colors" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                                        {selectedPost.likesCount || 0} likes
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-zinc-500 uppercase tracking-wide">
                                        {formatDate(selectedPost.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

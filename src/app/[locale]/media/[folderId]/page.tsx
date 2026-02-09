'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion, Variants } from 'framer-motion';
import { Folder, Image as ImageIcon, ChevronLeft, Calendar, Loader2, Download } from 'lucide-react';
import ImageLightbox from '@/components/ImageLightbox';

interface StorageFolder {
    id: string;
    name: string;
    fileCount: number;
}

interface StorageFile {
    id: string;
    name: string;
    url: string;
    type: string;
    contentType?: string;
    createdAt?: Timestamp;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 15 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};


import { use } from 'react';

export default function FolderPage({ params }: { params: Promise<{ folderId: string }> }) {
    const { folderId } = use(params);
    const t = useTranslations('media_page');
    const locale = useLocale();

    const [folderName, setFolderName] = useState<string>('');
    const [subFolders, setSubFolders] = useState<StorageFolder[]>([]);
    const [files, setFiles] = useState<StorageFile[]>([]);
    const [loading, setLoading] = useState(true);

    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Derived state for lightbox images (only actual images)
    const imageFiles = files.filter(f => f.type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f.name));

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                // 1. Fetch Folder Details
                const folderRef = doc(db, 'storage_folders', folderId);
                const folderSnap = await getDoc(folderRef);
                if (folderSnap.exists()) {
                    setFolderName(folderSnap.data().name);
                } else {
                    setFolderName('Folder Not Found');
                }

                // 2. Fetch Sub-folders
                const foldersQ = query(collection(db, 'storage_folders'), where('parentId', '==', folderId));
                const foldersSnap = await getDocs(foldersQ);
                const fetchedFolders = foldersSnap.docs.map(d => ({ id: d.id, ...d.data() } as StorageFolder));
                fetchedFolders.sort((a, b) => a.name.localeCompare(b.name));
                setSubFolders(fetchedFolders);

                // 3. Fetch Files
                // Note: 'storage_files' usually has 'folderId' field.
                const filesQ = query(collection(db, 'storage_files'), where('folderId', '==', folderId));
                const filesSnap = await getDocs(filesQ);
                const fetchedFiles = filesSnap.docs.map(d => {
                    const data = d.data();
                    return {
                        id: d.id,
                        url: data.downloadUrl || data.url, // Handle potentially different field names
                        type: data.contentType || data.type,
                        name: data.name,
                        createdAt: data.createdAt
                    } as StorageFile;
                });

                // Client-side sort by newest first
                fetchedFiles.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

                setFiles(fetchedFiles);

            } catch (err) {
                console.error("Error fetching folder contents:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [folderId]);

    return (
        <div className="bg-background min-h-screen pb-32 font-body pt-32 px-6">
            <div className="container mx-auto max-w-7xl">

                {/* Header & Breadcrumb */}
                <div className="mb-12">
                    <Link
                        href={`/${locale}/media`}
                        className="inline-flex items-center gap-2 text-muted hover:text-saffron transition-colors mb-6 font-bold uppercase tracking-widest text-xs"
                    >
                        <ChevronLeft className="w-4 h-4" /> {t('back_to_gallery')}
                    </Link>

                    <h1 className="text-6xl md:text-9xl font-black !text-slate-950 dark:!text-white font-display leading-[1.1] tracking-[calc(-0.04em)] mb-8 title-shadow">
                        {folderName}
                    </h1>
                    <div className="h-1 w-20 bg-saffron rounded-full"></div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-saffron animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Sub-Folders Section */}
                        {subFolders.length > 0 && (
                            <div className="mb-16">
                                <h2 className="text-2xl font-bold text-black dark:text-white mb-6 flex items-center gap-3">
                                    <Folder className="w-6 h-6 text-saffron" /> {t('tabs.folders')}
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                    {subFolders.map(folder => (
                                        <Link key={folder.id} href={`/${locale}/media/${folder.id}`}>
                                            <div className="glass p-6 rounded-[2rem] hover:bg-saffron/10 transition-colors text-center group border-white/40 dark:border-white/10">
                                                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-4 text-saffron-dark dark:text-saffron shadow-md group-hover:scale-110 transition-transform">
                                                    <Folder className="w-6 h-6" />
                                                </div>
                                                <p className="font-bold text-sm truncate" style={{ color: 'var(--media-text)' }}>{folder.name}</p>
                                                <p className="text-xs text-muted mt-1 font-semibold">{folder.fileCount || 0} items</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Files Grid */}
                        {files.length > 0 ? (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="columns-1 md:columns-3 lg:columns-4 gap-6 space-y-6"
                            >
                                {files.map((file) => (
                                    <motion.div key={file.id} variants={itemVariants} className="break-inside-avoid">
                                        <div className="group relative rounded-2xl overflow-hidden glass border-none shadow-md hover:shadow-xl transition-all duration-500">
                                            {(file.type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)) ? (
                                                <div
                                                    className="relative aspect-[4/5] md:aspect-auto cursor-pointer"
                                                    onClick={() => {
                                                        const index = imageFiles.findIndex(f => f.id === file.id);
                                                        if (index !== -1) {
                                                            setCurrentImageIndex(index);
                                                            setLightboxOpen(true);
                                                        }
                                                    }}
                                                >
                                                    <img
                                                        src={file.url}
                                                        alt={file.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        loading="lazy"
                                                    />

                                                    {/* Overlay */}
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                                                        <button
                                                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md border border-white/30 transition-transform hover:scale-110"
                                                            title="View Full Size"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const index = imageFiles.findIndex(f => f.id === file.id);
                                                                if (index !== -1) {
                                                                    setCurrentImageIndex(index);
                                                                    setLightboxOpen(true);
                                                                }
                                                            }}
                                                        >
                                                            <ImageIcon className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            className="p-3 bg-saffron hover:bg-saffron-light rounded-full text-white shadow-lg transition-transform hover:scale-110"
                                                            title="Download"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // Use local proxy API to bypass CORS and force download
                                                                const downloadUrl = `/api/download?url=${encodeURIComponent(file.url)}&name=${encodeURIComponent(file.name)}`;
                                                                window.location.href = downloadUrl;
                                                            }}
                                                        >
                                                            <Download className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="aspect-square flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-800 text-muted">
                                                    <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center mb-4">
                                                        <ImageIcon className="w-8 h-8 opacity-50" />
                                                    </div>
                                                    <p className="text-xs text-center truncate w-full px-4">{file.name}</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            subFolders.length === 0 && (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <ImageIcon className="w-10 h-10 text-muted/40" />
                                    </div>
                                    <p className="text-muted font-medium text-lg">{t('empty')}</p>
                                </div>
                            )
                        )}
                    </>
                )}
            </div>

            <ImageLightbox
                isOpen={lightboxOpen}
                currentIndex={currentImageIndex}
                images={imageFiles.map(f => ({ src: f.url, alt: f.name }))}
                onClose={() => setLightboxOpen(false)}
                onNext={() => setCurrentImageIndex(prev => (prev + 1) % imageFiles.length)}
                onPrev={() => setCurrentImageIndex(prev => (prev - 1 + imageFiles.length) % imageFiles.length)}
            />
        </div>
    );
}

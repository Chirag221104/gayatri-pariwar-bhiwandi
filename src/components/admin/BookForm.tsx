"use client";

import { useState, useEffect, useRef } from "react";
import { useWarnUnsavedChanges } from "@/hooks/useWarnUnsavedChanges";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
    Save,
    X,
    Tag,
    Image as ImageIcon,
    Loader2,
    Trash2,
    BookOpen,
    Archive,
    IndianRupee,
    User,
    CheckCircle2,
    QrCode,
    History,
    Check
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import QRCode from "react-qr-code";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

import {
    generateProductCode,
    PRODUCT_TYPES,
    ProductTypeCode,
    Product,
    formatProductQR
} from "@/lib/product-utils";
import { generateProductLabels } from "@/lib/label-generator";

interface ProductFormProps {
    initialData?: Partial<Product>;
    onSave: (data: Partial<Product>) => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
}

const PRODUCT_TYPE_OPTIONS = [
    { label: 'Book', value: PRODUCT_TYPES.BOOK },
    { label: 'Hawan Samagri', value: PRODUCT_TYPES.SAMAGRI },
    { label: 'Gobar Product', value: PRODUCT_TYPES.GOBAR },
    { label: 'Vastra', value: PRODUCT_TYPES.VASTRA },
    { label: 'Incense', value: PRODUCT_TYPES.INCENSE },
    { label: 'Other', value: PRODUCT_TYPES.OTHER },
];

const CATEGORIES = [
    'General',
    'Spiritual',
    'Yoga',
    'Philosophy',
    'Science',
    'Meditation',
    'Ayurveda',
    'Youth'
];

export default function ProductForm({ initialData, onSave, onCancel, isSaving }: ProductFormProps) {
    const data = initialData as any;
    const [categories, setCategories] = useState<string[]>([]);
    const [name, setName] = useState(data?.name || data?.title || "");
    const [type, setType] = useState<ProductTypeCode>(initialData?.type || PRODUCT_TYPES.BOOK);
    const [productCode, setProductCode] = useState(initialData?.productCode || "");
    const [variantInfo, setVariantInfo] = useState(initialData?.variantInfo || "");
    const [author, setAuthor] = useState(initialData?.metadata?.author || data?.author || "");
    const [price, setPrice] = useState(initialData?.price || 0);
    const [category, setCategory] = useState(data?.category || "");
    const [stockQuantity, setStockQuantity] = useState(initialData?.stockQuantity || 0);
    const [description, setDescription] = useState(initialData?.description || "");
    const [coverUrl, setCoverUrl] = useState(initialData?.imageUrl || data?.coverUrl || "");
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [newTag, setNewTag] = useState("");
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
    const [rackId, setRackId] = useState(initialData?.rackId || "");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isDirty, setIsDirty] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useWarnUnsavedChanges(isDirty);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const q = query(collection(db, "granthalaya_app/inventory/categories"), orderBy("order", "asc"), orderBy("name", "asc"));
                const querySnapshot = await getDocs(q);
                const fetched = querySnapshot.docs.map(doc => doc.data().name);
                setCategories(fetched);
                if (!category && fetched.length > 0) {
                    setCategory(fetched[0]);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories(['General', 'Spiritual', 'Yoga', 'Philosophy', 'Science', 'Meditation', 'Ayurveda', 'Youth']);
            }
        };
        fetchCategories();
    }, []);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsDirty(false);

        // Final code generation if missing
        let finalCode = productCode;
        if (!finalCode) {
            finalCode = generateProductCode(type, name, Date.now().toString().slice(-4));
        }

        await onSave({
            name,
            type,
            productCode: finalCode,
            variantInfo,
            price: Number(price),
            category: category as any,
            stockQuantity: Number(stockQuantity),
            description,
            imageUrl: coverUrl,
            tags,
            isActive,
            rackId,
            metadata: {
                author,
            }
        });
    };

    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag("");
            setIsDirty(true);
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
        setIsDirty(true);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Create a unique filename
            const timestamp = Date.now();
            const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const storageRef = ref(storage, `granthalaya/covers/${timestamp}_${sanitizedFilename}`);

            // Upload file with progress tracking
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error('Upload error:', error);
                    alert('Failed to upload image. Please try again.');
                    setIsUploading(false);
                },
                async () => {
                    // Upload completed, get download URL
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setCoverUrl(downloadURL);
                    setIsDirty(true);
                    setIsUploading(false);
                    setUploadProgress(0);
                    // Reset file input
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                }
            );
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Please try again.');
            setIsUploading(false);
        }
    };

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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={labelClasses}>Product Name *</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); setIsDirty(true); }}
                                    required
                                    className={`${inputClasses} text-lg font-bold`}
                                    placeholder="Enter product name..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Product Type *</label>
                                <select
                                    value={type}
                                    onChange={(e) => { setType(e.target.value as any); setIsDirty(true); }}
                                    className={inputClasses}
                                >
                                    {PRODUCT_TYPE_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={labelClasses}>{type === 'BK' ? 'Author *' : 'Manufacturer/Source'}</label>
                                <div className="relative">
                                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => { setAuthor(e.target.value); setIsDirty(true); }}
                                        required={type === 'BK'}
                                        className={`${inputClasses} pl-10`}
                                        placeholder={type === 'BK' ? "Author Name" : "Optional source/mfg"}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Price (₹) *</label>
                                <div className="relative">
                                    <IndianRupee className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => { setPrice(Number(e.target.value)); setIsDirty(true); }}
                                        required
                                        min="0"
                                        className={`${inputClasses} pl-10`}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={labelClasses}>Variant Label (Display Only)</label>
                                <input
                                    type="text"
                                    value={variantInfo}
                                    onChange={(e) => { setVariantInfo(e.target.value); setIsDirty(true); }}
                                    className={inputClasses}
                                    placeholder="e.g. 500g, Pack of 10"
                                />
                                <p className="text-[10px] text-slate-500 px-1 italic">Shown on printable labels only</p>
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Product Code (Immutable)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={productCode || "Will be generated on save"}
                                        disabled
                                        className={`${inputClasses} font-mono text-[11px] bg-slate-500/5`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className={labelClasses}>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => { setDescription(e.target.value); setIsDirty(true); }}
                                rows={6}
                                className={`${inputClasses} resize-none leading-relaxed`}
                                placeholder="Describe the product details..."
                            />
                        </div>
                    </div>

                    <div className={cardClasses}>
                        <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Categories & Tags
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={labelClasses}>Category (Single Choice)</label>
                                <select
                                    value={category}
                                    onChange={(e) => { setCategory(e.target.value); setIsDirty(true); }}
                                    className={inputClasses}
                                    required
                                >
                                    <option value="" disabled>Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-slate-500 px-1 leading-normal italic">
                                    Used for <b>Browsing mode</b> (e.g., "Samagri {'>'} Hawan"). A product belongs to exactly one category.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Discovery Tags (Multiple allowed)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                        className={inputClasses}
                                        placeholder="e.g. Trending, Featured"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className={`px-4 rounded-xl font-bold ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}
                                        >
                                            #{tag}
                                            <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                                        </span>
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-500 px-1 leading-normal italic mt-2">
                                    Used for <b>Home Discovery sections</b>. Products can have multiple tags.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className={cardClasses}>
                        <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                            <Archive className="w-4 h-4" />
                            Inventory Status
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className={labelClasses}>Stock Quantity *</label>
                                <input
                                    type="number"
                                    value={stockQuantity}
                                    onChange={(e) => { setStockQuantity(Number(e.target.value)); setIsDirty(true); }}
                                    required
                                    min="0"
                                    className={inputClasses}
                                    placeholder="Available units"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={labelClasses}>Rack ID (Location)</label>
                                <input
                                    type="text"
                                    value={rackId}
                                    onChange={(e) => { setRackId(e.target.value); setIsDirty(true); }}
                                    className={inputClasses}
                                    placeholder="e.g. RACK-A3"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => { setIsActive(!isActive); setIsDirty(true); }}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${isActive
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                                    : isDark
                                        ? "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200"
                                        : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                                    }`}
                            >
                                <div className="flex flex-col items-start gap-0.5">
                                    <span className="text-sm font-bold uppercase tracking-tight">Active Status</span>
                                    <span className="text-[10px] opacity-60">{isActive ? 'Visible to public' : 'Hidden from store'}</span>
                                </div>
                                {isActive && <CheckCircle2 className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className={cardClasses}>
                        <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Product Image
                        </h2>

                        <div className="space-y-4">
                            {coverUrl ? (
                                <div className={`relative aspect-[3/4] rounded-xl overflow-hidden border group ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                                    <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCoverUrl("");
                                            setIsDirty(true);
                                            // Reset file input
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = '';
                                            }
                                        }}
                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                    >
                                        <Trash2 className="w-8 h-8 text-white" />
                                    </button>
                                </div>
                            ) : (
                                <div className={`aspect-[3/4] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all ${isDark ? 'bg-slate-800/20 border-slate-700 hover:border-slate-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                                    <BookOpen className="w-12 h-12 text-slate-300" />
                                    <p className="text-xs text-slate-400 font-medium">Cover image needed</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className={labelClasses}>Upload Cover Image</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                    className="hidden"
                                    id="cover-upload"
                                />
                                <label
                                    htmlFor="cover-upload"
                                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed transition-all cursor-pointer ${isUploading
                                        ? 'opacity-50 cursor-not-allowed'
                                        : isDark
                                            ? 'border-slate-700 hover:border-slate-600 bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                                            : 'border-slate-300 hover:border-orange-500 bg-white text-slate-600 hover:bg-orange-50'
                                        }`}
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    {isUploading ? 'Uploading...' : 'Choose Image File'}
                                </label>

                                {isUploading && (
                                    <div className="space-y-1">
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-orange-500 h-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-500 text-center">{Math.round(uploadProgress)}%</p>
                                    </div>
                                )}

                                <p className="text-[10px] text-slate-500 px-1">Max 5MB • Recommended: 3:4 ratio (e.g., 600x800px)</p>
                            </div>
                        </div>
                    </div>

                    {productCode && (
                        <div className={cardClasses}>
                            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                                <QrCode className="w-4 h-4" />
                                Product Identity (QR)
                            </h2>
                            <div className="space-y-4">
                                <div className={`p-6 rounded-2xl border-2 border-dashed flex items-center justify-center ${isDark ? 'bg-slate-800/20 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                    <QRCode value={formatProductQR(productCode)} size={180} />
                                </div>
                                <p className="text-[10px] text-slate-500 text-center px-1 font-mono">{productCode}</p>
                                <p className="text-[10px] text-slate-500 text-center px-1">Encoded for secure verification</p>
                            </div>
                        </div>
                    )}

                    {(initialData?.createdAt || initialData?.updatedAt) && (
                        <div className={cardClasses}>
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <History className="w-4 h-4" />
                                Audit Trail
                            </h2>
                            <div className="space-y-2 text-[10px] font-bold uppercase tracking-tight text-slate-500">
                                {initialData.createdAt && (
                                    <div className="flex justify-between">
                                        <span>Created:</span>
                                        <span>{new Date(initialData.createdAt.seconds * 1000).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {initialData.updatedAt && (
                                    <div className="flex justify-between">
                                        <span>Last Sync:</span>
                                        <span>{new Date(initialData.updatedAt.seconds * 1000).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {initialData.createdBy && (
                                    <div className="flex justify-between truncate">
                                        <span>Author:</span>
                                        <span className="truncate ml-2">{initialData.createdBy}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Actions Bar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-8 z-30">
                <div className={`backdrop-blur-xl border rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4 ${isDark
                    ? 'bg-[#0f172a]/80 border-white/10'
                    : 'bg-white/90 border-slate-200'
                    }`}>
                    <div className="flex-1 flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSaving}
                            className={`w-full px-6 py-3 rounded-xl font-bold transition-all ${isDark
                                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                }`}
                        >
                            Cancel
                        </button>
                        {initialData?.productCode && (
                            <button
                                type="button"
                                onClick={() => generateProductLabels([initialData as Product])}
                                className={`w-full px-6 py-2 rounded-xl text-xs font-bold transition-all border ${isDark
                                    ? 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'
                                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                Download Label
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-[2] px-6 py-6 rounded-xl bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white font-bold transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                {initialData?.id ? 'Update Product' : 'Add to Inventory'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form >
    );
}

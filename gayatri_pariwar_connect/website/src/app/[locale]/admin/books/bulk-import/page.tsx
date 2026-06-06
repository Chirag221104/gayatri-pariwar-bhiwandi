"use client";

import { useState, useEffect } from "react";
import { FileText, Upload, CheckCircle, AlertCircle, Trash2, ArrowLeft, Loader2, Download, Table, Save } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, writeBatch, doc, serverTimestamp } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SectionHeader from "@/components/ui/SectionHeader";
import { useToast } from "@/components/ui/Toast";
import { Product, PRODUCT_TYPES, generateProductCode } from "@/lib/product-utils";

interface ImportProduct {
    name: string;
    type: string;
    category: string;
    price: number;
    stockQuantity: number;
    description: string;
    productCode: string;
    rackId?: string;
    status?: 'pending' | 'error' | 'success';
    reason?: string;
}

export default function BulkImportPage() {
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || "en";
    const { user } = useAuth();
    const { showToast } = useToast();
    const [isDark, setIsDark] = useState(false);

    const [file, setFile] = useState<File | null>(null);
    const [products, setProducts] = useState<ImportProduct[]>([]);
    const [importing, setImporting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const checkDark = () => {
            const saved = localStorage.getItem('admin-theme');
            if (saved === 'dark') setIsDark(true);
            else if (saved === 'system') setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
        };
        checkDark();
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            processFile(selectedFile);
        }
    };

    const processFile = async (selectedFile: File) => {
        setIsProcessing(true);
        const reader = new FileReader();

        reader.onload = async (event) => {
            const content = event.target?.result as string;
            if (selectedFile.name.endsWith('.csv')) {
                parseCSV(content);
            } else if (selectedFile.name.endsWith('.json')) {
                parseJSON(content);
            }
            setIsProcessing(false);
        };

        reader.readAsText(selectedFile);
    };

    const parseCSV = (content: string) => {
        const lines = content.split('\n');
        const header = lines[0].split(',').map(h => h.trim().toLowerCase());

        const importedData: ImportProduct[] = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].split(',').map(c => c.trim());
            if (line.length < 2) continue; // Skip empty lines

            const item: any = {};
            header.forEach((key, index) => {
                item[key] = line[index];
            });

            // Basic Mapping & Validation
            const product: ImportProduct = {
                name: item.name || item.title || "",
                type: (item.type || "BK").toUpperCase(),
                category: item.category || "Uncategorized",
                price: parseFloat(item.price || "0"),
                stockQuantity: parseInt(item.stockQuantity || item.quantity || "0"),
                description: item.description || "",
                productCode: item.productcode || item.code || "",
                rackId: item.rackid || item.location || "",
                status: 'pending'
            };

            // Generate product code if missing
            if (!product.productCode && product.name) {
                product.productCode = generateProductCode(product.type as any, product.name, Math.floor(Math.random() * 90000) + 10000);
            }

            if (!product.name) {
                product.status = 'error';
                product.reason = "Missing name/title";
            }

            importedData.push(product);
        }

        setProducts(importedData);
    };

    const parseJSON = (content: string) => {
        try {
            const data = JSON.parse(content);
            if (!Array.isArray(data)) {
                showToast("JSON must be an array of products", "error");
                return;
            }
            // Map JSON similar to CSV
            setProducts(data.map((item: any) => ({
                ...item,
                status: 'pending'
            })));
        } catch (e) {
            showToast("Invalid JSON format", "error");
        }
    };

    const handleImport = async () => {
        if (products.length === 0) return;
        const validProducts = products.filter(p => p.status !== 'error');

        if (!window.confirm(`Import ${validProducts.length} items to Firestore?`)) return;

        setImporting(true);
        const batch = writeBatch(db);
        const inventoryRef = collection(db, "granthalaya_app", "inventory", "books");

        try {
            validProducts.forEach(p => {
                const newDocRef = doc(inventoryRef);
                const firestoreProduct = {
                    name: p.name,
                    title: p.name, // Maintain legacy support
                    type: p.type,
                    category: p.category,
                    price: p.price,
                    stockQuantity: p.stockQuantity,
                    description: p.description,
                    productCode: p.productCode,
                    rackId: p.rackId || "",
                    isActive: true,
                    tags: [],
                    variantInfo: "",
                    createdBy: user?.uid || "admin",
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                };
                batch.set(newDocRef, firestoreProduct);
            });

            await batch.commit();
            showToast(`Successfully imported ${validProducts.length} items!`, "success");
            setProducts([]);
            setFile(null);
        } catch (error) {
            console.error("Bulk import error:", error);
            showToast("Failed to perform bulk import", "error");
        } finally {
            setImporting(false);
        }
    };

    const removeProduct = (index: number) => {
        setProducts(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className={`min-h-screen flex flex-col ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <SectionHeader
                icon={FileText}
                title="Bulk Inventory Import"
                subtitle="Upload CSV or JSON to populate your Granthalaya collection"
                actions={
                    <button
                        onClick={() => router.back()}
                        className={`p-2 rounded-full ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}`}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                }
            />

            <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 space-y-8">
                {/* Upload Zone */}
                {!file ? (
                    <div className={`flex flex-col items-center justify-center py-24 rounded-3xl border-2 border-dashed ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-300 bg-slate-50'}`}>
                        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
                            <Upload className="w-8 h-8 text-orange-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Drop your files here</h2>
                        <p className="text-slate-500 mb-8 max-w-sm text-center text-sm">
                            Support .CSV and .JSON files. Please use the standardized template for best results.
                        </p>
                        <input
                            type="file"
                            accept=".csv,.json"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="bulk-upload"
                        />
                        <label
                            htmlFor="bulk-upload"
                            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95 cursor-pointer"
                        >
                            Select File
                        </label>
                        <div className="mt-8 flex gap-4">
                            <button className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-orange-500 flex items-center gap-1">
                                <Download className="w-3 h-3" /> Download Template
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* File Meta */}
                        <div className={`p-4 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                    <Table className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <div className="font-bold">{file.name}</div>
                                    <div className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB • {products.length} ready to parse</div>
                                </div>
                            </div>
                            <button
                                onClick={() => { setFile(null); setProducts([]); }}
                                className="text-red-500 hover:bg-red-500/10 p-2 rounded-xl transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Preview Table */}
                        <div className={`rounded-3xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className={`text-xs uppercase font-bold tracking-widest text-slate-400 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                        <tr>
                                            <th className="px-6 py-4">Code</th>
                                            <th className="px-6 py-4">Name</th>
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4">Stock</th>
                                            <th className="px-6 py-4">Price</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {products.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-mono text-sm animate-pulse">
                                                    Parsing file contents...
                                                </td>
                                            </tr>
                                        ) : (
                                            products.map((p, idx) => (
                                                <tr key={idx} className={`group ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                                                    <td className="px-6 py-4 font-mono text-[10px]">{p.productCode}</td>
                                                    <td className="px-6 py-4">
                                                        <div className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{p.name}</div>
                                                        <div className="text-[10px] text-slate-500">{p.category}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-[10px] bg-slate-500/10 px-1.5 py-0.5 rounded font-bold">{p.type}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium">{p.stockQuantity}</td>
                                                    <td className="px-6 py-4 text-sm font-bold">₹{p.price}</td>
                                                    <td className="px-6 py-4">
                                                        {p.status === 'error' ? (
                                                            <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold">
                                                                <AlertCircle className="w-3 h-3" /> ERROR: {p.reason}
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold">
                                                                <CheckCircle className="w-3 h-3" /> VALID
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => removeProduct(idx)}
                                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Import Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleImport}
                                disabled={importing || products.length === 0 || products.some(p => p.status === 'error')}
                                className={`px-10 py-4 rounded-2xl font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg ${importing || products.length === 0 || products.some(p => p.status === 'error')
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20 active:scale-95'
                                    }`}
                            >
                                {importing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Confirm & Import {products.filter(p => p.status !== 'error').length} Items
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

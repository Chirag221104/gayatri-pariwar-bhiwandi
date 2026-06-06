"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

const CATEGORIES_TO_SEED = [
    // Hawan Samagri
    { id: "samidha-wood", name: "Samidha (Holy Wood)", typeCode: "SAMAGRI", order: 0 },
    { id: "ghee-oils", name: "Ghee & Diya Oils", typeCode: "SAMAGRI", order: 1 },
    { id: "medicinal-herbs", name: "Medicinal Herbs (Aushadhi)", typeCode: "SAMAGRI", order: 2 },
    { id: "puja-kits", name: "Complete Puja Kits", typeCode: "SAMAGRI", order: 3 },

    // Gobar Products
    { id: "dhoop-cups", name: "Dhoop Cups", typeCode: "GOBAR", order: 0 },
    { id: "uplas", name: "Cow Dung Cakes (Upla)", typeCode: "GOBAR", order: 1 },
    { id: "organic-manure", name: "Organic Manure", typeCode: "GOBAR", order: 2 },
    { id: "handmade-diyas", name: "Handmade Gobar Diyas", typeCode: "GOBAR", order: 3 },

    // Vastra
    { id: "deity-dresses", name: "Deity Dresses (Poshak)", typeCode: "VASTRA", order: 0 },
    { id: "altar-cloths", name: "Altar Cloths (Red/Yellow)", typeCode: "VASTRA", order: 1 },
    { id: "navagraha-cloths", name: "Navagraha Specialty Cloths", typeCode: "VASTRA", order: 2 },

    // Incense
    { id: "bamboo-free", name: "Bamboo-Free Sticks", typeCode: "INCENSE", order: 0 },
    { id: "gugal-dhoop", name: "Gugal & Loban Dhoop", typeCode: "INCENSE", order: 1 },
    { id: "fragrant-sticks", name: "Fragrant Sticks (Chandan/Mogra)", typeCode: "INCENSE", order: 2 },
];

export default function SeedCategoriesPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [progress, setProgress] = useState(0);
    const { showToast } = useToast();

    const handleSeed = async () => {
        if (!confirm("This will create or update the spiritual categories. Proceed?")) return;

        setStatus("loading");
        let count = 0;

        try {
            for (const cat of CATEGORIES_TO_SEED) {
                const docRef = doc(db, "granthalaya_app", "inventory", "categories", cat.id);
                await setDoc(docRef, {
                    name: cat.name,
                    typeCode: cat.typeCode,
                    order: cat.order,
                    isActive: true,
                    updatedAt: serverTimestamp()
                }, { merge: true });

                count++;
                setProgress(Math.round((count / CATEGORIES_TO_SEED.length) * 100));
            }
            setStatus("success");
            showToast("Categories seeded successfully", "success");
        } catch (error) {
            console.error("Seeding error:", error);
            setStatus("error");
            showToast("Failed to seed categories", "error");
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-10 shadow-xl overflow-hidden relative">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full -mr-16 -mt-16" />

                <div className="relative space-y-8">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Save className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold font-display tracking-tight">Category Seeder</h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Populate the inventory system with researched spiritual categories for Hawan Samagri, Gobar Products, Vastra, and Incense.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Categories to be added:</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                {CATEGORIES_TO_SEED.map(c => (
                                    <div key={c.id} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        {c.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {status === "loading" && (
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-orange-500 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                    Seeding... {progress}%
                                </p>
                            </div>
                        )}

                        {status === "success" && (
                            <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-medium">Database populated successfully!</p>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 rounded-xl border border-red-100 dark:border-red-500/20">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-medium">Failed to seed database. Check console.</p>
                            </div>
                        )}

                        <button
                            onClick={handleSeed}
                            disabled={status === "loading" || status === "success"}
                            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 text-lg"
                        >
                            {status === "loading" ? "Processing..." : "Run Seeder"}
                            <Save className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

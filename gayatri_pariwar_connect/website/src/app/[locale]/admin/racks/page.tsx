
"use client";

import { useState, useEffect, useRef } from "react";
import {
    Plus,
    Printer,
    MapPin,
    Trash2,
    Loader2,
    Search,
    LayoutGrid,
    X,
    Save
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "firebase/firestore";
import { Rack } from "@/lib/product-utils";
import { useReactToPrint } from "react-to-print";
import { RackLabel, GlobalPrintStyles } from "@/components/admin/granthalaya/PrintLabelComponents";

export default function RacksPage() {
    const [racks, setRacks] = useState<Rack[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // Printing
    const printRef = useRef<HTMLDivElement>(null);
    const [racksToPrint, setRacksToPrint] = useState<Rack[]>([]);

    // We use a ref to store the promise resolve function or just triggering logic
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Rack_Labels_${new Date().toISOString().split('T')[0]}`,
    });

    const triggerPrint = (items: Rack[]) => {
        setRacksToPrint(items);
        // Use timeout to allow state update and render before printing
        setTimeout(() => {
            handlePrint();
        }, 100);
    };

    // New Rack Form State
    const [newRack, setNewRack] = useState({
        rackId: "",
        name: "",
        section: "",
        shelf: ""
    });

    useEffect(() => {
        const checkDark = () => {
            const saved = localStorage.getItem('admin-theme');
            if (saved === 'dark') setIsDark(true);
            else if (saved === 'system') setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
            else setIsDark(false);
        };
        checkDark();
        const interval = setInterval(checkDark, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const q = query(collection(db, "granthalaya_app/inventory/racks"), orderBy("rackId"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const rackData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Rack[];
            setRacks(rackData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleAddRack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRack.rackId || !newRack.name) return;

        setIsSaving(true);
        try {
            await addDoc(collection(db, "granthalaya_app/inventory/racks"), {
                ...newRack,
                isActive: true,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            setShowAddModal(false);
            setNewRack({ rackId: "", name: "", section: "", shelf: "" });
        } catch (error) {
            console.error("Error adding rack:", error);
            alert("Failed to add rack.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteRack = async (id: string, rackId: string) => {
        if (!confirm(`Are you sure you want to delete Rack ${rackId}?`)) return;
        try {
            await deleteDoc(doc(db, "granthalaya_app/inventory/racks", id));
        } catch (error) {
            console.error("Error deleting rack:", error);
            alert("Failed to delete rack.");
        }
    };

    const filteredRacks = racks.filter(r =>
        r.rackId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.section?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const cardClasses = `p-6 rounded-2xl border transition-all duration-200 ${isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
        }`;

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Storage Racks</h1>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manage physical inventory locations and QR labels</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => triggerPrint(filteredRacks)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        <Printer className="w-4 h-4" />
                        Print All
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        Add Rack
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className={`relative max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search racks by ID, name, or section..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all ${isDark ? 'bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-blue-500/50' : 'bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500/30'
                        }`}
                />
            </div>

            {/* Rack Grid */}
            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : filteredRacks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRacks.map(rack => (
                        <div key={rack.id} className={cardClasses}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                                    <LayoutGrid className="w-6 h-6 text-blue-500" />
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => triggerPrint([rack])}
                                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                                        title="Print Label"
                                    >
                                        <Printer className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRack(rack.id!, rack.rackId)}
                                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-500'}`}
                                        title="Delete Rack"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{rack.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-blue-500 text-white">
                                        {rack.rackId}
                                    </span>
                                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {rack.section || 'General'} • {rack.shelf || 'Any Shelf'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={`text-center p-20 rounded-3xl border-2 border-dashed ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>No racks found. Add one to get started.</p>
                </div>
            )}

            {/* Add Rack Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSaving && setShowAddModal(false)} />
                    <div className={`relative w-full max-w-md p-8 rounded-3xl shadow-2xl animate-in zoom-in duration-200 ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>New Storage Rack</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleAddRack} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Rack ID *</label>
                                <input
                                    type="text"
                                    required
                                    value={newRack.rackId}
                                    onChange={(e) => setNewRack({ ...newRack, rackId: e.target.value.toUpperCase() })}
                                    placeholder="e.g. RACK-A1"
                                    className={`w-full px-4 py-3 rounded-xl outline-none border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Friendly Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newRack.name}
                                    onChange={(e) => setNewRack({ ...newRack, name: e.target.value })}
                                    placeholder="e.g. Main Hall Left Rack"
                                    className={`w-full px-4 py-3 rounded-xl outline-none border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Section</label>
                                    <input
                                        type="text"
                                        value={newRack.section}
                                        onChange={(e) => setNewRack({ ...newRack, section: e.target.value })}
                                        placeholder="e.g. Ground Floor"
                                        className={`w-full px-4 py-3 rounded-xl outline-none border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Shelf</label>
                                    <input
                                        type="text"
                                        value={newRack.shelf}
                                        onChange={(e) => setNewRack({ ...newRack, shelf: e.target.value })}
                                        placeholder="e.g. Row 2"
                                        className={`w-full px-4 py-3 rounded-xl outline-none border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Create Rack Location
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* Hidden Print Surface */}
            <div className="hidden">
                <div ref={printRef} className="print-surface bg-white text-black font-sans p-[3mm]">
                    <div className="flex flex-wrap gap-[2mm] justify-start align-top">
                        {racksToPrint.map((rack) => (
                            <div key={rack.id} className="label-wrapper">
                                {/* Cast to any to avoid strict type checks if mismatch - though should be compatible */}
                                <RackLabel rack={rack as any} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <GlobalPrintStyles />
        </div>
    );
}

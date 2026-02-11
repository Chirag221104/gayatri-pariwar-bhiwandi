"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Package, CheckCircle, Truck, AlertCircle, Printer, Maximize2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp, arrayUnion, onSnapshot, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import PackingScanner from "@/components/admin/granthalaya/PackingScanner";
import { useToast } from "@/components/ui/Toast";
import SectionHeader from "@/components/ui/SectionHeader";
import { formatOrderQR } from "@/lib/product-utils";

// Types
interface OrderItem {
    bookId: string;
    productCode?: string;
    title: string; // From Order record
    name?: string; // Legacy support
    unitPrice: number; // From Order record
    quantity: number;
    rackId?: string; // Snapshot of location (if exists)
    imageUrl?: string; // Snapshot (if exists)
    variantInfo?: string;
}

interface BookDetails {
    id: string;
    title: string;
    name: string;
    productCode: string;
    coverUrl?: string;
    imageUrl?: string;
    rackId?: string;
    variantInfo?: string;
}

interface Order {
    id: string;
    userId: string;
    customerName: string;
    status: string;
    deliveryStatus: string;
    items: OrderItem[];
    createdAt: any;
    deliveryAddress: any;
    updatedAt: any;
    packingProgress?: Record<string, number>;
}

export default function PackingModePage() {
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [isDark, setIsDark] = useState(false);

    // State
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [books, setBooks] = useState<Record<string, BookDetails>>({});
    const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
    const [searchInput, setSearchInput] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [verifiedItems, setVerifiedItems] = useState<{ [key: string]: number }>({});
    const [verifiedRacks, setVerifiedRacks] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [scannedRack, setScannedRack] = useState<string | null>(null);

    useEffect(() => {
        const checkDark = () => {
            const saved = localStorage.getItem('admin-theme');
            if (saved === 'dark') setIsDark(true);
            else if (saved === 'system') setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
        };
        checkDark();
    }, []);

    // Fetch recent orders for live search suggestions
    useEffect(() => {
        const q = query(
            collection(db, "granthalaya_app", "orders_module", "orders"),
            orderBy("createdAt", "desc"),
            limit(100)
        );
        const unsubscribe = onSnapshot(q, (snap) => {
            setPendingOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
        });
        return () => unsubscribe();
    }, []);

    const searchSuggestions = useMemo(() => {
        const q = searchInput.toLowerCase().replace(/^#/, '').replace(/^ord-/i, '');
        if (!q || q.length < 2) return [];

        return pendingOrders.filter(o =>
            o.id.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q)
        ).slice(0, 5);
    }, [searchInput, pendingOrders]);

    // Derived State
    const progress = useMemo(() => {
        if (!currentOrder) return 0;
        const totalItems = currentOrder.items.reduce((acc, item) => acc + item.quantity, 0);
        const totalVerified = Object.values(verifiedItems).reduce((acc, qty) => acc + qty, 0);
        return totalItems > 0 ? Math.round((totalVerified / totalItems) * 100) : 0;
    }, [currentOrder, verifiedItems]);

    const isFullyVerified = progress === 100;

    // Handlers
    const handleScan = async (data: string, type: 'PRODUCT' | 'RACK' | 'ORDER') => {
        if (type === 'ORDER') {
            await fetchOrder(data);
        } else if (type === 'RACK') {
            verifyRack(data);
        } else if (type === 'PRODUCT') {
            verifyProduct(data);
        }
    };

    // Subscribe to order updates
    useEffect(() => {
        if (!currentOrder?.id) return;

        const docRef = doc(db, "granthalaya_app", "orders_module", "orders", currentOrder.id);
        const unsubscribe = onSnapshot(docRef, (snap) => {
            if (snap.exists()) {
                const data = { id: snap.id, ...snap.data() } as Order;

                // Merge remote packing progress if available
                // Assuming we might add 'packingProgress' field later for cross-device sync
                // For now, we mainly sync status and details

                setCurrentOrder(prev => {
                    // Preserve local verification if remote doesn't have it (hybrid for now)
                    // But if remote status changes to PACKED, we should respect that
                    if (JSON.stringify(prev) !== JSON.stringify(data)) {
                        return data;
                    }
                    return prev;
                });

                // Phase 25: Sync item-level verification from mobile scans
                if (data.packingProgress) {
                    setVerifiedItems(prev => {
                        const next = { ...prev };
                        let changed = false;
                        Object.entries(data.packingProgress!).forEach(([id, qty]) => {
                            if (next[id] !== qty) {
                                next[id] = qty as number;
                                changed = true;
                            }
                        });
                        return changed ? next : prev;
                    });
                }

                // Phase 25/26: Fetch books if item list changed or missing details
                const fetchMissingBooks = async () => {
                    const missingIds = data.items
                        .map(item => item.bookId)
                        .filter(id => !books[id]);

                    if (missingIds.length > 0) {
                        const bookData: Record<string, BookDetails> = { ...books };
                        await Promise.all(missingIds.map(async (id) => {
                            const bookRef = doc(db, "granthalaya_app", "inventory", "books", id);
                            const bookSnap = await getDoc(bookRef);
                            if (bookSnap.exists()) {
                                bookData[id] = { id: bookSnap.id, ...bookSnap.data() } as BookDetails;
                            }
                        }));
                        setBooks(bookData);
                    }
                };
                fetchMissingBooks();

                // If status changed to PACKED externally
                if (data.deliveryStatus === 'packed' && currentOrder.deliveryStatus !== 'packed') {
                    showToast("Order completed by another device!", "success");
                    // Optionally redirect or show success state
                }
            }
        }, (error) => {
            console.error("Order listener error:", error);
        });

        return () => unsubscribe();
    }, [currentOrder?.id]);

    const fetchOrder = async (orderId: string) => {
        if (!orderId) return;

        // Strip prefix and common symbols
        const finalId = orderId.replace(/^ORD-/i, '').replace(/^#/i, '').trim();

        setLoading(true);
        setShowSuggestions(false);
        try {
            // 1. Try direct ID match (case-sensitive)
            let docRef = doc(db, "granthalaya_app", "orders_module", "orders", finalId);
            let snap = await getDoc(docRef);

            // 2. If not found, try case-insensitive lookup in local cache
            if (!snap.exists()) {
                const found = pendingOrders.find(o => o.id.toLowerCase() === finalId.toLowerCase());
                if (found) {
                    docRef = doc(db, "granthalaya_app", "orders_module", "orders", found.id);
                    snap = await getDoc(docRef);
                }
            }

            // 3. If STILL not found and it's not a short ID, try a name query
            if (!snap.exists() && finalId.length > 3) {
                const q = query(
                    collection(db, "granthalaya_app", "orders_module", "orders"),
                    where("customerName", "==", finalId),
                    limit(1)
                );
                const qSnap = await getDocs(q);
                if (!qSnap.empty) {
                    snap = qSnap.docs[0];
                }
            }

            if (snap && snap.exists()) {
                const data = { id: snap.id, ...snap.data() } as Order;
                setCurrentOrder(data);
                setSearchInput(""); // Clear search

                // Fetch book details for each item
                const bookData: Record<string, BookDetails> = {};
                await Promise.all(data.items.map(async (item) => {
                    const bookRef = doc(db, "granthalaya_app", "inventory", "books", item.bookId);
                    const bookSnap = await getDoc(bookRef);
                    if (bookSnap.exists()) {
                        bookData[item.bookId] = { id: bookSnap.id, ...bookSnap.data() } as BookDetails;
                    }
                }));
                setBooks(bookData);

                // Reset local state only on NEW order load
                setVerifiedItems(data.packingProgress || {});
                setVerifiedRacks(new Set());
                setScannedRack(null);

                if (data.deliveryStatus === 'packed') {
                    showToast("Ordered is already packed.", "info");
                } else {
                    showToast(`Order loaded: #${data.id.slice(-8)}`, "success");
                }
            } else {
                showToast(`Order not found: ${finalId}`, "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Error loading order", "error");
        } finally {
            setLoading(false);
        }
    };

    const verifyRack = (rackId: string) => {
        const cleanRack = rackId.replace(/^RACK-/i, 'RACK-'); // Ensure format
        setScannedRack(cleanRack);

        if (currentOrder) {
            // Check if any items belong to this rack
            const relevantItems = currentOrder.items.filter(item => item.rackId === cleanRack);
            if (relevantItems.length > 0) {
                setVerifiedRacks(prev => new Set(prev).add(cleanRack));
                showToast(`Rack Verified: ${cleanRack}`, "success");
            } else {
                showToast(`Rack ${cleanRack} not needed for this order`, "info");
            }
        } else {
            showToast(`Rack Scanned: ${cleanRack}`, "info");
        }
    };

    const verifyProduct = async (code: string) => {
        if (!currentOrder) {
            showToast("Scan an order first", "error");
            return;
        }

        // Find item matching productCode or legacy ID or Name
        const itemIndex = currentOrder.items.findIndex(item =>
            (item.productCode && item.productCode === code) ||
            (item.bookId === code) // Fallback for legacy
        );

        if (itemIndex === -1) {
            showToast(`Item not in order: ${code}`, "error");
            return;
        }

        const item = currentOrder.items[itemIndex];
        const currentVerified = verifiedItems[item.bookId] || 0;
        const newQty = currentVerified + 1;

        if (currentVerified < item.quantity) {
            // Update local state immediately for responsiveness
            setVerifiedItems(prev => ({
                ...prev,
                [item.bookId]: newQty
            }));

            // Phase 25: Update Firestore for bi-directional sync with mobile
            try {
                const docRef = doc(db, "granthalaya_app", "orders_module", "orders", currentOrder.id);
                await updateDoc(docRef, {
                    [`packingProgress.${item.bookId}`]: newQty,
                    updatedAt: serverTimestamp()
                });
                showToast(`Verified: ${item.title || item.name}`, "success");
            } catch (error) {
                console.error("Firestore sync error:", error);
                showToast("Sync error (Check connection)", "error");
            }
        } else {
            showToast(`Item already fully verified: ${item.title || item.name}`, "info");
        }
    };

    const handleCompletePacking = async () => {
        if (!currentOrder || !isFullyVerified) return;

        if (!window.confirm("Complete packing for this order? Status will update to 'PACKED'.")) return;

        setLoading(true);
        try {
            const docRef = doc(db, "granthalaya_app", "orders_module", "orders", currentOrder.id);
            await updateDoc(docRef, {
                deliveryStatus: 'packed',
                status: 'packed',
                updatedAt: serverTimestamp(),
                packedBy: user?.uid || 'admin',
                deliveryTimeline: arrayUnion({
                    status: 'packed',
                    at: new Date(),
                    by: user?.uid || "admin",
                    note: "Verified via Packing Mode"
                })
            });

            showToast("Order marked as PACKED!", "success");
            router.push("/admin/books/orders"); // Return to list

        } catch (error) {
            console.error(error);
            showToast("Failed to update status", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex flex-col ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <PackingScanner onScan={handleScan} isActive={true} />

            {/* Header */}
            <div className={`p-4 border-b ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                if (currentOrder) {
                                    setCurrentOrder(null);
                                    setBooks({});
                                    setVerifiedItems({});
                                    setScannedRack(null);
                                    setSearchInput("");
                                } else {
                                    router.back();
                                }
                            }}
                            className={`p-2 rounded-full ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold font-display uppercase tracking-tight flex items-center gap-2">
                                <Package className="w-6 h-6 text-orange-500" />
                                Packing Mode
                            </h1>
                            <p className="text-xs text-slate-500 font-mono">
                                {currentOrder ? `ORDER #${currentOrder.id.slice(-8)}` : "WAITING FOR SCAN..."}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {currentOrder && (
                            <div className="flex flex-col items-end">
                                <span className={`text-2xl font-bold font-mono ${isFullyVerified ? 'text-emerald-500' : 'text-orange-500'}`}>
                                    {progress}%
                                </span>
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Verified</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {!currentOrder ? (
                        <div className="space-y-6">
                            <div className={`flex flex-col items-center justify-center py-12 rounded-3xl border-2 border-dashed ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-300 bg-slate-50'}`}>
                                <Package className={`w-16 h-16 mb-6 ${isDark ? 'text-slate-800' : 'text-slate-200'}`} />
                                <h2 className="text-2xl font-bold mb-2">Ready to Pack</h2>
                                <p className="text-slate-500 mb-8 max-w-md text-center text-sm">
                                    Scan an Order QR code, sync from the app, or search below.
                                </p>

                                <div className="relative w-full max-w-sm px-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={searchInput}
                                            onChange={(e) => {
                                                setSearchInput(e.target.value);
                                                setShowSuggestions(true);
                                            }}
                                            onFocus={() => setShowSuggestions(true)}
                                            placeholder="Order ID / Customer Name"
                                            className={`flex-1 px-4 py-3 rounded-2xl border font-mono text-sm shadow-sm transition-all focus:ring-2 focus:ring-orange-500/20 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') fetchOrder(searchInput);
                                            }}
                                        />
                                        <button
                                            onClick={() => fetchOrder(searchInput)}
                                            disabled={loading}
                                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                                        >
                                            {loading ? "..." : "Open"}
                                        </button>
                                    </div>

                                    {/* Live Suggestions Dropdown */}
                                    {showSuggestions && searchSuggestions.length > 0 && (
                                        <div className={`absolute top-full left-4 right-4 mt-2 p-2 rounded-2xl border shadow-xl z-50 animate-in fade-in slide-in-from-top-2 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                            {searchSuggestions.map(order => (
                                                <button
                                                    key={order.id}
                                                    onClick={() => {
                                                        fetchOrder(order.id);
                                                        setSearchInput("");
                                                        setShowSuggestions(false);
                                                    }}
                                                    className={`w-full p-3 rounded-xl text-left flex items-center justify-between transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm">#{order.id.slice(-8).toUpperCase()}</span>
                                                        <span className="text-xs text-slate-500">{order.customerName}</span>
                                                    </div>
                                                    <ArrowLeft className="w-4 h-4 rotate-180 text-orange-500 opacity-50" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recent Orders Section */}
                            <RecentOrders onSelect={fetchOrder} isDark={isDark} />
                        </div>
                    ) : (
                        <>
                            {/* Order Context */}
                            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Customer</label>
                                    <div className="font-semibold text-lg">{currentOrder.customerName}</div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</label>
                                    <div className={`font-bold uppercase ${currentOrder.deliveryStatus === 'packed' ? 'text-emerald-500' : 'text-orange-500'}`}>
                                        {currentOrder.deliveryStatus}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Items</label>
                                    <div className="font-mono">{Object.values(verifiedItems).reduce((a, b) => a + b, 0)} / {currentOrder.items.reduce((a, b) => a + b.quantity, 0)}</div>
                                </div>
                            </div>

                            {/* Scanned Rack Context */}
                            {scannedRack && (
                                <div className="bg-blue-500/10 border border-blue-500/20 text-blue-600 p-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                    <Maximize2 className="w-5 h-5" />
                                    <span className="font-bold">Currently at {scannedRack}</span>
                                </div>
                            )}

                            {/* Items List */}
                            <div className="space-y-3">
                                {currentOrder.items.map((item, idx) => {
                                    const verifiedQty = verifiedItems[item.bookId] || 0;
                                    const isComplete = verifiedQty >= item.quantity;
                                    const book = books[item.bookId];
                                    const rackId = book?.rackId || item.rackId;
                                    const isRackMatch = scannedRack && rackId === scannedRack;
                                    const coverUrl = book?.coverUrl || book?.imageUrl || item.imageUrl;

                                    return (
                                        <div
                                            key={`${item.bookId}-${idx}`}
                                            className={`p-4 rounded-xl border transition-all duration-300 ${isComplete
                                                ? (isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200')
                                                : isRackMatch
                                                    ? (isDark ? 'bg-blue-500/10 border-blue-500 scale-[1.02] shadow-lg shadow-blue-500/10' : 'bg-blue-50 border-blue-400 scale-[1.02] shadow-lg')
                                                    : (isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm')
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-16 rounded-lg flex items-center justify-center shrink-0 overflow-hidden ${isComplete ? 'bg-emerald-500/10 border-emerald-500' : (isDark ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-slate-100 text-slate-400 border-slate-200')
                                                    }`}>
                                                    {coverUrl ? (
                                                        <img src={coverUrl} alt={item.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        isComplete ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <Package className="w-6 h-6" />
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title || item.name}</span>
                                                        {(item.variantInfo || book?.variantInfo) && (
                                                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase">
                                                                {item.variantInfo || book?.variantInfo}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs">
                                                        <span className="font-mono text-slate-500">{book?.productCode || item.productCode || item.bookId}</span>
                                                        {rackId && (
                                                            <span className={`font-bold px-1.5 rounded ${isRackMatch
                                                                ? 'bg-blue-500 text-white animate-pulse'
                                                                : (verifiedRacks.has(rackId) ? 'bg-emerald-500/20 text-emerald-600' : 'bg-slate-200 text-slate-600')
                                                                }`}>
                                                                {rackId}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-sm font-mono font-bold">
                                                        <span className={isComplete ? "text-emerald-600" : "text-orange-500"}>{verifiedQty}</span>
                                                        <span className="text-slate-400 mx-1">/</span>
                                                        <span>{item.quantity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Actions */}
                            <div className="pt-4 flex gap-4">
                                <button
                                    onClick={handleCompletePacking}
                                    disabled={!isFullyVerified || loading}
                                    className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${isFullyVerified
                                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    {loading ? "Processing..." : isFullyVerified ? "Complete Packing" : "Scanning Required"}
                                    {isFullyVerified && !loading && <CheckCircle className="w-5 h-5" />}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Status Bar */}
            <div className={`py-2 px-4 text-[10px] uppercase font-bold text-center tracking-widest ${isDark ? 'bg-slate-900 text-slate-600' : 'bg-slate-100 text-slate-400'}`}>
                System Ready • Connect USB Scanner • Focus Mode Active
            </div>
        </div>
    );
}

function RecentOrders({ onSelect, isDark }: { onSelect: (id: string) => void, isDark: boolean }) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecent = async () => {
            try {
                // Fetch the most recent PLACED orders
                const q = query(
                    collection(db, "granthalaya_app", "orders_module", "orders"),
                    where("status", "==", "placed"),
                    orderBy("createdAt", "desc"),
                    limit(6)
                );
                const snap = await getDocs(q);
                setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (err) {
                console.error("Error loading recent orders:", err);
            } finally {
                setLoading(false);
            }
        };
        loadRecent();
    }, []);

    if (loading) return (
        <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
    );

    if (orders.length === 0) return (
        <div className={`p-8 text-center rounded-2xl ${isDark ? 'bg-slate-900/50 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
            <p className="text-sm">No pending orders found to pack.</p>
        </div>
    );

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Recent Placed Orders</h3>
                <span className="text-[10px] text-slate-400 bg-slate-400/10 px-1.5 py-0.5 rounded">Auto-updated</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {orders.map(order => (
                    <button
                        key={order.id}
                        onClick={() => onSelect(order.id)}
                        className={`p-4 rounded-2xl border text-left transition-all group ${isDark ? 'bg-slate-900 border-slate-800 hover:border-orange-500/50' : 'bg-white border-slate-200 hover:border-orange-200 shadow-sm'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm font-mono group-hover:text-orange-500 transition-colors">
                                #{order.id.slice(-8).toUpperCase()}
                            </span>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-bold">READY</span>
                        </div>
                        <div className="text-xs text-slate-500 truncate mb-2">{order.customerName}</div>
                        <div className="flex items-center justify-between mt-auto">
                            <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Package className="w-3 h-3" />
                                {order.items?.length || 0} Items
                            </div>
                            <div className="text-[10px] font-bold text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                PACK NOW <Package className="w-3 h-3 rotate-180" />
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

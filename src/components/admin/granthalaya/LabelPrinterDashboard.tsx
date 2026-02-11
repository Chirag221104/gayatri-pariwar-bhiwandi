"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Search,
    Printer,
    CheckSquare,
    Square,
    Plus,
    Minus,
    Trash2,
    BookOpen,
    MapPin,
    ShoppingCart,
    Filter,
    ArrowRight
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { useToast } from "@/components/ui/Toast";
import { useReactToPrint } from "react-to-print";
import { QRCodeSVG } from "qrcode.react";
import { ProductLabel, RackLabel, OrderLabel, GlobalPrintStyles } from "./PrintLabelComponents";

// Types matching the mobile app
interface Book {
    id: string;
    title: string;
    author: string;
    price: number;
    productCode?: string;
    type: string;
    coverUrl?: string;
}

interface Rack {
    id: string;
    rackId: string;
    name: string;
    section?: string;
}

interface Order {
    id: string;
    customerName: string;
    customerPhone: string;
    userId: string;
    status: string;
    createdAt: any;
}

interface SelectedItem {
    id: string;
    type: 'product' | 'rack' | 'order';
    quantity: number;
    data: any;
}

export default function LabelPrinterDashboard() {
    const [activeTab, setActiveTab] = useState<'products' | 'racks' | 'orders'>('products');
    const [books, setBooks] = useState<Book[]>([]);
    const [racks, setRacks] = useState<Rack[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("ALL");

    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
    const { showToast } = useToast();
    const [isDark, setIsDark] = useState(false);

    const printRef = useRef<HTMLDivElement>(null);

    // Theme detection
    useEffect(() => {
        const checkDark = () => {
            const saved = localStorage.getItem('admin-theme');
            if (saved === 'dark') setIsDark(true);
            else if (saved === 'system') setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
            else setIsDark(false);
        };
        checkDark();
        window.addEventListener('storage', checkDark);
        const interval = setInterval(checkDark, 500);
        return () => {
            window.removeEventListener('storage', checkDark);
            clearInterval(interval);
        };
    }, []);

    // Data Fetching
    useEffect(() => {
        const unsubBooks = onSnapshot(query(collection(db, "granthalaya_app/inventory/books"), orderBy("title")), (snap) => {
            setBooks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Book[]);
        });
        const unsubRacks = onSnapshot(query(collection(db, "granthalaya_app/inventory/racks"), orderBy("rackId")), (snap) => {
            setRacks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Rack[]);
        });
        const unsubOrders = onSnapshot(query(collection(db, "granthalaya_app/orders_module/orders"), orderBy("createdAt", "desc"), limit(20)), (snap) => {
            setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[]);
            setLoading(false);
        });

        return () => {
            unsubBooks();
            unsubRacks();
            unsubOrders();
        };
    }, []);

    const toggleSelection = (item: any, type: 'product' | 'rack' | 'order') => {
        setSelectedItems(prev => {
            const exists = prev.find(p => p.id === item.id && p.type === type);
            if (exists) {
                return prev.filter(p => !(p.id === item.id && p.type === type));
            } else {
                return [...prev, { id: item.id, type, quantity: 1, data: item }];
            }
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setSelectedItems(prev => prev.map(p =>
            p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
        ));
    };

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Labels_${new Date().toISOString()}`,
    });

    const filteredBooks = books.filter(b =>
        (b.title.toLowerCase().includes(searchQuery.toLowerCase()) || (b.productCode || "").toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedType === "ALL" || b.type === selectedType)
    );

    const filteredRacks = racks.filter(r =>
        r.rackId.toLowerCase().includes(searchQuery.toLowerCase()) || r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredOrders = orders.filter(o =>
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.substring(o.id.length - 8).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const inputClasses = `rounded-xl py-2 px-4 outline-none transition-all focus:ring-2 focus:ring-orange-500/50 ${isDark
        ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500'
        }`;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-[1.5rem] shadow-xl ${isDark ? 'bg-slate-800 text-orange-500 shadow-orange-950/20' : 'bg-orange-50 text-orange-600 shadow-orange-100'}`}>
                        <Printer className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className={`text-2xl font-black font-display tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>Label Printing Hub</h2>
                        <p className={`text-xs uppercase font-bold tracking-[0.2em] leading-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Products, Racks & Orders</p>
                    </div>
                </div>

                {selectedItems.length > 0 && (
                    <button
                        onClick={() => handlePrint()}
                        className="flex items-center gap-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-8 py-3.5 rounded-2xl font-black transition-all shadow-xl shadow-orange-500/25"
                    >
                        <Printer className="w-5 h-5 font-bold" />
                        PRINT {selectedItems.reduce((acc, curr) => acc + curr.quantity, 0)} LABELS
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Selector Side */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs */}
                    <div className={`p-1.5 rounded-2xl flex gap-1.5 ${isDark ? 'bg-slate-800/80 border border-slate-700/50' : 'bg-slate-200/50'}`}>
                        {(['products', 'racks', 'orders'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setSearchQuery(""); }}
                                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-[0.1em] transition-all ${activeTab === tab
                                    ? isDark ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-orange-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={`Search ${activeTab}...`}
                                className={`w-full pl-12 h-12 text-sm ${inputClasses}`}
                            />
                        </div>
                        {activeTab === 'products' && (
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className={`h-12 text-sm font-bold ${inputClasses}`}
                            >
                                <option value="ALL">All Categories</option>
                                <option value="BK">Books</option>
                                <option value="SM">Samagri</option>
                                <option value="GB">Gobar Products</option>
                                <option value="VS">Vastra</option>
                                <option value="IN">Incense</option>
                            </select>
                        )}
                    </div>

                    {/* List */}
                    <div className={`rounded-[2.5rem] border overflow-hidden transition-colors ${isDark ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-black/20' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="max-h-[600px] overflow-y-auto p-5 space-y-3 scrollbar-hide">
                            {activeTab === 'products' && filteredBooks.map(book => {
                                const isSelected = selectedItems.find(p => p.id === book.id && p.type === 'product');
                                return (
                                    <div
                                        key={book.id}
                                        onClick={() => toggleSelection(book, 'product')}
                                        className={`flex items-center gap-6 p-4 rounded-2xl border transition-all duration-300 cursor-pointer group ${isSelected
                                            ? isDark ? 'bg-orange-500/10 border-orange-500/60 shadow-[0_0_20px_rgba(249,115,22,0.05)]' : 'bg-orange-50 border-orange-200'
                                            : isDark ? 'bg-slate-800/30 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700' : 'bg-white border-slate-100 hover:border-slate-200'
                                            }`}
                                    >
                                        <div className={`w-16 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-2xl transition-transform duration-500 group-hover:scale-110 ${isDark ? 'bg-slate-800 ring-1 ring-slate-700' : 'bg-slate-100'}`}>
                                            {book.coverUrl ? (
                                                <img src={book.coverUrl} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <BookOpen className="w-full h-full p-5 text-slate-700" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-black text-base mb-1.5 transition-colors ${isSelected ? 'text-orange-500' : isDark ? 'text-white' : 'text-slate-900'}`}>{book.title}</h4>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[9px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                                    {book.type}
                                                </span>
                                                <p className={`text-xs font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{book.productCode || 'NO CODE'} • ₹{book.price}</p>
                                            </div>
                                        </div>
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isSelected ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 rotate-0' : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-700 rotate-12'}`}>
                                            {isSelected ? <CheckSquare className="w-7 h-7" /> : <Square className="w-7 h-7" />}
                                        </div>
                                    </div>
                                );
                            })}

                            {activeTab === 'racks' && filteredRacks.map(rack => {
                                const isSelected = selectedItems.find(p => p.id === rack.id && p.type === 'rack');
                                return (
                                    <div
                                        key={rack.id}
                                        onClick={() => toggleSelection(rack, 'rack')}
                                        className={`flex items-center gap-5 p-5 rounded-2xl border transition-all cursor-pointer group ${isSelected
                                            ? isDark ? 'bg-orange-500/10 border-orange-500/50' : 'bg-orange-50 border-orange-200'
                                            : isDark ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600' : 'bg-white border-slate-100 hover:border-slate-200'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform ${isDark ? 'bg-slate-700 text-orange-400' : 'bg-orange-50 text-orange-500'}`}>
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-black text-base truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{rack.rackId}</h4>
                                            <p className={`text-xs font-bold uppercase tracking-tight ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{rack.name} • {rack.section}</p>
                                        </div>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-700'}`}>
                                            {isSelected ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                                        </div>
                                    </div>
                                );
                            })}

                            {activeTab === 'orders' && filteredOrders.map(order => {
                                const isSelected = selectedItems.find(p => p.id === order.id && p.type === 'order');
                                return (
                                    <div
                                        key={order.id}
                                        onClick={() => toggleSelection(order, 'order')}
                                        className={`flex items-center gap-5 p-5 rounded-2xl border transition-all cursor-pointer group ${isSelected
                                            ? isDark ? 'bg-orange-500/10 border-orange-500/50' : 'bg-orange-50 border-orange-200'
                                            : isDark ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600' : 'bg-white border-slate-100 hover:border-slate-200'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform ${isDark ? 'bg-slate-700 text-orange-400' : 'bg-orange-50 text-orange-500'}`}>
                                            <ShoppingCart className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-black text-base truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>#{order.id.substring(order.id.length - 8).toUpperCase()}</h4>
                                            <p className={`text-xs font-bold uppercase tracking-tight ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{order.customerName} • {order.status}</p>
                                        </div>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-700'}`}>
                                            {isSelected ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Print Queue Side */}
                <div className="space-y-6">
                    <div className={`p-8 rounded-[2.5rem] border min-h-[500px] flex flex-col transition-colors ${isDark ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-black/40' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className={`text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                <Filter className="w-4 h-4" />
                                Selection Queue
                            </h3>
                            <span className="text-[11px] font-black bg-orange-500 text-white px-2.5 py-1 rounded-full shadow-lg shadow-orange-500/20">{selectedItems.length}</span>
                        </div>

                        {selectedItems.length === 0 ? (
                            <div className={`flex-1 flex flex-col items-center justify-center text-center p-8 ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>
                                <Printer className="w-16 h-16 mb-5 opacity-20" />
                                <p className="text-sm font-bold max-w-[200px] leading-relaxed opacity-40">Select items from the list to start building your print batch.</p>
                            </div>
                        ) : (
                            <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] scrollbar-hide pr-1">
                                {selectedItems.map(item => (
                                    <div key={`${item.type}-${item.id}`} className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${isDark ? 'bg-slate-800/40 border-slate-700/50 shadow-inner' : 'bg-slate-50 border-slate-100'}`}>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded text-white uppercase tracking-wider ${item.type === 'product' ? 'bg-blue-500 shadow-sm shadow-blue-500/20' : item.type === 'rack' ? 'bg-orange-500 shadow-sm shadow-orange-500/20' : 'bg-green-600 shadow-sm shadow-green-500/20'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                                <h5 className={`text-[13px] font-black truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.data.title || item.data.rackId || item.data.customerName || 'Item'}</h5>
                                            </div>
                                            <div className={`text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>QUANTITY: {item.quantity}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => updateQuantity(item.id, -1)} className={`w-7 h-7 flex items-center justify-center rounded-lg hover:bg-orange-500 hover:text-white transition-all ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-white border border-slate-200 text-slate-500 shadow-sm'}`}><Minus className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => updateQuantity(item.id, 1)} className={`w-7 h-7 flex items-center justify-center rounded-lg hover:bg-orange-500 hover:text-white transition-all ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-white border border-slate-200 text-slate-500 shadow-sm'}`}><Plus className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => toggleSelection(item.data, item.type)} className={`w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500 hover:text-white transition-all ${isDark ? 'bg-slate-700 text-red-400/80 hover:text-white' : 'bg-white border border-slate-200 text-slate-400 hover:border-red-500 shadow-sm'}`}><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedItems.length > 0 && (
                            <div className="pt-8 mt-auto border-t border-slate-100 dark:border-slate-800/50">
                                <button
                                    onClick={() => setSelectedItems([])}
                                    className="w-full text-[11px] font-black text-slate-400 hover:text-red-500 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear Selection
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* HIDDEN PRINT SURFACE */}
            <div className="hidden">
                <div ref={printRef} className="print-surface bg-white text-black font-sans p-[3mm]">
                    <div className="flex flex-wrap gap-[2mm] justify-start align-top">
                        {selectedItems.map((item) => {
                            const labels = [];
                            for (let i = 0; i < item.quantity; i++) {
                                labels.push(
                                    <div key={`${item.id}-${i}`} className="label-wrapper">
                                        {item.type === 'product' && <ProductLabel book={item.data as any} />}
                                        {item.type === 'rack' && <RackLabel rack={item.data as any} />}
                                        {item.type === 'order' && <OrderLabel order={item.data as any} />}
                                    </div>
                                );
                            }
                            return labels;
                        })}
                    </div>
                </div>
            </div>

            <GlobalPrintStyles />
        </div>
    );
}

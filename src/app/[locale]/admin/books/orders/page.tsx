"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Package, Truck, CheckCircle, Clock, Eye, Filter, QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp, getDoc, arrayUnion } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import AdminTable from "@/components/admin/AdminTable";
import SectionHeader from "@/components/ui/SectionHeader";
import { useToast } from "@/components/ui/Toast";
import { logAdminAction } from "@/lib/admin-logger";

interface Order {
    id: string;
    userId: string; // Internal User ID
    customerName: string;
    customerPhone: string;
    totalAmount: number;
    status: string;
    deliveryStatus: string;
    createdAt: any;
    items: any[];
    deliveryAddress: any;
    deliveryTimeline?: any[];
}

export default function OrderManagementPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isDark, setIsDark] = useState(false);
    const { showToast } = useToast();
    const { user } = useAuth();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedOrderForQr, setSelectedOrderForQr] = useState<Order | null>(null);
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || "en";

    useEffect(() => {
        const checkDark = () => {
            const saved = localStorage.getItem('admin-theme');
            if (saved === 'dark') setIsDark(true);
            else if (saved === 'system') setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
            else setIsDark(false);
        };
        checkDark();
        const interval = setInterval(checkDark, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const q = query(collection(db, "granthalaya_app", "orders_module", "orders"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Order[];
            setOrders(ordersData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching orders:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const docRef = doc(db, "granthalaya_app", "orders_module", "orders", orderId);
            const orderSnapshot = await getDoc(docRef);
            const previousStatus = orderSnapshot.exists() ? orderSnapshot.data()?.deliveryStatus : null;

            // Map UI status to Backend Fulfillment Status to maintain consistency
            const mapStatusToFulfillment = (status: string) => {
                const map: Record<string, string> = {
                    'placed': 'PLACED',
                    'packing': 'PACKING',
                    'packed': 'PACKED',
                    'outForDelivery': 'SHIPPED',
                    'delivered': 'DELIVERED',
                    'cancelled': 'CANCELLED'
                };
                return map[status] || 'PLACED';
            };

            await updateDoc(docRef, {
                fulfillmentStatus: mapStatusToFulfillment(newStatus),
                status: newStatus,
                deliveryStatus: newStatus,
                updatedAt: serverTimestamp(),
                deliveryTimeline: arrayUnion({
                    status: newStatus,
                    at: new Date(),
                    by: user?.uid || "admin",
                }),
                ...(newStatus === 'packed' ? { packedBy: user?.uid || "admin", packingCompletedAt: serverTimestamp() } : {}),
                ...(newStatus === 'packing' ? { packingStartedAt: serverTimestamp() } : {}),
                ...(newStatus === 'placed' ? { assignedTo: null } : {}), // Revert assignment if placed
                ...(newStatus === 'delivered' ? { deliveredBy: user?.uid || "admin" } : {})
            });

            await logAdminAction({
                action: "UPDATE",
                collectionName: "granthalaya_app/orders_module/orders",
                documentId: orderId,
                details: `Updated order status from ${previousStatus} to ${newStatus}`,
                previousData: { status: previousStatus },
                newData: { status: newStatus }
            });

            showToast(`Order status updated to ${newStatus}`, "success");
        } catch (error) {
            console.error("Error updating order status:", error);
            showToast("Failed to update status", "error");
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'outfordelivery': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'packed': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'packing':
            case 'confirmed': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
            case 'placed':
            case 'pending': return isDark ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200';
            case 'cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            default: return isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500';
        }
    };

    const columns = [
        {
            header: "Order Info",
            accessor: (item: Order) => (
                <div className="flex flex-col">
                    <span className={`font-bold uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>#{item.id.slice(-8)}</span>
                    <span className="text-[10px] text-slate-500 leading-tight">
                        {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'Just now'}<br />
                        {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                </div>
            )
        },
        {
            header: "Customer",
            accessor: (item: Order) => (
                <div className="flex flex-col">
                    <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item.customerName}</span>
                    <span className="text-xs text-slate-500">{item.customerPhone}</span>
                </div>
            )
        },
        {
            header: "Amount",
            accessor: (item: Order) => (
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>₹{item.totalAmount}</span>
            )
        },
        {
            header: "Items",
            accessor: (item: Order) => (
                <span className="text-xs font-medium text-slate-500">{item.items?.length || 0} items</span>
            )
        },
        {
            header: "Delivery Status",
            accessor: (item: Order) => (
                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrderForQr(item);
                        }}
                        className={`p-1.5 rounded-lg border transition-colors ${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                        title="View Package QR"
                    >
                        <QrCode className="w-4 h-4" />
                    </button>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(item.status)}`}>
                        {item.status || 'Placed'}
                    </span>
                    <select
                        onChange={(e) => updateOrderStatus(item.id, e.target.value)}
                        value={item.status || 'placed'}
                        className={`text-[10px] font-bold uppercase py-1 px-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${isDark ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <option value="placed">Placed</option>
                        <option value="packing">Packing</option>
                        <option value="packed">Packed</option>
                        <option value="outForDelivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            )
        }
    ];

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customerName.toLowerCase().includes(search.toLowerCase()) ||
        order.customerPhone.includes(search)
    );

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
            <SectionHeader
                icon={ShoppingCart}
                title="Order Fulfillment"
                subtitle="Track and manage customer orders and deliveries"
                actions={
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border flex items-center gap-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <Filter className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Feed</span>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        </div>
                        <button
                            onClick={() => router.push(`/${locale}/admin/orders/packing`)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
                        >
                            <Package className="w-4 h-4" />
                            Packing Mode
                        </button>
                    </div>
                }
            />

            <div className="flex-1 min-h-0">
                <AdminTable
                    columns={columns}
                    data={filteredOrders}
                    loading={loading}
                    searchPlaceholder="Search order ID, customer name or phone..."
                    searchValue={search}
                    onSearchChange={setSearch}
                    emptyMessage="No orders found."
                    emptySubtext="Orders will appear here once customers place them."
                    onRowClick={(item) => setSelectedOrder(item)}
                />
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh] ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className={`text-lg font-bold uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Order Details</h3>
                                <p className="text-xs text-slate-500">#{selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <Eye className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6">
                            {/* Items Section */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Order Items</h4>
                                <div className={`rounded-xl border ${isDark ? 'border-slate-800 bg-slate-800/50' : 'bg-slate-50 border-slate-100'}`}>
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className={`p-4 flex items-center justify-between ${idx !== 0 ? 'border-t border-slate-100' : ''}`}>
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</span>
                                                <span className="text-xs text-slate-500">Qty: {item.quantity} × ₹{item.unitPrice}</span>
                                            </div>
                                            <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>₹{item.quantity * item.unitPrice}</span>
                                        </div>
                                    ))}
                                    <div className="p-4 border-t border-slate-200 bg-orange-500/5 flex items-center justify-between">
                                        <span className="text-sm font-bold uppercase text-orange-600">Total Amount</span>
                                        <span className="text-lg font-black text-orange-600">₹{selectedOrder.totalAmount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Section */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Customer Info</h4>
                                    <div className={`p-4 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-800/50' : 'bg-slate-50 border-slate-100'}`}>
                                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedOrder.customerName}</p>
                                        <p className="text-xs text-slate-500">{selectedOrder.customerPhone}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</h4>
                                    <div className={`p-4 rounded-xl border flex items-center gap-3 ${isDark ? 'border-slate-800 bg-slate-800/50' : 'bg-slate-50 border-slate-100'}`}>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusStyles(selectedOrder.status)}`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Delivery Address</h4>
                                <div className={`p-4 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-800/50' : 'bg-slate-50 border-slate-100'}`}>
                                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {selectedOrder.deliveryAddress?.flat}, {selectedOrder.deliveryAddress?.society},<br />
                                        {selectedOrder.deliveryAddress?.area}, {selectedOrder.deliveryAddress?.city},<br />
                                        {selectedOrder.deliveryAddress?.state} - {selectedOrder.deliveryAddress?.pincode}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Code Modal */}
            {selectedOrderForQr && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-sm rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-300 ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
                        <div className="p-6 text-center">
                            <h3 className={`text-lg font-bold uppercase tracking-tighter mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Package QR Code</h3>
                            <p className="text-xs text-slate-500 mb-6">Scan this code to verify order #{selectedOrderForQr.id.slice(-8)}</p>

                            <div className="bg-white p-6 rounded-xl inline-block shadow-sm">
                                <QRCode
                                    size={180}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    value={JSON.stringify({
                                        orderId: selectedOrderForQr.id,
                                        orderUid: selectedOrderForQr.userId,
                                        checksum: "signed_hash"
                                    })}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>

                            <div className={`mt-8 p-4 rounded-xl text-left ${isDark ? 'bg-slate-800/50' : 'bg-slate-50 border border-slate-100'}`}>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Customer</span>
                                    <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedOrderForQr.customerName}</span>
                                    <span className="text-xs text-slate-500">{selectedOrderForQr.customerPhone}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedOrderForQr(null)}
                                className="w-full mt-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-wider transition-colors shadow-lg shadow-orange-500/20"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

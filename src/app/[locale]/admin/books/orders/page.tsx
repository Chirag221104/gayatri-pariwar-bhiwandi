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

            await updateDoc(docRef, {
                status: newStatus,
                deliveryStatus: newStatus,
                updatedAt: serverTimestamp(),
                deliveryTimeline: arrayUnion({
                    status: newStatus,
                    at: new Date(),
                    by: user?.uid || "admin",
                }),
                ...(newStatus === 'packed' ? { packedBy: user?.uid || "admin" } : {}),
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
            case 'shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'packed': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'pending': return isDark ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200';
            default: return isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500';
        }
    };

    const columns = [
        {
            header: "Order Info",
            accessor: (item: Order) => (
                <div className="flex flex-col">
                    <span className={`font-bold uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>#{item.id.slice(-8)}</span>
                    <span className="text-xs text-slate-500">{item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'Just now'}</span>
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
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(item.deliveryStatus)}`}>
                        {item.deliveryStatus || 'Pending'}
                    </span>
                    <select
                        onChange={(e) => updateOrderStatus(item.id, e.target.value)}
                        value={item.deliveryStatus || 'pending'}
                        className={`text-[10px] font-bold uppercase py-1 px-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${isDark ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <option value="pending">Pending</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
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
                    onRowClick={(item) => {
                        // Could open a detailed order drawer/modal here
                        console.log("View Order:", item.id);
                    }}
                />
            </div>

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

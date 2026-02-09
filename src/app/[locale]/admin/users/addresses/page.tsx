"use client";

import { useState, useEffect, Suspense } from "react";
import { MapPin, Search, User, Phone, Home, Building2, Mail, ArrowLeft } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import AdminTable from "@/components/admin/AdminTable";
import SectionHeader from "@/components/ui/SectionHeader";
import { useToast } from "@/components/ui/Toast";

interface Address {
    id: string;
    flat: string;
    society: string;
    area: string;
    city: string;
    pincode: string;
    state: string;
    isDefault: boolean;
}

interface UserInfo {
    uid: string;
    name: string;
    email: string;
    phone?: string;
}

function AddressBookContent() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDark, setIsDark] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || "en";
    const uid = searchParams.get("uid");

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
        const fetchData = async () => {
            if (!uid) {
                setLoading(false);
                return;
            }

            try {
                // Fetch user info
                const userDoc = await getDoc(doc(db, "users", uid));
                if (userDoc.exists()) {
                    setUserInfo({ uid: userDoc.id, ...userDoc.data() } as UserInfo);
                }

                // Fetch addresses
                const addrQuery = query(collection(db, "users", uid, "addresses"));
                const querySnapshot = await getDocs(addrQuery);
                const addrData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Address[];
                setAddresses(addrData);
            } catch (error) {
                console.error("Error fetching addresses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [uid]);

    const columns = [
        {
            header: "Type",
            accessor: (item: Address) => (
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        {item.isDefault ? <Home className="w-3.5 h-3.5 text-orange-500" /> : <Building2 className="w-3.5 h-3.5 text-slate-400" />}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">
                        {item.isDefault ? 'Default' : 'Saved'}
                    </span>
                </div>
            )
        },
        {
            header: "Details",
            accessor: (item: Address) => (
                <div className="flex flex-col py-1">
                    <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        {item.flat}, {item.society}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-tight mt-0.5">
                        {item.area}, {item.city} - {item.pincode}
                    </span>
                </div>
            )
        },
        {
            header: "Region",
            accessor: (item: Address) => (
                <span className="text-xs text-slate-500">{item.state}</span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <SectionHeader
                icon={MapPin}
                title="Address Book"
                subtitle={userInfo ? `Saved addresses for ${userInfo.name}` : "Select a user to view their address book"}
                actions={
                    <button
                        onClick={() => router.back()}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm'}`}
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Users
                    </button>
                }
            />

            {!uid ? (
                <div className={`p-12 text-center rounded-[2rem] border-2 border-dashed ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="w-16 h-16 bg-slate-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">No User Selected</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-6 text-sm">Please select a user from the CRM module to view their saved delivery addresses.</p>
                    <button
                        onClick={() => router.push(`/${locale}/admin/users`)}
                        className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-orange-500/20 hover:-translate-y-1 transition-all"
                    >
                        Go to Users
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* User Info Card */}
                    <div className={`p-6 rounded-[2rem] border h-fit ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl">
                                {userInfo?.name?.[0] || 'U'}
                            </div>
                            <div>
                                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{userInfo?.name}</h3>
                                <p className="text-xs text-slate-500">{userInfo?.uid.slice(0, 12)}...</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-orange-500" />
                                <span className="text-sm truncate">{userInfo?.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-orange-500" />
                                <span className="text-sm">{userInfo?.phone || 'No phone provided'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Addresses Table */}
                    <div className="lg:col-span-2">
                        <AdminTable
                            columns={columns}
                            data={addresses}
                            loading={loading}
                            emptyMessage="No addresses found."
                            emptySubtext="This user has not saved any delivery addresses yet."
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AddressBookPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AddressBookContent />
        </Suspense>
    );
}

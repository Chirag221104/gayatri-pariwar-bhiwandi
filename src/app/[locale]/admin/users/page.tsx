"use client";

import { useState, useEffect } from "react";
import { Users, Search, UserPlus, Shield, UserX, MapPin, Mail, Phone, ExternalLink } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminTable from "@/components/admin/AdminTable";
import SectionHeader from "@/components/ui/SectionHeader";
import { useToast } from "@/components/ui/Toast";

interface UserRoles {
    websiteAdmin?: boolean;
    isRider?: boolean;
    [key: string]: any;
}

interface AppUser {
    id: string; // Required by AdminTable
    email: string;
    name: string;
    phone?: string;
    roles: UserRoles;
    photoUrl?: string;
    createdAt?: any;
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isDark, setIsDark] = useState(false);
    const { showToast } = useToast();
    const params = useParams();
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
        const q = query(collection(db, "users"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as AppUser[];
            setUsers(usersData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching users:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const toggleRole = async (uid: string, roleName: string, currentVal: boolean) => {
        try {
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, {
                [`roles.${roleName}`]: !currentVal,
                updatedAt: serverTimestamp()
            });
            showToast(`Role updated successfully`, "success");
        } catch (error) {
            console.error("Error updating role:", error);
            showToast("Failed to update role", "error");
        }
    };

    const columns: any[] = [
        {
            header: "User",
            accessor: (item: AppUser) => (
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full overflow-hidden shrink-0 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                        {item.photoUrl ? (
                            <img src={item.photoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-600 font-bold">
                                {item.name?.[0] || 'U'}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className={`font-semibold truncate max-w-[150px] ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.name}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <Mail className="w-2.5 h-2.5" />
                            <span className="truncate max-w-[120px]">{item.email}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: "Contact",
            accessor: (item: AppUser) => (
                <div className="flex flex-col">
                    <span className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item.phone || 'No phone'}</span>
                </div>
            )
        },
        {
            header: "Roles",
            accessor: (item: AppUser) => (
                <div className="flex flex-wrap gap-2">
                    {item.roles?.websiteAdmin && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 text-[9px] font-bold uppercase border border-orange-500/20">Admin</span>
                    )}
                    {item.roles?.isRider && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[9px] font-bold uppercase border border-blue-500/20">Rider</span>
                    )}
                    {!item.roles?.websiteAdmin && !item.roles?.isRider && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-500 text-[9px] font-bold uppercase border border-slate-500/20">User</span>
                    )}
                </div>
            )
        },
        {
            header: "Actions",
            accessor: (item: AppUser) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => toggleRole(item.id, 'isRider', !!item.roles?.isRider)}
                        className={`p-1.5 rounded-lg border transition-all ${item.roles?.isRider
                            ? 'bg-blue-500 text-white border-blue-600'
                            : isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-blue-400' : 'bg-white border-slate-200 text-slate-500 hover:text-blue-600 shadow-sm'
                            }`}
                        title={item.roles?.isRider ? "Remove Rider Role" : "Make Rider"}
                    >
                        <Shield className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => toggleRole(item.id, 'websiteAdmin', !!item.roles?.websiteAdmin)}
                        className={`p-1.5 rounded-lg border transition-all ${item.roles?.websiteAdmin
                            ? 'bg-orange-500 text-white border-orange-600'
                            : isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-orange-400' : 'bg-white border-slate-200 text-slate-500 hover:text-orange-600 shadow-sm'
                            }`}
                        title={item.roles?.websiteAdmin ? "Remove Admin Role" : "Make Admin"}
                    >
                        <Lock className="w-3.5 h-3.5" />
                    </button>
                    <Link
                        href={`/${locale}/admin/users/addresses?uid=${item.id}`}
                        className={`p-1.5 rounded-lg border transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-emerald-400' : 'bg-white border-slate-200 text-slate-500 hover:text-emerald-600 shadow-sm'}`}
                        title="View Address Book"
                    >
                        <MapPin className="w-3.5 h-3.5" />
                    </Link>
                </div>
            )
        }
    ];

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.phone?.includes(search) ||
        user.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <SectionHeader
                icon={Users}
                title="User Management"
                subtitle="Manage platform users, roles, and CRM data"
            />

            <AdminTable
                columns={columns}
                data={filteredUsers}
                loading={loading}
                searchPlaceholder="Search by name, email, phone or UID..."
                searchValue={search}
                onSearchChange={setSearch}
                emptyMessage="No users found."
                emptySubtext="Users will appear here as they sign up on the platform."
            />
        </div>
    );
}

// Helper icons
const Lock = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);

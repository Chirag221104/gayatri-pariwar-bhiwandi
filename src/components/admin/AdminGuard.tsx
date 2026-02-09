"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

const ADMIN_EMAIL = "gayatripariwarbhiwandi@gmail.com";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale as string || "en";

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                if (user.email === ADMIN_EMAIL) {
                    setUser(user);
                } else {
                    // Not the admin email
                    router.push(`/${locale}/admin/login?error=access_denied`);
                }
            } else {
                // Not logged in
                router.push(`/${locale}/admin/login`);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router, locale]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!user || user.email !== ADMIN_EMAIL) {
        return null;
    }

    return <>{children}</>;
}

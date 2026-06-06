"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ADMIN_EMAIL = "gayatripariwarbhiwandi@gmail.com";

export default function AdminGuard({
    children,
    allowUnauthenticated = false
}: {
    children: React.ReactNode,
    allowUnauthenticated?: boolean
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale as string || "en";

    // Strict Authorization Check
    const isAuthorized = user && (user.email === ADMIN_EMAIL || user.roles?.websiteAdmin === true);

    useEffect(() => {
        console.log("AdminGuard Render Check:", {
            loading,
            hasUser: !!user,
            email: user?.email,
            isAuthorized,
            allowUnauthenticated,
            pathname: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
        });

        if (!loading) {
            if (!user && !allowUnauthenticated) {
                console.warn("AdminGuard: Unauthorized (no user), redirecting to login");
                router.replace(`/${locale}/admin/login`);
            } else if (user && !isAuthorized && !allowUnauthenticated) {
                console.warn("AdminGuard: Unauthorized (not admin), redirecting to login");
                router.replace(`/${locale}/admin/login?error=access_denied`);
            }
        }
    }, [user, loading, router, locale, isAuthorized, allowUnauthenticated]);

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
                <div className="absolute inset-0 bg-[#0f172a] z-[10000]" />
                <div className="relative z-[10001] animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    // Defensive check: If we require auth but don't have it/authorized, render NOTHING
    // We use a fixed inset-0 div to guarantee covering any accidental renders
    if (!allowUnauthenticated && !isAuthorized) {
        return (
            <div className="fixed inset-0 bg-[#0f172a] z-[9999] flex items-center justify-center">
                <div className="text-gray-500 text-sm animate-pulse">Verifying Authorization...</div>
            </div>
        );
    }

    return <>{children}</>;
}

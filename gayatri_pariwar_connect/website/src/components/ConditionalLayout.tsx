"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.includes("/admin");

    return (
        <>
            {!isAdmin && <Navbar />}
            <main className={!isAdmin ? "flex-grow pt-20 md:pt-26" : "flex-grow mt-0 h-screen"}>
                {children}
            </main>
            {!isAdmin && <Footer />}
        </>
    );
}

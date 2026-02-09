import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export type AdminAction = "CREATE" | "UPDATE" | "DELETE";
export type LogDomain = "granthalaya" | "app";

// Collections that belong to Granthalaya domain
const GRANTHALAYA_COLLECTIONS = [
    'granthalaya_app',
    'books',
    'books_inventory',
    'inventory',
    'inventory_logs',
    'orders',
    'sections',
    'tags',
    'categories',
    'digital_library'
];

interface LogParams {
    action: AdminAction;
    collectionName: string;
    documentId: string;
    details?: string;
    previousData?: any;
    newData?: any;
    domain?: LogDomain; // Optional - will be auto-detected if not provided
}

function detectDomain(collectionName: string): LogDomain {
    const lowerName = collectionName.toLowerCase();
    const isGranthalaya = GRANTHALAYA_COLLECTIONS.some(c =>
        lowerName.includes(c.toLowerCase())
    );
    return isGranthalaya ? 'granthalaya' : 'app';
}

export async function logAdminAction({
    action,
    collectionName,
    documentId,
    details,
    previousData,
    newData,
    domain
}: LogParams) {
    try {
        const user = auth.currentUser;
        if (!user) return;

        // Auto-detect domain if not provided
        const logDomain = domain || detectDomain(collectionName);

        await addDoc(collection(db, "admin_logs"), {
            adminEmail: user.email,
            adminUid: user.uid,
            action,
            collection: collectionName,
            documentId,
            details: details || `${action} operation on ${collectionName}`,
            timestamp: serverTimestamp(),
            previousData: previousData || null,
            newData: newData || null,
            platform: "website",
            domain: logDomain
        });
    } catch (error) {
        console.error("Failed to log admin action:", error);
        // We don't throw here to avoid blocking the main UI action, 
        // but in a stricter system we might.
    }
}


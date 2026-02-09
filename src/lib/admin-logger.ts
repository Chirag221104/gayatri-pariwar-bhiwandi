import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export type AdminAction = "CREATE" | "UPDATE" | "DELETE";

interface LogParams {
    action: AdminAction;
    collectionName: string;
    documentId: string;
    details?: string;
    previousData?: any;
    newData?: any;
}

export async function logAdminAction({
    action,
    collectionName,
    documentId,
    details,
    previousData,
    newData
}: LogParams) {
    try {
        const user = auth.currentUser;
        if (!user) return;

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
            platform: "website"
        });
    } catch (error) {
        console.error("Failed to log admin action:", error);
        // We don't throw here to avoid blocking the main UI action, 
        // but in a stricter system we might.
    }
}

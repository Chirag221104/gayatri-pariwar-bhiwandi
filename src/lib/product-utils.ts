/**
 * Universal Product System Utilities
 * Standardizes product identification and categorization for Granthalaya.
 */

export const PRODUCT_TYPES = {
    BOOK: 'BK',
    SAMAGRI: 'SM',
    GOBAR: 'GB',
    VASTRA: 'VS',
    INCENSE: 'IN',
    OTHER: 'OT'
} as const;

export type ProductTypeCode = typeof PRODUCT_TYPES[keyof typeof PRODUCT_TYPES];

export interface Product {
    id: string;
    name: string; // Title for books, Name for others
    type: ProductTypeCode;
    productCode: string; // The immutable GG code
    price: number;
    category: string; // Direct category (Spiritual, Yoga, etc.)
    stockQuantity: number;
    description: string;
    imageUrl?: string;
    isActive: boolean;
    tags: string[];
    variantInfo: string; // Informational: "500g", "Hardcover", etc.
    rackId?: string; // New: physical location identity (Rack QR)
    metadata?: {
        author?: string;
        [key: string]: any;
    };

    // Audit Fields
    createdAt: any; // Firestore Timestamp
    updatedAt: any;
    createdBy: string; // Admin User ID
}

export interface Rack {
    id: string; // Firestore Document ID
    rackId: string; // Human-readable ID (e.g., RACK-A3)
    name: string;
    section?: string;
    shelf?: string;
    productCodes: string[]; // Products currently assigned here
    isActive: boolean;
    createdAt: any;
    updatedAt: any;
}

/**
 * Generates a deterministic, immutable product code for Granthalaya.
 * Format: GG-{TYPE}-{SLUG}-{SEQUENCE}
 * 
 * @param type The ProductTypeCode
 * @param name The product name/title
 * @param sequence A unique sequence number or short hash (collision safety)
 * @returns A standardized product code string.
 */
export function generateProductCode(type: ProductTypeCode, name: string, sequence: string | number = '101'): string {
    const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 15); // Keep it readable

    const paddedSequence = String(sequence).padStart(5, '0');

    return `GG-${type}-${slug.toUpperCase()}-${paddedSequence}`;
}

/**
 * Formats the QR code payload to stay lean and future-proof.
 * Now uses JSON for single-responsibility routing.
 */
export function formatProductQR(productCode: string): string {
    return JSON.stringify({ productCode });
}

export function formatRackQR(rackId: string): string {
    return JSON.stringify({ rackId });
}

export function formatOrderQR(orderId: string): string {
    return JSON.stringify({ orderId });
}

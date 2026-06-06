import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

// Interfaces (aligned with product-utils and usage)
export interface PrintableBook {
    id: string;
    title: string;
    author: string;
    price: number;
    productCode?: string;
    type: string;
    coverUrl?: string;
    [key: string]: any;
}

export interface PrintableRack {
    id: string;
    rackId: string;
    name: string;
    section?: string;
    shelf?: string; // Added to match product-utils
}

export interface PrintableOrder {
    id: string;
    customerName: string;
    customerPhone: string;
    userId: string;
    status: string;
    createdAt: any;
}

export function ProductLabel({ book }: { book: PrintableBook }) {
    const payload = JSON.stringify({ productCode: book.productCode || 'BK-XXX' });

    // Friendly labels
    const typeLabel = book.type === 'BK' ? 'BOOK' :
        book.type === 'SM' ? 'HAWAN SAMAGRI' :
            book.type === 'GB' ? 'GOBAR PRODUCT' :
                book.type === 'VS' ? 'VASTRA' :
                    book.type === 'IN' ? 'INCENSE' :
                        book.type === 'OT' ? 'OTHER' : 'PRODUCT';

    const categoryText = (book as any).category || "";

    return (
        <div style={{
            width: '60mm',
            height: '35mm',
            padding: '3mm 4mm',
            border: '0.1mm solid #ddd',
            display: 'flex',
            gap: '3mm',
            boxSizing: 'border-box',
            overflow: 'hidden',
            backgroundColor: 'white'
        }}>
            {/* QR Code Section */}
            <div style={{ width: '22mm', height: '22mm', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <QRCodeSVG value={payload} size={84} level="M" includeMargin={false} />
            </div>

            {/* Content Section */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, justifyContent: 'space-between' }}>
                <div>
                    {/* Title */}
                    <div style={{
                        fontSize: '8.5pt',
                        fontWeight: 'bold',
                        lineHeight: 1.15,
                        marginBottom: '1.5mm',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        wordBreak: 'break-word',
                        color: 'black'
                    }}>
                        {book.title}
                    </div>

                    {/* Category & Type Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm', marginBottom: '1.5mm', alignItems: 'center' }}>
                        <div style={{ fontSize: '5pt', fontWeight: '900', color: 'white', backgroundColor: '#f97316', padding: '0.4mm 1.2mm', borderRadius: '0.4mm', textTransform: 'uppercase', lineHeight: 1 }}>
                            {typeLabel}
                        </div>
                        {categoryText && (
                            <div style={{ fontSize: '5pt', fontWeight: '700', color: '#666', border: '0.1mm solid #ddd', padding: '0.3mm 0.8mm', borderRadius: '0.4mm', lineHeight: 1 }}>
                                {categoryText.substring(0, 18)}
                            </div>
                        )}
                    </div>

                    {/* Author / Subtitle */}
                    <div style={{
                        fontSize: '5.5pt',
                        color: '#555',
                        lineHeight: 1.1,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        fontStyle: 'italic'
                    }}>
                        {book.author || 'PT. Shreeram Sharma'}
                    </div>
                </div>

                {/* Footer: Price & Code */}
                <div style={{ borderTop: '0.1mm solid #f0f0f0', paddingTop: '1mm' }}>
                    <div style={{ fontSize: '13pt', fontWeight: '900', color: 'black', lineHeight: 1, marginBottom: '0.8mm' }}>₹{book.price}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2mm' }}>
                        <div style={{ fontSize: '4.5pt', fontFamily: 'monospace', color: '#666', wordBreak: 'break-all', lineHeight: 1, flex: 1 }}>
                            {book.productCode || 'NO-CODE'}
                        </div>
                        <div style={{ fontSize: '4pt', fontWeight: 'bold', color: '#ccc' }}>GGR</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function RackLabel({ rack }: { rack: PrintableRack }) {
    const payload = JSON.stringify({ rackId: rack.rackId });
    return (
        <div style={{ width: '120mm', height: '80mm', padding: '10mm', border: '1mm solid black', borderRadius: '4mm', display: 'flex', gap: '8mm', boxSizing: 'border-box' }}>
            <div style={{ width: '55mm', height: '55mm', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QRCodeSVG value={payload} size={200} level="M" />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '14pt', color: '#666' }}>LOCATION</div>
                <div style={{ fontSize: '36pt', fontWeight: 'bold', lineHeight: 1 }}>{rack.rackId}</div>
                <div style={{ fontSize: '18pt', marginTop: '10px' }}>{rack.name}</div>
                <div style={{ fontSize: '14pt', color: '#888' }}>{rack.section || 'Main Area'}</div>
                <div style={{ marginTop: 'auto', fontSize: '10pt', fontWeight: 'bold', letterSpacing: '1px' }}>GAYATRI GRANTHALAYA</div>
            </div>
        </div>
    );
}

export function OrderLabel({ order }: { order: PrintableOrder }) {
    const payload = JSON.stringify({ orderId: order.id, orderUid: order.userId });
    return (
        <div style={{ width: '100mm', height: '60mm', padding: '6mm', border: '0.5mm solid black', display: 'flex', gap: '6mm', boxSizing: 'border-box' }}>
            <div style={{ width: '45mm', height: '45mm', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QRCodeSVG value={payload} size={150} level="M" />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '11pt', fontWeight: 'bold', color: '#1d4ed8' }}>DELIVERY PACKAGE</div>
                <div style={{ fontSize: '16pt', fontWeight: 'bold', marginTop: '10px' }}>{order.customerName}</div>
                <div style={{ fontSize: '12pt' }}>{order.customerPhone}</div>
                <div style={{ marginTop: 'auto' }}>
                    <div style={{ fontSize: '9pt', fontFamily: 'monospace' }}>ORDER #{order.id.slice(-8).toUpperCase()}</div>
                    <div style={{ display: 'inline-block', backgroundColor: '#e5e7eb', padding: '2px 8px', fontSize: '8pt', fontWeight: 'bold', marginTop: '4px' }}>SCAN TO VERIFY</div>
                </div>
            </div>
        </div>
    );
}

export const GlobalPrintStyles = () => (
    <style jsx global>{`
        @media print {
            @page { size: auto; margin: 0mm; }
            body { margin: 0; padding: 0; }
            .print-surface { display: block !important; min-height: 100vh; width: 210mm; }
            .label-wrapper { display: inline-block; page-break-inside: avoid; }
        }
    `}</style>
);

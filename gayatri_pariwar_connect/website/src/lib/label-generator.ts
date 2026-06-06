import { jsPDF } from "jspdf";
import QRious from "qrious";
import { Product, Rack, formatProductQR, formatRackQR } from "./product-utils";

/**
 * Standard colors and dimensions for Granthalaya labels.
 * Designed for 2x1 inch (approx 50x25mm) label stickers.
 */
const LABEL_WIDTH_MM = 50.8; // 2 inches
const LABEL_HEIGHT_MM = 25.4; // 1 inch
const MARGIN_MM = 2.5;

/**
 * Generates a printable PDF for a single product label or a batch of labels.
 */
export async function generateProductLabels(products: Product[]): Promise<void> {
    const doc = new jsPDF({
        orientation: "l", // Landscape
        unit: "mm",
        format: [LABEL_WIDTH_MM, LABEL_HEIGHT_MM]
    });

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        if (i > 0) doc.addPage([LABEL_WIDTH_MM, LABEL_HEIGHT_MM], "l");

        // Reset state for each label (important for bulk generation)
        doc.setTextColor(0, 0, 0); // Black
        doc.setFont("helvetica", "normal");

        // 1. Draw QR Code (Left Side, 18mm x 18mm + padding)
        const qrSize = 18;
        const qr = new QRious({
            value: formatProductQR(product.productCode),
            size: 250,
            level: 'M',
            padding: 2
        });
        const qrBase64 = qr.toDataURL();
        doc.addImage(qrBase64, "PNG", MARGIN_MM, MARGIN_MM, qrSize, qrSize);

        // 2. Add Product Info (Right Side)
        const contentLeftX = MARGIN_MM + qrSize + 4;
        const contentWidth = LABEL_WIDTH_MM - contentLeftX - MARGIN_MM;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        const nameText = product.name || (product as any).title || "Unknown Product";

        const lines = doc.splitTextToSize(nameText, contentWidth);
        const displayLines = lines.slice(0, 2);
        doc.text(displayLines, contentLeftX, MARGIN_MM + 3);

        // 3. Variant Info
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6);
        const variantText = product.variantInfo ? `[${product.variantInfo}]` : "";
        doc.text(variantText, contentLeftX, MARGIN_MM + 10);

        // 4. Price
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(`Rs. ${product.price}`, contentLeftX, MARGIN_MM + 15);

        // 5. Product Code
        doc.setFont("courier", "normal");
        doc.setFontSize(4.5);
        doc.setTextColor(80, 80, 80);
        doc.text(product.productCode, contentLeftX, MARGIN_MM + 18.5);

        // 6. Branding
        doc.setFont("helvetica", "italic");
        doc.setFontSize(3.5);
        doc.setTextColor(120, 120, 120);
        doc.text("GAYATRI GRANTHALAYA", contentLeftX, MARGIN_MM + 21.5);

        const serial = (Date.now() % 10000).toString().padStart(4, '0');
        doc.text(`S# ${serial}`, LABEL_WIDTH_MM - MARGIN_MM - 8, MARGIN_MM + 21.5);
    }

    const filename = products.length === 1
        ? `${products[0].productCode}_label.pdf`
        : `bulk_labels_${Date.now()}.pdf`;

    doc.save(filename);
}

/**
 * Generates labels for storage racks.
 */
export async function generateRackLabels(racks: Rack[]): Promise<void> {
    const doc = new jsPDF({
        orientation: "l",
        unit: "mm",
        format: [LABEL_WIDTH_MM, LABEL_HEIGHT_MM]
    });

    for (let i = 0; i < racks.length; i++) {
        const rack = racks[i];
        if (i > 0) doc.addPage([LABEL_WIDTH_MM, LABEL_HEIGHT_MM], "l");

        doc.setTextColor(0, 0, 0);

        // 1. Draw QR Code (Rack ID Key)
        const qrSize = 18;
        const qr = new QRious({
            value: formatRackQR(rack.rackId),
            size: 250,
            level: 'H', // High error correction for permanent stickers
            padding: 2
        });
        const qrBase64 = qr.toDataURL();
        doc.addImage(qrBase64, "PNG", MARGIN_MM, MARGIN_MM, qrSize, qrSize);

        // 2. Add Rack Info
        const contentLeftX = MARGIN_MM + qrSize + 4;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(rack.rackId, contentLeftX, MARGIN_MM + 6);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(rack.name, contentLeftX, MARGIN_MM + 11);

        if (rack.section || rack.shelf) {
            doc.setFontSize(6);
            doc.setTextColor(100, 100, 100);
            doc.text(`${rack.section || ''} / ${rack.shelf || ''}`, contentLeftX, MARGIN_MM + 16);
        }

        // Branding
        doc.setFontSize(4);
        doc.setTextColor(150, 150, 150);
        doc.text("WAREHOUSE IDENTITY SYSTEM", contentLeftX, MARGIN_MM + 21.5);
    }

    doc.save(`rack_labels_${Date.now()}.pdf`);
}

"use client";

import { useEffect, useRef, useState } from "react";

interface PackingScannerProps {
    onScan: (data: string, type: 'PRODUCT' | 'RACK' | 'ORDER') => void;
    isActive?: boolean;
}

export default function PackingScanner({ onScan, isActive = true }: PackingScannerProps) {
    const buffer = useRef<string>("");
    const lastKeyTime = useRef<number>(0);

    useEffect(() => {
        if (!isActive) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const now = Date.now();

            // If keypresses are too slow, it's manual typing, reset buffer
            if (now - lastKeyTime.current > 100 && buffer.current.length > 0) {
                buffer.current = "";
            }
            lastKeyTime.current = now;

            if (e.key === "Enter") {
                if (buffer.current.length > 2) {
                    processScan(buffer.current);
                }
                buffer.current = "";
                return;
            }

            // Ignore control keys, only capture printable characters
            if (e.key.length === 1) {
                buffer.current += e.key;
            }
        };

        const processScan = (data: string) => {
            data = data.trim().toUpperCase();

            // Detect Type based on prefix
            if (data.startsWith("RACK-")) {
                onScan(data, 'RACK');
            } else if (data.startsWith("ORD-")) {
                onScan(data, 'ORDER');
            } else if (data.startsWith("GG-")) {
                onScan(data, 'PRODUCT');
            } else if (data.includes("{") && data.includes("}")) {
                // Try JSON parse for complex QR codes
                try {
                    const json = JSON.parse(data);
                    if (json.rackId) onScan(json.rackId, 'RACK');
                    else if (json.orderId) onScan(json.orderId, 'ORDER');
                    else if (json.productCode) onScan(json.productCode, 'PRODUCT');
                } catch (e) {
                    console.warn("Scanner: Failed to parse JSON QR", data);
                }
            } else {
                // Default to PRODUCT if no prefix (legacy barcodes)
                onScan(data, 'PRODUCT');
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isActive, onScan]);

    return null; // Headless component
}

import React from "react";
import LabelPrinterDashboard from "@/components/admin/granthalaya/LabelPrinterDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Label Printing | Gayatri Granthalaya",
};

export default function LabelPrintingPage() {
    return (
        <div className="flex-1 space-y-4">
            <LabelPrinterDashboard />
        </div>
    );
}

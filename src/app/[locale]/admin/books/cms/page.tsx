"use client";

import { useState, useEffect } from "react";
import { Settings, Plus, Tag, Archive, Trash2, Edit3, Save, X } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp, getDocs } from "firebase/firestore";
import SectionHeader from "@/components/ui/SectionHeader";
import { useToast } from "@/components/ui/Toast";
import { logAdminAction } from "@/lib/admin-logger";

import GenericCMS from "@/components/admin/granthalaya/GenericCMS";

export default function CategoryCMSPage() {
    return (
        <GenericCMS
            collectionPath="granthalaya_app/inventory/categories"
            title="Book Categories"
            subtitle="Organize items by genre or type"
            icon={Tag}
            placeholder="e.g. Science of Soul"
            typeLabel="Category"
        />
    );
}

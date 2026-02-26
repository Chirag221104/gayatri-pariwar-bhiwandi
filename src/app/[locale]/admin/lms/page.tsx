"use client";

import React, { useState, useEffect } from "react";
import {
    BookOpen,
    Plus,
    Search,
    Filter,
    GraduationCap,
    Clock,
    Users,
    Star,
    MoreVertical
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import AdminTable from "@/components/admin/AdminTable";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import CourseForm from "@/components/admin/lms/CourseForm";
import { logAdminAction } from "@/lib/admin-logger";

interface Course {
    id: string;
    title: string;
    description: string;
    instructorName: string;
    difficulty: string;
    status: string;
    thumbnailUrl: string;
    enrolledCount: number;
    averageRating: number;
    createdAt: any;
}

export default function LMSAdminPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Course[];
            setCourses(data);
            setLoading(false);
        }, (err) => {
            console.error("Courses fetch error:", err);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (course: Course) => {
        if (!confirm(`Are you sure you want to delete "${course.title}"? This cannot be undone.`)) return;
        try {
            await deleteDoc(doc(db, "courses", course.id));
            await logAdminAction({
                action: "DELETE",
                collectionName: "courses",
                documentId: course.id,
                details: `Deleted course: ${course.title}`,
                previousData: course
            });
        } catch (error) {
            alert("Failed to delete course");
        }
    };

    const columns = [
        {
            header: "Course",
            accessor: (item: Course) => (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200/50">
                        {item.thumbnailUrl ? (
                            <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <GraduationCap className="w-6 h-6 text-orange-500" />
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 line-clamp-1">{item.title}</span>
                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{item.instructorName}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Students / Rating",
            accessor: (item: Course) => (
                <div className="flex flex-col gap-1 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                        <Users className="w-3.5 h-3.5 text-orange-500" />
                        <span>{(item.enrolledCount || 0).toLocaleString()} Enrolled</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span>{item.averageRating?.toFixed(1) || "0.0"} Rating</span>
                    </div>
                </div>
            )
        },
        {
            header: "Complexity",
            accessor: (item: Course) => (
                <StatusBadge
                    variant={item.difficulty as any}
                    className="font-black"
                />
            )
        },
        {
            header: "Visibility",
            accessor: (item: Course) => (
                <StatusBadge
                    variant={item.status === 'archived' ? 'unavailable' : item.status as any}
                    className="shadow-sm"
                />
            )
        }
    ];

    const filteredCourses = courses.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (showForm) {
        return (
            <CourseForm
                initialData={selectedCourse || undefined}
                onCancel={() => { setShowForm(false); setSelectedCourse(null); }}
            />
        );
    }

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
            <SectionHeader
                title="Sanskar Courses"
                subtitle="LMS Dashboard for Managing Spiritual Education & Learning Paths"
                icon={BookOpen}
            />

            <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find a course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none w-72 transition-all font-medium dark:text-zinc-200"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-1.5 shadow-sm">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent border-none text-xs focus:ring-0 outline-none cursor-pointer font-medium text-slate-600 dark:text-zinc-400"
                        >
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={() => { setSelectedCourse(null); setShowForm(true); }}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    New Course
                </button>
            </div>

            <div className="flex-1 min-h-0 border rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-sm">
                <AdminTable
                    columns={columns}
                    data={filteredCourses}
                    loading={loading}
                    hideControls={true}
                    onRowClick={(item) => { setSelectedCourse(item); setShowForm(true); }}
                />
            </div>
        </div>
    );
}

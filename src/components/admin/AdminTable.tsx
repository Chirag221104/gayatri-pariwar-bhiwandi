"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Search, Filter, Inbox } from "lucide-react";

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface AdminTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
    emptySubtext?: string;
    searchPlaceholder?: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
}

export default function AdminTable<T extends { id: string }>({
    columns,
    data,
    loading,
    onRowClick,
    emptyMessage = "No items found",
    emptySubtext = "Items will appear here when they are added.",
    searchPlaceholder = "Search...",
    searchValue,
    onSearchChange,
    selectable = false,
    selectedIds,
    onSelectionChange
}: AdminTableProps<T> & {
    selectable?: boolean;
    selectedIds?: Set<string>;
    onSelectionChange?: (ids: Set<string>) => void;
}) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDark = () => {
            const saved = localStorage.getItem('admin-theme');
            if (saved === 'dark') {
                setIsDark(true);
            } else if (saved === 'system') {
                setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
            } else {
                setIsDark(false);
            }
        };
        checkDark();
        const interval = setInterval(checkDark, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`rounded-xl overflow-hidden flex flex-col h-full border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
            }`}>
            {/* Table Controls */}
            <div className={`p-4 border-b flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'
                }`}>
                <div className="relative w-full sm:max-w-xs">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'
                        }`} />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className={`w-full rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all ${isDark
                            ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-500'
                            : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 border'
                            }`}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className={`p-2 rounded-lg transition-all focus:outline-none ${isDark
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-slate-200'
                        : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-700'
                        }`}>
                        <Filter className="w-4 h-4" />
                    </button>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                        }`}>
                        {data.length} {data.length === 1 ? 'item' : 'items'}
                    </span>
                </div>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="sticky top-0 z-10">
                        <tr className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                            {selectable && (
                                <th className={`px-6 py-3 w-10 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                                    <input
                                        type="checkbox"
                                        checked={data.length > 0 && selectedIds?.size === data.length}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                onSelectionChange?.(new Set(data.map(d => d.id)));
                                            } else {
                                                onSelectionChange?.(new Set());
                                            }
                                        }}
                                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                </th>
                            )}
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider border-b ${isDark
                                        ? 'text-slate-400 border-slate-700'
                                        : 'text-slate-500 border-slate-200'
                                        } ${col.className || ""}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                            <th className={`px-6 py-3 w-10 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className={`animate-pulse border-b ${isDark ? 'border-slate-700/50' : 'border-slate-100'
                                    }`}>
                                    {selectable && <td className="px-6 py-4"></td>}
                                    {columns.map((_, idx) => (
                                        <td key={idx} className="px-6 py-4">
                                            <div className={`h-4 rounded w-3/4 ${isDark ? 'bg-slate-700' : 'bg-slate-200'
                                                }`}></div>
                                        </td>
                                    ))}
                                    <td className="px-6 py-4">
                                        <div className={`h-4 w-4 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'
                                            }`}></div>
                                    </td>
                                </tr>
                            ))
                        ) : data.length > 0 ? (
                            data.map((item) => (
                                <tr
                                    key={item.id}
                                    onClick={() => onRowClick?.(item)}
                                    className={`group cursor-pointer transition-colors border-b ${isDark
                                        ? 'hover:bg-slate-700/50 border-slate-700/50'
                                        : 'hover:bg-slate-50 border-slate-100'
                                        }`}
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && onRowClick?.(item)}
                                >
                                    {selectable && (
                                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds?.has(item.id)}
                                                onChange={(e) => {
                                                    const newSet = new Set(selectedIds);
                                                    if (e.target.checked) {
                                                        newSet.add(item.id);
                                                    } else {
                                                        newSet.delete(item.id);
                                                    }
                                                    onSelectionChange?.(newSet);
                                                }}
                                                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                            />
                                        </td>
                                    )}
                                    {columns.map((col, idx) => (
                                        <td key={idx} className={`px-6 py-4 text-sm ${isDark ? 'text-slate-300' : 'text-[#B56550]'
                                            } ${col.className || ""}`}>
                                            {typeof col.accessor === "function"
                                                ? col.accessor(item)
                                                : (item[col.accessor] as React.ReactNode)}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 text-right">
                                        <ChevronRight className={`w-4 h-4 transition-all ${isDark
                                            ? 'text-slate-600 group-hover:text-orange-400'
                                            : 'text-slate-400 group-hover:text-orange-500'
                                            }`} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-6 py-16">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${isDark ? 'bg-slate-700' : 'bg-slate-100'
                                            }`}>
                                            <Inbox className={`w-7 h-7 ${isDark ? 'text-slate-500' : 'text-slate-400'
                                                }`} />
                                        </div>
                                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'
                                            }`}>{emptyMessage}</p>
                                        <p className={`text-xs max-w-xs ${isDark ? 'text-slate-600' : 'text-slate-400'
                                            }`}>{emptySubtext}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

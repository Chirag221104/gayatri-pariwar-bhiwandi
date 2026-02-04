"use client";

import { LucideIcon } from "lucide-react";

interface AdminTextFieldProps {
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    icon?: LucideIcon;
    className?: string;
}

export default function AdminTextField({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    required = false,
    icon: Icon,
    className
}: AdminTextFieldProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                {Icon && <Icon className="w-3 h-3" />}
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                    className="w-full bg-white border border-slate-300 rounded-xl py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                />
            </div>
        </div>
    );
}

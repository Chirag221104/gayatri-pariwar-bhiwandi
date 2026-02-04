'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    isDestructive = false
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl p-6 mx-4 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white">{title}</h3>
                    </div>
                </div>

                <p className="text-slate-400 text-sm mb-8 leading-relaxed ml-1">
                    {message}
                </p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl text-slate-400 font-bold text-xs hover:bg-slate-800 hover:text-white transition-all bg-slate-900 border border-slate-800"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-lg flex items-center gap-2 ${isDestructive
                                ? 'bg-red-500 hover:bg-red-400 shadow-red-500/20'
                                : 'bg-orange-500 hover:bg-orange-400 shadow-orange-500/20'
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

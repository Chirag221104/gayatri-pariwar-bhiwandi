'use client';

import React, { useEffect, useState } from 'react';
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock,
    RefreshCw,
    ShieldAlert,
    Database,
    Zap,
    Info
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useAuth } from '@/context/AuthContext';
import { db, functions } from '@/lib/firebase';

export default function SystemHealthPage() {
    const { user } = useAuth();
    const [health, setHealth] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(db, 'granthalaya_app/system_module/systemHealth/current'),
            (snapshot: any) => {
                if (snapshot.exists()) {
                    setHealth(snapshot.data());
                }
                setLoading(false);
            },
            (error: any) => {
                console.error('Error fetching health:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const handleRecalculate = async () => {
        setRefreshing(true);
        setMessage(null);
        try {
            const recalculate = httpsCallable(functions, 'granthalayaManualRecalculateHealth');
            const result: any = await recalculate();
            if (result.data.success) {
                setMessage('Health recalculation triggered successfully.');
            } else {
                setMessage(`Error: ${result.data.message || 'Operation failed'}`);
            }
        } catch (error: any) {
            console.error('Recalculation error:', error);
            setMessage(`Error: ${error.message || 'Check rate limits'}`);
        } finally {
            setRefreshing(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const isHealthy = health?.status === 'HEALTHY';
    const lastUpdated = health?.lastUpdated?.toDate ? health.lastUpdated.toDate().toLocaleString() : 'Never';

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        <ShieldAlert className="h-8 w-8 text-primary" />
                        System Health Monitor
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Operational hardening and safety dashboard for Granthalaya Engine.
                    </p>
                </div>

                <button
                    onClick={handleRecalculate}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-all font-semibold disabled:opacity-50"
                >
                    <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Recalculating...' : 'Refresh Health'}
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'} border animate-in fade-in slide-in-from-top-4`}>
                    <CheckCircle2 className="h-5 w-5" />
                    {message}
                </div>
            )}

            {health?.errors?.includes('leakQueryIndexMissing') && (
                <div className="p-4 bg-blue-50 text-blue-800 border-blue-100 border rounded-xl flex items-center gap-3">
                    <Info className="h-5 w-5" />
                    <p className="text-sm font-medium">
                        Firestore Composite Index missing for "Reservation Leaks". 0 leaks shown.
                        Please check Firebase Console logs to create the index.
                    </p>
                </div>
            )}

            {/* Status Summary Card */}
            <div className={`p-8 rounded-3xl border shadow-lg ${isHealthy ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'} transition-all`}>
                <div className="flex items-center gap-6">
                    <div className={`h-20 w-20 rounded-2xl flex items-center justify-center ${isHealthy ? 'bg-green-100' : 'bg-amber-100 shadow-inner'}`}>
                        {isHealthy ? (
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        ) : (
                            <AlertTriangle className="h-10 w-10 text-amber-600 animate-pulse" />
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-gray-900">System Status: {health?.status || 'UNKNOWN'}</h2>
                            <span className="flex h-3 w-3 relative">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isHealthy ? 'bg-green-400' : 'bg-amber-400'} opacity-75`}></span>
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${isHealthy ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                            </span>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-gray-600">
                            <span className="flex items-center gap-1.5 font-medium">
                                <Clock className="h-4 w-4" />
                                Last Audit: {lastUpdated}
                            </span>
                            <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                            <span className="text-sm">Auto-updates every 5 minutes</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Reservation Leaks */}
                <HealthCard
                    title="Reservation Leaks"
                    value={health?.reservationLeaks || 0}
                    description="Expired reservations still marked ACTIVE in database."
                    icon={<Zap className="h-6 w-6 text-orange-500" />}
                    status={health?.reservationLeaks > 0 ? 'warning' : 'healthy'}
                />

                {/* Failed Transactions */}
                <HealthCard
                    title="Failed (DLQ)"
                    value={health?.failedTransactions || 0}
                    description="Pending failed transactions awaiting manual retry."
                    icon={<AlertTriangle className="h-6 w-6 text-red-500" />}
                    status={health?.failedTransactions > 0 ? 'critical' : 'healthy'}
                />

                {/* Active Reservations */}
                <HealthCard
                    title="Active Reservations"
                    value={health?.activeReservations || 0}
                    description="Currently active inventory holds in the system."
                    icon={<Activity className="h-6 w-6 text-blue-500" />}
                />
            </div>

            {/* Info Section */}
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <Database className="h-5 w-5 text-gray-500" />
                    Hardening Engine Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <span>Rate Limiting (Token Bucket)</span>
                        <span className="font-mono text-green-600 font-semibold px-2 py-0.5 bg-green-50 rounded">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <span>Abuse Enforcement (Hard Caps)</span>
                        <span className="font-mono text-green-600 font-semibold px-2 py-0.5 bg-green-50 rounded">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <span>Metrics TTL (90 Days)</span>
                        <span className="font-mono text-green-600 font-semibold px-2 py-0.5 bg-green-50 rounded">ENABLED</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <span>Weekly Full Reconciliation</span>
                        <span className="font-mono text-blue-600 font-semibold px-2 py-0.5 bg-blue-50 rounded">SCHEDULED</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HealthCard({ title, value, description, icon, status }: any) {
    const getStatusColor = () => {
        if (status === 'critical') return 'text-red-600 bg-red-50 border-red-100';
        if (status === 'warning') return 'text-amber-600 bg-amber-50 border-amber-100';
        return 'text-gray-900 bg-white border-gray-100';
    };

    return (
        <div className={`p-6 rounded-2xl border shadow-sm transition-all hover:shadow-md ${getStatusColor()}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                    {icon}
                </div>
                {status && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${status === 'critical' ? 'bg-red-100' : 'bg-amber-100'
                        }`}>
                        {status}
                    </span>
                )}
            </div>
            <div className="text-4xl font-bold mb-1">{value}</div>
            <div className="text-lg font-bold mb-2">{title}</div>
            <p className="text-sm opacity-80 leading-relaxed">{description}</p>
        </div>
    );
}

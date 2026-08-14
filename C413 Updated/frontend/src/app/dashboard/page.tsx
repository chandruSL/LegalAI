'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ClientDashboard from '../../components/ClientDashboard';
import LawyerDashboard from '../../components/LawyerDashboard';

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-secondary"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-600 text-sm animate-pulse">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="py-8 animate-fade-in">
            {user.role === 'client' ? <ClientDashboard /> : <LawyerDashboard />}
        </div>
    );
}

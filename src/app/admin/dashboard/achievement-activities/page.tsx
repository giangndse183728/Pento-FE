'use client';

import React from 'react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import HeatMap from '@/features/admin/components/charts/HeatMap';

export default function AchievementActivitiesPage() {
    const currentYear = new Date().getFullYear().toString();

    return (
        <AdminLayout>
            <div className="w-full space-y-6">
                <h1 className="text-2xl font-bold" style={{ color: '#113F67' }}>
                    Achievement Activities
                </h1>
                <HeatMap year={currentYear} title="Daily Activity Heatmap" />
            </div>
        </AdminLayout>
    );
}

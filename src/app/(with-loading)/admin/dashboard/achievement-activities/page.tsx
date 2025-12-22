'use client';

import React from 'react';
import HeatMap from '@/features/admin/components/charts/HeatMap';

export default function AchievementActivitiesPage() {
    return (
        <div className="w-full space-y-6">
            <h1 className="text-2xl font-bold" style={{ color: '#113F67' }}>
                Achievement Activities
            </h1>
            <HeatMap title="Daily Activity Heatmap" />
        </div>
    );
}


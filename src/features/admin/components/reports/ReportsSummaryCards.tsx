'use client';

import React from 'react';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { AlertCircle, AlertTriangle, Calendar } from 'lucide-react';
import type { TradeReport } from '@/features/admin/schema/reportSchema';

interface ReportsSummaryCardsProps {
    reports: TradeReport[];
}

export default function ReportsSummaryCards({ reports }: ReportsSummaryCardsProps) {
    // Calculate metrics
    const pendingCount = reports.filter(r => r.status === 'Pending').length;
    const seriousCount = reports.filter(r => r.severity === 'Serious').length;

    // Count reports created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = reports.filter(r => {
        const reportDate = new Date(r.createdOnUtc);
        reportDate.setHours(0, 0, 0, 0);
        return reportDate.getTime() === today.getTime();
    }).length;

    const cards = [
        {
            title: 'Pending Reports',
            value: pendingCount,
            icon: AlertCircle,
            color: '#EF4444',
            bgColor: 'bg-red-50',
            iconBg: 'bg-red-100'
        },
        {
            title: 'Serious Reports',
            value: seriousCount,
            icon: AlertTriangle,
            color: '#F59E0B',
            bgColor: 'bg-orange-50',
            iconBg: 'bg-orange-100'
        },
        {
            title: 'Reports Today',
            value: todayCount,
            icon: Calendar,
            color: '#3B82F6',
            bgColor: 'bg-blue-50',
            iconBg: 'bg-blue-100'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <WhiteCard
                        key={index}
                        className={`${card.bgColor} border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`${card.iconBg} p-3 rounded-lg`}>
                                <Icon size={24} style={{ color: card.color }} />
                            </div>
                            <div className="flex-1">
                                <div className="text-2xl font-bold" style={{ color: '#113F67' }}>
                                    {card.value}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {card.title}
                                </div>
                            </div>
                        </div>
                    </WhiteCard>
                );
            })}
        </div>
    );
}

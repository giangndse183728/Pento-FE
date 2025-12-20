'use client';

import React from 'react';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { AlertCircle, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import type { ReportsSummary } from '@/features/reports/schema/reportSchema';

interface ReportsSummaryCardsProps {
    summary: ReportsSummary | null;
}

export default function ReportsSummaryCards({ summary }: ReportsSummaryCardsProps) {
    const cards = [
        {
            title: 'Pending Reports',
            value: summary?.pendingReports ?? 0,
            icon: AlertCircle,
            color: '#EF4444',
            bgColor: 'bg-red-50',
            iconBg: 'bg-red-100'
        },
        {
            title: 'Urgent Reports',
            value: summary?.urgentReports ?? 0,
            icon: AlertTriangle,
            color: '#F59E0B',
            bgColor: 'bg-orange-50',
            iconBg: 'bg-orange-100'
        },
        {
            title: 'Resolved Reports',
            value: summary?.resolvedReports ?? 0,
            icon: CheckCircle,
            color: '#10B981',
            bgColor: 'bg-green-50',
            iconBg: 'bg-green-100'
        },
        {
            title: 'Total Reports',
            value: summary?.totalReports ?? 0,
            icon: FileText,
            color: '#3B82F6',
            bgColor: 'bg-blue-50',
            iconBg: 'bg-blue-100'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

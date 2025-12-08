'use client';

import React from 'react';
import type { PaymentSummary } from '../services/paymentService';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { ColorTheme } from '@/constants/color';
import {
    Clock,
    CheckCircle2,
    XCircle,
    Ban,
    CalendarX
} from "lucide-react";

interface SideDataCardsProps {
    summary?: PaymentSummary | null;
}

export default function SideDataCards({ summary }: SideDataCardsProps) {
    const stats = [
        { title: "Pending", value: summary?.pending ?? 0, icon: Clock, color: ColorTheme.powderBlue },
        { title: "Paid", value: summary?.paid ?? 0, icon: CheckCircle2, color: ColorTheme.darkBlue },
        { title: "Failed", value: summary?.failed ?? 0, icon: XCircle, color: "#ef4444" },
        { title: "Cancelled", value: summary?.cancelled ?? 0, icon: Ban, color: "#f97316" },
        { title: "Expired", value: summary?.expired ?? 0, icon: CalendarX, color: ColorTheme.blueGray },
    ];

    return (
        <WhiteCard
            width="100%"
            height="auto"
            className={`
                rounded-2xl 
                bg-gradient-to-br from-[${ColorTheme.iceberg}]/60 to-[${ColorTheme.babyBlue}]/10
                border border-white/30 backdrop-blur-lg
                transition-all duration-200 
                hover:shadow-lg
            `}
        >
            <div className="flex flex-col gap-6">
                <h3 className="text-lg font-semibold" style={{ color: ColorTheme.darkBlue }}>
                    Payment Status
                </h3>

                {stats.map((stat, index) => {
                    const Icon = stat.icon;

                    return (
                        <div key={index} className="flex items-center gap-4">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                                style={{
                                    backgroundColor: `${stat.color}20`,
                                    border: `1px solid ${stat.color}40`,
                                }}
                            >
                                <Icon size={20} style={{ color: stat.color }} />
                            </div>

                            <div className="flex flex-col flex-1 min-w-0">
                                <span
                                    className="text-xl font-bold leading-tight"
                                    style={{ color: ColorTheme.darkBlue }}
                                >
                                    {stat.value}
                                </span>

                                <span
                                    className="text-sm font-medium mt-0.5 opacity-60"
                                    style={{ color: ColorTheme.blueGray }}
                                >
                                    {stat.title}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </WhiteCard>
    );
}

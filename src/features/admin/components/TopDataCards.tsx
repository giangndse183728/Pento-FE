'use client';

import React from 'react';
import type { PaymentSummary } from '../services/paymentService';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { ColorTheme } from '@/constants/color';
import {
    CheckCircle2,
    Clock,
    XCircle,
    Ban,
    AlertCircle
} from "lucide-react";

interface DataCardsProps {
    summary?: PaymentSummary | null;
}

export default function DataCards({ summary }: DataCardsProps) {
    const formatCurrency = (value?: string | number) => {
        if (value == null) return "0";

        const number =
            typeof value === "string"
                ? Number(value.replace(/[^\d]/g, ""))
                : value;

        return number.toLocaleString("en-US");
    };

    // First row - Financial totals
    const financialCards = [
        {
            title: "Total Revenue Due",
            value: `${formatCurrency(summary?.totalDue)} VND`,
            icon: "/assets/img/revenue-due.png",
            color: ColorTheme.blueGray,
            bgGradient: "from-blue-500/10 to-blue-600/5"
        },
        {
            title: "Total Revenue Paid",
            value: `${formatCurrency(summary?.totalPaid)} VND`,
            icon: "/assets/img/revenue-paid.png",
            color: "#10B981",
            bgGradient: "from-green-500/10 to-green-600/5"
        },
    ];

    // Second row - Status counts
    const statusCards = [
        {
            title: "Pending",
            value: summary?.pending ?? 0,
            icon: Clock,
            color: ColorTheme.blueGray,
            bgGradient: "from-blue-500/10 to-blue-600/5"
        },
        {
            title: "Paid",
            value: summary?.paid ?? 0,
            icon: CheckCircle2,
            color: "#10B981",
            bgGradient: "from-green-500/20 to-green-600/10"
        },
        {
            title: "Failed",
            value: summary?.failed ?? 0,
            icon: XCircle,
            color: "#EF4444",
            bgGradient: "from-red-500/20 to-red-600/10"
        },
        {
            title: "Cancelled",
            value: summary?.cancelled ?? 0,
            icon: Ban,
            color: "#EF4444",
            bgGradient: "from-red-500/20 to-red-600/10"
        },
        {
            title: "Expired",
            value: summary?.expired ?? 0,
            icon: AlertCircle,
            color: ColorTheme.blueGray,
            bgGradient: "from-blue-500/10 to-blue-600/5"
        },
    ];


    const renderCard = (card: { title: string; value: string | number; icon: any; color: string; bgGradient: string }, index: number) => {
        const Icon = card.icon;
        const isImagePath = typeof card.icon === 'string';

        return (
            <WhiteCard
                key={index}
                width="100%"
                height="auto"
                className={`
                    rounded-2xl 
                    bg-gradient-to-br ${card.bgGradient}
                    border border-white/30 
                    backdrop-blur-lg
                    transition-all duration-200 
                    hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1
                    cursor-pointer
                    min-h-[150px] 
                    flex items-center
                `}
            >
                <div className="flex items-center gap-4">

                    <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
                        style={{
                            backgroundColor: `${card.color}20`,
                            boxShadow: `0 0 0 0 ${card.color}40`,
                        }}
                    >
                        {isImagePath ? (
                            <img src={card.icon} alt={card.title} className="w-12 h-12" />
                        ) : (
                            <Icon size={24} style={{ color: card.color }} />
                        )}
                    </div>

                    {/* Divider for first row cards */}
                    {index < 2 && (
                        <div className="w-px h-10 bg-gray-300" />
                    )}

                    <div className="flex flex-col flex-1 min-w-0">
                        <span
                            className="text-[28px] font-extrabold tracking-tight"
                            style={{ color: ColorTheme.darkBlue }}
                        >
                            {card.value}
                        </span>

                        <span
                            className="text-xs font-medium mt-1 uppercase tracking-wide opacity-60"
                            style={{ color: ColorTheme.blueGray }}
                        >
                            {card.title}
                        </span>
                    </div>
                </div>
            </WhiteCard>
        );
    };

    return (
        <div className="space-y-4 w-full">
            {/* First Row - Financial Totals */}
            <div className="grid grid-cols-2 gap-8">
                {financialCards.map((card, index) => renderCard(card, index))}
            </div>

            {/* Second Row - Status Counts */}
            <div className="grid grid-cols-5 gap-4">
                {statusCards.map((card, index) => renderCard(card, index + 2))}
            </div>
        </div>
    );
}
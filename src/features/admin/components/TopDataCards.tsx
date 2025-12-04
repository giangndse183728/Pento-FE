'use client';

import React from 'react';
import type { PaymentSummary } from '../services/paymentService';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { ColorTheme } from '@/constants/color';
import {
    Wallet,
    Calendar,
    CheckCircle2
} from "lucide-react";

interface DataCardsProps {
    summary?: PaymentSummary | null;
}

export default function DataCards({ summary }: DataCardsProps) {
    const cards = [
        { title: "Subscriptions Revenue Due", value: summary?.totalDue ?? "0", icon: Wallet, color: ColorTheme.blueGray },
        { title: "Subscriptions Revenue Paid", value: summary?.totalPaid ?? "0", icon: CheckCircle2, color: ColorTheme.blueGray },
        { title: "Payments Made", value: summary?.paid ?? 0, icon: Calendar, color: ColorTheme.blueGray },
    ];

    return (
        <div className="grid grid-cols-3 gap-6 mb-6 w-full">
            {cards.map((card, index) => {
                const Icon = card.icon;

                return (
                    <WhiteCard
                        key={index}
                        width="100%"
                        height="auto"
                        className={`
                            rounded-2xl 
                            bg-gradient-to-br from-[${ColorTheme.iceberg}]/60 to-[${ColorTheme.babyBlue}]/10
                            border border-white/30 backdrop-blur-lg
                            transition-all duration-200 
                            hover:scale-[1.03] hover:shadow-lg hover:-translate-y-1
                            cursor-pointer
                            min-h-[120px] 
                        `}
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
                                style={{
                                    backgroundColor: `${card.color}20`,
                                    border: `1px solid ${card.color}40`,
                                }}
                            >
                                <Icon size={28} style={{ color: card.color }} />
                            </div>

                            <div className="flex flex-col flex-1 min-w-0">
                                <span
                                    className="text-2xl font-bold leading-tight"
                                    style={{ color: ColorTheme.darkBlue }}
                                >
                                    {card.value}
                                </span>

                                <span
                                    className="text-md font-medium mt-1 break-words opacity-60"
                                    style={{ color: ColorTheme.blueGray }}
                                >
                                    {card.title}
                                </span>
                            </div>
                        </div>
                    </WhiteCard>
                );
            })}
        </div>
    );
}
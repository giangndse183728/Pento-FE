'use client';

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { PaymentItem } from '../services/paymentService';
import { ColorTheme } from '@/constants/color';

interface Props {
    payments: PaymentItem[];
}

const GradientLineChart = ({ payments }: Props) => {
    // Convert API data → chart data (only "Paid" status)
    const chartData = useMemo(() => {
        if (!payments.length) return { dates: [], values: [] };

        const dailyTotals: Record<string, number> = {};

        payments.forEach((p) => {
            // Only count payments with "Paid" status
            if (p.status !== 'Paid') return;

            const date = p.createdAt.split("T")[0];

            // convert "10000 VND" → 10000
            const amountStr = p.amount.replace(/[^\d]/g, '');
            const amount = parseInt(amountStr, 10) || 0;

            dailyTotals[date] = (dailyTotals[date] || 0) + amount;
        });

        const sortedDates = Object.keys(dailyTotals).sort();

        return {
            dates: sortedDates,
            values: sortedDates.map((d) => dailyTotals[d])
        };
    }, [payments]);

    const option = {
        visualMap: {
            show: false,
            type: 'continuous',
            min: 0,
            max: Math.max(...chartData.values, 1000),
            seriesIndex: 0
        },
        tooltip: {
            trigger: 'axis',
            formatter: (params: unknown) => {
                if (!Array.isArray(params) || params.length === 0) return '';
                const param = params[0] as {
                    axisValue: string;
                    marker: string;
                    data: number;
                    name: string;
                };
                const amount = typeof param.data === 'number' ? param.data : 0;
                return `<strong>${param.axisValue}</strong><br/>${param.marker}Revenue: <strong>${amount.toLocaleString()} VND</strong>`;
            }
        },
        xAxis: {
            type: 'category',
            data: chartData.dates,
            name: 'Date',
            nameLocation: 'middle',
            nameGap: 30
        },
        yAxis: {
            type: 'value',
            name: 'Amount (VND)',
            nameLocation: 'middle',
            nameGap: 50,
            min: 0,
            max: 40000,
            interval: 5000,
            axisLabel: {
                formatter: (value: number) => value.toLocaleString()
            }
        },
        series: [
            {
                type: 'line',
                name: 'Revenue',
                showSymbol: false,
                smooth: true,
                data: chartData.values,
                lineStyle: {
                    width: 3
                },
                areaStyle: {
                    opacity: 0.2
                }
            }
        ]
    };

    return (
        <WhiteCard
            className={`
                inline-block rounded-2xl 
                bg-white/80 border border-white/30 backdrop-blur-lg
            `}
        >
            <ReactECharts option={option} style={{ height: '400px', width: '650px' }} />
        </WhiteCard>
    );
};

export default GradientLineChart;

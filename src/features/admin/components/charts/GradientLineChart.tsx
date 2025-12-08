'use client';

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { useSummaryForCharts } from '../../hooks/useSummaryForChart';
import { ColorTheme } from '@/constants/color';
import type { GetPaymentSummaryParams } from '../../services/paymentService';

interface Props {
    params?: GetPaymentSummaryParams;
}

const GradientLineChart = ({ params }: Props) => {
    const { payments } = useSummaryForCharts(params);

    // Convert API data → chart data
    const chartData = useMemo(() => {
        if (!payments || !Array.isArray(payments)) return { dates: [], values: [], namesByDate: new Map<string, string[]>() };

        // Collect all payment entries from all subscriptions
        const allPayments: { date: string; amount: number; name: string }[] = [];

        payments.forEach((subscription: { name?: string; payments?: { fromDate: string; toDate: string; amount: number }[] }) => {
            if (subscription.payments && Array.isArray(subscription.payments)) {
                subscription.payments.forEach((payment) => {
                    allPayments.push({
                        date: payment.fromDate,
                        amount: payment.amount,
                        name: subscription.name || 'Unknown'
                    });
                });
            }
        });

        // Sort payments by date
        allPayments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Aggregate amounts and names for the same date
        const aggregatedData = new Map<string, number>();
        const namesByDate = new Map<string, string[]>();

        allPayments.forEach(({ date, amount, name }) => {
            const existing = aggregatedData.get(date) || 0;
            aggregatedData.set(date, existing + amount);

            const existingNames = namesByDate.get(date) || [];
            if (!existingNames.includes(name)) {
                existingNames.push(name);
            }
            namesByDate.set(date, existingNames);
        });

        // Convert to arrays for chart
        const dates = Array.from(aggregatedData.keys());
        const values = Array.from(aggregatedData.values());

        return { dates, values, namesByDate };
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
                const names = chartData.namesByDate.get(param.axisValue) || [];
                const namesDisplay = names.length > 0 ? names.join(', ') : 'N/A';
                return `<strong>${param.axisValue}</strong><br/>` +
                    `<strong>Name:</strong> ${namesDisplay}<br/>` +
                    `${param.marker}Revenue: <strong>${amount.toLocaleString()} VND</strong>`;
            }
        },
        xAxis: {
            type: 'category',
            data: chartData.dates,
            name: 'Date Purchased',
            nameLocation: 'middle',
            nameGap: 30
        },
        yAxis: {
            type: 'value',
            name: 'Amount (VND)',
            nameLocation: 'middle',
            nameGap: 50,
            min: 0,
            max: 30000,
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
                w-full rounded-2xl p-2
                bg-white/80 border border-white/30 backdrop-blur-lg
            `}
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center" style={{ color: '#113F67' }}>
                Subscriptions Payment Overview
            </h2>
            <ReactECharts option={option} style={{ height: '550px', width: '100%' }} />
        </WhiteCard>
    );
};

export default GradientLineChart;

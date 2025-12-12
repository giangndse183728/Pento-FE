'use client';

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { useSummaryForCharts } from '../../hooks/useSummaryForChart';
import type { GetPaymentSummaryParams } from '../../services/paymentService';

// Color palette for different subscriptions
const COLORS = [
    '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
    '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#48b8e6'
];

interface Props {
    params?: GetPaymentSummaryParams;
}

const ShareDataSetChart = ({ params }: Props) => {
    const { payments, loading } = useSummaryForCharts(params);

    // Transform API data to chart dataset format
    const chartData = useMemo(() => {
        if (!payments || !Array.isArray(payments) || payments.length === 0) {
            return {
                dataset: { source: [] },
                series: [],
                dates: [],
                pieData: []
            };
        }

        // Collect all unique dates across all subscriptions
        const allDates = new Set<string>();
        const subscriptionData: Map<string, Map<string, number>> = new Map();
        const subscriptionTotals: Map<string, number> = new Map();

        payments.forEach((subscription: { name?: string; subscriptionId?: string; payments?: { date: string; amount: number }[] }) => {
            const subName = subscription.name || subscription.subscriptionId || 'Unknown';
            const subPayments = new Map<string, number>();
            let total = 0;

            if (subscription.payments && Array.isArray(subscription.payments)) {
                subscription.payments.forEach((payment) => {
                    allDates.add(payment.date);
                    const existing = subPayments.get(payment.date) || 0;
                    subPayments.set(payment.date, existing + payment.amount);
                    total += payment.amount;
                });
            }

            subscriptionData.set(subName, subPayments);
            subscriptionTotals.set(subName, total);
        });

        // Sort dates
        const sortedDates = Array.from(allDates).sort((a, b) =>
            new Date(a).getTime() - new Date(b).getTime()
        );

        // Build dataset source array
        // First row: header with ['date', 'Sub1', 'Sub2', ...]
        const subscriptionNames = Array.from(subscriptionData.keys());
        const headerRow = ['date', ...subscriptionNames];

        // Data rows: [date, amount1, amount2, ...]
        const dataRows = sortedDates.map((date) => {
            const row: (string | number)[] = [date];
            subscriptionNames.forEach((subName) => {
                const subPayments = subscriptionData.get(subName);
                const amount = subPayments?.get(date) || 0;
                row.push(amount);
            });
            return row;
        });

        const source = [headerRow, ...dataRows];

        // Create series for each subscription (line charts)
        const lineSeries = subscriptionNames.map((name, index) => ({
            type: 'line' as const,
            name,
            smooth: true,
            seriesLayoutBy: 'column' as const,
            emphasis: { focus: 'series' as const },
            lineStyle: { width: 2 },
            itemStyle: { color: COLORS[index % COLORS.length] }
        }));

        // Pie chart data - total amounts per subscription
        const pieData = subscriptionNames.map((name, index) => ({
            name,
            value: subscriptionTotals.get(name) || 0,
            itemStyle: { color: COLORS[index % COLORS.length] }
        }));

        // Pie chart series
        const pieSeries = {
            type: 'pie' as const,
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            emphasis: { focus: 'self' as const },
            label: {
                formatter: '{b}: {d}%'
            },
            data: pieData
        };

        return {
            dataset: { source },
            series: [...lineSeries, pieSeries],
            dates: sortedDates,
            subscriptionNames,
            pieData
        };
    }, [payments]);

    const option: EChartsOption = {
        legend: {
            bottom: 0,
            textStyle: { color: '#113F67' }
        },
        tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
                if (params.seriesType === 'pie') {
                    return `${params.name}: ${params.value.toLocaleString()} VND (${params.percent}%)`;
                }
                return `${params.seriesName}<br/>${params.name}: ${params.value?.toLocaleString() || 0} VND`;
            }
        },
        dataset: chartData.dataset,
        xAxis: {
            type: 'category',
            name: 'Date',
            nameLocation: 'middle',
            nameGap: 30
        },
        yAxis: {
            type: 'value',
            name: 'Amount (VND)',
            nameLocation: 'middle',
            nameGap: 60,
            axisLabel: {
                formatter: (value: number) => value.toLocaleString()
            }
        },
        grid: { top: '55%', bottom: '15%' },
        series: chartData.series
    };

    if (loading) {
        return (
            <WhiteCard className="w-full rounded-2xl p-2 bg-white/80 border border-white/30 backdrop-blur-lg">
                <div className="flex items-center justify-center h-[550px]">
                    <span className="text-gray-500">Loading chart data...</span>
                </div>
            </WhiteCard>
        );
    }

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
            <ReactECharts
                option={option}
                style={{ height: '550px', width: '100%' }}
                notMerge={true}
                lazyUpdate={true}
            />
        </WhiteCard>
    );
};

export default ShareDataSetChart;

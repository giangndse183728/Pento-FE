'use client';

import React, { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { useActivityStats } from '@/features/achievements/hooks/useActivities';
import { ChartSkeleton } from '@/components/decoration/ChartSkeleton';
import { Loader2 } from 'lucide-react';
import FilterSection, { FilterField } from '@/components/decoration/FilterSection';

interface Props {
    title?: string;
}

const TIME_WINDOW_OPTIONS = [
    { value: '', label: '--' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Quarterly', label: 'Quarterly' },
    { value: 'Yearly', label: 'Yearly' },
];

const HeatMap = ({ title = 'Activity Heatmap' }: Props) => {
    const [fromDate, setFromDate] = useState<string | undefined>();
    const [toDate, setToDate] = useState<string | undefined>();
    const [timeWindow, setTimeWindow] = useState<string>('');

    const apiParams = useMemo(() => {
        const params: {
            fromDate?: string;
            toDate?: string;
            timeWindow?: string;
        } = {};

        if (fromDate) {
            params.fromDate = fromDate;
        }
        if (toDate) {
            params.toDate = toDate;
        }
        if (timeWindow) {
            params.timeWindow = timeWindow;
        }

        return params;
    }, [fromDate, toDate, timeWindow]);

    // Fetch activity stats
    const { data, isLoading, error } = useActivityStats(apiParams);

    // Reset filters
    const handleReset = () => {
        setFromDate(undefined);
        setToDate(undefined);
        setTimeWindow('');
    };

    const filterFields: FilterField[] = [
        {
            type: 'date',
            name: 'fromDate',
            label: 'From Date',
            placeholder: 'Select start date',
            value: fromDate,
            onChange: (val) => setFromDate(val as string | undefined),
        },
        {
            type: 'date',
            name: 'toDate',
            label: 'To Date',
            placeholder: 'Select end date',
            value: toDate,
            onChange: (val) => setToDate(val as string | undefined),
        },
        {
            type: 'select',
            name: 'timeWindow',
            label: 'Time Window',
            value: timeWindow,
            options: TIME_WINDOW_OPTIONS,
            onChange: (val) => setTimeWindow(val as string),
        },
    ];

    const { chartData, xAxisData, yAxisData, maxValue } = useMemo(() => {
        const activities = Array.isArray(data) ? data : [];

        if (activities.length === 0) {
            return { chartData: [], xAxisData: [], yAxisData: [], maxValue: 10 };
        }

        const dateSet = new Set<string>();
        const activityNames: string[] = [];

        activities.forEach(activity => {
            activityNames.push(activity.name);
            if (activity.countByDate) {
                activity.countByDate.forEach(item => {
                    if (item.date) dateSet.add(item.date);
                });
            }
        });

        const sortedDates = Array.from(dateSet).sort();
        const heatmapData: [number, number, number][] = [];
        let max = 0;

        activities.forEach((activity, activityIndex) => {
            if (activity.countByDate) {
                activity.countByDate.forEach(item => {
                    const dateIndex = sortedDates.indexOf(item.date);
                    if (dateIndex >= 0) {
                        heatmapData.push([dateIndex, activityIndex, item.count]);
                        if (item.count > max) max = item.count;
                    }
                });
            }
        });

        return {
            chartData: heatmapData,
            xAxisData: sortedDates,
            yAxisData: activityNames,
            maxValue: max || 10,
        };
    }, [data]);

    // Calculate dynamic height based on number of activities
    const chartHeight = useMemo(() => {
        const minHeight = 250;
        const heightPerActivity = 40;
        const baseHeight = 100;
        return Math.max(minHeight, baseHeight + (yAxisData.length * heightPerActivity));
    }, [yAxisData.length]);

    const option: EChartsOption = {
        title: {
            top: 10,
            left: 'center',
            text: title,
            textStyle: {
                color: '#113F67',
                fontSize: 16,
            }
        },
        tooltip: {
            position: 'top',
            formatter: (params: unknown) => {
                const p = params as { value: [number, number, number] };
                const date = xAxisData[p.value[0]];
                const activity = yAxisData[p.value[1]];
                const count = p.value[2];
                return `<strong>${activity}</strong><br/>${date}: ${count} ${count === 1 ? 'activity' : 'activities'}`;
            }
        },
        grid: {
            top: 60,
            left: 150,
            right: 60,
            bottom: 80,
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
            splitArea: { show: true },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#e6e6e6ff',
                    width: 0.5,
                }
            },
            axisLabel: {
                color: '#113F67',
                rotate: 45,
                fontSize: 10,
                formatter: (value: string) => {
                    const parts = value.split('-');
                    return parts.length >= 3 ? `${parts[1]}-${parts[2]}` : value;
                }
            }
        },
        yAxis: {
            type: 'category',
            data: yAxisData,
            splitArea: { show: true },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#ccc',
                    width: 1,
                }
            },
            axisLabel: {
                color: '#113F67',
                fontSize: 12,
                align: 'right',
            }
        },
        visualMap: {
            type: 'piecewise',
            min: 0,
            max: maxValue,
            orient: 'horizontal',
            left: 'center',
            bottom: 10,
            textStyle: { color: '#113F67', fontSize: 12 },
            itemWidth: 20,
            itemHeight: 14,
            itemGap: 10,
            pieces: [
                { min: 0, max: Math.ceil(maxValue * 0.2), label: `0 - ${Math.ceil(maxValue * 0.2)}`, color: '#cedfeeff' },
                { min: Math.ceil(maxValue * 0.2) + 1, max: Math.ceil(maxValue * 0.4), label: `${Math.ceil(maxValue * 0.2) + 1} - ${Math.ceil(maxValue * 0.4)}`, color: '#B5D8F0' },
                { min: Math.ceil(maxValue * 0.4) + 1, max: Math.ceil(maxValue * 0.6), label: `${Math.ceil(maxValue * 0.4) + 1} - ${Math.ceil(maxValue * 0.6)}`, color: '#6BB3DA' },
                { min: Math.ceil(maxValue * 0.6) + 1, max: Math.ceil(maxValue * 0.8), label: `${Math.ceil(maxValue * 0.6) + 1} - ${Math.ceil(maxValue * 0.8)}`, color: '#2E86C1' },
                { min: Math.ceil(maxValue * 0.8) + 1, max: maxValue, label: `${Math.ceil(maxValue * 0.8) + 1} - ${maxValue}`, color: '#113F67' },
            ],
        },
        series: [{
            type: 'heatmap',
            data: chartData,
            itemStyle: {
                borderColor: '#fff',
                borderWidth: 1,
            },
            label: {
                show: chartData.length < 50,
                fontSize: 10,
                color: '#333',
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };

    return (
        <div className="space-y-4">
            {/* Filter Section */}
            <FilterSection
                title="Activity Filters"
                fields={filterFields}
                onReset={handleReset}
                resetButtonText="Reset"
            />


            {/* HeatMap Chart */}
            {isLoading ? (
                <ChartSkeleton
                    title={title}
                    height={300}
                />
            ) : error ? (
                <WhiteCard className="w-full rounded-2xl p-2 bg-white/80 border border-white/30 backdrop-blur-lg">
                    <div className="flex items-center justify-center h-[300px] text-red-500">
                        Failed to load activity data
                    </div>
                </WhiteCard>
            ) : chartData.length === 0 ? (
                <WhiteCard className="w-full rounded-2xl p-2 bg-white/80 border border-white/30 backdrop-blur-lg">
                    <div className="flex items-center justify-center h-[200px] text-gray-500">
                        No activity data available for the selected filters
                    </div>
                </WhiteCard>
            ) : (
                <WhiteCard className="w-full rounded-2xl p-4 bg-white/80 border border-white/30 backdrop-blur-lg">
                    <ReactECharts
                        option={option}
                        style={{ height: `${chartHeight}px`, width: '100%' }}
                    />
                </WhiteCard>
            )}
        </div>
    );
};

export default HeatMap;
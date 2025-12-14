'use client';

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { useFoodItemLogSummary } from '../../hooks/useFoodItemLogSummary';
import type { GetFoodItemLogSummaryParams } from '../../services/foodItemsLogServices';

interface Props {
    params?: GetFoodItemLogSummaryParams;
}

const DoubleBarChart = ({ params }: Props) => {
    const { data, loading } = useFoodItemLogSummary(params);

    const chartData = useMemo(() => {
        // Early return with defaults if data or required nested objects are missing
        if (!data || !data.logSummary || !data.foodItemSummary) {
            return {
                logCategories: ['Intake', 'Consumption', 'Discard'],
                logByWeight: [0, 0, 0],
                logByVolume: [0, 0, 0],
                conditionCategories: ['Fresh', 'Expiring', 'Expired'],
                conditionCounts: [0, 0, 0],
                conditionByWeight: [0, 0, 0],
                weightUnit: data?.weightUnit ?? 'Kg',
                volumeUnit: data?.volumeUnit ?? 'mL'
            };
        }

        const { logSummary, foodItemSummary, weightUnit, volumeUnit } = data;

        return {
            logCategories: ['Intake', 'Consumption', 'Discard'],
            logByWeight: [
                logSummary.intakeByWeight,
                logSummary.consumptionByWeight,
                logSummary.discardByWeight
            ],
            logByVolume: [
                logSummary.intakeByVolume,
                logSummary.consumptionByVolume,
                logSummary.discardByVolume
            ],
            conditionCategories: ['Fresh', 'Expiring', 'Expired'],
            conditionCounts: [
                foodItemSummary.freshCount,
                foodItemSummary.expiringCount,
                foodItemSummary.expiredCount
            ],
            conditionByWeight: [
                foodItemSummary.freshByWeight,
                foodItemSummary.expiringByWeight,
                foodItemSummary.expiredByWeight
            ],
            weightUnit,
            volumeUnit
        };
    }, [data]);

    // Check if we have significant weight data to use log scale
    const hasWeightData = chartData.logByWeight.some(v => v > 0);
    const maxWeight = Math.max(...chartData.logByWeight, 1);
    const useLogScale = hasWeightData && maxWeight > 1000;

    const CONDITION_COLORS = {
        fresh: '#4CAF50',
        expiring: '#FF9800',
        expired: '#F44336'
    };

    const option: EChartsOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: [
            {
                data: [
                    `By Weight (${chartData.weightUnit})`,
                    `By Volume (${chartData.volumeUnit})`
                ],
                left: '10%',
                right: '55%',
                bottom: 0,
                align: 'auto',
                textStyle: { color: '#113F67' }
            },
            {
                data: ['Fresh', 'Expiring', 'Expired'],
                left: '65%',
                right: '5%',
                bottom: 0,
                align: 'auto',
                textStyle: { color: '#113F67' }
            }
        ],
        grid: [
            { left: '5%', right: '55%', top: '15%', bottom: '15%' },
            { left: '55%', right: '5%', top: '15%', bottom: '15%' }
        ],
        xAxis: [
            {
                type: 'category',
                data: chartData.logCategories,
                gridIndex: 0,
                axisLabel: { color: '#113F67' }
            },
            {
                type: 'category',
                data: ['Count', 'Weight'],
                gridIndex: 1,
                axisLabel: { color: '#113F67' }
            }
        ],
        yAxis: [
            // Left chart - primary Y-axis for Weight (left side)
            {
                type: useLogScale ? 'log' : 'value',
                gridIndex: 0,
                name: `Weight (${chartData.weightUnit})`,
                nameTextStyle: { color: '#5470c6' },
                position: 'left',
                axisLabel: {
                    color: '#5470c6',
                    formatter: (value: number) => {
                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                        if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                        return value.toString();
                    }
                },
                axisLine: { lineStyle: { color: '#5470c6' } },
                min: useLogScale ? 1 : 0
            },
            // Left chart - secondary Y-axis for Volume (right side of left chart)
            {
                type: 'value',
                gridIndex: 0,
                name: `Volume (${chartData.volumeUnit})`,
                nameTextStyle: { color: '#91cc75' },
                position: 'right',
                axisLabel: {
                    color: '#91cc75',
                    formatter: (value: number) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString()
                },
                axisLine: { lineStyle: { color: '#91cc75' } },
                splitLine: { show: false }
            },
            // Right chart Y-axis
            {
                type: 'value',
                gridIndex: 1,
                name: 'Count / Weight',
                nameTextStyle: { color: '#113F67' },
                axisLabel: {
                    formatter: (value: number) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString()
                }
            }
        ],
        series: [
            // Left chart - Intake/Consumption/Discard by Weight (uses primary Y-axis)
            {
                name: `By Weight (${chartData.weightUnit})`,
                type: 'bar',
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: useLogScale ? chartData.logByWeight.map(v => v || 0.1) : chartData.logByWeight,
                itemStyle: { color: '#5470c6' },
                emphasis: { focus: 'series' }
            },
            // Left chart - Intake/Consumption/Discard by Volume (uses secondary Y-axis)
            {
                name: `By Volume (${chartData.volumeUnit})`,
                type: 'bar',
                xAxisIndex: 0,
                yAxisIndex: 1,
                data: chartData.logByVolume,
                itemStyle: { color: '#91cc75' },
                emphasis: { focus: 'series' }
            },
            // Right chart - Fresh
            {
                name: 'Fresh',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 2,
                data: [chartData.conditionCounts[0], chartData.conditionByWeight[0]],
                itemStyle: { color: CONDITION_COLORS.fresh },
                emphasis: { focus: 'series' }
            },
            {
                name: 'Expiring',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 2,
                data: [chartData.conditionCounts[1], chartData.conditionByWeight[1]],
                itemStyle: { color: CONDITION_COLORS.expiring },
                emphasis: { focus: 'series' }
            },
            {
                name: 'Expired',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 2,
                data: [chartData.conditionCounts[2], chartData.conditionByWeight[2]],
                itemStyle: { color: CONDITION_COLORS.expired },
                emphasis: { focus: 'series' }
            }
        ]
    };

    if (loading) {
        return (
            <WhiteCard className="w-full rounded-2xl p-2 bg-white/80 border border-white/30 backdrop-blur-lg">
                <div className="flex items-center justify-center h-[400px]">
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
            <div className="flex justify-around mb-2">
                <h3 className="text-lg font-semibold text-center" style={{ color: '#113F67' }}>
                    Intake / Consumption / Discard
                </h3>
                <h3 className="text-lg font-semibold text-center" style={{ color: '#113F67' }}>
                    Food Condition Distribution
                </h3>
            </div>
            <ReactECharts
                option={option}
                style={{ height: '400px', width: '100%' }}
            />
        </WhiteCard>
    );
};

export default DoubleBarChart;

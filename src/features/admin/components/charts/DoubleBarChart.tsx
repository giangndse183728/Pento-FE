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
        if (!data) {
            return {
                logCategories: ['Intake', 'Consumption', 'Discard'],
                logByWeight: [0, 0, 0],
                logByVolume: [0, 0, 0],
                conditionCategories: ['Fresh', 'Expiring', 'Expired'],
                conditionCounts: [0, 0, 0],
                conditionByWeight: [0, 0, 0],
                weightUnit: 'Kg',
                volumeUnit: 'mL'
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

    const option: EChartsOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: [`By Weight (${chartData.weightUnit})`, `By Volume (${chartData.volumeUnit})`],
            bottom: 0,
            textStyle: { color: '#113F67' }
        },
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
                data: chartData.conditionCategories,
                gridIndex: 1,
                axisLabel: { color: '#113F67' }
            }
        ],
        yAxis: [
            {
                type: 'value',
                gridIndex: 0,
                name: 'Amount',
                nameTextStyle: { color: '#113F67' },
                axisLabel: {
                    formatter: (value: number) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString()
                }
            },
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
            {
                name: `By Weight (${chartData.weightUnit})`,
                type: 'bar',
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: chartData.logByWeight,
                itemStyle: { color: '#5470c6' },
                emphasis: { focus: 'series' }
            },
            {
                name: `By Volume (${chartData.volumeUnit})`,
                type: 'bar',
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: chartData.logByVolume,
                itemStyle: { color: '#91cc75' },
                emphasis: { focus: 'series' }
            },
            {
                name: 'Item Count',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: chartData.conditionCounts,
                itemStyle: { color: '#fac858' },
                emphasis: { focus: 'series' }
            },
            {
                name: `By Weight (${chartData.weightUnit})`,
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: chartData.conditionByWeight,
                itemStyle: { color: '#ee6666' },
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

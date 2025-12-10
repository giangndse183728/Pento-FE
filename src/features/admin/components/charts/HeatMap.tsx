'use client';

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { WhiteCard } from '@/components/decoration/WhiteCard';

interface Props {
    year?: string;
    title?: string;
}

const HeatMap = ({ year = '2024', title = 'Daily Activity' }: Props) => {
    // Generate virtual data for the heatmap
    const getVirtualData = (targetYear: string): [string, number][] => {
        const date = +echarts.time.parse(targetYear + '-01-01');
        const end = +echarts.time.parse(+targetYear + 1 + '-01-01');
        const dayTime = 3600 * 24 * 1000;
        const data: [string, number][] = [];
        for (let time = date; time < end; time += dayTime) {
            data.push([
                echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
                Math.floor(Math.random() * 10000)
            ]);
        }
        return data;
    };

    const chartData = useMemo(() => getVirtualData(year), [year]);

    const option: EChartsOption = {
        title: {
            top: 30,
            left: 'center',
            text: title,
            textStyle: {
                color: '#113F67'
            }
        },
        tooltip: {
            formatter: (params: any) => {
                return `${params.value[0]}: ${params.value[1].toLocaleString()} steps`;
            }
        },
        visualMap: {
            min: 0,
            max: 10000,
            type: 'piecewise',
            orient: 'horizontal',
            left: 'center',
            top: 65,
            textStyle: {
                color: '#113F67'
            }
        },
        calendar: {
            top: 120,
            left: 30,
            right: 30,
            cellSize: ['auto', 13],
            range: year,
            itemStyle: {
                borderWidth: 0.5
            },
            yearLabel: { show: false }
        },
        series: {
            type: 'heatmap',
            coordinateSystem: 'calendar',
            data: chartData
        }
    };

    return (
        <WhiteCard
            className="w-full rounded-2xl p-2 bg-white/80 border border-white/30 backdrop-blur-lg"
        >
            <ReactECharts
                option={option}
                style={{ height: '300px', width: '100%' }}
            />
        </WhiteCard>
    );
};

export default HeatMap;

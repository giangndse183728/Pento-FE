import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import {
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';

// Register ECharts components
echarts.use([
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    LineChart,
    CanvasRenderer,
    UniversalTransition
]);

const StackedAreaChart: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chart = echarts.init(chartRef.current);

        const option: EChartsOption = {
            color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
            title: {
                text: 'Revenue Statistics',
                left: 'left'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data: ['Purchase', 'Views', 'Downloads', 'Revenue', 'Growth']
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Purchase',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: { width: 0 },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgb(128, 255, 165)' },
                            { offset: 1, color: 'rgb(1, 191, 236)' }
                        ])
                    },
                    emphasis: { focus: 'series' },
                    data: [140, 232, 101, 264, 90, 340, 250]
                },
                {
                    name: 'Views',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: { width: 0 },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgb(0, 221, 255)' },
                            { offset: 1, color: 'rgb(77, 119, 255)' }
                        ])
                    },
                    emphasis: { focus: 'series' },
                    data: [120, 282, 111, 234, 220, 340, 310]
                },
                {
                    name: 'Downloads',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: { width: 0 },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgb(55, 162, 255)' },
                            { offset: 1, color: 'rgb(116, 21, 219)' }
                        ])
                    },
                    emphasis: { focus: 'series' },
                    data: [320, 132, 201, 334, 190, 130, 220]
                },
                {
                    name: 'Revenue',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: { width: 0 },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgb(255, 0, 135)' },
                            { offset: 1, color: 'rgb(135, 0, 157)' }
                        ])
                    },
                    emphasis: { focus: 'series' },
                    data: [220, 402, 231, 134, 190, 230, 120]
                },
                {
                    name: 'Growth',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: { width: 0 },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgb(255, 191, 0)' },
                            { offset: 1, color: 'rgb(224, 62, 76)' }
                        ])
                    },
                    emphasis: { focus: 'series' },
                    data: [220, 302, 181, 234, 210, 290, 150]
                }
            ]
        };

        chart.setOption(option);

        const handleResize = () => {
            chart.resize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            chart.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
};

export default StackedAreaChart;
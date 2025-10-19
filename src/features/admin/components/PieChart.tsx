import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent
} from 'echarts/components';
import { PieChart as EChartsPie } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';

// Register components
echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    EChartsPie,
    CanvasRenderer
]);

const PieChart: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chart = echarts.init(chartRef.current);

        const option: EChartsOption = {
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    name: 'Coverage',
                    type: 'pie',
                    radius: ['80%', '100%'],
                    center: ['50%', '50%'],
                    avoidLabelOverlap: false,
                    label: { show: false },
                    data: [
                        {
                            value: 61.4,
                            name: 'Abandoned Carts',
                            itemStyle: { color: '#E6396D' }
                        },
                        {
                            value: 38.6,
                            name: 'Active Carts',
                            itemStyle: { color: '#F5E8ED' }
                        }
                    ]
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

export default PieChart;

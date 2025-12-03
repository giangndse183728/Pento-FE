'use client';

import React from 'react';
import AdminLayout from './AdminLayout';
import StackedAreaChart from './StackedAreaChart';
import PieChart from './PieChart';
import DataCards from './DataCards';
import { usePayments } from '../hooks/usePayments';


const Dashboard = () => {
    const { summary } = usePayments();

    return (
        <AdminLayout>
            {/* Top Bar */}
            <div className="flex justify-start items-start mb-6 w-full">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search"
                        className="p-2 rounded-lg border-2 border-white/40 bg-gray-100/50 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/40"
                    />
                </div>
            </div>

            <DataCards summary={summary} />

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-6 w-full">
                <div className="flex gap-10 justify-start items-start w-full">

                    {/* Stacked Area Chart - 70% */}
                    <div className="w-[600px] flex flex-col items-start justify-start">
                        <div className="h-[500px] w-full">
                            <StackedAreaChart />
                        </div>
                    </div>

                    {/* Pie Chart - 30% */}
                    <div className="flex-[0.3] flex flex-col items-start justify-start text-left">
                        <h2 className="text-lg font-semibold mb-4">Coverage</h2>
                        <div className="h-[200px] w-full">
                            <PieChart />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;

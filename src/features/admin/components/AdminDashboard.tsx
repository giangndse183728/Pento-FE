'use client';

import React from 'react';
import AdminLayout from './AdminLayout';
import GradientLineChart from './GradientLineChart';
import SideDataCards from './SideDataCards';
import DataCards from './TopDataCards';
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
                <div className="flex gap-6 justify-start items-start w-full">

                    {/* Gradient Line Chart - 70% */}
                    <div className="flex-[0.7] flex flex-col items-start justify-start">
                        <div className="h-[500px] w-full">
                            <GradientLineChart />
                        </div>
                    </div>

                    {/* Side Data Cards - 30% */}
                    <div className="flex-[0.3] flex flex-col items-start justify-start text-left w-[300px]">
                        <div className="h-full w-full">
                            <SideDataCards summary={summary} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;

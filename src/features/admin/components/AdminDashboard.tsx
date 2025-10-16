'use client';

import React from 'react';
import { BlurCard } from '@/components/decoration/BlurCard';
import AdminSidebar from './AdminSidebar';
import StackedAreaChart from './StackedAreaChart';
import PieChart from './PieChart';


const Dashboard = () => {
    return (
        <div
            className="min-h-screen p-6 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: 'url("/assets/img/admin-background.jpg")',
                backgroundBlendMode: 'overlay',
                backgroundColor: 'rgba(219, 234, 254, 0.1)',
            }}
        >
            <div className="flex flex-col lg:flex-row gap-6 items-start justify-start">
                <AdminSidebar />

                {/* Main Content */}
                <div className="w-full lg:w-4/4 flex flex-col items-start justify-start text-left">
                    <BlurCard className="w-full bg-white/10 backdrop-blur-[1px]">
                        <div className="p-6 flex flex-col items-start justify-start text-left">

                            {/* Top Bar */}
                            <div className="flex justify-start items-start mb-6 w-full">
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="p-2 rounded-lg border border-gray-300 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 mb-6 w-full">
                                {[
                                    { title: 'Luna & solder', price: '24.06 ETH', change: '+78%' },
                                    { title: 'Millenium', price: '12.03 ETH', change: '+13%' },
                                    { title: 'Florence Indigo', price: '15.08 ETH', change: '+78%' },
                                    { title: 'Purple sunlight', price: '14.06 ETH', change: '+76%' }
                                ].map((nft, index) => (
                                    <BlurCard key={index} className="w-full bg-white/10 backdrop-blur-[1px]">
                                        <div className="p-4 flex flex-col gap-2">
                                            <div className="w-full aspect-square rounded-lg bg-gray-200/80"></div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">{nft.title}</span>
                                                <span className="text-xs text-green-500">{nft.change}</span>
                                            </div>
                                            <span className="text-sm text-gray-400">{nft.price}</span>
                                        </div>
                                    </BlurCard>
                                ))}
                            </div>

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

                        </div>
                    </BlurCard>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

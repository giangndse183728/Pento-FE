'use client';

import React, { useState } from 'react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import TradeOffersList from './TradeOffersList';
import TradeRequestsList from './TradeRequestsList';
import TradeSessionsList from './TradeSessionsList';

type Tab = 'offers' | 'requests' | 'sessions';

export default function TradeManager() {
    const [activeTab, setActiveTab] = useState<Tab>('offers');
    const [offersPage, setOffersPage] = useState(1);
    const [requestsPage, setRequestsPage] = useState(1);
    const [sessionsPage, setSessionsPage] = useState(1);

    return (
        <AdminLayout>
            <div className="w-full space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-semibold" style={{ color: '#113F67' }}>
                            Trade Management
                        </h1>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b" style={{ borderColor: '#D6E6F2' }}>
                    <button
                        onClick={() => setActiveTab('offers')}
                        className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'offers'
                                ? 'border-b-2 text-[#113F67]'
                                : 'text-gray-500 hover:text-[#113F67]'
                            }`}
                        style={{ borderColor: activeTab === 'offers' ? '#113F67' : 'transparent' }}
                    >
                        Offers
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'requests'
                                ? 'border-b-2 text-[#113F67]'
                                : 'text-gray-500 hover:text-[#113F67]'
                            }`}
                        style={{ borderColor: activeTab === 'requests' ? '#113F67' : 'transparent' }}
                    >
                        Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('sessions')}
                        className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'sessions'
                                ? 'border-b-2 text-[#113F67]'
                                : 'text-gray-500 hover:text-[#113F67]'
                            }`}
                        style={{ borderColor: activeTab === 'sessions' ? '#113F67' : 'transparent' }}
                    >
                        Sessions
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'offers' && (
                    <TradeOffersList
                        pageNumber={offersPage}
                        setPageNumber={setOffersPage}
                        pageSize={10}
                    />
                )}

                {activeTab === 'requests' && (
                    <TradeRequestsList
                        pageNumber={requestsPage}
                        setPageNumber={setRequestsPage}
                        pageSize={10}
                    />
                )}

                {activeTab === 'sessions' && (
                    <TradeSessionsList
                        pageNumber={sessionsPage}
                        setPageNumber={setSessionsPage}
                        pageSize={10}
                    />
                )}
            </div>
        </AdminLayout>
    );
}

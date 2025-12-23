'use client';

import React, { useState } from 'react';
import TradeOffersList from './TradeOffersList';
import TradeRequestsList from './TradeRequestsList';
import TradeSessionsList from './TradeSessionsList';
import ReportsDashboard from '@/features/reports/components/ReportsDashboard';

import '@/styles/tab-bar.css';

type Tab = 'dashboard' | 'offers' | 'requests' | 'sessions';

export default function TradeManager() {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [offersPage, setOffersPage] = useState(1);
    const [requestsPage, setRequestsPage] = useState(1);
    const [sessionsPage, setSessionsPage] = useState(1);

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-semibold" style={{ color: '#113F67' }}>
                        Trade Management
                    </h1>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex justify-start">
                <div className="segmented">
                    <label className="segmented-button">
                        <input
                            type="radio"
                            name="trade-tab"
                            checked={activeTab === 'dashboard'}
                            onChange={() => setActiveTab('dashboard')}
                        />
                        Dashboard
                    </label>
                    <label className="segmented-button">
                        <input
                            type="radio"
                            name="trade-tab"
                            checked={activeTab === 'offers'}
                            onChange={() => setActiveTab('offers')}
                        />
                        Offers
                    </label>
                    <label className="segmented-button">
                        <input
                            type="radio"
                            name="trade-tab"
                            checked={activeTab === 'requests'}
                            onChange={() => setActiveTab('requests')}
                        />
                        Requests
                    </label>
                    <label className="segmented-button">
                        <input
                            type="radio"
                            name="trade-tab"
                            checked={activeTab === 'sessions'}
                            onChange={() => setActiveTab('sessions')}
                        />
                        Sessions
                    </label>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'dashboard' && (
                <ReportsDashboard />
            )}

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
    );
}

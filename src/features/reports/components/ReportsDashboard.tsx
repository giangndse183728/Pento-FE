'use client';

import React, { useState } from 'react';
import { useReports } from '@/features/reports/hooks/useReport';
import { Skeleton } from '@/components/ui/skeleton';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import FilterSection from '@/components/decoration/FilterSection';
import ReportsSummaryCards from './ReportsSummaryCards';
import ReportsSideDrawer from './ReportsSideDrawer';
import type { TradeReport, ReportStatus, ReportSeverity, ReportReason } from '@/features/reports/schema/reportSchema';

function ReportsDashboardSkeleton() {
    return (
        <div className="w-full">
            {/* Title Skeleton */}
            <Skeleton className="h-9 w-48 mb-6 rounded-lg" />

            {/* Summary Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                    <WhiteCard key={i} className="p-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="flex-1">
                                <Skeleton className="h-4 w-20 mb-2" />
                                <Skeleton className="h-6 w-12" />
                            </div>
                        </div>
                    </WhiteCard>
                ))}
            </div>

            {/* Filter Section Skeleton */}
            <WhiteCard className="p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i}>
                            <Skeleton className="h-4 w-16 mb-2" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                    ))}
                </div>
            </WhiteCard>

            {/* Table Skeleton */}
            <WhiteCard className="rounded-2xl p-6 bg-white/90 border border-white/30 backdrop-blur-lg">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                                {['Food Item', 'Reason', 'Severity', 'Status', 'Reporter', 'Created'].map((_, i) => (
                                    <th key={i} className="px-4 py-3 text-left">
                                        <Skeleton className="h-4 w-20" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {[...Array(5)].map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="w-12 h-12 rounded-lg" />
                                            <div>
                                                <Skeleton className="h-4 w-24 mb-1" />
                                                <Skeleton className="h-3 w-16" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <Skeleton className="h-4 w-28" />
                                    </td>
                                    <td className="px-4 py-4">
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </td>
                                    <td className="px-4 py-4">
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="w-8 h-8 rounded-full" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <Skeleton className="h-4 w-24" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </WhiteCard>
        </div>
    );
}

export default function ReportsDashboard() {
    const [selectedReport, setSelectedReport] = useState<TradeReport | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Filter states
    const [statusFilter, setStatusFilter] = useState<ReportStatus | ''>('');
    const [severityFilter, setSeverityFilter] = useState<ReportSeverity | ''>('');
    const [reasonFilter, setReasonFilter] = useState<ReportReason | ''>('');
    const [sortFilter, setSortFilter] = useState<'Newest' | 'Oldest'>('Newest');

    // Pass filters to the hook for server-side filtering
    const { reports, summary, loading, error, refetch } = useReports({
        status: statusFilter || undefined,
        severity: severityFilter || undefined,
        reason: reasonFilter || undefined,
        sort: sortFilter,
    });

    const handleRowClick = (report: TradeReport) => {
        setSelectedReport(report);
        setIsDrawerOpen(true);
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return 'bg-red-100 text-red-800';
            case 'Serious': return 'bg-orange-100 text-orange-800';
            case 'Minor': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'UnderReview': return 'bg-blue-100 text-blue-800';
            case 'Resolved': return 'bg-green-100 text-green-800';
            case 'Dismissed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatReason = (reason: string) => {
        return reason.replace(/([A-Z])/g, ' $1').trim();
    };

    if (loading) {
        return <ReportsDashboardSkeleton />;
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-8">
                Failed to load reports: {error.message}
            </div>
        );
    }

    return (
        <div className="w-full">

            {/* Summary Cards */}
            <ReportsSummaryCards summary={summary} />

            {/* Filter Section */}
            <FilterSection
                title="Filter Reports"
                fields={[
                    {
                        type: 'select',
                        name: 'status',
                        label: 'Status',
                        value: statusFilter,
                        onChange: (value) => setStatusFilter(value as ReportStatus | ''),
                        options: [
                            { value: '', label: 'All' },
                            { value: 'Pending', label: 'Pending' },
                            { value: 'UnderReview', label: 'Under Review' },
                            { value: 'Resolved', label: 'Resolved' },
                            { value: 'Dismissed', label: 'Dismissed' },
                        ]
                    },
                    {
                        type: 'select',
                        name: 'severity',
                        label: 'Severity',
                        value: severityFilter,
                        onChange: (value) => setSeverityFilter(value as ReportSeverity | ''),
                        options: [
                            { value: '', label: 'All' },
                            { value: 'Minor', label: 'Minor' },
                            { value: 'Serious', label: 'Serious' },
                            { value: 'Critical', label: 'Critical' },
                        ]
                    },
                    {
                        type: 'select',
                        name: 'reason',
                        label: 'Reason',
                        value: reasonFilter,
                        onChange: (value) => setReasonFilter(value as ReportReason | ''),
                        options: [
                            { value: '', label: 'All' },
                            { value: 'FoodSafetyConcern', label: 'Food Safety Concern' },
                            { value: 'ExpiredFood', label: 'Expired Food' },
                            { value: 'PoorHygiene', label: 'Poor Hygiene' },
                            { value: 'MisleadingInformation', label: 'Misleading Information' },
                            { value: 'InappropriateBehavior', label: 'Inappropriate Behavior' },
                            { value: 'Other', label: 'Other' },
                        ]
                    },
                    {
                        type: 'select',
                        name: 'sort',
                        label: 'Sort By',
                        value: sortFilter,
                        onChange: (value) => setSortFilter(value as 'Newest' | 'Oldest'),
                        options: [
                            { value: 'Newest', label: 'Newest' },
                            { value: 'Oldest', label: 'Oldest' },
                        ]
                    },
                ]}
                onReset={() => {
                    setStatusFilter('');
                    setSeverityFilter('');
                    setReasonFilter('');
                    setSortFilter('Newest');
                }}
            />

            {/* Main Table Card */}
            <WhiteCard className="rounded-2xl p-6 bg-white/90 border border-white/30 backdrop-blur-lg mt-6">

                {/* Table */}
                {reports.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No reports found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#113F67] uppercase tracking-wider">
                                        Food Item
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#113F67] uppercase tracking-wider">
                                        Reason
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#113F67] uppercase tracking-wider">
                                        Severity
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#113F67] uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#113F67] uppercase tracking-wider">
                                        Reporter
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#113F67] uppercase tracking-wider">
                                        Created
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reports.map((report, index) => (
                                    <tr
                                        key={`${report.reportId}-${index}`}
                                        onClick={() => handleRowClick(report)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={report.foodImageUri}
                                                    alt={report.foodName}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {report.foodName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {report.quantity} {report.unitAbbreviation}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-gray-900">
                                                {formatReason(report.reason)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                                                {report.severity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                {report.reporterAvatarUrl ? (
                                                    <img
                                                        src={report.reporterAvatarUrl}
                                                        alt={report.reporterName}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#113F67] to-[#1a5a8a] flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <span className="text-sm text-gray-900">
                                                    {report.reporterName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500">
                                            {new Date(report.createdOnUtc).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </WhiteCard>

            {/* Side Drawer */}
            <ReportsSideDrawer
                report={selectedReport}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onActionComplete={refetch}
            />
        </div>
    );
}

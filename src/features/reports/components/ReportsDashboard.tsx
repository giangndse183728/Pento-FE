'use client';

import React, { useState, useMemo } from 'react';
import { useReports } from '@/features/reports/hooks/useReport';
import { Loader2 } from 'lucide-react';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import FilterSection from '@/components/decoration/FilterSection';
import ReportsSummaryCards from './ReportsSummaryCards';
import ReportsSideDrawer from './ReportsSideDrawer';
import type { TradeReport } from '@/features/reports/schema/reportSchema';

export default function ReportsDashboard() {
    const { reports, summary, loading, error, refetch } = useReports();
    const [selectedReport, setSelectedReport] = useState<TradeReport | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Filter states
    const [statusFilter, setStatusFilter] = useState('');
    const [severityFilter, setSeverityFilter] = useState('');
    const [reasonFilter, setReasonFilter] = useState('');
    const [sortFilter, setSortFilter] = useState('Newest');

    // Filtered reports
    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            if (statusFilter && report.status !== statusFilter) return false;
            if (severityFilter && report.severity !== severityFilter) return false;
            if (reasonFilter && report.reason !== reasonFilter) return false;
            return true;
        });
    }, [reports, statusFilter, severityFilter, reasonFilter]);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#113F67]" />
            </div>
        );
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
            <h1 className="text-3xl font-bold mb-6" style={{ color: '#113F67' }}>
                Trade Reports
            </h1>

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
                        onChange: (value) => setStatusFilter(value as string),
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
                        onChange: (value) => setSeverityFilter(value as string),
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
                        onChange: (value) => setReasonFilter(value as string),
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
                        onChange: (value) => setSortFilter(value as string),
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
                {filteredReports.length === 0 ? (
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
                                {filteredReports.map((report) => (
                                    <tr
                                        key={report.reportId}
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
                                                {report.reason}
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
                                                <img
                                                    src={report.reporterAvatarUrl}
                                                    alt={report.reporterName}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
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

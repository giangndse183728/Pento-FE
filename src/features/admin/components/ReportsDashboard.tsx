'use client';

import React, { useState, useMemo } from 'react';
import { useReports } from '@/features/admin/hooks/useReport';
import { Loader2 } from 'lucide-react';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import ReportsSummaryCards from './reports/ReportsSummaryCards';
import ReportsSideDrawer from './reports/ReportsSideDrawer';
import type { TradeReport } from '@/features/admin/schema/reportSchema';

export default function ReportsDashboard() {
    const { reports, loading, error, refetch } = useReports();
    const [selectedReport, setSelectedReport] = useState<TradeReport | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Filter states
    const [statusFilter, setStatusFilter] = useState('All');
    const [severityFilter, setSeverityFilter] = useState('All');
    const [reasonFilter, setReasonFilter] = useState('All');

    // Filtered reports
    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            if (statusFilter !== 'All' && report.status !== statusFilter) return false;
            if (severityFilter !== 'All' && report.severity !== severityFilter) return false;
            if (reasonFilter !== 'All' && report.reason !== reasonFilter) return false;
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
                Admin Dashboard
            </h1>

            {/* Summary Cards */}
            <ReportsSummaryCards reports={reports} />

            {/* Main Table Card */}
            <WhiteCard className="rounded-2xl p-6 bg-white/90 border border-white/30 backdrop-blur-lg">
                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Status:</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="UnderReview">Under Review</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Dismissed">Dismissed</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Severity:</label>
                        <select
                            value={severityFilter}
                            onChange={(e) => setSeverityFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="All">All</option>
                            <option value="Minor">Minor</option>
                            <option value="Serious">Serious</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Reason:</label>
                        <select
                            value={reasonFilter}
                            onChange={(e) => setReasonFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="All">All</option>
                            <option value="FoodSafetyConcern">Food Safety Concern</option>
                            <option value="ExpiredFood">Expired Food</option>
                            <option value="PoorHygiene">Poor Hygiene</option>
                            <option value="MisleadingInformation">Misleading Information</option>
                            <option value="InappropriateBehavior">Inappropriate Behavior</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Date Range</label>
                        <input
                            type="date"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

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

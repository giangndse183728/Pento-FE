'use client';

import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import GradientLineChart from './GradientLineChart';
import SideDataCards from './SideDataCards';
import DataCards from './TopDataCards';
import { usePayments } from '../hooks/usePayments';
import type { PaymentStatus } from '../services/paymentService';
import { Calendar } from '@/components/ui/calendar';

const Dashboard = () => {
    const [filters, setFilters] = useState({
        searchText: "",
        fromAmount: "",
        toAmount: "",
        fromDate: "",
        toDate: "",
        status: "",
        isDeleted: "",
    });

    const [fromDateOpen, setFromDateOpen] = useState(false);
    const [toDateOpen, setToDateOpen] = useState(false);

    // Convert filter values to proper types for the API
    const apiParams = {
        searchText: filters.searchText || undefined,
        fromAmount: filters.fromAmount ? Number(filters.fromAmount) : undefined,
        toAmount: filters.toAmount ? Number(filters.toAmount) : undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        status: (filters.status as PaymentStatus) || undefined,
        isDeleted: filters.isDeleted ? filters.isDeleted === "true" : undefined,
    };

    const { summary, payments } = usePayments(apiParams);

    const handleChange = (field: string, value: string) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const clearAllFilters = () => {
        setFilters({
            searchText: "",
            fromAmount: "",
            toAmount: "",
            fromDate: "",
            toDate: "",
            status: "",
            isDeleted: "",
        });
        setFromDateOpen(false);
        setToDateOpen(false);
    };

    return (
        <AdminLayout>


            <DataCards summary={summary} />

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-6 w-full">
                {/* FILTER ROW 1 - Search takes 2/3, Status & Delete take 1/3 */}
                <div className="w-full grid grid-cols-3 gap-4 mb-4">
                    {/* Search Text - 2/3 width */}
                    <div className="relative col-span-1">
                        <input
                            type="text"
                            placeholder="Search text"
                            className="w-full p-2 rounded-lg border-2 border-white/40 bg-gray-100/50 pr-8"
                            value={filters.searchText}
                            onChange={(e) => handleChange("searchText", e.target.value)}
                        />
                        {filters.searchText && (
                            <button
                                onClick={() => handleChange("searchText", "")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-bold"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Status - 1/6 width */}
                    <select
                        className="p-2 rounded-lg border-2 border-white/40 bg-gray-100/50"
                        value={filters.status}
                        onChange={(e) => handleChange("status", e.target.value)}
                    >
                        <option value="">Status (All)</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="paid">Paid</option>
                        <option value="expired">Expired</option>
                        <option value="processing">Processing</option>
                        <option value="failed">Failed</option>
                    </select>

                    {/* Is Deleted */}
                    <select
                        className="p-2 rounded-lg border-2 border-white/40 bg-gray-100/50"
                        value={filters.isDeleted}
                        onChange={(e) => handleChange("isDeleted", e.target.value)}
                    >
                        <option value="">Is Deleted (All)</option>
                        <option value="true">Deleted</option>
                        <option value="false">Not Deleted</option>
                    </select>
                </div>

                {/* FILTER ROW 2 - Amount, Dates spread, Delete with least width */}
                <div className="w-full grid grid-cols-12 gap-4 mb-6">
                    {/* From Amount - 2 cols */}
                    <div className="relative col-span-2">
                        <input
                            type="number"
                            placeholder="From Amount"
                            className="w-full p-2 rounded-lg border-2 border-white/40 bg-gray-100/50 pr-8"
                            value={filters.fromAmount}
                            onChange={(e) => handleChange("fromAmount", e.target.value)}
                        />
                        {filters.fromAmount && (
                            <button
                                onClick={() => handleChange("fromAmount", "")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-bold"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* To Amount - 2 cols */}
                    <div className="relative col-span-2">
                        <input
                            type="number"
                            placeholder="To Amount"
                            className="w-full p-2 rounded-lg border-2 border-white/40 bg-gray-100/50 pr-8"
                            value={filters.toAmount}
                            onChange={(e) => handleChange("toAmount", e.target.value)}
                        />
                        {filters.toAmount && (
                            <button
                                onClick={() => handleChange("toAmount", "")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-bold"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* From Date - 3 cols */}
                    <div className="relative col-span-3">
                        <button
                            onClick={() => setFromDateOpen(!fromDateOpen)}
                            className="w-full p-2 rounded-lg border-2 border-white/40 bg-gray-100/50 text-left text-sm flex items-center justify-between"
                        >
                            <span>{filters.fromDate || "From Date"}</span>
                            {filters.fromDate && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleChange("fromDate", "");
                                    }}
                                    className="text-gray-400 hover:text-gray-600 text-sm font-bold"
                                >
                                    ✕
                                </button>
                            )}
                        </button>
                        {fromDateOpen && (
                            <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg z-10 p-2">
                                <Calendar
                                    mode="single"
                                    selected={filters.fromDate ? new Date(filters.fromDate) : undefined}
                                    onSelect={(date) => {
                                        if (date) handleChange("fromDate", date.toISOString().split("T")[0]);
                                        setFromDateOpen(false);
                                    }}
                                    disabled={(date) => (filters.toDate ? date > new Date(filters.toDate) : false)}
                                />
                            </div>
                        )}
                    </div>

                    {/* To Date - 3 cols */}
                    <div className="relative col-span-3">
                        <button
                            onClick={() => setToDateOpen(!toDateOpen)}
                            className="w-full p-2 rounded-lg border-2 border-white/40 bg-gray-100/50 text-left text-sm flex items-center justify-between"
                        >
                            <span>{filters.toDate || "To Date"}</span>
                            {filters.toDate && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleChange("toDate", "");
                                    }}
                                    className="text-gray-400 hover:text-gray-600 text-sm font-bold"
                                >
                                    ✕
                                </button>
                            )}
                        </button>
                        {toDateOpen && (
                            <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg z-10 p-2">
                                <Calendar
                                    mode="single"
                                    selected={filters.toDate ? new Date(filters.toDate) : undefined}
                                    onSelect={(date) => {
                                        if (date) handleChange("toDate", date.toISOString().split("T")[0]);
                                        setToDateOpen(false);
                                    }}
                                    disabled={(date) => (filters.fromDate ? date < new Date(filters.fromDate) : false)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Clear All Filters - 2 cols (least width) */}
                    <button
                        onClick={clearAllFilters}
                        className="col-span-2 p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition font-medium text-sm"
                    >
                        Clear All
                    </button>
                </div>

                {/* Charts */}
                <div className="flex gap-6 justify-start items-start w-full">
                    {/* 70% */}
                    <div className="flex-[0.7]">
                        <div className="h-[500px] w-full">
                            <GradientLineChart payments={payments} />
                        </div>
                    </div>

                    {/* 30% */}
                    <div className="flex-[0.3] w-[300px]">
                        <SideDataCards summary={summary} />
                    </div>
                </div>
            </div>

        </AdminLayout>
    );
};

export default Dashboard;

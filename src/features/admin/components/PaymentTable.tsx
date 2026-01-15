'use client';

import React, { useState, useMemo } from 'react';
import { usePaymentsForCards } from '../hooks/usePaymentsforCards';
import { TableSkeleton } from '@/components/decoration/TableSkeleton';
import TopDataCards from './TopDataCards';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FilterSection, { FilterField } from '@/components/decoration/FilterSection';
import type { GetPaymentsParams, PaymentStatus } from '../services/paymentService';
import { format, parseISO } from 'date-fns';

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'paid':
            return 'bg-green-100 text-green-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'failed':
            return 'bg-red-100 text-red-800';
        case 'cancelled':
            return 'bg-gray-100 text-gray-800';
        case 'expired':
            return 'bg-orange-100 text-orange-800';
        case 'processing':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-gray-100 text-gray-600';
    }
};

const formatDate = (dateString: string) => {
    try {
        const date = parseISO(dateString);
        return format(date, 'MMM d, yyyy HH:mm');
    } catch {
        return dateString;
    }
};

const STATUS_OPTIONS = [
    { value: '', label: 'All' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Expired', label: 'Expired' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Failed', label: 'Failed' },
];

const SORT_BY_OPTIONS = [
    { value: '', label: 'All' },
    { value: 'OrderCode', label: 'Order Code' },
    { value: 'Description', label: 'Description' },
    { value: 'AmountDue', label: 'Amount Due' },
    { value: 'AmountPaid', label: 'Amount Paid' },
    { value: 'CreatedAt', label: 'Created At' },
];

const SORT_ORDER_OPTIONS = [
    { value: '', label: 'All' },
    { value: 'ASC', label: 'Ascending' },
    { value: 'DESC', label: 'Descending' },
];

const IS_DELETED_OPTIONS = [
    { value: '', label: 'All' },
    { value: 'true', label: 'Deleted' },
    { value: 'false', label: 'Active' },
];

export default function PaymentTable() {
    // Filter state
    const [filters, setFilters] = useState({
        searchText: '',
        fromAmount: '',
        toAmount: '',
        fromDate: '',
        toDate: '',
        status: '',
        sortBy: '',
        sortOrder: 'DESC',
        isDeleted: '',
    });
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);

    // Build API params
    const apiParams: GetPaymentsParams = useMemo(() => {
        const params: GetPaymentsParams = {
            pageNumber,
            pageSize,
        };

        if (filters.searchText) params.searchText = filters.searchText;
        if (filters.fromAmount) params.fromAmount = parseInt(filters.fromAmount);
        if (filters.toAmount) params.toAmount = parseInt(filters.toAmount);
        if (filters.fromDate) params.fromDate = filters.fromDate;
        if (filters.toDate) params.toDate = filters.toDate;
        if (filters.status) params.status = filters.status as PaymentStatus;
        if (filters.sortBy) params.sortBy = filters.sortBy as GetPaymentsParams['sortBy'];
        if (filters.sortOrder) params.sortOrder = filters.sortOrder as GetPaymentsParams['sortOrder'];
        if (filters.isDeleted) params.isDeleted = filters.isDeleted === 'true';

        return params;
    }, [filters, pageNumber, pageSize]);

    const { summary, loading, error } = usePaymentsForCards(apiParams);

    const handleFilterChange = (field: string, value: string | boolean | undefined) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
        setPageNumber(1); // Reset to page 1 when filters change
    };

    const handleReset = () => {
        setFilters({
            searchText: '',
            fromAmount: '',
            toAmount: '',
            fromDate: '',
            toDate: '',
            status: '',
            sortBy: '',
            sortOrder: 'DESC',
            isDeleted: '',
        });
        setPageNumber(1);
    };

    const filterFields: FilterField[] = [
        {
            type: 'text',
            name: 'searchText',
            label: 'Search',
            placeholder: 'Search payments...',
            value: filters.searchText,
            onChange: (val) => handleFilterChange('searchText', val as string),
        },
        {
            type: 'text',
            name: 'fromAmount',
            label: 'Min Amount',
            placeholder: 'e.g., 1000',
            value: filters.fromAmount,
            onChange: (val) => handleFilterChange('fromAmount', val as string),
        },
        {
            type: 'text',
            name: 'toAmount',
            label: 'Max Amount',
            placeholder: 'e.g., 50000',
            value: filters.toAmount,
            onChange: (val) => handleFilterChange('toAmount', val as string),
        },
        {
            type: 'date',
            name: 'fromDate',
            label: 'From Date',
            value: filters.fromDate,
            onChange: (val) => handleFilterChange('fromDate', val as string),
        },
        {
            type: 'date',
            name: 'toDate',
            label: 'To Date',
            value: filters.toDate,
            onChange: (val) => handleFilterChange('toDate', val as string),
        },
        {
            type: 'select',
            name: 'status',
            label: 'Status',
            value: filters.status,
            options: STATUS_OPTIONS,
            onChange: (val) => handleFilterChange('status', val as string),
        },
        {
            type: 'select',
            name: 'sortBy',
            label: 'Sort By',
            value: filters.sortBy,
            options: SORT_BY_OPTIONS,
            onChange: (val) => handleFilterChange('sortBy', val as string),
        },
        {
            type: 'select',
            name: 'sortOrder',
            label: 'Sort Order',
            value: filters.sortOrder,
            options: SORT_ORDER_OPTIONS,
            onChange: (val) => handleFilterChange('sortOrder', val as string),
        },
        {
            type: 'select',
            name: 'isDeleted',
            label: 'Visibility',
            value: filters.isDeleted,
            options: IS_DELETED_OPTIONS,
            onChange: (val) => handleFilterChange('isDeleted', val as string),
        },
    ];

    const payments = summary?.items || [];
    const totalPages = summary?.totalPages || 1;
    const totalCount = summary?.totalCount || 0;

    return (
        <div className="space-y-4">
            <FilterSection
                title="Payment Filters"
                fields={filterFields}
                onReset={handleReset}
                resetButtonText="Clear"
                defaultCollapsed={true}
            />

            {/* Payment Summary Cards */}
            <TopDataCards summary={summary?.summary ?? null} />

            {loading ? (
                <TableSkeleton
                    title="Payment History"
                    rowCount={10}
                    columnCount={7}
                />
            ) : error ? (
                <div className="text-center text-red-500 py-8">
                    Failed to load payment data
                </div>
            ) : payments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No payments found
                </div>
            ) : (
                <WhiteCard className="w-full rounded-2xl p-6 bg-white/90 border border-white/30 backdrop-blur-lg">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold" style={{ color: '#113F67' }}>
                                Payment History
                            </h3>
                            <span className="text-sm text-gray-500">
                                Total: {totalCount} payments
                            </span>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-[#113F67]/5">
                                    <TableHead style={{ color: '#113F67' }}>Order Code</TableHead>
                                    <TableHead style={{ color: '#113F67' }}>Description</TableHead>
                                    <TableHead style={{ color: '#113F67' }}>Email</TableHead>
                                    <TableHead style={{ color: '#113F67' }}>Amount Due</TableHead>
                                    <TableHead style={{ color: '#113F67' }}>Amount Paid</TableHead>
                                    <TableHead style={{ color: '#113F67' }}>Status</TableHead>
                                    <TableHead style={{ color: '#113F67' }}>Created At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((payment) => (
                                    <TableRow key={payment.paymentId || payment.orderCode} className="hover:bg-gray-50">
                                        <TableCell className="font-medium py-3">
                                            #{payment.orderCode}
                                        </TableCell>
                                        <TableCell className="max-w-[300px] whitespace-normal py-3">
                                            {payment.description}
                                        </TableCell>
                                        <TableCell className="py-3">
                                            {payment.email}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {payment.amountDue}
                                        </TableCell>
                                        <TableCell className="font-medium text-green-600">
                                            {payment.amountPaid}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                                {payment.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-gray-500">
                                            {formatDate(payment.createdAt)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        <div className="flex items-center justify-between pt-4 border-t">
                            <span className="text-sm text-gray-500">
                                Page {pageNumber} of {totalPages}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                                    disabled={pageNumber === 1}
                                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))}
                                    disabled={pageNumber === totalPages}
                                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </WhiteCard>
            )}
        </div>
    );
}

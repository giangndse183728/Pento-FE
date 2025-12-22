'use client';

import React, { useState } from 'react';
import { useAdminTradeRequests } from '../hook/useTrade';
import type { GetTradeRequestsParams, TradeRequestItem } from '../schemas/tradeSchema';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import FilterSection, { type FilterField } from '@/components/decoration/FilterSection';
import { CusButton } from '@/components/ui/cusButton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText } from 'lucide-react';

type Props = {
    offerId?: string;
    status?: string;
    isDeleted?: boolean;
    sortBy?: 'CreatedOn' | 'TotalItems';
    sortOrder?: 'ASC' | 'DESC';
    pageNumber: number;
    setPageNumber: (page: number) => void;
    pageSize?: number;
};

export default function TradeRequestsList({
    offerId,
    status,
    isDeleted,
    sortBy,
    sortOrder,
    pageNumber,
    setPageNumber,
    pageSize = 10
}: Props) {
    // Internal Filter States
    const [statusFilter, setStatusFilter] = useState<string | undefined>(status);
    const [isDeletedFilter, setIsDeletedFilter] = useState<boolean | undefined>(isDeleted);
    const [sortByFilter, setSortByFilter] = useState<'CreatedOn' | 'TotalItems' | undefined>(sortBy);
    const [sortOrderFilter, setSortOrderFilter] = useState<'ASC' | 'DESC' | undefined>(sortOrder);

    const params: GetTradeRequestsParams = {
        offerId,
        status: statusFilter,
        isDeleted: isDeletedFilter,
        sortBy: sortByFilter,
        sortOrder: sortOrderFilter,
        pageNumber,
        pageSize,
    };

    const { data, isLoading, isError } = useAdminTradeRequests(params);

    const items = data?.items ?? [];
    const totalCount = data?.totalCount ?? 0;
    const totalPages = data?.totalPages ?? 0;
    const hasPrevious = data?.hasPrevious ?? false;
    const hasNext = data?.hasNext ?? false;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(date);
    };

    const handleReset = () => {
        setStatusFilter(undefined);
        setIsDeletedFilter(undefined);
        setSortByFilter(undefined);
        setSortOrderFilter('DESC');
        setPageNumber(1);
    };

    const filterFields: FilterField[] = [
        {
            type: 'select',
            name: 'status',
            label: 'Status',
            value: statusFilter,
            options: [
                { value: '', label: 'All Statuses' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Fulfilled', label: 'Fulfilled' },
                { value: 'Rejected', label: 'Rejected' },
                { value: 'Cancelled', label: 'Cancelled' },
            ],
            onChange: (val) => {
                setStatusFilter(val as string || undefined);
                setPageNumber(1);
            }
        },
        {
            type: 'select',
            name: 'sortBy',
            label: 'Sort By',
            value: sortByFilter,
            options: [
                { value: 'CreatedOn', label: 'Date Created' },
                { value: 'TotalItems', label: 'Total Items' },
            ],
            onChange: (val) => {
                setSortByFilter(val as 'CreatedOn' | 'TotalItems' || undefined);
                setPageNumber(1);
            }
        },
        {
            type: 'select',
            name: 'sortOrder',
            label: 'Sort Order',
            value: sortOrderFilter,
            options: [
                { value: 'DESC', label: 'Newest/Highest' },
                { value: 'ASC', label: 'Oldest/Lowest' },
            ],
            onChange: (val) => {
                setSortOrderFilter(val as 'ASC' | 'DESC' || undefined);
                setPageNumber(1);
            }
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return '#F59E0B';
            case 'fulfilled': return '#10B981';
            case 'rejected': return '#EF4444';
            case 'cancelled': return '#EF4444';
            default: return '#9CA3AF';
        }
    };

    return (
        <div className="space-y-6">
            <FilterSection
                title="Filter Requests"
                fields={filterFields}
                onReset={handleReset}
                radioGroup={{
                    label: 'Advanced',
                    name: 'deletion',
                    options: [
                        {
                            label: 'Show All',
                            value: 'all',
                            checked: isDeletedFilter === undefined,
                            onChange: () => {
                                setIsDeletedFilter(undefined);
                                setPageNumber(1);
                            }
                        },
                        {
                            label: 'Active Only',
                            value: 'active',
                            checked: isDeletedFilter === false,
                            onChange: () => {
                                setIsDeletedFilter(false);
                                setPageNumber(1);
                            }
                        },
                        {
                            label: 'Deleted Only',
                            value: 'deleted',
                            checked: isDeletedFilter === true,
                            onChange: () => {
                                setIsDeletedFilter(true);
                                setPageNumber(1);
                            }
                        }
                    ]
                }}
            />

            <WhiteCard className="w-full" width="100%" height="auto">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold" style={{ color: '#113F67' }}>
                            Trade Requests
                        </h2>
                        {!isLoading && data && (
                            <p className="text-sm text-gray-500">
                                {totalCount} total requests
                            </p>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12 text-gray-500">
                            Loading trade requests...
                        </div>
                    ) : isError ? (
                        <div className="text-center py-12 text-red-500">
                            Failed to load trade requests. Please try again.
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p className="text-lg font-medium">No trade requests found</p>
                            <p className="text-sm mt-2">Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <>
                            <Table className="w-full table-fixed">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='text-lg font-semibold' style={{ color: '#113F67' }}>Requester</TableHead>
                                        <TableHead className='text-lg font-semibold w-[180px]' style={{ color: '#113F67' }}>Offer Household</TableHead>
                                        <TableHead className='text-lg font-semibold w-[180px]' style={{ color: '#113F67' }}>Request Household</TableHead>
                                        <TableHead className='text-lg font-semibold text-center w-[100px]' style={{ color: '#113F67' }}>Items</TableHead>
                                        <TableHead className='text-lg font-semibold text-center w-[120px]' style={{ color: '#113F67' }}>Status</TableHead>
                                        <TableHead className='text-lg font-semibold w-[130px]' style={{ color: '#113F67' }}>Created</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((request: TradeRequestItem, index) => (
                                        <TableRow
                                            key={`${request.tradeRequestId}-${index}`}
                                            className="hover:bg-gray-50"
                                        >
                                            {/* Requester */}
                                            <TableCell className="font-semibold text-base" style={{ color: '#113F67' }}>
                                                <div className="flex items-center gap-3">
                                                    {request.requestUser.avatarUrl ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={request.requestUser.avatarUrl}
                                                            alt={`${request.requestUser.firstName} ${request.requestUser.lastName}`}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                            {request.requestUser.firstName.charAt(0)}{request.requestUser.lastName.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="truncate">{request.requestUser.firstName} {request.requestUser.lastName}</p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Offer Household */}
                                            <TableCell className="text-sm text-gray-600">
                                                {request.offerHouseholdName || <span className="text-gray-400 italic">-</span>}
                                            </TableCell>

                                            {/* Request Household */}
                                            <TableCell className="text-sm text-gray-600">
                                                {request.requestHouseholdName || <span className="text-gray-400 italic">-</span>}
                                            </TableCell>

                                            {/* Items */}
                                            <TableCell className="text-center text-sm font-semibold text-gray-700">
                                                {request.totalItems}
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell className="text-center">
                                                <span
                                                    className="px-3 py-1 rounded-full text-xs font-semibold text-white inline-block"
                                                    style={{ backgroundColor: getStatusColor(request.status) }}
                                                >
                                                    {request.status}
                                                </span>
                                            </TableCell>

                                            {/* Created */}
                                            <TableCell className="text-sm text-gray-600">
                                                {formatDate(request.createdOn)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: '#D6E6F2' }}>
                                <p className="text-sm text-gray-500">
                                    Page {pageNumber} of {totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <CusButton
                                        type="button"
                                        onClick={() => setPageNumber(pageNumber - 1)}
                                        disabled={!hasPrevious || isLoading}
                                        variant="blueGray"
                                    >
                                        Previous
                                    </CusButton>
                                    <CusButton
                                        type="button"
                                        onClick={() => setPageNumber(pageNumber + 1)}
                                        disabled={!hasNext || isLoading}
                                        variant="blueGray"
                                    >
                                        Next
                                    </CusButton>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </WhiteCard>
        </div>
    );
}

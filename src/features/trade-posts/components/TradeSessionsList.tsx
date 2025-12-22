'use client';

import React, { useState } from 'react';
import { useAdminTradeSessions } from '../hook/useTrade';
import type { GetTradeSessionsParams, TradeSessionItem } from '../schemas/tradeSchema';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import FilterSection, { type FilterField } from '@/components/decoration/FilterSection';
import { CusButton } from '@/components/ui/cusButton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Handshake } from 'lucide-react';

type Props = {
    offerId?: string;
    requestId?: string;
    status?: string;
    sortOrder?: 'ASC' | 'DESC';
    pageNumber: number;
    setPageNumber: (page: number) => void;
    pageSize?: number;
};

export default function TradeSessionsList({
    offerId,
    requestId,
    status,
    sortOrder,
    pageNumber,
    setPageNumber,
    pageSize = 10
}: Props) {
    // Internal Filter States
    const [statusFilter, setStatusFilter] = useState<string | undefined>(status);
    const [requestIdFilter, setRequestIdFilter] = useState<string | undefined>(requestId);
    const [sortOrderFilter, setSortOrderFilter] = useState<'ASC' | 'DESC' | undefined>(sortOrder);

    const params: GetTradeSessionsParams = {
        offerId,
        requestId: requestIdFilter,
        status: statusFilter,
        sortOrder: sortOrderFilter,
        pageNumber,
        pageSize,
    };

    const { data, isLoading, isError } = useAdminTradeSessions(params);

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
        setRequestIdFilter(undefined);
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
                { value: 'Ongoing', label: 'Ongoing' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Cancelled', label: 'Cancelled' },
            ],
            onChange: (val) => {
                setStatusFilter(val as string || undefined);
                setPageNumber(1);
            }
        },
        {
            type: 'text',
            name: 'requestId',
            label: 'Request ID',
            placeholder: 'Search by Request ID...',
            value: requestIdFilter,
            onChange: (val) => {
                setRequestIdFilter(val as string || undefined);
                setPageNumber(1);
            }
        },
        {
            type: 'select',
            name: 'sortOrder',
            label: 'Sort Order',
            value: sortOrderFilter,
            options: [
                { value: 'DESC', label: 'Newest First' },
                { value: 'ASC', label: 'Oldest First' },
            ],
            onChange: (val) => {
                setSortOrderFilter(val as 'ASC' | 'DESC' || undefined);
                setPageNumber(1);
            }
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'ongoing': return '#3B82F6';
            case 'completed': return '#10B981';
            case 'cancelled': return '#EF4444';
            default: return '#9CA3AF';
        }
    };

    return (
        <div className="space-y-6">
            <FilterSection
                title="Filter Sessions"
                fields={filterFields}
                onReset={handleReset}
            />

            <WhiteCard className="w-full" width="100%" height="auto">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold" style={{ color: '#113F67' }}>
                            Trade Sessions
                        </h2>
                        {!isLoading && data && (
                            <p className="text-sm text-gray-500">
                                {totalCount} total sessions
                            </p>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12 text-gray-500">
                            Loading trade sessions...
                        </div>
                    ) : isError ? (
                        <div className="text-center py-12 text-red-500">
                            Failed to load trade sessions. Please try again.
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Handshake className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p className="text-lg font-medium">No trade sessions found</p>
                            <p className="text-sm mt-2">Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <>
                            <Table className="w-full table-fixed">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='text-lg font-semibold w-[150px]' style={{ color: '#113F67' }}>Participants</TableHead>
                                        <TableHead className='text-lg font-semibold text-center w-[120px]' style={{ color: '#113F67' }}>Offered</TableHead>
                                        <TableHead className='text-lg font-semibold text-center w-[120px]' style={{ color: '#113F67' }}>Requested</TableHead>
                                        <TableHead className='text-lg font-semibold text-center w-[120px]' style={{ color: '#113F67' }}>Status</TableHead>
                                        <TableHead className='text-lg font-semibold w-[150px]' style={{ color: '#113F67' }}>Started</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((session: TradeSessionItem, index) => (
                                        <TableRow
                                            key={`${session.tradeSessionId}-${index}`}
                                            className="hover:bg-gray-50"
                                        >
                                            {/* Participants */}
                                            <TableCell>
                                                <div className="flex -space-x-2">
                                                    {session.avatarUrls.slice(0, 2).map((url, idx) => (
                                                        url ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img
                                                                key={idx}
                                                                src={url}
                                                                alt={`User ${idx + 1}`}
                                                                className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                                            />
                                                        ) : (
                                                            <div
                                                                key={idx}
                                                                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-white"
                                                            >
                                                                ?
                                                            </div>
                                                        )
                                                    ))}
                                                    {session.avatarUrls.length > 2 && (
                                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-semibold border-2 border-white">
                                                            +{session.avatarUrls.length - 2}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Offered Items */}
                                            <TableCell className="text-center text-sm font-semibold text-gray-700">
                                                {session.totalOfferedItems}
                                            </TableCell>

                                            {/* Requested Items */}
                                            <TableCell className="text-center text-sm font-semibold text-gray-700">
                                                {session.totalRequestedItems}
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell className="text-center">
                                                <span
                                                    className="px-3 py-1 rounded-full text-xs font-semibold text-white inline-block"
                                                    style={{ backgroundColor: getStatusColor(session.status) }}
                                                >
                                                    {session.status}
                                                </span>
                                            </TableCell>

                                            {/* Started */}
                                            <TableCell className="text-sm text-gray-600">
                                                {formatDate(session.startedOn)}
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

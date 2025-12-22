'use client';

import React, { useState } from 'react';
import { useAdminTradeOffers } from '../hook/useTrade';
import type { GetTradeOffersParams, TradeOfferItem } from '../schemas/tradeSchema';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import FilterSection, { type FilterField } from '@/components/decoration/FilterSection';
import { CusButton } from '@/components/ui/cusButton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package } from 'lucide-react';
import OffersDetailsModal from './OffersDetailsModal';

type Props = {
    status?: string;
    isDeleted?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    pageNumber: number;
    setPageNumber: (page: number) => void;
    pageSize?: number;
};

export default function TradeOffersList({
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
    const [sortByFilter, setSortByFilter] = useState<string | undefined>(sortBy);
    const [sortOrderFilter, setSortOrderFilter] = useState<'ASC' | 'DESC' | undefined>(sortOrder);

    // Modal State
    const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

    const params: GetTradeOffersParams = {
        status: statusFilter,
        isDeleted: isDeletedFilter,
        sortBy: sortByFilter,
        sortOrder: sortOrderFilter,
        pageNumber,
        pageSize,
    };

    const { data, isLoading, isError } = useAdminTradeOffers(params);

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
                { value: 'open', label: 'Open' },
                { value: 'fulfilled', label: 'Fulfilled' },
                { value: 'cancelled', label: 'Cancelled' },
                { value: 'expired', label: 'Expired' },
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
                { value: 'TotalRequests', label: 'Total Requests' },
            ],
            onChange: (val) => {
                setSortByFilter(val as string || undefined);
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
        if (!status) return '#9CA3AF';
        switch (status.toLowerCase()) {
            case 'open': return '#F59E0B'; // Amber for open (waiting)
            case 'fulfilled': return '#10B981'; // Green for fulfilled
            case 'cancelled': return '#EF4444'; // Red for cancelled
            case 'expired': return '#6B7280'; // Gray for expired
            default: return '#9CA3AF';
        }
    };

    return (
        <div className="space-y-6">
            <FilterSection
                title="Filter Offers"
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
                            Trade Offers
                        </h2>
                        {!isLoading && data && (
                            <p className="text-sm text-gray-500">
                                {totalCount} total offers
                            </p>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12 text-gray-500">
                            Loading trade offers...
                        </div>
                    ) : isError ? (
                        <div className="text-center py-12 text-red-500">
                            Failed to load trade offers. Please try again.
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p className="text-lg font-medium">No trade offers found</p>
                            <p className="text-sm mt-2">Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <>
                            <Table className="w-full table-fixed">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='text-lg font-semibold' style={{ color: '#113F67' }}>User</TableHead>
                                        <TableHead className='text-lg font-semibold w-[200px]' style={{ color: '#113F67' }}>Household</TableHead>
                                        <TableHead className='text-lg font-semibold text-center w-[100px]' style={{ color: '#113F67' }}>Items</TableHead>
                                        <TableHead className='text-lg font-semibold text-center w-[120px]' style={{ color: '#113F67' }}>Requests</TableHead>
                                        <TableHead className='text-lg font-semibold text-center w-[120px]' style={{ color: '#113F67' }}>Status</TableHead>
                                        <TableHead className='text-lg font-semibold w-[130px]' style={{ color: '#113F67' }}>Created</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((offer: TradeOfferItem, index) => (
                                        <TableRow
                                            key={`${offer.tradeOfferId}-${index}`}
                                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => setSelectedOfferId(offer.tradeOfferId)}
                                        >
                                            {/* User */}
                                            <TableCell className="font-semibold text-base" style={{ color: '#113F67' }}>
                                                <div className="flex items-center gap-3">
                                                    {offer.offerUser.avatarUrl ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={offer.offerUser.avatarUrl}
                                                            alt={`${offer.offerUser.firstName} ${offer.offerUser.lastName}`}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                            {offer.offerUser.firstName.charAt(0)}{offer.offerUser.lastName.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="truncate">{offer.offerUser.firstName} {offer.offerUser.lastName}</p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Household */}
                                            <TableCell className="text-sm text-gray-600">
                                                {offer.offerHouseholdName || <span className="text-gray-400 italic">No household</span>}
                                            </TableCell>

                                            {/* Items */}
                                            <TableCell className="text-center text-sm font-semibold text-gray-700">
                                                {offer.totalItems}
                                            </TableCell>

                                            {/* Requests */}
                                            <TableCell className="text-center text-sm font-semibold text-gray-700">
                                                {offer.totalRequests}
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell className="text-center">
                                                <span
                                                    className="px-3 py-1 rounded-full text-xs font-semibold text-white inline-block"
                                                    style={{ backgroundColor: getStatusColor(offer.status) }}
                                                >
                                                    {offer.status}
                                                </span>
                                            </TableCell>

                                            {/* Created */}
                                            <TableCell className="text-sm text-gray-600">
                                                {formatDate(offer.createdOn)}
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

            {/* Details Modal */}
            <OffersDetailsModal
                offerId={selectedOfferId}
                onClose={() => setSelectedOfferId(null)}
            />
        </div>
    );
}

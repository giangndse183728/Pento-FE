'use client';

import React from 'react';
import { X, Package, User, Home, Calendar, Info, FlaskConical } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTradeOfferById } from '../hook/useTrade';
import type { TradeOfferDetails, TradeItem } from '../schemas/tradeSchema';

type Props = {
    offerId: string | null;
    onClose: () => void;
};

export default function OffersDetailsModal({ offerId, onClose }: Props) {
    const { data: offer, isLoading, isError } = useTradeOfferById(offerId);

    if (!offerId) return null;

    const formatDate = (dateString: string) => {
        if (!dateString || dateString.startsWith('0001')) return 'N/A';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getStatusColor = (status: string) => {
        if (!status) return '#9CA3AF';
        switch (status.toLowerCase()) {
            case 'open': return '#F59E0B';
            case 'fulfilled': return '#10B981';
            case 'cancelled': return '#EF4444';
            case 'expired': return '#6B7280';
            default: return '#9CA3AF';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4" style={{ zIndex: 9999 }} onClick={onClose}>
            <div
                className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border flex flex-col max-h-[90vh]"
                style={{ borderColor: '#D6E6F2' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-8 pb-4 border-b-2 flex-shrink-0" style={{ borderColor: '#D6E6F2' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center" style={{ color: '#113F67' }}>
                            <Package className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold" style={{ color: '#113F67' }}>Offer Details</h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all"
                        style={{ color: '#113F67' }}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-8 pt-6">
                    {isLoading ? (
                        <div className="space-y-6">
                            <Skeleton className="h-32 w-full rounded-2xl" />
                            <Skeleton className="h-64 w-full rounded-2xl" />
                        </div>
                    ) : isError ? (
                        <div className="text-center py-12 text-red-500">
                            Failed to load offer details. Please try again.
                        </div>
                    ) : offer ? (
                        <div className="space-y-8">
                            {/* Summary Section */}
                            <section>
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-4" style={{ color: '#113F67' }}>
                                    <Info className="w-5 h-5" />
                                    Summary Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* User */}
                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Offer User</p>
                                            <p className="font-bold" style={{ color: '#113F67' }}>
                                                {offer.tradeOffer.offerUser?.firstName} {offer.tradeOffer.offerUser?.lastName}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Household */}
                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                            <Home className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Household</p>
                                            <p className="font-bold" style={{ color: '#113F67' }}>{offer.tradeOffer.offerHouseholdName || 'None'}</p>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                                        <div className="p-2 rounded-lg text-white" style={{ backgroundColor: getStatusColor(offer.tradeOffer.status) }}>
                                            <FlaskConical className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
                                            <p className="font-bold" style={{ color: getStatusColor(offer.tradeOffer.status) }}>{offer.tradeOffer.status}</p>
                                        </div>
                                    </div>

                                    {/* Created Date */}
                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Created On</p>
                                            <p className="font-bold" style={{ color: '#113F67' }}>{formatDate(offer.tradeOffer.createdOn)}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Items Section */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: '#113F67' }}>
                                        <Package className="w-5 h-5" />
                                        Offered Items ({offer.items?.length || 0})
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {!offer.items || offer.items.length === 0 ? (
                                        <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                            <p className="text-gray-400">No items in this offer</p>
                                        </div>
                                    ) : (
                                        offer.items.map((item: TradeItem) => (
                                            <div key={item.tradeItemId} className="p-4 rounded-2xl border bg-white hover:shadow-md transition-shadow flex items-center justify-between gap-4" style={{ borderColor: '#D6E6F2' }}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                                        {item.imageUrl ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                <FlaskConical className="w-6 h-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold" style={{ color: '#113F67' }}>{item.name}</h4>
                                                        <p className="text-xs text-gray-500 tracking-wide uppercase">{item.foodGroup}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-lg" style={{ color: '#113F67' }}>
                                                        {item.quantity}{item.unitAbbreviation}
                                                    </div>
                                                    <p className="text-xs text-gray-400">Exp: {item.expirationDate}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

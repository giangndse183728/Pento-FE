'use client';

import React from 'react';
import Image from 'next/image';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { CusButton } from '@/components/ui/cusButton';
import { useFoodReferenceById } from '../hooks/useFoodReferences';
import { Badge } from '@/components/ui/badge';
import { ColorTheme } from '@/constants/color';

type Props = {
    foodRefId: string;
    onClose: () => void;
    onEdit?: () => void;
};

export default function FoodRefDetailsModal({ foodRefId, onClose, onEdit }: Props) {
    const { data, isLoading } = useFoodReferenceById(foodRefId);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
                <WhiteCard className="w-full max-w-2xl" width="100%" height="auto">
                    <div className="text-center py-12 text-gray-500">
                        Loading food reference details...
                    </div>
                </WhiteCard>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const formatShelfLife = (days: number | null | undefined) => {
        if (!days) return '—';
        if (days === 1) return '1 day';
        return `${days} days`;
    };

    return (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            <WhiteCard className="w-full max-w-2xl bg-white/95" width="100%" height="auto">
                <div className="space-y-6 max-h-[80vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold" style={{ color: '#113F67' }}>
                            Food Reference Details
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                        {/* Image and Basic Info */}
                        <div className="flex gap-6 items-start">
                            <div className="flex-shrink-0">
                                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                                    <Image
                                        src={data.imageUrl || '/assets/img/placeholder.jpg'}
                                        alt={data.name}
                                        fill
                                        className="object-cover"
                                        sizes="128px"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 space-y-3">
                                <div>
                                    <h3 className="text-xl font-bold" style={{ color: '#113F67' }}>
                                        {data.name}
                                    </h3>
                                    {data.notes && (
                                        <p className="text-gray-600 mt-1">{data.notes}</p>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {data.foodGroup && (
                                        <Badge
                                            variant="secondary"
                                            style={{ backgroundColor: ColorTheme.powderBlue, color: ColorTheme.darkBlue }}
                                        >
                                            {data.foodGroup}
                                        </Badge>
                                    )}
                                    {data.unitType && (
                                        <Badge
                                            variant="outline"
                                            style={{ borderColor: ColorTheme.powderBlue, color: ColorTheme.darkBlue }}
                                        >
                                            {data.unitType}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="pt-4 border-t" style={{ borderColor: '#D6E6F2' }}>
                            <h4 className="text-lg font-semibold mb-3" style={{ color: '#113F67' }}>
                                Details
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                {data.brand && (
                                    <div>
                                        <label className="text-xs text-gray-500">Brand</label>
                                        <p className="font-medium">{data.brand}</p>
                                    </div>
                                )}
                                {data.barcode && (
                                    <div>
                                        <label className="text-xs text-gray-500">Barcode</label>
                                        <p className="font-medium font-mono">{data.barcode}</p>
                                    </div>
                                )}
                                {data.usdaId && (
                                    <div>
                                        <label className="text-xs text-gray-500">USDA ID</label>
                                        <p className="font-medium font-mono">{data.usdaId}</p>
                                    </div>
                                )}
                                {data.foodCategoryId && (
                                    <div>
                                        <label className="text-xs text-gray-500">Category ID</label>
                                        <p className="font-medium">{data.foodCategoryId}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Shelf Life */}
                        <div className="pt-4 border-t" style={{ borderColor: '#D6E6F2' }}>
                            <h4 className="text-lg font-semibold mb-3" style={{ color: '#113F67' }}>
                                Shelf Life
                            </h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#F8FAFC' }}>
                                    <label className="text-xs text-gray-500 block">Pantry</label>
                                    <p className="font-semibold" style={{ color: '#113F67' }}>
                                        {formatShelfLife(data.typicalShelfLifeDays_Pantry)}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#F8FAFC' }}>
                                    <label className="text-xs text-gray-500 block">Fridge</label>
                                    <p className="font-semibold" style={{ color: '#113F67' }}>
                                        {formatShelfLife(data.typicalShelfLifeDays_Fridge)}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#F8FAFC' }}>
                                    <label className="text-xs text-gray-500 block">Freezer</label>
                                    <p className="font-semibold" style={{ color: '#113F67' }}>
                                        {formatShelfLife(data.typicalShelfLifeDays_Freezer)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Timestamps */}
                        {(data.createdOnUtc || data.updatedOnUtc) && (
                            <div className="pt-4 border-t text-xs text-gray-400" style={{ borderColor: '#D6E6F2' }}>
                                {data.createdOnUtc && (
                                    <span>Created: {new Date(data.createdOnUtc).toLocaleDateString()}</span>
                                )}
                                {data.createdOnUtc && data.updatedOnUtc && <span className="mx-2">•</span>}
                                {data.updatedOnUtc && (
                                    <span>Updated: {new Date(data.updatedOnUtc).toLocaleDateString()}</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t" style={{ borderColor: '#D6E6F2' }}>
                        {onEdit && (
                            <CusButton
                                type="button"
                                onClick={onEdit}
                                variant="blueGray"
                            >
                                Edit
                            </CusButton>
                        )}
                        <CusButton
                            type="button"
                            onClick={onClose}
                            variant="pastelRed"
                        >
                            Close
                        </CusButton>
                    </div>
                </div>
            </WhiteCard>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import UpdateDetailsModal from '@/components/decoration/UpdateDetailsModal';
import { toast } from 'sonner';
import { useFoodReferenceById, useUpdateFoodReference } from '../hooks/useFoodReferences';
import type { UpdateFoodReferenceInput } from '../schema/foodReferenceSchema';

type Props = {
    foodRefId: string;
    onClose: () => void;
    onSuccess?: () => void;
};

const foodGroups = [
    { value: 'Meat', label: 'Meat' },
    { value: 'Seafood', label: 'Seafood' },
    { value: 'FruitsVegetables', label: 'Fruits & Vegetables' },
    { value: 'Dairy', label: 'Dairy' },
    { value: 'CerealGrainsPasta', label: 'Cereal, Grains & Pasta' },
    { value: 'LegumesNutsSeeds', label: 'Legumes, Nuts & Seeds' },
    { value: 'FatsOils', label: 'Fats & Oils' },
    { value: 'Confectionery', label: 'Confectionery' },
    { value: 'Beverages', label: 'Beverages' },
    { value: 'Condiments', label: 'Condiments' },
    { value: 'MixedDishes', label: 'Mixed Dishes' },
];

const unitTypes = ['Weight', 'Volume', 'Count', 'Length'];

export default function FoodRefEditModal({ foodRefId, onClose, onSuccess }: Props) {
    const { data, isLoading: isLoadingData } = useFoodReferenceById(foodRefId);
    const updateMutation = useUpdateFoodReference();

    const [formData, setFormData] = useState<UpdateFoodReferenceInput>({
        name: '',
        foodGroup: null,
        notes: null,
        brand: null,
        usdaId: null,
        typicalShelfLifeDays_Pantry: null,
        typicalShelfLifeDays_Fridge: null,
        typicalShelfLifeDays_Freezer: null,
        unitType: null,
    });

    useEffect(() => {
        if (data) {
            setFormData({
                name: data.name,
                foodGroup: data.foodGroup || null,
                notes: data.notes || null,
                brand: data.brand || null,
                usdaId: data.usdaId || null,
                typicalShelfLifeDays_Pantry: data.typicalShelfLifeDays_Pantry || null,
                typicalShelfLifeDays_Fridge: data.typicalShelfLifeDays_Fridge || null,
                typicalShelfLifeDays_Freezer: data.typicalShelfLifeDays_Freezer || null,
                unitType: data.unitType || null,
            });
        }
    }, [data]);

    const isLoading = isLoadingData || updateMutation.isPending;

    const inputClass = 'neomorphic-input w-full';
    const selectClass = 'neomorphic-select w-full';
    const textareaClass = 'neomorphic-textarea w-full min-h-[80px]';

    const handleChange = (field: keyof UpdateFoodReferenceInput, value: string | number | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNumberChange = (field: keyof UpdateFoodReferenceInput, value: string) => {
        const num = value === '' ? null : parseInt(value, 10);
        handleChange(field, isNaN(num as number) ? null : num);
    };

    const handleSave = async () => {
        if (!formData.name?.trim()) {
            toast.error('Name is required');
            return;
        }

        try {
            // Build payload - only include fields with actual values
            // Swagger omits null fields rather than sending them as null
            const cleanPayload: Record<string, unknown> = {
                name: formData.name?.trim() || '',
            };

            if (formData.foodGroup) cleanPayload.foodGroup = formData.foodGroup;
            if (formData.notes) cleanPayload.notes = formData.notes;
            if (formData.brand) cleanPayload.brand = formData.brand;
            if (formData.usdaId) cleanPayload.usdaId = formData.usdaId;
            if (formData.typicalShelfLifeDays_Pantry != null) cleanPayload.typicalShelfLifeDays_Pantry = formData.typicalShelfLifeDays_Pantry;
            if (formData.typicalShelfLifeDays_Fridge != null) cleanPayload.typicalShelfLifeDays_Fridge = formData.typicalShelfLifeDays_Fridge;
            if (formData.typicalShelfLifeDays_Freezer != null) cleanPayload.typicalShelfLifeDays_Freezer = formData.typicalShelfLifeDays_Freezer;
            if (formData.unitType) cleanPayload.unitType = formData.unitType;

            console.log('Sending payload (only non-null fields):', JSON.stringify(cleanPayload, null, 2));

            await updateMutation.mutateAsync({
                id: foodRefId,
                payload: cleanPayload as UpdateFoodReferenceInput,
            });

            toast.success('Food reference updated successfully');
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error('Failed to update food reference', err);
            const error = err as Record<string, unknown>;
            const errorData = (error?.response as Record<string, unknown>)?.data as Record<string, unknown>;
            toast.error((errorData?.detail as string) || 'Failed to update food reference');
        }
    };

    if (isLoadingData) {
        return (
            <UpdateDetailsModal
                title="Edit Food Reference"
                onClose={onClose}
                isLoading={true}
            >
                <div className="text-center py-12 text-gray-500">
                    Loading...
                </div>
            </UpdateDetailsModal>
        );
    }

    return (
        <UpdateDetailsModal
            title="Edit Food Reference"
            onClose={onClose}
            isLoading={isLoading}
            onSave={handleSave}
            saveLabel={updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        >
            {/* Name */}
            <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                    Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={inputClass}
                    placeholder="Food name"
                    disabled={isLoading}
                />
            </div>

            {/* Food Group & Unit Type */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                        Food Group
                    </label>
                    <select
                        value={formData.foodGroup || ''}
                        onChange={(e) => handleChange('foodGroup', e.target.value || null)}
                        className={selectClass}
                        disabled={isLoading}
                    >
                        <option value="">Select...</option>
                        {foodGroups.map((group) => (
                            <option key={group.value} value={group.value}>{group.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                        Unit Type
                    </label>
                    <select
                        value={formData.unitType || ''}
                        onChange={(e) => handleChange('unitType', e.target.value || null)}
                        className={selectClass}
                        disabled={isLoading}
                    >
                        <option value="">Select...</option>
                        {unitTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                    Notes
                </label>
                <textarea
                    value={formData.notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value || null)}
                    className={textareaClass}
                    placeholder="Additional notes..."
                    disabled={isLoading}
                />
            </div>

            {/* Brand & USDA ID */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                        Brand
                    </label>
                    <input
                        type="text"
                        value={formData.brand || ''}
                        onChange={(e) => handleChange('brand', e.target.value || null)}
                        className={inputClass}
                        placeholder="Brand name"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                        USDA ID
                    </label>
                    <input
                        type="text"
                        value={formData.usdaId || ''}
                        onChange={(e) => handleChange('usdaId', e.target.value || null)}
                        className={inputClass}
                        placeholder="USDA ID"
                        disabled={isLoading}
                    />
                </div>
            </div>

            {/* Shelf Life */}
            <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                    Typical Shelf Life (Days)
                </label>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Pantry</label>
                        <input
                            type="number"
                            value={formData.typicalShelfLifeDays_Pantry ?? ''}
                            onChange={(e) => handleNumberChange('typicalShelfLifeDays_Pantry', e.target.value)}
                            className={inputClass}
                            placeholder="Days"
                            min={0}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Fridge</label>
                        <input
                            type="number"
                            value={formData.typicalShelfLifeDays_Fridge ?? ''}
                            onChange={(e) => handleNumberChange('typicalShelfLifeDays_Fridge', e.target.value)}
                            className={inputClass}
                            placeholder="Days"
                            min={0}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Freezer</label>
                        <input
                            type="number"
                            value={formData.typicalShelfLifeDays_Freezer ?? ''}
                            onChange={(e) => handleNumberChange('typicalShelfLifeDays_Freezer', e.target.value)}
                            className={inputClass}
                            placeholder="Days"
                            min={0}
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>
        </UpdateDetailsModal>
    );
}


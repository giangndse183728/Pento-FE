'use client';

import React, { useState } from 'react';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { CusButton } from '@/components/ui/cusButton';
import { toast } from 'sonner';
import { useCreateFoodReference } from '../hooks/useFoodReferences';
import type { CreateFoodReferenceInput } from '../schema/foodReferenceSchema';

type Props = {
    onClose: () => void;
    onSuccess?: () => void;
};

const foodGroups = [
    { id: 1, name: 'Meat' },
    { id: 2, name: 'Seafood' },
    { id: 3, name: 'Fruits & Vegetables' },
    { id: 4, name: 'Dairy' },
    { id: 5, name: 'Cereal, Grains & Pasta' },
    { id: 6, name: 'Legumes, Nuts & Seeds' },
    { id: 7, name: 'Fats & Oils' },
    { id: 8, name: 'Confectionery' },
    { id: 9, name: 'Beverages' },
    { id: 10, name: 'Condiments' },
    { id: 11, name: 'Mixed Dishes' },
];

const unitTypes = ['Weight', 'Volume', 'Count', 'Length'];

export default function FoodRefCreateModal({ onClose, onSuccess }: Props) {
    const createMutation = useCreateFoodReference();

    const [formData, setFormData] = useState<CreateFoodReferenceInput>({
        name: '',
        foodGroup: null,
        notes: null,
        foodCategoryId: null,
        brand: null,
        barcode: null,
        usdaId: null,
        typicalShelfLifeDays_Pantry: null,
        typicalShelfLifeDays_Fridge: null,
        typicalShelfLifeDays_Freezer: null,
        imageUrl: null,
        unitType: null,
    });

    const isLoading = createMutation.isPending;

    const inputClass = 'neomorphic-input w-full';
    const selectClass = 'neomorphic-select w-full';
    const textareaClass = 'neomorphic-textarea w-full min-h-[80px]';

    const handleChange = (field: keyof CreateFoodReferenceInput, value: string | number | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNumberChange = (field: keyof CreateFoodReferenceInput, value: string) => {
        const num = value === '' ? null : parseInt(value, 10);
        handleChange(field, isNaN(num as number) ? null : num);
    };

    const handleCreate = async () => {
        if (!formData.name?.trim()) {
            toast.error('Name is required');
            return;
        }

        try {
            await createMutation.mutateAsync(formData);

            toast.success('Food reference created successfully');
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error('Failed to create food reference', err);
            const error = err as Record<string, unknown>;
            const errorData = (error?.response as Record<string, unknown>)?.data as Record<string, unknown>;
            toast.error((errorData?.detail as string) || 'Failed to create food reference');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <WhiteCard className="w-full max-w-2xl bg-white/95" width="100%" height="auto">
                <div className="space-y-6 max-h-[80vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold" style={{ color: '#113F67' }}>
                            Create Food Reference
                        </h2>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                                Name *
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
                                        <option key={group.id} value={group.name}>{group.name}</option>
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

                        {/* Brand & Barcode */}
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
                                    Barcode
                                </label>
                                <input
                                    type="text"
                                    value={formData.barcode || ''}
                                    onChange={(e) => handleChange('barcode', e.target.value || null)}
                                    className={inputClass}
                                    placeholder="Barcode"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Shelf Life */}
                        <div>
                            <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                                Shelf Life (days)
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Pantry</label>
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
                                    <label className="text-xs text-gray-500 block mb-1">Fridge</label>
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
                                    <label className="text-xs text-gray-500 block mb-1">Freezer</label>
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

                        {/* Image URL */}
                        <div>
                            <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                                Image URL
                            </label>
                            <input
                                type="url"
                                value={formData.imageUrl || ''}
                                onChange={(e) => handleChange('imageUrl', e.target.value || null)}
                                className={inputClass}
                                placeholder="https://..."
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t" style={{ borderColor: '#D6E6F2' }}>
                        <CusButton
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            variant="pastelRed"
                        >
                            Cancel
                        </CusButton>
                        <CusButton
                            type="button"
                            onClick={handleCreate}
                            disabled={isLoading}
                            variant="blueGray"
                        >
                            {isLoading ? 'Creating...' : 'Create'}
                        </CusButton>
                    </div>
                </div>
            </WhiteCard>
        </div>
    );
}

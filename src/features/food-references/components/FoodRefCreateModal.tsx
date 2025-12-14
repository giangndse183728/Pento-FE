'use client';

import React, { useState } from 'react';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { CusButton } from '@/components/ui/cusButton';
import { Combobox } from '@/components/ui/Combobox';
import ElasticSlider from '@/components/decoration/ElasticSlider';
import { toast } from 'sonner';
import { useCreateFoodReference } from '../hooks/useFoodReferences';
import type { CreateFoodReferenceInput } from '../schema/foodReferenceSchema';
import { CircleMinus, CirclePlus } from 'lucide-react';

type Props = {
    onClose: () => void;
    onSuccess?: () => void;
};

const foodGroupOptions = [
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

const unitTypeOptions = [
    { value: 'Weight', label: 'Weight' },
    { value: 'Volume', label: 'Volume' },
    { value: 'Count', label: 'Count' },
    { value: 'Length', label: 'Length' },
];

export default function FoodRefCreateModal({ onClose, onSuccess }: Props) {
    const createMutation = useCreateFoodReference();

    const [formData, setFormData] = useState<CreateFoodReferenceInput>({
        name: '',
        foodGroup: null,
        notes: null,
        foodCategoryId: null,
        brand: null,
        barcode: null,
        usdaId: '',
        typicalShelfLifeDays_Pantry: null,
        typicalShelfLifeDays_Fridge: null,
        typicalShelfLifeDays_Freezer: null,
        imageUrl: null,
        unitType: null,
    });

    const isLoading = createMutation.isPending;

    const inputClass = 'neomorphic-input w-full';
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

        // Clean up empty strings to null for optional fields, except usdaId which accepts empty string
        const payload = {
            ...formData,
            usdaId: formData.usdaId?.trim() || 'N/A',
            brand: formData.brand?.trim() || null,
            barcode: formData.barcode?.trim() || null,
            notes: formData.notes?.trim() || null,
            imageUrl: formData.imageUrl?.trim() || null,
        };

        try {
            await createMutation.mutateAsync(payload);

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
            <WhiteCard className="w-full max-w-4xl bg-white/95" width="100%" height="auto">
                <div className="space-y-6 max-h-[85vh] overflow-y-auto">
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

                    {/* Form - 2 Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            {/* SECTION: Basic Info */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#226597' }}>
                                        Basic Info
                                    </h3>
                                    <div className="flex-1 h-px bg-gradient-to-r from-[#D6E6F2] to-transparent"></div>
                                </div>

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
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                                            Food Group
                                        </label>
                                        <Combobox
                                            options={foodGroupOptions}
                                            value={formData.foodGroup}
                                            onChange={(value) => handleChange('foodGroup', value)}
                                            placeholder="Select food group..."
                                            searchPlaceholder="Search food groups..."
                                            emptyText="No food group found."
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                                            Unit Type
                                        </label>
                                        <Combobox
                                            options={unitTypeOptions}
                                            value={formData.unitType}
                                            onChange={(value) => handleChange('unitType', value)}
                                            placeholder="Select unit type..."
                                            searchPlaceholder="Search unit types..."
                                            emptyText="No unit type found."
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION: Details */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#226597' }}>
                                        Details
                                    </h3>
                                    <div className="flex-1 h-px bg-gradient-to-r from-[#D6E6F2] to-transparent"></div>
                                </div>

                                {/* Brand */}
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

                                {/* Barcode & USDA ID */}
                                <div className="grid grid-cols-2 gap-3">
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
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* SECTION: Image */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#226597' }}>
                                        Image
                                    </h3>
                                    <div className="flex-1 h-px bg-gradient-to-r from-[#D6E6F2] to-transparent"></div>
                                </div>

                                <div className="card" style={{ height: "240px" }}>
                                    <div className="tools" style={{ padding: "8px 10px" }}>
                                        <div className="circle">
                                            <span className="red box"></span>
                                        </div>
                                        <div className="circle">
                                            <span className="yellow box"></span>
                                        </div>
                                        <div className="circle">
                                            <span className="green box"></span>
                                        </div>
                                        <input
                                            type="text"
                                            className="address-bar"
                                            placeholder="https://example.com/image.jpg"
                                            value={formData.imageUrl || ''}
                                            onChange={(e) => handleChange('imageUrl', e.target.value || null)}
                                            autoComplete="off"
                                            disabled={isLoading}
                                            style={{ fontSize: "12px", padding: "4px 8px" }}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            height: "130px",
                                            overflow: "hidden",
                                            borderRadius: "8px",
                                            position: "relative",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            margin: "0 10px",
                                        }}
                                    >
                                        {formData.imageUrl && formData.imageUrl.trim() !== "" ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={formData.imageUrl}
                                                alt="Food preview"
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "100%",
                                                    objectFit: "contain",
                                                    borderRadius: "8px",
                                                }}
                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                            />
                                        ) : (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src="/assets/img/placeholder.jpg"
                                                alt="Placeholder"
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "100%",
                                                    objectFit: "contain",
                                                    borderRadius: "8px",
                                                    opacity: 0.5,
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div className="flex justify-center items-center text-xs text-gray-500 italic" style={{ padding: "6px 0" }}>
                                        Food Reference Image
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#226597' }}>
                                        Notes
                                    </h3>
                                    <div className="flex-1 h-px bg-gradient-to-r from-[#D6E6F2] to-transparent"></div>
                                </div>
                                <textarea
                                    value={formData.notes || ''}
                                    onChange={(e) => handleChange('notes', e.target.value || null)}
                                    className={textareaClass}
                                    placeholder="Additional notes..."
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* ═══════════════════════════════════════════════════════════════════ */}
                        {/* FULL WIDTH - Shelf Life */}
                        {/* ═══════════════════════════════════════════════════════════════════ */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-center gap-3">
                                <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#226597' }}>
                                    Shelf Life
                                </h3>
                                <div className="flex-1 h-px bg-gradient-to-r from-[#D6E6F2] to-transparent"></div>
                            </div>

                            <div className="grid grid-cols-3 gap-8">
                                <div>
                                    <label className="text-sm font-semibold mb-3 block" style={{ color: '#113F67' }}>
                                        Pantry
                                    </label>
                                    <div className="flex gap-2 items-center">
                                        <button
                                            type="button"
                                            onClick={() => handleChange('typicalShelfLifeDays_Pantry', Math.max(0, (formData.typicalShelfLifeDays_Pantry ?? 0) - 1))}
                                            className="p-1 hover:scale-110 transition-transform flex-shrink-0"
                                            disabled={isLoading}
                                        >
                                            <CircleMinus className="w-4 h-4" style={{ color: '#113F67' }} />
                                        </button>
                                        <div className="flex-1">
                                            <ElasticSlider
                                                defaultValue={formData.typicalShelfLifeDays_Pantry ?? 0}
                                                startingValue={0}
                                                maxValue={365}
                                                isStepped={true}
                                                stepSize={1}
                                                leftIcon={<span />}
                                                rightIcon={<span />}
                                                valueSuffix=" days"
                                                onChange={(value) => handleChange('typicalShelfLifeDays_Pantry', value)}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleChange('typicalShelfLifeDays_Pantry', Math.min(365, (formData.typicalShelfLifeDays_Pantry ?? 0) + 1))}
                                            className="p-1 hover:scale-110 transition-transform flex-shrink-0"
                                            disabled={isLoading}
                                        >
                                            <CirclePlus className="w-4 h-4" style={{ color: '#113F67' }} />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold mb-3 block" style={{ color: '#113F67' }}>
                                        Fridge
                                    </label>
                                    <div className="flex gap-2 items-center">
                                        <button
                                            type="button"
                                            onClick={() => handleChange('typicalShelfLifeDays_Fridge', Math.max(0, (formData.typicalShelfLifeDays_Fridge ?? 0) - 1))}
                                            className="p-1 hover:scale-110 transition-transform flex-shrink-0"
                                            disabled={isLoading}
                                        >
                                            <CircleMinus className="w-4 h-4" style={{ color: '#113F67' }} />
                                        </button>
                                        <div className="flex-1">
                                            <ElasticSlider
                                                defaultValue={formData.typicalShelfLifeDays_Fridge ?? 0}
                                                startingValue={0}
                                                maxValue={90}
                                                isStepped={true}
                                                stepSize={1}
                                                leftIcon={<span />}
                                                rightIcon={<span />}
                                                valueSuffix=" days"
                                                onChange={(value) => handleChange('typicalShelfLifeDays_Fridge', value)}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleChange('typicalShelfLifeDays_Fridge', Math.min(90, (formData.typicalShelfLifeDays_Fridge ?? 0) + 1))}
                                            className="p-1 hover:scale-110 transition-transform flex-shrink-0"
                                            disabled={isLoading}
                                        >
                                            <CirclePlus className="w-4 h-4" style={{ color: '#113F67' }} />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold mb-3 block" style={{ color: '#113F67' }}>
                                        Freezer
                                    </label>
                                    <div className="flex gap-2 items-center">
                                        <button
                                            type="button"
                                            onClick={() => handleChange('typicalShelfLifeDays_Freezer', Math.max(0, (formData.typicalShelfLifeDays_Freezer ?? 0) - 1))}
                                            className="p-1 hover:scale-110 transition-transform flex-shrink-0"
                                            disabled={isLoading}
                                        >
                                            <CircleMinus className="w-4 h-4" style={{ color: '#113F67' }} />
                                        </button>
                                        <div className="flex-1">
                                            <ElasticSlider
                                                defaultValue={formData.typicalShelfLifeDays_Freezer ?? 0}
                                                startingValue={0}
                                                maxValue={365}
                                                isStepped={true}
                                                stepSize={1}
                                                leftIcon={<span />}
                                                rightIcon={<span />}
                                                valueSuffix=" days"
                                                onChange={(value) => handleChange('typicalShelfLifeDays_Freezer', value)}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleChange('typicalShelfLifeDays_Freezer', Math.min(365, (formData.typicalShelfLifeDays_Freezer ?? 0) + 1))}
                                            className="p-1 hover:scale-110 transition-transform flex-shrink-0"
                                            disabled={isLoading}
                                        >
                                            <CirclePlus className="w-4 h-4" style={{ color: '#113F67' }} />
                                        </button>
                                    </div>
                                </div>
                            </div>
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

'use client';

import React, { useState, useEffect } from 'react';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { CusButton } from '@/components/ui/cusButton';
import { toast } from 'sonner';
import { useFoodReferenceById, useUpdateFoodReference, useUploadFoodReferenceImage } from '../hooks/useFoodReferences';
import type { UpdateFoodReferenceInput } from '../schema/foodReferenceSchema';
import { ImageUp } from 'lucide-react';
import '@/styles/toggle.css';

type Props = {
    foodRefId: string;
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

export default function FoodRefEditModal({ foodRefId, onClose, onSuccess }: Props) {
    const { data, isLoading: isLoadingData, refetch } = useFoodReferenceById(foodRefId);
    const updateMutation = useUpdateFoodReference();
    const uploadImageMutation = useUploadFoodReferenceImage();

    const [formData, setFormData] = useState<UpdateFoodReferenceInput>({
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

    const [uploadImageUrl, setUploadImageUrl] = useState('');

    useEffect(() => {
        if (data) {
            setFormData({
                name: data.name,
                foodGroup: data.foodGroup || null,
                notes: data.notes || null,
                foodCategoryId: data.foodCategoryId || null,
                brand: data.brand || null,
                barcode: data.barcode || null,
                usdaId: data.usdaId || null,
                typicalShelfLifeDays_Pantry: data.typicalShelfLifeDays_Pantry || null,
                typicalShelfLifeDays_Fridge: data.typicalShelfLifeDays_Fridge || null,
                typicalShelfLifeDays_Freezer: data.typicalShelfLifeDays_Freezer || null,
                imageUrl: data.imageUrl || null,
                unitType: data.unitType || null,
            });
        }
    }, [data]);

    const isLoading = isLoadingData || updateMutation.isPending || uploadImageMutation.isPending;

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

    const handleUploadImage = async () => {
        if (!uploadImageUrl.trim()) {
            toast.error('Please enter an image URL to upload');
            return;
        }

        try {
            await uploadImageMutation.mutateAsync({
                id: foodRefId,
                payload: { imageUri: uploadImageUrl.trim() },
            });

            toast.success('Image uploaded successfully');
            setUploadImageUrl('');
            // Refetch to get the updated imageUrl
            refetch();
        } catch (err) {
            console.error('Failed to upload image', err);
            const error = err as Record<string, unknown>;
            const errorData = (error?.response as Record<string, unknown>)?.data as Record<string, unknown>;
            toast.error((errorData?.detail as string) || 'Failed to upload image');
        }
    };

    const handleSave = async () => {
        if (!formData.name?.trim()) {
            toast.error('Name is required');
            return;
        }

        try {
            // Send all fields - backend requires notes/foodCategoryId to have values
            const cleanPayload = {
                name: formData.name?.trim() || '',
                foodGroup: formData.foodGroup || null,
                notes: formData.notes || '', // Backend requires non-null
                foodCategoryId: formData.foodCategoryId ?? 1, // Backend requires non-null
                brand: formData.brand || null,
                barcode: formData.barcode || null,
                usdaId: formData.usdaId || null,
                typicalShelfLifeDays_Pantry: formData.typicalShelfLifeDays_Pantry ?? null,
                typicalShelfLifeDays_Fridge: formData.typicalShelfLifeDays_Fridge ?? null,
                typicalShelfLifeDays_Freezer: formData.typicalShelfLifeDays_Freezer ?? null,
                imageUrl: formData.imageUrl?.trim() || null,
                unitType: formData.unitType || null,
            };

            console.log('Sending payload:', cleanPayload);

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
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <WhiteCard className="w-full max-w-2xl" width="100%" height="auto">
                    <div className="text-center py-12 text-gray-500">
                        Loading...
                    </div>
                </WhiteCard>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <WhiteCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" width="100%" height="auto">
                <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: '#D6E6F2' }}>
                        <h2 className="text-xl font-semibold" style={{ color: '#113F67' }}>
                            Edit Food Reference
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

                        {/* USDA ID & Food Category ID */}
                        <div className="grid grid-cols-2 gap-4">
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
                            <div>
                                <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                                    Food Category ID
                                </label>
                                <input
                                    type="number"
                                    value={formData.foodCategoryId ?? ''}
                                    onChange={(e) => handleNumberChange('foodCategoryId', e.target.value)}
                                    className={inputClass}
                                    placeholder="Category ID"
                                    min={0}
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

                        {/* Current Image URL (Read-only display) */}
                        {data?.imageUrl && (
                            <div>
                                <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                                    Current Image
                                </label>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <img
                                        src={data.imageUrl}
                                        alt="Current"
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <span className="text-sm text-gray-500 truncate flex-1">
                                        {data.imageUrl}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Upload Image Section */}
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                                Upload New Image
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    value={uploadImageUrl}
                                    onChange={(e) => setUploadImageUrl(e.target.value)}
                                    className={inputClass}
                                    placeholder="https://example.com/image.jpg"
                                    disabled={isLoading}
                                />
                                <CusButton
                                    type="button"
                                    onClick={handleUploadImage}
                                    disabled={isLoading || !uploadImageUrl.trim()}
                                    variant="blueGray"
                                    className="flex items-center gap-2 whitespace-nowrap"
                                >
                                    <ImageUp className="w-4 h-4" />
                                    {uploadImageMutation.isPending ? 'Uploading...' : 'Upload'}
                                </CusButton>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Paste an image URL and click Upload to update the food reference image.
                            </p>
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
                            onClick={handleSave}
                            disabled={isLoading}
                            variant="blueGray"
                        >
                            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </CusButton>
                    </div>
                </div>
            </WhiteCard>
        </div>
    );
}

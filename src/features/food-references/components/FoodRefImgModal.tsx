'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CusButton } from '@/components/ui/cusButton';
import { toast } from 'sonner';
import { useUploadFoodReferenceImage, useFoodReferenceById } from '../hooks/useFoodReferences';
import { ImagePlus } from 'lucide-react';

type Props = {
    foodRefId: string;
    onClose: () => void;
    onSuccess?: () => void;
};

export default function FoodRefImgModal({ foodRefId, onClose, onSuccess }: Props) {
    const { data, isLoading: isLoadingData } = useFoodReferenceById(foodRefId);
    const uploadImageMutation = useUploadFoodReferenceImage();

    const [imageUrl, setImageUrl] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const isLoading = isLoadingData || uploadImageMutation.isPending;

    const handleUpload = async () => {
        if (!imageUrl.trim()) {
            toast.error('Please enter an image URL');
            return;
        }

        try {
            await uploadImageMutation.mutateAsync({
                id: foodRefId,
                payload: { imageUri: imageUrl.trim() },
            });

            toast.success('Image uploaded successfully');
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error('Failed to upload image', err);
            const error = err as Record<string, unknown>;
            const errorData = (error?.response as Record<string, unknown>)?.data as Record<string, unknown>;
            toast.error((errorData?.detail as string) || 'Failed to upload image');
        }
    };

    if (!mounted) return null;

    const modalContent = (
        <div
            className="fixed inset-0 bg-black/20 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
        >
            <div
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 font-primary"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ImagePlus className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold" style={{ color: '#113F67' }}>
                                    Upload Image
                                </h2>
                                {data?.name && (
                                    <p className="text-sm text-gray-500">
                                        for {data.name}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Current Image Preview */}
                    {data?.imageUrl && (
                        <div>
                            <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                                Current Image
                            </label>
                            <div className="border-2 border-dashed rounded-lg p-4 text-center" style={{ borderColor: '#D6E6F2' }}>
                                <img
                                    src={data.imageUrl}
                                    alt={data.name || 'Current'}
                                    className="max-h-32 mx-auto object-contain"
                                />
                            </div>
                        </div>
                    )}

                    {/* Image URL Input */}
                    <div>
                        <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                            New Image URL
                        </label>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="neomorphic-input w-full"
                            placeholder="https://example.com/image.jpg"
                            disabled={isLoading}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Paste the URL of the image you want to upload
                        </p>
                    </div>

                    {/* Preview New Image */}
                    {imageUrl.trim() && (
                        <div>
                            <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                                Preview
                            </label>
                            <div className="border-2 border-dashed rounded-lg p-4 text-center" style={{ borderColor: '#93C5FD' }}>
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="max-h-32 mx-auto object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                    onLoad={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'block';
                                    }}
                                />
                            </div>
                        </div>
                    )}

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
                            onClick={handleUpload}
                            disabled={isLoading || !imageUrl.trim()}
                            variant="blueGray"
                        >
                            {uploadImageMutation.isPending ? 'Uploading...' : 'Upload Image'}
                        </CusButton>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}

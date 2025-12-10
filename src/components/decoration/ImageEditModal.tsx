'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CusButton } from '@/components/ui/cusButton';
import Image from 'next/image';
import { toast } from 'sonner';

const DEFAULT_SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export type ImageModalButton = {
    label: string;
    onClick?: () => void;
    variant?: 'blue' | 'blueGray' | 'darkBlue' | 'green' | 'red' | 'pastelRed' | 'purple' | 'orange' | 'gray';
    disabled?: boolean;
    isConfirm?: boolean; // Special flag for the confirm button that receives the file
};

type Props = {
    title?: string;
    label?: string;
    currentImage: string | null;
    onImageSelect: (file: File) => void;
    onClose: () => void;
    isLoading?: boolean;
    supportedTypes?: string[];
    buttons?: ImageModalButton[];
    confirmLabel?: string;
    cancelLabel?: string;
    uploadLabel?: string;
    changeLabel?: string;
    placeholderText?: string;
    maxWidth?: string;
    imageSize?: number;
};

export default function ImageEditModal({
    title = 'Choose Image',
    label = 'Image',
    currentImage,
    onImageSelect,
    onClose,
    isLoading = false,
    supportedTypes = DEFAULT_SUPPORTED_IMAGE_TYPES,
    buttons,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    uploadLabel = 'Click to upload',
    changeLabel = 'Change Image',
    placeholderText,
    maxWidth = 'max-w-md',
    imageSize = 120,
}: Props) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(currentImage);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!supportedTypes.includes(file.type)) {
            const typeNames = supportedTypes.map(t => t.replace('image/', '').toUpperCase()).join(', ');
            toast.error(`Invalid file type. Please upload ${typeNames} images only.`);
            return;
        }

        setImageFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleConfirm = () => {
        if (imageFile) {
            onImageSelect(imageFile);
            onClose();
        }
    };

    // Generate accept string for file input
    const acceptString = supportedTypes.join(',');

    // Generate supported types display text
    const supportedTypesText = placeholderText || supportedTypes.map(t => t.replace('image/', '').toUpperCase()).join(', ');

    // Default buttons if none provided
    const defaultButtons: ImageModalButton[] = [
        {
            label: cancelLabel,
            onClick: onClose,
            variant: 'pastelRed',
        },
        {
            label: confirmLabel,
            variant: 'blueGray',
            disabled: !imageFile,
            isConfirm: true,
        },
    ];

    const actionButtons = buttons || defaultButtons;

    if (!mounted) return null;

    const modalContent = (
        <div
            className="fixed inset-0 bg-black/20 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
        >
            <div
                className={`w-full ${maxWidth} bg-white rounded-2xl shadow-2xl p-6 font-primary`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold" style={{ color: '#113F67' }}>
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                            {label}
                        </label>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center" style={{ borderColor: '#D6E6F2' }}>
                            {imagePreview ? (
                                <div className="flex flex-col items-center gap-4">
                                    <Image
                                        src={imagePreview}
                                        alt="Image preview"
                                        width={imageSize}
                                        height={imageSize}
                                        className="object-contain"
                                    />
                                    <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                                        {changeLabel}
                                        <input
                                            type="file"
                                            accept={acceptString}
                                            onChange={handleImageChange}
                                            className="hidden"
                                            disabled={isLoading}
                                        />
                                    </label>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <label className="cursor-pointer">
                                        <span className="text-sm font-medium" style={{ color: '#113F67' }}>
                                            {uploadLabel}
                                        </span>
                                        <input
                                            type="file"
                                            accept={acceptString}
                                            onChange={handleImageChange}
                                            className="hidden"
                                            disabled={isLoading}
                                        />
                                    </label>
                                    <p className="text-xs text-gray-500">{supportedTypesText}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t" style={{ borderColor: '#D6E6F2' }}>
                        {actionButtons.map((button, index) => (
                            <CusButton
                                key={index}
                                type="button"
                                onClick={button.isConfirm ? handleConfirm : button.onClick}
                                disabled={button.disabled || isLoading}
                                variant={button.variant || 'blueGray'}
                            >
                                {button.label}
                            </CusButton>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}


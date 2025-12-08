'use client';

import React, { useState } from 'react';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { CusButton } from '@/components/ui/cusButton';
import Image from 'next/image';
import { toast } from 'sonner';

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

type Props = {
    currentIcon: string | null;
    onIconSelect: (file: File) => void;
    onClose: () => void;
};

export default function IconsEditModal({ currentIcon, onIconSelect, onClose }: Props) {
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(currentIcon);

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
            toast.error('Invalid file type. Please upload JPEG, PNG, WebP, or GIF images only.');
            return;
        }

        setIconFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setIconPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleConfirm = () => {
        if (iconFile) {
            onIconSelect(iconFile);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <WhiteCard className="w-full max-w-md bg-white/90" width="100%" height="auto">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold" style={{ color: '#113F67' }}>
                            Choose Icon
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Icon Upload */}
                    <div>
                        <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                            Achievement Icon
                        </label>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center" style={{ borderColor: '#D6E6F2' }}>
                            {iconPreview ? (
                                <div className="flex flex-col items-center gap-4">
                                    <Image
                                        src={iconPreview}
                                        alt="Icon preview"
                                        width={120}
                                        height={120}
                                        className="object-contain"
                                    />
                                    <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                                        Change Icon
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/gif"
                                            onChange={handleIconChange}
                                            className="hidden"
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
                                            Click to upload
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/gif"
                                            onChange={handleIconChange}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-xs text-gray-500">JPEG, PNG, WebP, GIF</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t" style={{ borderColor: '#D6E6F2' }}>
                        <CusButton
                            type="button"
                            onClick={onClose}
                            variant="pastelRed"
                        >
                            Cancel
                        </CusButton>
                        <CusButton
                            type="button"
                            onClick={handleConfirm}
                            disabled={!iconFile}
                            variant="blueGray"
                        >
                            Confirm
                        </CusButton>
                    </div>
                </div>
            </WhiteCard>
        </div>
    );
}

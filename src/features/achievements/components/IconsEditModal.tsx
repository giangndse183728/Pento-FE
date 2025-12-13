'use client';

import React from 'react';
import ImageEditModal from '@/components/decoration/ImageEditModal';

type Props = {
    currentIcon: string | null;
    onIconSelect: (file: File) => void;
    onClose: () => void;
};

export default function IconsEditModal({ currentIcon, onIconSelect, onClose }: Props) {
    return (
        <ImageEditModal
            title="Choose Icon"
            label="Achievement Icon"
            currentImage={currentIcon}
            onImageSelect={onIconSelect}
            onClose={onClose}
            confirmLabel="Confirm"
            cancelLabel="Cancel"
            changeLabel="Change Icon"
        />
    );
}


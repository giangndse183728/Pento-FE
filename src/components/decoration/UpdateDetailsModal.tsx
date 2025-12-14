'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { CusButton } from '@/components/ui/cusButton';

// Field types for the modal
export type FieldType = 'text' | 'textarea' | 'toggle' | 'select' | 'number' | 'email' | 'password';

export type SelectOption = {
    value: string;
    label: string;
};

export type ModalField = {
    name: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    required?: boolean;
    options?: SelectOption[]; // For select type
    toggleLabels?: { on: string; off: string }; // For toggle type
};

export type ModalButton = {
    label: string;
    onClick: () => void;
    variant?: 'blue' | 'blueGray' | 'darkBlue' | 'green' | 'red' | 'pastelRed' | 'purple' | 'orange' | 'gray';
    disabled?: boolean;
    loading?: boolean;
    loadingLabel?: string;
};

type Props<T extends Record<string, unknown>> = {
    title: string;
    fields: ModalField[];
    formData: T;
    onFormChange: (field: keyof T, value: unknown) => void;
    onClose: () => void;
    isLoading?: boolean;
    buttons?: ModalButton[];
    // Default save/cancel buttons if no custom buttons provided
    onSave?: () => void;
    saveLabel?: string;
    cancelLabel?: string;
    maxWidth?: string;
};

export default function UpdateDetailsModal<T extends Record<string, unknown>>({
    title,
    fields,
    formData,
    onFormChange,
    onClose,
    isLoading = false,
    buttons,
    onSave,
    saveLabel = 'Save Changes',
    cancelLabel = 'Cancel',
    maxWidth = 'max-w-2xl',
}: Props<T>) {
    const inputClass = 'neomorphic-input w-full';
    const textareaClass = 'neomorphic-textarea w-full min-h-[96px]';
    const selectClass = 'neomorphic-input w-full';

    const renderField = (field: ModalField) => {
        const value = formData[field.name];

        switch (field.type) {
            case 'text':
            case 'email':
            case 'password':
            case 'number':
                return (
                    <div key={field.name}>
                        <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                            type={field.type}
                            value={(value as string | number) ?? ''}
                            onChange={(e) => onFormChange(field.name as keyof T,
                                field.type === 'number' ? Number(e.target.value) : e.target.value
                            )}
                            className={inputClass}
                            placeholder={field.placeholder}
                            disabled={isLoading}
                        />
                    </div>
                );

            case 'textarea':
                return (
                    <div key={field.name}>
                        <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <textarea
                            value={(value as string) ?? ''}
                            onChange={(e) => onFormChange(field.name as keyof T, e.target.value)}
                            className={textareaClass}
                            placeholder={field.placeholder}
                            disabled={isLoading}
                        />
                    </div>
                );

            case 'select':
                return (
                    <div key={field.name}>
                        <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <select
                            value={(value as string) ?? ''}
                            onChange={(e) => onFormChange(field.name as keyof T, e.target.value)}
                            className={selectClass}
                            disabled={isLoading}
                        >
                            <option value="">{field.placeholder || 'Select...'}</option>
                            {field.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                );

            case 'toggle':
                const isActive = Boolean(value);
                const toggleLabels = field.toggleLabels || { on: 'Active', off: 'Inactive' };
                return (
                    <div key={field.name} className="flex items-center justify-end gap-3">
                        <span className="font-semibold text-lg" style={{ color: '#113F67' }}>
                            {field.label}:
                        </span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => onFormChange(field.name as keyof T, e.target.checked)}
                                disabled={isLoading}
                            />
                            <span className="slider"></span>
                        </label>
                        <span
                            className="font-semibold text-lg"
                            style={{ color: isActive ? '#67C090' : '#FFA07A' }}
                        >
                            {isActive ? toggleLabels.on : toggleLabels.off}
                        </span>
                    </div>
                );

            default:
                return null;
        }
    };

    // Default buttons if none provided
    const defaultButtons: ModalButton[] = [
        {
            label: cancelLabel,
            onClick: onClose,
            variant: 'pastelRed',
            disabled: isLoading,
        },
        {
            label: saveLabel,
            onClick: onSave || (() => { }),
            variant: 'blueGray',
            disabled: isLoading,
            loading: isLoading,
            loadingLabel: 'Saving...',
        },
    ];

    const actionButtons = buttons || defaultButtons;

    // Portal mounting state
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    const modalContent = (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
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

                    {/* Form Fields */}
                    <div className="space-y-6">
                        {fields.map(renderField)}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t" style={{ borderColor: '#D6E6F2' }}>
                        {actionButtons.map((button, index) => (
                            <CusButton
                                key={index}
                                type="button"
                                onClick={button.onClick}
                                disabled={button.disabled || isLoading}
                                variant={button.variant || 'blueGray'}
                            >
                                {button.loading ? (button.loadingLabel || 'Loading...') : button.label}
                            </CusButton>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}

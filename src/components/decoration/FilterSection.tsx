'use client';

import React from 'react';
import { WhiteCard } from './WhiteCard';
import { CusButton } from '@/components/ui/cusButton';
import '@/styles/radio-button.css';

export interface FilterField {
    type: 'text' | 'select' | 'radio';
    name: string;
    label: string;
    placeholder?: string;
    value: string | boolean | undefined;
    options?: Array<{ value: string; label: string }>;
    onChange: (value: string | boolean | undefined) => void;
}

export interface RadioOption {
    label: string;
    value: string;
    checked: boolean;
    onChange: () => void;
}

interface FilterSectionProps {
    title?: string;
    fields: FilterField[];
    radioGroup?: {
        label: string;
        name: string;
        options: RadioOption[];
    };
    onReset?: () => void;
    resetButtonText?: string;
}

export default function FilterSection(props: FilterSectionProps) {
    const {
        title = 'Filters',
        fields,
        radioGroup,
        onReset,
        resetButtonText = 'Reset Filters',
    } = props;
    return (
        <WhiteCard className="w-full" width="100%" height="auto">
            <div className="space-y-4">
                <h3 className="text-xl font-semibold" style={{ color: '#113F67' }}>
                    {title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {fields.map((field, index) => (
                        <div key={index}>
                            <label className="text-md font-semibold" style={{ color: '#113F67' }}>
                                {field.label}
                            </label>
                            {field.type === 'text' && (
                                <input
                                    type="text"
                                    placeholder={field.placeholder}
                                    value={String(field.value || '')}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className="neomorphic-input w-full h-15"
                                />
                            )}
                            {field.type === 'select' && (
                                <select
                                    value={field.value === undefined ? '' : String(field.value)}
                                    onChange={(e) => {
                                        if (e.target.value === '') {
                                            field.onChange(undefined);
                                        } else if (e.target.value === 'true' || e.target.value === 'false') {
                                            field.onChange(e.target.value === 'true');
                                        } else {
                                            field.onChange(e.target.value);
                                        }
                                    }}
                                    className="neomorphic-select w-full"
                                >
                                    {field.options?.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    ))}
                </div>

                {/* Radio Group and Reset */}
                {(radioGroup || onReset) && (
                    <div className="flex items-end gap-3">
                        {radioGroup && (
                            <div className="flex-1">
                                <label className="text-md font-semibold" style={{ color: '#113F67' }}>
                                    {radioGroup.label}
                                </label>
                                <div className="flex gap-4 mt-2">
                                    {radioGroup.options.map((option, index) => (
                                        <label key={index} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                id={`${radioGroup.name}-${option.value}`}
                                                type="radio"
                                                name={radioGroup.name}
                                                value={option.value}
                                                checked={option.checked}
                                                onChange={option.onChange}
                                                style={{ display: 'none' }}
                                            />
                                            <div className="check">
                                                <svg width="18px" height="18px" viewBox="0 0 18 18">
                                                    <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                                                    <polyline points="1 9 7 14 15 4"></polyline>
                                                </svg>
                                            </div>
                                            <span style={{ color: '#113F67' }}>{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                        {onReset && (
                            <CusButton
                                type="button"
                                onClick={onReset}
                                variant="blueGray"
                                className="mb-0"
                            >
                                {resetButtonText}
                            </CusButton>
                        )}
                    </div>
                )}
            </div>
        </WhiteCard>
    );
}

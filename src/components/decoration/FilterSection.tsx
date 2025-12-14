'use client';

import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { WhiteCard } from './WhiteCard';
import { CusButton } from '@/components/ui/cusButton';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

export interface ComboboxOption {
    value: string;
    label: string;
}

export interface FilterField {
    type: 'text' | 'select' | 'radio' | 'date' | 'combobox';
    name: string;
    label: string;
    placeholder?: string;
    value: string | boolean | undefined;
    options?: Array<{ value: string; label: string }>;
    onChange: (value: string | boolean | undefined) => void;
    loadOptions?: () => Promise<ComboboxOption[]>;
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
    defaultCollapsed?: boolean;
}

function DatePickerField({
    value,
    onChange,
    placeholder
}: {
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
}) {
    const [open, setOpen] = useState(false);
    const selectedDate = value ? new Date(value) : undefined;

    const handleSelect = (date: Date | undefined) => {
        if (date) {
            const formattedDate = format(date, 'yyyy-MM-dd');
            onChange(formattedDate);
        } else {
            onChange(undefined);
        }
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="neomorphic-input w-full h-10 text-sm flex items-center justify-between px-3 text-left"
                >
                    <span className={selectedDate ? 'text-gray-900' : 'text-gray-400'}>
                        {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : (placeholder || 'Select date')}
                    </span>
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}

function ComboboxField({
    value,
    onChange,
    placeholder,
    loadOptions,
}: {
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
    loadOptions?: () => Promise<ComboboxOption[]>;
}) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<ComboboxOption[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (loadOptions) {
            setLoading(true);
            loadOptions()
                .then((opts) => setOptions(opts))
                .catch((err) => console.error('Failed to load combobox options:', err))
                .finally(() => setLoading(false));
        }
    }, [loadOptions]);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    role="combobox"
                    aria-expanded={open}
                    className="neomorphic-input w-full h-10 text-sm flex items-center justify-between px-3 text-left"
                >
                    <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
                        {loading ? 'Loading...' : (selectedOption?.label || placeholder || 'Select...')}
                    </span>
                    <ChevronsUpDown className="h-4 w-4 text-gray-500" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.label}
                                    onSelect={() => {
                                        onChange(option.value === value ? undefined : option.value);
                                        setOpen(false);
                                    }}
                                >
                                    {option.label}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default function FilterSection(props: FilterSectionProps) {
    const {
        title,
        fields,
        radioGroup,
        onReset,
        resetButtonText = 'Reset Filters',
        defaultCollapsed = false,
    } = props;

    return (
        <WhiteCard className="w-full" width="100%" height="auto">
            <Accordion
                type="single"
                collapsible
                defaultValue={defaultCollapsed ? undefined : "filter-content"}
            >
                <AccordionItem value="filter-content" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-0">
                        <h3 className="text-xl font-semibold" style={{ color: '#113F67' }}>
                            {title}
                        </h3>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-0">
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-3 items-end">
                                {fields.map((field, index) => (
                                    <div key={index} className="min-w-[180px] flex-1">
                                        <label className="text-sm font-semibold" style={{ color: '#113F67' }}>
                                            {field.label}
                                        </label>
                                        {field.type === 'text' && (
                                            <input
                                                type="text"
                                                placeholder={field.placeholder}
                                                value={String(field.value || '')}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                className="neomorphic-input w-full h-10 text-sm"
                                            />
                                        )}
                                        {field.type === 'date' && (
                                            <DatePickerField
                                                value={field.value as string | undefined}
                                                onChange={(val) => field.onChange(val)}
                                                placeholder={field.placeholder}
                                            />
                                        )}
                                        {field.type === 'combobox' && (
                                            <ComboboxField
                                                value={field.value as string | undefined}
                                                onChange={(val) => field.onChange(val)}
                                                placeholder={field.placeholder}
                                                loadOptions={field.loadOptions}
                                            />
                                        )}
                                        {field.type === 'select' && (
                                            <select
                                                value={field.value === undefined ? '' : String(field.value)}
                                                onChange={(e) => {
                                                    if (e.target.value === '') {
                                                        field.onChange(undefined);
                                                    } else {
                                                        field.onChange(e.target.value);
                                                    }
                                                }}
                                                className="neomorphic-select w-full h-10 text-sm"
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
                                <div className="flex items-end justify-end gap-3">
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
                                            className="ml-auto"
                                        >
                                            {resetButtonText}
                                        </CusButton>
                                    )}
                                </div>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </WhiteCard>
    );
}

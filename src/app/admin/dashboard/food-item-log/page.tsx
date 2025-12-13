'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import DoubleBarChart from '@/features/admin/components/charts/DoubleBarChart';
import FilterSection, { type FilterField } from '@/components/decoration/FilterSection';
import type { GetFoodItemLogSummaryParams } from '@/features/admin/services/foodItemsLogServices';
import { getUnits } from '@/features/units';

// Default unit names
const DEFAULT_WEIGHT_UNIT = 'Kilogram';
const DEFAULT_VOLUME_UNIT = 'Millilitre';

export default function FoodItemLogPage() {
    // Store default unit IDs
    const defaultUnitsRef = useRef<{ weightUnitId: string; volumeUnitId: string }>({
        weightUnitId: '',
        volumeUnitId: '',
    });

    // Food Item Log Filters
    const [foodFilters, setFoodFilters] = useState({
        fromDate: "",
        toDate: "",
        weightUnitId: "",
        volumeUnitId: "",
        isDeleted: "",
    });

    // Load default units on mount
    useEffect(() => {
        const loadDefaultUnits = async () => {
            const units = await getUnits();
            const kilogram = units.find(u => u.name.toLowerCase() === DEFAULT_WEIGHT_UNIT.toLowerCase());
            const millilitre = units.find(u => u.name.toLowerCase() === DEFAULT_VOLUME_UNIT.toLowerCase());

            const defaultWeight = kilogram?.id || '';
            const defaultVolume = millilitre?.id || '';

            defaultUnitsRef.current = {
                weightUnitId: defaultWeight,
                volumeUnitId: defaultVolume,
            };

            setFoodFilters(prev => ({
                ...prev,
                weightUnitId: defaultWeight,
                volumeUnitId: defaultVolume,
            }));
        };
        loadDefaultUnits();
    }, []);

    // Convert food filter values to proper types for the API
    const foodApiParams: GetFoodItemLogSummaryParams = {
        fromDate: foodFilters.fromDate || undefined,
        toDate: foodFilters.toDate || undefined,
        weightUnitId: foodFilters.weightUnitId || undefined,
        volumeUnitId: foodFilters.volumeUnitId || undefined,
        isDeleted: foodFilters.isDeleted ? foodFilters.isDeleted === "true" : undefined,
    };

    const handleFoodFilterChange = (field: string, value: string | boolean | undefined) => {
        setFoodFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleResetFoodFilters = () => {
        setFoodFilters({
            fromDate: "",
            toDate: "",
            weightUnitId: defaultUnitsRef.current.weightUnitId,
            volumeUnitId: defaultUnitsRef.current.volumeUnitId,
            isDeleted: "",
        });
    };

    // Load weight units for combobox (only type: Weight)
    const loadWeightUnitOptions = useCallback(async () => {
        const units = await getUnits();
        return units
            .filter((unit) => unit.type?.toLowerCase() === 'weight')
            .map((unit) => ({
                value: unit.id,
                label: unit.name,
            }));
    }, []);

    // Load volume units for combobox (only type: Volume)
    const loadVolumeUnitOptions = useCallback(async () => {
        const units = await getUnits();
        return units
            .filter((unit) => unit.type?.toLowerCase() === 'volume')
            .map((unit) => ({
                value: unit.id,
                label: unit.name,
            }));
    }, []);

    const foodFilterFields: FilterField[] = [
        {
            type: 'date',
            name: 'fromDate',
            label: 'Start Date',
            value: foodFilters.fromDate || '',
            onChange: (value) => handleFoodFilterChange('fromDate', value as string),
        },
        {
            type: 'date',
            name: 'toDate',
            label: 'End Date',
            value: foodFilters.toDate || '',
            onChange: (value) => handleFoodFilterChange('toDate', value as string),
        },
        {
            type: 'combobox',
            name: 'weightUnitId',
            label: 'Weight Unit',
            placeholder: 'Select weight unit',
            value: foodFilters.weightUnitId || '',
            onChange: (value) => handleFoodFilterChange('weightUnitId', value as string),
            loadOptions: loadWeightUnitOptions,
        },
        {
            type: 'combobox',
            name: 'volumeUnitId',
            label: 'Volume Unit',
            placeholder: 'Select volume unit',
            value: foodFilters.volumeUnitId || '',
            onChange: (value) => handleFoodFilterChange('volumeUnitId', value as string),
            loadOptions: loadVolumeUnitOptions,
        },
        {
            type: 'select',
            name: 'isDeleted',
            label: 'Status',
            value: foodFilters.isDeleted || '',
            options: [
                { value: '', label: 'All' },
                { value: 'false', label: 'Active' },
                { value: 'true', label: 'Deleted' },
            ],
            onChange: (value) => handleFoodFilterChange('isDeleted', value as string),
        },
    ];

    return (
        <AdminLayout>
            <div className="w-full space-y-6">
                <h1 className="text-2xl font-bold" style={{ color: '#113F67' }}>
                    Food Item Log
                </h1>
                <FilterSection
                    title="Food Item Filters"
                    fields={foodFilterFields}
                    onReset={handleResetFoodFilters}
                    resetButtonText="Clear All"
                    defaultCollapsed={true}
                />
                <DoubleBarChart params={foodApiParams} />
            </div>
        </AdminLayout>
    );
}



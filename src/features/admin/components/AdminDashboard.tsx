'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import ShareDataSetChart from './charts/ShareDataSetChart';
import DoubleBarChart from './charts/DoubleBarChart';
import FilterSection, { type FilterField } from '@/components/decoration/FilterSection';
import type { TimeWindow } from '../services/paymentService';
import type { GetFoodItemLogSummaryParams } from '../services/foodItemsLogServices';
import { getSubscriptions } from '@/features/subscription/services/subscriptionService';
import { getUnits } from '@/features/units';

// Default unit names
const DEFAULT_WEIGHT_UNIT = 'Kilogram';
const DEFAULT_VOLUME_UNIT = 'Millilitre';

const Dashboard = () => {
    // Store default unit IDs
    const defaultUnitsRef = useRef<{ weightUnitId: string; volumeUnitId: string }>({
        weightUnitId: '',
        volumeUnitId: '',
    });

    // Subscription Payment Filters
    const [paymentFilters, setPaymentFilters] = useState({
        subscriptionIds: "",
        fromDate: "",
        toDate: "",
        isActive: "",
        isDeleted: "",
        timeWindow: "",
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

    // Convert payment filter values to proper types for the API
    const paymentApiParams = {
        subscriptionIds: paymentFilters.subscriptionIds ? paymentFilters.subscriptionIds.split(',').filter(Boolean) : undefined,
        fromDate: paymentFilters.fromDate || undefined,
        toDate: paymentFilters.toDate || undefined,
        isActive: paymentFilters.isActive ? paymentFilters.isActive === "true" : undefined,
        isDeleted: paymentFilters.isDeleted ? paymentFilters.isDeleted === "true" : undefined,
        timeWindow: (paymentFilters.timeWindow as TimeWindow) || undefined,
    };

    // Convert food filter values to proper types for the API
    const foodApiParams: GetFoodItemLogSummaryParams = {
        fromDate: foodFilters.fromDate || undefined,
        toDate: foodFilters.toDate || undefined,
        weightUnitId: foodFilters.weightUnitId || undefined,
        volumeUnitId: foodFilters.volumeUnitId || undefined,
        isDeleted: foodFilters.isDeleted ? foodFilters.isDeleted === "true" : undefined,
    };

    const handlePaymentFilterChange = (field: string, value: string | boolean | undefined) => {
        setPaymentFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleFoodFilterChange = (field: string, value: string | boolean | undefined) => {
        setFoodFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleResetPaymentFilters = () => {
        setPaymentFilters({
            subscriptionIds: "",
            fromDate: "",
            toDate: "",
            isActive: "",
            isDeleted: "",
            timeWindow: "",
        });
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

    // Load subscriptions for combobox
    const loadSubscriptionOptions = useCallback(async () => {
        const subscriptions = await getSubscriptions();
        return subscriptions.map((sub) => ({
            value: sub.id || sub.subscriptionId || '',
            label: sub.name,
        }));
    }, []);

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

    const paymentFilterFields: FilterField[] = [
        {
            type: 'combobox',
            name: 'subscriptionIds',
            label: 'Subscription',
            placeholder: 'Select subscription',
            value: paymentFilters.subscriptionIds || '',
            onChange: (value) => handlePaymentFilterChange('subscriptionIds', value as string),
            loadOptions: loadSubscriptionOptions,
        },
        {
            type: 'date',
            name: 'fromDate',
            label: 'Start Date',
            value: paymentFilters.fromDate || '',
            onChange: (value) => handlePaymentFilterChange('fromDate', value as string),
        },
        {
            type: 'date',
            name: 'toDate',
            label: 'End Date',
            value: paymentFilters.toDate || '',
            onChange: (value) => handlePaymentFilterChange('toDate', value as string),
        },
        {
            type: 'select',
            name: 'timeWindow',
            label: 'Period',
            value: paymentFilters.timeWindow || '',
            options: [
                { value: '', label: 'All' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'yearly', label: 'Yearly' },
            ],
            onChange: (value) => handlePaymentFilterChange('timeWindow', value as string),
        },
        {
            type: 'select',
            name: 'isActive',
            label: 'Status',
            value: paymentFilters.isActive || '',
            options: [
                { value: '', label: 'All' },
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
            ],
            onChange: (value) => handlePaymentFilterChange('isActive', value as string),
        },
        {
            type: 'select',
            name: 'isDeleted',
            label: 'Visibility',
            value: paymentFilters.isDeleted || '',
            options: [
                { value: '', label: 'All' },
                { value: 'false', label: 'Visible' },
                { value: 'true', label: 'Deleted' },
            ],
            onChange: (value) => handlePaymentFilterChange('isDeleted', value as string),
        },
    ];

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
        <div className="grid grid-cols-1 gap-6 w-full">
            {/* Subscription Payment Section */}
            <FilterSection
                title="Subscription Payment Filters"
                fields={paymentFilterFields}
                onReset={handleResetPaymentFilters}
                resetButtonText="Clear All"
                defaultCollapsed={true}
            />
            <div className="w-full">
                <ShareDataSetChart key={paymentFilters.timeWindow || 'all'} params={paymentApiParams} />
            </div>

            {/* Food Item Log Section */}
            <FilterSection
                title="Food Item Log Filters"
                fields={foodFilterFields}
                onReset={handleResetFoodFilters}
                resetButtonText="Clear All"
                defaultCollapsed={true}
            />
            <div className="w-full">
                <DoubleBarChart params={foodApiParams} />
            </div>
        </div>
    );
}
    ;

export default Dashboard;

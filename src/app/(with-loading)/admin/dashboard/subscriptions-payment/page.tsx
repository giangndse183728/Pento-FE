'use client';

import React, { useState, useCallback } from 'react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import TopDataCards from '@/features/admin/components/TopDataCards';
import ShareDataSetChart from '@/features/admin/components/charts/ShareDataSetChart';
import PaymentTable from '@/features/admin/components/PaymentTable';
import FilterSection, { type FilterField } from '@/components/decoration/FilterSection';
import type { TimeWindow } from '@/features/admin/services/paymentService';
import { getSubscriptions } from '@/features/subscription/services/subscriptionService';
import { usePaymentsForCards } from '@/features/admin/hooks/usePaymentsforCards';

export default function SubscriptionsPaymentPage() {
    // Subscription Payment Filters
    const [paymentFilters, setPaymentFilters] = useState({
        subscriptionIds: "",
        fromDate: "",
        toDate: "",
        isActive: "",
        isDeleted: "",
        timeWindow: "",
    });

    // Convert payment filter values to proper types for the API
    const paymentApiParams = {
        subscriptionIds: paymentFilters.subscriptionIds ? paymentFilters.subscriptionIds.split(',').filter(Boolean) : undefined,
        fromDate: paymentFilters.fromDate || undefined,
        toDate: paymentFilters.toDate || undefined,
        isActive: paymentFilters.isActive ? paymentFilters.isActive === "true" : undefined,
        isDeleted: paymentFilters.isDeleted ? paymentFilters.isDeleted === "true" : undefined,
        timeWindow: (paymentFilters.timeWindow as TimeWindow) || undefined,
    };

    const handlePaymentFilterChange = (field: string, value: string | boolean | undefined) => {
        setPaymentFilters((prev) => ({ ...prev, [field]: value }));
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

    // Load subscriptions for combobox
    const loadSubscriptionOptions = useCallback(async () => {
        const subscriptions = await getSubscriptions();
        return subscriptions.map((sub) => ({
            value: sub.id || sub.subscriptionId || '',
            label: sub.name,
        }));
    }, []);

    // Fetch payment summary for cards
    const { summary: paymentsData } = usePaymentsForCards(paymentApiParams);
    const paymentSummary = paymentsData?.summary ?? null;

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

    return (
        <AdminLayout>
            <div className="w-full space-y-6">
                <h1 className="text-2xl font-bold" style={{ color: '#113F67' }}>
                    Subscriptions Payment
                </h1>

                <FilterSection
                    title="Payment Filters"
                    fields={paymentFilterFields}
                    onReset={handleResetPaymentFilters}
                    resetButtonText="Clear All"
                    defaultCollapsed={true}
                />
                <ShareDataSetChart key={paymentFilters.timeWindow || 'all'} params={paymentApiParams} />
                <PaymentTable />
            </div>
        </AdminLayout>
    );
}



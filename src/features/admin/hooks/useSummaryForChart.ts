"use client";

import { useQuery } from '@tanstack/react-query';
import {
    getAdminPaymentSummary,
    type GetPaymentSummaryParams,
} from '../services/paymentService';

export function useSummaryForCharts(params?: GetPaymentSummaryParams) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['admin-payment-summary', params],
        queryFn: async () => {
            return getAdminPaymentSummary(params);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        payments: data || null,
        loading: isLoading,
        error,
    };
}

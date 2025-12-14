"use client";

import { useQuery } from '@tanstack/react-query';
import {
    getAdminPayments,
    GetPaymentsParams,
} from '../services/paymentService';

export function usePaymentsForCards(params: GetPaymentsParams = {}) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['admin-payments-cards', params],
        queryFn: async () => {
            return getAdminPayments(params);
        },
        staleTime: 0,
    });

    return {
        summary: data || null,
        loading: isLoading,
        error,
    };
}

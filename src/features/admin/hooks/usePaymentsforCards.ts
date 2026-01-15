"use client";

import { useQuery } from '@tanstack/react-query';
import { getAdminPayments } from '../services/paymentService';
import { GetPaymentsParams } from '../schema/paymentSchema';

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

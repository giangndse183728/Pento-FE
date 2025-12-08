"use client";

import { useQuery } from '@tanstack/react-query';
import {
    getAdminPayments,
} from '../services/paymentService';

export function usePaymentsForCards() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['admin-payments-cards'],
        queryFn: async () => {
            return getAdminPayments();
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        summary: data || null,
        loading: isLoading,
        error,
    };
}

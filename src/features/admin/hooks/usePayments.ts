"use client";

import { useQuery } from '@tanstack/react-query';
import {
    getAdminPayments,
    type PaymentItem,
    type GetPaymentsParams,
    type PaymentSummary
} from '../services/paymentService';

export function usePayments(params?: GetPaymentsParams) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['admin-payments', params],
        queryFn: async () => {
            let allItems: PaymentItem[] = [];
            let summary: PaymentSummary | null = null;
            let currentPage = 1;
            const pageSize = 10000; // fetch everything at once

            while (true) {
                const response = await getAdminPayments({
                    ...params,
                    pageNumber: currentPage,
                    pageSize,
                });

                const items = response.payments.items || [];
                allItems = [...allItems, ...items];

                // Capture summary on first page
                if (currentPage === 1) {
                    summary = response.summary;
                }
                if (!response.payments.hasNext) break;

                currentPage += 1;
            }

            // Sort newest → oldest
            const sorted = [...allItems].sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );

            return { payments: sorted, summary };
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        payments: data?.payments || [],
        summary: data?.summary || null,
        loading: isLoading,
        error,
    };
}

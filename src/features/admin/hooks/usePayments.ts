"use client";

import { useEffect, useState } from 'react';
import { getAdminPayments, type PaymentItem, type GetPaymentsParams, type PaymentSummary } from '../services/paymentService';

export function usePayments(params?: GetPaymentsParams) {
    const [payments, setPayments] = useState<PaymentItem[]>([]);
    const [summary, setSummary] = useState<PaymentSummary | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        let active = true;
        setLoading(true);

        getAdminPayments(params ?? {})
            .then((res) => {
                if (!active) return;
                const items = res.payments.items ?? [];
                // Sort by newest first
                const sorted = [...items].sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setPayments(sorted);
                setSummary(res.summary);
            })
            .catch((err) => {
                if (!active) return;
                setError(err);
            })
            .finally(() => {
                if (!active) return;
                setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [params]);

    return { payments, summary, loading, error };
}

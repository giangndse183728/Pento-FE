import { useState, useEffect, useCallback } from 'react';
import { getAdminReports } from '../services/reportService';
import type { TradeReport, GetReportsParams } from '../schema/reportSchema';

interface UseReportsResult {
    reports: TradeReport[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useReports(params: GetReportsParams = {}): UseReportsResult {
    const [reports, setReports] = useState<TradeReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchReports = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAdminReports(params);
            setReports(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch reports'));
            console.error('Error fetching reports:', err);
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(params)]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    return {
        reports,
        loading,
        error,
        refetch: fetchReports
    };
}

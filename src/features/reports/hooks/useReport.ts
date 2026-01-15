import { useState, useEffect, useCallback, useRef } from 'react';
import { getAdminReports, rejectReport, resolveReport } from '../services/reportService';
import type { TradeReport, GetReportsParams, ReportsSummary } from '../schema/reportSchema';

interface UseReportsResult {
    reports: TradeReport[];
    summary: ReportsSummary | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useReports(params: GetReportsParams = {}): UseReportsResult {
    const [reports, setReports] = useState<TradeReport[]>([]);
    const [summary, setSummary] = useState<ReportsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Use a ref to always have access to latest params
    const paramsRef = useRef(params);
    paramsRef.current = params;

    // Serialize params for dependency tracking
    const paramsKey = JSON.stringify(params);

    const fetchReports = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // Use paramsRef.current to always get latest params
            const data = await getAdminReports(paramsRef.current);
            setReports(data.reports);
            setSummary(data.summary);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch reports'));
            console.error('Error fetching reports:', err);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsKey]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    return {
        reports,
        summary,
        loading,
        error,
        refetch: fetchReports
    };
}

interface UseReportMutationResult {
    mutate: (reportId: string, adminNote: string) => Promise<void>;
    isPending: boolean;
    error: Error | null;
}

export function useRejectReport(): UseReportMutationResult {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = useCallback(async (reportId: string, adminNote: string) => {
        try {
            setIsPending(true);
            setError(null);
            await rejectReport(reportId, adminNote);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to reject report');
            setError(error);
            throw error;
        } finally {
            setIsPending(false);
        }
    }, []);

    return { mutate, isPending, error };
}

export function useResolveReport(): UseReportMutationResult {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = useCallback(async (reportId: string, adminNote: string) => {
        try {
            setIsPending(true);
            setError(null);
            await resolveReport(reportId, adminNote);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to resolve report');
            setError(error);
            throw error;
        } finally {
            setIsPending(false);
        }
    }, []);

    return { mutate, isPending, error };
}

import { apiRequest } from '@/lib/apiRequest';
import type { TradeReport, GetReportsParams, GetReportsResponse, ReportsSummary } from '../schema/reportSchema';

// Re-export types for backward compatibility
export type { TradeReport, GetReportsParams, ReportsSummary };

export async function getAdminReports(params: GetReportsParams = {}): Promise<{ reports: TradeReport[]; summary: ReportsSummary }> {
    const query = new URLSearchParams();

    if (params.status) query.set('status', params.status);
    if (params.severity) query.set('severity', params.severity);
    if (params.reason) query.set('reason', params.reason);
    query.set('sort', params.sort ?? 'Newest');

    // Set default pagination if not provided
    query.set('pageNumber', String(params.pageNumber ?? 1));
    query.set('pageSize', String(params.pageSize ?? 10));

    const url = `/trades/reports?${query.toString()}`;
    const response = await apiRequest<GetReportsResponse>('get', url);
    return {
        reports: response.reports.items || [],
        summary: response.summary
    };
}

export async function rejectReport(tradeReportId: string, adminNote: string): Promise<void> {
    return apiRequest('patch', `/trades/reports/${tradeReportId}/reject`, { adminNote });
}

export async function resolveReport(tradeReportId: string, adminNote: string): Promise<void> {
    return apiRequest('patch', `/trades/reports/${tradeReportId}/resolve`, { adminNote });
}

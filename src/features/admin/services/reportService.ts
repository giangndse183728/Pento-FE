import { apiRequest } from '@/lib/apiRequest';
import type { TradeReport, GetReportsParams } from '../schema/reportSchema';

// Re-export types for backward compatibility
export type { TradeReport, GetReportsParams };

export async function getAdminReports(params: GetReportsParams = {}): Promise<TradeReport[]> {
    const query = new URLSearchParams();

    if (params.status) query.set('status', params.status);
    if (params.severity) query.set('severity', params.severity);
    if (params.reason) query.set('reason', params.reason);
    if (params.fromDate) query.set('fromDate', params.fromDate);
    if (params.toDate) query.set('toDate', params.toDate);
    if (params.reporterUserId) query.set('reporterUserId', params.reporterUserId);
    if (params.tradeSessionId) query.set('tradeSessionId', params.tradeSessionId);
    if (typeof params.pageNumber === 'number') query.set('pageNumber', String(params.pageNumber));
    if (typeof params.pageSize === 'number') query.set('pageSize', String(params.pageSize));

    const url = query.toString() ? `/trades/reports?${query.toString()}` : '/trades/reports';
    return apiRequest<TradeReport[]>('get', url);
}

export async function rejectReport(tradeReportId: string, adminNote: string): Promise<void> {
    return apiRequest('patch', `/trades/reports/${tradeReportId}/reject`, { adminNote });
}

export async function resolveReport(tradeReportId: string, adminNote: string): Promise<void> {
    return apiRequest('patch', `/trades/reports/${tradeReportId}/resolve`, { adminNote });
}

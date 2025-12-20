export type ReportReason =
    | 'FoodSafetyConcern'
    | 'ExpiredFood'
    | 'PoorHygiene'
    | 'MisleadingInformation'
    | 'InappropriateBehavior'
    | 'Other';

export type ReportSeverity = 'Minor' | 'Serious' | 'Critical';

export type ReportStatus = 'Pending' | 'UnderReview' | 'Resolved' | 'Dismissed';

export type MediaType = 'Image' | 'Video';

export interface TradeReport {
    reportId: string;
    tradeSessionId: string;
    reason: ReportReason;
    severity: ReportSeverity;
    status: ReportStatus;
    description: string;
    createdOnUtc: string;
    reporterUserId: string;
    reporterName: string;
    reporterAvatarUrl: string;
    foodItemId: string;
    foodName: string;
    foodImageUri: string;
    quantity: number;
    unitAbbreviation: string;
    mediaId: string;
    mediaType: MediaType;
    mediaUri: string;
}

export interface GetReportsParams {
    status?: ReportStatus;
    severity?: ReportSeverity;
    reason?: ReportReason;
    sort?: 'Newest' | 'Oldest';
    pageNumber?: number;
    pageSize?: number;
}

export interface PaginatedReportsData {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    items: TradeReport[];
}

export interface ReportsSummary {
    totalReports: number;
    pendingReports: number;
    urgentReports: number;
    resolvedReports: number;
}

export interface GetReportsResponse {
    reports: PaginatedReportsData;
    summary: ReportsSummary;
}

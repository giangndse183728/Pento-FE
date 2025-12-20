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
    fromDate?: string;
    toDate?: string;
    reporterUserId?: string;
    tradeSessionId?: string;
    pageNumber?: number;
    pageSize?: number;
}

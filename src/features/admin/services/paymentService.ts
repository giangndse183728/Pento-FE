import { apiRequest } from '@/lib/apiRequest';

export type PaymentStatus = 'pending' | 'cancelled' | 'paid' | 'expired' | 'processing' | 'failed';

export type TimeWindow = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export type GetPaymentsParams = {
    userId?: string;
    searchText?: string;
    fromAmount?: number;
    toAmount?: number;
    fromDate?: string; // ISO date-time
    toDate?: string;   // ISO date-time
    status?: PaymentStatus;
    isDeleted?: boolean;
    pageNumber?: number;
    pageSize?: number;
};

export type GetPaymentSummaryParams = {
    subscriptionIds?: string[];
    fromDate?: string; // ISO date
    toDate?: string;   // ISO date
    isActive?: boolean;
    isDeleted?: boolean;
    timeWindow?: TimeWindow;
};

// Response models based on provided body
export type PaymentSummary = {
    totalDue: string;
    totalPaid: string;
    pending: number;
    paid: number;
    failed: number;
    cancelled: number;
    expired: number;
};

export type PaymentItem = {
    paymentId: string;
    userId: string;
    orderCode: number;
    description: string;
    amount: string; // e.g., "5000 VND"
    status: 'Pending' | 'Paid' | 'Failed' | 'Cancelled' | 'Expired' | 'Processing';
    createdAt: string; // ISO date-time
    isDeleted: boolean;
};

export type PaginatedPayments = {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    items: PaymentItem[];
    summary: PaymentSummary;
};

export type FoodItemLog = {
    id: string;
    userId: string;
    itemName: string;
    action: 'created' | 'updated' | 'deleted';
    quantity?: number;
    createdAt: string;
};

export async function getAdminPaymentSummary(params: GetPaymentSummaryParams = {}): Promise<PaymentSummary> {
    const query = new URLSearchParams();
    if (params.subscriptionIds?.length) {
        params.subscriptionIds.forEach(id => query.append('subscriptionIds', id));
    }
    if (params.fromDate) query.set('fromDate', params.fromDate);
    if (params.toDate) query.set('toDate', params.toDate);
    if (typeof params.isActive === 'boolean') query.set('isActive', String(params.isActive));
    if (typeof params.isDeleted === 'boolean') query.set('isDeleted', String(params.isDeleted));
    if (params.timeWindow) query.set('timeWindow', params.timeWindow);

    const url = query.toString() ? `/admin/subscriptions/payment-summary?${query.toString()}` : '/admin/subscriptions/payment-summary';
    return apiRequest<PaymentSummary>('get', url);
}

export async function getAdminPayments(params: GetPaymentsParams = {}): Promise<PaginatedPayments> {
    const query = new URLSearchParams();
    if (params.userId) query.set('userId', params.userId);
    if (params.searchText) query.set('searchText', params.searchText);
    if (typeof params.fromAmount === 'number') query.set('fromAmount', String(params.fromAmount));
    if (typeof params.toAmount === 'number') query.set('toAmount', String(params.toAmount));
    if (params.fromDate) query.set('fromDate', params.fromDate);
    if (params.toDate) query.set('toDate', params.toDate);
    if (params.status) query.set('status', params.status);
    if (typeof params.isDeleted === 'boolean') query.set('isDeleted', String(params.isDeleted));
    if (typeof params.pageNumber === 'number') query.set('pageNumber', String(params.pageNumber));
    if (typeof params.pageSize === 'number') query.set('pageSize', String(params.pageSize));

    const url = query.toString() ? `/admin/payments?${query.toString()}` : '/admin/payments';
    return apiRequest<PaginatedPayments>('get', url);
}

export async function getAdminFoodItemLog(): Promise<FoodItemLog[]> {
    return apiRequest<FoodItemLog[]>('get', '/admin/food-item-log');
}

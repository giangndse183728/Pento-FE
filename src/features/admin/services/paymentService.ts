import { apiRequest } from '@/lib/apiRequest';

export type PaymentStatus = 'pending' | 'cancelled' | 'paid' | 'expired' | 'processing' | 'failed';

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
};

export type GetPaymentsResponse = {
    summary: PaymentSummary;
    payments: PaginatedPayments;
};

export type FoodItemLog = {
    id: string;
    userId: string;
    itemName: string;
    action: 'created' | 'updated' | 'deleted';
    quantity?: number;
    createdAt: string;
};

export async function getAdminPayments(params: GetPaymentsParams = {}): Promise<GetPaymentsResponse> {
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
    return apiRequest<GetPaymentsResponse>('get', url);
}

export async function getAdminFoodItemLog(): Promise<FoodItemLog[]> {
    return apiRequest<FoodItemLog[]>('get', '/admin/food-item-log');
}

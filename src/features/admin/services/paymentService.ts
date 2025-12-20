import { apiRequest } from '@/lib/apiRequest';
import type {
    PaymentStatus,
    TimeWindow,
    GetPaymentsParams,
    GetPaymentSummaryParams,
    PaymentSummary,
    PaymentItem,
    PaginatedPayments,
    FoodItemLog,
    SubscriptionPaymentSummary,
} from '../schema/paymentSchema';

// Re-export types for backward compatibility
export type {
    PaymentStatus,
    TimeWindow,
    GetPaymentsParams,
    GetPaymentSummaryParams,
    PaymentSummary,
    PaymentItem,
    PaginatedPayments,
    FoodItemLog,
    SubscriptionPaymentSummary,
};

export async function getAdminPaymentSummary(params: GetPaymentSummaryParams = {}): Promise<SubscriptionPaymentSummary[]> {
    const query = new URLSearchParams();
    if (params.subscriptionIds && params.subscriptionIds.length > 0) {
        params.subscriptionIds.forEach(id => {
            if (id) query.append('subscriptionIds', id);
        });
    }
    if (params.fromDate) query.set('fromDate', params.fromDate);
    if (params.toDate) query.set('toDate', params.toDate);
    if (typeof params.isActive === 'boolean') query.set('isActive', String(params.isActive));
    if (typeof params.isDeleted === 'boolean') query.set('isDeleted', String(params.isDeleted));
    if (params.timeWindow) {
        // Convert to Pascal case: 'weekly' -> 'Weekly', 'monthly' -> 'Monthly', etc.
        const pascalCase = params.timeWindow.charAt(0).toUpperCase() + params.timeWindow.slice(1);
        query.set('timeWindow', pascalCase);
    }

    const url = query.toString() ? `/admin/subscriptions/payment-summary?${query.toString()}` : '/admin/subscriptions/payment-summary';
    return apiRequest<SubscriptionPaymentSummary[]>('get', url);
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
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);
    if (typeof params.isDeleted === 'boolean') query.set('isDeleted', String(params.isDeleted));
    if (typeof params.pageNumber === 'number') query.set('pageNumber', String(params.pageNumber));
    if (typeof params.pageSize === 'number') query.set('pageSize', String(params.pageSize));

    const url = query.toString() ? `/admin/payments?${query.toString()}` : '/admin/payments';
    console.log('getAdminPayments URL:', url);
    const response = await apiRequest<{ summary: PaymentSummary; payments: PaginatedPayments }>('get', url);
    console.log('getAdminPayments response:', response);

    // API returns { summary: {...}, payments: {...} }
    // Merge summary into payments object to match PaginatedPayments type
    if (response && 'payments' in response && 'summary' in response) {
        return {
            ...response.payments,
            summary: response.summary,
        };
    }

    // Fallback for unexpected structure
    return response as unknown as PaginatedPayments;
}


export async function getAdminFoodItemLog(): Promise<FoodItemLog[]> {
    return apiRequest<FoodItemLog[]>('get', '/admin/food-item-log');
}

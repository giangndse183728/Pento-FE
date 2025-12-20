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
    sortBy?: 'OrderCode' | 'Description' | 'AmountDue' | 'AmountPaid' | 'CreatedAt';
    sortOrder?: 'ASC' | 'DESC';
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
    email: string;
    amountDue: string;   // e.g., "5000 VND"
    amountPaid: string;  // e.g., "5000 VND"
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

export type SubscriptionPaymentSummary = {
    subscriptionId: string;
    name: string;
    totalPaidAmount: number;
    payments: {
        date: string;
        amount: number;
        currency: string;
    }[];
};

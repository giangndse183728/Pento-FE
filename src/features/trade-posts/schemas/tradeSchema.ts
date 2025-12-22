import { z } from 'zod';

// ============= Common Types =============

export type TradeOfferStatus = 'open' | 'fulfilled' | 'cancelled' | 'expired';
export type TradeRequestStatus = 'Pending' | 'Fulfilled' | 'Rejected' | 'Cancelled';
export type TradeSessionStatus = 'Ongoing' | 'Completed' | 'Cancelled';

// User object in response
export const UserInfoSchema = z.object({
    userId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    avatarUrl: z.string().nullable(),
});

export type UserInfo = z.infer<typeof UserInfoSchema>;

// ============= Query Parameters =============

export type GetTradeOffersParams = {
    status?: string;
    isDeleted?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    pageNumber?: number;
    pageSize?: number;
};

export type GetTradeRequestsParams = {
    offerId?: string;
    status?: string;
    isDeleted?: boolean;
    sortBy?: 'CreatedOn' | 'TotalItems';
    sortOrder?: 'ASC' | 'DESC';
    pageNumber?: number;
    pageSize?: number;
};

export type GetTradeSessionsParams = {
    offerId?: string;
    requestId?: string;
    status?: string;
    sortOrder?: 'ASC' | 'DESC';
    pageNumber?: number;
    pageSize?: number;
};

// ============= Trade Offers =============

export const TradeOfferItemSchema = z.object({
    tradeOfferId: z.string(),
    offerUser: UserInfoSchema,
    offerHouseholdName: z.string().nullable(),
    status: z.string(),
    createdOn: z.string(),
    updatedOn: z.string(),
    totalItems: z.number(),
    totalRequests: z.number(),
    isDeleted: z.boolean(),
});

export type TradeOfferItem = z.infer<typeof TradeOfferItemSchema>;

export type PaginatedTradeOffers = {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    items: TradeOfferItem[];
};

// ============= Trade Requests =============

export const TradeRequestItemSchema = z.object({
    tradeRequestId: z.string(),
    tradeOfferId: z.string(),
    requestUser: UserInfoSchema,
    offerHouseholdName: z.string().nullable(),
    requestHouseholdName: z.string().nullable(),
    status: z.string(),
    createdOn: z.string(),
    updatedOn: z.string(),
    totalItems: z.number(),
    isDeleted: z.boolean(),
});

export type TradeRequestItem = z.infer<typeof TradeRequestItemSchema>;

export type PaginatedTradeRequests = {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    items: TradeRequestItem[];
};

// ============= Trade Sessions =============

export const TradeSessionItemSchema = z.object({
    tradeSessionId: z.string(),
    status: z.string(),
    startedOn: z.string(),
    totalOfferedItems: z.number(),
    totalRequestedItems: z.number(),
    avatarUrls: z.array(z.string()),
});

export type TradeSessionItem = z.infer<typeof TradeSessionItemSchema>;

export type PaginatedTradeSessions = {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    items: TradeSessionItem[];
};

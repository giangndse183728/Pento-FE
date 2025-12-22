import { apiRequest } from '@/lib/apiRequest';
import type {
    GetTradeOffersParams,
    GetTradeRequestsParams,
    GetTradeSessionsParams,
    PaginatedTradeOffers,
    PaginatedTradeRequests,
    PaginatedTradeSessions,
} from '../schemas/tradeSchema';

// ============= Trade Offers =============

/**
 * GET /admin/trades/offers
 * Fetches paginated list of trade offers for admin dashboard
 */
export const getAdminTradeOffers = async (params: GetTradeOffersParams = {}): Promise<PaginatedTradeOffers> => {
    try {
        const query = new URLSearchParams();

        if (params.status) query.set('status', params.status);
        if (typeof params.isDeleted === 'boolean') query.set('isDeleted', String(params.isDeleted));
        if (params.sortBy) query.set('sortBy', params.sortBy);
        if (params.sortOrder) query.set('sortOrder', params.sortOrder);
        if (typeof params.pageNumber === 'number') query.set('pageNumber', String(params.pageNumber));
        if (typeof params.pageSize === 'number') query.set('pageSize', String(params.pageSize));

        const url = query.toString() ? `/admin/trades/offers?${query.toString()}` : '/admin/trades/offers';
        const response = await apiRequest<PaginatedTradeOffers>('get', url);
        return response;
    } catch (error) {
        console.error('getAdminTradeOffers failed:', error);
        throw error;
    }
};

/**
 * GET /admin/trades/offers/{id}
 * Fetches detailed info for a single trade offer
 */
export const getTradeOfferById = async (id: string): Promise<any> => {
    try {
        const response = await apiRequest<any>('get', `/admin/trades/offers/${id}`);
        return response;
    } catch (error) {
        console.error(`getTradeOfferById failed for ID ${id}:`, error);
        throw error;
    }
};

// ============= Trade Requests =============

/**
 * GET /admin/trades/requests
 * Fetches paginated list of trade requests for admin dashboard
 */
export const getAdminTradeRequests = async (params: GetTradeRequestsParams = {}): Promise<PaginatedTradeRequests> => {
    try {
        const query = new URLSearchParams();

        if (params.offerId) query.set('offerId', params.offerId);
        if (params.status) query.set('status', params.status);
        if (typeof params.isDeleted === 'boolean') query.set('isDeleted', String(params.isDeleted));
        if (params.sortBy) query.set('sortBy', params.sortBy);
        if (params.sortOrder) query.set('sortOrder', params.sortOrder);
        if (typeof params.pageNumber === 'number') query.set('pageNumber', String(params.pageNumber));
        if (typeof params.pageSize === 'number') query.set('pageSize', String(params.pageSize));

        const url = query.toString() ? `/admin/trades/requests?${query.toString()}` : '/admin/trades/requests';
        const response = await apiRequest<PaginatedTradeRequests>('get', url);
        return response;
    } catch (error) {
        console.error('getAdminTradeRequests failed:', error);
        throw error;
    }
};

/**
 * GET /admin/trades/requests/{id}
 * Fetches detailed info for a single trade request
 */
export const getTradeRequestById = async (id: string): Promise<any> => {
    try {
        const response = await apiRequest<any>('get', `/admin/trades/requests/${id}`);
        return response;
    } catch (error) {
        console.error(`getTradeRequestById failed for ID ${id}:`, error);
        throw error;
    }
};

// ============= Trade Sessions =============

/**
 * GET /admin/trades/sessions
 * Fetches paginated list of trade sessions for admin dashboard
 */
export const getAdminTradeSessions = async (params: GetTradeSessionsParams = {}): Promise<PaginatedTradeSessions> => {
    try {
        const query = new URLSearchParams();

        if (params.offerId) query.set('offerId', params.offerId);
        if (params.requestId) query.set('requestId', params.requestId);
        if (params.status) query.set('status', params.status);
        if (params.sortOrder) query.set('sortOrder', params.sortOrder);
        if (typeof params.pageNumber === 'number') query.set('pageNumber', String(params.pageNumber));
        if (typeof params.pageSize === 'number') query.set('pageSize', String(params.pageSize));

        const url = query.toString() ? `/admin/trades/sessions?${query.toString()}` : '/admin/trades/sessions';
        const response = await apiRequest<PaginatedTradeSessions>('get', url);
        return response;
    } catch (error) {
        console.error('getAdminTradeSessions failed:', error);
        throw error;
    }
};

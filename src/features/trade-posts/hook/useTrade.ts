import { useQuery } from '@tanstack/react-query';
import {
    getAdminTradeOffers,
    getAdminTradeRequests,
    getAdminTradeSessions,
} from '../services/tradeServices';
import type {
    GetTradeOffersParams,
    GetTradeRequestsParams,
    GetTradeSessionsParams,
} from '../schemas/tradeSchema';

// ============= Trade Offers Hooks =============

/**
 * Hook to fetch paginated admin trade offers list
 */
export const useAdminTradeOffers = (params: GetTradeOffersParams = {}) => {
    return useQuery({
        queryKey: ['adminTradeOffers', params],
        queryFn: () => getAdminTradeOffers(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// ============= Trade Requests Hooks =============

/**
 * Hook to fetch paginated admin trade requests list
 */
export const useAdminTradeRequests = (params: GetTradeRequestsParams = {}) => {
    return useQuery({
        queryKey: ['adminTradeRequests', params],
        queryFn: () => getAdminTradeRequests(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// ============= Trade Sessions Hooks =============

/**
 * Hook to fetch paginated admin trade sessions list
 */
export const useAdminTradeSessions = (params: GetTradeSessionsParams = {}) => {
    return useQuery({
        queryKey: ['adminTradeSessions', params],
        queryFn: () => getAdminTradeSessions(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

"use client";

import { useQuery } from '@tanstack/react-query';
import {
    getFoodItemLogSummary,
    type GetFoodItemLogSummaryParams,
} from '../services/foodItemsLogServices';

export function useFoodItemLogSummary(params?: GetFoodItemLogSummaryParams) {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['admin-food-item-log-summary', params],
        queryFn: async () => {
            return getFoodItemLogSummary(params);
        },
        staleTime: 1000 * 60 * 5,
    });

    return {
        data: data || null,
        loading: isLoading,
        error,
        refetch,
    };
}

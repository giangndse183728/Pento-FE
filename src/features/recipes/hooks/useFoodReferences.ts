"use client";

import { useQuery } from '@tanstack/react-query';
import { getFoodReferences, FoodReferencesResponse, FoodReferencesQuery } from '@/features/food-references';

export const useFoodReferences = (params?: FoodReferencesQuery) => {
    type AxiosLike = { response?: { status?: number } };
    return useQuery<FoodReferencesResponse>({
        queryKey: ['foodReferences', params?.foodGroup, params?.search, params?.page, params?.pageSize],
        queryFn: () => getFoodReferences(params),
        staleTime: 0, // Changed from 10 minutes to 0 to force refetch on param changes
        initialData: { items: [], totalCount: 0, pageNumber: 1, pageSize: 24 },
        retry: (failureCount: number, error: unknown) => {
            const status = (error as AxiosLike)?.response?.status;
            return typeof status === 'number' && status >= 500;
        },
    });
};

export default useFoodReferences;

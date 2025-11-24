"use client";

import { useQuery } from '@tanstack/react-query';
import { getFoodReferences, FoodRef, FoodReferencesQuery } from '../services/recipesService';

export const useFoodReferences = (params?: FoodReferencesQuery) => {
    type AxiosLike = { response?: { status?: number } };
    return useQuery<FoodRef[]>({
        queryKey: ['foodReferences', params?.foodGroup, params?.search, params?.page, params?.pageSize],
        queryFn: () => getFoodReferences(params),
        staleTime: 0, // Changed from 10 minutes to 0 to force refetch on param changes
        initialData: [],
        retry: (failureCount: number, error: unknown) => {
            const status = (error as AxiosLike)?.response?.status;
            return typeof status === 'number' && status >= 500;
        },
    });
};

export default useFoodReferences;

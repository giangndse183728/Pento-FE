"use client";

import { useQuery } from '@tanstack/react-query';
import { getFoodReferences, FoodRef, FoodReferencesQuery } from '../services/recipesService';

export const useFoodReferences = (params?: FoodReferencesQuery) => {
    type AxiosLike = { response?: { status?: number } };
    return useQuery<FoodRef[]>({
        queryKey: ['foodReferences', params ?? {}],
        queryFn: () => getFoodReferences(params),
        staleTime: 1000 * 60 * 10,
        initialData: [],
        retry: (failureCount: number, error: unknown) => {
            const status = (error as AxiosLike)?.response?.status;
            return typeof status === 'number' && status >= 500;
        },
    });
};

export default useFoodReferences;

"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getFoodReferences,
    getFoodReferenceById,
    createFoodReference,
    updateFoodReference
} from '../services/foodReferenceService';
import type {
    FoodReferencesQuery,
    FoodReferencesResponse,
    FoodReferenceDetail,
    CreateFoodReferenceInput,
    UpdateFoodReferenceInput
} from '../schema/foodReferenceSchema';

// Hook for listing food references with pagination
export const useFoodReferences = (params?: FoodReferencesQuery) => {
    return useQuery<FoodReferencesResponse>({
        queryKey: ['foodReferences', params],
        queryFn: () => getFoodReferences(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: (failureCount, error) => {
            const status = (error as { response?: { status?: number } })?.response?.status;
            return typeof status === 'number' && status >= 500;
        },
    });
};

// Hook for getting a single food reference by ID
export const useFoodReferenceById = (id: string | undefined) => {
    return useQuery<FoodReferenceDetail>({
        queryKey: ['foodReference', id],
        queryFn: () => getFoodReferenceById(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// Hook for creating a new food reference
export const useCreateFoodReference = () => {
    const queryClient = useQueryClient();

    return useMutation<FoodReferenceDetail, Error, CreateFoodReferenceInput>({
        mutationFn: (payload) => createFoodReference(payload),
        onSuccess: () => {
            // Invalidate food references list to refetch
            queryClient.invalidateQueries({ queryKey: ['foodReferences'] });
        },
    });
};

// Hook for updating an existing food reference
export const useUpdateFoodReference = () => {
    const queryClient = useQueryClient();

    return useMutation<FoodReferenceDetail, Error, { id: string; payload: UpdateFoodReferenceInput }>({
        mutationFn: ({ id, payload }) => updateFoodReference(id, payload),
        onSuccess: (data, variables) => {
            // Invalidate both the list and the specific item
            queryClient.invalidateQueries({ queryKey: ['foodReferences'] });
            queryClient.invalidateQueries({ queryKey: ['foodReference', variables.id] });
        },
    });
};

export default useFoodReferences;

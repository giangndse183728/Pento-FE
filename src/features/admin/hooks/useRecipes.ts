"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getRecipes, postRecipeDetailed, getUnits, getFoodReferences, RecipeDetailedInput, RecipeSummary, Unit, FoodRef } from '../services/recipesService';
import { recipeDetailedSchema } from '../schema/recipeSchema';

export const useRecipesList = () => {
    return useQuery<RecipeSummary[]>({
        queryKey: ['recipes'],
        queryFn: getRecipes,
        staleTime: 1000 * 60 * 2,
    });
};

export const useUnits = () => {
    type AxiosLike = { response?: { status?: number } };
    return useQuery<Unit[]>({
        queryKey: ['units'],
        queryFn: getUnits,
        staleTime: 1000 * 60 * 10,
        // Provide an empty array as initial data so components don't receive `undefined`.
        initialData: [],
        // If the API returns a 4xx (bad request), don't retry automatically.
        retry: (failureCount: number, error: unknown) => {
            const status = (error as AxiosLike)?.response?.status;
            return typeof status === 'number' && status >= 500;
        },
    });
};

export const useFoodReferences = () => {
    type AxiosLike = { response?: { status?: number } };
    return useQuery<FoodRef[]>({
        queryKey: ['foodReferences'],
        queryFn: getFoodReferences,
        staleTime: 1000 * 60 * 10,
        initialData: [],
        retry: (failureCount: number, error: unknown) => {
            const status = (error as AxiosLike)?.response?.status;
            return typeof status === 'number' && status >= 500;
        },
    });
};

export const useCreateRecipe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: RecipeDetailedInput) => {
            // validate payload with zod schema before sending
            const result = recipeDetailedSchema.safeParse(payload);
            if (!result.success) {
                const messages = result.error.errors.map((e) => {
                    const path = e.path.length ? `${e.path.join('.')}:` : '';
                    return path + ' ' + (e.message || 'Invalid value');
                });
                throw new Error(messages.join(' | '));
            }

            // normalize null -> undefined for optional fields to match TS types
            const cleaned = JSON.parse(JSON.stringify(result.data, (_k, v) => (v === null ? undefined : v)));
            return postRecipeDetailed(cleaned as RecipeDetailedInput);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            toast.success('Recipe created');
        },
        onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : 'Failed to create recipe';
            toast.error(message);
        },
    });
};

export default function useRecipes() {
    const list = useRecipesList();
    const units = useUnits();
    const foodRefs = useFoodReferences();
    const create = useCreateRecipe();

    return {
        list,
        units,
        foodRefs,
        create,
    };
}

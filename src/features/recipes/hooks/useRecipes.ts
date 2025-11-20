"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getRecipes, postRecipeDetailed, RecipeDetailedInput, RecipeSummary } from '../services/recipesService';
import useUnits from './useUnit';
import useFoodReferences from './useFoodReferences';
import { recipeDetailedSchema } from '../schema/recipeSchema';

export const useRecipesList = () => {
    return useQuery<RecipeSummary[]>({
        queryKey: ['recipes'],
        queryFn: getRecipes,
        staleTime: 1000 * 60 * 2,
    });
};

export const useCreateRecipe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: RecipeDetailedInput) => {
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

export function useRecipes() {
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

export default useRecipes;

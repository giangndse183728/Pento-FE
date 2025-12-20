"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    getRecipes,
    getPublicRecipes,
    postRecipeDetailed,
    deleteRecipe,
    getRecipeDetails,
    getPublicRecipeDetails,
    updateRecipe,
    uploadRecipeImage,
    updateRecipeIngredient,
    updateRecipeDirection,
    uploadRecipeDirectionImage,
    deleteRecipeIngredient,
    deleteRecipeDirection,
    createRecipeIngredient,
    createRecipeDirection,
    RecipeDetailedInput,
    RecipeSummary,
    RecipesQuery,
    PaginatedResponse,
    RecipeDetailsResponse,
    UpdateRecipeInput,
    UpdateRecipeIngredientInput,
    UpdateRecipeDirectionInput,
    CreateRecipeIngredientInput,
    CreateRecipeDirectionInput,
} from '../services/recipesService';
import useUnits from './useUnit';
import useFoodReferences from './useFoodReferences';
import { recipeDetailedSchema, updateRecipeSchema, updateRecipeIngredientSchema, updateRecipeDirectionSchema, createRecipeIngredientSchema, createRecipeDirectionSchema } from '../schema/recipeSchema';

export const useRecipesList = (params: RecipesQuery) => {
    return useQuery<PaginatedResponse<RecipeSummary>>({
        queryKey: ['recipes', params],
        queryFn: () => getRecipes(params),
        staleTime: 1000 * 60 * 2,
    });
};

export const usePublicRecipesList = (params: RecipesQuery) => {
    return useQuery<PaginatedResponse<RecipeSummary>>({
        queryKey: ['public-recipes', params],
        queryFn: () => getPublicRecipes(params),
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

export const useDeleteRecipe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteRecipe(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            toast.success('Recipe deleted successfully');
        },
        onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : 'Failed to delete recipe';
            toast.error(message);
        },
    });
};

export const useRecipeDetails = (recipeId?: string) => {
    return useQuery<RecipeDetailsResponse>({
        queryKey: ['recipe-details', recipeId],
        queryFn: () => {
            if (!recipeId) throw new Error('recipeId is required');
            return getRecipeDetails(recipeId);
        },
        enabled: !!recipeId,
        staleTime: 1000 * 60,
    });
};

export const usePublicRecipeDetails = (recipeId?: string) => {
    return useQuery<RecipeDetailsResponse>({
        queryKey: ['public-recipe-details', recipeId],
        queryFn: () => {
            if (!recipeId) throw new Error('recipeId is required');
            return getPublicRecipeDetails(recipeId);
        },
        enabled: !!recipeId,
        staleTime: 1000 * 60,
    });
};

// PUT /recipes/{recipeId} - Update recipe basic info
export const useUpdateRecipe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ recipeId, payload }: { recipeId: string; payload: UpdateRecipeInput }) => {
            const result = updateRecipeSchema.safeParse(payload);
            if (!result.success) {
                const messages = result.error.errors.map((e) => {
                    const path = e.path.length ? `${e.path.join('.')}:` : '';
                    return path + ' ' + (e.message || 'Invalid value');
                });
                throw new Error(messages.join(' | '));
            }
            return updateRecipe(recipeId, result.data);
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            queryClient.invalidateQueries({ queryKey: ['recipe-details', variables.recipeId] });
            toast.success('Recipe updated successfully');
        },
        onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : 'Failed to update recipe';
            toast.error(message);
        },
    });
};

// PUT /recipes/{id}/image - Upload recipe image
export const useUploadRecipeImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ recipeId, imageFile }: { recipeId: string; imageFile: File }) => {
            return uploadRecipeImage(recipeId, imageFile);
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            queryClient.invalidateQueries({ queryKey: ['recipe-details', variables.recipeId] });
            toast.success('Recipe image uploaded successfully');
        },
        onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : 'Failed to upload recipe image';
            toast.error(message);
        },
    });
};

// PUT /recipe-ingredients/{recipeIngredientId} - Update recipe ingredient
export const useUpdateRecipeIngredient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ recipeIngredientId, payload }: { recipeIngredientId: string; payload: UpdateRecipeIngredientInput }) => {
            const result = updateRecipeIngredientSchema.safeParse(payload);
            if (!result.success) {
                const messages = result.error.errors.map((e) => {
                    const path = e.path.length ? `${e.path.join('.')}:` : '';
                    return path + ' ' + (e.message || 'Invalid value');
                });
                throw new Error(messages.join(' | '));
            }
            return updateRecipeIngredient(recipeIngredientId, result.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            queryClient.invalidateQueries({ queryKey: ['recipe-details'] });
            toast.success('Ingredient updated successfully');
        },
        onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : 'Failed to update ingredient';
            toast.error(message);
        },
    });
};

// PUT /recipe-directions/{directionId} - Update recipe direction
export const useUpdateRecipeDirection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ directionId, payload }: { directionId: string; payload: UpdateRecipeDirectionInput }) => {
            const result = updateRecipeDirectionSchema.safeParse(payload);
            if (!result.success) {
                const messages = result.error.errors.map((e) => {
                    const path = e.path.length ? `${e.path.join('.')}:` : '';
                    return path + ' ' + (e.message || 'Invalid value');
                });
                throw new Error(messages.join(' | '));
            }
            return updateRecipeDirection(directionId, result.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            queryClient.invalidateQueries({ queryKey: ['recipe-details'] });
            toast.success('Direction updated successfully');
        },
        onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : 'Failed to update direction';
            toast.error(message);
        },
    });
};

// PUT /recipes-directions/{directionId}/image - Upload direction image
export const useUploadRecipeDirectionImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ directionId, file }: { directionId: string; file: File }) => {
            return uploadRecipeDirectionImage(directionId, file);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            queryClient.invalidateQueries({ queryKey: ['recipe-details'] });
            toast.success('Direction image uploaded successfully');
        },
        onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : 'Failed to upload direction image';
            toast.error(message);
        },
    });
};

// DELETE /recipe-ingredients/{recipeIngredientId} - Delete recipe ingredient
export const useDeleteRecipeIngredient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (recipeIngredientId: string) => deleteRecipeIngredient(recipeIngredientId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            queryClient.invalidateQueries({ queryKey: ['recipe-details'] });
            toast.success('Ingredient deleted successfully');
        },
        onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : 'Failed to delete ingredient';
            toast.error(message);
        },
    });
};

// DELETE /recipe-directions/{recipeDirectionId} - Delete recipe direction
export const useDeleteRecipeDirection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (recipeDirectionId: string) => deleteRecipeDirection(recipeDirectionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            queryClient.invalidateQueries({ queryKey: ['recipe-details'] });
            toast.success('Direction deleted successfully');
        },
        onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : 'Failed to delete direction';
            toast.error(message);
        },
    });
};

// POST /recipe-ingredients - Create recipe ingredient
export const useCreateRecipeIngredient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateRecipeIngredientInput) => {
            const result = createRecipeIngredientSchema.safeParse(payload);
            if (!result.success) {
                const messages = result.error.errors.map((e) => {
                    const path = e.path.length ? `${e.path.join('.')}:` : '';
                    return path + ' ' + (e.message || 'Invalid value');
                });
                throw new Error(messages.join(' | '));
            }
            return createRecipeIngredient(result.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            queryClient.invalidateQueries({ queryKey: ['recipe-details'] });
            toast.success('Ingredient added successfully');
        },
        onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : 'Failed to add ingredient';
            toast.error(message);
        },
    });
};

// POST /recipe-directions - Create recipe direction
export const useCreateRecipeDirection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateRecipeDirectionInput) => {
            const result = createRecipeDirectionSchema.safeParse(payload);
            if (!result.success) {
                const messages = result.error.errors.map((e) => {
                    const path = e.path.length ? `${e.path.join('.')}:` : '';
                    return path + ' ' + (e.message || 'Invalid value');
                });
                throw new Error(messages.join(' | '));
            }
            return createRecipeDirection(result.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            queryClient.invalidateQueries({ queryKey: ['recipe-details'] });
            toast.success('Direction added successfully');
        },
        onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : 'Failed to add direction';
            toast.error(message);
        },
    });
};

import type { UseQueryResult } from '@tanstack/react-query';

export function useRecipes(params?: RecipesQuery): {
    list: UseQueryResult<PaginatedResponse<RecipeSummary>, unknown>;
    units: ReturnType<typeof useUnits>;
    foodRefs: ReturnType<typeof useFoodReferences>;
    create: ReturnType<typeof useCreateRecipe>;
} {
    const defaultParams: RecipesQuery = params ?? { pageNumber: 1, pageSize: 6 };
    const list = useRecipesList(defaultParams);
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


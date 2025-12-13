import { apiRequest } from '@/lib/apiRequest';
import type {
    IngredientInput,
    DirectionInput,
    RecipeDetailedInput,
    RecipeSummary,
    UpdateRecipeInput,
    UpdateRecipeIngredientInput,
    UpdateRecipeDirectionInput,
    CreateRecipeIngredientInput,
    CreateRecipeDirectionInput,
} from '../schema/recipeSchema';

// Re-export types for convenience
export type { IngredientInput, DirectionInput, RecipeDetailedInput, RecipeSummary, UpdateRecipeInput, UpdateRecipeIngredientInput, UpdateRecipeDirectionInput, CreateRecipeIngredientInput, CreateRecipeDirectionInput };

export type RecipesQuery = {
    pageNumber: number;
    pageSize: number;
    difficulty?: string;
};

export type PaginatedResponse<T> = {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
};

export const getRecipes = async (params: RecipesQuery): Promise<PaginatedResponse<RecipeSummary>> => {
    try {
        const qs = '?' + Object.entries(params)
            .filter(([, v]) => v !== undefined && v !== null && v !== '')
            .map(([k, v]) => {
                const val = typeof v === 'string' ? v.trim() : v;
                return `${encodeURIComponent(k)}=${encodeURIComponent(String(val))}`;
            })
            .join('&');
        const response = await apiRequest<PaginatedResponse<RecipeSummary>>('get', `/recipes${qs}`);
        // Return full paginated response
        return response;
    } catch (err) {
        // Return empty paginated response on error
        return {
            items: [],
            totalCount: 0,
            pageNumber: params.pageNumber,
            pageSize: params.pageSize
        };
    }
};

export const postRecipeDetailed = async (payload: RecipeDetailedInput) => {
    try {
        const result = await apiRequest<unknown>('post', '/recipes/detailed', payload);
        return result;
    } catch (error) {
        throw error;
    }
};

export const deleteRecipe = async (id: string): Promise<void> => {
    try {
        await apiRequest<void>('delete', `/recipes/${id}`);
    } catch (error) {
        throw error;
    }
};

export type RecipeDetailsResponse = {
    id?: string;
    recipeTitle: string;
    description?: string | null;
    prepTimeMinutes?: number | null;
    cookTimeMinutes?: number | null;
    totalTimeMinutes?: number | null;
    notes?: string | null;
    servings?: number | null;
    difficultyLevel?: string | null;
    imageUrl?: string | null;
    isPublic?: boolean;
    ingredients: Array<{
        ingredientId?: string;
        foodRefId: string;
        foodRefName: string;
        imageUrl?: string | null;
        quantity: number;
        unitId: string;
        unitName: string;
        notes?: string | null;
    }>;
    directions: Array<{
        directionId?: string;
        stepNumber: number;
        description: string;
        imageUrl?: string | null;
    }>;
};

export const getRecipeDetails = async (recipeId: string): Promise<RecipeDetailsResponse> => {
    try {
        const qs = `?include=all`;
        const res = await apiRequest<RecipeDetailsResponse>('get', `/recipes/${encodeURIComponent(recipeId)}${qs}`);
        return res;
    } catch (error) {
        throw error;
    }
};

// PUT /recipes/{recipeId} - Update recipe basic info
export const updateRecipe = async (recipeId: string, payload: UpdateRecipeInput): Promise<unknown> => {
    try {
        const result = await apiRequest<unknown>('put', `/recipes/${encodeURIComponent(recipeId)}`, payload);
        return result;
    } catch (error) {
        throw error;
    }
};

// PUT /recipes/{id}/image - Upload recipe image
export const uploadRecipeImage = async (recipeId: string, imageFile: File): Promise<unknown> => {
    try {
        const formData = new FormData();
        formData.append('imageFile', imageFile);
        const result = await apiRequest<unknown>('put', `/recipes/${encodeURIComponent(recipeId)}/image`, formData);
        return result;
    } catch (error) {
        throw error;
    }
};

// PUT /recipe-ingredients/{recipeIngredientId} - Update recipe ingredient
export const updateRecipeIngredient = async (recipeIngredientId: string, payload: UpdateRecipeIngredientInput): Promise<unknown> => {
    try {
        const result = await apiRequest<unknown>('put', `/recipe-ingredients/${encodeURIComponent(recipeIngredientId)}`, payload);
        return result;
    } catch (error) {
        throw error;
    }
};

// PUT /recipe-directions/{directionId} - Update recipe direction
export const updateRecipeDirection = async (directionId: string, payload: UpdateRecipeDirectionInput): Promise<unknown> => {
    try {
        const result = await apiRequest<unknown>('put', `/recipe-directions/${encodeURIComponent(directionId)}`, payload);
        return result;
    } catch (error) {
        throw error;
    }
};

// PUT /recipes-directions/{directionId}/image - Upload direction image
export const uploadRecipeDirectionImage = async (directionId: string, file: File): Promise<unknown> => {
    const { default: api } = await import('@/lib/axios');
    const formData = new FormData();
    formData.append('file', file);
    const result = await api.put(`/recipes-directions/${encodeURIComponent(directionId)}/image`, formData, {
        headers: {
            'Content-Type': undefined,
        },
    });
    return result.data;
};

// DELETE /recipe-ingredients/{recipeIngredientId} - Delete recipe ingredient
export const deleteRecipeIngredient = async (recipeIngredientId: string): Promise<void> => {
    try {
        await apiRequest<void>('delete', `/recipe-ingredients/${encodeURIComponent(recipeIngredientId)}`);
    } catch (error) {
        throw error;
    }
};

// DELETE /recipe-directions/{recipeDirectionId} - Delete recipe direction
export const deleteRecipeDirection = async (recipeDirectionId: string): Promise<void> => {
    try {
        await apiRequest<void>('delete', `/recipe-directions/${encodeURIComponent(recipeDirectionId)}`);
    } catch (error) {
        throw error;
    }
};

// POST /recipe-ingredients - Create recipe ingredient
export const createRecipeIngredient = async (payload: CreateRecipeIngredientInput): Promise<unknown> => {
    try {
        const result = await apiRequest<unknown>('post', '/recipe-ingredients', payload);
        return result;
    } catch (error) {
        throw error;
    }
};

// POST /recipe-directions - Create recipe direction
export const createRecipeDirection = async (payload: CreateRecipeDirectionInput): Promise<unknown> => {
    try {
        const result = await apiRequest<unknown>('post', '/recipe-directions', payload);
        return result;
    } catch (error) {
        throw error;
    }
};

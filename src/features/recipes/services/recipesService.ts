import { apiRequest } from '@/lib/apiRequest';
import type {
    IngredientInput,
    DirectionInput,
    RecipeDetailedInput,
    RecipeSummary
} from '../schema/recipeSchema';

// Re-export types for convenience
export type { IngredientInput, DirectionInput, RecipeDetailedInput, RecipeSummary };

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

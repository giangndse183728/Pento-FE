import { apiRequest } from '@/lib/apiRequest';

export type IngredientInput = {
    foodRefId: string;
    quantity: number;
    unitId: string;
    notes?: string;
};

export type DirectionInput = {
    stepNumber: number;
    description: string;
    image?: string | null;
};

export type RecipeDetailedInput = {
    title: string;
    description?: string;
    prepTimeMinutes?: number;
    cookTimeMinutes?: number;
    notes?: string;
    servings?: number;
    difficultyLevel?: string;
    image?: string | null;
    createdBy?: string;
    isPublic?: boolean;
    ingredients?: IngredientInput[];
    directions?: DirectionInput[];
};

export type RecipeSummary = {
    id: string;
    title: string;
    description?: string;
    prepTimeMinutes?: number;
    cookTimeMinutes?: number;
    totalTimes?: number;
    notes?: string;
    servings?: number;
    difficultyLevel?: string;
    image?: string | null;
    createdBy?: string;
    isPublic?: boolean;
    createdOnUtc?: string;
    updatedOnUtc?: string;
};

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

export type Unit = {
    id: string;
    name: string;
    abbreviation?: string;
    toBaseFactor?: number;
    type?: string;
};

export type FoodRef = {
    id: string;
    name: string;
    foodGroup?: string;
    unitType?: string;
    imageUrl?: string | null;
};

export const getUnits = async (): Promise<Unit[]> => {
    try {
        return await apiRequest<Unit[]>('get', '/units');
    } catch (err) {
        return [];
    }
};

export type FoodReferencesQuery = {
    foodGroup?: string;
    search?: string;
    page?: number;
    pageSize?: number;
};

export type FoodReferencesResponse = {
    items: FoodRef[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
};

export const getFoodReferences = async (params?: FoodReferencesQuery): Promise<FoodReferencesResponse> => {
    try {
        const qs = params
            ? '?' + Object.entries(params)
                .filter(([, v]) => v !== undefined && v !== null && v !== '')
                .map(([k, v]) => {
                    // trim string searches to avoid sending empty values
                    const val = typeof v === 'string' ? v.trim() : v;
                    const key = k === 'page' ? 'pageNumber' : k;
                    return `${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`;
                })
                .join('&')
            : '';

        const res = await apiRequest<unknown>('get', `/food-references${qs}`);

        // API may return either an array or an object with `items`.
        if (Array.isArray(res)) {
            return {
                items: res as FoodRef[],
                totalCount: res.length,
                pageNumber: params?.page ?? 1,
                pageSize: params?.pageSize ?? 24
            };
        }
        if (res && typeof res === 'object') {
            const asObj = res as Record<string, unknown>;
            if (Array.isArray(asObj.items)) {
                return {
                    items: asObj.items as FoodRef[],
                    totalCount: typeof asObj.totalCount === 'number' ? asObj.totalCount : asObj.items.length,
                    pageNumber: typeof asObj.pageNumber === 'number' ? asObj.pageNumber : params?.page ?? 1,
                    pageSize: typeof asObj.pageSize === 'number' ? asObj.pageSize : params?.pageSize ?? 24
                };
            }
        }

        return { items: [], totalCount: 0, pageNumber: 1, pageSize: 24 };
    } catch (err) {
        return { items: [], totalCount: 0, pageNumber: 1, pageSize: 24 };
    }
};

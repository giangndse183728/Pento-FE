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
    imageUrl?: string;
};

export type RecipeDetailedInput = {
    title: string;
    description?: string;
    prepTimeMinutes?: number;
    cookTimeMinutes?: number;
    notes?: string;
    servings?: number;
    difficultyLevel?: string;
    imageUrl?: string | null;
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
    imageUrl?: string | null;
    createdBy?: string;
    isPublic?: boolean;
    createdOnUtc?: string;
    updatedOnUtc?: string;
};

export const getRecipes = async (): Promise<RecipeSummary[]> => {
    try {
        return await apiRequest<RecipeSummary[]>('get', '/recipes');
    } catch (err) {
        console.error('getRecipes failed:', err);
        return [];
    }
};

export const postRecipeDetailed = async (payload: RecipeDetailedInput) => {
    return apiRequest<unknown>('post', '/recipes/detailed', payload);
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
        console.error('getUnits failed:', err);
        return [];
    }
};

export type FoodReferencesQuery = {
    foodGroup?: string;
    search?: string;
    page?: number;
    pageSize?: number;
};

export const getFoodReferences = async (params?: FoodReferencesQuery): Promise<FoodRef[]> => {
    try {
        const qs = params
            ? '?' + Object.entries(params)
                .filter(([, v]) => v !== undefined && v !== null && v !== '')
                .map(([k, v]) => {
                    // trim string searches to avoid sending empty values
                    const val = typeof v === 'string' ? v.trim() : v;
                    return `${encodeURIComponent(k)}=${encodeURIComponent(String(val))}`;
                })
                .join('&')
            : '';

        const res = await apiRequest<unknown>('get', `/food-references${qs}`);

        // API may return either an array or an object with `items`.
        if (Array.isArray(res)) return res as FoodRef[];
        if (res && typeof res === 'object') {
            const asObj = res as Record<string, unknown>;
            if (Array.isArray(asObj.items)) return asObj.items as unknown as FoodRef[];
        }

        return [];
    } catch (err) {
        console.error('getFoodReferences failed:', err);
        return [];
    }
};

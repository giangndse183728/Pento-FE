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

export const getRecipes = async (params: RecipesQuery): Promise<RecipeSummary[]> => {
    try {
        const qs = '?' + Object.entries(params)
            .filter(([, v]) => v !== undefined && v !== null && v !== '')
            .map(([k, v]) => {
                const val = typeof v === 'string' ? v.trim() : v;
                return `${encodeURIComponent(k)}=${encodeURIComponent(String(val))}`;
            })
            .join('&');
        const response = await apiRequest<PaginatedResponse<RecipeSummary>>('get', `/recipes${qs}`);
        // API returns paginated response, extract items array
        return response.items ?? [];
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
        console.error('getFoodReferences failed:', err);
        return { items: [], totalCount: 0, pageNumber: 1, pageSize: 24 };
    }
};

import api, { ApiResponse } from '@/lib/axios';

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
        const res = await api.get<ApiResponse<RecipeSummary[]>>('/recipes');
        return res.data?.data ?? [];
    } catch (err) {
        const axiosErr = err as { response?: { status?: number; data?: unknown } };
        console.error('getRecipes failed:', axiosErr.response?.status, axiosErr.response?.data ?? err);
        return [];
    }
};

export const postRecipeDetailed = async (payload: RecipeDetailedInput) => {
    const res = await api.post<ApiResponse<Record<string, unknown>>>('/recipes/detailed', payload);
    return res.data;
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
        const res = await api.get<ApiResponse<Unit[]>>('/units');
        return res.data?.data ?? [];
    } catch (err) {
        const axiosErr = err as { response?: { status?: number; data?: unknown } };
        console.error('getUnits failed:', axiosErr.response?.status, axiosErr.response?.data ?? err);
        return [];
    }
};

export const getFoodReferences = async (): Promise<FoodRef[]> => {
    try {
        const res = await api.get<ApiResponse<FoodRef[]>>('/food-references');
        return res.data?.data ?? [];
    } catch (err) {
        const axiosErr = err as { response?: { status?: number; data?: unknown } };
        console.error('getFoodReferences failed:', axiosErr.response?.status, axiosErr.response?.data ?? err);
        return [];
    }
};

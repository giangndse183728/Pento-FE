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

export const getFoodReferences = async (): Promise<FoodRef[]> => {
    try {
        return await apiRequest<FoodRef[]>('get', '/food-references');
    } catch (err) {
        console.error('getFoodReferences failed:', err);
        return [];
    }
};

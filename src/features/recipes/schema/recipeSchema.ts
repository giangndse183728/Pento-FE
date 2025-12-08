import * as z from 'zod';

// Ingredient (for POST /recipes/detailed)
export const ingredientSchema = z.object({
    foodRefId: z.string().uuid({ message: 'Invalid foodRefId (must be UUID)' }),
    quantity: z.number().positive({ message: 'Quantity must be > 0' }),
    unitId: z.string().uuid({ message: 'Invalid unitId (must be UUID)' }),
    notes: z.string().optional().nullable(),
});

// Direction (for POST /recipes/detailed)
export const directionSchema = z.object({
    stepNumber: z.number().int().positive({ message: 'stepNumber must be a positive integer' }),
    description: z.string().min(1, { message: 'Step description is required' }),
    image: z.string().url().optional().nullable(),
});

// POST /recipes/detailed payload
export const recipeDetailedSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    description: z.string().optional().nullable(),
    prepTimeMinutes: z.number().int().nonnegative().optional().nullable(),
    cookTimeMinutes: z.number().int().nonnegative().optional().nullable(),
    notes: z.string().optional().nullable(),
    servings: z.number().int().positive().optional().nullable(),
    difficultyLevel: z
        .enum(['Easy', 'Medium', 'Hard'])
        .optional()
        .nullable(),
    image: z.string().url().optional().nullable(),
    createdBy: z.string().uuid().optional().nullable(),
    isPublic: z.boolean().optional().default(true),
    ingredients: z.array(ingredientSchema).min(1, { message: 'At least one ingredient is required' }),
    directions: z.array(directionSchema).optional().nullable(),
});

// GET /recipes (summary item)
export const recipeSummarySchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable(),
    prepTimeMinutes: z.number().int().optional().nullable(),
    cookTimeMinutes: z.number().int().optional().nullable(),
    totalTimes: z.number().int().optional().nullable(),
    notes: z.string().nullable(),
    servings: z.number().int().optional().nullable(),
    difficultyLevel: z.string().nullable(),
    imageUrl: z.string().nullable(),
    createdBy: z.string().uuid().optional().nullable(),
    isPublic: z.boolean().optional(),
    createdOnUtc: z.string().optional().nullable(),
    updatedOnUtc: z.string().optional().nullable(),
});

// Inferred types from schemas
export type IngredientInput = z.infer<typeof ingredientSchema>;
export type DirectionInput = z.infer<typeof directionSchema>;
export type RecipeDetailedInput = z.infer<typeof recipeDetailedSchema>;
export type RecipeSummary = z.infer<typeof recipeSummarySchema>;
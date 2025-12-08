export type FoodRef = {
    id: string;
    name: string;
    foodGroup?: string;
    unitType?: string;
    imageUrl?: string | null;
};

export type FoodReferenceDetail = {
    id: string;
    name: string;
    foodGroup?: string | null;
    notes?: string | null;
    foodCategoryId?: number | null;
    brand?: string | null;
    barcode?: string | null;
    usdaId?: string | null;
    typicalShelfLifeDays_Pantry?: number | null;
    typicalShelfLifeDays_Fridge?: number | null;
    typicalShelfLifeDays_Freezer?: number | null;
    addedBy?: string | null;
    imageUrl?: string | null;
    unitType?: string | null;
    createdOnUtc?: string;
    updatedOnUtc?: string;
};

export type CreateFoodReferenceInput = {
    name: string;
    foodGroup?: string | null;
    notes?: string | null;
    foodCategoryId?: number | null;
    brand?: string | null;
    barcode?: string | null;
    usdaId?: string | null;
    typicalShelfLifeDays_Pantry?: number | null;
    typicalShelfLifeDays_Fridge?: number | null;
    typicalShelfLifeDays_Freezer?: number | null;
    addedBy?: string | null;
    imageUrl?: string | null;
    unitType?: string | null;
};

export type UpdateFoodReferenceInput = {
    name?: string | null;
    foodGroup?: string | null;
    notes?: string | null;
    brand?: string | null;
    usdaId?: string | null;
    typicalShelfLifeDays_Pantry?: number | null;
    typicalShelfLifeDays_Fridge?: number | null;
    typicalShelfLifeDays_Freezer?: number | null;
    unitType?: string | null;
};

export type UploadFoodReferenceImageInput = {
    imageUri: string;
};

// FoodGroup enum values (for reference)
export const FoodGroupEnum = {
    Meat: 1,
    Seafood: 2,
    FruitsVegetables: 3,
    Dairy: 4,
    CerealGrainsPasta: 5,
    LegumesNutsSeeds: 6,
    FatsOils: 7,
    Confectionery: 8,
    Beverages: 9,
    Condiments: 10,
    MixedDishes: 11,
} as const;

export type FoodGroupEnumType = typeof FoodGroupEnum[keyof typeof FoodGroupEnum];

export type FoodReferencesQuery = {
    foodGroup?: string;
    search?: string;
    hasImage?: boolean;
    sortBy?: 'Name' | 'FoodGroup' | 'Brand' | 'CreatedAt';
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    pageSize?: number;
};

export type FoodReferencesResponse = {
    items: FoodRef[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
};

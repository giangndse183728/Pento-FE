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
    foodCategoryId?: number | null;
    brand?: string | null;
    barcode?: string | null;
    usdaId?: string | null;
    typicalShelfLifeDays_Pantry?: number | null;
    typicalShelfLifeDays_Fridge?: number | null;
    typicalShelfLifeDays_Freezer?: number | null;
    imageUrl?: string | null;
    unitType?: string | null;
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

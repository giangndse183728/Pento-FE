// Schema types
export type {
    FoodRef,
    FoodReferenceDetail,
    FoodReferencesQuery,
    FoodReferencesResponse,
    CreateFoodReferenceInput,
    UpdateFoodReferenceInput,
    UploadFoodReferenceImageInput
} from './schema/foodReferenceSchema';

// Services
export {
    getFoodReferences,
    getFoodReferenceById,
    createFoodReference,
    updateFoodReference,
    uploadFoodReferenceImage
} from './services/foodReferenceService';

// Hooks
export {
    useFoodReferences,
    useFoodReferenceById,
    useCreateFoodReference,
    useUpdateFoodReference,
    useUploadFoodReferenceImage
} from './hooks/useFoodReferences';

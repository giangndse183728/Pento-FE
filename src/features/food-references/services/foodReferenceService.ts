import { apiRequest } from '@/lib/apiRequest';
import type {
    FoodRef,
    FoodReferenceDetail,
    FoodReferencesQuery,
    FoodReferencesResponse,
    CreateFoodReferenceInput,
    UpdateFoodReferenceInput,
    UploadFoodReferenceImageInput
} from '../schema/foodReferenceSchema';

// GET /food-references - List with pagination
export const getFoodReferences = async (params?: FoodReferencesQuery): Promise<FoodReferencesResponse> => {
    try {
        // Map frontend parameter names to API parameter names
        const paramKeyMap: Record<string, string> = {
            page: 'pageNumber',
            sortBy: 'SortBy',
            sortOrder: 'SortOrder',
            hasImage: 'HasImage',
            foodGroup: 'FoodGroup',
            search: 'Search',
        };

        const qs = params
            ? '?' + Object.entries(params)
                .filter(([, v]) => v !== undefined && v !== null && v !== '')
                .map(([k, v]) => {
                    const val = typeof v === 'string' ? v.trim() : v;
                    const key = paramKeyMap[k] || k;
                    return `${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`;
                })
                .join('&')
            : '';

        console.log('getFoodReferences query string:', `/food-references${qs}`);
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

// GET /food-references/{id} - Get single food reference by ID
export const getFoodReferenceById = async (id: string): Promise<FoodReferenceDetail> => {
    const res = await apiRequest<FoodReferenceDetail>('get', `/food-references/${encodeURIComponent(id)}`);
    return res;
};

// POST /food-references - Create new food reference
export const createFoodReference = async (payload: CreateFoodReferenceInput): Promise<FoodReferenceDetail> => {
    const res = await apiRequest<FoodReferenceDetail>('post', '/food-references', payload);
    return res;
};

// PUT /food-references/{id} - Update existing food reference
export const updateFoodReference = async (id: string, payload: UpdateFoodReferenceInput): Promise<FoodReferenceDetail> => {
    const res = await apiRequest<FoodReferenceDetail>('put', `/food-references/${encodeURIComponent(id)}`, payload);
    return res;
};

// POST /food-references/{id}/upload-image - Upload image for food reference
export const uploadFoodReferenceImage = async (id: string, payload: UploadFoodReferenceImageInput): Promise<FoodReferenceDetail> => {
    const res = await apiRequest<FoodReferenceDetail>('post', `/food-references/${encodeURIComponent(id)}/upload-image`, payload);
    return res;
};

// DELETE /food-references/{id} - Delete food reference
export const deleteFoodReference = async (id: string): Promise<void> => {
    await apiRequest<void>('delete', `/food-references/${encodeURIComponent(id)}`);
};

// Re-export types for convenience
export type {
    FoodRef,
    FoodReferenceDetail,
    FoodReferencesQuery,
    FoodReferencesResponse,
    CreateFoodReferenceInput,
    UpdateFoodReferenceInput,
    UploadFoodReferenceImageInput,
    DeleteFoodReferenceResponse
} from '../schema/foodReferenceSchema';

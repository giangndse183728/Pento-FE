import { apiRequest } from '@/lib/apiRequest';
import type {
    FoodRef,
    FoodReferenceDetail,
    FoodReferencesQuery,
    FoodReferencesResponse,
    CreateFoodReferenceInput,
    UpdateFoodReferenceInput
} from '../schema/foodReferenceSchema';

// GET /food-references - List with pagination
export const getFoodReferences = async (params?: FoodReferencesQuery): Promise<FoodReferencesResponse> => {
    try {
        const qs = params
            ? '?' + Object.entries(params)
                .filter(([, v]) => v !== undefined && v !== null && v !== '')
                .map(([k, v]) => {
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

// Re-export types for convenience
export type {
    FoodRef,
    FoodReferenceDetail,
    FoodReferencesQuery,
    FoodReferencesResponse,
    CreateFoodReferenceInput,
    UpdateFoodReferenceInput
} from '../schema/foodReferenceSchema';

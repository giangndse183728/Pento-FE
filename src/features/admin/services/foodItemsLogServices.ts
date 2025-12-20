import { apiRequest } from '@/lib/apiRequest';
import type {
    GetFoodItemLogSummaryParams,
    LogSummary,
    FoodItemSummary,
    FoodItemLogSummaryResponse,
} from '../schema/foodItemSchema';

// Re-export types for backward compatibility
export type {
    GetFoodItemLogSummaryParams,
    LogSummary,
    FoodItemSummary,
    FoodItemLogSummaryResponse,
};

export async function getFoodItemLogSummary(params: GetFoodItemLogSummaryParams = {}): Promise<FoodItemLogSummaryResponse> {
    const query = new URLSearchParams();

    if (params.householdId) query.set('householdId', params.householdId);
    if (params.fromDate) query.set('fromDate', params.fromDate);
    if (params.toDate) query.set('toDate', params.toDate);
    if (params.weightUnitId) query.set('weightUnitId', params.weightUnitId);
    if (params.volumeUnitId) query.set('volumeUnitId', params.volumeUnitId);
    if (typeof params.isDeleted === 'boolean') query.set('isDeleted', String(params.isDeleted));

    const url = query.toString()
        ? `/admin/food-item-logs/summary?${query.toString()}`
        : '/admin/food-item-logs/summary';

    return apiRequest<FoodItemLogSummaryResponse>('get', url);
}

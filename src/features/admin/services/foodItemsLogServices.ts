import { apiRequest } from '@/lib/apiRequest';

export type GetFoodItemLogSummaryParams = {
    householdId?: string;
    fromDate?: string;
    toDate?: string;
    weightUnitId?: string;
    volumeUnitId?: string;
    isDeleted?: boolean;
};

export type LogSummary = {
    intakeByWeight: number;
    intakeByVolume: number;
    consumptionByWeight: number;
    consumptionByVolume: number;
    discardByWeight: number;
    discardByVolume: number;
};

export type FoodItemSummary = {
    totalFoodItems: number;
    freshCount: number;
    expiringCount: number;
    expiredCount: number;
    freshByWeight: number;
    freshByVolume: number;
    expiringByWeight: number;
    expiringByVolume: number;
    expiredByWeight: number;
    expiredByVolume: number;
};

export type FoodItemLogSummaryResponse = {
    weightUnit: string;
    volumeUnit: string;
    logSummary: LogSummary;
    foodItemSummary: FoodItemSummary;
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

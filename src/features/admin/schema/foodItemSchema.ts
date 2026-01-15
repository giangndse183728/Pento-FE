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

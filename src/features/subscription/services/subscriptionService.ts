import { apiRequest } from '@/lib/apiRequest';

export type Subscription = {
    id?: string;
    subscriptionId?: string;
    name: string;
    description?: string | null;
    isActive: boolean;
    createdOnUtc?: string;
    updatedOnUtc?: string;
    plans?: Array<{
        subscriptionPlanId: string;
        price: string;
        duration: string;
    }>;
    features?: Array<{
        subscriptionFeatureId: string;
        featureName: string;
        entitlement: string;
    }>;
};

export type SubscriptionPlan = {
    id: string;
    subscriptionId: string;
    amount: number;
    currency: string;
    durationInDays: number;
    createdOnUtc?: string;
    updatedOnUtc?: string;
};

export type SubscriptionFeature = {
    id: string;
    subscriptionId: string;
    featureCode: string;
    entitlementQuota: number;
    entitlementResetPer?: 'Day' | 'Week' | 'Month' | 'Year';
    createdOnUtc?: string;
    updatedOnUtc?: string;
};

export type CreateSubscriptionPayload = {
    name: string;
    description?: string;
    isActive: boolean;
};

export type CreateSubscriptionPlanPayload = {
    amount: number;
    currency: string;
    durationInDays?: number;
};

export type CreateSubscriptionFeaturePayload = {
    featureCode: string;
    quota: number;
    resetPeriod?: 'Day' | 'Week' | 'Month' | 'Year';
};

export type FeatureDefinition = {
    featureCode: string;
    name: string;
    description: string;
    defaultEntitlement: string;
};

export type SubscriptionListResponse =
    | Subscription[]
    | {
        items: Subscription[];
    };

export type UpdateSubscriptionFeatureInput = {
    featureCode?: string;
    entitlementQuota?: number;
    entitlementResetPer?: string;
};


const assertId = (subscriptionId: string) => {
    if (!subscriptionId || !subscriptionId.trim()) {
        throw new Error('A valid subscriptionId is required');
    }
    return subscriptionId.trim();
};

export const createSubscription = async (payload: CreateSubscriptionPayload) => {
    const name = payload?.name?.trim();
    const description = payload?.description?.trim();
    if (!name) {
        throw new Error('Subscription name is required');
    }
    if (!description) {
        throw new Error('Description is required');
    }

    return apiRequest<Subscription>('post', '/admin/subscriptions', {
        name,
        description,
        isActive: payload.isActive,
    });
};

export const addSubscriptionPlan = async (subscriptionId: string, payload: CreateSubscriptionPlanPayload) => {
    return apiRequest<SubscriptionPlan>('post', `/admin/subscriptions/${assertId(subscriptionId)}/plans`, payload);
};

export const addSubscriptionFeature = async (subscriptionId: string, payload: CreateSubscriptionFeaturePayload) => {
    return apiRequest<SubscriptionFeature>('post', `/admin/subscriptions/${assertId(subscriptionId)}/features`, payload);
};

export const getFeatures = async (): Promise<FeatureDefinition[]> => {
    try {
        const result = await apiRequest<FeatureDefinition[]>('get', '/admin/features');
        if (Array.isArray(result)) {
            return result;
        }
    } catch (err) {
        console.error('getFeatures failed:', err);
    }
    return [];
};

export const getSubscriptions = async (): Promise<Subscription[]> => {
    try {
        const response = await apiRequest<SubscriptionListResponse>('get', '/subscriptions');
        if (Array.isArray(response)) {
            return response;
        }
        if (response && Array.isArray(response.items)) {
            return response.items as Subscription[];
        }
    } catch (error) {
        console.error('getSubscriptions failed:', error);
    }
    return [];
};

export const deleteSubscriptionAdmin = async (subscriptionId: string): Promise<void> => {
    try {
        await apiRequest<void>('delete', `/admin/subscriptions/${encodeURIComponent(subscriptionId)}`);
    } catch (error) {
        console.error('deleteSubscriptionAdmin failed:', error);
        throw error;
    }
};

export const getSubscriptionById = async (subscriptionId: string): Promise<Subscription | null> => {
    try {
        const res = await apiRequest<Subscription>('get', `/subscriptions/${encodeURIComponent(subscriptionId)}`);
        return res ?? null;
    } catch (error) {
        console.error('getSubscriptionById failed:', error);
        return null;
    }
};

export const updateSubscriptionFeatureAdmin = async (
    subscriptionFeatureId: string,
    payload: UpdateSubscriptionFeatureInput,
): Promise<void> => {
    try {
        await apiRequest<void>('put', `/admin/subscriptions/features/${encodeURIComponent(subscriptionFeatureId)}`, payload);
    } catch (error) {
        console.error('updateSubscriptionFeatureAdmin failed:', error);
        throw error;
    }
};

export const deleteSubscriptionFeatureAdmin = async (subscriptionFeatureId: string): Promise<void> => {
    try {
        await apiRequest<void>('delete', `/admin/subscriptions/features/${encodeURIComponent(subscriptionFeatureId)}`);
    } catch (error) {
        console.error('deleteSubscriptionFeatureAdmin failed:', error);
        throw error;
    }
};


export type UpdateSubscriptionPlanInput = {
    amount?: number;
    currency?: string;
    durationInDays?: number;
};

export const updateSubscriptionPlanAdmin = async (
    subscriptionPlanId: string,
    payload: UpdateSubscriptionPlanInput,
): Promise<void> => {
    try {
        await apiRequest<void>('put', `/admin/subscriptions/plans/${encodeURIComponent(subscriptionPlanId)}`, payload);
    } catch (error) {
        console.error('updateSubscriptionPlanAdmin failed:', error);
        throw error;
    }
};

export const deleteSubscriptionPlanAdmin = async (subscriptionPlanId: string): Promise<void> => {
    try {
        await apiRequest<void>('delete', `/admin/subscriptions/plans/${encodeURIComponent(subscriptionPlanId)}`);
    } catch (error) {
        console.error('deleteSubscriptionPlanAdmin failed:', error);
        throw error;
    }
};


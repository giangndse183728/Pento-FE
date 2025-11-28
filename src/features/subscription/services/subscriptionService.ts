import { apiRequest } from '@/lib/apiRequest';

export type Subscription = {
    id: string;
    subscriptionId?: string;
    name: string;
    description?: string | null;
    isActive: boolean;
    createdOnUtc?: string;
    updatedOnUtc?: string;
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
    entitlementResetPer: 'Day' | 'Week' | 'Month' | 'Year';
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
    durationInDays: number;
};

export type CreateSubscriptionFeaturePayload = {
    featureCode: string;
    entitlementQuota: number;
    entitlementResetPer: SubscriptionFeature['entitlementResetPer'];
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

    return apiRequest<Subscription>('post', '/subscriptions', {
        name,
        description,
        isActive: payload.isActive,
    });
};

export const addSubscriptionPlan = async (subscriptionId: string, payload: CreateSubscriptionPlanPayload) => {
    return apiRequest<SubscriptionPlan>('post', `/subscriptions/${assertId(subscriptionId)}/plans`, payload);
};

export const addSubscriptionFeature = async (subscriptionId: string, payload: CreateSubscriptionFeaturePayload) => {
    return apiRequest<SubscriptionFeature>('post', `/subscriptions/${assertId(subscriptionId)}/features`, payload);
};

export const getFeatures = async (): Promise<FeatureDefinition[]> => {
    try {
        const result = await apiRequest<FeatureDefinition[]>('get', '/features');
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


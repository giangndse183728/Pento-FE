import { apiRequest } from '@/lib/apiRequest';
import {
    Subscription,
    SubscriptionPlan,
    SubscriptionFeature,
    CreateSubscriptionPayload,
    CreateSubscriptionPlanPayload,
    CreateSubscriptionFeaturePayload,
    FeatureDefinition,
    SubscriptionListResponse,
    UpdateSubscriptionFeatureInput,
    UpdateSubscriptionPlanInput,
    UpdateSubscriptionInput,
    EditSubForm,
    EditPlanForm,
    EditFeatureForm,
} from '../schema/subscriptionSchema';

export type {
    Subscription,
    SubscriptionPlan,
    SubscriptionFeature,
    CreateSubscriptionPayload,
    CreateSubscriptionPlanPayload,
    CreateSubscriptionFeaturePayload,
    FeatureDefinition,
    SubscriptionListResponse,
    UpdateSubscriptionFeatureInput,
    UpdateSubscriptionPlanInput,
    UpdateSubscriptionInput,
    EditSubForm,
    EditPlanForm,
    EditFeatureForm,
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

export const updateSubscriptionAdmin = async (
    subscriptionId: string,
    payload: UpdateSubscriptionInput,
): Promise<void> => {
    try {
        await apiRequest<void>('patch', `/admin/subscriptions/${encodeURIComponent(subscriptionId)}`, payload);
    } catch (error) {
        console.error('updateSubscriptionAdmin failed:', error);
        throw error;
    }
};

export const updateSubscriptionFeatureAdmin = async (
    subscriptionFeatureId: string,
    payload: UpdateSubscriptionFeatureInput,
): Promise<void> => {
    try {
        await apiRequest<void>('patch', `/admin/subscriptions/features/${encodeURIComponent(subscriptionFeatureId)}`, payload);
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

export const updateSubscriptionPlanAdmin = async (
    subscriptionPlanId: string,
    payload: UpdateSubscriptionPlanInput,
): Promise<void> => {
    try {
        await apiRequest<void>('patch', `/admin/subscriptions/plans/${encodeURIComponent(subscriptionPlanId)}`, payload);
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


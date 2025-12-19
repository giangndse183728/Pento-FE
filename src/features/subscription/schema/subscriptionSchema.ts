import * as z from 'zod';

export const entitlementResetSchema = z.enum(['Day', 'Week', 'Month', 'Year']);

export const subscriptionSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().max(1000).optional().nullable(),
    isActive: z.boolean().default(true),
    createdOnUtc: z.string().datetime().optional().nullable(),
    updatedOnUtc: z.string().datetime().optional().nullable(),
});

export const createSubscriptionSchema = subscriptionSchema
    .omit({ id: true, createdOnUtc: true, updatedOnUtc: true })
    .extend({
        name: z.string().min(1, { message: 'Name is required' }).max(120),
        description: z.string().min(1, { message: 'Description is required' }).max(1000),
        isActive: z.boolean().default(true),
    });

export const subscriptionPlanSchema = z.object({
    id: z.string().uuid(),
    subscriptionId: z.string().uuid(),
    amount: z.number().nonnegative(),
    currency: z.string().min(1).max(10),
    durationInDays: z.number().int().positive(),
    createdOnUtc: z.string().datetime().optional().nullable(),
    updatedOnUtc: z.string().datetime().optional().nullable(),
});

export const createSubscriptionPlanSchema = subscriptionPlanSchema
    .omit({
        id: true,
        subscriptionId: true,
        createdOnUtc: true,
        updatedOnUtc: true,
    });

export const subscriptionFeatureSchema = z.object({
    id: z.string().uuid(),
    subscriptionId: z.string().uuid(),
    featureCode: z.string().min(1),
    entitlementQuota: z.number().int().nonnegative(),
    entitlementResetPer: entitlementResetSchema.optional(),
    createdOnUtc: z.string().datetime().optional().nullable(),
    updatedOnUtc: z.string().datetime().optional().nullable(),
});

export const createSubscriptionFeatureSchema = subscriptionFeatureSchema.omit({
    id: true,
    subscriptionId: true,
    createdOnUtc: true,
    updatedOnUtc: true,
});

// TypeScript Types
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
    quota?: number;
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

export type UpdateSubscriptionPlanInput = {
    amount?: number;
    currency?: string;
    durationInDays?: number;
};

export type UpdateSubscriptionInput = {
    name?: string;
    description?: string;
    isActive?: boolean;
};

// Edit form types 
export type EditSubForm = {
    name: string;
    description: string;
    isActive: boolean;
};

export type EditPlanForm = {
    planId: string;
    amount: number;
    currency: string;
    durationInDays: number;
};

export type EditFeatureForm = {
    featureId: string;
    featureCode: string;
    quota: number;
    resetPeriod: string;
};


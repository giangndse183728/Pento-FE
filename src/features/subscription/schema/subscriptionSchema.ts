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


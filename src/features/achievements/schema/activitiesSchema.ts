import { z } from 'zod';

export const ActivitySchema = z.object({
    activityCode: z.string().min(1, 'Activity code is required'),
    name: z.string().min(1, 'Activity name is required'),
    description: z.string().optional().nullable(),
});

export type Activity = z.infer<typeof ActivitySchema>;

export const GetActivitiesParamsSchema = z.object({
    searchText: z.string().optional(),
});

export type GetActivitiesParams = z.infer<typeof GetActivitiesParamsSchema>;

export const UpdateActivitySchema = z.object({
    name: z.string().min(1, 'Activity name is required'),
    description: z.string().min(1, 'Description is required'),
});

export type UpdateActivity = z.infer<typeof UpdateActivitySchema>;

export const CreateMilestoneRequirementSchema = z.object({
    activityCode: z.string().min(1, 'Activity code is required'),
    quota: z.number().min(1, 'Quota must be at least 1'),
    withinDays: z.number().optional(),
});

export type CreateMilestoneRequirement = z.infer<typeof CreateMilestoneRequirementSchema>;

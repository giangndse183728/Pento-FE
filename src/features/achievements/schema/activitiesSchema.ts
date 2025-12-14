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

// ===== Admin User Activities =====

export const UserActivitySchema = z.object({
    id: z.string(),
    userId: z.string(),
    activityCode: z.string(),
    activityName: z.string().optional(),
    description: z.string().optional().nullable(),
    createdAt: z.string(), // ISO date-time
});

export type UserActivity = z.infer<typeof UserActivitySchema>;

export const GetUserActivitiesParamsSchema = z.object({
    activityCodes: z.array(z.string()).optional(),
    keyword: z.string().optional(),
    from: z.string().optional(), // ISO date-time
    to: z.string().optional(),   // ISO date-time
    sort: z.string().optional(),
    order: z.enum(['ASC', 'DESC']).optional(),
    pageNumber: z.number().optional(),
    pageSize: z.number().optional(),
});

export type GetUserActivitiesParams = z.infer<typeof GetUserActivitiesParamsSchema>;

export const PaginatedUserActivitiesSchema = z.object({
    currentPage: z.number(),
    totalPages: z.number(),
    pageSize: z.number(),
    totalCount: z.number(),
    hasPrevious: z.boolean(),
    hasNext: z.boolean(),
    items: z.array(UserActivitySchema),
});

export type PaginatedUserActivities = z.infer<typeof PaginatedUserActivitiesSchema>;

// ===== Activity Statistics (Aggregated by Date) =====

export const ActivityCountByDateSchema = z.object({
    date: z.string(), // YYYY-MM-DD
    count: z.number(),
});

export type ActivityCountByDate = z.infer<typeof ActivityCountByDateSchema>;

export const ActivityStatsSchema = z.object({
    code: z.string(),
    name: z.string(),
    totalCount: z.number(),
    countByDate: z.array(ActivityCountByDateSchema),
});

export type ActivityStats = z.infer<typeof ActivityStatsSchema>;

export const GetActivityStatsParamsSchema = z.object({
    codes: z.array(z.string()).optional(),
    householdIds: z.array(z.string()).optional(),
    fromDate: z.string().optional(), // YYYY-MM-DD
    toDate: z.string().optional(),   // YYYY-MM-DD
    timeWindow: z.string().optional(),
});

export type GetActivityStatsParams = z.infer<typeof GetActivityStatsParamsSchema>;

export type ActivityStatsResponse = ActivityStats[];

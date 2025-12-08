import { z } from 'zod';

export const MilestoneSchema = z.object({
    id: z.string().min(1, 'ID is required'),
    icon: z.string().nullable(),
    name: z.string().min(1, 'Name is required'),
    description: z.string(),
    isActive: z.boolean(),
    earnedCount: z.number().min(0),
    isDeleted: z.boolean(),
});

export type Milestone = z.infer<typeof MilestoneSchema>;

export const CreateMilestoneSchema = z.object({
    name: z.string().min(1, 'Name is required').nullable(),
    description: z.string().nullable(),
    isActive: z.boolean(),
});

export type CreateMilestone = z.infer<typeof CreateMilestoneSchema>;

export const UpdateMilestoneSchema = z.object({
    name: z.string().min(1, 'Name is required').nullable(),
    description: z.string().nullable(),
    isActive: z.boolean(),
});

export type UpdateMilestone = z.infer<typeof UpdateMilestoneSchema>;

export const CreateMilestoneRequirementSchema = z.object({
    activityCode: z.string().min(1, 'Activity code is required'),
    quota: z.number().min(1, 'Quota must be at least 1'),
    withinDays: z.number().min(0, 'Within days must be at least 0').optional(),
});

export type CreateMilestoneRequirement = z.infer<typeof CreateMilestoneRequirementSchema>;

export const GetMilestonesParamsSchema = z.object({
    searchText: z.string().optional(),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    sortBy: z.enum(['Id', 'Name', 'EarnedCount']).optional(),
    order: z.enum(['ASC', 'DESC']).optional(),
    pageNumber: z.number().optional(),
    pageSize: z.number().optional(),
});

export type GetMilestonesParams = z.infer<typeof GetMilestonesParamsSchema>;

export const PaginatedMilestonesSchema = z.object({
    currentPage: z.number(),
    totalPages: z.number(),
    pageSize: z.number(),
    totalCount: z.number(),
    hasPrevious: z.boolean(),
    hasNext: z.boolean(),
    items: z.array(MilestoneSchema),
});

export type PaginatedMilestones = z.infer<typeof PaginatedMilestonesSchema>;

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getActivities, updateActivity, createMilestoneRequirement, getUserActivities } from '../services/activitiesServices';
import { GetActivitiesParamsSchema, UpdateActivitySchema, CreateMilestoneRequirementSchema, GetUserActivitiesParamsSchema } from '../schema/activitiesSchema';
import type { GetActivitiesParams, UpdateActivity, CreateMilestoneRequirement, GetUserActivitiesParams } from '../schema/activitiesSchema';

export const useActivities = (params?: GetActivitiesParams) => {
    const validatedParams = params ? GetActivitiesParamsSchema.safeParse(params) : { success: true, data: undefined };

    return useQuery({
        queryKey: ['activities', params?.searchText],
        queryFn: () => getActivities(validatedParams.success ? validatedParams.data : undefined),
        staleTime: 1000 * 60 * 5,
        enabled: validatedParams.success,
    });
};

export const useUpdateActivity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ activityCode, payload }: { activityCode: string; payload: UpdateActivity }) => {
            const validatedPayload = UpdateActivitySchema.parse(payload);
            return updateActivity(activityCode, validatedPayload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activities'] });
        },
    });
};

export const useCreateMilestoneRequirement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ milestoneId, payload }: { milestoneId: string; payload: CreateMilestoneRequirement }) => {
            const validatedPayload = CreateMilestoneRequirementSchema.parse(payload);
            return createMilestoneRequirement(milestoneId, validatedPayload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['milestones'] });
        },
    });
};

// ===== Admin User Activities =====

export const useUserActivities = (params?: GetUserActivitiesParams) => {
    const validatedParams = params ? GetUserActivitiesParamsSchema.safeParse(params) : { success: true, data: undefined };

    return useQuery({
        queryKey: [
            'userActivities',
            params?.activityCodes,
            params?.keyword,
            params?.from,
            params?.to,
            params?.sort,
            params?.order,
            params?.pageNumber,
            params?.pageSize,
        ],
        queryFn: () => getUserActivities(validatedParams.success ? validatedParams.data : undefined),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: validatedParams.success,
    });
};

// ===== Activity Statistics (Aggregated by Date) =====

import { getActivityStats } from '../services/activitiesServices';
import { GetActivityStatsParamsSchema } from '../schema/activitiesSchema';
import type { GetActivityStatsParams } from '../schema/activitiesSchema';

export const useActivityStats = (params?: GetActivityStatsParams) => {
    const validatedParams = params ? GetActivityStatsParamsSchema.safeParse(params) : { success: true, data: undefined };

    return useQuery({
        queryKey: [
            'activityStats',
            params?.codes,
            params?.householdIds,
            params?.fromDate,
            params?.toDate,
            params?.timeWindow,
        ],
        queryFn: () => getActivityStats(validatedParams.success ? validatedParams.data : undefined),
        staleTime: 0, // Always refetch when params change
        enabled: validatedParams.success,
    });
};

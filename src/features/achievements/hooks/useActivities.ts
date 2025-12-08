'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getActivities, updateActivity, createMilestoneRequirement } from '../services/activitiesServices';
import { GetActivitiesParamsSchema, UpdateActivitySchema, CreateMilestoneRequirementSchema } from '../schema/activitiesSchema';
import type { GetActivitiesParams, UpdateActivity, CreateMilestoneRequirement } from '../schema/activitiesSchema';

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

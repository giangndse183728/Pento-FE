'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getMilestones,
    getMilestoneById,
    createMilestone,
    updateMilestone,
    deleteMilestone,
    updateMilestoneIcon,
    createMilestoneRequirement
} from '../services/milestoneServices';
import {
    GetMilestonesParamsSchema,
    CreateMilestoneSchema,
    UpdateMilestoneSchema,
    CreateMilestoneRequirementSchema
} from '../schema/milestonesSchema';
import type {
    GetMilestonesParams,
    CreateMilestone,
    UpdateMilestone,
    CreateMilestoneRequirement
} from '../schema/milestonesSchema';

export const useMilestones = (params?: GetMilestonesParams) => {
    const validatedParams = params ? GetMilestonesParamsSchema.safeParse(params) : { success: true, data: undefined };

    return useQuery({
        queryKey: ['milestones', params],
        queryFn: () => getMilestones(validatedParams.success ? validatedParams.data : undefined),
        staleTime: 1000 * 60 * 5,
        enabled: validatedParams.success,
    });
};

export const useMilestoneById = (milestoneId: string | null) => {
    return useQuery({
        queryKey: ['milestone', milestoneId],
        queryFn: () => getMilestoneById(milestoneId!),
        staleTime: 1000 * 60 * 5,
        enabled: !!milestoneId,
    });
};

export const useCreateMilestone = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateMilestone) => {
            const validatedPayload = CreateMilestoneSchema.parse(payload);
            return createMilestone(validatedPayload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['milestones'] });
        },
    });
};

export const useUpdateMilestone = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ milestoneId, payload }: { milestoneId: string; payload: UpdateMilestone }) => {
            const validatedPayload = UpdateMilestoneSchema.parse(payload);
            return updateMilestone(milestoneId, validatedPayload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['milestones'] });
        },
    });
};

export const useDeleteMilestone = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (milestoneId: string) => {
            return deleteMilestone(milestoneId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['milestones'] });
        },
    });
};

export const useUpdateMilestoneIcon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ milestoneId, iconFile }: { milestoneId: string; iconFile: File }) => {
            return updateMilestoneIcon(milestoneId, iconFile);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['milestones'] });
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

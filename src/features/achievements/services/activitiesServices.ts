import { apiRequest } from '@/lib/apiRequest';

export type Activity = {
    activityCode: string;
    name: string;
    description: string;
};

export type GetActivitiesParams = {
    searchText?: string;
};

export type UpdateActivityRequest = {
    name: string;
    description: string;
};

export type CreateMilestoneRequirementRequest = {
    activityCode: string;
    quota: number;
    withinDays?: number;
};

export const getActivities = async (params?: GetActivitiesParams): Promise<Activity[]> => {
    try {
        const qs = params?.searchText
            ? `?searchText=${encodeURIComponent(params.searchText)}`
            : '';
        const response = await apiRequest<Activity[]>('get', `/admin/activities${qs}`);
        return response || [];
    } catch (err) {
        console.error('getActivities failed:', err);
        return [];
    }
};

export const updateActivity = async (activityCode: string, payload: UpdateActivityRequest): Promise<Activity> => {
    try {
        const response = await apiRequest<Activity>('put', `/admin/activities/${activityCode}`, payload);
        return response || {
            activityCode,
            name: '',
            description: '',
        };
    } catch (err) {
        console.error('updateActivity failed:', err);
        throw err;
    }
};

export const createMilestoneRequirement = async (
    milestoneId: string,
    payload: CreateMilestoneRequirementRequest
): Promise<void> => {
    try {
        await apiRequest<void>('post', `/admin/milestones/${milestoneId}/requirements`, payload);
    } catch (err) {
        console.error('createMilestoneRequirement failed:', err);
        throw err;
    }
};

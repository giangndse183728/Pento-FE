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

// ===== Admin User Activities =====

export type UserActivity = {
    id: string;
    userId: string;
    activityCode: string;
    activityName?: string;
    description?: string | null;
    createdAt: string;
};

export type GetUserActivitiesParams = {
    activityCodes?: string[];
    keyword?: string;
    from?: string; // ISO date-time
    to?: string;   // ISO date-time
    sort?: string;
    order?: 'ASC' | 'DESC';
    pageNumber?: number;
    pageSize?: number;
};

export type PaginatedUserActivities = {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    items: UserActivity[];
};

export const getUserActivities = async (params?: GetUserActivitiesParams): Promise<PaginatedUserActivities> => {
    try {
        const queryParams = new URLSearchParams();

        if (params?.activityCodes && params.activityCodes.length > 0) {
            params.activityCodes.forEach(code => queryParams.append('activityCodes', code));
        }
        if (params?.keyword) queryParams.append('keyword', params.keyword);
        if (params?.from) queryParams.append('from', params.from);
        if (params?.to) queryParams.append('to', params.to);
        if (params?.sort) queryParams.append('sort', params.sort);
        if (params?.order) queryParams.append('order', params.order);
        if (typeof params?.pageNumber === 'number') queryParams.append('pageNumber', String(params.pageNumber));
        if (typeof params?.pageSize === 'number') queryParams.append('pageSize', String(params.pageSize));

        const qs = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const response = await apiRequest<PaginatedUserActivities>('get', `/admin/users/activities${qs}`);

        return response || {
            currentPage: params?.pageNumber ?? 1,
            totalPages: 0,
            pageSize: params?.pageSize ?? 10,
            totalCount: 0,
            hasPrevious: false,
            hasNext: false,
            items: [],
        };
    } catch (err) {
        console.error('getUserActivities failed:', err);
        return {
            currentPage: params?.pageNumber ?? 1,
            totalPages: 0,
            pageSize: params?.pageSize ?? 10,
            totalCount: 0,
            hasPrevious: false,
            hasNext: false,
            items: [],
        };
    }
};

// ===== Activity Statistics (Aggregated by Date) =====

export type ActivityCountByDate = {
    date: string; // YYYY-MM-DD
    count: number;
};

export type ActivityStats = {
    code: string;
    name: string;
    totalCount: number;
    countByDate: ActivityCountByDate[];
};

export type GetActivityStatsParams = {
    codes?: string[];
    householdIds?: string[];
    fromDate?: string; // YYYY-MM-DD
    toDate?: string;   // YYYY-MM-DD
    timeWindow?: string;
};

export type ActivityStatsResponse = ActivityStats[];

export const getActivityStats = async (params?: GetActivityStatsParams): Promise<ActivityStatsResponse> => {
    try {
        const queryParams = new URLSearchParams();

        if (params?.codes && params.codes.length > 0) {
            params.codes.forEach(code => queryParams.append('codes', code));
        }
        if (params?.householdIds && params.householdIds.length > 0) {
            params.householdIds.forEach(id => queryParams.append('householdIds', id));
        }
        if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
        if (params?.toDate) queryParams.append('toDate', params.toDate);
        if (params?.timeWindow) queryParams.append('timeWindow', params.timeWindow);

        const qs = queryParams.toString() ? `?${queryParams.toString()}` : '';
        console.log('getActivityStats API call:', `/admin/activities/summary${qs}`);
        const response = await apiRequest<ActivityStatsResponse>('get', `/admin/activities/summary${qs}`);

        return response || [];
    } catch (err) {
        console.error('getActivityStats failed:', err);
        return [];
    }
};

import { apiRequest } from '@/lib/apiRequest';

export type Milestone = {
    id: string;
    icon: string | null;
    name: string;
    description: string;
    isActive: boolean;
    earnedCount: number;
    isDeleted: boolean;
};

export type PaginatedMilestones = {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    items: Milestone[];
};


export type GetMilestonesParams = {
    searchText?: string;
    isActive?: boolean;
    isDeleted?: boolean;
    sortBy?: 'Id' | 'Name' | 'EarnedCount';
    order?: 'ASC' | 'DESC';
    pageNumber?: number;
    pageSize?: number;
};

export type CreateMilestoneRequest = {
    name: string | null;
    description: string | null;
    isActive: boolean;
};

export type UpdateMilestoneRequest = {
    name: string | null;
    description: string | null;
    isActive: boolean;
};

export type CreateMilestoneRequirementRequest = {
    activityCode: string;
    quota: number;
    withinDays?: number;
};


export const getMilestones = async (params?: GetMilestonesParams): Promise<PaginatedMilestones> => {
    try {
        const queryParams = new URLSearchParams();

        if (params?.searchText) queryParams.append('searchText', params.searchText);
        if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
        if (params?.isDeleted !== undefined) queryParams.append('isDeleted', String(params.isDeleted));
        if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params?.order) queryParams.append('order', params.order);
        if (params?.pageNumber) queryParams.append('pageNumber', String(params.pageNumber));
        if (params?.pageSize) queryParams.append('pageSize', String(params.pageSize));

        const qs = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const response = await apiRequest<PaginatedMilestones>('get', `/admin/milestones${qs}`);
        return response || {
            currentPage: 1,
            totalPages: 0,
            pageSize: 10,
            totalCount: 0,
            hasPrevious: false,
            hasNext: false,
            items: [],
        };
    } catch (err) {
        console.error('getMilestones failed:', err);
        return {
            currentPage: 1,
            totalPages: 0,
            pageSize: 10,
            totalCount: 0,
            hasPrevious: false,
            hasNext: false,
            items: [],
        };
    }
};

export const getMilestoneById = async (milestoneId: string): Promise<Milestone | null> => {
    try {
        const response = await apiRequest<Milestone>('get', `/admin/milestones/${milestoneId}`);
        return response || null;
    } catch (err) {
        console.error('getMilestoneById failed:', err);
        return null;
    }
};

export const createMilestone = async (payload: CreateMilestoneRequest): Promise<Milestone> => {
    try {
        const response = await apiRequest<Milestone>('post', '/admin/milestones', payload);
        return response || {
            id: '',
            icon: null,
            name: '',
            description: '',
            isActive: false,
            earnedCount: 0,
            isDeleted: false,
        };
    } catch (err) {
        console.error('createMilestone failed:', err);
        throw err;
    }
};

export const updateMilestone = async (milestoneId: string, payload: UpdateMilestoneRequest): Promise<Milestone> => {
    try {
        const response = await apiRequest<Milestone>('patch', `/admin/milestones/${milestoneId}`, payload);
        return response || {
            id: milestoneId,
            icon: null,
            name: '',
            description: '',
            isActive: false,
            earnedCount: 0,
            isDeleted: false,
        };
    } catch (err) {
        console.error('updateMilestone failed:', err);
        throw err;
    }
};

export const deleteMilestone = async (milestoneId: string): Promise<void> => {
    try {
        await apiRequest<void>('delete', `/admin/milestones/${milestoneId}`);
    } catch (err) {
        console.error('deleteMilestone failed:', err);
        throw err;
    }
};

export const updateMilestoneIcon = async (milestoneId: string, iconFile: File): Promise<Milestone> => {
    try {
        const formData = new FormData();
        formData.append('icon', iconFile);

        const response = await apiRequest<Milestone>('patch', `/admin/milestones/${milestoneId}/icon`, formData);
        return response || {
            id: milestoneId,
            icon: null,
            name: '',
            description: '',
            isActive: false,
            earnedCount: 0,
            isDeleted: false,
        };
    } catch (err) {
        console.error('updateMilestoneIcon failed:', err);
        throw err;
    }
};

export const createMilestoneRequirement = async (milestoneId: string, payload: CreateMilestoneRequirementRequest): Promise<void> => {
    try {
        await apiRequest<void>('post', `/admin/milestones/${milestoneId}/requirements`, payload);
    } catch (err) {
        console.error('createMilestoneRequirement failed:', err);
        throw err;
    }
};

import { apiRequest } from '@/lib/apiRequest';
import type { UserProfile, UpdateProfileInput, GetAdminUsersParams, PaginatedAdminUsers } from '../schema/userSchema';

/**
 * GET /users/profile
 * Fetches the current user's profile
 */
export const getUserProfile = async (): Promise<UserProfile> => {
    try {
        const response = await apiRequest<UserProfile>('get', '/users/profile');
        return response;
    } catch (error) {
        console.error('getUserProfile failed:', error);
        throw error;
    }
};

/**
 * PUT /users/profile
 * Updates the current user's profile (firstName, lastName)
 */
export const updateUserProfile = async (payload: UpdateProfileInput): Promise<UserProfile> => {
    try {
        const response = await apiRequest<UserProfile>('put', '/users/profile', payload);
        return response;
    } catch (error) {
        console.error('updateUserProfile failed:', error);
        throw error;
    }
};

/**
 * PUT /users/avatar
 * Updates the current user's avatar image
 */
export const updateUserAvatar = async (file: File): Promise<UserProfile> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiRequest<UserProfile>('put', '/users/avatar', formData);
        return response;
    } catch (error) {
        console.error('updateUserAvatar failed:', error);
        throw error;
    }
};

/**
 * GET /admin/users
 * Fetches paginated list of users for admin dashboard
 */
export const getAdminUsers = async (params: GetAdminUsersParams = {}): Promise<PaginatedAdminUsers> => {
    try {
        const query = new URLSearchParams();

        if (params.searchText) query.set('searchText', params.searchText);
        if (typeof params.isDeleted === 'boolean') query.set('isDeleted', String(params.isDeleted));
        if (params.sortBy) query.set('sortBy', params.sortBy);
        if (params.sortOrder) query.set('sortOrder', params.sortOrder);
        if (typeof params.pageNumber === 'number') query.set('pageNumber', String(params.pageNumber));
        if (typeof params.pageSize === 'number') query.set('pageSize', String(params.pageSize));

        const url = query.toString() ? `/admin/users?${query.toString()}` : '/admin/users';
        const response = await apiRequest<PaginatedAdminUsers>('get', url);
        return response;
    } catch (error) {
        console.error('getAdminUsers failed:', error);
        throw error;
    }
};

/**
 * DELETE /admin/users/{userId}
 * Deletes a user by ID (admin only)
 */
export const deleteAdminUser = async (userId: string): Promise<void> => {
    try {
        await apiRequest<void>('delete', `/admin/users/${userId}`);
    } catch (error) {
        console.error('deleteAdminUser failed:', error);
        throw error;
    }
};

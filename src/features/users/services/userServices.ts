import { apiRequest } from '@/lib/apiRequest';
import type { UserProfile, UpdateProfileInput } from '../schema/userSchema';

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

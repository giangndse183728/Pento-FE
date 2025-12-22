import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getUserProfile, updateUserProfile, updateUserAvatar, getAdminUsers, deleteAdminUser } from '../services/userServices';
import type { UpdateProfileInput, GetAdminUsersParams } from '../schema/userSchema';
import { UpdateProfileSchema } from '../schema/userSchema';

/**
 * Hook to fetch the current user's profile
 */
export const useUserProfile = () => {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: getUserProfile,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook to update the current user's profile
 */
export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateProfileInput) => {
            const validatedPayload = UpdateProfileSchema.parse(payload);
            return updateUserProfile(validatedPayload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            toast.success('Profile updated successfully');
        },
        onError: (error: unknown) => {
            const message = error instanceof Error ? error.message : 'Failed to update profile';
            toast.error(message);
        },
    });
};

/**
 * Hook to update the current user's avatar
 */
export const useUpdateUserAvatar = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) => updateUserAvatar(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            toast.success('Avatar updated successfully');
        },
        onError: (error: unknown) => {
            const message = error instanceof Error ? error.message : 'Failed to update avatar';
            toast.error(message);
        },
    });
};

/**
 * Hook to fetch admin users list with pagination and filtering
 */
export const useAdminUsers = (params: GetAdminUsersParams = {}) => {
    return useQuery({
        queryKey: ['adminUsers', params],
        queryFn: () => getAdminUsers(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * Hook to delete a user (admin only)
 */
export const useDeleteAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => deleteAdminUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            toast.success('User deleted successfully');
        },
        onError: (error: unknown) => {
            const message = error instanceof Error ? error.message : 'Failed to delete user';
            toast.error(message);
        },
    });
};

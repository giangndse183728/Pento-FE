'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login, logout } from '../services';
import { LoginFormData } from '../schema';
import { toast } from 'sonner';
import { getUserProfile } from '@/features/users/services/userServices';

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: LoginFormData) => login(credentials),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });

            try {
                // Fetch user profile to check role
                const user = await getUserProfile();
                toast.success('Login successful!');

                // Redirect based on role
                if (user.roles === 'ADMIN') {
                    router.push('/admin/dashboard/subscriptions-payment');
                } else {
                    router.push('/');
                }
            } catch {
                // If profile fetch fails, redirect to home
                toast.success('Login successful!');
                router.push('/');
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Login failed');
        },
    });
};

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => logout(),
        onSuccess: () => {
            queryClient.clear();
            toast.success('Logged out successfully');
            router.push('/login');
        },
        onError: () => {
            toast.error('Logout failed');
            queryClient.clear();
            router.push('/login');
        },
    });
};

export const useAuth = () => {
    const loginMutation = useLogin();
    const logoutMutation = useLogout();

    return {
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,

        isLoggingIn: loginMutation.isPending,
        isLoggingOut: logoutMutation.isPending,

        loginError: loginMutation.error,
        logoutError: logoutMutation.error,
    };
};

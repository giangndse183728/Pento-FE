'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login, logout } from '../services';
import { LoginFormData } from '../schema';
import { toast } from 'sonner';
import { getUserProfile } from '@/features/users/services/userServices';
import { ROUTES } from '@/constants/routes';

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: LoginFormData) => login(credentials),
        onSuccess: async () => {
            console.log('[useAuth] Login successful, invalidating queries');
            queryClient.invalidateQueries({ queryKey: ['user'] });

            try {
                console.log('[useAuth] Fetching user profile...');
                // Fetch user profile to check role
                const user = await getUserProfile();
                console.log('[useAuth] User profile fetched:', { roles: user.roles, email: user.email });

                toast.success('Login successful!');

                // Redirect based on role
                if (user.roles === 'Administrator') {
                    console.log('[useAuth] Redirecting to admin dashboard');
                    router.push(ROUTES.DASHBOARD);
                } else {
                    console.log('[useAuth] Redirecting to home');
                    router.push('/');
                }
            } catch (error) {
                // If profile fetch fails, redirect to home
                console.error('[useAuth] Profile fetch failed:', error);
                toast.success('Login successful!');
                router.push('/');
            }
        },
        onError: (error: Error) => {
            console.error('[useAuth] Login failed:', error);
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
            // Ensure token is cleared
            localStorage.removeItem('accessToken');
            queryClient.clear();
            toast.success('Logged out successfully');
            router.push('/login');
        },
        onError: () => {
            // Still clear everything even on error
            localStorage.removeItem('accessToken');
            queryClient.clear();
            toast.error('Logout failed');
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

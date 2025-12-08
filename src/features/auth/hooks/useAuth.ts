'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login, logout } from '../services';
import { LoginFormData } from '../schema';
import { toast } from 'sonner';

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: LoginFormData) => login(credentials),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });

            toast.success('Login successful!');
            router.push('/'); // Redirect to home or dashboard after login
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

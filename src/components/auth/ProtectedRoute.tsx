"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/features/users/services/userServices';

interface RouteGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireAdmin?: boolean;
    allowedRoles?: string[];
    redirectTo?: string;
}

export default function ProtectedRoute({
    children,
    requireAuth = true,
    requireAdmin = false,
    allowedRoles = [],
    redirectTo = '/login'
}: RouteGuardProps) {
    const [hasMounted, setHasMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        setHasMounted(true);
        const checkAuth = async () => {
            try {
                const user = await getUserProfile();
                setIsAuthenticated(true);
                setUserRole(user.roles);
            } catch {
                setIsAuthenticated(false);
                setUserRole(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Handle redirects in separate useEffect to avoid setState during render
    useEffect(() => {
        if (!hasMounted || isLoading) return;

        // Check authentication requirement
        if (requireAuth && !isAuthenticated) {
            router.push(redirectTo);
            return;
        }

        // Check admin requirement
        if (requireAdmin && isAuthenticated && userRole !== 'Administrator') {
            router.push('/');
            return;
        }

        // Check allowed roles
        if (allowedRoles.length > 0 && isAuthenticated && userRole && !allowedRoles.includes(userRole)) {
            router.push('/');
            return;
        }
    }, [hasMounted, isLoading, requireAuth, requireAdmin, allowedRoles, isAuthenticated, userRole, router, redirectTo]);

    // Don't render anything on server to avoid hydration mismatch
    // or if we haven't mounted yet
    if (!hasMounted) return null;

    // Show loading state
    const isLoginPage = window.location.pathname === '/login';
    const isAdminPage = window.location.pathname.startsWith('/admin');

    if (isLoading && !isAdminPage) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Don't render content while redirecting
    if (requireAuth && !isAuthenticated) {
        return null;
    }

    if (requireAdmin && userRole !== 'Administrator') {
        return null;
    }

    if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
        return null;
    }

    return <>{children}</>;
}

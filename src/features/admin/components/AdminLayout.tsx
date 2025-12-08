"use client";

import React from 'react';
// TEMPORARILY DISABLED - uncomment imports to enable auth blocking
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import { BlurCard } from '@/components/decoration/BlurCard';
// import { ROUTES } from '@/constants/routes';

type Props = {
    children: React.ReactNode;
};

const AdminLayout = ({ children }: Props) => {
    // TEMPORARILY DISABLED - uncomment to enable auth blocking
    /*
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        // Check for authentication token
        const token = localStorage.getItem('accessToken');

        if (!token) {
            // Redirect to login if not authenticated
            router.replace(ROUTES.LOGIN);
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    // Show loading state while checking authentication
    if (isAuthenticated === null) {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("/assets/img/admin-background.jpg")',
                    backgroundAttachment: 'fixed',
                }}
            >
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, don't render anything (redirect is happening)
    if (!isAuthenticated) {
        return null;
    }
    */

    return (
        <div
            className="min-h-screen p-4 md:p-6 bg-cover bg-center bg-no-repeat font-primary"
            style={{
                backgroundImage: 'url("/assets/img/admin-background.jpg")',
                backgroundAttachment: 'fixed',
                backgroundBlendMode: 'overlay',
                backgroundColor: 'rgba(219, 234, 254, 0.1)',
                color: '#113F67',
            }}
        >
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start justify-start">
                <AdminSidebar />

                {/* Main Content Area */}
                <div className="w-full md:w-[75%] lg:w-[80%] md:ml-0 lg:ml-[calc(20%+1.5rem)] flex flex-col items-start justify-start text-left text-[#113F67]" style={{ color: '#113F67' }}>
                    <BlurCard className="w-full bg-white/10 backdrop-blur-[1px]">
                        <div className="p-6 flex flex-col items-start justify-start text-left">
                            {children}
                        </div>
                    </BlurCard>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;

"use client";

import React from 'react';
import AdminSidebar from '@/features/admin/components/AdminSidebar';
import { BlurCard } from '@/components/decoration/BlurCard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute requireAuth={true} requireAdmin={true} redirectTo="/login">
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
                    <div className="w-full md:w-[80%] md:ml-0 lg:ml-[calc(20%+1.5rem)] flex flex-col items-start justify-start text-left text-[#113F67]" style={{ color: '#113F67' }}>
                        <BlurCard className="w-full bg-white/10 backdrop-blur-[1px] min-h-[800px]">
                            <div className="p-6 flex flex-col items-start justify-start text-left w-full">
                                {children}
                            </div>
                        </BlurCard>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

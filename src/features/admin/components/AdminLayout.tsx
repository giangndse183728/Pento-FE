import React from 'react';
import AdminSidebar from './AdminSidebar';
import { BlurCard } from '@/components/decoration/BlurCard';

type Props = {
    children: React.ReactNode;
};

const AdminLayout = ({ children }: Props) => {
    return (
        <div
            className="min-h-screen p-6 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: 'url("/assets/img/admin-background.jpg")',
                backgroundBlendMode: 'overlay',
                backgroundColor: 'rgba(219, 234, 254, 0.1)',
            }}
        >
            <div className="flex flex-col lg:flex-row gap-6 items-start justify-start">
                <AdminSidebar />

                {/* Main Content Area (shared) */}
                <div className="w-full lg:w-4/4 flex flex-col items-start justify-start text-left">
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

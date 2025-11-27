import React from 'react';
import AdminSidebar from './AdminSidebar';
import { BlurCard } from '@/components/decoration/BlurCard';

type Props = {
    children: React.ReactNode;
};

const AdminLayout = ({ children }: Props) => {
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
                <div className="w-full md:w-[75%] lg:w-[80%] md:ml-0 lg:ml-[calc(20%+1.5rem)] flex flex-col items-start justify-start text-left">
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

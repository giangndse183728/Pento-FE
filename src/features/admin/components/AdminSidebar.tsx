import React from 'react';
import Link from 'next/link';
import GlassSurface from '@/components/decoration/Liquidglass';
import { ROUTES } from '@/constants/routes';

const AdminSidebar = () => {
    return (
        <div className="w-full lg:w-1/4 sticky top-6">
            <GlassSurface width="100%" height="calc(100vh - 48px)" borderRadius={12} blur={10} opacity={0.9} style={{
                border: '1px solid rgba(255, 255, 255, 0.3)',
            }}>
                <div className="p-4 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-200 rounded-full" />
                        <div>
                            <p className="text-sm font-semibold">Alyona N.</p>
                            <p className="text-xs text-gray-500">Creator</p>
                        </div>
                    </div>
                    <nav className="space-y-2 flex-1">
                        <Link href={ROUTES.DASHBOARD} className="w-full block text-left p-2 rounded-lg hover:bg-gray-100/50">Dashboard</Link>
                        <Link href={ROUTES.RECIPES} className="w-full block text-left p-2 rounded-lg hover:bg-gray-100/50">Recipes</Link>
                        <button className="w-full text-left p-2 rounded-lg hover:bg-gray-100/50">Wallet</button>
                        <button className="w-full text-left p-2 rounded-lg hover:bg-gray-100/50">Messages</button>
                        <button className="w-full text-left p-2 rounded-lg hover:bg-gray-100/50">Collections</button>
                    </nav>
                </div>
            </GlassSurface>
        </div>
    );
};

export default AdminSidebar;
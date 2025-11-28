import React from 'react';
import Link from 'next/link';
import GlassSurface from '@/components/decoration/Liquidglass';
import { ROUTES } from '@/constants/routes';
import {
    ChartColumnBig,
    BookMarked,
    UtensilsCrossed,
    CalendarPlus
} from 'lucide-react';

const AdminSidebar = () => {
    return (
        <div className="w-full md:w-[35%] lg:w-[20%] lg:fixed lg:left-6 lg:top-6 lg:bottom-6">
            <GlassSurface
                width="100%"
                height="100%"
                borderRadius={12}
                blur={10}
                opacity={0.9}
                style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}
            >
                <div className="p-4 h-full w-full flex flex-col items-start justify-start">
                    {/* Profile */}
                    <div className="flex items-center gap-3 mb-6 w-full">
                        <div className="w-10 h-10 bg-gray-200 rounded-full" />
                        <div className="text-left">
                            <p className="text-sm font-semibold">Admin</p>
                            <p className="text-xs text-gray-500">Creator</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col space-y-1 w-full">
                        <Link
                            href={ROUTES.DASHBOARD}
                            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100/50 min-w-[160px] justify-start text-left"
                        >
                            <ChartColumnBig className="w-5 h-5 flex-shrink-0" />
                            <span className="truncate">Dashboard</span>
                        </Link>

                        <Link
                            href={ROUTES.RECIPES}
                            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100/50 min-w-[160px] justify-start text-left"
                        >
                            <BookMarked className="w-5 h-5 flex-shrink-0" />
                            <span className="truncate">Recipes</span>
                        </Link>

                        <Link
                            href="#"
                            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100/50 min-w-[160px] justify-start text-left"
                        >
                            <UtensilsCrossed className="w-5 h-5 flex-shrink-0" />
                            <span className="truncate">Food References</span>
                        </Link>
                        <Link
                            href={ROUTES.SUBSCRIPTIONS}
                            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100/50 min-w-[160px] justify-start text-left"
                        >
                            <CalendarPlus className="w-5 h-5 flex-shrink-0" />
                            <span className="truncate">Subscriptions</span>
                        </Link>
                    </nav>
                </div>
            </GlassSurface>
        </div>

    );
};

export default AdminSidebar;
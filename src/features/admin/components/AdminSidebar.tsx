import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { ROUTES } from '@/constants/routes';
import { ColorTheme } from '@/constants/color';
import {
    ChartColumnBig,
    BookMarked,
    UtensilsCrossed,
    CalendarPlus,
    Medal
} from 'lucide-react';

const navItems = [
    { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: ChartColumnBig },
    { href: ROUTES.RECIPES, label: 'Recipes', icon: BookMarked },
    { href: '#', label: 'Food References', icon: UtensilsCrossed },
    { href: ROUTES.SUBSCRIPTIONS, label: 'Subscriptions', icon: CalendarPlus },
    { href: ROUTES.ACHIEVEMENTS, label: 'Achievements', icon: Medal },
];

const AdminSidebar = () => {
    const pathname = usePathname();
    const [hovered, setHovered] = useState<string | null>(null);

    return (
        <div className="w-full md:w-[35%] lg:w-[20%] lg:fixed lg:left-6 lg:top-6 lg:bottom-6 min-h-screen lg:min-h-0">
            <WhiteCard
                width="100%"
                height="100%"
                style={{
                    border: `1px solid rgba(0,0,0,0.05)`,
                    background: ColorTheme.iceberg,
                    height: '100%',
                }}
                className="h-full shadow-lg rounded-xl"
            >
                <div className="p-5 h-full w-full flex flex-col items-start justify-start">
                    {/* Profile */}
                    <div className="flex items-center gap-4 mb-8 w-full cursor-pointer group">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold transition-transform shadow-md hover:scale-105"
                            style={{ background: ColorTheme.blueGray }}
                        >
                            A
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-semibold" style={{ color: ColorTheme.darkBlue }}>
                                Admin
                            </p>
                            <p className="text-xs" style={{ color: ColorTheme.blueGray }}>
                                Creator
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full border-t border-gray-300 mb-6" />

                    {/* Navigation */}
                    <nav className="flex flex-col space-y-3 w-full relative">
                        {navItems.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href;
                            const isHovered = hovered === href;

                            return (
                                <div key={href} className="relative w-full">
                                    {/* Active indicator */}
                                    {isActive && (
                                        <div
                                            className="absolute left-0 top-0 h-full w-1 rounded-tr-lg rounded-br-lg"
                                            style={{ backgroundColor: ColorTheme.powderBlue }}
                                        />
                                    )}

                                    <Link
                                        href={href}
                                        onMouseEnter={() => setHovered(href)}
                                        onMouseLeave={() => setHovered(null)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all transform cursor-pointer`}
                                        style={{
                                            backgroundColor: isActive
                                                ? ColorTheme.iceberg
                                                : isHovered
                                                    ? ColorTheme.babyBlue
                                                    : 'transparent',
                                            boxShadow: isHovered ? `0 4px 10px rgba(0,0,0,0.08)` : 'none',
                                        }}
                                    >
                                        <Icon
                                            className={`w-5 h-5 flex-shrink-0 transition-transform`}
                                            style={{
                                                color: isActive || isHovered ? ColorTheme.blueGray : ColorTheme.darkBlue,
                                                transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
                                            }}
                                        />
                                        <span
                                            className="truncate font-medium transition-colors"
                                            style={{
                                                color: isActive || isHovered ? ColorTheme.blueGray : ColorTheme.darkBlue,
                                            }}
                                        >
                                            {label}
                                        </span>
                                    </Link>
                                </div>
                            );
                        })}
                    </nav>
                </div>
            </WhiteCard>
        </div>
    );
};

export default AdminSidebar;

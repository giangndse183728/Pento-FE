"use client";

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { MantineProvider } from '@mantine/core';
import Navbar from '@/components/layouts/Navbar';
import { ROUTES_NO_LAYOUT } from '@/constants/routes';
import QueryProvider from '../../providers/QueryProvider';

function shouldHideNavbar(pathname: string): boolean {
  return ROUTES_NO_LAYOUT.some((route) =>
    route === pathname || (route !== '/' && pathname.startsWith(route))
  );
}

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = shouldHideNavbar(pathname || '/');
  const isHomePage = pathname === '/';
  const isAdminRoute = pathname?.startsWith('/admin');
  const showWebBg = !isHomePage && !isAdminRoute;

  return (
    <MantineProvider>
      <QueryProvider>
        {/* Fixed Video Background - only show on home page */}
        {isHomePage && (
          <div className="fixed inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/vecteezy_fantasy-landscape-and-falling-snow_1625855.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        )}

        {/* Web Background - show on all routes except home and admin */}
        {showWebBg && (
          <div className="fixed inset-0 z-0 opacity-80">
            <Image
              src="/assets/img/web-bg5.png"
              alt="background"
              fill
              className="object-cover"
              priority={false}
            />
          </div>
          // <div className="fixed inset-0 z-0 bg-[#D6E6F2]" />

        )}

        {/* Content */}
        <div
          className={`relative z-10 ${!isHomePage ? 'font-primary' : ''}`}
          style={!isHomePage ? { color: '#113F67' } : undefined}
        >
          {!hideNavbar && <Navbar />}
          <div className="max-w-[1600px] mx-auto">{children}</div>
        </div>
      </QueryProvider>
    </MantineProvider>
  );
}



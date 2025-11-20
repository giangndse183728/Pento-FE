"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import Navbar from '@/components/layouts/Navbar';
import { ROUTES_NO_LAYOUT } from '@/constants/routes';

function shouldHideNavbar(pathname: string): boolean {
  return ROUTES_NO_LAYOUT.some((route) =>
    route === pathname || (route !== '/' && pathname.startsWith(route))
  );
}

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = shouldHideNavbar(pathname || '/');

  // Create QueryClient once per mounted LayoutClient
  const [queryClient] = useState(() => new QueryClient());

  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        {/* Fixed Video Background */}
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

        {/* Content */}
        <div className="relative z-10">
          {!hideNavbar && <Navbar />}
          <div className="max-w-[1600px] mx-auto">{children}</div>
        </div>
      </QueryClientProvider>
    </MantineProvider>
  );
}



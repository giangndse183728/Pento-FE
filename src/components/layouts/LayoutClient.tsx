'use client';

import { usePathname } from 'next/navigation';
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

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="max-w-[1600px] mx-auto">{children}</div>
    </>
  );
}



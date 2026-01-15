'use client';

import { Suspense } from 'react';
import RouteLoadingScreen from '@/components/decoration/RouteLoadingScreen';

export default function WithLoadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <RouteLoadingScreen />
      </Suspense>
      {children}
    </>
  );
}

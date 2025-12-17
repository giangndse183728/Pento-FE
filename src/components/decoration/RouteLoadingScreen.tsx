'use client';

import * as React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import '@/styles/loading-screen.css';

interface RouteLoadingScreenProps {
    fadeDurationMs?: number;
}

export default function RouteLoadingScreen({
    fadeDurationMs = 300,
}: RouteLoadingScreenProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = React.useState(true);
    const [isFading, setIsFading] = React.useState(false);

    React.useEffect(() => {
        // Show loading screen on route change
        setIsLoading(true);
        setIsFading(false);

        // Start fade-out after a brief delay to allow content to load
        const fadeTimer = setTimeout(() => {
            setIsFading(true);
        }, 500);

        // Hide completely after fade
        const hideTimer = setTimeout(() => {
            setIsLoading(false);
        }, 500 + fadeDurationMs);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    }, [pathname, searchParams, fadeDurationMs]);

    if (!isLoading) return null;

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-white"
            aria-live="polite"
            aria-busy={true}
            style={{
                opacity: isFading ? 0 : 1,
                transition: `opacity ${fadeDurationMs}ms ease`,
                backdropFilter: 'blur(4px)',
            }}
        >
            <div className="flex flex-col items-center gap-4">
                <div className="loader">
                    <div className="bar1"></div>
                    <div className="bar2"></div>
                    <div className="bar3"></div>
                    <div className="bar4"></div>
                    <div className="bar5"></div>
                    <div className="bar6"></div>
                    <div className="bar7"></div>
                    <div className="bar8"></div>
                    <div className="bar9"></div>
                </div>
                <span className="text-black/90 text-sm font-primary">Loading...</span>
            </div>
        </div>
    );
}

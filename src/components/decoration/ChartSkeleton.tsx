'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { WhiteCard } from './WhiteCard';

interface ChartSkeletonProps {
    height?: number | string;
    showFilters?: boolean;
    title?: string;
}

export function ChartSkeleton({ height = 400, showFilters = false, title }: ChartSkeletonProps) {
    return (
        <div className="w-full space-y-4">
            {showFilters && (
                <div className="w-full rounded-xl border border-white/30 bg-white/40 p-4 backdrop-blur-md">
                    <div className="flex flex-wrap gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-40" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <WhiteCard className="w-full rounded-2xl p-6 bg-white/90 border border-white/30 backdrop-blur-lg">
                {title && (
                    <div className="flex items-center justify-center mb-6">
                        <Skeleton className="h-8 w-64" />
                    </div>
                )}
                <div className="relative" style={{ height: typeof height === 'number' ? `${height}px` : height }}>
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-3 w-8" />
                        ))}
                    </div>

                    {/* Main Chart Area */}
                    <div className="absolute left-14 right-4 top-0 bottom-8 flex items-end justify-between gap-4">
                        {[...Array(12)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="w-full"
                                style={{
                                    height: `${20 + Math.random() * 80}%`,
                                    opacity: 0.6 - (i * 0.03)
                                }}
                            />
                        ))}
                    </div>

                    {/* X-axis labels */}
                    <div className="absolute left-14 right-4 bottom-0 h-4 flex justify-between">
                        {[1, 2, 3, 4, 6].map((i) => (
                            <Skeleton key={i} className="h-3 w-12" />
                        ))}
                    </div>
                </div>
            </WhiteCard>
        </div>
    );
}

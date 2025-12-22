"use client";

import React from 'react';
import { WhiteCard } from './WhiteCard';
import { Skeleton } from '@/components/ui/skeleton';

export const DetailsSkeleton = () => {
    return (
        <div className="w-full space-y-6">
            {/* Header / Back Button Area */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-24 rounded-xl" />
                    <Skeleton className="h-10 w-48 rounded-md" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-20 rounded-xl" />
                </div>
            </div>

            {/* Main Content Card */}
            <div className="w-full flex justify-center">
                <div className="w-full max-w-5xl">
                    <WhiteCard className="bg-white/70">
                        <div className="p-8 space-y-8">
                            {/* Tab/Segmented Control Placeholder */}
                            <div className="flex justify-center">
                                <Skeleton className="h-12 w-96 rounded-2xl" />
                            </div>

                            {/* Content Area */}
                            <div className="space-y-6">
                                <div className="flex gap-6 items-start">
                                    <Skeleton className="w-32 h-32 rounded-xl flex-shrink-0" />
                                    <div className="flex-1 space-y-4">
                                        <Skeleton className="h-8 w-3/4" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-5/6" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                    <div className="space-y-3">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-10 w-full rounded-xl" />
                                    </div>
                                    <div className="space-y-3">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-10 w-full rounded-xl" />
                                    </div>
                                    <div className="space-y-3">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-10 w-full rounded-xl" />
                                    </div>
                                    <div className="space-y-3">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-10 w-full rounded-xl" />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6">
                                    <Skeleton className="h-6 w-32" />
                                    <div className="space-y-3">
                                        <Skeleton className="h-20 w-full rounded-xl" />
                                        <Skeleton className="h-20 w-full rounded-xl" />
                                        <Skeleton className="h-20 w-full rounded-xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </WhiteCard>
                </div>
            </div>
        </div>
    );
};

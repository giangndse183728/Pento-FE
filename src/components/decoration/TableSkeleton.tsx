'use client';

import React from 'react';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TableSkeletonProps {
    title?: string;
    rowCount?: number;
    columnCount?: number;
}

export function TableSkeleton({ title, rowCount = 5, columnCount = 6 }: TableSkeletonProps) {
    return (
        <WhiteCard className="w-full" width="100%" height="auto">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    {title ? (
                        <h3 className="text-lg font-semibold" style={{ color: '#113F67' }}>
                            {title}
                        </h3>
                    ) : (
                        <Skeleton className="h-8 w-48 rounded-lg" />
                    )}
                    <Skeleton className="h-5 w-32 rounded-lg" />
                </div>

                <Table className="w-full table-fixed">
                    <TableHeader>
                        <TableRow>
                            {[...Array(columnCount)].map((_, i) => (
                                <TableHead key={i} className={i === 0 ? "w-[40%]" : "text-center"}>
                                    <Skeleton className={`h-6 ${i === 0 ? "w-24" : "w-16 mx-auto"}`} />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(rowCount)].map((_, i) => (
                            <TableRow key={i}>
                                {[...Array(columnCount)].map((_, j) => (
                                    <TableCell key={j} className={j > 1 ? "text-center" : ""}>
                                        {j === 0 ? (
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="w-10 h-10 rounded-full" />
                                                <Skeleton className="h-5 w-32" />
                                            </div>
                                        ) : (
                                            <Skeleton className={`h-5 ${j > 1 ? "w-20 mx-auto rounded-full" : "w-28"}`} />
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination Skeleton */}
                <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: '#D6E6F2' }}>
                    <Skeleton className="h-5 w-32" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-24 rounded-xl" />
                        <Skeleton className="h-10 w-24 rounded-xl" />
                    </div>
                </div>
            </div>
        </WhiteCard>
    );
}

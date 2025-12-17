"use client";

import React, { useState } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { RecipeSummary, PaginatedResponse } from '../../services/recipesService';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { ColorTheme } from '@/constants/color';
import { ChefHat, Trash2 } from 'lucide-react';
import { CusButton } from '@/components/ui/cusButton';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import RecipesTableCards from './RecipesListCards';

type Props = {
    list: UseQueryResult<PaginatedResponse<RecipeSummary>, unknown>;
    pageNumber: number;
    setPageNumber: (page: number) => void;
    pageSize?: number;
    difficulty?: string;
    search?: string;
    sort?: string;
};

export default function RecipesTable({ list, pageNumber, setPageNumber, pageSize = 12, difficulty, search, sort }: Props) {
    const [deleteMode, setDeleteMode] = useState(false);
    const items = list.data?.items ?? [];
    const totalCount = list.data?.totalCount ?? 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    const generatePageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (pageNumber <= 3) {
                pages.push(1, 2, 3, 4, 'ellipsis', totalPages);
            } else if (pageNumber >= totalPages - 2) {
                pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, 'ellipsis', pageNumber - 1, pageNumber, pageNumber + 1, 'ellipsis', totalPages);
            }
        }
        return pages;
    };
    return (
        <div className="w-full max-w-7xl space-y-6">
            <div className="flex flex-col gap-3">
                {/* HEADER SECTION */}
                <div className="flex items-center justify-between">
                    {/* Left section: count + title */}
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg md:text-xl font-semibold">My Recipes</h2>

                        <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                            <span className="text-[10px] uppercase tracking-widest text-gray-500">Total</span>
                            <span
                                className="text-sm font-semibold text-gray-900"
                                style={{ color: ColorTheme.blueGray }}
                            >
                                {totalCount}
                            </span>
                        </span>
                    </div>

                    {/* Right section: showing text */}
                    <p className="text-sm text-gray-600 whitespace-nowrap">
                        Showing{" "}
                        {Math.min((pageNumber - 1) * pageSize + 1, totalCount)}-
                        {Math.min(pageNumber * pageSize, totalCount)} of {totalCount} items
                    </p>
                </div>

                {/* DELETE BUTTON SECTION (Aligned End) */}
                <div className="flex justify-end">
                    <CusButton
                        variant={deleteMode ? "red" : "pastelRed"}
                        size="sm"
                        onClick={() => setDeleteMode(!deleteMode)}
                        className="gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        {deleteMode ? "Done" : "Delete Recipes"}
                    </CusButton>
                </div>
            </div>




            {list.isLoading && (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <WhiteCard key={i} className="p-6">
                            <div className="flex gap-4">
                                <Skeleton className="w-32 h-24 rounded-xl" />
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="h-6 w-2/3" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                        </WhiteCard>
                    ))}
                </div>
            )}

            {list.isError && (
                <WhiteCard className="p-6">
                    <div className="text-red-600 text-center">
                        Failed to load recipes. Please try again.
                    </div>
                </WhiteCard>
            )}

            {!list.isLoading && !list.isError && items.length === 0 && (
                <WhiteCard className="p-12">
                    <div className="text-center text-gray-500">
                        <ChefHat className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">No recipes yet</p>
                        <p className="text-sm mt-2">Create your first recipe to get started!</p>
                    </div>
                </WhiteCard>
            )}

            <RecipesTableCards items={items} deleteMode={deleteMode} />

            {/* Pagination */}
            {!list.isLoading && totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (pageNumber > 1) setPageNumber(pageNumber - 1);
                                    }}
                                    className={pageNumber === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                            {generatePageNumbers().map((page, idx) => (
                                <PaginationItem key={idx}>
                                    {page === 'ellipsis' ? (
                                        <PaginationEllipsis />
                                    ) : (
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setPageNumber(page);
                                            }}
                                            isActive={pageNumber === page}
                                        >
                                            {page}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (pageNumber < totalPages) setPageNumber(pageNumber + 1);
                                    }}
                                    className={pageNumber === totalPages ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}

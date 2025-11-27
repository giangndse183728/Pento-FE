"use client";

import React from 'react';
import Image from 'next/image';
import { IngredientInput, FoodReferencesResponse, FoodRef } from '../../services/recipesService';
import { UseQueryResult } from '@tanstack/react-query';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { CusButton } from '@/components/ui/cusButton';
import { Badge } from '@/components/ui/badge';
import { ColorTheme } from '@/constants/color';

type Props = {
    foodRefs: UseQueryResult<FoodReferencesResponse, Error>;
    ingredients: IngredientInput[];
    setIngredients: (next: IngredientInput[] | ((prev: IngredientInput[]) => IngredientInput[])) => void;
    openIndex: number | null;
    setNameInputs: (next: string[] | ((prev: string[]) => string[])) => void;
    updateAt: (idx: number, patch: Partial<IngredientInput>) => void;
    page?: number;
    setPage?: (n: number) => void;
    pageSize?: number;
    setPageSize?: (n: number) => void;
    cacheFoodRef: (foodRef: FoodRef) => void;
};

export default function FoodReferencesResults({ foodRefs, ingredients, setIngredients, openIndex, setNameInputs, updateAt, page = 1, setPage, pageSize = 6, setPageSize, cacheFoodRef }: Props) {
    const data = foodRefs.data;
    const totalPages = data ? Math.ceil(data.totalCount / data.pageSize) : 0;
    const [erroredIds, setErroredIds] = React.useState<Set<string | number>>(new Set());

    const renderPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        const current = page;

        if (totalPages <= 7) {
            // Show all pages if 7 or fewer
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (current > 3) {
                pages.push('ellipsis');
            }

            // Show pages around current
            const start = Math.max(2, current - 1);
            const end = Math.min(totalPages - 1, current + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (current < totalPages - 2) {
                pages.push('ellipsis');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="mb-4 space-y-4">
            <div className="mb-3 flex items-center justify-between">
                <h4 className="font-semibold text-gray-700">
                    {foodRefs.isFetching ? 'Searching...' : `Available Ingredients (${data?.totalCount ?? 0})`}
                </h4>
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Items per page:</span>
                    <select
                        className="neomorphic-select"
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize?.(Number(e.target.value));
                            setPage?.(1); // Reset to first page when changing page size
                        }}
                    >
                        <option value={6}>6</option>
                        <option value={9}>9</option>
                    </select>
                </div>
            </div>

            {!foodRefs.isFetching && (!data?.items || data.items.length === 0) && (
                <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-sm">
                    No ingredients found. Try adjusting your search or food group filter.
                </div>
            )}

            {data?.items && data.items.length > 0 && (
                <>
                    <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {foodRefs.isFetching && data.items.length > 0 && (
                            <>
                                {Array.from({ length: pageSize || 6 }).map((_, idx) => (
                                    <div key={`skeleton-${idx}`} className="flex flex-col border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
                                        {/* Skeleton Image */}
                                        <Skeleton className="w-full h-32" />

                                        {/* Skeleton Content */}
                                        <div className="flex-1 p-4 space-y-3">
                                            <Skeleton className="h-5 w-3/4" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-3 w-full" />
                                                <Skeleton className="h-3 w-2/3" />
                                            </div>
                                            <Skeleton className="h-10 w-full mt-4" />
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                        {!foodRefs.isFetching && data.items.map((fr) => (
                            <div key={fr.id} className="flex flex-col border border-gray-200 hover:border-blue-300 rounded-xl bg-white shadow-sm hover:shadow-md transition-all overflow-hidden relative">
                                {/* Image */}
                                <div className="relative w-full h-32 bg-gray-100">
                                    <Image
                                        src={erroredIds.has(fr.id) ? "/assets/img/placeholder.jpg" : (fr.imageUrl ?? "/assets/img/placeholder.jpg")}
                                        alt={fr.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        onError={() => {
                                            if (!erroredIds.has(fr.id)) {
                                                setErroredIds((prev) => {
                                                    const next = new Set(prev);
                                                    next.add(fr.id);
                                                    return next;
                                                });
                                            }
                                        }}
                                        priority={false}
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-4">
                                    <div className="font-semibold text-gray-900 mb-2">{fr.name}</div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <Badge variant="secondary" className="text-xs" style={{ backgroundColor: ColorTheme.powderBlue, color: ColorTheme.darkBlue }}>
                                            {fr.foodGroup ?? 'Unknown group'}
                                        </Badge>
                                        {fr.unitType && (
                                            <Badge variant="outline" className="text-xs" style={{ borderColor: ColorTheme.powderBlue, color: ColorTheme.darkBlue }}>
                                                {fr.unitType}
                                            </Badge>
                                        )}
                                    </div>
                                    <CusButton
                                        type="button"
                                        variant="blueGray"
                                        size="default"
                                        className="w-full"
                                        onClick={() => {
                                            cacheFoodRef(fr);

                                            if (openIndex !== null && openIndex >= 0 && openIndex < ingredients.length) {
                                                setNameInputs((prev) => prev.map((p, i) => (i === openIndex ? fr.name : p)));
                                                updateAt(openIndex, { foodRefId: fr.id, unitId: '' });
                                                return;
                                            }

                                            const firstEmptyIndex = ingredients.findIndex((ing) => !ing.foodRefId);
                                            if (firstEmptyIndex !== -1) {
                                                setNameInputs((prev) => {
                                                    const next = [...prev];
                                                    if (firstEmptyIndex >= next.length) {
                                                        next.push(fr.name);
                                                    } else {
                                                        next[firstEmptyIndex] = fr.name;
                                                    }
                                                    return next;
                                                });
                                                updateAt(firstEmptyIndex, { foodRefId: fr.id, unitId: '' });
                                                return;
                                            }

                                            setIngredients((prev) => [...prev, { foodRefId: fr.id, quantity: 1, unitId: '' }]);
                                            setNameInputs((prev) => [...prev, fr.name]);
                                        }}
                                    >
                                        Add to Recipe
                                    </CusButton>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (page > 1) setPage?.(page - 1);
                                        }}
                                        className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                    />
                                </PaginationItem>

                                {renderPageNumbers().map((pageNum, idx) => (
                                    pageNum === 'ellipsis' ? (
                                        <PaginationItem key={`ellipsis-${idx}`}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    ) : (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setPage?.(pageNum);
                                                }}
                                                isActive={pageNum === page}
                                                className="cursor-pointer"
                                            >
                                                {pageNum}
                                            </PaginationLink>
                                        </PaginationItem>
                                    )
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (page < totalPages) setPage?.(page + 1);
                                        }}
                                        className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </>
            )}
        </div>
    );
}

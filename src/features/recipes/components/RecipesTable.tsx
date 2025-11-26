"use client";

import React from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { RecipeSummary, PaginatedResponse } from '../services/recipesService';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { ColorTheme } from '@/constants/color';
import { Clock, Users, ChefHat, Eye, EyeOff } from 'lucide-react';
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

type Props = {
    list: UseQueryResult<PaginatedResponse<RecipeSummary>, unknown>;
    pageNumber: number;
    setPageNumber: (page: number) => void;
    pageSize: number;
};

export default function RecipesTable({ list, pageNumber, setPageNumber, pageSize }: Props) {
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
        <div className="w-full max-w-5xl space-y-6">
            <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full text-white grid place-items-center text-sm font-semibold" style={{ backgroundColor: ColorTheme.blueGray }}>
                    {items.length}
                </div>
                <h2 className="text-lg md:text-xl font-semibold">My Recipes</h2>
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

            <div className="space-y-4">
                {items.map((recipe) => (
                    <WhiteCard key={recipe.id} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex gap-6">
                            {/* Recipe Image */}
                            <div className="flex-shrink-0">
                                {recipe.imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={recipe.imageUrl}
                                        alt={recipe.title}
                                        className="w-32 h-24 object-cover rounded-xl shadow-sm"
                                    />
                                ) : (
                                    <div
                                        className="w-32 h-24 rounded-xl flex items-center justify-center text-white"
                                        style={{ backgroundColor: ColorTheme.powderBlue }}
                                    >
                                        <ChefHat className="w-8 h-8 opacity-50" />
                                    </div>
                                )}
                            </div>

                            {/* Recipe Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <h3 className="text-xl font-semibold text-gray-900 truncate">
                                        {recipe.title}
                                    </h3>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {recipe.isPublic ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: ColorTheme.babyBlue, color: ColorTheme.darkBlue }}>
                                                <Eye className="w-3 h-3" />
                                                Public
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                <EyeOff className="w-3 h-3" />
                                                Private
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {recipe.description && (
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {recipe.description}
                                    </p>
                                )}

                                {/* Recipe Metadata */}
                                <div className="flex flex-wrap gap-4 text-sm">
                                    {recipe.totalTimes !== undefined && recipe.totalTimes > 0 && (
                                        <div className="flex items-center gap-1.5 text-gray-600">
                                            <Clock className="w-4 h-4" style={{ color: ColorTheme.blueGray }} />
                                            <span>{recipe.totalTimes} min</span>
                                        </div>
                                    )}

                                    {recipe.servings && (
                                        <div className="flex items-center gap-1.5 text-gray-600">
                                            <Users className="w-4 h-4" style={{ color: ColorTheme.blueGray }} />
                                            <span>{recipe.servings} {recipe.servings === 1 ? 'serving' : 'servings'}</span>
                                        </div>
                                    )}

                                    {recipe.difficultyLevel && (
                                        <div className="flex items-center gap-1.5">
                                            <ChefHat className="w-4 h-4" style={{ color: ColorTheme.blueGray }} />
                                            <span
                                                className="font-medium"
                                                style={{
                                                    color: recipe.difficultyLevel === 'Easy' ? '#10b981' :
                                                        recipe.difficultyLevel === 'Medium' ? '#f59e0b' :
                                                            '#ef4444'
                                                }}
                                            >
                                                {recipe.difficultyLevel}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </WhiteCard>
                ))}
            </div>

            {/* Pagination */}
            {!list.isLoading && totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-600">
                        Showing {items.length > 0 ? (pageNumber - 1) * pageSize + 1 : 0} to {Math.min(pageNumber * pageSize, totalCount)} of {totalCount} recipes
                    </p>
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

'use client';

import React, { useState, useEffect, useRef } from 'react';
import RecipesCards from '@/features/recipes-view/RecipesCards';
import { useRecipesList } from '@/features/recipes/hooks/useRecipes';
import { RecipeSummary } from '@/features/recipes/services/recipesService';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ChefHat, Loader2, Search } from 'lucide-react';
import { ColorTheme } from '@/constants/color';
import RollToTopButton from '@/features/recipes-view/RollToTopButton';

export default function RecipesViewPage() {
    const [pageNumber, setPageNumber] = useState(1);
    const [allItems, setAllItems] = useState<RecipeSummary[]>([]);
    const [search, setSearch] = useState('');
    const pageSize = 6;
    const observerTarget = useRef<HTMLDivElement>(null);

    const list = useRecipesList({ pageNumber, pageSize });
    const totalCount = list.data?.totalCount ?? 0;
    const hasMore = allItems.length < totalCount;

    // Accumulate items when new page loads
    useEffect(() => {
        const items = list.data?.items ?? [];
        if (items.length > 0) {
            setAllItems((prev) => {
                const existingIds = new Set(prev.map((item) => item.id));
                const newItems = items.filter((item) => !existingIds.has(item.id));
                return [...prev, ...newItems];
            });
        }
    }, [list.data?.items]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !list.isLoading) {
                    setPageNumber((prev) => prev + 1);
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, list.isLoading]);

    return (
        <div className="min-h-screen">
            <div className="w-full sticky top-0 z-20">
                {/* Header Section */}
                <div
                    className="w-full h-64 md:h-80 rounded-b-[80px] flex flex-col items-center justify-center text-center px-4 bg-cover bg-center bg-no-repeat relative opacity-70"
                    style={{

                        backgroundImage: 'url(/assets/img/header2.jpg)'
                    }}
                >
                    {/* overlay */}
                    <div className="absolute inset-0 bg-black/20 rounded-b-[80px]"></div>

                    {/* Content with higher z-index */}
                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-bold" style={{ color: ColorTheme.darkBlue }}>
                            Our Recommended Dish
                        </h1>
                        <h2 className="text-lg md:text-xl text-white/90 mt-2 drop-shadow-md" style={{ color: ColorTheme.darkBlue }}>
                            We hope there&#39;s something that inspires you!
                        </h2>

                        {/* Search Bar */}
                        <div className="relative max-w-lg mx-auto mt-6">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Know what you want? Search it!"
                                className="w-full pl-6 pr-16 py-4 bg-white rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#769FCD]/30 focus:border-[#769FCD] text-gray-700 placeholder-gray-400 text-base"
                            />
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                                <div className="bg-[#769FCD] rounded-full p-3 cursor-pointer hover:bg-[#5a7ba8] transition-colors">
                                    <Search className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Count aligned right */}
                {/* <p className="text-sm text-gray-600 text-right mt-2 pr-2">
                    {totalCount} {totalCount === 1 ? 'recipe' : 'recipes'} available
                </p> */}
            </div>

            <div className="p-6 md:p-12">
                <div className="max-w-7xl mx-auto space-y-6">




                    {/* Initial Loading State */}
                    {list.isLoading && pageNumber === 1 && (
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <WhiteCard key={i} className="p-6">
                                    <Skeleton className="w-full h-48 rounded-xl mb-4" />
                                    <Skeleton className="h-6 w-2/3 mb-2" />
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-1/2" />
                                </WhiteCard>
                            ))}
                        </div>
                    )}

                    {/* Error State */}
                    {list.isError && (
                        <WhiteCard className="p-12">
                            <div className="text-red-600 text-center">
                                Failed to load recipes. Please try again later.
                            </div>
                        </WhiteCard>
                    )}

                    {/* Empty State */}
                    {!list.isLoading && !list.isError && allItems.length === 0 && (
                        <WhiteCard className="p-12">
                            <div className="text-center text-gray-500">
                                <ChefHat className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                <p className="text-lg font-medium">No recipes found</p>
                                <p className="text-sm mt-2">Check back later for delicious recipes!</p>
                            </div>
                        </WhiteCard>
                    )}

                    {/* Recipe Cards */}
                    {allItems.length > 0 && (
                        <RecipesCards items={allItems} />
                    )}

                    {/* Infinite Scroll Trigger */}
                    {hasMore && (
                        <div ref={observerTarget} className="flex items-center justify-center py-8">
                            {list.isLoading && pageNumber > 1 && (
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Loading more recipes...</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* End of Results */}
                    {!hasMore && allItems.length > 0 && (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            You&apos;ve reached the end of the recipes
                        </div>
                    )}
                </div>
            </div>
            <RollToTopButton />
        </div>
    );
}

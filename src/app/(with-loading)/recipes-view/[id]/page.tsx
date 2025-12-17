'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import RecipesViewDetails from '@/features/recipes-view/RecipesViewDetails';
import { useRecipeDetails } from '@/features/recipes/hooks/useRecipes';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

export default function RecipeDetailsPage() {
    const params = useParams();
    const recipeId = params.id as string;

    const { data: recipe, isLoading, isError, error } = useRecipeDetails(recipeId);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="w-full flex justify-center px-6 pt-20">
                    <div className="w-full max-w-5xl">
                        <WhiteCard className="bg-white/50">
                            <div className="p-8 space-y-8">
                                {/* Loading skeleton for header */}
                                <div className="space-y-4">
                                    <Skeleton className="h-8 w-64" />
                                    <Skeleton className="h-4 w-32" />
                                </div>

                                {/* Loading skeleton for tabs */}
                                <div className="flex gap-4">
                                    <Skeleton className="h-10 w-24" />
                                    <Skeleton className="h-10 w-24" />
                                    <Skeleton className="h-10 w-24" />
                                </div>

                                {/* Loading skeleton for content */}
                                <div className="space-y-6">
                                    <Skeleton className="h-12 w-full max-w-md" />
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="w-full h-64 rounded-2xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-32" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[1, 2, 3, 4].map((i) => (
                                            <Skeleton key={i} className="h-20 rounded-xl" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </WhiteCard>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !recipe) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="w-full flex justify-center px-6 pt-20">
                    <div className="w-full max-w-2xl">
                        <WhiteCard className="p-12">
                            <div className="text-center text-red-600">
                                <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-60" />
                                <h2 className="text-xl font-semibold mb-2">Recipe Not Found</h2>
                                <p className="text-gray-600 mb-4">
                                    {error?.message || 'The recipe you are looking for does not exist or has been removed.'}
                                </p>
                                <button
                                    onClick={() => window.history.back()}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Go Back
                                </button>
                            </div>
                        </WhiteCard>
                    </div>
                </div>
            </div>
        );
    }

    return <RecipesViewDetails data={recipe} />;
}

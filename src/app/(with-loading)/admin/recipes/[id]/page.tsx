"use client";

import { use } from "react";
import RecipesDetailsPage from "@/features/recipes/components/recipes-details/RecipesDetailsPage";
import { useRecipeDetails } from "@/features/recipes/hooks/useRecipes";
import { DetailsSkeleton } from "@/components/decoration/DetailsSkeleton";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function RecipeDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const { data, isLoading, error } = useRecipeDetails(id);

    if (isLoading) {
        return <DetailsSkeleton />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-red-600">Error loading recipe: {error.message}</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Recipe not found</div>
            </div>
        );
    }

    return <RecipesDetailsPage recipeId={id} initialData={data} />;
}

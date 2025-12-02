"use client";

import { use } from "react";
import RecipesDetailsPage from "@/features/recipes/components/RecipesDetailsPage";
import { useRecipeDetails } from "@/features/recipes/hooks/useRecipes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function RecipeDetailPage({ params }: PageProps) {
    const router = useRouter();
    const { id } = use(params);
    const { data, isLoading, error } = useRecipeDetails(id);

    const handleSave = async (recipeData: any) => {
        try {
            // TODO: Implement update API call
            console.log("Saving recipe:", recipeData);
            toast.success("Recipe updated successfully!");
        } catch (err) {
            toast.error("Failed to update recipe");
            console.error(err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading recipe details...</div>
            </div>
        );
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

    return <RecipesDetailsPage initialData={data} onSave={handleSave} />;
}

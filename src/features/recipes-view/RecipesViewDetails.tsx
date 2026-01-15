"use client";

import React from "react";
import Image from "next/image";
import { WhiteCard } from "@/components/decoration/WhiteCard";
import { CusButton } from "@/components/ui/cusButton";
import { ColorTheme } from "@/constants/color";
import { ArrowLeft, Clock, CookingPot, Users, ChefHat, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePublicRecipeDetails } from "@/features/recipes/hooks/useRecipes";
import { Skeleton } from "@/components/ui/skeleton";
import IngredientsCards from "./IngredientsCards";
import DirectionsCards from "./DirectionsCards";
import RollToTopButton from "./RollToTopButton";

const difficultyColors: Record<string, { bg: string; text: string; badgeBg: string }> = {
    Easy: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', badgeBg: '#B0C5A4' },
    Medium: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', badgeBg: '#E4C087' },
    Hard: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', badgeBg: '#FF8F8F' }
};

const getDifficultyColor = (difficulty?: string | null) => {
    if (!difficulty) return difficultyColors.Medium;
    return difficultyColors[difficulty] || difficultyColors.Medium;
};

type Ingredient = {
    ingredientId?: string;
    foodRefId: string;
    foodRefName: string;
    imageUrl?: string | null;
    quantity: number;
    unitId: string;
    unitName: string;
    notes?: string | null;
};

type Direction = {
    directionId?: string;
    stepNumber: number;
    description: string;
    imageUrl?: string | null;
};

type RecipeDetail = {
    recipeTitle: string;
    description?: string | null;
    prepTimeMinutes?: number | null;
    cookTimeMinutes?: number | null;
    totalTimeMinutes?: number | null;
    notes?: string | null;
    servings?: number | null;
    difficultyLevel?: string | null;
    imageUrl?: string | null;
    isPublic?: boolean;
    ingredients: Ingredient[];
    directions: Direction[];
};

type Props = {
    recipeId: string;
};

export default function RecipesViewDetails({ recipeId }: Props) {
    const router = useRouter();
    const { data, isLoading, isError } = usePublicRecipeDetails(recipeId);

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <div className="w-full flex justify-center px-6 py-10">
                    <div className="w-full max-w-5xl">
                        <div className="mb-6">
                            <CusButton
                                variant="blueGray"
                                onClick={() => router.back()}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </CusButton>
                        </div>
                        <WhiteCard className="bg-white/80">
                            <div className="p-8 space-y-12">
                                <Skeleton className="h-12 w-2/3" />
                                <Skeleton className="h-64 w-full rounded-2xl" />
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <Skeleton key={i} className="h-24 rounded-xl" />
                                    ))}
                                </div>
                            </div>
                        </WhiteCard>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="min-h-screen">
                <div className="w-full flex justify-center px-6 py-10">
                    <div className="w-full max-w-5xl">
                        <div className="mb-6">
                            <CusButton
                                variant="blueGray"
                                onClick={() => router.back()}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </CusButton>
                        </div>
                        <WhiteCard className="bg-white/80">
                            <div className="p-12 text-center">
                                <ChefHat className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                <p className="text-lg font-medium text-gray-500">Recipe not found</p>
                                <p className="text-sm mt-2 text-gray-400">This recipe may not be available</p>
                            </div>
                        </WhiteCard>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="w-full flex justify-center px-6 py-10">
                <div className="w-full max-w-5xl">
                    <div className="mb-6">
                        <CusButton
                            variant="blueGray"
                            onClick={() => router.back()}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </CusButton>
                    </div>
                    <WhiteCard className="bg-white/80">
                        <div className="p-8 space-y-12">
                            {/* Basic Info Section */}
                            <div className="prose prose-slate max-w-none">
                                {/* Title */}
                                <h1 className="text-4xl font-bold mb-2" style={{ color: ColorTheme.darkBlue }}>
                                    {data.recipeTitle}
                                </h1>

                                {/* Description */}
                                <div className="prose prose-slate max-w-none">
                                    {data.description && (
                                        <div className="mb-8 mt-8">

                                            <p className="text-gray-700 leading-relaxed">
                                                {data.description}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Image */}
                                {data.imageUrl && (
                                    <Image
                                        src={data.imageUrl}
                                        alt={data.recipeTitle}
                                        width={800}
                                        height={500}
                                        className="w-full max-h-[700px] object-cover rounded-2xl mb-6 shadow-lg"
                                    />
                                )}

                                {/* Recipe Info Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-8 not-prose">
                                    {/* Prep Time */}
                                    <div className="p-4 rounded-xl flex items-center gap-4" style={{ backgroundColor: ColorTheme.babyBlue }}>
                                        <Clock size={32} color={ColorTheme.darkBlue} />
                                        <div className="border-l border-gray-400 pl-4">
                                            <div className="text-sm text-gray-600">Prep Time</div>
                                            <div className="text-xl font-bold" style={{ color: ColorTheme.darkBlue }}>
                                                {data.prepTimeMinutes ?? 0} min
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cook Time */}
                                    <div className="p-4 rounded-xl flex items-center gap-4" style={{ backgroundColor: ColorTheme.babyBlue }}>
                                        <ChefHat size={32} color={ColorTheme.darkBlue} />
                                        <div className="border-l border-gray-400 pl-4">
                                            <div className="text-sm text-gray-600">Cook Time</div>
                                            <div className="text-xl font-bold" style={{ color: ColorTheme.darkBlue }}>
                                                {data.cookTimeMinutes ?? 0} min
                                            </div>
                                        </div>
                                    </div>

                                    {/* Servings */}
                                    <div className="p-4 rounded-xl flex items-center gap-4" style={{ backgroundColor: ColorTheme.babyBlue }}>
                                        <Users size={32} color={ColorTheme.darkBlue} />
                                        <div className="border-l border-gray-400 pl-4">
                                            <div className="text-sm text-gray-600">Servings</div>
                                            <div className="text-xl font-bold" style={{ color: ColorTheme.darkBlue }}>
                                                {data.servings ?? 1}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Difficulty */}
                                    <div
                                        className="p-4 rounded-xl flex items-center gap-4"
                                        style={{ backgroundColor: getDifficultyColor(data.difficultyLevel).bg }}
                                    >
                                        <CookingPot size={32} style={{ color: getDifficultyColor(data.difficultyLevel).text }} />
                                        <div className="border-l pl-4" style={{ borderColor: getDifficultyColor(data.difficultyLevel).text }}>
                                            <div className="text-sm text-gray-600">Difficulty</div>
                                            <div
                                                className="text-xl font-bold"
                                                style={{ color: getDifficultyColor(data.difficultyLevel).text }}
                                            >
                                                {data.difficultyLevel ?? "Medium"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                {data.notes && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-2" style={{ color: ColorTheme.blueGray }}>
                                            Notes
                                        </h3>
                                        <p className="text-gray-700">{data.notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Ingredients Section */}
                            <IngredientsCards ingredients={data.ingredients} />

                            {/* Directions Section */}
                            <DirectionsCards directions={data.directions} />
                        </div>
                    </WhiteCard>
                    <RollToTopButton />
                </div>
            </div>
        </div>
    );
}

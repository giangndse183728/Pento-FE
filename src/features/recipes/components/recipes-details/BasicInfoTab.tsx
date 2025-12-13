"use client";

import React, { useState } from "react";
import { ColorTheme } from "@/constants/color";
import { Clock, ChefHat, Users, CookingPot, ImageIcon } from "lucide-react";
import { CusButton } from "@/components/ui/cusButton";
import ImageEditModal from "@/components/decoration/ImageEditModal";
import { useUploadRecipeImage } from "../../hooks/useRecipes";

const difficultyColors: Record<string, { bg: string; text: string }> = {
    Easy: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' },
    Medium: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
    Hard: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' }
};

const getDifficultyColor = (difficulty?: string | null) => {
    if (!difficulty) return difficultyColors.Medium;
    return difficultyColors[difficulty] || difficultyColors.Medium;
};

type Props = {
    recipeId: string;
    recipeTitle: string;
    description?: string | null;
    imageUrl?: string | null;
    prepTimeMinutes?: number | null;
    cookTimeMinutes?: number | null;
    servings?: number | null;
    difficultyLevel?: string | null;
    notes?: string | null;
    isPublic?: boolean;
};

export default function BasicInfoTab({
    recipeId,
    recipeTitle,
    description,
    imageUrl,
    prepTimeMinutes,
    cookTimeMinutes,
    servings,
    difficultyLevel,
    notes,
    isPublic
}: Props) {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const uploadImageMutation = useUploadRecipeImage();

    const handleImageUpload = (file: File) => {
        uploadImageMutation.mutate({ recipeId, imageFile: file });
    };

    return (
        <>
            <div className="prose prose-slate max-w-none">
                {/* Title + Visibility Badge */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-bold m-0" style={{ color: ColorTheme.darkBlue }}>
                        {recipeTitle}
                    </h1>
                    <span
                        className="inline-block px-5 py-1 rounded-full text-sm font-semibold"
                        style={{
                            backgroundColor: isPublic ? '#67C090' : '#FFA07A',
                            color: 'white'
                        }}
                    >
                        {isPublic ? 'Public' : 'Private'}
                    </span>
                </div>

                {/* Description */}
                {description && (
                    <div className="mb-8 mt-8">
                        <p className="text-gray-700 leading-relaxed">
                            {description}
                        </p>
                    </div>
                )}

                {/* Image */}
                <div className="relative mb-6">
                    {imageUrl ? (
                        <div className="relative group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={imageUrl}
                                alt={recipeTitle}
                                className="w-full max-h-[600px] object-cover rounded-2xl shadow-lg"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 rounded-2xl flex items-center justify-center">
                                <CusButton
                                    variant="blueGray"
                                    size="sm"
                                    onClick={() => setIsImageModalOpen(true)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    Change Image
                                </CusButton>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="w-full h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                            style={{ borderColor: ColorTheme.powderBlue }}
                            onClick={() => setIsImageModalOpen(true)}
                        >
                            <ImageIcon size={48} color={ColorTheme.powderBlue} />
                            <p className="text-gray-500">Click to add an image</p>
                        </div>
                    )}
                </div>

                {/* Recipe Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-8 not-prose">
                    {/* Prep Time */}
                    <div className="p-4 rounded-xl flex items-center gap-4" style={{ backgroundColor: ColorTheme.babyBlue }}>
                        <Clock size={32} color={ColorTheme.darkBlue} />
                        <div className="border-l border-gray-400 pl-4">
                            <div className="text-sm text-gray-600">Prep Time</div>
                            <div className="text-xl font-bold" style={{ color: ColorTheme.darkBlue }}>
                                {prepTimeMinutes ?? 0} min
                            </div>
                        </div>
                    </div>

                    {/* Cook Time */}
                    <div className="p-4 rounded-xl flex items-center gap-4" style={{ backgroundColor: ColorTheme.babyBlue }}>
                        <ChefHat size={32} color={ColorTheme.darkBlue} />
                        <div className="border-l border-gray-400 pl-4">
                            <div className="text-sm text-gray-600">Cook Time</div>
                            <div className="text-xl font-bold" style={{ color: ColorTheme.darkBlue }}>
                                {cookTimeMinutes ?? 0} min
                            </div>
                        </div>
                    </div>

                    {/* Servings */}
                    <div className="p-4 rounded-xl flex items-center gap-4" style={{ backgroundColor: ColorTheme.babyBlue }}>
                        <Users size={32} color={ColorTheme.darkBlue} />
                        <div className="border-l border-gray-400 pl-4">
                            <div className="text-sm text-gray-600">Servings</div>
                            <div className="text-xl font-bold" style={{ color: ColorTheme.darkBlue }}>
                                {servings ?? 1}
                            </div>
                        </div>
                    </div>

                    {/* Difficulty */}
                    <div
                        className="p-4 rounded-xl flex items-center gap-4"
                        style={{ backgroundColor: getDifficultyColor(difficultyLevel).bg }}
                    >
                        <CookingPot size={32} style={{ color: getDifficultyColor(difficultyLevel).text }} />
                        <div className="border-l pl-4" style={{ borderColor: getDifficultyColor(difficultyLevel).text }}>
                            <div className="text-sm text-gray-600">Difficulty</div>
                            <div
                                className="text-xl font-bold"
                                style={{ color: getDifficultyColor(difficultyLevel).text }}
                            >
                                {difficultyLevel ?? "Medium"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {notes && (
                    <div className="bg-blue-50 p-4 rounded-xl mb-6">
                        <h3 className="text-lg font-semibold mb-2" style={{ color: ColorTheme.blueGray }}>
                            Notes
                        </h3>
                        <p className="text-gray-700">{notes}</p>
                    </div>
                )}
            </div>

            {/* Image Edit Modal */}
            {isImageModalOpen && (
                <ImageEditModal
                    title="Upload Recipe Image"
                    label="Recipe Image"
                    currentImage={imageUrl ?? null}
                    onImageSelect={handleImageUpload}
                    onClose={() => setIsImageModalOpen(false)}
                    isLoading={uploadImageMutation.isPending}
                    confirmLabel="Upload"
                    imageSize={200}
                />
            )}
        </>
    );
}

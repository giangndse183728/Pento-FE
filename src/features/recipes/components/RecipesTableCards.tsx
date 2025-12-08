"use client";

import React, { useState } from 'react';
import { RecipeSummary } from '../services/recipesService';
import { useDeleteRecipe } from '../hooks/useRecipes';
import ConfirmModal from '@/components/decoration/ConfirmModal';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { ColorTheme } from '@/constants/color';
import { Clock, Users, ChefHat, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type RecipesTableCardsProps = {
    items: RecipeSummary[];
    deleteMode?: boolean;
};

const difficultyColors: Record<string, { bg: string; text: string }> = {
    Easy: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' },
    Medium: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
    Hard: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' }
};

export default function RecipesTableCards({ items, deleteMode = false }: RecipesTableCardsProps) {
    const router = useRouter();
    const deleteMutation = useDeleteRecipe();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleDeleteClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedId(id);
        setModalOpen(true);
    };

    const handleConfirm = () => {
        if (selectedId) {
            deleteMutation.mutate(selectedId, {
                onSuccess: () => {
                    setModalOpen(false);
                    setSelectedId(null);
                },
                onError: () => {
                    setModalOpen(false);
                    setSelectedId(null);
                }
            });
        }
    };

    const handleCancel = () => {
        setModalOpen(false);
        setSelectedId(null);
    };

    if (items.length === 0) return null;

    return (
        <>
            <ConfirmModal
                open={modalOpen}
                title="Delete Recipe"
                message="Are you sure you want to delete this recipe?"
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                loading={deleteMutation.isPending}
            />
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {items.map((recipe) => (
                    <WhiteCard
                        key={recipe.id}
                        width="100%"
                        height="auto"
                        className="group h-full border border-white/80 shadow-xl hover:shadow-2xl transition-shadow duration-200 relative cursor-pointer"
                        onClick={() => router.push(`/admin/recipes/${recipe.id}`)}
                    >
                        {deleteMode && (
                            <button
                                onClick={(e) => handleDeleteClick(recipe.id, e)}
                                className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                                aria-label="Delete recipe"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                        <div className="flex flex-col gap-6">
                            {/* Hero */}
                            <div
                                className="relative overflow-hidden rounded-3xl p-4"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(118,159,205,0.18), rgba(255,255,255,0.9))'
                                }}
                            >
                                <div
                                    className="absolute inset-0 opacity-30 pointer-events-none"
                                    style={{
                                        backgroundImage: 'radial-gradient(circle at top, rgba(118,159,205,0.35), transparent 50%)'
                                    }}
                                />

                                <div className="relative flex items-center justify-between mb-4">
                                    <span
                                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-white/70 shadow-sm"
                                        style={{ color: ColorTheme.blueGray }}
                                    >
                                        {recipe.isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                        {recipe.isPublic ? 'Public' : 'Private'}
                                    </span>

                                    {recipe.totalTimes && recipe.totalTimes > 0 && (
                                        <span
                                            className="rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg"
                                            style={{ backgroundColor: ColorTheme.blueGray }}
                                        >
                                            {recipe.totalTimes} min
                                        </span>
                                    )}
                                </div>

                                <div className="relative rounded-2xl overflow-hidden bg-white shadow-inner">
                                    {recipe.imageUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={recipe.imageUrl}
                                            alt={recipe.title}
                                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                        />
                                    ) : (
                                        <div
                                            className="w-full h-48 flex items-center justify-center text-white"
                                            style={{ backgroundColor: ColorTheme.powderBlue }}
                                        >
                                            <ChefHat className="w-10 h-10 opacity-60" />
                                        </div>
                                    )}
                                </div>

                            </div>

                            {/* Details */}
                            <div className="relative flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <p
                                        className="text-xs font-semibold uppercase tracking-[0.3rem] mb-2"
                                        style={{ color: ColorTheme.blueGray }}
                                    >
                                        Recipes of
                                    </p>
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-2 line-clamp-1">{recipe.title}</h3>
                                    {recipe.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {recipe.description}
                                        </p>
                                    )}
                                </div>


                            </div>

                            {/* Metadata */}
                            <div className="flex flex-wrap gap-2">
                                {recipe.difficultyLevel && (
                                    <span
                                        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                                        style={{
                                            backgroundColor: difficultyColors[recipe.difficultyLevel]?.bg ?? 'rgba(107,114,128,0.15)',
                                            color: difficultyColors[recipe.difficultyLevel]?.text ?? '#4b5563'
                                        }}
                                    >
                                        <ChefHat className="w-3 h-3" />
                                        {recipe.difficultyLevel}
                                    </span>
                                )}

                                {recipe.servings && (
                                    <span
                                        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                                        style={{
                                            backgroundColor: 'rgba(118,159,205,0.12)',
                                            color: ColorTheme.blueGray
                                        }}
                                    >
                                        <Users className="w-3 h-3" />
                                        {recipe.servings} {recipe.servings === 1 ? 'Serving' : 'Servings'}
                                    </span>
                                )}

                                {recipe.totalTimes && (
                                    <span
                                        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                                        style={{
                                            backgroundColor: 'rgba(118,159,205,0.12)',
                                            color: ColorTheme.blueGray
                                        }}
                                    >
                                        <Clock className="w-3 h-3" />
                                        {recipe.totalTimes} min total
                                    </span>
                                )}
                            </div>
                        </div>
                    </WhiteCard>
                ))}
            </div>
        </>
    );
}


"use client";

import React from 'react';
import { RecipeSummary } from '@/features/recipes/services/recipesService';
import { ColorTheme } from '@/constants/color';
import { ROUTES } from '@/constants/routes';
import { Clock, Users, ChefHat } from 'lucide-react';
import { useRouter } from 'next/navigation';
import '@/styles/recipes-card.css';

type RecipesTableCardsProps = {
    items: RecipeSummary[];
};

const difficultyColors: Record<string, { bg: string; text: string; badgeBg: string }> = {
    Easy: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', badgeBg: '#B0C5A4' },
    Medium: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', badgeBg: '#E4C087' },
    Hard: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', badgeBg: '#FF8F8F' }
};

const getDifficultyBadgeColor = (difficulty?: string | null) => {
    if (!difficulty) return '#6b7280';
    return difficultyColors[difficulty]?.badgeBg ?? '#6b7280';
};

export default function RecipesTableCards({ items }: RecipesTableCardsProps) {
    const router = useRouter();
    const publicRecipes = items.filter(recipe => recipe.isPublic === true);

    if (publicRecipes.length === 0) return null;

    return (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {publicRecipes.map((recipe) => (
                <div
                    key={recipe.id}
                    className="card cursor-pointer"
                    onClick={() => {
                        const url = ROUTES.RECIPES_VIEW_DETAIL.replace('[id]', recipe.id);
                        router.push(url);
                    }}
                    style={{
                        // @ts-expect-error CSS custom property
                        '--difficulty-color': getDifficultyBadgeColor(recipe.difficultyLevel)
                    }}
                >
                    {/* Difficulty Badge */}
                    <div
                        className="difficulty-badge"
                        data-difficulty={recipe.difficultyLevel || 'N/A'}
                        style={{
                            position: 'absolute',
                            width: '60px',
                            height: '60px',
                            top: '0%',
                            right: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            backgroundColor: getDifficultyBadgeColor(recipe.difficultyLevel),
                            transition: 'all 0.5s ease',
                            zIndex: 10,
                            pointerEvents: 'none',
                            padding: '10px'
                        }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`/assets/img/${(recipe.difficultyLevel || 'easy').toLowerCase()}.png`}
                            alt={recipe.difficultyLevel || 'N/A'}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    {/* Hero Image */}
                    <div className="card__image ">
                        {recipe.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={recipe.imageUrl}
                                alt={recipe.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                                <ChefHat className="w-12 h-12 opacity-60" />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="card__content flex flex-col gap-3 mt-3 flex-1">
                        {/* Title */}
                        <div>
                            <p
                                className="text-[9px] font-semibold uppercase tracking-[0.2rem] mb-1"
                                style={{ color: ColorTheme.blueGray }}
                            >
                                Recipe of
                            </p>
                            <h3 className="title">{recipe.title}</h3>
                            {/* {recipe.description && (
                                <p className="text-xs text-gray-600 mt-1">
                                    {recipe.description}
                                </p>
                            )} */}
                        </div>

                        {/* Body - Chips always at bottom */}
                        <div className="flex flex-wrap gap-2 mt-auto">
                            {recipe.servings && (
                                <span
                                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                                    style={{
                                        backgroundColor: 'rgba(118,159,205,0.12)',
                                        color: ColorTheme.blueGray
                                    }}
                                >
                                    <Users className="w-3 h-3" />
                                    {recipe.servings}
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
                                    {recipe.totalTimes}m
                                </span>
                            )}

                            {recipe.difficultyLevel && (
                                <span
                                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                                    style={{
                                        backgroundColor: getDifficultyBadgeColor(recipe.difficultyLevel) + '33',
                                        color: difficultyColors[recipe.difficultyLevel]?.text ?? '#6b7280'
                                    }}
                                >
                                    {recipe.difficultyLevel}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}


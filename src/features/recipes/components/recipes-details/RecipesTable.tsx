'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UseQueryResult } from '@tanstack/react-query';
import { RecipeSummary, PaginatedResponse } from '../../services/recipesService';
import { useDeleteRecipe } from '../../hooks/useRecipes';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import ConfirmModal from '@/components/decoration/ConfirmModal';
import { ChefHat, SquarePen, Trash, Clock, Users } from 'lucide-react';
import { CusButton } from '@/components/ui/cusButton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

type Props = {
    list: UseQueryResult<PaginatedResponse<RecipeSummary>, unknown>;
    pageNumber: number;
    setPageNumber: (page: number) => void;
    pageSize?: number;
    difficulty?: string;
    search?: string;
    sort?: string;
};

export default function RecipesTable({ list, pageNumber, setPageNumber, pageSize = 12, difficulty, search, sort }: Props) {
    const router = useRouter();
    const deleteMutation = useDeleteRecipe();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<RecipeSummary | null>(null);

    const items = list.data?.items ?? [];
    const totalCount = list.data?.totalCount ?? 0;
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasPrevious = pageNumber > 1;
    const hasNext = pageNumber < totalPages;

    const handleDeleteClick = (recipe: RecipeSummary, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedRecipe(recipe);
        setModalOpen(true);
    };

    const handleConfirm = () => {
        if (selectedRecipe) {
            deleteMutation.mutate(selectedRecipe.id, {
                onSuccess: () => {
                    setModalOpen(false);
                    setSelectedRecipe(null);
                },
                onError: () => {
                    setModalOpen(false);
                    setSelectedRecipe(null);
                }
            });
        }
    };

    const handleCancel = () => {
        setModalOpen(false);
        setSelectedRecipe(null);
    };

    const getDifficultyStyle = (level: string | null) => {
        switch (level) {
            case 'Easy': return { backgroundColor: '#10B981' };
            case 'Medium': return { backgroundColor: '#F59E0B' };
            case 'Hard': return { backgroundColor: '#EF4444' };
            default: return { backgroundColor: '#9CA3AF' };
        }
    };

    const formatTime = (minutes: number | null | undefined) => {
        if (!minutes) return '-';
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    return (
        <>
            <ConfirmModal
                open={modalOpen}
                title="Delete Recipe"
                message={`Are you sure you want to delete "${selectedRecipe?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                loading={deleteMutation.isPending}
            />
            <div className="w-full space-y-6">
                {/* Recipes Table Section */}
                <WhiteCard className="w-full" width="100%" height="auto">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold" style={{ color: '#113F67' }}>
                                My Recipes
                            </h2>
                            {!list.isLoading && list.data && (
                                <p className="text-sm text-gray-500">
                                    {totalCount} total recipes
                                </p>
                            )}
                        </div>

                        {list.isLoading ? (
                            <div className="text-center py-12 text-gray-500">
                                Loading recipes...
                            </div>
                        ) : list.isError ? (
                            <div className="text-center py-12 text-red-500">
                                Failed to load recipes. Please try again.
                            </div>
                        ) : items.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <ChefHat className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                <p className="text-lg font-medium">No recipes found</p>
                                <p className="text-sm mt-2">Create your first recipe to get started!</p>
                            </div>
                        ) : (
                            <>
                                <Table className="w-full table-fixed">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className='text-lg font-semibold w-[80px]' style={{ color: '#113F67' }}>Image</TableHead>
                                            <TableHead className='text-lg font-semibold' style={{ color: '#113F67' }}>Title</TableHead>
                                            <TableHead className='text-lg font-semibold w-[100px]' style={{ color: '#113F67' }}>Difficulty</TableHead>
                                            <TableHead className='text-lg font-semibold w-[130px]' style={{ color: '#113F67' }}>
                                                <div className="flex items-center gap-1">

                                                    Prep / Cook
                                                </div>
                                            </TableHead>
                                            <TableHead className='text-lg font-semibold w-[100px]' style={{ color: '#113F67' }}>
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    Servings
                                                </div>
                                            </TableHead>
                                            <TableHead className='text-lg font-semibold w-[80px]' style={{ color: '#113F67' }}>Public</TableHead>
                                            <TableHead className='text-lg font-semibold text-center w-[100px]' style={{ color: '#113F67' }}>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.map((recipe) => (
                                            <TableRow
                                                key={recipe.id}
                                                className="cursor-pointer hover:bg-gray-50"
                                                onClick={() => router.push(`/admin/recipes/${recipe.id}`)}
                                            >
                                                {/* Image */}
                                                <TableCell>
                                                    {recipe.imageUrl ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={recipe.imageUrl}
                                                            alt={recipe.title}
                                                            className="w-12 h-12 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                                            <ChefHat className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </TableCell>

                                                {/* Title */}
                                                <TableCell className="font-semibold text-base" style={{ color: '#113F67' }}>
                                                    <div>
                                                        <p className="truncate">{recipe.title}</p>
                                                        {recipe.description && (
                                                            <p className="text-xs text-gray-500 truncate mt-0.5 font-normal">
                                                                {recipe.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                {/* Difficulty */}
                                                <TableCell>
                                                    <span
                                                        className="px-3 py-1 rounded-full text-xs font-semibold text-white inline-block"
                                                        style={getDifficultyStyle(recipe.difficultyLevel)}
                                                    >
                                                        {recipe.difficultyLevel || 'N/A'}
                                                    </span>
                                                </TableCell>

                                                {/* Prep / Cook Time */}
                                                <TableCell className="text-base text-gray-600">
                                                    {formatTime(recipe.prepTimeMinutes)} / {formatTime(recipe.cookTimeMinutes)}
                                                </TableCell>

                                                {/* Servings */}
                                                <TableCell className="text-sm font-semibold text-gray-700 text-center">
                                                    {recipe.servings ?? '-'}
                                                </TableCell>

                                                {/* Public Status */}
                                                <TableCell>
                                                    <span
                                                        className="px-3 py-1 rounded-full text-xs font-semibold text-white inline-block"
                                                        style={{
                                                            backgroundColor: recipe.isPublic ? '#3B82F6' : '#9CA3AF',
                                                        }}
                                                    >
                                                        {recipe.isPublic ? 'Public' : 'Private'}
                                                    </span>
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell onClick={(e) => e.stopPropagation()} className="text-center">
                                                    <div className="flex gap-2 justify-center">
                                                        <Link href={`/admin/recipes/${recipe.id}?edit=true`}>
                                                            <button
                                                                type="button"
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors inline-flex items-center justify-center"
                                                                title="Edit recipe"
                                                            >
                                                                <SquarePen className="w-5 h-5" />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleDeleteClick(recipe, e)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors inline-flex items-center justify-center"
                                                            title="Delete recipe"
                                                        >
                                                            <Trash className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination */}
                                <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: '#D6E6F2' }}>
                                    <p className="text-sm text-gray-500">
                                        Page {pageNumber} of {totalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <CusButton
                                            type="button"
                                            onClick={() => setPageNumber(pageNumber - 1)}
                                            disabled={!hasPrevious || list.isLoading}
                                            variant="blueGray"
                                        >
                                            Previous
                                        </CusButton>
                                        <CusButton
                                            type="button"
                                            onClick={() => setPageNumber(pageNumber + 1)}
                                            disabled={!hasNext || list.isLoading}
                                            variant="blueGray"
                                        >
                                            Next
                                        </CusButton>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </WhiteCard>
            </div>
        </>
    );
}

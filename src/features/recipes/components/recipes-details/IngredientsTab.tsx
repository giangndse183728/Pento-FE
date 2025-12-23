"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ColorTheme } from "@/constants/color";
import { SquarePen, Trash2, Plus } from "lucide-react";
import { CusButton } from "@/components/ui/cusButton";
import ConfirmModal from "@/components/decoration/ConfirmModal";
import { useUpdateRecipeIngredient, useDeleteRecipeIngredient, useCreateRecipeIngredient } from "../../hooks/useRecipes";
import { UpdateRecipeIngredientInput } from "../../schema/recipeSchema";
import useFoodReferences from "../../hooks/useFoodReferences";
import useUnits from "../../hooks/useUnit";
import { Combobox } from "@/components/ui/Combobox";
import IngredientsEditor from "../ingredients/IngredientsEditor";
import { IngredientInput } from "../../services/recipesService";

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

type Props = {
    ingredients: Ingredient[];
    recipeId: string;
};

export default function IngredientsTab({ ingredients, recipeId }: Props) {
    const updateMutation = useUpdateRecipeIngredient();
    const deleteMutation = useDeleteRecipeIngredient();
    const createMutation = useCreateRecipeIngredient();

    // Food references state for adding ingredients
    const [showAddSection, setShowAddSection] = useState(false);
    const [foodGroup, setFoodGroup] = useState<string | undefined>();
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState<string | undefined>();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    // Food references query
    const foodRefsQuery = useFoodReferences({
        foodGroup,
        search,
        page,
        pageSize
    });

    // State for new ingredients being added
    const [newIngredients, setNewIngredients] = useState<IngredientInput[]>([
        { foodRefId: '', quantity: 1, unitId: '' }
    ]);

    // Reset new ingredients when closing the add section
    useEffect(() => {
        if (!showAddSection) {
            setNewIngredients([{ foodRefId: '', quantity: 1, unitId: '' }]);
        }
    }, [showAddSection]);

    // Edit modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
    const [editForm, setEditForm] = useState<{ quantity: number; notes: string; unitId: string }>({
        quantity: 1,
        notes: "",
        unitId: ""
    });

    // Fetch units for dropdown
    const { data: units, isLoading: unitsLoading } = useUnits();

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingIngredient, setDeletingIngredient] = useState<Ingredient | null>(null);

    const handleEditClick = (ing: Ingredient, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingIngredient(ing);
        setEditForm({
            quantity: ing.quantity,
            notes: ing.notes ?? "",
            unitId: ing.unitId
        });
        setEditModalOpen(true);
    };

    const handleEditConfirm = () => {
        if (!editingIngredient?.ingredientId) return;

        const payload: UpdateRecipeIngredientInput = {
            quantity: editForm.quantity,
            notes: editForm.notes || null,
            unitId: editForm.unitId
        };

        updateMutation.mutate(
            { recipeIngredientId: editingIngredient.ingredientId, payload },
            {
                onSuccess: () => {
                    setEditModalOpen(false);
                    setEditingIngredient(null);
                },
                onError: () => {
                    // Keep modal open on error
                }
            }
        );
    };

    const handleDeleteClick = (ing: Ingredient, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeletingIngredient(ing);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!deletingIngredient?.ingredientId) return;

        deleteMutation.mutate(deletingIngredient.ingredientId, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setDeletingIngredient(null);
            },
            onError: () => {
                setDeleteModalOpen(false);
                setDeletingIngredient(null);
            }
        });
    };

    const handleSaveNewIngredients = async () => {
        // Filter out empty ingredients
        const validIngredients = newIngredients.filter(
            ing => ing.foodRefId && ing.unitId && ing.quantity > 0
        );

        if (validIngredients.length === 0) return;

        // Add each ingredient using the API
        for (const ing of validIngredients) {
            createMutation.mutate({
                recipeId,
                foodRefId: ing.foodRefId,
                quantity: ing.quantity,
                unitId: ing.unitId
            });
        }

        setShowAddSection(false);
    };

    return (
        <>
            <div className="prose prose-slate max-w-none">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/assets/img/ingredients.png"
                            alt="Ingredients"
                            width={32}
                            height={32}
                            className="w-8 h-8"
                        />
                        <h2 className="text-3xl font-bold m-0" style={{ color: ColorTheme.darkBlue }}>
                            Ingredients
                        </h2>
                    </div>
                    <CusButton
                        variant={showAddSection ? "pastelRed" : "blueGray"}
                        size="sm"
                        onClick={() => setShowAddSection(!showAddSection)}
                        className="flex items-center gap-2"
                    >
                        <Plus className={`w-4 h-4 transition-transform ${showAddSection ? 'rotate-45' : ''}`} />
                        {showAddSection ? 'Close' : 'Add Ingredient'}
                    </CusButton>
                </div>

                {/* Add Ingredient Section using IngredientsEditor */}
                {showAddSection && (
                    <div className="mb-8 p-4 bg-gray-50 rounded-xl border" style={{ borderColor: ColorTheme.powderBlue }}>
                        <h3 className="text-lg font-semibold mb-4" style={{ color: ColorTheme.darkBlue }}>
                            Add New Ingredients
                        </h3>
                        <IngredientsEditor
                            ingredients={newIngredients}
                            setIngredients={setNewIngredients}
                            foodRefs={foodRefsQuery}
                            foodGroup={foodGroup}
                            setFoodGroup={setFoodGroup}
                            searchInput={searchInput}
                            setSearchInput={setSearchInput}
                            page={page}
                            setPage={setPage}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            setSearch={setSearch}
                        />

                        {/* Save button for new ingredients - always visible */}
                        <div className="flex justify-end mt-4 pt-4 border-t" style={{ borderColor: ColorTheme.powderBlue }}>
                            <CusButton
                                variant="blueGray"
                                onClick={handleSaveNewIngredients}
                                disabled={!newIngredients.some(ing => ing.foodRefId && ing.unitId && ing.quantity > 0) || createMutation.isPending}
                            >
                                {createMutation.isPending ? 'Adding...' : 'Confirm Add Ingredients'}
                            </CusButton>
                        </div>
                    </div>
                )}

                {/* Existing Ingredients Cards */}
                {ingredients.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">No ingredients added yet.</p>
                        <p className="text-sm mt-2">Click &quot;Add Ingredient&quot; to search and add ingredients.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ingredients.map((ing, idx) => (
                            <div
                                key={ing.ingredientId ?? idx}
                                className="relative p-5 pt-12 rounded-xl shadow-md border mt-6 mb-4 group"
                                style={{ backgroundColor: ColorTheme.babyBlue, width: "250px" }}
                            >
                                {/* Action buttons - show on hover */}
                                {ing.ingredientId && (
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleEditClick(ing, e)}
                                            className="p-1.5 rounded-full bg-white/80 hover:bg-white text-blue-600 shadow-sm transition-colors"
                                            title="Edit ingredient"
                                        >
                                            <SquarePen className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteClick(ing, e)}
                                            className="p-1.5 rounded-full bg-white/80 hover:bg-white text-red-600 shadow-sm transition-colors"
                                            title="Delete ingredient"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {/* Pop-out round image */}
                                <div className="absolute -top-6 left-10 -translate-x-1/2 w-16 h-16 rounded-full overflow-hidden shadow-lg bg-white">
                                    {ing.imageUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={ing.imageUrl}
                                            alt={ing.foodRefName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-2xl">
                                            🥗
                                        </div>
                                    )}
                                </div>

                                {/* Text content */}
                                <div className="text-center mt-4">
                                    <p className="font-semibold text-lg m-0">
                                        {ing.quantity} {ing.unitName}
                                    </p>
                                    <p className="text-gray-700 m-0">{ing.foodRefName}</p>
                                    {ing.notes && (
                                        <p className="text-gray-500 italic text-sm mt-1 m-0">
                                            ({ing.notes})
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editModalOpen && editingIngredient && (
                <div
                    className="fixed inset-0 bg-black/20 flex items-center justify-center p-4"
                    style={{ zIndex: 9999 }}
                >
                    <div
                        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 font-primary"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-semibold" style={{ color: ColorTheme.darkBlue }}>
                                    Edit Ingredient
                                </h2>
                                <button
                                    onClick={() => setEditModalOpen(false)}
                                    disabled={updateMutation.isPending}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Ingredient name (read-only) */}
                            <div>
                                <label className="text-sm font-semibold mb-2 block" style={{ color: ColorTheme.darkBlue }}>
                                    Ingredient
                                </label>
                                <p className="text-gray-700 font-medium">{editingIngredient.foodRefName}</p>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="text-sm font-semibold mb-2 block" style={{ color: ColorTheme.darkBlue }}>
                                    Quantity *
                                </label>
                                <input
                                    type="number"
                                    min={0.01}
                                    step={0.01}
                                    className="neomorphic-input w-full"
                                    value={editForm.quantity}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, quantity: Number(e.target.value) || 0 }))}
                                    disabled={updateMutation.isPending}
                                />
                            </div>

                            {/* Unit Dropdown */}
                            <div>
                                <label className="text-sm font-semibold mb-2 block" style={{ color: ColorTheme.darkBlue }}>
                                    Unit *
                                </label>
                                <Combobox
                                    options={(units ?? []).map((unit) => ({
                                        value: unit.id,
                                        label: `${unit.name}${unit.abbreviation ? ` (${unit.abbreviation})` : ''}`
                                    }))}
                                    value={editForm.unitId}
                                    onChange={(val) => setEditForm(prev => ({ ...prev, unitId: val ?? '' }))}
                                    placeholder="Select a unit"
                                    searchPlaceholder="Search units..."
                                    emptyText="No units found."
                                    disabled={updateMutation.isPending || unitsLoading}
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="text-sm font-semibold mb-2 block" style={{ color: ColorTheme.darkBlue }}>
                                    Notes
                                </label>
                                <input
                                    type="text"
                                    className="neomorphic-input w-full"
                                    placeholder="e.g., finely chopped"
                                    value={editForm.notes}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                                    disabled={updateMutation.isPending}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 justify-end pt-4 border-t" style={{ borderColor: '#D6E6F2' }}>
                                <CusButton
                                    variant="pastelRed"
                                    onClick={() => setEditModalOpen(false)}
                                    disabled={updateMutation.isPending}
                                >
                                    Cancel
                                </CusButton>
                                <CusButton
                                    variant="blueGray"
                                    onClick={handleEditConfirm}
                                    disabled={updateMutation.isPending || editForm.quantity <= 0}
                                >
                                    {updateMutation.isPending ? 'Saving...' : 'Save'}
                                </CusButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                open={deleteModalOpen}
                title="Delete Ingredient"
                message={`Are you sure you want to delete "${deletingIngredient?.foodRefName}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setDeletingIngredient(null);
                }}
                loading={deleteMutation.isPending}
            />
        </>
    );
}

"use client";

import React from 'react';
import { FoodRef, IngredientInput } from '../../services/recipesService';

type Props = {
    foodRefs: { data?: FoodRef[]; isFetching?: boolean };
    ingredients: IngredientInput[];
    setIngredients: (next: IngredientInput[] | ((prev: IngredientInput[]) => IngredientInput[])) => void;
    openIndex: number | null;
    setNameInputs: (next: string[] | ((prev: string[]) => string[])) => void;
    updateAt: (idx: number, patch: Partial<IngredientInput>) => void;
};

export default function FoodReferencesResults({ foodRefs, ingredients, setIngredients, openIndex, setNameInputs, updateAt }: Props) {
    return (
        <div className="mb-4">
            <div className="mb-3 flex items-center justify-between">
                <h4 className="font-semibold text-gray-700">
                    {foodRefs.isFetching ? 'Searching...' : `Available Ingredients (${foodRefs.data?.length ?? 0})`}
                </h4>
            </div>

            {!foodRefs.isFetching && (!foodRefs.data || foodRefs.data.length === 0) && (
                <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-sm">
                    No ingredients found. Try adjusting your search or food group filter.
                </div>
            )}

            {foodRefs.data && foodRefs.data.length > 0 && (
                <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                    {foodRefs.data.map((fr) => (
                        <div key={fr.id} className="flex items-center justify-between p-3 border border-white hover:border-gray-200 rounded-xl bg-white shadow-sm hover:shadow transition-shadow">
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">{fr.name}</div>
                                <div className="text-sm text-gray-500">{fr.foodGroup ?? 'Unknown group'}</div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition"
                                    onClick={() => {
                                        if (openIndex !== null && openIndex >= 0 && openIndex < ingredients.length) {
                                            setNameInputs((prev) => prev.map((p, i) => i === openIndex ? fr.name : p));
                                            updateAt(openIndex, { foodRefId: fr.id });
                                        } else {
                                            setIngredients((p) => [...p, { foodRefId: fr.id, quantity: 100, unitId: '' }]);
                                            setNameInputs((prev) => [...prev, fr.name]);
                                        }
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

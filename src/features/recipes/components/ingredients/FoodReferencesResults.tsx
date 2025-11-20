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
        <>
            <div className="mb-2 text-sm text-gray-500">{foodRefs.isFetching ? 'Searching...' : `${foodRefs.data?.length ?? 0} results`}</div>

            {(!foodRefs.isFetching && (foodRefs.data == null || foodRefs.data.length === 0)) && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded">
                    No food references found. Try entering a search term and click Search.
                </div>
            )}

            {foodRefs.data && foodRefs.data.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-medium mb-2">Results</h4>
                    <div className="grid grid-cols-1 gap-2">
                        {foodRefs.data.map((fr) => (
                            <div key={fr.id} className="flex items-center justify-between p-2 border rounded bg-white">
                                <div>
                                    <div className="font-semibold">{fr.name}</div>
                                    <div className="text-sm text-gray-500">{fr.foodGroup ?? '—'}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button type="button" className="px-2 py-1 border rounded" onClick={() => {
                                        // if a row is focused, fill that row, otherwise append a new ingredient
                                        if (openIndex !== null && openIndex >= 0 && openIndex < ingredients.length) {
                                            setNameInputs((prev) => prev.map((p, i) => i === openIndex ? fr.name : p));
                                            updateAt(openIndex, { foodRefId: fr.id });
                                        } else {
                                            setIngredients((p) => [...p, { foodRefId: fr.id, quantity: 100, unitId: '' }]);
                                            setNameInputs((prev) => [...prev, fr.name]);
                                        }
                                    }}>Add</button>
                                    <button type="button" className="px-2 py-1 border rounded" onClick={() => {
                                        // copy name to clipboard as quick action (optional)
                                        try { navigator.clipboard.writeText(fr.name); } catch { /* ignore */ }
                                    }}>Copy name</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

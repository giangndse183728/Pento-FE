"use client";

import React, { useState } from 'react';
import { FoodRef, IngredientInput, Unit } from '../../../services/recipesService';
import IngredientRow from './IngredientRow';

type Props = {
    ingredients: IngredientInput[];
    setIngredients: (next: IngredientInput[] | ((prev: IngredientInput[]) => IngredientInput[])) => void;
    foodRefs: { data?: FoodRef[] };
    units: Unit[];
    nameInputs: string[];
    setNameInputs: (next: string[] | ((prev: string[]) => string[])) => void;
    updateAt: (idx: number, patch: Partial<IngredientInput>) => void;
    setShowUnitsModal: (show: boolean) => void;
};

export default function IngredientsList({ ingredients, setIngredients, foodRefs, units, nameInputs, setNameInputs, updateAt, setShowUnitsModal }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="space-y-2">
            {ingredients.map((ing, idx) => {
                const typed = nameInputs[idx] ?? '';
                const suggestions = (foodRefs.data ?? []).filter((fr) => fr.name.toLowerCase().includes(typed.toLowerCase())).slice(0, 10);

                return (
                    <IngredientRow
                        key={idx}
                        ingredient={ing}
                        units={units}
                        updateAt={(patch) => updateAt(idx, patch)}
                        nameInput={typed}
                        setNameInput={(name) => setNameInputs((prev) => prev.map((p, i) => (i === idx ? name : p)))}
                        suggestions={suggestions}
                        open={openIndex === idx}
                        onOpen={() => setOpenIndex(idx)}
                        onClose={() => setOpenIndex((cur) => (cur === idx ? null : cur))}
                        onSuggestionClick={(fr) => {
                            setNameInputs((prev) => prev.map((p, i) => (i === idx ? fr.name : p)));
                            updateAt(idx, { foodRefId: fr.id });
                            setOpenIndex(null);
                        }}
                        setShowUnitsModal={setShowUnitsModal}
                    />
                );
            })}
             <div className="flex gap-2 mt-3">
                    <button type="button" className="px-3 py-1 border rounded" onClick={() => setIngredients((p) => [...p, { foodRefId: '', quantity: 100, unitId: '' }])}>Add ingredient</button>
                    <button type="button" className="px-3 py-1 border rounded" onClick={() => setIngredients((p) => p.slice(0, -1))}>Remove last</button>
                </div>
        </div>
    );
}

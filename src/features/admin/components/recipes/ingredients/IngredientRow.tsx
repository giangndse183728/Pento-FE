"use client";

import React from 'react';
import { FoodRef, IngredientInput, Unit } from '../../../services/recipesService';

type Props = {
    ingredient: IngredientInput;
    units: Unit[];
    updateAt: (patch: Partial<IngredientInput>) => void;
    nameInput: string;
    setNameInput: (name: string) => void;
    suggestions: FoodRef[];
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    onSuggestionClick: (foodRef: FoodRef) => void;
    setShowUnitsModal: (show: boolean) => void;
};

export default function IngredientRow({ ingredient, units, updateAt, nameInput, setNameInput, suggestions, open, onOpen, onClose, onSuggestionClick, setShowUnitsModal }: Props) {
    return (
        <div className="relative">
            <div className="grid grid-cols-3 gap-4 items-center">
                <div className="relative">
                    <input
                        className="p-2 border rounded w-64"
                        placeholder="Ingredient name"
                        value={nameInput}
                        onChange={(e) => {
                            setNameInput(e.target.value);
                            // clear id until user selects
                            updateAt({ foodRefId: '' });
                            onOpen();
                        }}
                        onFocus={onOpen}
                        onBlur={() => {
                            // delay close to allow click handling
                            setTimeout(onClose, 150);
                        }}
                    />

                    {open && suggestions.length > 0 && (
                        <ul className="absolute z-20 mt-1 max-h-48 w-64 overflow-auto bg-white border rounded shadow">
                            {suggestions.map((fr) => (
                                <li key={fr.id} className="px-2 py-1 hover:bg-gray-100 cursor-pointer" onMouseDown={(ev) => ev.preventDefault()} onClick={() => onSuggestionClick(fr)}>
                                    {fr.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <input type="number" className="p-2 border rounded" value={ingredient.quantity} onChange={(e) => updateAt({ quantity: Number(e.target.value) || 0 })} />

                <div className="flex gap-1 items-center">
                    <select className="p-2 border rounded flex-1" value={ingredient.unitId} onChange={(e) => updateAt({ unitId: e.target.value })}>
                        <option value="">Select unit</option>
                        {units?.map((u) => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                    <button type="button" className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 text-white font-bold flex items-center justify-center text-sm" onClick={() => setShowUnitsModal(true)} title="View available units">!</button>
                </div>
            </div>
        </div>
    );
}

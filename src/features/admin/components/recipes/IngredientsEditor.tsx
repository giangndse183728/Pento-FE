"use client";

import React, { useEffect, useState } from 'react';
import { FoodRef, IngredientInput } from '../../services/recipesService';
import useUnits from '../../hooks/useUnit';
import UnitsModal from './UnitsModel';

type Props = {
    ingredients: IngredientInput[];
    setIngredients: (next: IngredientInput[] | ((prev: IngredientInput[]) => IngredientInput[])) => void;
    foodRefs: { data?: FoodRef[]; isFetching?: boolean };
    foodGroup?: string | undefined;
    setFoodGroup?: (v?: string) => void;
    searchInput?: string;
    setSearchInput?: (v: string) => void;
    page?: number;
    setPage?: (n: number) => void;
    pageSize?: number;
    setPageSize?: (n: number) => void;
    setSearch?: (v?: string) => void;
    onSearch?: (v?: string) => void;
};

export default function IngredientsEditor({ ingredients, setIngredients, foodRefs, foodGroup, setFoodGroup, searchInput, setSearchInput, page, setPage, pageSize, setPageSize, setSearch, onSearch }: Props) {
    const { data: units } = useUnits();
    const updateAt = (idx: number, patch: Partial<IngredientInput>) => {
        setIngredients((prev) => prev.map((p, i) => i === idx ? { ...p, ...patch } : p));
    };

    // per-row typed name inputs so we can show suggestions and allow typing
    const [nameInputs, setNameInputs] = useState<string[]>(() =>
        ingredients.map((ing) => {
            const found = foodRefs.data?.find((f) => f.id === ing.foodRefId);
            return found ? found.name : '';
        })
    );
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [showUnitsModal, setShowUnitsModal] = useState(false);

    // keep nameInputs in sync when ingredients or fetched foodRefs change
    useEffect(() => {
        setNameInputs((prev) =>
            ingredients.map((ing, i) => {
                const found = foodRefs.data?.find((f) => f.id === ing.foodRefId);
                if (found) return found.name;
                return prev[i] ?? '';
            })
        );
    }, [ingredients, foodRefs.data]);

    return (
        <div className="mb-4">
            <h3 className="font-semibold mb-2">Ingredients</h3>

            {/* Food references controls */}
            <div className="grid grid-cols-4 gap-4 mb-4 items-center">
                <select className="p-2 border rounded" value={foodGroup ?? ''} onChange={(e) => setFoodGroup?.(e.target.value || undefined)}>
                    <option value="">--</option>
                    <option value="Meat">Meat</option>
                    <option value="Seafood">Seafood</option>
                    <option value="FruitsVegetables">FruitsVegetables</option>
                    <option value="Dairy">Dairy</option>
                    <option value="CerealGrainsPasta">CerealGrainsPasta</option>
                    <option value="LegumesNutsSeeds">LegumesNutsSeeds</option>
                    <option value="FatsOils">FatsOils</option>
                    <option value="Confectionery">Confectionery</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Condiments">Condiments</option>
                    <option value="MixedDishes">MixedDishes</option>
                </select>

                <input className="p-2 border rounded col-span-2" placeholder="Search food references" value={searchInput ?? ''} onChange={(e) => setSearchInput?.(e.target.value)} />

                <div className="flex gap-2 items-center">
                    <input type="number" className="p-2 border rounded w-20" value={page} min={1} onChange={(e) => setPage?.(Number(e.target.value) || 1)} />
                    <input type="number" className="p-2 border rounded w-20" value={pageSize} min={1} onChange={(e) => setPageSize?.(Number(e.target.value) || 24)} />
                    <button type="button" className="px-3 py-1 border rounded bg-blue-600 text-white" onClick={() => {
                        const q = searchInput?.trim() ? searchInput.trim() : undefined;

                        if (onSearch) {
                            onSearch(q);
                        } else {
                            setSearch?.(q);
                        }
                        setPage?.(1);
                    }}>Search</button>
                </div>
            </div>

            <div className="mb-2 text-sm text-gray-500">{foodRefs.isFetching ? 'Searching...' : `${foodRefs.data?.length ?? 0} results`}</div>

            {(!foodRefs.isFetching && (foodRefs.data == null || foodRefs.data.length === 0)) && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded">
                    No food references found. Try entering a search term and click Search.
                </div>
            )}

            {/* Units Modal */}
            <UnitsModal isOpen={showUnitsModal} onClose={() => setShowUnitsModal(false)} units={units} />

            {/* Results panel*/}
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

            <div className="space-y-2">
                {ingredients.map((ing, idx) => {
                    // typed name for this row
                    const [typed] = [nameInputs[idx] ?? ''];
                    const suggestions = (foodRefs.data ?? []).filter((fr) => fr.name.toLowerCase().includes(typed.toLowerCase())).slice(0, 10);
                    return (
                        <div key={idx} className="relative">
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <div className="relative">
                                    <input
                                        className="p-2 border rounded w-64"
                                        placeholder="Ingredient name"
                                        value={typed}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setNameInputs((prev) => prev.map((p, i) => i === idx ? v : p));
                                            // clear id until user selects
                                            updateAt(idx, { foodRefId: '' });
                                            setOpenIndex(idx);
                                        }}
                                        onFocus={() => setOpenIndex(idx)}
                                        onBlur={() => {
                                            // delay close to allow click handling
                                            setTimeout(() => setOpenIndex((cur) => (cur === idx ? null : cur)), 150);
                                        }}
                                    />

                                    {openIndex === idx && suggestions.length > 0 && (
                                        <ul className="absolute z-20 mt-1 max-h-48 w-64 overflow-auto bg-white border rounded shadow">
                                            {suggestions.map((fr) => (
                                                <li key={fr.id} className="px-2 py-1 hover:bg-gray-100 cursor-pointer" onMouseDown={(ev) => ev.preventDefault()} onClick={() => {
                                                    setNameInputs((prev) => prev.map((p, i) => i === idx ? fr.name : p));
                                                    updateAt(idx, { foodRefId: fr.id });
                                                    setOpenIndex(null);
                                                }}>{fr.name}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <input type="number" className="p-2 border rounded" value={ing.quantity} onChange={(e) => updateAt(idx, { quantity: Number(e.target.value) || 0 })} />

                                <div className="flex gap-1 items-center">
                                    <select className="p-2 border rounded flex-1" value={ing.unitId} onChange={(e) => updateAt(idx, { unitId: e.target.value })}>
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
                })}
            </div>

            <div className="flex gap-2 mt-3">
                <button type="button" className="px-3 py-1 border rounded" onClick={() => setIngredients((p) => [...p, { foodRefId: '', quantity: 100, unitId: '' }])}>Add ingredient</button>
                <button type="button" className="px-3 py-1 border rounded" onClick={() => setIngredients((p) => p.slice(0, -1))}>Remove last</button>
            </div>
        </div>
    );
}

"use client";

import React from 'react';
import { Unit, FoodRef, IngredientInput } from '../../services/recipesService';

type Props = {
    ingredients: IngredientInput[];
    setIngredients: (next: IngredientInput[] | ((prev: IngredientInput[]) => IngredientInput[])) => void;
    units: Unit[] | undefined;
    foodRefs: { data?: FoodRef[]; isFetching?: boolean };
    // controls for searching/paging food refs (passed from parent)
    foodGroup?: string | undefined;
    setFoodGroup?: (v?: string) => void;
    searchInput?: string;
    setSearchInput?: (v: string) => void;
    page?: number;
    setPage?: (n: number) => void;
    pageSize?: number;
    setPageSize?: (n: number) => void;
};

export default function IngredientsEditor({ ingredients, setIngredients, units, foodRefs, foodGroup, setFoodGroup, searchInput, setSearchInput, page, setPage, pageSize, setPageSize }: Props) {
    const updateAt = (idx: number, patch: Partial<IngredientInput>) => {
        setIngredients((prev) => prev.map((p, i) => i === idx ? { ...p, ...patch } : p));
    };

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

                <input className="p-2 border rounded col-span-2" placeholder="Search food references" value={searchInput ?? ''} onChange={(e) => setSearchInput?.(e.target.value)} list="foodRefsList" />

                <div className="flex gap-2 items-center">
                    <input type="number" className="p-2 border rounded w-20" value={page} min={1} onChange={(e) => setPage?.(Number(e.target.value) || 1)} />
                    <input type="number" className="p-2 border rounded w-20" value={pageSize} min={1} onChange={(e) => setPageSize?.(Number(e.target.value) || 24)} />
                </div>
            </div>

            <datalist id="foodRefsList">
                {foodRefs.data?.map((fr) => (
                    <option key={fr.id} value={fr.name} />
                ))}
            </datalist>

            <div className="mb-2 text-sm text-gray-500">{foodRefs.isFetching ? 'Searching...' : `${foodRefs.data?.length ?? 0} results`}</div>

            <div className="space-y-2">
                {ingredients.map((ing, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-4 items-center">
                        <input className="p-2 border rounded" placeholder="Ingredient name" value={
                            (() => {
                                const found = foodRefs.data?.find((f) => f.id === ing.foodRefId);
                                return found ? found.name : '';
                            })()
                        } onChange={(e) => {
                            const v = e.target.value;
                            // if matches a suggestion, set the id
                            const match = foodRefs.data?.find((fr) => fr.name === v);
                            if (match) updateAt(idx, { foodRefId: match.id });
                            else updateAt(idx, { foodRefId: '' });
                        }} list="foodRefsList" />

                        <input type="number" className="p-2 border rounded" value={ing.quantity} onChange={(e) => updateAt(idx, { quantity: Number(e.target.value) || 0 })} />

                        <select className="p-2 border rounded" value={ing.unitId} onChange={(e) => updateAt(idx, { unitId: e.target.value })}>
                            <option value="">Select unit</option>
                            {units?.map((u) => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 mt-3">
                <button type="button" className="px-3 py-1 border rounded" onClick={() => setIngredients((p) => [...p, { foodRefId: '', quantity: 100, unitId: '' }])}>Add ingredient</button>
                <button type="button" className="px-3 py-1 border rounded" onClick={() => setIngredients((p) => p.slice(0, -1))}>Remove last</button>
            </div>
        </div>
    );
}

"use client";

import React from 'react';

type Props = {
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

export default function FoodReferencesSearch({ foodGroup, setFoodGroup, searchInput, setSearchInput, page, setPage, pageSize, setPageSize, setSearch, onSearch }: Props) {
    return (
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
    );
}

"use client";

import React from 'react';
import { ColorTheme } from '@/constants/color';

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

export default function FoodReferencesSearch({ foodGroup, setFoodGroup, searchInput, setSearchInput, page, setPage, pageSize, setPageSize, setSearch }: Props) {
    const handleSearch = () => {
        if (!setSearch) return;
        const raw = searchInput?.trim() ? searchInput.trim() : undefined;
        setSearch(raw);
        setPage?.(1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    }; return (
        <div className="mb-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                    className="p-3 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-xl w-full"
                    value={foodGroup ?? ''}
                    onChange={(e) => {
                        setFoodGroup?.(e.target.value || undefined);
                        setPage?.(1);
                    }}
                >
                    <option value="">All Food Groups</option>
                    <option value="Meat">Meat</option>
                    <option value="Seafood">Seafood</option>
                    <option value="FruitsVegetables">Fruits & Vegetables</option>
                    <option value="Dairy">Dairy</option>
                    <option value="CerealGrainsPasta">Cereal, Grains & Pasta</option>
                    <option value="LegumesNutsSeeds">Legumes, Nuts & Seeds</option>
                    <option value="FatsOils">Fats & Oils</option>
                    <option value="Confectionery">Confectionery</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Condiments">Condiments</option>
                    <option value="MixedDishes">Mixed Dishes</option>
                </select>

                <input
                    className="p-3 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-xl w-full md:col-span-2"
                    placeholder="Search ingredients (auto-debounced)..."
                    value={searchInput ?? ''}
                    onChange={(e) => setSearchInput?.(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            <div className="flex flex-wrap gap-3 items-center text-sm">
                <label className="flex items-center gap-2">
                    <span className="text-gray-600">Page:</span>
                    <input
                        type="number"
                        className="p-2 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-lg w-20"
                        value={page}
                        min={1}
                        onChange={(e) => setPage?.(Number(e.target.value) || 1)}
                    />
                </label>
                <label className="flex items-center gap-2">
                    <span className="text-gray-600">Per page:</span>
                    <input
                        type="number"
                        className="p-2 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-lg w-20"
                        value={pageSize}
                        min={1}
                        max={100}
                        onChange={(e) => setPageSize?.(Number(e.target.value) || 24)}
                    />
                </label>
                <button
                    type="button"
                    className="px-4 py-2 rounded text-white transition hover:brightness-110"
                    style={{ backgroundColor: ColorTheme.darkBlue }}
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>
        </div>
    );
}

"use client";

import React from 'react';
import { CusButton } from '@/components/ui/cusButton';

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
        <div className="mb-4">
            <div className="flex gap-3">
                <select
                    className="p-3 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-xl"
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
                    className="p-3 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-xl flex-1"
                    placeholder="Search ingredients..."
                    value={searchInput ?? ''}
                    onChange={(e) => setSearchInput?.(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <CusButton
                    type="button"
                    variant="blueGray"
                    size="default"
                    onClick={handleSearch}
                >
                    Search
                </CusButton>
            </div>
        </div>
    );
}

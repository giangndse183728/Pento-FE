'use client';

import React, { useState } from 'react';
import { useRecipes } from '../hooks';
import RecipesCreateForm from './RecipesCreateForm';
import RecipesList from './recipes-details/RecipesList';
import RecipesTable from './recipes-details/RecipesTable';
import { CusButton } from '@/components/ui/cusButton';

export default function RecipesManager() {
    const [activeTab, setActiveTab] = useState<'create' | 'list'>('list');
    const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 12;
    const [difficulty, setDifficulty] = useState<string | undefined>(undefined);
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [sort, setSort] = useState<string | undefined>(undefined);

    const { list, create } = useRecipes({ pageNumber, pageSize, difficulty, search, sort });

    // Clear all filters
    const clearFilters = () => {
        setSearch(undefined);
        setDifficulty(undefined);
        setSort(undefined);
        setPageNumber(1);
    };

    return (
        <>
            <div className="w-full mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Recipes Manager</h1>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="segmented">

                    <label className="segmented-button">
                        <input
                            type="radio"
                            name="recipe-tab"
                            checked={activeTab === 'list'}
                            onChange={() => setActiveTab('list')}
                        />
                        Recipes List
                    </label>
                    <label className="segmented-button">
                        <input
                            type="radio"
                            name="recipe-tab"
                            checked={activeTab === 'create'}
                            onChange={() => setActiveTab('create')}
                        />
                        Create Recipe
                    </label>
                </div>
            </div>

            {/* Create Recipe Tab */}
            {activeTab === 'create' && (
                <RecipesCreateForm create={create} onSuccess={() => setActiveTab('list')} />
            )}

            {/* Recipes List Tab */}
            {activeTab === 'list' && (
                <div className="space-y-6">
                    {/* Filter Controls & View Toggle */}
                    <div className="flex gap-4 items-center justify-between flex-wrap">
                        {/* Filter Row */}
                        <div className="flex gap-3 items-center flex-wrap">
                            {/* Search Input */}
                            <input
                                type="text"
                                className="neomorphic-input"
                                placeholder="Search recipes..."
                                value={search ?? ''}
                                onChange={(e) => {
                                    setSearch(e.target.value || undefined);
                                    setPageNumber(1);
                                }}
                            />

                            {/* Difficulty Filter */}
                            <select
                                className="neomorphic-select"
                                value={difficulty ?? ''}
                                onChange={(e) => {
                                    setDifficulty(e.target.value || undefined);
                                    setPageNumber(1);
                                }}
                            >
                                <option value="">All Difficulties</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>

                            {/* Sort Dropdown */}
                            <select
                                className="neomorphic-select"
                                value={sort ?? ''}
                                onChange={(e) => {
                                    setSort(e.target.value || undefined);
                                    setPageNumber(1);
                                }}
                            >
                                <option value="">Default Sort</option>
                                <option value="title">Title (A-Z)</option>
                                <option value="-title">Title (Z-A)</option>
                                <option value="createdDate">Oldest First</option>
                                <option value="-createdDate">Newest First</option>
                            </select>
                        </div>

                        {/* Clear Filters Button & View Mode Toggle */}
                        <div className="flex gap-3 items-center">
                            <CusButton
                                type="button"
                                onClick={clearFilters}
                                variant="blueGray"
                            >
                                Clear Filters
                            </CusButton>

                            {/* View Mode Toggle */}
                            <div className="segmented">
                                <label className="segmented-button">
                                    <input
                                        type="radio"
                                        name="view-mode"
                                        checked={viewMode === 'cards'}
                                        onChange={() => setViewMode('cards')}
                                    />
                                    Cards
                                </label>
                                <label className="segmented-button">
                                    <input
                                        type="radio"
                                        name="view-mode"
                                        checked={viewMode === 'table'}
                                        onChange={() => setViewMode('table')}
                                    />
                                    Table
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Recipes View */}
                    {viewMode === 'cards' ? (
                        <RecipesList
                            list={list}
                            pageNumber={pageNumber}
                            setPageNumber={setPageNumber}
                            pageSize={pageSize}
                            difficulty={difficulty}
                            search={search}
                            sort={sort}
                        />
                    ) : (
                        <RecipesTable
                            list={list}
                            pageNumber={pageNumber}
                            setPageNumber={setPageNumber}
                            pageSize={pageSize}
                            difficulty={difficulty}
                            search={search}
                            sort={sort}
                        />
                    )}
                </div>
            )}
        </>
    );
}

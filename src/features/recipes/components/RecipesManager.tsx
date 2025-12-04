'use client';

import React, { useState } from 'react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import { useRecipes } from '../hooks';
import RecipesCreateForm from './RecipesCreateForm';
import RecipesTable from './RecipesTable';
import '@/styles/tab-bar.css';

export default function RecipesManager() {
    const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 6;
    const [difficulty, setDifficulty] = useState<string | undefined>(undefined);

    const { list, create } = useRecipes({ pageNumber, pageSize, difficulty });

    return (
        <AdminLayout>
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
                            checked={activeTab === 'create'}
                            onChange={() => setActiveTab('create')}
                        />
                        Create Recipe
                    </label>
                    <label className="segmented-button">
                        <input
                            type="radio"
                            name="recipe-tab"
                            checked={activeTab === 'list'}
                            onChange={() => setActiveTab('list')}
                        />
                        Recipes List
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
                    {/* Filter Controls */}
                    <div className="flex gap-4 items-center">
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
                    </div>

                    <RecipesTable
                        list={list}
                        pageNumber={pageNumber}
                        setPageNumber={setPageNumber}
                        pageSize={pageSize}
                    />
                </div>
            )}
        </AdminLayout>
    );
}

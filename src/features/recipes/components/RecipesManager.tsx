'use client';

import React, { useState } from 'react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import { useRecipes } from '../hooks';
import RecipesCreateForm from './RecipesCreateForm';
import RecipesTable from './RecipesTable';
import { ColorTheme } from '@/constants/color';

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
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex gap-6">
                    <button
                        type="button"
                        onClick={() => setActiveTab('create')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'create'
                            ? ''
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        style={activeTab === 'create' ? { borderColor: ColorTheme.darkBlue, color: ColorTheme.darkBlue } : undefined}
                    >
                        Create Recipe
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('list')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'list'
                            ? ''
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        style={activeTab === 'list' ? { borderColor: ColorTheme.darkBlue, color: ColorTheme.darkBlue } : undefined}
                    >
                        Recipes List
                    </button>
                </nav>
            </div>

            {/* Create Recipe Tab */}
            {activeTab === 'create' && (
                <RecipesCreateForm create={create} />
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

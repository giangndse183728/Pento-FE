'use client';

import React, { useState } from 'react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import { useRecipes } from '../hooks';
import RecipesCreateForm from './RecipesCreateForm';
import RecipesTable from './RecipesTable';

export default function RecipesManager() {
    const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [difficulty, setDifficulty] = useState<string | undefined>(undefined);

    const { list, create } = useRecipes({ pageNumber, pageSize, difficulty });

    return (
        <AdminLayout>
            <div className="w-full mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Recipes Manager</h1>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex gap-6">
                    <button
                        type="button"
                        onClick={() => setActiveTab('create')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'create'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Create Recipe
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('list')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'list'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
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
                <>
                    {/* Pagination and Filter Controls */}
                    <div className="mb-4 flex gap-4 items-center">
                        <select
                            className="p-2 border rounded"
                            value={difficulty ?? ''}
                            onChange={(e) => {
                                setDifficulty(e.target.value || undefined);
                                setPageNumber(1); // Reset to first page when filtering
                            }}
                        >
                            <option value="">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>

                        <div className="flex gap-2 items-center">
                            <label className="text-sm">Page:</label>
                            <input
                                type="number"
                                className="p-2 border rounded w-20"
                                value={pageNumber}
                                min={1}
                                onChange={(e) => setPageNumber(Number(e.target.value) || 1)}
                            />
                        </div>

                        <div className="flex gap-2 items-center">
                            <label className="text-sm">Per page:</label>
                            <input
                                type="number"
                                className="p-2 border rounded w-20"
                                value={pageSize}
                                min={1}
                                max={100}
                                onChange={(e) => setPageSize(Number(e.target.value) || 10)}
                            />
                        </div>

                        <button
                            type="button"
                            className="px-3 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                            disabled={pageNumber <= 1}
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            className="px-3 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => setPageNumber(pageNumber + 1)}
                            disabled={!list.data || list.data.length < pageSize}
                        >
                            Next
                        </button>
                    </div>

                    <RecipesTable list={list} />
                </>
            )}
        </AdminLayout>
    );
}

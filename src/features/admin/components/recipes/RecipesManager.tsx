'use client';

import React from 'react';
import AdminLayout from '../AdminLayout';
import { useRecipes } from '../../hooks';
import RecipesCreateForm from './RecipesCreateForm';
import RecipesTable from './RecipesTable';

export default function RecipesManager() {
    const { list, create } = useRecipes();

    return (
        <AdminLayout>
            <div className="w-full mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Recipes Manager</h1>
            </div>

            <RecipesCreateForm create={create} />

            <RecipesTable list={list} />
        </AdminLayout>
    );
}

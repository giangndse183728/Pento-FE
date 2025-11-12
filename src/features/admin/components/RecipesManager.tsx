'use client';

import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import useRecipes from '../hooks/useRecipes';
import { recipeDetailedSchema } from '../schema/recipeSchema';

export default function RecipesManager() {
    const { units, foodRefs, create } = useRecipes();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredientFoodRef, setIngredientFoodRef] = useState('');
    const [ingredientUnit, setIngredientUnit] = useState('');
    const [ingredientQuantity, setIngredientQuantity] = useState<number>(100);
    const [formErrors, setFormErrors] = useState<string[]>([]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            title,
            description,
            isPublic: true,
            ingredients: [
                {
                    foodRefId: ingredientFoodRef,
                    quantity: ingredientQuantity,
                    unitId: ingredientUnit,
                },
            ],
        };

        const result = recipeDetailedSchema.safeParse(payload);
        if (!result.success) {
            const messages = result.error.errors.map((err) => {
                const path = err.path.length ? err.path.join('.') : 'root';
                return `${path}: ${err.message}`;
            });
            setFormErrors(messages);
            return;
        }

        setFormErrors([]);

        try {
            await create.mutateAsync(result.data as unknown as Parameters<typeof create.mutateAsync>[0]);
            // Optionally reset form
            setTitle('');
            setDescription('');
            setIngredientFoodRef('');
            setIngredientUnit('');
            setIngredientQuantity(100);
        } catch (err) {
            // create.mutateAsync will already trigger toast on error
            console.error(err);
        }
    };

    return (
        <AdminLayout>
            <div className="w-full mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Recipes Manager</h1>
            </div>

            <form onSubmit={onSubmit} className="w-full max-w-3xl">
                {formErrors.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                        <strong className="block font-semibold">Validation errors:</strong>
                        <ul className="mt-2 list-disc list-inside">
                            {formErrors.map((m, i) => (
                                <li key={i}>{m}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input className="p-2 border rounded" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input className="p-2 border rounded" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                    <select className="p-2 border rounded" value={ingredientFoodRef} onChange={(e) => setIngredientFoodRef(e.target.value)}>
                        <option value="">Select ingredient</option>
                        {foodRefs.data?.map((fr) => (
                            <option key={fr.id} value={fr.id}>{fr.name}</option>
                        ))}
                    </select>

                    <input type="number" className="p-2 border rounded" value={ingredientQuantity} onChange={(e) => setIngredientQuantity(Number(e.target.value))} />

                    <select className="p-2 border rounded" value={ingredientUnit} onChange={(e) => setIngredientUnit(e.target.value)}>
                        <option value="">Select unit</option>
                        {units.data?.map((u) => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white" disabled={create.isPending}>Create</button>
                </div>
            </form>
        </AdminLayout>
    );
}

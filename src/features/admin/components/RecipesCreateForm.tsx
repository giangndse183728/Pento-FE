"use client";

import React, { useState } from 'react';
import { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { recipeDetailedSchema } from '../schema/recipeSchema';
import { Unit, RecipeDetailedInput, FoodRef } from '../services/recipesService';
import useFoodReferences from '../hooks/useFoodReferences';

type Props = {
    units: UseQueryResult<Unit[], unknown>;
    create: UseMutationResult<unknown, unknown, RecipeDetailedInput, unknown>;
};

export default function RecipesCreateForm({ units, create }: Props) {
    // Local controls for fetching food references
    const [foodGroup, setFoodGroup] = React.useState<string | undefined>(undefined);
    const [search, setSearch] = React.useState<string | undefined>(undefined);
    const [searchInput, setSearchInput] = React.useState<string>('');
    const [page, setPage] = React.useState<number>(1);
    const [pageSize, setPageSize] = React.useState<number>(24);

    const foodRefs = useFoodReferences({ foodGroup, search, page, pageSize });

    // Debounce search input to avoid refetching on every keystroke
    React.useEffect(() => {
        const handler = setTimeout(() => {
            // empty string => undefined (no filter)
            setSearch(searchInput?.trim() ? searchInput.trim() : undefined);
            // reset to first page when search changes
            setPage(1);
        }, 400);

        return () => clearTimeout(handler);
    }, [searchInput]);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [prepTimeMinutes, setPrepTimeMinutes] = useState<number | undefined>(1);
    const [cookTimeMinutes, setCookTimeMinutes] = useState<number | undefined>(10);
    const [ingredientFoodRef, setIngredientFoodRef] = useState('');
    const [ingredientUnit, setIngredientUnit] = useState('');
    const [ingredientQuantity, setIngredientQuantity] = useState<number>(100);
    const [notes, setNotes] = useState('');
    const [servings, setServings] = useState<number | undefined>(1);
    const [difficultyLevel, setDifficultyLevel] = useState<string>('3');
    const [imageUrl, setImageUrl] = useState('');
    const [directions, setDirections] = useState<Array<{ stepNumber: number; description: string; imageUrl?: string }>>([
        { stepNumber: 1, description: '', imageUrl: '' },
    ]);
    const [formErrors, setFormErrors] = useState<string[]>([]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: RecipeDetailedInput = {
            title,
            description,
            prepTimeMinutes,
            cookTimeMinutes,
            notes,
            servings,
            difficultyLevel,
            imageUrl: imageUrl || undefined,
            isPublic: true,
            ingredients: [
                {
                    foodRefId: ingredientFoodRef,
                    quantity: ingredientQuantity,
                    unitId: ingredientUnit,
                    notes: undefined,
                },
            ],
            directions: directions.map((d) => ({ stepNumber: d.stepNumber, description: d.description, imageUrl: d.imageUrl || undefined })),
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
            await create.mutateAsync(result.data as RecipeDetailedInput);
            setTitle('');
            setDescription('');
            setPrepTimeMinutes(1);
            setCookTimeMinutes(10);
            setNotes('');
            setServings(1);
            setDifficultyLevel('3');
            setImageUrl('');
            setIngredientFoodRef('');
            setIngredientUnit('');
            setIngredientQuantity(100);
            setDirections([{ stepNumber: 1, description: '', imageUrl: '' }]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
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
                <input type="number" className="p-2 border rounded" placeholder="Prep minutes" value={prepTimeMinutes} onChange={(e) => setPrepTimeMinutes(Number(e.target.value) || undefined)} />
                <input type="number" className="p-2 border rounded" placeholder="Cook minutes" value={cookTimeMinutes} onChange={(e) => setCookTimeMinutes(Number(e.target.value) || undefined)} />
                <input type="number" className="p-2 border rounded" placeholder="Servings" value={servings} onChange={(e) => setServings(Number(e.target.value) || undefined)} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <select className="p-2 border rounded" value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <input className="p-2 border rounded" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>

            <div className="mb-4">
                <textarea className="w-full p-2 border rounded" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            {/* Food references controls: foodGroup, search, paging */}
            <div className="grid grid-cols-4 gap-4 mb-4 items-center">
                <select className="p-2 border rounded" value={foodGroup ?? ''} onChange={(e) => setFoodGroup(e.target.value || undefined)}>
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

                <input
                    className="p-2 border rounded col-span-2"
                    placeholder="Search food references"
                    value={searchInput}
                    onChange={(e) => {
                        const v = e.target.value;
                        setSearchInput(v);
                        // if the user selected an exact suggestion, set the ingredient id
                        const match = foodRefs.data?.find((fr) => fr.name === v);
                        if (match) setIngredientFoodRef(match.id);
                    }}
                    list="foodRefsList"
                />
                <datalist id="foodRefsList">
                    {foodRefs.data?.map((fr: FoodRef) => (
                        <option key={fr.id} value={fr.name} />
                    ))}
                </datalist>

                <div className="flex gap-2 items-center">
                    <input type="number" className="p-2 border rounded w-20" value={page} min={1} onChange={(e) => setPage(Number(e.target.value) || 1)} />
                    <input type="number" className="p-2 border rounded w-20" value={pageSize} min={1} onChange={(e) => setPageSize(Number(e.target.value) || 24)} />
                </div>
            </div>

            {/* quick fetch status */}
            <div className="mb-2 text-sm text-gray-500">
                {foodRefs.isFetching ? 'Searching...' : `${foodRefs.data?.length ?? 0} results`}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
                <select className="p-2 border rounded" value={ingredientFoodRef} onChange={(e) => setIngredientFoodRef(e.target.value)}>
                    <option value="">Select ingredient</option>
                    {foodRefs.data?.map((fr: FoodRef) => (
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

            <div className="mb-4">
                <h3 className="font-semibold mb-2">Directions</h3>
                {directions.map((d, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-2 mb-2 items-center">
                        <input type="number" className="p-2 border rounded" value={d.stepNumber} onChange={(e) => {
                            const v = Number(e.target.value) || 0;
                            setDirections((prev) => prev.map((p, i) => i === idx ? { ...p, stepNumber: v } : p));
                        }} />
                        <input className="p-2 border rounded col-span-2" placeholder="Step description" value={d.description} onChange={(e) => {
                            const v = e.target.value;
                            setDirections((prev) => prev.map((p, i) => i === idx ? { ...p, description: v } : p));
                        }} />
                        <input className="p-2 border rounded" placeholder="Image URL" value={d.imageUrl} onChange={(e) => {
                            const v = e.target.value;
                            setDirections((prev) => prev.map((p, i) => i === idx ? { ...p, imageUrl: v } : p));
                        }} />
                    </div>
                ))}
                <div className="flex gap-2">
                    <button type="button" className="px-3 py-1 border rounded" onClick={() => setDirections((p) => [...p, { stepNumber: p.length + 1, description: '', imageUrl: '' }])}>Add step</button>
                    <button type="button" className="px-3 py-1 border rounded" onClick={() => setDirections((p) => p.slice(0, -1))}>Remove last</button>
                </div>
            </div>

            <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white" disabled={create.isPending}>Create</button>
            </div>
        </form>
    );
}

"use client";

import React, { useState } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { recipeDetailedSchema } from '../../schema/recipeSchema';
import { RecipeDetailedInput, IngredientInput } from '../../services/recipesService';
import useFoodReferences from '../../hooks/useFoodReferences';
import { FieldSet, FieldGroup, Field, FieldLabel, FieldContent, FieldError, FieldLegend } from '@/components/ui/field';
import BasicInfo from './BasicInfo';
import IngredientsEditor from './ingredients/IngredientsEditor';
import DirectionsEditor from './DirectionsEditor';

type Props = {
    create: UseMutationResult<unknown, unknown, RecipeDetailedInput, unknown>;
};

export default function RecipesCreateForm({ create }: Props) {
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
    const [notes, setNotes] = useState('');
    const [servings, setServings] = useState<number | undefined>(1);
    const [difficultyLevel, setDifficultyLevel] = useState<string>('Medium');
    const [imageUrl, setImageUrl] = useState('');
    const [directions, setDirections] = useState<Array<{ stepNumber: number; description: string; imageUrl?: string }>>([
        { stepNumber: 1, description: '', imageUrl: '' },
    ]);
    const [ingredients, setIngredients] = useState<IngredientInput[]>([{ foodRefId: '', quantity: 100, unitId: '' }]);
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
            ingredients: ingredients.map((i) => ({ foodRefId: i.foodRefId, quantity: i.quantity, unitId: i.unitId, notes: i.notes })),
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
            setDifficultyLevel('Medium');
            setImageUrl('');
            setIngredients([{ foodRefId: '', quantity: 100, unitId: '' }]);
            setDirections([{ stepNumber: 1, description: '', imageUrl: '' }]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={onSubmit} className="w-full max-w-4xl">
            <FieldSet>
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

                <BasicInfo
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    prepTimeMinutes={prepTimeMinutes}
                    setPrepTimeMinutes={setPrepTimeMinutes}
                    cookTimeMinutes={cookTimeMinutes}
                    setCookTimeMinutes={setCookTimeMinutes}
                    servings={servings}
                    setServings={setServings}
                    difficultyLevel={difficultyLevel}
                    setDifficultyLevel={setDifficultyLevel}
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    notes={notes}
                    setNotes={setNotes}
                />

                <IngredientsEditor
                    ingredients={ingredients}
                    setIngredients={setIngredients}
                    foodRefs={{ data: foodRefs.data, isFetching: foodRefs.isFetching }}
                    foodGroup={foodGroup}
                    setFoodGroup={setFoodGroup}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    page={page}
                    setPage={setPage}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    setSearch={setSearch}
                    onSearch={(q?: string) => {
                        setSearch(q);
                        setPage(1);
                        void foodRefs.refetch();
                    }}
                />

                <DirectionsEditor directions={directions} setDirections={setDirections} />

                <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white" disabled={create.isPending}>Create</button>
                </div>
            </FieldSet>
        </form>
    );
}

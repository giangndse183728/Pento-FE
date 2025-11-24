"use client";

import React, { useState } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { recipeDetailedSchema } from '../schema/recipeSchema';
import { RecipeDetailedInput, IngredientInput } from '../services/recipesService';
import useFoodReferences from '../hooks/useFoodReferences';
import { FieldSet } from '@/components/ui/field';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { ColorTheme } from '@/constants/color';
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

    // No automatic debounce fetch: search triggers only via Search button in FoodReferencesSearch.

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
        <form onSubmit={onSubmit} className="w-full max-w-5xl space-y-6">
            <FieldSet>
                {formErrors.length > 0 && (
                    <WhiteCard className="mb-4">
                        <div className="text-red-700">
                            <strong className="block font-semibold">Validation errors:</strong>
                            <ul className="mt-2 list-disc list-inside">
                                {formErrors.map((m, i) => (
                                    <li key={i}>{m}</li>
                                ))}
                            </ul>
                        </div>
                    </WhiteCard>
                )}

                {/* Section 1: Basic Info */}
                <WhiteCard className="w-full">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="h-7 w-7 rounded-full text-white grid place-items-center text-sm font-semibold" style={{ backgroundColor: ColorTheme.blueGray }}>1</div>
                        <h2 className="text-lg md:text-xl font-semibold">Basic Information</h2>
                    </div>
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
                </WhiteCard>

                {/* Section 2: Ingredients */}
                <WhiteCard className="w-full">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="h-7 w-7 rounded-full text-white grid place-items-center text-sm font-semibold" style={{ backgroundColor: ColorTheme.blueGray }}>2</div>
                        <h2 className="text-lg md:text-xl font-semibold">Ingredients</h2>
                    </div>
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
                    />
                </WhiteCard>

                {/* Section 3: Directions */}
                <WhiteCard className="w-full">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="h-7 w-7 rounded-full text-white grid place-items-center text-sm font-semibold" style={{ backgroundColor: ColorTheme.blueGray }}>3</div>
                        <h2 className="text-lg md:text-xl font-semibold">Directions</h2>
                    </div>
                    <DirectionsEditor directions={directions} setDirections={setDirections} />
                </WhiteCard>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="px-4 py-2 rounded text-white transition hover:brightness-110"
                        style={{ backgroundColor: ColorTheme.blueGray }}
                        disabled={create.isPending}
                    >
                        Create
                    </button>
                </div>
            </FieldSet>
        </form>
    );
}

"use client";

import React, { useState } from "react";
import { WhiteCard } from "@/components/decoration/WhiteCard";
import { CusButton } from "@/components/ui/cusButton";
import { FieldSet, FieldContent, FieldLegend } from "@/components/ui/field";
import { ColorTheme } from "@/constants/color";
import BasicInfo from "../BasicInfo";
import BasicInfoTab from "./BasicInfoTab";
import IngredientsTab from "./IngredientsTab";
import DirectionsTab from "./DirectionsTab";
import { Edit, Save, X, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateRecipe } from "../../services/recipesService";
import { toast } from "sonner";
import "@/styles/tab-bar.css";



type Ingredient = {
    ingredientId?: string;
    foodRefId: string;
    foodRefName: string;
    imageUrl?: string | null;
    quantity: number;
    unitId: string;
    unitName: string;
    notes?: string | null;
};

type Direction = {
    directionId?: string;
    stepNumber: number;
    description: string;
    imageUrl?: string | null;
};

type RecipeDetail = {
    recipeTitle: string;
    description?: string | null;
    prepTimeMinutes?: number | null;
    cookTimeMinutes?: number | null;
    totalTimeMinutes?: number | null;
    notes?: string | null;
    servings?: number | null;
    difficultyLevel?: string | null;
    imageUrl?: string | null;
    isPublic?: boolean;
    ingredients: Ingredient[];
    directions: Direction[];
};

type Props = {
    recipeId: string;
    initialData: RecipeDetail;
    onSave?: (data: RecipeDetail) => void;
};

export default function RecipesDetailsPage({ recipeId, initialData, onSave }: Props) {
    const router = useRouter();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [data, setData] = useState<RecipeDetail>(initialData);
    const [local, setLocal] = useState<RecipeDetail>(initialData);
    const [activeTab, setActiveTab] = useState<'basic' | 'ingredients' | 'directions'>('basic');

    React.useEffect(() => {
        setData(initialData);
        setLocal(initialData);
    }, [initialData]);

    const handleEdit = () => setIsEditMode(true);
    const handleCancel = () => {
        setLocal(data);
        setIsEditMode(false);
    };
    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Build the payload for PUT /recipes/{recipeId}
            const payload = {
                title: local.recipeTitle,
                description: local.description ?? null,
                prepTimeMinutes: local.prepTimeMinutes ?? null,
                cookTimeMinutes: local.cookTimeMinutes ?? null,
                notes: local.notes ?? null,
                servings: local.servings ?? null,
                difficultyLevel: (local.difficultyLevel as "Easy" | "Medium" | "Hard") ?? null,
                imageUrl: local.imageUrl ?? null,
                isPublic: local.isPublic ?? true,
            };

            console.log('Updating recipe with payload:', JSON.stringify(payload, null, 2));

            // Call updateRecipe service directly
            await updateRecipe(recipeId, payload);

            toast.success('Recipe updated successfully');
            setData(local);
            onSave?.(local);
            setIsEditMode(false);
        } catch (error) {
            console.error('Failed to update recipe:', error);
            const message = error instanceof Error ? error.message : 'Failed to update recipe';
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    };

    const update = (patch: Partial<RecipeDetail>) => setLocal((p) => ({ ...p, ...patch }));

    const updateIngredientAt = (idx: number, patch: Partial<Ingredient>) => {
        setLocal((p) => ({
            ...p,
            ingredients: p.ingredients.map((ing, i) => (i === idx ? { ...ing, ...patch } : ing)),
        }));
    };
    const addIngredient = () => setLocal((p) => ({
        ...p,
        ingredients: [...p.ingredients, { foodRefId: "", foodRefName: "", quantity: 1, unitId: "", unitName: "" }],
    }));
    const removeIngredient = (idx: number) => setLocal((p) => ({
        ...p,
        ingredients: p.ingredients.filter((_, i) => i !== idx),
    }));

    const updateDirectionAt = (idx: number, patch: Partial<Direction>) => {
        setLocal((p) => ({
            ...p,
            directions: p.directions.map((d, i) => (i === idx ? { ...d, ...patch } : d)).map((d, i) => ({ ...d, stepNumber: i + 1 })),
        }));
    };
    const addDirection = () => setLocal((p) => ({
        ...p,
        directions: [...p.directions, { stepNumber: p.directions.length + 1, description: "" }],
    }));
    const removeDirection = (idx: number) => setLocal((p) => ({
        ...p,
        directions: p.directions.filter((_, i) => i !== idx).map((d, i) => ({ ...d, stepNumber: i + 1 })),
    }));

    return (
        <>
            <div className="w-full mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <CusButton
                        variant="blueGray"
                        onClick={() => router.back()}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </CusButton>
                    <h1 className="text-3xl font-semibold">Recipe Details</h1>
                </div>
                <div className="flex gap-3">
                    {activeTab !== 'ingredients' && (
                        !isEditMode ? (
                            <CusButton
                                variant="blueGray"
                                onClick={handleEdit}
                                className="flex items-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Edit
                            </CusButton>
                        ) : (
                            <>
                                <CusButton
                                    variant="gray"
                                    onClick={handleCancel}
                                    className="flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </CusButton>
                                <CusButton
                                    variant="blueGray"
                                    onClick={handleSave}
                                    className="flex items-center gap-2"
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </CusButton>
                            </>
                        )
                    )}
                </div>
            </div>

            <div className="w-full flex justify-center">
                <div className="w-full max-w-5xl">
                    <WhiteCard className="bg-white/70">
                        <div className="p-8 space-y-8">
                            {/* Tab Bar */}
                            <div className="segmented-wrapper">
                                <div className="segmented">
                                    <label className="segmented-button">
                                        <input
                                            type="radio"
                                            name="recipe-page-tab"
                                            checked={activeTab === 'basic'}
                                            onChange={() => setActiveTab('basic')}
                                        />
                                        Basic Info
                                    </label>
                                    <label className="segmented-button">
                                        <input
                                            type="radio"
                                            name="recipe-page-tab"
                                            checked={activeTab === 'ingredients'}
                                            onChange={() => setActiveTab('ingredients')}
                                        />
                                        Ingredients
                                    </label>
                                    <label className="segmented-button">
                                        <input
                                            type="radio"
                                            name="recipe-page-tab"
                                            checked={activeTab === 'directions'}
                                            onChange={() => setActiveTab('directions')}
                                        />
                                        Directions
                                    </label>
                                </div>
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'basic' && (
                                isEditMode ? (
                                    <BasicInfo
                                        title={local.recipeTitle}
                                        setTitle={(s) => update({ recipeTitle: s })}
                                        description={local.description ?? ""}
                                        setDescription={(s) => update({ description: s })}
                                        prepTimeMinutes={local.prepTimeMinutes ?? undefined}
                                        setPrepTimeMinutes={(n) => update({ prepTimeMinutes: n ?? 0 })}
                                        cookTimeMinutes={local.cookTimeMinutes ?? undefined}
                                        setCookTimeMinutes={(n) => update({ cookTimeMinutes: n ?? 0 })}
                                        servings={local.servings ?? undefined}
                                        setServings={(n) => update({ servings: n ?? 1 })}
                                        difficultyLevel={(local.difficultyLevel ?? "Medium") as "Easy" | "Medium" | "Hard"}
                                        setDifficultyLevel={(s) => update({ difficultyLevel: s })}
                                        imageUrl={local.imageUrl ?? ""}
                                        setImageUrl={(s) => update({ imageUrl: s })}
                                        notes={local.notes ?? ""}
                                        setNotes={(s) => update({ notes: s })}
                                        isPublic={!!local.isPublic}
                                        setIsPublic={(b) => update({ isPublic: b })}
                                    />
                                ) : (
                                    <BasicInfoTab
                                        recipeId={recipeId}
                                        recipeTitle={data.recipeTitle}
                                        description={data.description}
                                        imageUrl={data.imageUrl}
                                        prepTimeMinutes={data.prepTimeMinutes}
                                        cookTimeMinutes={data.cookTimeMinutes}
                                        servings={data.servings}
                                        difficultyLevel={data.difficultyLevel}
                                        notes={data.notes}
                                        isPublic={data.isPublic}
                                    />
                                )
                            )}

                            {activeTab === 'ingredients' && (
                                <IngredientsTab ingredients={data.ingredients} recipeId={recipeId} />
                            )}

                            {activeTab === 'directions' && (
                                isEditMode ? (
                                    <FieldSet>
                                        <FieldLegend>Directions</FieldLegend>
                                        <FieldContent>
                                            <div className="space-y-4">
                                                {local.directions.map((d, idx) => (
                                                    <div key={idx} className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-semibold" style={{ color: ColorTheme.blueGray }}>Step {idx + 1}</span>
                                                            <CusButton variant="red" size="default" onClick={() => removeDirection(idx)}>Remove</CusButton>
                                                        </div>
                                                        <textarea
                                                            className="neomorphic-textarea w-full"
                                                            placeholder="Step description"
                                                            value={d.description}
                                                            onChange={(e) => updateDirectionAt(idx, { description: e.target.value })}
                                                        />
                                                    </div>
                                                ))}
                                                <CusButton variant="blue" onClick={addDirection}>Add Step</CusButton>
                                            </div>
                                        </FieldContent>
                                    </FieldSet>
                                ) : (
                                    <DirectionsTab directions={data.directions} recipeId={recipeId} isEditMode={isEditMode} />
                                )
                            )}
                        </div>
                    </WhiteCard>
                </div>
            </div>
        </>
    );
}

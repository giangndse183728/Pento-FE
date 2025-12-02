"use client";

import React, { useState } from "react";
import AdminLayout from "@/features/admin/components/AdminLayout";
import { WhiteCard } from "@/components/decoration/WhiteCard";
import { CusButton } from "@/components/ui/cusButton";
import { FieldSet, FieldContent, FieldLegend } from "@/components/ui/field";
import { ColorTheme } from "@/constants/color";
import BasicInfo from "./BasicInfo";
import { Edit, Save, X, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
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
    initialData: RecipeDetail;
    onSave: (data: RecipeDetail) => void;
};

export default function RecipesDetailsPage({ initialData, onSave }: Props) {
    const router = useRouter();
    const [isEditMode, setIsEditMode] = useState(false);
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
    const handleSave = () => {
        setData(local);
        onSave(local);
        setIsEditMode(false);
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
        <AdminLayout>
            <div className="w-full mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <CusButton
                        variant="gray"
                        onClick={() => router.back()}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </CusButton>
                    <h1 className="text-3xl font-semibold">Recipe Details</h1>
                </div>
                <div className="flex gap-3">
                    {!isEditMode ? (
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
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </CusButton>
                        </>
                    )}
                </div>
            </div>

            <div className="w-full flex justify-center">
                <div className="w-full max-w-5xl">
                    <WhiteCard className="bg-white/50">
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
                                        difficultyLevel={local.difficultyLevel ?? "Medium"}
                                        setDifficultyLevel={(s) => update({ difficultyLevel: s })}
                                        imageUrl={local.imageUrl ?? ""}
                                        setImageUrl={(s) => update({ imageUrl: s })}
                                        notes={local.notes ?? ""}
                                        setNotes={(s) => update({ notes: s })}
                                        isPublic={!!local.isPublic}
                                        setIsPublic={(b) => update({ isPublic: b })}
                                    />
                                ) : (
                                    <div className="prose prose-slate max-w-none">
                                        {/* Title */}
                                        <h1 className="text-4xl font-bold mb-2" style={{ color: ColorTheme.darkBlue }}>
                                            {data.recipeTitle}
                                        </h1>

                                        {/* Visibility Badge */}
                                        <div className="mb-6">
                                            <span
                                                className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                                                style={{
                                                    backgroundColor: data.isPublic ? '#90EE90' : '#FFA07A',
                                                    color: 'white'
                                                }}
                                            >
                                                {data.isPublic ? '🌐 Public' : '🔒 Private'}
                                            </span>
                                        </div>

                                        {/* Image */}
                                        {data.imageUrl && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={data.imageUrl}
                                                alt={data.recipeTitle}
                                                className="w-full max-h-96 object-cover rounded-2xl mb-6 shadow-lg"
                                            />
                                        )}

                                        {/* Description */}
                                        {data.description && (
                                            <div className="mb-6">
                                                <h2 className="text-2xl font-semibold mb-2" style={{ color: ColorTheme.blueGray }}>
                                                    Description
                                                </h2>
                                                <p className="text-gray-700 leading-relaxed">{data.description}</p>
                                            </div>
                                        )}

                                        {/* Recipe Info Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 not-prose">
                                            <div className="bg-slate-100 p-4 rounded-xl">
                                                <div className="text-sm text-gray-600 mb-1">Prep Time</div>
                                                <div className="text-xl font-bold" style={{ color: ColorTheme.darkBlue }}>
                                                    {data.prepTimeMinutes ?? 0} min
                                                </div>
                                            </div>
                                            <div className="bg-slate-100 p-4 rounded-xl">
                                                <div className="text-sm text-gray-600 mb-1">Cook Time</div>
                                                <div className="text-xl font-bold" style={{ color: ColorTheme.darkBlue }}>
                                                    {data.cookTimeMinutes ?? 0} min
                                                </div>
                                            </div>
                                            <div className="bg-slate-100 p-4 rounded-xl">
                                                <div className="text-sm text-gray-600 mb-1">Servings</div>
                                                <div className="text-xl font-bold" style={{ color: ColorTheme.darkBlue }}>
                                                    {data.servings ?? 1}
                                                </div>
                                            </div>
                                            <div className="bg-slate-100 p-4 rounded-xl">
                                                <div className="text-sm text-gray-600 mb-1">Difficulty</div>
                                                <div className="text-xl font-bold" style={{ color: ColorTheme.darkBlue }}>
                                                    {data.difficultyLevel ?? 'Medium'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        {data.notes && (
                                            <div className="bg-blue-50 p-4 rounded-xl mb-6">
                                                <h3 className="text-lg font-semibold mb-2" style={{ color: ColorTheme.blueGray }}>
                                                    📝 Notes
                                                </h3>
                                                <p className="text-gray-700">{data.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                )
                            )}

                            {activeTab === 'ingredients' && (
                                isEditMode ? (
                                    <FieldSet>
                                        <FieldLegend>Ingredients</FieldLegend>
                                        <FieldContent>
                                            <div className="space-y-4">
                                                {local.ingredients.map((ing, idx) => (
                                                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
                                                        <input
                                                            className="neomorphic-input sm:col-span-2"
                                                            placeholder="Food name"
                                                            value={ing.foodRefName}
                                                            onChange={(e) => updateIngredientAt(idx, { foodRefName: e.target.value })}
                                                        />
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            className="neomorphic-input"
                                                            placeholder="Qty"
                                                            value={ing.quantity}
                                                            onChange={(e) => updateIngredientAt(idx, { quantity: Number(e.target.value || 0) })}
                                                        />
                                                        <input
                                                            className="neomorphic-input"
                                                            placeholder="Unit"
                                                            value={ing.unitName}
                                                            onChange={(e) => updateIngredientAt(idx, { unitName: e.target.value })}
                                                        />
                                                        <CusButton variant="red" size="default" onClick={() => removeIngredient(idx)}>Remove</CusButton>
                                                    </div>
                                                ))}
                                                <CusButton variant="blue" onClick={addIngredient}>Add Ingredient</CusButton>
                                            </div>
                                        </FieldContent>
                                    </FieldSet>
                                ) : (
                                    <div className="prose prose-slate max-w-none">
                                        <h2 className="text-3xl font-bold mb-6" style={{ color: ColorTheme.darkBlue }}>
                                            🥗 Ingredients
                                        </h2>
                                        <ul className="space-y-4">
                                            {data.ingredients.map((ing, idx) => (
                                                <li key={idx} className="flex items-center gap-4">
                                                    {ing.imageUrl ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={ing.imageUrl}
                                                            alt={ing.foodRefName}
                                                            className="w-12 h-12 rounded-xl object-cover shadow"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 shadow">
                                                            🥗
                                                        </div>
                                                    )}
                                                    <div className="text-lg">
                                                        <span className="font-semibold">{ing.quantity} {ing.unitName}</span> {ing.foodRefName}
                                                        {ing.notes && <span className="text-gray-500 italic text-sm"> ({ing.notes})</span>}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )
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
                                    <div className="prose prose-slate max-w-none">
                                        <h2 className="text-3xl font-bold mb-6" style={{ color: ColorTheme.darkBlue }}>
                                            👨‍🍳 Directions
                                        </h2>
                                        <ol className="space-y-6">
                                            {data.directions.map((d, idx) => (
                                                <li key={idx} className="text-lg">
                                                    <div className="font-semibold mb-2" style={{ color: ColorTheme.blueGray }}>
                                                        Step {d.stepNumber}
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed">{d.description}</p>
                                                    {d.imageUrl && (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={d.imageUrl}
                                                            alt={`Step ${d.stepNumber}`}
                                                            className="mt-3 rounded-lg max-w-md"
                                                        />
                                                    )}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )
                            )}
                        </div>
                    </WhiteCard>
                </div>
            </div>
        </AdminLayout>
    );
}

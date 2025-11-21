"use client";

import React, { useEffect, useState } from 'react';
import { FoodRef, IngredientInput } from '../../services/recipesService';
import useUnits from '../../hooks/useUnit';
import { Field, FieldLabel, FieldContent } from '@/components/ui/field';
import { ColorTheme } from '@/constants/color';
import UnitsModal from '../UnitsModel';
import FoodReferencesSearch from './FoodReferencesSearch';
import FoodReferencesResults from './FoodReferencesResults';
import IngredientsList from './IngredientsList';

type Props = {
    ingredients: IngredientInput[];
    setIngredients: (next: IngredientInput[] | ((prev: IngredientInput[]) => IngredientInput[])) => void;
    foodRefs: { data?: FoodRef[]; isFetching?: boolean };
    foodGroup?: string | undefined;
    setFoodGroup?: (v?: string) => void;
    searchInput?: string;
    setSearchInput?: (v: string) => void;
    page?: number;
    setPage?: (n: number) => void;
    pageSize?: number;
    setPageSize?: (n: number) => void;
    setSearch?: (v?: string) => void;
    onSearch?: (v?: string) => void;
};

export default function IngredientsEditor({ ingredients, setIngredients, foodRefs, foodGroup, setFoodGroup, searchInput, setSearchInput, page, setPage, pageSize, setPageSize, setSearch, onSearch }: Props) {
    const { data: units } = useUnits();
    const updateAt = (idx: number, patch: Partial<IngredientInput>) => {
        setIngredients((prev) => prev.map((p, i) => i === idx ? { ...p, ...patch } : p));
    };

    // per-row typed name inputs so we can show suggestions and allow typing
    const [nameInputs, setNameInputs] = useState<string[]>(() =>
        ingredients.map((ing) => {
            const found = foodRefs.data?.find((f) => f.id === ing.foodRefId);
            return found ? found.name : '';
        })
    );
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [showUnitsModal, setShowUnitsModal] = useState(false);

    // keep nameInputs in sync when ingredients or fetched foodRefs change
    useEffect(() => {
        setNameInputs((prev) =>
            ingredients.map((ing, i) => {
                const found = foodRefs.data?.find((f) => f.id === ing.foodRefId);
                if (found) return found.name;
                return prev[i] ?? '';
            })
        );
    }, [ingredients, foodRefs.data]);

    return (
        <Field className="p-4 rounded-2xl shadow" style={{ background: ColorTheme.babyBlue }}>
            <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue }}>Ingredients</FieldLabel>
            <FieldContent>
                <FoodReferencesSearch
                    foodGroup={foodGroup}
                    setFoodGroup={setFoodGroup}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    page={page}
                    setPage={setPage}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    setSearch={setSearch}
                    onSearch={onSearch}
                />

                <FoodReferencesResults
                    foodRefs={foodRefs}
                    ingredients={ingredients}
                    setIngredients={setIngredients}
                    openIndex={openIndex}
                    setNameInputs={setNameInputs}
                    updateAt={updateAt}
                />

                <UnitsModal isOpen={showUnitsModal} onClose={() => setShowUnitsModal(false)} units={units} />

                <IngredientsList
                    ingredients={ingredients}
                    setIngredients={setIngredients}
                    foodRefs={foodRefs}
                    units={units || []}
                    nameInputs={nameInputs}
                    setNameInputs={setNameInputs}
                    updateAt={updateAt}
                    setShowUnitsModal={setShowUnitsModal}
                />
            </FieldContent>
        </Field>
    );
}
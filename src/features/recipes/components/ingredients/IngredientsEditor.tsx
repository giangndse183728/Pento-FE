"use client";

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IngredientInput } from '../../services/recipesService';
import { UseQueryResult } from '@tanstack/react-query';
import { FoodReferencesResponse } from '../../services/recipesService';
import useUnits from '../../hooks/useUnit';
import { Field, FieldLabel, FieldContent } from '@/components/ui/field';
import { ColorTheme } from '@/constants/color';
import UnitsModal from '../UnitsModel';
import FoodReferencesSearch from './FoodReferencesSearch';
import FoodReferencesResults from './FoodReferencesResults';
import IngredientRow from './IngredientsRow';
import { CusButton } from '@/components/ui/cusButton';

const StyledField = styled(Field)`
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    background: ${ColorTheme.babyBlue};
`;

const StyledFieldLabel = styled(FieldLabel)`
    font-weight: 600;
    color: ${ColorTheme.darkBlue};
`;

type Props = {
    ingredients: IngredientInput[];
    setIngredients: (next: IngredientInput[] | ((prev: IngredientInput[]) => IngredientInput[])) => void;
    foodRefs: UseQueryResult<FoodReferencesResponse, Error>;
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
            const found = foodRefs.data?.items.find((f) => f.id === ing.foodRefId);
            return found ? found.name : '';
        })
    );
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [showUnitsModal, setShowUnitsModal] = useState(false);

    // keep nameInputs in sync when ingredients or fetched foodRefs change
    useEffect(() => {
        setNameInputs((prev) =>
            ingredients.map((ing, i) => {
                const found = foodRefs.data?.items.find((f) => f.id === ing.foodRefId);
                if (found) return found.name;
                return prev[i] ?? '';
            })
        );
    }, [ingredients, foodRefs.data]);

    return (
        <StyledField>
            <StyledFieldLabel>Ingredients</StyledFieldLabel>
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
                    page={page}
                    setPage={setPage}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                />

                <UnitsModal isOpen={showUnitsModal} onClose={() => setShowUnitsModal(false)} units={units} />

                {/* Ingredients List - Previously IngredientsList component */}
                <div className="space-y-2">
                    {ingredients.map((ing, idx) => {
                        const typed = nameInputs[idx] ?? '';
                        const suggestions = (foodRefs.data?.items ?? []).filter((fr) => fr.name.toLowerCase().includes(typed.toLowerCase())).slice(0, 10);

                        return (
                            <IngredientRow
                                key={idx}
                                ingredient={ing}
                                units={units || []}
                                updateAt={(patch) => updateAt(idx, patch)}
                                nameInput={typed}
                                setNameInput={(name) => setNameInputs((prev) => prev.map((p, i) => (i === idx ? name : p)))}
                                suggestions={suggestions}
                                open={openIndex === idx}
                                onOpen={() => setOpenIndex(idx)}
                                onClose={() => setOpenIndex((cur) => (cur === idx ? null : cur))}
                                onSuggestionClick={(fr) => {
                                    setNameInputs((prev) => prev.map((p, i) => (i === idx ? fr.name : p)));
                                    updateAt(idx, { foodRefId: fr.id });
                                    setOpenIndex(null);
                                }}
                                setShowUnitsModal={setShowUnitsModal}
                            />
                        );
                    })}
                    <div className="flex gap-2 mt-8">
                        <CusButton
                            type="button"
                            variant="blueGray"
                            size="lg"
                            onClick={() => setIngredients((p) => [...p, { foodRefId: '', quantity: 1, unitId: '' }])}
                        >
                            Add ingredient
                        </CusButton>
                        <CusButton
                            type="button"
                            variant="darkBlue"
                            size="lg"
                            onClick={() => setIngredients((p) => p.slice(0, -1))}
                        >
                            Remove last
                        </CusButton>
                    </div>
                </div>
            </FieldContent>
        </StyledField>
    );
}
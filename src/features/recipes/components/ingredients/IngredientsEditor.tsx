"use client";

import React, { useEffect, useState } from 'react';
import { IngredientInput, FoodRef } from '../../services/recipesService';
import { UseQueryResult } from '@tanstack/react-query';
import { FoodReferencesResponse } from '../../services/recipesService';
import useUnits from '../../hooks/useUnit';
import { FieldContent } from '@/components/ui/field';
import UnitsModal from '../UnitsModel';
import FoodReferencesSearch from './FoodReferencesSearch';
import FoodReferencesResults from './FoodReferencesResults';
import IngredientRow from './IngredientsRow';
import { CusButton } from '@/components/ui/cusButton';

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
    const [foodRefCache, setFoodRefCache] = useState<Record<string, FoodRef>>({});

    useEffect(() => {
        if (!foodRefs.data?.items) return;
        setFoodRefCache((prev) => {
            const next = { ...prev };
            foodRefs.data?.items.forEach((item) => {
                next[item.id] = item;
            });
            return next;
        });
    }, [foodRefs.data?.items]);

    const cacheFoodRef = (fr: FoodRef) => {
        setFoodRefCache((prev) => ({ ...prev, [fr.id]: fr }));
    };

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

    const handleRemoveRow = (idx: number) => {
        setIngredients((prev) => {
            if (prev.length <= 1) {
                return [{ foodRefId: '', quantity: 1, unitId: '' }];
            }
            return prev.filter((_, i) => i !== idx);
        });

        setNameInputs((prev) => {
            if (prev.length <= 1) {
                return [''];
            }
            return prev.filter((_, i) => i !== idx);
        });

        setOpenIndex((cur) => {
            if (cur === null) return null;
            if (cur === idx) return null;
            if (cur > idx) return cur - 1;
            return cur;
        });
    };

    return (
        <>
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
                    cacheFoodRef={cacheFoodRef}
                />

                <UnitsModal isOpen={showUnitsModal} onClose={() => setShowUnitsModal(false)} units={units} />

                {/* Ingredients List */}
                <div className="space-y-8">
                    {ingredients.map((ing, idx) => {
                        const typed = nameInputs[idx] ?? '';
                        const suggestions = (foodRefs.data?.items ?? []).filter((fr) => fr.name.toLowerCase().includes(typed.toLowerCase())).slice(0, 10);
                        const selectedFoodRef = ing.foodRefId ? foodRefCache[ing.foodRefId] : undefined;
                        const unitTypeLabel = selectedFoodRef?.unitType;
                        const filteredUnits =
                            selectedFoodRef && unitTypeLabel
                                ? (units ?? []).filter((unit) => unit.type === unitTypeLabel)
                                : selectedFoodRef
                                    ? units ?? []
                                    : [];
                        const unitDisabled = !selectedFoodRef;

                        return (
                            <IngredientRow
                                key={idx}
                                ingredient={ing}
                                units={filteredUnits}
                                unitSelectDisabled={unitDisabled}
                                onRemove={() => handleRemoveRow(idx)}
                                updateAt={(patch) => updateAt(idx, patch)}
                                nameInput={typed}
                                setNameInput={(name) => setNameInputs((prev) => prev.map((p, i) => (i === idx ? name : p)))}
                                suggestions={suggestions}
                                open={openIndex === idx}
                                onOpen={() => setOpenIndex(idx)}
                                onClose={() => setOpenIndex((cur) => (cur === idx ? null : cur))}
                                onSuggestionClick={(fr) => {
                                    setNameInputs((prev) => prev.map((p, i) => (i === idx ? fr.name : p)));
                                    cacheFoodRef(fr);
                                    updateAt(idx, { foodRefId: fr.id, unitId: '' });
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
                            onClick={() => {
                                setIngredients((p) => [...p, { foodRefId: '', quantity: 1, unitId: '' }]);
                                setNameInputs((prev) => [...prev, '']);
                            }}
                        >
                            Add ingredient
                        </CusButton>
                    </div>
                </div>
            </FieldContent>
        </>
    );
}
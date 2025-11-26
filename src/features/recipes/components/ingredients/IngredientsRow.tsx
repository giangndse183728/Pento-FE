"use client";

import React from "react";
import ElasticSlider from "@/components/decoration/ElasticSlider";
import { FoodRef, IngredientInput, Unit } from "../../services/recipesService";
import { CusButton } from "@/components/ui/cusButton";
import { BadgeInfo, CircleMinus, CirclePlus } from "lucide-react";

type Props = {
    ingredient: IngredientInput;
    units: Unit[];
    updateAt: (patch: Partial<IngredientInput>) => void;
    nameInput: string;
    setNameInput: (name: string) => void;
    suggestions: FoodRef[];
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    onSuggestionClick: (foodRef: FoodRef) => void;
    setShowUnitsModal: (show: boolean) => void;
};

export default function IngredientRow(props: Props) {
    const {
        ingredient,
        units,
        updateAt,
        nameInput,
        setNameInput,
        suggestions,
        open,
        onOpen,
        onClose,
        onSuggestionClick,
        setShowUnitsModal,
    } = props;

    return (
        <div className="relative">
            <div className="grid grid-cols-12 gap-4 items-center">
                {/* INGREDIENT NAME FIELD */}
                <div className="relative col-span-5">
                    <input
                        className="neomorphic-input w-full"
                        placeholder="Ingredient name"
                        value={nameInput}
                        autoComplete="off"
                        onChange={(e) => {
                            setNameInput(e.target.value);
                            updateAt({ foodRefId: "" });
                            onOpen();
                        }}
                        onFocus={onOpen}
                        onBlur={() => setTimeout(onClose, 150)}
                    />

                    {open && suggestions.length > 0 && (
                        <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-auto bg-white border rounded shadow">
                            {suggestions.map((fr) => (
                                <li
                                    key={fr.id}
                                    onMouseDown={(ev) => ev.preventDefault()}
                                    onClick={() => onSuggestionClick(fr)}
                                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                >
                                    {fr.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* 🎚️ SLIDER + BUTTONS */}
                <div className="flex gap-3 items-center justify-center col-span-4">
                    <button
                        type="button"
                        onClick={() => updateAt({ quantity: Math.max(0, ingredient.quantity - 1) })}
                        className="p-2 hover:scale-110 transition-transform flex-shrink-0"
                    >
                        <CircleMinus className="w-5 h-5" />
                    </button>
                    <div className="flex-1 flex items-center">
                        <ElasticSlider
                            defaultValue={ingredient.quantity}
                            startingValue={0}
                            maxValue={99}
                            isStepped={true}
                            stepSize={1}
                            onChange={(val) => updateAt({ quantity: val })}
                            leftIcon={<span />}
                            rightIcon={<span />}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => updateAt({ quantity: Math.min(99, ingredient.quantity + 1) })}
                        className="p-2 hover:scale-110 transition-transform flex-shrink-0"
                    >
                        <CirclePlus className="w-5 h-5" />
                    </button>
                </div>

                {/* UNIT SELECT */}
                <div className="flex gap-2 items-center col-span-3">
                    <select
                        className="neomorphic-select flex-1"
                        value={ingredient.unitId}
                        onChange={(e) => updateAt({ unitId: e.target.value })}
                    >
                        <option value="">Select unit</option>
                        {units?.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name}
                            </option>
                        ))}
                    </select>

                    <CusButton
                        type="button"
                        variant="blueGray"
                        size="icon"
                        onClick={() => setShowUnitsModal(true)}
                        className="w-8 h-8 rounded-full shrink-0"
                        title="View available units"
                    >
                        <BadgeInfo className="w-5 h-5" />
                    </CusButton>
                </div>
            </div>
        </div>
    );
}

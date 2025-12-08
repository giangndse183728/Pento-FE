"use client";

import React from "react";
import ElasticSlider from "@/components/decoration/ElasticSlider";
import { IngredientInput } from "../../services/recipesService";
import { FoodRef } from "@/features/food-references";
import { Unit } from "@/features/units";
import { CusButton } from "@/components/ui/cusButton";
import { BadgeInfo, CircleMinus, CirclePlus, Trash } from "lucide-react";

type Props = {
    ingredient: IngredientInput;
    units: Unit[];
    unitSelectDisabled: boolean;
    onRemove: () => void;
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
        unitSelectDisabled,
        onRemove,
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
                            updateAt({ foodRefId: "", unitId: "" });
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

                {/* slider and buttons */}
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
                            maxValue={1000}
                            isStepped={true}
                            stepSize={1}
                            onChange={(val) => updateAt({ quantity: val })}
                            leftIcon={<span />}
                            rightIcon={<span />}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => updateAt({ quantity: Math.min(1000, ingredient.quantity + 1) })}
                        className="p-2 hover:scale-110 transition-transform flex-shrink-0"
                    >
                        <CirclePlus className="w-5 h-5" />
                    </button>
                </div>

                {/* UNIT SELECT */}
                <div className="flex gap-2 items-center col-span-3">
                    <select
                        className={`neomorphic-select flex-1 ${unitSelectDisabled ? "text-gray-400" : ""}`}
                        value={ingredient.unitId}
                        onChange={(e) => updateAt({ unitId: e.target.value })}
                        disabled={unitSelectDisabled}
                    >
                        <option value="">Select unit</option>
                        {!unitSelectDisabled && units?.length === 0 && (
                            <option value="" disabled>
                                No units available
                            </option>
                        )}
                        {!unitSelectDisabled &&
                            units?.map((u) => (
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

                    <button
                        type="button"
                        onClick={onRemove}
                        className="
                        w-8 h-8 rounded-full shrink-0 
                        flex items-center justify-center
                        bg-red-50 hover:bg-red-100 
                        text-red-500 hover:text-red-600 
                        transition-colors"
                        aria-label="Remove ingredient"
                    >
                        <Trash className="w-5 h-5" />
                    </button>

                </div>
            </div>
        </div>
    );
}

"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { FoodRef, IngredientInput, Unit } from "../../services/recipesService";
import { CusButton } from "@/components/ui/cusButton";
import { BadgeInfo } from "lucide-react";

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
                        className="p-3 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-xl w-full"
                        placeholder="Ingredient name"
                        value={nameInput}
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

                {/* 🎚️ SLIDER + NUMBER */}
                <div className="flex gap-3 items-center col-span-4">
                    <div className="flex-1">
                        <Slider
                            value={[ingredient.quantity]}
                            min={0}
                            max={99}
                            step={1}
                            onValueChange={([val]) => updateAt({ quantity: val })}
                            className="w-full"
                        />
                    </div>

                    <input
                        type="number"
                        className="p-3 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-xl w-20 text-center"
                        min={0}
                        value={ingredient.quantity}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            updateAt({ quantity: val >= 0 ? val : 0 });
                        }}
                    />
                </div>

                {/* UNIT SELECT */}
                <div className="flex gap-2 items-center col-span-3">
                    <select
                        className="p-3 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-xl flex-1"
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

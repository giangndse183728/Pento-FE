import React from "react";
import Image from "next/image";
import { ColorTheme } from "@/constants/color";

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

type Props = {
    ingredients: Ingredient[];
};

export default function IngredientsCards({ ingredients }: Props) {
    return (
        <div className="prose prose-slate max-w-none">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <Image
                    src="/assets/img/ingredients.png"
                    alt="Ingredients"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                />
                <h2 className="text-3xl font-bold m-0" style={{ color: ColorTheme.darkBlue }}>
                    Ingredients
                </h2>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ingredients.map((ing, idx) => (
                    <div
                        key={idx}
                        className="relative p-5 pt-12 rounded-xl shadow-md border mt-6 mb-4 "
                        style={{ backgroundColor: ColorTheme.babyBlue, width: "250px" }}
                    >
                        {/* Pop-out round image */}
                        <div className="absolute -top-6 left-10 -translate-x-1/2 w-25 h-25 rounded-full overflow-hidden shadow-lg bg-white ">
                            {ing.imageUrl ? (
                                <Image
                                    src={ing.imageUrl}
                                    alt={ing.foodRefName}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                    <Image
                                        src="/assets/img/ingredients.png"
                                        alt="Ingredient"
                                        width={32}
                                        height={32}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Text content */}
                        <div className="text-center mt-4">
                            <p className="font-semibold text-lg">
                                {ing.quantity} {ing.unitName}
                            </p>
                            <p className="text-gray-700">{ing.foodRefName}</p>
                            {ing.notes && (
                                <p className="text-gray-500 italic text-sm mt-1">
                                    ({ing.notes})
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

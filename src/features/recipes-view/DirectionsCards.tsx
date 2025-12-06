import React from "react";
import Image from "next/image";
import { ColorTheme } from "@/constants/color";

type Direction = {
    directionId?: string;
    stepNumber: number;
    description: string;
    imageUrl?: string | null;
};

type Props = {
    directions: Direction[];
};

export default function DirectionsCards({ directions }: Props) {
    return (
        <div className="prose prose-slate max-w-none">
            <div className="flex items-center gap-3 mb-6">
                <Image
                    src="/assets/img/directions.png"
                    alt="Directions"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                />
                <h2 className="text-3xl font-bold m-0" style={{ color: ColorTheme.darkBlue }}>
                    Directions
                </h2>
            </div>
            <ol className="space-y-12">
                {directions.map((d, idx) => (
                    <li key={idx} className="text-lg">
                        <div className="flex items-start gap-3 mb-6">
                            <div className="h-10 w-10 rounded-full text-white grid place-items-center text-sm font-semibold" style={{ backgroundColor: ColorTheme.powderBlue }}>
                                {d.stepNumber}
                            </div>
                            <div className="flex-1">
                                {d.imageUrl ? (
                                    <div className="grid gap-4 md:grid-cols-2 items-start">
                                        <p className="text-gray-700 leading-relaxed" style={{ color: ColorTheme.darkBlue }}>
                                            {d.description}
                                        </p>
                                        <div className="flex justify-center">
                                            <Image
                                                src={d.imageUrl}
                                                alt={`Step ${d.stepNumber}`}
                                                width={300}
                                                height={300}
                                                className="rounded-lg max-w-md object-cover"
                                                style={{ height: "350px", width: "100%" }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-700 leading-relaxed" style={{ color: ColorTheme.darkBlue }}>
                                        {d.description}
                                    </p>
                                )}
                            </div>
                        </div>
                        {idx < directions.length - 1 && (
                            <div className="border-b border-gray-300 my-8"></div>
                        )}

                    </li>
                ))}
            </ol>
        </div>
    );
}

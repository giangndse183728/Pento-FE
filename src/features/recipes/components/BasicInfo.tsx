"use client";

import React from "react";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { ColorTheme } from "@/constants/color";

type Props = {
    title: string;
    setTitle: (s: string) => void;
    description: string;
    setDescription: (s: string) => void;
    prepTimeMinutes?: number | undefined;
    setPrepTimeMinutes: (n?: number) => void;
    cookTimeMinutes?: number | undefined;
    setCookTimeMinutes: (n?: number) => void;
    servings?: number | undefined;
    setServings: (n?: number) => void;
    difficultyLevel: string;
    setDifficultyLevel: (s: string) => void;
    imageUrl: string;
    setImageUrl: (s: string) => void;
    notes: string;
    setNotes: (s: string) => void;
};

export default function BasicInfo(props: Props) {
    const {
        title, setTitle,
        description, setDescription,
        prepTimeMinutes, setPrepTimeMinutes,
        cookTimeMinutes, setCookTimeMinutes,
        servings, setServings,
        difficultyLevel, setDifficultyLevel,
        imageUrl, setImageUrl,
        notes, setNotes
    } = props;

    const totalTime = (prepTimeMinutes ?? 0) + (cookTimeMinutes ?? 0);

    return (
        <div className="space-y-8">

            {/* Title + Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <Field className="p-4 rounded-2xl shadow" style={{ background: ColorTheme.babyBlue }}>
                    <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue }}>Title</FieldLabel>
                    <FieldContent>
                        <input
                            className="p-3 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-xl w-full"
                            placeholder="Recipe title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </FieldContent>
                </Field>

                {/* Description */}
                <Field className="p-4 rounded-2xl shadow" style={{ background: ColorTheme.babyBlue }}>
                    <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue }}>Description</FieldLabel>
                    <FieldContent>
                        <input
                            className="p-3 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-xl w-full"
                            placeholder="Recipe description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FieldContent>
                </Field>
            </div>

            {/* Prep + Cook + Total Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Prep Time */}
                <Field className="p-4 rounded-2xl shadow" style={{ background: ColorTheme.babyBlue }}>
                    <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue }}>Prep Time</FieldLabel>
                    <FieldContent>
                        <input
                            type="number"
                            className="p-3 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-xl w-full"
                            placeholder="Minutes"
                            value={prepTimeMinutes ?? ""}
                            onChange={(e) =>
                                setPrepTimeMinutes(e.target.value ? Number(e.target.value) : undefined)
                            }
                        />
                    </FieldContent>
                </Field>

                {/* Cook Time */}
                <Field className="p-4 rounded-2xl shadow" style={{ background: ColorTheme.babyBlue }}>
                    <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue }}>Cook Time</FieldLabel>
                    <FieldContent>
                        <input
                            type="number"
                            className="p-3 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-xl w-full"
                            placeholder="Minutes"
                            value={cookTimeMinutes ?? ""}
                            onChange={(e) =>
                                setCookTimeMinutes(e.target.value ? Number(e.target.value) : undefined)
                            }
                        />
                    </FieldContent>
                </Field>

                {/* Total Time */}
                <Field className="bg-slate-50 p-4 rounded-2xl shadow">
                    <FieldLabel className="font-semibold text-slate-600">Total Time</FieldLabel>
                    <FieldContent>
                        <input
                            className="p-3 border rounded-xl w-full bg-slate-100 text-slate-500"
                            value={totalTime}
                            readOnly
                            disabled
                        />
                    </FieldContent>
                </Field>
            </div>

            {/* Servings + Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Servings */}
                <Field className="p-4 rounded-2xl shadow" style={{ background: ColorTheme.babyBlue }}>
                    <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue }}>Servings</FieldLabel>
                    <FieldContent>
                        <input
                            type="number"
                            className="p-3 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-xl w-full"
                            placeholder="Servings"
                            value={servings ?? ""}
                            onChange={(e) =>
                                setServings(e.target.value ? Number(e.target.value) : undefined)
                            }
                        />
                    </FieldContent>
                </Field>

                {/* Difficulty */}
                <Field className="p-4 rounded-2xl shadow" style={{ background: ColorTheme.babyBlue }}>
                    <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue }}>Difficulty</FieldLabel>
                    <FieldContent>
                        <select
                            className="p-3 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-xl w-full"
                            value={difficultyLevel}
                            onChange={(e) => setDifficultyLevel(e.target.value)}
                        >
                            <option value="Easy">Easy 😋</option>
                            <option value="Medium">Medium 😎</option>
                            <option value="Hard">Hard 🔥</option>
                        </select>
                    </FieldContent>
                </Field>
            </div>

            {/* Image */}
            <Field className="p-4 rounded-2xl shadow" style={{ background: ColorTheme.babyBlue }}>
                <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue }}>Image URL</FieldLabel>
                <FieldContent>
                    <input
                        className="p-3 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-xl w-full"
                        placeholder="https://example.com/pic.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </FieldContent>
            </Field>

            {/* Notes */}
            <Field className="p-4 rounded-2xl shadow" style={{ background: ColorTheme.babyBlue }}>
                <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue }}>Notes</FieldLabel>
                <FieldContent>
                    <textarea
                        className="w-full p-3 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-xl"
                        placeholder="Additional notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </FieldContent>
            </Field>
        </div>

    );
}

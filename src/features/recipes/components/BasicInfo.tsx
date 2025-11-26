"use client";

import React from "react";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { ColorTheme } from "@/constants/color";
import { Slider } from "@/components/ui/slider";

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

            {/* Title */}
            <Field className="p-4 rounded-2xl shadow" style={{ background: ColorTheme.babyBlue }}>
                <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue }}>Title</FieldLabel>
                <FieldContent>
                    <input
                        className="neomorphic-input w-full"
                        placeholder="Recipe title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoComplete="off"
                    />
                </FieldContent>
            </Field>

            {/* Description */}
            <Field className="p-4 rounded-2xl shadow" style={{ background: ColorTheme.babyBlue }}>
                <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue }}>Description</FieldLabel>
                <FieldContent>
                    <textarea
                        className="neomorphic-textarea w-full overflow-hidden min-h-[48px]"
                        placeholder="Recipe description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                        }}
                    />
                </FieldContent>
            </Field>

            {/* Prep + Cook + Total Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Prep Time */}
                <Field className="p-4 rounded-2xl shadow" style={{ background: ColorTheme.babyBlue }}>
                    <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue }}>Prep Time (min)</FieldLabel>
                    <FieldContent>
                        <div className="flex gap-3 items-center">
                            <div className="flex-1">
                                <Slider
                                    value={[prepTimeMinutes ?? 0]}
                                    min={0}
                                    max={240}
                                    step={5}
                                    onValueChange={([val]) => setPrepTimeMinutes(val)}
                                    className="w-full"
                                />
                            </div>
                            <input
                                type="number"
                                className="neomorphic-input w-20 text-center"
                                min={0}
                                value={prepTimeMinutes ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value ? Number(e.target.value) : undefined;
                                    setPrepTimeMinutes(val !== undefined && val >= 0 ? val : undefined);
                                }}
                            />
                        </div>
                    </FieldContent>
                </Field>

                {/* Cook Time */}
                <Field className="p-4 rounded-2xl shadow" style={{ background: ColorTheme.babyBlue }}>
                    <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue }}>Cook Time (min)</FieldLabel>
                    <FieldContent>
                        <div className="flex gap-3 items-center">
                            <div className="flex-1">
                                <Slider
                                    value={[cookTimeMinutes ?? 0]}
                                    min={0}
                                    max={240}
                                    step={5}
                                    onValueChange={([val]) => setCookTimeMinutes(val)}
                                    className="w-full"
                                />
                            </div>
                            <input
                                type="number"
                                className="neomorphic-input w-20 text-center"
                                min={0}
                                value={cookTimeMinutes ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value ? Number(e.target.value) : undefined;
                                    setCookTimeMinutes(val !== undefined && val >= 0 ? val : undefined);
                                }}
                            />
                        </div>
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
                        <div className="flex gap-3 items-center">
                            <div className="flex-1">
                                <Slider
                                    value={[servings ?? 1]}
                                    min={1}
                                    max={20}
                                    step={1}
                                    onValueChange={([val]) => setServings(val)}
                                    className="w-full"
                                />
                            </div>
                            <input
                                type="number"
                                className="neomorphic-input w-20 text-center"
                                min={1}
                                value={servings ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value ? Number(e.target.value) : undefined;
                                    setServings(val !== undefined && val >= 1 ? val : undefined);
                                }}
                            />
                        </div>
                    </FieldContent>
                </Field>

                {/* Difficulty */}
                <Field className="p-4 rounded-2xl shadow" style={{ background: ColorTheme.babyBlue }}>
                    <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue }}>Difficulty</FieldLabel>
                    <FieldContent>
                        <select
                            className="neomorphic-select w-full"
                            value={difficultyLevel}
                            onChange={(e) => setDifficultyLevel(e.target.value)}
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </FieldContent>
                </Field>
            </div>

            {/* Image */}
            <Field className="p-4 rounded-2xl shadow" style={{ background: ColorTheme.babyBlue }}>
                <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue }}>Image URL</FieldLabel>
                <FieldContent>
                    <input
                        className="neomorphic-input w-full"
                        placeholder="https://example.com/pic.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        autoComplete="off"
                    />
                </FieldContent>
            </Field>

            {/* Notes */}
            <Field className="p-4 rounded-2xl shadow" style={{ background: ColorTheme.babyBlue }}>
                <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue }}>Notes</FieldLabel>
                <FieldContent>
                    <textarea
                        className="neomorphic-textarea w-full overflow-hidden min-h-[48px]"
                        placeholder="Additional notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                        }}
                    />
                </FieldContent>
            </Field>
        </div>

    );
}

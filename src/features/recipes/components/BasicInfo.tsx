"use client";

import React from "react";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { ColorTheme } from "@/constants/color";
import ElasticSlider from "@/components/decoration/ElasticSlider";
import { CirclePlus, CircleMinus } from "lucide-react";
import "@/styles/img-preview.css";

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
            <Field>
                <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue, fontSize: "1.1rem" }}>Title</FieldLabel>
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
            <Field>
                <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue, fontSize: "1.1rem" }}>Description</FieldLabel>
                <FieldContent>
                    <textarea
                        className="neomorphic-textarea w-full overflow-hidden min-h-[90px]"
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
            <div className="grid grid-cols-[2fr_2fr_1fr] gap-6">
                {/* Prep Time */}
                <Field>
                    <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue, fontSize: "1.1rem" }}>Prep Time (min)</FieldLabel>
                    <FieldContent>
                        <div className="flex gap-3 items-center justify-center">
                            <button
                                type="button"
                                onClick={() => setPrepTimeMinutes(Math.max(0, (prepTimeMinutes ?? 0) - 1))}
                                className="p-2 hover:scale-110 transition-transform flex-shrink-0"
                            >
                                <CircleMinus className="w-5 h-5" />
                            </button>
                            <div className="flex-1 flex items-center">
                                <ElasticSlider
                                    defaultValue={prepTimeMinutes ?? 0}
                                    startingValue={0}
                                    maxValue={600}
                                    isStepped={true}
                                    stepSize={5}
                                    onChange={(val) => setPrepTimeMinutes(val)}
                                    leftIcon={<span />}
                                    rightIcon={<span />}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setPrepTimeMinutes(Math.min(600, (prepTimeMinutes ?? 0) + 1))}
                                className="p-2 hover:scale-110 transition-transform flex-shrink-0"
                            >
                                <CirclePlus className="w-5 h-5" />
                            </button>
                        </div>
                    </FieldContent>
                </Field>

                {/* Cook Time */}
                <Field>
                    <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue, fontSize: "1.1rem" }}>Cook Time (min)</FieldLabel>
                    <FieldContent>
                        <div className="flex gap-3 items-center justify-center">
                            <button
                                type="button"
                                onClick={() => setCookTimeMinutes(Math.max(0, (cookTimeMinutes ?? 0) - 1))}
                                className="p-2 hover:scale-110 transition-transform flex-shrink-0"
                            >
                                <CircleMinus className="w-5 h-5" />
                            </button>
                            <div className="flex-1 flex items-center">
                                <ElasticSlider
                                    defaultValue={cookTimeMinutes ?? 0}
                                    startingValue={0}
                                    maxValue={600}
                                    isStepped={true}
                                    stepSize={5}
                                    onChange={(val) => setCookTimeMinutes(val)}
                                    leftIcon={<span />}
                                    rightIcon={<span />}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setCookTimeMinutes(Math.min(600, (cookTimeMinutes ?? 0) + 1))}
                                className="p-2 hover:scale-110 transition-transform flex-shrink-0"
                            >
                                <CirclePlus className="w-5 h-5" />
                            </button>
                        </div>
                    </FieldContent>
                </Field>

                {/* Total Time */}
                <Field className="bg-slate-50 p-4 rounded-2xl shadow">
                    <FieldLabel className="font-semibold text-slate-600" style={{ fontSize: "1.1rem" }}>Total Time</FieldLabel>
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
                <Field>
                    <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue, fontSize: "1.1rem" }}>Servings</FieldLabel>
                    <FieldContent>
                        <div className="flex gap-3 items-center justify-center">
                            <button
                                type="button"
                                onClick={() => setServings(Math.max(1, (servings ?? 1) - 1))}
                                className="p-2 hover:scale-110 transition-transform flex-shrink-0"
                            >
                                <CircleMinus className="w-5 h-5" />
                            </button>
                            <div className="flex-1 flex items-center">
                                <ElasticSlider
                                    defaultValue={servings ?? 1}
                                    startingValue={1}
                                    maxValue={50}
                                    isStepped={true}
                                    stepSize={1}
                                    onChange={(val) => setServings(val)}
                                    leftIcon={<span />}
                                    rightIcon={<span />}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setServings(Math.min(50, (servings ?? 1) + 1))}
                                className="p-2 hover:scale-110 transition-transform flex-shrink-0"
                            >
                                <CirclePlus className="w-5 h-5" />
                            </button>
                        </div>
                    </FieldContent>
                </Field>

                {/* Difficulty */}
                <Field>
                    <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue, fontSize: "1.1rem" }}>Difficulty</FieldLabel>
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

            {/* Notes, Image URL + Preview */}
            <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-6 flex-1">
                    {/* Notes */}
                    <Field>
                        <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue, fontSize: "1.1rem" }}>Notes</FieldLabel>
                        <FieldContent>
                            <textarea
                                className="neomorphic-textarea w-full overflow-hidden min-h-[180px]"
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

                    {/* Image URL */}
                    <Field>
                        <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue, fontSize: "1.1rem" }}>Image URL</FieldLabel>
                        <FieldContent>
                            <textarea
                                className="neomorphic-textarea w-full overflow-hidden min-h-[90px]"
                                placeholder="https://example.com/pic.jpg"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                autoComplete="off"
                            />
                        </FieldContent>
                    </Field>
                </div>

                {/* Image Preview */}
                <div className="flex flex-col gap-2">
                    <div className="card mt-4">
                        <div className="tools">
                            <div className="circle">
                                <span className="red box"></span>
                            </div>
                            <div className="circle">
                                <span className="yellow box"></span>
                            </div>
                            <div className="circle">
                                <span className="green box"></span>
                            </div>
                        </div>
                        <div
                            style={{
                                height: "calc(100% - 80px)",
                                overflow: "hidden",
                                borderRadius: "12px",
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {imageUrl && imageUrl.trim() !== "" ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={imageUrl}
                                    alt="Recipe preview"
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        objectFit: "contain",
                                        borderRadius: "12px",
                                    }}
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src="/assets/img/placeholder.jpg"
                                    alt="Placeholder"
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        objectFit: "contain",
                                        borderRadius: "12px",
                                        opacity: 0.5,
                                    }}
                                />
                            )}
                        </div>
                        <div className="flex justify-center items-center mt-3 text-md text-gray-500 italic">
                            Recipe Thumbnail
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

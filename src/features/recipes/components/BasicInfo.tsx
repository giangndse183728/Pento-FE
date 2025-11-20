"use client";

import React from 'react';
import { Field, FieldLabel, FieldContent } from '@/components/ui/field';

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

export default function BasicInfo({ title, setTitle, description, setDescription, prepTimeMinutes, setPrepTimeMinutes, cookTimeMinutes, setCookTimeMinutes, servings, setServings, difficultyLevel, setDifficultyLevel, imageUrl, setImageUrl, notes, setNotes }: Props) {
    return (
        <>
            <Field>
                <FieldLabel>Title</FieldLabel>
                <FieldContent>
                    <input className="p-2 border rounded w-full" placeholder="Recipe title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </FieldContent>
            </Field>

            <Field>
                <FieldLabel>Description</FieldLabel>
                <FieldContent>
                    <input className="p-2 border rounded w-full" placeholder="Recipe description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </FieldContent>
            </Field>

            <Field>
                <FieldLabel>Prep Time (minutes)</FieldLabel>
                <FieldContent>
                    <input type="number" className="p-2 border rounded w-full" placeholder="Prep time" value={prepTimeMinutes} onChange={(e) => setPrepTimeMinutes(Number(e.target.value) || undefined)} />
                </FieldContent>
            </Field>

            <Field>
                <FieldLabel>Cook Time (minutes)</FieldLabel>
                <FieldContent>
                    <input type="number" className="p-2 border rounded w-full" placeholder="Cook time" value={cookTimeMinutes} onChange={(e) => setCookTimeMinutes(Number(e.target.value) || undefined)} />
                </FieldContent>
            </Field>

            <Field>
                <FieldLabel>Servings</FieldLabel>
                <FieldContent>
                    <input type="number" className="p-2 border rounded w-full" placeholder="Servings" value={servings} onChange={(e) => setServings(Number(e.target.value) || undefined)} />
                </FieldContent>
            </Field>

            <Field>
                <FieldLabel>Difficulty Level</FieldLabel>
                <FieldContent>
                    <select className="p-2 border rounded w-full" value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)}>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </FieldContent>
            </Field>

            <Field>
                <FieldLabel>Image URL</FieldLabel>
                <FieldContent>
                    <input className="p-2 border rounded w-full" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </FieldContent>
            </Field>

            <Field>
                <FieldLabel>Notes</FieldLabel>
                <FieldContent>
                    <textarea className="w-full p-2 border rounded" placeholder="Additional notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </FieldContent>
            </Field>
        </>
    );
}

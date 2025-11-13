"use client";

import React from 'react';

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
            <div className="grid grid-cols-2 gap-4 mb-4">
                <input className="p-2 border rounded" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input className="p-2 border rounded" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
                <input type="number" className="p-2 border rounded" placeholder="Prep minutes" value={prepTimeMinutes} onChange={(e) => setPrepTimeMinutes(Number(e.target.value) || undefined)} />
                <input type="number" className="p-2 border rounded" placeholder="Cook minutes" value={cookTimeMinutes} onChange={(e) => setCookTimeMinutes(Number(e.target.value) || undefined)} />
                <input type="number" className="p-2 border rounded" placeholder="Servings" value={servings} onChange={(e) => setServings(Number(e.target.value) || undefined)} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <select className="p-2 border rounded" value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <input className="p-2 border rounded" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>

            <div className="mb-4">
                <textarea className="w-full p-2 border rounded" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
        </>
    );
}

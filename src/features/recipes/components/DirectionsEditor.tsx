"use client";

import React from 'react';
import { DirectionInput } from '../services/recipesService';
import { Field, FieldLabel, FieldContent } from '@/components/ui/field';
import { ColorTheme } from '@/constants/color';

type Props = {
    directions: DirectionInput[];
    setDirections: (next: DirectionInput[] | ((prev: DirectionInput[]) => DirectionInput[])) => void;
};

export default function DirectionsEditor({ directions, setDirections }: Props) {
    return (
        <Field className="p-4 rounded-2xl shadow" style={{ background: ColorTheme.babyBlue }}>
            <FieldLabel className="font-semibold" style={{ color: ColorTheme.darkBlue }}>Directions</FieldLabel>
            <FieldContent>
                {directions.map((d, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-2 mb-2 items-center">
                        <input
                            type="number"
                            className="neomorphic-input"
                            value={d.stepNumber}
                            onChange={(e) => {
                                const v = Number(e.target.value) || 0;
                                setDirections((prev) => prev.map((p, i) => i === idx ? { ...p, stepNumber: v } : p));
                            }}
                        />
                        <input
                            className="neomorphic-input col-span-2"
                            placeholder="Step description"
                            value={d.description}
                            autoComplete="off"
                            onChange={(e) => {
                                const v = e.target.value;
                                setDirections((prev) => prev.map((p, i) => i === idx ? { ...p, description: v } : p));
                            }}
                        />
                        <input
                            className="neomorphic-input"
                            placeholder="Image URL"
                            value={d.imageUrl ?? ''}
                            autoComplete="off"
                            onChange={(e) => {
                                const v = e.target.value;
                                setDirections((prev) => prev.map((p, i) => i === idx ? { ...p, imageUrl: v } : p));
                            }}
                        />
                    </div>
                ))}
                <div className="flex gap-2">
                    <button type="button" className="px-4 py-2 rounded text-white transition hover:brightness-110" style={{ backgroundColor: ColorTheme.darkBlue }} onClick={() => setDirections((p) => [...p, { stepNumber: p.length + 1, description: '', imageUrl: '' }])}>Add step</button>
                    <button type="button" className="px-4 py-2 rounded border border-white hover:border-white transition" onClick={() => setDirections((p) => p.slice(0, -1))}>Remove last</button>
                </div>
            </FieldContent>
        </Field>
    );
}

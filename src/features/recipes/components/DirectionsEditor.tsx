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
                        <input type="number" className="p-3 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-xl" value={d.stepNumber} onChange={(e) => {
                            const v = Number(e.target.value) || 0;
                            setDirections((prev) => prev.map((p, i) => i === idx ? { ...p, stepNumber: v } : p));
                        }} />
                        <input className="p-3 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-xl col-span-2" placeholder="Step description" value={d.description} onChange={(e) => {
                            const v = e.target.value;
                            setDirections((prev) => prev.map((p, i) => i === idx ? { ...p, description: v } : p));
                        }} />
                        <input className="p-3 border border-white hover:border-white focus:border-white focus:ring-2 focus:ring-white focus:outline-none rounded-xl" placeholder="Image URL" value={d.imageUrl ?? ''} onChange={(e) => {
                            const v = e.target.value;
                            setDirections((prev) => prev.map((p, i) => i === idx ? { ...p, imageUrl: v } : p));
                        }} />
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

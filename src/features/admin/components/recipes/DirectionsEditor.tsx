"use client";

import React from 'react';
import { DirectionInput } from '../../services/recipesService';

type Props = {
    directions: DirectionInput[];
    setDirections: (next: DirectionInput[] | ((prev: DirectionInput[]) => DirectionInput[])) => void;
};

export default function DirectionsEditor({ directions, setDirections }: Props) {
    return (
        <div className="mb-4">
            <h3 className="font-semibold mb-2">Directions</h3>
            {directions.map((d, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-2 mb-2 items-center">
                    <input type="number" className="p-2 border rounded" value={d.stepNumber} onChange={(e) => {
                        const v = Number(e.target.value) || 0;
                        setDirections((prev) => prev.map((p, i) => i === idx ? { ...p, stepNumber: v } : p));
                    }} />
                    <input className="p-2 border rounded col-span-2" placeholder="Step description" value={d.description} onChange={(e) => {
                        const v = e.target.value;
                        setDirections((prev) => prev.map((p, i) => i === idx ? { ...p, description: v } : p));
                    }} />
                    <input className="p-2 border rounded" placeholder="Image URL" value={d.imageUrl ?? ''} onChange={(e) => {
                        const v = e.target.value;
                        setDirections((prev) => prev.map((p, i) => i === idx ? { ...p, imageUrl: v } : p));
                    }} />
                </div>
            ))}
            <div className="flex gap-2">
                <button type="button" className="px-3 py-1 border rounded" onClick={() => setDirections((p) => [...p, { stepNumber: p.length + 1, description: '', imageUrl: '' }])}>Add step</button>
                <button type="button" className="px-3 py-1 border rounded" onClick={() => setDirections((p) => p.slice(0, -1))}>Remove last</button>
            </div>
        </div>
    );
}

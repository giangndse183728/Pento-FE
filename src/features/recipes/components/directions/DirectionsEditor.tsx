"use client";

import React from 'react';
import { DirectionInput } from '../../services/recipesService';
import { FieldContent } from '@/components/ui/field';
import { CusButton } from '@/components/ui/cusButton';
import { Trash } from 'lucide-react';
import { ColorTheme } from '@/constants/color';
import "@/styles/img-preview.css";

type Props = {
    directions: DirectionInput[];
    setDirections: (next: DirectionInput[] | ((prev: DirectionInput[]) => DirectionInput[])) => void;
};

export default function DirectionsEditor({ directions, setDirections }: Props) {
    // Remove row handler
    const handleRemoveRow = (idx: number) => {
        setDirections((prev) => {
            if (prev.length <= 1) {
                return [{ stepNumber: 1, description: '', image: '' }];
            }
            return prev.filter((_, i) => i !== idx).map((d, i) => ({ ...d, stepNumber: i + 1 }));
        });
    };

    return (
        <FieldContent>
            <div className="space-y-8">
                {directions.map((d, idx) => (
                    <React.Fragment key={idx}>
                        <div className="flex flex-col gap-4 p-4 rounded-2xl">
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveRow(idx)}
                                    disabled={idx === 0}
                                    className="
                                    flex items-center gap-2
                                    px-3 py-2 rounded-full shrink-0 
                                    bg-red-50 hover:bg-red-100 
                                    text-red-500 hover:text-red-600 
                                    transition-colors
                                    disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                                    aria-label="Remove step"
                                >
                                    <Trash className="w-4 h-4" />
                                    <span className="text-xs font-medium">Remove step</span>
                                </button>
                            </div>
                            <div className="flex flex-row gap-4 items-start">
                                <div className="flex flex-col gap-4 flex-1">
                                    <div className="flex flex-row gap-2 items-center">
                                        <label className="font-semibold w-24" style={{ color: ColorTheme.darkBlue, fontSize: "1rem" }}>Step</label>
                                        <input
                                            type="number"
                                            className="neomorphic-input flex-1"
                                            value={d.stepNumber}
                                            min={1}
                                            onChange={(e) => {
                                                const v = Number(e.target.value) || 1;
                                                setDirections((prev) => prev.map((p, i) => i === idx ? { ...p, stepNumber: v } : p));
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-row gap-2 items-start">
                                        <label className="font-semibold w-24 pt-3" style={{ color: ColorTheme.darkBlue, fontSize: "1rem" }}>Description</label>
                                        <textarea
                                            className="neomorphic-textarea flex-1 overflow-hidden min-h-[250px]"
                                            placeholder="Step description"
                                            value={d.description}
                                            autoComplete="off"
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                setDirections((prev) => prev.map((p, i) => i === idx ? { ...p, description: v } : p));
                                            }}
                                            onInput={(e) => {
                                                const target = e.target as HTMLTextAreaElement;
                                                target.style.height = 'auto';
                                                target.style.height = target.scrollHeight + 'px';
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="card" style={{ width: '320px', height: '320px', margin: '0' }}>
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
                                            <input
                                                type="text"
                                                className="address-bar"
                                                placeholder="Image URL"
                                                value={d.image ?? ''}
                                                autoComplete="off"
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    setDirections((prev) => prev.map((p, i) => i === idx ? { ...p, image: v } : p));
                                                }}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                height: "calc(100% - 60px)",
                                                overflow: "hidden",
                                                borderRadius: "12px",
                                                position: "relative",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {d.image && d.image.trim() !== "" ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={d.image}
                                                    alt={`Step ${d.stepNumber} preview`}
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
                                    </div>
                                </div>
                            </div>
                        </div>
                        {idx < directions.length - 1 && (
                            <div className="border-t border-gray-300 my-4"></div>
                        )}
                    </React.Fragment>
                ))}
                <div className="flex gap-2 mt-8">
                    <CusButton
                        type="button"
                        variant="blueGray"
                        size="lg"
                        onClick={() => {
                            setDirections((p) => [...p, { stepNumber: p.length + 1, description: '', image: '' }]);
                        }}
                    >
                        Add step
                    </CusButton>
                </div>
            </div>
        </FieldContent>
    );
}

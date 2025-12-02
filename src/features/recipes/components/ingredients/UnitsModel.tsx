"use client";

import React from "react";
import { Unit } from "../services/recipesService";
import { WhiteCard } from "@/components/decoration/WhiteCard";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    units: Unit[] | undefined;
};

type GroupKey = "Count" | "Volume" | "Weight";

export default function UnitsModal({ isOpen, onClose, units }: Props) {
    if (!isOpen) return null;

    const grouped: Record<GroupKey, Unit[]> = {
        Count: units?.filter((u) => u.type === "Count") ?? [],
        Volume: units?.filter((u) => u.type === "Volume") ?? [],
        Weight: units?.filter((u) => u.type === "Weight") ?? [],
    };

    const baseUnits: Record<GroupKey, string> = {
        Count: "Base unit: 1 piece (pc)",
        Volume: "Base unit: millilitre (mL)",
        Weight: "Base unit: gram (g)",
    };

    const baseSymbols: Record<GroupKey, string> = {
        Count: "pieces",
        Volume: "mL",
        Weight: "g",
    };

    const groupOrder: GroupKey[] = ["Count", "Volume", "Weight"];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            <WhiteCard>
                <div
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    className="max-w-3xl w-11/12 max-h-96 overflow-auto"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg">Available Units</h3>
                        <button
                            type="button"
                            className="text-gray-500 hover:text-gray-700"
                            onClick={onClose}
                        >
                            ✕
                        </button>
                    </div>

                    {groupOrder.map((groupName) => {
                        const list = grouped[groupName];
                        return (
                            <div key={groupName} className="mb-6">
                                <h4 className="font-semibold text-base mb-1">{groupName}</h4>
                                <p className="text-xs text-gray-500 mb-2">{baseUnits[groupName]}</p>

                                <table className="w-full text-sm border-collapse mb-4">
                                    <thead>
                                        <tr className="border-b bg-gray-100">
                                            <th className="text-left p-2 w-1/4">Name</th>
                                            <th className="text-left p-2 w-1/4">Abbreviation</th>
                                            <th className="text-left p-2 w-1/2">Explanation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {list.map((u) => (
                                            <tr key={u.id} className="border-b hover:bg-blue-100">
                                                <td className="p-2 ">{u.name}</td>
                                                <td className="p-2">{u.abbreviation ?? "—"}</td>
                                                <td className="p-2">
                                                    {u.toBaseFactor !== 1
                                                        ? `1 ${u.name} = ${u.toBaseFactor} ${baseSymbols[groupName]}`
                                                        : `Base unit`}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        );
                    })}
                </div>
            </WhiteCard>
        </div>
    );
}

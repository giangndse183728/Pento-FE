"use client";

import React from 'react';
import { Unit } from '../../services/recipesService';
import { WhiteCard } from '@/components/decoration/WhiteCard';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    units: Unit[] | undefined;
};

export default function UnitsModal({ isOpen, onClose, units }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            <WhiteCard>
                <div onClick={(e: React.MouseEvent) => e.stopPropagation()} className="max-w-2xl w-11/12 max-h-96 overflow-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg">Available Units</h3>
                        <button type="button" className="text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
                    </div>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2">Name</th>
                                <th className="text-left p-2">Abbreviation</th>
                                <th className="text-left p-2">Explanation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {units?.map((u) => (
                                <tr key={u.id} className="border-b hover:bg-blue-100">
                                    <td className="p-2">{u.name}</td>
                                    <td className="p-2">{u.abbreviation ?? '—'}</td>
                                    <td className="p-2">
                                        {u.toBaseFactor && u.toBaseFactor !== 1 ? `1 ${u.name} = ${u.toBaseFactor} base units` : ''}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </WhiteCard>
        </div>
    );
}

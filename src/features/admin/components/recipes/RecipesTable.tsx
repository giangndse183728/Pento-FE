"use client";

import React from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { RecipeSummary } from '../../services/recipesService';

type Props = {
    list: UseQueryResult<RecipeSummary[], unknown>;
};

export default function RecipesTable({ list }: Props) {
    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recipes</h2>

            {list.isLoading && <div>Loading recipes...</div>}
            {list.isError && <div className="text-red-600">Failed to load recipes.</div>}

            <div className="overflow-auto bg-white rounded border">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Servings</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Visibility</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {(list.data ?? []).map((r) => (
                            <tr key={r.id}>
                                <td className="px-4 py-2 align-top">
                                    {r.imageUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={r.imageUrl} alt={r.title} className="w-16 h-12 object-cover rounded" />
                                    ) : (
                                        <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">No image</div>
                                    )}
                                </td>
                                <td className="px-4 py-2 align-top">{r.title}</td>
                                <td className="px-4 py-2 align-top text-sm text-gray-600">{r.description}</td>
                                <td className="px-4 py-2 align-top">{r.totalTimes ?? '—'}</td>
                                <td className="px-4 py-2 align-top">{r.servings ?? '—'}</td>
                                <td className="px-4 py-2 align-top">{r.difficultyLevel ?? '—'}</td>
                                <td className="px-4 py-2 align-top">{r.createdBy ?? '—'}</td>
                                <td className="px-4 py-2 align-top">{r.isPublic ? 'Public' : 'Private'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

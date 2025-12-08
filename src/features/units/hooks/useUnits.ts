"use client";

import { useQuery } from '@tanstack/react-query';
import { getUnits } from '../services/unitService';
import type { Unit } from '../schema/unitSchema';

export function useUnits() {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['units'],
        queryFn: getUnits,
        staleTime: 1000 * 60 * 10, // 10 minutes - units rarely change
    });

    return {
        units: data || [],
        loading: isLoading,
        error,
        refetch,
    };
}

// Re-export the Unit type for convenience
export type { Unit } from '../schema/unitSchema';

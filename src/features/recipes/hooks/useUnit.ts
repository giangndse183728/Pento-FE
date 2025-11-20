"use client";

import { useQuery } from '@tanstack/react-query';
import { getUnits, Unit } from '../services/recipesService';

export const useUnits = () => {
    type AxiosLike = { response?: { status?: number } };
    return useQuery<Unit[]>({
        queryKey: ['units'],
        queryFn: getUnits,
        staleTime: 1000 * 60 * 10,
        // If the API returns a 4xx (bad request), don't retry automatically.
        retry: (failureCount: number, error: unknown) => {
            const status = (error as AxiosLike)?.response?.status;
            return typeof status === 'number' && status >= 500;
        },
    });
};

export default useUnits;

import { apiRequest } from '@/lib/apiRequest';
import type { Unit } from '../schema/unitSchema';

export const getUnits = async (): Promise<Unit[]> => {
    try {
        return await apiRequest<Unit[]>('get', '/units');
    } catch (err) {
        return [];
    }
};

// Re-export the Unit type for convenience
export type { Unit } from '../schema/unitSchema';

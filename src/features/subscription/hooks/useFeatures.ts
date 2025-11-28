import { useQuery } from '@tanstack/react-query';
import { FeatureDefinition, getFeatures } from '../services/subscriptionService';

type UseFeaturesOptions = {
    enabled?: boolean;
};

export const useFeatures = (options?: UseFeaturesOptions) => {
    return useQuery<FeatureDefinition[]>({
        queryKey: ['features'],
        queryFn: getFeatures,
        staleTime: 1000 * 60 * 5,
        enabled: options?.enabled ?? true,
    });
};

export default useFeatures;


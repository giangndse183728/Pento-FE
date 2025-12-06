'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    addSubscriptionFeature,
    addSubscriptionPlan,
    createSubscription,
    CreateSubscriptionFeaturePayload,
    CreateSubscriptionPayload,
    CreateSubscriptionPlanPayload,
    getSubscriptionById,
    getSubscriptions,
    Subscription,
    SubscriptionFeature,
    SubscriptionPlan,
} from '../services/subscriptionService';

type PlanMutationVariables = {
    subscriptionId: string;
    payload: CreateSubscriptionPlanPayload;
};

type FeatureMutationVariables = {
    subscriptionId: string;
    payload: CreateSubscriptionFeaturePayload;
};

const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
        return error.message;
    }
    return 'Something went wrong. Please try again.';
};

export const useSubscription = () => {
    const queryClient = useQueryClient();
    const subscriptions = useQuery({
        queryKey: ['subscriptions'],
        queryFn: getSubscriptions,
        staleTime: 1000 * 60 * 5,
    });

    const createSubscriptionMutation = useMutation<Subscription, unknown, CreateSubscriptionPayload>({
        mutationFn: createSubscription,
        onSuccess: () => {
            toast.success('Subscription created');
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    const addPlanMutation = useMutation<SubscriptionPlan, unknown, PlanMutationVariables>({
        mutationFn: ({ subscriptionId, payload }) => addSubscriptionPlan(subscriptionId, payload),
        onSuccess: () => {
            toast.success('Plan added to subscription');
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    const addFeatureMutation = useMutation<SubscriptionFeature, unknown, FeatureMutationVariables>({
        mutationFn: ({ subscriptionId, payload }) => addSubscriptionFeature(subscriptionId, payload),
        onSuccess: () => {
            toast.success('Feature added to subscription');
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    return {
        createSubscription: createSubscriptionMutation,
        addSubscriptionPlan: addPlanMutation,
        addSubscriptionFeature: addFeatureMutation,
        subscriptions,
    };
};

export default useSubscription;

export const useSubscriptionById = (subscriptionId: string | null | undefined) => {
    return useQuery({
        queryKey: ['subscription', subscriptionId],
        queryFn: () => getSubscriptionById(subscriptionId!),
        enabled: !!subscriptionId,
        staleTime: 1000 * 60 * 5,
    });
};

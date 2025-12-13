'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminLayout from '@/features/admin/components/AdminLayout';
import { useSubscription } from '../hooks/useSubscription';
import { useFeatures } from '../hooks/useFeatures';
import { toast } from 'sonner';
import CreateSubscriptionStep from './CreateSubscriptionStep';
import AddPlansStep from './plans/AddPlansStep';
import AddFeaturesStep from './features/AddFeaturesStep';
import SubscriptionList from './SubscriptionList';
import { createSubscriptionSchema, subscriptionPlanSchema, subscriptionFeatureSchema } from '../schema/subscriptionSchema';
import '@/styles/tab-bar.css';


const createInitialSubscriptionForm = (): typeof createSubscriptionSchema._type => ({
    name: '',
    description: '',
    isActive: true,
});

const createInitialPlanForm = (): typeof subscriptionPlanSchema._type => ({
    id: '',
    subscriptionId: '',
    amount: 5000,
    currency: 'VND',
    durationInDays: 7,
    createdOnUtc: null,
    updatedOnUtc: null,
});

const createInitialFeatureForm = (): Pick<typeof subscriptionFeatureSchema._type, 'subscriptionId'> => ({
    subscriptionId: '',
});

const createFeatureRow = (): Omit<typeof subscriptionFeatureSchema._type, 'subscriptionId'> & { id: string } => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    featureCode: '',
    entitlementQuota: 4,
    entitlementResetPer: undefined,
    // id, featureCode, entitlementQuota, entitlementResetPer
    // createdOnUtc, updatedOnUtc are omitted for new rows
});

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const inputClass = 'neomorphic-input w-full';
const textareaClass = 'neomorphic-textarea w-full min-h-[96px]';
const selectClass = 'neomorphic-select w-full';

export default function SubscriptionsManager() {
    const pathname = usePathname();
    const [mountKey, setMountKey] = useState(0);
    const [currentStep, setCurrentStep] = useState<'create-subscription' | 'add-plans' | 'add-features' | 'list'>('create-subscription');

    const { createSubscription, addSubscriptionPlan, addSubscriptionFeature, subscriptions } = useSubscription();
    const { data: features, isLoading: featuresLoading, isFetching: featuresFetching } = useFeatures({
        enabled: currentStep === 'add-features',
    });
    const featuresAreLoading = featuresLoading || featuresFetching;

    const [subscriptionForm, setSubscriptionForm] = useState<typeof createSubscriptionSchema._type>(createInitialSubscriptionForm);
    const [planForm, setPlanForm] = useState<typeof subscriptionPlanSchema._type>(createInitialPlanForm);
    const [featureForm, setFeatureForm] = useState<Pick<typeof subscriptionFeatureSchema._type, 'subscriptionId'>>(createInitialFeatureForm);
    const [featureRows, setFeatureRows] = useState<Array<Omit<typeof subscriptionFeatureSchema._type, 'subscriptionId'> & { id: string }>>([createFeatureRow()]);
    const [activeFeatureRow, setActiveFeatureRow] = useState<number | null>(0);
    const [featureSearchInput, setFeatureSearchInput] = useState('');
    const [featureSearch, setFeatureSearch] = useState('');

    const subscriptionsList = subscriptions.data ?? [];
    const subscriptionsLoading = subscriptions.isLoading || subscriptions.isFetching;
    const resolveSubscriptionId = (sub: (typeof subscriptionsList)[number]) => sub.id ?? sub.subscriptionId ?? '';
    const selectedPlanSubscription = subscriptionsList.find((sub) => resolveSubscriptionId(sub) === planForm.subscriptionId);
    const selectedFeatureSubscription = subscriptionsList.find((sub) => resolveSubscriptionId(sub) === featureForm.subscriptionId);

    // Refetch subscriptions when component mounts or when switching to list tab
    useEffect(() => {
        subscriptions.refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reset component state when navigating back to this page
    useEffect(() => {
        // Increment mount key to force remount of child components
        setMountKey((prev) => prev + 1);

        // Reset all state when pathname changes (user navigated away and back)
        setSubscriptionForm(createInitialSubscriptionForm());
        setPlanForm(createInitialPlanForm());
        setFeatureForm(createInitialFeatureForm());
        setFeatureRows([createFeatureRow()]);
        setActiveFeatureRow(0);
        setFeatureSearchInput('');
        setFeatureSearch('');
        subscriptions.refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    // Also reset on visibility change (when user comes back to tab/window)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && pathname === '/admin/subscriptions') {
                setMountKey((prev) => prev + 1);
                subscriptions.refetch();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    useEffect(() => {
        if (currentStep === 'list') {
            subscriptions.refetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep]);

    const updateSubscriptionForm = (patch: Partial<typeof createSubscriptionSchema._type>) => {
        setSubscriptionForm((prev) => ({ ...prev, ...patch }));
    };

    const selectPlanSubscription = (id: string) => {
        setPlanForm((prev) => ({ ...prev, subscriptionId: id }));
    };

    const handlePlanAmountChange = (value: number) => {
        setPlanForm((prev) => ({ ...prev, amount: clamp(Math.round(value), 0, 1000000) }));
    };

    const adjustPlanAmount = (delta: number) => {
        setPlanForm((prev) => ({ ...prev, amount: clamp(prev.amount + delta, 0, 1000000) }));
    };


    const handlePlanDurationChange = (value: number) => {
        setPlanForm((prev) => ({ ...prev, durationInDays: clamp(Math.round(value), 1, 365) }));
    };

    const adjustPlanDuration = (delta: number) => {
        setPlanForm((prev) => ({ ...prev, durationInDays: clamp(prev.durationInDays + delta, 1, 365) }));
    };

    const selectFeatureSubscription = (id: string) => {
        setFeatureForm((prev) => ({ ...prev, subscriptionId: id }));
    };

    const filteredFeatures = useMemo(() => {
        if (!features || features.length === 0) return [];
        if (!featureSearch.trim()) return features;
        const needle = featureSearch.trim().toLowerCase();
        return features.filter(
            (feature) =>
                feature.featureCode.toLowerCase().includes(needle) ||
                feature.name.toLowerCase().includes(needle) ||
                feature.description?.toLowerCase().includes(needle),
        );
    }, [features, featureSearch]);

    const handlePlanSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!planForm.subscriptionId.trim()) {
            toast.error('Select a subscription first');
            return;
        }

        addSubscriptionPlan.mutate(
            {
                subscriptionId: planForm.subscriptionId.trim(),
                payload: {
                    amount: planForm.amount,
                    currency: planForm.currency,
                    ...(planForm.durationInDays !== 366 && { durationInDays: planForm.durationInDays }),
                },
            },
            {
                onSuccess: () => setPlanForm((prev) => ({
                    ...createInitialPlanForm(),
                    subscriptionId: prev.subscriptionId,
                })),
            }
        );
    };

    const handleFeatureSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!featureForm.subscriptionId.trim()) {
            toast.error('Select a subscription first');
            return;
        }

        const rowsToSubmit = featureRows.filter((row) => row.featureCode.trim());
        if (rowsToSubmit.length === 0) {
            toast.error('Add at least one feature');
            return;
        }

        // Validate: if reset period is chosen (not "No Reset"), quota must be >0 and <101 (not Unlimited)
        const invalidRows = rowsToSubmit.filter(row =>
            row.entitlementResetPer && (row.entitlementQuota === 0 || row.entitlementQuota === 101)
        );
        if (invalidRows.length > 0) {
            toast.error('When a reset period is set, quota must be between 1-100 (not 0 or Unlimited)');
            return;
        }

        try {
            for (const row of rowsToSubmit) {
                // If quota is 101 (Unlimited in UI), send 0 to backend (which means unlocked/unlimited)
                // Don't send reset period for unlimited features
                if (row.entitlementQuota === 101) {
                    await addSubscriptionFeature.mutateAsync({
                        subscriptionId: featureForm.subscriptionId.trim(),
                        payload: {
                            featureCode: row.featureCode.trim(),
                            quota: 0,
                        },
                    });
                } else {
                    // For quota 1-100, send the actual quota and optional reset period
                    await addSubscriptionFeature.mutateAsync({
                        subscriptionId: featureForm.subscriptionId.trim(),
                        payload: {
                            featureCode: row.featureCode.trim(),
                            quota: row.entitlementQuota,
                            ...(row.entitlementResetPer && { resetPeriod: row.entitlementResetPer }),
                        },
                    });
                }
            }
            toast.success(rowsToSubmit.length > 1 ? 'Features added' : 'Feature added');
            setFeatureRows([createFeatureRow()]);
            setFeatureForm((prev) => ({
                ...createInitialFeatureForm(),
                subscriptionId: prev.subscriptionId,
            }));
            setActiveFeatureRow(0);
        } catch (error) {
            console.error('Failed to add features', error);
            // Handle API error response
            const err = error as { response?: { data?: { detail?: string; title?: string } }; message?: string };
            const errorMessage = err?.response?.data?.detail ||
                err?.response?.data?.title ||
                err?.message ||
                'Failed to add features';
            toast.error(errorMessage);
        }
    };

    const updateFeatureRow = (index: number, patch: Partial<Omit<typeof subscriptionFeatureSchema._type, 'subscriptionId'> & { id: string }>) => {
        setFeatureRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
    };

    const handleRemoveFeatureRow = (index: number) => {
        setFeatureRows((prev) => {
            if (prev.length === 1) return prev;
            const next = prev.filter((_, i) => i !== index);
            if (activeFeatureRow !== null) {
                if (index === activeFeatureRow) {
                    setActiveFeatureRow(next.length ? Math.max(0, index - 1) : null);
                } else if (index < activeFeatureRow) {
                    setActiveFeatureRow((prevActive) => (prevActive !== null ? prevActive - 1 : prevActive));
                }
            }
            return next;
        });
    };

    const handleAddFeatureRow = () => {
        setFeatureRows((prev) => {
            const next = [...prev, createFeatureRow()];
            setActiveFeatureRow(next.length - 1);
            return next;
        });
    };

    const handleFeatureSearch = () => {
        setFeatureSearch(featureSearchInput.trim());
    };

    const applyFeatureCodeFromCatalog = (featureCode: string) => {
        if (!featureForm.subscriptionId) {
            toast.error('Select a subscription first');
            return;
        }
        setFeatureRows((prev) => {
            const clone = [...prev];
            if (activeFeatureRow !== null && activeFeatureRow < clone.length) {
                clone[activeFeatureRow] = { ...clone[activeFeatureRow], featureCode };
                return clone;
            }

            const emptyIndex = clone.findIndex((row) => !row.featureCode);
            if (emptyIndex !== -1) {
                clone[emptyIndex] = { ...clone[emptyIndex], featureCode };
                setActiveFeatureRow(emptyIndex);
                return clone;
            }

            const newRow = createFeatureRow();
            newRow.featureCode = featureCode;
            setActiveFeatureRow(clone.length);
            return [...clone, newRow];
        });
    };

    const handleSubscriptionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subscriptionForm.name.trim()) {
            toast.error('Subscription name is required');
            return;
        }
        if (!subscriptionForm.description.trim()) {
            toast.error('Description is required');
            return;
        }

        createSubscription.mutate(
            {
                name: subscriptionForm.name,
                description: subscriptionForm.description,
                isActive: subscriptionForm.isActive,
            },
            {
                onSuccess: (created) => {
                    setSubscriptionForm(createInitialSubscriptionForm());
                    const newId = created?.id ?? created?.subscriptionId ?? '';
                    if (newId) {
                        setPlanForm((prev) => ({ ...prev, subscriptionId: newId }));
                        setFeatureForm((prev) => ({ ...prev, subscriptionId: newId }));
                    }
                    setCurrentStep('add-plans');
                },
            }
        );
    };

    return (
        <AdminLayout>
            <div className="w-full space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-semibold" style={{ color: '#113F67' }}>Subscription Manager</h1>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex justify-start">
                    <div className="segmented">
                        <label className="segmented-button">
                            <input
                                type="radio"
                                name="subscription-tab"
                                checked={currentStep === 'create-subscription'}
                                onChange={() => setCurrentStep('create-subscription')}
                            />
                            Create Subscription
                        </label>
                        <label className="segmented-button">
                            <input
                                type="radio"
                                name="subscription-tab"
                                checked={currentStep === 'add-plans'}
                                onChange={() => setCurrentStep('add-plans')}
                            />
                            Add Plans
                        </label>
                        <label className="segmented-button">
                            <input
                                type="radio"
                                name="subscription-tab"
                                checked={currentStep === 'add-features'}
                                onChange={() => setCurrentStep('add-features')}
                            />
                            Add Features
                        </label>
                        <label className="segmented-button">
                            <input
                                type="radio"
                                name="subscription-tab"
                                checked={currentStep === 'list'}
                                onChange={() => setCurrentStep('list')}
                            />
                            Subscriptions List
                        </label>
                    </div>
                </div>

                {/* Create Subscription Tab */}
                {currentStep === 'create-subscription' && (
                    <CreateSubscriptionStep
                        key={`create-${mountKey}`}
                        form={subscriptionForm}
                        inputClass={inputClass}
                        textareaClass={textareaClass}
                        onChange={updateSubscriptionForm}
                        onSubmit={handleSubscriptionSubmit}
                        isSubmitting={createSubscription.isPending}
                    />
                )}

                {/* Add Plans Tab */}
                {currentStep === 'add-plans' && (
                    <AddPlansStep
                        key={`plans-${mountKey}`}
                        form={planForm}
                        inputClass={inputClass}
                        subscriptions={subscriptionsList}
                        subscriptionsLoading={subscriptionsLoading}
                        selectedSubscription={selectedPlanSubscription}
                        resolveSubscriptionId={resolveSubscriptionId}
                        onSelectSubscription={selectPlanSubscription}
                        onAmountChange={handlePlanAmountChange}
                        onAmountAdjust={adjustPlanAmount}
                        onDurationChange={handlePlanDurationChange}
                        onDurationAdjust={adjustPlanDuration}
                        onSubmit={handlePlanSubmit}
                        isSubmitting={addSubscriptionPlan.isPending}
                    />
                )}

                {/* Add Features Tab */}
                {currentStep === 'add-features' && (
                    <AddFeaturesStep
                        key={`features-${mountKey}`}
                        form={featureForm}
                        selectClass={selectClass}
                        subscriptions={subscriptions.data || []}
                        subscriptionsLoading={subscriptions.isLoading}
                        selectedSubscription={selectedFeatureSubscription}
                        resolveSubscriptionId={resolveSubscriptionId}
                        onSelectSubscription={selectFeatureSubscription}
                        featureRows={featureRows}
                        activeFeatureRow={activeFeatureRow}
                        onSetActiveRow={setActiveFeatureRow}
                        onFeatureRowChange={updateFeatureRow}
                        onRemoveFeatureRow={handleRemoveFeatureRow}
                        onAddFeatureRow={handleAddFeatureRow}
                        onSubmit={handleFeatureSubmit}
                        isSubmitting={addSubscriptionFeature.isPending}
                        featureSearchInput={featureSearchInput}
                        onFeatureSearchInputChange={setFeatureSearchInput}
                        onFeatureSearch={handleFeatureSearch}
                        filteredFeatures={filteredFeatures}
                        featuresAreLoading={featuresAreLoading}
                        onUseFeatureFromCatalog={applyFeatureCodeFromCatalog}
                    />
                )}

                {/* Subscriptions List Tab */}
                {currentStep === 'list' && (
                    <div className="space-y-6">
                        <SubscriptionList
                            subscriptions={subscriptionsList}
                            loading={subscriptionsLoading}
                            onDeleted={() => subscriptions.refetch()}
                        />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}


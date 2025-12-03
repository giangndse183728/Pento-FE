'use client';

import React, { useMemo, useState } from 'react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import Stepper, { Step } from '@/components/decoration/Stepper';
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
    entitlementResetPer: 'Day',
    // id, featureCode, entitlementQuota, entitlementResetPer
    // createdOnUtc, updatedOnUtc are omitted for new rows
});

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const inputClass = 'neomorphic-input w-full';
const textareaClass = 'neomorphic-textarea w-full min-h-[96px]';
const selectClass = 'neomorphic-select w-full';

export default function SubscriptionsManager() {
    const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
    const [currentStep, setCurrentStep] = useState(1);

    const { createSubscription, addSubscriptionPlan, addSubscriptionFeature, subscriptions } = useSubscription();
    const { data: features, isLoading: featuresLoading, isFetching: featuresFetching } = useFeatures({
        enabled: currentStep >= 3,
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

    const updateSubscriptionForm = (patch: Partial<typeof createSubscriptionSchema._type>) => {
        setSubscriptionForm((prev) => ({ ...prev, ...patch }));
    };

    const selectPlanSubscription = (id: string) => {
        setPlanForm((prev) => ({ ...prev, subscriptionId: id }));
    };

    const handlePlanAmountChange = (value: number) => {
        setPlanForm((prev) => ({ ...prev, amount: clamp(Math.round(value), 0, 100000) }));
    };

    const adjustPlanAmount = (delta: number) => {
        setPlanForm((prev) => ({ ...prev, amount: clamp(prev.amount + delta, 0, 100000) }));
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

        // Validate that quota is set when reset period is chosen
        const invalidRows = rowsToSubmit.filter(row => row.entitlementResetPer && row.entitlementQuota === 0);
        if (invalidRows.length > 0) {
            toast.error('Quota must be greater than 0 when a reset period is set');
            return;
        }

        try {
            for (const row of rowsToSubmit) {
                await addSubscriptionFeature.mutateAsync({
                    subscriptionId: featureForm.subscriptionId.trim(),
                    payload: {
                        featureCode: row.featureCode.trim(),
                        entitlementQuota: row.entitlementQuota,
                        ...(row.entitlementResetPer && { entitlementResetPer: row.entitlementResetPer }),
                    },
                });
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
                    setCurrentStep(2);
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
                                checked={activeTab === 'create'}
                                onChange={() => setActiveTab('create')}
                            />
                            Create Subscription
                        </label>
                        <label className="segmented-button">
                            <input
                                type="radio"
                                name="subscription-tab"
                                checked={activeTab === 'list'}
                                onChange={() => setActiveTab('list')}
                            />
                            Subscriptions List
                        </label>
                    </div>
                </div>

                {/* Create Subscription Tab */}
                {activeTab === 'create' && (
                    <Stepper
                        initialStep={currentStep}
                        stepCircleContainerClassName="w-full"
                        contentClassName="w-full"
                        footerClassName="w-full"
                        backButtonText="Previous"
                        nextButtonText="Next step"
                        onStepChange={(step) => setCurrentStep(step)}
                    >
                        <Step>
                            <CreateSubscriptionStep
                                form={subscriptionForm}
                                inputClass={inputClass}
                                textareaClass={textareaClass}
                                onChange={updateSubscriptionForm}
                                onSubmit={handleSubscriptionSubmit}
                                isSubmitting={createSubscription.isPending}
                            />
                        </Step>

                        <Step>
                            <AddPlansStep
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
                        </Step>

                        <Step>
                            <AddFeaturesStep
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
                        </Step>
                    </Stepper>
                )}

                {/* Subscriptions List Tab */}
                {activeTab === 'list' && (
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


'use client';

import React, { useMemo, useState } from 'react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { CusButton } from '@/components/ui/cusButton';
import ElasticSlider from '@/components/decoration/ElasticSlider';
import Stepper, { Step } from '@/components/decoration/Stepper';
import { useSubscription } from '../hooks/useSubscription';
import { useFeatures } from '../hooks/useFeatures';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { CircleMinus, CirclePlus } from 'lucide-react';

const createInitialSubscriptionForm = () => ({
    name: '',
    description: '',
    isActive: true,
});

const createInitialPlanForm = () => ({
    subscriptionId: '',
    amount: 5000,
    currency: 'VND',
    durationInDays: 7,
});

const createInitialFeatureForm = () => ({
    subscriptionId: '',
});

const createFeatureRow = () => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    featureCode: '',
    entitlementQuota: 4,
    entitlementResetPer: 'Day' as 'Day' | 'Week' | 'Month' | 'Year',
});

const inputClass = 'neomorphic-input w-full';
const textareaClass = 'neomorphic-textarea w-full min-h-[96px]';
const selectClass = 'neomorphic-select w-full';

export default function SubscriptionsManager() {
    const [currentStep, setCurrentStep] = useState(1);
    const [stepperVersion, setStepperVersion] = useState(0);
    const goToStep = (step: number) => {
        setCurrentStep(step);
        setStepperVersion((prev) => prev + 1);
    };

    const { createSubscription, addSubscriptionPlan, addSubscriptionFeature, subscriptions } = useSubscription();
    const { data: features, isLoading: featuresLoading, isFetching: featuresFetching } = useFeatures({
        enabled: currentStep >= 3,
    });
    const featuresAreLoading = featuresLoading || featuresFetching;

    const [subscriptionForm, setSubscriptionForm] = useState(createInitialSubscriptionForm);
    const [planForm, setPlanForm] = useState(createInitialPlanForm);
    const [featureForm, setFeatureForm] = useState(createInitialFeatureForm);
    const [featureRows, setFeatureRows] = useState([createFeatureRow()]);
    const [activeFeatureRow, setActiveFeatureRow] = useState<number | null>(0);
    const [featureSearchInput, setFeatureSearchInput] = useState('');
    const [featureSearch, setFeatureSearch] = useState('');

    const subscriptionsList = subscriptions.data ?? [];
    const subscriptionsLoading = subscriptions.isLoading || subscriptions.isFetching;
    const resolveSubscriptionId = (sub: (typeof subscriptionsList)[number]) => sub.id ?? sub.subscriptionId ?? '';
    const selectedPlanSubscription = subscriptionsList.find((sub) => resolveSubscriptionId(sub) === planForm.subscriptionId);
    const selectedFeatureSubscription = subscriptionsList.find((sub) => resolveSubscriptionId(sub) === featureForm.subscriptionId);

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

    const updateFeatureRow = (index: number, patch: Partial<ReturnType<typeof createFeatureRow>>) => {
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
                    goToStep(2);
                },
            }
        );
    };

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
                    durationInDays: planForm.durationInDays,
                },
            },
            {
                onSuccess: () => setPlanForm(createInitialPlanForm()),
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

        try {
            for (const row of rowsToSubmit) {
                await addSubscriptionFeature.mutateAsync({
                    subscriptionId: featureForm.subscriptionId.trim(),
                    payload: {
                        featureCode: row.featureCode.trim(),
                        entitlementQuota: row.entitlementQuota,
                        entitlementResetPer: row.entitlementResetPer,
                    },
                });
            }
            toast.success(rowsToSubmit.length > 1 ? 'Features added' : 'Feature added');
            setFeatureRows([createFeatureRow()]);
            setFeatureForm(createInitialFeatureForm());
            setActiveFeatureRow(0);
        } catch (error) {
            console.error('Failed to add features', error);
        }
    };

    return (
        <AdminLayout>
            <div className="w-full space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <p className="text-sm uppercase tracking-[0.35rem] text-gray-500">Admin</p>
                        <h1 className="text-3xl font-semibold text-gray-900">Subscription Console</h1>
                        <p className="text-gray-600 mt-2">Manage subscription offerings, billing plans, and gated features.</p>
                    </div>
                </div>

                <Stepper
                    key={stepperVersion}
                    initialStep={currentStep}
                    stepCircleContainerClassName="w-full max-w-5xl"
                    contentClassName="w-full max-w-5xl"
                    footerClassName="w-full max-w-5xl"
                    backButtonText="Previous"
                    nextButtonText="Next step"
                    onStepChange={(step) => setCurrentStep(step)}
                >
                    <Step>
                        <WhiteCard className="w-full" width="100%" height="auto">
                            <form className="space-y-5" onSubmit={handleSubscriptionSubmit}>
                                <div className="flex items-center gap-3">
                                    <div className="h-7 w-7 rounded-full text-white grid place-items-center text-sm font-semibold" style={{ backgroundColor: '#769FCD' }}>
                                        1
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">Create Subscription</h2>
                                        <p className="text-sm text-gray-500">Define the base subscription shell.</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 text-sm">
                                    <label htmlFor="subscription-active" className="font-medium text-gray-700">
                                        Active
                                    </label>
                                    <input
                                        id="subscription-active"
                                        type="checkbox"
                                        checked={subscriptionForm.isActive}
                                        onChange={(e) =>
                                            setSubscriptionForm((prev) => ({
                                                ...prev,
                                                isActive: e.target.checked,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="grid gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            className={inputClass}
                                            placeholder="Premium Meal Plan"
                                            value={subscriptionForm.name}
                                            onChange={(e) =>
                                                setSubscriptionForm((prev) => ({ ...prev, name: e.target.value }))
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            className={textareaClass}
                                            placeholder="Describe what is included with this subscription..."
                                            value={subscriptionForm.description}
                                            onChange={(e) =>
                                                setSubscriptionForm((prev) => ({ ...prev, description: e.target.value }))
                                            }
                                        />
                                    </div>
                                </div>

                                <CusButton type="submit" disabled={createSubscription.isPending}>
                                    {createSubscription.isPending ? 'Saving...' : 'Create Subscription'}
                                </CusButton>
                            </form>
                        </WhiteCard>
                    </Step>

                    <Step>
                        <WhiteCard className="w-full h-full" width="100%" height="auto">
                            <form className="space-y-5" onSubmit={handlePlanSubmit}>
                                <div className="flex items-center gap-3">
                                    <div className="h-7 w-7 rounded-full text-white grid place-items-center text-sm font-semibold" style={{ backgroundColor: '#769FCD' }}>
                                        2
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">Add Plans</h2>
                                        <p className="text-sm text-gray-500">Attach pricing to a subscription.</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Choose a subscription</span>
                                        {selectedPlanSubscription && (
                                            <span className="text-xs text-gray-500">
                                                Selected: {selectedPlanSubscription.name}
                                            </span>
                                        )}
                                    </div>
                                    {subscriptionsLoading ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {Array.from({ length: 2 }).map((_, idx) => (
                                                <Skeleton key={`plan-sub-skel-${idx}`} className="h-28 w-full rounded-2xl" />
                                            ))}
                                        </div>
                                    ) : subscriptionsList.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {subscriptionsList.map((sub) => {
                                                const subId = resolveSubscriptionId(sub);
                                                if (!subId) return null;
                                                const isSelected = planForm.subscriptionId === subId;
                                                return (
                                                    <button
                                                        type="button"
                                                        key={subId}
                                                        className={`text-left rounded-2xl border bg-white/80 p-4 shadow-sm transition-colors ${isSelected ? 'border-blue-400 ring-1 ring-blue-300' : 'border-white/60 hover:border-blue-200'}`}
                                                        onClick={() => setPlanForm((prev) => ({ ...prev, subscriptionId: subId }))}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="text-base font-semibold text-gray-900">{sub.name}</h4>
                                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${sub.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                                {sub.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600">{sub.description ?? 'No description provided.'}</p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-white/60 bg-white/40 p-4 text-center text-sm text-gray-500">
                                            No subscriptions available. Create one in Step 1 first.
                                        </div>
                                    )}
                                </div>

                                <div className="grid gap-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                                                <span>Amount</span>

                                            </label>
                                            <div className={!planForm.subscriptionId ? 'pointer-events-none opacity-40' : ''}>
                                                <div className="mt-2 flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        disabled={!planForm.subscriptionId}
                                                        onClick={() => {
                                                            if (!planForm.subscriptionId) return;
                                                            setPlanForm((prev) => ({ ...prev, amount: Math.max(0, prev.amount - 500) }));
                                                        }}
                                                    >
                                                        <CircleMinus className="w-5 h-5" />
                                                    </button>
                                                    <div className="flex-1 flex items-center">
                                                        <ElasticSlider
                                                            defaultValue={planForm.amount}
                                                            startingValue={0}
                                                            maxValue={100000}
                                                            isStepped
                                                            stepSize={500}
                                                            leftIcon={<span />}
                                                            rightIcon={<span />}
                                                            valueSuffix={` ${planForm.currency}`}
                                                            valueFormatter={(val) => val.toLocaleString()}
                                                            onChange={(value) => {
                                                                if (!planForm.subscriptionId) return;
                                                                setPlanForm((prev) => ({ ...prev, amount: Math.max(0, Math.round(value)) }));
                                                            }}
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        disabled={!planForm.subscriptionId}
                                                        onClick={() => {
                                                            if (!planForm.subscriptionId) return;
                                                            setPlanForm((prev) => ({ ...prev, amount: Math.min(100000, prev.amount + 500) }));
                                                        }}
                                                    >
                                                        <CirclePlus className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Currency</label>
                                            <input
                                                className={inputClass}
                                                placeholder="VND"
                                                value={planForm.currency}
                                                disabled={!planForm.subscriptionId}
                                                onChange={(e) =>
                                                    setPlanForm((prev) => ({ ...prev, currency: e.target.value.toUpperCase() }))
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                                            <span>Duration (days)</span>
                                            <span className="text-xs text-gray-500 font-semibold">{planForm.durationInDays} days</span>
                                        </label>
                                        <div className={!planForm.subscriptionId ? 'pointer-events-none opacity-40' : ''}>
                                            <div className="mt-2 flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    disabled={!planForm.subscriptionId}
                                                    onClick={() => {
                                                        if (!planForm.subscriptionId) return;
                                                        setPlanForm((prev) => ({ ...prev, durationInDays: Math.max(1, prev.durationInDays - 1) }));
                                                    }}
                                                >
                                                    <CircleMinus className="w-5 h-5" />
                                                </button>
                                                <div className="flex-1 flex items-center">
                                                    <ElasticSlider
                                                        defaultValue={planForm.durationInDays}
                                                        startingValue={1}
                                                        maxValue={365}
                                                        isStepped
                                                        stepSize={1}
                                                        valueSuffix={` days`}
                                                        valueFormatter={(val) => val.toLocaleString()}
                                                        leftIcon={<span />}
                                                        rightIcon={<span />}
                                                        onChange={(value) => {
                                                            if (!planForm.subscriptionId) return;
                                                            setPlanForm((prev) => ({ ...prev, durationInDays: Math.max(1, Math.round(value)) }));
                                                        }}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    disabled={!planForm.subscriptionId}
                                                    onClick={() => {
                                                        if (!planForm.subscriptionId) return;
                                                        setPlanForm((prev) => ({ ...prev, durationInDays: Math.min(365, prev.durationInDays + 1) }));
                                                    }}
                                                >
                                                    <CirclePlus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <CusButton
                                    type="submit"
                                    disabled={addSubscriptionPlan.isPending || !planForm.subscriptionId}
                                    className="w-full"
                                >
                                    {addSubscriptionPlan.isPending ? 'Attaching...' : 'Add Plan'}
                                </CusButton>
                            </form>
                        </WhiteCard>
                    </Step>

                    <Step>
                        <WhiteCard className="w-full h-full" width="100%" height="auto">
                            <form className="space-y-5" onSubmit={handleFeatureSubmit}>
                                <div className="flex items-center gap-3">
                                    <div className="h-7 w-7 rounded-full text-white grid place-items-center text-sm font-semibold" style={{ backgroundColor: '#769FCD' }}>
                                        3
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">Add Feature</h2>
                                        <p className="text-sm text-gray-500">Gate entitlements per subscription.</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Target subscription</span>
                                        {selectedFeatureSubscription && (
                                            <span className="text-xs text-gray-500">
                                                Selected: {selectedFeatureSubscription.name}
                                            </span>
                                        )}
                                    </div>
                                    {subscriptionsLoading ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {Array.from({ length: 2 }).map((_, idx) => (
                                                <Skeleton key={`feature-sub-skel-${idx}`} className="h-28 w-full rounded-2xl" />
                                            ))}
                                        </div>
                                    ) : subscriptionsList.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {subscriptionsList.map((sub) => {
                                                const subId = resolveSubscriptionId(sub);
                                                if (!subId) return null;
                                                const isSelected = featureForm.subscriptionId === subId;
                                                return (
                                                    <button
                                                        type="button"
                                                        key={`feature-sub-${subId}`}
                                                        className={`text-left rounded-2xl border bg-white/80 p-4 shadow-sm transition-colors ${isSelected ? 'border-blue-400 ring-1 ring-blue-300' : 'border-white/60 hover:border-blue-200'}`}
                                                        onClick={() => setFeatureForm((prev) => ({ ...prev, subscriptionId: subId }))}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="text-base font-semibold text-gray-900">{sub.name}</h4>
                                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${sub.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                                {sub.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600">{sub.description ?? 'No description provided.'}</p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-white/60 bg-white/40 p-4 text-center text-sm text-gray-500">
                                            No subscriptions available. Create one in Step 1 first.
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {featureRows.map((row, idx) => (
                                        <div
                                            key={row.id}
                                            className={`rounded-2xl border bg-white/80 p-4 shadow-sm transition-colors ${activeFeatureRow === idx ? 'border-blue-400' : 'border-white/60'}`}
                                            onClick={() => setActiveFeatureRow(idx)}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <p className="text-xs uppercase tracking-[0.25rem] text-gray-400">Feature #{idx + 1}</p>
                                                    <h4 className="text-base font-semibold text-gray-900">
                                                        {row.featureCode || 'Select a feature'}
                                                    </h4>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">
                                                        {activeFeatureRow === idx ? 'Active' : 'Tap to edit'}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveFeatureRow(idx);
                                                        }}
                                                        className="text-xs text-red-500 hover:text-red-600 disabled:opacity-40"
                                                        disabled={featureRows.length === 1}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="col-span-1">
                                                    <label className="text-sm font-medium text-gray-700">Feature Code</label>
                                                    <input
                                                        className={inputClass}
                                                        placeholder="MEAL_PLAN_SLOT"
                                                        value={row.featureCode}
                                                        autoComplete="off"
                                                        list={`feature-codes-${row.id}`}
                                                        onFocus={() => setActiveFeatureRow(idx)}
                                                        onChange={(e) => updateFeatureRow(idx, { featureCode: e.target.value })}
                                                        disabled={!featureForm.subscriptionId}
                                                    />
                                                    {features && (
                                                        <datalist id={`feature-codes-${row.id}`}>
                                                            {features.map((feature) => (
                                                                <option key={`${row.id}-${feature.featureCode}`} value={feature.featureCode}>
                                                                    {feature.name}
                                                                </option>
                                                            ))}
                                                        </datalist>
                                                    )}
                                                </div>
                                                <div className="col-span-1">
                                                    <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                                                        <span>Entitlement quota</span>
                                                        <span className="text-xs text-gray-500 font-semibold">{row.entitlementQuota}</span>
                                                    </label>
                                                    <div className={!featureForm.subscriptionId ? 'pointer-events-none opacity-40' : ''}>
                                                        <div className="mt-2 flex items-center gap-3">
                                                            <button
                                                                type="button"
                                                                className="p-2 hover:scale-110 transition-transform flex-shrink-0 rounded-full border border-white/60 bg-white/80 disabled:opacity-40"
                                                                disabled={!featureForm.subscriptionId}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (!featureForm.subscriptionId) return;
                                                                    updateFeatureRow(idx, { entitlementQuota: Math.max(0, row.entitlementQuota - 1) });
                                                                }}
                                                            >
                                                                <CircleMinus className="w-5 h-5" />
                                                            </button>
                                                            <div className="flex-1 flex items-center">
                                                                <ElasticSlider
                                                                    defaultValue={row.entitlementQuota}
                                                                    startingValue={0}
                                                                    maxValue={50}
                                                                    isStepped
                                                                    stepSize={1}
                                                                    leftIcon={<span className="text-xs text-gray-500">0</span>}
                                                                    rightIcon={<span className="text-xs text-gray-500">50</span>}
                                                                    onChange={(value) => {
                                                                        if (!featureForm.subscriptionId) return;
                                                                        updateFeatureRow(idx, { entitlementQuota: Math.max(0, Math.round(value)) });
                                                                    }}
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="p-2 hover:scale-110 transition-transform flex-shrink-0 rounded-full border border-white/60 bg-white/80 disabled:opacity-40"
                                                                disabled={!featureForm.subscriptionId}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (!featureForm.subscriptionId) return;
                                                                    updateFeatureRow(idx, { entitlementQuota: Math.min(50, row.entitlementQuota + 1) });
                                                                }}
                                                            >
                                                                <CirclePlus className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-span-1 md:col-span-2">
                                                    <label className="text-sm font-medium text-gray-700">Reset cadence</label>
                                                    <select
                                                        className={selectClass}
                                                        value={row.entitlementResetPer}
                                                        disabled={!featureForm.subscriptionId}
                                                        onChange={(e) =>
                                                            updateFeatureRow(idx, { entitlementResetPer: e.target.value as 'Day' | 'Week' | 'Month' | 'Year' })
                                                        }
                                                    >
                                                        <option value="Day">Day</option>
                                                        <option value="Week">Week</option>
                                                        <option value="Month">Month</option>
                                                        <option value="Year">Year</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <CusButton type="button" variant="blueGray" onClick={handleAddFeatureRow} disabled={!featureForm.subscriptionId}>
                                        Add another feature
                                    </CusButton>
                                </div>

                                <CusButton
                                    type="submit"
                                    disabled={addSubscriptionFeature.isPending || !featureForm.subscriptionId}
                                    className="w-full"
                                >
                                    {addSubscriptionFeature.isPending ? 'Saving...' : 'Add Feature'}
                                </CusButton>
                            </form>

                            <div className="mt-8 space-y-4 border-t border-white/60 pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-7 w-7 rounded-full text-white grid place-items-center text-xs font-bold" style={{ backgroundColor: '#769FCD' }}>
                                        i
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Available Features</h3>
                                        <p className="text-sm text-gray-500">Browse catalog and quickly fill the form using “Use Feature”.</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        className="neomorphic-input flex-1"
                                        placeholder="Search feature code or name..."
                                        value={featureSearchInput}
                                        autoComplete="off"
                                        onChange={(e) => setFeatureSearchInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                setFeatureSearch(featureSearchInput);
                                            }
                                        }}
                                    />
                                    <CusButton
                                        type="button"
                                        variant="blueGray"
                                        onClick={() => setFeatureSearch(featureSearchInput)}
                                    >
                                        Search
                                    </CusButton>
                                </div>

                                {featuresAreLoading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Array.from({ length: 4 }).map((_, idx) => (
                                            <Skeleton key={idx} className="h-32 w-full rounded-2xl" />
                                        ))}
                                    </div>
                                ) : filteredFeatures.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {filteredFeatures.map((feature) => (
                                            <div key={feature.featureCode} className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <p className="text-xs uppercase tracking-[0.25rem] text-gray-400">{feature.featureCode}</p>
                                                        <h4 className="text-lg font-semibold text-gray-900">{feature.name}</h4>
                                                    </div>
                                                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                        {feature.defaultEntitlement}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                                                <CusButton
                                                    type="button"
                                                    variant="blueGray"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => applyFeatureCodeFromCatalog(feature.featureCode)}
                                                >
                                                    Use Feature
                                                </CusButton>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="w-full rounded-2xl border border-dashed border-white/60 bg-white/30 p-6 text-center text-sm text-gray-500">
                                        {featureSearch.trim()
                                            ? 'No features match your search.'
                                            : 'No features available. Please ensure the `/features` endpoint returns data.'}
                                    </div>
                                )}
                            </div>
                        </WhiteCard>
                    </Step>
                </Stepper>
            </div>
        </AdminLayout>
    );
}


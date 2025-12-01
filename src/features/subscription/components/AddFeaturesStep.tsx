import React from 'react';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { CusButton } from '@/components/ui/cusButton';
import ElasticSlider from '@/components/decoration/ElasticSlider';
import { subscriptionFeatureSchema } from '../schema/subscriptionSchema';
import SubscriptionSelector from './SubscriptionSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { CircleMinus, CirclePlus } from 'lucide-react';
import { Subscription } from '../services/subscriptionService';
import { FeatureDefinition } from '../services/subscriptionService';

type Props = {
    form: Pick<typeof subscriptionFeatureSchema._type, 'subscriptionId'>;
    inputClass: string;
    selectClass: string;
    subscriptions: Subscription[];
    subscriptionsLoading: boolean;
    selectedSubscription?: Subscription;
    resolveSubscriptionId: (sub: Subscription) => string;
    onSelectSubscription: (id: string) => void;
    featureRows: Array<Omit<typeof subscriptionFeatureSchema._type, 'subscriptionId'> & { id: string }>;
    activeFeatureRow: number | null;
    onSetActiveRow: (index: number) => void;
    onFeatureRowChange: (index: number, patch: Partial<Omit<typeof subscriptionFeatureSchema._type, 'subscriptionId'> & { id: string }>) => void;
    onRemoveFeatureRow: (index: number) => void;
    onAddFeatureRow: () => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    isSubmitting: boolean;
    featureSearchInput: string;
    onFeatureSearchInputChange: (value: string) => void;
    onFeatureSearch: () => void;
    filteredFeatures: FeatureDefinition[];
    featuresAreLoading: boolean;
    onUseFeatureFromCatalog: (featureCode: string) => void;
};

const AddFeaturesStep = ({
    form,
    inputClass,
    selectClass,
    subscriptions,
    subscriptionsLoading,
    selectedSubscription,
    resolveSubscriptionId,
    onSelectSubscription,
    featureRows,
    activeFeatureRow,
    onSetActiveRow,
    onFeatureRowChange,
    onRemoveFeatureRow,
    onAddFeatureRow,
    onSubmit,
    isSubmitting,
    featureSearchInput,
    onFeatureSearchInputChange,
    onFeatureSearch,
    filteredFeatures,
    featuresAreLoading,
    onUseFeatureFromCatalog,
}: Props) => {
    const hasSubscriptionSelected = Boolean(form.subscriptionId);

    return (
        <WhiteCard className="w-full h-full" width="100%" height="auto">
            <form className="space-y-5 text-[#113F67]" onSubmit={onSubmit}>
                <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full text-white grid place-items-center text-sm font-semibold" style={{ backgroundColor: '#769FCD' }}>
                        3
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold" style={{ color: '#113F67', fontSize: '1.1rem' }}>Add Feature</h2>
                        <p className="text-sm" style={{ color: '#113F67', fontSize: '1.1rem' }}>Gate entitlements per subscription.</p>
                    </div>
                </div>

                <SubscriptionSelector
                    subscriptions={subscriptions}
                    subscriptionsLoading={subscriptionsLoading}
                    selectedSubscription={selectedSubscription}
                    resolveSubscriptionId={resolveSubscriptionId}
                    onSelectSubscription={onSelectSubscription}
                    label="Target subscription"
                />

                <div className="space-y-6">
                    {featureRows.map((row, idx) => (
                        <div
                            key={row.id}
                            className={`rounded-2xl border bg-white/80 p-4 shadow-sm transition-colors ${activeFeatureRow === idx ? 'border-blue-400' : 'border-white/60'}`}
                            onClick={() => onSetActiveRow(idx)}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.25rem] text-gray-400">Feature #{idx + 1}</p>
                                    <h4 className="text-base font-semibold" style={{ color: '#113F67' }}>
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
                                            onRemoveFeatureRow(idx);
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
                                    <label className="text-sm font-medium" style={{ color: '#113F67', fontSize: '1.1rem' }}>Feature Code</label>
                                    <input
                                        className={inputClass}
                                        placeholder="MEAL_PLAN_SLOT"
                                        value={row.featureCode}
                                        autoComplete="off"
                                        list={`feature-codes-${row.id}`}
                                        onFocus={() => onSetActiveRow(idx)}
                                        onChange={(e) => onFeatureRowChange(idx, { featureCode: e.target.value })}
                                        disabled={!hasSubscriptionSelected}
                                    />
                                    {filteredFeatures.length > 0 && (
                                        <datalist id={`feature-codes-${row.id}`}>
                                            {filteredFeatures.map((feature) => (
                                                <option key={`${row.id}-${feature.featureCode}`} value={feature.featureCode}>
                                                    {feature.name}
                                                </option>
                                            ))}
                                        </datalist>
                                    )}
                                </div>
                                <div className="col-span-1">
                                    <label className="text-sm font-medium flex items-center justify-between" style={{ color: '#113F67', fontSize: '1.1rem' }}>
                                        <span>Entitlement quota</span>
                                        <span className="text-xs text-gray-500 font-semibold">{row.entitlementQuota}</span>
                                    </label>
                                    <div className={!hasSubscriptionSelected ? 'pointer-events-none opacity-40' : ''}>
                                        <div className="mt-2 flex items-center gap-3">
                                            <button
                                                type="button"
                                                className="p-2 hover:scale-110 transition-transform flex-shrink-0 rounded-full border border-white/60 bg-white/80 disabled:opacity-40"
                                                disabled={!hasSubscriptionSelected}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onFeatureRowChange(idx, { entitlementQuota: Math.max(0, row.entitlementQuota - 1) });
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
                                                    onChange={(value) => onFeatureRowChange(idx, { entitlementQuota: Math.max(0, Math.round(value)) })}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                className="p-2 hover:scale-110 transition-transform flex-shrink-0 rounded-full border border-white/60 bg-white/80 disabled:opacity-40"
                                                disabled={!hasSubscriptionSelected}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onFeatureRowChange(idx, { entitlementQuota: Math.min(50, row.entitlementQuota + 1) });
                                                }}
                                            >
                                                <CirclePlus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="text-sm font-medium" style={{ color: '#113F67', fontSize: '1.1rem' }}>Reset cadence</label>
                                    <select
                                        className={selectClass}
                                        value={row.entitlementResetPer}
                                        disabled={!hasSubscriptionSelected}
                                        onChange={(e) =>
                                            onFeatureRowChange(idx, { entitlementResetPer: e.target.value as typeof subscriptionFeatureSchema._type['entitlementResetPer'] })
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

                    <CusButton type="button" variant="blueGray" onClick={onAddFeatureRow} disabled={!hasSubscriptionSelected}>
                        Add another feature
                    </CusButton>
                </div>

                <CusButton
                    type="submit"
                    variant="blueGray"
                    disabled={isSubmitting || !hasSubscriptionSelected}
                    className="w-full"
                >
                    {isSubmitting ? 'Saving...' : 'Add Feature'}
                </CusButton>
            </form>

            <div className="mt-8 space-y-4 border-t border-white/60 pt-6">
                <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full text-white grid place-items-center text-xs font-bold" style={{ backgroundColor: '#769FCD' }}>
                        i
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold" style={{ color: '#113F67', fontSize: '1.1rem' }}>Available Features</h3>
                        <p className="text-sm text-gray-500">Browse catalog and quickly fill the form using “Use Feature”.</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        className="neomorphic-input flex-1"
                        placeholder="Search feature code or name..."
                        value={featureSearchInput}
                        autoComplete="off"
                        onChange={(e) => onFeatureSearchInputChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                onFeatureSearch();
                            }
                        }}
                    />
                    <CusButton type="button" variant="blueGray" onClick={onFeatureSearch}>
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
                                        <h4 className="text-lg font-semibold" style={{ color: '#113F67' }}>{feature.name}</h4>
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
                                    onClick={() => onUseFeatureFromCatalog(feature.featureCode)}
                                >
                                    Use Feature
                                </CusButton>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="w-full rounded-2xl border border-dashed border-white/60 bg-white/30 p-6 text-center text-sm text-gray-500">
                        {featureSearchInput.trim()
                            ? 'No features match your search.'
                            : 'No features available. Please ensure the `/features` endpoint returns data.'}
                    </div>
                )}
            </div>
        </WhiteCard>
    );
};

export default AddFeaturesStep;


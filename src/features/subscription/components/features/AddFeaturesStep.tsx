import React from 'react';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { CusButton } from '@/components/ui/cusButton';
import ElasticSlider from '@/components/decoration/ElasticSlider';
import { subscriptionFeatureSchema } from '../../schema/subscriptionSchema';
import SubscriptionSelector from '../SubscriptionSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { CircleMinus, CirclePlus, Trash } from 'lucide-react';
import { Subscription } from '../../services/subscriptionService';
import { FeatureDefinition } from '../../services/subscriptionService';
import FeaturesCards from './FeaturesCards';

type Props = {
    form: Pick<typeof subscriptionFeatureSchema._type, 'subscriptionId'>;
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
                        <h2 className="text-xl font-semibold" style={{ color: '#113F67' }}>Add Subscription Features</h2>
                    </div>
                </div>

                <SubscriptionSelector
                    subscriptions={subscriptions}
                    subscriptionsLoading={subscriptionsLoading}
                    selectedSubscription={selectedSubscription}
                    resolveSubscriptionId={resolveSubscriptionId}
                    onSelectSubscription={onSelectSubscription}
                    label="Choose a subscription"
                />

                <div className="space-y-6 mt-8">
                    {featureRows.map((row, idx) => (
                        <div
                            key={row.id}
                            className={`rounded-2xl border bg-white/80 p-4 shadow-sm transition-colors ${activeFeatureRow === idx ? 'border-blue-400' : 'border-white/60'}`}
                            onClick={() => onSetActiveRow(idx)}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex-1">
                                    <p className="text-xs uppercase tracking-[0.25rem] text-gray-400">Feature #{idx + 1}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveFeatureRow(idx);
                                    }}
                                    disabled={featureRows.length === 1}
                                    className="
                                        flex items-center gap-2
                                        px-3 py-2 rounded-full shrink-0
                                        bg-red-50 hover:bg-red-100
                                        text-red-500 hover:text-red-600
                                        transition-colors
                                        disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
                                    "
                                >
                                    <Trash className="w-4 h-4" />
                                    <span className="text-xs font-medium">Remove</span>
                                </button>

                            </div>

                            <div className="grid gap-4 grid-cols-12">
                                <div className="col-span-4">
                                    <label className="text-sm font-medium" style={{ color: '#113F67', fontSize: '1.1rem' }}>Feature</label>
                                    <select
                                        className={selectClass}
                                        value={row.featureCode}
                                        onFocus={() => onSetActiveRow(idx)}
                                        onChange={(e) => onFeatureRowChange(idx, { featureCode: e.target.value })}
                                        disabled={!hasSubscriptionSelected}
                                    >
                                        <option value="">Select a feature...</option>
                                        {filteredFeatures.map((feature) => (
                                            <option key={`${row.id}-${feature.featureCode}`} value={feature.featureCode}>
                                                {feature.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-5">
                                    <label className="text-sm font-medium flex items-center justify-between" style={{ color: '#113F67', fontSize: '1.1rem' }}>
                                        <span>Quota</span>

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
                                                    maxValue={101}
                                                    isStepped
                                                    stepSize={1}
                                                    leftIcon={<span className="text-xs text-gray-500"></span>}
                                                    rightIcon={<span className="text-xs text-gray-500"></span>}
                                                    valueFormatter={(val) => val === 101 ? "Unlimited" : val.toString()}
                                                    onChange={(value) => onFeatureRowChange(idx, { entitlementQuota: Math.max(0, Math.round(value)) })}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                className="p-2 hover:scale-110 transition-transform flex-shrink-0 rounded-full border border-white/60 bg-white/80 disabled:opacity-40"
                                                disabled={!hasSubscriptionSelected}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onFeatureRowChange(idx, { entitlementQuota: Math.min(101, row.entitlementQuota + 1) });
                                                }}
                                            >
                                                <CirclePlus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <label className="text-sm font-medium" style={{ color: '#113F67', fontSize: '1.1rem' }}>Reset Period</label>
                                    <select
                                        className={selectClass}
                                        value={row.entitlementResetPer || ''}
                                        disabled={!hasSubscriptionSelected}
                                        onChange={(e) =>
                                            onFeatureRowChange(idx, { entitlementResetPer: e.target.value ? e.target.value as typeof subscriptionFeatureSchema._type['entitlementResetPer'] : undefined })
                                        }
                                    >
                                        <option value="">No Reset</option>
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
            <FeaturesCards
                featureSearchInput={featureSearchInput}
                onFeatureSearchInputChange={onFeatureSearchInputChange}
                onFeatureSearch={onFeatureSearch}
                filteredFeatures={filteredFeatures}
                featuresAreLoading={featuresAreLoading}
                onUseFeatureFromCatalog={onUseFeatureFromCatalog}
            />
        </WhiteCard>
    );
};

export default AddFeaturesStep;


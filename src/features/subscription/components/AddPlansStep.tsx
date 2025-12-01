import React from 'react';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { CusButton } from '@/components/ui/cusButton';
import ElasticSlider from '@/components/decoration/ElasticSlider';
import { subscriptionPlanSchema } from '../schema/subscriptionSchema';
import SubscriptionSelector from './SubscriptionSelector';
import { CircleMinus, CirclePlus } from 'lucide-react';

import { Subscription } from '../services/subscriptionService';

type Props = {
    form: typeof subscriptionPlanSchema._type;
    inputClass: string;
    subscriptions: Subscription[];
    subscriptionsLoading: boolean;
    selectedSubscription?: Subscription;
    resolveSubscriptionId: (sub: Subscription) => string;
    onSelectSubscription: (id: string) => void;
    onAmountChange: (value: number) => void;
    onAmountAdjust: (delta: number) => void;
    onDurationChange: (value: number) => void;
    onDurationAdjust: (delta: number) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    isSubmitting: boolean;
};

const AddPlansStep = ({
    form,
    inputClass,
    subscriptions,
    subscriptionsLoading,
    selectedSubscription,
    resolveSubscriptionId,
    onSelectSubscription,
    onAmountChange,
    onAmountAdjust,
    onDurationChange,
    onDurationAdjust,
    onSubmit,
    isSubmitting,
}: Props) => {
    const hasSubscriptionSelected = Boolean(form.subscriptionId);

    return (
        <WhiteCard className="w-full h-full" width="100%" height="auto">
            <form className="space-y-8 text-[#113F67]" onSubmit={onSubmit}>
                <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full text-white grid place-items-center text-sm font-semibold" style={{ backgroundColor: '#769FCD' }}>
                        2
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold" style={{ color: '#113F67', fontSize: '1.1rem' }}>Add Plans</h2>
                        <p className="text-sm" style={{ color: '#113F67' }}>Attach pricing to a subscription.</p>
                    </div>
                </div>

                <SubscriptionSelector
                    subscriptions={subscriptions}
                    subscriptionsLoading={subscriptionsLoading}
                    selectedSubscription={selectedSubscription}
                    resolveSubscriptionId={resolveSubscriptionId}
                    onSelectSubscription={onSelectSubscription}
                />

                <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-10 ">
                        {/* Duration */}
                        <div className="md:col-span-3">
                            <label className="text-sm font-medium flex items-center justify-between" style={{ color: '#113F67', fontSize: '1.1rem' }}>
                                <span>Duration (days)</span>
                            </label>
                            <div className={!hasSubscriptionSelected ? 'pointer-events-none opacity-40' : ''}>
                                <div className="mt-2 flex items-center gap-3">
                                    <button
                                        type="button"
                                        disabled={!hasSubscriptionSelected}
                                        onClick={() => onDurationAdjust(-1)}
                                    >
                                        <CircleMinus className="w-5 h-5" />
                                    </button>
                                    <div className="flex-1 flex items-center">
                                        <ElasticSlider
                                            defaultValue={form.durationInDays}
                                            startingValue={1}
                                            maxValue={365}
                                            isStepped
                                            stepSize={1}
                                            leftIcon={<span />}
                                            rightIcon={<span />}
                                            valueSuffix=" days"
                                            valueFormatter={(val) => val.toLocaleString()}
                                            onChange={(value) => onDurationChange(value)}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        disabled={!hasSubscriptionSelected}
                                        onClick={() => onDurationAdjust(1)}
                                    >
                                        <CirclePlus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Amount */}
                        <div className="md:col-span-3">
                            <label className="text-sm font-medium flex items-center justify-between" style={{ color: '#113F67', fontSize: '1.1rem' }}>
                                <span>Amount</span>
                            </label>
                            <div className={!hasSubscriptionSelected ? 'pointer-events-none opacity-40' : ''}>
                                <div className="mt-2 flex items-center gap-3">
                                    <button
                                        type="button"
                                        disabled={!hasSubscriptionSelected}
                                        onClick={() => onAmountAdjust(-500)}
                                    >
                                        <CircleMinus className="w-5 h-5" />
                                    </button>
                                    <div className="flex-1 flex items-center">
                                        <ElasticSlider
                                            defaultValue={form.amount}
                                            startingValue={0}
                                            maxValue={100000}
                                            isStepped
                                            stepSize={500}
                                            leftIcon={<span />}
                                            rightIcon={<span />}
                                            valueSuffix={` ${form.currency}`}
                                            valueFormatter={(val) => val.toLocaleString()}
                                            onChange={(value) => onAmountChange(value)}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        disabled={!hasSubscriptionSelected}
                                        onClick={() => onAmountAdjust(500)}
                                    >
                                        <CirclePlus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Currency */}
                        <div className="md:col-span-1 flex flex-col justify-end">
                            <label className="text-sm font-medium" style={{ color: '#113F67', fontSize: '1.1rem' }}>Currency</label>
                            <input
                                className={inputClass}
                                placeholder="VND"
                                value={form.currency}
                                disabled
                                style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                            />
                        </div>

                    </div>
                </div>

                <CusButton
                    type="submit"
                    variant="blueGray"
                    disabled={isSubmitting || !hasSubscriptionSelected}
                    className="w-full"
                >
                    {isSubmitting ? 'Attaching...' : 'Add Plan'}
                </CusButton>
            </form>
        </WhiteCard>
    );
};

export default AddPlansStep;


import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Subscription } from '../services/subscriptionService';

export type SubscriptionSelectorProps = {
    subscriptions: Subscription[];
    subscriptionsLoading: boolean;
    selectedSubscription?: Subscription;
    resolveSubscriptionId: (sub: Subscription) => string;
    onSelectSubscription: (id: string) => void;
    label?: string;
    selectedLabelPrefix?: string;
};

const SubscriptionSelector: React.FC<SubscriptionSelectorProps> = ({
    subscriptions,
    subscriptionsLoading,
    selectedSubscription,
    resolveSubscriptionId,
    onSelectSubscription,
    label = 'Choose a subscription',
    selectedLabelPrefix = 'Selected:',
}) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                {selectedSubscription && (
                    <span className="text-xs text-gray-500">
                        {selectedLabelPrefix} {selectedSubscription.name}
                    </span>
                )}
            </div>
            {subscriptionsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 2 }).map((_, idx) => (
                        <Skeleton key={`plan-sub-skel-${idx}`} className="h-28 w-full rounded-2xl" />
                    ))}
                </div>
            ) : subscriptions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {subscriptions.map((sub) => {
                        const subId = resolveSubscriptionId(sub);
                        if (!subId) return null;
                        const isSelected = selectedSubscription && resolveSubscriptionId(selectedSubscription) === subId;
                        return (
                            <div key={subId} className="card-container">
                                <button
                                    type="button"
                                    className={`transition-all ${isSelected ? 'ring-2 ring-blue-400 ring-offset-2 rounded-2xl' : ''}`}
                                    onClick={() => onSelectSubscription(subId)}
                                >
                                    <div className="credit-card transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/50 hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.99] cursor-pointer">
                                        <div className="inner">
                                            <div className="magnetic-strip"></div>
                                            <div className="number-label">SUBSCRIPTION NAME</div>
                                            <div className="card-number">{sub.name}</div>
                                            <div className="card-details">
                                                <div>
                                                    <label>DESCRIPTION</label>
                                                    <span className="card-name">{sub.description || 'No description'}</span>
                                                </div>
                                                <div>
                                                    <label>STATUS</label>
                                                    <span className="card-date">{sub.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-white/60 bg-white/40 p-4 text-center text-sm text-gray-500">
                    No subscriptions available.
                </div>
            )}
        </div>
    );
};

export default SubscriptionSelector;

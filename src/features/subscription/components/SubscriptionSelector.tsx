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
                            <button
                                type="button"
                                key={subId}
                                className={`text-left rounded-2xl border bg-white/80 p-4 shadow-sm transition-colors ${isSelected ? 'border-blue-400 ring-1 ring-blue-300' : 'border-white/60 hover:border-blue-200'}`}
                                onClick={() => onSelectSubscription(subId)}
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
    );
};

export default SubscriptionSelector;

import React from 'react';
import { CusButton } from '@/components/ui/cusButton';
import { Skeleton } from '@/components/ui/skeleton';
import { FeatureDefinition } from '../../services/subscriptionService';
import '@/styles/features-card.css';
import { ChefHat, ScanSearch, Beef, ScanText, PackageOpen, LockKeyholeOpen } from 'lucide-react';

type Props = {
    featureSearchInput: string;
    onFeatureSearchInputChange: (value: string) => void;
    onFeatureSearch: () => void;
    filteredFeatures: FeatureDefinition[];
    featuresAreLoading: boolean;
    onUseFeatureFromCatalog: (featureCode: string) => void;
};

const FeaturesCards: React.FC<Props> = ({
    featureSearchInput,
    onFeatureSearchInputChange,
    onFeatureSearch,
    filteredFeatures,
    featuresAreLoading,
    onUseFeatureFromCatalog,
}) => {
    const renderFeatureIcon = (feature: FeatureDefinition) => {
        const code = feature.featureCode?.toLowerCase() || '';
        const name = feature.name?.toLowerCase() || '';

        if (code.includes('meal') || code.includes('plan') || name.includes('meal')) {
            return <Beef size={20} color="#113F67" />;
        }
        if (code.includes('chef') || name.includes('chef') || code.includes('ai_chef') || name.includes('ai')) {
            return <ChefHat size={20} color="#113F67" />;
        }
        if ((code.includes('image') || code.includes('img')) && code.includes('scan')) {
            return <ScanSearch size={20} color="#113F67" />;
        }
        if (code.includes('receipt') || name.includes('receipt') || code.includes('scantext') || name.includes('scan')) {
            return <ScanText size={20} color="#113F67" />;
        }
        if (code.includes('storage') || name.includes('storage') || code.includes('bucket') || code.includes('slot')) {
            return <PackageOpen size={20} color="#113F67" />;
        }
        return null;
    };
    return (
        <div className="mt-8 space-y-6 border-t border-white/60 pt-6 ">
            <div className="flex items-center gap-1">
                <div className="h-7 w-7 text-white grid place-items-center text-xs font-bold">
                    <LockKeyholeOpen size={20} color="#113F67" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold" style={{ color: '#113F67' }}>Available Features</h3>
                </div>
            </div>

            {featuresAreLoading ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                    {Array.from({ length: 6 }).map((_, idx) => (
                        <Skeleton key={idx} className="h-28 w-full rounded-xl" />
                    ))}
                </div>
            ) : filteredFeatures.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                    {filteredFeatures.map((feature) => (
                        <div key={feature.featureCode} className="card">
                            <div className="card__shine"></div>
                            <div className="card__glow"></div>
                            <div className="card__content">
                                <div className="card__image">
                                    <div className="card__badge"> Default Quota:  <span className="font-bold">{feature.defaultEntitlement}</span></div>
                                </div>
                                <div className="card__text">
                                    <div className="flex items-center gap-2">
                                        {renderFeatureIcon(feature)}
                                        <p className="card__title">{feature.name}</p>
                                    </div>
                                    <p className="card__description">{feature.description}</p>
                                </div>
                                <div className="card__footer" style={{ justifyContent: 'flex-end' }}>
                                    {/* <span className="card__price">{feature.featureCode}</span> */}
                                    <button
                                        type="button"
                                        className="card__button"
                                        onClick={() => onUseFeatureFromCatalog(feature.featureCode)}
                                        aria-label="Use feature"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 5v14M5 12h14" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full rounded-2xl border border-dashed border-white/60 bg-white/30 p-6 text-center text-sm text-gray-500">
                    {featureSearchInput.trim()
                        ? 'No features match your search.'
                        : 'No features available.'}
                </div>
            )}
        </div>
    );
};

export default FeaturesCards;

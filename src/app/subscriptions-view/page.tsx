'use client';

import React, { useState } from 'react';
import { useSubscription } from '@/features/subscription/hooks/useSubscription';
import { Subscription } from '@/features/subscription/services/subscriptionService';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import GlareHover from '@/components/decoration/GlareHover';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, Check } from 'lucide-react';
import Image from 'next/image';
import { ColorTheme } from '@/constants/color';
import RollToTopButton from '@/features/recipes-view/RollToTopButton';
import '@/styles/subscriptions-card.css';

// Subscription card component with hover pop-up effect
function SubscriptionCard({ subscription, isRecommended = false }: { subscription: Subscription; isRecommended?: boolean }) {
    const [isHovered, setIsHovered] = useState(false);
    const subscriptionId = subscription.id || subscription.subscriptionId;
    const plans = subscription.plans || [];
    const features = subscription.features || [];

    // Get the lowest price plan for display
    const lowestPricePlan = plans.length > 0
        ? plans.reduce((min, plan) => {
            const currentPrice = parseFloat(plan.price.replace(/[^0-9.]/g, '')) || 0;
            const minPrice = parseFloat(min.price.replace(/[^0-9.]/g, '')) || 0;
            return currentPrice < minPrice ? plan : min;
        }, plans[0])
        : null;

    const formatPrice = (priceStr: string) => {
        const num = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
        return num.toLocaleString('vi-VN');
    };

    const formatDuration = (durationStr: string) => {
        if (durationStr.toLowerCase().includes('lifetime')) {
            return 'lifetime';
        }

        const days = parseInt(durationStr.replace(/[^0-9]/g, '')) || 0;

        if (days > 365) {
            return 'lifetime';
        }

        if (days === 365) {
            return 'year';
        }

        if (days >= 30) {
            const months = Math.floor(days / 30);
            return months === 1 ? 'month' : `${months} months`;
        }

        if (days >= 7) {
            const weeks = Math.floor(days / 7);
            return weeks === 1 ? 'week' : `${weeks} weeks`;
        }

        return days === 1 ? 'day' : `${days} days`;
    };


    // Colors based on hover state
    const textPrimary = isHovered ? '#ffffff' : ColorTheme.darkBlue;
    const textSecondary = isHovered ? 'rgba(255,255,255,0.7)' : '#6b7280';
    const iconBg = isHovered ? 'rgba(118, 159, 205, 0.2)' : 'rgba(118, 159, 205, 0.15)';
    const checkColor = isHovered ? '#4ade80' : ColorTheme.blueGray;
    const badgeBg = isHovered ? 'rgba(118, 159, 205, 0.2)' : 'rgba(118, 159, 205, 0.15)';
    const badgeText = isHovered ? ColorTheme.powderBlue : ColorTheme.blueGray;

    const cardContent = (
        <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl transition-colors duration-300" style={{ backgroundColor: iconBg }}>
                    <Image
                        src="/assets/img/subscriptions-view.png"
                        alt="Subscription"
                        width={28}
                        height={28}
                        className="w-6 h-6 transition-opacity duration-300"
                        style={{ opacity: isHovered ? 1 : 0.8 }}
                    />
                </div>
                <div>
                    <h3 className="text-xl font-bold transition-colors duration-300 uppercase" style={{ color: textPrimary }}>{subscription.name}</h3>
                </div>
            </div>

            {/* Price */}
            {lowestPricePlan && (
                <div className="mb-4">
                    <div className="flex items-end gap-2">
                        <span
                            className="text-xs uppercase tracking-wide transition-colors duration-300"
                            style={{ color: textSecondary }}
                        >
                            From
                        </span>

                        <span
                            className="text-4xl font-bold leading-none transition-colors duration-300"
                            style={{ color: textPrimary }}
                        >
                            {formatPrice(lowestPricePlan.price)}
                        </span>

                        <span
                            className="text-base transition-colors duration-300"
                            style={{ color: textSecondary }}
                        >
                            VND
                        </span>

                        <span
                            className="text-sm ml-1 transition-colors duration-300"
                            style={{ color: textSecondary }}
                        >
                            /{formatDuration(lowestPricePlan.duration)}
                        </span>
                    </div>
                </div>
            )}


            {/* Features */}
            <ul className="lists mt-4 space-y-2" style={{ color: textPrimary }}>
                {features.length > 0 ? (
                    features.map((feature, idx) => (
                        <li
                            key={feature.subscriptionFeatureId || idx}
                            className="flex items-center justify-between gap-2"
                        >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Check className="w-4 h-4 flex-shrink-0 opacity-80" style={{ color: checkColor }} />
                                <span className="text-sm opacity-90 truncate">
                                    {feature.featureName}
                                </span>
                            </div>
                            {feature.entitlement && (
                                <span
                                    className="text-xs font-medium flex-shrink-0 text-right min-w-[60px] transition-colors duration-300"
                                    style={{ color: textSecondary }}
                                >
                                    {feature.entitlement}
                                </span>
                            )}
                        </li>
                    ))
                ) : (
                    <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 flex-shrink-0 transition-colors duration-300" style={{ color: checkColor }} />
                        <span className="transition-colors duration-300" style={{ color: textPrimary }}>Basic features included</span>
                    </li>
                )}
            </ul>

            {/* CTA Button */}
            <button
                className="mt-6 w-full py-3 rounded-full font-semibold tracking-wide transition-all duration-300"
                style={{
                    background: isHovered
                        ? '#ffffff'
                        : '#113F67',
                    color: isHovered ? '#113F67' : '#ffffff',
                    boxShadow: isHovered
                        ? '0 10px 20px rgba(0,0,0,0.15)'
                        : '0 6px 14px rgba(17,63,103,0.3)',
                }}
            >
                In-app purchase
            </button>


            {/* Multiple Plans Display */}
            {plans.length > 1 && (
                <div
                    className="mt-8 pt-6 transition-colors duration-300"
                    style={{
                        borderTop: `1px solid ${isHovered ? 'rgba(255,255,255,0.18)' : 'rgba(17,63,103,0.12)'
                            }`,
                    }}
                >
                    <p
                        className="text-sm font-semibold mb-4 tracking-wide uppercase"
                        style={{ color: textSecondary }}
                    >
                        All plans
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {plans.map((plan, idx) => {
                            const isLowest =
                                lowestPricePlan &&
                                plan.subscriptionPlanId === lowestPricePlan.subscriptionPlanId;

                            return (
                                <div
                                    key={plan.subscriptionPlanId || idx}
                                    className="relative px-3 py-2 rounded-xl transition-all duration-300 cursor-pointer flex-1 min-w-[45%] max-w-[48%]"
                                    style={{
                                        background: isHovered
                                            ? 'rgba(255,255,255,0.18)'
                                            : 'rgba(118,159,205,0.12)',
                                        border: `1px solid ${isLowest
                                            ? '#769FCD'
                                            : isHovered
                                                ? 'rgba(255,255,255,0.25)'
                                                : 'rgba(118,159,205,0.25)'
                                            }`,
                                        boxShadow: isLowest
                                            ? '0 8px 20px rgba(118,159,205,0.35)'
                                            : 'none',
                                    }}
                                >
                                    {/* Badge */}
                                    {isLowest && (
                                        <span className="absolute -top-2 right-2 text-[9px] px-1.5 py-0.5 rounded-full bg-[#769FCD] text-white font-semibold">
                                            Best value
                                        </span>
                                    )}

                                    <div className="flex flex-wrap items-baseline gap-x-1">
                                        <span
                                            className="text-xl font-bold"
                                            style={{ color: textPrimary }}
                                        >
                                            {formatPrice(plan.price)}
                                        </span>

                                        <span
                                            className="text-xs opacity-80"
                                            style={{ color: textSecondary }}
                                        >
                                            /{formatDuration(plan.duration)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

        </>
    );

    return (
        <div
            className="relative"
            style={{
                transition: 'all 0.3s ease',
                transform: isHovered
                    ? 'translateY(-10px) scale(1.04)'
                    : 'translateY(0) scale(1)',
                zIndex: isHovered ? 10 : 1,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Recommended Badge */}
            {isRecommended && (
                <div
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-300 z-20"
                    style={{
                        background: 'linear-gradient(135deg, #113F67 0%, #769FCD 100%)',
                        color: '#ffffff',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }}
                >
                    Recommended
                </div>
            )}

            {isHovered ? (
                <GlareHover
                    width="100%"
                    height="auto"
                    background="linear-gradient(145deg, #113F67 0%, #113F67 50%, #769FCD 100%)"
                    borderRadius="1.5rem"
                    borderColor="rgba(255, 255, 255, 0.1)"
                    glareColor="#ffffff"
                    glareOpacity={0.3}
                    glareAngle={-45}
                    transitionDuration={1200}
                    className="card cursor-pointer"
                    style={{
                        boxShadow: '0 30px 60px rgba(17, 63, 103, 0.35)',
                        padding: '1.5rem',
                    }}
                >
                    {cardContent}
                </GlareHover>
            ) : (
                <div
                    className="card cursor-pointer"
                    style={{
                        background: 'rgba(255, 255, 255, 0.3)',
                        border: '1px solid rgba(214, 230, 242, 0.5)',
                        boxShadow: '0 10px 30px rgba(17, 63, 103, 0.08)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    {cardContent}
                </div>
            )}
        </div>
    );
}

export default function SubscriptionsViewPage() {
    const { subscriptions } = useSubscription();
    const items = subscriptions.data || [];
    const isLoading = subscriptions.isLoading;
    const isError = subscriptions.isError;

    const activeSubscriptions = items.filter(sub => sub.isActive);
    const inactiveSubscriptions = items.filter(sub => !sub.isActive);

    return (
        <div className="min-h-screen">
            <div className="w-full sticky top-0 z-20">
                {/* Header Section */}
                <WhiteCard
                    className="w-full py-12 flex flex-col items-center justify-center text-center rounded-b-[80px] !bg-white/20 pt-0"
                >
                    <h1 className="text-4xl md:text-5xl font-bold" style={{ color: ColorTheme.darkBlue }}>
                        Available Subscriptions
                    </h1>
                    <h2 className="text-lg md:text-xl mt-2" style={{ color: ColorTheme.blueGray }}>
                        We have all the perfect plans for your needs
                    </h2>
                </WhiteCard>
            </div>

            <div className="p-6 md:p-12 pb-32">
                <div className="max-w-7xl mx-auto space-y-12">
                    {/* Loading State */}
                    {isLoading && (
                        <WhiteCard className="p-8">
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-items-center">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-full max-w-[320px] p-6 rounded-2xl bg-gray-100">
                                        <Skeleton className="w-full h-12 rounded-xl mb-4" />
                                        <Skeleton className="h-16 w-1/2 mb-4" />
                                        <Skeleton className="h-4 w-full mb-2" />
                                        <Skeleton className="h-4 w-full mb-2" />
                                        <Skeleton className="h-4 w-3/4 mb-4" />
                                        <Skeleton className="h-12 w-full rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </WhiteCard>
                    )}

                    {/* Error State */}
                    {isError && (
                        <WhiteCard className="p-12">
                            <div className="text-red-600 text-center">
                                Failed to load subscriptions. Please try again later.
                            </div>
                        </WhiteCard>
                    )}

                    {/* Empty State */}
                    {!isLoading && !isError && items.length === 0 && (
                        <WhiteCard className="p-12">
                            <div className="text-center text-gray-500">
                                <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                <p className="text-lg font-medium">No subscription plans available</p>
                                <p className="text-sm mt-2">Check back later for subscription options!</p>
                            </div>
                        </WhiteCard>
                    )}

                    {/* Active Subscription Cards */}
                    {activeSubscriptions.length > 0 && (
                        <div className="p-4 space-y-4 pb-32">
                            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-items-center">
                                {activeSubscriptions.map((subscription, idx) => (
                                    <SubscriptionCard
                                        key={subscription.id || subscription.subscriptionId}
                                        subscription={subscription}
                                        isRecommended={idx < 2}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <RollToTopButton />
        </div>
    );
}

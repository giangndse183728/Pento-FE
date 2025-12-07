'use client';

import React from 'react';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { CusButton } from '@/components/ui/cusButton';
import Image from 'next/image';
import { useMilestoneById } from '../hooks/useMilestones';

type Requirement = {
    activityName: string;
    activityDescription: string;
    quota: number;
    timeFrame: string;
};

type MilestoneDetails = {
    milestone: {
        icon: string;
        name: string;
        description: string;
        isActive: boolean;
        earnedCount: number;
    };
    requirements: Requirement[];
};

type Props = {
    milestoneId: string;
    onClose: () => void;
};

export default function AchievementsDetailsModal({ milestoneId, onClose }: Props) {
    const { data, isLoading } = useMilestoneById(milestoneId);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
                <WhiteCard className="w-full max-w-2xl" width="100%" height="auto">
                    <div className="text-center py-12 text-gray-500">
                        Loading achievement details...
                    </div>
                </WhiteCard>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const milestoneDetails = data as unknown as MilestoneDetails;
    const { milestone, requirements } = milestoneDetails;

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <WhiteCard className="w-full max-w-2xl bg-white/90" width="100%" height="auto">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold" style={{ color: '#113F67' }}>
                            Achievement Details
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Achievement Info */}
                    <div className="space-y-4">
                        {/* Icon and Basic Info */}
                        <div className="flex gap-6 items-start">
                            {milestone.icon && (
                                <div className="flex-shrink-0">
                                    <Image
                                        src={milestone.icon}
                                        alt={milestone.name}
                                        width={120}
                                        height={120}
                                        className="object-contain rounded-lg"
                                    />
                                </div>
                            )}
                            <div className="flex-1 space-y-3">
                                <div>
                                    <h3 className="text-xl font-bold" style={{ color: '#113F67' }}>
                                        {milestone.name}
                                    </h3>
                                    <p className="text-gray-600 mt-1">
                                        {milestone.description}
                                    </p>
                                </div>

                                <div className="flex gap-4 items-center">
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                                        style={{
                                            backgroundColor: milestone.isActive ? '#10B981' : '#9CA3AF',
                                        }}
                                    >
                                        {milestone.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        <strong className="text-gray-700">{milestone.earnedCount}</strong> user(s) earned
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Requirements Section */}
                        <div className="pt-4 border-t" style={{ borderColor: '#D6E6F2' }}>
                            <h4 className="text-lg font-semibold mb-3" style={{ color: '#113F67' }}>
                                Requirements
                            </h4>
                            {requirements && requirements.length > 0 ? (
                                <div className="space-y-3">
                                    {requirements.map((req, index) => (
                                        <div
                                            key={index}
                                            className="p-4 rounded-lg border"
                                            style={{ borderColor: '#D6E6F2', backgroundColor: '#F8FAFC' }}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h5 className="font-semibold text-sm" style={{ color: '#113F67' }}>
                                                        {req.activityName}
                                                    </h5>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {req.activityDescription}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-sm font-semibold" style={{ color: '#113F67' }}>
                                                        Quota: {req.quota}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {req.timeFrame}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">
                                    No requirements configured for this achievement.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Close Button */}
                    <div className="flex justify-end pt-4 border-t" style={{ borderColor: '#D6E6F2' }}>
                        <CusButton
                            type="button"
                            onClick={onClose}
                            variant="blueGray"
                        >
                            Close
                        </CusButton>
                    </div>
                </div>
            </WhiteCard>
        </div>
    );
}

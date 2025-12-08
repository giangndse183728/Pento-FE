'use client';

import React, { useState } from 'react';
import { useUpdateMilestone } from '../hooks/useMilestones';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { CusButton } from '@/components/ui/cusButton';
import { toast } from 'sonner';
import '@/styles/toggle.css';
import type { Milestone } from '../services/milestoneServices';
import type { UpdateMilestone } from '../schema/milestonesSchema';

type Props = {
    milestone: Milestone;
    onClose: () => void;
    onSuccess?: () => void;
};

export default function AchievementsEditModal({ milestone, onClose, onSuccess }: Props) {
    const [formData, setFormData] = useState<UpdateMilestone>({
        name: milestone.name,
        description: milestone.description,
        isActive: milestone.isActive,
    });

    const updateMilestoneMutation = useUpdateMilestone();

    const isLoading = updateMilestoneMutation.isPending;

    const inputClass = 'neomorphic-input w-full';
    const textareaClass = 'neomorphic-textarea w-full min-h-[96px]';

    const handleFormChange = (field: keyof UpdateMilestone, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!formData.name?.trim()) {
            toast.error('Achievement name is required');
            return;
        }

        try {
            // Update milestone details
            await updateMilestoneMutation.mutateAsync({
                milestoneId: milestone.id,
                payload: formData,
            });

            toast.success('Achievement updated successfully');
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error('Failed to update achievement', err);
            const error = err as Record<string, unknown>;
            const errorData = (error?.response as Record<string, unknown>)?.data as Record<string, unknown>;
            toast.error((errorData?.detail as string) || 'Failed to update achievement');
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <WhiteCard className="w-full max-w-2xl bg-white/90" width="100%" height="auto">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold" style={{ color: '#113F67' }}>
                            Edit Achievement
                        </h2>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                                Name
                            </label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={(e) => handleFormChange('name', e.target.value)}
                                className={inputClass}
                                placeholder="Achievement name"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                                Description
                            </label>
                            <textarea
                                value={formData.description || ''}
                                onChange={(e) => handleFormChange('description', e.target.value)}
                                className={textareaClass}
                                placeholder="Achievement description"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Active Status Toggle */}
                        <div className="flex items-center justify-end gap-3">
                            <span className="font-semibold text-lg" style={{ color: '#113F67' }}>
                                Achievement Status:
                            </span>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => handleFormChange('isActive', e.target.checked)}
                                    disabled={isLoading}
                                />
                                <span className="slider"></span>
                            </label>
                            <span
                                className="font-semibold text-lg"
                                style={{ color: formData.isActive ? '#67C090' : '#FFA07A' }}
                            >
                                {formData.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t" style={{ borderColor: '#D6E6F2' }}>
                        <CusButton
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            variant="pastelRed"
                        >
                            Cancel
                        </CusButton>
                        <CusButton
                            type="button"
                            onClick={handleSave}
                            disabled={isLoading}
                            variant="blueGray"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </CusButton>
                    </div>
                </div>
            </WhiteCard>
        </div>
    );
}

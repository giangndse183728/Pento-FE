'use client';

import React, { useState } from 'react';
import { useCreateMilestone } from '../hooks/useMilestones';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { CusButton } from '@/components/ui/cusButton';
import { ColorTheme } from '@/constants/color';
import { toast } from 'sonner';
import type { CreateMilestone } from '../schema/milestonesSchema';

type CreateAchievementProps = {
    onSuccess?: () => void;
};

export default function CreateAchievements({ onSuccess }: CreateAchievementProps) {
    const [formData, setFormData] = useState<CreateMilestone>({
        name: '',
        description: '',
        isActive: false,
    });

    const createMilestoneMutation = useCreateMilestone();
    const isLoading = createMilestoneMutation.isPending;

    const inputClass = 'neomorphic-input w-full';
    const textareaClass = 'neomorphic-textarea w-full min-h-[96px]';

    const handleFormChange = (field: keyof CreateMilestone, value: string | boolean | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name?.trim()) {
            toast.error('Achievement name is required');
            return;
        }

        try {
            await createMilestoneMutation.mutateAsync(formData);
            toast.success('Achievement created successfully');
            setFormData({
                name: '',
                description: '',
                isActive: false,
            });
            onSuccess?.();
        } catch (err) {
            console.error('Failed to create achievement', err);
            const error = err as Record<string, unknown>;
            const errorMessage = (error?.response as Record<string, unknown>)?.data as Record<string, unknown>;
            toast.error(errorMessage?.detail as string || 'Failed to create achievement');
        }
    };

    return (
        <WhiteCard className="w-full" width="100%" height="auto">
            <form className="space-y-5 text-[#113F67]" onSubmit={handleCreateSubmit}>
                <div>
                    <h2 className="text-xl font-semibold" style={{ color: '#113F67' }}>
                        Create an Achievement
                    </h2>
                </div>

                {/* Achievement Status Toggle */}
                <div className="flex items-center justify-end gap-3">
                    <span className="font-semibold text-lg" style={{ color: ColorTheme.darkBlue }}>
                        Achievement Status:
                    </span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => handleFormChange('isActive', e.target.checked)}
                            disabled
                        />
                        <span className="slider"></span>
                    </label>
                    <span className="font-semibold text-lg" style={{ color: '#9CA3AF' }}>
                        Inactive
                    </span>
                </div>

                <div className="grid gap-8">
                    <div>
                        <label className="text-sm font-semibold" style={{ color: '#113F67', fontSize: '1.1rem' }}>
                            Name
                        </label>
                        <input
                            className={inputClass}
                            placeholder="Achievement name"
                            value={formData.name || ''}
                            onChange={(e) => handleFormChange('name', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold" style={{ color: '#113F67', fontSize: '1.1rem' }}>
                            Description
                        </label>
                        <textarea
                            className={textareaClass}
                            placeholder="Describe the achievement..."
                            value={formData.description || ''}
                            onChange={(e) => handleFormChange('description', e.target.value)}
                        />
                    </div>
                </div>

                <CusButton type="submit" disabled={isLoading} variant="blueGray">
                    {isLoading ? 'Creating...' : 'Create Achievement'}
                </CusButton>
            </form>
        </WhiteCard>
    );
}

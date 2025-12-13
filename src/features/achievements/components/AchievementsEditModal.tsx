'use client';

import React, { useState } from 'react';
import { useUpdateMilestone } from '../hooks/useMilestones';
import { toast } from 'sonner';
import type { Milestone } from '../services/milestoneServices';
import type { UpdateMilestone } from '../schema/milestonesSchema';
import UpdateDetailsModal, { type ModalField } from '@/components/decoration/UpdateDetailsModal';

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

    const handleFormChange = (field: keyof UpdateMilestone, value: unknown) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!formData.name?.trim()) {
            toast.error('Achievement name is required');
            return;
        }

        try {
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

    const fields: ModalField[] = [
        {
            name: 'name',
            label: 'Name',
            type: 'text',
            placeholder: 'Achievement name',
            required: true,
        },
        {
            name: 'description',
            label: 'Description',
            type: 'textarea',
            placeholder: 'Achievement description',
        },
        {
            name: 'isActive',
            label: 'Achievement Status',
            type: 'toggle',
            toggleLabels: { on: 'Active', off: 'Inactive' },
        },
    ];

    return (
        <UpdateDetailsModal
            title="Edit Achievement"
            fields={fields}
            formData={formData as Record<string, unknown>}
            onFormChange={handleFormChange as (field: string, value: unknown) => void}
            onClose={onClose}
            isLoading={isLoading}
            onSave={handleSave}
            saveLabel="Save Changes"
            cancelLabel="Cancel"
        />
    );
}


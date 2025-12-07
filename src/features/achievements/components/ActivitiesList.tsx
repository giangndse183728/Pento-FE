'use client';

import React, { useState } from 'react';
import { useActivities, useUpdateActivity } from '../hooks/useActivities';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { CusButton } from '@/components/ui/cusButton';
import { toast } from 'sonner';
import type { UpdateActivity } from '../schema/activitiesSchema';

export default function ActivitiesList() {
    const [searchText, setSearchText] = useState('');
    const [editingActivity, setEditingActivity] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<UpdateActivity>({
        name: '',
        description: '',
    });

    const { data: activities = [], isLoading } = useActivities({ searchText });
    const updateActivityMutation = useUpdateActivity();

    const handleEditClick = (activityCode: string, name: string, description: string) => {
        setEditingActivity(activityCode);
        setEditForm({ name, description });
    };

    const handleCancelEdit = () => {
        setEditingActivity(null);
        setEditForm({ name: '', description: '' });
    };

    const handleSaveEdit = async (activityCode: string) => {
        if (!editForm.name.trim() || !editForm.description.trim()) {
            toast.error('Name and description are required');
            return;
        }

        try {
            await updateActivityMutation.mutateAsync({
                activityCode,
                payload: editForm,
            });
            toast.success('Activity updated successfully');
            setEditingActivity(null);
            setEditForm({ name: '', description: '' });
        } catch (err) {
            console.error('Failed to update activity', err);
            const error = err as Record<string, unknown>;
            const errorData = (error?.response as Record<string, unknown>)?.data as Record<string, unknown>;
            toast.error((errorData?.detail as string) || 'Failed to update activity');
        }
    };

    const inputClass = 'neomorphic-input w-full';
    const textareaClass = 'neomorphic-textarea w-full min-h-[80px]';

    return (
        <div className="space-y-6">
            {/* Search Section */}
            <WhiteCard className="w-full" width="100%" height="auto">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold" style={{ color: '#113F67' }}>
                        Search Activities
                    </h3>
                    <input
                        type="text"
                        placeholder="Search by activity name or code..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className={inputClass}
                    />
                </div>
            </WhiteCard>

            {/* Activities List Section */}
            <WhiteCard className="w-full" width="100%" height="auto">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold" style={{ color: '#113F67' }}>
                            Activities
                        </h2>
                        {!isLoading && activities.length > 0 && (
                            <p className="text-sm text-gray-500">
                                {activities.length} activities
                            </p>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12 text-gray-500">
                            Loading activities...
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No activities found
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activities.map((activity) => (
                                <div
                                    key={activity.activityCode}
                                    className="border rounded-lg p-5"
                                    style={{ borderColor: '#D6E6F2' }}
                                >
                                    {editingActivity === activity.activityCode ? (
                                        /* Edit Mode */
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                                                    Activity Code
                                                </label>
                                                <div className="px-3 py-2 bg-gray-100 rounded text-gray-600 font-mono text-sm">
                                                    {activity.activityCode}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className={inputClass}
                                                    placeholder="Activity name"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold mb-2 block" style={{ color: '#113F67' }}>
                                                    Description
                                                </label>
                                                <textarea
                                                    value={editForm.description}
                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                    className={textareaClass}
                                                    placeholder="Activity description"
                                                />
                                            </div>
                                            <div className="flex gap-3 pt-2">
                                                <CusButton
                                                    type="button"
                                                    onClick={() => handleSaveEdit(activity.activityCode)}
                                                    disabled={updateActivityMutation.isPending}
                                                    variant="blueGray"
                                                >
                                                    {updateActivityMutation.isPending ? 'Saving...' : 'Save'}
                                                </CusButton>
                                                <CusButton
                                                    type="button"
                                                    onClick={handleCancelEdit}
                                                    disabled={updateActivityMutation.isPending}
                                                    variant="pastelRed"
                                                >
                                                    Cancel
                                                </CusButton>
                                            </div>
                                        </div>
                                    ) : (
                                        /* View Mode */
                                        <div className="space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-semibold text-lg" style={{ color: '#113F67' }}>
                                                            {activity.name}
                                                        </h3>
                                                    </div>
                                                    <p className="text-xs font-mono text-gray-500 mb-3">
                                                        Code: {activity.activityCode}
                                                    </p>
                                                    <p className="text-sm text-gray-700">
                                                        {activity.description}
                                                    </p>
                                                </div>
                                                <CusButton
                                                    type="button"
                                                    onClick={() =>
                                                        handleEditClick(
                                                            activity.activityCode,
                                                            activity.name,
                                                            activity.description
                                                        )
                                                    }
                                                    variant="blueGray"
                                                    className="ml-4"
                                                >
                                                    Edit
                                                </CusButton>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </WhiteCard>
        </div>
    );
}

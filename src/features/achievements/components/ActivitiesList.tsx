'use client';

import React, { useState } from 'react';
import { useActivities, useUpdateActivity } from '../hooks/useActivities';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { CusButton } from '@/components/ui/cusButton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { SquarePen } from 'lucide-react';
import type { UpdateActivity } from '../schema/activitiesSchema';
import { TableSkeleton } from '@/components/decoration/TableSkeleton';

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
                        className="neomorphic-input w-full"
                    />
                </div>
            </WhiteCard>

            {/* Activities List Section */}
            <WhiteCard className="w-full" width="100%" height="auto">
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold" style={{ color: '#113F67' }}>
                        Activities
                    </h2>

                    {isLoading ? (
                        <TableSkeleton title="Activities" rowCount={5} columnCount={3} />
                    ) : activities.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No activities found
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='text-lg font-semibold' style={{ color: '#113F67' }}>Name</TableHead>
                                    <TableHead className='text-lg font-semibold' style={{ color: '#113F67' }}>Description</TableHead>
                                    <TableHead className='text-lg font-semibold text-center' style={{ color: '#113F67' }}>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activities.map((activity) => (
                                    <TableRow key={activity.activityCode}>
                                        {editingActivity === activity.activityCode ? (
                                            <>
                                                <TableCell>
                                                    <input
                                                        type="text"
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                        className="neomorphic-input w-full"
                                                        placeholder="Activity name"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <textarea
                                                        value={editForm.description}
                                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                        className="neomorphic-textarea w-full min-h-[40px]"
                                                        placeholder="Activity description"
                                                    />
                                                </TableCell>
                                                <TableCell onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex gap-2">
                                                        <CusButton
                                                            type="button"
                                                            onClick={() => handleSaveEdit(activity.activityCode)}
                                                            disabled={updateActivityMutation.isPending}
                                                            variant="blueGray"
                                                            className="text-sm"
                                                        >
                                                            {updateActivityMutation.isPending ? 'Saving...' : 'Save'}
                                                        </CusButton>
                                                        <CusButton
                                                            type="button"
                                                            onClick={handleCancelEdit}
                                                            disabled={updateActivityMutation.isPending}
                                                            variant="pastelRed"
                                                            className="text-sm"
                                                        >
                                                            Cancel
                                                        </CusButton>
                                                    </div>
                                                </TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell className="font-semibold text-base whitespace-normal break-words" style={{ color: '#113F67' }}>
                                                    {activity.name}
                                                </TableCell>
                                                <TableCell className="text-base text-gray-700 whitespace-normal break-words">
                                                    {activity.description}
                                                </TableCell>
                                                <TableCell onClick={(e) => e.stopPropagation()} className="text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEditClick(activity.activityCode, activity.name, activity.description)
                                                        }
                                                        className="p-2 rounded transition-colors inline-flex items-center justify-center"
                                                        style={{ color: '#113F67' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D6E6F2'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                        title="Edit activity"
                                                    >
                                                        <SquarePen className="w-5 h-5" />
                                                    </button>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </WhiteCard>
        </div>
    );
}

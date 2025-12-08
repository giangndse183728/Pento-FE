'use client';

import React, { useState } from 'react';
import { useMilestones, useUpdateMilestoneIcon, useDeleteMilestone } from '../hooks/useMilestones';
import { GetMilestonesParams } from '../services/milestoneServices';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import FilterSection, { type FilterField, type RadioOption } from '@/components/decoration/FilterSection';
import { CusButton } from '@/components/ui/cusButton';
import AchievementsEditModal from './AchievementsEditModal';
import AchievementsDetailsModal from './AchievementsDetailsModal';
import IconsEditModal from './IconsEditModal';
import ConfirmModal from '@/components/decoration/ConfirmModal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { toast } from 'sonner';
import { Trash, ImagePlus, SquarePen } from 'lucide-react';
import type { Milestone } from '../services/milestoneServices';

export default function AchievementsList() {
    const [filters, setFilters] = useState<GetMilestonesParams>({
        searchText: '',
        isActive: undefined,
        isDeleted: undefined,
        sortBy: 'Name',
        order: 'ASC',
        pageNumber: 1,
        pageSize: 50,
    });
    const [selectedAchievement, setSelectedAchievement] = useState<Milestone | null>(null);
    const [selectedAchievementForIcon, setSelectedAchievementForIcon] = useState<Milestone | null>(null);
    const [achievementToDelete, setAchievementToDelete] = useState<Milestone | null>(null);
    const [achievementToView, setAchievementToView] = useState<string | null>(null);

    const updateIconMutation = useUpdateMilestoneIcon();
    const deleteMutation = useDeleteMilestone();

    const { data, isLoading, error } = useMilestones(filters);
    const achievements = data?.items || [];
    const totalPages = data?.totalPages || 1;
    const currentPage = data?.currentPage || 1;
    const hasPrevious = data?.hasPrevious || false;
    const hasNext = data?.hasNext || false;

    const handleFilterChange = (key: keyof GetMilestonesParams, value: string | number | boolean | undefined) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            pageNumber: 1, // Reset to first page when filters change
        }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({
            ...prev,
            pageNumber: newPage,
        }));
    };

    const handleResetFilters = () => {
        setFilters({
            searchText: '',
            isActive: undefined,
            isDeleted: undefined,
            sortBy: 'Name',
            order: 'ASC',
            pageNumber: 1,
            pageSize: 50,
        });
    };

    if (error) {
        toast.error('Failed to load achievements');
    }

    const filterFields: FilterField[] = [
        {
            type: 'text',
            name: 'searchText',
            label: 'Search',
            placeholder: 'Search achievements...',
            value: filters.searchText || '',
            onChange: (value) => handleFilterChange('searchText', value as string),
        },
        {
            type: 'select',
            name: 'isActive',
            label: 'Status',
            value: filters.isActive,
            options: [
                { value: '', label: 'All' },
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
            ],
            onChange: (value) => handleFilterChange('isActive', value),
        },
        {
            type: 'select',
            name: 'isDeleted',
            label: 'Show Deleted',
            value: filters.isDeleted,
            options: [
                { value: '', label: 'Active Only' },
                { value: 'true', label: 'Show Deleted' },
                { value: 'false', label: 'Hide Deleted' },
            ],
            onChange: (value) => handleFilterChange('isDeleted', value),
        },
        {
            type: 'select',
            name: 'sortBy',
            label: 'Sort By',
            value: filters.sortBy || 'Name',
            options: [
                { value: 'Name', label: 'Name' },
                { value: 'Id', label: 'ID' },
                { value: 'EarnedCount', label: 'Earned Count' },
            ],
            onChange: (value) => handleFilterChange('sortBy', value as string),
        },
    ];

    const radioOptions: RadioOption[] = [
        {
            label: 'Ascending',
            value: 'ASC',
            checked: filters.order === 'ASC',
            onChange: () => handleFilterChange('order', 'ASC'),
        },
        {
            label: 'Descending',
            value: 'DESC',
            checked: filters.order === 'DESC',
            onChange: () => handleFilterChange('order', 'DESC'),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Filters Section */}
            <FilterSection
                title="Filters"
                fields={filterFields}
                radioGroup={{
                    label: 'Order',
                    name: 'order',
                    options: radioOptions,
                }}
                onReset={handleResetFilters}
                resetButtonText="Reset Filters"
            />

            {/* Achievements List Section */}
            <WhiteCard className="w-full" width="100%" height="auto">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold" style={{ color: '#113F67' }}>
                            Achievements
                        </h2>
                        {!isLoading && data && (
                            <p className="text-sm text-gray-500">
                                {data.totalCount} total achievements
                            </p>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12 text-gray-500">
                            Loading achievements...
                        </div>
                    ) : achievements.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No achievements found
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='text-lg font-semibold' style={{ color: '#113F67' }}>Icon</TableHead>
                                        <TableHead className='text-lg font-semibold' style={{ color: '#113F67' }}>Name</TableHead>
                                        <TableHead className='text-lg font-semibold' style={{ color: '#113F67' }}>Description</TableHead>
                                        <TableHead className='text-lg font-semibold' style={{ color: '#113F67' }}>Users Earned</TableHead>
                                        <TableHead className='text-lg font-semibold' style={{ color: '#113F67' }}>Status</TableHead>
                                        <TableHead className='text-lg font-semibold text-center' style={{ color: '#113F67' }}>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {achievements
                                        .filter((achievement) => !achievement.isDeleted)
                                        .map((achievement) => (
                                            <TableRow
                                                key={achievement.id}
                                                className="cursor-pointer hover:bg-gray-50"
                                                onClick={() => setAchievementToView(achievement.id)}
                                            >
                                                {/* Icon */}
                                                <TableCell>
                                                    {achievement.icon ? (
                                                        <Image
                                                            src={achievement.icon}
                                                            alt={achievement.name}
                                                            width={40}
                                                            height={40}
                                                            className="object-contain"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                                            N/A
                                                        </div>
                                                    )}
                                                </TableCell>

                                                {/* Name */}
                                                <TableCell className="font-semibold text-base whitespace-normal break-words" style={{ color: '#113F67' }}>
                                                    {achievement.name}
                                                </TableCell>

                                                {/* Description */}
                                                <TableCell className="text-base text-gray-600 whitespace-normal break-words">
                                                    {achievement.description || '-'}
                                                </TableCell>

                                                {/* Earned Count */}
                                                <TableCell className="text-sm font-semibold text-gray-700 text-center">
                                                    {achievement.earnedCount}
                                                </TableCell>

                                                {/* Status */}
                                                <TableCell>
                                                    <span
                                                        className="px-3 py-1 rounded-full text-xs font-semibold text-white inline-block"
                                                        style={{
                                                            backgroundColor: achievement.isActive ? '#10B981' : '#9CA3AF',
                                                        }}
                                                    >
                                                        {achievement.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                    {achievement.isDeleted && (
                                                        <div className="text-xs text-red-600 font-semibold mt-1">
                                                            Deleted
                                                        </div>
                                                    )}
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell onClick={(e) => e.stopPropagation()} className="text-center">
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedAchievement(achievement)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors inline-flex items-center justify-center"
                                                            title="Edit achievement info"
                                                        >
                                                            <SquarePen className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedAchievementForIcon(achievement)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors inline-flex items-center justify-center"
                                                            title="Edit achievement icon"
                                                        >
                                                            <ImagePlus className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setAchievementToDelete(achievement)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors inline-flex items-center justify-center"
                                                            title="Delete achievement"
                                                        >
                                                            <Trash className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: '#D6E6F2' }}>
                                <p className="text-sm text-gray-500">
                                    Page {currentPage} of {totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <CusButton
                                        type="button"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={!hasPrevious || isLoading}
                                        variant="blueGray"
                                    >
                                        Previous
                                    </CusButton>
                                    <CusButton
                                        type="button"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={!hasNext || isLoading}
                                        variant="blueGray"
                                    >
                                        Next
                                    </CusButton>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </WhiteCard>

            {/* Edit Modal */}
            {selectedAchievement && (
                <AchievementsEditModal
                    milestone={selectedAchievement}
                    onClose={() => setSelectedAchievement(null)}
                    onSuccess={() => setSelectedAchievement(null)}
                />
            )}

            {/* Icon Edit Modal */}
            {selectedAchievementForIcon && (
                <IconsEditModal
                    currentIcon={selectedAchievementForIcon.icon}
                    onIconSelect={async (file) => {
                        try {
                            await updateIconMutation.mutateAsync({
                                milestoneId: selectedAchievementForIcon.id,
                                iconFile: file,
                            });
                            toast.success('Icon updated successfully');
                            setSelectedAchievementForIcon(null);
                        } catch (err) {
                            console.error('Failed to update icon', err);
                            toast.error('Failed to update icon');
                        }
                    }}
                    onClose={() => setSelectedAchievementForIcon(null)}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                open={!!achievementToDelete}
                title="Delete Achievement"
                message={`Are you sure you want to delete "${achievementToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                loading={deleteMutation.isPending}
                onConfirm={async () => {
                    if (!achievementToDelete) return;
                    try {
                        await deleteMutation.mutateAsync(achievementToDelete.id);
                        toast.success('Achievement deleted successfully');
                        setAchievementToDelete(null);
                    } catch (err) {
                        console.error('Failed to delete achievement', err);
                        const error = err as Record<string, unknown>;
                        const errorData = (error?.response as Record<string, unknown>)?.data as Record<string, unknown>;
                        const errorDetail = errorData?.detail as string;
                        const errorTitle = errorData?.title as string;

                        // Check if milestone is in use
                        if (errorTitle === 'Milestone.InUse' || errorData?.status === 409) {
                            toast.error(errorDetail || 'Milestone cannot be deleted as it is associated with active users.');
                        } else {
                            toast.error(errorDetail || 'Failed to delete achievement');
                        }
                    }
                }}
                onCancel={() => setAchievementToDelete(null)}
            />

            {/* Achievement Details Modal */}
            {achievementToView && (
                <AchievementsDetailsModal
                    milestoneId={achievementToView}
                    onClose={() => setAchievementToView(null)}
                />
            )}
        </div>
    );
}

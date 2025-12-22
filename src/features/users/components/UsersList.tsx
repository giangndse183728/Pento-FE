'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminUsers, useDeleteAdminUser } from '../hooks/useUser';
import type { GetAdminUsersParams, AdminUserItem } from '../schema/userSchema';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { CusButton } from '@/components/ui/cusButton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Trash } from 'lucide-react';
import ConfirmModal from '@/components/decoration/ConfirmModal';
import { TableSkeleton } from '@/components/decoration/TableSkeleton';

type Props = {
    searchText?: string;
    isDeleted?: boolean;
    sortBy?: 'Id' | 'HouseholdName' | 'Email' | 'FirstName' | 'LastName' | 'CreatedAt';
    sortOrder?: 'ASC' | 'DESC';
    pageNumber: number;
    setPageNumber: (page: number) => void;
    pageSize?: number;
};

export default function UsersList({
    searchText,
    isDeleted,
    sortBy,
    sortOrder,
    pageNumber,
    setPageNumber,
    pageSize = 10
}: Props) {
    const router = useRouter();
    const [deleteUser, setDeleteUser] = useState<AdminUserItem | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const params: GetAdminUsersParams = {
        searchText,
        isDeleted,
        sortBy,
        sortOrder,
        pageNumber,
        pageSize,
    };

    const { data, isLoading, isError } = useAdminUsers(params);
    const deleteMutation = useDeleteAdminUser();

    const items = data?.items ?? [];
    const totalCount = data?.totalCount ?? 0;
    const totalPages = data?.totalPages ?? 0;
    const hasPrevious = data?.hasPrevious ?? false;
    const hasNext = data?.hasNext ?? false;

    const handleDeleteClick = (user: AdminUserItem, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteUser(user);
        setModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteUser) {
            deleteMutation.mutate(deleteUser.userId, {
                onSuccess: () => {
                    setModalOpen(false);
                    setDeleteUser(null);
                },
                onError: () => {
                    setModalOpen(false);
                    setDeleteUser(null);
                }
            });
        }
    };

    const handleCancelDelete = () => {
        setModalOpen(false);
        setDeleteUser(null);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(date);
    };

    return (
        <>
            <ConfirmModal
                open={modalOpen}
                title="Delete User"
                message={`Are you sure you want to delete "${deleteUser?.firstName} ${deleteUser?.lastName}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                loading={deleteMutation.isPending}
            />
            <WhiteCard className="w-full space-y-6" width="100%" height="auto">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold" style={{ color: '#113F67' }}>
                            Users List
                        </h2>
                        {!isLoading && data && (
                            <p className="text-sm text-gray-500">
                                {totalCount} total users
                            </p>
                        )}
                    </div>

                    {isLoading ? (
                        <TableSkeleton />
                    ) : isError ? (
                        <div className="text-center py-12 text-red-500">
                            Failed to load users. Please try again.
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <User className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p className="text-lg font-medium">No users found</p>
                            <p className="text-sm mt-2">Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <>
                            <Table className="w-full table-fixed">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='text-lg font-semibold' style={{ color: '#113F67' }}>Name</TableHead>
                                        <TableHead className='text-lg font-semibold' style={{ color: '#113F67' }}>
                                            <div className="flex items-center gap-1">
                                                Email
                                            </div>
                                        </TableHead>
                                        <TableHead className='text-lg font-semibold w-[200px]' style={{ color: '#113F67' }}>Household</TableHead>
                                        <TableHead className='text-lg font-semibold w-[150px]' style={{ color: '#113F67' }}>
                                            <div className="flex items-center gap-1">
                                                Created At
                                            </div>
                                        </TableHead>
                                        <TableHead className='text-lg font-semibold text-center w-[100px]' style={{ color: '#113F67' }}>Status</TableHead>
                                        <TableHead className='text-lg font-semibold text-center w-[100px]' style={{ color: '#113F67' }}>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((user: AdminUserItem) => (
                                        <TableRow
                                            key={user.userId}
                                            className="cursor-pointer hover:bg-gray-50"
                                        >
                                            {/* Name */}
                                            <TableCell className="font-semibold text-base" style={{ color: '#113F67' }}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="truncate">{user.firstName} {user.lastName}</p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Email */}
                                            <TableCell className="text-sm text-gray-600">
                                                <p className="truncate">{user.email}</p>
                                            </TableCell>

                                            {/* Household */}
                                            <TableCell className="text-sm text-gray-600">
                                                {user.householdName ? (
                                                    <p className="truncate">{user.householdName}</p>
                                                ) : (
                                                    <span className="text-gray-400 italic">No household</span>
                                                )}
                                            </TableCell>

                                            {/* Created At */}
                                            <TableCell className="text-sm text-gray-600">
                                                {formatDate(user.createdAt)}
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell className="text-center">
                                                <span
                                                    className="px-3 py-1 rounded-full text-xs font-semibold text-white inline-block"
                                                    style={{
                                                        backgroundColor: user.isDeleted ? '#EF4444' : '#10B981',
                                                    }}
                                                >
                                                    {user.isDeleted ? 'Deleted' : 'Active'}
                                                </span>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell onClick={(e) => e.stopPropagation()} className="text-center">
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleDeleteClick(user, e)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors inline-flex items-center justify-center"
                                                    title="Delete user"
                                                >
                                                    <Trash className="w-5 h-5" />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: '#D6E6F2' }}>
                                <p className="text-sm text-gray-500">
                                    Page {pageNumber} of {totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <CusButton
                                        type="button"
                                        onClick={() => setPageNumber(pageNumber - 1)}
                                        disabled={!hasPrevious || isLoading}
                                        variant="blueGray"
                                    >
                                        Previous
                                    </CusButton>
                                    <CusButton
                                        type="button"
                                        onClick={() => setPageNumber(pageNumber + 1)}
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
        </>
    );
}

'use client';

import React, { useState } from 'react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import FoodReferencesList from './FoodReferencesList';
import FoodRefDetailsModal from './FoodRefDetailsModal';
import FoodRefEditModal from './FoodRefEditModal';
import FoodRefCreateModal from './FoodRefCreateModal';
import ConfirmModal from '@/components/decoration/ConfirmModal';
import { FoodRef } from '../schema/foodReferenceSchema';
import { CusButton } from '@/components/ui/cusButton';
import { toast } from 'sonner';
import { FilePlus } from 'lucide-react';
import '@/styles/tab-bar.css';

export default function FoodReferencesManager() {
    const [showCreate, setShowCreate] = useState(false);
    const [detailsId, setDetailsId] = useState<string | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const [deleteItem, setDeleteItem] = useState<FoodRef | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleView = (item: FoodRef) => {
        setDetailsId(item.id);
    };

    const handleEdit = (item: FoodRef) => {
        setEditId(item.id);
    };

    const handleDelete = (item: FoodRef) => {
        setDeleteItem(item);
    };

    const confirmDelete = async () => {
        if (!deleteItem) return;
        // TODO: Implement delete API call
        toast.warning(`Delete not implemented yet for: ${deleteItem.name}`);
        setDeleteItem(null);
    };

    const handleSuccess = () => {
        setRefreshKey((k) => k + 1);
    };

    return (
        <AdminLayout>
            <div className="w-full space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-semibold" style={{ color: '#113F67' }}>
                            Food References Manager
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage food reference data for recipes and meal tracking
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <CusButton
                            variant="blueGray"
                            onClick={() => setShowCreate(true)}
                            className="flex items-center gap-2"
                        >
                            <FilePlus className="w-4 h-4" />
                            Add Food Reference
                        </CusButton>
                    </div>
                </div>

                <FoodReferencesList
                    key={refreshKey}
                    onSelect={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {/* Create Modal */}
            {showCreate && (
                <FoodRefCreateModal
                    onClose={() => setShowCreate(false)}
                    onSuccess={handleSuccess}
                />
            )}

            {/* Details Modal */}
            {detailsId && (
                <FoodRefDetailsModal
                    foodRefId={detailsId}
                    onClose={() => setDetailsId(null)}
                    onEdit={() => {
                        setDetailsId(null);
                        setEditId(detailsId);
                    }}
                />
            )}

            {/* Edit Modal */}
            {editId && (
                <FoodRefEditModal
                    foodRefId={editId}
                    onClose={() => setEditId(null)}
                    onSuccess={handleSuccess}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                open={!!deleteItem}
                title="Delete Food Reference"
                message={`Are you sure you want to delete "${deleteItem?.name}"?`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteItem(null)}
            />
        </AdminLayout>
    );
}

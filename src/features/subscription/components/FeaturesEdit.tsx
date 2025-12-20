"use client";

import React, { useState } from "react";
import { SquarePen, CirclePlus, CircleMinus, Trash } from "lucide-react";
import { CusButton } from "@/components/ui/cusButton";
import ElasticSlider from "@/components/decoration/ElasticSlider";
import { Combobox } from "@/components/ui/Combobox";
import { useFeatures } from "../hooks/useFeatures";
import ConfirmModal from "@/components/decoration/ConfirmModal";
import { EditFeatureForm } from "../schema/subscriptionSchema";

type Feature = {
    subscriptionFeatureId: string;
    featureName: string;
    entitlement: string;
};

type Props = {
    features: Feature[];
    isEditing: boolean;
    editingFeatureId: string | null;
    editFeatureForm: EditFeatureForm;
    onEditFeature: (featureId: string, entitlement: string) => void;
    onCancelEdit: () => void;
    onSaveFeature: () => void;
    onDeleteFeature: (featureId: string) => void;
    onFormChange: (form: EditFeatureForm) => void;
    isPending: boolean;
    isDeleting?: boolean;
};

export default function FeaturesEdit({
    features,
    isEditing,
    editingFeatureId,
    editFeatureForm,
    onEditFeature,
    onCancelEdit,
    onSaveFeature,
    onDeleteFeature,
    onFormChange,
    isPending,
    isDeleting = false,
}: Props) {
    // Fetch feature definitions
    const { data: featureDefinitions = [], isLoading: featuresLoading } = useFeatures();

    // Delete confirmation state
    const [deleteConfirmFeatureId, setDeleteConfirmFeatureId] = useState<string | null>(null);

    // Convert features to combobox options
    const featureOptions = featureDefinitions.map((feature) => ({
        value: feature.featureCode,
        label: feature.name,
    }));

    return (
        <div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4" style={{ color: '#113F67' }}>
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#113F67' }}></div>
                Features
            </h3>
            <div className="space-y-3">
                {features.map((feature) => {
                    const isThisFeatureEditing = editingFeatureId === feature.subscriptionFeatureId;

                    return (
                        <div
                            key={feature.subscriptionFeatureId}
                            className={`border-2 rounded-2xl p-5 transition-all shadow-md hover:shadow-lg ${isThisFeatureEditing ? 'shadow-xl' : ''}`}
                            style={{
                                borderColor: isThisFeatureEditing ? '#3B82F6' : '#D6E6F2',
                                backgroundColor: isThisFeatureEditing ? '#F8FBFE' : 'white'
                            }}
                        >
                            {isThisFeatureEditing ? (
                                <div className="space-y-4">
                                    {/* Feature Code Combobox */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: '#113F67' }}>Feature</label>
                                        <Combobox
                                            options={featureOptions}
                                            value={editFeatureForm.featureCode || null}
                                            onChange={(value) => onFormChange({ ...editFeatureForm, featureCode: value || '' })}
                                            placeholder="Select a feature..."
                                            searchPlaceholder="Search features..."
                                            emptyText="No features found"
                                            disabled={featuresLoading}
                                        />
                                        {featuresLoading && (
                                            <p className="text-xs text-gray-500 mt-1">Loading features...</p>
                                        )}
                                    </div>

                                    {/* Quota Slider */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-semibold" style={{ color: '#113F67' }}>Quota</label>
                                            <span className="text-lg font-bold" style={{ color: '#113F67' }}>
                                                {editFeatureForm.quota === 101 ? "Unlimited" : editFeatureForm.quota.toString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => onFormChange({ ...editFeatureForm, quota: Math.max(1, editFeatureForm.quota - 1) })}
                                                disabled={editFeatureForm.quota <= 1}
                                            >
                                                <CircleMinus className="w-5 h-5" style={{ color: '#113F67' }} />
                                            </button>
                                            <div className="flex-1" style={{ position: 'relative' }}>
                                                <style>{`.slider-container .value-indicator { display: none; }`}</style>
                                                <ElasticSlider
                                                    defaultValue={editFeatureForm.quota}
                                                    startingValue={1}
                                                    maxValue={101}
                                                    isStepped
                                                    stepSize={1}
                                                    leftIcon={<span />}
                                                    rightIcon={<span />}
                                                    valueFormatter={(val) => val === 101 ? "Unlimited" : val.toString()}
                                                    onChange={(value) => onFormChange({ ...editFeatureForm, quota: Math.max(1, Math.round(value)) })}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => onFormChange({ ...editFeatureForm, quota: Math.min(101, editFeatureForm.quota + 1) })}
                                            >
                                                <CirclePlus className="w-5 h-5" style={{ color: '#113F67' }} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Reset Period Select */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: '#113F67' }}>Reset Period</label>
                                        <select
                                            value={editFeatureForm.quota === 101 ? '' : editFeatureForm.resetPeriod}
                                            onChange={(e) => onFormChange({ ...editFeatureForm, resetPeriod: e.target.value })}
                                            className="neomorphic-input w-full"
                                            disabled={editFeatureForm.quota === 101}
                                        >
                                            <option value="">No Reset</option>
                                            <option value="Day">Day</option>
                                            <option value="Week">Week</option>
                                            <option value="Month">Month</option>
                                            <option value="Year">Year</option>
                                        </select>
                                        {editFeatureForm.quota === 101 && (
                                            <p className="text-xs text-gray-500 mt-1">Reset period is disabled for unlimited quota</p>
                                        )}
                                    </div>

                                    <div className="flex gap-2 justify-end pt-2 border-t" style={{ borderColor: '#D6E6F2' }}>
                                        <CusButton variant="pastelRed" size="sm" onClick={onCancelEdit}>
                                            Cancel
                                        </CusButton>
                                        <CusButton variant="blueGray" size="sm" onClick={onSaveFeature} disabled={isPending}>
                                            {isPending ? 'Saving...' : 'Save'}
                                        </CusButton>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{feature.featureName}</p>
                                        <p className="text-sm text-gray-500">{feature.entitlement}</p>
                                    </div>
                                    {!isEditing && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onEditFeature(feature.subscriptionFeatureId, feature.entitlement)}
                                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                style={{ color: '#113F67' }}
                                            >
                                                <SquarePen className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirmFeatureId(feature.subscriptionFeatureId)}
                                                disabled={isDeleting}
                                                className="p-2 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                                style={{ color: '#EF4444' }}
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <ConfirmModal
                open={deleteConfirmFeatureId !== null}
                title="Delete Feature"
                message="Are you sure you want to delete this feature? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={() => {
                    if (deleteConfirmFeatureId) {
                        onDeleteFeature(deleteConfirmFeatureId);
                        setDeleteConfirmFeatureId(null);
                    }
                }}
                onCancel={() => setDeleteConfirmFeatureId(null)}
                loading={isDeleting}
            />
        </div>
    );
}

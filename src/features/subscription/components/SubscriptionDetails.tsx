"use client";

import React, { useState } from "react";
import { X, SquarePen, Check, XIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CusButton } from "@/components/ui/cusButton";
import { useSubscriptionById, useSubscription } from "../hooks/useSubscription";
import { EditSubForm, EditPlanForm, EditFeatureForm } from "../schema/subscriptionSchema";
import "@/styles/toggle.css";

type Props = {
    subscriptionId: string | null;
    onClose: () => void;
};

type EditMode = 'none' | 'subscription' | 'plan' | 'feature';

export default function SubscriptionDetails({ subscriptionId, onClose }: Props) {
    const { data: subscription, isLoading } = useSubscriptionById(subscriptionId);
    const { updateSubscription, updatePlan, updateFeature } = useSubscription();

    // Edit mode state
    const [editMode, setEditMode] = useState<EditMode>('none');
    const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
    const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);

    // Edit forms state
    const [editSubForm, setEditSubForm] = useState<EditSubForm>({ name: "", description: "", isActive: true });
    const [editPlanForm, setEditPlanForm] = useState<EditPlanForm>({ planId: "", amount: 0, currency: "VND", durationInDays: 0 });
    const [editFeatureForm, setEditFeatureForm] = useState<EditFeatureForm>({ featureId: "", featureCode: "", quota: 0, resetPeriod: "" });

    // Edit handlers
    const handleEditSubscription = () => {
        if (!subscription) return;
        setEditSubForm({
            name: subscription.name,
            description: subscription.description || "",
            isActive: subscription.isActive,
        });
        setEditMode('subscription');
    };

    const handleEditPlan = (planId: string, price: string, duration: string) => {
        const amount = parseInt(price.replace(/[^\d]/g, '')) || 0;
        const durationInDays = parseInt(duration.match(/\d+/)?.[0] || '0');

        setEditPlanForm({ planId, amount, currency: "VND", durationInDays });
        setEditingPlanId(planId);
        setEditMode('plan');
    };

    const handleEditFeature = (featureId: string, entitlement: string) => {
        const unlimitedMatch = entitlement.match(/unlimited|unlocked/i);
        const quotaMatch = entitlement.match(/(\d+)/);
        const resetPeriodMatch = entitlement.match(/(Day|Week|Month|Year)/i);

        setEditFeatureForm({
            featureId,
            featureCode: "",
            quota: unlimitedMatch ? 0 : (quotaMatch ? parseInt(quotaMatch[1]) : 0),
            resetPeriod: resetPeriodMatch ? resetPeriodMatch[1] : "",
        });
        setEditingFeatureId(featureId);
        setEditMode('feature');
    };

    const handleCancelEdit = () => {
        setEditMode('none');
        setEditingPlanId(null);
        setEditingFeatureId(null);
    };

    const handleSaveSubscription = async () => {
        if (!subscriptionId) return;

        await updateSubscription.mutateAsync({
            subscriptionId,
            payload: editSubForm,
        });
        setEditMode('none');
    };

    const handleSavePlan = async () => {
        await updatePlan.mutateAsync({
            subscriptionPlanId: editPlanForm.planId,
            payload: {
                amount: editPlanForm.amount,
                currency: editPlanForm.currency,
                durationInDays: editPlanForm.durationInDays,
            },
        });
        setEditMode('none');
        setEditingPlanId(null);
    };

    const handleSaveFeature = async () => {
        const payload: any = {};
        if (editFeatureForm.featureCode) payload.featureCode = editFeatureForm.featureCode;
        if (editFeatureForm.quota !== undefined) payload.entitlementQuota = editFeatureForm.quota;
        if (editFeatureForm.resetPeriod) payload.entitlementResetPer = editFeatureForm.resetPeriod;

        await updateFeature.mutateAsync({
            subscriptionFeatureId: editFeatureForm.featureId,
            payload,
        });
        setEditMode('none');
        setEditingFeatureId(null);
    };

    const isEditing = editMode !== 'none';
    const isEditingSubscription = editMode === 'subscription';
    const isEditingPlan = editMode === 'plan';
    const isEditingFeature = editMode === 'feature';

    if (!subscriptionId) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border flex flex-col max-h-[90vh]"
                style={{ borderColor: '#D6E6F2' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-8 pb-4 border-b-2 flex-shrink-0" style={{ borderColor: '#D6E6F2' }}>
                    <h2 className="text-3xl font-bold" style={{ color: '#113F67' }}>Subscription Details</h2>
                    <button
                        onClick={onClose}
                        disabled={isEditing}
                        className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ color: '#113F67' }}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-8 pt-6">
                    {isLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-1/2" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-40 w-full" />
                        </div>
                    ) : subscription ? (
                        <div className="space-y-6">
                            {/* Basic Info Section */}
                            <div className={`transition-all duration-300 ${isEditing && !isEditingSubscription ? 'opacity-40 pointer-events-none' : ''}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: '#113F67' }}>
                                        <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#113F67' }}></div>
                                        Basic Information
                                    </h3>
                                    {!isEditingSubscription && !isEditing && (
                                        <button
                                            onClick={handleEditSubscription}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl hover:bg-blue-50 transition-all shadow-sm border"
                                            style={{ color: '#113F67', borderColor: '#D6E6F2' }}
                                        >
                                            <SquarePen className="w-4 h-4" />
                                            Edit
                                        </button>
                                    )}
                                </div>

                                {isEditingSubscription ? (
                                    <div className="space-y-4 p-6 border-2 rounded-2xl shadow-lg" style={{ borderColor: '#3B82F6', backgroundColor: '#F8FBFE' }}>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2" style={{ color: '#113F67' }}>
                                                Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={editSubForm.name}
                                                onChange={(e) => setEditSubForm({ ...editSubForm, name: e.target.value })}
                                                className="neomorphic-input w-full"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2" style={{ color: '#113F67' }}>Description</label>
                                            <textarea
                                                value={editSubForm.description}
                                                onChange={(e) => setEditSubForm({ ...editSubForm, description: e.target.value })}
                                                className="neomorphic-textarea w-full min-h-[96px]"
                                            />
                                        </div>
                                        <div className="flex items-center justify-end gap-3">
                                            <span className="font-semibold text-lg" style={{ color: '#113F67' }}>Status:</span>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={editSubForm.isActive}
                                                    onChange={(e) => setEditSubForm({ ...editSubForm, isActive: e.target.checked })}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                            <span className="font-semibold text-lg" style={{ color: editSubForm.isActive ? '#67C090' : '#FFA07A' }}>
                                                {editSubForm.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex gap-2 justify-end pt-2 border-t" style={{ borderColor: '#D6E6F2' }}>
                                            <CusButton variant="pastelRed" size="sm" onClick={handleCancelEdit}>
                                                <XIcon className="w-4 h-4 mr-1" />
                                                Cancel
                                            </CusButton>
                                            <CusButton variant="blueGray" size="sm" onClick={handleSaveSubscription} disabled={updateSubscription.isPending}>
                                                <Check className="w-4 h-4 mr-1" />
                                                {updateSubscription.isPending ? 'Saving...' : 'Save'}
                                            </CusButton>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border" style={{ borderColor: '#D6E6F2' }}>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Name</label>
                                            <p className="font-semibold text-lg mt-1" style={{ color: '#113F67' }}>{subscription.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Status</label>
                                            <p className="font-semibold text-lg mt-1" style={{ color: subscription.isActive ? '#67C090' : '#FFA07A' }}>
                                                {subscription.isActive ? "Active" : "Inactive"}
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Description</label>
                                            <p className="font-medium text-gray-700 mt-1">{subscription.description || "No description"}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Plans Section */}
                            {subscription.plans && subscription.plans.length > 0 && (
                                <div className={`transition-all duration-300 ${isEditing && !isEditingPlan ? 'opacity-40 pointer-events-none' : ''}`}>
                                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4" style={{ color: '#113F67' }}>
                                        <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#113F67' }}></div>
                                        Plans
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {subscription.plans.map((plan: any) => {
                                            const isThisPlanEditing = isEditingPlan && editingPlanId === plan.subscriptionPlanId;

                                            return (
                                                <div
                                                    key={plan.subscriptionPlanId}
                                                    className={`border-2 rounded-2xl p-5 transition-all shadow-md hover:shadow-lg ${isThisPlanEditing ? 'shadow-xl' : ''}`}
                                                    style={{
                                                        borderColor: isThisPlanEditing ? '#3B82F6' : '#D6E6F2',
                                                        backgroundColor: isThisPlanEditing ? '#F8FBFE' : 'white'
                                                    }}
                                                >
                                                    {isThisPlanEditing ? (
                                                        <div className="space-y-3">
                                                            <div>
                                                                <label className="block text-sm font-semibold mb-2" style={{ color: '#113F67' }}>
                                                                    Amount <span className="text-red-500">*</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    value={editPlanForm.amount}
                                                                    onChange={(e) => setEditPlanForm({ ...editPlanForm, amount: parseInt(e.target.value) || 0 })}
                                                                    className="neomorphic-input w-full"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-semibold mb-2" style={{ color: '#113F67' }}>
                                                                    Currency <span className="text-red-500">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={editPlanForm.currency}
                                                                    onChange={(e) => setEditPlanForm({ ...editPlanForm, currency: e.target.value })}
                                                                    className="neomorphic-input w-full"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-semibold mb-2" style={{ color: '#113F67' }}>
                                                                    Duration (days) <span className="text-red-500">*</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    value={editPlanForm.durationInDays}
                                                                    onChange={(e) => setEditPlanForm({ ...editPlanForm, durationInDays: parseInt(e.target.value) || 0 })}
                                                                    className="neomorphic-input w-full"
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="flex gap-2 justify-end pt-2 border-t" style={{ borderColor: '#D6E6F2' }}>
                                                                <CusButton variant="pastelRed" size="sm" onClick={handleCancelEdit}>
                                                                    <XIcon className="w-3 h-3 mr-1" />
                                                                    Cancel
                                                                </CusButton>
                                                                <CusButton variant="blueGray" size="sm" onClick={handleSavePlan} disabled={updatePlan.isPending}>
                                                                    <Check className="w-3 h-3 mr-1" />
                                                                    {updatePlan.isPending ? 'Saving...' : 'Save'}
                                                                </CusButton>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="font-semibold text-lg">{plan.price}</p>
                                                                <p className="text-sm text-gray-500">{plan.duration}</p>
                                                            </div>
                                                            {!isEditing && (
                                                                <button
                                                                    onClick={() => handleEditPlan(plan.subscriptionPlanId, plan.price, plan.duration)}
                                                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                                    style={{ color: '#113F67' }}
                                                                >
                                                                    <SquarePen className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Features Section */}
                            {subscription.features && subscription.features.length > 0 && (
                                <div className={`transition-all duration-300 ${isEditing && !isEditingFeature ? 'opacity-40 pointer-events-none' : ''}`}>
                                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4" style={{ color: '#113F67' }}>
                                        <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#113F67' }}></div>
                                        Features
                                    </h3>
                                    <div className="space-y-3">
                                        {subscription.features.map((feature: any) => {
                                            const isThisFeatureEditing = isEditingFeature && editingFeatureId === feature.subscriptionFeatureId;

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
                                                        <div className="space-y-3">
                                                            <div>
                                                                <label className="block text-sm font-semibold mb-2" style={{ color: '#113F67' }}>Feature Code</label>
                                                                <input
                                                                    type="text"
                                                                    value={editFeatureForm.featureCode}
                                                                    onChange={(e) => setEditFeatureForm({ ...editFeatureForm, featureCode: e.target.value })}
                                                                    className="neomorphic-input w-full"
                                                                    placeholder="Leave empty to keep current"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-semibold mb-2" style={{ color: '#113F67' }}>Quota</label>
                                                                <input
                                                                    type="number"
                                                                    value={editFeatureForm.quota}
                                                                    onChange={(e) => setEditFeatureForm({ ...editFeatureForm, quota: parseInt(e.target.value) || 0 })}
                                                                    className="neomorphic-input w-full"
                                                                    placeholder="0 for unlimited"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-semibold mb-2" style={{ color: '#113F67' }}>Reset Period</label>
                                                                <select
                                                                    value={editFeatureForm.resetPeriod}
                                                                    onChange={(e) => setEditFeatureForm({ ...editFeatureForm, resetPeriod: e.target.value })}
                                                                    className="neomorphic-input w-full"
                                                                >
                                                                    <option value="">No Reset</option>
                                                                    <option value="Day">Day</option>
                                                                    <option value="Week">Week</option>
                                                                    <option value="Month">Month</option>
                                                                    <option value="Year">Year</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex gap-2 justify-end pt-2 border-t" style={{ borderColor: '#D6E6F2' }}>
                                                                <CusButton variant="pastelRed" size="sm" onClick={handleCancelEdit}>
                                                                    <XIcon className="w-3 h-3 mr-1" />
                                                                    Cancel
                                                                </CusButton>
                                                                <CusButton variant="blueGray" size="sm" onClick={handleSaveFeature} disabled={updateFeature.isPending}>
                                                                    <Check className="w-3 h-3 mr-1" />
                                                                    {updateFeature.isPending ? 'Saving...' : 'Save'}
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
                                                                <button
                                                                    onClick={() => handleEditFeature(feature.subscriptionFeatureId, feature.entitlement)}
                                                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                                    style={{ color: '#113F67' }}
                                                                >
                                                                    <SquarePen className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {(!subscription.plans || subscription.plans.length === 0) &&
                                (!subscription.features || subscription.features.length === 0) && (
                                    <div className="text-center py-8 text-gray-500">
                                        No plans or features added yet
                                    </div>
                                )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            Failed to load subscription details
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}

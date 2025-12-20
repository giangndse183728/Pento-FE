"use client";

import React, { useState } from "react";
import { SquarePen, CirclePlus, CircleMinus, Trash } from "lucide-react";
import { CusButton } from "@/components/ui/cusButton";
import ElasticSlider from "@/components/decoration/ElasticSlider";
import ConfirmModal from "@/components/decoration/ConfirmModal";
import { EditPlanForm } from "../schema/subscriptionSchema";

type Plan = {
    subscriptionPlanId: string;
    price: string;
    duration: string;
};

type Props = {
    plans: Plan[];
    isEditing: boolean;
    editingPlanId: string | null;
    editPlanForm: EditPlanForm;
    onEditPlan: (planId: string, price: string, duration: string) => void;
    onCancelEdit: () => void;
    onSavePlan: () => void;
    onDeletePlan: (planId: string) => void;
    onFormChange: (form: EditPlanForm) => void;
    isPending: boolean;
    isDeleting?: boolean;
};

export default function PlansEdit({
    plans,
    isEditing,
    editingPlanId,
    editPlanForm,
    onEditPlan,
    onCancelEdit,
    onSavePlan,
    onDeletePlan,
    onFormChange,
    isPending,
    isDeleting = false,
}: Props) {
    const [deleteConfirmPlanId, setDeleteConfirmPlanId] = useState<string | null>(null);

    return (
        <div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4" style={{ color: '#113F67' }}>
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#113F67' }}></div>
                Plans
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan) => {
                    const isThisPlanEditing = editingPlanId === plan.subscriptionPlanId;

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
                                <div className="space-y-4">
                                    {/* Amount Slider */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-semibold" style={{ color: '#113F67' }}>
                                                Amount <span className="text-red-500">*</span>
                                            </label>
                                            <span className="text-lg font-bold" style={{ color: '#113F67' }}>
                                                {editPlanForm.amount.toLocaleString()} {editPlanForm.currency}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => onFormChange({ ...editPlanForm, amount: Math.max(0, editPlanForm.amount - 500) })}
                                            >
                                                <CircleMinus className="w-5 h-5" style={{ color: '#113F67' }} />
                                            </button>
                                            <div className="flex-1" style={{ position: 'relative' }}>
                                                <style>{`.slider-container .value-indicator { display: none; }`}</style>
                                                <ElasticSlider
                                                    defaultValue={editPlanForm.amount}
                                                    startingValue={0}
                                                    maxValue={1000000}
                                                    isStepped
                                                    stepSize={500}
                                                    leftIcon={<span />}
                                                    rightIcon={<span />}
                                                    valueSuffix={` ${editPlanForm.currency}`}
                                                    valueFormatter={(val) => val.toLocaleString()}
                                                    onChange={(value) => onFormChange({ ...editPlanForm, amount: value })}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => onFormChange({ ...editPlanForm, amount: Math.min(1000000, editPlanForm.amount + 500) })}
                                            >
                                                <CirclePlus className="w-5 h-5" style={{ color: '#113F67' }} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Currency Input */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: '#113F67' }}>
                                            Currency <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={editPlanForm.currency}
                                            onChange={(e) => onFormChange({ ...editPlanForm, currency: e.target.value })}
                                            className="neomorphic-input w-full"
                                            required
                                        />
                                    </div>

                                    {/* Duration Slider */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-semibold" style={{ color: '#113F67' }}>
                                                Duration <span className="text-red-500">*</span>
                                            </label>
                                            <span className="text-lg font-bold" style={{ color: '#113F67' }}>
                                                {editPlanForm.durationInDays === 366 ? "For Lifetime" : `${editPlanForm.durationInDays.toLocaleString()} days`}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => onFormChange({ ...editPlanForm, durationInDays: Math.max(1, editPlanForm.durationInDays - 1) })}
                                            >
                                                <CircleMinus className="w-5 h-5" style={{ color: '#113F67' }} />
                                            </button>
                                            <div className="flex-1" style={{ position: 'relative' }}>
                                                <style>{`.slider-container .value-indicator { display: none; }`}</style>
                                                <ElasticSlider
                                                    defaultValue={editPlanForm.durationInDays}
                                                    startingValue={1}
                                                    maxValue={366}
                                                    isStepped
                                                    stepSize={1}
                                                    leftIcon={<span />}
                                                    rightIcon={<span />}
                                                    valueFormatter={(val) => val === 366 ? "For Lifetime" : `${val.toLocaleString()} days`}
                                                    onChange={(value) => onFormChange({ ...editPlanForm, durationInDays: value })}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => onFormChange({ ...editPlanForm, durationInDays: Math.min(366, editPlanForm.durationInDays + 1) })}
                                            >
                                                <CirclePlus className="w-5 h-5" style={{ color: '#113F67' }} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 justify-end pt-2 border-t" style={{ borderColor: '#D6E6F2' }}>
                                        <CusButton variant="pastelRed" size="sm" onClick={onCancelEdit}>
                                            Cancel
                                        </CusButton>
                                        <CusButton variant="blueGray" size="sm" onClick={onSavePlan} disabled={isPending}>
                                            {isPending ? 'Saving...' : 'Save'}
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
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onEditPlan(plan.subscriptionPlanId, plan.price, plan.duration)}
                                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                style={{ color: '#113F67' }}
                                            >
                                                <SquarePen className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirmPlanId(plan.subscriptionPlanId)}
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
                open={deleteConfirmPlanId !== null}
                title="Delete Plan"
                message="Are you sure you want to delete this plan? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={() => {
                    if (deleteConfirmPlanId) {
                        onDeletePlan(deleteConfirmPlanId);
                        setDeleteConfirmPlanId(null);
                    }
                }}
                onCancel={() => setDeleteConfirmPlanId(null)}
                loading={isDeleting}
            />
        </div>
    );
}

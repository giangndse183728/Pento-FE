"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import ConfirmModal from "@/components/decoration/ConfirmModal";
import { CusButton } from "@/components/ui/cusButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, X } from "lucide-react";
import { Subscription, deleteSubscriptionAdmin } from "../services/subscriptionService";
import { useSubscriptionById } from "../hooks/useSubscription";
import "@/styles/visa-card.css";

type Props = {
    subscriptions: Subscription[];
    loading?: boolean;
    onDeleted?: () => void;
};

export default function SubscriptionList({ subscriptions, loading = false, onDeleted }: Props) {
    const [deleteMode, setDeleteMode] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const { data: expandedSubscription, isLoading: isLoadingExpanded } = useSubscriptionById(expandedId);

    const handleDeleteClick = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!id) {
            toast.error("Missing subscription id");
            return;
        }
        setSelectedId(id);
        setModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedId) {
            console.warn("No selectedId when confirming delete");
            return;
        }
        try {
            setIsDeleting(true);
            console.log("Calling deleteSubscriptionAdmin for", selectedId);
            await deleteSubscriptionAdmin(selectedId);
            setModalOpen(false);
            setSelectedId(null);
            setIsDeleting(false);
            toast.success("Subscription deleted");
            onDeleted?.();
        } catch (err) {
            setIsDeleting(false);
            setModalOpen(false);
            setSelectedId(null);
            console.error("Failed to delete subscription", err);

            // Handle API error response
            const errorMessage = (err as { response?: { data?: { detail?: string; title?: string } }; message?: string })?.response?.data?.detail ||
                (err as { response?: { data?: { detail?: string; title?: string } }; message?: string })?.response?.data?.title ||
                (err as { response?: { data?: { detail?: string; title?: string } }; message?: string })?.message ||
                'Failed to delete subscription';
            toast.error(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="card-container">
                        <div className="credit-card">
                            <div className="inner">
                                <div className="magnetic-strip"></div>
                                <div className="number-label">SUBSCRIPTION NAME</div>
                                <Skeleton className="h-6 w-2/3 rounded-md" />
                                <div className="card-details mt-2">
                                    <div>
                                        <label>DESCRIPTION</label>
                                        <Skeleton className="h-4 w-3/4 rounded-md" />
                                    </div>
                                    <div>
                                        <label>STATUS</label>
                                        <Skeleton className="h-4 w-24 rounded-md" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl space-y-6">
            {/* Delete toggle */}
            <div className="flex justify-end">
                <CusButton
                    variant={deleteMode ? "red" : "pastelRed"}
                    size="sm"
                    onClick={() => setDeleteMode(!deleteMode)}
                    className="gap-2"
                >
                    <Trash2 className="w-4 h-4" />
                    {deleteMode ? "Done" : "Delete Subscriptions"}
                </CusButton>
            </div>

            {/* Confirm modal */}
            <ConfirmModal
                open={modalOpen}
                title="Delete Subscription"
                message="Are you sure you want to delete this subscription?"
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setModalOpen(false);
                    setSelectedId(null);
                }}
                loading={isDeleting}
            />

            {/* Grid of subscription cards using visa-card.css with overlay delete */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subscriptions.map((sub) => (
                    <div key={sub.id ?? sub.subscriptionId} className="card-container relative">
                        {deleteMode && (
                            <button
                                onClick={(e) => handleDeleteClick(sub.id ?? sub.subscriptionId ?? "", e)}
                                className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                                aria-label="Delete subscription"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                        <div
                            onClick={() => !deleteMode && setExpandedId(sub.id ?? sub.subscriptionId ?? null)}
                            className={`credit-card transition-all duration-300 ${deleteMode
                                ? "ring-1 ring-red-300 hover:ring-2 hover:ring-red-400 hover:shadow-red-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                                : "hover:shadow-xl hover:shadow-blue-200/50 hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.99] cursor-pointer"
                                }`}
                        >
                            <div className="inner">
                                <div className="magnetic-strip"></div>
                                <div className="number-label">SUBSCRIPTION NAME</div>
                                <div className="card-number">{sub.name}</div>
                                <div className="card-details">
                                    <div>
                                        <label>DESCRIPTION</label>
                                        <span className="card-name">{sub.description || "No description"}</span>
                                    </div>
                                    <div>
                                        <label>STATUS</label>
                                        <span className="card-date">{sub.isActive ? "ACTIVE" : "INACTIVE"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Expanded Details Modal */}
            {expandedId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setExpandedId(null)}>
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold" style={{ color: '#113F67' }}>Subscription Details</h2>
                            <button
                                onClick={() => setExpandedId(null)}
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {isLoadingExpanded ? (
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-1/2" />
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-40 w-full" />
                            </div>
                        ) : expandedSubscription ? (
                            <div className="space-y-6">
                                {/* Basic Info */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#113F67' }}>Basic Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-500">Name</label>
                                            <p className="font-medium">{expandedSubscription.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">Status</label>
                                            <p className="font-medium">{expandedSubscription.isActive ? "Active" : "Inactive"}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-sm text-gray-500">Description</label>
                                            <p className="font-medium">{expandedSubscription.description || "No description"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Plans */}
                                {expandedSubscription.plans && expandedSubscription.plans.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2" style={{ color: '#113F67' }}>Plans</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {expandedSubscription.plans.map((plan) => (
                                                <div key={plan.subscriptionPlanId} className="border rounded-lg p-4" style={{ borderColor: '#D6E6F2' }}>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-semibold text-lg">
                                                                {plan.price}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {plan.duration}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Features */}
                                {expandedSubscription.features && expandedSubscription.features.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2" style={{ color: '#113F67' }}>Features</h3>
                                        <div className="space-y-2">
                                            {expandedSubscription.features.map((feature) => (
                                                <div key={feature.subscriptionFeatureId} className="border rounded-lg p-4" style={{ borderColor: '#D6E6F2' }}>
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-medium">{feature.featureName}</p>
                                                            <p className="text-sm text-gray-500">{feature.entitlement}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(!expandedSubscription.plans || expandedSubscription.plans.length === 0) &&
                                    (!expandedSubscription.features || expandedSubscription.features.length === 0) && (
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
            )}
        </div>
    );
}

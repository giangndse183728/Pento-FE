"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ColorTheme } from "@/constants/color";
import { SquarePen, Trash2, Plus, ImageIcon } from "lucide-react";
import { CusButton } from "@/components/ui/cusButton";
import ConfirmModal from "@/components/decoration/ConfirmModal";
import { useUpdateRecipeDirection, useDeleteRecipeDirection, useCreateRecipeDirection, useUploadRecipeDirectionImage } from "../../hooks/useRecipes";
import { UpdateRecipeDirectionInput } from "../../schema/recipeSchema";
import "@/styles/img-preview.css";

type Direction = {
    directionId?: string;
    stepNumber: number;
    description: string;
    imageUrl?: string | null;
};

type Props = {
    directions: Direction[];
    recipeId: string;
    isEditMode: boolean;
};

export default function DirectionsTab({ directions, recipeId, isEditMode }: Props) {
    const updateMutation = useUpdateRecipeDirection();
    const deleteMutation = useDeleteRecipeDirection();
    const createMutation = useCreateRecipeDirection();
    const uploadImageMutation = useUploadRecipeDirectionImage();

    // Hidden file input ref for image upload
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingDirectionId, setUploadingDirectionId] = useState<string | null>(null);

    // Edit modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingDirection, setEditingDirection] = useState<Direction | null>(null);
    const [editForm, setEditForm] = useState<{ description: string }>({
        description: ""
    });

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingDirection, setDeletingDirection] = useState<Direction | null>(null);

    // Add direction state
    const [showAddSection, setShowAddSection] = useState(false);
    const [newDirection, setNewDirection] = useState<{ description: string; imageUrl: string }>({
        description: "",
        imageUrl: ""
    });

    // Handle image upload trigger
    const handleImageUploadClick = (directionId: string) => {
        setUploadingDirectionId(directionId);
        fileInputRef.current?.click();
    };

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && uploadingDirectionId) {
            uploadImageMutation.mutate(
                { directionId: uploadingDirectionId, file },
                {
                    onSettled: () => {
                        setUploadingDirectionId(null);
                        // Reset the file input
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                    }
                }
            );
        }
    };

    const handleEditClick = (d: Direction) => {
        setEditingDirection(d);
        setEditForm({ description: d.description });
        setEditModalOpen(true);
    };

    const handleEditConfirm = () => {
        if (!editingDirection?.directionId) return;

        const payload: UpdateRecipeDirectionInput = {
            description: editForm.description
        };

        updateMutation.mutate(
            { directionId: editingDirection.directionId, payload },
            {
                onSuccess: () => {
                    setEditModalOpen(false);
                    setEditingDirection(null);
                }
            }
        );
    };

    const handleDeleteClick = (d: Direction) => {
        setDeletingDirection(d);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!deletingDirection?.directionId) return;

        deleteMutation.mutate(deletingDirection.directionId, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setDeletingDirection(null);
            },
            onError: () => {
                setDeleteModalOpen(false);
                setDeletingDirection(null);
            }
        });
    };

    const handleAddDirection = () => {
        if (!newDirection.description.trim()) return;

        const nextStepNumber = directions.length > 0
            ? Math.max(...directions.map(d => d.stepNumber)) + 1
            : 1;

        createMutation.mutate(
            {
                recipeId,
                stepNumber: nextStepNumber,
                description: newDirection.description.trim(),
                imageUrl: newDirection.imageUrl.trim() || null,
            },
            {
                onSuccess: () => {
                    setNewDirection({ description: "", imageUrl: "" });
                    setShowAddSection(false);
                }
            }
        );
    };

    return (
        <>
            {/* Hidden file input for image upload */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />

            <div className="prose prose-slate max-w-none">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/assets/img/directions.png"
                            alt="Directions"
                            width={32}
                            height={32}
                            className="w-8 h-8"
                        />
                        <h2 className="text-3xl font-bold m-0" style={{ color: ColorTheme.darkBlue }}>
                            Directions
                        </h2>
                    </div>
                    {isEditMode && (
                        <CusButton
                            variant={showAddSection ? "pastelRed" : "blueGray"}
                            size="sm"
                            onClick={() => setShowAddSection(!showAddSection)}
                            className="flex items-center gap-2"
                        >
                            <Plus className={`w-4 h-4 transition-transform ${showAddSection ? 'rotate-45' : ''}`} />
                            {showAddSection ? 'Close' : 'Add Direction'}
                        </CusButton>
                    )}
                </div>

                {/* Add Direction Section */}
                {showAddSection && (
                    <div className="mb-8 p-6 rounded-2xl border-2 border-dashed" style={{ borderColor: ColorTheme.powderBlue, backgroundColor: 'rgba(214, 230, 242, 0.2)' }}>
                        <h3 className="text-lg font-semibold mb-4" style={{ color: ColorTheme.darkBlue }}>Add New Direction</h3>
                        <div className="flex flex-row gap-4 items-start">
                            {/* Left side: Step number + Description */}
                            <div className="flex flex-col gap-4 flex-1">
                                <div className="flex flex-row gap-2 items-center">
                                    <label className="font-semibold w-24" style={{ color: ColorTheme.darkBlue, fontSize: "1rem" }}>Step</label>
                                    <div
                                        className="h-10 w-10 rounded-full text-white grid place-items-center text-sm font-semibold"
                                        style={{ backgroundColor: ColorTheme.powderBlue }}
                                    >
                                        {directions.length > 0 ? Math.max(...directions.map(d => d.stepNumber)) + 1 : 1}
                                    </div>
                                </div>
                                <div className="flex flex-row gap-2 items-start">
                                    <label className="font-semibold w-24 pt-3" style={{ color: ColorTheme.darkBlue, fontSize: "1rem" }}>Description</label>
                                    <textarea
                                        className="neomorphic-textarea flex-1 overflow-hidden min-h-[250px]"
                                        placeholder="Step description"
                                        value={newDirection.description}
                                        autoComplete="off"
                                        onChange={(e) => setNewDirection({ ...newDirection, description: e.target.value })}
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = 'auto';
                                            target.style.height = target.scrollHeight + 'px';
                                        }}
                                        disabled={createMutation.isPending}
                                    />
                                </div>
                            </div>

                            {/* Right side: Image preview card */}
                            <div className="flex flex-col gap-2">
                                <div className="card" style={{ width: '320px', height: '320px', margin: '0' }}>
                                    <div className="tools">
                                        <div className="circle">
                                            <span className="red box"></span>
                                        </div>
                                        <div className="circle">
                                            <span className="yellow box"></span>
                                        </div>
                                        <div className="circle">
                                            <span className="green box"></span>
                                        </div>
                                        <input
                                            type="text"
                                            className="address-bar"
                                            placeholder="Image URL"
                                            value={newDirection.imageUrl}
                                            autoComplete="off"
                                            onChange={(e) => setNewDirection({ ...newDirection, imageUrl: e.target.value })}
                                            disabled={createMutation.isPending}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            height: "calc(100% - 60px)",
                                            overflow: "hidden",
                                            borderRadius: "12px",
                                            position: "relative",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {newDirection.imageUrl && newDirection.imageUrl.trim() !== "" ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={newDirection.imageUrl}
                                                alt="Step preview"
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "100%",
                                                    objectFit: "contain",
                                                    borderRadius: "12px",
                                                }}
                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                            />
                                        ) : (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src="/assets/img/placeholder.jpg"
                                                alt="Placeholder"
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "100%",
                                                    objectFit: "contain",
                                                    borderRadius: "12px",
                                                    opacity: 0.5,
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <CusButton
                                variant="blueGray"
                                onClick={handleAddDirection}
                                disabled={createMutation.isPending || !newDirection.description.trim()}
                            >
                                {createMutation.isPending ? 'Adding...' : 'Confirm Add Direction'}
                            </CusButton>
                        </div>
                    </div>
                )}

                {directions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">No directions added yet.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {directions.map((d, idx) => (
                            <React.Fragment key={d.directionId ?? idx}>
                                <div className="flex flex-col gap-4 p-4 rounded-2xl bg-gray-50/50">
                                    {/* Remove button - top right */}
                                    {d.directionId && isEditMode && (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEditClick(d)}
                                                className="
                                                    flex items-center gap-2
                                                    px-3 py-2 rounded-full shrink-0 
                                                    bg-blue-50 hover:bg-blue-100 
                                                    text-blue-500 hover:text-blue-600 
                                                    transition-colors"
                                                aria-label="Edit step"
                                            >
                                                <SquarePen className="w-4 h-4" />
                                                <span className="text-xs font-medium">Edit</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteClick(d)}
                                                className="
                                                    flex items-center gap-2
                                                    px-3 py-2 rounded-full shrink-0 
                                                    bg-red-50 hover:bg-red-100 
                                                    text-red-500 hover:text-red-600 
                                                    transition-colors"
                                                aria-label="Remove step"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span className="text-xs font-medium">Remove</span>
                                            </button>
                                        </div>
                                    )}

                                    {/* Content row: description + image */}
                                    <div className="flex flex-row gap-4 items-start">
                                        {/* Left side: Step number + Description */}
                                        <div className="flex flex-col gap-4 flex-1">
                                            <div className="flex flex-row gap-2 items-center">
                                                <label className="font-semibold w-24" style={{ color: ColorTheme.darkBlue, fontSize: "1rem" }}>
                                                    Step
                                                </label>
                                                <div
                                                    className="h-10 w-10 rounded-full text-white grid place-items-center text-sm font-semibold"
                                                    style={{ backgroundColor: ColorTheme.powderBlue }}
                                                >
                                                    {d.stepNumber}
                                                </div>
                                            </div>
                                            <div className="flex flex-row gap-2 items-start">
                                                <label className="font-semibold w-24 pt-1" style={{ color: ColorTheme.darkBlue, fontSize: "1rem" }}>
                                                    Description
                                                </label>
                                                <p className="flex-1 text-gray-700 leading-relaxed m-0 p-3 bg-white rounded-lg border" style={{ borderColor: '#E5E7EB' }}>
                                                    {d.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right side: Image preview card */}
                                        <div className="flex flex-col gap-2">
                                            <div className="card" style={{ width: '320px', height: '320px', margin: '0' }}>
                                                <div className="tools">
                                                    <div className="circle">
                                                        <span className="red box"></span>
                                                    </div>
                                                    <div className="circle">
                                                        <span className="yellow box"></span>
                                                    </div>
                                                    <div className="circle">
                                                        <span className="green box"></span>
                                                    </div>
                                                    {d.directionId && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleImageUploadClick(d.directionId!)}
                                                            disabled={uploadImageMutation.isPending && uploadingDirectionId === d.directionId}
                                                            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
                                                            style={{ backgroundColor: ColorTheme.blueGray }}
                                                        >
                                                            <ImageIcon className="w-4 h-4" />
                                                            {uploadImageMutation.isPending && uploadingDirectionId === d.directionId
                                                                ? 'Uploading...'
                                                                : d.imageUrl ? 'Change Image' : 'Add Image'}
                                                        </button>
                                                    )}
                                                </div>
                                                <div
                                                    style={{
                                                        height: "calc(100% - 60px)",
                                                        overflow: "hidden",
                                                        borderRadius: "12px",
                                                        position: "relative",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    {d.imageUrl && d.imageUrl.trim() !== "" ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={d.imageUrl}
                                                            alt={`Step ${d.stepNumber} preview`}
                                                            style={{
                                                                maxWidth: "100%",
                                                                maxHeight: "100%",
                                                                objectFit: "contain",
                                                                borderRadius: "12px",
                                                            }}
                                                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                        />
                                                    ) : (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src="/assets/img/placeholder.jpg"
                                                            alt="Placeholder"
                                                            style={{
                                                                maxWidth: "100%",
                                                                maxHeight: "100%",
                                                                objectFit: "contain",
                                                                borderRadius: "12px",
                                                                opacity: 0.5,
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {idx < directions.length - 1 && (
                                    <div className="border-t border-gray-300 my-4"></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )
                }
            </div >

            {/* Edit Modal */}
            {
                editModalOpen && editingDirection && (
                    <div
                        className="fixed inset-0 bg-black/20 flex items-center justify-center p-4"
                        style={{ zIndex: 9999 }}
                    >
                        <div
                            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 font-primary"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="space-y-6">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-semibold" style={{ color: ColorTheme.darkBlue }}>
                                        Edit Step {editingDirection.stepNumber}
                                    </h2>
                                    <button
                                        onClick={() => setEditModalOpen(false)}
                                        disabled={updateMutation.isPending}
                                        className="text-gray-400 hover:text-gray-600 text-2xl"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-sm font-semibold mb-2 block" style={{ color: ColorTheme.darkBlue }}>
                                        Description *
                                    </label>
                                    <textarea
                                        className="neomorphic-textarea w-full min-h-[120px]"
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ description: e.target.value })}
                                        disabled={updateMutation.isPending}
                                        placeholder="Describe this step..."
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 justify-end pt-4 border-t" style={{ borderColor: '#D6E6F2' }}>
                                    <CusButton
                                        variant="pastelRed"
                                        onClick={() => setEditModalOpen(false)}
                                        disabled={updateMutation.isPending}
                                    >
                                        Cancel
                                    </CusButton>
                                    <CusButton
                                        variant="blueGray"
                                        onClick={handleEditConfirm}
                                        disabled={updateMutation.isPending || !editForm.description.trim()}
                                    >
                                        {updateMutation.isPending ? 'Saving...' : 'Save'}
                                    </CusButton>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                open={deleteModalOpen}
                title="Delete Step"
                message={`Are you sure you want to delete Step ${deletingDirection?.stepNumber}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setDeletingDirection(null);
                }}
                loading={deleteMutation.isPending}
            />
        </>
    );
}

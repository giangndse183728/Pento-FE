import * as React from "react";
import { WhiteCard } from "./WhiteCard";
import { CusButton } from "@/components/ui/cusButton";
import Portal from "@/components/ui/Portal";

interface ConfirmModalProps {
    open: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    open,
    title = "Confirm Deletion",
    message = "Are you sure you want to delete this item?",
    confirmText = "Delete",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    loading = false,
}) => {
    if (!open) return null;

    return (
        <Portal>
            <div className="fixed inset-0 flex items-center justify-center bg-black/20" style={{ zIndex: 9999 }}>
                <WhiteCard className="max-w-sm w-full bg-white/80 h-fit" height="fit-content" style={{ padding: 0, height: 'fit-content' }}>
                    <div className="p-6 flex flex-col gap-4">
                        <h2 className="text-lg font-semibold text-red-700">{title}</h2>
                        <p className="text-gray-700">{message}</p>
                        <div className="flex justify-end gap-3 mt-4">
                            <CusButton
                                variant="gray"
                                size="default"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                {cancelText}
                            </CusButton>
                            <CusButton
                                variant="red"
                                size="default"
                                onClick={onConfirm}
                                disabled={loading}
                            >
                                {loading ? "Deleting..." : confirmText}
                            </CusButton>
                        </div>
                    </div>
                </WhiteCard>
            </div>
        </Portal>
    );
};

export default ConfirmModal;

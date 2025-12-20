'use client';

import React, { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
} from '@/components/ui/drawer';
import { CusButton } from '@/components/ui/cusButton';
import { useRejectReport, useResolveReport } from '@/features/reports/hooks/useReport';
import type { TradeReport } from '@/features/reports/schema/reportSchema';

interface ReportsSideDrawerProps {
    report: TradeReport | null;
    isOpen: boolean;
    onClose: () => void;
    onActionComplete?: () => void;
}

export default function ReportsSideDrawer({ report, isOpen, onClose, onActionComplete }: ReportsSideDrawerProps) {
    const rejectMutation = useRejectReport();
    const resolveMutation = useResolveReport();

    const isSubmitting = rejectMutation.isPending || resolveMutation.isPending;

    if (!report) return null;

    const handleResolve = async () => {
        try {
            await resolveMutation.mutate(report.reportId, 'Resolved by admin');
            toast.success('Report resolved successfully');
            onClose();
            onActionComplete?.();
        } catch (error) {
            console.error('Error resolving report:', error);
            toast.error('Failed to resolve report');
        }
    };

    const handleReject = async () => {
        try {
            await rejectMutation.mutate(report.reportId, 'Rejected by admin');
            toast.success('Report rejected successfully');
            onClose();
            onActionComplete?.();
        } catch (error) {
            console.error('Error rejecting report:', error);
            toast.error('Failed to reject report');
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return 'bg-red-100 text-red-800';
            case 'Serious': return 'bg-orange-100 text-orange-800';
            case 'Minor': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'UnderReview': return 'bg-blue-100 text-blue-800';
            case 'Resolved': return 'bg-green-100 text-green-800';
            case 'Dismissed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={onClose} direction="right">
            <DrawerContent className="h-full overflow-y-auto sm:max-w-[50vw]">
                {/* Header */}
                <DrawerHeader className="flex items-center justify-between border-b pb-4">
                    <DrawerTitle className="text-2xl font-bold text-[#113F67]">
                        {report.foodName}
                    </DrawerTitle>
                    <DrawerClose asChild>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} className="text-gray-600" />
                        </button>
                    </DrawerClose>
                </DrawerHeader>

                <div className="p-6">
                    {/* Food Image and Report Details Side by Side */}
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                        {/* Food Image */}
                        {report.foodImageUri && (
                            <div className="md:w-1/2">
                                <img
                                    src={report.foodImageUri}
                                    alt={report.foodName}
                                    className="w-full h-96 object-cover rounded-lg shadow-md"
                                />
                            </div>
                        )}

                        {/* Report Details */}
                        <div className={`${report.foodImageUri ? 'md:w-1/2' : 'w-full'} space-y-4`}>

                            <div>
                                <span className="text-sm text-gray-600">Reason:</span>
                                <p className="text-gray-800 font-medium">{report.reason}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <div>
                                    <span className="text-sm text-gray-600">Severity:</span>
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                                        {report.severity}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Status:</span>
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                        {report.status}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <span className="text-sm text-gray-600">Description:</span>
                                <p className="text-gray-800 italic">"{report.description}"</p>
                            </div>

                            <div>
                                <span className="text-sm text-gray-600">Quantity:</span>
                                <p className="text-gray-800">
                                    {report.quantity} {report.unitAbbreviation}
                                </p>
                            </div>

                            <div>
                                <span className="text-sm text-gray-600">Created On:</span>
                                <p className="text-gray-800">
                                    {new Date(report.createdOnUtc).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Media and Reporter Info Side by Side */}
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                        {/* Media Section */}
                        {report.mediaUri && (
                            <div className="md:w-1/2">
                                <h3 className="text-lg font-semibold text-[#113F67] mb-3">
                                    Reported {report.mediaType}
                                </h3>
                                {report.mediaType === 'Video' ? (
                                    <video
                                        controls
                                        className="w-full rounded-lg shadow-md"
                                        src={report.mediaUri}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <img
                                        src={report.mediaUri}
                                        alt="Report evidence"
                                        className="w-full h-96 rounded-lg shadow-md object-cover"
                                    />
                                )}
                            </div>
                        )}

                        {/* Reporter Info */}
                        <div className={`${report.mediaUri ? 'md:w-1/2' : 'w-full'}`}>
                            <div className="bg-gray-50 rounded-lg p-4 h-full">
                                <h3 className="text-sm font-semibold text-[#113F67] mb-3">
                                    Reporter Info
                                </h3>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={report.reporterAvatarUrl}
                                        alt={report.reporterName}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800">{report.reporterName}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-6">
                        <CusButton
                            onClick={handleResolve}
                            disabled={isSubmitting}
                            variant="green"
                            size="lg"
                            className="flex-1"
                        >
                            <CheckCircle size={20} />
                            {isSubmitting ? 'Processing...' : 'Resolve'}
                        </CusButton>
                        <CusButton
                            onClick={handleReject}
                            disabled={isSubmitting}
                            variant="red"
                            size="lg"
                            className="flex-1"
                        >
                            <XCircle size={20} />
                            {isSubmitting ? 'Processing...' : 'Reject'}
                        </CusButton>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
} from '@/components/ui/drawer';
import { rejectReport, resolveReport } from '@/features/admin/services/reportService';
import type { TradeReport } from '@/features/admin/schema/reportSchema';

interface ReportsSideDrawerProps {
    report: TradeReport | null;
    isOpen: boolean;
    onClose: () => void;
    onActionComplete?: () => void;
}

export default function ReportsSideDrawer({ report, isOpen, onClose, onActionComplete }: ReportsSideDrawerProps) {
    const [adminNote, setAdminNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!report) return null;

    const handleResolve = async () => {
        if (!adminNote.trim()) {
            alert('Please enter an admin note');
            return;
        }

        try {
            setIsSubmitting(true);
            await resolveReport(report.reportId, adminNote);
            alert('Report resolved successfully');
            setAdminNote('');
            onClose();
            onActionComplete?.();
        } catch (error) {
            console.error('Error resolving report:', error);
            alert('Failed to resolve report');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!adminNote.trim()) {
            alert('Please enter an admin note');
            return;
        }

        try {
            setIsSubmitting(true);
            await rejectReport(report.reportId, adminNote);
            alert('Report rejected successfully');
            setAdminNote('');
            onClose();
            onActionComplete?.();
        } catch (error) {
            console.error('Error rejecting report:', error);
            alert('Failed to reject report');
        } finally {
            setIsSubmitting(false);
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
            <DrawerContent className="h-full overflow-y-auto">
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
                    {/* Food Image */}
                    {report.foodImageUri && (
                        <div className="mb-6">
                            <img
                                src={report.foodImageUri}
                                alt={report.foodName}
                                className="w-full h-64 object-cover rounded-lg shadow-md"
                            />
                        </div>
                    )}

                    {/* Report Details */}
                    <div className="space-y-4 mb-6">
                        <div>
                            <span className="text-sm text-gray-600">Report ID:</span>
                            <p className="text-sm font-mono text-gray-800 truncate">
                                {report.reportId.slice(0, 13)}...
                            </p>
                        </div>

                        <div>
                            <span className="text-sm text-gray-600">Reason:</span>
                            <p className="text-gray-800 font-medium">{report.reason}</p>
                        </div>

                        <div className="flex gap-2">
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

                    {/* Media Section */}
                    {report.mediaUri && (
                        <div className="mb-6">
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
                                    className="w-full rounded-lg shadow-md"
                                />
                            )}
                        </div>
                    )}

                    {/* Reporter Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
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
                                <p className="text-sm text-gray-600 font-mono truncate">
                                    User ID: {report.reporterUserId.slice(0, 10)}...
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={handleResolve}
                            disabled={isSubmitting}
                            className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            {isSubmitting ? 'Processing...' : 'Resolve'}
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={isSubmitting}
                            className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            {isSubmitting ? 'Processing...' : 'Reject'}
                        </button>
                        <button
                            disabled
                            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors opacity-50 cursor-not-allowed"
                        >
                            Suspend Listing
                        </button>
                    </div>

                    {/* Admin Note */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-[#113F67] mb-2">
                            Admin Note (required):
                        </label>
                        <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="Enter admin note here..."
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

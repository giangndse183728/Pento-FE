'use client';

import React from 'react';
import {
    X,
    CheckCircle,
    XCircle,
    AlertTriangle,
    FileText,
    Package,
    Calendar,
    User,
    Scale,
    MessageSquare,
    ImageIcon,
    Video,
    ShieldAlert,
    Clock
} from 'lucide-react';
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getSeverityConfig = (severity: string) => {
        switch (severity) {
            case 'Critical':
                return {
                    bg: 'bg-gradient-to-r from-red-500 to-red-600',
                    text: 'text-white',
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600'
                };
            case 'Serious':
                return {
                    bg: 'bg-gradient-to-r from-orange-500 to-orange-600',
                    text: 'text-white',
                    iconBg: 'bg-orange-100',
                    iconColor: 'text-orange-600'
                };
            case 'Minor':
                return {
                    bg: 'bg-gradient-to-r from-blue-400 to-blue-500',
                    text: 'text-white',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600'
                };
            default:
                return {
                    bg: 'bg-gradient-to-r from-gray-400 to-gray-500',
                    text: 'text-white',
                    iconBg: 'bg-gray-100',
                    iconColor: 'text-gray-600'
                };
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Pending':
                return {
                    bg: 'bg-gradient-to-r from-amber-400 to-amber-500',
                    text: 'text-white',
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-600'
                };
            case 'UnderReview':
                return {
                    bg: 'bg-gradient-to-r from-blue-400 to-blue-500',
                    text: 'text-white',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600'
                };
            case 'Resolved':
                return {
                    bg: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
                    text: 'text-white',
                    iconBg: 'bg-emerald-100',
                    iconColor: 'text-emerald-600'
                };
            case 'Dismissed':
                return {
                    bg: 'bg-gradient-to-r from-gray-400 to-gray-500',
                    text: 'text-white',
                    iconBg: 'bg-gray-100',
                    iconColor: 'text-gray-600'
                };
            default:
                return {
                    bg: 'bg-gradient-to-r from-gray-400 to-gray-500',
                    text: 'text-white',
                    iconBg: 'bg-gray-100',
                    iconColor: 'text-gray-600'
                };
        }
    };

    const severityConfig = getSeverityConfig(report.severity);
    const statusConfig = getStatusConfig(report.status);

    return (
        <Drawer open={isOpen} onOpenChange={onClose} direction="right">
            <DrawerContent className="h-full overflow-y-auto overflow-x-hidden sm:max-w-[55vw] bg-gradient-to-b from-slate-50 to-white">
                {/* Enhanced Header */}
                <DrawerHeader className="flex flex-row items-center gap-4 border-b border-slate-200 pb-5 px-8 pt-6 bg-white/80 backdrop-blur-sm">
                    <DrawerClose asChild>
                        <button
                            onClick={onClose}
                            className="w-11 h-11 hover:bg-slate-100 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                        >
                            <X size={22} className="text-gray-500" />
                        </button>
                    </DrawerClose>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#113F67] to-[#1a5a8a] rounded-2xl flex items-center justify-center shadow-lg">
                            <ShieldAlert className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <DrawerTitle className="text-2xl font-bold text-[#113F67]">
                                Report Details
                            </DrawerTitle>
                        </div>
                    </div>
                </DrawerHeader>

                <div className="p-8 space-y-8">
                    {/* Status & Severity Badges Section */}
                    <section>
                        <div className="flex flex-wrap gap-4">
                            {/* Severity Badge */}
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl ${severityConfig.iconBg}`}>
                                    <AlertTriangle className={`w-5 h-5 ${severityConfig.iconColor}`} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Severity</p>
                                    <span className={`inline-block mt-1 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${severityConfig.bg} ${severityConfig.text}`}>
                                        {report.severity}
                                    </span>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl ${statusConfig.iconBg}`}>
                                    <Clock className={`w-5 h-5 ${statusConfig.iconColor}`} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
                                    <span className={`inline-block mt-1 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${statusConfig.bg} ${statusConfig.text}`}>
                                        {report.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Food Information Section */}
                    <section>
                        <h3 className="text-lg font-bold flex items-center gap-2.5 mb-5 text-[#113F67]">
                            <Package className="w-5 h-5" />
                            Reported Item
                        </h3>

                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Food Image */}
                            {report.foodImageUri && (
                                <div className="lg:w-2/5">
                                    <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                                        <img
                                            src={report.foodImageUri}
                                            alt={report.foodName}
                                            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                            <p className="text-white font-bold text-lg">{report.foodName}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Food Details Cards */}
                            <div className={`${report.foodImageUri ? 'lg:w-3/5' : 'w-full'} grid grid-cols-1 sm:grid-cols-2 gap-4`}>
                                {/* Food Name Card (only if no image) */}
                                {!report.foodImageUri && (
                                    <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-3 hover:shadow-md transition-shadow">
                                        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Food Name</p>
                                            <p className="font-bold text-[#113F67] mt-0.5">{report.foodName}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Quantity Card */}
                                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-3 hover:shadow-md transition-shadow">
                                    <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
                                        <Scale className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</p>
                                        <p className="font-bold text-[#113F67] mt-0.5">
                                            {report.quantity} <span className="text-gray-500 font-normal">{report.unitAbbreviation}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Created Date Card */}
                                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-3 hover:shadow-md transition-shadow">
                                    <div className="p-2.5 bg-green-50 rounded-xl text-green-600">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reported On</p>
                                        <p className="font-bold text-[#113F67] mt-0.5">{formatDate(report.createdOnUtc)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Report Reason Section */}
                    <section>
                        <h3 className="text-lg font-bold flex items-center gap-2.5 mb-5 text-[#113F67]">
                            <FileText className="w-5 h-5" />
                            Report Information
                        </h3>

                        <div className="space-y-4">
                            {/* Reason Card */}
                            <div className="p-5 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Reason for Report</p>
                                </div>
                                <p className="font-bold text-[#113F67] text-lg">{report.reason}</p>
                            </div>

                            {/* Description Card */}
                            <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <MessageSquare className="w-4 h-4 text-gray-500" />
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-[#113F67]">
                                    <p className="text-gray-700 italic leading-relaxed">"{report.description}"</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Evidence Media Section */}
                    {report.mediaUri && (
                        <section>
                            <h3 className="text-lg font-bold flex items-center gap-2.5 mb-5 text-[#113F67]">
                                {report.mediaType === 'Video' ? (
                                    <Video className="w-5 h-5" />
                                ) : (
                                    <ImageIcon className="w-5 h-5" />
                                )}
                                Evidence {report.mediaType}
                            </h3>

                            <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
                                {report.mediaType === 'Video' ? (
                                    <video
                                        controls
                                        className="w-full max-h-[400px] object-contain bg-black"
                                        src={report.mediaUri}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <img
                                        src={report.mediaUri}
                                        alt="Report evidence"
                                        className="w-full max-h-[400px] object-contain"
                                    />
                                )}
                            </div>
                        </section>
                    )}

                    {/* Reporter Information Section */}
                    <section>
                        <h3 className="text-lg font-bold flex items-center gap-2.5 mb-5 text-[#113F67]">
                            <User className="w-5 h-5" />
                            Reporter Information
                        </h3>

                        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={report.reporterAvatarUrl}
                                        alt={report.reporterName}
                                        className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted by</p>
                                    <p className="font-bold text-[#113F67] text-lg mt-0.5">{report.reporterName}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Action Buttons */}
                    <section className="pt-4">
                        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200">
                            <p className="text-sm font-semibold text-gray-600 mb-4 text-center">Take action on this report</p>
                            <div className="flex gap-4">
                                <CusButton
                                    onClick={handleResolve}
                                    disabled={isSubmitting}
                                    variant="green"
                                    size="lg"
                                    className="flex-1 shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <CheckCircle size={20} />
                                    {isSubmitting ? 'Processing...' : 'Resolve Report'}
                                </CusButton>
                                <CusButton
                                    onClick={handleReject}
                                    disabled={isSubmitting}
                                    variant="red"
                                    size="lg"
                                    className="flex-1 shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <XCircle size={20} />
                                    {isSubmitting ? 'Processing...' : 'Reject Report'}
                                </CusButton>
                            </div>
                        </div>
                    </section>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

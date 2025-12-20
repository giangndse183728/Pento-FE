import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { ROUTES } from '@/constants/routes';
import { ColorTheme } from '@/constants/color';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { useUserProfile, useUpdateUserProfile, useUpdateUserAvatar } from '@/features/users/hooks/useUser';
import UpdateDetailsModal, { type ModalField } from '@/components/decoration/UpdateDetailsModal';
import ImageEditModal from '@/components/decoration/ImageEditModal';
import type { UpdateProfileInput } from '@/features/users/schema/userSchema';
import { useLogout } from '@/features/auth/hooks/useAuth';

// Dashboard sub-items for accordion
const dashboardSubItems = [
    { href: ROUTES.DASHBOARD_SUBSCRIPTIONS_PAYMENT, label: 'Payments', icon: '/assets/img/pie-chart.png' },
    { href: ROUTES.DASHBOARD_FOOD_ITEM_LOG, label: 'Food Items Log', icon: '/assets/img/bar-chart.png' },
    { href: ROUTES.DASHBOARD_ACTIVITIES, label: 'Activities', icon: '/assets/img/heat-map.png' },
];

// Regular navigation items (non-accordion)
const navItems = [
    { href: ROUTES.RECIPES, label: 'Recipes', icon: '/assets/img/recipe-book.png' },
    { href: ROUTES.FOODREFERENCES, label: 'Food References', icon: '/assets/img/food-ref.png' },
    { href: ROUTES.SUBSCRIPTIONS, label: 'Subscriptions', icon: '/assets/img/admin-subscription.png' },
    { href: ROUTES.ACHIEVEMENTS, label: 'Achievements', icon: '/assets/img/admin-achievement.png' },
    { href: ROUTES.REPORTS, label: 'Reports', icon: '/assets/img/report.png' },
];

const ACCORDION_STATE_KEY = 'admin-sidebar-accordion';

const AdminSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [hovered, setHovered] = useState<string | null>(null);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isEditAvatarOpen, setIsEditAvatarOpen] = useState(false);

    // Logout mutation
    const logoutMutation = useLogout();

    // Fetch user profile
    const { data: userProfile } = useUserProfile();
    const updateProfileMutation = useUpdateUserProfile();
    const updateAvatarMutation = useUpdateUserAvatar();

    // Profile edit form state
    const [profileFormData, setProfileFormData] = useState<UpdateProfileInput>({
        firstName: '',
        lastName: '',
    });

    // Update form data when user profile loads
    useEffect(() => {
        if (userProfile) {
            setProfileFormData({
                firstName: userProfile.firstName || '',
                lastName: userProfile.lastName || '',
            });
        }
    }, [userProfile]);

    // Control accordion state - persist across navigation using sessionStorage
    const [accordionValue, setAccordionValue] = useState<string | undefined>('dashboard');

    // Load saved accordion state on mount
    useEffect(() => {
        const saved = sessionStorage.getItem(ACCORDION_STATE_KEY);
        if (saved !== null) {
            setAccordionValue(saved === 'open' ? 'dashboard' : undefined);
        }
    }, []);

    // Handle accordion toggle and persist state
    const handleAccordionChange = (value: string | undefined) => {
        setAccordionValue(value);
        sessionStorage.setItem(ACCORDION_STATE_KEY, value ? 'open' : 'closed');
    };

    // Get user initials for avatar fallback
    const getInitials = () => {
        if (userProfile?.firstName && userProfile?.lastName) {
            return `${userProfile.firstName[0]}${userProfile.lastName[0]}`.toUpperCase();
        }
        if (userProfile?.firstName) {
            return userProfile.firstName[0].toUpperCase();
        }
        return 'A';
    };

    const displayName = userProfile
        ? `${userProfile.firstName} ${userProfile.lastName}`.trim()
        : 'Admin';

    const displayRole = userProfile?.roles || 'Administrator';

    // Profile edit handlers
    const handleProfileFormChange = (field: string, value: unknown) => {
        setProfileFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = async () => {
        try {
            await updateProfileMutation.mutateAsync(profileFormData);
            setIsEditProfileOpen(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    // Avatar update handler
    const handleAvatarSelect = async (file: File) => {
        try {
            await updateAvatarMutation.mutateAsync(file);
            setIsEditAvatarOpen(false);
        } catch (error) {
            console.error('Failed to update avatar:', error);
        }
    };

    const profileFields: ModalField[] = [
        {
            name: 'firstName',
            label: 'First Name',
            type: 'text',
            placeholder: 'Enter first name',
            required: true,
        },
        {
            name: 'lastName',
            label: 'Last Name',
            type: 'text',
            placeholder: 'Enter last name',
            required: true,
        },
    ];

    return (
        <div className="w-full md:w-[35%] lg:w-[20%] lg:fixed lg:left-6 lg:top-6 lg:bottom-6 min-h-screen lg:min-h-0">
            <WhiteCard
                width="100%"
                height="100%"
                style={{
                    border: `1px solid rgba(0,0,0,0.05)`,
                    background: ColorTheme.iceberg,
                    height: '100%',
                }}
                className="h-full shadow-lg rounded-xl"
            >
                <div className="p-5 h-full w-full flex flex-col items-start justify-start">
                    {/* Profile */}
                    <div className="flex items-center gap-4 mb-8 w-full group">
                        {userProfile?.avatarUrl ? (
                            <Image
                                src={userProfile.avatarUrl}
                                alt={displayName}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full object-cover shadow-md transition-transform hover:scale-105 cursor-pointer"
                                onClick={() => setIsEditAvatarOpen(true)}
                                title="Click to change avatar"
                            />
                        ) : (
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold transition-transform shadow-md hover:scale-105 cursor-pointer"
                                style={{ background: ColorTheme.blueGray }}
                                onClick={() => setIsEditAvatarOpen(true)}
                                title="Click to add avatar"
                            >
                                {getInitials()}
                            </div>
                        )}
                        <div
                            className="text-left cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setIsEditProfileOpen(true)}
                            title="Click to edit profile"
                        >
                            <p className="text-sm font-semibold" style={{ color: ColorTheme.darkBlue }}>
                                {displayName}
                            </p>
                            <p className="text-xs" style={{ color: ColorTheme.blueGray }}>
                                {displayRole}
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full border-t border-gray-300 mb-6" />

                    {/* Navigation */}
                    <nav className="flex flex-col space-y-3 w-full relative">
                        {/* Dashboard Accordion */}
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                            value={accordionValue}
                            onValueChange={handleAccordionChange}
                        >
                            <AccordionItem value="dashboard" className="border-b-0">
                                <div className="relative w-full">
                                    {/* Active indicator for dashboard parent */}
                                    {pathname.startsWith(ROUTES.DASHBOARD) && (
                                        <div
                                            className="absolute left-0 top-0 h-full w-1 rounded-tr-lg rounded-br-lg"
                                            style={{ backgroundColor: ColorTheme.powderBlue }}
                                        />
                                    )}
                                    <AccordionTrigger
                                        className="w-full flex items-center gap-3 p-3 rounded-lg transition-all transform cursor-pointer hover:no-underline"
                                        style={{
                                            backgroundColor: pathname.startsWith(ROUTES.DASHBOARD)
                                                ? ColorTheme.babyBlue
                                                : 'transparent',
                                        }}
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
                                                <Image
                                                    src="/assets/img/admin-dashboard.png"
                                                    alt="Dashboard"
                                                    width={30}
                                                    height={30}
                                                    className="w-7 h-7"
                                                />
                                            </div>
                                            <span
                                                className="truncate font-medium transition-colors"
                                                style={{
                                                    color: pathname.startsWith(ROUTES.DASHBOARD)
                                                        ? ColorTheme.blueGray
                                                        : ColorTheme.darkBlue,
                                                }}
                                            >
                                                Dashboard
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                </div>
                                <AccordionContent className="pl-6 pb-0">
                                    <div className="flex flex-col space-y-1 pt-1">
                                        {dashboardSubItems.map(({ href, label, icon }) => {
                                            const isSubActive = pathname === href;
                                            const isSubHovered = hovered === href;

                                            return (
                                                <Link
                                                    key={href}
                                                    href={href}
                                                    onMouseEnter={() => setHovered(href)}
                                                    onMouseLeave={() => setHovered(null)}
                                                    className="w-full flex items-center gap-2 p-2 rounded-lg transition-all cursor-pointer text-sm"
                                                    style={{
                                                        backgroundColor: isSubActive
                                                            ? ColorTheme.powderBlue
                                                            : isSubHovered
                                                                ? ColorTheme.babyBlue
                                                                : 'transparent',
                                                        color: isSubActive || isSubHovered
                                                            ? ColorTheme.darkBlue
                                                            : ColorTheme.blueGray,
                                                        fontWeight: isSubActive ? 600 : 400,
                                                    }}
                                                >
                                                    <Image
                                                        src={icon}
                                                        alt={label}
                                                        width={20}
                                                        height={20}
                                                        className="w-5 h-5"
                                                    />
                                                    {label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {/* Other Navigation Items */}
                        {navItems.map(({ href, label, icon }) => {
                            const isActive = pathname === href;
                            const isHovered = hovered === href;

                            return (
                                <div key={href} className="relative w-full">
                                    {/* Active indicator */}
                                    {isActive && (
                                        <div
                                            className="absolute left-0 top-0 h-full w-1 rounded-tr-lg rounded-br-lg"
                                            style={{ backgroundColor: ColorTheme.powderBlue }}
                                        />
                                    )}

                                    <Link
                                        href={href}
                                        onMouseEnter={() => setHovered(href)}
                                        onMouseLeave={() => setHovered(null)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all transform cursor-pointer`}
                                        style={{
                                            backgroundColor: isActive
                                                ? ColorTheme.iceberg
                                                : isHovered
                                                    ? ColorTheme.babyBlue
                                                    : 'transparent',
                                            boxShadow: isHovered ? `0 4px 10px rgba(0,0,0,0.08)` : 'none',
                                        }}
                                    >
                                        <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
                                            <Image
                                                src={icon}
                                                alt={label}
                                                width={30}
                                                height={30}
                                                className="w-7 h-7"
                                            />
                                        </div>
                                        <span
                                            className="truncate font-medium transition-colors"
                                            style={{
                                                color: isActive || isHovered ? ColorTheme.blueGray : ColorTheme.darkBlue,
                                            }}
                                        >
                                            {label}
                                        </span>
                                    </Link>
                                </div>
                            );
                        })}

                        <div className="w-full border-t border-gray-300 mb-6" />

                        {/* Logout Button */}
                        <button
                            onClick={() => logoutMutation.mutate()}
                            disabled={logoutMutation.isPending}
                            onMouseEnter={() => setHovered('logout')}
                            onMouseLeave={() => setHovered(null)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer mt-4"
                            style={{
                                backgroundColor: hovered === 'logout' ? '#FEE2E2' : 'transparent',
                                opacity: logoutMutation.isPending ? 0.5 : 1,
                            }}
                        >
                            <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
                                <Image
                                    src="/assets/img/log-out.png"
                                    alt="Logout"
                                    width={28}
                                    height={28}
                                    className="w-7 h-7"
                                />
                            </div>
                            <span
                                className="truncate font-medium transition-colors"
                                style={{
                                    color: hovered === 'logout' ? '#DC2626' : ColorTheme.darkBlue,
                                }}
                            >
                                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                            </span>
                        </button>
                    </nav>
                </div>
            </WhiteCard>
            {/* Edit Profile Modal */}
            {isEditProfileOpen && (
                <UpdateDetailsModal
                    title="Edit Profile"
                    fields={profileFields}
                    formData={profileFormData as Record<string, unknown>}
                    onFormChange={handleProfileFormChange}
                    onClose={() => setIsEditProfileOpen(false)}
                    isLoading={updateProfileMutation.isPending}
                    onSave={handleSaveProfile}
                    saveLabel="Save"
                    cancelLabel="Cancel"
                    maxWidth="max-w-md"
                />
            )}
            {/* Edit Avatar Modal */}
            {isEditAvatarOpen && (
                <ImageEditModal
                    title="Change Avatar"
                    label="Profile Picture"
                    currentImage={userProfile?.avatarUrl || null}
                    onImageSelect={handleAvatarSelect}
                    onClose={() => setIsEditAvatarOpen(false)}
                    isLoading={updateAvatarMutation.isPending}
                    confirmLabel="Upload"
                    cancelLabel="Cancel"
                    changeLabel="Change Photo"
                />
            )}
        </div>
    );
};

export default AdminSidebar;

import { z } from 'zod';

// User Profile Response Schema
export const UserProfileSchema = z.object({
    id: z.string(),
    householdId: z.string().nullable(),
    householdName: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    createdAt: z.string(),
    roles: z.string(),
    activeSubscriptions: z.array(z.unknown()),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// Update Profile Request Schema
export const UpdateProfileSchema = z.object({
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

// Update Avatar Input (file)
export type UpdateAvatarInput = {
    file: File;
};

// Admin Users List Query Parameters
export type GetAdminUsersParams = {
    searchText?: string;
    isDeleted?: boolean;
    sortBy?: 'Id' | 'HouseholdName' | 'Email' | 'FirstName' | 'LastName' | 'CreatedAt';
    sortOrder?: 'ASC' | 'DESC';
    pageNumber?: number;
    pageSize?: number;
};

// Admin User Item in List
export const AdminUserItemSchema = z.object({
    userId: z.string(),
    householdName: z.string().nullable(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    createdAt: z.string(),
    isDeleted: z.boolean(),
});

export type AdminUserItem = z.infer<typeof AdminUserItemSchema>;

// Paginated Admin Users Response
export type PaginatedAdminUsers = {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    items: AdminUserItem[];
};

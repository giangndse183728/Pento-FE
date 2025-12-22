'use client';

import React, { useState, useMemo } from 'react';
import UsersList from './UsersList';
import FilterSection, { type FilterField } from '@/components/decoration/FilterSection';
import type { GetAdminUsersParams } from '../schema/userSchema';

const SORT_BY_OPTIONS = [
    { value: '', label: 'All' },
    { value: 'Id', label: 'User ID' },
    { value: 'HouseholdName', label: 'Household Name' },
    { value: 'Email', label: 'Email' },
    { value: 'FirstName', label: 'First Name' },
    { value: 'LastName', label: 'Last Name' },
    { value: 'CreatedAt', label: 'Created At' },
];

const SORT_ORDER_OPTIONS = [
    { value: '', label: 'All' },
    { value: 'ASC', label: 'Ascending' },
    { value: 'DESC', label: 'Descending' },
];

const IS_DELETED_OPTIONS = [
    { value: '', label: 'All' },
    { value: 'true', label: 'Deleted' },
    { value: 'false', label: 'Active' },
];

export default function UsersManager() {
    const [filters, setFilters] = useState({
        searchText: '',
        sortBy: '',
        sortOrder: '',
        isDeleted: '',
    });
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 10;

    // Build API params
    const apiParams: GetAdminUsersParams = useMemo(() => {
        const params: GetAdminUsersParams = {
            pageNumber,
            pageSize,
        };

        if (filters.searchText) params.searchText = filters.searchText;
        if (filters.sortBy) params.sortBy = filters.sortBy as GetAdminUsersParams['sortBy'];
        if (filters.sortOrder) params.sortOrder = filters.sortOrder as GetAdminUsersParams['sortOrder'];
        if (filters.isDeleted) params.isDeleted = filters.isDeleted === 'true';

        return params;
    }, [filters, pageNumber, pageSize]);

    const handleFilterChange = (field: string, value: string | boolean | undefined) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
        setPageNumber(1); // Reset to page 1 when filters change
    };

    const handleReset = () => {
        setFilters({
            searchText: '',
            sortBy: '',
            sortOrder: '',
            isDeleted: '',
        });
        setPageNumber(1);
    };

    const filterFields: FilterField[] = [
        {
            type: 'text',
            name: 'searchText',
            label: 'Search',
            placeholder: 'Search by name or email...',
            value: filters.searchText,
            onChange: (val) => handleFilterChange('searchText', val as string),
        },
        {
            type: 'select',
            name: 'sortBy',
            label: 'Sort By',
            value: filters.sortBy,
            options: SORT_BY_OPTIONS,
            onChange: (val) => handleFilterChange('sortBy', val as string),
        },
        {
            type: 'select',
            name: 'sortOrder',
            label: 'Sort Order',
            value: filters.sortOrder,
            options: SORT_ORDER_OPTIONS,
            onChange: (val) => handleFilterChange('sortOrder', val as string),
        },
        {
            type: 'select',
            name: 'isDeleted',
            label: 'Status',
            value: filters.isDeleted,
            options: IS_DELETED_OPTIONS,
            onChange: (val) => handleFilterChange('isDeleted', val as string),
        },
    ];

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-semibold" style={{ color: '#113F67' }}>
                        Users Manager
                    </h1>
                </div>
            </div>

            <FilterSection
                title="User Filters"
                fields={filterFields}
                onReset={handleReset}
                resetButtonText="Clear Filters"
                defaultCollapsed={true}
            />

            <UsersList
                searchText={apiParams.searchText}
                isDeleted={apiParams.isDeleted}
                sortBy={apiParams.sortBy}
                sortOrder={apiParams.sortOrder}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                pageSize={pageSize}
            />
        </div>
    );
}

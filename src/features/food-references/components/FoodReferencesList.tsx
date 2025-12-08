'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useFoodReferences } from '../hooks/useFoodReferences';
import { FoodRef } from '../schema/foodReferenceSchema';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CusButton } from '@/components/ui/cusButton';
import { WhiteCard } from '@/components/decoration/WhiteCard';
import { Search, SquarePen, Trash2 } from 'lucide-react';
import { ColorTheme } from '@/constants/color';

type Props = {
    onSelect?: (foodRef: FoodRef) => void;
    onEdit?: (foodRef: FoodRef) => void;
    onDelete?: (foodRef: FoodRef) => void;
};

export default function FoodReferencesList({ onSelect, onEdit, onDelete }: Props) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [foodGroup, setFoodGroup] = useState<string | undefined>();

    const { data, isLoading, isFetching, refetch } = useFoodReferences({
        page,
        pageSize,
        search: search || undefined,
        foodGroup,
    });

    const items = data?.items ?? [];
    const totalCount = data?.totalCount ?? 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    const handleSearch = () => {
        setSearch(searchInput.trim());
        setPage(1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const renderPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        const current = page;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (current > 3) pages.push('ellipsis');

            const start = Math.max(2, current - 1);
            const end = Math.min(totalPages - 1, current + 1);
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (current < totalPages - 2) pages.push('ellipsis');
            pages.push(totalPages);
        }

        return pages;
    };

    const foodGroups = [
        { id: 1, name: 'Meat' },
        { id: 2, name: 'Seafood' },
        { id: 3, name: 'Fruits & Vegetables' },
        { id: 4, name: 'Dairy' },
        { id: 5, name: 'Cereal, Grains & Pasta' },
        { id: 6, name: 'Legumes, Nuts & Seeds' },
        { id: 7, name: 'Fats & Oils' },
        { id: 8, name: 'Confectionery' },
        { id: 9, name: 'Beverages' },
        { id: 10, name: 'Condiments' },
        { id: 11, name: 'Mixed Dishes' },
    ];

    return (
        <WhiteCard className="w-full" width="100%" height="auto">
            <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold" style={{ color: '#113F67' }}>
                        Food References ({totalCount})
                    </h3>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            placeholder="Search food references..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="neomorphic-input flex-1"
                        />
                        <CusButton variant="blueGray" size="icon" onClick={handleSearch}>
                            <Search className="w-4 h-4" />
                        </CusButton>
                    </div>
                    <select
                        value={foodGroup ?? ''}
                        onChange={(e) => {
                            setFoodGroup(e.target.value || undefined);
                            setPage(1);
                        }}
                        className="neomorphic-select w-full md:w-48"
                    >
                        <option value="">All Food Groups</option>
                        {foodGroups.map((group) => (
                            <option key={group.id} value={group.name}>{group.name}</option>
                        ))}
                    </select>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                        }}
                        className="neomorphic-select w-full md:w-32"
                    >
                        <option value={10}>10 / page</option>
                        <option value={25}>25 / page</option>
                        <option value={50}>50 / page</option>
                    </select>
                </div>

                {/* Table */}
                <div className="rounded-lg border" style={{ borderColor: '#D6E6F2' }}>
                    <Table>
                        <TableHeader>
                            <TableRow style={{ backgroundColor: '#F1F6F9' }}>
                                <TableHead style={{ color: '#113F67' }}>Image</TableHead>
                                <TableHead style={{ color: '#113F67' }}>Name</TableHead>
                                <TableHead style={{ color: '#113F67' }}>Food Group</TableHead>
                                <TableHead style={{ color: '#113F67' }}>Unit Type</TableHead>
                                <TableHead style={{ color: '#113F67' }}>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <TableRow key={`skeleton-${idx}`}>
                                        <TableCell><Skeleton className="w-12 h-12 rounded" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                                    </TableRow>
                                ))
                            ) : items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        No food references found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        className="hover:bg-blue-50/50 cursor-pointer"
                                        onClick={() => onSelect?.(item)}
                                    >
                                        <TableCell>
                                            <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                                                <Image
                                                    src={item.imageUrl || '/assets/img/placeholder.jpg'}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="48px"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium" style={{ color: '#113F67' }}>
                                            {item.name}
                                        </TableCell>
                                        <TableCell>
                                            {item.foodGroup ? (
                                                <Badge
                                                    variant="secondary"
                                                    style={{ backgroundColor: ColorTheme.powderBlue, color: ColorTheme.darkBlue }}
                                                >
                                                    {item.foodGroup}
                                                </Badge>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {item.unitType ? (
                                                <Badge
                                                    variant="outline"
                                                    style={{ borderColor: ColorTheme.powderBlue, color: ColorTheme.darkBlue }}
                                                >
                                                    {item.unitType}
                                                </Badge>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {onSelect && (
                                                    <CusButton
                                                        variant="blueGray"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onSelect(item);
                                                        }}
                                                    >
                                                        Select
                                                    </CusButton>
                                                )}
                                                {onEdit && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onEdit(item);
                                                        }}
                                                        className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <SquarePen className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDelete(item);
                                                        }}
                                                        className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (page > 1) setPage(page - 1);
                                    }}
                                    className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>

                            {renderPageNumbers().map((pageNum, idx) => (
                                pageNum === 'ellipsis' ? (
                                    <PaginationItem key={`ellipsis-${idx}`}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                ) : (
                                    <PaginationItem key={pageNum}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setPage(pageNum);
                                            }}
                                            isActive={pageNum === page}
                                            className="cursor-pointer"
                                        >
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (page < totalPages) setPage(page + 1);
                                    }}
                                    className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </WhiteCard>
    );
}

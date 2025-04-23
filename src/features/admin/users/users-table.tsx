"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Toaster } from "@/components/ui/sonner";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ExtendedUser } from "./types/user";

import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

import { columns } from "@/features/admin/users/data-table/columns";
import useDebounce from "@/hooks/useDebounce";
import { DataTable } from "./data-table/data-table";

const USER_ROLES = ["admin", "moderator", "user", "guest"];

interface SearchParams {
  field: "email" | "name";
  operator: "contains" | "starts_with" | "ends_with";
  value: string;
}

interface SortParams {
  field: string;
  direction: "asc" | "desc";
}

interface FilterParams {
  field: string;
  operator: string;
  value: string;
}

interface UsersTableProps {
  initialPage?: number;
  initialPageSize?: number;
  initialSearch?: SearchParams;
  initialSort?: SortParams;
  initialFilter?: FilterParams;
  initialBannedStatus?: "banned" | "active";
}

export function UsersTable({
  initialPage = 1,
  initialPageSize = 10,
  initialSearch = { field: "email", operator: "contains", value: "" },
  initialSort = { field: "createdAt", direction: "desc" },
  initialFilter,
  initialBannedStatus,
}: UsersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);

  const initialColumnFilters: ColumnFiltersState = [];

  if (initialFilter?.field === "role") {
    initialColumnFilters.push({ id: "role", value: initialFilter.value });
  }

  if (initialBannedStatus) {
    initialColumnFilters.push({
      id: "banned",
      value: initialBannedStatus === "banned",
    });
  }

  const [sorting, setSorting] = useState<SortingState>([
    { id: initialSort.field, desc: initialSort.direction === "desc" },
  ]);

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters);
  const [searchValue, setSearchValue] = useState(initialSearch.value);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  /**
   * Field to search by - used in:
   * @remarks
   * - updateUrlParams: sets searchField in URL params
   * - fetchUsers: includes in API query
   * - Used as dependency in useCallback hooks
   */
  const [searchField, setSearchField] = useState<"email" | "name">(
    initialSearch.field
  );

  /**
   * Search operator type - used in:
   * @remarks
   * - updateUrlParams: sets searchOperator in URL params
   * - fetchUsers: includes in API query
   * - Used as dependency in useCallback hooks
   */
  const [searchOperator, setSearchOperator] = useState<
    "contains" | "starts_with" | "ends_with"
  >(initialSearch.operator);
  const [pageIndex, setPageIndex] = useState(initialPage - 1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const [activeFilters, setActiveFilters] = useState(0);

  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();

    params.set("page", String(pageIndex + 1));
    params.set("pageSize", String(pageSize));

    if (sorting.length > 0) {
      params.set("sortBy", sorting[0].id);
      params.set("sortDirection", sorting[0].desc ? "desc" : "asc");
    }

    if (debouncedSearchValue) {
      params.set("searchValue", debouncedSearchValue);
      params.set("searchField", searchField);
      params.set("searchOperator", searchOperator);
    }

    const roleFilter = columnFilters.find((filter) => filter.id === "role");
    if (roleFilter) {
      params.set("filterField", "role");
      params.set("filterOperator", "eq");
      params.set("filterValue", roleFilter.value as string);
    }

    const bannedFilter = columnFilters.find((filter) => filter.id === "banned");
    if (bannedFilter !== undefined) {
      params.set(
        "bannedStatus",
        bannedFilter.value === true ? "banned" : "active"
      );
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [
    pageIndex,
    pageSize,
    sorting,
    debouncedSearchValue,
    searchField,
    searchOperator,
    columnFilters,
    pathname,
    router,
  ]);

  useEffect(() => {
    let count = 0;
    if (searchValue) count++;
    if (columnFilters.some((filter) => filter.id === "role")) count++;
    if (columnFilters.some((filter) => filter.id === "banned")) count++;
    setActiveFilters(count);
  }, [searchValue, columnFilters]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = {
        limit: pageSize,
        offset: pageIndex * pageSize,
        sortBy: sorting.length > 0 ? sorting[0].id : initialSort.field,
        sortDirection:
          sorting.length > 0
            ? sorting[0].desc
              ? "desc"
              : "asc"
            : initialSort.direction,
      } as Record<string, string | number | boolean | object>;

      if (debouncedSearchValue) {
        query.searchField = searchField;
        query.searchOperator = searchOperator;
        query.searchValue = debouncedSearchValue;
      }

      const roleFilter = columnFilters.find((filter) => filter.id === "role");
      if (roleFilter) {
        query.filterField = "role";
        query.filterOperator = "eq";
        query.filterValue = roleFilter.value as string;
      }

      const bannedFilter = columnFilters.find(
        (filter) => filter.id === "banned"
      );

      if (bannedFilter !== undefined) {
        if (bannedFilter.value === true) {
          if (roleFilter) {
            query.filterAnd = [
              {
                field: "banned",
                operator: "eq",
                value: true,
              },
            ];
          } else {
            query.filterField = "banned";
            query.filterOperator = "eq";
            query.filterValue = true;
          }
        } else {
          if (roleFilter) {
            query.filterAnd = [
              {
                field: "banned",
                operator: "eq",
                value: false,
              },
            ];
          } else {
            query.filterField = "banned";
            query.filterOperator = "eq";
            query.filterValue = false;
          }
        }
      }

      const result = await authClient.admin.listUsers({ query });

      if (result.error) {
        setError(result.error.message || "Failed to fetch users.");
        setUsers([]);
        setTotalUsers(0);
      } else if (result.data) {
        const typedUsers = (result.data.users || []).map((user) => ({
          ...user,
          banned: user.banned === undefined ? null : user.banned,
        })) as ExtendedUser[];

        setUsers(typedUsers);
        setTotalUsers(result.data.total || 0);
      } else {
        setError("Received unexpected data structure from API.");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [
    pageSize,
    pageIndex,
    debouncedSearchValue,
    searchField,
    searchOperator,
    sorting,
    columnFilters,
    initialSort.field,
    initialSort.direction,
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    updateUrlParams();
  }, [updateUrlParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPageIndex(0);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setPageIndex(0);
  };

  const handleSearchFieldChange = (field: "email" | "name") => {
    setSearchField(field);
    setPageIndex(0);
  };

  const handleSearchOperatorChange = (
    operator: "contains" | "starts_with" | "ends_with"
  ) => {
    setSearchOperator(operator);
    setPageIndex(0);
  };

  const handleResetFilters = () => {
    setSearchValue("");
    setSearchField("email");
    setSearchOperator("contains");
    setColumnFilters([]);
    setPageIndex(0);
  };

  const handleApplyFilters = () => {
    setIsApplyingFilters(true);
    setPageIndex(0);
    fetchUsers();
    setTimeout(() => setIsApplyingFilters(false), 300);
  };

  const handlePaginationChange = ({
    pageIndex,
    pageSize,
  }: {
    pageIndex: number;
    pageSize: number;
  }) => {
    setPageIndex(pageIndex);
    setPageSize(pageSize);
  };

  if (loading && users.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading users...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 text-destructive">
            <AlertTriangle className="mb-2 h-8 w-8" />
            <p className="font-semibold">Error loading users</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Toaster />
      <DataTable
        columns={columns}
        data={users}
        pageCount={Math.ceil(totalUsers / pageSize)}
        onPaginationChange={handlePaginationChange}
        onSortingChange={setSorting}
        onColumnFiltersChange={setColumnFilters}
        sorting={sorting}
        columnFilters={columnFilters}
        pageIndex={pageIndex}
        pageSize={pageSize}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchField={searchField}
        onSearchFieldChange={handleSearchFieldChange}
        searchOperator={searchOperator}
        onSearchOperatorChange={handleSearchOperatorChange}
        onSearchSubmit={handleSearchSubmit}
        clearSearch={handleClearSearch}
        activeFilters={activeFilters}
        resetFilters={handleResetFilters}
        userRoles={USER_ROLES}
        applyFilters={handleApplyFilters}
        isApplyingFilters={isApplyingFilters}
      />
    </>
  );
}

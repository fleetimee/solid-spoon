"use client";

import { useState, useCallback } from "react";
import { UsersTable } from "@/features/admin/users/users-table";
import { CreateUserForm } from "@/features/admin/users/create-user-form";

interface ListUsersQuery {
  limit: number;
  offset: number;
  searchField?: "email" | "name";
  searchOperator?: "contains" | "starts_with" | "ends_with";
  searchValue?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  filter?: Array<{
    field: string;
    operator: "eq" | "neq";
    value: string | boolean;
  }>;
  filterAnd?: Array<{
    field: string;
    operator: "eq" | "neq";
    value: string | boolean;
  }>;
}

export function UserManagementClient({
  initialQuery,
}: {
  initialQuery: ListUsersQuery;
}) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const page = Math.floor(initialQuery.offset / initialQuery.limit) + 1;
  const pageSize = initialQuery.limit;

  const initialSearch = initialQuery.searchValue
    ? {
        field: initialQuery.searchField || "email",
        operator: initialQuery.searchOperator || "contains",
        value: initialQuery.searchValue,
      }
    : undefined;

  const initialSort = initialQuery.sortBy
    ? {
        field: initialQuery.sortBy,
        direction: initialQuery.sortDirection || "asc",
      }
    : undefined;

  const roleFilter = initialQuery.filter?.find(
    (filter) => filter.field === "role"
  );

  const bannedFilter =
    initialQuery.filter?.find((filter) => filter.field === "banned") ||
    initialQuery.filterAnd?.find((filter) => filter.field === "banned");

  const initialFilter = roleFilter
    ? {
        field: roleFilter.field,
        operator: roleFilter.operator,
        value: roleFilter.value as string,
      }
    : undefined;

  const initialBannedStatus = bannedFilter
    ? bannedFilter.value === true
      ? "banned"
      : "active"
    : undefined;

  const handleUserCreated = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <CreateUserForm onUserCreated={handleUserCreated} />
      </div>

      <UsersTable
        key={`users-table-${refreshTrigger}`}
        initialPage={page}
        initialPageSize={pageSize}
        initialSort={initialSort}
        initialFilter={initialFilter}
        initialBannedStatus={initialBannedStatus}
        initialSearch={initialSearch}
      />
    </div>
  );
}

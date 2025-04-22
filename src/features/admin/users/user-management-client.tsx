"use client";

import { useState, useCallback } from "react";
import { UsersTable } from "@/features/users/components/users-table";
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
    value: string;
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

  const initialFilter =
    initialQuery.filter && initialQuery.filter.length > 0
      ? {
          field: initialQuery.filter[0].field,
          operator: initialQuery.filter[0].operator,
          value: initialQuery.filter[0].value,
        }
      : undefined;

  // Callback for when a user is created
  const handleUserCreated = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <CreateUserForm onUserCreated={handleUserCreated} />
      </div>

      <UsersTable
        key={`users-table-${refreshTrigger}`}
        initialPage={page}
        initialPageSize={pageSize}
        initialSearch={initialSearch}
        initialSort={initialSort}
        initialFilter={initialFilter}
      />
    </div>
  );
}

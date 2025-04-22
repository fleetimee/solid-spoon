"use client";

import React, { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { columns } from "@/features/admin/users/user-table-columns";
import { UserDataTable } from "@/features/admin/users/user-data-table";
import { UserTablePagination } from "@/features/admin/users/user-table-pagination";
import { CreateUserForm } from "./create-user-form";
import { Toaster } from "@/components/ui/sonner";
import type { User } from "better-auth";
import { Loader2, AlertTriangle, Users, ListFilter } from "lucide-react";

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

interface UserManagementClientProps {
  initialQuery: ListUsersQuery;
}

export function UserManagementClient({
  initialQuery,
}: UserManagementClientProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<ListUsersQuery>(initialQuery);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshUsers = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      console.log("Fetching users with query:", query);
      try {
        const result = await authClient.admin.listUsers({ query });
        console.log("Fetched users result:", result);

        if (result.error) {
          console.error("Error fetching users:", result.error);
          setError(result.error.message || "Failed to fetch users.");
          setUsers([]);
          setTotal(0);
        } else if (result.data) {
          setUsers(result.data.users || []);
          setTotal(result.data.total || 0);
        } else {
          setError("Received unexpected data structure from API.");
          setUsers([]);
          setTotal(0);
        }
      } catch (err: unknown) {
        console.error("Caught error fetching users:", err);
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(errorMessage);
        setUsers([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [query, refreshKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-destructive">
        <AlertTriangle className="mb-2 h-8 w-8" />
        <p className="font-semibold">Error loading users</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Toaster richColors />
      <div className="flex justify-end mb-4">
        {" "}
        <CreateUserForm onUserCreated={refreshUsers} />{" "}
      </div>
      <UserDataTable columns={columns} data={users} />
      {total > 0 && (
        <UserTablePagination
          total={total}
          limit={query.limit}
          offset={query.offset}
        />
      )}
      <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
        {total > 0 ? (
          <>
            <Users className="mr-2 h-4 w-4" />
            Showing {query.offset + 1} to{" "}
            {Math.min(query.offset + query.limit, total)} of {total} users
          </>
        ) : (
          <>
            <ListFilter className="mr-2 h-4 w-4" /> No users found matching your
            criteria.
          </>
        )}
      </div>
    </>
  );
}

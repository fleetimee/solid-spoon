"use client";

import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import { authClient } from "@/lib/auth-client";
import { columns } from "@/features/admin/users/user-table-columns";
import { UserDataTable } from "@/features/admin/users/user-data-table";
import { UserTablePagination } from "@/features/admin/users/user-table-pagination";
import { CreateUserForm } from "./create-user-form"; // Import the new form
import { Toaster } from "@/components/ui/sonner"; // Import Toaster
import type { User } from "better-auth"; // Import User type from better-auth

// Define the structure for the listUsers query payload (matching page.tsx)
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
  const [refreshKey, setRefreshKey] = useState(0); // State to trigger refresh

  // Callback to refresh users by incrementing the refreshKey
  const refreshUsers = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  useEffect(() => {
    // Update query state if initialQuery changes (e.g., due to searchParams update)
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      console.log("Fetching users with query:", query); // Debugging line
      try {
        // Use authClient here
        const result = await authClient.admin.listUsers({ query });
        console.log("Fetched users result:", result); // Debugging line

        if (result.error) {
          console.error("Error fetching users:", result.error);
          setError(result.error.message || "Failed to fetch users.");
          setUsers([]);
          setTotal(0);
        } else if (result.data) {
          setUsers(result.data.users || []);
          setTotal(result.data.total || 0);
        } else {
          // Handle unexpected response structure
          setError("Received unexpected data structure from API.");
          setUsers([]);
          setTotal(0);
        }
      } catch (err: unknown) {
        // Use unknown for better type safety
        console.error("Caught error fetching users:", err);
        // Type check before accessing properties
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, refreshKey]); // Re-fetch when query or refreshKey changes

  if (loading) {
    // Optional: Add a loading indicator
    return <div className="p-4 text-center">Loading users...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <Toaster richColors /> {/* Add Toaster component */}
      <div className="flex justify-end mb-4">
        {" "}
        {/* Add container for the button */}
        <CreateUserForm onUserCreated={refreshUsers} />{" "}
        {/* Render the form/button */}
      </div>
      {/* Render the data table */}
      <UserDataTable columns={columns} data={users} />
      {/* Render pagination */}
      {total > 0 && (
        <UserTablePagination
          total={total}
          limit={query.limit}
          offset={query.offset}
        />
      )}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        {total > 0 ? (
          <>
            Showing {query.offset + 1} to{" "}
            {Math.min(query.offset + query.limit, total)} of {total} users
          </>
        ) : (
          "No users found."
        )}
      </div>
    </>
  );
}

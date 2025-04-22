import { UserManagementClient } from "@/features/admin/users/user-management-client";
import { Users } from "lucide-react";

// Properly typed search parameters
type SearchParams = { [key: string]: string | string[] | undefined };

interface UserPageSearchParams extends SearchParams {
  page?: string;
  pageSize?: string;
  searchField?: "email" | "name";
  searchOperator?: "contains" | "starts_with" | "ends_with";
  searchValue?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  filterField?: string;
  filterOperator?: "eq" | "neq";
  filterValue?: string;
}

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

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<UserPageSearchParams>;
}) {
  const params = await searchParams;

  // Parse pagination params
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const pageSize = Math.min(
    50,
    Math.max(5, parseInt(params.pageSize || "10", 10))
  );
  const offset = (page - 1) * pageSize;

  // Build query object
  const query: ListUsersQuery = {
    limit: pageSize,
    offset,
  };

  // Add search params if present
  if (params.searchValue) {
    query.searchValue = params.searchValue;
    query.searchField = params.searchField || "email";
    query.searchOperator = params.searchOperator || "contains";
  }

  // Add sorting if present
  if (params.sortBy) {
    query.sortBy = params.sortBy;
    query.sortDirection = params.sortDirection || "asc";
  } else {
    // Default sorting by createdAt descending
    query.sortBy = "createdAt";
    query.sortDirection = "desc";
  }

  // Add filtering if present
  if (params.filterField && params.filterOperator && params.filterValue) {
    query.filter = [
      {
        field: params.filterField,
        operator: params.filterOperator as "eq" | "neq",
        value: params.filterValue,
      },
    ];
  }

  return (
    <main className="flex flex-col grow p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Users className="mr-3 h-6 w-6" /> Users
          </h1>
          <p className="text-muted-foreground">
            Manage users and their permissions here.
          </p>
        </div>
      </div>

      <UserManagementClient initialQuery={query} />
    </main>
  );
}

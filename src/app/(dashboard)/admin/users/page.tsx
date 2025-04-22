import { UserManagementClient } from "@/features/admin/users/user-management-client";
import { Users } from "lucide-react";

type SearchParams = { [key: string]: string | string[] | undefined };

interface UserPageSearchParams extends SearchParams {
  limit?: string;
  offset?: string;
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
  const awaitedSearchParams = await searchParams;

  const limit = parseInt(awaitedSearchParams.limit || "10", 10);
  const offset = parseInt(awaitedSearchParams.offset || "0", 10);
  const searchField = awaitedSearchParams.searchField;
  const searchOperator = awaitedSearchParams.searchOperator;
  const searchValue = awaitedSearchParams.searchValue;
  const sortBy = awaitedSearchParams.sortBy;
  const sortDirection = awaitedSearchParams.sortDirection;
  const filterField = awaitedSearchParams.filterField;
  const filterOperator = awaitedSearchParams.filterOperator;
  const filterValue = awaitedSearchParams.filterValue;

  const query: ListUsersQuery = {
    limit,
    offset,
  };

  if (searchField && searchOperator && searchValue) {
    query.searchField = searchField;
    query.searchOperator = searchOperator;
    query.searchValue = searchValue;
  }
  if (sortBy) {
    query.sortBy = sortBy;
    query.sortDirection = sortDirection || "asc";
  }
  if (filterField && filterOperator && filterValue) {
    query.filter = [
      {
        field: filterField,
        operator: filterOperator,
        value: filterValue,
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

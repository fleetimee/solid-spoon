import { UserManagementClient } from "@/features/admin/users/user-management-client";

type SearchParams = Record<string, string | string[] | undefined>;

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
  bannedStatus?: "banned" | "active";
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
    value: string | boolean;
  }>;
  filterAnd?: Array<{
    field: string;
    operator: "eq" | "neq";
    value: string | boolean;
  }>;
}

interface PageProps {
  searchParams: Promise<UserPageSearchParams>;
}

export default async function UsersPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const pageSize = Math.min(
    50,
    Math.max(5, parseInt(searchParams.pageSize || "10", 10))
  );
  const offset = (page - 1) * pageSize;

  const query: ListUsersQuery = {
    limit: pageSize,
    offset,
  };

  if (searchParams.searchValue) {
    query.searchValue = searchParams.searchValue;
    query.searchField = searchParams.searchField || "email";
    query.searchOperator = searchParams.searchOperator || "contains";
  }

  if (searchParams.sortBy) {
    query.sortBy = searchParams.sortBy;
    query.sortDirection = searchParams.sortDirection || "asc";
  } else {
    query.sortBy = "createdAt";
    query.sortDirection = "desc";
  }

  if (
    searchParams.filterField &&
    searchParams.filterOperator &&
    searchParams.filterValue
  ) {
    query.filter = [
      {
        field: searchParams.filterField,
        operator: searchParams.filterOperator as "eq" | "neq",
        value: searchParams.filterValue,
      },
    ];
  }

  if (searchParams.bannedStatus) {
    const isBanned = searchParams.bannedStatus === "banned";

    if (query.filter) {
      query.filterAnd = [
        {
          field: "banned",
          operator: "eq",
          value: isBanned,
        },
      ];
    } else {
      query.filter = [
        {
          field: "banned",
          operator: "eq",
          value: isBanned,
        },
      ];
    }
  }

  return (
    <main className="flex flex-col grow p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">Users</h1>
          <p className="text-muted-foreground">
            Manage users and their permissions here.
          </p>
        </div>
      </div>

      <UserManagementClient initialQuery={query} />
    </main>
  );
}

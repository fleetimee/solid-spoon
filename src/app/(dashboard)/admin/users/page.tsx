import { UserManagementClient } from "@/features/admin/users/user-management-client";
import { BreadcrumbSetter } from "@/components/breadcrumb-setter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management",
  description: "View and manage all users in the reservation system",
  openGraph: {
    description: "Browse and manage all users in the reservation system",
  },
};

const usersBreadcrumb = [{ label: "Users" }, { label: "Manage Users" }];

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
    <>
      <BreadcrumbSetter items={usersBreadcrumb} />

      <main className="flex flex-col grow p-4 md:p-8">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage users and their permissions here.
          </p>
        </div>

        <UserManagementClient initialQuery={query} />
      </main>
    </>
  );
}

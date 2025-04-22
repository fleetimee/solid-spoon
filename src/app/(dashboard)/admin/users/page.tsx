import { authClient } from "@/lib/auth-client";
import { columns } from "@/features/admin/users/user-table-columns";
import { UserDataTable } from "@/features/admin/users/user-data-table";
import { UserTablePagination } from "@/features/admin/users/user-table-pagination";
// Define a basic SearchParams type locally
type SearchParams = { [key: string]: string | string[] | undefined };

// Define expected search param types based on better-auth docs
interface UserPageSearchParams extends SearchParams {
  limit?: string;
  offset?: string;
  searchField?: "email" | "name";
  searchOperator?: "contains" | "starts_with" | "ends_with";
  searchValue?: string;
  sortBy?: string; // e.g., "createdAt", "email", "name"
  sortDirection?: "asc" | "desc";
  filterField?: string; // e.g., "role"
  filterOperator?: "eq" | "neq"; // Add more as needed based on API
  filterValue?: string;
}

// Define the structure for the listUsers query payload
interface ListUsersQuery {
  limit: number;
  offset: number;
  searchField?: "email" | "name";
  searchOperator?: "contains" | "starts_with" | "ends_with";
  searchValue?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  filter?: Array<{
    // Filter is an array of objects
    field: string;
    operator: "eq" | "neq"; // Add more operators as needed
    value: string;
  }>;
  // The API docs also showed filterField, filterOperator, filterValue directly
  // Check which format your specific better-auth version expects
  // filterField?: string;
  // filterOperator?: string;
  // filterValue?: string;
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: UserPageSearchParams;
}) {
  // Extract and validate query parameters
  const limit = parseInt(searchParams.limit || "10", 10);
  const offset = parseInt(searchParams.offset || "0", 10);
  const searchField = searchParams.searchField;
  const searchOperator = searchParams.searchOperator;
  const searchValue = searchParams.searchValue;
  const sortBy = searchParams.sortBy;
  const sortDirection = searchParams.sortDirection;
  const filterField = searchParams.filterField;
  const filterOperator = searchParams.filterOperator;
  const filterValue = searchParams.filterValue;

  // Construct query object for listUsers
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
    // Assuming filter is an array as per docs, adjust if needed
    query.filter = [
      {
        field: filterField,
        operator: filterOperator,
        value: filterValue,
      },
    ];
    // If the API expects filterField, filterOperator, filterValue directly:
    // query.filterField = filterField;
    // query.filterOperator = filterOperator;
    // query.filterValue = filterValue;
  }

  // Fetch users and handle potential errors
  const result = await authClient.admin.listUsers({ query });

  console.log("Fetched users:", result); // Debugging line

  if (result.error) {
    console.error("Error fetching users:", result.error);
    // Optionally render an error message to the user
    return (
      <main className="flex flex-col grow p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-muted-foreground">
              Manage users and their permissions here.
            </p>
          </div>
        </div>
        <div className="text-red-500">
          Error loading users. Please try again later.
        </div>
      </main>
    );
  }

  // Destructure data only if there's no error
  const { users, total } = result.data;

  return (
    <main className="flex flex-col grow p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage users and their permissions here.
          </p>
        </div>
        {/* Add Create User Button or other actions here if needed */}
      </div>

      {/* Render the data table */}
      <UserDataTable columns={columns} data={users || []} />

      {/* Render pagination */}
      {total > 0 && (
        <UserTablePagination total={total} limit={limit} offset={offset} />
      )}
    </main>
  );
}

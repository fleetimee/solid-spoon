// Removed unused imports: authClient, columns, UserDataTable, UserTablePagination
import { UserManagementClient } from "@/features/admin/users/user-management-client";
import { Users } from "lucide-react"; // Import Users icon

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
  searchParams: Promise<UserPageSearchParams>; // Wrap in Promise
}) {
  const awaitedSearchParams = await searchParams; // Await the searchParams

  // Extract and validate query parameters using the awaited object
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

  // Data fetching logic moved to UserManagementClient

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
        {/* Add Create User Button or other actions here if needed */}
      </div>

      {/* Render the client component, passing the server-calculated query */}
      <UserManagementClient initialQuery={query} />
    </main>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { columns } from "@/features/admin/users/user-table-columns";
import { Toaster } from "@/components/ui/sonner";
import {
  Loader2,
  AlertTriangle,
  Users,
  Search,
  ListFilter,
  X,
  SlidersHorizontal,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import type { User } from "better-auth";

import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Types for search parameters
interface SearchParams {
  field: "email" | "name";
  operator: "contains" | "starts_with" | "ends_with";
  value: string;
}

interface SortParams {
  field: string;
  direction: "asc" | "desc";
}

interface FilterParams {
  field: string;
  operator: string;
  value: string;
}

// Props for UsersTable component
interface UsersTableProps {
  initialPage: number;
  initialPageSize: number;
  initialSearch: SearchParams;
  initialSort: SortParams;
  initialFilter?: FilterParams;
  onParamChange: (params: Record<string, string | null>) => void;
}

export function UsersTable({
  initialPage,
  initialPageSize,
  initialSearch,
  initialSort,
  initialFilter,
  onParamChange,
}: UsersTableProps) {
  // State for table data
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Table state
  const [sorting, setSorting] = useState<SortingState>([
    { id: initialSort.field, desc: initialSort.direction === "desc" },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchValue, setSearchValue] = useState(initialSearch.value);
  const [searchField, setSearchField] = useState<"email" | "name">(
    initialSearch.field
  );
  const [searchOperator, setSearchOperator] = useState<
    "contains" | "starts_with" | "ends_with"
  >(initialSearch.operator);
  const [pageIndex, setPageIndex] = useState(initialPage - 1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isFiltering, setIsFiltering] = useState(false);

  // Initialize role filter if provided
  useEffect(() => {
    if (initialFilter && initialFilter.field === "role") {
      setColumnFilters([{ id: "role", value: initialFilter.value }]);
    }
  }, [initialFilter]);

  // Fetch users based on current parameters
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query based on current state
      const query = {
        limit: pageSize,
        offset: pageIndex * pageSize,
        searchField: searchValue ? searchField : undefined,
        searchOperator: searchValue ? searchOperator : undefined,
        searchValue: searchValue || undefined,
        sortBy: sorting.length > 0 ? sorting[0].id : initialSort.field,
        sortDirection:
          sorting.length > 0
            ? sorting[0].desc
              ? "desc"
              : "asc"
            : initialSort.direction,
      };

      // Add role filter if set
      const roleFilter = columnFilters.find((filter) => filter.id === "role");
      if (roleFilter) {
        query.filterField = "role";
        query.filterOperator = "eq";
        query.filterValue = roleFilter.value as string;
      }

      // Fetch users from API
      const result = await authClient.admin.listUsers({ query });

      console.log("Fetched users result:", result);

      if (result.error) {
        setError(result.error.message || "Failed to fetch users.");
        setUsers([]);
        setTotalUsers(0);
      } else if (result.data) {
        setUsers(result.data.users || []);
        setTotalUsers(result.data.total || 0);
      } else {
        setError("Received unexpected data structure from API.");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [
    pageSize,
    pageIndex,
    searchValue,
    searchField,
    searchOperator,
    sorting,
    columnFilters,
    initialSort.field,
    initialSort.direction,
  ]);

  // Update URL parameters when table state changes
  const updateUrlParams = useCallback(() => {
    const params: Record<string, string | null> = {
      page: String(pageIndex + 1),
      pageSize: String(pageSize),
      sortBy: sorting.length > 0 ? sorting[0].id : null,
      sortDirection:
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : null,
    };

    // Add search params if search is active
    if (searchValue) {
      params.search = searchValue;
      params.searchField = searchField;
      params.searchOperator = searchOperator;
    } else {
      params.search = null;
      params.searchField = null;
      params.searchOperator = null;
    }

    // Add role filter if active
    const roleFilter = columnFilters.find((filter) => filter.id === "role");
    if (roleFilter) {
      params.filterField = "role";
      params.filterOperator = "eq";
      params.filterValue = roleFilter.value as string;
    } else {
      params.filterField = null;
      params.filterOperator = null;
      params.filterValue = null;
    }

    onParamChange(params);
  }, [
    pageIndex,
    pageSize,
    sorting,
    searchValue,
    searchField,
    searchOperator,
    columnFilters,
    onParamChange,
  ]);

  // Effect to fetch users when dependencies change
  useEffect(() => {
    fetchUsers();
    updateUrlParams();
  }, [fetchUsers, updateUrlParams]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Just trigger a fetch - the search value is already in state
    fetchUsers();
    updateUrlParams();
  };

  // Handle clearing search
  const clearSearch = () => {
    setSearchValue("");
    fetchUsers();
    updateUrlParams();
  };

  // Handle page change
  const goToPage = (page: number) => {
    setPageIndex(page);
  };

  // Get pagination items
  const getPaginationItems = () => {
    const totalPages = Math.ceil(totalUsers / pageSize);
    const items = [];

    // Always show first page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink
            onClick={() => goToPage(0)}
            isActive={pageIndex === 0}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (pageIndex > 2) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show nearby pages
    for (
      let i = Math.max(1, pageIndex - 1);
      i <= Math.min(totalPages - 2, pageIndex + 1);
      i++
    ) {
      items.push(
        <PaginationItem key={i + 1}>
          <PaginationLink
            onClick={() => goToPage(i)}
            isActive={pageIndex === i}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (pageIndex < totalPages - 3) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show last page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => goToPage(totalPages - 1)}
            isActive={pageIndex === totalPages - 1}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // Initialize TanStack table
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    manualPagination: true,
    pageCount: Math.ceil(totalUsers / pageSize),
  });

  // Loading state
  if (loading && users.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading users...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 text-destructive">
            <AlertTriangle className="mb-2 h-8 w-8" />
            <p className="font-semibold">Error loading users</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Active filters count
  const activeFiltersCount = (searchValue ? 1 : 0) + columnFilters.length;

  return (
    <>
      <Toaster />
      <div className="space-y-4">
        {/* Search and filters */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchValue && (
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Search configuration</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <div className="p-2">
                <p className="mb-2 text-sm font-medium">Search by:</p>
                <Select
                  value={searchField}
                  onValueChange={(value) =>
                    setSearchField(value as "email" | "name")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-2">
                <p className="mb-2 text-sm font-medium">Operator:</p>
                <Select
                  value={searchOperator}
                  onValueChange={(value) =>
                    setSearchOperator(
                      value as "contains" | "starts_with" | "ends_with"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="starts_with">Starts with</SelectItem>
                    <SelectItem value="ends_with">Ends with</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-center justify-center"
                onSelect={() =>
                  handleSearch({ preventDefault: () => {} } as React.FormEvent)
                }
              >
                Apply Search
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Users</SheetTitle>
                <SheetDescription>
                  Configure filters to narrow down the user list.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium">User Role</h4>
                  <div className="space-y-2">
                    <Button
                      variant={
                        columnFilters.some((f) => f.id === "role")
                          ? "outline"
                          : "default"
                      }
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        const newFilters = columnFilters.filter(
                          (f) => f.id !== "role"
                        );
                        setColumnFilters(newFilters);
                      }}
                    >
                      All Roles
                    </Button>
                    <Button
                      variant={
                        columnFilters.some(
                          (f) => f.id === "role" && f.value === "admin"
                        )
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        const newFilters = columnFilters.filter(
                          (f) => f.id !== "role"
                        );
                        newFilters.push({ id: "role", value: "admin" });
                        setColumnFilters(newFilters);
                      }}
                    >
                      Admin
                    </Button>
                    <Button
                      variant={
                        columnFilters.some(
                          (f) => f.id === "role" && f.value === "moderator"
                        )
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        const newFilters = columnFilters.filter(
                          (f) => f.id !== "role"
                        );
                        newFilters.push({ id: "role", value: "moderator" });
                        setColumnFilters(newFilters);
                      }}
                    >
                      Moderator
                    </Button>
                    <Button
                      variant={
                        columnFilters.some(
                          (f) => f.id === "role" && f.value === "user"
                        )
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        const newFilters = columnFilters.filter(
                          (f) => f.id !== "role"
                        );
                        newFilters.push({ id: "role", value: "user" });
                        setColumnFilters(newFilters);
                      }}
                    >
                      User
                    </Button>
                    <Button
                      variant={
                        columnFilters.some(
                          (f) => f.id === "role" && f.value === "guest"
                        )
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        const newFilters = columnFilters.filter(
                          (f) => f.id !== "role"
                        );
                        newFilters.push({ id: "role", value: "guest" });
                        setColumnFilters(newFilters);
                      }}
                    >
                      Guest
                    </Button>
                  </div>
                </div>
              </div>
              <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 border-t">
                <SheetClose asChild>
                  <Button className="w-full" onClick={() => fetchUsers()}>
                    Apply Filters
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSearchValue("");
                setColumnFilters([]);
                fetchUsers();
                updateUrlParams();
              }}
              title="Clear all filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Active filters display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {searchValue && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Search className="h-3 w-3 mr-1" />
                {searchField === "email" ? "Email" : "Name"}{" "}
                {searchOperator === "contains"
                  ? "contains"
                  : searchOperator === "starts_with"
                    ? "starts with"
                    : "ends with"}
                : {searchValue}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 rounded-full"
                  onClick={clearSearch}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}

            {columnFilters.map((filter) => (
              <Badge
                key={`${filter.id}-${filter.value}`}
                variant="secondary"
                className="flex items-center gap-1"
              >
                <Shield className="h-3 w-3 mr-1" />
                Role: {filter.value as string}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 rounded-full"
                  onClick={() => {
                    setColumnFilters(
                      columnFilters.filter((f) => f.id !== filter.id)
                    );
                  }}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Users table */}
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center py-4">
            <div className="text-sm text-muted-foreground flex items-center">
              {totalUsers > 0 ? (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Showing {pageIndex * pageSize + 1} to{" "}
                  {Math.min((pageIndex + 1) * pageSize, totalUsers)} of{" "}
                  {totalUsers} users
                </>
              ) : (
                <>
                  <ListFilter className="mr-2 h-4 w-4" /> No users found
                  matching your criteria.
                </>
              )}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setPageIndex(0);
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 20, 30, 40, 50].map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Pagination */}
        {totalUsers > 0 && (
          <Pagination className="mt-4">
            <PaginationContent>
              {pageIndex > 0 && (
                <PaginationItem>
                  <PaginationPrevious onClick={() => goToPage(pageIndex - 1)} />
                </PaginationItem>
              )}

              {getPaginationItems()}

              {pageIndex < Math.ceil(totalUsers / pageSize) - 1 && (
                <PaginationItem>
                  <PaginationNext onClick={() => goToPage(pageIndex + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  );
}

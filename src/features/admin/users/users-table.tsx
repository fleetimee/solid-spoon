"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  Filter,
  Shield,
  Calendar,
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
import { Separator } from "@/components/ui/separator";
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

const USER_ROLES = ["admin", "moderator", "user", "guest"];

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

interface UsersTableProps {
  initialPage?: number;
  initialPageSize?: number;
  initialSearch?: SearchParams;
  initialSort?: SortParams;
  initialFilter?: FilterParams;
}

export function UsersTable({
  initialPage = 1,
  initialPageSize = 10,
  initialSearch = { field: "email", operator: "contains", value: "" },
  initialSort = { field: "createdAt", direction: "desc" },
  initialFilter,
}: UsersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([
    { id: initialSort.field, desc: initialSort.direction === "desc" },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialFilter?.field === "role"
      ? [{ id: "role", value: initialFilter.value }]
      : []
  );
  const [searchValue, setSearchValue] = useState(initialSearch.value);
  const [searchField, setSearchField] = useState<"email" | "name">(
    initialSearch.field
  );
  const [searchOperator, setSearchOperator] = useState<
    "contains" | "starts_with" | "ends_with"
  >(initialSearch.operator);
  const [pageIndex, setPageIndex] = useState(initialPage - 1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const [activeFilters, setActiveFilters] = useState(0);
  const [joinedAfter, setJoinedAfter] = useState<string>("");
  const [joinedBefore, setJoinedBefore] = useState<string>("");

  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();

    params.set("page", String(pageIndex + 1));
    params.set("pageSize", String(pageSize));

    if (sorting.length > 0) {
      params.set("sortBy", sorting[0].id);
      params.set("sortDirection", sorting[0].desc ? "desc" : "asc");
    }

    if (searchValue) {
      params.set("searchValue", searchValue);
      params.set("searchField", searchField);
      params.set("searchOperator", searchOperator);
    }

    const roleFilter = columnFilters.find((filter) => filter.id === "role");
    if (roleFilter) {
      params.set("filterField", "role");
      params.set("filterOperator", "eq");
      params.set("filterValue", roleFilter.value as string);
    }

    if (joinedAfter) {
      params.set("joinedAfter", joinedAfter);
    }

    if (joinedBefore) {
      params.set("joinedBefore", joinedBefore);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [
    pageIndex,
    pageSize,
    sorting,
    searchValue,
    searchField,
    searchOperator,
    columnFilters,
    joinedAfter,
    joinedBefore,
    pathname,
    router,
  ]);

  useEffect(() => {
    let count = 0;
    if (searchValue) count++;
    if (columnFilters.some((filter) => filter.id === "role")) count++;
    if (joinedAfter) count++;
    if (joinedBefore) count++;
    setActiveFilters(count);
  }, [searchValue, columnFilters, joinedAfter, joinedBefore]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = {
        limit: pageSize,
        offset: pageIndex * pageSize,
        sortBy: sorting.length > 0 ? sorting[0].id : initialSort.field,
        sortDirection:
          sorting.length > 0
            ? sorting[0].desc
              ? "desc"
              : "asc"
            : initialSort.direction,
      } as Record<string, string | number | boolean>;

      if (searchValue) {
        query.searchField = searchField;
        query.searchOperator = searchOperator;
        query.searchValue = searchValue;
      }

      const roleFilter = columnFilters.find((filter) => filter.id === "role");
      if (roleFilter) {
        query.filterField = "role";
        query.filterOperator = "eq";
        query.filterValue = roleFilter.value as string;
      }

      if (joinedAfter) {
        query.joinedAfter = joinedAfter;
      }

      if (joinedBefore) {
        query.joinedBefore = joinedBefore;
      }

      const result = await authClient.admin.listUsers({ query });

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
    joinedAfter,
    joinedBefore,
    initialSort.field,
    initialSort.direction,
  ]);

  useEffect(() => {
    updateUrlParams();
  }, [
    pageIndex,
    pageSize,
    sorting,
    searchValue,
    searchField,
    searchOperator,
    columnFilters,
    joinedAfter,
    joinedBefore,
    updateUrlParams,
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPageIndex(0);
    fetchUsers();
  };

  const clearSearch = () => {
    setSearchValue("");
    setPageIndex(0);
  };

  const resetFilters = () => {
    setSearchValue("");
    setColumnFilters([]);
    setJoinedAfter("");
    setJoinedBefore("");
    setPageIndex(0);
  };

  const goToPage = (page: number) => {
    setPageIndex(page);
  };

  const applyFilters = () => {
    setIsApplying(true);
    setPageIndex(0);
    fetchUsers();
    setTimeout(() => setIsApplying(false), 300);
  };

  const getPaginationItems = () => {
    const totalPages = Math.ceil(totalUsers / pageSize);
    const items = [];

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

    if (pageIndex > 2) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

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

    if (pageIndex < totalPages - 3) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

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

  const toggleRoleFilter = (role: string | null) => {
    if (role === null) {
      setColumnFilters(columnFilters.filter((f) => f.id !== "role"));
    } else {
      const newFilters = columnFilters.filter((f) => f.id !== "role");
      newFilters.push({ id: "role", value: role });
      setColumnFilters(newFilters);
    }
  };

  const getSelectedRole = (): string | null => {
    const roleFilter = columnFilters.find((f) => f.id === "role");
    return roleFilter ? (roleFilter.value as string) : null;
  };

  const removeFilter = (type: string) => {
    switch (type) {
      case "search":
        setSearchValue("");
        break;
      case "role":
        setColumnFilters(columnFilters.filter((f) => f.id !== "role"));
        break;
      case "joinedAfter":
        setJoinedAfter("");
        break;
      case "joinedBefore":
        setJoinedBefore("");
        break;
      default:
        break;
    }
  };

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (updater) => {
      setSorting(updater);
      setPageIndex(0);
    },
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: Math.ceil(totalUsers / pageSize),
  });

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

  return (
    <>
      <Toaster />
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <div className="relative flex-1">
            <form onSubmit={handleSearch}>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </form>
          </div>

          <div className="flex gap-2">
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
                  onSelect={(e) => {
                    e.preventDefault();
                    handleSearch({
                      preventDefault: () => {},
                    } as React.FormEvent);
                  }}
                >
                  Apply Search
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  {activeFilters > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 px-1.5 min-w-5 rounded-full"
                    >
                      {activeFilters}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md p-0 overflow-y-auto flex flex-col">
                <SheetHeader className="p-6 pb-2">
                  <SheetTitle className="flex items-center">
                    <Filter className="mr-2 h-5 w-5" />
                    User Filters
                  </SheetTitle>
                  <SheetDescription>
                    Refine your user list with these filter options
                  </SheetDescription>
                </SheetHeader>

                <Separator />

                <div className="px-6 py-5 space-y-8 flex-1 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">Role</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Filter users based on their assigned role in the system
                    </p>
                    <div className="space-y-2">
                      {USER_ROLES.map((role) => (
                        <Button
                          key={role}
                          variant={
                            getSelectedRole() === role ? "default" : "outline"
                          }
                          size="sm"
                          className="w-full justify-start capitalize"
                          onClick={() =>
                            toggleRoleFilter(
                              getSelectedRole() === role ? null : role
                            )
                          }
                        >
                          {role}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">Join Date</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Filter users by when they registered in the system
                    </p>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">
                          Joined after
                        </span>
                        <Input
                          type="date"
                          value={joinedAfter}
                          onChange={(e) => setJoinedAfter(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">
                          Joined before
                        </span>
                        <Input
                          type="date"
                          value={joinedBefore}
                          onChange={(e) => setJoinedBefore(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto px-6 py-3 border-t">
                  <div className="text-xs text-muted-foreground mb-2">
                    {activeFilters === 0 ? (
                      <span>No active filters</span>
                    ) : (
                      <span>
                        Active filters: <strong>{activeFilters}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <SheetFooter className="px-6 pb-6 pt-2">
                  <div className="flex w-full gap-3">
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="flex-1"
                    >
                      Reset All
                    </Button>
                    <SheetClose asChild>
                      <Button
                        onClick={applyFilters}
                        className="flex-1"
                        disabled={isApplying}
                      >
                        {isApplying ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Applying...
                          </>
                        ) : (
                          "Apply Filters"
                        )}
                      </Button>
                    </SheetClose>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {activeFilters > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={resetFilters}
                title="Clear all filters"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {activeFilters > 0 && (
          <div className="flex flex-wrap gap-2">
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
                  onClick={() => removeFilter("search")}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}

            {columnFilters.some((f) => f.id === "role") && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="h-3 w-3 mr-1" />
                Role: {getSelectedRole()}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 rounded-full"
                  onClick={() => removeFilter("role")}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}

            {joinedAfter && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="h-3 w-3 mr-1" />
                Joined after: {joinedAfter}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 rounded-full"
                  onClick={() => removeFilter("joinedAfter")}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}

            {joinedBefore && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="h-3 w-3 mr-1" />
                Joined before: {joinedBefore}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 rounded-full"
                  onClick={() => removeFilter("joinedBefore")}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}

            {activeFilters > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs font-medium"
                onClick={resetFilters}
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>
        )}

        <Card>
          <CardContent className="p-0">
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24">
                      <div className="flex justify-center items-center h-full">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
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
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4">
            <div className="text-sm text-muted-foreground flex items-center self-start">
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
            <div className="flex items-center space-x-6 lg:space-x-8 self-end">
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

        {totalUsers > 0 && (
          <Pagination className="mt-4">
            <PaginationContent>
              {pageIndex > 0 && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => goToPage(pageIndex - 1)}
                    aria-disabled={isPending}
                  />
                </PaginationItem>
              )}

              {getPaginationItems()}

              {pageIndex < Math.ceil(totalUsers / pageSize) - 1 && (
                <PaginationItem>
                  <PaginationNext
                    onClick={() => goToPage(pageIndex + 1)}
                    aria-disabled={isPending}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  );
}

"use client";

import { Table } from "@tanstack/react-table";
import {
  X,
  Filter,
  Search,
  ListFilter,
  Shield,
  Calendar,
  Loader2,
  Settings,
  ChevronRight,
  Users,
  Mail,
  Clock,
  CalendarDays,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchValue: string;
  onSearchChange: (value: string) => void;
  /** Field to search by (used in constructing the search query) */
  searchField: "email" | "name";
  /** Search operator to use (used in constructing the search query) */
  searchOperator: "contains" | "starts_with" | "ends_with";
  onSearchSubmit: (e: React.FormEvent) => void;
  clearSearch: () => void;
  activeFilters: number;
  resetFilters: () => void;
  userRoles: string[];
  joinedAfter: string;
  setJoinedAfter: (date: string) => void;
  joinedBefore: string;
  setJoinedBefore: (date: string) => void;
  applyFilters: () => void;
  isApplyingFilters: boolean;
}

export function DataTableToolbar<TData>({
  table,
  searchValue,
  onSearchChange,
  searchField,
  searchOperator,
  onSearchSubmit,
  clearSearch,
  activeFilters,
  resetFilters,
  userRoles,
  joinedAfter,
  setJoinedAfter,
  joinedBefore,
  setJoinedBefore,
  applyFilters,
  isApplyingFilters,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    searchValue ||
    joinedAfter ||
    joinedBefore;

  const toggleRoleFilter = (value: string) => {
    if (value === "all") {
      table.getColumn("role")?.setFilterValue(undefined);
    } else {
      table.getColumn("role")?.setFilterValue(value);
    }
  };

  const getSelectedRole = (): string | null => {
    const filterValue = table.getColumn("role")?.getFilterValue();
    return filterValue === undefined || filterValue === "all"
      ? null
      : (filterValue as string);
  };

  const removeFilter = (type: string) => {
    switch (type) {
      case "search":
        clearSearch();
        break;
      case "role":
        table.getColumn("role")?.setFilterValue(undefined);
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <div className="relative flex-1">
          <form onSubmit={onSearchSubmit}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users by email or name..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-10 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
            />
            {searchValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </form>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Shield className="h-4 w-4" />
                Role
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={!getSelectedRole()}
                onCheckedChange={() => toggleRoleFilter("all")}
              >
                All Roles
              </DropdownMenuCheckboxItem>
              {userRoles.map((role) => (
                <DropdownMenuCheckboxItem
                  key={role}
                  checked={getSelectedRole() === role}
                  onCheckedChange={() => toggleRoleFilter(role)}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
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
                  Find specific users by refining your search
                </SheetDescription>
              </SheetHeader>

              <Separator />

              <div className="px-6 py-5 space-y-8 flex-1 overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Search By</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Choose which field to search in
                  </p>
                  <Select
                    value={searchField}
                    onValueChange={(value) => {
                      // This would need to be implemented in the parent component
                      // setSearchField(value as "email" | "name")
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select field to search" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Address</SelectItem>
                      <SelectItem value="name">User Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">User Role</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Filter users by their assigned role
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        <span className="flex items-center">
                          <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>
                            {getSelectedRole()
                              ? (getSelectedRole() as string)
                                  .charAt(0)
                                  .toUpperCase() +
                                (getSelectedRole() as string).slice(1)
                              : "All roles"}
                          </span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[320px]">
                      <DropdownMenuLabel>Available Roles</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={!getSelectedRole()}
                        onCheckedChange={() => toggleRoleFilter("all")}
                      >
                        All Roles
                      </DropdownMenuCheckboxItem>
                      {userRoles.map((role) => (
                        <DropdownMenuCheckboxItem
                          key={role}
                          checked={getSelectedRole() === role}
                          onCheckedChange={() =>
                            getSelectedRole() === role
                              ? toggleRoleFilter("all")
                              : toggleRoleFilter(role)
                          }
                        >
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Join Date Range</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Filter users by when they joined the platform
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          From
                        </span>
                      </div>
                      <Input
                        type="date"
                        value={joinedAfter}
                        onChange={(e) => setJoinedAfter(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          To
                        </span>
                      </div>
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
                      disabled={isApplyingFilters}
                    >
                      {isApplyingFilters ? (
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

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="h-9 px-2 lg:px-3 text-muted-foreground hover:text-foreground"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {isFiltered && (
        <div className="flex min-h-[2.25rem] flex-wrap items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground mr-1" />
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {searchValue && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Search className="h-3 w-3 mr-1" />
              {searchField === "email" ? "Email" : "Name"}
              {" contains: "}
              <span className="font-semibold">{searchValue}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFilter("search")}
                className="h-4 w-4 ml-1 rounded-full"
              >
                <X className="h-2 w-2" />
                <span className="sr-only">Remove search filter</span>
              </Button>
            </Badge>
          )}

          {getSelectedRole() && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="h-3 w-3 mr-1" />
              Role:{" "}
              <span className="font-semibold capitalize">
                {getSelectedRole()}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFilter("role")}
                className="h-4 w-4 ml-1 rounded-full"
              >
                <X className="h-2 w-2" />
                <span className="sr-only">Remove role filter</span>
              </Button>
            </Badge>
          )}

          {joinedAfter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="h-3 w-3 mr-1" />
              From: <span className="font-semibold">{joinedAfter}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFilter("joinedAfter")}
                className="h-4 w-4 ml-1 rounded-full"
              >
                <X className="h-2 w-2" />
                <span className="sr-only">Remove joined after filter</span>
              </Button>
            </Badge>
          )}

          {joinedBefore && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="h-3 w-3 mr-1" />
              To: <span className="font-semibold">{joinedBefore}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFilter("joinedBefore")}
                className="h-4 w-4 ml-1 rounded-full"
              >
                <X className="h-2 w-2" />
                <span className="sr-only">Remove joined before filter</span>
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
    </div>
  );
}

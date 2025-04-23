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
    <div className="flex flex-col md:flex-row md:items-center gap-2">
      <div className="relative flex-1">
        <form onSubmit={onSearchSubmit}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
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
              <ListFilter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => toggleRoleFilter("all")}>
              All Roles
            </DropdownMenuItem>
            {userRoles.map((role) => (
              <DropdownMenuItem
                key={role}
                onSelect={() => toggleRoleFilter(role)}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="mr-2 h-4 w-4" /> More Filters
              {activeFilters > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full"
                >
                  {activeFilters}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md p-0 overflow-y-auto flex flex-col">
            <SheetHeader className="p-6 pb-2">
              <SheetTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" /> Advanced Filters
              </SheetTitle>
              <SheetDescription>
                Apply additional filters to refine your user search.
              </SheetDescription>
            </SheetHeader>
            <Separator />
            <div className="flex-1 p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <Shield className="mr-2 h-5 w-5" /> Role
                </h3>
                <Select
                  value={getSelectedRole() || ""}
                  onValueChange={(value) => toggleRoleFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {userRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <Calendar className="mr-2 h-5 w-5" /> Joined Date
                </h3>
                <div className="space-y-1">
                  <label htmlFor="joinedAfter" className="text-sm">
                    Joined After:
                  </label>
                  <Input
                    id="joinedAfter"
                    type="date"
                    value={joinedAfter}
                    onChange={(e) => setJoinedAfter(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="joinedBefore" className="text-sm">
                    Joined Before:
                  </label>
                  <Input
                    id="joinedBefore"
                    type="date"
                    value={joinedBefore}
                    onChange={(e) => setJoinedBefore(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <SheetFooter className="px-6 pb-6 pt-2">
              <div className="flex w-full gap-3">
                {activeFilters > 0 && (
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="flex-1"
                  >
                    Reset Filters
                  </Button>
                )}
                <SheetClose asChild>
                  <Button
                    onClick={applyFilters}
                    className="flex-1"
                    disabled={isApplyingFilters}
                  >
                    {isApplyingFilters ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Apply Filters
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
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap mt-2">
        {searchValue && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {searchField === "email" ? "Email" : "Name"}{" "}
            {searchOperator.replace(/_/g, " ")} &ldquo;{searchValue}&rdquo;
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeFilter("search")}
              className="h-4 w-4 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}
        {(table.getColumn("role")?.getFilterValue() as string | null) && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Role: {getSelectedRole()}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeFilter("role")}
              className="h-4 w-4 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}
        {joinedAfter && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Joined After: {joinedAfter}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeFilter("joinedAfter")}
              className="h-4 w-4 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}
        {joinedBefore && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Joined Before: {joinedBefore}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeFilter("joinedBefore")}
              className="h-4 w-4 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}
      </div>
    </div>
  );
}

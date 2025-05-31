"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns"; // For formatting dates
import {
  Building,
  CheckCircle2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react"; // Enhanced icons
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Removed Sheet imports
import { ReservationWithDetails } from "@/features/reservations/api/getAllReservations";

// Removed TableMeta declaration modification

interface ReservationsDataTableProps<
  TData extends ReservationWithDetails,
  TValue,
> {
  // Ensure TData extends ReservationWithDetails
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number; // Added pageCount prop
  rooms: { id: number; name: string }[];
  statuses: { id: number; value: string }[];
  isLoading?: boolean;
}

export function ReservationsDataTable<
  TData extends ReservationWithDetails,
  TValue,
>({
  columns,
  data,
  pageCount, // Destructure pageCount
  rooms,
  statuses,
  isLoading = false,
}: ReservationsDataTableProps<TData, TValue>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Removed Sheet state and handlers

  // Get current page from searchParams, default to 1
  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);

  // Debounce state for search input
  const [debouncedValue, setDebouncedValue] = React.useState(
    searchParams.get("search") ?? ""
  );
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount, // Set pageCount for manual pagination
    manualPagination: true, // Enable manual pagination
    manualFiltering: true, // Indicate filtering is handled externally
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    // Removed meta property for handleViewSheet
  });

  // Effect to update URL when debounced search value changes
  React.useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const value = debouncedValue.trim();

    if (!value) {
      current.delete("search");
    } else {
      current.set("search", value);
    }
    // Reset page to 1 when search filter changes
    current.set("page", "1");

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${window.location.pathname}${query}`);
  }, [debouncedValue, router, searchParams]);

  // Handle input change with debounce
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, 500); // 500ms debounce delay
  };

  // Handler for Select components (Room and Status filters)
  const handleSelectChange = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (value === "all") {
      current.delete(key);
    } else {
      current.set(key, value);
    }
    // Reset page to 1 when filters change
    current.set("page", "1");

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${window.location.pathname}${query}`);
  };

  // Handler for pagination buttons
  const handlePageChange = (newPage: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", String(newPage));
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${window.location.pathname}${query}`);
  };

  // Enhanced loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Filters skeleton */}
        <Card className="border-0 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-gray-500">
                <Filter className="h-5 w-5 text-white" />
              </div>
              <div>
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-32 mt-1" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-48" />
            </div>
          </CardContent>
        </Card>

        {/* Table skeleton */}
        <Card className="border-0 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 shadow-lg">
          <CardContent className="p-0">
            <div className="space-y-4 p-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Filters Section */}
      <Card className="border-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 shadow-md">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-purple-800 dark:text-purple-200">
                Filter Reservations
              </CardTitle>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Search and filter through all reservations
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Filter by name or ID..."
                defaultValue={searchParams.get("search") ?? ""}
                onChange={handleInputChange}
                className="pl-10 bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-800 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Room Filter Select */}
            <Select
              value={searchParams.get("roomId") ?? "all"}
              onValueChange={(value) => handleSelectChange("roomId", value)}
            >
              <SelectTrigger className="w-full sm:w-[200px] bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-800">
                <Building className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                <SelectValue placeholder="Filter by Room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={String(room.id)}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter Select */}
            <Select
              value={searchParams.get("statusId") ?? "all"}
              onValueChange={(value) => handleSelectChange("statusId", value)}
            >
              <SelectTrigger className="w-full sm:w-[200px] bg-white/80 dark:bg-gray-800/80 border-purple-200 dark:border-purple-800">
                <CheckCircle2 className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.id} value={String(status.id)}>
                    {status.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Table Section */}
      <Card className="border-0 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 shadow-lg">
        <CardContent className="p-0">
          <div className="rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className="font-semibold text-slate-700 dark:text-slate-300"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={`hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors duration-200 ${
                        index % 2 === 0
                          ? "bg-white/50 dark:bg-gray-900/50"
                          : "bg-slate-50/50 dark:bg-slate-800/50"
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-4">
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
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Sparkles className="h-12 w-12 text-muted-foreground/50" />
                        <div>
                          <h3 className="font-medium text-slate-700 dark:text-slate-300">
                            No reservations found
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your filters or search terms.
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Pagination Controls */}
      <Card className="border-0 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 shadow-lg">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Page {currentPage} of {pageCount}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="bg-white/80 dark:bg-gray-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pageCount}
                className="bg-white/80 dark:bg-gray-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

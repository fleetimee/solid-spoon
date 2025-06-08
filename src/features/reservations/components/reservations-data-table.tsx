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

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Filters skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Skeleton className="h-10 w-full sm:flex-1" />
          <Skeleton className="h-10 w-full sm:w-[200px]" />
          <Skeleton className="h-10 w-full sm:w-[200px]" />
        </div>

        {/* Table skeleton */}
        <div className="rounded-md border">
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
        </div>

        {/* Pagination skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <Skeleton className="h-5 w-24" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter berdasarkan nama atau ID..."
            defaultValue={searchParams.get("search") ?? ""}
            onChange={handleInputChange}
            className="pl-10"
          />
        </div>

        {/* Room Filter Select */}
        <Select
          value={searchParams.get("roomId") ?? "all"}
          onValueChange={(value) => handleSelectChange("roomId", value)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <Building className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter berdasarkan Ruangan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Ruangan</SelectItem>
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
          <SelectTrigger className="w-full sm:w-[200px]">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter berdasarkan Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status.id} value={String(status.id)}>
                {status.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table Section */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Sparkles className="h-12 w-12 text-muted-foreground/50" />
                    <div>
                      <h3 className="font-medium">
                        Tidak ada reservasi ditemukan
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Coba sesuaikan filter atau kata pencarian Anda.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <div className="text-sm font-medium text-muted-foreground">
          Halaman {currentPage} dari {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= pageCount}
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

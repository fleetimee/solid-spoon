"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns"; // For formatting dates
import { Building, CheckCircle2, Search } from "lucide-react"; // Added icons
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  return (
    <div>
      <div className="flex items-center space-x-2 py-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter by name or ID..."
            defaultValue={searchParams.get("search") ?? ""}
            onChange={handleInputChange}
            className="max-w-sm pl-8" // Added pl-8
          />
        </div>
        {/* Room Filter Select */}
        <Select
          value={searchParams.get("roomId") ?? "all"}
          onValueChange={(value) => handleSelectChange("roomId", value)}
        >
          <SelectTrigger className="w-[180px]">
            <Building className="mr-2 h-4 w-4" /> {/* Added Icon */}
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
          <SelectTrigger className="w-[180px]">
            <CheckCircle2 className="mr-2 h-4 w-4" /> {/* Added Icon */}
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {pageCount}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= pageCount}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Removed Reservation Details Sheet */}
    </div>
  );
}

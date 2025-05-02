"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Added
import {
  ColumnDef,
  // Removed ColumnFiltersState
  SortingState,
  flexRender,
  getCoreRowModel,
  // Removed getFilteredRowModel
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Added Select imports
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ReservationsDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rooms: { id: number; name: string }[]; // Added rooms prop
  statuses: { id: number; value: string }[]; // Added statuses prop
}

export function ReservationsDataTable<TData, TValue>({
  columns,
  data,
  rooms, // Destructure new props
  statuses, // Destructure new props
}: ReservationsDataTableProps<TData, TValue>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  // Removed columnFilters state

  // Debounce state
  const [debouncedValue, setDebouncedValue] = React.useState(
    searchParams.get("userName") ?? ""
  );
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    // Removed onColumnFiltersChange
    // Removed getFilteredRowModel
    state: {
      sorting,
      // Removed columnFilters
    },
    manualFiltering: true, // Indicate filtering is handled externally
  });

  // Effect to update URL when debounced value changes
  React.useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries())); // Use current params
    const value = debouncedValue.trim();

    if (!value) {
      current.delete("userName");
    } else {
      current.set("userName", value);
    }

    // Construct the new search string
    const search = current.toString();
    const query = search ? `?${search}` : ""; // Avoid trailing '?' if empty

    // Use replace to avoid adding multiple filter states to history
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

  // Handler for Select components
  const handleSelectChange = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (value === "all") {
      // Check for 'all' value
      current.delete(key); // Delete the parameter if 'all' is selected
    } else {
      current.set(key, value);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${window.location.pathname}${query}`);
  };

  return (
    <div>
      <div className="flex items-center space-x-2 py-4">
        {" "}
        {/* Added space-x-2 */}
        <Input
          placeholder="Filter by user name..."
          defaultValue={searchParams.get("userName") ?? ""}
          onChange={handleInputChange}
          className="max-w-sm"
        />
        {/* Room Filter Select */}
        <Select
          value={searchParams.get("roomId") ?? "all"} // Default to 'all'
          onValueChange={(value) => handleSelectChange("roomId", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Room" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rooms</SelectItem>{" "}
            {/* Change value to 'all' */}
            {rooms.map((room) => (
              <SelectItem key={room.id} value={String(room.id)}>
                {room.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Status Filter Select */}
        <Select
          value={searchParams.get("statusId") ?? "all"} // Default to 'all'
          onValueChange={(value) => handleSelectChange("statusId", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>{" "}
            {/* Change value to 'all' */}
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
        {/* Removed extra </Table> tag */}
      </div>{" "}
      {/* Added closing div for table */}
    </div>
  );
}

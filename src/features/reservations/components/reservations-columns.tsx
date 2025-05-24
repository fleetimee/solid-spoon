"use client";

import React from "react"; // Remove useState import
import { ColumnDef, Row, Table } from "@tanstack/react-table"; // Add Row and Table for type safety
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react"; // Import specific icons
import { useRouter, useSearchParams } from "next/navigation"; // Import hooks
import Link from "next/link";

import { Badge } from "@/components/ui/badge"; // Added Badge import
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReservationWithDetails } from "@/features/reservations/api/getAllReservations";
import { formatDateToJakarta } from "@/lib/utils/formatDate"; // Import the helper
// Removed Dialog imports

// Helper function to create sortable headers
const createSortableHeader = (
  columnKey: keyof ReservationWithDetails | string, // Allow string for flexibility if needed, but prefer keyof
  headerText: string
): ColumnDef<ReservationWithDetails>["header"] => {
  return ({ column }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSortBy = searchParams.get("sortBy");
    const currentSortOrder = searchParams.get("sortOrder");

    const isSortedByThisColumn = currentSortBy === columnKey;
    const sortIcon = isSortedByThisColumn ? (
      currentSortOrder === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUp className="ml-2 h-4 w-4" />
      )
    ) : (
      <ArrowUpDown className="ml-2 h-4 w-4" />
    );

    const handleClick = () => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      let nextSortOrder: "asc" | "desc" | undefined = undefined;

      if (isSortedByThisColumn) {
        if (currentSortOrder === "asc") {
          nextSortOrder = "desc";
        } else {
          // If desc, clear sorting
          nextSortOrder = undefined;
        }
      } else {
        // If not sorted by this column, sort asc
        nextSortOrder = "asc";
      }

      if (nextSortOrder) {
        current.set("sortBy", columnKey as string); // Cast to string for URL param
        current.set("sortOrder", nextSortOrder);
      } else {
        current.delete("sortBy");
        current.delete("sortOrder");
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";
      // Use replace to avoid adding multiple sort states to history
      router.replace(`${window.location.pathname}${query}`);
    };

    return (
      <Button variant="ghost" onClick={handleClick}>
        {headerText}
        {sortIcon}
      </Button>
    );
  };
};

export const columns: ColumnDef<ReservationWithDetails>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: false, // ID is usually not sortable
    cell: ({ row }) => {
      return <Badge variant="secondary">{row.original.id}</Badge>;
    },
  },
  {
    accessorKey: "userName",
    header: createSortableHeader("userName", "User Name"),
  },
  {
    accessorKey: "roomName",
    header: createSortableHeader("roomName", "Room Name"),
  },
  {
    accessorKey: "startTime",
    header: createSortableHeader("startTime", "Start Time"),
    cell: ({ row }) => {
      return <span>{formatDateToJakarta(row.original.startTime)}</span>;
    },
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    enableSorting: false, // End time might not need sorting if start time is sortable
    cell: ({ row }) => {
      return <span>{formatDateToJakarta(row.original.endTime)}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: createSortableHeader("createdAt", "Created At"),
    cell: ({ row }) => {
      // Use the helper function for consistent formatting
      return <span>{formatDateToJakarta(row.original.createdAt)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: createSortableHeader("status", "Status"),
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" | "outline" =
        "secondary"; // Default to secondary

      switch (status) {
        case "Approved":
          variant = "default"; // Or 'success' if available
          break;
        case "Completed":
          variant = "outline"; // Or 'success'
          break;
        case "Rejected":
        case "Cancelled":
          variant = "destructive";
          break;
        case "Pending":
        default:
          variant = "secondary"; // Or 'warning'
          break;
      }

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    // Add table to cell context for accessing meta
    cell: ({
      row,
      table,
    }: {
      row: Row<ReservationWithDetails>;
      table: Table<ReservationWithDetails>;
    }) => {
      const reservation = row.original;
      // Removed local state for dialog and menu

      // Removed handleViewSheet access

      return (
        <>
          {/* Removed Details Dialog */}

          {/* Dropdown Menu */}
          {/* Removed open and onOpenChange props */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {/* View Details Item using Next Link */}
              <DropdownMenuItem asChild className="cursor-pointer p-0">
                {/* Use asChild on DropdownMenuItem and remove padding */}
                <Link
                  href={`/admin/rooms/reservations/${reservation.id}`}
                  className="flex items-center px-2 py-1.5 text-sm w-full h-full" // Add necessary classes for layout and styling
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Accept Item using Next Link */}
              <DropdownMenuItem
                asChild
                className="cursor-pointer p-0" // Reset padding for the Link
                disabled={reservation.status !== "Pending"}
              >
                <Link
                  href={`/admin/rooms/reservations/${reservation.id}/accept`}
                  className="flex items-center px-2 py-1.5 text-sm w-full h-full" // Add necessary classes
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Accept
                </Link>
              </DropdownMenuItem>
              {/* Reject Item using Next Link */}
              <DropdownMenuItem
                asChild
                className="cursor-pointer p-0" // Reset padding for the Link
                disabled={reservation.status !== "Pending"}
              >
                <Link
                  href={`/admin/rooms/reservations/${reservation.id}/reject`}
                  className="flex items-center px-2 py-1.5 text-sm w-full h-full" // Add necessary classes
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => console.log("Cancel", reservation.id)} // Placeholder
                disabled={["Completed", "Cancelled", "Rejected"].includes(
                  reservation.status
                )}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Cancel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

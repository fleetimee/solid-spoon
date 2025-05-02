"use client";

import { ColumnDef } from "@tanstack/react-table";
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

// Helper function to create sortable headers
const createSortableHeader = (
  columnKey: keyof ReservationWithDetails | string, // Allow string for flexibility if needed, but prefer keyof
  headerText: string
): ColumnDef<ReservationWithDetails>["header"] => {
  return ({ column }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
    cell: ({ row }) => {
      const reservation = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/reservations/${reservation.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => console.log("Approve", reservation.id)} // Placeholder
              disabled={reservation.status !== "Pending"}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Reject", reservation.id)} // Placeholder
              disabled={reservation.status !== "Pending"}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
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
      );
    },
  },
];

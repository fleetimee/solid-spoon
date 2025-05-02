"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"; // Import specific icons
import { useRouter, useSearchParams } from "next/navigation"; // Import hooks

import { Button } from "@/components/ui/button";
import { ReservationWithDetails } from "@/features/reservations/api/getAllReservations";

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
      const startTime = row.getValue("startTime") as Date;
      return <div>{startTime.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    enableSorting: false, // End time might not need sorting if start time is sortable
    cell: ({ row }) => {
      const endTime = row.getValue("endTime") as Date;
      return <div>{endTime.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: createSortableHeader("createdAt", "Created At"),
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date;
      return <div>{createdAt.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "status",
    header: createSortableHeader("status", "Status"),
  },
];

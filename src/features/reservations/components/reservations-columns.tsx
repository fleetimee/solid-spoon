"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ReservationWithDetails } from "@/features/reservations/api/getAllReservations";

export const columns: ColumnDef<ReservationWithDetails>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "userName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "roomName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Room Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const startTime = row.getValue("startTime") as Date;
      return <div>{startTime.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    cell: ({ row }) => {
      const endTime = row.getValue("endTime") as Date;
      return <div>{endTime.toLocaleString()}</div>;
    },
  },
  {
    // Corrected block starts here
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date;
      // Format the date using toLocaleString or your preferred method
      return <div>{createdAt.toLocaleString()}</div>;
    },
  }, // Corrected block ends here
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];

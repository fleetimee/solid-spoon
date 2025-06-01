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
  Clock3,
  User,
  MapPin,
  Calendar,
  Hash,
} from "lucide-react"; // Enhanced icons
import { useRouter, useSearchParams } from "next/navigation"; // Import hooks
import Link from "next/link";

import { Badge } from "@/components/ui/badge"; // Added Badge import
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Added Avatar components
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

// Enhanced status configuration with sophisticated theming
const getStatusConfig = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return {
        variant: "default" as const,
        icon: CheckCircle,
        bgGradient:
          "from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
        textColor: "text-emerald-700 dark:text-emerald-300",
        iconColor: "text-emerald-600 dark:text-emerald-400",
      };
    case "pending":
      return {
        variant: "secondary" as const,
        icon: Clock3,
        bgGradient:
          "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
        textColor: "text-amber-700 dark:text-amber-300",
        iconColor: "text-amber-600 dark:text-amber-400",
      };
    case "rejected":
    case "cancelled":
      return {
        variant: "destructive" as const,
        icon: XCircle,
        bgGradient:
          "from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20",
        textColor: "text-red-700 dark:text-red-300",
        iconColor: "text-red-600 dark:text-red-400",
      };
    case "completed":
      return {
        variant: "outline" as const,
        icon: CheckCircle,
        bgGradient:
          "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
        textColor: "text-blue-700 dark:text-blue-300",
        iconColor: "text-blue-600 dark:text-blue-400",
      };
    default:
      return {
        variant: "outline" as const,
        icon: Clock3,
        bgGradient:
          "from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20",
        textColor: "text-slate-700 dark:text-slate-300",
        iconColor: "text-slate-600 dark:text-slate-400",
      };
  }
};

// Enhanced helper function to create sortable headers with sophisticated styling
const createSortableHeader = (
  columnKey: keyof ReservationWithDetails | string,
  headerText: string,
  icon?: React.ComponentType<{ className?: string }>
): ColumnDef<ReservationWithDetails>["header"] => {
  const SortableHeaderCell = ({ column }: { column: any }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSortBy = searchParams.get("sortBy");
    const currentSortOrder = searchParams.get("sortOrder");

    const isSortedByThisColumn = currentSortBy === columnKey;
    const sortIcon = isSortedByThisColumn ? (
      currentSortOrder === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
      ) : (
        <ArrowUp className="ml-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
      )
    ) : (
      <ArrowUpDown className="ml-2 h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-200" />
    );

    const handleClick = () => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      let nextSortOrder: "asc" | "desc" | undefined = undefined;

      if (isSortedByThisColumn) {
        if (currentSortOrder === "asc") {
          nextSortOrder = "desc";
        } else {
          nextSortOrder = undefined;
        }
      } else {
        nextSortOrder = "asc";
      }

      if (nextSortOrder) {
        current.set("sortBy", columnKey as string);
        current.set("sortOrder", nextSortOrder);
      } else {
        current.delete("sortBy");
        current.delete("sortOrder");
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.replace(`${window.location.pathname}${query}`);
    };

    const Icon = icon;

    return (
      <Button
        variant="ghost"
        onClick={handleClick}
        className={`group h-auto p-2 font-semibold transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 ${
          isSortedByThisColumn
            ? "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300"
            : "text-slate-700 dark:text-slate-300"
        }`}
      >
        <div className="flex items-center">
          {Icon && <Icon className="mr-2 h-4 w-4" />}
          {headerText}
          {sortIcon}
        </div>
      </Button>
    );
  };
  SortableHeaderCell.displayName = `SortableHeaderCell_${headerText.replace(/\s+/g, "")}`;
  return SortableHeaderCell;
};

export const columns: ColumnDef<ReservationWithDetails>[] = [
  {
    accessorKey: "id",
    header: () => (
      <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
        <Hash className="h-4 w-4" />
        ID
      </div>
    ),
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Badge
            variant="outline"
            className="font-mono text-xs bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800 border-slate-300 dark:border-slate-600"
          >
            #{row.original.id}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "userName",
    header: createSortableHeader("userName", "Reserved By", User),
    cell: ({ row }) => {
      const name = row.original.userName || "Unknown User";
      const email = row.original.userEmail;
      const userImage = row.original.userImage;

      // Generate initials similar to user datatable
      const initials = name
        .split(" ")
        .map((part) => part.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userImage || undefined} alt={name} />
            <AvatarFallback className="text-xs">
              {initials || "??"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {name}
            </span>
            {email && (
              <span className="text-sm text-muted-foreground">{email}</span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "roomName",
    header: createSortableHeader("roomName", "Room Name", MapPin),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded bg-gradient-to-br from-emerald-400 to-green-500 text-white">
            <MapPin className="h-3 w-3" />
          </div>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {row.original.roomName}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: createSortableHeader("startTime", "Start Time", Calendar),
    cell: ({ row }) => {
      return (
        <div className="text-sm">
          <div className="font-medium text-slate-700 dark:text-slate-300">
            {formatDateToJakarta(row.original.startTime)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "endTime",
    header: () => (
      <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
        <Calendar className="h-4 w-4" />
        End Time
      </div>
    ),
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {formatDateToJakarta(row.original.endTime)}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: createSortableHeader("createdAt", "Created At", Calendar),
    cell: ({ row }) => {
      return (
        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {formatDateToJakarta(row.original.createdAt)}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: createSortableHeader("status", "Status", CheckCircle),
    cell: ({ row }) => {
      const status = row.original.status;
      const config = getStatusConfig(status);
      const StatusIcon = config.icon;

      return (
        <div className="flex items-center gap-2">
          <StatusIcon className={`h-4 w-4 ${config.iconColor}`} />
          <Badge
            variant={config.variant}
            className={`capitalize font-medium transition-all duration-200 hover:scale-105 ${
              config.variant === "default"
                ? "bg-gradient-to-r from-emerald-500 to-green-500"
                : config.variant === "secondary"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                  : config.variant === "destructive"
                    ? "bg-gradient-to-r from-red-500 to-rose-500"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
            }`}
          >
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="flex items-center justify-center">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Actions
        </span>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    cell: ({
      row,
      table,
    }: {
      row: Row<ReservationWithDetails>;
      table: Table<ReservationWithDetails>;
    }) => {
      const reservation = row.original;
      const statusConfig = getStatusConfig(reservation.status);

      return (
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 group"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl"
            >
              <DropdownMenuLabel className="font-semibold text-slate-700 dark:text-slate-300">
                Actions
              </DropdownMenuLabel>

              {/* View Details Item */}
              <DropdownMenuItem asChild className="cursor-pointer p-0">
                <Link
                  href={`/admin/rooms/reservations/${reservation.id}`}
                  className="flex items-center px-3 py-2 text-sm w-full h-full hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors duration-200 group"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-gradient-to-br from-blue-400 to-indigo-500 mr-3 group-hover:scale-110 transition-transform duration-200">
                    <Eye className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium">View Details</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

              {/* Accept Item */}
              <DropdownMenuItem
                asChild
                className="cursor-pointer p-0"
                disabled={reservation.status !== "Pending"}
              >
                <Link
                  href={`/admin/rooms/reservations/${reservation.id}/accept`}
                  className={`flex items-center px-3 py-2 text-sm w-full h-full transition-colors duration-200 group ${
                    reservation.status !== "Pending"
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                  }`}
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-gradient-to-br from-emerald-400 to-green-500 mr-3 group-hover:scale-110 transition-transform duration-200">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium">Accept</span>
                </Link>
              </DropdownMenuItem>

              {/* Reject Item */}
              <DropdownMenuItem
                asChild
                className="cursor-pointer p-0"
                disabled={reservation.status !== "Pending"}
              >
                <Link
                  href={`/admin/rooms/reservations/${reservation.id}/reject`}
                  className={`flex items-center px-3 py-2 text-sm w-full h-full transition-colors duration-200 group ${
                    reservation.status !== "Pending"
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-red-50 dark:hover:bg-red-950/20"
                  }`}
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-gradient-to-br from-red-400 to-rose-500 mr-3 group-hover:scale-110 transition-transform duration-200">
                    <XCircle className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium">Reject</span>
                </Link>
              </DropdownMenuItem>

              {/* <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" /> */}

              {/* Cancel Item */}
              {/* <DropdownMenuItem
                className={`text-destructive focus:text-destructive hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-200 group ${
                  ["Completed", "Cancelled", "Rejected"].includes(
                    reservation.status
                  )
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => console.log("Cancel", reservation.id)}
                disabled={["Completed", "Cancelled", "Rejected"].includes(
                  reservation.status
                )}
              >
                <div className="flex items-center justify-center w-6 h-6 rounded bg-gradient-to-br from-red-400 to-rose-500 mr-3 group-hover:scale-110 transition-transform duration-200">
                  <Trash2 className="h-3 w-3 text-white" />
                </div>
                <span className="font-medium">Cancel</span>
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

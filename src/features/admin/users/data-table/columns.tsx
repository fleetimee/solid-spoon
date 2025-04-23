"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { User } from "better-auth";
import { format } from "date-fns";
import { Mail, User as UserIcon, Shield, Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Email"
        icon={<Mail className="mr-2 h-4 w-4 text-muted-foreground" />}
      />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
        <span>{row.getValue("email")}</span>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Name"
        icon={<UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />}
      />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
        <span>{row.getValue("name")}</span>
      </div>
    ),
    enableSorting: false, // Assuming name is not sortable based on initial code
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Role"
        icon={<Shield className="mr-2 h-4 w-4 text-muted-foreground" />}
      />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <div className="flex items-center">
          <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
          <Badge variant="secondary">
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Joined At"
        icon={<Calendar className="mr-2 h-4 w-4 text-muted-foreground" />}
      />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{format(date, "PPP")}</span>
        </div>
      );
    },
  },
  // Add more columns as needed, e.g., for actions
];

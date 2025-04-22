"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "better-auth"; // Import User type from the library

// Define your columns here based on the User type properties
// Example columns:
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role", // Assuming role is a property
    header: "Role",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString(); // Format date as needed
    },
  },
  // Add more columns as needed (e.g., actions)
];

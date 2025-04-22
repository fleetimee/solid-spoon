"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "better-auth";
import {
  ArrowUpDown,
  Mail,
  User as UserIcon,
  Calendar,
  Shield,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

function getInitials(name?: string): string {
  if (!name) return "??";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const roleBadgeVariants: Record<
  string,
  {
    variant: "default" | "outline" | "secondary" | "destructive";
    label: string;
  }
> = {
  admin: { variant: "destructive", label: "Admin" },
  moderator: { variant: "secondary", label: "Moderator" },
  user: { variant: "default", label: "User" },
  guest: { variant: "outline", label: "Guest" },
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 p-0 hover:bg-transparent"
        >
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span>ID</span>
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="text-xs font-mono text-muted-foreground">
        {row.getValue("id")}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 p-0 hover:bg-transparent"
        >
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>Email</span>
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 p-0 hover:bg-transparent"
        >
          <UserIcon className="h-4 w-4 text-muted-foreground" />
          <span>Name</span>
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string | undefined;
      const initials = getInitials(name);

      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.image || undefined} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{name || "Unnamed User"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-1 p-0 hover:bg-transparent"
            >
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>Role</span>
              <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuLabel>Filter by role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={column.getFilterValue() === undefined}
              onCheckedChange={() => column.setFilterValue(undefined)}
            >
              All Roles
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={column.getFilterValue() === "admin"}
              onCheckedChange={() => column.setFilterValue("admin")}
            >
              Admin
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={column.getFilterValue() === "moderator"}
              onCheckedChange={() => column.setFilterValue("moderator")}
            >
              Moderator
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={column.getFilterValue() === "user"}
              onCheckedChange={() => column.setFilterValue("user")}
            >
              User
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={column.getFilterValue() === "guest"}
              onCheckedChange={() => column.setFilterValue("guest")}
            >
              Guest
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    filterFn: (row, id, value) => {
      return value ? row.getValue(id) === value : true;
    },
    cell: ({ row }) => {
      const role = (row.getValue("role") as string) || "user";
      const { variant, label } = roleBadgeVariants[role.toLowerCase()] || {
        variant: "secondary",
        label: role,
      };

      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 p-0 hover:bg-transparent"
        >
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Joined</span>
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("createdAt");
      if (!value) return <span className="text-muted-foreground">Unknown</span>;

      const date = new Date(value as string);
      if (isNaN(date.getTime()))
        return <span className="text-muted-foreground">Invalid date</span>;

      const formattedDate = format(date, "PPP");
      const formattedTime = format(date, "p");

      return (
        <div className="flex flex-col">
          <span>{formattedDate}</span>
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
        </div>
      );
    },
    sortingFn: "datetime",
  },
];

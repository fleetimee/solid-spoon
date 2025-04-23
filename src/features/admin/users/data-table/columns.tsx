"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Mail,
  User as UserIcon,
  Shield,
  Calendar,
  Ban,
  Clock,
  MoreHorizontal,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTableColumnHeader } from "./data-table-column-header";
import { ExtendedUser } from "../types/user";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BanUserForm } from "../ban-user-form";

export const columns: ColumnDef<ExtendedUser>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Email"
        icon={<Mail className="mr-2 h-4 w-4 text-muted-foreground" />}
      />
    ),
    cell: ({ row }) => <span>{row.getValue("email")}</span>,
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
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      // Get initials from name (up to 2 characters)
      const initials = name
        .split(" ")
        .map((part) => part.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase();

      // Get image from user object if available
      const userImage = row.original.image;

      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-7">
            {userImage ? <AvatarImage src={userImage} alt={name} /> : null}
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{name}</span>
        </div>
      );
    },
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
        <Badge variant="secondary">
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "banned",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Status"
        icon={<Ban className="mr-2 h-4 w-4 text-muted-foreground" />}
      />
    ),
    filterFn: (row, id, filterValue) => {
      const banned = row.getValue(id);
      if (filterValue === false) {
        return banned === false || banned === null;
      }
      return banned === filterValue;
    },
    cell: ({ row }) => {
      const banned = row.getValue("banned") as boolean | null;
      const banReason = row.original.banReason;
      const banExpires = row.original.banExpires
        ? new Date(row.original.banExpires)
        : null;

      if (!banned) {
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Active
          </Badge>
        );
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Banned</Badge>
                {banExpires && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(banExpires, "MMM d, yyyy")}
                  </Badge>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p className="font-medium">
                Reason: {banReason || "No reason provided"}
              </p>
              {banExpires && (
                <p className="text-sm text-white mt-1">
                  Expires: {format(banExpires, "PPP")}
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
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
      return <span>{format(date, "PPP")}</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      const isBanned = user.banned === true;
      const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
      const [isChangeRoleDialogOpen, setIsChangeRoleDialogOpen] =
        useState(false);
      const [isMenuOpen, setIsMenuOpen] = useState(false);

      const handleMenuOpenChange = (open: boolean) => {
        setIsMenuOpen(open);
      };

      const handleChangeRole = () => {
        setIsMenuOpen(false);
        setIsChangeRoleDialogOpen(true);
      };

      const handleBanUser = () => {
        setIsMenuOpen(false);
        setIsBanDialogOpen(true);
      };

      return (
        <div className="flex justify-end">
          <BanUserForm
            user={user}
            isOpen={isBanDialogOpen}
            onOpenChange={setIsBanDialogOpen}
            onUserBanned={() => {
              // Force a refresh of the data
              window.location.reload();
            }}
          />

          <DropdownMenu open={isMenuOpen} onOpenChange={handleMenuOpenChange}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                aria-label="Open menu"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={5} className="w-48">
              <DropdownMenuItem
                onSelect={handleChangeRole}
                className="cursor-pointer"
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Change Role
              </DropdownMenuItem>

              {!isBanned && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={handleBanUser}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Ban User
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

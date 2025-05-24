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
  Laptop,
  Trash2,
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
import { ChangeRoleForm } from "../change-role-form";
import { UnbanUserForm } from "../unban-user-form";
import { UserSessionsDialog } from "../user-sessions-dialog";
import { DeleteUserForm } from "../delete-user-form";

interface UserActionsCellProps {
  user: ExtendedUser;
}

const UserActionsCell: React.FC<UserActionsCellProps> = ({ user }) => {
  const isBanned = user.banned === true;
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false);
  const [isChangeRoleDialogOpen, setIsChangeRoleDialogOpen] = useState(false);
  const [isSessionsDialogOpen, setIsSessionsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuOpenChange = (open: boolean) => {
    setIsMenuOpen(open);
  };

  const handleChangeRole = () => {
    setIsMenuOpen(false);
    setIsChangeRoleDialogOpen(true);
  };

  const handleViewSessions = () => {
    setIsMenuOpen(false);
    setIsSessionsDialogOpen(true);
  };

  const handleBanUser = () => {
    setIsMenuOpen(false);
    setIsBanDialogOpen(true);
  };

  const handleUnbanUser = () => {
    setIsMenuOpen(false);
    setIsUnbanDialogOpen(true);
  };

  const handleDeleteUser = () => {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(true);
  };

  const handleUserUpdated = () => {
    window.location.reload();
  };

  return (
    <div className="flex justify-end">
      <BanUserForm
        user={user}
        isOpen={isBanDialogOpen}
        onOpenChange={setIsBanDialogOpen}
        onUserBanned={handleUserUpdated}
      />

      <UnbanUserForm
        user={user}
        isOpen={isUnbanDialogOpen}
        onOpenChange={setIsUnbanDialogOpen}
        onUserUnbanned={handleUserUpdated}
      />

      <ChangeRoleForm
        user={user}
        isOpen={isChangeRoleDialogOpen}
        onOpenChange={setIsChangeRoleDialogOpen}
        onRoleChanged={handleUserUpdated}
      />

      <UserSessionsDialog
        user={user}
        isOpen={isSessionsDialogOpen}
        onOpenChange={setIsSessionsDialogOpen}
      />

      <DeleteUserForm
        user={user}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onUserDeleted={handleUserUpdated}
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

          <DropdownMenuItem
            onSelect={handleViewSessions}
            className="cursor-pointer"
          >
            <Laptop className="mr-2 h-4 w-4" />
            View Sessions
          </DropdownMenuItem>

          {isBanned ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={handleUnbanUser}
                className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 cursor-pointer"
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Unban User
              </DropdownMenuItem>
            </>
          ) : (
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
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleDeleteUser}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

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
      const initials = name
        .split(" ")
        .map((part) => part.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase();

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

      const roleConfig: Record<
        string,
        {
          variant: "default" | "outline" | "secondary" | "destructive";
          className: string;
        }
      > = {
        admin: {
          variant: "default",
          className: "bg-primary text-primary-foreground hover:bg-primary/80",
        },
        moderator: {
          variant: "secondary",
          className:
            "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
        },
        user: {
          variant: "outline",
          className:
            "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
        },
        guest: {
          variant: "outline",
          className:
            "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700",
        },
      };

      const config = roleConfig[role] || roleConfig.user;

      return (
        <Badge
          variant={config.variant}
          className={`${config.className} ${
            role === "admin" ? "font-medium" : ""
          }`}
        >
          {role === "admin" ? (
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 mr-1" />
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </div>
          ) : (
            role.charAt(0).toUpperCase() + role.slice(1)
          )}
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
      return <UserActionsCell user={user} />;
    },
  },
];

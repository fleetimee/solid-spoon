"use client";

import { useState } from "react";
import { Check, EyeOff, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NotificationActionsProps {
  notificationId: string;
  isRead: boolean;
  onStatusChange?: (id: string, isRead: boolean) => void;
  onDelete?: (id: string) => void;
}

export function NotificationActions({
  notificationId,
  isRead,
  onStatusChange,
  onDelete,
}: NotificationActionsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMarkAsRead = () => {
    setIsMenuOpen(false);
    onStatusChange?.(notificationId, true);
  };

  const handleMarkAsUnread = () => {
    setIsMenuOpen(false);
    onStatusChange?.(notificationId, false);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    onDelete?.(notificationId);
  };

  return (
    <Tooltip>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full opacity-70 hover:opacity-100 hover:bg-muted"
              aria-label="Open notification actions menu"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="left" align="center">
          Actions
        </TooltipContent>

        <DropdownMenuContent align="end" className="w-48">
          {isRead ? (
            <DropdownMenuItem
              onClick={handleMarkAsUnread}
              className="cursor-pointer flex items-center gap-2 text-sm"
            >
              <EyeOff className="h-4 w-4" />
              <span>Mark as unread</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={handleMarkAsRead}
              className="cursor-pointer flex items-center gap-2 text-sm"
            >
              <Check className="h-4 w-4" />
              <span>Mark as read</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2 text-sm"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Tooltip>
  );
}

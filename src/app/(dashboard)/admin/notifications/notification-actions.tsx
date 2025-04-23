"use client";

import { useState } from "react";
import { Check, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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
    toast.success("Notification marked as read");
  };

  const handleMarkAsUnread = () => {
    setIsMenuOpen(false);
    onStatusChange?.(notificationId, false);
    toast.success("Notification marked as unread");
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    onDelete?.(notificationId);
    toast.success("Notification deleted");
  };

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label="Open notification actions menu"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isRead ? (
          <DropdownMenuItem
            onClick={handleMarkAsUnread}
            className="cursor-pointer"
          >
            Mark as unread
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={handleMarkAsRead}
            className="cursor-pointer"
          >
            <Check className="mr-2 h-4 w-4" />
            Mark as read
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

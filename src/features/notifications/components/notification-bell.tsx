"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { PopoverNotificationsList } from "./popover-notifications-list";
import { getNotificationsAction } from "../actions/getNotificationsAction";
import { Notification } from "../types/notification";

interface NotificationBellProps {
  initialCount: number;
}

export function NotificationBell({ initialCount }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  async function fetchNotifications() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getNotificationsAction();
      if ("notifications" in result && Array.isArray(result.notifications)) {
        setNotifications(result.notifications);
      } else if ("error" in result && result.error) {
        setError(result.error);
      } else {
        setError("Format respons tidak valid");
      }
    } catch (err) {
      setError("Gagal mengambil notifikasi");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative w-9 h-9 p-0"
          aria-label={`Notifikasi ${initialCount > 0 ? `(${initialCount} belum dibaca)` : ""}`}
        >
          <Bell className="size-[1.2rem]" />
          {initialCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {initialCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-[450px] overflow-y-auto p-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <div className="text-center text-sm text-destructive py-4">
            {error}
          </div>
        ) : (
          <PopoverNotificationsList notifications={notifications} />
        )}
      </PopoverContent>
    </Popover>
  );
}

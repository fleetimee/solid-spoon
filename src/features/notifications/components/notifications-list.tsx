"use client";

import { Bell, InboxIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationItem } from "./notification-item";
import { useNotifications } from "../context/notification-context";
import { NotificationFilter } from "../types/notification";

interface NotificationsListProps {
  filter: NotificationFilter;
}

export function NotificationsList({ filter }: NotificationsListProps) {
  const { notifications, isLoading } = useNotifications();

  // Filter notifications based on the selected tab
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "read") return notification.isRead;
    if (filter === "unread") return !notification.isRead;
    return true;
  });

  if (isLoading) {
    return (
      <div className="border rounded-md overflow-hidden shadow-sm divide-y divide-border bg-background">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-3 w-[400px]" />
              <Skeleton className="h-3 w-[120px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredNotifications.length === 0) {
    return (
      <div className="border rounded-md overflow-hidden shadow-sm bg-background">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          {filter === "all" ? (
            <InboxIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
          ) : (
            <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
          )}

          <h3 className="text-lg font-medium text-muted-foreground mb-1">
            {filter === "all"
              ? "Your inbox is empty"
              : filter === "unread"
                ? "No unread notifications"
                : "No read notifications"}
          </h3>

          <p className="text-muted-foreground text-sm max-w-sm">
            {filter === "all"
              ? "You don't have any notifications yet. We'll notify you when something important happens."
              : filter === "unread"
                ? "You're all caught up! Check back later for new notifications."
                : "You haven't read any notifications yet."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden shadow-sm divide-y divide-border bg-background">
      {filteredNotifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          isLast={index === filteredNotifications.length - 1}
        />
      ))}
    </div>
  );
}

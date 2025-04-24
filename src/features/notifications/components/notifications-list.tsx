"use client";

import { Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { NotificationItem } from "./notification-item";
import { useNotifications } from "../context/notification-context";
import { Notification, NotificationFilter } from "../types/notification";

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
      <div className="text-center py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-muted rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded mb-2"></div>
          <div className="h-3 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (filteredNotifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">
          {filter === "all"
            ? "No notifications"
            : filter === "unread"
              ? "No unread notifications"
              : "No read notifications"}
        </h3>
        <p className="text-muted-foreground">
          {filter === "all"
            ? "You don't have any notifications yet"
            : filter === "unread"
              ? "You're all caught up! Check back later for new notifications."
              : "You haven't read any notifications yet."}
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        {filteredNotifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            isLast={index === filteredNotifications.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}

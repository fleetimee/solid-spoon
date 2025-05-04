"use client";

import Link from "next/link";
import { Notification } from "../types/notification";

interface PopoverNotificationsListProps {
  notifications: Notification[];
}

export function PopoverNotificationsList({
  notifications,
}: PopoverNotificationsListProps) {
  if (!notifications.length) {
    return (
      <div className="py-3 text-sm text-muted-foreground text-center">
        No new notifications
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {notifications.map((notification) => {
        const NotificationContent = (
          <div className="flex items-start space-x-2 p-2 hover:bg-muted/50 rounded-md transition-colors">
            {!notification.isRead && (
              <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium leading-none mb-1">
                {notification.title}
              </div>
              <div className="text-sm text-muted-foreground line-clamp-2">
                {notification.message}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(notification.timestamp).toLocaleDateString()}
              </div>
            </div>
          </div>
        );

        if (notification.link) {
          return (
            <Link
              key={notification.id}
              href={notification.link}
              className="block"
            >
              {NotificationContent}
            </Link>
          );
        }

        return <div key={notification.id}>{NotificationContent}</div>;
      })}
    </div>
  );
}

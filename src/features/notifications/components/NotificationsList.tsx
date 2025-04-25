import { Bell } from "lucide-react";
import { Notification, NotificationFilter } from "../types/notification";
import { NotificationCard } from "./NotificationCard";

interface NotificationsListProps {
  notifications: Notification[];
  filter: NotificationFilter;
  totalItems: number;
  currentPage: number;
  pageSize: number;
}

export function NotificationsList({
  notifications,
  filter,
  totalItems,
  currentPage,
  pageSize,
}: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted/50 rounded-full p-6 mb-4">
          <Bell className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-medium mb-2">No notifications found</h3>
        <p className="text-muted-foreground max-w-sm">
          {filter === "unread"
            ? "You don't have any unread notifications at the moment."
            : filter === "read"
              ? "You don't have any read notifications yet."
              : "You don't have any notifications at the moment."}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Pagination indicator above notifications */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <div>
          <span className="font-medium text-foreground">
            Page {currentPage}
          </span>{" "}
          of {Math.ceil(totalItems / pageSize)}
        </div>

        <div>
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{" "}
          notifications
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="divide-y">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      </div>
    </>
  );
}

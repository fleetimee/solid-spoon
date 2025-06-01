import { Bell, Sparkles } from "lucide-react";
import { Notification, NotificationFilter } from "../types/notification";
import { NotificationCard } from "./notification-card";
import { cn } from "@/lib/utils";

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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="relative">
          {/* Glassmorphism background with gradient */}
          <div
            className={cn(
              "relative rounded-full p-8 mb-6",
              "bg-gradient-to-br from-purple-50/80 to-violet-50/80",
              "dark:from-purple-950/20 dark:to-violet-950/20",
              "border border-purple-200/40 dark:border-purple-800/30",
              "shadow-xl shadow-purple-500/10",
              "backdrop-blur-sm"
            )}
          >
            {/* Animated sparkles effect */}
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -left-1">
              <Sparkles className="h-4 w-4 text-violet-400 animate-pulse delay-300" />
            </div>

            <Bell
              className="h-12 w-12 text-purple-600 dark:text-purple-400"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <div className="space-y-3 max-w-md">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            No notifications found
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {filter === "unread"
              ? "All caught up! You don't have any unread notifications at the moment."
              : filter === "read"
                ? "No read notifications yet. They'll appear here once you start interacting with your notifications."
                : "Your notification center is empty. New notifications will appear here as they arrive."}
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="space-y-6">
      {/* Enhanced pagination indicator */}
      <div
        className={cn(
          "flex items-center justify-between p-4 rounded-lg",
          "bg-gradient-to-r from-purple-50/50 to-violet-50/50",
          "dark:from-purple-950/20 dark:to-violet-950/20",
          "border border-purple-200/30 dark:border-purple-800/20",
          "backdrop-blur-sm"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <span className="text-sm font-medium text-foreground">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-purple-600 dark:text-purple-400">
            {startItem}
          </span>{" "}
          to{" "}
          <span className="font-medium text-purple-600 dark:text-purple-400">
            {endItem}
          </span>{" "}
          of{" "}
          <span className="font-medium text-purple-600 dark:text-purple-400">
            {totalItems}
          </span>{" "}
          notifications
        </div>
      </div>

      {/* Modern grid layout for notifications */}
      <div className="grid gap-4">
        {notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>

      {/* Bottom spacing for better visual flow */}
      <div className="h-4"></div>
    </div>
  );
}

"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Notification } from "../types/notification";
import Link from "next/link";
import { formatDistanceToNow, addHours } from "date-fns";
import {
  ExternalLink,
  Check,
  Trash2,
  Undo2,
  Calendar,
  Settings,
  User,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { toast } from "sonner";
import { markNotificationAsRead } from "../actions/markNotificationAsRead";
import { markNotificationAsUnread } from "../actions/markNotificationAsUnread";
import { deleteNotification } from "../actions/deleteNotification";

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const [isPending, startTransition] = useTransition();

  // Format the timestamp to a relative time (e.g., "3 hours ago")
  const formattedTime = formatDistanceToNow(
    addHours(new Date(notification.created_at), 7),
    {
      addSuffix: true,
    }
  );

  // Get notification styling based on type and status
  const getNotificationConfig = () => {
    const isUnread = !notification.isRead;

    switch (notification.type) {
      case "booking":
        return {
          bgGradient: isUnread
            ? "from-purple-50/80 to-violet-50/80 dark:from-purple-950/20 dark:to-violet-950/20"
            : "from-purple-25/40 to-violet-25/40 dark:from-purple-950/10 dark:to-violet-950/10",
          hoverGradient:
            "from-purple-100/50 to-violet-100/50 dark:from-purple-900/30 dark:to-violet-900/30",
          borderColor: isUnread
            ? "border-purple-200/60 dark:border-purple-800/40"
            : "border-purple-100/40 dark:border-purple-900/20",
          dotColor: isUnread
            ? "bg-purple-500"
            : "bg-purple-300 dark:bg-purple-700",
          icon: Calendar,
          iconBg: "from-purple-400 to-violet-500",
          titleColor: isUnread
            ? "text-purple-800 dark:text-purple-200"
            : "text-purple-600 dark:text-purple-400",
          shadow: isUnread
            ? "shadow-lg shadow-purple-500/10"
            : "shadow-md shadow-purple-500/5",
        };
      case "system":
        return {
          bgGradient: isUnread
            ? "from-indigo-50/80 to-blue-50/80 dark:from-indigo-950/20 dark:to-blue-950/20"
            : "from-indigo-25/40 to-blue-25/40 dark:from-indigo-950/10 dark:to-blue-950/10",
          hoverGradient:
            "from-indigo-100/50 to-blue-100/50 dark:from-indigo-900/30 dark:to-blue-900/30",
          borderColor: isUnread
            ? "border-indigo-200/60 dark:border-indigo-800/40"
            : "border-indigo-100/40 dark:border-indigo-900/20",
          dotColor: isUnread
            ? "bg-indigo-500"
            : "bg-indigo-300 dark:bg-indigo-700",
          icon: Settings,
          iconBg: "from-indigo-400 to-blue-500",
          titleColor: isUnread
            ? "text-indigo-800 dark:text-indigo-200"
            : "text-indigo-600 dark:text-indigo-400",
          shadow: isUnread
            ? "shadow-lg shadow-indigo-500/10"
            : "shadow-md shadow-indigo-500/5",
        };
      case "user":
        return {
          bgGradient: isUnread
            ? "from-emerald-50/80 to-green-50/80 dark:from-emerald-950/20 dark:to-green-950/20"
            : "from-emerald-25/40 to-green-25/40 dark:from-emerald-950/10 dark:to-green-950/10",
          hoverGradient:
            "from-emerald-100/50 to-green-100/50 dark:from-emerald-900/30 dark:to-green-900/30",
          borderColor: isUnread
            ? "border-emerald-200/60 dark:border-emerald-800/40"
            : "border-emerald-100/40 dark:border-emerald-900/20",
          dotColor: isUnread
            ? "bg-emerald-500"
            : "bg-emerald-300 dark:bg-emerald-700",
          icon: User,
          iconBg: "from-emerald-400 to-green-500",
          titleColor: isUnread
            ? "text-emerald-800 dark:text-emerald-200"
            : "text-emerald-600 dark:text-emerald-400",
          shadow: isUnread
            ? "shadow-lg shadow-emerald-500/10"
            : "shadow-md shadow-emerald-500/5",
        };
      case "maintenance":
        return {
          bgGradient: isUnread
            ? "from-amber-50/80 to-orange-50/80 dark:from-amber-950/20 dark:to-orange-950/20"
            : "from-amber-25/40 to-orange-25/40 dark:from-amber-950/10 dark:to-orange-950/10",
          hoverGradient:
            "from-amber-100/50 to-orange-100/50 dark:from-amber-900/30 dark:to-orange-900/30",
          borderColor: isUnread
            ? "border-amber-200/60 dark:border-amber-800/40"
            : "border-amber-100/40 dark:border-amber-900/20",
          dotColor: isUnread
            ? "bg-amber-500"
            : "bg-amber-300 dark:bg-amber-700",
          icon: AlertTriangle,
          iconBg: "from-amber-400 to-orange-500",
          titleColor: isUnread
            ? "text-amber-800 dark:text-amber-200"
            : "text-amber-600 dark:text-amber-400",
          shadow: isUnread
            ? "shadow-lg shadow-amber-500/10"
            : "shadow-md shadow-amber-500/5",
        };
      default:
        return {
          bgGradient: isUnread
            ? "from-purple-50/80 to-violet-50/80 dark:from-purple-950/20 dark:to-violet-950/20"
            : "from-purple-25/40 to-violet-25/40 dark:from-purple-950/10 dark:to-violet-950/10",
          hoverGradient:
            "from-purple-100/50 to-violet-100/50 dark:from-purple-900/30 dark:to-violet-900/30",
          borderColor: isUnread
            ? "border-purple-200/60 dark:border-purple-800/40"
            : "border-purple-100/40 dark:border-purple-900/20",
          dotColor: isUnread
            ? "bg-purple-500"
            : "bg-purple-300 dark:bg-purple-700",
          icon: Calendar,
          iconBg: "from-purple-400 to-violet-500",
          titleColor: isUnread
            ? "text-purple-800 dark:text-purple-200"
            : "text-purple-600 dark:text-purple-400",
          shadow: isUnread
            ? "shadow-lg shadow-purple-500/10"
            : "shadow-md shadow-purple-500/5",
        };
    }
  };

  const config = getNotificationConfig();
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "group relative overflow-hidden border bg-gradient-to-br transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-xl",
        config.bgGradient,
        config.borderColor,
        config.shadow,
        "backdrop-blur-sm"
      )}
    >
      {/* Glassmorphism overlay on hover */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          config.hoverGradient
        )}
      />

      <div className="relative p-6">
        <div className="flex items-start gap-4">
          {/* Icon container */}
          <div className="flex-shrink-0">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full shadow-md",
                "bg-gradient-to-br group-hover:scale-110 transition-transform duration-300",
                config.iconBg
              )}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0 transition-colors duration-200",
                      config.dotColor
                    )}
                  />
                  <h3
                    className={cn(
                      "font-semibold text-base leading-tight",
                      config.titleColor
                    )}
                  >
                    {notification.title}
                  </h3>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {notification.message}
                </p>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-medium">{formattedTime}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background/60 border">
                    {notification.type}
                  </span>
                  {notification.priority && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        notification.priority === "high" &&
                          "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-300",
                        notification.priority === "medium" &&
                          "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-300",
                        notification.priority === "low" &&
                          "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-300"
                      )}
                    >
                      {notification.priority}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              {!notification.isRead && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    startTransition(() => {
                      markNotificationAsRead(Number(notification.id))
                        .then((result) => {
                          if (result.success) {
                            toast.success("Notification marked as read.");
                          } else {
                            toast.error(
                              result.error ||
                                "Failed to mark notification as read."
                            );
                          }
                        })
                        .catch((error) => {
                          console.error(
                            "Mark as read transition error:",
                            error
                          );
                          toast.error("An unexpected error occurred.");
                        });
                    });
                  }}
                  disabled={isPending}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <Check className="h-3 w-3 mr-1.5" />
                  Mark as Read
                </Button>
              )}

              {notification.isRead && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    startTransition(() => {
                      markNotificationAsUnread(Number(notification.id))
                        .then((result) => {
                          if (result.success) {
                            toast.success("Notification marked as unread.");
                          } else {
                            toast.error(
                              result.error ||
                                "Failed to mark notification as unread."
                            );
                          }
                        })
                        .catch((error) => {
                          console.error(
                            "Mark as unread transition error:",
                            error
                          );
                          toast.error("An unexpected error occurred.");
                        });
                    });
                  }}
                  disabled={isPending}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <Undo2 className="h-3 w-3 mr-1.5" />
                  Mark as Unread
                </Button>
              )}

              {notification.link && (
                <Link
                  href={notification.link}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "hover:scale-105 transition-transform duration-200"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    View
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </Link>
              )}

              {notification.isRead && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 w-8 p-0 hover:scale-105 transition-transform duration-200"
                  aria-label="Delete notification"
                  onClick={() => {
                    startTransition(() => {
                      deleteNotification(Number(notification.id))
                        .then((result) => {
                          if (result.success) {
                            toast.success("Notification deleted.");
                          } else {
                            toast.error(
                              result.error || "Failed to delete notification."
                            );
                          }
                        })
                        .catch((error) => {
                          console.error(
                            "Delete notification transition error:",
                            error
                          );
                          toast.error(
                            "An unexpected error occurred during deletion."
                          );
                        });
                    });
                  }}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

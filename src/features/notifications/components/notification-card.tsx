"use client"; // Added client directive

import { Button, buttonVariants } from "@/components/ui/button";
import { Notification } from "../types/notification";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Check } from "lucide-react"; // Combined icon imports
import { cn } from "@/lib/utils";
import { useTransition } from "react"; // Added useTransition import
import { toast } from "sonner"; // Added toast import
import { markNotificationAsRead } from "../actions/markNotificationAsRead"; // Added server action import

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const [isPending, startTransition] = useTransition(); // Initialized transition
  // Format the timestamp to a relative time (e.g., "3 hours ago")
  const formattedTime = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  return (
    <div className="p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-2">
        <div
          className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
            notification.isRead ? "bg-muted" : "bg-primary"
          }`}
        />
        <div className="flex-1">
          <h3 className="font-medium">{notification.title}</h3>
          <p className="text-muted-foreground text-sm">
            {notification.message}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {formattedTime}
            </span>
            {/* Container for buttons */}
            <div className="flex items-center gap-2">
              {!notification.isRead && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    // Added onClick handler
                    startTransition(() => {
                      markNotificationAsRead(Number(notification.id)) // Convert id to number
                        .then((result) => {
                          if (result.success) {
                            toast.success("Notification marked as read.");
                            // UI updates via revalidation
                          } else {
                            toast.error(
                              result.error ||
                                "Failed to mark notification as read."
                            );
                          }
                        })
                        .catch((error) => {
                          // Catch unexpected errors during the action call itself
                          console.error(
                            "Mark as read transition error:",
                            error
                          );
                          toast.error("An unexpected error occurred.");
                        });
                    });
                  }}
                  disabled={isPending} // Added disabled prop
                >
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Mark as Read
                  </span>
                </Button>
              )}
              {notification.link && (
                <Link
                  href={notification.link}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                >
                  <span className="flex items-center gap-1">
                    View
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

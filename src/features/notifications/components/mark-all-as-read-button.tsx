"use client";

import { useTransition } from "react";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { CheckCheck } from "lucide-react";
import { markAllNotificationsAsRead } from "../actions/markAllNotificationsAsRead";

interface MarkAllAsReadButtonProps {
  userId: string; // User ID is needed for the action
  hasUnreadNotifications: boolean; // To disable button if no unread notifications exist
}

export function MarkAllAsReadButton({
  userId,
  hasUnreadNotifications,
}: MarkAllAsReadButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleMarkAllRead = () => {
    // No confirmation dialog needed for this action generally
    startTransition(() => {
      markAllNotificationsAsRead(userId)
        .then((result) => {
          if (result.success) {
            // Only show toast if something was actually updated
            if ((result.updatedCount || 0) > 0) {
              toast.success(
                `Marked ${result.updatedCount} notifications as read.`
              );
            } else {
              toast.info("No unread notifications to mark.");
            }
            // UI updates via revalidation in action
          } else {
            toast.error(result.error || "Failed to mark all as read.");
          }
        })
        .catch((error) => {
          console.error("Mark all as read transition error:", error);
          toast.error("An unexpected error occurred.");
        });
    });
  };

  return (
    <Button
      variant="outline" // Keep consistent style for now
      size="sm"
      disabled={isPending || !hasUnreadNotifications} // Disable if pending or no unread notifications
      className="cursor-pointer"
      onClick={handleMarkAllRead}
    >
      <CheckCheck className="h-4 w-4 mr-1.5" />
      Mark All Read
    </Button>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { clearReadNotifications } from "../actions/clearReadNotifications";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ClearNotificationsButtonProps {
  userId: string; // User ID is needed for the action
  hasReadNotifications: boolean; // To disable button if no read notifications exist
}

export function ClearNotificationsButton({
  userId,
  hasReadNotifications,
}: ClearNotificationsButtonProps) {
  const [isPending, startTransition] = useTransition();
  // No need for explicit open state if using AlertDialogTrigger

  const handleClear = () => {
    startTransition(() => {
      clearReadNotifications(userId)
        .then((result) => {
          if (result.success) {
            toast.success(
              `Cleared ${result.deletedCount || 0} read notifications.`
            );
            // UI updates via revalidation in action
          } else {
            toast.error(result.error || "Failed to clear notifications.");
          }
        })
        .catch((error) => {
          console.error("Clear notifications transition error:", error);
          toast.error("An unexpected error occurred.");
        });
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isPending || !hasReadNotifications} // Disable if pending or no read notifications
          className="cursor-pointer"
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          Clear Read
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all your
            read notifications.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClear} disabled={isPending}>
            {isPending ? "Clearing..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

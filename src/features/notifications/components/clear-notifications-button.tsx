"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
import { clearReadNotifications } from "../actions/clearReadNotifications";
import { cn } from "@/lib/utils";
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
          disabled={isPending || !hasReadNotifications}
          className={cn(
            "group relative overflow-hidden",
            "bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20",
            "border-red-200/40 dark:border-red-800/30",
            "hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/30 dark:hover:to-pink-900/30",
            "hover:border-red-300/60 dark:hover:border-red-700/50",
            "hover:shadow-lg hover:shadow-red-500/10",
            "hover:scale-105 transition-all duration-200",
            "text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          )}
        >
          <Trash2 className="h-4 w-4 mr-1.5 group-hover:animate-pulse" />
          Clear Read
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent
        className={cn(
          "bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm",
          "border border-red-200/30 dark:border-red-800/30"
        )}
      >
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full",
                "bg-gradient-to-br from-red-400 to-pink-500 shadow-md"
              )}
            >
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <AlertDialogTitle className="text-xl font-semibold">
              Are you absolutely sure?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base leading-relaxed">
            This action cannot be undone. This will permanently delete all your
            read notifications from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel
            disabled={isPending}
            className={cn(
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              "hover:scale-105 transition-transform duration-200"
            )}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClear}
            disabled={isPending}
            className={cn(
              "bg-gradient-to-r from-red-500 to-pink-500",
              "hover:from-red-600 hover:to-pink-600",
              "hover:scale-105 transition-all duration-200",
              "hover:shadow-lg hover:shadow-red-500/20"
            )}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Clearing...
              </div>
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

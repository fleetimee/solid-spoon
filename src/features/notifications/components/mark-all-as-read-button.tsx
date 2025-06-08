"use client";

import { useTransition } from "react";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { CheckCheck } from "lucide-react";
import { markAllNotificationsAsRead } from "../actions/markAllNotificationsAsRead";
import { cn } from "@/lib/utils";

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
                `${result.updatedCount} notifikasi ditandai sebagai dibaca.`
              );
            } else {
              toast.info(
                "Tidak ada notifikasi yang belum dibaca untuk ditandai."
              );
            }
            // UI updates via revalidation in action
          } else {
            toast.error(result.error || "Gagal menandai semua sebagai dibaca.");
          }
        })
        .catch((error) => {
          console.error("Mark all as read transition error:", error);
          toast.error("Terjadi kesalahan yang tidak terduga.");
        });
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending || !hasUnreadNotifications}
      className={cn(
        "group relative overflow-hidden",
        "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
        "border-emerald-200/40 dark:border-emerald-800/30",
        "hover:from-emerald-100 hover:to-green-100 dark:hover:from-emerald-900/30 dark:hover:to-green-900/30",
        "hover:border-emerald-300/60 dark:hover:border-emerald-700/50",
        "hover:shadow-lg hover:shadow-emerald-500/10",
        "hover:scale-105 transition-all duration-200",
        "text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      )}
      onClick={handleMarkAllRead}
    >
      <CheckCheck className="h-4 w-4 mr-1.5 group-hover:animate-pulse" />
      {isPending ? (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
          Menandai...
        </div>
      ) : (
        "Tandai Semua Dibaca"
      )}
    </Button>
  );
}

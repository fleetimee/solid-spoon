"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Notification } from "../types/notification";
import { markNotificationAsRead } from "../actions/markNotificationAsRead";

interface PopoverNotificationsListProps {
  notifications: Notification[];
}

export function PopoverNotificationsList({
  notifications,
}: PopoverNotificationsListProps) {
  if (!notifications.length) {
    return (
      <div className="py-3 text-sm text-muted-foreground text-center">
        Tidak ada notifikasi baru
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {notifications.map((notification) => {
        const NotificationContent = (
          <div className="flex items-start gap-2 p-2 hover:bg-muted/50 rounded-md transition-colors">
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
            {!notification.isRead && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={async (e) => {
                  // Prevent navigation if notification is a link
                  if (notification.link) {
                    e.preventDefault();
                    e.stopPropagation();
                  }

                  try {
                    const result = await markNotificationAsRead(
                      parseInt(notification.id, 10)
                    );
                    if (!result.success) {
                      throw new Error(result.error);
                    }
                    toast.success("Notifikasi ditandai sebagai dibaca");
                  } catch (error) {
                    toast.error(
                      "Gagal menandai notifikasi sebagai dibaca. Silakan coba lagi."
                    );
                    console.error("Error marking notification as read:", error);
                  }
                }}
              >
                <MailOpen className="h-4 w-4" />
                <span className="sr-only">Tandai sebagai dibaca</span>
              </Button>
            )}
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

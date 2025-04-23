"use client";

import { format } from "date-fns";
import { AlertCircle, Bell, Check, Info } from "lucide-react";
import { useState } from "react";

import { Separator } from "@/components/ui/separator";
import { NotificationActions } from "./notification-actions";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: string;
  priority: string;
}

interface NotificationItemProps {
  notification: Notification;
  isLast: boolean;
  isRead: boolean;
}

export function NotificationItem({
  notification,
  isLast,
  isRead,
}: NotificationItemProps) {
  const { id, title, message, timestamp, type, priority } = notification;
  const [isDeleted, setIsDeleted] = useState(false);

  if (isDeleted) {
    return null;
  }

  const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
    booking: {
      icon: <Bell className="h-4 w-4" />,
      color: "text-blue-500",
    },
    system: {
      icon: <AlertCircle className="h-4 w-4" />,
      color: "text-orange-500",
    },
    user: {
      icon: <Info className="h-4 w-4" />,
      color: "text-sky-500",
    },
    maintenance: {
      icon: <Check className="h-4 w-4" />,
      color: "text-green-500",
    },
  };

  const priorityClassMap: Record<string, string> = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };

  const config = typeConfig[type] || typeConfig.system;

  const handleStatusChange = (id: string, newIsRead: boolean) => {
    // In a real application, this would make an API call to update the notification status
    console.log(
      `Changing notification ${id} to ${newIsRead ? "read" : "unread"}`
    );
    // Normally we'd trigger a refresh or update the state here
  };

  const handleDelete = (id: string) => {
    // In a real application, this would make an API call to delete the notification
    console.log(`Deleting notification ${id}`);
    setIsDeleted(true);
  };

  return (
    <>
      <div
        className={`relative p-4 ${!isRead ? "bg-muted/30" : ""} hover:bg-muted/50`}
      >
        <div className="absolute top-4 right-4">
          <NotificationActions
            notificationId={id}
            isRead={isRead}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </div>

        <div className="flex items-start gap-4 pr-8">
          <div className={`mt-0.5 ${config.color}`}>{config.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{title}</span>
              <div
                className={`w-2 h-2 rounded-full ${priorityClassMap[priority]}`}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {format(new Date(timestamp), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
      </div>
      {!isLast && <Separator />}
    </>
  );
}

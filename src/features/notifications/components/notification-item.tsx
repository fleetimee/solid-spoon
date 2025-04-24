"use client";

import { format } from "date-fns";
import { AlertCircle, Bell, Check, Info } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Notification } from "../types/notification";
import { useNotifications } from "../context/notification-context";
import { NotificationActions } from "./notification-actions";

interface NotificationItemProps {
  notification: Notification;
  isLast: boolean;
}

export function NotificationItem({
  notification,
  isLast,
}: NotificationItemProps) {
  const { id, title, message, timestamp, type, priority, isRead } =
    notification;
  const [isDeleted, setIsDeleted] = useState(false);
  const { markAsRead, markAsUnread, deleteNotification } = useNotifications();

  if (isDeleted) {
    return null;
  }

  const typeConfig: Record<
    string,
    { icon: React.ReactNode; color: string; bgColor: string; initial: string }
  > = {
    booking: {
      icon: <Bell className="h-5 w-5" />,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      initial: "B",
    },
    system: {
      icon: <AlertCircle className="h-5 w-5" />,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
      initial: "S",
    },
    user: {
      icon: <Info className="h-5 w-5" />,
      color: "text-sky-500",
      bgColor: "bg-sky-100",
      initial: "U",
    },
    maintenance: {
      icon: <Check className="h-5 w-5" />,
      color: "text-green-500",
      bgColor: "bg-green-100",
      initial: "M",
    },
  };

  const priorityConfig: Record<
    string,
    {
      color: string;
      label: string;
      variant: "default" | "outline" | "secondary" | "destructive";
    }
  > = {
    high: {
      color: "bg-red-500",
      label: "High",
      variant: "destructive",
    },
    medium: {
      color: "bg-yellow-500",
      label: "Medium",
      variant: "secondary",
    },
    low: {
      color: "bg-green-500",
      label: "Low",
      variant: "outline",
    },
  };

  const config = typeConfig[type] || typeConfig.system;
  const priorityCfg = priorityConfig[priority];

  const handleStatusChange = async (id: string, newIsRead: boolean) => {
    if (newIsRead) {
      await markAsRead(id);
    } else {
      await markAsUnread(id);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleted(true);
    await deleteNotification(id);
  };

  const handleItemClick = async () => {
    if (!isRead) {
      await markAsRead(id);
    }
  };

  return (
    <>
      <div
        onClick={handleItemClick}
        className={`relative px-6 py-4 ${
          !isRead ? "bg-blue-50 dark:bg-blue-900/10" : ""
        } hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 group cursor-pointer`}
      >
        <div className="absolute top-4 right-6">
          <NotificationActions
            notificationId={id}
            isRead={isRead}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </div>

        <div className="flex items-start gap-4 pr-8 max-w-3xl">
          <Avatar className={`${config.bgColor} ${config.color} h-10 w-10`}>
            <AvatarImage src="" alt={type} />
            <AvatarFallback className={`${config.bgColor} ${config.color}`}>
              {config.icon}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`font-medium ${!isRead ? "text-black dark:text-white" : "text-muted-foreground"}`}
              >
                {title}
              </span>
              <Badge variant={priorityCfg.variant} className="text-xs">
                {priorityCfg.label}
              </Badge>
              {!isRead && (
                <div className="w-2 h-2 rounded-full bg-blue-500 ml-2" />
              )}
            </div>
            <p
              className={`text-sm ${!isRead ? "text-slate-700 dark:text-slate-200" : "text-muted-foreground"} line-clamp-2`}
            >
              {message}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {format(new Date(timestamp), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
      </div>
      {!isLast && <Separator className="opacity-30" />}
    </>
  );
}

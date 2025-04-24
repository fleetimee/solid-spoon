"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { toast } from "sonner";

import { Notification, NotificationFilter } from "../types/notification";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  updateNotificationStatus,
} from "../api/getNotifications";

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  filter: NotificationFilter;
  setFilter: (filter: NotificationFilter) => void;
  markAsRead: (id: string) => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<NotificationFilter>("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Fetch notifications on component mount
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getNotifications();
      // Combine the read and unread notifications
      const allNotifications = [...data.unread, ...data.read];
      setNotifications(allNotifications);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications");
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Update notification read status
  const updateReadStatus = async (id: string, isRead: boolean) => {
    try {
      const result = await updateNotificationStatus(id, isRead);
      if (result.success) {
        setNotifications((current) =>
          current.map((n) => (n.id === id ? { ...n, isRead } : n))
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error(`Failed to update notification ${id}:`, err);
      toast.error(`Failed to update notification status`);
      return false;
    }
  };

  // Mark notification as read
  const markAsRead = async (id: string) => {
    const success = await updateReadStatus(id, true);
    if (success) {
      toast.success("Notification marked as read");
    }
  };

  // Mark notification as unread
  const markAsUnread = async (id: string) => {
    const success = await updateReadStatus(id, false);
    if (success) {
      toast.success("Notification marked as unread");
    }
  };

  // Delete a notification
  const removeNotification = async (id: string) => {
    try {
      const result = await deleteNotification(id);
      if (result.success) {
        setNotifications((current) => current.filter((n) => n.id !== id));
        toast.success("Notification deleted");
        return true;
      }
      return false;
    } catch (err) {
      console.error(`Failed to delete notification ${id}:`, err);
      toast.error("Failed to delete notification");
      return false;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const result = await markAllNotificationsAsRead();
      if (result.success) {
        setNotifications((current) =>
          current.map((n) => ({ ...n, isRead: true }))
        );
        toast.success("All notifications marked as read");
      }
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      toast.error("Failed to update notifications");
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      const result = await deleteAllNotifications();
      if (result.success) {
        setNotifications([]);
        toast.success("All notifications cleared");
      }
    } catch (err) {
      console.error("Failed to clear all notifications:", err);
      toast.error("Failed to clear notifications");
    }
  };

  // Refresh notifications from server
  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        error,
        filter,
        setFilter,
        markAsRead,
        markAsUnread,
        deleteNotification: removeNotification,
        markAllAsRead,
        clearAllNotifications,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}

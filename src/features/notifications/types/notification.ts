/**
 * Types for the notification features
 */

/**
 * Notification type with all properties
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
}

/**
 * Types of notifications in the system
 */
export type NotificationType = "booking" | "system" | "user" | "maintenance";

/**
 * Priority levels for notifications
 */
export type NotificationPriority = "high" | "medium" | "low";

/**
 * Status filter options for notifications
 */
export type NotificationFilter = "all" | "unread" | "read";

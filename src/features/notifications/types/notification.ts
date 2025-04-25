/**
 * Types for the notification features
 */

/**
 * Notification type with all properties
 */
export interface Notification {
  id: string;
  recipient_id: string; // Added recipient_id property
  title: string;
  message: string;
  timestamp: Date;
  created_at: Date; // Added created_at property
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  link?: string; // Added optional link property
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

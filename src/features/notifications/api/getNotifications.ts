import { Notification } from "../types/notification";

/**
 * Fetches all notifications from the API
 * @returns Object containing unread and read notifications
 */
export async function getNotifications(): Promise<{
  unread: Notification[];
  read: Notification[];
}> {
  // Simulated API response delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // This would be replaced by a real API call in production
  return {
    unread: [
      {
        id: "n1",
        title: "New room booking request",
        message: "John Doe has requested to book Room 101 for tomorrow",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        type: "booking",
        priority: "high",
        isRead: false,
      },
      {
        id: "n2",
        title: "System update scheduled",
        message: "System maintenance scheduled for tonight at 2 AM",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        type: "system",
        priority: "medium",
        isRead: false,
      },
      {
        id: "n3",
        title: "New user registered",
        message: "Jane Smith has created a new account",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        type: "user",
        priority: "low",
        isRead: false,
      },
    ],
    read: [
      {
        id: "n4",
        title: "Room maintenance completed",
        message: "Scheduled maintenance for Conference Room A is now complete",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        type: "maintenance",
        priority: "medium",
        isRead: true,
      },
      {
        id: "n5",
        title: "Booking canceled",
        message: "Mike Johnson canceled their booking for Room 203",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        type: "booking",
        priority: "low",
        isRead: true,
      },
    ],
  };
}

/**
 * Updates a notification's read status (would call API in real implementation)
 * @param id Notification ID
 * @param isRead New read status
 */
export async function updateNotificationStatus(
  id: string,
  isRead: boolean
): Promise<{ success: boolean }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log(
    `API call: Update notification ${id} status to ${isRead ? "read" : "unread"}`
  );

  // Simulate successful response
  return { success: true };
}

/**
 * Deletes a notification (would call API in real implementation)
 * @param id Notification ID
 */
export async function deleteNotification(
  id: string
): Promise<{ success: boolean }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log(`API call: Delete notification ${id}`);

  // Simulate successful response
  return { success: true };
}

/**
 * Marks all notifications as read (would call API in real implementation)
 */
export async function markAllNotificationsAsRead(): Promise<{
  success: boolean;
}> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700));

  console.log("API call: Mark all notifications as read");

  // Simulate successful response
  return { success: true };
}

/**
 * Deletes all notifications (would call API in real implementation)
 */
export async function deleteAllNotifications(): Promise<{ success: boolean }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700));

  console.log("API call: Delete all notifications");

  // Simulate successful response
  return { success: true };
}

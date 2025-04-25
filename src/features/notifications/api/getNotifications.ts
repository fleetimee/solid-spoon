import db from "@/lib/db";
import { Notification, NotificationFilter } from "../types/notification";

export interface NotificationSearchParams {
  filter?: NotificationFilter;
  page?: number;
  pageSize?: number;
}

export interface PaginatedNotifications {
  notifications: Notification[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

/**
 * Fetches notifications from the database for a specific user
 * @param userId The ID of the user to fetch notifications for
 * @param searchParams Filter and pagination parameters
 * @returns Paginated notifications with pagination metadata
 */
export async function getNotifications(
  userId: string,
  searchParams?: NotificationSearchParams
): Promise<PaginatedNotifications> {
  // Default pagination values
  const page = searchParams?.page || 1;
  const pageSize = searchParams?.pageSize || 10;
  const filter = searchParams?.filter || "all";

  // Base condition - filter by recipient_id
  const params: Array<string | number> = [userId];
  let filterCondition = "recipient_id = $1";

  // Add condition for read/unread filter
  if (filter === "read") {
    filterCondition += " AND is_read = true";
  } else if (filter === "unread") {
    filterCondition += " AND is_read = false";
  }

  // Get total count for pagination
  const countResult = await db.query(
    `SELECT COUNT(*) as total FROM notification WHERE ${filterCondition}`,
    params
  );
  const totalItems = parseInt(countResult.rows[0].total, 10);
  const totalPages = Math.ceil(totalItems / pageSize);

  // Add pagination parameters
  params.push((page - 1) * pageSize);
  params.push(pageSize);

  // Fetch the paginated notifications
  const result = await db.query(
    `
    SELECT 
      id, 
      recipient_id, 
      title, 
      message, 
      is_read, 
      type, 
      link, 
      created_at
    FROM notification
    WHERE ${filterCondition}
    ORDER BY created_at DESC
    OFFSET $2
    LIMIT $3
    `,
    params
  );

  // Parse data from database into strongly typed objects
  const notifications: Notification[] = result.rows.map((row) => ({
    id: row.id,
    recipient_id: row.recipient_id,
    title: row.title,
    message: row.message,
    isRead: row.is_read, // Renamed from is_read to isRead
    type: row.type || "system", // Default to system if type is null
    link: row.link,
    timestamp: new Date(row.created_at), // Using created_at as timestamp
    priority: row.priority || "normal", // Default priority if not present
    created_at: new Date(row.created_at),
  }));

  return {
    notifications,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      pageSize,
    },
  };
}

/**
 * Updates a notification's read status
 * @param id Notification ID
 * @param isRead New read status
 * @returns Success status
 */
export async function updateNotificationStatus(
  id: string | number,
  isRead: boolean
): Promise<{ success: boolean }> {
  try {
    const result = await db.query(
      `
      UPDATE notification
      SET is_read = $1
      WHERE id = $2
      RETURNING id
      `,
      [isRead, id]
    );

    return { success: result?.rowCount ? result.rowCount > 0 : false };
  } catch (err) {
    console.error(`Failed to update notification ${id} status:`, err);
    return { success: false };
  }
}

/**
 * Marks all notifications as read for a specific user
 * @param userId User ID
 * @returns Success status
 */
export async function markAllNotificationsAsRead(
  userId: string
): Promise<{ success: boolean }> {
  try {
    await db.query(
      `
      UPDATE notification
      SET is_read = true
      WHERE recipient_id = $1 AND is_read = false
      `,
      [userId]
    );

    return { success: true };
  } catch (err) {
    console.error("Failed to mark all notifications as read:", err);
    return { success: false };
  }
}

/**
 * Deletes a notification
 * @param id Notification ID
 * @returns Success status
 */
export async function deleteNotification(
  id: string | number
): Promise<{ success: boolean }> {
  try {
    const result = await db.query(
      `
      DELETE FROM notification
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    return { success: result?.rowCount ? result.rowCount > 0 : false };
  } catch (err) {
    console.error(`Failed to delete notification ${id}:`, err);
    return { success: false };
  }
}

/**
 * Deletes all notifications for a specific user
 * @param userId User ID
 * @returns Success status
 */
export async function deleteAllNotifications(
  userId: string
): Promise<{ success: boolean }> {
  try {
    await db.query(
      `
      DELETE FROM notification
      WHERE recipient_id = $1
      `,
      [userId]
    );

    return { success: true };
  } catch (err) {
    console.error("Failed to delete all notifications:", err);
    return { success: false };
  }
}

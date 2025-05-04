"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Notification, NotificationFilter } from "../types/notification";

/**
 * Fetches the most recent notifications for the currently logged-in user.
 * Optimized for the notification bell popover display.
 * @returns Array of up to 10 most recent notifications, or empty array if user is not logged in
 */
export async function getRecentNotifications(): Promise<Notification[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return [];
    }

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
      WHERE recipient_id = $1
      ORDER BY created_at DESC
      LIMIT 10
      `,
      [session.user.id]
    );

    return result.rows.map((row) => ({
      id: row.id,
      recipient_id: row.recipient_id,
      title: row.title,
      message: row.message,
      isRead: row.is_read,
      type: row.type || "system",
      link: row.link,
      timestamp: new Date(row.created_at),
      priority: row.priority || "normal",
      created_at: new Date(row.created_at),
    }));
  } catch (error) {
    console.error("Error fetching recent notifications:", error);
    return [];
  }
}

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
  const params: Array<string | number | null> = [userId];

  console.log("Params:", params);

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

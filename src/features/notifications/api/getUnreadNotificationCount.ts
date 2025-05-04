"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { headers } from "next/headers";

/**
 * Get the count of unread notifications for the currently logged-in user.
 * Returns 0 if the user is not logged in or if there's an error.
 */
export async function getUnreadNotificationCount(): Promise<number> {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return 0;
    }

    // Query unread notifications count
    const result = await db.query<{ count: string }>(
      `SELECT COUNT(*)::integer as count 
       FROM notification 
       WHERE recipient_id = $1 AND is_read = false`,
      [session.user.id]
    );

    return parseInt(result.rows[0].count) || 0;
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    return 0;
  }
}

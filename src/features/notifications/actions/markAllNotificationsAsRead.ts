"use server";

import db from "../../../lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for input validation (just the user ID)
const MarkAllAsReadSchema = z.object({
  userId: z.string().min(1), // Assuming user ID is a non-empty string
});

export async function markAllNotificationsAsRead(
  userId: string
): Promise<{ success: boolean; error?: string; updatedCount?: number }> {
  // Validate input
  const validation = MarkAllAsReadSchema.safeParse({ userId });
  if (!validation.success) {
    console.error(
      "Invalid user ID for marking all as read:",
      validation.error.flatten().fieldErrors
    );
    return { success: false, error: "Invalid user ID provided." };
  }

  const validatedUserId = validation.data.userId;

  try {
    // Update all unread notifications for the user
    const result = await db.query(
      "UPDATE notification SET is_read = true WHERE recipient_id = $1 AND is_read = false",
      [validatedUserId]
    );

    const updatedCount = result.rowCount ?? 0; // Handle potential null value
    console.log(
      `Marked ${updatedCount} notifications as read for user ${validatedUserId}.`
    );

    // Revalidate the notifications page path to refresh the data
    revalidatePath("/admin/notifications");

    return { success: true, updatedCount };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { success: false, error: "Database error occurred." };
  }
}

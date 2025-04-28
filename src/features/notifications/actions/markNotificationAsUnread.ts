"use server";

import db from "../../../lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for input validation
const MarkAsUnreadSchema = z.object({
  notificationId: z.number().int().positive(),
});

export async function markNotificationAsUnread(
  notificationId: number
): Promise<{ success: boolean; error?: string }> {
  // Validate input
  const validation = MarkAsUnreadSchema.safeParse({ notificationId });
  if (!validation.success) {
    console.error(
      "Invalid notification ID for marking as unread:",
      validation.error.flatten().fieldErrors
    );
    return { success: false, error: "Invalid notification ID provided." };
  }

  const validatedId = validation.data.notificationId;

  try {
    // Update the specific notification to is_read = false
    const result = await db.query(
      "UPDATE notification SET is_read = false WHERE id = $1",
      [validatedId]
    );

    if (result.rowCount === 0) {
      console.warn(
        `Notification with ID ${validatedId} not found or already marked as unread.`
      );
      // Decide if not finding the row is an error or just a no-op
    }

    // Revalidate the notifications page path to refresh the data
    revalidatePath("/admin/notifications");

    return { success: true };
  } catch (error) {
    console.error("Error marking notification as unread:", error);
    return { success: false, error: "Database error occurred." };
  }
}

"use server";

import db from "../../../lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Optional: Define a schema for input validation
const MarkAsReadSchema = z.object({
  notificationId: z.number().int().positive(),
});

export async function markNotificationAsRead(
  notificationId: number
): Promise<{ success: boolean; error?: string }> {
  // Validate input
  const validation = MarkAsReadSchema.safeParse({ notificationId });
  if (!validation.success) {
    console.error(
      "Invalid notification ID:",
      validation.error.flatten().fieldErrors
    );
    return { success: false, error: "Invalid notification ID provided." };
  }

  const validatedId = validation.data.notificationId;

  try {
    const result = await db.query(
      "UPDATE notification SET is_read = true WHERE id = $1",
      [validatedId]
    );

    if (result.rowCount === 0) {
      console.warn(
        `Notification with ID ${validatedId} not found or already marked as read.`
      );
      // Decide if not finding the row is an error or just a no-op
      // return { success: false, error: "Notification not found." };
    }

    // Revalidate the notifications page path to refresh the data
    revalidatePath("/admin/notifications");

    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: "Database error occurred." };
  }
}

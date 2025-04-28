"use server";

import db from "../../../lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for input validation
const DeleteNotificationSchema = z.object({
  notificationId: z.number().int().positive(),
});

export async function deleteNotification(
  notificationId: number
): Promise<{ success: boolean; error?: string }> {
  // Validate input
  const validation = DeleteNotificationSchema.safeParse({ notificationId });
  if (!validation.success) {
    console.error(
      "Invalid notification ID for deletion:",
      validation.error.flatten().fieldErrors
    );
    return { success: false, error: "Invalid notification ID provided." };
  }

  const validatedId = validation.data.notificationId;

  try {
    const result = await db.query("DELETE FROM notification WHERE id = $1", [
      validatedId,
    ]);

    if (result.rowCount === 0) {
      console.warn(
        `Notification with ID ${validatedId} not found for deletion.`
      );
      // Consider if not finding the row is an error
      // return { success: false, error: "Notification not found." };
    }

    // Revalidate the notifications page path to refresh the data
    revalidatePath("/admin/notifications");

    return { success: true };
  } catch (error) {
    console.error("Error deleting notification:", error);
    return {
      success: false,
      error: "Database error occurred during deletion.",
    };
  }
}

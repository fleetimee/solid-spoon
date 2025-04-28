"use server";

import db from "../../../lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for input validation (just the user ID)
const ClearReadSchema = z.object({
  userId: z.string().min(1), // Assuming user ID is a non-empty string
});

export async function clearReadNotifications(
  userId: string
): Promise<{ success: boolean; error?: string; deletedCount?: number }> {
  // Validate input
  const validation = ClearReadSchema.safeParse({ userId });
  if (!validation.success) {
    console.error(
      "Invalid user ID for clearing read notifications:",
      validation.error.flatten().fieldErrors
    );
    return { success: false, error: "Invalid user ID provided." };
  }

  const validatedUserId = validation.data.userId;

  try {
    // Delete all notifications for the user where is_read is true
    const result = await db.query(
      "DELETE FROM notification WHERE recipient_id = $1 AND is_read = true",
      [validatedUserId]
    );

    const deletedCount = result.rowCount ?? 0; // Default to 0 if rowCount is null/undefined
    console.log(
      `Cleared ${deletedCount} read notifications for user ${validatedUserId}.`
    );

    // Revalidate the notifications page path to refresh the data
    revalidatePath("/admin/notifications");

    return { success: true, deletedCount };
  } catch (error) {
    console.error("Error clearing read notifications:", error);
    return {
      success: false,
      error: "Database error occurred during clearing.",
    };
  }
}

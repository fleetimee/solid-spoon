"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";

// Define schema for input validation
const MarkAsReadSchema = z.object({
  notificationId: z.number().int().positive(),
});

export async function markNotificationAsRead(
  notificationId: number
): Promise<{ success: boolean; error?: string }> {
  // Get current user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please sign in." };
  }

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
    // Update notification with security check (recipient_id)
    const result = await db.query(
      "UPDATE notification SET is_read = true WHERE id = $1 AND recipient_id = $2",
      [validatedId, session.user.id]
    );

    if (result.rowCount === 0) {
      return {
        success: false,
        error:
          "Notification not found or you don't have permission to modify it.",
      };
    }

    // Revalidate relevant paths
    revalidatePath("/admin/notifications");
    revalidatePath("/app/(landing-page)/layout");

    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: "Database error occurred." };
  }
}

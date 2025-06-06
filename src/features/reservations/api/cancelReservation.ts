"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";

// Define schema for input validation
const CancelReservationSchema = z.object({
  reservationId: z.string().min(1, "Reservation ID is required"),
});

export async function cancelReservation(
  reservationId: string
): Promise<{ success: boolean; error?: string }> {
  // Get current user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please sign in." };
  }

  // Validate input
  const validation = CancelReservationSchema.safeParse({ reservationId });
  if (!validation.success) {
    console.error(
      "Invalid reservation ID:",
      validation.error.flatten().fieldErrors
    );
    return { success: false, error: "Invalid reservation ID provided." };
  }

  const validatedId = validation.data.reservationId;

  try {
    // First, get the PENDING status ID from lookup table
    const pendingStatusResult = await db.query(
      `SELECT id FROM lookup WHERE category = $1 AND code = $2 LIMIT 1`,
      ["reservation_status", "PENDING"]
    );
    const pendingStatusId = pendingStatusResult.rows[0]?.id;

    if (!pendingStatusId) {
      console.error("Could not find PENDING status in lookup table");
      return {
        success: false,
        error: "System configuration error. Please contact support.",
      };
    }

    // Get the CANCELLED status ID from lookup table
    const cancelledStatusResult = await db.query(
      `SELECT id FROM lookup WHERE category = $1 AND code = $2 LIMIT 1`,
      ["reservation_status", "CANCELLED"]
    );
    const cancelledStatusId = cancelledStatusResult.rows[0]?.id;

    if (!cancelledStatusId) {
      console.error("Could not find CANCELLED status in lookup table");
      return {
        success: false,
        error: "System configuration error. Please contact support.",
      };
    }

    // Now check if the reservation exists and belongs to the user
    // Also fetch room information for notification
    const checkQuery = `
      SELECT
        rr.id,
        rr.user_id,
        rr.status_id,
        rr.title,
        rr.start_time,
        rr.end_time,
        l.value as status_value,
        r.name as room_name,
        r.slug as room_slug
      FROM room_reservation rr
      INNER JOIN lookup l ON rr.status_id = l.id AND l.category = 'reservation_status'
      INNER JOIN room r ON rr.room_id = r.id
      WHERE rr.id = $1 AND rr.is_active = true
    `;

    const checkResult = await db.query(checkQuery, [validatedId]);

    if (checkResult.rowCount === 0) {
      return {
        success: false,
        error: "Reservation not found or has been deleted.",
      };
    }

    const reservation = checkResult.rows[0];

    // Check if the reservation belongs to the current user
    if (reservation.user_id !== session.user.id) {
      return {
        success: false,
        error: "You don't have permission to cancel this reservation.",
      };
    }

    // Check if the reservation is in PENDING status using the dynamically retrieved ID
    if (reservation.status_id !== pendingStatusId) {
      return {
        success: false,
        error: `Cannot cancel reservation. Current status: ${reservation.status_value}. Only pending reservations can be cancelled.`,
      };
    }

    // Update the reservation status to CANCELLED using the dynamically retrieved ID
    const updateQuery = `
      UPDATE room_reservation
      SET
        status_id = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND user_id = $3 AND status_id = $4
    `;

    const updateResult = await db.query(updateQuery, [
      cancelledStatusId,
      validatedId,
      session.user.id,
      pendingStatusId,
    ]);

    if (updateResult.rowCount === 0) {
      return {
        success: false,
        error:
          "Failed to cancel reservation. It may have been modified by another process.",
      };
    }

    // Create notification for admins about the cancellation
    try {
      const notificationTitle = "Reservation Cancelled";
      const userName =
        session.user?.name ||
        session.user?.email ||
        `User ID: ${session.user.id}`;
      const notificationMessage = `${userName} cancelled their reservation "${reservation.title}" for room "${reservation.room_name}".`;
      const notificationType = "admin";
      const notificationLink = reservation.room_slug
        ? `/admin/rooms/${reservation.room_slug}`
        : "/admin/reservations";

      await db.query(
        `INSERT INTO notification (recipient_id, title, message, type, link)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          "admin",
          notificationTitle,
          notificationMessage,
          notificationType,
          notificationLink,
        ]
      );

      console.log(
        `Admin notification created for cancelled reservation ${validatedId}`
      );
    } catch (notificationError) {
      console.error(
        `Failed to create notification for cancelled reservation ${validatedId}:`,
        notificationError
      );
      // Don't fail the cancellation if notification creation fails
    }

    // Revalidate relevant paths to refresh the UI
    revalidatePath("/me/bookings");
    revalidatePath("/me/activity");
    revalidatePath("/rooms");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/notifications"); // Add this to refresh notifications

    return { success: true };
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    return {
      success: false,
      error: "An unexpected error occurred while cancelling the reservation.",
    };
  }
}

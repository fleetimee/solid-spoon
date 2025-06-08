"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db, { withTransaction } from "@/lib/db";
import { PoolClient } from "pg";
import { z } from "zod";

export type RejectReservationFormState = {
  success: boolean;
  message: string;
  errors?: {
    reservationId?: string[];
    rejectionReason?: string[];
  };
};

// Schema for validating rejection input
const rejectionSchema = z.object({
  reservationId: z.coerce.string().min(1, "ID reservasi diperlukan."),
  rejectionReason: z.string().min(1, "Alasan penolakan diperlukan."),
});

export async function rejectReservationAction(
  prevState: RejectReservationFormState,
  formData: FormData
): Promise<RejectReservationFormState> {
  // --- 1. Validate input from formData ---
  const parseResult = rejectionSchema.safeParse({
    reservationId: formData.get("reservationId"),
    rejectionReason: formData.get("rejectionReason"),
  });

  if (!parseResult.success) {
    return {
      success: false,
      message: "Validasi gagal.",
      errors: parseResult.error.flatten().fieldErrors,
    };
  }

  const { reservationId, rejectionReason } = parseResult.data;

  // --- 2. Authentication & Authorization ---
  const readonlyHeaders = await headers();
  const mutableHeaders = new Headers();
  readonlyHeaders.forEach((value: string, key: string) => {
    mutableHeaders.append(key, value);
  });
  const session = await auth.api.getSession({ headers: mutableHeaders });

  if (!session?.user?.id || session.user.role !== "admin") {
    return {
      success: false,
      message: "Tidak diizinkan: Hanya admin yang dapat menolak reservasi.",
    };
  }

  const adminUserId = session.user.id; // Keep track of who rejected
  const rejectedStatusId = 4; // As per instructions

  try {
    // Use the withTransaction helper
    await withTransaction(async (client: PoolClient) => {
      const result = await client.query(
        `UPDATE room_reservation
         SET status_id = $1, rejection_reason = $2, approver_id = $3, approved_at = NULL -- Store reason, set rejector, clear approval date
         WHERE id = $4`,
        [rejectedStatusId, rejectionReason, adminUserId, reservationId] // Use validated data
      );

      // Check if any row was updated
      if (result.rowCount === 0) {
        throw new Error(
          `Reservation with ID ${reservationId} not found or could not be updated.`
        );
      }

      // Optional: Log the rejection action
      // await client.query('INSERT INTO audit_log ...');
    });

    // --- 4. Fetch Details & Send Notification (After successful transaction) ---
    try {
      // Fetch details needed for the notification *after* the update is confirmed
      const detailsResult = await db.query(
        `SELECT
           u.email as "userEmail",
           u.name as "userName",
           r.name as "roomName",
           rr.user_id as "userId"
         FROM room_reservation rr
         JOIN "user" u ON rr.user_id = u.id
         JOIN room r ON rr.room_id = r.id
         WHERE rr.id = $1`,
        [reservationId] // Use the validated reservationId
      );

      // Check if detailsResult and rowCount are valid before proceeding
      if (
        detailsResult &&
        detailsResult.rowCount &&
        detailsResult.rowCount > 0
      ) {
        const reservationDetails = detailsResult.rows[0];
        try {
          const notifyUrl = new URL(
            "/api/reservations/notify",
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000" // Fallback needed
          ).toString();

          await fetch(notifyUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reservationId: reservationId,
              userEmail: reservationDetails.userEmail,
              userName: reservationDetails.userName,
              roomName: reservationDetails.roomName,
              status: "rejected", // Explicitly set status
              reason: rejectionReason, // Include the rejection reason
            }),
          });
          console.log(
            `Notification attempt for rejected reservation ${reservationId}`
          );
        } catch (notifyError) {
          console.error(
            `Failed to send notification for rejected reservation ${reservationId}:`,
            notifyError
          );
          // Do not fail the entire action if notification fails
        }

        // Insert notification record
        try {
          await db.query(
            `INSERT INTO notification (recipient_id, title, message, type, link)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              reservationDetails.userId,
              "Reservasi Ditolak",
              `Reservasi Anda untuk ruangan '${reservationDetails.roomName}' telah ditolak. Alasan: ${rejectionReason}`,
              "user",
              "/me/bookings",
            ]
          );
          console.log(
            `Notification record created for reservation ${reservationId}`
          );
        } catch (notificationError) {
          console.error(
            `Failed to create notification record for reservation ${reservationId}:`,
            notificationError
          );
          // Don't fail the action if notification insertion fails
        }
      } else {
        console.warn(
          `Could not find details for rejected reservation ${reservationId} after update. Notification not sent.`
        );
      }
    } catch (detailError) {
      // Log error fetching details, but don't fail the primary action
      console.error(
        `Error fetching details for notification (reservation ${reservationId}):`,
        detailError
      );
    }

    // --- 5. Revalidate Paths ---
    revalidatePath("/admin/rooms/reservations"); // Admin list
    revalidatePath(`/admin/rooms/reservations/${reservationId}/reject`); // Specific rejection page
    revalidatePath("/me/bookings"); // User's booking list
    // Potentially revalidate the specific room page if it shows reservation status
    // revalidatePath(`/v/[roomSlug]`); // Needs roomSlug

    return {
      success: true,
      message: "Reservasi berhasil ditolak.",
    };
  } catch (error) {
    console.error("Failed to reject reservation:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Database error occurred.";
    return {
      success: false,
      message: `Gagal menolak reservasi: ${errorMessage}`,
    };
  }
}

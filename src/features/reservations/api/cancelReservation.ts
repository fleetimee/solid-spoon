"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";

// Define schema for input validation
const CancelReservationSchema = z.object({
  reservationId: z.string().min(1, "ID reservasi diperlukan"),
});

// Helper function to check if a reservation can be cancelled
function checkCancellationEligibility(
  statusId: string,
  startTime: string,
  pendingStatusId: string,
  approvedStatusId: string
): {
  canCancel: boolean;
  error?: string;
  reason?:
    | "pending"
    | "approved_eligible"
    | "approved_too_late"
    | "other_status";
} {
  const now = new Date();
  const reservationStartTime = new Date(startTime);
  const hoursUntilStart =
    (reservationStartTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  // PENDING reservations can always be cancelled
  if (statusId === pendingStatusId) {
    return { canCancel: true, reason: "pending" };
  }

  // APPROVED reservations can be cancelled if more than 24 hours away
  if (statusId === approvedStatusId) {
    if (hoursUntilStart > 24) {
      return { canCancel: true, reason: "approved_eligible" };
    } else {
      return {
        canCancel: false,
        error: `Tidak dapat membatalkan reservasi yang disetujui. Pembatalan hanya diizinkan lebih dari 24 jam sebelum waktu mulai. Reservasi ini dimulai dalam ${Math.ceil(hoursUntilStart)} jam. Silakan hubungi administrator jika Anda perlu membatalkan reservasi ini.`,
        reason: "approved_too_late",
      };
    }
  }

  // Other statuses (COMPLETED, REJECTED, CANCELLED) cannot be cancelled
  return {
    canCancel: false,
    error: "Reservasi ini tidak dapat dibatalkan karena status saat ini.",
    reason: "other_status",
  };
}

export async function cancelReservation(
  reservationId: string
): Promise<{ success: boolean; error?: string }> {
  // Get current user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Tidak memiliki otorisasi. Silakan masuk.",
    };
  }

  // Validate input
  const validation = CancelReservationSchema.safeParse({ reservationId });
  if (!validation.success) {
    console.error(
      "Invalid reservation ID:",
      validation.error.flatten().fieldErrors
    );
    return {
      success: false,
      error: "ID reservasi yang diberikan tidak valid.",
    };
  }

  const validatedId = validation.data.reservationId;

  try {
    // Get status IDs from lookup table
    const statusResult = await db.query(
      `SELECT id, code FROM lookup WHERE category = $1 AND code IN ($2, $3, $4)`,
      ["reservation_status", "PENDING", "APPROVED", "CANCELLED"]
    );

    const statusMap = statusResult.rows.reduce(
      (acc, row) => {
        acc[row.code] = row.id;
        return acc;
      },
      {} as Record<string, string>
    );

    const pendingStatusId = statusMap.PENDING;
    const approvedStatusId = statusMap.APPROVED;
    const cancelledStatusId = statusMap.CANCELLED;

    if (!pendingStatusId || !approvedStatusId || !cancelledStatusId) {
      console.error(
        "Could not find required status IDs in lookup table",
        statusMap
      );
      return {
        success: false,
        error: "Kesalahan konfigurasi sistem. Silakan hubungi dukungan.",
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
        error: "Reservasi tidak ditemukan atau telah dihapus.",
      };
    }

    const reservation = checkResult.rows[0];

    // Check if the reservation belongs to the current user
    if (reservation.user_id !== session.user.id) {
      return {
        success: false,
        error: "Anda tidak memiliki izin untuk membatalkan reservasi ini.",
      };
    }

    // Check if the reservation can be cancelled based on status and time
    const canCancelResult = checkCancellationEligibility(
      reservation.status_id,
      reservation.start_time,
      pendingStatusId,
      approvedStatusId
    );

    if (!canCancelResult.canCancel) {
      return {
        success: false,
        error: canCancelResult.error,
      };
    }

    // Update the reservation status to CANCELLED
    const updateQuery = `
      UPDATE room_reservation
      SET
        status_id = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND user_id = $3 AND status_id = ANY($4)
    `;

    const updateResult = await db.query(updateQuery, [
      cancelledStatusId,
      validatedId,
      session.user.id,
      [pendingStatusId, approvedStatusId], // Allow cancellation of both PENDING and APPROVED reservations
    ]);

    if (updateResult.rowCount === 0) {
      return {
        success: false,
        error:
          "Gagal membatalkan reservasi. Mungkin telah dimodifikasi oleh proses lain.",
      };
    }

    // Create notification for admins about the cancellation
    try {
      const notificationTitle = "Reservasi Dibatalkan";
      const userName =
        session.user?.name ||
        session.user?.email ||
        `User ID: ${session.user.id}`;
      const notificationMessage = `${userName} membatalkan reservasi mereka "${reservation.title}" untuk ruangan "${reservation.room_name}".`;
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
      error: "Terjadi kesalahan yang tidak terduga saat membatalkan reservasi.",
    };
  }
}

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
  reservationId: z.coerce.string().min(1, "Reservation ID is required."),
  rejectionReason: z.string().min(1, "Rejection reason is required."),
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
      message: "Validation failed.",
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
      message: "Unauthorized: Only admins can reject reservations.",
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

    // Revalidate paths after successful update
    revalidatePath("/admin/rooms/reservations"); // Admin list
    revalidatePath(`/admin/rooms/reservations/${reservationId}/reject`); // Specific rejection page
    revalidatePath("/me/bookings"); // User's booking list
    // Potentially revalidate the specific room page if it shows reservation status
    // revalidatePath(`/v/[roomSlug]`); // Needs roomSlug

    return {
      success: true,
      message: "Reservation rejected successfully.",
    };
  } catch (error) {
    console.error("Failed to reject reservation:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Database error occurred.";
    return {
      success: false,
      message: `Failed to reject reservation: ${errorMessage}`,
    };
  }
}

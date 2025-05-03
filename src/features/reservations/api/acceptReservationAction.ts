"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers"; // Import headers
import { auth } from "@/lib/auth";
import db, { withTransaction } from "@/lib/db"; // Correct db import and add withTransaction
import { getLookupsByCategory } from "@/features/application/api/getLookupValue"; // Use getLookupsByCategory
import { PoolClient } from "pg"; // Import PoolClient type
import { z } from "zod"; // Import zod

export type AcceptReservationFormState = {
  success: boolean;
  message: string;
  errors?: {
    reservationId?: string[];
  };
};

// Updated signature to match the (prevState, formData) pattern
export async function acceptReservationAction(
  prevState: AcceptReservationFormState,
  formData: FormData
): Promise<AcceptReservationFormState> {
  // --- 1. Validate reservationId from formData ---
  const schema = z.object({
    // Use coerce to ensure it's treated as a string before validation
    reservationId: z.coerce.string().min(1, "Reservation ID is required."),
  });

  const parseResult = schema.safeParse({
    reservationId: formData.get("reservationId"),
  });

  if (!parseResult.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: parseResult.error.flatten().fieldErrors,
    };
  }

  // --- 2. Authentication & Authorization ---
  const readonlyHeaders = await headers();
  const mutableHeaders = new Headers();
  readonlyHeaders.forEach((value: string, key: string) => {
    mutableHeaders.append(key, value);
  });
  const session = await auth.api.getSession({ headers: mutableHeaders });

  // Check session and user role
  if (!session?.user?.id || session.user.role !== "admin") {
    return {
      success: false,
      message: "Unauthorized: Only admins can accept reservations.",
    };
  }

  const adminUserId = session.user.id;

  // Fetch all statuses for the category
  const statuses = await getLookupsByCategory("reservation_status");
  const acceptedStatus = statuses.find((status) => status.value === "Approved");

  if (!acceptedStatus) {
    return {
      success: false,
      message: "Configuration error: 'Accepted' status lookup value not found.",
    };
  }
  const acceptedStatusId = acceptedStatus.id; // Get the ID from the found status object

  try {
    // Use the withTransaction helper
    await withTransaction(async (client: PoolClient) => {
      const result = await client.query(
        `UPDATE room_reservation
         SET status_id = $1, approver_id = $2, approved_at = NOW()
         WHERE id = $3`,
        // Use the validated reservationId from formData
        [acceptedStatusId, adminUserId, parseResult.data.reservationId] // Use the validated string ID
      );

      // Check if any row was updated
      if (result.rowCount === 0) {
        // Throw an error to trigger rollback
        throw new Error(
          `Reservation with ID ${parseResult.data.reservationId} not found or could not be updated.`
        );
      }
    });

    // Revalidate paths after successful update
    revalidatePath("/admin/rooms/reservations"); // Admin list
    revalidatePath(
      `/admin/rooms/reservations/${parseResult.data.reservationId}/confirmation`
    ); // Specific confirmation page (might not be needed if redirecting)
    revalidatePath("/me/bookings"); // User's booking list
    // Potentially revalidate the specific room page if it shows reservation status
    // revalidatePath(`/v/[roomSlug]`); // Needs roomSlug

    return {
      success: true,
      message: "Reservation accepted successfully.",
    };
  } catch (error) {
    console.error("Failed to accept reservation:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Database error occurred.";
    return {
      success: false,
      message: `Failed to accept reservation: ${errorMessage}`,
    };
  }
}

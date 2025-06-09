import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db, { withTransaction } from "@/lib/db";
import { PoolClient } from "pg";

export async function GET() {
  try {
    const result = await withTransaction(async (client: PoolClient) => {
      // Query for expired approved reservations
      const expiredReservationsResult = await client.query(
        `SELECT id, title, end_time 
         FROM room_reservation 
         WHERE status_id = 3 AND end_time < NOW() AND is_active = true`
      );

      if (expiredReservationsResult.rowCount === 0) {
        return {
          updatedCount: 0,
          updatedReservations: [],
          timestamp: new Date().toISOString(),
        };
      }

      const expiredReservations = expiredReservationsResult.rows;
      const reservationIds = expiredReservations.map((r) => r.id);

      // Update expired reservations to COMPLETED status
      const updateResult = await client.query(
        `UPDATE room_reservation 
         SET status_id = 6, updated_at = NOW() 
         WHERE id = ANY($1)`,
        [reservationIds]
      );

      return {
        updatedCount: updateResult.rowCount || 0,
        updatedReservations: reservationIds,
        timestamp: new Date().toISOString(),
      };
    });

    // Revalidate relevant paths for cache invalidation
    revalidatePath("/admin/reservations");
    revalidatePath("/admin/dashboard");
    revalidatePath("/me/bookings");

    return NextResponse.json({
      success: true,
      message: "Successfully updated expired reservations",
      data: result,
    });
  } catch (error) {
    console.error("Failed to update expired reservations:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Database error occurred.";

    return NextResponse.json(
      {
        success: false,
        message: `Failed to update expired reservations: ${errorMessage}`,
        data: {
          updatedCount: 0,
          updatedReservations: [],
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}

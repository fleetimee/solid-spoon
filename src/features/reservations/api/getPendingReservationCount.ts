import db from "@/lib/db";

/**
 * Fetches the count of pending reservations for a specific user and room.
 * @param userId - The ID of the user.
 * @param roomId - The ID of the room.
 * @returns The count of pending reservations, or 0 if none found or an error occurs.
 */
export async function getPendingReservationCount(
  userId: string,
  roomId: number
): Promise<number> {
  try {
    // First, get the PENDING status ID from lookup table
    const pendingStatusResult = await db.query(
      `SELECT id FROM lookup WHERE category = $1 AND code = $2 LIMIT 1`,
      ["reservation_status", "PENDING"]
    );
    const pendingStatusId = pendingStatusResult.rows[0]?.id;

    if (!pendingStatusId) {
      console.error("Could not find PENDING status in lookup table");
      return 0;
    }

    const result = await db.query<{ count: number }>(
      `
      SELECT count(*)::int
      FROM room_reservation
      WHERE user_id = $1 AND room_id = $2 AND status_id = $3;
    `,
      [userId, roomId, pendingStatusId]
    );

    // If a row is returned, return the count, otherwise return 0
    return result.rows[0]?.count || 0;
  } catch (error) {
    console.error("Error fetching pending reservation count:", error);
    // Return 0 in case of any error
    return 0;
  }
}

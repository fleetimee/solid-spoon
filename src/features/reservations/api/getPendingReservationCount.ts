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
    const result = await db.query<{ count: number }>(
      `
      SELECT count(*)::int
      FROM room_reservation
      WHERE user_id = $1 AND room_id = $2 AND status_id = 2;
    `,
      [userId, roomId]
    );

    // If a row is returned, return the count, otherwise return 0
    return result.rows[0]?.count || 0;
  } catch (error) {
    console.error("Error fetching pending reservation count:", error);
    // Return 0 in case of any error
    return 0;
  }
}

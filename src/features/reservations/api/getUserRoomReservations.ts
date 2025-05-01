import db from "@/lib/db";

/**
 * Interface representing a user's reservation for a specific room, including status description.
 */
export interface UserRoomReservation {
  id: number;
  title: string;
  startTime: Date; // pg driver typically maps TIMESTAMPTZ/TIMESTAMP to Date
  endTime: Date;
  createdAt: Date;
  statusValue: string;
  // statusId?: number; // Optional, uncomment if needed in the SELECT query too
}

/**
 * Fetches all active reservations made by a specific user for a specific room.
 * Includes the reservation status description.
 *
 * @param userId - The ID of the user whose reservations to fetch.
 * @param roomId - The ID of the room to filter reservations for.
 * @returns A promise that resolves to an array of UserRoomReservation objects.
 */
export async function getUserRoomReservations(
  userId: string,
  roomId: number
): Promise<UserRoomReservation[]> {
  const query = `
    SELECT
      rr.id,
      rr.title,
      rr.start_time AS "startTime",
      rr.end_time AS "endTime",
      rr.created_at AS "createdAt",
      l.value AS "statusValue"
      -- l.id AS "statusId" -- Optional, uncomment if needed
    FROM
      room_reservation rr
    INNER JOIN -- Use INNER JOIN as status is expected
      lookup l ON rr.status_id = l.id AND l.category = 'reservation_status'
    WHERE
      rr.room_id = $1 AND rr.user_id = $2 AND rr.is_active = true
    ORDER BY
      rr.start_time ASC; -- Order by start time ascending as requested
  `;

  try {
    // Use db.query() which handles client connection pooling
    const result = await db.query<UserRoomReservation>(query, [roomId, userId]);
    // result.rows contains the array of reservations matching the interface
    return result.rows;
  } catch (error) {
    console.error("Error fetching user room reservations:", {
      userId,
      roomId,
      error,
    });
    return []; // Return empty array on error
  }
}

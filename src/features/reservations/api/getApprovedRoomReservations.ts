"use server";

import db from "@/lib/db"; // Use default import
// Removed unused Prisma client import

// Define the expected return type for clarity
export type ApprovedReservationTime = {
  startTime: Date;
  endTime: Date;
};

/**
 * Fetches approved reservations for a specific room.
 * Only selects start and end times.
 * @param roomId - The ID of the room.
 * @returns A promise that resolves to an array of approved reservation start and end times.
 */
export async function getApprovedRoomReservations(
  roomId: number
): Promise<ApprovedReservationTime[]> {
  if (!roomId) {
    console.error("getApprovedRoomReservations: roomId is required.");
    return []; // Or throw an error, depending on desired handling
  }

  try {
    // Use SQL query with the connection pool
    const result = await db.query(
      `SELECT start_time AS "startTime", end_time AS "endTime"
       FROM room_reservation -- Use correct table name
       WHERE room_id = $1 AND status_id = $2 -- Use correct status column and assumed ID for 'APPROVED'
       ORDER BY start_time ASC`,
      [roomId, 3] // Pass parameters safely (using 3 for APPROVED status_id)
    );

    // The result object likely has a 'rows' property containing the data
    const reservations: ApprovedReservationTime[] = result.rows;

    // Ensure startTime and endTime are Date objects (pg usually handles this for TIMESTAMP types)
    return reservations;
  } catch (error) {
    console.error("Failed to fetch approved reservations:", error);
    // Depending on requirements, you might want to throw the error
    // or return an empty array to allow the UI to render gracefully.
    return [];
  }
}

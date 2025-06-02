"use server";

import db from "@/lib/db"; // Use default import
// Removed unused Prisma client import

// Define user information for reservations
export type ReservationUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

// Define the expected return type for clarity
export type ApprovedReservationTime = {
  id: string;
  startTime: Date;
  endTime: Date;
  title: string;
  user: ReservationUser;
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
    // Use SQL query with JOIN to get user information
    const result = await db.query(
      `SELECT
         rr.id,
         rr.start_time AS "startTime",
         rr.end_time AS "endTime",
         rr.title,
         u.id AS "userId",
         u.name AS "userName",
         u.email AS "userEmail",
         u.image AS "userImage"
       FROM room_reservation rr
       JOIN "user" u ON rr.user_id = u.id
       WHERE rr.room_id = $1 AND rr.status_id = $2 AND rr.is_active = true
       ORDER BY rr.start_time ASC`,
      [roomId, 3] // Pass parameters safely (using 3 for APPROVED status_id)
    );

    // Transform the result to match our interface
    const reservations: ApprovedReservationTime[] = result.rows.map(
      (row: any) => ({
        id: row.id,
        startTime: row.startTime,
        endTime: row.endTime,
        title: row.title,
        user: {
          id: row.userId,
          name: row.userName,
          email: row.userEmail,
          image: row.userImage,
        },
      })
    );

    return reservations;
  } catch (error) {
    console.error("Failed to fetch approved reservations:", error);
    // Depending on requirements, you might want to throw the error
    // or return an empty array to allow the UI to render gracefully.
    return [];
  }
}

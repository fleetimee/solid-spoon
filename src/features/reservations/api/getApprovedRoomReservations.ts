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
 * Fetches only APPROVED reservations for a specific room.
 * Only APPROVED status reservations count as active reservations.
 * @param roomId - The ID of the room.
 * @returns A promise that resolves to an array of reservation data with status information.
 */
export async function getApprovedRoomReservations(
  roomId: number
): Promise<(ApprovedReservationTime & { status: string })[]> {
  if (!roomId) {
    console.error("getApprovedRoomReservations: roomId is required.");
    return []; // Or throw an error, depending on desired handling
  }

  try {
    // Get APPROVED status ID from lookup table
    const approvedStatusResult = await db.query(
      `SELECT id FROM lookup WHERE category = $1 AND code = $2 LIMIT 1`,
      ["reservation_status", "APPROVED"]
    );
    const approvedStatusId = approvedStatusResult.rows[0]?.id;

    if (!approvedStatusId) {
      console.error("Could not find APPROVED status in lookup table");
      return [];
    }

    // Use SQL query with JOIN to get user information
    // Fetch only APPROVED reservations - these are the only active reservations
    const result = await db.query(
      `SELECT
         rr.id,
         rr.start_time AS "startTime",
         rr.end_time AS "endTime",
         rr.title,
         rr.status_id,
         u.id AS "userId",
         u.name AS "userName",
         u.email AS "userEmail",
         u.image AS "userImage"
       FROM room_reservation rr
       JOIN "user" u ON rr.user_id = u.id
       WHERE rr.room_id = $1 AND rr.status_id = $2 AND rr.is_active = true
       ORDER BY rr.start_time ASC`,
      [roomId, approvedStatusId]
    );

    // Transform the result to match our interface
    const reservations: (ApprovedReservationTime & { status: string })[] =
      result.rows.map((row: any) => ({
        id: row.id,
        startTime: row.startTime,
        endTime: row.endTime,
        title: row.title,
        // Only APPROVED reservations are returned
        status: "Approved",
        user: {
          id: row.userId,
          name: row.userName,
          email: row.userEmail,
          image: row.userImage,
        },
      }));

    return reservations;
  } catch (error) {
    console.error("Failed to fetch approved reservations:", error);
    // Depending on requirements, you might want to throw the error
    // or return an empty array to allow the UI to render gracefully.
    return [];
  }
}

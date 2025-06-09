"use server";

import db from "@/lib/db";

// Define user information for reservations
export type ReservationUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

// Define the expected return type for enhanced reservations
export type RoomReservationWithStatus = {
  id: string;
  startTime: Date;
  endTime: Date;
  title: string;
  status: string;
  user: ReservationUser;
};

/**
 * Fetches APPROVED and COMPLETED reservations for a specific room.
 * This function provides enhanced data for status-colored calendar display.
 * @param roomId - The ID of the room.
 * @returns A promise that resolves to an array of reservation data with status information.
 */
export async function getAllRoomReservations(
  roomId: number
): Promise<RoomReservationWithStatus[]> {
  if (!roomId) {
    console.error("getAllRoomReservations: roomId is required.");
    return [];
  }

  try {
    // Get APPROVED and COMPLETED status IDs from lookup table
    const statusResults = await db.query(
      `SELECT id, code FROM lookup WHERE category = $1 AND code IN ($2, $3)`,
      ["reservation_status", "APPROVED", "COMPLETED"]
    );

    if (statusResults.rows.length === 0) {
      console.error(
        "Could not find APPROVED or COMPLETED status in lookup table"
      );
      return [];
    }

    // Create a mapping of status codes to IDs
    const statusMap = new Map();
    statusResults.rows.forEach((row) => {
      statusMap.set(row.code, row.id);
    });

    const approvedStatusId = statusMap.get("APPROVED");
    const completedStatusId = statusMap.get("COMPLETED");

    if (!approvedStatusId && !completedStatusId) {
      console.error("Could not find required statuses in lookup table");
      return [];
    }

    // Build the query with available status IDs
    const statusIds = [];
    if (approvedStatusId) statusIds.push(approvedStatusId);
    if (completedStatusId) statusIds.push(completedStatusId);

    // Use SQL query with JOIN to get user information and lookup status
    const result = await db.query(
      `SELECT
         rr.id,
         rr.start_time AS "startTime",
         rr.end_time AS "endTime",
         rr.title,
         rr.status_id,
         l.code AS "statusCode",
         u.id AS "userId",
         u.name AS "userName",
         u.email AS "userEmail",
         u.image AS "userImage"
       FROM room_reservation rr
       JOIN "user" u ON rr.user_id = u.id
       JOIN lookup l ON rr.status_id = l.id
       WHERE rr.room_id = $1 AND rr.status_id = ANY($2) AND rr.is_active = true
       ORDER BY rr.start_time ASC`,
      [roomId, statusIds]
    );

    // Transform the result to match our interface
    const reservations: RoomReservationWithStatus[] = result.rows.map(
      (row: any) => ({
        id: row.id,
        startTime: row.startTime,
        endTime: row.endTime,
        title: row.title,
        // Map status codes to display values
        status:
          row.statusCode === "APPROVED"
            ? "Approved"
            : row.statusCode === "COMPLETED"
              ? "Completed"
              : row.statusCode, // fallback to original code
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
    console.error("Failed to fetch room reservations:", error);
    return [];
  }
}

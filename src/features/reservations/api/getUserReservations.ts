// src/features/reservations/api/getUserReservations.ts

import db from "@/lib/db";

// Define the structure for the returned reservation data
export interface UserReservation {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  roomName: string;
  status: string;
}

// Define the structure for the raw database row
// Helps with type safety during mapping
interface ReservationRow {
  id: string;
  title: string;
  description: string | null;
  start_time: string | Date; // Depending on DB driver, might be string or Date
  end_time: string | Date;
  created_at: string | Date;
  roomName: string; // Alias already handled in SQL
  status: string; // Alias already handled in SQL
}

/**
 * Fetches the reservation history for a specific user.
 * Compatible with React Server Components.
 *
 * @param userId - The ID of the user whose reservations to fetch.
 * @returns A promise resolving to an array of user reservations.
 */
export async function getUserReservations(
  userId: string
): Promise<UserReservation[]> {
  const sql = `
    SELECT
      rr.id,
      rr.title,
      rr.description,
      rr.start_time,
      rr.end_time,
      rr.created_at,
      r.name AS "roomName", -- Alias room name
      l.value AS status     -- Alias lookup value as status
    FROM
      room_reservation rr
    JOIN
      room r ON rr.room_id = r.id
    JOIN
      lookup l ON rr.status_id = l.id AND l.category = 'reservation_status'
    WHERE
      rr.user_id = $1 -- Filter by user ID using parameterized query
    ORDER BY
      rr.start_time DESC;    -- Order by start time, newest first
  `;

  try {
    // Execute the query using db.query as requested
    // Assuming db.query returns an object with a 'rows' property like node-postgres
    const result = await db.query<ReservationRow>(sql, [userId]);

    // Map the raw database rows to the UserReservation type
    const reservations: UserReservation[] = result.rows.map(
      (row: ReservationRow) => ({
        // Add explicit type
        id: row.id,
        title: row.title,
        description: row.description,
        startTime: new Date(row.start_time), // Convert timestamp string/object to Date
        endTime: new Date(row.end_time), // Convert timestamp string/object to Date
        createdAt: new Date(row.created_at), // Convert timestamp string/object to Date
        roomName: row.roomName,
        status: row.status,
      })
    );

    return reservations;
  } catch (error) {
    console.error("Database Error: Failed to fetch user reservations.", error);
    // Re-throw the error or return an empty array/handle appropriately
    throw new Error("Failed to fetch user reservations.");
    // Or return []; depending on desired error handling
  }
}

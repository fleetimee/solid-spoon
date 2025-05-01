import db from "@/lib/db";
import { PoolClient } from "pg";

export interface RecentReservation {
  id: number;
  title: string;
  startTime: Date; // Assuming DB returns Date objects or ISO strings parsable to Date
  endTime: Date; // Assuming DB returns Date objects or ISO strings parsable to Date
  userName: string;
  createdAt: Date; // Assuming DB returns Date objects or ISO strings parsable to Date
  statusValue: string; // Added status description
}

export async function getRecentReservations(
  roomId: number
): Promise<RecentReservation[]> {
  const query = `
    SELECT
      rr.id,
      rr.title,
      rr.start_time AS "startTime",
      rr.end_time AS "endTime",
      u.name AS "userName",
      rr.created_at AS "createdAt",
      l.value AS "statusValue" -- Added status description from lookup
    FROM
      room_reservation rr
    INNER JOIN
      "user" u ON rr.user_id = u.id
    LEFT JOIN -- Join with lookup table for status description
      lookup l ON rr.status_id = l.id AND l.category = 'reservation_status'
    WHERE
      rr.room_id = $1 AND rr.is_active = true
    ORDER BY
      rr.created_at DESC
    LIMIT 5;
  `;

  try {
    // Use db.query() for a single query, it handles client acquisition/release
    const result = await db.query<RecentReservation>(query, [roomId]);
    // pg library typically returns results in result.rows
    // The aliases in the SELECT statement should make the row objects match the interface
    return result.rows;
  } catch (error) {
    console.error("Error fetching recent reservations:", error);
    // Return an empty array in case of error as requested
    return [];
  }
}

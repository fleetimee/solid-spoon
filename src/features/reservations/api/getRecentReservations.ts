import db from "@/lib/db";

export interface RecentReservation {
  id: number;
  title: string;
  startTime: Date; // Assuming DB returns Date objects or ISO strings parsable to Date
  endTime: Date; // Assuming DB returns Date objects or ISO strings parsable to Date
  userName: string;
  userImage: string | null; // Added user image field
  createdAt: Date; // Assuming DB returns Date objects or ISO strings parsable to Date
  statusValue: string; // Added status description
}

export async function getRecentReservations(
  roomId: number,
  limit: number = 20 // Add limit parameter with default value
): Promise<RecentReservation[]> {
  const query = `
    SELECT
      rr.id,
      rr.title,
      rr.start_time AS "startTime",
      rr.end_time AS "endTime",
      u.name AS "userName",
      u.image AS "userImage", -- Added user image field
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
      -- Removed status filtering to show ALL reservation statuses for complete admin visibility
    ORDER BY
      -- Prioritize pending reservations that need admin action, then by creation date
      CASE WHEN l.value = 'Pending' THEN 1 ELSE 2 END,
      rr.created_at DESC
    LIMIT $2; -- Use the limit parameter
  `;

  try {
    // Use db.query() for a single query, it handles client acquisition/release
    // Pass both roomId and limit as parameters
    const result = await db.query<RecentReservation>(query, [roomId, limit]);
    // pg library typically returns results in result.rows
    // The aliases in the SELECT statement should make the row objects match the interface
    return result.rows;
  } catch (error) {
    console.error("Error fetching recent reservations:", error);
    // Return an empty array in case of error as requested
    return [];
  }
}

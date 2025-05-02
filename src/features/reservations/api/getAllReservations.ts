import db from "@/lib/db";

export type ReservationWithDetails = {
  id: string;
  userName: string | null;
  roomName: string;
  startTime: Date;
  endTime: Date;
  status: string;
  createdAt: Date; // Added createdAt field
};

/**
 * Fetches all reservations with details from related tables using raw SQL.
 * Orders by room name, then start time.
 */
export async function getAllReservations(filters?: {
  userNameFilter?: string;
  roomId?: number; // Added roomId filter
  statusId?: number; // Added statusId filter
}): Promise<ReservationWithDetails[]> {
  let query = `
    SELECT
      rr.id,
      u.name AS "userName",
      r.name AS "roomName",
      rr.start_time AS "startTime",
      rr.end_time AS "endTime",
      l.value AS status,
      rr.created_at AS "createdAt" -- Added createdAt selection
    FROM room_reservation rr
    JOIN room r ON rr.room_id = r.id
    LEFT JOIN "user" u ON rr.user_id = u.id -- Use LEFT JOIN in case user is deleted
    JOIN lookup l ON rr.status_id = l.id
    WHERE l.category = 'reservation_status' -- Verify 'RESERVATION_STATUS' is correct
  `;
  const params: any[] = [];

  if (filters?.userNameFilter) {
    params.push(filters.userNameFilter);
    query += ` AND u.name ILIKE '%' || $${params.length} || '%'`;
  }

  // Add roomId filter if provided
  if (filters?.roomId) {
    params.push(filters.roomId);
    query += ` AND rr.room_id = $${params.length}`;
  }

  // Add statusId filter if provided
  if (filters?.statusId) {
    params.push(filters.statusId);
    query += ` AND rr.status_id = $${params.length}`;
  }

  query += `
    ORDER BY
      r.name ASC,
      rr.start_time ASC;
  `;

  try {
    // Pass the type argument and params to db.query for type safety
    const result = await db.query<ReservationWithDetails>(query, params);
    // pg returns rows directly in the desired structure if aliases match the type
    return result.rows;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    // Depending on requirements, you might throw the error or return an empty array
    // throw new Error("Failed to fetch reservations.");
    return [];
  }
}

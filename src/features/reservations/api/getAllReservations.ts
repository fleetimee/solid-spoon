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

// Define a mapping from sortBy keys to database column expressions
const sortColumnMap: Record<string, string> = {
  userName: "u.name",
  roomName: "r.name",
  startTime: "rr.start_time",
  status: "l.value",
  createdAt: "rr.created_at",
};

/**
 * Fetches all reservations with details from related tables using raw SQL.
 * Orders by specified column or defaults to room name, then start time.
 */
export async function getAllReservations(
  filters?: {
    search?: string; // Generic search for user name or reservation ID
    roomId?: number; // Added roomId filter
    statusId?: number; // Added statusId filter
  },
  sorting?: {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }
): Promise<ReservationWithDetails[]> {
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

  // Add generic search filter if provided (user name or reservation ID)
  if (filters?.search) {
    params.push(filters.search);
    const searchParamIndex = params.length;
    // Cast rr.id to text for ILIKE comparison
    query += ` AND (u.name ILIKE '%' || $${searchParamIndex} || '%' OR rr.id::text ILIKE '%' || $${searchParamIndex} || '%')`;
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

  // Add sorting
  const sortBy = sorting?.sortBy;
  const sortOrder = sorting?.sortOrder === "desc" ? "DESC" : "ASC"; // Default to ASC
  const sortColumn =
    sortBy && sortColumnMap[sortBy] ? sortColumnMap[sortBy] : null;

  if (sortColumn) {
    // Use the mapped column name directly - safe due to the mapping check
    query += ` ORDER BY ${sortColumn} ${sortOrder}`;
    // Add secondary sort for stability if not sorting by start time already
    if (sortBy !== "startTime") {
      query += `, rr.start_time ASC`;
    }
  } else {
    // Default sort order
    query += ` ORDER BY r.name ASC, rr.start_time ASC`;
  }

  query += `;`; // Add semicolon at the end

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

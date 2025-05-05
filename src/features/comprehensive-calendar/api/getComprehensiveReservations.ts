import db from "@/lib/db"; // Use default export
import { auth } from "@/lib/auth"; // Assuming auth setup for session/user info

// Removed unused ReservationStatus type definition

interface GetComprehensiveReservationsParams {
  startDate: Date;
  endDate: Date;
  roomIds?: number[]; // Changed to number[] to match schema (room.id is int)
  statuses?: string[]; // Use string array for status codes from lookup table
}

// Define a suitable return type matching query columns
// Consider adding timezone information if relevant
export type ComprehensiveReservation = {
  id: string; // Assuming reservation ID is text/uuid, adjust if needed
  start_time: Date;
  end_time: Date;
  status: string; // Status code from lookup table
  title: string | null; // Changed from purpose
  room_id: number; // Changed to number (room.id is int)
  room_name: string;
  user_id: string; // user.id is text
  user_name: string;
};

export async function getComprehensiveReservations(
  params: GetComprehensiveReservationsParams
): Promise<ComprehensiveReservation[]> {
  // NOTE: Authorization should be checked *before* calling this function,
  // typically in the Server Component (page.tsx) that invokes it,
  // using request context (e.g., cookies from next/headers) and auth helpers.

  const queryParams: any[] = [params.startDate, params.endDate];
  let sql = `
    SELECT
      r.id::text, -- Explicitly cast id if it's not text/varchar in DB
      r.start_time,
      r.end_time,
      l.code AS status, -- Select status code from lookup table
      r.title, -- Select title instead of purpose
      r.room_id,
      rm.name AS room_name,
      r.user_id,
      u.name AS user_name
    FROM
      room_reservation r -- Changed table name
    JOIN
      room rm ON r.room_id = rm.id -- Changed table name
    JOIN
      "user" u ON r.user_id = u.id -- Changed table name (quoted)
    JOIN
      lookup l ON r.status_id = l.id -- Added join for lookup table
    WHERE
      -- Check for reservations overlapping the date range
      r.start_time < $2 AND r.end_time > $1
  `;

  let paramIndex = 3; // Start parameter index after startDate and endDate

  // Add filtering conditions dynamically and safely
  if (params.roomIds && params.roomIds.length > 0) {
    sql += ` AND r.room_id = ANY($${paramIndex}::integer[])`; // Changed cast to integer[]
    queryParams.push(params.roomIds);
    paramIndex++;
  }

  if (params.statuses && params.statuses.length > 0) {
    sql += ` AND l.code = ANY($${paramIndex}::text[])`; // Filter by lookup code
    queryParams.push(params.statuses);
    paramIndex++;
  }

  // Add any other necessary conditions (e.g., filtering out cancelled?)

  sql += ` ORDER BY r.start_time ASC;`;

  try {
    // Use parameterized queries to prevent SQL injection
    const result = await db.query<ComprehensiveReservation>(sql, queryParams);
    // TODO: Potentially map snake_case results to camelCase if frontend prefers it
    return result.rows;
  } catch (error) {
    console.error("Error fetching comprehensive reservations:", error);
    // Rethrow or return empty array based on how errors should be handled upstream
    throw new Error("Failed to fetch reservations.");
  }
}

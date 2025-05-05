import db from "@/lib/db"; // Use default export (pg Pool)
// Assuming auth setup for session/user info is handled elsewhere
// import { auth } from "@/lib/auth";

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
  // typically in the Server Component (page.tsx) or middleware.

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
      -- Ensure we only join/filter lookups with the correct category
      AND l.category = 'reservation_status'
  `;

  let paramIndex = 3; // Start parameter index after startDate and endDate

  // Add filtering conditions dynamically and safely
  if (params.roomIds && params.roomIds.length > 0) {
    sql += ` AND r.room_id = ANY($${paramIndex}::integer[])`; // Changed cast to integer[]
    queryParams.push(params.roomIds);
    paramIndex++;
  }

  console.log("Checking params.statuses:", params.statuses);
  if (params.statuses && params.statuses.length > 0) {
    // Filter by lookup code using the joined table
    // Use IN operator for status filtering with parameterized array
    sql += ` AND l.code = ANY($${paramIndex}::text[])`; // Use = ANY() for array parameter check
    queryParams.push(params.statuses);
    paramIndex++;
  }

  // Add any other necessary conditions (e.g., filtering out cancelled?)

  sql += ` ORDER BY r.start_time ASC;`;

  try {
    // Helper function to format parameters for logging purposes ONLY
    const formatParamForLog = (param: any): string => {
      if (param === null || typeof param === "undefined") {
        return "NULL";
      }
      if (typeof param === "number") {
        return String(param); // Numbers as is
      }
      if (param instanceof Date) {
        return `'${param.toISOString()}'`; // Quoted ISO string for dates
      }
      if (Array.isArray(param)) {
        // Simple JSON stringify for arrays, quoted, escaping internal quotes
        return `'${JSON.stringify(param).replace(/'/g, "''")}'`;
      }
      // Default to string, escape single quotes and wrap in single quotes
      return `'${String(param).replace(/'/g, "''")}'`;
    };

    // Create a version of the query with placeholders replaced for logging
    let loggedQuery = sql;
    queryParams.forEach((param, index) => {
      // Use regex to replace $N placeholders globally and ensure whole word match (\b)
      const placeholderRegex = new RegExp(`\\$${index + 1}\\b`, "g");
      loggedQuery = loggedQuery.replace(
        placeholderRegex,
        formatParamForLog(param)
      );
    });

    console.log("Executing Query (interpolated for logging):\n", loggedQuery); // Log interpolated query

    // Use ORIGINAL parameterized query for actual execution to prevent SQL injection
    const result = await db.query<ComprehensiveReservation>(sql, queryParams);
    // pg returns results in result.rows
    return result.rows;
  } catch (error) {
    console.error("Error fetching comprehensive reservations:", error);
    // Rethrow or return empty array based on how errors should be handled upstream
    throw new Error("Failed to fetch reservations.");
  }
}

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

const DEFAULT_PAGE_SIZE = 10; // Define default page size

/**
 * Fetches all reservations with details from related tables using raw SQL.
 * Supports filtering, sorting, and pagination.
 */
export async function getAllReservations(
  filters?: {
    search?: string;
    roomId?: number;
    statusId?: number;
  },
  sorting?: {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  },
  pagination?: {
    // Added pagination parameter object
    page?: number;
    pageSize?: number;
  }
): Promise<{ data: ReservationWithDetails[]; totalCount: number }> {
  // Updated return type
  const page = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? DEFAULT_PAGE_SIZE;
  const offset = (page - 1) * pageSize;

  // Base query parts
  let baseQuery = `
    FROM room_reservation rr
    JOIN room r ON rr.room_id = r.id
    LEFT JOIN "user" u ON rr.user_id = u.id
    JOIN lookup l ON rr.status_id = l.id
    WHERE l.category = 'reservation_status'
  `;
  const filterParams: any[] = [];
  let filterConditions = "";

  // Build filter conditions and parameters
  if (filters?.search) {
    filterParams.push(filters.search);
    const searchParamIndex = filterParams.length;
    filterConditions += ` AND (u.name ILIKE '%' || $${searchParamIndex} || '%' OR rr.id::text ILIKE '%' || $${searchParamIndex} || '%')`;
  }
  if (filters?.roomId) {
    filterParams.push(filters.roomId);
    filterConditions += ` AND rr.room_id = $${filterParams.length}`;
  }
  if (filters?.statusId) {
    filterParams.push(filters.statusId);
    filterConditions += ` AND rr.status_id = $${filterParams.length}`;
  }

  // --- Count Query ---
  // Construct count query using base and filters
  const countQuery = `SELECT COUNT(*) as "totalCount" ${baseQuery} ${filterConditions.replace(/^ AND/, " AND")}`; // Remove leading AND if present
  let totalCount = 0;
  try {
    // Execute count query with only filter parameters
    const countResult = await db.query<{ totalCount: string }>(
      countQuery,
      filterParams
    );
    totalCount = parseInt(countResult.rows[0]?.totalCount ?? "0", 10);
  } catch (error) {
    console.error("Error fetching reservation count:", error);
    // Return empty result on count error to prevent further issues
    return { data: [], totalCount: 0 };
  }

  // --- Main Data Query ---
  // Construct data query using base, filters, sorting, and pagination
  let dataQuery = `
    SELECT
      rr.id,
      u.name AS "userName",
      r.name AS "roomName",
      rr.start_time AS "startTime",
      rr.end_time AS "endTime",
      l.value AS status,
      rr.created_at AS "createdAt"
    ${baseQuery}
    ${filterConditions.replace(/^ AND/, " AND")}
  `;

  // Add sorting
  const sortBy = sorting?.sortBy;
  const sortOrder = sorting?.sortOrder === "desc" ? "DESC" : "ASC";
  const sortColumn =
    sortBy && sortColumnMap[sortBy] ? sortColumnMap[sortBy] : null;

  if (sortColumn) {
    dataQuery += ` ORDER BY ${sortColumn} ${sortOrder}`;
    if (sortBy !== "startTime") {
      dataQuery += `, rr.start_time ASC`; // Secondary sort for stability
    }
  } else {
    dataQuery += ` ORDER BY r.name ASC, rr.start_time ASC`; // Default sort
  }

  // Add pagination (LIMIT and OFFSET)
  // Create a new array for data query parameters, starting with filter params
  const dataQueryParams = [...filterParams];
  dataQueryParams.push(pageSize); // Add pageSize for LIMIT
  const limitParamIndex = dataQueryParams.length;
  dataQueryParams.push(offset); // Add offset for OFFSET
  const offsetParamIndex = dataQueryParams.length;
  dataQuery += ` LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}`;

  dataQuery += `;`; // Finalize query

  try {
    // Execute data query with combined parameters
    const result = await db.query<ReservationWithDetails>(
      dataQuery,
      dataQueryParams
    );
    // Return fetched data and the total count
    return { data: result.rows, totalCount };
  } catch (error) {
    console.error("Error fetching reservations:", error);
    // Return empty data and 0 count on data fetch error
    return { data: [], totalCount: 0 };
  }
}

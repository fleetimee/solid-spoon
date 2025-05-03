import db from "@/lib/db"; // Use default import

// Define the structure for the reservation data needed for charts
interface ReservationDataPoint {
  created_at: Date;
  status: string;
}

// Define structure for most active rooms data
interface ActiveRoomDataPoint {
  name: string;
  count: number;
}

// Define the return type for the main function
export interface AdminDashboardStats {
  pendingReservationCount: number;
  totalUserCount: number;
  activeRoomCount: number;
  reservationsLast30Days: ReservationDataPoint[];
  mostActiveRooms: ActiveRoomDataPoint[]; // Added new property
}

// Function to get stats for the admin dashboard
export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  try {
    // Calculate the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0); // Normalize start time

    // --- Existing Queries (Pending Count, User Count, Active Room Count) ---
    const pendingStatusResult = await db.query(
      `SELECT id FROM lookup WHERE category = $1 AND code = $2 LIMIT 1`,
      ["RESERVATION_STATUS", "PENDING"] // Corrected category based on previous feedback
    );
    const pendingStatusId = pendingStatusResult.rows[0]?.id;

    let pendingReservationCount = 0;
    if (pendingStatusId !== undefined) {
      const pendingReservationsResult = await db.query(
        `SELECT COUNT(*) as count FROM room_reservation WHERE status_id = $1`,
        [pendingStatusId]
      );
      pendingReservationCount = parseInt(
        pendingReservationsResult.rows[0]?.count ?? "0",
        10
      );
    } else {
      console.warn("Could not find 'PENDING' status ID in lookup table.");
    }

    const totalUsersResult = await db.query(
      `SELECT COUNT(*) as count FROM "user"`
    );
    const totalUserCount = parseInt(totalUsersResult.rows[0]?.count ?? "0", 10);

    const activeRoomsResult = await db.query(
      `SELECT COUNT(*) as count FROM room WHERE is_active = true`
    );
    const activeRoomCount = parseInt(
      activeRoomsResult.rows[0]?.count ?? "0",
      10
    );

    // --- Fetch reservation data from the last 30 days for charts ---
    const reservationsLast30DaysResult = await db.query(
      `SELECT
         rr.created_at,
         l.value as status
       FROM room_reservation rr
       LEFT JOIN lookup l ON rr.status_id = l.id
       WHERE rr.created_at >= $1
       ORDER BY rr.created_at`,
      [thirtyDaysAgo]
    );

    const reservationsLast30Days: ReservationDataPoint[] =
      reservationsLast30DaysResult.rows.map((row: any) => ({
        created_at: row.created_at,
        status: row.status ?? "Unknown",
      }));

    // --- Fetch Most Active Rooms (Last 30 Days) ---
    const topRoomCount = 5; // Number of top rooms to show
    const mostActiveRoomsResult = await db.query(
      `SELECT
            r.name,
            COUNT(rr.id)::integer as count -- Cast count to integer
         FROM room_reservation rr
         JOIN room r ON rr.room_id = r.id
         WHERE rr.created_at >= $1
         GROUP BY r.name
         ORDER BY count DESC
         LIMIT $2`,
      [thirtyDaysAgo, topRoomCount]
    );

    // Map directly, count is already integer due to cast in SQL
    const mostActiveRooms: ActiveRoomDataPoint[] =
      mostActiveRoomsResult.rows.map((row: any) => ({
        name: row.name,
        count: row.count ?? 0, // Default to 0 if count is null for some reason
      }));

    return {
      pendingReservationCount,
      totalUserCount,
      activeRoomCount,
      reservationsLast30Days,
      mostActiveRooms, // Include in return object
    };
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    // Return default/empty values in case of error
    return {
      pendingReservationCount: 0,
      totalUserCount: 0,
      activeRoomCount: 0,
      reservationsLast30Days: [],
      mostActiveRooms: [], // Default empty array
    };
  }
}

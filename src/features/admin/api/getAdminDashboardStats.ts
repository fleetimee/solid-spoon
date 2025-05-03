import db from "@/lib/db";

interface ReservationDataPoint {
  created_at: Date;
  status: string;
}

interface ActiveRoomDataPoint {
  name: string;
  count: number;
}

interface RoomUtilizationDataPoint {
  name: string;
  utilization: number;
}

export interface AdminDashboardStats {
  pendingReservationCount: number;
  totalUserCount: number;
  activeRoomCount: number;
  reservationsLast30Days: ReservationDataPoint[];
  mostActiveRooms: ActiveRoomDataPoint[];
  roomUtilization: RoomUtilizationDataPoint[];
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    const windowEnd = new Date(now);

    const windowStartMs = thirtyDaysAgo.getTime();
    const windowEndMs = windowEnd.getTime();
    const totalWindowMs = windowEndMs - windowStartMs;

    const pendingStatusResult = await db.query(
      `SELECT id FROM lookup WHERE category = $1 AND code = $2 LIMIT 1`,
      ["reservation_status", "PENDING"]
    );
    const pendingStatusId = pendingStatusResult.rows[0]?.id;

    const approvedStatusResult = await db.query(
      `SELECT id FROM lookup WHERE category = $1 AND code = $2 LIMIT 1`,
      ["reservation_status", "APPROVED"]
    );
    const approvedStatusId = approvedStatusResult.rows[0]?.id;
    if (approvedStatusId === undefined) {
      console.error(
        "CRITICAL: Could not find 'Approved' status ID in lookup table. Utilization calculation skipped."
      );
    }

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

    const reservationsForChartsResult = await db.query(
      `SELECT
         rr.created_at,
         l.value as status
       FROM room_reservation rr
       LEFT JOIN lookup l ON rr.status_id = l.id
       WHERE rr.created_at >= $1 -- Based on creation date for these charts
       ORDER BY rr.created_at`,
      [thirtyDaysAgo]
    );
    const reservationsLast30Days: ReservationDataPoint[] =
      reservationsForChartsResult.rows.map((row: any) => ({
        created_at: row.created_at,
        status: row.status ?? "Unknown",
      }));

    const topRoomCount = 5;
    const mostActiveRoomsResult = await db.query(
      `SELECT
            r.name,
            COUNT(rr.id)::integer as count
         FROM room_reservation rr
         JOIN room r ON rr.room_id = r.id
         WHERE rr.created_at >= $1 -- Based on creation date
         GROUP BY r.name
         ORDER BY count DESC
         LIMIT $2`,
      [thirtyDaysAgo, topRoomCount]
    );
    const mostActiveRooms: ActiveRoomDataPoint[] =
      mostActiveRoomsResult.rows.map((row: any) => ({
        name: row.name,
        count: row.count ?? 0,
      }));

    let roomUtilization: RoomUtilizationDataPoint[] = [];
    if (approvedStatusId !== undefined && totalWindowMs > 0) {
      const activeRoomsListResult = await db.query(
        `SELECT id, name FROM room WHERE is_active = true`
      );
      const activeRoomsList = activeRoomsListResult.rows;

      const approvedReservationsResult = await db.query(
        `SELECT room_id, start_time, end_time
             FROM room_reservation
             WHERE status_id = $1
               AND end_time > $2 -- Ends after window start
               AND start_time < $3 -- Starts before window end
            `,
        [approvedStatusId, thirtyDaysAgo, windowEnd]
      );
      const approvedReservations = approvedReservationsResult.rows;

      roomUtilization = activeRoomsList
        .map((room) => {
          let totalBookedMs = 0;
          const roomReservations = approvedReservations.filter(
            (res) => res.room_id === room.id
          );

          roomReservations.forEach((res) => {
            const resStartMs = new Date(res.start_time).getTime();
            const resEndMs = new Date(res.end_time).getTime();

            const effectiveStartMs = Math.max(resStartMs, windowStartMs);
            const effectiveEndMs = Math.min(resEndMs, windowEndMs);

            if (effectiveEndMs > effectiveStartMs) {
              totalBookedMs += effectiveEndMs - effectiveStartMs;
            }
          });

          const utilizationPercent =
            totalWindowMs > 0 ? (totalBookedMs / totalWindowMs) * 100 : 0;
          return {
            name: room.name,
            utilization: parseFloat(utilizationPercent.toFixed(1)),
          };
        })
        .sort((a, b) => b.utilization - a.utilization);
    }

    return {
      pendingReservationCount,
      totalUserCount,
      activeRoomCount,
      reservationsLast30Days,
      mostActiveRooms,
      roomUtilization,
    };
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    return {
      pendingReservationCount: 0,
      totalUserCount: 0,
      activeRoomCount: 0,
      reservationsLast30Days: [],
      mostActiveRooms: [],
      roomUtilization: [],
    };
  }
}

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

export interface CompletionStats {
  totalCompleted: number;
  completedToday: number;
  completedThisMonth: number;
  completionRate: number;
  averageCompletionTimeHours: number | null;
  completedLast7Days: Array<{ date: string; count: number }>;
}

export interface AdminDashboardStats {
  pendingReservationCount: number;
  totalUserCount: number;
  activeRoomCount: number;
  completionStats: CompletionStats;
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

    // Date calculations for completion stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const windowStartMs = thirtyDaysAgo.getTime();
    const windowEndMs = windowEnd.getTime();
    const totalWindowMs = windowEndMs - windowStartMs;

    // Get all status IDs
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

    const completedStatusResult = await db.query(
      `SELECT id FROM lookup WHERE category = $1 AND code = $2 LIMIT 1`,
      ["reservation_status", "COMPLETED"]
    );
    const completedStatusId = completedStatusResult.rows[0]?.id;

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

    // Calculate completion statistics
    const completionStats: CompletionStats = {
      totalCompleted: 0,
      completedToday: 0,
      completedThisMonth: 0,
      completionRate: 0,
      averageCompletionTimeHours: null,
      completedLast7Days: [],
    };

    if (completedStatusId !== undefined) {
      // Total completed reservations
      const totalCompletedResult = await db.query(
        `SELECT COUNT(*) as count FROM room_reservation WHERE status_id = $1`,
        [completedStatusId]
      );
      completionStats.totalCompleted = parseInt(
        totalCompletedResult.rows[0]?.count ?? "0",
        10
      );

      // Completed today
      const completedTodayResult = await db.query(
        `SELECT COUNT(*) as count FROM room_reservation
         WHERE status_id = $1 AND updated_at >= $2 AND updated_at < $3`,
        [completedStatusId, today, tomorrow]
      );
      completionStats.completedToday = parseInt(
        completedTodayResult.rows[0]?.count ?? "0",
        10
      );

      // Completed this month
      const completedThisMonthResult = await db.query(
        `SELECT COUNT(*) as count FROM room_reservation
         WHERE status_id = $1 AND updated_at >= $2`,
        [completedStatusId, startOfMonth]
      );
      completionStats.completedThisMonth = parseInt(
        completedThisMonthResult.rows[0]?.count ?? "0",
        10
      );

      // Completion rate (completed / total reservations)
      const totalReservationsResult = await db.query(
        `SELECT COUNT(*) as count FROM room_reservation`
      );
      const totalReservations = parseInt(
        totalReservationsResult.rows[0]?.count ?? "0",
        10
      );

      if (totalReservations > 0) {
        completionStats.completionRate = Math.round(
          (completionStats.totalCompleted / totalReservations) * 100
        );
      }

      // Average completion time (from creation to completion)
      const avgCompletionTimeResult = await db.query(
        `SELECT AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) as avg_hours
         FROM room_reservation
         WHERE status_id = $1 AND updated_at IS NOT NULL`,
        [completedStatusId]
      );
      const avgHours = avgCompletionTimeResult.rows[0]?.avg_hours;
      if (avgHours !== null && !isNaN(parseFloat(avgHours))) {
        completionStats.averageCompletionTimeHours =
          Math.round(parseFloat(avgHours) * 10) / 10;
      }

      // Weekly completion data (last 7 days)
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);

      const weeklyCompletionResult = await db.query(
        `SELECT
           DATE(updated_at) as completion_date,
           COUNT(*) as count
         FROM room_reservation
         WHERE status_id = $1 AND updated_at >= $2 AND updated_at < $3
         GROUP BY DATE(updated_at)
         ORDER BY completion_date`,
        [completedStatusId, sevenDaysAgo, tomorrow]
      );

      // Create a map for the last 7 days with 0 counts
      const weeklyDataMap = new Map<string, number>();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toLocaleDateString("id-ID", {
          month: "short",
          day: "numeric",
        });
        weeklyDataMap.set(dateStr, 0);
      }

      // Fill in actual completion counts
      weeklyCompletionResult.rows.forEach((row: any) => {
        const completionDate = new Date(row.completion_date);
        const dateStr = completionDate.toLocaleDateString("id-ID", {
          month: "short",
          day: "numeric",
        });
        if (weeklyDataMap.has(dateStr)) {
          weeklyDataMap.set(dateStr, parseInt(row.count, 10));
        }
      });

      completionStats.completedLast7Days = Array.from(
        weeklyDataMap.entries()
      ).map(([date, count]) => ({ date, count }));
    }

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
      completionStats,
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
      completionStats: {
        totalCompleted: 0,
        completedToday: 0,
        completedThisMonth: 0,
        completionRate: 0,
        averageCompletionTimeHours: null,
        completedLast7Days: [],
      },
      reservationsLast30Days: [],
      mostActiveRooms: [],
      roomUtilization: [],
    };
  }
}

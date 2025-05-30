import db from "@/lib/db";

export interface RoomDetailStats {
  totalReservations: number;
  activeBookings: number;
  utilizationRate: number;
  lastBooked: Date | null;
}

/**
 * Fetches detailed statistics for a specific room
 * @param roomId Room ID to get stats for
 * @returns Room-specific statistics
 */
export async function getRoomDetailStats(
  roomId: number
): Promise<RoomDetailStats> {
  try {
    // Get status IDs from lookup table
    const approvedStatusResult = await db.query(
      `SELECT id FROM lookup WHERE category = $1 AND code = $2 LIMIT 1`,
      ["reservation_status", "APPROVED"]
    );
    const approvedStatusId = approvedStatusResult.rows[0]?.id;

    // Get total reservations for this room (all-time)
    const totalReservationsResult = await db.query(
      `
      SELECT COUNT(*) as total
      FROM room_reservation rr
      WHERE rr.room_id = $1
      ${approvedStatusId ? "AND rr.status_id = $2" : ""}
    `,
      approvedStatusId ? [roomId, approvedStatusId] : [roomId]
    );

    // Get active bookings (current and upcoming approved reservations)
    const activeBookingsResult = await db.query(
      `
      SELECT COUNT(*) as active
      FROM room_reservation rr
      WHERE rr.room_id = $1
      ${approvedStatusId ? "AND rr.status_id = $2" : ""}
      AND rr.end_time > CURRENT_TIMESTAMP
    `,
      approvedStatusId ? [roomId, approvedStatusId] : [roomId]
    );

    // Get utilization rate (percentage of time booked in last 30 days)
    const utilizationResult = await db.query(
      `
      SELECT 
        COALESCE(
          SUM(
            EXTRACT(EPOCH FROM (
              LEAST(rr.end_time, CURRENT_TIMESTAMP) - 
              GREATEST(rr.start_time, CURRENT_DATE - INTERVAL '30 days')
            )) / 3600
          ) / (30 * 24) * 100, 
          0
        ) as utilization_rate
      FROM room_reservation rr
      WHERE rr.room_id = $1
      ${approvedStatusId ? "AND rr.status_id = $2" : ""}
      AND rr.start_time <= CURRENT_TIMESTAMP
      AND rr.end_time >= CURRENT_DATE - INTERVAL '30 days'
    `,
      approvedStatusId ? [roomId, approvedStatusId] : [roomId]
    );

    // Get last booked date (most recent reservation start time)
    const lastBookedResult = await db.query(
      `
      SELECT rr.start_time as last_booked
      FROM room_reservation rr
      WHERE rr.room_id = $1
      ${approvedStatusId ? "AND rr.status_id = $2" : ""}
      ORDER BY rr.start_time DESC
      LIMIT 1
    `,
      approvedStatusId ? [roomId, approvedStatusId] : [roomId]
    );

    const totalReservations = parseInt(
      totalReservationsResult.rows[0]?.total || "0"
    );
    const activeBookings = parseInt(
      activeBookingsResult.rows[0]?.active || "0"
    );
    const utilizationRate = Math.min(
      100,
      Math.max(
        0,
        parseFloat(utilizationResult.rows[0]?.utilization_rate || "0")
      )
    );
    const lastBooked = lastBookedResult.rows[0]?.last_booked || null;

    return {
      totalReservations,
      activeBookings,
      utilizationRate,
      lastBooked,
    };
  } catch (error) {
    console.error("Error fetching room detail stats:", error);
    // Return fallback data in case of error
    return {
      totalReservations: 0,
      activeBookings: 0,
      utilizationRate: 0,
      lastBooked: null,
    };
  }
}

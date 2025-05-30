import db from "@/lib/db";

export interface RoomsStats {
  totalRooms: number;
  availableRooms: number;
  roomsWithActiveReservations: number;
  mostPopularRoom: {
    name: string;
    reservationCount: number;
  } | null;
}

/**
 * Fetches room statistics for the rooms dashboard
 * @returns Room statistics
 */
export async function getRoomsStats(): Promise<RoomsStats> {
  try {
    // Get status IDs from lookup table
    const approvedStatusResult = await db.query(
      `SELECT id FROM lookup WHERE category = $1 AND code = $2 LIMIT 1`,
      ["reservation_status", "APPROVED"]
    );
    const approvedStatusId = approvedStatusResult.rows[0]?.id;

    // Get total rooms count
    const totalRoomsResult = await db.query(`
      SELECT COUNT(*) as total
      FROM room
      WHERE is_active = true
    `);

    // Get available rooms (rooms not currently in use)
    const availableRoomsResult = await db.query(
      `
      SELECT COUNT(*) as available
      FROM room r
      WHERE r.is_active = true
      ${
        approvedStatusId
          ? `AND r.id NOT IN (
        SELECT DISTINCT rr.room_id
        FROM room_reservation rr
        WHERE rr.status_id = $1
        AND CURRENT_TIMESTAMP BETWEEN rr.start_time AND rr.end_time
      )`
          : ""
      }
    `,
      approvedStatusId ? [approvedStatusId] : []
    );

    // Get rooms with active reservations (currently being used)
    const roomsWithActiveReservationsResult = await db.query(
      `
      SELECT COUNT(DISTINCT rr.room_id) as active_count
      FROM room_reservation rr
      WHERE ${approvedStatusId ? "rr.status_id = $1" : "rr.status_id IS NOT NULL"}
      AND CURRENT_TIMESTAMP BETWEEN rr.start_time AND rr.end_time
    `,
      approvedStatusId ? [approvedStatusId] : []
    );

    // Get most popular room (room with most approved reservations in last 30 days)
    const mostPopularRoomResult = await db.query(
      `
      SELECT 
        r.name,
        COUNT(rr.id) as reservation_count
      FROM room r
      INNER JOIN room_reservation rr ON r.id = rr.room_id
      WHERE r.is_active = true
      ${approvedStatusId ? "AND rr.status_id = $1" : "AND rr.status_id IS NOT NULL"}
      AND rr.created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY r.id, r.name
      ORDER BY reservation_count DESC
      LIMIT 1
    `,
      approvedStatusId ? [approvedStatusId] : []
    );

    const totalRooms = parseInt(totalRoomsResult.rows[0]?.total || "0");
    const availableRooms = parseInt(
      availableRoomsResult.rows[0]?.available || "0"
    );
    const roomsWithActiveReservations = parseInt(
      roomsWithActiveReservationsResult.rows[0]?.active_count || "0"
    );

    const mostPopularRoom = mostPopularRoomResult.rows[0]
      ? {
          name: mostPopularRoomResult.rows[0].name,
          reservationCount: parseInt(
            mostPopularRoomResult.rows[0].reservation_count
          ),
        }
      : null;

    return {
      totalRooms,
      availableRooms,
      roomsWithActiveReservations,
      mostPopularRoom,
    };
  } catch (error) {
    console.error("Error fetching rooms stats:", error);
    // Return fallback data in case of error
    return {
      totalRooms: 0,
      availableRooms: 0,
      roomsWithActiveReservations: 0,
      mostPopularRoom: null,
    };
  }
}

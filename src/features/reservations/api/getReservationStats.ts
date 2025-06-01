import db from "@/lib/db";

export interface ReservationStats {
  totalReservations: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

/**
 * Fetches reservation statistics by counting reservations per status
 */
export async function getReservationStats(): Promise<ReservationStats> {
  try {
    // Query to get counts by status
    const query = `
      SELECT 
        COUNT(*) as total_reservations,
        COUNT(CASE WHEN l.value = 'Pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN l.value = 'Approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN l.value IN ('Rejected', 'Cancelled') THEN 1 END) as rejected_count
      FROM room_reservation rr
      JOIN lookup l ON rr.status_id = l.id
      WHERE l.category = 'reservation_status'
    `;

    const result = await db.query(query);
    const row = result.rows[0];

    return {
      totalReservations: parseInt(row?.total_reservations || "0", 10),
      pendingCount: parseInt(row?.pending_count || "0", 10),
      approvedCount: parseInt(row?.approved_count || "0", 10),
      rejectedCount: parseInt(row?.rejected_count || "0", 10),
    };
  } catch (error) {
    console.error("Error fetching reservation stats:", error);
    // Return zeros on error
    return {
      totalReservations: 0,
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
    };
  }
}

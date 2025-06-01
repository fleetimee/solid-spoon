import db from "@/lib/db";

// Define a type for the detailed reservation data returned by the function
export type DetailedReservation = {
  id: string;
  title: string | null;
  description: string | null;
  userId: string | null; // Added userId
  userName: string | null;
  userEmail: string | null; // Added userEmail
  userImage: string | null; // Added userImage
  roomId: number; // Added roomId
  roomName: string;
  roomSlug: string; // Added roomSlug
  startTime: Date;
  endTime: Date;
  statusId: number; // Added statusId
  status: string;
  statusColor: string | null; // Added statusColor (from lookup)
  createdAt: Date;
  approverId: string | null; // Added approverId
  approverName: string | null;
  approvedAt: Date | null;
  rejectionReason: string | null;
};

/**
 * Fetches a single reservation by its ID using a raw SQL query,
 * including related user, room, status, and approver details.
 *
 * @param id - The ID of the reservation to fetch.
 * @returns A promise that resolves to the detailed reservation object or null if not found or on error.
 */
export async function getReservationById(
  id: string
): Promise<DetailedReservation | null> {
  if (!id) {
    return null;
  }

  const query = `
    SELECT
      rr.id,
      rr.title,
      rr.description,
      rr.user_id AS "userId",
      u.name AS "userName",
      u.email AS "userEmail",
      u.image AS "userImage",
      rr.room_id AS "roomId",
      r.name AS "roomName",
      r.slug AS "roomSlug",
      rr.start_time AS "startTime",
      rr.end_time AS "endTime",
      rr.status_id AS "statusId",
      l.value AS status,
      rr.created_at AS "createdAt",
      rr.approver_id AS "approverId",
      approver_user.name AS "approverName",
      rr.approved_at AS "approvedAt",
      rr.rejection_reason AS "rejectionReason"
    FROM room_reservation rr
    JOIN room r ON rr.room_id = r.id
    LEFT JOIN "user" u ON rr.user_id = u.id
    LEFT JOIN "user" approver_user ON rr.approver_id = approver_user.id
    JOIN lookup l ON rr.status_id = l.id AND l.category = 'reservation_status'
    WHERE rr.id = $1;
  `;

  try {
    const result = await db.query<DetailedReservation>(query, [id]);

    if (result.rows.length === 0) {
      return null; // Reservation not found
    }

    return result.rows[0]; // Return the found reservation
  } catch (error) {
    console.error(`Failed to fetch reservation by ID (${id}):`, error);
    return null; // Return null on error
  }
}

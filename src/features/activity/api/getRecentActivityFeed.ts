import db from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

type ActivityFeedItem = {
  id: string;
  type:
    | "user_registered"
    | "room_created"
    | "reservation_created"
    | "reservation_updated";
  timestamp: Date;
  message: string;
  details: Record<string, any>; // Store additional relevant data if needed
};

const FEED_LIMIT = 5;

export async function getRecentActivityFeed(): Promise<ActivityFeedItem[]> {
  noStore(); // Ensure data is fetched dynamically

  try {
    // Note: Using raw SQL for UNION ALL. Consider an ORM like Prisma if complexity grows.
    // We need to cast timestamps/dates to a common type (TEXT here for simplicity in UNION)
    // and ensure consistent column names (id, type, timestamp_sort, message_detail).
    // We also add specific details for constructing the final message in the component.
    const query = `
      WITH RecentActivity AS (
        -- New User Registrations
        SELECT
          u.id AS item_id,
          'user_registered' AS type,
          u."createdAt" AS timestamp_sort,
          u.name AS detail1, -- User name
          NULL AS detail2,
          NULL AS detail3,
          NULL AS detail4
        FROM "user" u

        UNION ALL

        -- New Room Creations
        SELECT
          r.id::text AS item_id, -- Cast room ID to text
          'room_created' AS type,
          r.created_at AS timestamp_sort,
          r.name AS detail1, -- Room name
          NULL AS detail2,
          NULL AS detail3,
          NULL AS detail4
        FROM room r

        UNION ALL

        -- New Reservations
        SELECT
          rr.id::text AS item_id, -- Cast reservation ID to text
          'reservation_created' AS type,
          rr.created_at AS timestamp_sort,
          u.name AS detail1, -- User name
          r.name AS detail2, -- Room name
          rr.title AS detail3, -- Reservation title
          NULL AS detail4
        FROM room_reservation rr
        JOIN "user" u ON rr.user_id = u.id
        JOIN room r ON rr.room_id = r.id
        WHERE rr.created_at = rr.updated_at -- Only truly new reservations

        UNION ALL

        -- Updated Reservations (Approved, Rejected, Cancelled etc.)
        SELECT
          rr.id::text AS item_id, -- Cast reservation ID to text
          'reservation_updated' AS type,
          rr.updated_at AS timestamp_sort,
          u.name AS detail1, -- User name
          r.name AS detail2, -- Room name
          rr.title AS detail3, -- Reservation title
          l.value AS detail4 -- Status value
        FROM room_reservation rr
        JOIN "user" u ON rr.user_id = u.id
        JOIN room r ON rr.room_id = r.id
        JOIN lookup l ON rr.status_id = l.id AND l.category = 'RESERVATION_STATUS'
        WHERE rr.updated_at > rr.created_at -- Only updated reservations
      )
      SELECT
        item_id,
        type,
        timestamp_sort,
        detail1,
        detail2,
        detail3,
        detail4
      FROM RecentActivity
      ORDER BY timestamp_sort DESC
      LIMIT ${FEED_LIMIT};
    `;

    const result = await db.query(query);

    // Type assertion needed because pg Pool.query returns QueryResult<any>
    const rawFeed = result.rows as Array<{
      item_id: string;
      type:
        | "user_registered"
        | "room_created"
        | "reservation_created"
        | "reservation_updated";
      timestamp_sort: Date;
      detail1: string | null;
      detail2: string | null;
      detail3: string | null;
      detail4: string | null;
    }>;

    // Format the raw data into the desired ActivityFeedItem structure
    const formattedFeed: ActivityFeedItem[] = rawFeed.map((item) => {
      let message = "";
      const details: Record<string, any> = {};

      switch (item.type) {
        case "user_registered":
          message = `User '${item.detail1 ?? "Unknown"}' registered.`;
          details.userName = item.detail1;
          break;
        case "room_created":
          message = `Room '${item.detail1 ?? "Unnamed"}' was created.`;
          details.roomName = item.detail1;
          break;
        case "reservation_created":
          message = `Reservation '${item.detail3 ?? "Untitled"}' for room '${item.detail2 ?? "Unknown"}' by user '${item.detail1 ?? "Unknown"}' was created.`;
          details.userName = item.detail1;
          details.roomName = item.detail2;
          details.reservationTitle = item.detail3;
          break;
        case "reservation_updated":
          message = `Reservation '${item.detail3 ?? "Untitled"}' for room '${item.detail2 ?? "Unknown"}' by user '${item.detail1 ?? "Unknown"}' was updated to status '${item.detail4 ?? "Unknown"}'.`;
          details.userName = item.detail1;
          details.roomName = item.detail2;
          details.reservationTitle = item.detail3;
          details.status = item.detail4;
          break;
        default:
          message = "An unknown activity occurred.";
      }

      return {
        id: `${item.type}-${item.item_id}-${item.timestamp_sort.toISOString()}`, // Create a unique ID
        type: item.type,
        timestamp: item.timestamp_sort,
        message: message,
        details: details,
      };
    });

    return formattedFeed;
  } catch (error) {
    console.error("Error fetching recent activity feed:", error);
    return []; // Return empty array on error
  }
}

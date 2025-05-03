import db from "@/lib/db"; // Assuming db utility exists

interface RecentActivity {
  reservation_id: number;
  room_name: string;
  reservation_title: string;
  start_time: Date;
  end_time: Date;
  status: string;
  created_at: Date;
}

interface TotalBookings {
  total_bookings: number;
}

interface FavoriteRoom {
  room_id: number;
  room_name: string;
  room_slug: string;
  booking_count: number;
}

interface ActivityFeedData {
  recentActivity: RecentActivity[];
  totalBookings: number;
  favoriteRooms: FavoriteRoom[];
}

// Fetch recent activity (last 5 bookings)
async function getRecentActivity(userId: string): Promise<RecentActivity[]> {
  const query = `
    SELECT
      rr.id AS reservation_id,
      r.name AS room_name,
      rr.title AS reservation_title,
      rr.start_time,
      rr.end_time,
      l.value AS status,
      rr.created_at
    FROM room_reservation rr
    JOIN room r ON rr.room_id = r.id
    JOIN lookup l ON rr.status_id = l.id AND l.category = 'RESERVATION_STATUS'
    WHERE rr.user_id = $1 -- Using $1 for parameter binding assuming pg or similar
    ORDER BY rr.created_at DESC
    LIMIT 5;
  `;
  // Assuming db.query returns typed results or needs casting
  const result = await db.query<RecentActivity>(query, [userId]);
  return result.rows;
}

// Fetch total number of bookings
async function getTotalBookings(userId: string): Promise<number> {
  const query = `
    SELECT COUNT(*) AS total_bookings
    FROM room_reservation rr
    WHERE rr.user_id = $1; -- Using $1 for parameter binding
  `;
  const result = await db.query<TotalBookings>(query, [userId]);
  // Ensure result.rows[0] exists and has total_bookings
  return result.rows[0]?.total_bookings ?? 0;
}

// Fetch favorite rooms (top 3 most booked)
async function getFavoriteRooms(userId: string): Promise<FavoriteRoom[]> {
  const query = `
    SELECT
      r.id AS room_id,
      r.name AS room_name,
      r.slug AS room_slug,
      COUNT(rr.id) AS booking_count
    FROM room_reservation rr
    JOIN room r ON rr.room_id = r.id
    WHERE rr.user_id = $1 -- Using $1 for parameter binding
    GROUP BY r.id, r.name, r.slug
    ORDER BY booking_count DESC
    LIMIT 3;
  `;
  const result = await db.query<FavoriteRoom>(query, [userId]);
  return result.rows;
}

// Main function to fetch all activity feed data
export async function getActivityFeedData(
  userId: string
): Promise<ActivityFeedData> {
  try {
    const [recentActivity, totalBookingsCount, favoriteRooms] =
      await Promise.all([
        getRecentActivity(userId),
        getTotalBookings(userId),
        getFavoriteRooms(userId),
      ]);

    return {
      recentActivity,
      totalBookings: totalBookingsCount,
      favoriteRooms,
    };
  } catch (error) {
    console.error("Error fetching activity feed data:", error);
    // Re-throw or handle error as appropriate for your application
    throw new Error("Failed to fetch activity feed data.");
  }
}

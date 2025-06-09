import db from "@/lib/db";

export interface UserStatsData {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  newUsersThisMonth: number;
}

export async function getUserStats(): Promise<UserStatsData> {
  try {
    // Calculate the first day of current month for new users filtering
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    // Execute all queries in parallel for better performance
    const [totalResult, activeResult, bannedResult, newUsersResult] =
      await Promise.all([
        // Total users count
        db.query('SELECT COUNT(*) as count FROM "user"'),

        // Active users count (not banned: banned = false OR banned IS NULL)
        db.query(
          'SELECT COUNT(*) as count FROM "user" WHERE banned IS NOT TRUE'
        ),

        // Banned users count (explicitly banned: banned = true)
        db.query('SELECT COUNT(*) as count FROM "user" WHERE banned = true'),

        // New users this month
        db.query(
          'SELECT COUNT(*) as count FROM "user" WHERE "createdAt" >= $1',
          [firstDayOfMonth]
        ),
      ]);

    const totalUsers = parseInt(totalResult.rows[0]?.count || "0");
    const activeUsers = parseInt(activeResult.rows[0]?.count || "0");
    const bannedUsers = parseInt(bannedResult.rows[0]?.count || "0");
    const newUsersThisMonth = parseInt(newUsersResult.rows[0]?.count || "0");

    return {
      totalUsers,
      activeUsers,
      bannedUsers,
      newUsersThisMonth,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      bannedUsers: 0,
      newUsersThisMonth: 0,
    };
  }
}

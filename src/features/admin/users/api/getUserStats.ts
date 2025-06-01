import { authClient } from "@/lib/auth-client";

export interface UserStatsData {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  newUsersThisMonth: number;
}

export async function getUserStats(): Promise<UserStatsData> {
  try {
    // Get total users
    const totalResult = await authClient.admin.listUsers({
      query: { limit: 1, offset: 0 },
    });

    // Get active users (not banned)
    const activeResult = await authClient.admin.listUsers({
      query: {
        limit: 1,
        offset: 0,
        filterField: "banned",
        filterOperator: "eq",
        filterValue: false,
      },
    });

    // Get banned users
    const bannedResult = await authClient.admin.listUsers({
      query: {
        limit: 1,
        offset: 0,
        filterField: "banned",
        filterOperator: "eq",
        filterValue: true,
      },
    });

    // Calculate new users this month
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    // For new users this month, we'll use a simplified approach
    // Since we don't have direct date filtering in the current API,
    // we'll fetch recent users and filter client-side as a fallback
    const recentResult = await authClient.admin.listUsers({
      query: {
        limit: 1000,
        offset: 0,
        sortBy: "createdAt",
        sortDirection: "desc",
      },
    });

    let newUsersThisMonth = 0;
    if (recentResult.data?.users) {
      newUsersThisMonth = recentResult.data.users.filter((user) => {
        const userCreatedAt = new Date(user.createdAt);
        return userCreatedAt >= firstDayOfMonth;
      }).length;
    }

    return {
      totalUsers: totalResult.data?.total || 0,
      activeUsers: activeResult.data?.total || 0,
      bannedUsers: bannedResult.data?.total || 0,
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

import {
  getActivityFeedData,
  type RecentActivity,
} from "@/features/activity/api/getActivityFeedData";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/lib/icons";
import { formatDateToJakarta } from "@/lib/utils/formatDate"; // Correct function and path
import { auth } from "@/lib/auth"; // Import the configured auth object
import { redirect } from "next/navigation";
import { headers } from "next/headers"; // Import headers function
import { FavoriteRoomsChart } from "@/features/activity/components/favorite-rooms-chart";
import { MonthlyBookingsChart } from "@/features/activity/components/monthly-bookings-chart"; // Import the new chart
import { ChartConfig } from "@/components/ui/chart"; // Keep ChartConfig for definition

export default async function ActivityPage() {
  // Get session using the correct method provided
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/auth/login");
  }
  const userId = session.user.id;

  const activityFeedData = await getActivityFeedData(userId);
  const recentActivities = activityFeedData.recentActivity;
  const favoriteRoomsData = activityFeedData.favoriteRooms.map((room) => ({
    name: room.room_name,
    bookings: room.booking_count,
  }));

  const chartConfig = {
    bookings: {
      label: "Bookings",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // --- Process data for Monthly Bookings Chart ---
  const monthlyBookingCounts: { [key: string]: number } = {};
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1); // Start of the month, 12 months ago

  // Initialize counts for the last 12 months
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${monthNames[date.getMonth()]}-${date.getFullYear()}`; // Use year to differentiate
    monthlyBookingCounts[monthKey] = 0;
  }

  recentActivities.forEach((activity) => {
    const createdAt = new Date(activity.created_at);
    // Only include activities from the last 12 months
    if (createdAt >= twelveMonthsAgo) {
      const monthKey = `${monthNames[createdAt.getMonth()]}-${createdAt.getFullYear()}`;
      if (monthlyBookingCounts.hasOwnProperty(monthKey)) {
        // Ensure it's within our 12-month window
        monthlyBookingCounts[monthKey]++;
      }
    }
  });

  // Convert to array and sort chronologically for the chart
  const monthlyChartData = Object.entries(monthlyBookingCounts)
    .map(([monthYear, bookings]) => {
      const [month, year] = monthYear.split("-");
      return {
        month: month, // Just the month name for the axis
        year: parseInt(year),
        monthIndex: monthNames.indexOf(month),
        bookings: bookings,
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.monthIndex - b.monthIndex;
    })
    // Keep only the last 12 entries after sorting
    .slice(-12);

  const monthlyChartConfig = {
    bookings: {
      label: "Monthly Bookings",
      color: "hsl(var(--chart-2))", // Use a different color
    },
  } satisfies ChartConfig;
  // --- End Monthly Bookings Chart Data Processing ---

  return (
    <TabsContent value="activity" className="pt-6">
      <div className="space-y-8">
        {/* Recent Activity Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity: RecentActivity) => (
                <Card key={activity.reservation_id}>
                  <CardContent className="flex items-start space-x-4 py-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Icon name="Calendar" className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {activity.reservation_title}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Booked '{activity.room_name}' from{" "}
                        {formatDateToJakarta(activity.start_time)} to{" "}
                        {formatDateToJakarta(activity.end_time)} (
                        {activity.status})
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      {formatDateToJakarta(activity.created_at)}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">No recent activity.</p>
            )}
          </div>
        </div>

        {/* Usage Statistics & Favorite Rooms Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Usage Statistics Cards */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Usage Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Total Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {activityFeedData.totalBookings}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Top Favorite Room</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-medium">
                    {activityFeedData.favoriteRooms[0]?.room_name ?? "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activityFeedData.favoriteRooms[0]?.booking_count ?? 0}{" "}
                    bookings
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Favorite Rooms Chart */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Favorite Room Bookings
            </h2>
            {favoriteRoomsData.length > 0 ? (
              <FavoriteRoomsChart
                chartData={favoriteRoomsData}
                chartConfig={chartConfig}
              />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    Not enough booking data to show favorite rooms chart.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Monthly Booking Trend Chart Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Monthly Booking Trend</h2>
          <MonthlyBookingsChart
            chartData={monthlyChartData}
            chartConfig={monthlyChartConfig}
          />
        </div>
      </div>
    </TabsContent>
  );
}

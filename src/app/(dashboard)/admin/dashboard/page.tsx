import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  getAdminDashboardStats,
  type AdminDashboardStats,
} from "@/features/admin/api/getAdminDashboardStats";
import { ReservationsTrendChart } from "@/features/admin/components/reservations-trend-chart";
import { AdminReservationStatusChart } from "@/features/admin/components/admin-reservation-status-chart";
import { MostActiveRoomsChart } from "@/features/admin/components/most-active-rooms-chart"; // Import the new chart
import { type ChartConfig } from "@/components/ui/chart";
import { Users, BedDouble, ListChecks } from "lucide-react"; // Icons for cards

// Helper function to format date as 'Month Day' (e.g., 'May 03')
// Ensure consistent time zone if necessary, e.g., using date-fns-tz
function formatShortDate(date: Date): string {
  // Consider potential time zone issues if server/client/db are different
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function AdminDashboardPage() {
  const stats: AdminDashboardStats = await getAdminDashboardStats();

  // --- Process data for Trend Chart (Reservations per Day) ---
  const trendDataMap = new Map<string, number>();
  const today = new Date();
  // Set time to 00:00:00 to avoid partial day issues
  today.setHours(0, 0, 0, 0);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  // Initialize map with 0 counts for the last 30 days (inclusive)
  for (
    let d = new Date(thirtyDaysAgo);
    d <= today;
    d.setDate(d.getDate() + 1)
  ) {
    trendDataMap.set(formatShortDate(new Date(d)), 0);
  }

  // Populate map with actual counts
  stats.reservationsLast30Days.forEach((res) => {
    // Ensure the date from DB is treated correctly (might need timezone conversion)
    const resDate = new Date(res.created_at);
    resDate.setHours(0, 0, 0, 0); // Normalize time part for daily grouping
    const dateStr = formatShortDate(resDate);
    if (trendDataMap.has(dateStr)) {
      trendDataMap.set(dateStr, (trendDataMap.get(dateStr) ?? 0) + 1);
    }
  });

  // Sort data chronologically before passing to chart
  const trendChartData = Array.from(trendDataMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort(
      (a, b) =>
        new Date(a.date + ", " + today.getFullYear()).getTime() -
        new Date(b.date + ", " + today.getFullYear()).getTime()
    ); // Basic sort assuming current year

  const trendChartConfig = {
    count: {
      label: "Reservations",
      color: "hsl(var(--chart-1))", // Use first chart color
    },
  } satisfies ChartConfig;

  // --- Process data for Status Pie Chart ---
  const statusCounts: { [key: string]: number } = {};
  stats.reservationsLast30Days.forEach((res) => {
    const statusKey = res.status ?? "Unknown"; // Handle null/undefined status
    statusCounts[statusKey] = (statusCounts[statusKey] ?? 0) + 1;
  });

  // Define colors for statuses - **REVIEW AND UPDATE THESE** based on your actual statuses and theme
  const statusChartConfig = {
    Approved: { label: "Approved", color: "hsl(var(--chart-2))" }, // Greenish
    Pending: { label: "Pending", color: "hsl(var(--chart-4))" }, // Yellowish
    Rejected: { label: "Rejected", color: "hsl(var(--chart-5))" }, // Reddish
    Cancelled: { label: "Cancelled", color: "hsl(var(--chart-3))" }, // Bluish/Greyish
    Unknown: { label: "Unknown", color: "hsl(var(--muted))" }, // Muted color
    // Add other statuses from your lookup table here, assigning unique --chart-N variables
  } satisfies ChartConfig;

  const statusChartData = Object.entries(statusCounts)
    .map(([status, count]) => {
      // Ensure status exists in config, otherwise use Unknown
      const configEntry =
        statusChartConfig[status as keyof typeof statusChartConfig] ??
        statusChartConfig.Unknown;
      return {
        status,
        count,
        fill: configEntry.color, // Use the raw HSL string directly
      };
    })
    .filter((item) => item.count > 0); // Only include statuses with counts > 0

  // --- Config for Most Active Rooms Chart ---
  const activeRoomsChartConfig = {
    count: {
      label: "Reservations",
      color: "hsl(var(--chart-3))", // Use a different chart color
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reservations
            </CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.pendingReservationCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Reservations awaiting approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUserCount}</div>
            <p className="text-xs text-muted-foreground">
              Total registered users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rooms</CardTitle>
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRoomCount}</div>
            <p className="text-xs text-muted-foreground">
              Rooms currently available for booking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Trend Chart */}
        {trendChartData.length > 0 ? (
          <ReservationsTrendChart
            chartData={trendChartData}
            chartConfig={trendChartConfig}
          />
        ) : (
          <Card className="flex items-center justify-center h-[350px]">
            <p className="text-muted-foreground">
              No reservation data for the last 30 days.
            </p>
          </Card>
        )}

        {/* Status Pie Chart */}
        {statusChartData.length > 0 ? (
          <AdminReservationStatusChart
            chartData={statusChartData}
            chartConfig={statusChartConfig}
          />
        ) : (
          <Card className="flex items-center justify-center h-[350px]">
            <p className="text-muted-foreground">
              No reservation status data for the last 30 days.
            </p>
          </Card>
        )}
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {" "}
        {/* Adjust grid cols as needed */}
        {/* Most Active Rooms Chart */}
        {stats.mostActiveRooms.length > 0 ? (
          <MostActiveRoomsChart
            chartData={stats.mostActiveRooms}
            chartConfig={activeRoomsChartConfig}
          />
        ) : (
          <Card className="flex items-center justify-center h-[350px] lg:col-span-1">
            {" "}
            {/* Adjust span if needed */}
            <p className="text-muted-foreground">
              Not enough data for most active rooms.
            </p>
          </Card>
        )}
        {/* Add another chart here later if desired */}
        {/* <Card className="flex items-center justify-center h-[350px] lg:col-span-1">
             <p className="text-muted-foreground">Placeholder for another chart</p>
         </Card> */}
      </div>
    </div>
  );
}

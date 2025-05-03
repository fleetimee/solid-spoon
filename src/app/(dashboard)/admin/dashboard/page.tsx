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
import { MostActiveRoomsChart } from "@/features/admin/components/most-active-rooms-chart";
import { RoomUtilizationChart } from "@/features/admin/components/room-utilization-chart";
import { type ChartConfig } from "@/components/ui/chart";
import { Users, BedDouble, ListChecks, Plus, Users2 } from "lucide-react"; // Added Plus, Users2
import Link from "next/link"; // Added Link import
import { Button } from "@/components/ui/button"; // Added Button import

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function AdminDashboardPage() {
  const stats: AdminDashboardStats = await getAdminDashboardStats();

  // Placeholder data for Recent Activity
  const recentActivities = [
    {
      id: 1,
      description: "User Jane Doe registered",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      description: "Reservation for Room 101 approved",
      timestamp: "5 hours ago",
    },
    {
      id: 3,
      description: "New Room 'Conference Hall' added",
      timestamp: "1 day ago",
    },
    {
      id: 4,
      description: "User John Smith updated profile",
      timestamp: "2 days ago",
    },
  ];

  const trendDataMap = new Map<string, number>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  for (
    let d = new Date(thirtyDaysAgo);
    d <= today;
    d.setDate(d.getDate() + 1)
  ) {
    trendDataMap.set(formatShortDate(new Date(d)), 0);
  }

  stats.reservationsLast30Days.forEach((res) => {
    const resDate = new Date(res.created_at);
    resDate.setHours(0, 0, 0, 0);
    const dateStr = formatShortDate(resDate);
    if (trendDataMap.has(dateStr)) {
      trendDataMap.set(dateStr, (trendDataMap.get(dateStr) ?? 0) + 1);
    }
  });

  const trendChartData = Array.from(trendDataMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort(
      (a, b) =>
        new Date(a.date + ", " + today.getFullYear()).getTime() -
        new Date(b.date + ", " + today.getFullYear()).getTime()
    );

  const trendChartConfig = {
    count: {
      label: "Reservations",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const statusCounts: { [key: string]: number } = {};
  stats.reservationsLast30Days.forEach((res) => {
    const statusKey = res.status ?? "Unknown";
    statusCounts[statusKey] = (statusCounts[statusKey] ?? 0) + 1;
  });

  const statusChartConfig = {
    Approved: { label: "Approved", color: "hsl(var(--chart-2))" },
    Pending: { label: "Pending", color: "hsl(var(--chart-4))" },
    Rejected: { label: "Rejected", color: "hsl(var(--chart-5))" },
    Cancelled: { label: "Cancelled", color: "hsl(var(--chart-3))" },
    Unknown: { label: "Unknown", color: "hsl(var(--muted))" },
  } satisfies ChartConfig;

  const statusChartData = Object.entries(statusCounts)
    .map(([status, count]) => {
      const configEntry =
        statusChartConfig[status as keyof typeof statusChartConfig] ??
        statusChartConfig.Unknown;
      return {
        status,
        count,
        fill: configEntry.color,
      };
    })
    .filter((item) => item.count > 0);

  const activeRoomsChartConfig = {
    count: {
      label: "Reservations",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const utilizationChartConfig = {
    utilization: {
      label: "Utilization",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
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

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
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

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {stats.mostActiveRooms.length > 0 ? (
          <MostActiveRoomsChart
            chartData={stats.mostActiveRooms}
            chartConfig={activeRoomsChartConfig}
          />
        ) : (
          <Card className="flex items-center justify-center h-[350px]">
            <p className="text-muted-foreground">
              Not enough data for most active rooms.
            </p>
          </Card>
        )}

        {stats.roomUtilization.length > 0 ? (
          <RoomUtilizationChart
            chartData={stats.roomUtilization}
            chartConfig={utilizationChartConfig}
          />
        ) : (
          <Card className="flex items-center justify-center h-[350px]">
            <p className="text-muted-foreground">
              Could not calculate room utilization.
            </p>
          </Card>
        )}
      </div>

      {/* New Sections: Recent Activity and Quick Actions */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Recent Activity Feed Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentActivities.map((activity) => (
                <li
                  key={activity.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{activity.description}</span>
                  <span className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-3">
            <Button asChild variant="outline">
              <Link href="/admin/rooms/reservations">
                <ListChecks className="mr-2 h-4 w-4" /> Manage Pending
                Reservations
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/rooms/add">
                <Plus className="mr-2 h-4 w-4" /> Add New Room
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/users">
                <Users2 className="mr-2 h-4 w-4" /> View All Users
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

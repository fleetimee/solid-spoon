import { Metadata } from "next";
import { getAdminDashboardStats } from "@/features/admin/api/getAdminDashboardStats";
import { getRecentActivityFeed } from "@/features/activity/api/getRecentActivityFeed";
import { type ChartConfig } from "@/components/ui/chart";
import { DashboardHeader } from "@/features/admin/components/dashboard-header";
import { DashboardKPICards } from "@/features/admin/components/dashboard-kpi-cards";
import { DashboardAnalyticsSection } from "@/features/admin/components/dashboard-analytics-section";
import { DashboardActivitySection } from "@/features/admin/components/dashboard-activity-section";

export const metadata: Metadata = {
  title: "Dashboard Admin - Sistem Reservasi Ruangan",
  description:
    "Pantau dan kelola aktivitas sistem reservasi ruangan dengan analitik dan statistik komprehensif",
  openGraph: {
    title: "Dashboard Admin - Sistem Reservasi Ruangan",
    description:
      "Dasbor admin untuk mengelola sistem reservasi ruangan dengan insights dan analytics real-time",
    siteName: "Sistem Reservasi Ruangan",
    type: "website",
    locale: "id_ID",
  },
};

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();
  const activityFeedData = await getRecentActivityFeed();

  // Process trend data
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

  // Process status data
  const statusCounts: { [key: string]: number } = {};
  stats.reservationsLast30Days.forEach((res) => {
    const statusKey = res.status ?? "Unknown";
    statusCounts[statusKey] = (statusCounts[statusKey] ?? 0) + 1;
  });

  const statusChartConfig = {
    Approved: { label: "Disetujui", color: "hsl(var(--chart-2))" },
    Pending: { label: "Menunggu", color: "hsl(var(--chart-4))" },
    Rejected: { label: "Ditolak", color: "hsl(var(--chart-5))" },
    Cancelled: { label: "Dibatalkan", color: "hsl(var(--chart-3))" },
    Completed: { label: "Selesai", color: "hsl(var(--chart-1))" },
    Unknown: { label: "Tidak Diketahui", color: "hsl(var(--muted))" },
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

  // Data is already in the correct format from the API
  const mostActiveRooms = stats.mostActiveRooms;
  const roomUtilization = stats.roomUtilization;

  // Chart configurations
  const trendChartConfig = {
    count: {
      label: "Reservasi",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const activeRoomsChartConfig = {
    count: {
      label: "Reservasi",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const utilizationChartConfig = {
    utilization: {
      label: "Utilisasi",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  // Prepare data for components
  const analyticsData = {
    trendChartData,
    statusChartData,
    mostActiveRooms,
    roomUtilization,
  };

  const analyticsConfigs = {
    trendChartConfig,
    statusChartConfig,
    activeRoomsChartConfig,
    utilizationChartConfig,
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8 min-w-0 overflow-x-hidden">
      <DashboardHeader
        title="Dashboard Admin"
        description="Kelola sistem reservasi ruangan Anda"
      />

      <DashboardKPICards stats={stats} />

      <DashboardAnalyticsSection
        data={analyticsData}
        configs={analyticsConfigs}
      />

      <DashboardActivitySection activityFeedData={activityFeedData} />
    </div>
  );
}

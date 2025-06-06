import {
  getActivityFeedData,
  type RecentActivity,
} from "@/features/activity/api/getActivityFeedData";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/lib/icons";
import { formatDateToJakarta } from "@/lib/utils/formatDate"; // Correct function and path
import { auth } from "@/lib/auth"; // Import the configured auth object
import { redirect } from "next/navigation";
import { headers } from "next/headers"; // Import headers function
import { FavoriteRoomsChart } from "@/features/activity/components/favorite-rooms-chart";
import { MonthlyBookingsChart } from "@/features/activity/components/monthly-bookings-chart"; // Import the new chart
import { ReservationStatusChart } from "@/features/activity/components/reservation-status-chart"; // Import the pie chart
import { ChartConfig } from "@/components/ui/chart"; // Keep ChartConfig for definition
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/features/admin/components/dashboard-header";
import { Activity } from "lucide-react";

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
      label: "Booking",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // Status badge styling helper
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Approved: {
        className:
          "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300",
        icon: "CheckCircle2",
      },
      Pending: {
        className:
          "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300",
        icon: "Clock",
      },
      Rejected: {
        className:
          "bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300",
        icon: "X",
      },
      Cancelled: {
        className:
          "bg-gradient-to-r from-slate-500 to-gray-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300",
        icon: "XCircle",
      },
    };

    return (
      statusConfig[status as keyof typeof statusConfig] || {
        className:
          "bg-gradient-to-r from-slate-500 to-gray-600 text-white border-0",
        icon: "Info",
      }
    );
  };

  // Status translation helper
  const translateStatus = (status: string) => {
    const translations = {
      Approved: "Disetujui",
      Pending: "Menunggu",
      Rejected: "Ditolak",
      Cancelled: "Dibatalkan",
    };
    return translations[status as keyof typeof translations] || status;
  };

  // --- Process data for Monthly Bookings Chart ---
  const monthlyBookingCounts: { [key: string]: number } = {};
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
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
      label: "Booking Bulanan",
      color: "hsl(var(--chart-2))", // Use a different color
    },
  } satisfies ChartConfig;
  // --- End Monthly Bookings Chart Data Processing ---

  // --- Process data for Reservation Status Pie Chart ---
  const statusCounts: { [key: string]: number } = {};
  recentActivities.forEach((activity) => {
    statusCounts[activity.status] = (statusCounts[activity.status] || 0) + 1;
  });

  const statusChartConfig = {
    Approved: { label: "Disetujui", color: "hsl(var(--chart-1))" },
    Pending: { label: "Menunggu", color: "hsl(var(--chart-2))" },
    Rejected: { label: "Ditolak", color: "hsl(var(--chart-3))" },
    Cancelled: { label: "Dibatalkan", color: "hsl(var(--chart-4))" },
    // Add more statuses and colors as needed
  } satisfies ChartConfig;

  const statusData = Object.entries(statusCounts).map(([status, count]) => {
    // Ensure the status exists in the config, provide a fallback if not
    const color =
      statusChartConfig[status as keyof typeof statusChartConfig]?.color ??
      "hsl(var(--muted))"; // Fallback color
    return {
      status,
      count,
      fill: color, // Directly use the HSL color string from the config
    };
  });

  // CSS variable generation is no longer needed here as colors are passed directly
  // --- End Reservation Status Pie Chart Data Processing ---

  return (
    <TabsContent
      value="activity"
      className="pt-6"
      style={
        {
          "--chart-1": "142 76% 36%", // Emerald
          "--chart-2": "43 96% 56%", // Amber
          "--chart-3": "0 84% 60%", // Red
          "--chart-4": "260 90% 50%", // Purple
          // Updated chart colors for better contrast
        } as React.CSSProperties
      }
    >
      <div className="space-y-8">
        {/* Header Section */}
        <DashboardHeader
          title="Aktivitas"
          description="Pantau semua aktivitas booking dan statistik penggunaan ruangan Anda"
          icon={Activity}
        />

        {/* Recent Activity Section with Modern Design */}
        <div className="relative">
          {/* Gradient background decoration */}
          <div className="absolute -inset-1 bg-gradient-to-r from-slate-500/10 to-blue-500/10 rounded-xl blur-sm" />

          <div className="relative backdrop-blur-md bg-white/60 dark:bg-black/30 border border-white/20 rounded-xl p-6 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/10 to-blue-500/10 mr-3">
                <Icon name="Activity" className="h-6 w-6 text-slate-600" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-blue-700 bg-clip-text text-transparent">
                📊 Aktivitas Terkini
              </h2>
            </div>

            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity: RecentActivity, index) => {
                  const statusBadge = getStatusBadge(activity.status);
                  return (
                    <Card
                      key={activity.reservation_id}
                      className={cn(
                        "backdrop-blur-md bg-white/80 dark:bg-black/40 border-white/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group",
                        "animate-in slide-in-from-bottom-4 duration-700"
                      )}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="flex items-start space-x-4 py-6">
                        {/* Modern Icon with Gradient Background */}
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-400/20 to-blue-400/20 rounded-full blur-sm group-hover:blur-none transition-all duration-300" />
                          <div className="relative rounded-full bg-gradient-to-br from-slate-500/10 to-blue-500/10 p-3 backdrop-blur-sm border border-white/20">
                            <Icon
                              name="Calendar"
                              className="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors duration-300"
                            />
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-semibold text-lg text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                              {activity.reservation_title}
                            </div>
                            <Badge className={statusBadge.className}>
                              <Icon
                                name={statusBadge.icon as any}
                                className="w-3 h-3 mr-1"
                              />
                              {translateStatus(activity.status)}
                            </Badge>
                          </div>

                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                            Memesan ruang{" "}
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                              &apos;{activity.room_name}&apos;
                            </span>{" "}
                            dari{" "}
                            <span className="font-medium">
                              {formatDateToJakarta(activity.start_time)}
                            </span>{" "}
                            sampai{" "}
                            <span className="font-medium">
                              {formatDateToJakarta(activity.end_time)}
                            </span>
                          </p>

                          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                            <Icon name="Clock" className="w-3 h-3 mr-1" />
                            {formatDateToJakarta(activity.created_at)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-blue-100 dark:from-slate-800 dark:to-blue-800 flex items-center justify-center">
                    <Icon name="Calendar" className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mb-2">
                    Belum ada aktivitas terkini
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    Aktivitas booking Anda akan muncul di sini 🎯
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Usage Statistics & Favorite Rooms Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Usage Statistics Cards */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 mr-3">
                <Icon name="BarChart3" className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                📈 Statistik Penggunaan
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Total Bookings Card */}
              <Card className="backdrop-blur-md bg-white/80 dark:bg-black/40 border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-lg" />
                <CardHeader className="pb-2 relative">
                  <CardTitle className="text-base flex items-center text-slate-700 dark:text-slate-300">
                    <Icon
                      name="Calendar"
                      className="w-4 h-4 mr-2 text-blue-500"
                    />
                    Total Booking
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {activityFeedData.totalBookings}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">booking selesai</p>
                </CardContent>
              </Card>

              {/* Top Favorite Room Card */}
              <Card className="backdrop-blur-md bg-white/80 dark:bg-black/40 border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-lg" />
                <CardHeader className="pb-2 relative">
                  <CardTitle className="text-base flex items-center text-slate-700 dark:text-slate-300">
                    <Icon
                      name="Star"
                      className="w-4 h-4 mr-2 text-purple-500"
                    />
                    Ruang Favorit Utama
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-1">
                    {activityFeedData.favoriteRooms[0]?.room_name ??
                      "Belum ada"}
                  </div>
                  <p className="text-xs text-slate-500">
                    {activityFeedData.favoriteRooms[0]?.booking_count ?? 0}{" "}
                    booking
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Favorite Rooms Chart */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl blur-sm" />

            <div className="relative backdrop-blur-md bg-white/60 dark:bg-black/30 border border-white/20 rounded-xl p-6 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 mr-3">
                  <Icon name="TrendingUp" className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                  🏆 Booking Ruang Favorit
                </h2>
              </div>

              {favoriteRoomsData.length > 0 ? (
                <FavoriteRoomsChart
                  chartData={favoriteRoomsData}
                  chartConfig={chartConfig}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-800 flex items-center justify-center">
                    <Icon
                      name="BarChart3"
                      className="w-6 h-6 text-purple-400"
                    />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Data booking belum cukup
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    Grafik favorit akan muncul setelah ada lebih banyak booking
                    📊
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Monthly Booking Trend Chart Section */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur-sm" />

          <div className="relative backdrop-blur-md bg-white/60 dark:bg-black/30 border border-white/20 rounded-xl p-6 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 mr-3">
                <Icon name="TrendingUp" className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                📈 Tren Booking Bulanan
              </h2>
            </div>

            <MonthlyBookingsChart
              chartData={monthlyChartData}
              chartConfig={monthlyChartConfig}
            />
          </div>
        </div>

        {/* Enhanced Reservation Status Distribution Chart Section */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl blur-sm" />

          <div className="relative backdrop-blur-md bg-white/60 dark:bg-black/30 border border-white/20 rounded-xl p-6 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 mr-3">
                <Icon name="PieChart" className="h-6 w-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
                🎯 Distribusi Status Reservasi
              </h2>
            </div>

            {statusData.length > 0 ? (
              <ReservationStatusChart
                chartData={statusData}
                chartConfig={statusChartConfig}
                totalReservations={recentActivities.length}
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-800 dark:to-red-800 flex items-center justify-center">
                  <Icon name="PieChart" className="w-8 h-8 text-orange-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mb-2">
                  Belum ada data reservasi
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  Distribusi status akan ditampilkan setelah ada reservasi 🎉
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </TabsContent>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, TrendingUp, Clock } from "lucide-react";
import { format } from "date-fns";
import type { RoomDetailStats } from "../api/getRoomDetailStats";

interface RoomDetailStatsProps {
  stats: RoomDetailStats;
}

export function RoomDetailStats({ stats }: RoomDetailStatsProps) {
  const formatUtilizationRate = (rate: number) => {
    return `${rate.toFixed(1)}%`;
  };

  const getUtilizationColor = (rate: number) => {
    if (rate >= 80) return "text-red-600 dark:text-red-400";
    if (rate >= 60) return "text-yellow-600 dark:text-yellow-400";
    if (rate >= 40) return "text-blue-600 dark:text-blue-400";
    return "text-green-600 dark:text-green-400";
  };

  const statsData = [
    {
      title: "Total Reservations",
      value: stats.totalReservations.toLocaleString(),
      icon: Calendar,
      description: "All-time bookings",
    },
    {
      title: "Active Bookings",
      value: stats.activeBookings.toLocaleString(),
      icon: BookOpen,
      description: "Current & upcoming",
    },
    {
      title: "Utilization Rate",
      value: formatUtilizationRate(stats.utilizationRate),
      icon: TrendingUp,
      description: "Last 30 days",
      valueClassName: getUtilizationColor(stats.utilizationRate),
    },
    {
      title: "Last Booked",
      value: stats.lastBooked
        ? format(new Date(stats.lastBooked), "MMM d, yyyy")
        : "Never",
      icon: Clock,
      description: "Most recent booking",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Room Statistics
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <Card
            key={index}
            className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                <span>{stat.title}</span>
                <stat.icon className="h-4 w-4 text-gray-500" />
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-2">
                <div
                  className={`text-2xl font-bold text-gray-900 dark:text-gray-100 ${stat.valueClassName || ""}`}
                >
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional insights */}
      <div className="flex flex-wrap gap-2 pt-2">
        {stats.utilizationRate >= 80 && (
          <Badge variant="destructive">High Utilization</Badge>
        )}
        {stats.activeBookings > 5 && (
          <Badge variant="default">Popular Room</Badge>
        )}
        {stats.totalReservations === 0 && (
          <Badge variant="secondary">New Room</Badge>
        )}
      </div>
    </div>
  );
}

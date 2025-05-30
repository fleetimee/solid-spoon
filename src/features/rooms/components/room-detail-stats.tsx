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
      type: "total" as const,
    },
    {
      title: "Active Bookings",
      value: stats.activeBookings.toLocaleString(),
      icon: BookOpen,
      description: "Current & upcoming",
      type: "active" as const,
    },
    {
      title: "Utilization Rate",
      value: formatUtilizationRate(stats.utilizationRate),
      icon: TrendingUp,
      description: "Last 30 days",
      type: "utilization" as const,
      valueClassName: getUtilizationColor(stats.utilizationRate),
    },
    {
      title: "Last Booked",
      value: stats.lastBooked
        ? format(new Date(stats.lastBooked), "MMM d, yyyy")
        : "Never",
      icon: Clock,
      description: "Most recent booking",
      type: "recent" as const,
    },
  ];

  const getCardConfig = (
    type: "total" | "active" | "utilization" | "recent"
  ) => {
    switch (type) {
      case "total":
        return {
          bgGradient:
            "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
          hoverGradient: "from-blue-400/10 to-indigo-400/10",
          titleColor: "text-blue-700 dark:text-blue-300",
          iconBg: "from-blue-400 to-indigo-500",
          valueColor: "text-blue-800 dark:text-blue-200",
          descriptionColor: "text-blue-600 dark:text-blue-400",
        };
      case "active":
        return {
          bgGradient:
            "from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
          hoverGradient: "from-emerald-400/10 to-green-400/10",
          titleColor: "text-emerald-700 dark:text-emerald-300",
          iconBg: "from-emerald-400 to-green-500",
          valueColor: "text-emerald-800 dark:text-emerald-200",
          descriptionColor: "text-emerald-600 dark:text-emerald-400",
        };
      case "utilization":
        return {
          bgGradient:
            "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
          hoverGradient: "from-purple-400/10 to-pink-400/10",
          titleColor: "text-purple-700 dark:text-purple-300",
          iconBg: "from-purple-400 to-pink-500",
          valueColor: "text-purple-800 dark:text-purple-200",
          descriptionColor: "text-purple-600 dark:text-purple-400",
        };
      case "recent":
        return {
          bgGradient:
            "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
          hoverGradient: "from-amber-400/10 to-orange-400/10",
          titleColor: "text-amber-700 dark:text-amber-300",
          iconBg: "from-amber-400 to-orange-500",
          valueColor: "text-amber-800 dark:text-amber-200",
          descriptionColor: "text-amber-600 dark:text-amber-400",
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Room Statistics
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => {
          const config = getCardConfig(stat.type);
          const Icon = stat.icon;

          return (
            <Card
              key={index}
              className={`group relative overflow-hidden border-0 bg-gradient-to-br ${config.bgGradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${config.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle
                  className={`text-sm font-medium ${config.titleColor}`}
                >
                  {stat.title}
                </CardTitle>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${config.iconBg} shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div
                  className={`text-3xl font-bold mb-1 ${stat.valueClassName || config.valueColor}`}
                >
                  {stat.value}
                </div>
                <p className={`text-xs ${config.descriptionColor} font-medium`}>
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
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

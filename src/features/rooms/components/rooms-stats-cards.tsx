import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Star,
  Calendar,
} from "lucide-react";
import { RoomsStats } from "@/features/rooms/api/getRoomsStats";

export interface RoomsStatsCardsProps {
  stats: RoomsStats;
}

export function RoomsStatsCards({ stats }: RoomsStatsCardsProps) {
  const kpiCards = [
    {
      title: "Total Ruangan",
      value: stats.totalRooms,
      description: "Ruangan dalam sistem",
      type: "total" as const,
      icon: Building2,
      trendIcon: Calendar,
    },
    {
      title: "Ruangan Tersedia",
      value: stats.availableRooms,
      description: "Siap untuk dipesan",
      type: "available" as const,
      icon: CheckCircle,
      trendIcon: TrendingUp,
    },
    {
      title: "Sedang Digunakan",
      value: stats.roomsWithActiveReservations,
      description: "Reservasi aktif",
      type: "active" as const,
      icon: Clock,
      trendIcon: Users,
    },
    {
      title: "Paling Populer",
      value: stats.mostPopularRoom?.reservationCount || 0,
      description: stats.mostPopularRoom?.name || "Belum ada data",
      type: "popular" as const,
      icon: Star,
      trendIcon: TrendingUp,
    },
  ];

  const getCardConfig = (
    type: "total" | "available" | "active" | "popular"
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
      case "available":
        return {
          bgGradient:
            "from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
          hoverGradient: "from-emerald-400/10 to-green-400/10",
          titleColor: "text-emerald-700 dark:text-emerald-300",
          iconBg: "from-emerald-400 to-green-500",
          valueColor: "text-emerald-800 dark:text-emerald-200",
          descriptionColor: "text-emerald-600 dark:text-emerald-400",
        };
      case "active":
        return {
          bgGradient:
            "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
          hoverGradient: "from-amber-400/10 to-orange-400/10",
          titleColor: "text-amber-700 dark:text-amber-300",
          iconBg: "from-amber-400 to-orange-500",
          valueColor: "text-amber-800 dark:text-amber-200",
          descriptionColor: "text-amber-600 dark:text-amber-400",
        };
      case "popular":
        return {
          bgGradient:
            "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
          hoverGradient: "from-purple-400/10 to-pink-400/10",
          titleColor: "text-purple-700 dark:text-purple-300",
          iconBg: "from-purple-400 to-pink-500",
          valueColor: "text-purple-800 dark:text-purple-200",
          descriptionColor: "text-purple-600 dark:text-purple-400",
        };
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {kpiCards.map((card) => {
        const config = getCardConfig(card.type);
        const Icon = card.icon;
        const TrendIcon = card.trendIcon;

        return (
          <Card
            key={card.type}
            className={`group relative overflow-hidden border-0 bg-gradient-to-br ${config.bgGradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${config.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className={`text-sm font-medium ${config.titleColor}`}>
                {card.title}
              </CardTitle>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${config.iconBg} shadow-md group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className={`text-3xl font-bold ${config.valueColor} mb-1`}>
                {card.value}
              </div>
              <div className="flex items-center gap-2">
                <TrendIcon className={`h-4 w-4 ${config.descriptionColor}`} />
                <p
                  className={`text-xs ${config.descriptionColor} font-medium truncate`}
                >
                  {card.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

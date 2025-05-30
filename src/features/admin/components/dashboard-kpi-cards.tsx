import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BedDouble,
  ListChecks,
  TrendingUp,
  Activity,
  Calendar,
} from "lucide-react";

export interface KPICardData {
  title: string;
  value: number;
  description: string;
  type: "pending" | "users" | "rooms";
}

export interface DashboardKPICardsProps {
  stats: {
    pendingReservationCount: number;
    totalUserCount: number;
    activeRoomCount: number;
  };
}

export function DashboardKPICards({ stats }: DashboardKPICardsProps) {
  const kpiCards: KPICardData[] = [
    {
      title: "Pending Reservations",
      value: stats.pendingReservationCount,
      description: "Reservations awaiting approval",
      type: "pending",
    },
    {
      title: "Total Users",
      value: stats.totalUserCount,
      description: "Total registered users",
      type: "users",
    },
    {
      title: "Active Rooms",
      value: stats.activeRoomCount,
      description: "Available for booking",
      type: "rooms",
    },
  ];

  const getCardConfig = (type: KPICardData["type"]) => {
    switch (type) {
      case "pending":
        return {
          bgGradient:
            "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
          hoverGradient: "from-amber-400/10 to-orange-400/10",
          titleColor: "text-amber-700 dark:text-amber-300",
          iconBg: "from-amber-400 to-orange-500",
          valueColor: "text-amber-800 dark:text-amber-200",
          descriptionColor: "text-amber-600 dark:text-amber-400",
          icon: ListChecks,
          trendIcon: TrendingUp,
        };
      case "users":
        return {
          bgGradient:
            "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
          hoverGradient: "from-blue-400/10 to-indigo-400/10",
          titleColor: "text-blue-700 dark:text-blue-300",
          iconBg: "from-blue-400 to-indigo-500",
          valueColor: "text-blue-800 dark:text-blue-200",
          descriptionColor: "text-blue-600 dark:text-blue-400",
          icon: Users,
          trendIcon: Activity,
        };
      case "rooms":
        return {
          bgGradient:
            "from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
          hoverGradient: "from-emerald-400/10 to-green-400/10",
          titleColor: "text-emerald-700 dark:text-emerald-300",
          iconBg: "from-emerald-400 to-green-500",
          valueColor: "text-emerald-800 dark:text-emerald-200",
          descriptionColor: "text-emerald-600 dark:text-emerald-400",
          icon: BedDouble,
          trendIcon: Calendar,
        };
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {kpiCards.map((card) => {
        const config = getCardConfig(card.type);
        const Icon = config.icon;
        const TrendIcon = config.trendIcon;

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
                <p className={`text-xs ${config.descriptionColor} font-medium`}>
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bell,
  BellRing,
  CheckCircle,
  TrendingUp,
  Activity,
  Eye,
} from "lucide-react";

export interface NotificationStatsData {
  totalNotifications: number;
  unreadCount: number;
  readCount: number;
}

export interface NotificationStatsCardsProps {
  stats: NotificationStatsData;
}

export interface NotificationCardData {
  title: string;
  value: number;
  description: string;
  type: "total" | "unread" | "read";
}

export function NotificationStatsCards({ stats }: NotificationStatsCardsProps) {
  const notificationCards: NotificationCardData[] = [
    {
      title: "Total Notifications",
      value: stats.totalNotifications,
      description: "All system notifications",
      type: "total",
    },
    {
      title: "Unread Count",
      value: stats.unreadCount,
      description: "Notifications requiring attention",
      type: "unread",
    },
    {
      title: "Read Count",
      value: stats.readCount,
      description: "Previously viewed notifications",
      type: "read",
    },
  ];

  const getCardConfig = (type: NotificationCardData["type"]) => {
    switch (type) {
      case "total":
        return {
          bgGradient:
            "from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20",
          hoverGradient: "from-violet-400/10 to-purple-400/10",
          titleColor: "text-violet-700 dark:text-violet-300",
          iconBg: "from-violet-400 to-purple-500",
          valueColor: "text-violet-800 dark:text-violet-200",
          descriptionColor: "text-violet-600 dark:text-violet-400",
          icon: Bell,
          trendIcon: TrendingUp,
        };
      case "unread":
        return {
          bgGradient:
            "from-purple-50 to-fuchsia-50 dark:from-purple-950/20 dark:to-fuchsia-950/20",
          hoverGradient: "from-purple-400/10 to-fuchsia-400/10",
          titleColor: "text-purple-700 dark:text-purple-300",
          iconBg: "from-purple-400 to-fuchsia-500",
          valueColor: "text-purple-800 dark:text-purple-200",
          descriptionColor: "text-purple-600 dark:text-purple-400",
          icon: BellRing,
          trendIcon: Activity,
        };
      case "read":
        return {
          bgGradient:
            "from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20",
          hoverGradient: "from-indigo-400/10 to-violet-400/10",
          titleColor: "text-indigo-700 dark:text-indigo-300",
          iconBg: "from-indigo-400 to-violet-500",
          valueColor: "text-indigo-800 dark:text-indigo-200",
          descriptionColor: "text-indigo-600 dark:text-indigo-400",
          icon: CheckCircle,
          trendIcon: Eye,
        };
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {notificationCards.map((card) => {
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

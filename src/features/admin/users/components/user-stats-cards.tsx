import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  TrendingUp,
  Activity,
  Shield,
  Calendar,
} from "lucide-react";

export interface UserStatsData {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  newUsersThisMonth: number;
}

export interface UserStatsCardsProps {
  stats: UserStatsData;
}

export interface UserCardData {
  title: string;
  value: number;
  description: string;
  type: "total" | "active" | "banned" | "new";
}

export function UserStatsCards({ stats }: UserStatsCardsProps) {
  const userCards: UserCardData[] = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "All registered users",
      type: "total",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      description: "Users with full access",
      type: "active",
    },
    {
      title: "Banned Users",
      value: stats.bannedUsers,
      description: "Users with restricted access",
      type: "banned",
    },
    {
      title: "New This Month",
      value: stats.newUsersThisMonth,
      description: "Recently joined users",
      type: "new",
    },
  ];

  const getCardConfig = (type: UserCardData["type"]) => {
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
          icon: Users,
          trendIcon: TrendingUp,
        };
      case "active":
        return {
          bgGradient:
            "from-purple-50 to-fuchsia-50 dark:from-purple-950/20 dark:to-fuchsia-950/20",
          hoverGradient: "from-purple-400/10 to-fuchsia-400/10",
          titleColor: "text-purple-700 dark:text-purple-300",
          iconBg: "from-purple-400 to-fuchsia-500",
          valueColor: "text-purple-800 dark:text-purple-200",
          descriptionColor: "text-purple-600 dark:text-purple-400",
          icon: UserCheck,
          trendIcon: Activity,
        };
      case "banned":
        return {
          bgGradient:
            "from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20",
          hoverGradient: "from-indigo-400/10 to-violet-400/10",
          titleColor: "text-indigo-700 dark:text-indigo-300",
          iconBg: "from-indigo-400 to-violet-500",
          valueColor: "text-indigo-800 dark:text-indigo-200",
          descriptionColor: "text-indigo-600 dark:text-indigo-400",
          icon: UserX,
          trendIcon: Shield,
        };
      case "new":
        return {
          bgGradient:
            "from-fuchsia-50 to-violet-50 dark:from-fuchsia-950/20 dark:to-violet-950/20",
          hoverGradient: "from-fuchsia-400/10 to-violet-400/10",
          titleColor: "text-fuchsia-700 dark:text-fuchsia-300",
          iconBg: "from-fuchsia-400 to-violet-500",
          valueColor: "text-fuchsia-800 dark:text-fuchsia-200",
          descriptionColor: "text-fuchsia-600 dark:text-fuchsia-400",
          icon: UserPlus,
          trendIcon: Calendar,
        };
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
      {userCards.map((card) => {
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

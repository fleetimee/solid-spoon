import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  Eye,
  AlertCircle,
} from "lucide-react";

export interface ReservationStatsData {
  totalReservations: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface ReservationStatsCardsProps {
  stats: ReservationStatsData;
}

export interface ReservationCardData {
  title: string;
  value: number;
  description: string;
  type: "total" | "pending" | "approved" | "rejected";
}

export function ReservationStatsCards({ stats }: ReservationStatsCardsProps) {
  const reservationCards: ReservationCardData[] = [
    {
      title: "Total Reservasi",
      value: stats.totalReservations,
      description: "Semua reservasi ruangan",
      type: "total",
    },
    {
      title: "Menunggu Persetujuan",
      value: stats.pendingCount,
      description: "Menunggu tinjauan admin",
      type: "pending",
    },
    {
      title: "Disetujui",
      value: stats.approvedCount,
      description: "Reservasi terkonfirmasi",
      type: "approved",
    },
    {
      title: "Ditolak/Dibatalkan",
      value: stats.rejectedCount,
      description: "Ditolak atau dibatalkan",
      type: "rejected",
    },
  ];

  const getCardConfig = (type: ReservationCardData["type"]) => {
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
          icon: Calendar,
          trendIcon: TrendingUp,
        };
      case "pending":
        return {
          bgGradient:
            "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
          hoverGradient: "from-amber-400/10 to-orange-400/10",
          titleColor: "text-amber-700 dark:text-amber-300",
          iconBg: "from-amber-400 to-orange-500",
          valueColor: "text-amber-800 dark:text-amber-200",
          descriptionColor: "text-amber-600 dark:text-amber-400",
          icon: Clock,
          trendIcon: AlertCircle,
        };
      case "approved":
        return {
          bgGradient:
            "from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
          hoverGradient: "from-emerald-400/10 to-green-400/10",
          titleColor: "text-emerald-700 dark:text-emerald-300",
          iconBg: "from-emerald-400 to-green-500",
          valueColor: "text-emerald-800 dark:text-emerald-200",
          descriptionColor: "text-emerald-600 dark:text-emerald-400",
          icon: CheckCircle,
          trendIcon: Eye,
        };
      case "rejected":
        return {
          bgGradient:
            "from-rose-50 to-red-50 dark:from-rose-950/20 dark:to-red-950/20",
          hoverGradient: "from-rose-400/10 to-red-400/10",
          titleColor: "text-rose-700 dark:text-rose-300",
          iconBg: "from-rose-400 to-red-500",
          valueColor: "text-rose-800 dark:text-rose-200",
          descriptionColor: "text-rose-600 dark:text-rose-400",
          icon: XCircle,
          trendIcon: Activity,
        };
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
      {reservationCards.map((card) => {
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

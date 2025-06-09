import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BedDouble,
  ListChecks,
  TrendingUp,
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  Target,
} from "lucide-react";

export interface KPICardData {
  title: string;
  value: number | string;
  description: string;
  type:
    | "pending"
    | "users"
    | "rooms"
    | "completed"
    | "completion-rate"
    | "completed-today";
}

export interface DashboardKPICardsProps {
  stats: {
    pendingReservationCount: number;
    totalUserCount: number;
    activeRoomCount: number;
    completionStats: {
      totalCompleted: number;
      completedToday: number;
      completedThisMonth: number;
      completionRate: number;
      averageCompletionTimeHours: number | null;
    };
  };
}

export function DashboardKPICards({ stats }: DashboardKPICardsProps) {
  const kpiCards: KPICardData[] = [
    {
      title: "Reservasi Menunggu",
      value: stats.pendingReservationCount,
      description: "Reservasi menunggu persetujuan",
      type: "pending",
    },
    {
      title: "Total Pengguna",
      value: stats.totalUserCount,
      description: "Total pengguna terdaftar",
      type: "users",
    },
    {
      title: "Ruangan Aktif",
      value: stats.activeRoomCount,
      description: "Tersedia untuk pemesanan",
      type: "rooms",
    },
    {
      title: "Total Selesai",
      value: stats.completionStats.totalCompleted,
      description: "Total reservasi selesai",
      type: "completed",
    },
    {
      title: "Tingkat Penyelesaian",
      value: `${stats.completionStats.completionRate}%`,
      description: "Persentase reservasi selesai",
      type: "completion-rate",
    },
    {
      title: "Selesai Hari Ini",
      value: stats.completionStats.completedToday,
      description: "Reservasi selesai hari ini",
      type: "completed-today",
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
      case "completed":
        return {
          bgGradient:
            "from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20",
          hoverGradient: "from-green-400/10 to-teal-400/10",
          titleColor: "text-green-700 dark:text-green-300",
          iconBg: "from-green-400 to-teal-500",
          valueColor: "text-green-800 dark:text-green-200",
          descriptionColor: "text-green-600 dark:text-green-400",
          icon: CheckCircle,
          trendIcon: TrendingUp,
        };
      case "completion-rate":
        return {
          bgGradient:
            "from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20",
          hoverGradient: "from-purple-400/10 to-violet-400/10",
          titleColor: "text-purple-700 dark:text-purple-300",
          iconBg: "from-purple-400 to-violet-500",
          valueColor: "text-purple-800 dark:text-purple-200",
          descriptionColor: "text-purple-600 dark:text-purple-400",
          icon: Target,
          trendIcon: Activity,
        };
      case "completed-today":
        return {
          bgGradient:
            "from-cyan-50 to-sky-50 dark:from-cyan-950/20 dark:to-sky-950/20",
          hoverGradient: "from-cyan-400/10 to-sky-400/10",
          titleColor: "text-cyan-700 dark:text-cyan-300",
          iconBg: "from-cyan-400 to-sky-500",
          valueColor: "text-cyan-800 dark:text-cyan-200",
          descriptionColor: "text-cyan-600 dark:text-cyan-400",
          icon: Clock,
          trendIcon: Calendar,
        };
      default:
        return {
          bgGradient:
            "from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20",
          hoverGradient: "from-gray-400/10 to-slate-400/10",
          titleColor: "text-gray-700 dark:text-gray-300",
          iconBg: "from-gray-400 to-slate-500",
          valueColor: "text-gray-800 dark:text-gray-200",
          descriptionColor: "text-gray-600 dark:text-gray-400",
          icon: Activity,
          trendIcon: TrendingUp,
        };
    }
  };

  const renderCard = (card: KPICardData, className?: string) => {
    const config = getCardConfig(card.type);
    const Icon = config.icon;
    const TrendIcon = config.trendIcon;

    // Enhanced styling for featured cards
    const isCompletionRate = card.type === "completion-rate";
    const cardSizeClass = isCompletionRate
      ? "min-h-[160px]"
      : card.type === "completed" || card.type === "completed-today"
        ? "min-h-[140px]"
        : "min-h-[120px]";

    return (
      <Card
        key={card.type}
        className={`group relative overflow-hidden border-0 bg-gradient-to-br ${config.bgGradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${cardSizeClass} ${className || ""}`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${config.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
          <CardTitle
            className={`${isCompletionRate ? "text-base" : "text-sm"} font-medium ${config.titleColor}`}
          >
            {card.title}
          </CardTitle>
          <div
            className={`flex items-center justify-center ${isCompletionRate ? "w-12 h-12" : "w-10 h-10"} rounded-full bg-gradient-to-br ${config.iconBg} shadow-md group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon
              className={`${isCompletionRate ? "h-6 w-6" : "h-5 w-5"} text-white`}
            />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div
            className={`${isCompletionRate ? "text-4xl" : "text-3xl"} font-bold ${config.valueColor} mb-1`}
          >
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
  };

  return (
    <div className="space-y-4">
      {/* Mobile Layout - Stack all cards vertically */}
      <div className="grid gap-4 grid-cols-1 sm:hidden">
        {kpiCards.map((card) => renderCard(card))}
      </div>

      {/* Tablet Layout - 2 columns with strategic placement */}
      <div className="hidden sm:grid lg:hidden gap-4 grid-cols-2">
        {/* Top row - Featured completion stats */}
        {renderCard(
          kpiCards.find((card) => card.type === "completion-rate")!,
          "col-span-2"
        )}

        {/* Second row */}
        {renderCard(kpiCards.find((card) => card.type === "completed")!)}
        {renderCard(kpiCards.find((card) => card.type === "completed-today")!)}

        {/* Third row */}
        {renderCard(kpiCards.find((card) => card.type === "pending")!)}
        {renderCard(kpiCards.find((card) => card.type === "users")!)}

        {/* Fourth row */}
        {renderCard(
          kpiCards.find((card) => card.type === "rooms")!,
          "col-span-2"
        )}
      </div>

      {/* Desktop Bento Grid Layout */}
      <div className="hidden lg:grid gap-4 grid-cols-4 grid-rows-3 auto-rows-fr">
        {/* Completion Rate - Featured card (spans 2x2) */}
        {renderCard(
          kpiCards.find((card) => card.type === "completion-rate")!,
          "col-span-2 row-span-2"
        )}

        {/* Total Completed - Top right */}
        {renderCard(
          kpiCards.find((card) => card.type === "completed")!,
          "col-span-2 row-span-1"
        )}

        {/* Completed Today - Middle right */}
        {renderCard(
          kpiCards.find((card) => card.type === "completed-today")!,
          "col-span-2 row-span-1"
        )}

        {/* Bottom row - Equal sized cards */}
        {renderCard(
          kpiCards.find((card) => card.type === "pending")!,
          "col-span-1 row-span-1"
        )}

        {renderCard(
          kpiCards.find((card) => card.type === "users")!,
          "col-span-1 row-span-1"
        )}

        {renderCard(
          kpiCards.find((card) => card.type === "rooms")!,
          "col-span-2 row-span-1"
        )}
      </div>
    </div>
  );
}

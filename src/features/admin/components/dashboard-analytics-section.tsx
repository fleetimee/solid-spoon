import { Card } from "@/components/ui/card";
import { ReservationsTrendChart } from "@/features/admin/components/reservations-trend-chart";
import { AdminReservationStatusChart } from "@/features/admin/components/admin-reservation-status-chart";
import { MostActiveRoomsChart } from "@/features/admin/components/most-active-rooms-chart";
import { RoomUtilizationChart } from "@/features/admin/components/room-utilization-chart";
import { type ChartConfig } from "@/components/ui/chart";
import { TrendingUp, Activity, BedDouble, Calendar } from "lucide-react";

export interface AnalyticsData {
  trendChartData: Array<{ date: string; count: number }>;
  statusChartData: Array<{ status: string; count: number; fill: string }>;
  mostActiveRooms: Array<{ name: string; count: number }>;
  roomUtilization: Array<{ name: string; utilization: number }>;
}

export interface AnalyticsConfigs {
  trendChartConfig: ChartConfig;
  statusChartConfig: ChartConfig;
  activeRoomsChartConfig: ChartConfig;
  utilizationChartConfig: ChartConfig;
}

export interface DashboardAnalyticsSectionProps {
  data: AnalyticsData;
  configs: AnalyticsConfigs;
}

function EmptyStateCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Card className="flex items-center justify-center h-[350px] border-dashed border-2 hover:border-primary/50 transition-colors duration-300">
      <div className="text-center space-y-2">
        <Icon className="h-12 w-12 text-muted-foreground/50 mx-auto" />
        <p className="text-muted-foreground font-medium">{title}</p>
        <p className="text-xs text-muted-foreground/70">{description}</p>
      </div>
    </Card>
  );
}

export function DashboardAnalyticsSection({
  data,
  configs,
}: DashboardAnalyticsSectionProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
        <h2 className="text-xl font-semibold">Analytics Overview</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {data.trendChartData.length > 0 ? (
          <div className="group">
            <ReservationsTrendChart
              chartData={data.trendChartData}
              chartConfig={configs.trendChartConfig}
            />
          </div>
        ) : (
          <EmptyStateCard
            icon={TrendingUp}
            title="No reservation data for the last 30 days"
            description="Data will appear here once reservations are made"
          />
        )}

        {data.statusChartData.length > 0 ? (
          <div className="group">
            <AdminReservationStatusChart
              chartData={data.statusChartData}
              chartConfig={configs.statusChartConfig}
            />
          </div>
        ) : (
          <EmptyStateCard
            icon={Activity}
            title="No reservation status data available"
            description="Status breakdown will appear here"
          />
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {data.mostActiveRooms.length > 0 ? (
          <div className="group">
            <MostActiveRoomsChart
              chartData={data.mostActiveRooms}
              chartConfig={configs.activeRoomsChartConfig}
            />
          </div>
        ) : (
          <EmptyStateCard
            icon={BedDouble}
            title="Not enough data for room activity"
            description="Room usage statistics will appear here"
          />
        )}

        {data.roomUtilization.length > 0 ? (
          <div className="group">
            <RoomUtilizationChart
              chartData={data.roomUtilization}
              chartConfig={configs.utilizationChartConfig}
            />
          </div>
        ) : (
          <EmptyStateCard
            icon={Calendar}
            title="Unable to calculate room utilization"
            description="Utilization metrics will display here"
          />
        )}
      </div>
    </div>
  );
}

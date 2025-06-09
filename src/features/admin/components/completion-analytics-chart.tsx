"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { CheckCircle, Clock, TrendingUp } from "lucide-react";

interface CompletionAnalyticsData {
  totalCompleted: number;
  completedToday: number;
  completedThisMonth: number;
  completionRate: number;
  averageCompletionTimeHours: number | null;
  completedLast7Days: Array<{ date: string; count: number }>;
}

interface CompletionAnalyticsChartProps {
  data: CompletionAnalyticsData;
}

const chartConfig = {
  count: {
    label: "Reservasi Selesai",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function CompletionAnalyticsChart({
  data,
}: CompletionAnalyticsChartProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Completion Trends Chart */}
      <Card className="col-span-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <CardTitle>Tren Penyelesaian (7 Hari Terakhir)</CardTitle>
          </div>
          <CardDescription>
            Grafik penyelesaian reservasi harian dalam seminggu terakhir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <BarChart data={data.completedLast7Days}>
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                className="text-xs"
                allowDecimals={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Completion Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle>Ringkasan Penyelesaian</CardTitle>
          </div>
          <CardDescription>Statistik penyelesaian reservasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Bulan Ini</span>
              <span className="font-semibold text-green-600">
                {data.completedThisMonth}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Hari Ini</span>
              <span className="font-semibold text-green-600">
                {data.completedToday}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Tingkat Penyelesaian
              </span>
              <span className="font-semibold text-green-600">
                {data.completionRate}%
              </span>
            </div>
          </div>

          {data.averageCompletionTimeHours !== null && (
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">
                  Rata-rata Waktu Penyelesaian
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {data.averageCompletionTimeHours.toFixed(1)} jam
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

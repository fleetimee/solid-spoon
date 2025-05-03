"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface MonthlyBookingsChartProps {
  chartData: Array<{ month: string; bookings: number }>;
  chartConfig: ChartConfig;
}

export function MonthlyBookingsChart({
  chartData,
  chartConfig,
}: MonthlyBookingsChartProps) {
  // Ensure chartData is not empty before rendering
  if (!chartData || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Booking Trend</CardTitle>
          <CardDescription>
            No booking data available for the selected period.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            No data to display.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Booking Trend</CardTitle>
        <CardDescription>
          Showing booking counts for the last few months.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)} // Abbreviate month names
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false} // Ensure whole numbers for counts
              domain={["auto", "auto"]} // Adjust domain automatically
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="bookings"
              type="monotone"
              stroke={`var(--color-${Object.keys(chartConfig)[0]})`} // Use color from config dynamically
              strokeWidth={2}
              dot={{
                fill: `var(--color-${Object.keys(chartConfig)[0]})`,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Recent booking activity trend <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Data based on your recent activity.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

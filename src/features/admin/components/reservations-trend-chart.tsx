"use client";

import React from "react"; // Import React for useMemo
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

interface ReservationsTrendChartProps {
  chartData: Array<{ date: string; count: number }>; // Expecting data like [{ date: "May 01", count: 10 }, ...]
  chartConfig: ChartConfig;
}

export function ReservationsTrendChart({
  chartData,
  chartConfig,
}: ReservationsTrendChartProps) {
  // Calculate total reservations from the chart data for display
  const totalReservations = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservations - Last 30 Days</CardTitle>
        <CardDescription>
          Showing total reservations created per day over the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[250px] w-full min-w-0"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // tickFormatter={(value) => value.slice(0, 3)} // Example if date format needs shortening
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false} // Ensure whole numbers for counts
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" nameKey="count" />} // Use nameKey if dataKey is different
            />
            <Line
              dataKey="count" // This should match the key in chartData
              type="monotone"
              stroke="var(--color-count)" // Assumes 'count' is defined in chartConfig and maps to a color variable
              strokeWidth={2}
              dot={false} // Optionally hide dots on the line
              name="Reservations" // Name shown in tooltip
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Total reservations in this period: {totalReservations}
              <TrendingUp className="h-4 w-4" /> {/* Example icon */}
            </div>
            {/* <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Example footer text
            </div> */}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

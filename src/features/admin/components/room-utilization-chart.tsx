"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Label } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface RoomUtilizationChartProps {
  chartData: Array<{ name: string; utilization: number }>; // Expecting data like [{ name: "Room A", utilization: 75.5 }, ...]
  chartConfig: ChartConfig;
}

export function RoomUtilizationChart({
  chartData,
  chartConfig,
}: RoomUtilizationChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Room Utilization - Last 30 Days</CardTitle>
        <CardDescription>
          Percentage of time each active room was booked (Approved reservations,
          24/7 availability).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 10, right: 50 }} // Increased right margin for label
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              width={100} // Adjust if room names are longer
              // tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
            />
            <XAxis
              dataKey="utilization"
              type="number"
              axisLine={false}
              tickLine={false}
              tickMargin={5}
              domain={[0, 100]} // Utilization is a percentage 0-100
              tickFormatter={(value) => `${value}%`} // Add '%' suffix
            >
              {/* Add Axis Label */}
              <Label
                value="Utilization (%)"
                offset={-5}
                position="insideBottomRight"
              />
            </XAxis>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  nameKey="name"
                  formatter={(value) => `${value}%`}
                />
              } // Add % to tooltip
            />
            <Bar
              dataKey="utilization"
              layout="vertical"
              fill="var(--color-utilization)" // Assumes 'utilization' is defined in chartConfig
              radius={4}
              name="Utilization" // Name shown in tooltip
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

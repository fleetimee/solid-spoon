"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface FavoriteRoomsChartProps {
  chartData: { name: string; bookings: number }[];
  chartConfig: ChartConfig;
}

export function FavoriteRoomsChart({
  chartData,
  chartConfig,
}: FavoriteRoomsChartProps) {
  // Chart JSX will be moved here in the next step
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          // tickFormatter={(value) => value.slice(0, 3)} // Example formatter if needed
        />
        <YAxis />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar dataKey="bookings" fill="var(--color-bookings)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

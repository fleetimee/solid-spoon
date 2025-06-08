"use client";

import * as React from "react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter, // Added CardFooter import
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

interface AdminReservationStatusChartProps {
  // Expecting data like [{ status: "Approved", count: 10, fill: "var(--color-approved)" }, ...]
  chartData: Array<{ status: string; count: number; fill: string }>;
  chartConfig: ChartConfig;
}

export function AdminReservationStatusChart({
  chartData,
  chartConfig,
}: AdminReservationStatusChartProps) {
  const totalCount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col h-full">
      {" "}
      {/* Added h-full for consistent height */}
      <CardHeader className="items-center pb-0">
        <CardTitle>Status Reservasi - 30 Hari Terakhir</CardTitle>
        <CardDescription>
          Distribusi status reservasi dalam 30 hari terakhir.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] min-w-0" // Add min-w-0 for mobile overflow prevention
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="status" />} // Show status name in tooltip
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status" // Key for the name displayed in legend/tooltip
              innerRadius={50} // Adjusted inner radius
              outerRadius={80} // Added outer radius for better definition
              strokeWidth={2} // Reduced stroke width
              labelLine={false} // Hide connector lines for labels if labels are off
              // label={({ percent }) => `${(percent * 100).toFixed(0)}%`} // Optional: Add percentage labels
            >
              {/*
                The 'fill' prop is implicitly taken from the 'fill' property
                of each object in the chartData array. No need for explicit <Cell>.
              */}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />} // Use status for legend items
              className="-translate-y-1 flex-wrap gap-1 [&>*]:basis-1/3 [&>*]:justify-center" // Adjusted layout
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-1 text-sm pt-4">
        {" "}
        {/* Added padding top */}
        <div className="leading-none text-muted-foreground">
          Total reservasi: {totalCount}
        </div>
      </CardFooter>
    </Card>
  );
}

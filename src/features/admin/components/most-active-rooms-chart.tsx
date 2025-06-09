"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

interface MostActiveRoomsChartProps {
  chartData: Array<{ name: string; count: number }>; // Expecting data like [{ name: "Room A", count: 25 }, ...]
  chartConfig: ChartConfig;
}

export function MostActiveRoomsChart({
  chartData,
  chartConfig,
}: MostActiveRoomsChartProps) {
  return (
    <Card className="h-full">
      {" "}
      {/* Added h-full for consistent height */}
      <CardHeader>
        <CardTitle>Ruangan Paling Aktif - 30 Hari Terakhir</CardTitle>
        <CardDescription>
          Ruangan teratas berdasarkan jumlah reservasi dalam 30 hari terakhir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[250px] w-full min-w-0"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical" // Use vertical layout for better label readability
            margin={{ left: 10, right: 30 }} // Adjust margins for vertical layout, more right padding
          >
            <CartesianGrid horizontal={false} />{" "}
            {/* Hide horizontal grid lines */}
            <YAxis
              dataKey="name"
              type="category" // YAxis is category for vertical layout
              tickLine={false}
              tickMargin={5} // Reduced margin
              axisLine={false}
              width={80} // Reduced width for mobile compatibility
              tickFormatter={(value) =>
                value.length > 12 ? `${value.substring(0, 12)}...` : value
              }
            />
            <XAxis
              dataKey="count"
              type="number" // XAxis is number for vertical layout
              hide={false} // Show XAxis labels (counts)
              axisLine={false}
              tickLine={false}
              tickMargin={5}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="name" />} // Show room name in tooltip
            />
            <Bar
              dataKey="count"
              layout="vertical" // Specify layout for Bar
              fill="var(--color-count)" // Assumes 'count' is defined in chartConfig
              radius={4}
              name="Reservasi" // Name shown in tooltip
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* Optional Footer */}
    </Card>
  );
}

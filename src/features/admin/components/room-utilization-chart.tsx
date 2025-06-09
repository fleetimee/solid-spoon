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
  // Optional: Calculate dynamic height based on number of bars
  // Adjust multiplier (35) and base (60) as needed for desired spacing
  const chartHeight = Math.max(250, chartData.length * 35 + 60); // Min height 250px, add space per bar + margins

  return (
    <Card className="flex flex-col">
      {" "}
      {/* Use flex-col to allow content growth */}
      <CardHeader>
        <CardTitle>Utilisasi Ruangan - 30 Hari Terakhir</CardTitle>
        <CardDescription>
          Persentase waktu setiap ruangan aktif dipesan (Reservasi disetujui,
          ketersediaan 24/7).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {" "}
        {/* Allow content to take available space */}
        {/* Removed fixed height from container, using dynamic height on BarChart instead */}
        <ChartContainer
          config={chartConfig}
          className="w-full h-auto min-h-[250px] min-w-0"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            height={chartHeight} // Apply dynamic height here
            margin={{ left: 10, right: 50, top: 5, bottom: 20 }} // Added top/bottom margin
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              width={80} // Reduced width for mobile compatibility
              interval={0} // Ensure all labels are shown
              tickFormatter={(value) =>
                value.length > 12 ? `${value.substring(0, 12)}...` : value
              }
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
                value="Utilisasi (%)"
                offset={-15}
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
              name="Utilisasi" // Name shown in tooltip
              barSize={20} // Optional: Adjust bar thickness
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

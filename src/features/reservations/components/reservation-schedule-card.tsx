import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Calendar, Play, Square } from "lucide-react";

// Helper function to format dates
const formatDate = (date: Date | string | null): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export interface ReservationScheduleCardProps {
  startTime: Date | string;
  endTime: Date | string;
  className?: string;
}

export function ReservationScheduleCard({
  startTime,
  endTime,
  className,
}: ReservationScheduleCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <CardTitle className="text-xl">Schedule & Timeline</CardTitle>
            <CardDescription>
              Reservation timing and duration details
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Time */}
          <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200/50 dark:border-green-800/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center justify-center w-5 h-5 rounded bg-gradient-to-br from-green-400 to-emerald-500 text-white">
                <Play className="h-2.5 w-2.5" />
              </div>
              <Typography
                variant="small"
                className="font-semibold text-green-900 dark:text-green-100"
              >
                Start Time
              </Typography>
            </div>
            <Typography className="font-medium text-gray-900 dark:text-gray-100">
              {formatDate(startTime)}
            </Typography>
          </div>

          {/* End Time */}
          <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200/50 dark:border-red-800/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center justify-center w-5 h-5 rounded bg-gradient-to-br from-red-400 to-rose-500 text-white">
                <Square className="h-2.5 w-2.5" />
              </div>
              <Typography
                variant="small"
                className="font-semibold text-red-900 dark:text-red-100"
              >
                End Time
              </Typography>
            </div>
            <Typography className="font-medium text-gray-900 dark:text-gray-100">
              {formatDate(endTime)}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

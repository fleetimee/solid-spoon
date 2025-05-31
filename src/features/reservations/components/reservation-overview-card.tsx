import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { FileText, DoorOpen, User, Plus } from "lucide-react";

export interface ReservationOverviewCardProps {
  title: string | null;
  roomName: string;
  roomSlug: string;
  roomId: number;
  userName: string | null;
  userEmail: string | null;
  className?: string;
}

export function ReservationOverviewCard({
  title,
  roomName,
  roomSlug,
  roomId,
  userName,
  userEmail,
  className,
}: ReservationOverviewCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-xl">Reservation Overview</CardTitle>
            <CardDescription>
              Primary reservation details and information
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
          <div className="flex items-center gap-2 mb-2">
            <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <Typography
              variant="small"
              className="font-semibold text-blue-900 dark:text-blue-100"
            >
              Event Title
            </Typography>
          </div>
          <Typography className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {title || "Untitled Reservation"}
          </Typography>
        </div>

        {/* Room Information */}
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
          <div className="flex items-center gap-2 mb-2">
            <DoorOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <Typography
              variant="small"
              className="font-semibold text-emerald-900 dark:text-emerald-100"
            >
              Reserved Room
            </Typography>
          </div>
          <Typography className="text-lg font-medium">
            <Link
              href={`/admin/rooms/${roomSlug}`}
              className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 hover:underline transition-colors font-semibold"
            >
              {roomName}
            </Link>
          </Typography>
          <Typography variant="small" className="text-muted-foreground mt-1">
            Room ID: {roomId}
          </Typography>
        </div>

        {/* User Information */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <Typography
              variant="small"
              className="font-semibold text-purple-900 dark:text-purple-100"
            >
              Reserved By
            </Typography>
          </div>
          <Typography className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {userName || "Unknown User"}
          </Typography>
          <Typography variant="small" className="text-muted-foreground">
            {userEmail || "No email provided"}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}

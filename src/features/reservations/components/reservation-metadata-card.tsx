import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Plus, UserCheck, CheckCircle, FileText } from "lucide-react";

// Helper function to format dates
const formatDate = (date: Date | string | null): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export interface ReservationMetadataCardProps {
  createdAt: Date | string;
  approverName?: string | null;
  approvedAt?: Date | string | null;
  reservationId: string;
  className?: string;
}

export function ReservationMetadataCard({
  createdAt,
  approverName,
  approvedAt,
  reservationId,
  className,
}: ReservationMetadataCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Metadata</CardTitle>
        <CardDescription>Informasi sistem dan timestamp</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Created At */}
        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <Typography
              variant="small"
              className="font-semibold text-blue-900 dark:text-blue-100"
            >
              Dibuat Pada
            </Typography>
            <Typography variant="small" className="text-muted-foreground">
              {formatDate(createdAt)}
            </Typography>
          </div>
        </div>

        {/* Approver Information */}
        {approverName && (
          <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <Typography
                variant="small"
                className="font-semibold text-green-900 dark:text-green-100"
              >
                Disetujui Oleh
              </Typography>
              <Typography variant="small" className="text-muted-foreground">
                {approverName}
              </Typography>
            </div>
          </div>
        )}

        {/* Approved At */}
        {approvedAt && (
          <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div>
              <Typography
                variant="small"
                className="font-semibold text-emerald-900 dark:text-emerald-100"
              >
                Disetujui Pada
              </Typography>
              <Typography variant="small" className="text-muted-foreground">
                {formatDate(approvedAt)}
              </Typography>
            </div>
          </div>
        )}

        {/* Reservation ID */}
        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
          <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5" />
          <div>
            <Typography
              variant="small"
              className="font-semibold text-gray-900 dark:text-gray-100"
            >
              ID Reservasi
            </Typography>
            <Typography
              variant="small"
              className="text-muted-foreground font-mono"
            >
              {reservationId}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

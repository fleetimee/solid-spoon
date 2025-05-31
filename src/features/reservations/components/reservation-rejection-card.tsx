import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { XCircle } from "lucide-react";

export interface ReservationRejectionCardProps {
  rejectionReason: string;
  className?: string;
}

export function ReservationRejectionCard({
  rejectionReason,
  className,
}: ReservationRejectionCardProps) {
  return (
    <Card
      className={`border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20 ${className || ""}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <CardTitle className="text-xl text-red-900 dark:text-red-100">
              Rejection Reason
            </CardTitle>
            <CardDescription>
              Explanation for reservation rejection
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-red-100/50 dark:bg-red-900/20 rounded-lg border border-red-200/50 dark:border-red-800/50">
          <Typography className="whitespace-pre-wrap leading-relaxed text-red-800 dark:text-red-200 font-medium">
            {rejectionReason}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}

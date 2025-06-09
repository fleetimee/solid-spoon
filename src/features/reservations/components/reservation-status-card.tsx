import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import { CheckCircle, AlertCircle, XCircle, Clock3 } from "lucide-react";

// Helper to get badge variant based on status
const getStatusVariant = (
  status: string
): VariantProps<typeof badgeVariants>["variant"] => {
  switch (status?.toUpperCase()) {
    case "APPROVED":
      return "default";
    case "PENDING":
      return "secondary";
    case "REJECTED":
    case "CANCELLED":
      return "destructive";
    default:
      return "outline";
  }
};

// Helper function to get status icon
const getStatusIcon = (status: string) => {
  switch (status?.toUpperCase()) {
    case "APPROVED":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "PENDING":
      return <Clock3 className="h-4 w-4 text-amber-600" />;
    case "REJECTED":
    case "CANCELLED":
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-600" />;
  }
};

export interface ReservationStatusCardProps {
  status: string;
  className?: string;
}

export function ReservationStatusCard({
  status,
  className,
}: ReservationStatusCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Status Saat Ini</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 rounded-lg border">
          {getStatusIcon(status)}
          <div className="flex-1">
            <Badge
              variant={getStatusVariant(status)}
              className="text-sm font-semibold px-3 py-1"
            >
              {status || "Tidak Diketahui"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

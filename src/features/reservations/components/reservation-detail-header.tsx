import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";

export interface ReservationDetailHeaderProps {
  reservationId: string;
  onBackClick?: () => void;
  backHref?: string;
  className?: string;
}

export function ReservationDetailHeader({
  reservationId,
  onBackClick,
  backHref = "/admin/rooms/reservations",
  className,
}: ReservationDetailHeaderProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${className || ""}`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Reservation Details
            </h1>
            <p className="text-lg text-muted-foreground">
              Complete information for reservation #{reservationId}
            </p>
          </div>
        </div>
      </div>
      <Button
        asChild={!onBackClick}
        variant="outline"
        size="default"
        className="shadow-sm hover:shadow-md transition-shadow"
        onClick={onBackClick}
      >
        {onBackClick ? (
          <>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reservations
          </>
        ) : (
          <Link href={backHref}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reservations
          </Link>
        )}
      </Button>
    </div>
  );
}

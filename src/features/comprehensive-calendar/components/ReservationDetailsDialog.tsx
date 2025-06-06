import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../../components/ui/dialog"; // Corrected path
import { Badge } from "../../../components/ui/badge"; // Corrected path
import { Button } from "../../../components/ui/button"; // Corrected path
// import { formatDisplayDateTime } from "../../../lib/utils"; // Corrected path - Function doesn't exist yet
import { User, Clock, Building, Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Define or import the Reservation type matching the data structure
interface Reservation {
  id: string;
  start_time: string | Date;
  end_time: string | Date;
  status: string;
  title: string | null;
  room_name: string;
  user_name: string;
  // Add other relevant fields if needed (e.g., user_email, notes)
}

interface ReservationDetailsDialogProps {
  reservation: Reservation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReservationDetailsDialog({
  reservation,
  open,
  onOpenChange,
}: ReservationDetailsDialogProps) {
  const isMobile = useIsMobile();

  if (!reservation) {
    return null; // Don't render if no reservation is selected
  }

  // Ensure dates are Date objects for formatting
  const startDate = new Date(reservation.start_time);
  const endDate = new Date(reservation.end_time);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          isMobile
            ? "sm:max-w-[95vw] w-[95vw] max-h-[90vh] overflow-y-auto"
            : "sm:max-w-[525px]"
        )}
      >
        <DialogHeader className={cn(isMobile && "space-y-2")}>
          <DialogTitle
            className={cn(
              "flex gap-2",
              isMobile
                ? "flex-col items-start text-base"
                : "items-center text-lg"
            )}
          >
            <span>Reservation Details</span>
            <Badge
              variant={
                reservation.status === "APPROVED"
                  ? "default" // Use 'default' for success
                  : reservation.status === "PENDING"
                    ? "secondary"
                    : reservation.status === "REJECTED"
                      ? "destructive"
                      : reservation.status === "CANCELLED"
                        ? "outline"
                        : "outline"
              }
              className={cn(
                reservation.status === "CANCELLED"
                  ? "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
                  : "",
                isMobile && "text-xs"
              )}
            >
              {reservation.status === "CANCELLED"
                ? "🚫 Dibatalkan"
                : reservation.status}
            </Badge>
          </DialogTitle>
          <DialogDescription className={cn(isMobile ? "text-xs" : "text-sm")}>
            ID: {reservation.id}
          </DialogDescription>
        </DialogHeader>

        <div className={cn("grid gap-4", isMobile ? "py-3 gap-3" : "py-4")}>
          <div
            className={cn(
              "flex gap-3",
              isMobile ? "items-start" : "items-center"
            )}
          >
            <Building
              className={cn(
                "text-muted-foreground shrink-0",
                isMobile ? "h-4 w-4 mt-0.5" : "h-5 w-5"
              )}
            />
            <div className="min-w-0 flex-1">
              <p
                className={cn("font-medium", isMobile ? "text-xs" : "text-sm")}
              >
                Room
              </p>
              <p
                className={cn(
                  "text-muted-foreground break-words",
                  isMobile ? "text-xs" : "text-sm"
                )}
              >
                {reservation.room_name}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "flex gap-3",
              isMobile ? "items-start" : "items-center"
            )}
          >
            <Clock
              className={cn(
                "text-muted-foreground shrink-0",
                isMobile ? "h-4 w-4 mt-0.5" : "h-5 w-5"
              )}
            />
            <div className="min-w-0 flex-1">
              <p
                className={cn("font-medium", isMobile ? "text-xs" : "text-sm")}
              >
                Time
              </p>
              <p
                className={cn(
                  "text-muted-foreground break-words",
                  isMobile ? "text-xs leading-tight" : "text-sm"
                )}
              >
                {isMobile ? (
                  <>
                    <span className="block">
                      {startDate.toLocaleDateString()}
                    </span>
                    <span className="block">
                      {startDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {endDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </>
                ) : (
                  `${startDate.toLocaleString()} - ${endDate.toLocaleString()}`
                )}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "flex gap-3",
              isMobile ? "items-start" : "items-center"
            )}
          >
            <User
              className={cn(
                "text-muted-foreground shrink-0",
                isMobile ? "h-4 w-4 mt-0.5" : "h-5 w-5"
              )}
            />
            <div className="min-w-0 flex-1">
              <p
                className={cn("font-medium", isMobile ? "text-xs" : "text-sm")}
              >
                Reserved by
              </p>
              <p
                className={cn(
                  "text-muted-foreground break-words",
                  isMobile ? "text-xs" : "text-sm"
                )}
              >
                {reservation.user_name}
              </p>
            </div>
          </div>

          {reservation.title && (
            <div className="flex items-start gap-3">
              <Info
                className={cn(
                  "text-muted-foreground mt-0.5 shrink-0",
                  isMobile ? "h-4 w-4" : "h-5 w-5"
                )}
              />
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "font-medium",
                    isMobile ? "text-xs" : "text-sm"
                  )}
                >
                  Title / Purpose
                </p>
                <p
                  className={cn(
                    "text-muted-foreground break-words",
                    isMobile ? "text-xs" : "text-sm"
                  )}
                >
                  {reservation.title}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className={cn(isMobile && "flex-col space-y-2")}>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                isMobile && "w-full touch-manipulation min-h-[44px]"
              )}
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

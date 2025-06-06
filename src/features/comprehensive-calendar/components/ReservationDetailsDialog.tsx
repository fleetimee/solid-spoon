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
  if (!reservation) {
    return null; // Don't render if no reservation is selected
  }

  // Ensure dates are Date objects for formatting
  const startDate = new Date(reservation.start_time);
  const endDate = new Date(reservation.end_time);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Reservation Details{" "}
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
              className={
                reservation.status === "CANCELLED"
                  ? "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
                  : ""
              }
            >
              {reservation.status === "CANCELLED"
                ? "🚫 Dibatalkan"
                : reservation.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>ID: {reservation.id}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-3">
            <Building className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Room</p>
              <p className="text-sm text-muted-foreground">
                {reservation.room_name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Time</p>
              <p className="text-sm text-muted-foreground">
                {startDate.toLocaleString()} - {endDate.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Reserved by</p>
              <p className="text-sm text-muted-foreground">
                {reservation.user_name}
              </p>
              {/* Add email or other user details if available */}
            </div>
          </div>
          {reservation.title && (
            <div className="flex items-start gap-3">
              {" "}
              {/* Use items-start for multi-line */}
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Title / Purpose</p>
                <p className="text-sm text-muted-foreground">
                  {reservation.title}
                </p>
              </div>
            </div>
          )}
          {/* Add other fields like Notes here if applicable */}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
          {/* Add Edit/Cancel buttons here if needed */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

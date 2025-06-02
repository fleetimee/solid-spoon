import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { UserCheck } from "lucide-react";
import { format } from "date-fns";
import { UserRoomReservation } from "@/features/reservations/api/getUserRoomReservations";

export interface UserReservationsSectionProps {
  reservations: UserRoomReservation[];
  isVisible: boolean;
  className?: string;
}

export function UserReservationsSection({
  reservations,
  isVisible,
  className = "",
}: UserReservationsSectionProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Typography
        variant="h2"
        as="h2"
        className="flex items-center font-bold text-2xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
      >
        <UserCheck className="h-6 w-6 mr-3 text-primary" />
        My Reservations 👤
      </Typography>
      <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
        <Table>
          <TableBody>
            {reservations && reservations.length > 0 ? (
              reservations.map((reservation, index) => (
                <TableRow
                  key={reservation.id}
                  className={cn(
                    "hover:bg-muted/50 transition-colors duration-200",
                    index % 2 === 0 && "bg-muted/20"
                  )}
                >
                  <TableCell className="font-semibold py-4">
                    {reservation.title}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="text-sm">
                      <div className="font-medium">Start</div>
                      <div className="text-muted-foreground">
                        {format(new Date(reservation.startTime), "PPp")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="text-sm">
                      <div className="font-medium">End</div>
                      <div className="text-muted-foreground">
                        {format(new Date(reservation.endTime), "PPp")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant={
                        reservation.statusValue === "Approved"
                          ? "default"
                          : reservation.statusValue === "Pending"
                            ? "secondary"
                            : reservation.statusValue === "Rejected"
                              ? "destructive"
                              : "default"
                      }
                      className="font-medium"
                    >
                      {reservation.statusValue === "Approved" && "✅ "}
                      {reservation.statusValue === "Pending" && "⏳ "}
                      {reservation.statusValue === "Rejected" && "❌ "}
                      {reservation.statusValue}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-4xl">📝</div>
                    <Typography
                      variant="default"
                      className="text-muted-foreground"
                    >
                      No reservations yet - ready to book your first one?
                    </Typography>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHead,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { UserCheck, Play, Square } from "lucide-react";
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
    <div className={`space-y-4 ${className}`}>
      <Typography
        variant="h2"
        as="h2"
        className="flex items-center font-bold text-lg bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
      >
        <UserCheck className="h-5 w-5 mr-2 text-primary" />
        My Reservations 👤
      </Typography>
      <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-foreground">
                Title
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Start Time
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                End Time
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
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
                  <TableCell className="font-semibold py-3 text-sm">
                    {reservation.title}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-5 h-5 rounded bg-gradient-to-br from-green-400 to-emerald-500 text-white">
                        <Play className="h-2.5 w-2.5" />
                      </div>
                      <div className="text-xs">
                        <div className="font-medium">Start</div>
                        <div className="text-muted-foreground">
                          {format(new Date(reservation.startTime), "PPp")}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-5 h-5 rounded bg-gradient-to-br from-red-400 to-rose-500 text-white">
                        <Square className="h-2.5 w-2.5" />
                      </div>
                      <div className="text-xs">
                        <div className="font-medium">End</div>
                        <div className="text-muted-foreground">
                          {format(new Date(reservation.endTime), "PPp")}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
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
                      className="font-medium text-xs"
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
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-3xl">📝</div>
                    <Typography
                      variant="default"
                      className="text-muted-foreground text-sm"
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

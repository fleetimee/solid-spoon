import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { History } from "lucide-react";
import { format } from "date-fns";
import { RecentReservation } from "@/features/reservations/api/getRecentReservations";

export interface RecentReservationsSectionProps {
  reservations: RecentReservation[];
  className?: string;
}

export function RecentReservationsSection({
  reservations,
  className = "",
}: RecentReservationsSectionProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <Typography
        variant="h2"
        as="h2"
        className="flex items-center font-bold text-lg bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
      >
        <History className="h-5 w-5 mr-2 text-primary" />
        Recent Activity 📈
      </Typography>
      <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-md overflow-hidden">
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
                  <TableCell className="font-semibold py-3 text-sm">
                    {reservation.title}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="font-medium text-sm">
                        {reservation.userName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="text-xs">
                      <div className="font-medium">Start</div>
                      <div className="text-muted-foreground">
                        {format(new Date(reservation.startTime), "PPp")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="text-xs">
                      <div className="font-medium">End</div>
                      <div className="text-muted-foreground">
                        {format(new Date(reservation.endTime), "PPp")}
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
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-3xl">🏢</div>
                    <Typography
                      variant="default"
                      className="text-muted-foreground text-sm"
                    >
                      No recent activity - be the first to book this room! 🚀
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

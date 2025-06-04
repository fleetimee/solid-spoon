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
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white">
          <UserCheck className="h-5 w-5" />
        </div>
        <Typography
          variant="h2"
          as="h2"
          className="font-bold text-xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"
        >
          Reservasi Saya 👤
        </Typography>
      </div>
      <div className="rounded-xl border-0 shadow-lg bg-white/70 dark:bg-card/70 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-violet-500 to-purple-500 hover:bg-gradient-to-r hover:from-violet-600 hover:to-purple-600 border-none">
              <TableHead className="font-semibold text-white border-r border-white/20 last:border-r-0">
                Keperluan
              </TableHead>
              <TableHead className="font-semibold text-white border-r border-white/20 last:border-r-0">
                Waktu Mulai
              </TableHead>
              <TableHead className="font-semibold text-white border-r border-white/20 last:border-r-0">
                Waktu Selesai
              </TableHead>
              <TableHead className="font-semibold text-white">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations && reservations.length > 0 ? (
              reservations.map((reservation, index) => (
                <TableRow
                  key={reservation.id}
                  className={cn(
                    "hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-950/30 dark:hover:to-purple-950/30 transition-all duration-300 border-b border-violet-100/50 dark:border-violet-800/30",
                    index % 2 === 0 &&
                      "bg-gradient-to-r from-violet-25 to-purple-25 dark:from-violet-950/10 dark:to-purple-950/10"
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
                        <div className="font-medium">Mulai</div>
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
                        <div className="font-medium">Selesai</div>
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
                      Belum ada reservasi - siap untuk memesan yang pertama?
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

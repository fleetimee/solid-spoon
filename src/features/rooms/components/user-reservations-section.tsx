"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHead,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { UserCheck, Play, Square, X } from "lucide-react";
import { format } from "date-fns";
import { UserRoomReservation } from "@/features/reservations/api/getUserRoomReservations";
import { CancelReservationDialog } from "./cancel-reservation-dialog";

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
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<UserRoomReservation | null>(null);

  const handleCancelClick = (reservation: UserRoomReservation) => {
    setSelectedReservation(reservation);
    setCancelDialogOpen(true);
  };

  const handleCancelSuccess = () => {
    // TODO: Refresh reservations data or handle state update
    // For now, we'll just close the dialog
    setCancelDialogOpen(false);
    setSelectedReservation(null);
  };

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
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-violet-500 to-purple-500 hover:bg-gradient-to-r hover:from-violet-600 hover:to-purple-600 border-none">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TableHead className="font-semibold text-white border-r border-white/20 last:border-r-0 cursor-help hover:bg-white/10 transition-colors">
                      Keperluan
                    </TableHead>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-violet-300">
                    <p>Tujuan atau alasan penggunaan ruangan</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TableHead className="font-semibold text-white border-r border-white/20 last:border-r-0 cursor-help hover:bg-white/10 transition-colors">
                      Waktu Mulai
                    </TableHead>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-violet-300">
                    <p>Tanggal dan waktu dimulainya reservasi</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TableHead className="font-semibold text-white border-r border-white/20 last:border-r-0 cursor-help hover:bg-white/10 transition-colors">
                      Waktu Selesai
                    </TableHead>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-violet-300">
                    <p>Tanggal dan waktu berakhirnya reservasi</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TableHead className="font-semibold text-white border-r border-white/20 last:border-r-0 cursor-help hover:bg-white/10 transition-colors">
                      Status
                    </TableHead>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-violet-300">
                    <p>Status persetujuan reservasi ruangan</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TableHead className="font-semibold text-white cursor-help hover:bg-white/10 transition-colors">
                      Aksi
                    </TableHead>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-violet-300">
                    <p>Aksi yang dapat dilakukan pada reservasi</p>
                  </TooltipContent>
                </Tooltip>
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
                    <TableCell className="py-3">
                      {reservation.statusValue === "Pending" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelClick(reservation)}
                              className="h-7 w-7 p-0 hover:bg-destructive/90 focus-visible:ring-destructive/20"
                              aria-label={`Batalkan reservasi ${reservation.title}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-300">
                            <p>Batalkan reservasi ini</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
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
        </TooltipProvider>
      </div>

      {/* Cancel Reservation Dialog */}
      <CancelReservationDialog
        reservation={selectedReservation}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onCancel={handleCancelSuccess}
      />
    </div>
  );
}

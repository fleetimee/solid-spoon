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

// Helper function to check if a reservation can be cancelled in the UI
function canCancelReservation(reservation: UserRoomReservation): {
  canCancel: boolean;
  reason:
    | "pending"
    | "approved_eligible"
    | "approved_too_late"
    | "other_status";
  message?: string;
} {
  const now = new Date();
  const reservationStartTime = new Date(reservation.startTime);
  const hoursUntilStart =
    (reservationStartTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  // PENDING reservations can always be cancelled
  if (reservation.statusValue === "Pending") {
    return { canCancel: true, reason: "pending" };
  }

  // APPROVED reservations can be cancelled if more than 24 hours away
  if (reservation.statusValue === "Approved") {
    if (hoursUntilStart > 24) {
      return { canCancel: true, reason: "approved_eligible" };
    } else {
      return {
        canCancel: false,
        reason: "approved_too_late",
        message: `Tidak dapat dibatalkan - hanya ${Math.ceil(hoursUntilStart)} jam tersisa sebelum dimulai. Hubungi admin untuk pembatalan dalam 24 jam.`,
      };
    }
  }

  // Other statuses cannot be cancelled
  return {
    canCancel: false,
    reason: "other_status",
    message: "Reservasi ini tidak dapat dibatalkan karena status saat ini.",
  };
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
                                : reservation.statusValue === "Cancelled"
                                  ? "outline"
                                  : "default"
                        }
                        className={cn(
                          "font-medium text-xs",
                          reservation.statusValue === "Cancelled" &&
                            "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
                        )}
                      >
                        {reservation.statusValue === "Approved" && "✅ "}
                        {reservation.statusValue === "Pending" && "⏳ "}
                        {reservation.statusValue === "Rejected" && "❌ "}
                        {reservation.statusValue === "Cancelled" && "🚫 "}
                        {reservation.statusValue === "Approved"
                          ? "Disetujui"
                          : reservation.statusValue === "Pending"
                            ? "Pending"
                            : reservation.statusValue === "Rejected"
                              ? "Ditolak"
                              : reservation.statusValue === "Cancelled"
                                ? "Dibatalkan"
                                : reservation.statusValue}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      {(() => {
                        const cancelInfo = canCancelReservation(reservation);

                        if (cancelInfo.canCancel) {
                          return (
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
                                <p>
                                  {cancelInfo.reason === "pending"
                                    ? "Batalkan reservasi ini"
                                    : "Batalkan reservasi yang disetujui (>24 jam)"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        } else if (cancelInfo.reason === "approved_too_late") {
                          return (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled
                                  className="h-7 w-7 p-0 opacity-50 cursor-not-allowed"
                                  aria-label="Tidak dapat dibatalkan - hubungi admin"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-300 max-w-xs">
                                <p className="text-sm">{cancelInfo.message}</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        } else {
                          return (
                            <span className="text-xs text-muted-foreground">
                              {reservation.statusValue === "Rejected" &&
                                "❌ Ditolak"}
                              {reservation.statusValue === "Completed" &&
                                "✅ Selesai"}
                              {reservation.statusValue === "Cancelled" &&
                                "🚫 Dibatalkan"}
                              {!["Rejected", "Completed", "Cancelled"].includes(
                                reservation.statusValue
                              ) && " -"}
                            </span>
                          );
                        }
                      })()}
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

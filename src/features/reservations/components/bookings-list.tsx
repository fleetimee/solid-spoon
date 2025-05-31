"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Eye,
  CheckCircle,
  XCircle,
  Clock3,
  Sparkles,
} from "lucide-react";
import { formatDateRangeHumanized } from "@/lib/utils/formatDate";
import { type getUserReservations } from "@/features/reservations/api/getUserReservations"; // Assuming type export

// Define the type for a single reservation based on the expected data structure
// Adjust this based on the actual return type of getUserReservations if needed
type Reservation = Awaited<ReturnType<typeof getUserReservations>>[number];

interface BookingsListProps {
  reservations: Reservation[];
  isLoading?: boolean;
}

// Enhanced status configuration system
const getStatusConfig = (status: string | null | undefined) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return {
        bgGradient:
          "from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
        hoverGradient: "from-emerald-400/10 to-green-400/10",
        borderGradient: "from-emerald-400 to-green-500",
        statusBadge: "default" as const,
        statusIcon: CheckCircle,
        accentColor: "text-emerald-700 dark:text-emerald-300",
        iconColor: "text-emerald-600 dark:text-emerald-400",
      };
    case "pending":
      return {
        bgGradient:
          "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
        hoverGradient: "from-amber-400/10 to-orange-400/10",
        borderGradient: "from-amber-400 to-orange-500",
        statusBadge: "secondary" as const,
        statusIcon: Clock3,
        accentColor: "text-amber-700 dark:text-amber-300",
        iconColor: "text-amber-600 dark:text-amber-400",
      };
    case "rejected":
    case "cancelled":
      return {
        bgGradient:
          "from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20",
        hoverGradient: "from-red-400/10 to-rose-400/10",
        borderGradient: "from-red-400 to-rose-500",
        statusBadge: "destructive" as const,
        statusIcon: XCircle,
        accentColor: "text-red-700 dark:text-red-300",
        iconColor: "text-red-600 dark:text-red-400",
      };
    default:
      return {
        bgGradient:
          "from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20",
        hoverGradient: "from-slate-400/10 to-gray-400/10",
        borderGradient: "from-slate-400 to-gray-500",
        statusBadge: "outline" as const,
        statusIcon: Clock,
        accentColor: "text-slate-700 dark:text-slate-300",
        iconColor: "text-slate-600 dark:text-slate-400",
      };
  }
};

export function BookingsList({
  reservations,
  isLoading = false,
}: BookingsListProps) {
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  // We need to control the Dialog's open state based on whether a reservation is selected
  const isDialogOpen = !!selectedReservation;
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedReservation(null); // Reset selection when dialog closes
    }
  };

  // Loading skeleton component
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className="group relative overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 shadow-lg"
          >
            <CardContent className="p-0">
              <div className="grid grid-cols-[12px_1fr] sm:grid-cols-[12px_3fr_1fr_1fr_1fr] gap-4 p-6 items-center">
                <Skeleton className="w-2 h-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="hidden sm:block">
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="hidden sm:block">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {reservations && reservations.length > 0 ? (
        reservations.map((reservation) => {
          const config = getStatusConfig(reservation.status);
          const StatusIcon = config.statusIcon;

          return (
            <Card
              key={reservation.id}
              className={`group relative overflow-hidden border-0 bg-gradient-to-br ${config.bgGradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${config.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <CardContent className="p-0 relative">
                <div className="grid grid-cols-[8px_1fr] sm:grid-cols-[8px_3fr_1fr_1fr_1fr] gap-6 p-6 items-center">
                  {/* Enhanced status indicator */}
                  <div
                    className={`w-2 h-full self-stretch bg-gradient-to-b ${config.borderGradient} rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300`}
                  ></div>

                  {/* Room and title section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className={`h-4 w-4 ${config.iconColor}`} />
                      <div
                        className={`font-semibold text-lg ${config.accentColor}`}
                      >
                        {reservation.roomName}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className={`h-4 w-4 ${config.iconColor}`} />
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {reservation.title}
                      </div>
                    </div>
                  </div>

                  {/* Time section */}
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-2">
                      <Calendar className={`h-4 w-4 ${config.iconColor}`} />
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {formatDateRangeHumanized(
                          reservation.startTime,
                          reservation.endTime
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status section */}
                  <div className="hidden sm:flex items-center gap-2">
                    <StatusIcon className={`h-4 w-4 ${config.iconColor}`} />
                    <Badge
                      variant={config.statusBadge}
                      className="capitalize font-medium"
                    >
                      {reservation.status ?? "N/A"}
                    </Badge>
                  </div>

                  {/* Action button */}
                  <div className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedReservation(reservation)}
                          className={`group-hover:scale-105 transition-all duration-200 border-2 ${config.accentColor} hover:bg-white/90 dark:hover:bg-gray-800/90 font-medium`}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      ) : (
        // Enhanced empty state
        <Card className="border-0 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-slate-400 to-gray-500 shadow-md mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
              No bookings yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Your reservation history will appear here once you make your first
              booking.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Dialog with admin dashboard styling */}
      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          {selectedReservation &&
            (() => {
              const config = getStatusConfig(selectedReservation.status);
              const StatusIcon = config.statusIcon;

              return (
                <>
                  <DialogHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${config.borderGradient} shadow-md`}
                      >
                        <StatusIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <DialogTitle
                          className={`text-lg font-semibold ${config.accentColor}`}
                        >
                          {selectedReservation.roomName}
                        </DialogTitle>
                        <DialogDescription className="text-slate-600 dark:text-slate-400">
                          Booking Details for: {selectedReservation.title}
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div
                      className={`rounded-lg p-4 bg-gradient-to-br ${config.bgGradient} border-l-4 border-gradient-to-b ${config.borderGradient}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className={`h-4 w-4 ${config.iconColor}`} />
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              Room:
                            </span>
                          </div>
                          <span
                            className={`font-semibold ${config.accentColor}`}
                          >
                            {selectedReservation.roomName}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className={`h-4 w-4 ${config.iconColor}`} />
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              Event:
                            </span>
                          </div>
                          <span className="font-medium text-slate-600 dark:text-slate-400">
                            {selectedReservation.title}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar
                              className={`h-4 w-4 ${config.iconColor}`}
                            />
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              Time:
                            </span>
                          </div>
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {formatDateRangeHumanized(
                              selectedReservation.startTime,
                              selectedReservation.endTime
                            )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <StatusIcon
                              className={`h-4 w-4 ${config.iconColor}`}
                            />
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              Status:
                            </span>
                          </div>
                          <Badge
                            variant={config.statusBadge}
                            className="capitalize font-medium"
                          >
                            {selectedReservation.status ?? "N/A"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

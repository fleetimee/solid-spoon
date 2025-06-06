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
  CalendarDays,
  Building2,
  AlertCircle,
} from "lucide-react";
import { formatDateRangeHumanized } from "@/lib/utils/formatDate";
import { type getUserReservations } from "@/features/reservations/api/getUserReservations";

// Define the type for a single reservation
type Reservation = Awaited<ReturnType<typeof getUserReservations>>[number];

interface BookingsListProps {
  reservations: Reservation[];
  isLoading?: boolean;
}

// Professional status configuration with muted corporate colors
const getStatusConfig = (status: string | null | undefined) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return {
        bgColor: "bg-gray-50 dark:bg-gray-900/50",
        borderColor: "border-green-200 dark:border-green-800",
        statusBadge: "default" as const,
        statusIcon: CheckCircle,
        statusColor: "bg-green-600",
        textColor: "text-green-800 dark:text-green-300",
        iconColor: "text-green-600 dark:text-green-400",
        badgeColor: "bg-green-600 text-white",
      };
    case "pending":
      return {
        bgColor: "bg-gray-50 dark:bg-gray-900/50",
        borderColor: "border-amber-200 dark:border-amber-800",
        statusBadge: "secondary" as const,
        statusIcon: Clock3,
        statusColor: "bg-amber-600",
        textColor: "text-amber-800 dark:text-amber-300",
        iconColor: "text-amber-600 dark:text-amber-400",
        badgeColor: "bg-amber-600 text-white",
      };
    case "rejected":
      return {
        bgColor: "bg-gray-50 dark:bg-gray-900/50",
        borderColor: "border-red-200 dark:border-red-800",
        statusBadge: "destructive" as const,
        statusIcon: XCircle,
        statusColor: "bg-red-600",
        textColor: "text-red-800 dark:text-red-300",
        iconColor: "text-red-600 dark:text-red-400",
        badgeColor: "bg-red-600 text-white",
      };
    case "cancelled":
      return {
        bgColor: "bg-gray-50 dark:bg-gray-900/50",
        borderColor: "border-gray-300 dark:border-gray-600",
        statusBadge: "outline" as const,
        statusIcon: AlertCircle,
        statusColor: "bg-gray-600",
        textColor: "text-gray-700 dark:text-gray-300",
        iconColor: "text-gray-600 dark:text-gray-400",
        badgeColor:
          "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600",
      };
    default:
      return {
        bgColor: "bg-gray-50 dark:bg-gray-900/50",
        borderColor: "border-gray-200 dark:border-gray-700",
        statusBadge: "outline" as const,
        statusIcon: AlertCircle,
        statusColor: "bg-gray-500",
        textColor: "text-gray-700 dark:text-gray-300",
        iconColor: "text-gray-500 dark:text-gray-400",
        badgeColor: "bg-gray-500 text-white",
      };
  }
};

export function BookingsList({
  reservations,
  isLoading = false,
}: BookingsListProps) {
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const isDialogOpen = !!selectedReservation;
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedReservation(null);
    }
  };

  // Professional loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          >
            <CardContent className="p-6">
              <div className="grid grid-cols-[4px_1fr_auto] sm:grid-cols-[4px_2fr_1.2fr_1fr_auto] gap-4 sm:gap-6 items-center">
                <Skeleton className="w-1 h-16 bg-gray-300 dark:bg-gray-600" />
                <div className="space-y-2 min-w-0">
                  <Skeleton className="h-5 w-32 bg-gray-300 dark:bg-gray-600" />
                  <Skeleton className="h-4 w-48 bg-gray-200 dark:bg-gray-700" />
                  <div className="sm:hidden">
                    <div className="p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-1">
                      <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block min-w-0">
                  <div className="space-y-2">
                    <div className="p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-2">
                      <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <Skeleton className="h-6 w-16 bg-gray-300 dark:bg-gray-600" />
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Skeleton className="h-8 w-16 bg-gray-300 dark:bg-gray-600" />
                  <div className="sm:hidden">
                    <Skeleton className="h-5 w-14 bg-gray-300 dark:bg-gray-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reservations && reservations.length > 0 ? (
        reservations.map((reservation) => {
          const config = getStatusConfig(reservation.status);
          const StatusIcon = config.statusIcon;

          return (
            <Card
              key={reservation.id}
              className={`border-l-4 ${config.borderColor} ${config.bgColor} border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200`}
            >
              <CardContent className="p-6">
                <div className="grid grid-cols-[4px_1fr_auto] sm:grid-cols-[4px_2fr_1.2fr_1fr_auto] gap-4 sm:gap-6 items-center">
                  {/* Status indicator */}
                  <div
                    className={`w-1 h-16 ${config.statusColor} rounded-sm`}
                  ></div>

                  {/* Room and title section */}
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-800">
                        <Building2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate">
                        {reservation.roomName}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-800">
                        <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                        {reservation.title}
                      </div>
                    </div>

                    {/* Mobile date display */}
                    <div className="sm:hidden">
                      <div className="p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-1">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                            {new Date(reservation.startTime).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                timeZone: "Asia/Jakarta",
                              }
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-6">
                          <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                            {new Date(reservation.startTime)
                              .toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                                timeZone: "Asia/Jakarta",
                              })
                              .replace(":", ".")}{" "}
                            -{" "}
                            {new Date(reservation.endTime)
                              .toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                                timeZone: "Asia/Jakarta",
                              })
                              .replace(":", ".")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date and Time section - desktop only */}
                  <div className="hidden sm:block min-w-0">
                    <div className="space-y-2">
                      <div className="p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-2">
                        {/* Date row */}
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {new Date(reservation.startTime).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                timeZone: "Asia/Jakarta",
                              }
                            )}
                          </div>
                        </div>
                        {/* Time row */}
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {new Date(reservation.startTime)
                              .toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                                timeZone: "Asia/Jakarta",
                              })
                              .replace(":", ".")}{" "}
                            -{" "}
                            {new Date(reservation.endTime)
                              .toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                                timeZone: "Asia/Jakarta",
                              })
                              .replace(":", ".")}
                          </div>
                        </div>
                      </div>

                      {/* Created date */}
                      {reservation.createdAt && (
                        <div className="flex items-center gap-2 px-2 py-1 rounded bg-gray-50 dark:bg-gray-800/50">
                          <Clock className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Created{" "}
                            {new Date(reservation.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year:
                                  new Date(
                                    reservation.createdAt
                                  ).getFullYear() !== new Date().getFullYear()
                                    ? "numeric"
                                    : undefined,
                              }
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status section */}
                  <div className="hidden sm:flex items-center gap-2 justify-center">
                    <div className={`p-1.5 rounded ${config.statusColor}`}>
                      <StatusIcon className="h-4 w-4 text-white" />
                    </div>
                    <Badge
                      variant={config.statusBadge}
                      className={`capitalize font-medium text-xs px-2 py-1 ${config.badgeColor} border-0`}
                    >
                      {reservation.status ?? "N/A"}
                    </Badge>
                  </div>

                  {/* Action button */}
                  <div className="flex flex-col gap-2 items-end">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedReservation(reservation)}
                          className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 border-gray-300 dark:border-gray-600"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                      </DialogTrigger>
                    </Dialog>

                    {/* Mobile status badge */}
                    <div className="sm:hidden">
                      <Badge
                        variant={config.statusBadge}
                        className={`capitalize font-medium text-xs px-2 py-1 ${config.badgeColor} border-0`}
                      >
                        {reservation.status ?? "N/A"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      ) : (
        // Professional empty state
        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto">
                <CalendarDays className="h-8 w-8 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              You haven&apos;t made any room reservations yet. When you book a
              room, your reservations will appear here.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Professional Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          {selectedReservation &&
            (() => {
              const config = getStatusConfig(selectedReservation.status);
              const StatusIcon = config.statusIcon;

              return (
                <>
                  <DialogHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-lg ${config.statusColor}`}
                      >
                        <StatusIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                          {selectedReservation.roomName}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                          Booking Details • {selectedReservation.title}
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div
                      className={`rounded-lg p-4 ${config.bgColor} border-l-4 ${config.borderColor}`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-700">
                              <Building2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              Room
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {selectedReservation.roomName}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-700">
                              <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              Event
                            </span>
                          </div>
                          <span className="font-medium text-gray-700 dark:text-gray-300 text-right max-w-xs">
                            {selectedReservation.title}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-700">
                                <CalendarDays className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              </div>
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                Schedule
                              </span>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {new Date(
                                  selectedReservation.startTime
                                ).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                  timeZone: "Asia/Jakarta",
                                })}
                              </div>
                              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                {new Date(selectedReservation.startTime)
                                  .toLocaleTimeString("en-GB", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                    timeZone: "Asia/Jakarta",
                                  })
                                  .replace(":", ".")}{" "}
                                -{" "}
                                {new Date(selectedReservation.endTime)
                                  .toLocaleTimeString("en-GB", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                    timeZone: "Asia/Jakarta",
                                  })
                                  .replace(":", ".")}
                              </div>
                            </div>
                          </div>

                          {/* Created date in dialog */}
                          {selectedReservation.createdAt && (
                            <div className="flex items-center justify-between p-3 rounded bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-700">
                                  <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  Created
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {new Date(
                                    selectedReservation.createdAt
                                  ).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(
                                    selectedReservation.createdAt
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between p-3 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-1.5 rounded ${config.statusColor}`}
                            >
                              <StatusIcon className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              Status
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={config.statusBadge}
                              className={`capitalize font-medium text-sm px-3 py-1 ${config.badgeColor} border-0`}
                            >
                              {selectedReservation.status ?? "N/A"}
                            </Badge>
                          </div>
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

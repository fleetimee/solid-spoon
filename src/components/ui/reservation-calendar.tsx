"use client";

import * as React from "react";
import {
  eachDayOfInterval,
  startOfDay,
  isToday,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  addMonths,
  subMonths,
  isSameDay,
} from "date-fns";
import { cn, getInitials, formatTimeRange } from "@/lib/utils";
import {
  CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { type ApprovedReservationTime } from "@/features/reservations/api/getApprovedRoomReservations";

interface ReservationCalendarProps {
  approvedReservations: (ApprovedReservationTime & { status: string })[];
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
}

// Enhanced Reservation Tooltip Component
interface ReservationTooltipProps {
  reservations: (ApprovedReservationTime & { status: string })[];
  date: Date;
  children: React.ReactNode;
}

function ReservationTooltip({
  reservations,
  date,
  children,
}: ReservationTooltipProps) {
  const dayReservations = reservations.filter(
    (reservation) =>
      isSameDay(new Date(reservation.startTime), date) ||
      isSameDay(new Date(reservation.endTime), date) ||
      (new Date(reservation.startTime) <= date &&
        new Date(reservation.endTime) >= date)
  );

  if (dayReservations.length === 0) {
    return <>{children}</>;
  }

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-80 p-0 bg-card border border-border shadow-lg"
        sideOffset={10}
      >
        <div className="p-4 space-y-3">
          <div className="text-sm font-semibold text-foreground border-b border-border pb-2">
            {format(date, "EEEE, MMMM d, yyyy")}
          </div>

          <div className="space-y-3">
            {dayReservations.slice(0, 3).map((reservation, index) => (
              <div
                key={reservation.id || index}
                className="flex items-start gap-3"
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  {reservation.user.image ? (
                    <AvatarImage
                      src={reservation.user.image}
                      alt={reservation.user.name}
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                    {getInitials(reservation.user.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="text-sm font-medium text-foreground">
                    {reservation.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    by {reservation.user.name}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimeRange(
                      new Date(reservation.startTime),
                      new Date(reservation.endTime)
                    )}
                  </div>
                </div>
              </div>
            ))}

            {dayReservations.length > 3 && (
              <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
                +{dayReservations.length - 3} reservasi lainnya
              </div>
            )}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function ReservationCalendar({
  approvedReservations,
  selectedDate,
  onSelectDate,
  disabled,
  className = "",
}: ReservationCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(
    selectedDate || new Date()
  );

  // Calculate the set of blocked days (only APPROVED reservations block availability)
  const bookedDays = React.useMemo(() => {
    const days = new Set<number>();

    approvedReservations
      .filter((reservation) => reservation.status === "Approved")
      .forEach((reservation) => {
        const start = new Date(reservation.startTime);
        const end = new Date(reservation.endTime);

        const intervalDays = eachDayOfInterval({
          start: startOfDay(start),
          end: startOfDay(end),
        });

        intervalDays.forEach((day) => {
          days.add(day.getTime());
        });
      });

    return Array.from(days).map((timestamp) => new Date(timestamp));
  }, [approvedReservations]);

  // Calculate the set of completed days (for visual indication only)
  const completedDays = React.useMemo(() => {
    const days = new Set<number>();

    approvedReservations
      .filter((reservation) => reservation.status === "Completed")
      .forEach((reservation) => {
        const start = new Date(reservation.startTime);
        const end = new Date(reservation.endTime);

        const intervalDays = eachDayOfInterval({
          start: startOfDay(start),
          end: startOfDay(end),
        });

        intervalDays.forEach((day) => {
          days.add(day.getTime());
        });
      });

    return Array.from(days).map((timestamp) => new Date(timestamp));
  }, [approvedReservations]);

  // Calculate today for highlighting
  const today = startOfDay(new Date());

  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Helper functions for date states
  const isDateBooked = (date: Date) => {
    const dateTimestamp = startOfDay(date).getTime();
    return bookedDays.some(
      (bookedDay) => bookedDay.getTime() === dateTimestamp
    );
  };

  const isDateCompleted = (date: Date) => {
    const dateTimestamp = startOfDay(date).getTime();
    return completedDays.some(
      (completedDay) => completedDay.getTime() === dateTimestamp
    );
  };

  const isDateReserved = (date: Date) => {
    return isDateBooked(date);
  };

  const isDateAvailable = (date: Date) => {
    return !isDateBooked(date) && date >= today;
  };

  const getDateStatus = (date: Date) => {
    if (isToday(date)) return "today";
    if (isDateBooked(date)) return "booked";
    if (isDateCompleted(date)) return "completed";
    if (isDateAvailable(date)) return "available";
    return "past";
  };

  const isDateSelected = (date: Date) => {
    return selectedDate && isSameDay(date, selectedDate);
  };

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className={cn("flex flex-col w-full", className)}>
      {/* Calendar Container */}
      <div className="relative w-full p-4 sm:p-6 rounded-xl bg-gradient-to-br from-card via-card to-muted/20 border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToPreviousMonth();
            }}
            className="h-8 w-8 p-0 hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToToday();
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Hari Ini
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToNextMonth();
            }}
            className="h-8 w-8 p-0 hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-3">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs sm:text-sm font-medium text-muted-foreground py-2 sm:py-3 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((date) => {
            const dateStatus = getDateStatus(date);
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isBooked = dateStatus === "booked";
            const isCompleted = dateStatus === "completed";
            const isSelected = isDateSelected(date);
            const isReserved = isDateReserved(date);
            const isDateDisabled = disabled
              ? disabled(date)
              : dateStatus === "past" || isBooked || isReserved;
            const isClickable =
              !isDateDisabled && isCurrentMonth && !isReserved;

            const dateButton = (
              <button
                key={date.toISOString()}
                className={cn(
                  "relative aspect-square min-h-10 sm:min-h-12 w-full p-0 font-normal text-sm sm:text-base rounded-lg",
                  "transition-all duration-200 flex items-center justify-center",
                  // Base styles for month context
                  !isCurrentMonth && "text-muted-foreground/50 opacity-50",
                  // Clickable states - only add hover effects for clickable dates
                  isClickable && [
                    "hover:bg-accent/50 hover:text-accent-foreground cursor-pointer",
                    "focus:bg-accent focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  ],
                  // Non-clickable states
                  !isClickable && [
                    "cursor-not-allowed",
                    "focus:outline-none", // Remove focus styles for disabled dates
                  ],
                  // Selected state
                  isSelected && [
                    "bg-primary text-primary-foreground font-bold",
                    "ring-2 ring-primary ring-offset-2 ring-offset-background",
                    isClickable && "hover:bg-primary/90",
                  ],
                  // Status-specific styles
                  !isSelected &&
                    dateStatus === "today" && [
                      "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold",
                      "border border-blue-300 dark:border-blue-600",
                      isClickable &&
                        "hover:bg-blue-200 dark:hover:bg-blue-900/50",
                    ],
                  !isSelected &&
                    dateStatus === "booked" && [
                      "bg-destructive/10 text-destructive opacity-60",
                      "border border-destructive/30",
                      "relative after:absolute after:inset-0 after:flex after:items-center after:justify-center",
                      "after:text-xs after:font-bold after:text-destructive/60 after:content-['●']",
                      "after:top-1 after:right-1 after:w-2 after:h-2",
                    ],
                  !isSelected &&
                    dateStatus === "completed" && [
                      "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                      "border border-blue-300/30 dark:border-blue-600/30",
                      "relative after:absolute after:inset-0 after:flex after:items-center after:justify-center",
                      "after:text-xs after:font-bold after:text-blue-500/60 after:content-['✓']",
                      "after:top-1 after:right-1 after:w-2 after:h-2",
                      isClickable && "hover:bg-blue-500/20",
                    ],
                  !isSelected &&
                    dateStatus === "available" && [
                      "bg-green-500/10 text-green-600 dark:text-green-400",
                      "border border-green-300/30 dark:border-green-600/30",
                      isClickable && "hover:bg-green-500/20 hover:scale-105",
                    ],
                  !isSelected &&
                    dateStatus === "past" && [
                      "text-muted-foreground/50 opacity-60",
                    ]
                )}
                onClick={
                  isClickable && !isDateReserved(date)
                    ? (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        // Double-check: Absolutely prevent reserved date selection
                        if (isDateReserved(date)) {
                          console.warn(
                            "Attempted to select reserved date:",
                            date
                          );
                          return;
                        }

                        onSelectDate(date);
                      }
                    : undefined
                }
                type="button"
                disabled={isDateDisabled}
                tabIndex={isClickable ? 0 : -1} // Remove from tab order if not clickable
                aria-label={
                  isBooked
                    ? `${format(date, "MMMM d, yyyy")} - Sudah Dipesan (tidak dapat dipilih)`
                    : isCompleted
                      ? `${format(date, "MMMM d, yyyy")} - Selesai (dapat dipesan ulang)`
                      : dateStatus === "past"
                        ? `${format(date, "MMMM d, yyyy")} - Tanggal lampau (tidak dapat dipilih)`
                        : dateStatus === "available"
                          ? `${format(date, "MMMM d, yyyy")} - Tersedia untuk pemesanan`
                          : format(date, "MMMM d, yyyy")
                }
                aria-disabled={isDateDisabled}
              >
                {format(date, "d")}
              </button>
            );

            // Wrap booked and completed dates with reservation tooltip
            if (isBooked || isCompleted) {
              return (
                <ReservationTooltip
                  key={date.toISOString()}
                  reservations={approvedReservations}
                  date={date}
                >
                  {dateButton}
                </ReservationTooltip>
              );
            }

            return dateButton;
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="w-full mt-4 p-4 bg-gradient-to-r from-muted/30 to-background/50 rounded-lg border border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <CalendarIcon className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            Keterangan Kalender
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 group">
            <div className="h-3 w-3 rounded-sm border bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-600" />
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                Tersedia
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 group">
            <div className="h-3 w-3 rounded-sm border bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-600 opacity-60" />
            <div className="flex items-center gap-1">
              <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
              <span className="text-xs font-medium text-red-600 dark:text-red-400">
                Sudah Dipesan
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 group">
            <div className="h-3 w-3 rounded-sm border bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600" />
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Selesai
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 group">
            <div className="h-3 w-3 rounded-sm border bg-cyan-100 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-600" />
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
              <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">
                Hari Ini
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

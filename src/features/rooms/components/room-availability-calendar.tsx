"use client";

import * as React from "react";
import { type RoomReservationWithStatus } from "../../reservations/api/getAllRoomReservations";
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
import {
  cn,
  getInitials,
  formatTimeRange,
  formatTimeRangeIndonesian,
  getRelativeDayIndonesian,
} from "@/lib/utils";
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

interface RoomAvailabilityCalendarProps {
  reservations: RoomReservationWithStatus[];
}

// Enhanced Universal Tooltip Component for all date types
interface DateTooltipProps {
  reservations: RoomReservationWithStatus[];
  date: Date;
  dateStatus: "today" | "booked" | "completed" | "available" | "past";
  children: React.ReactNode;
}

function DateTooltip({
  reservations,
  date,
  dateStatus,
  children,
}: DateTooltipProps) {
  const dayReservations = reservations.filter(
    (reservation) =>
      isSameDay(new Date(reservation.startTime), date) ||
      isSameDay(new Date(reservation.endTime), date) ||
      (new Date(reservation.startTime) <= date &&
        new Date(reservation.endTime) >= date)
  );

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium">
            <XCircle className="h-3 w-3" />
            Dipesan
          </div>
        );
      case "Completed":
        return (
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
            <CheckCircle className="h-3 w-3" />
            Selesai
          </div>
        );
      default:
        return null;
    }
  };

  // Helper function to get action hint based on date status
  const getActionHint = () => {
    switch (dateStatus) {
      case "available":
        return (
          <div className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded border border-green-200 dark:border-green-800">
            💡 Klik untuk memesan ruangan ini
          </div>
        );
      case "today":
        return dayReservations.length === 0 ? (
          <div className="text-xs text-cyan-600 dark:text-cyan-400 font-medium bg-cyan-50 dark:bg-cyan-900/20 px-2 py-1 rounded border border-cyan-200 dark:border-cyan-800">
            📅 Tersedia untuk pemesanan hari ini
          </div>
        ) : null;
      case "booked":
        return (
          <div className="text-xs text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded border border-red-200 dark:border-red-800">
            🚫 Ruangan tidak tersedia pada tanggal ini
          </div>
        );
      case "completed":
        return (
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded border border-blue-200 dark:border-blue-800">
            ✅ Pemesanan telah selesai dilaksanakan
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-72 sm:max-w-80 md:max-w-96 p-0 bg-card border border-border shadow-lg z-50"
        sideOffset={6}
        align="center"
        alignOffset={0}
        avoidCollisions={true}
        collisionPadding={8}
      >
        <div className="p-3 sm:p-4 space-y-3">
          {/* Header with date and status */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="space-y-1">
              <div className="text-sm font-semibold text-foreground">
                {getRelativeDayIndonesian(date)}, {format(date, "d MMMM yyyy")}
              </div>
              <div className="text-xs text-muted-foreground">
                {dateStatus === "available" && "✅ Tersedia untuk pemesanan"}
                {dateStatus === "booked" && "🚫 Tidak tersedia"}
                {dateStatus === "completed" && "✅ Selesai"}
                {dateStatus === "past" && "📅 Tanggal lampau"}
                {dateStatus === "today" &&
                  (dayReservations.length === 0
                    ? "📅 Hari ini - Tersedia"
                    : "📅 Hari ini - Ada reservasi")}
              </div>
            </div>
            {dayReservations.length > 0 && (
              <div className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                {dayReservations.length}{" "}
                {dayReservations.length === 1 ? "reservasi" : "reservasi"} pada
                hari ini
              </div>
            )}
          </div>

          {/* Reservations list */}
          {dayReservations.length > 0 && (
            <div className="space-y-3">
              {dayReservations.slice(0, 3).map((reservation, index) => (
                <div
                  key={reservation.id || index}
                  className="flex items-start gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
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
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-medium text-foreground truncate">
                        {reservation.title}
                      </div>
                      {getStatusBadge(reservation.status)}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span className="truncate">{reservation.user.name}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatTimeRangeIndonesian(
                          new Date(reservation.startTime),
                          new Date(reservation.endTime)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {dayReservations.length > 3 && (
                <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border bg-muted/20 rounded px-2 py-1">
                  +{dayReservations.length - 3} reservasi lainnya pada hari ini
                  <div className="text-xs text-muted-foreground/70 mt-1">
                    Total: {dayReservations.length} reservasi
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action hint */}
          {getActionHint() && (
            <div className="pt-2 border-t border-border">{getActionHint()}</div>
          )}

          {/* Empty state for available dates */}
          {dayReservations.length === 0 && dateStatus === "available" && (
            <div className="text-center py-3 space-y-2">
              <div className="text-lg">📅</div>
              <div className="text-sm text-muted-foreground">
                Tidak ada pemesanan pada tanggal ini
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                Tersedia untuk dipesan
              </div>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// Enhanced Legend component with better descriptions and interactivity
function CalendarLegend() {
  const legendItems = [
    {
      id: "available",
      icon: CheckCircle,
      label: "Tersedia",
      className: "text-green-600 dark:text-green-400",
      indicator:
        "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-600",
      description: "Siap untuk dipesan",
      actionHint: "Klik tanggal untuk melihat opsi pemesanan",
      emoji: "✅",
    },
    {
      id: "booked",
      icon: XCircle,
      label: "Dipesan",
      className: "text-red-600 dark:text-red-400",
      indicator:
        "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-600",
      description: "Ruangan tidak tersedia",
      actionHint: "Arahkan mouse untuk melihat detail reservasi",
      emoji: "🚫",
    },
    {
      id: "completed",
      icon: CheckCircle,
      label: "Selesai",
      className: "text-blue-700 dark:text-blue-400",
      indicator: "bg-blue-600/10 border-blue-400/30",
      description: "Reservasi telah selesai",
      actionHint: "Arahkan mouse untuk melihat riwayat",
      emoji: "✅",
    },
    {
      id: "today",
      icon: Clock,
      label: "Hari Ini",
      className: "text-cyan-600 dark:text-cyan-400",
      indicator:
        "bg-cyan-100 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-600",
      description: "Tanggal saat ini",
      actionHint: "Cek ketersediaan untuk hari ini",
      emoji: "📅",
    },
  ];

  return (
    <div className="w-full mt-6 p-5 bg-gradient-to-r from-muted/40 to-background/60 rounded-xl border border-border/60 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-primary/10 rounded-lg">
          <CalendarIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <span className="text-base font-semibold text-foreground">
            Panduan Kalender
          </span>
          <p className="text-xs text-muted-foreground mt-1">
            Arahkan mouse ke tanggal untuk melihat detail lengkap
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {legendItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border/30 bg-card/50 hover:bg-card/80 hover:border-border/60 transition-all duration-200 group cursor-help"
              title={item.actionHint}
            >
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={cn(
                    "h-4 w-4 rounded-sm border transition-all duration-200",
                    "group-hover:scale-110 group-hover:shadow-sm",
                    item.indicator
                  )}
                />
                <span className="text-base">{item.emoji}</span>
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <IconComponent className={cn("h-4 w-4", item.className)} />
                  <span className={cn("text-sm font-semibold", item.className)}>
                    {item.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                <p className="text-xs text-muted-foreground/80 italic">
                  {item.actionHint}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional tips */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <div className="text-blue-500 mt-0.5">💡</div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            <span className="font-medium">Tips:</span> Gunakan tombol keyboard
            untuk navigasi yang lebih mudah. Tekan Tab untuk berpindah antar
            tanggal, Enter atau Spasi untuk membuka tooltip.
          </div>
        </div>
      </div>
    </div>
  );
}

export function RoomAvailabilityCalendar({
  reservations,
}: RoomAvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [hoveredDate, setHoveredDate] = React.useState<Date | null>(null);

  // Calculate the set of blocked days (only APPROVED reservations block availability)
  const bookedDays = React.useMemo(() => {
    const days = new Set<number>();

    reservations
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
  }, [reservations]);

  // Calculate the set of completed days (for visual indication only)
  const completedDays = React.useMemo(() => {
    const days = new Set<number>();

    reservations
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
  }, [reservations]);

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

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex flex-col w-full">
      {/* Enhanced Calendar Container */}
      <div className="relative w-full p-4 sm:p-6 rounded-xl bg-gradient-to-br from-card via-card to-muted/20 border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousMonth}
            className="h-8 w-8 p-0 hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <button
              onClick={goToToday}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Ke hari ini
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextMonth}
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

            const dateButton = (
              <button
                key={date.toISOString()}
                className={cn(
                  "relative aspect-square min-h-10 sm:min-h-12 w-full p-0 font-normal text-sm sm:text-base rounded-lg",
                  "transition-all duration-200 flex items-center justify-center",
                  "hover:bg-accent/50 hover:text-accent-foreground",
                  "focus:bg-accent focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  // Base styles for month context
                  !isCurrentMonth && "text-muted-foreground/50 opacity-50",
                  // Status-specific styles
                  dateStatus === "today" && [
                    "bg-primary text-primary-foreground font-bold",
                    "ring-2 ring-primary ring-offset-2 ring-offset-background",
                    "hover:bg-primary/90",
                    isCurrentMonth && "animate-pulse hover:animate-none",
                  ],
                  dateStatus === "booked" && [
                    "bg-destructive/10 text-destructive",
                    "border border-destructive/30 cursor-pointer",
                    "hover:bg-destructive/20 hover:border-destructive/50",
                    "relative after:absolute after:inset-0 after:flex after:items-center after:justify-center",
                    "after:text-xs after:font-bold after:text-destructive/60 after:content-['●']",
                    "after:top-1 after:right-1 after:w-2 after:h-2",
                  ],
                  dateStatus === "completed" && [
                    "bg-blue-600/10 text-blue-700 dark:text-blue-400",
                    "border border-blue-400/30 cursor-pointer",
                    "hover:bg-blue-600/20 hover:border-blue-500/50",
                    "relative after:absolute after:inset-0 after:flex after:items-center after:justify-center",
                    "after:text-xs after:font-bold after:text-blue-600/60 after:content-['✓']",
                    "after:top-1 after:right-1 after:w-2 after:h-2",
                  ],
                  dateStatus === "available" && [
                    "bg-green-500/10 text-green-600 dark:text-green-400",
                    "border border-green-300/30 dark:border-green-600/30",
                    "hover:bg-green-500/20 hover:scale-105",
                  ],
                  dateStatus === "past" && [
                    "text-muted-foreground/50 cursor-not-allowed",
                  ]
                )}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
                disabled={dateStatus === "past"}
                aria-label={
                  dateStatus === "booked"
                    ? `${format(date, "d MMMM yyyy")} - Ruangan dipesan, tekan untuk melihat detail`
                    : dateStatus === "completed"
                      ? `${format(date, "d MMMM yyyy")} - Reservasi selesai, tekan untuk melihat detail`
                      : dateStatus === "available"
                        ? `${format(date, "d MMMM yyyy")} - Tersedia untuk pemesanan, tekan untuk melihat opsi`
                        : dateStatus === "today"
                          ? `${format(date, "d MMMM yyyy")} - Hari ini, ${isBooked ? "dipesan" : "tersedia untuk pemesanan"}`
                          : `${format(date, "d MMMM yyyy")} - Tanggal lampau`
                }
                role="button"
                tabIndex={dateStatus === "past" ? -1 : 0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    // Focus handling for keyboard navigation
                    (e.target as HTMLElement).click();
                  }
                }}
              >
                {format(date, "d")}
              </button>
            );

            // Wrap all dates with enhanced tooltip (available dates now get tooltips too)
            return (
              <DateTooltip
                key={date.toISOString()}
                reservations={reservations}
                date={date}
                dateStatus={dateStatus}
              >
                {dateButton}
              </DateTooltip>
            );
          })}
        </div>
      </div>

      {/* Enhanced Legend */}
      <CalendarLegend />

      {/* Summary Statistics */}
      <div className="w-full mt-4 p-4 bg-muted/30 rounded-lg border border-border/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="text-xl font-bold text-destructive">
              {bookedDays.length}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Hari Dipesan
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              {reservations.filter((r) => r.status === "Approved").length}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Aktif
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {reservations.filter((r) => r.status === "Completed").length}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Selesai
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

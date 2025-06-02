"use client";

import * as React from "react";
import { type ApprovedReservationTime } from "../../reservations/api/getApprovedRoomReservations";
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
} from "date-fns";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoomAvailabilityCalendarProps {
  approvedReservations: ApprovedReservationTime[];
}

// Legend component for better organization
function CalendarLegend() {
  const legendItems = [
    {
      id: "available",
      icon: CheckCircle,
      label: "Available",
      className: "text-green-600 dark:text-green-400",
      indicator:
        "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-600",
      description: "Open for booking",
    },
    {
      id: "booked",
      icon: XCircle,
      label: "Reserved",
      className: "text-red-600 dark:text-red-400",
      indicator:
        "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-600",
      description: "Not available",
    },
    {
      id: "today",
      icon: Clock,
      label: "Today",
      className: "text-blue-600 dark:text-blue-400",
      indicator:
        "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600",
      description: "Current date",
    },
  ];

  return (
    <div className="w-full mt-6 p-4 bg-gradient-to-r from-muted/30 to-background/50 rounded-lg border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <CalendarIcon className="h-5 w-5 text-primary" />
        <span className="text-base font-medium text-foreground">
          Calendar Legend
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {legendItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} className="flex items-center gap-3 group">
              <div
                className={cn(
                  "h-4 w-4 rounded-sm border transition-all duration-200",
                  "group-hover:scale-110 group-hover:shadow-sm",
                  item.indicator
                )}
              />
              <div className="flex items-center gap-2">
                <IconComponent className={cn("h-4 w-4", item.className)} />
                <div className="flex flex-col">
                  <span className={cn("text-sm font-medium", item.className)}>
                    {item.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RoomAvailabilityCalendar({
  approvedReservations,
}: RoomAvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [hoveredDate, setHoveredDate] = React.useState<Date | null>(null);

  // Calculate the set of booked days
  const bookedDays = React.useMemo(() => {
    const days = new Set<number>();

    approvedReservations.forEach((reservation) => {
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

  const isDateAvailable = (date: Date) => {
    return !isDateBooked(date) && date >= today;
  };

  const getDateStatus = (date: Date) => {
    if (isToday(date)) return "today";
    if (isDateBooked(date)) return "booked";
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
              Go to today
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

            return (
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
                    "bg-destructive/10 text-destructive line-through",
                    "border border-destructive/30 cursor-not-allowed opacity-70",
                    "hover:bg-destructive/20",
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
                disabled={dateStatus === "booked" || dateStatus === "past"}
              >
                {format(date, "d")}
              </button>
            );
          })}
        </div>

        {/* Hover Tooltip */}
        {hoveredDate && (
          <div className="absolute top-3 left-3 right-3 bg-popover border border-border rounded-lg p-3 shadow-lg z-10 animate-in fade-in-0 duration-150">
            <div className="text-sm text-center">
              <div className="font-medium text-popover-foreground">
                {hoveredDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="text-muted-foreground mt-1">
                {isDateBooked(hoveredDate) ? (
                  <span className="text-destructive">❌ Reserved</span>
                ) : isToday(hoveredDate) ? (
                  <span className="text-primary">📅 Today</span>
                ) : hoveredDate >= today ? (
                  <span className="text-green-600 dark:text-green-400">
                    ✅ Available
                  </span>
                ) : (
                  <span className="text-muted-foreground">📅 Past Date</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Legend */}
      <CalendarLegend />

      {/* Summary Statistics */}
      <div className="w-full mt-4 p-4 bg-muted/30 rounded-lg border border-border/30">
        <div className="grid grid-cols-2 gap-6 text-center">
          <div className="space-y-2">
            <div className="text-xl font-bold text-destructive">
              {bookedDays.length}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Reserved Days
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              {approvedReservations.length}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Active Bookings
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

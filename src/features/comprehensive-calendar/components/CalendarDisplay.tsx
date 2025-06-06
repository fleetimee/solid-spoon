"use client";

import React, { useMemo } from "react";
import { ComprehensiveReservation } from "../api/getComprehensiveReservations";
import { Badge } from "@/components/ui/badge";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-500/80 text-white border-green-600";
    case "PENDING":
      return "bg-yellow-500/80 text-white border-yellow-600";
    case "REJECTED":
      return "bg-red-500/80 text-white border-red-600";
    case "CANCELLED":
      return "bg-gray-500/80 text-white border-gray-600";
    default:
      return "bg-blue-500/80 text-white border-blue-600";
  }
};

// Helper function to format time for display
const formatTime = (date: Date) => {
  return format(date, "HH:mm");
};

// WeekView Component Props
interface WeekViewProps {
  reservations: ComprehensiveReservation[];
  startDate: Date;
  endDate: Date;
  onReservationClick?: (reservation: ComprehensiveReservation) => void;
}

// WeekView Component
function WeekView({
  reservations,
  startDate,
  endDate,
  onReservationClick,
}: WeekViewProps) {
  const isMobile = useIsMobile();

  const weekDays = useMemo(() => {
    const days = [];
    let currentDay = new Date(startDate);

    // Generate 7 days starting from Monday
    for (let i = 0; i < 7; i++) {
      days.push(new Date(currentDay));
      currentDay = addDays(currentDay, 1);
    }

    return days;
  }, [startDate]);

  // Group reservations by date and time, handling multi-day events
  const reservationsByDate = useMemo(() => {
    const grouped: { [key: string]: ComprehensiveReservation[] } = {};

    reservations.forEach((reservation) => {
      const startDate = new Date(reservation.start_time);
      const endDate = new Date(reservation.end_time);

      // Check if reservation spans multiple days
      const startDateKey = format(startDate, "yyyy-MM-dd");
      const endDateKey = format(endDate, "yyyy-MM-dd");

      if (startDateKey === endDateKey) {
        // Single day event
        if (!grouped[startDateKey]) {
          grouped[startDateKey] = [];
        }
        grouped[startDateKey].push(reservation);
      } else {
        // Multi-day event - split into segments for each day
        const currentDate = new Date(startDate);
        currentDate.setHours(
          startDate.getHours(),
          startDate.getMinutes(),
          0,
          0
        );

        while (currentDate <= endDate) {
          const dateKey = format(currentDate, "yyyy-MM-dd");

          // Only process dates within the current week view
          const isInWeekRange = weekDays.some(
            (weekDay) => format(weekDay, "yyyy-MM-dd") === dateKey
          );

          if (isInWeekRange) {
            if (!grouped[dateKey]) {
              grouped[dateKey] = [];
            }

            // Create a segment for this day
            const segmentStart = new Date(
              Math.max(currentDate.getTime(), startDate.getTime())
            );
            const dayEnd = new Date(currentDate);
            dayEnd.setHours(23, 59, 59, 999);
            const segmentEnd = new Date(
              Math.min(dayEnd.getTime(), endDate.getTime())
            );

            // Create a reservation segment for this day
            const segment: ComprehensiveReservation = {
              ...reservation,
              start_time: segmentStart,
              end_time: segmentEnd,
              id: `${reservation.id}-${dateKey}`, // Unique ID for each segment
            };

            grouped[dateKey].push(segment);
          }

          // Move to next day
          currentDate.setDate(currentDate.getDate() + 1);
          currentDate.setHours(0, 0, 0, 0);
        }
      }
    });

    // Sort reservations within each day by start time
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort(
        (a, b) => a.start_time.getTime() - b.start_time.getTime()
      );
    });

    return grouped;
  }, [reservations, weekDays]);

  // Generate hour slots (24 hours)
  const hourSlots = useMemo(() => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push(hour);
    }
    return slots;
  }, []);

  // Calculate position and height for reservations with collision detection
  const getReservationStyle = (
    reservation: ComprehensiveReservation,
    dayReservations: ComprehensiveReservation[],
    index: number
  ) => {
    const startHour = reservation.start_time.getHours();
    const startMinute = reservation.start_time.getMinutes();

    // Mobile uses smaller hour height (40px vs 60px)
    const hourHeight = isMobile ? 40 : 60;
    const top = startHour * hourHeight + (startMinute / 60) * hourHeight;

    // Calculate height based on duration
    const durationMinutes =
      (reservation.end_time.getTime() - reservation.start_time.getTime()) /
      (1000 * 60);
    const minHeight = isMobile ? 24 : 30; // Smaller minimum height on mobile
    const height = Math.max((durationMinutes / 60) * hourHeight, minHeight);

    // Handle overlapping reservations
    const overlapping = dayReservations.filter((other, otherIndex) => {
      if (otherIndex >= index) return false; // Only check previous reservations
      return (
        reservation.start_time < other.end_time &&
        reservation.end_time > other.start_time
      );
    });

    const leftOffset = overlapping.length * 2; // Offset each overlapping reservation

    return {
      top: `${top}px`,
      height: `${height}px`,
      left: `${4 + leftOffset}px`,
      right: `${4 + leftOffset}px`,
      width: `calc(100% - ${8 + leftOffset * 2}px)`,
      zIndex: 10 + index,
    };
  };

  // Get current time indicator position
  const getCurrentTimePosition = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const hourHeight = isMobile ? 40 : 60;
    return currentHour * hourHeight + (currentMinute / 60) * hourHeight;
  };

  const currentTimePosition = getCurrentTimePosition();
  const isTodayDate = (date: Date) => {
    const today = new Date();
    return format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
  };

  // Auto-scroll to current time or 9 AM
  React.useEffect(() => {
    const scrollContainer = document.querySelector(".week-grid-scroll");
    if (scrollContainer) {
      const now = new Date();
      const currentHour = now.getHours();
      const hourHeight = isMobile ? 40 : 60;
      const scrollPosition = Math.max(0, (currentHour - 2) * hourHeight); // Scroll to 2 hours before current time
      scrollContainer.scrollTop = scrollPosition;
    }
  }, [isMobile]);

  return (
    <div
      className={cn(
        "h-full flex flex-col bg-background",
        isMobile && "touch-pan-y"
      )}
    >
      {/* Week Header */}
      <div
        className={cn(
          "flex border-b bg-muted/30 sticky top-0 z-30",
          isMobile && "min-w-max"
        )}
      >
        {/* Time column header */}
        <div
          className={cn(
            "border-r bg-background flex items-center justify-center",
            isMobile ? "w-12" : "w-20"
          )}
        >
          <span
            className={cn(
              "text-muted-foreground",
              isMobile ? "text-xs" : "text-xs"
            )}
          >
            {isMobile ? "GMT" : "GMT+7"}
          </span>
        </div>

        {/* Day headers */}
        {weekDays.map((day) => {
          const isDayToday = isTodayDate(day);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "text-center border-r",
                isMobile ? "flex-1 min-w-[60px] p-2" : "flex-1 p-3"
              )}
            >
              <div
                className={cn(
                  "text-muted-foreground uppercase font-medium",
                  isMobile ? "text-xs" : "text-xs"
                )}
              >
                {format(day, isMobile ? "EEEEE" : "EEE")}
              </div>
              <div
                className={cn(
                  "font-medium mt-1 mx-auto rounded-full flex items-center justify-center",
                  isMobile ? "text-lg w-6 h-6" : "text-2xl w-8 h-8",
                  isDayToday && "bg-blue-600 text-white"
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      {/* Week Grid */}
      <div
        className={cn(
          "flex-1 overflow-auto week-grid-scroll",
          isMobile ? "flex min-w-max" : "flex"
        )}
      >
        {/* Time labels column */}
        <div
          className={cn(
            "border-r bg-background/95 sticky left-0 z-20",
            isMobile ? "w-12" : "w-20"
          )}
        >
          {hourSlots.map((hour) => (
            <div
              key={hour}
              className={cn(
                "border-b text-muted-foreground flex items-start justify-end relative",
                isMobile ? "h-[40px] pr-1 text-xs" : "h-[60px] pr-2 text-xs"
              )}
            >
              {hour > 0 && (
                <span
                  className={cn(
                    "absolute bg-background",
                    isMobile
                      ? "-top-1 right-1 px-0.5 text-xs"
                      : "-top-2 right-2 px-1"
                  )}
                >
                  {isMobile
                    ? hour.toString().padStart(2, "0")
                    : `${hour.toString().padStart(2, "0")}:00`}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Days columns */}
        <div className={cn("flex", isMobile ? "flex-1 min-w-max" : "flex-1")}>
          {weekDays.map((day, dayIndex) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayReservations = reservationsByDate[dateKey] || [];
            const isDayToday = isTodayDate(day);

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "relative border-r",
                  isMobile ? "min-w-[60px] flex-1" : "flex-1"
                )}
              >
                {/* Hour grid lines */}
                {hourSlots.map((hour) => (
                  <div
                    key={hour}
                    className={cn(
                      "border-b",
                      isMobile ? "h-[40px]" : "h-[60px]",
                      hour % 2 === 0
                        ? "border-gray-200 dark:border-gray-700"
                        : "border-gray-100 dark:border-gray-800"
                    )}
                  />
                ))}

                {/* Today background highlight */}
                {isDayToday && (
                  <div className="absolute inset-0 bg-blue-50/30 dark:bg-blue-950/10 pointer-events-none" />
                )}

                {/* Current time indicator */}
                {isDayToday && (
                  <>
                    <div
                      className="absolute left-0 right-0 h-0.5 bg-red-500 z-20"
                      style={{ top: `${currentTimePosition}px` }}
                    >
                      <div className="w-3 h-3 bg-red-500 rounded-full -ml-1.5 -mt-1"></div>
                    </div>
                    <div
                      className="absolute left-0 w-full h-px bg-red-500/30 z-10"
                      style={{ top: `${currentTimePosition}px` }}
                    />
                  </>
                )}

                {/* Reservations for this day */}
                {dayReservations.map((reservation, index) => {
                  const style = getReservationStyle(
                    reservation,
                    dayReservations,
                    index
                  );

                  // Check if this is a multi-day segment
                  const isMultiDaySegment = reservation.id.includes("-");
                  const originalReservation = reservations.find(
                    (r) => r.id === reservation.id.split("-")[0]
                  );
                  const isStartOfMultiDay =
                    isMultiDaySegment &&
                    format(reservation.start_time, "HH:mm") ===
                      format(
                        originalReservation?.start_time ||
                          reservation.start_time,
                        "HH:mm"
                      );
                  const isEndOfMultiDay =
                    isMultiDaySegment &&
                    format(reservation.end_time, "HH:mm") ===
                      format(
                        originalReservation?.end_time || reservation.end_time,
                        "HH:mm"
                      );

                  return (
                    <div
                      key={reservation.id}
                      className={cn(
                        "absolute cursor-pointer transition-all text-white border-l-4",
                        isMobile
                          ? "p-1 touch-manipulation min-h-[44px] active:scale-95"
                          : "p-2 hover:shadow-lg hover:scale-[1.02]",
                        getStatusColor(reservation.status),
                        // Different rounding for multi-day segments
                        isMultiDaySegment
                          ? isStartOfMultiDay && isEndOfMultiDay
                            ? "rounded-lg" // Single day that happens to be part of multi-day
                            : isStartOfMultiDay
                              ? "rounded-l-lg rounded-r-none" // Start of multi-day
                              : isEndOfMultiDay
                                ? "rounded-r-lg rounded-l-none" // End of multi-day
                                : "rounded-none" // Middle of multi-day
                          : "rounded-lg" // Regular single-day event
                      )}
                      style={style}
                      onClick={() =>
                        onReservationClick?.(originalReservation || reservation)
                      }
                      title={`${reservation.room_name} - ${reservation.user_name}\n${formatTime(reservation.start_time)} - ${formatTime(reservation.end_time)}\n${reservation.title || "No title"}${isMultiDaySegment ? "\n(Multi-day event)" : ""}`}
                    >
                      <div
                        className={cn(
                          "font-semibold truncate flex items-center gap-1",
                          isMobile ? "text-xs" : "text-xs"
                        )}
                      >
                        {/* Show indicators for multi-day segments */}
                        {isMultiDaySegment && !isStartOfMultiDay && (
                          <span className="opacity-75">←</span>
                        )}
                        <span className="truncate">
                          {isMobile
                            ? reservation.room_name.substring(0, 8)
                            : reservation.room_name}
                        </span>
                        {isMultiDaySegment && !isEndOfMultiDay && (
                          <span className="opacity-75">→</span>
                        )}
                      </div>
                      <div
                        className={cn(
                          "opacity-90 truncate",
                          isMobile ? "text-xs" : "text-xs"
                        )}
                      >
                        {formatTime(reservation.start_time)}
                        {!isMobile && ` - ${formatTime(reservation.end_time)}`}
                      </div>
                      {reservation.title && !isMobile && (
                        <div className="text-xs opacity-80 truncate">
                          {reservation.title}
                        </div>
                      )}
                      {!isMobile && (
                        <div className="text-xs opacity-75 truncate">
                          {reservation.user_name}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface CalendarDisplayProps {
  reservations: ComprehensiveReservation[];
  startDate: Date;
  endDate: Date;
  view: "month" | "week";
  onReservationClick?: (reservation: ComprehensiveReservation) => void;
}

export function CalendarDisplay({
  reservations,
  startDate,
  endDate,
  view,
  onReservationClick,
}: CalendarDisplayProps) {
  const isMobile = useIsMobile();

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(startDate);
    const monthEnd = endOfMonth(startDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Start on Sunday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days = [];
    let currentDay = calendarStart;

    while (currentDay <= calendarEnd) {
      days.push(new Date(currentDay));
      currentDay = addDays(currentDay, 1);
    }

    return days;
  }, [startDate]);

  // Group reservations by date
  const reservationsByDate = useMemo(() => {
    const grouped: { [key: string]: ComprehensiveReservation[] } = {};

    reservations.forEach((reservation) => {
      const dateKey = format(reservation.start_time, "yyyy-MM-dd");
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(reservation);
    });

    // Sort reservations within each day by start time
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort(
        (a, b) => a.start_time.getTime() - b.start_time.getTime()
      );
    });

    return grouped;
  }, [reservations]);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (view === "week") {
    return (
      <WeekView
        reservations={reservations}
        startDate={startDate}
        endDate={endDate}
        onReservationClick={onReservationClick}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Calendar Header - Days of the week */}
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {weekdays.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr border-l border-t">
        {calendarDays.map((day, index) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayReservations = reservationsByDate[dateKey] || [];
          const isCurrentMonth = isSameMonth(day, startDate);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "border-r border-b overflow-hidden relative transition-colors",
                isMobile
                  ? "p-1 min-h-20 active:bg-muted/30"
                  : "p-3 min-h-36 hover:bg-muted/20",
                !isCurrentMonth && "bg-muted/20",
                isCurrentDay && "bg-blue-50 dark:bg-blue-950/20",
                index % 7 === 6 && "border-r-0" // Remove right border from last column
              )}
            >
              {/* Date number */}
              <div
                className={cn(
                  "flex items-center justify-between",
                  isMobile ? "mb-1" : "mb-2"
                )}
              >
                <span
                  className={cn(
                    "font-medium flex items-center justify-center rounded-full",
                    isMobile ? "text-xs w-5 h-5" : "text-sm w-6 h-6",
                    !isCurrentMonth && "text-muted-foreground",
                    isCurrentDay && "bg-blue-600 text-white"
                  )}
                >
                  {format(day, "d")}
                </span>
                {dayReservations.length > 0 && (
                  <span
                    className={cn(
                      "text-muted-foreground",
                      isMobile ? "text-xs" : "text-xs"
                    )}
                  >
                    {isMobile && dayReservations.length > 2
                      ? `${dayReservations.length}`
                      : dayReservations.length}
                  </span>
                )}
              </div>

              {/* Reservations for this day */}
              <div className={cn(isMobile ? "space-y-0.5" : "space-y-1.5")}>
                {dayReservations
                  .slice(0, isMobile ? 2 : 3)
                  .map((reservation) => (
                    <div
                      key={reservation.id}
                      onClick={() => onReservationClick?.(reservation)}
                      className={cn(
                        "rounded-md cursor-pointer transition-all border-l-3",
                        isMobile
                          ? "text-xs p-1 touch-manipulation active:scale-95"
                          : "text-xs p-2 hover:shadow-sm",
                        getStatusColor(reservation.status)
                      )}
                      title={`${reservation.room_name} - ${reservation.user_name}\n${formatTime(reservation.start_time)} - ${formatTime(reservation.end_time)}\n${reservation.title || "No title"}`}
                    >
                      <div className="font-medium truncate">
                        {isMobile
                          ? reservation.room_name.substring(0, 8)
                          : reservation.room_name}
                      </div>
                      {!isMobile && (
                        <div className="truncate opacity-90">
                          {formatTime(reservation.start_time)} -{" "}
                          {formatTime(reservation.end_time)}
                        </div>
                      )}
                      {reservation.title && !isMobile && (
                        <div className="truncate opacity-80">
                          {reservation.title}
                        </div>
                      )}
                    </div>
                  ))}

                {/* Show "+X more" if there are more reservations */}
                {dayReservations.length > (isMobile ? 2 : 3) && (
                  <div
                    className={cn(
                      "text-muted-foreground cursor-pointer",
                      isMobile
                        ? "text-xs touch-manipulation active:text-foreground"
                        : "text-xs hover:text-foreground"
                    )}
                  >
                    +{dayReservations.length - (isMobile ? 2 : 3)} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

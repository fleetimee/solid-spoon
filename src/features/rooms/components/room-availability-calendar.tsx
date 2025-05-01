"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { type ApprovedReservationTime } from "../../reservations/api/getApprovedRoomReservations"; // Corrected import path
import { eachDayOfInterval, startOfDay } from "date-fns"; // Import date-fns utilities

interface RoomAvailabilityCalendarProps {
  approvedReservations: ApprovedReservationTime[];
}

export function RoomAvailabilityCalendar({
  approvedReservations,
}: RoomAvailabilityCalendarProps) {
  // Calculate the set of booked days
  const bookedDays = React.useMemo(() => {
    const days = new Set<number>(); // Use Set for efficient storage of timestamps

    approvedReservations.forEach((reservation) => {
      // Ensure start and end are Date objects (should be from the API)
      const start = new Date(reservation.startTime);
      const end = new Date(reservation.endTime);

      // Generate all days within the interval, inclusive
      // Use startOfDay to ensure we capture the full day regardless of time
      const intervalDays = eachDayOfInterval({
        start: startOfDay(start),
        end: startOfDay(end),
      });

      intervalDays.forEach((day) => {
        days.add(day.getTime()); // Add the timestamp to the Set
      });
    });

    // Convert timestamps back to Date objects for the modifier
    return Array.from(days).map((timestamp) => new Date(timestamp));
  }, [approvedReservations]);

  // Define the modifier for react-day-picker
  const modifiers = {
    booked: bookedDays,
  };

  // Define styles for the booked modifier
  const modifiersStyles = {
    booked: {
      // Example styling: greyed out and strikethrough
      color: "hsl(var(--muted-foreground))",
      textDecoration: "line-through",
      opacity: 0.6,
      cursor: "not-allowed", // Indicate non-interactivity
    },
  };

  return (
    // Remove w-fit, add flex and centering classes
    <div className="flex flex-col items-center justify-center rounded-md border bg-card p-4">
      <Calendar
        mode="single" // Display a single month
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        // Disable selection as this is read-only
        disabled={(date) => {
          // Check if the date (at start of day) is in the bookedDays set
          const dateTimestamp = startOfDay(date).getTime();
          return bookedDays.some(
            (bookedDay) => bookedDay.getTime() === dateTimestamp
          );
        }}
        // Prevent navigation to past months (optional)
        fromDate={startOfDay(new Date())}
        className="p-0" // Remove default padding if needed
        // Add other props as needed, e.g., showOutsideDays
      />
      {/* Add Legend */}
      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span
          className="inline-block h-3 w-3 rounded-sm"
          style={{
            // Match the booked style (adjust if needed)
            backgroundColor: "hsl(var(--muted-foreground) / 0.2)", // Example background
            textDecoration: "line-through", // Add strikethrough if used in modifier
            border: "1px solid hsl(var(--muted-foreground) / 0.4)",
          }}
        ></span>
        <span>Unavailable / Booked</span>
      </div>
    </div>
  );
}

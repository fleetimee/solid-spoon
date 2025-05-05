"use client";

import React, { useMemo } from "react";
import { ComprehensiveReservation } from "../api/getComprehensiveReservations";
import {
  Calendar,
  CalendarEvent,
  CalendarMonthView,
  // Import other views like CalendarWeekView, CalendarDayView if needed
} from "@/components/ui/full-calendar";
import { Card, CardContent } from "@/components/ui/card"; // Keep Card for structure if needed

interface CalendarDisplayProps {
  reservations: ComprehensiveReservation[];
  startDate: Date;
  endDate: Date;
  // TODO: Define and pass down event handlers if needed
  // onEventClick?: (event: CalendarEvent) => void;
}

// Helper to map reservation status to event color (optional)
const getEventColor = (status: string): CalendarEvent["color"] | undefined => {
  switch (status) {
    case "APPROVED":
      return "green";
    case "PENDING":
      return "blue";
    case "REJECTED":
    case "CANCELLED":
      return "pink"; // Or another color like 'red' if available
    default:
      return "default";
  }
};

export function CalendarDisplay({
  reservations,
  startDate,
  endDate, // endDate might be used for view range control later
}: // onEventClick, // TODO: Receive handler from parent
CalendarDisplayProps) {
  // Add this after the component function signature
  if (!Array.isArray(reservations)) {
    console.error(
      "CalendarDisplay received non-array reservations:",
      reservations
    );
    // This might indicate an issue upstream with how the promise resolves or is passed.
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading reservations or encountered an error...
      </div>
    );
  }
  const calendarEvents = useMemo((): CalendarEvent[] => {
    return reservations.map((res) => ({
      id: res.id.toString(), // Ensure ID is a string
      start: new Date(res.start_time), // Ensure start is a Date object
      end: new Date(res.end_time), // Ensure end is a Date object
      title: `${res.room_name} (${res.user_name})${res.title ? `: ${res.title}` : ""}`,
      color: getEventColor(res.status),
      // You can add more custom data here if needed,
      // but FullCalendar's base event type doesn't store it directly.
      // You might need to use onEventClick to fetch details based on ID.
    }));
  }, [reservations]);

  // TODO: Implement event click handler
  const handleEventClick = (event: CalendarEvent) => {
    console.log("Event clicked:", event);
    // Find original reservation data if needed using event.id
    // Trigger modal or side panel with details
    // onEventClick?.(event);
  };

  if (reservations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No reservations found for the selected period and filters.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Calendar
      events={calendarEvents}
      defaultDate={startDate}
      view="month" // Default to month view, can be made dynamic
      onEventClick={handleEventClick} // TODO: Pass actual handler
      // locale={...} // Pass locale if needed
      // enableHotkeys={false} // Disable default hotkeys if they conflict
    >
      {/* Render the desired view component */}
      <div className="h-[70vh] p-4 border rounded-md">
        {" "}
        {/* Add height and styling */}
        <CalendarMonthView />
        {/* <CalendarWeekView /> */}
        {/* <CalendarDayView /> */}
      </div>
    </Calendar>
  );
}

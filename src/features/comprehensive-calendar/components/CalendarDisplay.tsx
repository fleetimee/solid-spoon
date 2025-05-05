"use client";

import React from "react";
import { ComprehensiveReservation } from "../api/getComprehensiveReservations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CalendarDisplayProps {
  reservations: ComprehensiveReservation[];
  startDate: Date; // For context, might not be directly used in list view
  endDate: Date; // For context, might not be directly used in list view
  // Add handlers for clicking/hovering events if needed
}

// Helper function to format dates for display
const formatDisplayDateTime = (date: Date): string => {
  return date.toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
};

export function CalendarDisplay({
  reservations,
  startDate,
  endDate,
}: CalendarDisplayProps) {
  // TODO: Replace this list with an actual calendar grid implementation
  // (e.g., using react-big-calendar, FullCalendar, or a custom grid)

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
    <Card>
      <CardHeader>
        <CardTitle>Reservations (List Placeholder)</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {reservations.map((res) => (
            <li
              key={res.id}
              className="p-3 border rounded-md flex justify-between items-center bg-muted/50"
            >
              <div>
                <p className="font-semibold">{res.room_name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDisplayDateTime(res.start_time)} -{" "}
                  {formatDisplayDateTime(res.end_time)}
                </p>
                <p className="text-sm">User: {res.user_name}</p>
                {res.title && (
                  <p className="text-sm italic">Title: {res.title}</p>
                )}
              </div>
              <Badge
                variant={
                  res.status === "APPROVED"
                    ? "default"
                    : res.status === "PENDING"
                      ? "secondary"
                      : "destructive"
                }
              >
                {res.status}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

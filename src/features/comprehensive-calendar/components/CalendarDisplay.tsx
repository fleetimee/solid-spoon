"use client";

import React from "react";
import { ComprehensiveReservation } from "../api/getComprehensiveReservations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CalendarDisplayProps {
  reservations: ComprehensiveReservation[];
  startDate: Date; // Keep for potential future use or context
  endDate: Date; // Keep for potential future use or context
}

// Helper function to format date/time for display
const formatDisplayDateTime = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "Invalid Date";
  }
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export function CalendarDisplay({
  reservations,
  startDate, // Not directly used in list view, but kept for prop consistency
  endDate, // Not directly used in list view, but kept for prop consistency
}: CalendarDisplayProps) {
  // Handle potential non-array input (good practice)
  if (!Array.isArray(reservations)) {
    console.error(
      "CalendarDisplay received non-array reservations:",
      reservations
    );
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Loading reservations or encountered an error...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>
          Reservations ({startDate.toLocaleDateString()} -{" "}
          {endDate.toLocaleDateString()})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reservations.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No reservations found for the selected period.
          </p>
        ) : (
          <ul className="space-y-3">
            {reservations.map((res) => (
              <li
                key={res.id}
                className="p-3 border rounded-md flex justify-between items-center bg-muted/50"
              >
                <div>
                  <p className="font-semibold">{res.room_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDisplayDateTime(new Date(res.start_time))} -{" "}
                    {formatDisplayDateTime(new Date(res.end_time))}
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
        )}
      </CardContent>
    </Card>
  );
}

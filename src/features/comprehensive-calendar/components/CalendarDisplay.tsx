"use client";

import React from "react";
import { ComprehensiveReservation } from "../api/getComprehensiveReservations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Clock, Building } from "lucide-react";

interface CalendarDisplayProps {
  reservations: ComprehensiveReservation[];
  startDate: Date; // Keep for potential future use or context
  endDate: Date; // Keep for potential future use or context
  onReservationClick?: (reservation: ComprehensiveReservation) => void; // Add click handler prop
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
  onReservationClick, // Receive the click handler
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
                className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-background hover:bg-muted/50 transition-colors cursor-pointer" // Add cursor-pointer
                onClick={() => onReservationClick?.(res)} // Add onClick handler
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{res.room_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatDisplayDateTime(new Date(res.start_time))} -{" "}
                      {formatDisplayDateTime(new Date(res.end_time))}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{res.user_name}</span>
                  </div>
                  {res.title && (
                    <p className="text-sm italic pl-6">{res.title}</p> // Indent title slightly
                  )}
                </div>
                <Badge
                  variant={
                    res.status === "APPROVED"
                      ? "default" // Reverted 'success' to 'default' as 'success' variant is not available
                      : res.status === "PENDING"
                        ? "secondary"
                        : res.status === "REJECTED"
                          ? "destructive"
                          : "outline" // Fallback variant
                  }
                  className="self-start sm:self-center" // Adjust alignment
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

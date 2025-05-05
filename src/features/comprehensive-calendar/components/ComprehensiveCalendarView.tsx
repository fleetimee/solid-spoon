"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ComprehensiveReservation } from "../api/getComprehensiveReservations";
// Import the actual components
import { CalendarControls } from "./CalendarControls";
import { CalendarDisplay } from "./CalendarDisplay";
// import { Skeleton } from "@/components/ui/skeleton'; // No longer needed for main placeholders

// TODO: Define or import ReservationStatus type correctly if needed client-side
type ReservationStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

interface ComprehensiveCalendarViewProps {
  reservationsPromise: Promise<ComprehensiveReservation[]>;
  initialStartDate: string; // ISO string
  initialEndDate: string; // ISO string
  initialRoomIds?: string[];
  initialStatuses?: ReservationStatus[];
}

// Helper to format date for URL (YYYY-MM-DD)
const formatDateForUrl = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export function ComprehensiveCalendarView({
  reservationsPromise,
  initialStartDate,
  initialEndDate,
  initialRoomIds = [],
  initialStatuses = [],
}: ComprehensiveCalendarViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams(); // To read current URL state if needed, though props are primary source

  // Resolve the promise passed from the Server Component
  // Note: `use` hook suspends rendering until the promise resolves.
  // The parent <Suspense> boundary in page.tsx handles the loading state.
  const reservations = use(reservationsPromise);

  // Client-side state, initialized from props (which come from URL initially)
  // Use Date objects for manipulation, format for URL updates
  const [currentStartDate, setCurrentStartDate] = useState(
    () => new Date(initialStartDate)
  );
  const [currentEndDate, setCurrentEndDate] = useState(
    () => new Date(initialEndDate)
  );
  const [selectedRoomIds, setSelectedRoomIds] =
    useState<string[]>(initialRoomIds);
  const [selectedStatuses, setSelectedStatuses] =
    useState<ReservationStatus[]>(initialStatuses);

  // Effect to update URL when client-side state changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("startDate", formatDateForUrl(currentStartDate));
    params.set("endDate", formatDateForUrl(currentEndDate));
    if (selectedRoomIds.length > 0) {
      params.set("roomIds", selectedRoomIds.join(","));
    }
    if (selectedStatuses.length > 0) {
      params.set("statuses", selectedStatuses.join(","));
    }

    // Use replace to avoid polluting browser history for filter/date changes
    // Debounce this if updates happen very frequently (e.g., dragging a date range)
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [
    currentStartDate,
    currentEndDate,
    selectedRoomIds,
    selectedStatuses,
    router,
  ]);

  // --- Handler functions to update state ---
  const handleDateChange = (newStartDate: Date, newEndDate: Date) => {
    setCurrentStartDate(newStartDate);
    setCurrentEndDate(newEndDate);
  };

  const handleRoomFilterChange = (newRoomIds: string[]) => {
    setSelectedRoomIds(newRoomIds);
  };

  const handleStatusFilterChange = (newStatuses: ReservationStatus[]) => {
    setSelectedStatuses(newStatuses);
  };

  // --- Render ---
  return (
    <div className="space-y-4">
      {/* Render CalendarControls */}
      <CalendarControls
        startDate={currentStartDate}
        endDate={currentEndDate}
        selectedRoomIds={selectedRoomIds}
        selectedStatuses={selectedStatuses}
        onDateChange={handleDateChange}
        onRoomFilterChange={handleRoomFilterChange}
        onStatusFilterChange={handleStatusFilterChange}
        // TODO: Pass available rooms/statuses if needed for dropdowns
      />

      {/* Render CalendarDisplay */}
      <CalendarDisplay
        reservations={reservations}
        startDate={currentStartDate}
        endDate={currentEndDate}
        // TODO: Add handlers for clicking/hovering events if needed
      />
    </div>
  );
}

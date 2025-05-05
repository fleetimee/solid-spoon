"use client";

import React, { useState, useEffect, use } from "react"; // useState is already imported
import { useRouter, useSearchParams } from "next/navigation";
import { ComprehensiveReservation } from "../api/getComprehensiveReservations";
// Import the actual components
import { CalendarControls } from "./CalendarControls";
import { CalendarDisplay } from "./CalendarDisplay";
import { ReservationDetailsDialog } from "./ReservationDetailsDialog"; // Import the dialog
// import { Skeleton } from "@/components/ui/skeleton'; // No longer needed for main placeholders

// TODO: Define or import ReservationStatus type correctly if needed client-side
type ReservationStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

// Define LookupOption type if not imported
interface LookupOption {
  code: string;
  value: string;
}

interface ComprehensiveCalendarViewProps {
  // reservationsPromise: Promise<ComprehensiveReservation[]>; // Removed, pass resolved data
  initialReservations: ComprehensiveReservation[]; // Added
  initialStartDate: string; // ISO string
  initialEndDate: string; // ISO string
  initialRoomIds?: string[];
  initialStatuses?: ReservationStatus[];
  // availableRooms: { id: number; name: string }[]; // Renamed
  initialRooms: { id: number; name: string }[]; // Renamed for consistency
  statusOptions: LookupOption[]; // Added status options prop
}

// Helper to format date for URL (YYYY-MM-DD)
const formatDateForUrl = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export function ComprehensiveCalendarView({
  // reservationsPromise, // Removed
  initialReservations, // Added
  initialStartDate,
  initialEndDate,
  initialRoomIds = [],
  initialStatuses = [],
  // availableRooms, // Renamed
  initialRooms, // Renamed
  statusOptions, // Added
}: ComprehensiveCalendarViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams(); // To read current URL state if needed, though props are primary source

  // Use the resolved reservations directly from props
  // const reservations = use(reservationsPromise); // Removed
  const reservations = initialReservations; // Use prop directly

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

  // State for the selected reservation
  const [selectedReservation, setSelectedReservation] =
    useState<ComprehensiveReservation | null>(null);

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

  // Handler for clicking a reservation
  const handleReservationClick = (reservation: ComprehensiveReservation) => {
    setSelectedReservation(reservation);
    console.log("Selected Reservation:", reservation);
    // TODO: Implement opening a dialog/modal here
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
        availableRooms={initialRooms} // Pass down initialRooms
        statusOptions={statusOptions} // Pass down status options
      />

      {/* Render CalendarDisplay */}
      <CalendarDisplay
        reservations={reservations}
        startDate={currentStartDate}
        endDate={currentEndDate}
        onReservationClick={handleReservationClick} // Pass the handler
      />

      {/* Render the Reservation Details Dialog */}
      <ReservationDetailsDialog
        reservation={selectedReservation}
        open={!!selectedReservation} // Dialog is open if a reservation is selected
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedReservation(null); // Clear selection when dialog closes
          }
        }}
      />
    </div>
  );
}

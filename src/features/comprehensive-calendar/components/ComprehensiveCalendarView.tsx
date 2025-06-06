"use client";

import React, { useState, useEffect, use, useRef } from "react"; // useState is already imported
import { useRouter, useSearchParams } from "next/navigation";
import { ComprehensiveReservation } from "../api/getComprehensiveReservations";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
} from "date-fns";
// Import the actual components
import { CalendarControls } from "./CalendarControls";
import { CalendarDisplay } from "./CalendarDisplay";
import { ReservationDetailsDialog } from "./ReservationDetailsDialog"; // Import the dialog
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
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
  initialStatuses?: string[]; // Expect status codes (strings)
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
  const isMobile = useIsMobile();
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

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
    useState<string[]>(initialStatuses); // State holds status codes (strings)
  const [view, setView] = useState<"month" | "week">("month"); // Add view state

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

  const handleStatusFilterChange = (newStatuses: string[]) => {
    // Handler receives status codes (strings)
    setSelectedStatuses(newStatuses);
  };

  // Handler for view change
  const handleViewChange = (newView: "month" | "week") => {
    setView(newView);

    // Adjust date range based on view
    const currentDate = currentStartDate;

    if (newView === "week") {
      // Switch to week view: set start to Monday of current week
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      weekEnd.setHours(23, 59, 59, 999);

      setCurrentStartDate(weekStart);
      setCurrentEndDate(weekEnd);
    } else {
      // Switch to month view: set to full month
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      monthEnd.setHours(23, 59, 59, 999);

      setCurrentStartDate(monthStart);
      setCurrentEndDate(monthEnd);
    }
  };

  // Handler for clicking a reservation
  const handleReservationClick = (reservation: ComprehensiveReservation) => {
    setSelectedReservation(reservation);
    console.log("Selected Reservation:", reservation);
    // TODO: Implement opening a dialog/modal here
  };

  // Mobile swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile || !touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe right - go to previous period
        if (view === "month") {
          handlePrevMonth();
        } else {
          handlePrevWeek();
        }
      } else {
        // Swipe left - go to next period
        if (view === "month") {
          handleNextMonth();
        } else {
          handleNextWeek();
        }
      }
    }

    touchStartRef.current = null;
  };

  // Helper functions for navigation (extracted from CalendarControls logic)
  const handlePrevMonth = () => {
    const newStartDate = new Date(currentStartDate);
    newStartDate.setMonth(newStartDate.getMonth() - 1);
    newStartDate.setDate(1);

    const newEndDate = new Date(
      newStartDate.getFullYear(),
      newStartDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    handleDateChange(newStartDate, newEndDate);
  };

  const handleNextMonth = () => {
    const newStartDate = new Date(currentStartDate);
    newStartDate.setMonth(newStartDate.getMonth() + 1);
    newStartDate.setDate(1);

    const newEndDate = new Date(
      newStartDate.getFullYear(),
      newStartDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    handleDateChange(newStartDate, newEndDate);
  };

  const handlePrevWeek = () => {
    const newStartDate = new Date(currentStartDate);
    newStartDate.setDate(newStartDate.getDate() - 7);

    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newEndDate.getDate() + 6);
    newEndDate.setHours(23, 59, 59, 999);

    handleDateChange(newStartDate, newEndDate);
  };

  const handleNextWeek = () => {
    const newStartDate = new Date(currentStartDate);
    newStartDate.setDate(newStartDate.getDate() + 7);

    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newEndDate.getDate() + 6);
    newEndDate.setHours(23, 59, 59, 999);

    handleDateChange(newStartDate, newEndDate);
  };

  // --- Render ---
  return (
    <div
      ref={calendarRef}
      className={cn("h-full flex flex-col", isMobile && "touch-pan-y")}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Render CalendarControls - Fixed height */}
      <div className="shrink-0">
        <CalendarControls
          startDate={currentStartDate}
          endDate={currentEndDate}
          selectedRoomIds={selectedRoomIds}
          selectedStatuses={selectedStatuses}
          view={view}
          onDateChange={handleDateChange}
          onRoomFilterChange={handleRoomFilterChange}
          onStatusFilterChange={handleStatusFilterChange}
          onViewChange={handleViewChange}
          availableRooms={initialRooms}
          statusOptions={statusOptions}
        />
      </div>

      {/* Render CalendarDisplay - Flexible height */}
      <div className={cn("flex-1 overflow-hidden", isMobile && "relative")}>
        <CalendarDisplay
          reservations={reservations}
          startDate={currentStartDate}
          endDate={currentEndDate}
          view={view}
          onReservationClick={handleReservationClick}
        />
      </div>

      {/* Render the Reservation Details Dialog */}
      <ReservationDetailsDialog
        reservation={selectedReservation}
        open={!!selectedReservation}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedReservation(null);
          }
        }}
      />
    </div>
  );
}

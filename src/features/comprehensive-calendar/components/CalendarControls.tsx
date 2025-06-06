"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Assuming Select exists
// import { DatePicker } from '@/components/ui/date-picker'; // Assuming DatePicker exists
import { MultiSelect } from "@/components/ui/multi-select"; // Assuming MultiSelect exists
import { Skeleton } from "@/components/ui/skeleton"; // For placeholders
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Define LookupOption type if not imported
interface LookupOption {
  code: string;
  value: string;
}

// TODO: Define or import ReservationStatus type correctly
type ReservationStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

// Hardcoded statuses removed, will use props instead.
// const availableStatuses: ReservationStatus[] = [ ... ];

interface CalendarControlsProps {
  startDate: Date;
  endDate: Date;
  selectedRoomIds: string[];
  selectedStatuses: string[]; // Expect status codes (strings)
  view: "month" | "week";
  onDateChange: (newStartDate: Date, newEndDate: Date) => void; // Simplified for now
  onRoomFilterChange: (newRoomIds: string[]) => void;
  onStatusFilterChange: (newStatuses: string[]) => void; // Parent expects status codes (strings)
  onViewChange: (view: "month" | "week") => void;
  availableRooms: { id: number; name: string }[]; // Add available rooms prop
  statusOptions: LookupOption[]; // Add status options prop
}

export function CalendarControls({
  startDate,
  endDate,
  selectedRoomIds,
  selectedStatuses,
  view,
  onDateChange,
  onRoomFilterChange,
  onStatusFilterChange,
  onViewChange,
  availableRooms, // Receive the prop
  statusOptions, // Receive the prop
}: CalendarControlsProps) {
  const isMobile = useIsMobile();

  // Map statusOptions for the MultiSelect component
  const statusSelectOptions = statusOptions.map((option) => ({
    value: option.code, // Use the code (e.g., 'PENDING') as the value
    label: option.value, // Use the value (e.g., 'Pending') as the label
  }));

  // Basic date navigation (e.g., previous/next month)
  const handlePrevMonth = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setMonth(newStartDate.getMonth() - 1);
    newStartDate.setDate(1); // Start of month

    const newEndDate = new Date(
      newStartDate.getFullYear(),
      newStartDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    ); // End of month

    onDateChange(newStartDate, newEndDate);
  };

  const handleNextMonth = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setMonth(newStartDate.getMonth() + 1);
    newStartDate.setDate(1); // Start of month

    const newEndDate = new Date(
      newStartDate.getFullYear(),
      newStartDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    ); // End of month

    onDateChange(newStartDate, newEndDate);
  };

  // Week navigation functions
  const handlePrevWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() - 7);

    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newEndDate.getDate() + 6);
    newEndDate.setHours(23, 59, 59, 999);

    onDateChange(newStartDate, newEndDate);
  };

  const handleNextWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() + 7);

    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newEndDate.getDate() + 6);
    newEndDate.setHours(23, 59, 59, 999);

    onDateChange(newStartDate, newEndDate);
  };

  // TODO: Implement actual DatePicker integration
  const handleSpecificDateSelect = (date: Date | undefined) => {
    if (date) {
      if (view === "month") {
        const newStartDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const newEndDate = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );
        onDateChange(newStartDate, newEndDate);
      } else {
        // For week view, set to start of week containing the selected date
        const newStartDate = new Date(date);
        const dayOfWeek = newStartDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        newStartDate.setDate(newStartDate.getDate() - dayOfWeek + 1); // Set to Monday
        newStartDate.setHours(0, 0, 0, 0);

        const newEndDate = new Date(newStartDate);
        newEndDate.setDate(newEndDate.getDate() + 6); // Set to Sunday
        newEndDate.setHours(23, 59, 59, 999);

        onDateChange(newStartDate, newEndDate);
      }
    }
  };

  // TODO: Implement actual MultiSelect integration for rooms
  const handleRoomSelect = (values: string[]) => {
    onRoomFilterChange(values);
  };

  // TODO: Implement actual MultiSelect integration for statuses
  // Ensure the type matches what MultiSelect returns (likely string[])
  const handleStatusSelect = (values: string[]) => {
    // Pass the selected codes (string[]) directly to the parent
    onStatusFilterChange(values);
  };

  const formatDateRange = () => {
    if (view === "month") {
      return startDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
    } else {
      // For week view, show the date range
      const endOfWeek = new Date(startDate);
      endOfWeek.setDate(endOfWeek.getDate() + 6);

      if (startDate.getMonth() === endOfWeek.getMonth()) {
        return `${startDate.toLocaleString("default", { month: "long" })} ${startDate.getDate()}-${endOfWeek.getDate()}, ${startDate.getFullYear()}`;
      } else {
        return `${startDate.toLocaleString("default", { month: "short" })} ${startDate.getDate()} - ${endOfWeek.toLocaleString("default", { month: "short" })} ${endOfWeek.getDate()}, ${startDate.getFullYear()}`;
      }
    }
  };

  if (isMobile) {
    return (
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Mobile Layout - Stacked */}
        <div className="px-4 py-3">
          {/* Top Row - Date Navigation and View */}
          <div className="flex items-center justify-between mb-3">
            {/* Date Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={view === "month" ? handlePrevMonth : handlePrevWeek}
                className="h-8 w-8 p-0"
              >
                &lt;
              </Button>
              <h2 className="text-sm font-semibold text-center flex-1 min-w-0">
                {formatDateRange()}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={view === "month" ? handleNextMonth : handleNextWeek}
                className="h-8 w-8 p-0"
              >
                &gt;
              </Button>
            </div>

            {/* View Options */}
            <div className="flex items-center gap-1 border rounded-md p-0.5 ml-2">
              <Button
                variant={view === "month" ? "default" : "ghost"}
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => onViewChange("month")}
              >
                Month
              </Button>
              <Button
                variant={view === "week" ? "default" : "ghost"}
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => onViewChange("week")}
              >
                Week
              </Button>
            </div>
          </div>

          {/* Bottom Row - Filters */}
          <div className="space-y-2">
            {/* Room Filter */}
            <div className="flex items-center gap-2">
              <Label
                htmlFor="room-filter-mobile"
                className="text-xs font-medium min-w-0 shrink-0"
              >
                Rooms:
              </Label>
              <MultiSelect
                id="room-filter-mobile"
                options={availableRooms.map((room) => ({
                  value: room.id.toString(),
                  label: room.name,
                }))}
                value={selectedRoomIds}
                onValueChange={handleRoomSelect}
                placeholder="All rooms"
                className="flex-1 text-xs"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Label
                htmlFor="status-filter-mobile"
                className="text-xs font-medium min-w-0 shrink-0"
              >
                Status:
              </Label>
              <MultiSelect
                id="status-filter-mobile"
                options={statusSelectOptions}
                value={selectedStatuses}
                onValueChange={handleStatusSelect}
                placeholder="All statuses"
                className="flex-1 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left side - Date Navigation and View Options */}
      <div className="flex items-center gap-6">
        {/* Date Navigation */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={view === "month" ? handlePrevMonth : handlePrevWeek}
          >
            &lt;
          </Button>
          <h2 className="text-lg font-semibold min-w-[200px] text-center">
            {formatDateRange()}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={view === "month" ? handleNextMonth : handleNextWeek}
          >
            &gt;
          </Button>
        </div>

        {/* View Options - Google Calendar style */}
        <div className="flex items-center gap-1 border rounded-md p-1">
          <Button
            variant={view === "month" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => onViewChange("month")}
          >
            Month
          </Button>
          <Button
            variant={view === "week" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => onViewChange("week")}
          >
            Week
          </Button>
        </div>
      </div>

      {/* Right side - Filters */}
      <div className="flex items-center gap-4">
        {/* Room Filter */}
        <div className="flex items-center gap-2">
          <Label htmlFor="room-filter" className="text-sm font-medium">
            Rooms:
          </Label>
          <MultiSelect
            id="room-filter"
            options={availableRooms.map((room) => ({
              value: room.id.toString(),
              label: room.name,
            }))}
            value={selectedRoomIds}
            onValueChange={handleRoomSelect}
            placeholder="All rooms"
            className="w-64"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Label htmlFor="status-filter" className="text-sm font-medium">
            Status:
          </Label>
          <MultiSelect
            id="status-filter"
            options={statusSelectOptions}
            value={selectedStatuses}
            onValueChange={handleStatusSelect}
            placeholder="All statuses"
            className="w-48"
          />
        </div>
      </div>
    </div>
  );
}

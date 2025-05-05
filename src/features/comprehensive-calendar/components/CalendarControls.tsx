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

// TODO: Define or import ReservationStatus type correctly
type ReservationStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

// Hardcoded rooms removed, will use props instead.

const availableStatuses: ReservationStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
];

interface CalendarControlsProps {
  startDate: Date;
  endDate: Date;
  selectedRoomIds: string[];
  selectedStatuses: ReservationStatus[];
  onDateChange: (newStartDate: Date, newEndDate: Date) => void; // Simplified for now
  onRoomFilterChange: (newRoomIds: string[]) => void;
  onStatusFilterChange: (newStatuses: ReservationStatus[]) => void;
  availableRooms: { id: number; name: string }[]; // Add available rooms prop
}

export function CalendarControls({
  startDate,
  endDate,
  selectedRoomIds,
  selectedStatuses,
  onDateChange,
  onRoomFilterChange,
  onStatusFilterChange,
  availableRooms, // Receive the prop
}: CalendarControlsProps) {
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

  // TODO: Implement actual DatePicker integration
  const handleSpecificDateSelect = (date: Date | undefined) => {
    if (date) {
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
    }
  };

  // TODO: Implement actual MultiSelect integration for rooms
  const handleRoomSelect = (values: string[]) => {
    onRoomFilterChange(values);
  };

  // TODO: Implement actual MultiSelect integration for statuses
  // Ensure the type matches what MultiSelect returns (likely string[])
  const handleStatusSelect = (values: string[]) => {
    // Convert back to ReservationStatus[] if necessary, or adjust parent component
    onStatusFilterChange(values as ReservationStatus[]); // Cast for now, might need refinement
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 border rounded-md bg-card text-card-foreground">
      {/* Date Navigation */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handlePrevMonth}>
          &lt; {/* Use HTML entity for less-than */}
        </Button>
        <span className="font-medium min-w-[120px] text-center">
          {startDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <Button variant="outline" size="icon" onClick={handleNextMonth}>
          &gt; {/* Use HTML entity for greater-than */}
        </Button>
      </div>

      {/* Room Filter */}
      <div className="flex items-center gap-2">
        <Label htmlFor="room-filter">Filter Rooms:</Label>
        <MultiSelect
          id="room-filter"
          options={availableRooms.map((room) => ({
            value: room.id.toString(), // Convert number ID to string for value
            label: room.name,
          }))}
          value={selectedRoomIds}
          onValueChange={handleRoomSelect}
          placeholder="Select rooms..."
          className="w-[200px]"
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <Label htmlFor="status-filter">Filter Status:</Label>
        <MultiSelect
          id="status-filter"
          options={availableStatuses.map((status) => ({
            value: status,
            label: status,
          }))}
          value={selectedStatuses}
          onValueChange={handleStatusSelect}
          placeholder="Select statuses..."
          className="w-[200px]"
        />
      </div>
    </div>
  );
}

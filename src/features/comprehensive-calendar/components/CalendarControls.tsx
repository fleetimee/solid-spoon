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
// import { MultiSelect } from '@/components/ui/multi-select'; // Assuming MultiSelect exists
import { Skeleton } from "@/components/ui/skeleton"; // For placeholders

// TODO: Define or import ReservationStatus type correctly
type ReservationStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

// TODO: Fetch or pass down actual room data for filtering
const availableRooms = [
  { id: "room1", name: "Room Alpha" },
  { id: "room2", name: "Room Beta" },
  { id: "room3", name: "Room Gamma" },
];

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
  // Add props for available rooms/statuses if fetched dynamically
}

export function CalendarControls({
  startDate,
  endDate,
  selectedRoomIds,
  selectedStatuses,
  onDateChange,
  onRoomFilterChange,
  onStatusFilterChange,
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
  const handleStatusSelect = (values: ReservationStatus[]) => {
    onStatusFilterChange(values);
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

      {/* Date Picker Placeholder */}
      <div className="flex items-center gap-2">
        <Label htmlFor="date-picker">Select Month:</Label>
        {/* Replace with actual DatePicker */}
        <Skeleton className="h-9 w-[200px]" />
        {/* <DatePicker
          id="date-picker"
          value={startDate} // Or manage internal state if needed
          onChange={handleSpecificDateSelect}
        /> */}
      </div>

      {/* Room Filter Placeholder */}
      <div className="flex items-center gap-2">
        <Label htmlFor="room-filter">Filter Rooms:</Label>
        {/* Replace with actual MultiSelect */}
        <Skeleton className="h-9 w-[200px]" />
        {/* <MultiSelect
          id="room-filter"
          options={availableRooms.map(room => ({ value: room.id, label: room.name }))}
          selectedValues={selectedRoomIds}
          onChange={handleRoomSelect}
          placeholder="Select rooms..."
        /> */}
      </div>

      {/* Status Filter Placeholder */}
      <div className="flex items-center gap-2">
        <Label htmlFor="status-filter">Filter Status:</Label>
        {/* Replace with actual MultiSelect */}
        <Skeleton className="h-9 w-[200px]" />
        {/* <MultiSelect
          id="status-filter"
          options={availableStatuses.map(status => ({ value: status, label: status }))}
          selectedValues={selectedStatuses}
          onChange={handleStatusSelect}
          placeholder="Select statuses..."
        /> */}
      </div>
    </div>
  );
}

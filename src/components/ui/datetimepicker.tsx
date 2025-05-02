"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { type Matcher } from "react-day-picker"; // Import Matcher type

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DateTimePicker24hProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  disabled?: Matcher | Matcher[];
}

export function DateTimePicker24h({
  value: date, // Rename prop for clarity internally
  onChange,
  disabled,
}: DateTimePicker24hProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Ensure onChange is callable
  const handleDateChange = (newDate?: Date) => {
    if (onChange) {
      onChange(newDate);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      handleDateChange(undefined); // Clear date if undefined is selected
      return;
    }
    // Preserve time if a date already exists, otherwise default to 00:00
    const newDate = new Date(selectedDate);
    if (date) {
      newDate.setHours(date.getHours());
      newDate.setMinutes(date.getMinutes());
      newDate.setSeconds(date.getSeconds());
      newDate.setMilliseconds(date.getMilliseconds());
    } else {
      newDate.setHours(0); // Default to start of the day if no previous time
      newDate.setMinutes(0);
    }
    handleDateChange(newDate);
  };

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    const newDate = date ? new Date(date) : new Date(); // Use current date if none selected yet
    if (type === "hour") {
      newDate.setHours(parseInt(value));
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value));
    }
    // Ensure seconds/ms are zeroed out when time changes for consistency
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    handleDateChange(newDate);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i); // 0-23

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP HH:mm") // Use PPP for localized date, HH for 24h
          ) : (
            <span>Pick date & time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            disabled={disabled} // Pass the disabled prop here
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            {/* Hour Picker */}
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.map(
                  (
                    hour // Use map instead of reverse for 0-23 order
                  ) => (
                    <Button
                      key={hour}
                      size="icon"
                      variant={
                        date && date.getHours() === hour ? "default" : "ghost"
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange("hour", hour.toString())}
                      // Basic time disabling: disable hour if it's on the first disabled day and past the allowed time
                      // Note: This is a simplified check. More robust time disabling might be needed.
                      // Removed incorrect disabled prop usage here - Calendar handles date disabling
                    >
                      {hour.toString().padStart(2, "0")} {/* Pad hour */}
                    </Button>
                  )
                )}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            {/* Minute Picker */}
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      date && date.getMinutes() === minute ? "default" : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                    // Removed incorrect disabled prop usage here - Calendar handles date disabling
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

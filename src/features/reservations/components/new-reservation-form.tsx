"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Added
// Removed incorrect DateTimePicker import
import { z } from "zod";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "@radix-ui/react-icons"; // Added
import { format } from "date-fns"; // Added
import { cn } from "@/lib/utils"; // Added
import { Calendar } from "@/components/ui/calendar"; // Added
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Added
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner"; // Import toast for feedback

// Define Zod schema for form validation
const reservationFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    start_time: z.date({ required_error: "Start time is required." }), // Change to z.date
    end_time: z.date({ required_error: "End time is required." }), // Change to z.date
    roomId: z.number(), // Add roomId to the schema
  })
  .refine(
    (data) => {
      // Ensure end_time is after start_time if both are provided and valid dates
      if (data.start_time && data.end_time) {
        // Direct comparison works for Date objects
        return data.end_time > data.start_time;
      }
      return true; // Pass if one or both are missing (handled by required checks)
    },
    {
      message: "End time must be after start time",
      path: ["end_time"], // Attach error to end_time field
    }
  );

// Define the type for form values based on the schema
type ReservationFormValues = z.infer<typeof reservationFormSchema>;

interface NewReservationFormProps {
  roomId: number; // Accept roomId as a prop
}

// Define the ReservationForm component using react-hook-form
export function NewReservationForm({ roomId }: NewReservationFormProps) {
  // Define hours and minutes arrays for time selection
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, ..., 55

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      title: "",
      description: "",
      start_time: undefined, // Change default to undefined for DateTimePicker
      end_time: undefined, // Change default to undefined for DateTimePicker
      roomId: roomId, // Set default roomId from props
    },
  });

  // Watch the start_time field to disable dates in the end_time calendar
  const startTime = form.watch("start_time");

  async function onSubmit(values: ReservationFormValues) {
    // Handle form submission (e.g., API call)
    console.log("Reservation Submitted:", values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid items-start gap-4"
      >
        {/* Hidden input for roomId - not strictly necessary if passed in onSubmit */}
        <input type="hidden" {...form.register("roomId")} />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Reservation Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional description or notes"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP HH:mm") // Updated format
                      ) : (
                        <span>Pick a date and time</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="sm:flex">
                    {" "}
                    {/* Added container */}
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(selectedDate) => {
                        // Updated onSelect logic
                        const currentHours = field.value?.getHours() ?? 0;
                        const currentMinutes = field.value?.getMinutes() ?? 0;
                        const newDate = selectedDate
                          ? new Date(selectedDate)
                          : undefined;
                        if (newDate) {
                          newDate.setHours(currentHours, currentMinutes);
                        }
                        field.onChange(newDate);
                      }}
                      initialFocus
                    />
                    {/* Added Time Selection UI */}
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                          {hours.map((hour) => (
                            <Button
                              key={`start_hour_${hour}`}
                              size="icon"
                              variant={
                                field.value && field.value.getHours() === hour
                                  ? "default"
                                  : "ghost"
                              }
                              className="sm:w-full shrink-0 aspect-square"
                              onClick={() => {
                                // Updated onClick logic
                                const currentDate = field.value || new Date();
                                const newDate = new Date(currentDate);
                                newDate.setHours(hour);
                                field.onChange(newDate);
                              }}
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>
                        <ScrollBar
                          orientation="horizontal"
                          className="sm:hidden"
                        />
                      </ScrollArea>
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                          {minutes.map((minute) => (
                            <Button
                              key={`start_minute_${minute}`}
                              size="icon"
                              variant={
                                field.value &&
                                field.value.getMinutes() === minute
                                  ? "default"
                                  : "ghost"
                              }
                              className="sm:w-full shrink-0 aspect-square"
                              onClick={() => {
                                // Updated onClick logic
                                const currentDate = field.value || new Date();
                                const newDate = new Date(currentDate);
                                newDate.setMinutes(minute);
                                field.onChange(newDate);
                              }}
                            >
                              {minute.toString().padStart(2, "0")}
                            </Button>
                          ))}
                        </div>
                        <ScrollBar
                          orientation="horizontal"
                          className="sm:hidden"
                        />
                      </ScrollArea>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="end_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP HH:mm") // Updated format
                      ) : (
                        <span>Pick a date and time</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="sm:flex">
                    {" "}
                    {/* Added container */}
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(selectedDate) => {
                        // Updated onSelect logic
                        const currentHours = field.value?.getHours() ?? 0;
                        const currentMinutes = field.value?.getMinutes() ?? 0;
                        const newDate = selectedDate
                          ? new Date(selectedDate)
                          : undefined;
                        if (newDate) {
                          newDate.setHours(currentHours, currentMinutes);
                        }
                        field.onChange(newDate);
                      }}
                      disabled={(date) => {
                        if (!startTime) return false; // Don't disable if start_time isn't set
                        // Compare date part only
                        const startOfDay = new Date(startTime);
                        startOfDay.setHours(0, 0, 0, 0);
                        return date < startOfDay;
                      }}
                      initialFocus
                    />
                    {/* Added Time Selection UI */}
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                          {hours.map((hour) => (
                            <Button
                              key={`end_hour_${hour}`}
                              size="icon"
                              variant={
                                field.value && field.value.getHours() === hour
                                  ? "default"
                                  : "ghost"
                              }
                              className="sm:w-full shrink-0 aspect-square"
                              onClick={() => {
                                // Updated onClick logic
                                const currentDate = field.value || new Date();
                                const newDate = new Date(currentDate);
                                newDate.setHours(hour);
                                field.onChange(newDate);
                              }}
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>
                        <ScrollBar
                          orientation="horizontal"
                          className="sm:hidden"
                        />
                      </ScrollArea>
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                          {minutes.map((minute) => (
                            <Button
                              key={`end_minute_${minute}`}
                              size="icon"
                              variant={
                                field.value &&
                                field.value.getMinutes() === minute
                                  ? "default"
                                  : "ghost"
                              }
                              className="sm:w-full shrink-0 aspect-square"
                              onClick={() => {
                                // Updated onClick logic
                                const currentDate = field.value || new Date();
                                const newDate = new Date(currentDate);
                                newDate.setMinutes(minute);
                                field.onChange(newDate);
                              }}
                            >
                              {minute.toString().padStart(2, "0")}
                            </Button>
                          ))}
                        </div>
                        <ScrollBar
                          orientation="horizontal"
                          className="sm:hidden"
                        />
                      </ScrollArea>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting..." : "Submit Reservation"}
        </Button>
      </form>
    </Form>
  );
}
